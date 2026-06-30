/* @skyward-module 01-build-and-radio
 * Build metadata and ATC radio/readback.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('01-build-and-radio');
const BUILD_INFO = Object.freeze({
  product: 'Skyward Control',
  version: '0.0.0',
  phase: 'F00',
  phaseName: 'Build não carimbada',
  channel: 'development',
  build: 'SC-0.0.0-F00-UNSTAMPED',
  builtAt: 'UNSTAMPED',
  builtAtIso: '',
  schema: 1,
  contractSchema: 1,
  testSchema: 1,
  saveVaultSchema: 1,
  pwaSchema: 1,
  cacheSchema: 1,
  uxSchema: 1,
  desktopSchema: 1,
  accessibilitySchema: 1,
  replaySchema: 1,
  target: 'Mobile-first / Tablet / Desktop',
  ...(window.SKYWARD_BUILD_INFO || {})
});
const QUALITY = window.SKYWARD_QUALITY_KERNEL || null;
const CONTRACTS = window.SKYWARD_CONTRACTS || null;
const BUILD = BUILD_INFO.build;
const BUILD_METADATA_RESULT = CONTRACTS?.validateBuildInfo ? CONTRACTS.validateBuildInfo(window.SKYWARD_BUILD_INFO, 'boot') : {ok:false,issues:[{path:'$',code:'contracts_missing',message:'Camada de contratos indisponível'}]};
const BUILD_METADATA_VALID = Boolean(window.SKYWARD_BUILD_INFO) && BUILD_METADATA_RESULT.ok && /^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(BUILD) && BUILD_INFO.phase !== 'F00';
const SNAPSHOT_KEY = `skywardGoodState_v${BUILD_INFO.schema}`;
const LEGACY_SNAPSHOT_KEYS = Object.freeze(['skywardGoodState_v2','skywardGoodState_v1','skywardGoodStateF01']);
const PROFILE_SAVE_SCHEMA = 1;
const SAVE_SESSION_ID = `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const saveVault = () => window.SKYWARD_SAVE_VAULT || null;
const SNAPSHOT_INTERVAL_MS = 8000;
let lastSnapshotAt = 0;
let lastUiRenderAt = 0;
let callsignSequence = 0;
let mobileActiveTab = null;
const CLEARANCE_COMMANDS = Object.freeze({
  clearLanding: 'landing',
  approvePushback: 'pushback',
  approveTaxi: 'taxi',
  lineUp: 'lineup',
  clearTakeoff: 'takeoff',
  clearEmergency: 'emergency'
});

function applyBuildInfo(){
  document.querySelectorAll('[data-build]').forEach(el=>{ el.textContent = BUILD_INFO.build; });
  document.querySelectorAll('[data-build-version]').forEach(el=>{ el.textContent = `v${BUILD_INFO.version}`; });
  document.querySelectorAll('[data-build-date]').forEach(el=>{ el.textContent = BUILD_INFO.builtAt; });
  document.querySelectorAll('[data-build-phase]').forEach(el=>{ el.textContent = BUILD_INFO.phase; });
  document.querySelectorAll('[data-build-channel]').forEach(el=>{ el.textContent = BUILD_INFO.channel.toUpperCase(); });
  document.documentElement.dataset.buildId = BUILD_INFO.build;
  document.documentElement.dataset.buildPhase = BUILD_INFO.phase;
  document.documentElement.dataset.contractSchema = String(BUILD_INFO.contractSchema || CONTRACTS?.contractSchema || 0);
  document.documentElement.dataset.testSchema = String(BUILD_INFO.testSchema || 0);
  document.documentElement.dataset.saveVaultSchema = String(BUILD_INFO.saveVaultSchema || saveVault()?.vaultSchema || 0);
  document.documentElement.dataset.pwaSchema = String(BUILD_INFO.pwaSchema || 0);
  document.documentElement.dataset.cacheSchema = String(BUILD_INFO.cacheSchema || 0);
  document.documentElement.dataset.uxSchema = String(BUILD_INFO.uxSchema || 0);
  document.documentElement.dataset.replaySchema = String(BUILD_INFO.replaySchema || 0);
  document.title = `${BUILD_INFO.product} v${BUILD_INFO.version} — ${BUILD_INFO.phase}`;
}

const SAFE_MODE = { errors: [], contractFailures:0, saveRecoveries:0, saveMigrations:0, softRecoveries:0, hardFaults:0, lastSoftFaultAt:0, loopRecoveryPending:false, lastSaveStatus:'idle', lastFrame: 0, lastScene: 'boot', maxAircraft: 16, recovering:false, lastGoodState:null, diagnostics:[], perf:{badFrames:0, mode:'normal'} };
function safeLogError(err, where='runtime'){
  try{
    const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err);
    SAFE_MODE.errors.unshift({ where, msg: msg.slice(0,500), at: Date.now() });
    SAFE_MODE.errors = SAFE_MODE.errors.slice(0,8);
    localStorage.setItem('skywardLastError', JSON.stringify(SAFE_MODE.errors[0]));
  }catch(_e){}
}
function gameplaySceneActive(){
  try{return Boolean(document.querySelector('#game.screen.active') || document.body?.classList?.contains('game-active'));}catch(_e){return false;}
}
function hideCrashShield(){
  try{document.querySelector('#crashShield')?.classList.remove('open');}catch(_e){}
}
function scheduleLoopRecovery(){
  try{
    if(SAFE_MODE.loopRecoveryPending) return;
    let shouldResume=false;
    try{shouldResume=Boolean(running && gameplaySceneActive() && typeof loop==='function');}catch(_e){shouldResume=false;}
    if(!shouldResume) return;
    SAFE_MODE.loopRecoveryPending=true;
    requestAnimationFrame((t)=>{SAFE_MODE.loopRecoveryPending=false;try{loop(t);}catch(error){safeLogError(error,'loop-recovery-frame');}});
  }catch(error){safeLogError(error,'schedule-loop-recovery');}
}
function softRecoverRuntime(err, where='runtime'){
  safeLogError(err,where);
  SAFE_MODE.softRecoveries++;
  SAFE_MODE.lastSoftFaultAt=Date.now();
  hideCrashShield();
  try{
    if(typeof sanitizeAircraftList==='function') sanitizeAircraftList();
  }catch(error){safeLogError(error,'soft-recover-sanitize');}
  try{
    if(gameplaySceneActive() && typeof recoverGameplayState==='function') recoverGameplayState(`soft-${where}`);
  }catch(error){safeLogError(error,'soft-recover-gameplay');}
  try{
    if(typeof setDiagnostic==='function') setDiagnostic('INSTABILIDADE CORRIGIDA — TURNO PRESERVADO','warn');
    if(typeof addLog==='function' && gameplaySceneActive()) addLog('Sistema: falha temporária corrigida automaticamente. Turno preservado.','warn');
  }catch(_e){}
  scheduleLoopRecovery();
  return true;
}
function showSafeMode(err){
  // F62.1 hotfix: erro de runtime em gameplay não deve abrir pop-up bloqueante nem devolver ao lobby.
  return softRecoverRuntime(err,'safe-mode');
}
window.addEventListener('error', e=>{ softRecoverRuntime(e.error || e.message,'window-error'); try{e.preventDefault();}catch(_e){} });
window.addEventListener('unhandledrejection', e=>{ softRecoverRuntime(e.reason || 'Promise rejeitada','unhandled-rejection'); try{e.preventDefault();}catch(_e){} });
function safeStorageGet(key, fallback){ try{ const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ safeLogError(e,'storage-get'); return fallback; } }
function safeStorageSet(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); return true; }catch(e){ safeLogError(e,'storage-set'); return false; } }
function cloneSafe(value){ return JSON.parse(JSON.stringify(value)); }
function isValidSnapshot(snapshot){
  if(CONTRACTS?.validateSnapshot){
    const result=CONTRACTS.validateSnapshot(snapshot, BUILD_INFO.schema, 'snapshot');
    if(!result.ok) SAFE_MODE.contractFailures += result.issues.length;
    return result.ok;
  }
  return !!snapshot && snapshot.schema===BUILD_INFO.schema && Array.isArray(snapshot.aircraft) && Array.isArray(snapshot.requests) && Number.isFinite(Number(snapshot.score));
}
function clearGoodState(){
  SAFE_MODE.lastGoodState=null;
  SAFE_MODE.lastSaveStatus='cleared';
  lastSnapshotAt=0;
  try{
    saveVault()?.clear('snapshot');
    localStorage.removeItem(SNAPSHOT_KEY);
    LEGACY_SNAPSHOT_KEYS.forEach(key=>localStorage.removeItem(key));
  }catch(_e){}
}

function setDiagnostic(msg='SISTEMA OK', level='ok'){
  try{
    const d=document.querySelector('#opsDiagnostic');
    if(d){ d.textContent=msg; d.className='ops-diagnostic '+level; }
    SAFE_MODE.diagnostics.unshift({msg,level,at:Date.now()});
    SAFE_MODE.diagnostics=SAFE_MODE.diagnostics.slice(0,12);
  }catch(_e){}
}

function setReadback(text='', level='ok'){
  try{
    const el=document.querySelector('#readbackLine');
    if(!el) return;
    el.textContent = 'READBACK: ' + (text || 'aguardando transmissão.');
    el.className = 'readback-line ' + (level || 'ok');
  }catch(e){ safeLogError(e,'readback'); }
}
function atcReadbackFor(p, cmd){
  if(!p) return '';
  const req = requests.find(r=>r.id===p.id);
  if(cmd==='left' || cmd==='right') return `${p.id} rumo ${Math.round(p.heading)} graus.`;
  if(cmd==='slow' || cmd==='fast') return `${p.id} velocidade ${Math.round(p.speed)} nós.`;
  if(cmd==='climb' || cmd==='descend') return `${p.id} nível alvo FL${Math.round(p.targetAlt)}.`;
  if(cmd==='hold') return `${p.id} ${p.status==='HOLD'?'entrando em espera':'prosseguindo aproximação'}.`;
  if(cmd==='holdShort') return `${p.id} mantendo antes da pista ${runway.name}.`;
  if(cmd==='vectorFinal') return `${p.id} vetor final pista ${runway.name}.`;
  if(cmd==='goAround') return `${p.id} arremetendo, subindo FL080.`;
  if(cmd==='deny') return `${p.id} aguardando nova autorização.`;
  if(cmd==='emergency') return `${p.id} MAYDAY reconhecido, prioridade máxima.`;
  if(cmd==='clearLanding') return `${p.id} autorizado pouso pista ${runway.name}.`;
  if(cmd==='clearTakeoff') return `${p.id} autorizado decolagem pista ${runway.name}.`;
  if(cmd==='lineUp') return `${p.id} alinhar e aguardar pista ${runway.name}.`;
  if(cmd==='approveTaxi') return `${p.id} taxi autorizado para ponto de espera ${runway.name}.`;
  if(cmd==='approvePushback') return `${p.id} pushback aprovado.`;
  if(cmd==='clearEmergency') return `${p.id} pouso imediato autorizado.`;
  return `${p.id} comando ${cmd.toUpperCase()} recebido.`;
}

