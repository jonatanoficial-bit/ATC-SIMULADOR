import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/30-public-ops-feedback.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/public-ops-feedback.json'),'utf8'));
check('metadados F27+',/^F(27|[3-9][0-9])$/.test(metadata.phase)&&metadata.publicOpsSchema===1,JSON.stringify(metadata));
check('módulo F27 identificado',source.includes('@skyward-module 30-public-ops-feedback'));
check('API congelada',source.includes('window.SKYWARD_PUBLIC_OPS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo feedback telemetria hotfix',catalog.feedbackCategories?.length>=6&&catalog.telemetryCounters?.length>=6&&catalog.hotfixTemplates?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(35).fill('m')},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.27.0-F27-20260619-1704',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_PUBLIC_OPS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera sessão',init.counters.sessions>=1,JSON.stringify(init.counters));
  api.startTurn(); api.completeTurn();
  const fb=api.feedback('MOBILE_UX',4,'Rolagem boa no mobile');
  check('feedback registrado',fb.category==='MOBILE_UX'&&fb.rating===4,JSON.stringify(fb));
  const bug=api.bug('CRITICAL','PWA cache antigo','abre versão antiga offline');
  check('bug crítico registrado',bug.severity==='CRITICAL'&&bug.status==='OPEN',JSON.stringify(bug));
  const plan=api.hotfixPlan();
  check('hotfix plan gerado',plan.length>=1&&plan.some(p=>p.templateId==='PWA_CACHE_PATCH'),JSON.stringify(plan));
  const summary=api.evaluate();
  check('summary detecta hotfix required',summary.status==='HOTFIX_REQUIRED'&&summary.criticalOpen>=1,JSON.stringify(summary));
  api.closeBug(bug.id);
  const stable=api.evaluate();
  check('bug fechado melhora status',stable.criticalOpen===0,JSON.stringify(stable));
  const dossier=api.export();
  check('dossiê exportável',dossier.includes('feedback')&&dossier.includes('hotfixPlan'),dossier.slice(0,120));
  const status=api.status();
  check('status contém catálogo',status.catalog.publicOpsTargets.maxCriticalOpen===0,JSON.stringify(status.catalog.publicOpsTargets));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase27-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE27_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE27_UNIT_TESTS_SUMMARY.md'),`# Fase 27 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F27 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
