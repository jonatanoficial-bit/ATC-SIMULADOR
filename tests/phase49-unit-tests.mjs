import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/52-terminal-flow-landside-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/terminal-flow.json'),'utf8'));
check('metadados F49+',/^F(49|[5-9][0-9])$/.test(metadata.phase)&&metadata.terminalFlowSchema===1,JSON.stringify(metadata));
check('módulo F49 identificado',source.includes('@skyward-module 52-terminal-flow-landside-center'));
check('API congelada',source.includes('window.SKYWARD_TERMINAL_FLOW=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo zones incidents programs',catalog.terminalZones?.length>=9&&catalog.queueIncidents?.length>=8&&catalog.flowPrograms?.length>=8);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(58).fill('m'),
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:84}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:86}})},
    SKYWARD_GROUND_TURNAROUND:{status:()=>({progress:{score:82}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:81}})},
    SKYWARD_CARGO_LOGISTICS:{status:()=>({progress:{score:80}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{score:83}})},
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:82}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.49.0-F49-20260623-1245',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_TERMINAL_FLOW;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('OPEN_SECURITY_LANES');
  check('programa terminal criado',program.programId==='OPEN_SECURITY_LANES'&&program.status==='ACTIVE',JSON.stringify(program));
  const incident=api.incident('SECURITY_BACKLOG');
  check('incidente terminal criado',incident.incidentId==='SECURITY_BACKLOG'&&incident.status==='OPEN',JSON.stringify(incident));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('terminal avaliado',Number.isFinite(eval1.evaluation.terminalScore)&&Number.isFinite(eval1.evaluation.avgQueueMin),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém terminal',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.avgQueueMin),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.flowBands.length>=4,JSON.stringify(status.catalog.flowBands));
  check('zonas essenciais presentes',api.catalog.terminalZones.some(z=>z.id==='SECURITY_QUEUE')&&api.catalog.terminalZones.some(z=>z.id==='BAGGAGE_CLAIM'),JSON.stringify(api.catalog.terminalZones));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase49-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE49_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE49_UNIT_TESTS_SUMMARY.md'),`# Fase 49 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F49 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
