/* @skyward-module 14-deterministic-replay
 * Deterministic simulation clock, seeded replay recorder, state checksums and technical replay export.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('deterministic-replay');
const REPLAY_SCHEMA = 1;
const REPLAY_MAX_EVENTS = 900;
const REPLAY_STORAGE_KEY = `skywardReplayLast_v${REPLAY_SCHEMA}`;
let replayState = {
  enabled:true,
  recording:false,
  replaying:false,
  seed:'idle',
  seedHash:0,
  rngState:0,
  tick:0,
  elapsed:0,
  frame:0,
  events:[],
  lastChecksum:'00000000',
  startedAt:0,
  lastExport:null
};
function replayHash(value){
  const text=String(value||'');
  let h=2166136261>>>0;
  for(let i=0;i<text.length;i++){ h^=text.charCodeAt(i); h=Math.imul(h,16777619)>>>0; }
  return h>>>0;
}
function replaySeedFromProfile(reason='turn'){
  const airportCode = (profile && profile.airport) || 'SBGR';
  const name = (profile && profile.name) || 'Controlador';
  const turns = Number(profile?.turns||0);
  return `${BUILD}|${airportCode}|${name}|${turns}|${reason}`;
}
function replayMulberry32(){
  replayState.rngState = (replayState.rngState + 0x6D2B79F5) >>> 0;
  let t = replayState.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function skywardRandomUnit(){
  try{
    if(window.SKYWARD_REPLAY?.isDeterministic?.()) return window.SKYWARD_REPLAY.random();
  }catch(_e){}
  return Math.random();
}
function replayStateSummary(){
  return {
    aircraft: aircraft.map(p=>({id:p.id,kind:p.kind,status:p.status,x:+Number(p.x||0).toFixed(2),y:+Number(p.y||0).toFixed(2),alt:+Number(p.alt||0).toFixed(1),speed:+Number(p.speed||0).toFixed(1),heading:+Number(p.heading||0).toFixed(1),fuel:+Number(p.fuel||0).toFixed(1),emergency:!!p.emergency})).sort((a,b)=>String(a.id).localeCompare(String(b.id))),
    requests: requests.map(r=>({id:r.id,type:r.type,priority:r.priority})).sort((a,b)=>`${a.id}|${a.type}`.localeCompare(`${b.id}|${b.type}`)),
    selected:selected||null,
    runwayOccupiedBy:runwayOccupiedBy||null,
    score:Math.round(score),
    stats:{...stats}
  };
}
function replayChecksum(payload=replayStateSummary()){
  return replayHash(JSON.stringify(payload)).toString(16).padStart(8,'0');
}
function replayRecord(type, detail={}){
  try{
    if(!replayState.enabled || !replayState.recording) return null;
    const entry={schema:REPLAY_SCHEMA,index:replayState.events.length,tick:replayState.tick,elapsed:+replayState.elapsed.toFixed(3),type,detail,checksum:replayChecksum(),at:Date.now()};
    replayState.lastChecksum=entry.checksum;
    replayState.events.push(entry);
    if(replayState.events.length>REPLAY_MAX_EVENTS) replayState.events.splice(0,replayState.events.length-REPLAY_MAX_EVENTS);
    renderReplayStatus();
    return entry;
  }catch(e){ safeLogError(e,'replay-record'); return null; }
}
function replayBeginTurn(seed){
  try{
    const resolved=String(seed||replaySeedFromProfile('turn'));
    replayState={...replayState,recording:true,replaying:false,seed:resolved,seedHash:replayHash(resolved),rngState:replayHash(resolved),tick:0,elapsed:0,frame:0,events:[],lastChecksum:'00000000',startedAt:Date.now(),lastExport:null};
    SKYWARD_RANDOM_SOURCE=()=>window.SKYWARD_REPLAY.random();
    replayRecord('turn-start',{seed:resolved,airport:profile?.airport||'SBGR',build:BUILD});
    renderReplayStatus();
    return cloneSafe(replayState);
  }catch(e){ safeLogError(e,'replay-begin'); return replayState; }
}
function replayStep(dt){
  if(!replayState.recording || replayState.replaying) return replayState;
  const safeDt=Math.max(0,Math.min(.25,Number(dt)||0));
  replayState.tick += 1;
  replayState.frame += 1;
  replayState.elapsed = +(replayState.elapsed + safeDt).toFixed(4);
  if(replayState.frame % 120 === 0) replayRecord('checkpoint',{aircraft:aircraft.length,requests:requests.length,score:Math.round(score)});
  return replayState;
}
function replayElapsedSeconds(){
  return replayState.recording ? replayState.elapsed : Math.max(0,(performance.now()-startTime)/1000);
}
function replayExport(){
  const payload={schema:REPLAY_SCHEMA,build:BUILD,version:BUILD_INFO.version,phase:BUILD_INFO.phase,replaySchema:BUILD_INFO.replaySchema||REPLAY_SCHEMA,seed:replayState.seed,seedHash:replayState.seedHash,tick:replayState.tick,elapsed:replayState.elapsed,startedAt:replayState.startedAt,exportedAt:Date.now(),airport:profile?.airport||null,events:cloneSafe(replayState.events),finalChecksum:replayChecksum(),state:replayStateSummary()};
  replayState.lastExport=payload;
  try{ safeStorageSet(REPLAY_STORAGE_KEY,payload); }catch(_e){}
  renderReplayStatus();
  return payload;
}
function replayImport(payload){
  try{
    const data=typeof payload==='string'?JSON.parse(payload):payload;
    if(!data || data.schema!==REPLAY_SCHEMA || !Array.isArray(data.events) || !data.seed) return {ok:false,reason:'payload inválido'};
    replayState.seed=String(data.seed); replayState.seedHash=replayHash(replayState.seed); replayState.rngState=replayState.seedHash; replayState.events=cloneSafe(data.events).slice(-REPLAY_MAX_EVENTS); replayState.tick=Number(data.tick)||0; replayState.elapsed=Number(data.elapsed)||0; replayState.lastChecksum=String(data.finalChecksum||'00000000'); replayState.lastExport=data; renderReplayStatus();
    return {ok:true,events:replayState.events.length,checksum:replayState.lastChecksum};
  }catch(e){ safeLogError(e,'replay-import'); return {ok:false,reason:String(e.message||e)}; }
}
function replaySelfCheck(){
  const s='SC-REPLAY-TEST';
  const a={...replayState};
  replayState.seed=s; replayState.rngState=replayHash(s);
  const seq1=[replayMulberry32(),replayMulberry32(),replayMulberry32()].map(n=>n.toFixed(8));
  replayState.seed=s; replayState.rngState=replayHash(s);
  const seq2=[replayMulberry32(),replayMulberry32(),replayMulberry32()].map(n=>n.toFixed(8));
  Object.assign(replayState,a);
  return {ok:seq1.join('|')===seq2.join('|') && replayChecksum({a:1})===replayChecksum({a:1}), sequence:seq1, checksum:replayChecksum({a:1})};
}
function renderReplayStatus(){
  try{
    const label=document.querySelector('#replayStatusValue');
    if(label) label.textContent = replayState.recording ? `REC ${replayState.events.length} • ${replayState.lastChecksum}` : 'AGUARDANDO TURNO';
    const badge=document.querySelector('#replayBadge');
    if(badge) badge.textContent = replayState.recording ? `REPLAY ${replayState.tick}` : 'REPLAY';
    const seed=document.querySelector('#replaySeedValue'); if(seed) seed.textContent=String(replayState.seed||'—').slice(0,42);
    const out=document.querySelector('#replayExportText'); if(out && replayState.lastExport) out.value=JSON.stringify(replayState.lastExport,null,2);
  }catch(_e){}
}
function openReplayPanel(){ document.querySelector('#replayPanel')?.classList.add('open'); document.querySelector('#replayPanel')?.setAttribute('aria-hidden','false'); renderReplayStatus(); }
function closeReplayPanel(){ document.querySelector('#replayPanel')?.classList.remove('open'); document.querySelector('#replayPanel')?.setAttribute('aria-hidden','true'); }
const originalStartGameF11 = typeof startGame==='function' ? startGame : null;
if(originalStartGameF11){
  startGame=function(){
    replayBeginTurn(replaySeedFromProfile('start-game'));
    const result=originalStartGameF11.apply(this,arguments);
    replayRecord('initial-state',{aircraft:aircraft.map(p=>p.id),requests:requests.map(r=>`${r.id}:${r.type}`)});
    return result;
  };
}
const originalCommandF11 = typeof command==='function' ? command : null;
if(originalCommandF11){
  command=function(cmd){
    replayRecord('command-before',{cmd,selected:selected||null});
    const result=originalCommandF11.apply(this,arguments);
    replayRecord('command-after',{cmd,selected:selected||null});
    return result;
  };
}
document.addEventListener('click',(e)=>{
  const target=e.target.closest&&e.target.closest('[data-replay-action]');
  if(!target) return;
  const action=target.dataset.replayAction;
  if(action==='open') openReplayPanel();
  if(action==='close') closeReplayPanel();
  if(action==='export'){ replayExport(); setDiagnostic('REPLAY TÉCNICO EXPORTADO','ok'); }
  if(action==='checkpoint'){ replayRecord('manual-checkpoint',{source:'operator'}); setDiagnostic('CHECKPOINT DE REPLAY CRIADO','ok'); }
});
window.addEventListener('keydown',(e)=>{ if(e.code==='F11'){ e.preventDefault(); openReplayPanel(); }});
window.SKYWARD_REPLAY=Object.freeze({
  schema:REPLAY_SCHEMA,
  isDeterministic:()=>replayState.recording && !replayState.replaying,
  random:()=>replayMulberry32(),
  beginTurn:replayBeginTurn,
  step:replayStep,
  elapsed:replayElapsedSeconds,
  record:replayRecord,
  export:replayExport,
  import:replayImport,
  checksum:replayChecksum,
  summary:()=>cloneSafe({...replayState,events:replayState.events.slice(-12)}),
  selfCheck:replaySelfCheck,
  seedHash:replayHash
});
setTimeout(()=>{ try{ renderReplayStatus(); }catch(_e){} },250);
