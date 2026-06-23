import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/47-digital-twin-predictive-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/digital-twin-predictive.json'),'utf8'));
check('metadados F44+',/^F(44|[5-9][0-9])$/.test(metadata.phase)&&metadata.digitalTwinPredictiveSchema===1,JSON.stringify(metadata));
check('módulo F44 identificado',source.includes('@skyward-module 47-digital-twin-predictive-center'));
check('API congelada',source.includes('window.SKYWARD_DIGITAL_TWIN=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo signals models plays risks',catalog.twinSignals?.length>=8&&catalog.forecastModels?.length>=6&&catalog.recommendationPlays?.length>=7&&catalog.riskScenarios?.length>=8);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(52).fill('m'),
    SKYWARD_ASSET_MAINTENANCE:{status:()=>({progress:{score:86}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:84}})},
    SKYWARD_MULTI_AIRPORT_NETWORK:{status:()=>({progress:{score:82}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:80}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:83}})},
    SKYWARD_WEATHER_OPS:{status:()=>({progress:{score:81}})},
    SKYWARD_SURFACE_SAFETY:{status:()=>({progress:{score:82}})},
    SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:4})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.44.0-F44-20260623-0900',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_DIGITAL_TWIN;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const play=api.play('OPEN_BUFFER_SLOTS');
  check('play what-if criado',play.playId==='OPEN_BUFFER_SLOTS'&&play.status==='APPLIED',JSON.stringify(play));
  const risk=api.risk('CAPACITY_CRUNCH');
  check('risco preditivo criado',risk.riskId==='CAPACITY_CRUNCH'&&risk.status==='WATCH',JSON.stringify(risk));
  const forecast=api.forecast('BOTTLENECK_15');
  check('forecast criado',forecast.modelId==='BOTTLENECK_15'&&Number.isFinite(forecast.confidence),JSON.stringify(forecast));
  const eval1=api.evaluate(2800,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('digital twin avaliado',Number.isFinite(eval1.evaluation.twinScore)&&Number.isFinite(eval1.evaluation.confidence),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém digital twin',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.bottleneckScore),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.twinBands.length>=4,JSON.stringify(status.catalog.twinBands));
  check('sinais essenciais presentes',api.catalog.twinSignals.some(s=>s.id==='TRAFFIC_LOAD')&&api.catalog.twinSignals.some(s=>s.id==='ASSET_RELIABILITY'),JSON.stringify(api.catalog.twinSignals));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase44-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE44_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE44_UNIT_TESTS_SUMMARY.md'),`# Fase 44 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F44 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
