import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/24-control-room-multiplayer.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/control-room-ranking.json'),'utf8'));
check('metadados F21+',/^F(21|[3-9][0-9])$/.test(metadata.phase)&&metadata.controlRoomSchema===1,JSON.stringify(metadata));
check('módulo F21 identificado',source.includes('@skyward-module 24-control-room-multiplayer'));
check('API congelada',source.includes('window.SKYWARD_CONTROL_ROOM=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo salas ranking métricas',catalog.roomTypes?.length>=4&&catalog.rankingTiers?.length>=5&&catalog.comparisonMetrics?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  Buffer,
  window:{SKYWARD_MODULES:[], SKYWARD_CAREER:{status:()=>({licenseId:'APP_RADAR',ratingId:'IFR_RATED'}),safety:()=>91}, SKYWARD_ECONOMY:{status:()=>({lastShift:{profit:12000,delayMinutes:4}}),efficiency:()=>87}, SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:6,slotCompliance:.92})}, SKYWARD_INCIDENTS:{state:()=>({summary:{resolved:1,failed:0}})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.21.0-F21-20260619-1125',
  profile:{name:'Jonatan'},
  airport:()=>({icao:'SBGR'}),
  stats:{landed:6,departed:5,requests:14},
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_CONTROL_ROOM;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const room=api.create('NETWORK_ROOM','Jonatan Vale');
  check('cria sala network',room.typeId==='NETWORK_ROOM'&&room.players===3,JSON.stringify(room));
  const snap=api.snapshot(6500,{landed:8,departed:7,requests:18,conflicts:0,runwayIncursions:0,denied:1,incidentsResolved:1},false,'SBGR');
  check('snapshot completo',snap.finalScore===6500&&snap.airport==='SBGR'&&snap.safety>=80,JSON.stringify(snap));
  const code=api.code(snap);
  check('código de replay prefixado',String(code).startsWith('SCR-'),code.slice(0,12));
  const parsed=api.parse(code);
  check('parse preserva replay',parsed.snapshot.finalScore===6500&&parsed.snapshot.airport==='SBGR',JSON.stringify(parsed.snapshot));
  const shared=api.share(snap);
  check('share salva replay',shared.code===code||shared.code.startsWith('SCR-'),JSON.stringify(shared));
  const result=api.complete(7000,{landed:9,departed:7,requests:20,conflicts:0,denied:0,incidentsResolved:1},false,'SBGR');
  check('complete atualiza ranking',result.leaderboard.length>=1&&result.replay.tier,JSON.stringify(result.replay));
  const imported=api.import(code);
  check('import replay funciona',imported.snapshot.finalScore===6500,JSON.stringify(imported.snapshot));
  const cmp=api.compare(snap,{...snap,controller:'Outro',finalScore:3000,safety:70,efficiency:60,delayMin:30,economyProfit:-1000,slotCompliance:.5});
  check('comparação escolhe melhor turno',cmp.winner==='left',JSON.stringify(cmp));
  check('tier master válido',api.tier(16000).id==='MASTER');
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase21-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE21_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE21_UNIT_TESTS_SUMMARY.md'),`# Fase 21 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F21 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
