import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/37-safety-compliance-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/safety-compliance-center.json'),'utf8'));
check('metadados F34+',/^F(34|[4-9][0-9])$/.test(metadata.phase)&&metadata.safetyComplianceSchema===1,JSON.stringify(metadata));
check('módulo F34 identificado',source.includes('@skyward-module 37-safety-compliance-center'));
check('API congelada',source.includes('window.SKYWARD_SAFETY_COMPLIANCE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo domains severity root cap',catalog.auditDomains?.length>=7&&catalog.findingSeverity?.length>=4&&catalog.rootCauses?.length>=5&&catalog.correctiveActions?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(42).fill('m'),
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:60}})},
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:62}})},
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:70}})},
    SKYWARD_TRAINING_COACH:{status:()=>({progress:{coachScore:55}})},
    SKYWARD_POST_PUBLISH_HEALTH:{status:()=>({healthScore:90})},
    SKYWARD_PUBLIC_OPS:{status:()=>({opsScore:88})},
    SKYWARD_CAREER:{status:()=>({fatigue:78})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.34.0-F34-20260620-2205',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_SAFETY_COMPLIANCE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const audit=api.audit(300,{conflicts:1,runwayIncursions:1,denied:3},false,'SBGR');
  check('auditoria gera achados',audit.evaluation.newFindings>=2&&audit.evaluation.openFindings>=2,JSON.stringify(audit.evaluation));
  const first=api.status().findings[0];
  check('achado tem causa e CAP',first.rootCause&&first.correctiveAction,JSON.stringify(first));
  const closed=api.close(first.id);
  check('fechamento de achado funciona',closed.status==='CLOSED',JSON.stringify(closed));
  const progress=api.progress();
  check('progress contém SMS',Number.isFinite(progress.score)&&progress.status,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.safetyCultureBands.length>=4,JSON.stringify(status.catalog.safetyCultureBands));
  check('domínios essenciais presentes',api.catalog.auditDomains.some(d=>d.id==='RUNWAY_SAFETY')&&api.catalog.auditDomains.some(d=>d.id==='CRISIS_RESPONSE'),JSON.stringify(api.catalog.auditDomains));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase34-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE34_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE34_UNIT_TESTS_SUMMARY.md'),`# Fase 34 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F34 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
