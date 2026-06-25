import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/65-sector-handoff-coordination-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/sector-handoff-coordination.json'),'utf8'));
check('metadados F62+',/^F(62|[7-9][0-9])$/.test(metadata.phase)&&metadata.sectorHandoffSchema===1,JSON.stringify(metadata));
check('módulo F62 identificado',source.includes('@skyward-module 65-sector-handoff-coordination-center'));
check('API congelada',source.includes('window.SKYWARD_SECTOR_HANDOFF=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo sectors handoffs rules',catalog.controlSectors?.length>=7&&catalog.handoffTypes?.length>=7&&catalog.coordinationRules?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(71).fill('m'),
    SKYWARD_DYNAMIC_WEATHER:{progress:()=>({status:'ADVERSE',crosswindKt:20})},
    SKYWARD_ARRIVAL_DEPARTURE:{progress:()=>({status:'CONGESTED',holdingLoad:2,arrivals:5,departures:4})},
    SKYWARD_WORLD_AIRPORTS:{progress:()=>({activeAirport:'KJFK'})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:86}})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.62.0-F62-20260624-2330',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_SECTOR_HANDOFF;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const hof=api.handoff('APPROACH_TO_TOWER',true,'teste');
  check('handoff cria transferência',hof.type==='APPROACH_TO_TOWER'&&hof.accepted===true,JSON.stringify(hof));
  const refreshed=api.refresh('AUTO');
  check('refresh gera setor',refreshed.primarySector&&refreshed.sectorLoad>=0,JSON.stringify(refreshed));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'KJFK');
  check('avaliação gera handoff score',Number.isFinite(eval1.evaluation.handoffScore)&&eval1.evaluation.primarySector,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém setor',Number.isFinite(progress.score)&&progress.primarySector&&progress.transferCount>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.handoffQualityBands.length>=4,JSON.stringify(status.catalog.handoffQualityBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase62-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE62_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE62_UNIT_TESTS_SUMMARY.md'),`# Fase 62 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F62 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
