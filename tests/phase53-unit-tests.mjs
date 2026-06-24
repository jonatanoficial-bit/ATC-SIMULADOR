import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/56-pwa-update-cache-migration-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/pwa-update-manager.json'),'utf8'));
check('metadados F53+',/^F(53|[6-9][0-9])$/.test(metadata.phase)&&metadata.pwaUpdateManagerSchema===1,JSON.stringify(metadata));
check('módulo F53 identificado',source.includes('@skyward-module 56-pwa-update-cache-migration-center'));
check('API congelada',source.includes('window.SKYWARD_PWA_UPDATE_MANAGER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo signals risks actions',catalog.updateSignals?.length>=8&&catalog.cacheRisks?.length>=6&&catalog.updateActions?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Error,Boolean,
  window:{
    SKYWARD_MODULES:new Array(62).fill('m'),
    SKYWARD_BUILD_INFO:{build:'SC-1.53.0-F53-20260624-1645'},
    SKYWARD_STABILITY_DIAGNOSTICS:{diagnose:()=>({ok:true}),error:()=>({ok:true})},
    matchMedia:()=>({matches:true}),
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.53.0-F53-20260624-1645',
  innerWidth:390,
  innerHeight:844,
  navigator:{maxTouchPoints:2,userAgent:'unit-mobile',serviceWorker:{controller:{},getRegistrations:async()=>[{update:async()=>true}]}},
  caches:{keys:async()=>['skyward-control-old-build','skyward-control-1-sc-1-53-0-f53'],delete:async()=>true},
  location:{reload:()=>true},
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; context.window.innerWidth=context.innerWidth; context.window.innerHeight=context.innerHeight; context.window.navigator=context.navigator; context.window.caches=context.caches; context.window.location=context.location; context.window.matchMedia=context.window.matchMedia; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_PWA_UPDATE_MANAGER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const status=api.status();
  check('status contém catálogo',status.catalog.updateBands.length>=4,JSON.stringify(status.catalog.updateBands));
  const progress=api.progress();
  check('progress contém update',Number.isFinite(progress.score)&&progress.status,JSON.stringify(progress));
  const eval1=api.evaluate(2700,{landed:2,departed:2},false,'SBGR');
  check('avaliação válida',Number.isFinite(eval1.evaluation.updateScore)&&eval1.evaluation.status,JSON.stringify(eval1.evaluation));
  const report=api.export();
  check('export relatório válido',report.schema===1&&report.build==='SC-1.53.0-F53-20260624-1645',JSON.stringify(report).slice(0,300));
  check('ações essenciais presentes',api.catalog.updateActions.some(a=>a.id==='CLEAR_AND_RELOAD')&&api.catalog.cacheRisks.some(r=>r.id==='OLD_MAIN_JS'),JSON.stringify(api.catalog.updateActions));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase53-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE53_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE53_UNIT_TESTS_SUMMARY.md'),`# Fase 53 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F53 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
