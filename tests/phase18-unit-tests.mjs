import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/21-operational-economy.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/economy-contracts.json'),'utf8'));
check('metadados F18+',/^F(1[8-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.economySchema===1,JSON.stringify(metadata));
check('módulo F18 identificado',source.includes('@skyward-module 21-operational-economy'));
check('API congelada',source.includes('window.SKYWARD_ECONOMY=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo orçamentos e contratos',Object.keys(catalog.airportBudgets||{}).length>=5&&catalog.airlineContracts?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[], SKYWARD_WEATHER_OPS:{state:()=>({flightRules:'IFR',rvrMeters:1800})}, SKYWARD_CAREER:{safety:()=>92}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.18.0-F18-20260618-2002',
  airport:()=>({icao:'SBGR'}),
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_ECONOMY;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  check('budget SBGR válido',api.budget('SBGR').shiftBudget>100000,JSON.stringify(api.budget('SBGR')));
  const goodEff=api.efficiency({landed:8,departed:6,requests:14,commands:35,denied:0,conflicts:0});
  const badEff=api.efficiency({landed:1,departed:1,requests:4,commands:60,denied:8,conflicts:4,runwayIncursions:1});
  check('eficiência diferencia turno bom e ruim',goodEff>badEff,JSON.stringify({goodEff,badEff}));
  const delay=api.delay({requests:14,denied:2,conflicts:1,surfaceConflicts:1,runwayIncursions:0});
  check('delay operacional positivo',delay>0,String(delay));
  const contracts=api.contracts({landed:8,departed:6,requests:14},95,.92);
  check('contratos geram avaliação',contracts.length>=5&&contracts.some(c=>c.achieved),JSON.stringify(contracts));
  const result=api.evaluate(4200,{landed:8,departed:6,requests:15,commands:42,denied:0,conflicts:0,runwayIncursions:0,surfaceConflicts:0,damaged:0,maydayResolved:1,lowFuel:1},false,'SBGR');
  check('evaluate gera resultado econômico',Number.isFinite(result.shift.profit)&&result.shift.revenue>0,JSON.stringify(result.shift));
  check('histórico econômico registra turno',result.economy.history.length===1&&result.economy.lastShift.airport==='SBGR',JSON.stringify(result.economy.history));
  const bad=api.evaluate(200,{landed:1,departed:0,requests:5,commands:70,denied:7,conflicts:3,runwayIncursions:1,surfaceConflicts:2,damaged:1},true,'SBSP');
  check('turno ruim gera multas',bad.shift.fines>0&&bad.shift.costs>bad.shift.revenue,JSON.stringify(bad.shift));
  check('bandas econômicas funcionam',api.band(200000).id==='EXCELLENT');
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase18-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE18_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE18_UNIT_TESTS_SUMMARY.md'),`# Fase 18 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F18 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
