import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/60-instructor-debrief-replay-analytics-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/instructor-debrief.json'),'utf8'));
check('metadados F57+',/^F(57|[6-9][0-9])$/.test(metadata.phase)&&metadata.instructorDebriefSchema===1,JSON.stringify(metadata));
check('módulo F57 identificado',source.includes('@skyward-module 60-instructor-debrief-replay-analytics-center'));
check('API congelada',source.includes('window.SKYWARD_INSTRUCTOR_DEBRIEF=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo areas errors drills',catalog.reviewAreas?.length>=8&&catalog.errorTaxonomy?.length>=8&&catalog.trainingDrills?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(66).fill('m'),
    SKYWARD_SCENARIO_MISSION:{
      progress:()=>({score:88,grade:'A',activeMission:{templateId:'STORM_DIVERSION',name:'Desvio por Tempestade'},last:{missionScore:88,grade:'A',templateId:'STORM_DIVERSION',missionName:'Desvio por Tempestade',seed:123456}}),
      status:()=>({lastEvaluation:{missionScore:88,grade:'A',templateId:'STORM_DIVERSION',missionName:'Desvio por Tempestade',seed:123456}})
    },
    SKYWARD_CAMPAIGN_PROGRESSION:{progress:()=>({achievements:3,rank:'TOWER'})},
    SKYWARD_STABILITY_DIAGNOSTICS:{progress:()=>({safeModeCount:0,score:92,sessionHealth:92})},
    SKYWARD_ADAPTIVE_PACE:{progress:()=>({workload:42})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:86}})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.57.0-F57-20260624-1945',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_INSTRUCTOR_DEBRIEF;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  check('avaliação gera debrief',Number.isFinite(eval1.evaluation.debriefScore)&&eval1.evaluation.status,JSON.stringify(eval1.evaluation));
  check('treino recomendado existe',!!eval1.evaluation.recommendedDrill,JSON.stringify(eval1.evaluation));
  const eval2=api.evaluate(1800,{conflicts:2,denied:3,runwayIncursions:1},true,'SBGR');
  check('falhas detectadas',eval2.evaluation.errors>=1&&eval2.state.weaknesses.length>=1,JSON.stringify(eval2.evaluation));
  const progress=api.progress();
  check('progress contém debrief',Number.isFinite(progress.score)&&progress.status&&progress.recommendedDrill,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.feedbackBands.length>=4,JSON.stringify(status.catalog.feedbackBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase57-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE57_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE57_UNIT_TESTS_SUMMARY.md'),`# Fase 57 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F57 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
