/* @skyward-module 55-stability-observatory-diagnostics-center
 * Stability observatory and diagnostics center with local telemetry, safe-mode reports, PWA cache checks, runtime health and recovery recommendations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('55-stability-observatory-diagnostics-center');
const STABILITY_DIAGNOSTICS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f52',
  diagnosticSignals:[
    {id:'SAFE_MODE_COUNT',name:'Contador modo seguro',weight:18,target:0},
    {id:'RUNTIME_ERRORS',name:'Erros runtime',weight:18,target:0},
    {id:'SESSION_HEALTH',name:'Saúde sessão',weight:14,target:92},
    {id:'PWA_CACHE_HEALTH',name:'Saúde cache PWA',weight:12,target:90},
    {id:'FRAME_STABILITY',name:'Estabilidade visual',weight:12,target:85},
    {id:'RECOVERY_READINESS',name:'Prontidão recuperação',weight:10,target:90},
    {id:'MOBILE_MEMORY_GUARD',name:'Guarda memória mobile',weight:8,target:82},
    {id:'EVENT_QUEUE_HEALTH',name:'Fila eventos',weight:8,target:85}
  ],
  failureTypes:[
    {id:'CONST_ASSIGNMENT',name:'Assignment to constant variable',severity:34,hint:'Variável constante recebendo nova atribuição.'},
    {id:'NULL_DOM',name:'Elemento visual ausente',severity:20,hint:'Elemento DOM não encontrado em atualização.'},
    {id:'PWA_OLD_CACHE',name:'Cache antigo PWA',severity:24,hint:'Service worker ou cache antigo pode servir bundle obsoleto.'},
    {id:'EVENT_BURST',name:'Explosão de eventos',severity:26,hint:'Eventos excessivos em curto intervalo.'},
    {id:'MOBILE_OVERLOAD',name:'Sobrecarga mobile',severity:28,hint:'Dispositivo móvel saturado.'},
    {id:'SAVE_CORRUPTION',name:'Save inconsistente',severity:32,hint:'Estado persistido inválido.'},
    {id:'RENDER_LOOP_DROP',name:'Queda loop render',severity:22,hint:'Loop visual com FPS irregular.'}
  ],
  recoveryActions:[
    {id:'CLEAR_OLD_CACHE',name:'Limpar cache antigo',impact:12},
    {id:'RESTORE_SAFE_STATE',name:'Restaurar estado seguro',impact:16},
    {id:'REDUCE_PACE',name:'Reduzir ritmo',impact:14},
    {id:'LIMIT_EVENTS',name:'Limitar eventos',impact:12},
    {id:'REBUILD_SESSION',name:'Reconstruir sessão',impact:18},
    {id:'EXPORT_DIAGNOSTIC',name:'Exportar diagnóstico',impact:8}
  ],
  healthBands:[
    {id:'STABLE',min:90,name:'Estável'},
    {id:'WATCH',min:75,name:'Em observação'},
    {id:'DEGRADED',min:55,name:'Degradado'},
    {id:'UNSTABLE',min:0,name:'Instável'}
  ]
});
const STABILITY_DIAGNOSTICS_KEY='skywardStabilityDiagnostics_v1';
let stabilityState={schema:1,stabilityScore:88,status:'WATCH',safeModeCount:0,runtimeErrors:[],recoveryActions:[],sessionHealth:90,pwaCacheHealth:88,frameStability:84,mobileMemoryGuard:82,eventQueueHealth:84,recoveryReadiness:88,lastDiagnostic:null,history:[]};
function loadStabilityDiagnostics(){try{const raw=localStorage?.getItem?.(STABILITY_DIAGNOSTICS_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)stabilityState={...stabilityState,...parsed};}}catch(e){safeLogError?.(e,'stability-load');}return stabilityState;}
function saveStabilityDiagnostics(){try{localStorage?.setItem?.(STABILITY_DIAGNOSTICS_KEY,JSON.stringify(stabilityState));}catch(e){safeLogError?.(e,'stability-save');}return stabilityState;}
function stabilityBand(score){return STABILITY_DIAGNOSTICS_CATALOG.healthBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||STABILITY_DIAGNOSTICS_CATALOG.healthBands.at(-1);}
function classifyError(message=''){
  const txt=String(message||'').toLowerCase();
  if(txt.includes('assignment to constant')) return 'CONST_ASSIGNMENT';
  if(txt.includes('null')||txt.includes('undefined')||txt.includes('queryselector')) return 'NULL_DOM';
  if(txt.includes('cache')||txt.includes('service worker')) return 'PWA_OLD_CACHE';
  if(txt.includes('quota')||txt.includes('storage')||txt.includes('save')) return 'SAVE_CORRUPTION';
  return 'RENDER_LOOP_DROP';
}
function failureById(id){return STABILITY_DIAGNOSTICS_CATALOG.failureTypes.find(f=>f.id===id)||STABILITY_DIAGNOSTICS_CATALOG.failureTypes.at(-1);}
function recordRuntimeError(error,context='runtime'){
  loadStabilityDiagnostics();
  const message=String(error?.message||error||'erro desconhecido').slice(0,220);
  const failure=failureById(classifyError(message));
  const item={id:`ERR-${String(Date.now()).slice(-6)}`,type:failure.id,name:failure.name,severity:failure.severity,message,context,at:new Date().toISOString(),build:BUILD};
  stabilityState.runtimeErrors.unshift(item);
  stabilityState.runtimeErrors=stabilityState.runtimeErrors.slice(0,60);
  if(failure.id==='CONST_ASSIGNMENT'||failure.id==='PWA_OLD_CACHE'){
    stabilityState.recoveryActions.unshift({id:`REC-${String(Date.now()).slice(-6)}`,actionId:failure.id==='PWA_OLD_CACHE'?'CLEAR_OLD_CACHE':'REBUILD_SESSION',reason:failure.name,status:'SUGGESTED',at:item.at});
  }
  stabilityState.recoveryActions=stabilityState.recoveryActions.slice(0,60);
  saveStabilityDiagnostics();
  return item;
}
function recordSafeMode(reason='unknown'){
  loadStabilityDiagnostics();
  stabilityState.safeModeCount=Number(stabilityState.safeModeCount||0)+1;
  try{localStorage?.setItem?.('skywardSafeModeCount',String(stabilityState.safeModeCount));}catch(e){}
  stabilityState.recoveryActions.unshift({id:`REC-${String(Date.now()).slice(-6)}`,actionId:'RESTORE_SAFE_STATE',reason,status:'SUGGESTED',at:new Date().toISOString()});
  saveStabilityDiagnostics();
  return stabilityState.safeModeCount;
}
function clearDiagnostics(){
  loadStabilityDiagnostics();
  stabilityState.runtimeErrors=[];
  stabilityState.recoveryActions=[];
  stabilityState.safeModeCount=0;
  try{localStorage?.setItem?.('skywardSafeModeCount','0');}catch(e){}
  return saveStabilityDiagnostics();
}
function checkPwaCacheHealth(){
  let health=88;
  try{
    const cacheName=window.SKYWARD_CACHE_NAME||window.SKYWARD_BUILD_INFO?.cacheName||'';
    const buildInfo=window.SKYWARD_BUILD_INFO?.build||BUILD;
    if(cacheName && !String(cacheName).includes(String(buildInfo).toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,18))) health-=6;
    if(!('serviceWorker' in navigator)) health-=8;
    if(!('caches' in window)) health-=8;
  }catch(e){health-=10;}
  return Math.max(0,Math.min(100,Math.round(health)));
}
function estimateFrameStability(){
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const workload=Number(pace.workload||0);
  const score=90-workload*.22-Number(stabilityState.runtimeErrors.length||0)*1.6;
  return Math.max(0,Math.min(100,Math.round(score)));
}
function estimateEventQueueHealth(){
  const pending=Array.isArray(window.pendingRequests)?window.pendingRequests.length:0;
  const planes=Array.isArray(window.planes)?window.planes.length:0;
  const max=Number(window.SKYWARD_MAX_AIRCRAFT||6);
  const pressure=Math.max(0,planes-max)*12+pending*6;
  return Math.max(0,Math.min(100,Math.round(92-pressure)));
}
function runStabilityDiagnostic(reason='manual'){
  loadStabilityDiagnostics();
  const safeMode=Number(localStorage?.getItem?.('skywardSafeModeCount')||stabilityState.safeModeCount||0);
  const runtimeSeverity=stabilityState.runtimeErrors.slice(0,12).reduce((a,e)=>a+Number(e.severity||0),0);
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const mobileScore=Number(pace.score||82);
  stabilityState.safeModeCount=safeMode;
  stabilityState.pwaCacheHealth=checkPwaCacheHealth();
  stabilityState.frameStability=estimateFrameStability();
  stabilityState.eventQueueHealth=estimateEventQueueHealth();
  stabilityState.mobileMemoryGuard=Math.max(0,Math.min(100,Math.round(mobileScore-Number(stabilityState.runtimeErrors.length||0)*1.5)));
  stabilityState.recoveryReadiness=Math.max(0,Math.min(100,Math.round(90+stabilityState.recoveryActions.length*1.2-safeMode*8)));
  stabilityState.sessionHealth=Math.max(0,Math.min(100,Math.round(92-safeMode*12-runtimeSeverity/18)));
  const weighted=Math.round(
    Math.max(0,100-safeMode*18)*.18+
    Math.max(0,100-runtimeSeverity/3)*.18+
    stabilityState.sessionHealth*.14+
    stabilityState.pwaCacheHealth*.12+
    stabilityState.frameStability*.12+
    stabilityState.recoveryReadiness*.10+
    stabilityState.mobileMemoryGuard*.08+
    stabilityState.eventQueueHealth*.08
  );
  stabilityState.stabilityScore=Math.max(0,Math.min(100,weighted));
  stabilityState.status=stabilityBand(stabilityState.stabilityScore).id;
  const diagnostic={at:new Date().toISOString(),build:BUILD,reason,stabilityScore:stabilityState.stabilityScore,status:stabilityState.status,safeModeCount:safeMode,runtimeErrors:stabilityState.runtimeErrors.length,sessionHealth:stabilityState.sessionHealth,pwaCacheHealth:stabilityState.pwaCacheHealth,frameStability:stabilityState.frameStability,mobileMemoryGuard:stabilityState.mobileMemoryGuard,eventQueueHealth:stabilityState.eventQueueHealth,recoveryReadiness:stabilityState.recoveryReadiness};
  stabilityState.lastDiagnostic=diagnostic;
  stabilityState.history.unshift(diagnostic);
  stabilityState.history=stabilityState.history.slice(0,80);
  saveStabilityDiagnostics();
  renderStabilityDiagnosticsBoard();
  return diagnostic;
}
function exportStabilityDiagnostic(){
  loadStabilityDiagnostics();
  return {schema:1,build:BUILD,at:new Date().toISOString(),state:stabilityState,catalogVersion:STABILITY_DIAGNOSTICS_CATALOG.version,userAgent:String(navigator?.userAgent||''),viewport:{w:Number(innerWidth||0),h:Number(innerHeight||0)},pace:window.SKYWARD_ADAPTIVE_PACE?.progress?.()||null};
}
function evaluateStabilityDiagnostics(finalScore=0,statsObj={},fail=false,airportCode=''){
  if(fail) recordSafeMode('end-shift-fail');
  const diagnostic=runStabilityDiagnostic('end-shift');
  return {state:stabilityState,evaluation:{...diagnostic,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0)}};
}
function stabilityDiagnosticsProgress(){
  loadStabilityDiagnostics();
  return {score:stabilityState.stabilityScore,status:stabilityState.status,safeModeCount:stabilityState.safeModeCount,runtimeErrors:stabilityState.runtimeErrors.length,sessionHealth:stabilityState.sessionHealth,pwaCacheHealth:stabilityState.pwaCacheHealth,frameStability:stabilityState.frameStability,mobileMemoryGuard:stabilityState.mobileMemoryGuard,recoveryActions:stabilityState.recoveryActions.length,last:stabilityState.lastDiagnostic||null};
}
function renderStabilityDiagnosticsBoard(){
  try{
    const anchor=document.querySelector('#adaptivePaceInline') || document.querySelector('#nonAeroRevenueInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#stabilityDiagnosticsInline'); if(old) old.remove();
    const p=stabilityDiagnosticsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="stabilityDiagnosticsInline" class="airport-ops-board stability-diagnostics-inline">
      <div class="airport-ops-head"><b>STABILITY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SAÚDE</small><b>${p.score}%</b></div>
        <div><small>SAFE</small><b>${p.safeModeCount}</b></div>
        <div><small>ERROS</small><b>${p.runtimeErrors}</b></div>
        <div><small>PWA</small><b>${p.pwaCacheHealth}%</b></div>
        <div><small>FRAME</small><b>${p.frameStability}%</b></div>
        <div><small>REC.</small><b>${p.recoveryActions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'stability-board'); }
}
function installStabilityHooks(){
  if(window.__skywardStabilityHooksInstalled) return true;
  window.__skywardStabilityHooksInstalled=true;
  try{
    window.addEventListener?.('error',event=>recordRuntimeError(event?.error||event?.message,'window-error'));
    window.addEventListener?.('unhandledrejection',event=>recordRuntimeError(event?.reason||'unhandled rejection','promise'));
  }catch(e){}
  return true;
}
function initializeStabilityDiagnostics(){
  loadStabilityDiagnostics();
  installStabilityHooks();
  runStabilityDiagnostic('init');
  return stabilityState;
}
function stabilityDiagnosticsStatus(){loadStabilityDiagnostics();return {...stabilityState,progress:stabilityDiagnosticsProgress(),catalog:STABILITY_DIAGNOSTICS_CATALOG};}
function stabilityDiagnosticsSelfCheck(){
  const issues=[];
  if(STABILITY_DIAGNOSTICS_CATALOG.diagnosticSignals.length<8) issues.push('sinais insuficientes');
  if(STABILITY_DIAGNOSTICS_CATALOG.failureTypes.length<7) issues.push('falhas insuficientes');
  const err=recordRuntimeError(new Error('Assignment to constant variable'),'self-check');
  const diagnostic=runStabilityDiagnostic('self-check');
  if(!err.id) issues.push('erro não registrado');
  if(!Number.isFinite(diagnostic.stabilityScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,signals:STABILITY_DIAGNOSTICS_CATALOG.diagnosticSignals.length,failures:STABILITY_DIAGNOSTICS_CATALOG.failureTypes.length};
}
window.SKYWARD_STABILITY_DIAGNOSTICS=Object.freeze({
  schema:1,
  catalog:STABILITY_DIAGNOSTICS_CATALOG,
  load:loadStabilityDiagnostics,
  save:saveStabilityDiagnostics,
  init:initializeStabilityDiagnostics,
  hook:installStabilityHooks,
  error:recordRuntimeError,
  safeMode:recordSafeMode,
  clear:clearDiagnostics,
  diagnose:runStabilityDiagnostic,
  export:exportStabilityDiagnostic,
  evaluate:evaluateStabilityDiagnostics,
  progress:stabilityDiagnosticsProgress,
  status:stabilityDiagnosticsStatus,
  board:renderStabilityDiagnosticsBoard,
  selfCheck:stabilityDiagnosticsSelfCheck
});
