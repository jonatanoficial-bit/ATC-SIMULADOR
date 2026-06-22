import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/35-airport-authority-terminal-ops.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/airport-authority.json'),'utf8'));
check('metadados F32+',/^F(32|[4-9][0-9])$/.test(metadata.phase)&&metadata.airportAuthoritySchema===1,JSON.stringify(metadata));
check('módulo F32 identificado',source.includes('@skyward-module 35-airport-authority-terminal-ops'));
check('API congelada',source.includes('window.SKYWARD_AIRPORT_AUTHORITY=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo terminals gates flows',catalog.terminals?.length>=4&&catalog.gatePools?.length>=4&&catalog.passengerFlows?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(40).fill('m'), SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:88}})}, SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:4,connectionsProtected:2})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.32.0-F32-20260620-2035',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_AIRPORT_AUTHORITY;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const event=api.event('SECURITY_QUEUE');
  check('evento terminal criado',event.eventId==='SECURITY_QUEUE'&&event.status==='OPEN',JSON.stringify(event));
  const eval1=api.evaluate(2400,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  check('experiência calculada',Number.isFinite(eval1.evaluation.authorityScore)&&eval1.evaluation.openEvents>=1,JSON.stringify(eval1.evaluation));
  api.close(event.id,true);
  const eval2=api.evaluate(2500,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  check('evento fechado reduz pressão',eval2.evaluation.openEvents===0,JSON.stringify(eval2.evaluation));
  const progress=api.progress();
  check('progress contém terminal',progress.terminal.id&&progress.experience,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.authorityObjectives.length>=4,JSON.stringify(status.catalog.authorityObjectives));
  check('fluxos essenciais presentes',api.catalog.passengerFlows.some(f=>f.id==='BAGGAGE')&&api.catalog.passengerFlows.some(f=>f.id==='CONNECTIONS'),JSON.stringify(api.catalog.passengerFlows));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase32-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE32_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE32_UNIT_TESTS_SUMMARY.md'),`# Fase 32 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F32 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
