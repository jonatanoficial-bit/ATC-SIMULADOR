import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/55-stability-observatory-diagnostics-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/stability-diagnostics.json'),'utf8'));
check('metadados F52+',/^F(52|[6-9][0-9])$/.test(metadata.phase)&&metadata.stabilityDiagnosticsSchema===1,JSON.stringify(metadata));
check('módulo F52 identificado',source.includes('@skyward-module 55-stability-observatory-diagnostics-center'));
check('API congelada',source.includes('window.SKYWARD_STABILITY_DIAGNOSTICS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo signals failures actions',catalog.diagnosticSignals?.length>=8&&catalog.failureTypes?.length>=7&&catalog.recoveryActions?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Error,
  window:{
    SKYWARD_MODULES:new Array(61).fill('m'),
    SKYWARD_BUILD_INFO:{build:'SC-1.52.0-F52-20260624-1600'},
    SKYWARD_ADAPTIVE_PACE:{progress:()=>({score:82,workload:42})},
    addEventListener:()=>{},
    planes:[{id:'A1'},{id:'A2'}],
    pendingRequests:[{}]
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.52.0-F52-20260624-1600',
  innerWidth:390,
  innerHeight:844,
  navigator:{maxTouchPoints:2,userAgent:'unit-mobile',serviceWorker:{}},
  caches:{},
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; context.window.innerWidth=context.innerWidth; context.window.innerHeight=context.innerHeight; context.window.navigator=context.navigator; context.window.caches=context.caches; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_STABILITY_DIAGNOSTICS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const err=api.error(new Error('Assignment to constant variable'),'unit');
  check('erro classificado',err.type==='CONST_ASSIGNMENT'&&err.severity>=30,JSON.stringify(err));
  const safe=api.safeMode('unit-test');
  check('safe mode registrado',safe>=1,String(safe));
  const diag=api.diagnose('unit');
  check('diagnóstico válido',Number.isFinite(diag.stabilityScore)&&diag.status,JSON.stringify(diag));
  const progress=api.progress();
  check('progress contém estabilidade',Number.isFinite(progress.score)&&progress.runtimeErrors>=1&&progress.safeModeCount>=1,JSON.stringify(progress));
  const exported=api.export();
  check('export diagnóstico válido',exported.schema===1&&exported.build==='SC-1.52.0-F52-20260624-1600',JSON.stringify(exported).slice(0,300));
  const status=api.status();
  check('status contém catálogo',status.catalog.healthBands.length>=4,JSON.stringify(status.catalog.healthBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase52-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE52_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE52_UNIT_TESTS_SUMMARY.md'),`# Fase 52 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F52 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
