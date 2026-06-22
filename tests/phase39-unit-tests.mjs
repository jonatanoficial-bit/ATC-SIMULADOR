import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/42-passenger-reputation-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/passenger-reputation.json'),'utf8'));
check('metadados F39+',/^F(39|[4-9][0-9])$/.test(metadata.phase)&&metadata.passengerReputationSchema===1,JSON.stringify(metadata));
check('módulo F39 identificado',source.includes('@skyward-module 42-passenger-reputation-center'));
check('API congelada',source.includes('window.SKYWARD_PASSENGER_REPUTATION=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo metrics programs complaints',catalog.experienceMetrics?.length>=6&&catalog.servicePrograms?.length>=6&&catalog.complaintTypes?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(47).fill('m'),
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:86}})},
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:84}})},
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:92}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:82}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{margin:18}})},
    SKYWARD_ENVIRONMENT_SUSTAINABILITY:{status:()=>({progress:{score:88}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.39.0-F39-20260622-1240',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_PASSENGER_REPUTATION;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('ACCESSIBILITY_CREW');
  check('programa XP criado',program.programId==='ACCESSIBILITY_CREW'&&program.status==='ACTIVE',JSON.stringify(program));
  const complaint=api.complaint('LONG_QUEUE');
  check('reclamação criada',complaint.complaintId==='LONG_QUEUE'&&complaint.status==='OPEN',JSON.stringify(complaint));
  const eval1=api.evaluate(2600,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('reputação avaliada',Number.isFinite(eval1.evaluation.reputationScore)&&Number.isFinite(eval1.evaluation.metrics.NPS),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém reputação',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.nps),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.reputationBands.length>=4,JSON.stringify(status.catalog.reputationBands));
  check('métricas essenciais presentes',api.catalog.experienceMetrics.some(m=>m.id==='NPS')&&api.catalog.experienceMetrics.some(m=>m.id==='ACCESSIBILITY'),JSON.stringify(api.catalog.experienceMetrics));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase39-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE39_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE39_UNIT_TESTS_SUMMARY.md'),`# Fase 39 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F39 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
