import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/17-surface-safety-director.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/surface-hotspots.json'),'utf8'));
check('metadados F14+',/^F(1[4-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.surfaceSafetySchema===1,JSON.stringify(metadata));
check('módulo F14 identificado',source.includes('@skyward-module 17-surface-safety-director'));
check('API congelada',source.includes('window.SKYWARD_SURFACE_SAFETY=Object.freeze'));
check('catálogo hotspots schema 1',catalog.schema===1&&catalog.version&&catalog.airports);
check('hotspots cobrem 5 aeroportos',Object.keys(catalog.airports||{}).length>=5,Object.keys(catalog.airports||{}).join(','));
check('KATL possui 3 hotspots',(catalog.airports?.KATL||[]).length>=3);
const aircraft=[
  {id:'TAM1001',status:'TAXI',kind:'departure',x:33,y:49,cleared:false,risk:0},
  {id:'GLO2002',status:'TAXI',kind:'departure',x:33.8,y:49.4,cleared:false,risk:0},
  {id:'AZU3003',status:'FINAL',kind:'arrival',x:76,y:49,alt:7,speed:140,cleared:true,risk:0}
];
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,
  window:{SKYWARD_MODULES:[]}, aircraft, stats:{runwayIncursions:0,surfaceConflicts:0}, runwayOccupiedBy:null,
  runway:{name:'09R/27L',x1:17,y1:49,x2:84,y2:49,width:6},
  airport:()=>({icao:'SBGR'}),
  arrivalOnShortFinal:()=>aircraft.find(p=>p.status==='FINAL'),
  performance:{now:()=>3000},
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_SURFACE_SAFETY;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  check('hotspots SBGR retornam',api.hotspotsFor('SBGR').length>=3);
  const inc=api.runwayIncursions();
  check('runway incursion detectada',inc.some(a=>a.id==='TAM1001'&&a.level==='danger'),JSON.stringify(inc));
  const taxi=api.taxiConflicts();
  check('taxi conflict detectado',taxi.some(a=>a.level==='danger'),JSON.stringify(taxi));
  const state=api.update(0);
  check('surface state danger',state.level==='danger'&&state.score<80,JSON.stringify(state));
  const blocked=api.commandRisk(aircraft[0],'lineUp');
  check('line up bloqueado por incursion/short final',blocked.block===true&&blocked.level==='danger',JSON.stringify(blocked));
  aircraft[0].x=45; aircraft[0].y=56; aircraft[1].x=70; aircraft[1].y=70; aircraft[2].status='APP'; aircraft[2].x=20; aircraft[2].y=20;
  const approved=api.commandRisk(aircraft[0],'approveTaxi');
  check('taxi aprovado fora de conflito',approved.block===false,JSON.stringify(approved));
  aircraft[0].x=66; aircraft[0].y=56; aircraft[0].status='TAXI';
  const hotspotState=api.update(0);
  check('hotspot ativo identificado',hotspotState.hotspots.some(h=>h.id==='HS-TAXI-A'),JSON.stringify(hotspotState.hotspots));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase14-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE14_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE14_UNIT_TESTS_SUMMARY.md'),`# Fase 14 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F14 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
