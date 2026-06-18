import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/16-airport-surface-graph.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/airport-graphs.json'),'utf8'));
check('metadados F13+',/^F(1[3-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.airportSurfaceSchema===1,JSON.stringify(metadata));
check('módulo F13 identificado',source.includes('@skyward-module 16-airport-surface-graph'));
check('API congelada',source.includes('window.SKYWARD_AIRPORT_SURFACE=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version&&catalog.airports);
check('catálogo cobre 5 aeroportos',Object.keys(catalog.airports||{}).length>=5,Object.keys(catalog.airports||{}).join(','));
check('SBGR possui múltiplas taxiways',(catalog.airports?.SBGR?.taxiways||[]).length>=4);
check('KATL possui pistas múltiplas',(catalog.airports?.KATL?.runways||[]).length>=3);
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,
  window:{SKYWARD_MODULES:[]},
  runway:{name:'09/27',x1:18,y1:50,x2:82,y2:50,width:6.2,exits:[32,45,56,68]},
  gates:[{x:55,y:70,label:'A'},{x:61,y:70,label:'A'},{x:67,y:70,label:'B'},{x:73,y:70,label:'B'}],
  holdingPoints:[{x:31,y:57},{x:47,y:57},{x:64,y:57},{x:78,y:57}],
  finalFix:{x:52,y:26},
  secondaryRunways:[], activeAirportGraph:null, airportSurfaceState:{},
  SIM_SPEED:0.092,
  airport:()=>({icao:'SBGR',name:'Guarulhos'}),
  headingTo:(a,b)=>(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI+360)%360,
  moveToward:(p,t,amount)=>{ const h=(Math.atan2(t.y-p.y,t.x-p.x)); p.x += Math.cos(h)*amount*100; p.y += Math.sin(h)*amount*100; },
  PROCEDURE_LAYER:{ils:{threshold:{x:82,y:50},name:'ILS RWY 27'}},
  $:()=>null
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_AIRPORT_SURFACE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const sbgr=api.getGraph('SBGR');
  check('SBGR retornado',sbgr.airport==='SBGR' && sbgr.activeRunway==='09R/27L');
  const applied=api.apply('SBGR');
  check('apply sincroniza pista',context.runway.name==='09R/27L',JSON.stringify(context.runway));
  check('apply carrega gates',Array.isArray(context.gates)&&context.gates.length>=6,String(context.gates.length));
  check('apply carrega holding points',Array.isArray(context.holdingPoints)&&context.holdingPoints.length>=4,String(context.holdingPoints.length));
  check('apply registra secundárias',(context.secondaryRunways||[]).length>=1,String((context.secondaryRunways||[]).length));
  check('runway heading coerente',api.runwayHeading()>=0 && api.runwayHeading()<=360,api.runwayHeading());
  const plane={id:'TAM1234',gateIndex:0,gateId:'T1',groundIndex:1,x:58,y:76};
  const push=api.assignDepartureSurfaceRoute(plane,'pushback');
  const taxi=api.assignDepartureSurfaceRoute(plane,'taxi');
  const lineup=api.assignDepartureSurfaceRoute(plane,'lineup');
  check('rota pushback existe',push.length>=1,JSON.stringify(push));
  check('rota taxi existe',taxi.length>=2,JSON.stringify(taxi));
  check('rota lineup existe',lineup.length>=1,JSON.stringify(lineup));
  api.beginSurfaceRoute(plane,taxi,'HOLD_SHORT');
  let steps=0; while(steps<120 && !api.stepSurfaceRoute(plane,1,0.04)) steps++;
  check('stepSurfaceRoute progride',steps<=120 && (plane.surfaceLeg||0)>=2,JSON.stringify({steps,x:plane.x,y:plane.y,leg:plane.surfaceLeg}));
  const ex=api.nearestRunwayExit({x:60,y:53});
  check('saída de pista encontrada',!!ex && /^E/.test(ex.id),JSON.stringify(ex));
  const vac=api.assignArrivalVacateRoute({x:61,y:50});
  check('rota vacate existe',vac.length>=1,JSON.stringify(vac));
  const summary=api.summary();
  check('summary reflete grafo',summary.airport==='SBGR' && summary.gates>=6 && summary.taxiways>=4,JSON.stringify(summary));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase13-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE13_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE13_UNIT_TESTS_SUMMARY.md'),`# Fase 13 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F13 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
