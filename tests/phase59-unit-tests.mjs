import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/62-world-airports-procedure-pack-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/world-airport-procedures.json'),'utf8'));
check('metadados F59+',/^F(59|[6-9][0-9])$/.test(metadata.phase)&&metadata.worldAirportProcedureSchema===1,JSON.stringify(metadata));
check('módulo F59 identificado',source.includes('@skyward-module 62-world-airports-procedure-pack-center'));
check('API congelada',source.includes('window.SKYWARD_WORLD_AIRPORTS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo airports procedures routes',catalog.airportPacks?.length>=8&&catalog.procedurePacks?.length>=7&&catalog.routeChallenges?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(68).fill('m'),
    SKYWARD_CAMPAIGN_PROGRESSION:{progress:()=>({xp:3800})},
    SKYWARD_REPLAY_TIMELINE:{progress:()=>({score:84})},
    SKYWARD_INSTRUCTOR_DEBRIEF:{progress:()=>({score:86})},
    SKYWARD_SCENARIO_MISSION:{progress:()=>({score:88})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.59.0-F59-20260624-2115',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_WORLD_AIRPORTS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const chosen=api.choose('KJFK');
  check('aeroporto desbloqueado por XP',chosen.ok===true&&chosen.airport.icao==='KJFK',JSON.stringify(chosen));
  const proc=api.procedure('PARALLEL_RUNWAY');
  check('procedimento aplicado',proc.id==='PARALLEL_RUNWAY',JSON.stringify(proc));
  const route=api.route('JFK_PARALLEL_PRESSURE');
  check('rota aplicada',route.id==='JFK_PARALLEL_PRESSURE',JSON.stringify(route));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'KJFK');
  check('avaliação gera airport score',Number.isFinite(eval1.evaluation.airportScore)&&eval1.evaluation.airport,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém aeroporto',Number.isFinite(progress.score)&&progress.activeAirport&&progress.unlocked>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.airportBands.length>=4,JSON.stringify(status.catalog.airportBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase59-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE59_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE59_UNIT_TESTS_SUMMARY.md'),`# Fase 59 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F59 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
