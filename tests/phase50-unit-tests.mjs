import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/53-non-aeronautical-revenue-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/non-aero-revenue.json'),'utf8'));
check('metadados F50+',/^F(50|[5-9][0-9])$/.test(metadata.phase)&&metadata.nonAeroRevenueSchema===1,JSON.stringify(metadata));
check('módulo F50 identificado',source.includes('@skyward-module 53-non-aeronautical-revenue-center'));
check('API congelada',source.includes('window.SKYWARD_NON_AERO_REVENUE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo channels incidents programs',catalog.commercialChannels?.length>=9&&catalog.commercialIncidents?.length>=9&&catalog.revenuePrograms?.length>=9);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(59).fill('m'),
    SKYWARD_TERMINAL_FLOW:{status:()=>({progress:{score:84,avgQueueMin:12,densityIndex:38}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:86}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{score:83}})},
    SKYWARD_DIGITAL_TWIN:{status:()=>({progress:{score:82}})},
    SKYWARD_ASSET_MAINTENANCE:{status:()=>({progress:{score:81}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:84}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.50.0-F50-20260623-1330',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_NON_AERO_REVENUE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('DUTY_FREE_BUNDLE');
  check('programa comercial criado',program.programId==='DUTY_FREE_BUNDLE'&&program.status==='ACTIVE',JSON.stringify(program));
  const incident=api.incident('FOOD_QUEUE_SPIKE');
  check('incidente comercial criado',incident.incidentId==='FOOD_QUEUE_SPIKE'&&incident.status==='OPEN',JSON.stringify(incident));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('non-aero avaliado',Number.isFinite(eval1.evaluation.commercialScore)&&Number.isFinite(eval1.evaluation.nonAeroRevenue),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém non-aero',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.spendPerPax),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.commercialBands.length>=4,JSON.stringify(status.catalog.commercialBands));
  check('canais essenciais presentes',api.catalog.commercialChannels.some(c=>c.id==='DUTY_FREE')&&api.catalog.commercialChannels.some(c=>c.id==='PARKING'),JSON.stringify(api.catalog.commercialChannels));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase50-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE50_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE50_UNIT_TESTS_SUMMARY.md'),`# Fase 50 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F50 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
