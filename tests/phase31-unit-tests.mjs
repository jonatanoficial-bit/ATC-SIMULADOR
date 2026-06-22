import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/34-airline-operations-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/airline-operations.json'),'utf8'));
check('metadados F31+',/^F(31|[4-9][0-9])$/.test(metadata.phase)&&metadata.airlineOpsSchema===1,JSON.stringify(metadata));
check('módulo F31 identificado',source.includes('@skyward-module 34-airline-operations-center'));
check('API congelada',source.includes('window.SKYWARD_AIRLINE_OPS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo airlines banks SLA',catalog.airlines?.length>=5&&catalog.routeBanks?.length>=4&&catalog.slaMetrics?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(39).fill('m'), SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:5,connectionsProtected:2})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.31.0-F31-20260620-1950',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_AIRLINE_OPS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const req=api.queue('REQ_CONNECTION_HOLD','LAT');
  check('pedido operacional criado',req.requestId==='REQ_CONNECTION_HOLD'&&req.airlineId==='LAT',JSON.stringify(req));
  const good=api.evaluate(2600,{conflicts:0,runwayIncursions:0,denied:0,commands:9},false,'SBGR');
  check('SLA saudável aprovado',good.evaluation.sla.weighted>=75&&good.evaluation.carriers.length>=2,JSON.stringify(good.evaluation));
  const bad=api.evaluate(300,{conflicts:2,runwayIncursions:1,denied:3,commands:1},false,'SBGR');
  check('SLA ruim cai',bad.evaluation.sla.weighted<good.evaluation.sla.weighted,JSON.stringify(bad.evaluation));
  const progress=api.progress();
  check('progress contém Airline Ops',progress.status&&Number.isFinite(progress.score),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.satisfactionBands.length>=4,JSON.stringify(status.catalog.satisfactionBands));
  check('companhias principais presentes',api.catalog.airlines.some(a=>a.id==='LAT')&&api.catalog.airlines.some(a=>a.id==='DAL'),JSON.stringify(api.catalog.airlines));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase31-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE31_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE31_UNIT_TESTS_SUMMARY.md'),`# Fase 31 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F31 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
