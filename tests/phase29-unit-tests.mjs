import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/32-training-coach-debriefing.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/training-coach-debriefing.json'),'utf8'));
check('metadados F29+',/^F(29|[3-9][0-9])$/.test(metadata.phase)&&metadata.trainingCoachSchema===1,JSON.stringify(metadata));
check('módulo F29 identificado',source.includes('@skyward-module 32-training-coach-debriefing'));
check('API congelada',source.includes('window.SKYWARD_TRAINING_COACH=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo coach cards rules',catalog.coachDomains?.length>=7&&catalog.studyCards?.length>=7&&catalog.adaptiveRules?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(37).fill('m'),
    SKYWARD_TRAINING_ACADEMY:{status:()=>({progress:{activeMission:{id:'TWR_01',track:'BASIC_TOWER',targetScore:600}}})},
    SKYWARD_NETWORK_FLOW:{status:()=>({slotCompliance:.6})},
    SKYWARD_ECONOMY:{status:()=>({lastShift:{profit:-1000}})},
    SKYWARD_CAREER:{status:()=>({fatigue:75})},
    SKYWARD_WEATHER_OPS:{status:()=>({risk:80})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.29.0-F29-20260620-1815',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_TRAINING_COACH;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const bad=api.evaluate(300,{conflicts:1,runwayIncursions:1,denied:1},false,'SBSP');
  check('debrief ruim gera remediação',bad.debrief.score<75&&bad.studyPlan.some(c=>c.id==='HOLD_SHORT'),JSON.stringify(bad.debrief));
  const good=api.evaluate(1800,{conflicts:0,runwayIncursions:0,denied:0,landed:2,departed:2,commands:8},false,'SBSP');
  check('debrief bom gera score',good.debrief.score>=75,JSON.stringify(good.debrief));
  const progress=api.progress();
  check('progress contém coach score',Number.isFinite(progress.coachScore)&&progress.studyCards>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.coachBadges.length>=4,JSON.stringify(status.catalog.coachBadges));
  check('cards essenciais presentes',api.catalog.studyCards.some(c=>c.id==='SEPARATION')&&api.catalog.studyCards.some(c=>c.id==='MISSED_APPROACH'),JSON.stringify(api.catalog.studyCards));
  check('badges essenciais presentes',api.catalog.coachBadges.some(b=>b.id==='SAFE_HANDS')&&api.catalog.coachBadges.some(b=>b.id==='FLOW_PLANNER'),JSON.stringify(api.catalog.coachBadges));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase29-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE29_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE29_UNIT_TESTS_SUMMARY.md'),`# Fase 29 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F29 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
