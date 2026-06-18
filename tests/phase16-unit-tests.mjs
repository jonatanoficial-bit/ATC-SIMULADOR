import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/19-procedures-sid-star-rnav.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/procedures-f16.json'),'utf8'));
check('metadados F16+',/^F(1[6-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.procedureOpsSchema===1,JSON.stringify(metadata));
check('módulo F16 identificado',source.includes('@skyward-module 19-procedures-sid-star-rnav'));
check('API congelada',source.includes('window.SKYWARD_PROCEDURES=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version&&catalog.airports);
check('catálogo cobre 3 aeroportos',Object.keys(catalog.airports||{}).length>=3,Object.keys(catalog.airports||{}).join(','));
check('SBGR possui SID STAR ILS RNAV missed hold',!!catalog.airports.SBGR?.stars?.length&&!!catalog.airports.SBGR?.sids?.length&&catalog.airports.SBGR?.approaches?.length>=2&&!!catalog.airports.SBGR?.missedApproach&&!!catalog.airports.SBGR?.holds?.length);
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,
  window:{SKYWARD_MODULES:[], SKYWARD_WEATHER_OPS:{state:()=>({rvrMeters:900,flightRules:'IFR'})}},
  airport:()=>({icao:'SBGR'}),
  runway:{name:'09R/27L'},
  PROCEDURE_LAYER:{routes:[],fixes:[],ils:{}},
  headingTo:(a,b)=>(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+360)%360,
  shortTurn:(a,b)=>((b-a+540)%360)-180,
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_PROCEDURES;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const set=api.initialize();
  check('initialize carrega SBGR',set.activeRunway==='09R/27L'&&context.PROCEDURE_LAYER.routes.length>=3,JSON.stringify(context.PROCEDURE_LAYER));
  let arr={id:'TAM3307',kind:'arrival',x:20,y:20,heading:90,targetAlt:120,speed:220};
  api.assignArrival(arr);
  check('arrival recebe procedimento',arr.procedureId&&arr.procedureFixes?.length>=3,JSON.stringify(arr));
  const beforeLeg=arr.procedureLeg||0; arr.x=arr.procedureFixes[0].x; arr.y=arr.procedureFixes[0].y;
  const fix=api.stepGuidance(arr,'STAR');
  check('stepGuidance avança fix',arr.procedureLeg>=beforeLeg,JSON.stringify({fix,leg:arr.procedureLeg,targetAlt:arr.targetAlt}));
  let dep={id:'GLO1204',kind:'departure',x:17,y:49,heading:90,targetAlt:0,speed:160};
  api.assignDeparture(dep);
  check('departure recebe SID',dep.procedureType==='SID'&&dep.procedureFixes.length>=3,JSON.stringify(dep));
  let miss={id:'AZU4211',kind:'arrival',x:82,y:49,heading:90,targetAlt:0,speed:170};
  api.assignMissed(miss);
  check('missed approach atribuído',miss.procedureType==='MISSED'&&miss.procedureFixes.length>=2,JSON.stringify(miss));
  api.assignHold(miss);
  check('holding atribuído',miss.holdingPattern?.id==='GRHLD',JSON.stringify(miss.holdingPattern));
  const risk=api.minimumRisk();
  check('mínimos por RVR consultáveis',risk.level==='ok'||risk.level==='warn'||risk.level==='danger',JSON.stringify(risk));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase16-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE16_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE16_UNIT_TESTS_SUMMARY.md'),`# Fase 16 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F16 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
