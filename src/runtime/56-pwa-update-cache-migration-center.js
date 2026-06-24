/* @skyward-module 56-pwa-update-cache-migration-center
 * PWA update manager with cache migration, stale bundle guard, service worker health, safe cleanup and mobile reload guidance.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('56-pwa-update-cache-migration-center');
const PWA_UPDATE_MANAGER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f53',
  updateSignals:[
    {id:'BUILD_MATCH',name:'Build atual carregado',weight:18,target:100},
    {id:'CACHE_MATCH',name:'Cache corresponde ao build',weight:16,target:100},
    {id:'SERVICE_WORKER_HEALTH',name:'Saúde service worker',weight:14,target:90},
    {id:'OLD_BUNDLE_RISK',name:'Risco bundle antigo',weight:16,target:0},
    {id:'PWA_INSTALL_STATE',name:'Estado instalação PWA',weight:10,target:85},
    {id:'OFFLINE_READY',name:'Pronto offline',weight:10,target:90},
    {id:'CACHE_CLEANUP_READY',name:'Limpeza segura pronta',weight:8,target:90},
    {id:'MIGRATION_STATUS',name:'Migração de cache',weight:8,target:100}
  ],
  cacheRisks:[
    {id:'OLD_MAIN_JS',name:'main.js antigo',severity:34,action:'CLEAR_AND_RELOAD'},
    {id:'OLD_SERVICE_WORKER',name:'service worker antigo',severity:30,action:'UPDATE_SW'},
    {id:'MIXED_CACHE',name:'cache misto de builds',severity:28,action:'MIGRATE_CACHE'},
    {id:'PWA_INSTALLED_OLD',name:'PWA instalado antigo',severity:26,action:'REINSTALL_PWA'},
    {id:'OFFLINE_STALE',name:'offline obsoleto',severity:22,action:'REFRESH_OFFLINE_CACHE'},
    {id:'NO_CACHE_API',name:'Cache API indisponível',severity:14,action:'ONLINE_ONLY'}
  ],
  updateActions:[
    {id:'CHECK_UPDATE',name:'Verificar atualização',impact:8},
    {id:'CLEAR_AND_RELOAD',name:'Limpar cache e recarregar',impact:18},
    {id:'UPDATE_SW',name:'Atualizar service worker',impact:16},
    {id:'MIGRATE_CACHE',name:'Migrar cache para build atual',impact:14},
    {id:'REINSTALL_PWA',name:'Reinstalar PWA/atalho',impact:12},
    {id:'REFRESH_OFFLINE_CACHE',name:'Recriar cache offline',impact:10},
    {id:'EXPORT_UPDATE_REPORT',name:'Exportar relatório update',impact:6}
  ],
  updateBands:[
    {id:'CURRENT',min:90,name:'Atualizado'},
    {id:'SYNCING',min:75,name:'Sincronizando'},
    {id:'STALE_RISK',min:55,name:'Risco cache antigo'},
    {id:'OUTDATED',min:0,name:'Desatualizado'}
  ]
});
const PWA_UPDATE_KEY='skywardPwaUpdateManager_v1';
let pwaUpdateState={schema:1,updateScore:84,status:'SYNCING',loadedBuild:'',expectedBuild:'',cacheName:'',serviceWorkerState:'unknown',cacheVersionMatch:false,oldBundleRisk:0,pwaInstalled:false,offlineReady:false,migrationReady:true,safeReloadReady:true,actions:[],risks:[],history:[],lastCheck:null};
function loadPwaUpdateManager(){try{const raw=localStorage?.getItem?.(PWA_UPDATE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)pwaUpdateState={...pwaUpdateState,...parsed};}}catch(e){safeLogError?.(e,'pwa-update-load');}return pwaUpdateState;}
function savePwaUpdateManager(){try{localStorage?.setItem?.(PWA_UPDATE_KEY,JSON.stringify(pwaUpdateState));}catch(e){safeLogError?.(e,'pwa-update-save');}return pwaUpdateState;}
function updateBand(score){return PWA_UPDATE_MANAGER_CATALOG.updateBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||PWA_UPDATE_MANAGER_CATALOG.updateBands.at(-1);}
function normalizeBuild(v=''){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function detectPwaInstalled(){try{return Boolean(window.matchMedia?.('(display-mode: standalone)')?.matches||navigator?.standalone);}catch(e){return false;}}
async function listCacheNamesSafe(){try{if(!('caches' in window)) return []; return await caches.keys();}catch(e){return [];}}
function inferCurrentCacheName(){try{return window.SKYWARD_CACHE_NAME||window.SKYWARD_BUILD_INFO?.cacheName||`skyward-control-1-${normalizeBuild(BUILD)}`;}catch(e){return `skyward-control-1-${normalizeBuild(BUILD)}`;}}
async function checkPwaUpdateState(reason='manual'){
  loadPwaUpdateManager();
  const expected=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const loaded=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const cacheName=inferCurrentCacheName();
  const cacheNames=await listCacheNamesSafe();
  const normalizedExpected=normalizeBuild(expected);
  const matchingCache=cacheNames.some(n=>normalizeBuild(n).includes(normalizedExpected.slice(0,22))||String(n)===cacheName);
  const oldSkywardCaches=cacheNames.filter(n=>String(n).toLowerCase().includes('skyward')&&!normalizeBuild(n).includes(normalizedExpected.slice(0,12)));
  const swReady=Boolean('serviceWorker' in navigator);
  let swState='none';
  try{swState=navigator.serviceWorker?.controller?'controlled':(swReady?'available':'none');}catch(e){swState='unknown';}
  const pwaInstalled=detectPwaInstalled();
  const offlineReady=Boolean(matchingCache && cacheNames.length);
  const oldBundleRisk=Math.max(0,Math.min(100,oldSkywardCaches.length*18 + (!matchingCache?28:0) + (!swReady?10:0)));
  const risks=[];
  if(!matchingCache) risks.push({id:'OLD_MAIN_JS',name:'main.js/cache não confirmado',severity:34,action:'CLEAR_AND_RELOAD'});
  if(oldSkywardCaches.length) risks.push({id:'MIXED_CACHE',name:'Caches antigos detectados',severity:28,action:'MIGRATE_CACHE',caches:oldSkywardCaches.slice(0,6)});
  if(swReady && swState!=='controlled') risks.push({id:'OLD_SERVICE_WORKER',name:'Service worker não controla a sessão',severity:18,action:'UPDATE_SW'});
  if(!('caches' in window)) risks.push({id:'NO_CACHE_API',name:'Cache API indisponível',severity:14,action:'ONLINE_ONLY'});
  if(pwaInstalled && oldBundleRisk>=35) risks.push({id:'PWA_INSTALLED_OLD',name:'PWA instalado pode estar obsoleto',severity:26,action:'REINSTALL_PWA'});
  const riskPenalty=risks.reduce((a,r)=>a+Number(r.severity||0),0);
  const updateScore=Math.max(0,Math.min(100,Math.round(
    (loaded===expected?24:10)+
    (matchingCache?22:6)+
    (swReady?14:5)+
    (offlineReady?12:4)+
    (pwaInstalled?8:7)+
    Math.max(0,20-riskPenalty*.18)
  )));
  const suggested=[];
  if(risks.some(r=>r.action==='CLEAR_AND_RELOAD')) suggested.push({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'CLEAR_AND_RELOAD',name:'Limpar cache e recarregar',status:'SUGGESTED',at:new Date().toISOString()});
  if(risks.some(r=>r.action==='MIGRATE_CACHE')) suggested.push({id:`UPD-${String(Date.now()+1).slice(-6)}`,actionId:'MIGRATE_CACHE',name:'Migrar cache para build atual',status:'SUGGESTED',at:new Date().toISOString()});
  if(risks.some(r=>r.action==='REINSTALL_PWA')) suggested.push({id:`UPD-${String(Date.now()+2).slice(-6)}`,actionId:'REINSTALL_PWA',name:'Reinstalar PWA/atalho',status:'SUGGESTED',at:new Date().toISOString()});
  pwaUpdateState.expectedBuild=expected;
  pwaUpdateState.loadedBuild=loaded;
  pwaUpdateState.cacheName=cacheName;
  pwaUpdateState.serviceWorkerState=swState;
  pwaUpdateState.cacheVersionMatch=matchingCache;
  pwaUpdateState.oldBundleRisk=oldBundleRisk;
  pwaUpdateState.pwaInstalled=pwaInstalled;
  pwaUpdateState.offlineReady=offlineReady;
  pwaUpdateState.migrationReady=Boolean('caches' in window);
  pwaUpdateState.safeReloadReady=true;
  pwaUpdateState.risks=risks.slice(0,20);
  pwaUpdateState.actions=[...suggested,...pwaUpdateState.actions].slice(0,50);
  pwaUpdateState.updateScore=updateScore;
  pwaUpdateState.status=updateBand(updateScore).id;
  const item={at:new Date().toISOString(),build:BUILD,reason,updateScore,status:pwaUpdateState.status,loadedBuild:loaded,expectedBuild:expected,cacheName,cacheNames:cacheNames.slice(0,20),cacheVersionMatch:matchingCache,oldSkywardCaches:oldSkywardCaches.slice(0,20),oldBundleRisk,pwaInstalled,offlineReady,serviceWorkerState:swState,risks:risks.length};
  pwaUpdateState.lastCheck=item;
  pwaUpdateState.history.unshift(item);
  pwaUpdateState.history=pwaUpdateState.history.slice(0,80);
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  try{window.SKYWARD_STABILITY_DIAGNOSTICS?.diagnose?.('pwa-update-check');}catch(e){}
  return item;
}
async function migratePwaCache(){
  loadPwaUpdateManager();
  const cacheNames=await listCacheNamesSafe();
  const expected=normalizeBuild(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const old=cacheNames.filter(n=>String(n).toLowerCase().includes('skyward')&&!normalizeBuild(n).includes(expected.slice(0,12)));
  let deleted=0;
  try{
    for(const name of old){ if(await caches.delete(name)) deleted++; }
  }catch(e){ try{window.SKYWARD_STABILITY_DIAGNOSTICS?.error?.(e,'pwa-cache-migration');}catch(_){} }
  pwaUpdateState.actions.unshift({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'MIGRATE_CACHE',name:`Caches antigos removidos: ${deleted}`,status:'DONE',at:new Date().toISOString()});
  savePwaUpdateManager();
  return await checkPwaUpdateState('migrate-cache');
}
async function clearPwaCacheAndReload(reload=false){
  loadPwaUpdateManager();
  let deleted=0;
  try{
    const names=await listCacheNamesSafe();
    for(const name of names){ if(String(name).toLowerCase().includes('skyward') && await caches.delete(name)) deleted++; }
    const regs=await navigator.serviceWorker?.getRegistrations?.();
    if(Array.isArray(regs)){for(const reg of regs){try{await reg.update?.();}catch(e){}}}
  }catch(e){ try{window.SKYWARD_STABILITY_DIAGNOSTICS?.error?.(e,'pwa-clear-cache');}catch(_){} }
  pwaUpdateState.actions.unshift({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'CLEAR_AND_RELOAD',name:`Cache limpo: ${deleted}`,status:'DONE',at:new Date().toISOString()});
  savePwaUpdateManager();
  if(reload){try{location.reload();}catch(e){}}
  return await checkPwaUpdateState('clear-cache');
}
function exportPwaUpdateReport(){
  loadPwaUpdateManager();
  return {schema:1,build:BUILD,at:new Date().toISOString(),state:pwaUpdateState,userAgent:String(navigator?.userAgent||''),viewport:{w:Number(innerWidth||0),h:Number(innerHeight||0)},buildInfo:window.SKYWARD_BUILD_INFO||null};
}
function evaluatePwaUpdateManager(finalScore=0,statsObj={},fail=false,airportCode=''){
  const sync={...pwaUpdateState,lastCheck:pwaUpdateState.lastCheck||null};
  // keep evaluation synchronous for end-screen; async checker updates board separately.
  const evalObj={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),updateScore:sync.updateScore,status:sync.status,oldBundleRisk:sync.oldBundleRisk,cacheVersionMatch:sync.cacheVersionMatch,pwaInstalled:sync.pwaInstalled,offlineReady:sync.offlineReady,risks:sync.risks?.length||0};
  pwaUpdateState.lastCheck=evalObj;
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  return {state:pwaUpdateState,evaluation:evalObj};
}
function pwaUpdateProgress(){
  loadPwaUpdateManager();
  return {score:pwaUpdateState.updateScore,status:pwaUpdateState.status,oldBundleRisk:pwaUpdateState.oldBundleRisk,cacheVersionMatch:pwaUpdateState.cacheVersionMatch,serviceWorkerState:pwaUpdateState.serviceWorkerState,pwaInstalled:pwaUpdateState.pwaInstalled,offlineReady:pwaUpdateState.offlineReady,risks:pwaUpdateState.risks.length,actions:pwaUpdateState.actions.length,last:pwaUpdateState.lastCheck||null};
}
function renderPwaUpdateBoard(){
  try{
    const anchor=document.querySelector('#stabilityDiagnosticsInline') || document.querySelector('#adaptivePaceInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#pwaUpdateInline'); if(old) old.remove();
    const p=pwaUpdateProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="pwaUpdateInline" class="airport-ops-board pwa-update-inline">
      <div class="airport-ops-head"><b>PWA UPDATE</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>UPDATE</small><b>${p.score}%</b></div>
        <div><small>CACHE</small><b>${p.cacheVersionMatch?'OK':'OLD'}</b></div>
        <div><small>SW</small><b>${p.serviceWorkerState}</b></div>
        <div><small>RISCO</small><b>${p.oldBundleRisk}</b></div>
        <div><small>PWA</small><b>${p.pwaInstalled?'SIM':'WEB'}</b></div>
        <div><small>AÇÕES</small><b>${p.actions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'pwa-update-board'); }
}
function initializePwaUpdateManager(){
  loadPwaUpdateManager();
  pwaUpdateState.expectedBuild=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  pwaUpdateState.loadedBuild=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  pwaUpdateState.cacheName=inferCurrentCacheName();
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  checkPwaUpdateState('init');
  return pwaUpdateState;
}
function pwaUpdateStatus(){loadPwaUpdateManager();return {...pwaUpdateState,progress:pwaUpdateProgress(),catalog:PWA_UPDATE_MANAGER_CATALOG};}
function pwaUpdateSelfCheck(){
  const issues=[];
  if(PWA_UPDATE_MANAGER_CATALOG.updateSignals.length<8) issues.push('sinais insuficientes');
  if(PWA_UPDATE_MANAGER_CATALOG.cacheRisks.length<6) issues.push('riscos insuficientes');
  const progress=pwaUpdateProgress();
  if(!Number.isFinite(progress.score)) issues.push('score inválido');
  return {ok:issues.length===0,issues,signals:PWA_UPDATE_MANAGER_CATALOG.updateSignals.length,risks:PWA_UPDATE_MANAGER_CATALOG.cacheRisks.length};
}
window.SKYWARD_PWA_UPDATE_MANAGER=Object.freeze({
  schema:1,
  catalog:PWA_UPDATE_MANAGER_CATALOG,
  load:loadPwaUpdateManager,
  save:savePwaUpdateManager,
  init:initializePwaUpdateManager,
  check:checkPwaUpdateState,
  migrate:migratePwaCache,
  clear:clearPwaCacheAndReload,
  export:exportPwaUpdateReport,
  evaluate:evaluatePwaUpdateManager,
  progress:pwaUpdateProgress,
  status:pwaUpdateStatus,
  board:renderPwaUpdateBoard,
  selfCheck:pwaUpdateSelfCheck
});
