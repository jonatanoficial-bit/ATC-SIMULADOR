import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/28-post-gold-master-publishing.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/post-gold-master-publishing.json'),'utf8'));
check('metadados F25+',/^F(25|[3-9][0-9])$/.test(metadata.phase)&&metadata.postGoldMasterSchema===1,JSON.stringify(metadata));
check('módulo F25 identificado',source.includes('@skyward-module 28-post-gold-master-publishing'));
check('API congelada',source.includes('window.SKYWARD_POST_GOLD_MASTER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo device screenshot publishing',catalog.realDeviceMatrix?.length>=5&&catalog.screenshotPlan?.length>=6&&catalog.publishingSteps?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(33).fill('m'),SKYWARD_BUILD_INFO:{}, SKYWARD_GOLD_MASTER:{status:()=>({gates:{score:96}})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.25.0-F25-20260619-1508',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_POST_GOLD_MASTER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  api.device('ANDROID_CHROME_LANDSCAPE',true,'ok');
  api.device('ANDROID_PWA_INSTALLED',true,'ok');
  api.device('IOS_SAFARI_LANDSCAPE',true,'ok');
  api.device('DESKTOP_CHROME',true,'ok');
  api.screenshot('MENU',true,'ok');
  api.screenshot('RADAR',true,'ok');
  api.screenshot('PROCEDURES',true,'ok');
  api.screenshot('INCIDENT',true,'ok');
  api.screenshot('RESULTS',true,'ok');
  api.screenshot('PWA',true,'ok');
  for(const step of api.catalog.publishingSteps) api.publish(step.id,true);
  const bug=api.bug('MINOR','Teste visual','sem bloqueio');
  check('bug minor registrado',bug.severity==='MINOR'&&bug.status==='OPEN',JSON.stringify(bug));
  const ready=api.readiness();
  check('readiness publicação alta',ready.score>=80&&ready.status!=='BLOCKED_BY_CRITICAL_BUG',JSON.stringify(ready));
  const commands=api.commands();
  check('comandos Git Bash corretos',commands.some(c=>c.includes('ATC 3 NOVO'))&&commands.some(c=>c.includes('git push')),JSON.stringify(commands));
  const status=api.status();
  check('status contém github pages',status.githubPages.repo.includes('ATC-SIMULADOR'),JSON.stringify(status.githubPages));
  check('matriz exige QA humano',api.catalog.manualQAStatus.requiresHumanDeviceQA===true && api.catalog.manualQAStatus.screenshotsPending===true,JSON.stringify(api.catalog.manualQAStatus));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase25-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE25_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE25_UNIT_TESTS_SUMMARY.md'),`# Fase 25 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F25 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
