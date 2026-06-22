import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/44-emergency-response-disaster-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/emergency-response-disaster.json'),'utf8'));
check('metadados F41+',/^F(41|[5-9][0-9])$/.test(metadata.phase)&&metadata.emergencyResponseSchema===1,JSON.stringify(metadata));
check('módulo F41 identificado',source.includes('@skyward-module 44-emergency-response-disaster-center'));
check('API congelada',source.includes('window.SKYWARD_EMERGENCY_RESPONSE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo units scenarios programs',catalog.emergencyUnits?.length>=6&&catalog.emergencyScenarios?.length>=6&&catalog.preparednessPrograms?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(49).fill('m'),
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:92}})},
    SKYWARD_SAFETY_COMPLIANCE:{status:()=>({progress:{score:84}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:82}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:80}})},
    SKYWARD_MULTI_AIRPORT_NETWORK:{status:()=>({progress:{score:86}})},
    SKYWARD_INFRASTRUCTURE_EXPANSION:{status:()=>({progress:{risk:10}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.41.0-F41-20260622-1410',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_EMERGENCY_RESPONSE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('ARFF_RECERT');
  check('programa ARFF criado',program.programId==='ARFF_RECERT'&&program.status==='ACTIVE',JSON.stringify(program));
  const incident=api.incident('MASS_CASUALTY');
  check('incidente criado',incident.scenarioId==='MASS_CASUALTY'&&incident.status==='OPEN',JSON.stringify(incident));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('emergência avaliada',Number.isFinite(eval1.evaluation.readinessScore)&&Number.isFinite(eval1.evaluation.responseTime),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém emergência',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.arffCoverage),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.readinessBands.length>=4,JSON.stringify(status.catalog.readinessBands));
  check('unidades essenciais presentes',api.catalog.emergencyUnits.some(u=>u.id==='ARFF_1')&&api.catalog.emergencyUnits.some(u=>u.id==='MEDICAL_TEAM'),JSON.stringify(api.catalog.emergencyUnits));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase41-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE41_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE41_UNIT_TESTS_SUMMARY.md'),`# Fase 41 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F41 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
