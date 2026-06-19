import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/26-release-candidate-qa.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/release-candidate-qa.json'),'utf8'));
check('metadados F23+',/^F(23|[3-9][0-9])$/.test(metadata.phase)&&metadata.releaseCandidateSchema===1,JSON.stringify(metadata));
check('módulo F23 identificado',source.includes('@skyward-module 26-release-candidate-qa'));
check('API congelada',source.includes('window.SKYWARD_RELEASE_CANDIDATE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo gates tutorial publication',catalog.rcGates?.length>=10&&catalog.guidedTutorial?.length>=8&&catalog.publicationChecklist?.length>=6);
const storage=new Map();
const fakeStyle={values:{},setProperty(k,v){this.values[k]=String(v);}};
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[],SKYWARD_BUILD_INFO:{}, SKYWARD_COMMERCIAL_POLISH:{readiness:()=>({score:100})}, SKYWARD_CAREER:{status:()=>({fatigue:25}),safety:()=>90}, SKYWARD_ECONOMY:{status:()=>({lastShift:{profit:20000}})}, SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:10})}, SKYWARD_INCIDENTS:{state:()=>({summary:{failed:0}})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.23.0-F23-20260619-1310',
  airport:()=>({icao:'SBGR'}),
  document:{documentElement:{style:fakeStyle},body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_RELEASE_CANDIDATE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const initial=api.init();
  check('init gera estado',initial.schema===1,JSON.stringify(initial));
  const tutorial=api.tutorial();
  check('tutorial possui progresso',tutorial.total>=8&&tutorial.percent>=0,JSON.stringify(tutorial));
  api.mark('radar_viewed',true); api.mark('ground_safe',true); api.mark('tower_clear',true); api.mark('approach_stable',true); api.mark('weather_checked',true); api.mark('incident_managed',true); api.mark('result_reviewed',true);
  const tutorialAfter=api.tutorial();
  check('tutorial aceita métricas',tutorialAfter.done>=7,JSON.stringify(tutorialAfter));
  const balance=api.balance(2800,{conflicts:0,denied:1,incidentFailures:0},false);
  check('balance saudável aprovado',balance.score>=70,JSON.stringify(balance));
  const gates=api.gates();
  check('gates RC calculados',gates.score>=70&&gates.gates.length>=10,JSON.stringify(gates));
  const pub=api.publication();
  check('publication checklist disponível',pub.length>=6,JSON.stringify(pub));
  const result=api.evaluate(3200,{conflicts:0,denied:1,incidentFailures:0},false,'SBGR');
  check('evaluate gera entry RC',result.entry.rcScore>=70&&result.entry.airport==='SBGR',JSON.stringify(result.entry));
  const status=api.status();
  check('status contém tutorial/gates/publication',status.tutorial&&status.gates&&status.publication,JSON.stringify(status));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase23-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE23_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE23_UNIT_TESTS_SUMMARY.md'),`# Fase 23 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F23 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
