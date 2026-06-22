import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/43-multi-airport-network-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/multi-airport-network.json'),'utf8'));
check('metadados F40+',/^F(40|[5-9][0-9])$/.test(metadata.phase)&&metadata.multiAirportNetworkSchema===1,JSON.stringify(metadata));
check('módulo F40 identificado',source.includes('@skyward-module 43-multi-airport-network-center'));
check('API congelada',source.includes('window.SKYWARD_MULTI_AIRPORT_NETWORK=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo airports routeBanks policies',catalog.airports?.length>=6&&catalog.routeBanks?.length>=5&&catalog.networkPolicies?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(48).fill('m'),
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:86}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{score:82}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:84}})},
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:92}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:80}})},
    SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:4})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.40.0-F40-20260622-1320',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_MULTI_AIRPORT_NETWORK;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const policy=api.policy('PASSENGER_PROTECTION');
  check('política aplicada',policy.id==='PASSENGER_PROTECTION',JSON.stringify(policy));
  const disruption=api.disruption('CONNECTION_WAVE_LOST');
  check('interrupção criada',disruption.disruptionId==='CONNECTION_WAVE_LOST'&&disruption.status==='OPEN',JSON.stringify(disruption));
  const action=api.action('PROTECT_BANK');
  check('ação regional criada',action.actionId==='PROTECT_BANK',JSON.stringify(action));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('rede avaliada',Number.isFinite(eval1.evaluation.networkScore)&&Number.isFinite(eval1.evaluation.regionalRevenue),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém rede',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.hubScore),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.networkBands.length>=4,JSON.stringify(status.catalog.networkBands));
  check('aeroportos essenciais presentes',api.catalog.airports.some(a=>a.icao==='SBGR')&&api.catalog.airports.some(a=>a.icao==='SBKP'),JSON.stringify(api.catalog.airports));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase40-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE40_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE40_UNIT_TESTS_SUMMARY.md'),`# Fase 40 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F40 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
