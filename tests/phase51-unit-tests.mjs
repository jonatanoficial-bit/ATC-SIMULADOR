import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/54-adaptive-pace-workload-director.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/adaptive-pace-workload.json'),'utf8'));
check('metadados F51+',/^F(51|[6-9][0-9])$/.test(metadata.phase)&&metadata.adaptivePaceSchema===1,JSON.stringify(metadata));
check('módulo F51 identificado',source.includes('@skyward-module 54-adaptive-pace-workload-director'));
check('API congelada',source.includes('window.SKYWARD_ADAPTIVE_PACE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo profiles policies bands',catalog.deviceProfiles?.length>=5&&catalog.pacePolicies?.length>=4&&catalog.workloadBands?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(60).fill('m'),
    planes:[{id:'A1'},{id:'A2'},{id:'A3'},{id:'A4'}],
    pendingRequests:[{},{}],
    SKYWARD_TERMINAL_FLOW:{status:()=>({progress:{score:84,avgQueueMin:12,densityIndex:38}})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:82}})},
    SKYWARD_AI_COPILOT:{status:()=>({progress:{score:80}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.51.0-F51-20260624-1515',
  innerWidth:390,
  innerHeight:844,
  screen:{width:390,height:844},
  navigator:{maxTouchPoints:2},
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; context.window.innerWidth=context.innerWidth; context.window.innerHeight=context.innerHeight; context.window.screen=context.screen; context.window.navigator=context.navigator; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_ADAPTIVE_PACE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const tuned=api.tune({activePlanes:4,pendingRequests:2,denied:1,conflicts:0,runwayIncursions:0},'unit');
  check('tuning gera ritmo',Number.isFinite(tuned.pace)&&tuned.pace>0&&tuned.spawnSpacingSec>=18,JSON.stringify(tuned));
  const progress=api.progress();
  check('progress contém workload',Number.isFinite(progress.workload)&&progress.maxAircraft>=2&&progress.spawnSpacingSec>=18,JSON.stringify(progress));
  check('limite mobile conservador',progress.maxAircraft<=4 && progress.paceMultiplier<=0.9,JSON.stringify(progress));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('avaliação final válida',Number.isFinite(eval1.evaluation.pace)&&eval1.evaluation.band,JSON.stringify(eval1.evaluation));
  const status=api.status();
  check('status contém catálogo',status.catalog.deviceProfiles.length>=5,JSON.stringify(status.catalog.deviceProfiles));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase51-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE51_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE51_UNIT_TESTS_SUMMARY.md'),`# Fase 51 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F51 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
