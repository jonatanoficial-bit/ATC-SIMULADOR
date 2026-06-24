import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/61-replay-timeline-heatmap-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/replay-timeline-heatmap.json'),'utf8'));
check('metadados F58+',/^F(58|[6-9][0-9])$/.test(metadata.phase)&&metadata.replayTimelineSchema===1,JSON.stringify(metadata));
check('módulo F58 identificado',source.includes('@skyward-module 61-replay-timeline-heatmap-center'));
check('API congelada',source.includes('window.SKYWARD_REPLAY_TIMELINE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo tracks bookmarks heatmap',catalog.timelineTracks?.length>=8&&catalog.bookmarkTypes?.length>=10&&catalog.heatmapZones?.length>=8);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,Boolean,
  window:{
    SKYWARD_MODULES:new Array(67).fill('m'),
    SKYWARD_SCENARIO_MISSION:{progress:()=>({score:88,grade:'A',activeMission:{templateId:'STORM_DIVERSION',name:'Desvio por Tempestade',weather:{id:'STORM'}},last:{missionScore:88,grade:'A',seed:123456}})},
    SKYWARD_CAMPAIGN_PROGRESSION:{progress:()=>({achievements:3,last:{xpGained:260}})},
    SKYWARD_STABILITY_DIAGNOSTICS:{progress:()=>({safeModeCount:0,score:94})},
    SKYWARD_INSTRUCTOR_DEBRIEF:{progress:()=>({score:86,status:'APPROVED',recommendedDrill:'Separação básica'}),status:()=>({lastDebrief:{missionScore:88}})},
    SKYWARD_ADAPTIVE_PACE:{progress:()=>({workload:42})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:86}})},
    addEventListener:()=>{}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.58.0-F58-20260624-2030',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_REPLAY_TIMELINE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const mark=api.bookmark('LOSS_SEPARATION',3,'teste');
  check('bookmark cria evento',mark.type==='LOSS_SEPARATION'&&mark.importance>=30,JSON.stringify(mark));
  const eval1=api.evaluate(3000,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  check('avaliação gera replay',Number.isFinite(eval1.evaluation.replayScore)&&eval1.evaluation.status,JSON.stringify(eval1.evaluation));
  const eval2=api.evaluate(1800,{conflicts:2,denied:3,runwayIncursions:1},true,'SBGR');
  check('heatmap detecta risco',eval2.evaluation.criticalMoments>=1&&eval2.evaluation.heatmapRisk>=0,JSON.stringify(eval2.evaluation));
  const exported=api.export('INSTRUCTOR_FULL');
  check('export completo válido',exported.schema===1&&Array.isArray(exported.timeline)&&exported.heatmap,JSON.stringify(exported).slice(0,300));
  const progress=api.progress();
  check('progress contém replay',Number.isFinite(progress.score)&&progress.bookmarks>=1&&progress.topZone,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.replayBands.length>=4,JSON.stringify(status.catalog.replayBands));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase58-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE58_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE58_UNIT_TESTS_SUMMARY.md'),`# Fase 58 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F58 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
