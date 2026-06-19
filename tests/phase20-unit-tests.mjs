import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/23-network-flow-coordination.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/network-flow-slots.json'),'utf8'));
check('metadados F20+',/^F(20|[2-9][0-9])$/.test(metadata.phase)&&metadata.networkFlowSchema===1,JSON.stringify(metadata));
check('módulo F20 identificado',source.includes('@skyward-module 23-network-flow-coordination'));
check('API congelada',source.includes('window.SKYWARD_NETWORK_FLOW=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo hubs rotas slots',Object.keys(catalog.hubs||{}).length>=5&&catalog.routes?.length>=6&&catalog.slotPolicies?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[], SKYWARD_WEATHER_OPS:{state:()=>({flightRules:'LIFR',rvrMeters:900})}, SKYWARD_INCIDENTS:{state:()=>({runwayClosed:true})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.20.0-F20-20260619-1040',
  airport:()=>({icao:'SBGR'}),
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_NETWORK_FLOW;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const route=api.route('SBGR',0);
  check('rota SBGR válida',route.id.includes('SBGR'),JSON.stringify(route));
  const policy=api.policy(route);
  check('política de slot válida',!!policy.id,JSON.stringify(policy));
  const compGood=api.compliance(0,policy);
  const compBad=api.compliance(60,policy);
  check('compliance cai com atraso',compGood>compBad,JSON.stringify({compGood,compBad}));
  const delay=api.delay({requests:18,denied:2,conflicts:1,runwayIncursions:0},route);
  check('delay de rede positivo',delay>0,String(delay));
  const banks=api.banks('SBGR',{landed:8,departed:8,requests:18},.95);
  check('bancos protegem conexões',banks.some(b=>b.achieved),JSON.stringify(banks));
  const alternates=api.alternates('SBGR',{requests:20},45);
  check('alternados acionados',alternates.length>=1,JSON.stringify(alternates));
  const result=api.evaluate(3500,{landed:8,departed:7,requests:20,commands:45,denied:1,conflicts:0,runwayIncursions:0,surfaceConflicts:0},false,'SBGR');
  check('evaluate gera network shift',result.shift.route&&Number.isFinite(result.shift.impact),JSON.stringify(result.shift));
  check('histórico network registra turno',result.network.history.length===1&&result.network.lastShift.airport==='SBGR',JSON.stringify(result.network.history));
  const risk=api.risk('clearTakeoff',{id:'GLO1'});
  check('risk retorna objeto operacional',risk.level==='ok'||risk.level==='warn'||risk.level==='danger',JSON.stringify(risk));
  const econ=api.economy();
  check('impacto econômico consultável',Number.isFinite(econ.impact)&&Number.isFinite(econ.delayMin),JSON.stringify(econ));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase20-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE20_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE20_UNIT_TESTS_SUMMARY.md'),`# Fase 20 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F20 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
