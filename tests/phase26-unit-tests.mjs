import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/29-post-publish-healthcheck.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/post-publish-healthcheck.json'),'utf8'));
check('metadados F26+',/^F(26|[3-9][0-9])$/.test(metadata.phase)&&metadata.postPublishHealthSchema===1,JSON.stringify(metadata));
check('módulo F26 identificado',source.includes('@skyward-module 29-post-publish-healthcheck'));
check('API congelada',source.includes('window.SKYWARD_POST_PUBLISH_HEALTH=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo health hotfix promotion',catalog.healthChecks?.length>=10&&catalog.hotfixDeck?.length>=5&&catalog.promotionRules?.length>=3);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  location:{protocol:'https:',href:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/'},
  navigator:{serviceWorker:{},standalone:false},
  window:{SKYWARD_MODULES:new Array(34).fill('m'),matchMedia:()=>({matches:false})},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.26.0-F26-20260619-1602',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_POST_PUBLISH_HEALTH;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  api.mark('MOBILE_LANDSCAPE',true,'ok');
  api.mark('SAVE_RESTORE',true,'ok');
  api.mark('SCREENSHOTS',true,'ok');
  const capture=api.capture({device:'Android',browser:'Chrome',url:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/',orientation:'landscape',pwaInstalled:true,offlineWorks:true,buildVisible:true,notes:'ok'});
  check('captura manual registrada',capture.device==='Android'&&capture.offlineWorks===true,JSON.stringify(capture));
  const hotfix=api.hotfix('HF_TOUCH_SCROLL','teste');
  check('hotfix aberto',hotfix.severity==='MAJOR'&&hotfix.status==='OPEN',JSON.stringify(hotfix));
  api.closeHotfix(hotfix.id);
  const ready=api.evaluate();
  check('health avaliado',ready.score>=60&&ready.status,JSON.stringify(ready));
  const advice=api.advice();
  check('advice retorna regra',Boolean(advice.rule)&&Boolean(advice.message),JSON.stringify(advice));
  const status=api.status();
  check('status contém catálogo',status.catalog.publicVerification.repo.includes('ATC-SIMULADOR'),JSON.stringify(status.catalog.publicVerification));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase26-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE26_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE26_UNIT_TESTS_SUMMARY.md'),`# Fase 26 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F26 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
