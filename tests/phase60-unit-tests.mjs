import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/63-dynamic-weather-atis-notam-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/dynamic-weather-atis-notam.json'),'utf8'));
check('metadados F60+',/^F(60|[7-9][0-9])$/.test(metadata.phase)&&metadata.dynamicWeatherAtisNotamSchema===1,JSON.stringify(metadata));
check('módulo F60 identificado',source.includes('@skyward-module 63-dynamic-weather-atis-notam-center'));
check('API congelada',source.includes('window.SKYWARD_DYNAMIC_WEATHER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo weather atis notams',catalog.weatherPhenomena?.length>=8&&catalog.atisTemplates?.length>=5&&catalog.notamTypes?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(69).fill('m'),
    SKYWARD_WORLD_AIRPORTS:{progress:()=>({activeAirport:'KJFK',procedure:'PARALLEL_RUNWAY',score:84}),procedure:(id)=>id},
    SKYWARD_REPLAY_TIMELINE:{progress:()=>({score:82})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.60.0-F60-20260624-2200',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_DYNAMIC_WEATHER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const storm=api.refresh('STORM_CELL');
  check('tempestade gera radar/notam',storm.radarCells.length>=1&&storm.activeNotams.length>=1,JSON.stringify(storm));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'KJFK');
  check('avaliação gera weather score',Number.isFinite(eval1.evaluation.weatherScore)&&eval1.evaluation.atis,JSON.stringify(eval1.evaluation));
  const cross=api.refresh('CROSSWIND_ALERT');
  const eval2=api.evaluate(2200,{conflicts:1,denied:2,runwayIncursions:0},false,'KJFK');
  check('vento cruzado detectado',eval2.evaluation.crosswindKt>0&&eval2.evaluation.impactCount>=1,JSON.stringify(eval2.evaluation));
  const progress=api.progress();
  check('progress contém weather',Number.isFinite(progress.score)&&progress.atis&&progress.visibilityKm,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.weatherBands.length>=4,JSON.stringify(status.catalog.weatherBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase60-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE60_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE60_UNIT_TESTS_SUMMARY.md'),`# Fase 60 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F60 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
