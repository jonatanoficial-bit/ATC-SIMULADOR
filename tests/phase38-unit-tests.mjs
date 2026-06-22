import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/41-workforce-staffing-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/workforce-staffing.json'),'utf8'));
check('metadados F38+',/^F(38|[4-9][0-9])$/.test(metadata.phase)&&metadata.workforceStaffingSchema===1,JSON.stringify(metadata));
check('módulo F38 identificado',source.includes('@skyward-module 41-workforce-staffing-center'));
check('API congelada',source.includes('window.SKYWARD_WORKFORCE_STAFFING=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo roles training hiring',catalog.roles?.length>=6&&catalog.trainingPrograms?.length>=5&&catalog.hiringPools?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(46).fill('m'),
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:90}})},
    SKYWARD_SAFETY_COMPLIANCE:{status:()=>({progress:{score:82}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{cash:360000}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.38.0-F38-20260622-1205',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_WORKFORCE_STAFFING;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const shift=api.shift('PEAK_OPS');
  check('escala aplicada',shift.id==='PEAK_OPS',JSON.stringify(shift));
  const training=api.training('SIM_REFRESHER','TOWER_CONTROLLER');
  check('treinamento registrado',training.programId==='SIM_REFRESHER'&&training.trained>=1,JSON.stringify(training));
  const hire=api.hire('CONTRACTOR','GROUND_CONTROLLER');
  check('contratação registrada',hire.source==='CONTRACTOR'&&hire.status==='ACTIVE',JSON.stringify(hire));
  const eval1=api.evaluate(2600,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('workforce avaliado',Number.isFinite(eval1.evaluation.readinessScore)&&eval1.evaluation.coverage.active>=1,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém workforce',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.avgFatigue),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.readinessBands.length>=4,JSON.stringify(status.catalog.readinessBands));
  check('funções essenciais presentes',api.catalog.roles.some(r=>r.id==='TOWER_CONTROLLER')&&api.catalog.roles.some(r=>r.id==='APPROACH_CONTROLLER'),JSON.stringify(api.catalog.roles));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase38-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE38_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE38_UNIT_TESTS_SUMMARY.md'),`# Fase 38 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F38 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
