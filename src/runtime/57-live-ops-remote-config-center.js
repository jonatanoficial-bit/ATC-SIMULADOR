/* @skyward-module 57-live-ops-remote-config-center
 * Live Ops Remote Config and feature flags center for pace, mobile guard, incident limiter, PWA update guard, diagnostics and kill-switches.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('57-live-ops-remote-config-center');
const LIVE_OPS_REMOTE_CONFIG_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f54',
  configProfiles:[
    {id:'SAFE_MOBILE',name:'Mobile seguro',paceScale:.58,maxAircraft:3,spawnSpacingSec:44,incidentCooldownSec:110,eventBurstLimit:2},
    {id:'BALANCED',name:'Balanceado',paceScale:.72,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:90,eventBurstLimit:3},
    {id:'REALISTIC_DESKTOP',name:'Desktop realista',paceScale:.88,maxAircraft:6,spawnSpacingSec:28,incidentCooldownSec:70,eventBurstLimit:4},
    {id:'TRAINING_EASY',name:'Treino fácil',paceScale:.52,maxAircraft:3,spawnSpacingSec:50,incidentCooldownSec:125,eventBurstLimit:2},
    {id:'LIVE_OPS_GUARD',name:'Guarda produção',paceScale:.62,maxAircraft:4,spawnSpacingSec:42,incidentCooldownSec:105,eventBurstLimit:2}
  ],
  featureFlags:[
    {id:'ADAPTIVE_PACE',name:'Ritmo adaptativo',default:true,scope:'runtime'},
    {id:'MOBILE_CONSERVATIVE_MODE',name:'Modo mobile conservador',default:true,scope:'mobile'},
    {id:'INCIDENT_LIMITER',name:'Limitador de incidentes',default:true,scope:'safety'},
    {id:'PWA_UPDATE_GUARD',name:'Guarda atualização PWA',default:true,scope:'pwa'},
    {id:'STABILITY_OBSERVATORY',name:'Observatório estabilidade',default:true,scope:'diagnostics'},
    {id:'AUTO_CACHE_MIGRATION_HINT',name:'Aviso migração cache',default:true,scope:'pwa'},
    {id:'AI_COPILOT_HINTS',name:'Dicas copiloto IA',default:true,scope:'training'},
    {id:'DENSE_TRAFFIC_MODE',name:'Tráfego denso',default:false,scope:'traffic'},
    {id:'EXPERIMENTAL_EVENTS',name:'Eventos experimentais',default:false,scope:'experimental'}
  ],
  remoteRules:[
    {id:'SAFE_MODE_AUTO_GUARD',name:'Se houver modo seguro, aplica perfil seguro',trigger:'safeModeCount>0',profile:'LIVE_OPS_GUARD'},
    {id:'MOBILE_LOW_PACE',name:'Mobile sempre inicia conservador',trigger:'device=mobile',profile:'SAFE_MOBILE'},
    {id:'CACHE_RISK_LOCKDOWN',name:'Cache antigo limita eventos',trigger:'oldBundleRisk>=35',profile:'LIVE_OPS_GUARD'},
    {id:'TRAINING_LOW_PRESSURE',name:'Treino reduz pressão',trigger:'mode=training',profile:'TRAINING_EASY'},
    {id:'DESKTOP_REALISM',name:'Desktop usa realismo moderado',trigger:'device=desktop',profile:'REALISTIC_DESKTOP'}
  ],
  killSwitches:[
    {id:'DISABLE_RANDOM_BURSTS',name:'Desativar rajadas aleatórias',enabled:true},
    {id:'DISABLE_EXPERIMENTAL_EVENTS',name:'Desativar eventos experimentais',enabled:true},
    {id:'LOCK_MOBILE_MAX_AIRCRAFT',name:'Travar máximo mobile',enabled:true},
    {id:'FORCE_PWA_UPDATE_CHECK',name:'Forçar checagem PWA',enabled:true}
  ],
  configBands:[
    {id:'PROTECTED',min:90,name:'Protegido'},
    {id:'CONTROLLED',min:75,name:'Controlado'},
    {id:'NEEDS_REVIEW',min:55,name:'Revisar'},
    {id:'UNGUARDED',min:0,name:'Sem guarda'}
  ]
});
const LIVE_OPS_REMOTE_CONFIG_KEY='skywardLiveOpsRemoteConfig_v1';
let liveOpsConfigState={schema:1,activeProfile:'BALANCED',configScore:82,status:'CONTROLLED',flags:{},killSwitches:{},appliedRules:[],overrides:{},history:[],lastEvaluation:null};
function defaultFlags(){return Object.fromEntries(LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.map(f=>[f.id,Boolean(f.default)]));}
function defaultSwitches(){return Object.fromEntries(LIVE_OPS_REMOTE_CONFIG_CATALOG.killSwitches.map(k=>[k.id,Boolean(k.enabled)]));}
function loadLiveOpsConfig(){
  try{
    if(!Object.keys(liveOpsConfigState.flags||{}).length) liveOpsConfigState.flags=defaultFlags();
    if(!Object.keys(liveOpsConfigState.killSwitches||{}).length) liveOpsConfigState.killSwitches=defaultSwitches();
    const raw=localStorage?.getItem?.(LIVE_OPS_REMOTE_CONFIG_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed?.schema===1) liveOpsConfigState={...liveOpsConfigState,...parsed,flags:{...defaultFlags(),...(parsed.flags||{})},killSwitches:{...defaultSwitches(),...(parsed.killSwitches||{})}};
    }
  }catch(e){safeLogError?.(e,'live-ops-config-load');}
  return liveOpsConfigState;
}
function saveLiveOpsConfig(){try{localStorage?.setItem?.(LIVE_OPS_REMOTE_CONFIG_KEY,JSON.stringify(liveOpsConfigState));}catch(e){safeLogError?.(e,'live-ops-config-save');}return liveOpsConfigState;}
function profileById(id){return LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.find(p=>p.id===id)||LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles[1];}
function configBand(score){return LIVE_OPS_REMOTE_CONFIG_CATALOG.configBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||LIVE_OPS_REMOTE_CONFIG_CATALOG.configBands.at(-1);}
function isMobileDevice(){
  try{
    const touch=('ontouchstart' in window)||Number(navigator?.maxTouchPoints||0)>0;
    const max=Math.max(Number(innerWidth||0),Number(innerHeight||0),Number(screen?.width||0),Number(screen?.height||0));
    return touch&&max<950;
  }catch(e){return false;}
}
function setLiveOpsFlag(id,value){
  loadLiveOpsConfig();
  if(!(id in liveOpsConfigState.flags)) liveOpsConfigState.flags[id]=false;
  liveOpsConfigState.flags[id]=Boolean(value);
  saveLiveOpsConfig();
  renderLiveOpsConfigBoard();
  return liveOpsConfigState.flags[id];
}
function setLiveOpsProfile(id='BALANCED'){
  loadLiveOpsConfig();
  liveOpsConfigState.activeProfile=profileById(id).id;
  applyLiveOpsProfile(liveOpsConfigState.activeProfile,'manual');
  return liveOpsConfigState;
}
function toggleKillSwitch(id,value){
  loadLiveOpsConfig();
  if(!(id in liveOpsConfigState.killSwitches)) liveOpsConfigState.killSwitches[id]=false;
  liveOpsConfigState.killSwitches[id]=Boolean(value);
  saveLiveOpsConfig();
  return liveOpsConfigState.killSwitches[id];
}
function collectLiveOpsSignals(){
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pwa=window.SKYWARD_PWA_UPDATE_MANAGER?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  return {
    mobile:isMobileDevice(),
    safeModeCount:Number(stability.safeModeCount||localStorage?.getItem?.('skywardSafeModeCount')||0),
    oldBundleRisk:Number(pwa.oldBundleRisk||0),
    workload:Number(pace.workload||0),
    pwaStatus:String(pwa.status||'UNKNOWN'),
    stabilityStatus:String(stability.status||'UNKNOWN')
  };
}
function resolveLiveOpsProfile(signals=collectLiveOpsSignals()){
  if(signals.safeModeCount>0) return {profile:'LIVE_OPS_GUARD',rule:'SAFE_MODE_AUTO_GUARD'};
  if(signals.oldBundleRisk>=35) return {profile:'LIVE_OPS_GUARD',rule:'CACHE_RISK_LOCKDOWN'};
  if(signals.mobile) return {profile:'SAFE_MOBILE',rule:'MOBILE_LOW_PACE'};
  if(signals.workload>=80) return {profile:'LIVE_OPS_GUARD',rule:'WORKLOAD_GUARD'};
  return {profile:'REALISTIC_DESKTOP',rule:'DESKTOP_REALISM'};
}
function applyLiveOpsProfile(id=liveOpsConfigState.activeProfile,reason='auto'){
  loadLiveOpsConfig();
  const profile=profileById(id);
  liveOpsConfigState.activeProfile=profile.id;
  liveOpsConfigState.overrides={
    paceScale:profile.paceScale,
    maxAircraft:profile.maxAircraft,
    spawnSpacingSec:profile.spawnSpacingSec,
    incidentCooldownSec:profile.incidentCooldownSec,
    eventBurstLimit:profile.eventBurstLimit
  };
  if(liveOpsConfigState.flags.ADAPTIVE_PACE!==false){
    window.SKYWARD_PACE_MULTIPLIER=profile.paceScale;
    window.SKYWARD_MAX_AIRCRAFT=profile.maxAircraft;
    window.SKYWARD_SPAWN_SPACING_MS=profile.spawnSpacingSec*1000;
    window.SKYWARD_INCIDENT_COOLDOWN_MS=profile.incidentCooldownSec*1000;
    try{
      const pace=window.SKYWARD_ADAPTIVE_PACE?.load?.();
      if(pace){
        pace.paceMultiplier=profile.paceScale;
        pace.maxAircraft=profile.maxAircraft;
        pace.spawnSpacingSec=profile.spawnSpacingSec;
        pace.incidentCooldownSec=profile.incidentCooldownSec;
        window.SKYWARD_ADAPTIVE_PACE?.save?.();
      }
    }catch(e){safeLogError?.(e,'live-ops-apply-pace');}
  }
  if(liveOpsConfigState.killSwitches.DISABLE_EXPERIMENTAL_EVENTS) liveOpsConfigState.flags.EXPERIMENTAL_EVENTS=false;
  if(liveOpsConfigState.killSwitches.DISABLE_RANDOM_BURSTS) window.SKYWARD_EVENT_BURST_LIMIT=profile.eventBurstLimit;
  const enabledFlags=Object.values(liveOpsConfigState.flags).filter(Boolean).length;
  const enabledSwitches=Object.values(liveOpsConfigState.killSwitches).filter(Boolean).length;
  const mobileGuard=liveOpsConfigState.flags.MOBILE_CONSERVATIVE_MODE&&profile.maxAircraft<=4?100:70;
  liveOpsConfigState.configScore=Math.max(0,Math.min(100,Math.round(68+enabledFlags*2.2+enabledSwitches*2.5+(mobileGuard-70)*.18-(liveOpsConfigState.flags.EXPERIMENTAL_EVENTS?8:0))));
  liveOpsConfigState.status=configBand(liveOpsConfigState.configScore).id;
  const item={at:new Date().toISOString(),build:BUILD,reason,profile:profile.id,configScore:liveOpsConfigState.configScore,status:liveOpsConfigState.status,overrides:liveOpsConfigState.overrides,flags:{...liveOpsConfigState.flags},killSwitches:{...liveOpsConfigState.killSwitches}};
  liveOpsConfigState.history.unshift(item);
  liveOpsConfigState.history=liveOpsConfigState.history.slice(0,80);
  liveOpsConfigState.lastEvaluation=item;
  saveLiveOpsConfig();
  renderLiveOpsConfigBoard();
  return item;
}
function evaluateLiveOpsConfig(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadLiveOpsConfig();
  const signals=collectLiveOpsSignals();
  const resolved=resolveLiveOpsProfile(signals);
  liveOpsConfigState.appliedRules.unshift({id:`LOR-${String(Date.now()).slice(-6)}`,ruleId:resolved.rule,profile:resolved.profile,signals,at:new Date().toISOString()});
  liveOpsConfigState.appliedRules=liveOpsConfigState.appliedRules.slice(0,80);
  const applied=applyLiveOpsProfile(resolved.profile,fail?'end-shift-fail':'end-shift');
  return {state:liveOpsConfigState,evaluation:{...applied,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),signals,rule:resolved.rule}};
}
function liveOpsConfigProgress(){
  loadLiveOpsConfig();
  return {score:liveOpsConfigState.configScore,status:liveOpsConfigState.status,activeProfile:liveOpsConfigState.activeProfile,enabledFlags:Object.values(liveOpsConfigState.flags||{}).filter(Boolean).length,enabledKillSwitches:Object.values(liveOpsConfigState.killSwitches||{}).filter(Boolean).length,paceScale:liveOpsConfigState.overrides?.paceScale||profileById(liveOpsConfigState.activeProfile).paceScale,maxAircraft:liveOpsConfigState.overrides?.maxAircraft||profileById(liveOpsConfigState.activeProfile).maxAircraft,incidentCooldownSec:liveOpsConfigState.overrides?.incidentCooldownSec||profileById(liveOpsConfigState.activeProfile).incidentCooldownSec,last:liveOpsConfigState.lastEvaluation||null};
}
function renderLiveOpsConfigBoard(){
  try{
    const anchor=document.querySelector('#pwaUpdateInline') || document.querySelector('#stabilityDiagnosticsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#liveOpsConfigInline'); if(old) old.remove();
    const p=liveOpsConfigProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="liveOpsConfigInline" class="airport-ops-board live-ops-config-inline">
      <div class="airport-ops-head"><b>LIVE OPS CFG</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PERFIL</small><b>${p.activeProfile}</b></div>
        <div><small>RITMO</small><b>${p.paceScale}x</b></div>
        <div><small>MAX AC</small><b>${p.maxAircraft}</b></div>
        <div><small>FLAGS</small><b>${p.enabledFlags}</b></div>
        <div><small>KILL</small><b>${p.enabledKillSwitches}</b></div>
        <div><small>INCID.</small><b>${p.incidentCooldownSec}s</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'live-ops-config-board');}
}
function initializeLiveOpsConfig(){
  loadLiveOpsConfig();
  const resolved=resolveLiveOpsProfile();
  liveOpsConfigState.appliedRules.unshift({id:`LOR-${String(Date.now()).slice(-6)}`,ruleId:resolved.rule,profile:resolved.profile,signals:collectLiveOpsSignals(),at:new Date().toISOString()});
  applyLiveOpsProfile(resolved.profile,'init');
  return liveOpsConfigState;
}
function liveOpsConfigStatus(){loadLiveOpsConfig();return {...liveOpsConfigState,progress:liveOpsConfigProgress(),catalog:LIVE_OPS_REMOTE_CONFIG_CATALOG};}
function liveOpsConfigSelfCheck(){
  const issues=[];
  if(LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.length<5) issues.push('perfis insuficientes');
  if(LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.length<9) issues.push('flags insuficientes');
  const applied=applyLiveOpsProfile('SAFE_MOBILE','self-check');
  if(!Number.isFinite(applied.overrides.paceScale)||applied.overrides.maxAircraft>4) issues.push('perfil seguro inválido');
  setLiveOpsFlag('EXPERIMENTAL_EVENTS',true);
  toggleKillSwitch('DISABLE_EXPERIMENTAL_EVENTS',true);
  const guarded=applyLiveOpsProfile('LIVE_OPS_GUARD','self-check-guard');
  if(guarded.flags.EXPERIMENTAL_EVENTS!==false) issues.push('kill switch falhou');
  return {ok:issues.length===0,issues,profiles:LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.length,flags:LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.length};
}
window.SKYWARD_LIVE_OPS_CONFIG=Object.freeze({
  schema:1,
  catalog:LIVE_OPS_REMOTE_CONFIG_CATALOG,
  load:loadLiveOpsConfig,
  save:saveLiveOpsConfig,
  init:initializeLiveOpsConfig,
  setFlag:setLiveOpsFlag,
  setProfile:setLiveOpsProfile,
  killSwitch:toggleKillSwitch,
  signals:collectLiveOpsSignals,
  resolve:resolveLiveOpsProfile,
  apply:applyLiveOpsProfile,
  evaluate:evaluateLiveOpsConfig,
  progress:liveOpsConfigProgress,
  status:liveOpsConfigStatus,
  board:renderLiveOpsConfigBoard,
  selfCheck:liveOpsConfigSelfCheck
});
