import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/40-revenue-management-commercial-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/revenue-management.json'),'utf8'));
check('metadados F37+',/^F(37|[4-9][0-9])$/.test(metadata.phase)&&metadata.revenueManagementSchema===1,JSON.stringify(metadata));
check('módulo F37 identificado',source.includes('@skyward-module 40-revenue-management-commercial-center'));
check('API congelada',source.includes('window.SKYWARD_REVENUE_MANAGEMENT=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo revenue costs deals',catalog.revenueStreams?.length>=6&&catalog.costCenters?.length>=5&&catalog.commercialDeals?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(45).fill('m'),
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:86}})},
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:82}})},
    SKYWARD_INFRASTRUCTURE_EXPANSION:{status:()=>({progress:{score:80,risk:10}})},
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:95}})},
    SKYWARD_ENVIRONMENT_SUSTAINABILITY:{status:()=>({progress:{score:88}})},
    SKYWARD_INTERNATIONAL_CAMPAIGN:{status:()=>({reputation:320,progress:{reputation:320}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.37.0-F37-20260622-1125',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_REVENUE_MANAGEMENT;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const price=api.price('PREMIUM_YIELD');
  check('alavanca preço aplicada',price.id==='PREMIUM_YIELD',JSON.stringify(price));
  const deal=api.deal('RETAIL_CONTRACT');
  check('contrato comercial criado',deal.dealId==='RETAIL_CONTRACT'&&deal.status==='ACTIVE',JSON.stringify(deal));
  const eval1=api.evaluate(2800,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('relatório financeiro calculado',Number.isFinite(eval1.evaluation.totalRevenue)&&Number.isFinite(eval1.evaluation.ebitda)&&Number.isFinite(eval1.evaluation.margin),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém finanças',Number.isFinite(progress.cash)&&progress.status&&Number.isFinite(progress.margin),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.financialBands.length>=4,JSON.stringify(status.catalog.financialBands));
  check('fontes essenciais presentes',api.catalog.revenueStreams.some(s=>s.id==='LANDING_FEES')&&api.catalog.revenueStreams.some(s=>s.id==='RETAIL_DUTYFREE'),JSON.stringify(api.catalog.revenueStreams));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase37-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE37_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE37_UNIT_TESTS_SUMMARY.md'),`# Fase 37 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F37 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
