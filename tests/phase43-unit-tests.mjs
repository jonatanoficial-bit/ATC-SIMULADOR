import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/46-asset-maintenance-reliability-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/asset-maintenance-reliability.json'),'utf8'));
check('metadados F43+',/^F(43|[5-9][0-9])$/.test(metadata.phase)&&metadata.assetMaintenanceSchema===1,JSON.stringify(metadata));
check('módulo F43 identificado',source.includes('@skyward-module 46-asset-maintenance-reliability-center'));
check('API congelada',source.includes('window.SKYWARD_ASSET_MAINTENANCE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo assets failures programs',catalog.assetClasses?.length>=8&&catalog.failureModes?.length>=8&&catalog.maintenancePrograms?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(51).fill('m'),
    SKYWARD_INFRASTRUCTURE_EXPANSION:{status:()=>({progress:{risk:10}})},
    SKYWARD_EMERGENCY_RESPONSE:{status:()=>({progress:{score:84}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:86}})},
    SKYWARD_SAFETY_COMPLIANCE:{status:()=>({progress:{score:82}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{cash:360000}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.43.0-F43-20260622-1545',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_ASSET_MAINTENANCE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('RADAR_CALIBRATION');
  check('programa manutenção criado',program.programId==='RADAR_CALIBRATION'&&program.status==='DONE',JSON.stringify(program));
  const failure=api.failure('ILS_OUTAGE');
  check('falha criada',failure.failureId==='ILS_OUTAGE'&&failure.status==='OPEN',JSON.stringify(failure));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('manutenção avaliada',Number.isFinite(eval1.evaluation.reliabilityScore)&&Number.isFinite(eval1.evaluation.availability),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém manutenção',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.mttrMin),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.reliabilityBands.length>=4,JSON.stringify(status.catalog.reliabilityBands));
  check('ativos essenciais presentes',api.catalog.assetClasses.some(a=>a.id==='PRIMARY_RADAR')&&api.catalog.assetClasses.some(a=>a.id==='ILS_CAT'),JSON.stringify(api.catalog.assetClasses));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase43-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE43_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE43_UNIT_TESTS_SUMMARY.md'),`# Fase 43 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F43 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
