/* @skyward-module 24-control-room-multiplayer
 * Local/asynchronous multiplayer, operational ranking, shared replay codes, control room and shift comparison.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('24-control-room-multiplayer');
const CONTROL_ROOM_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f21',
  roomTypes:[
    {id:'LOCAL_TOWER_ROOM',name:'Sala Local Torre',players:2,focus:['TWR','GND'],scoreWeight:1.0},
    {id:'APPROACH_ROOM',name:'Sala Aproximação',players:2,focus:['APP','TWR'],scoreWeight:1.15},
    {id:'NETWORK_ROOM',name:'Sala Network Flow',players:3,focus:['APP','FLOW','OPS'],scoreWeight:1.3},
    {id:'EMERGENCY_ROOM',name:'Sala Emergência Multiagência',players:3,focus:['TWR','OPS','ARFF'],scoreWeight:1.45}
  ],
  rankingTiers:[
    {id:'TRAINEE',name:'Trainee',minScore:0},
    {id:'CERTIFIED',name:'Certified',minScore:1500},
    {id:'PRO',name:'Professional',minScore:4200},
    {id:'ELITE',name:'Elite Controller',minScore:8200},
    {id:'MASTER',name:'Master Supervisor',minScore:14000}
  ],
  comparisonMetrics:[
    {id:'finalScore',name:'Pontuação final',higherIsBetter:true},
    {id:'safety',name:'Segurança',higherIsBetter:true},
    {id:'efficiency',name:'Eficiência',higherIsBetter:true},
    {id:'delayMin',name:'Atraso total',higherIsBetter:false},
    {id:'incidentsResolved',name:'Incidentes resolvidos',higherIsBetter:true},
    {id:'economyProfit',name:'Resultado econômico',higherIsBetter:true},
    {id:'slotCompliance',name:'Compliance de slot',higherIsBetter:true}
  ],
  sharePolicy:{format:'SKYWARD-REPLAY-V1',maxHistory:40,codePrefix:'SCR',offlineOnly:true}
});
const CONTROL_ROOM_KEY='skywardControlRoom_v1';
let controlRoomState = {
  schema:1,
  activeRoom:null,
  leaderboard:[],
  sharedReplays:[],
  comparisons:[],
  lastReplayCode:'',
  lastComparison:null,
  roomStats:{created:0,completed:0,shared:0}
};
function controlClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function safeBtoa(value){
  try{
    if(typeof btoa==='function') return btoa(unescape(encodeURIComponent(value)));
  }catch(e){}
  try{
    return Buffer.from(value,'utf8').toString('base64');
  }catch(e){ return String(value); }
}
function safeAtob(value){
  try{
    if(typeof atob==='function') return decodeURIComponent(escape(atob(value)));
  }catch(e){}
  try{
    return Buffer.from(value,'base64').toString('utf8');
  }catch(e){ return String(value); }
}
function loadControlRoom(){
  try{ const raw=localStorage?.getItem?.(CONTROL_ROOM_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) controlRoomState={...controlRoomState,...parsed}; } }catch(e){ safeLogError?.(e,'control-room-load'); }
  return controlRoomState;
}
function saveControlRoom(){
  try{ localStorage?.setItem?.(CONTROL_ROOM_KEY,JSON.stringify(controlRoomState)); }catch(e){ safeLogError?.(e,'control-room-save'); }
  return controlRoomState;
}
function rankingTierFor(score){
  return CONTROL_ROOM_CATALOG.rankingTiers.slice().sort((a,b)=>a.minScore-b.minScore).filter(t=>score>=t.minScore).pop() || CONTROL_ROOM_CATALOG.rankingTiers[0];
}
function createControlRoom(typeId='LOCAL_TOWER_ROOM', controllerName='Controlador'){
  loadControlRoom();
  const type=CONTROL_ROOM_CATALOG.roomTypes.find(r=>r.id===typeId) || CONTROL_ROOM_CATALOG.roomTypes[0];
  const stamp=Date.now();
  controlRoomState.activeRoom={
    id:`ROOM-${String(stamp).slice(-6)}`,
    typeId:type.id,
    name:type.name,
    controllerName:String(controllerName||profile?.name||'Controlador').slice(0,40),
    players:type.players,
    focus:type.focus.slice(),
    scoreWeight:type.scoreWeight,
    createdAt:new Date(stamp).toISOString(),
    status:'ACTIVE'
  };
  controlRoomState.roomStats.created=(controlRoomState.roomStats.created||0)+1;
  saveControlRoom();
  renderControlRoomBoard();
  return controlRoomState.activeRoom;
}
function collectShiftSnapshot(finalScore=0, statsObj={}, fail=false, airportCode=''){
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const incidents=window.SKYWARD_INCIDENTS?.state?.() || {};
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,statsObj,fail) ?? Math.max(0,100-(statsObj.conflicts||0)*8-(fail?25:0));
  const efficiency=window.SKYWARD_ECONOMY?.efficiency?.(statsObj) ?? Math.max(0,Math.min(100,50+(statsObj.landed||0)*5+(statsObj.departed||0)*4-(statsObj.denied||0)*4));
  return {
    schema:1,
    build:BUILD,
    at:new Date().toISOString(),
    airport:airportCode||airport?.()?.icao||'---',
    controller:profile?.name||'Controlador',
    finalScore:Math.round(finalScore||0),
    safety:Math.round(safety||0),
    efficiency:Math.round(efficiency||0),
    delayMin:Math.round((network.networkDelayMin||0)+(economy.lastShift?.delayMinutes||0)),
    incidentsResolved:statsObj.incidentsResolved||incidents.summary?.resolved||0,
    incidentFailures:statsObj.incidentFailures||incidents.summary?.failed||0,
    economyProfit:Math.round(economy.lastShift?.profit||0),
    slotCompliance:Number((network.slotCompliance ?? 1).toFixed ? (network.slotCompliance ?? 1).toFixed(2) : (network.slotCompliance||1)),
    careerLicense:career.licenseId||'---',
    careerRating:career.ratingId||'---',
    stats:{landed:statsObj.landed||0,departed:statsObj.departed||0,conflicts:statsObj.conflicts||0,runwayIncursions:statsObj.runwayIncursions||0,denied:statsObj.denied||0,requests:statsObj.requests||0}
  };
}
function replayPayload(snapshot){
  const tier=rankingTierFor(snapshot.finalScore);
  return {format:CONTROL_ROOM_CATALOG.sharePolicy.format,schema:1,build:BUILD,room:controlRoomState.activeRoom,snapshot,tier:tier.id};
}
function generateReplayCode(snapshot){
  const payload=replayPayload(snapshot);
  const encoded=safeBtoa(JSON.stringify(payload)).replace(/=+$/,'');
  return `${CONTROL_ROOM_CATALOG.sharePolicy.codePrefix}-${encoded}`;
}
function parseReplayCode(code){
  const raw=String(code||'').trim();
  const prefix=CONTROL_ROOM_CATALOG.sharePolicy.codePrefix+'-';
  const body=raw.startsWith(prefix)?raw.slice(prefix.length):raw;
  const padded=body+'='.repeat((4-body.length%4)%4);
  const payload=JSON.parse(safeAtob(padded));
  if(payload.format!==CONTROL_ROOM_CATALOG.sharePolicy.format) throw new Error('Replay incompatível');
  return payload;
}
function saveSharedReplay(snapshot){
  loadControlRoom();
  const snap=snapshot || collectShiftSnapshot(0,stats||{},false,airport?.()?.icao);
  const code=generateReplayCode(snap);
  const tier=rankingTierFor(snap.finalScore);
  const entry={code,at:snap.at,build:BUILD,airport:snap.airport,controller:snap.controller,finalScore:snap.finalScore,tier:tier.id,snapshot:snap};
  controlRoomState.sharedReplays.unshift(entry);
  controlRoomState.sharedReplays=controlRoomState.sharedReplays.slice(0,CONTROL_ROOM_CATALOG.sharePolicy.maxHistory);
  controlRoomState.lastReplayCode=code;
  controlRoomState.roomStats.shared=(controlRoomState.roomStats.shared||0)+1;
  updateLeaderboard(snap);
  saveControlRoom();
  renderControlRoomBoard();
  return entry;
}
function updateLeaderboard(snapshot){
  const tier=rankingTierFor(snapshot.finalScore);
  const entry={at:snapshot.at,build:BUILD,airport:snapshot.airport,controller:snapshot.controller,finalScore:snapshot.finalScore,safety:snapshot.safety,efficiency:snapshot.efficiency,tier:tier.id};
  controlRoomState.leaderboard.unshift(entry);
  controlRoomState.leaderboard=controlRoomState.leaderboard.sort((a,b)=>b.finalScore-a.finalScore || b.safety-a.safety).slice(0,50);
  return controlRoomState.leaderboard;
}
function completeControlRoomShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadControlRoom();
  if(!controlRoomState.activeRoom) createControlRoom('LOCAL_TOWER_ROOM',profile?.name||'Controlador');
  const snapshot=collectShiftSnapshot(finalScore,statsObj,fail,airportCode);
  const replay=saveSharedReplay(snapshot);
  controlRoomState.activeRoom.status='COMPLETED';
  controlRoomState.activeRoom.completedAt=snapshot.at;
  controlRoomState.roomStats.completed=(controlRoomState.roomStats.completed||0)+1;
  saveControlRoom();
  renderControlRoomBoard();
  return {room:controlRoomState.activeRoom,replay,leaderboard:controlRoomState.leaderboard,snapshot};
}
function compareShifts(a,b){
  const left=typeof a==='string'?parseReplayCode(a).snapshot:a;
  const right=typeof b==='string'?parseReplayCode(b).snapshot:b;
  const metrics=CONTROL_ROOM_CATALOG.comparisonMetrics.map(m=>{
    const av=Number(left?.[m.id]||0), bv=Number(right?.[m.id]||0);
    const delta=av-bv;
    const leftWins=m.higherIsBetter ? av>=bv : av<=bv;
    return {id:m.id,name:m.name,left:av,right:bv,delta,leftWins};
  });
  const leftScore=metrics.filter(m=>m.leftWins).length;
  const comparison={at:new Date().toISOString(),left:left?.controller||'A',right:right?.controller||'B',winner:leftScore>=Math.ceil(metrics.length/2)?'left':'right',metrics};
  controlRoomState.comparisons.unshift(comparison);
  controlRoomState.comparisons=controlRoomState.comparisons.slice(0,30);
  controlRoomState.lastComparison=comparison;
  saveControlRoom();
  renderControlRoomBoard();
  return comparison;
}
function importReplayCode(code){
  const payload=parseReplayCode(code);
  loadControlRoom();
  const snap=payload.snapshot;
  controlRoomState.sharedReplays.unshift({code,at:snap.at,build:payload.build,airport:snap.airport,controller:snap.controller,finalScore:snap.finalScore,tier:payload.tier,snapshot:snap,imported:true});
  controlRoomState.sharedReplays=controlRoomState.sharedReplays.slice(0,CONTROL_ROOM_CATALOG.sharePolicy.maxHistory);
  updateLeaderboard(snap);
  saveControlRoom();
  renderControlRoomBoard();
  return payload;
}
function controlRoomStatus(){ loadControlRoom(); return controlRoomState; }
function resetControlRoom(){ controlRoomState={schema:1,activeRoom:null,leaderboard:[],sharedReplays:[],comparisons:[],lastReplayCode:'',lastComparison:null,roomStats:{created:0,completed:0,shared:0}}; saveControlRoom(); renderControlRoomBoard(); return controlRoomState; }
function renderControlRoomBoard(){
  try{
    const anchor=document.querySelector('#networkOpsInline') || document.querySelector('#incidentOpsInline') || document.querySelector('#economyOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#controlRoomInline'); if(old) old.remove();
    const s=controlRoomStatus();
    const top=s.leaderboard?.[0]||{};
    const room=s.activeRoom||{};
    anchor.insertAdjacentHTML('afterend',`<div id="controlRoomInline" class="airport-ops-board control-room-inline">
      <div class="airport-ops-head"><b>CONTROL ROOM</b><span>${room.status||'LOCAL'}</span></div>
      <div class="airport-ops-grid">
        <div><small>SALA</small><b>${room.typeId||'---'}</b></div>
        <div><small>RANK</small><b>${top.tier||'---'}</b></div>
        <div><small>TOP SCORE</small><b>${Math.round(top.finalScore||0)}</b></div>
        <div><small>REPLAYS</small><b>${s.sharedReplays?.length||0}</b></div>
        <div><small>COMPARAÇÕES</small><b>${s.comparisons?.length||0}</b></div>
        <div><small>COMPARTILHAR</small><b>${s.lastReplayCode?'PRONTO':'---'}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'control-room-board'); }
}
function controlRoomSelfCheck(){
  const issues=[];
  if(CONTROL_ROOM_CATALOG.roomTypes.length<4) issues.push('tipos de sala insuficientes');
  if(CONTROL_ROOM_CATALOG.rankingTiers.length<5) issues.push('ranking insuficiente');
  if(CONTROL_ROOM_CATALOG.comparisonMetrics.length<6) issues.push('métricas insuficientes');
  const snap={schema:1,build:BUILD,at:'2026-01-01T00:00:00Z',airport:'SBGR',controller:'Teste',finalScore:9000,safety:90,efficiency:88,delayMin:5,incidentsResolved:1,economyProfit:1000,slotCompliance:.9,stats:{}};
  const code=generateReplayCode(snap);
  const parsed=parseReplayCode(code);
  if(parsed.snapshot.finalScore!==9000) issues.push('replay code não preserva score');
  if(rankingTierFor(15000).id!=='MASTER') issues.push('tier master inválido');
  const cmp=compareShifts(snap,{...snap,controller:'B',finalScore:4000,safety:80,efficiency:70,delayMin:20,economyProfit:-500,slotCompliance:.6});
  if(cmp.winner!=='left') issues.push('comparação não escolheu melhor turno');
  return {ok:issues.length===0,issues,rooms:CONTROL_ROOM_CATALOG.roomTypes.length,tiers:CONTROL_ROOM_CATALOG.rankingTiers.length};
}
window.SKYWARD_CONTROL_ROOM=Object.freeze({
  schema:1,
  catalog:CONTROL_ROOM_CATALOG,
  load:loadControlRoom,
  save:saveControlRoom,
  reset:resetControlRoom,
  status:controlRoomStatus,
  create:createControlRoom,
  complete:completeControlRoomShift,
  snapshot:collectShiftSnapshot,
  share:saveSharedReplay,
  code:generateReplayCode,
  parse:parseReplayCode,
  import:importReplayCode,
  compare:compareShifts,
  tier:rankingTierFor,
  render:renderControlRoomBoard,
  selfCheck:controlRoomSelfCheck
});
