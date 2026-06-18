import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/22-incident-emergency-director.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/incident-playbooks.json'),'utf8'));
check('metadados F19+',/^F(19|[2-9][0-9])$/.test(metadata.phase)&&metadata.incidentSchema===1,JSON.stringify(metadata));
check('módulo F19 identificado',source.includes('@skyward-module 22-incident-emergency-director'));
check('API congelada',source.includes('window.SKYWARD_INCIDENTS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo incidentes e agências',catalog.incidentTypes?.length>=7&&Object.keys(catalog.agencies||{}).length>=8);
const logs=[]; let diag=null;
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[], SKYWARD_WEATHER_OPS:{state:()=>({flightRules:'IFR'})}},
  performance:{now:()=>100000},
  stats:{commands:4,requests:8,conflicts:0,runwayIncursions:0},
  profile:{turns:2},
  runway:{name:'09R/27L'},
  runwayOccupiedBy:null,
  selected:'TAM1234',
  aircraft:[{id:'TAM1234',kind:'arrival',status:'APP',emergency:false}],
  addLog:(m,t)=>logs.push([m,t]),
  setDiagnostic:(m,t)=>{diag=[m,t]},
  addRequest:(p,type,prio)=>{p.request=[type,prio]},
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_INCIDENTS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const inc=api.start('ENGINE_FAILURE',context.aircraft[0],'unit-test');
  check('incidente inicia',inc.typeId==='ENGINE_FAILURE'&&inc.status==='ACTIVE',JSON.stringify(inc));
  check('alvo vira emergência',context.aircraft[0].emergency===true&&context.aircraft[0].incidentId===inc.id,JSON.stringify(context.aircraft[0]));
  check('pista fecha em incidente crítico',api.state().runwayClosed===true,String(api.state().runwayClosed));
  const risk=api.risk('clearTakeoff',{id:'GLO1'});
  check('clearance bloqueado com pista fechada',risk.block===true&&risk.level==='danger',JSON.stringify(risk));
  api.dispatch('ARFF'); api.dispatch('TOWER'); api.dispatch('APPROACH'); api.dispatch('AIRLINE_OPS');
  api.action('declare_mayday'); api.action('priority_vectors'); api.action('hold_all_departures'); api.action('clear_emergency_landing');
  const score=api.score();
  check('score de resolução alto após ações',score>=70,String(score));
  const resolved=api.resolve(true);
  check('incidente resolvido e histórico',resolved.status==='RESOLVED'&&api.state().history.length===1,JSON.stringify(api.state().history));
  const econ=api.economy();
  check('impacto econômico registrado',econ.cost>0&&econ.closures>=1,JSON.stringify(econ));
  api.start('RUNWAY_FOD',null,'unit-test');
  api.closeRunway(1,'TEST');
  api.reopen(true);
  check('reabertura forçada funciona',api.state().runwayClosed===false,String(api.state().runwayClosed));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase19-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE19_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE19_UNIT_TESTS_SUMMARY.md'),`# Fase 19 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F19 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
