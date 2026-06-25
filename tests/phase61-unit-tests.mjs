import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/64-arrival-departure-sequencer-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/arrival-departure-sequencer.json'),'utf8'));
check('metadados F61+',/^F(61|[7-9][0-9])$/.test(metadata.phase)&&metadata.arrivalDepartureSequencerSchema===1,JSON.stringify(metadata));
check('módulo F61 identificado',source.includes('@skyward-module 64-arrival-departure-sequencer-center'));
check('API congelada',source.includes('window.SKYWARD_ARRIVAL_DEPARTURE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo arrivals departures holding',catalog.arrivalFlows?.length>=6&&catalog.departureBanks?.length>=5&&catalog.holdingStacks?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(70).fill('m'),
    SKYWARD_DYNAMIC_WEATHER:{progress:()=>({status:'ADVERSE',visibilityKm:4,crosswindKt:20})},
    SKYWARD_WORLD_AIRPORTS:{progress:()=>({activeAirport:'KJFK',procedure:'PARALLEL_RUNWAY',score:84})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.61.0-F61-20260624-2245',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_ARRIVAL_DEPARTURE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const refreshed=api.refresh('AUTO');
  check('auto escolhe fluxo',refreshed.arrivalFlow&&refreshed.departureBank,JSON.stringify(refreshed));
  const policy=api.policy('SAFETY_FIRST');
  check('policy aplicada',policy.id==='SAFETY_FIRST',JSON.stringify(policy));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'KJFK');
  check('avaliação gera flow score',Number.isFinite(eval1.evaluation.flowScore)&&eval1.evaluation.arrivalFlow,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém flow',Number.isFinite(progress.score)&&progress.arrivals>=1&&progress.departures>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.flowBands.length>=4,JSON.stringify(status.catalog.flowBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase61-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE61_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE61_UNIT_TESTS_SUMMARY.md'),`# Fase 61 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F61 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
