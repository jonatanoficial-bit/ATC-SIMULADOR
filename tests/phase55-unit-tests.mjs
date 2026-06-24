import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/58-scenario-mission-generator-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/scenario-mission-generator.json'),'utf8'));
check('metadados F55+',/^F(55|[6-9][0-9])$/.test(metadata.phase)&&metadata.scenarioMissionSchema===1,JSON.stringify(metadata));
check('módulo F55 identificado',source.includes('@skyward-module 58-scenario-mission-generator-center'));
check('API congelada',source.includes('window.SKYWARD_SCENARIO_MISSION=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo templates events objectives',catalog.missionTemplates?.length>=7&&catalog.eventTypes?.length>=8&&catalog.objectiveTypes?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(64).fill('m'),
    SKYWARD_LIVE_OPS_CONFIG:{setProfile:()=>true,progress:()=>({activeProfile:'SAFE_MOBILE'})},
    SKYWARD_STABILITY_DIAGNOSTICS:{progress:()=>({safeModeCount:0})},
    SKYWARD_ADAPTIVE_PACE:{progress:()=>({workload:42})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:88}})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.55.0-F55-20260624-1815',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_SCENARIO_MISSION;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1&&init.activeMission,JSON.stringify(init));
  const mission=api.start('STORM_DIVERSION');
  check('missão inicia',mission.templateId==='STORM_DIVERSION'&&mission.seed,JSON.stringify(mission));
  const ev=api.event('MEDICAL_PRIORITY',3);
  check('evento agenda',ev.type==='MEDICAL_PRIORITY'&&ev.status==='SCHEDULED',JSON.stringify(ev));
  const eval1=api.evaluate(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  check('avaliação válida',Number.isFinite(eval1.evaluation.missionScore)&&eval1.evaluation.grade,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém missão',Number.isFinite(progress.score)&&progress.activeMission&&progress.objectivesTotal>=5,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.gradeBands.length>=5,JSON.stringify(status.catalog.gradeBands));
  check('nota boa sem falhas',eval1.evaluation.missionScore>=70,JSON.stringify(eval1.evaluation));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase55-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE55_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE55_UNIT_TESTS_SUMMARY.md'),`# Fase 55 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F55 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
