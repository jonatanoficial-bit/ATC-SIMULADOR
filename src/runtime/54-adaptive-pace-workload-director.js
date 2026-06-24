/* @skyward-module 54-adaptive-pace-workload-director
 * Adaptive pace and workload director for mobile balance, event spacing, aircraft caps, incident cooldowns and safe-mode guard.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('54-adaptive-pace-workload-director');
const ADAPTIVE_PACE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f51',
  deviceProfiles:[
    {id:'MOBILE_LOW',name:'Mobile baixo desempenho',paceMultiplier:.52,maxAircraft:3,spawnSpacingSec:42,incidentCooldownSec:95},
    {id:'MOBILE_STANDARD',name:'Mobile padrão',paceMultiplier:.62,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:85},
    {id:'TABLET',name:'Tablet',paceMultiplier:.74,maxAircraft:5,spawnSpacingSec:30,incidentCooldownSec:74},
    {id:'DESKTOP_STANDARD',name:'Desktop padrão',paceMultiplier:.88,maxAircraft:6,spawnSpacingSec:24,incidentCooldownSec:62},
    {id:'DESKTOP_PRO',name:'Desktop avançado',paceMultiplier:1,maxAircraft:8,spawnSpacingSec:20,incidentCooldownSec:55}
  ],
  workloadBands:[
    {id:'CALM',min:0,max:34,name:'Calmo'},
    {id:'CONTROLLED',min:35,max:59,name:'Controlado'},
    {id:'BUSY',min:60,max:79,name:'Ocupado'},
    {id:'SATURATED',min:80,max:100,name:'Saturado'}
  ],
  pacePolicies:[
    {id:'REALISTIC',name:'Realista',paceBias:.90,spawnBias:1.15,incidentBias:1.25},
    {id:'TRAINING',name:'Treino',paceBias:.78,spawnBias:1.35,incidentBias:1.45},
    {id:'CAREER',name:'Carreira',paceBias:.84,spawnBias:1.20,incidentBias:1.30},
    {id:'INTENSE',name:'Intenso controlado',paceBias:1,spawnBias:.95,incidentBias:1.05}
  ],
  balanceRules:[
    {id:'MOBILE_CAP',name:'Limite de aeronaves mobile'},
    {id:'INCIDENT_COOLDOWN',name:'Cooldown de incidente'},
    {id:'SPAWN_SPACING',name:'Espaçamento de tráfego'},
    {id:'QUEUE_PROTECTION',name:'Proteção contra fila de eventos'},
    {id:'SAFE_MODE_GUARD',name:'Guarda anti-modo seguro'}
  ]
});
const ADAPTIVE_PACE_KEY='skywardAdaptivePace_v1';
let adaptivePaceState={schema:1,policy:'CAREER',deviceProfile:'MOBILE_STANDARD',workloadScore:42,workloadBand:'CONTROLLED',paceMultiplier:.62,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:85,mobilePlayability:82,queuePressure:0,lastIncidentAt:0,lastSpawnAt:0,tuningHistory:[],lastEvaluation:null};
function loadAdaptivePace(){try{const raw=localStorage?.getItem?.(ADAPTIVE_PACE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)adaptivePaceState={...adaptivePaceState,...parsed};}}catch(e){safeLogError?.(e,'adaptive-pace-load');}return adaptivePaceState;}
function saveAdaptivePace(){try{localStorage?.setItem?.(ADAPTIVE_PACE_KEY,JSON.stringify(adaptivePaceState));}catch(e){safeLogError?.(e,'adaptive-pace-save');}return adaptivePaceState;}
function getViewportClass(){
  try{
    const w=Math.max(Number(innerWidth||0),Number(screen?.width||0));
    const h=Math.max(Number(innerHeight||0),Number(screen?.height||0));
    const min=Math.min(w,h), max=Math.max(w,h);
    const touch=('ontouchstart' in window)||Number(navigator?.maxTouchPoints||0)>0;
    if(touch && min<430) return 'MOBILE_LOW';
    if(touch && max<950) return 'MOBILE_STANDARD';
    if(touch && max<1200) return 'TABLET';
    if(max>=1600) return 'DESKTOP_PRO';
    return 'DESKTOP_STANDARD';
  }catch(e){return 'MOBILE_STANDARD';}
}
function profileById(id){return ADAPTIVE_PACE_CATALOG.deviceProfiles.find(p=>p.id===id)||ADAPTIVE_PACE_CATALOG.deviceProfiles[1];}
function policyById(id){return ADAPTIVE_PACE_CATALOG.pacePolicies.find(p=>p.id===id)||ADAPTIVE_PACE_CATALOG.pacePolicies[2];}
function bandForWorkload(score){return ADAPTIVE_PACE_CATALOG.workloadBands.find(b=>score>=b.min&&score<=b.max)||ADAPTIVE_PACE_CATALOG.workloadBands.at(-1);}
function setAdaptivePacePolicy(id='CAREER'){loadAdaptivePace();adaptivePaceState.policy=policyById(id).id;saveAdaptivePace();return adaptivePaceState;}
function estimateWorkload(statsObj={}){
  const planesCount=Array.isArray(window.planes)?window.planes.length:Number(statsObj.activePlanes||0);
  const requestCount=Array.isArray(window.pendingRequests)?window.pendingRequests.length:Number(statsObj.pendingRequests||0);
  const denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0);
  const terminal=window.SKYWARD_TERMINAL_FLOW?.status?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()||{};
  const ai=window.SKYWARD_AI_COPILOT?.status?.()||{};
  const queue=Number(terminal.progress?.avgQueueMin||0);
  const radioLoad=100-Number(radio.progress?.score||84);
  const aiRisk=100-Number(ai.progress?.score||80);
  return Math.max(0,Math.min(100,Math.round(planesCount*11+requestCount*6+denied*5+conflicts*12+incursions*18+queue*.5+radioLoad*.16+aiRisk*.12)));
}
function tuneAdaptivePace(statsObj={},reason='runtime'){
  loadAdaptivePace();
  const profile=profileById(getViewportClass());
  const policy=policyById(adaptivePaceState.policy);
  const workload=estimateWorkload(statsObj);
  const band=bandForWorkload(workload);
  let pace=profile.paceMultiplier*policy.paceBias;
  let spawn=profile.spawnSpacingSec*policy.spawnBias;
  let cooldown=profile.incidentCooldownSec*policy.incidentBias;
  let maxAircraft=profile.maxAircraft;
  if(workload>=80){pace*=.78;spawn*=1.45;cooldown*=1.55;maxAircraft=Math.max(2,maxAircraft-1);}
  else if(workload>=60){pace*=.88;spawn*=1.25;cooldown*=1.25;}
  else if(workload<30){pace*=1.04;spawn*=.92;cooldown*=.95;}
  const safeModeMemory=Number(localStorage?.getItem?.('skywardSafeModeCount')||0);
  if(safeModeMemory>0){pace*=.72;spawn*=1.4;cooldown*=1.5;maxAircraft=Math.max(2,maxAircraft-1);}
  adaptivePaceState.deviceProfile=profile.id;
  adaptivePaceState.workloadScore=workload;
  adaptivePaceState.workloadBand=band.id;
  adaptivePaceState.paceMultiplier=Math.max(.42,Math.min(1.05,Number(pace.toFixed(2))));
  adaptivePaceState.maxAircraft=Math.max(2,Math.min(8,Math.round(maxAircraft)));
  adaptivePaceState.spawnSpacingSec=Math.max(18,Math.round(spawn));
  adaptivePaceState.incidentCooldownSec=Math.max(40,Math.round(cooldown));
  adaptivePaceState.queuePressure=Math.max(0,Math.min(100,Math.round(workload*.72+safeModeMemory*10)));
  adaptivePaceState.mobilePlayability=Math.max(0,Math.min(100,Math.round(100-workload*.55-(profile.id.includes('MOBILE')?0:4)-safeModeMemory*12)));
  const item={at:new Date().toISOString(),build:BUILD,reason,profile:profile.id,policy:policy.id,workload,band:band.id,pace:adaptivePaceState.paceMultiplier,maxAircraft:adaptivePaceState.maxAircraft,spawnSpacingSec:adaptivePaceState.spawnSpacingSec,incidentCooldownSec:adaptivePaceState.incidentCooldownSec,mobilePlayability:adaptivePaceState.mobilePlayability};
  adaptivePaceState.tuningHistory.unshift(item);
  adaptivePaceState.tuningHistory=adaptivePaceState.tuningHistory.slice(0,80);
  adaptivePaceState.lastEvaluation=item;
  window.SKYWARD_PACE_MULTIPLIER=adaptivePaceState.paceMultiplier;
  window.SKYWARD_MAX_AIRCRAFT=adaptivePaceState.maxAircraft;
  window.SKYWARD_SPAWN_SPACING_MS=adaptivePaceState.spawnSpacingSec*1000;
  window.SKYWARD_INCIDENT_COOLDOWN_MS=adaptivePaceState.incidentCooldownSec*1000;
  saveAdaptivePace();
  renderAdaptivePaceBoard();
  return item;
}
function canSpawnAircraft(){
  loadAdaptivePace();
  const now=Date.now();
  const count=Array.isArray(window.planes)?window.planes.length:0;
  if(count>=adaptivePaceState.maxAircraft) return false;
  return now-Number(adaptivePaceState.lastSpawnAt||0)>=adaptivePaceState.spawnSpacingSec*1000;
}
function markAircraftSpawn(){
  loadAdaptivePace();
  adaptivePaceState.lastSpawnAt=Date.now();
  saveAdaptivePace();
  return adaptivePaceState.lastSpawnAt;
}
function canTriggerIncident(){
  loadAdaptivePace();
  const now=Date.now();
  return now-Number(adaptivePaceState.lastIncidentAt||0)>=adaptivePaceState.incidentCooldownSec*1000;
}
function markIncidentTrigger(){
  loadAdaptivePace();
  adaptivePaceState.lastIncidentAt=Date.now();
  saveAdaptivePace();
  return adaptivePaceState.lastIncidentAt;
}
function scaleTimeout(ms){
  loadAdaptivePace();
  return Math.max(1000,Math.round(Number(ms||1000)/Math.max(.42,adaptivePaceState.paceMultiplier)));
}
function evaluateAdaptivePace(finalScore=0,statsObj={},fail=false,airportCode=''){
  const tuned=tuneAdaptivePace(statsObj,'end-shift');
  if(fail){adaptivePaceState.paceMultiplier=Math.max(.42,adaptivePaceState.paceMultiplier*.82);adaptivePaceState.spawnSpacingSec=Math.round(adaptivePaceState.spawnSpacingSec*1.25);adaptivePaceState.incidentCooldownSec=Math.round(adaptivePaceState.incidentCooldownSec*1.25);}
  saveAdaptivePace();
  return {state:adaptivePaceState,evaluation:{...tuned,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),fail:Boolean(fail)}};
}
function adaptivePaceProgress(){
  loadAdaptivePace();
  return {score:adaptivePaceState.mobilePlayability,status:adaptivePaceState.workloadBand,profile:adaptivePaceState.deviceProfile,policy:adaptivePaceState.policy,workload:adaptivePaceState.workloadScore,paceMultiplier:adaptivePaceState.paceMultiplier,maxAircraft:adaptivePaceState.maxAircraft,spawnSpacingSec:adaptivePaceState.spawnSpacingSec,incidentCooldownSec:adaptivePaceState.incidentCooldownSec,last:adaptivePaceState.lastEvaluation||null};
}
function renderAdaptivePaceBoard(){
  try{
    const anchor=document.querySelector('#nonAeroRevenueInline') || document.querySelector('#terminalFlowInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#adaptivePaceInline'); if(old) old.remove();
    const p=adaptivePaceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="adaptivePaceInline" class="airport-ops-board adaptive-pace-inline">
      <div class="airport-ops-head"><b>PACE DIRECTOR</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CARGA</small><b>${p.workload}</b></div>
        <div><small>RITMO</small><b>${p.paceMultiplier}x</b></div>
        <div><small>MAX AC</small><b>${p.maxAircraft}</b></div>
        <div><small>SPAWN</small><b>${p.spawnSpacingSec}s</b></div>
        <div><small>INCID.</small><b>${p.incidentCooldownSec}s</b></div>
        <div><small>MOBILE</small><b>${p.score}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'adaptive-pace-board'); }
}
function initializeAdaptivePace(){
  loadAdaptivePace();
  tuneAdaptivePace({},'init');
  return adaptivePaceState;
}
function adaptivePaceStatus(){loadAdaptivePace();return {...adaptivePaceState,progress:adaptivePaceProgress(),catalog:ADAPTIVE_PACE_CATALOG};}
function adaptivePaceSelfCheck(){
  const issues=[];
  if(ADAPTIVE_PACE_CATALOG.deviceProfiles.length<5) issues.push('perfis insuficientes');
  if(ADAPTIVE_PACE_CATALOG.pacePolicies.length<4) issues.push('políticas insuficientes');
  const tuned=tuneAdaptivePace({activePlanes:4,pendingRequests:2,denied:1,conflicts:0,runwayIncursions:0},'self-check');
  if(!Number.isFinite(tuned.pace)||!Number.isFinite(tuned.maxAircraft)) issues.push('tuning inválido');
  if(adaptivePaceState.paceMultiplier<=0||adaptivePaceState.spawnSpacingSec<18) issues.push('limites inválidos');
  return {ok:issues.length===0,issues,profiles:ADAPTIVE_PACE_CATALOG.deviceProfiles.length,policies:ADAPTIVE_PACE_CATALOG.pacePolicies.length};
}
window.SKYWARD_ADAPTIVE_PACE=Object.freeze({
  schema:1,
  catalog:ADAPTIVE_PACE_CATALOG,
  load:loadAdaptivePace,
  save:saveAdaptivePace,
  init:initializeAdaptivePace,
  tune:tuneAdaptivePace,
  policy:setAdaptivePacePolicy,
  canSpawn:canSpawnAircraft,
  markSpawn:markAircraftSpawn,
  canIncident:canTriggerIncident,
  markIncident:markIncidentTrigger,
  scaleTimeout,
  evaluate:evaluateAdaptivePace,
  progress:adaptivePaceProgress,
  status:adaptivePaceStatus,
  board:renderAdaptivePaceBoard,
  selfCheck:adaptivePaceSelfCheck
});
