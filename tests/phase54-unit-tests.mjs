import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/57-live-ops-remote-config-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/live-ops-remote-config.json'),'utf8'));
check('metadados F54+',/^F(54|[6-9][0-9])$/.test(metadata.phase)&&metadata.liveOpsRemoteConfigSchema===1,JSON.stringify(metadata));
check('módulo F54 identificado',source.includes('@skyward-module 57-live-ops-remote-config-center'));
check('API congelada',source.includes('window.SKYWARD_LIVE_OPS_CONFIG=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo profiles flags switches',catalog.configProfiles?.length>=5&&catalog.featureFlags?.length>=9&&catalog.killSwitches?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(63).fill('m'),
    SKYWARD_STABILITY_DIAGNOSTICS:{progress:()=>({safeModeCount:1,status:'WATCH'})},
    SKYWARD_PWA_UPDATE_MANAGER:{progress:()=>({oldBundleRisk:0,status:'CURRENT'})},
    SKYWARD_ADAPTIVE_PACE:{progress:()=>({workload:44}),load:()=>({}),save:()=>true},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.54.0-F54-20260624-1730',
  innerWidth:390,
  innerHeight:844,
  screen:{width:390,height:844},
  navigator:{maxTouchPoints:2,userAgent:'unit-mobile'},
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; context.window.innerWidth=context.innerWidth; context.window.innerHeight=context.innerHeight; context.window.screen=context.screen; context.window.navigator=context.navigator; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_LIVE_OPS_CONFIG;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const safe=api.setProfile('SAFE_MOBILE');
  check('perfil seguro aplicado',safe.activeProfile==='SAFE_MOBILE'&&safe.overrides.maxAircraft<=3,JSON.stringify(safe.overrides));
  const flag=api.setFlag('EXPERIMENTAL_EVENTS',true);
  check('flag altera valor',flag===true,String(flag));
  const kill=api.killSwitch('DISABLE_EXPERIMENTAL_EVENTS',true);
  check('kill switch altera valor',kill===true,String(kill));
  const eval1=api.evaluate(2700,{landed:2,departed:2},false,'SBGR');
  check('avaliação válida',Number.isFinite(eval1.evaluation.configScore)&&eval1.evaluation.profile,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém live ops',Number.isFinite(progress.score)&&progress.activeProfile&&progress.maxAircraft<=4,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.configBands.length>=4,JSON.stringify(status.catalog.configBands));
  check('safe mode aplica guard',eval1.evaluation.profile==='LIVE_OPS_GUARD'||eval1.evaluation.profile==='SAFE_MOBILE',JSON.stringify(eval1.evaluation));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase54-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE54_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE54_UNIT_TESTS_SUMMARY.md'),`# Fase 54 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F54 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
