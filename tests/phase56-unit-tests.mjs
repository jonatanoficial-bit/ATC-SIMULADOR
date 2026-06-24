import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/59-campaign-progression-licenses-achievements-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/campaign-progression.json'),'utf8'));
check('metadados F56+',/^F(56|[6-9][0-9])$/.test(metadata.phase)&&metadata.campaignProgressionSchema===1,JSON.stringify(metadata));
check('módulo F56 identificado',source.includes('@skyward-module 59-campaign-progression-licenses-achievements-center'));
check('API congelada',source.includes('window.SKYWARD_CAMPAIGN_PROGRESSION=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo chapters ranks achievements',catalog.campaignChapters?.length>=6&&catalog.controllerRanks?.length>=6&&catalog.achievements?.length>=8);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(65).fill('m'),
    SKYWARD_SCENARIO_MISSION:{
      progress:()=>({score:92,grade:'S',activeMission:{templateId:'STORM_DIVERSION'},last:{missionScore:92,grade:'S',templateId:'STORM_DIVERSION'}}),
      status:()=>({activeMission:{difficulty:6},lastEvaluation:{missionScore:92,grade:'S',templateId:'STORM_DIVERSION'}})
    },
    SKYWARD_STABILITY_DIAGNOSTICS:{progress:()=>({safeModeCount:0})},
    SKYWARD_LIVE_OPS_CONFIG:{signals:()=>({mobile:true})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.56.0-F56-20260624-1900',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_CAMPAIGN_PROGRESSION;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  check('avaliação gera xp',eval1.evaluation.xpGained>0&&eval1.evaluation.xpTotal>0,JSON.stringify(eval1.evaluation));
  check('conquistas liberadas',eval1.state.achievements.length>=2,JSON.stringify(eval1.state.achievements));
  const progress=api.progress();
  check('progress contém carreira',Number.isFinite(progress.xp)&&progress.rank&&progress.missionsCompleted>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.controllerRanks.length>=6,JSON.stringify(status.catalog.controllerRanks));
  api.award('GRADE_S','unit');
  api.licenses();
  const after=api.status();
  check('licenças/ranks consistentes',Array.isArray(after.licenses)&&after.rank,JSON.stringify({rank:after.rank,licenses:after.licenses}));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase56-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE56_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE56_UNIT_TESTS_SUMMARY.md'),`# Fase 56 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F56 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
