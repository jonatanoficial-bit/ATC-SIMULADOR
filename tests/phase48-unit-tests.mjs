import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/51-cargo-logistics-operations-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/cargo-logistics.json'),'utf8'));
check('metadados F48+',/^F(48|[5-9][0-9])$/.test(metadata.phase)&&metadata.cargoLogisticsSchema===1,JSON.stringify(metadata));
check('módulo F48 identificado',source.includes('@skyward-module 51-cargo-logistics-operations-center'));
check('API congelada',source.includes('window.SKYWARD_CARGO_LOGISTICS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo processes disruptions programs',catalog.cargoProcesses?.length>=8&&catalog.logisticsDisruptions?.length>=7&&catalog.cargoPrograms?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(57).fill('m'),
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{score:84}})},
    SKYWARD_GROUND_TURNAROUND:{status:()=>({progress:{score:82}})},
    SKYWARD_ASSET_MAINTENANCE:{status:()=>({progress:{score:83}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:86}})},
    SKYWARD_MULTI_AIRPORT_NETWORK:{status:()=>({progress:{score:80}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:81}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.48.0-F48-20260623-1200',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_CARGO_LOGISTICS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('ULD_POOL');
  check('programa cargo criado',program.programId==='ULD_POOL'&&program.status==='ACTIVE',JSON.stringify(program));
  const shipment=api.shipment('PHARMA_COLD');
  check('shipment criado',shipment.shipmentId==='PHARMA_COLD'&&shipment.status==='ACCEPTED',JSON.stringify(shipment));
  const disruption=api.disruption('COLD_CHAIN_BREAK');
  check('disrupção cargo criada',disruption.disruptionId==='COLD_CHAIN_BREAK'&&disruption.status==='OPEN',JSON.stringify(disruption));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('cargo avaliado',Number.isFinite(eval1.evaluation.cargoScore)&&Number.isFinite(eval1.evaluation.freightRevenue),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém cargo',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.freightRevenue),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.cargoBands.length>=4,JSON.stringify(status.catalog.cargoBands));
  check('processos essenciais presentes',api.catalog.cargoProcesses.some(p=>p.id==='DANGEROUS_GOODS')&&api.catalog.cargoProcesses.some(p=>p.id==='PERISHABLE_COLD'),JSON.stringify(api.catalog.cargoProcesses));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase48-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE48_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE48_UNIT_TESTS_SUMMARY.md'),`# Fase 48 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F48 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
