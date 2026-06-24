/* @skyward-module 04-state-airports-procedures
 * Runtime state, airport profiles and procedure data.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('04-state-airports-procedures');
let airports = [];
let profile = { name:'Controlador', avatar:'male', country:'Brasil', airport:'SBGR', xp:0, level:1, score:0, turns:0 };
let aircraft = [];
let requests = [];
let selected = null;
let selectedRequest = null;
let running = false;
let paused = false;
let last = 0;
let startTime = 0;
let score = 0;
let spawnTimer = 0;
let requestTimer = 0;
let logLines = [];
let runwayOccupiedBy = null;
let stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, surfaceConflicts:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
let mission = null;
let missionHistory = [];
let conflictPredictions = [];
let radarFilters = { labels:true, ground:true, final:true, vectors:true, safety:true, procedures:true, range:true, map:true, wx:true, fuel:true, emerg:true };
let runwayQueue = { arrivals:[], departures:[] };
let safetyState = { score:100, level:'ok', messages:['Safety Advisor inicializado.'], lastRisk:null };
const SEPARATION_RULES = { lateralNm:6, verticalFL:10, shortFinalNm:10, runwayProtectedNm:14 };
const FUEL_RULES = { arrivalBurn:0.010, departureBurn:0.006, emergencyThreshold:14, lowThreshold:24, criticalThreshold:8 };
let emergencyDirector = { active:false, target:null, message:'Sem emergência ativa.', lastTick:0 };

const SIM_SPEED = 0.092;
function atcIsMobileRuntime(){ try{ return !!(window.matchMedia?.('(pointer: coarse)').matches || innerWidth<900 || screen?.width<900); }catch(_e){ return false; } }
function atcPaceFactor(){ return atcIsMobileRuntime() ? 1.75 : 1; }
function atcDtScale(){ return atcIsMobileRuntime() ? 0.62 : 1; }
window.SKYWARD_MOBILE_PACE = Object.freeze({ schema:1, isMobile:atcIsMobileRuntime, factor:atcPaceFactor, dtScale:atcDtScale });
let runway = { name:'09/27', x1:18, y1:50, x2:82, y2:50, width:6.2, exits:[32,45,56,68] };
let gates = [
  {x:55,y:70, label:'A'}, {x:61,y:70, label:'A'}, {x:67,y:70, label:'B'}, {x:73,y:70, label:'B'},
  {x:58,y:78, label:'C'}, {x:65,y:78, label:'C'}, {x:72,y:78, label:'D'}, {x:78,y:77, label:'D'}
];
let holdingPoints = [{x:31,y:57},{x:47,y:57},{x:64,y:57},{x:78,y:57}];
let finalFix = {x:52, y:26};
let activeAirportGraph = null;
let secondaryRunways = [];
let airportSurfaceState = { activeRunway:null, taxiwayCount:0, gateCount:0, holdingCount:0 };

const AIRPORT_OPS_PROFILES = {
  SBGR:{runway:'09R/27L', layout:'parallel', complexity:1.18, spawn:0.72, finalFix:{x:50,y:24}, threshold:{x:82,y:50}, gates:'east', ops:'Parallel hub', wind:'E/SE', procedures:'STAR MRC / SID PAG'},
  SBSP:{runway:'17R/35L', layout:'urban', complexity:1.34, spawn:0.82, finalFix:{x:62,y:22}, threshold:{x:68,y:52}, gates:'south', ops:'Urban short-field', wind:'variable', procedures:'Curved visual / restricted'},
  SBKP:{runway:'15/33', layout:'single', complexity:1.02, spawn:0.58, finalFix:{x:44,y:20}, threshold:{x:78,y:52}, gates:'cargo', ops:'Cargo + pax flow', wind:'SE', procedures:'Cargo sequencing'},
  SBBR:{runway:'11L/29R', layout:'parallel', complexity:1.12, spawn:0.66, finalFix:{x:48,y:22}, threshold:{x:82,y:48}, gates:'central', ops:'Capital hub', wind:'E', procedures:'Dual runway ops'},
  SBGL:{runway:'10/28', layout:'coastal', complexity:1.22, spawn:0.68, finalFix:{x:52,y:22}, threshold:{x:84,y:51}, gates:'west', ops:'Coastal heavy jet', wind:'sea breeze', procedures:'Bay approach'},
  SBRJ:{runway:'02R/20L', layout:'coastal-short', complexity:1.40, spawn:0.60, finalFix:{x:58,y:18}, threshold:{x:74,y:54}, gates:'bay', ops:'Short coastal approach', wind:'crosswind', procedures:'Visual curve / terrain'},
  SBCF:{runway:'16/34', layout:'single', complexity:.96, spawn:0.50, finalFix:{x:44,y:20}, threshold:{x:79,y:52}, gates:'north', ops:'Regional hub', wind:'variable', procedures:'Single runway sequence'},
  SBPA:{runway:'11/29', layout:'single', complexity:1.04, spawn:0.52, finalFix:{x:49,y:24}, threshold:{x:82,y:51}, gates:'south', ops:'Frontal weather ops', wind:'S/SW', procedures:'Low ceiling sequencing'},
  SBSV:{runway:'10/28', layout:'coastal', complexity:1.05, spawn:0.52, finalFix:{x:52,y:24}, threshold:{x:82,y:50}, gates:'coast', ops:'Tropical coastal ops', wind:'E', procedures:'Sea breeze approach'},
  SBRE:{runway:'18/36', layout:'single', complexity:1.06, spawn:0.50, finalFix:{x:56,y:22}, threshold:{x:78,y:54}, gates:'east', ops:'Tropical rain cells', wind:'E/SE', procedures:'Rain cell vectoring'},
  KATL:{runway:'09L/27R', layout:'mega-parallel', complexity:1.38, spawn:0.90, finalFix:{x:50,y:22}, threshold:{x:84,y:50}, gates:'mega', ops:'Mega hub banked flow', wind:'W', procedures:'Parallel arrival streams'},
  EGLL:{runway:'09L/27R', layout:'parallel', complexity:1.45, spawn:0.82, finalFix:{x:50,y:22}, threshold:{x:82,y:50}, gates:'terminal', ops:'Low vis alternation', wind:'W', procedures:'Heathrow director'},
  LEMD:{runway:'14R/32L', layout:'parallel', complexity:1.30, spawn:0.76, finalFix:{x:48,y:20}, threshold:{x:82,y:49}, gates:'central', ops:'Four runway ops', wind:'N', procedures:'Madrid arrival manager'}
};
let currentOpsProfile = null;
function airportOpsProfile(){
  const a=airport();
  return AIRPORT_OPS_PROFILES[a.icao] || {runway: runway.name, layout:'generic', complexity:1, spawn:.58, finalFix:{x:52,y:26}, threshold:{x:82,y:50}, gates:'default', ops:`${a.runways||1} runway airport`, wind:'variable', procedures:'standard vectors'};
}
function applyAirportOpsProfile(){
  try{
    const p=airportOpsProfile(); currentOpsProfile=p;
    runway.name=p.runway || runway.name;
    if(p.finalFix){ finalFix.x=p.finalFix.x; finalFix.y=p.finalFix.y; }
    if(p.threshold && PROCEDURE_LAYER?.ils){ PROCEDURE_LAYER.ils.threshold={x:p.threshold.x,y:p.threshold.y}; }
    if(PROCEDURE_LAYER?.ils){ PROCEDURE_LAYER.ils.name=`ILS RWY ${runway.name}`; PROCEDURE_LAYER.ils.faf={x:Math.max(18,(p.finalFix?.x||52)+6), y:Math.max(16,(p.finalFix?.y||26)+8)}; PROCEDURE_LAYER.ils.iaf={x:Math.max(8,(p.finalFix?.x||52)-18), y:Math.max(8,(p.finalFix?.y||26)-10)}; }
    if($('#runwayTextTop')) $('#runwayTextTop').textContent=`RWY ${runway.name}`;
    return p;
  }catch(e){ safeLogError(e,'airport-ops-profile'); return airportOpsProfile(); }
}
function renderAirportOpsBoard(){
  try{
    const box=document.querySelector('#airportOpsBoard'); if(!box) return;
    const a=airport(), p=currentOpsProfile||airportOpsProfile();
    const graph=activeAirportGraph;
    box.innerHTML=`<div class="airport-ops-head"><b>AIRPORT OPS</b><span>${a.icao}</span></div>
      <div class="airport-ops-grid">
        <div><small>RWY</small><b>${p.runway}</b></div>
        <div><small>LAYOUT</small><b>${p.layout}</b></div>
        <div><small>OPS</small><b>${p.ops}</b></div>
        <div><small>PROC</small><b>${p.procedures}</b></div>
        <div><small>GATES</small><b>${graph?.gates?.length || gates.length}</b></div>
        <div><small>TAXIWAYS</small><b>${graph?.taxiways?.length || 0}</b></div>
        <div><small>HOLDS</small><b>${graph?.holdingPoints?.length || holdingPoints.length}</b></div>
        <div><small>GRAPH</small><b>${graph ? 'ATIVO' : 'GENÉRICO'}</b></div>
      </div>`;
  }catch(e){ safeLogError(e,'airport-ops-board'); }
}
function airportSpawnInterval(){
  const p=currentOpsProfile||airportOpsProfile();
  const wx=WX_STATE?.severity>.75 ? 1.28 : WX_STATE?.severity>.55 ? 1.12 : 1;
  return Math.max(24, 45 / Math.max(.45, p.spawn||.58) * wx * atcPaceFactor());
}
function airportInitialTrafficCount(){
  const p=currentOpsProfile||airportOpsProfile();
  const base=Math.max(4, Math.min(8, Math.round(4 + (p.spawn||.58)*3)));
  return atcIsMobileRuntime() ? Math.max(2, Math.min(4, base-2)) : base;
}

const PROCEDURE_LAYER = {
  active: true,
  scopeNm: 60,
  ils: { name:'ILS RWY 27', localizer:270, threshold:{x:82,y:50}, faf:{x:58,y:30}, iaf:{x:36,y:18}, missed:{x:88,y:44} },
  fixes: [
    {id:'IAF', name:'ANVIL', x:36, y:18, type:'arrival'},
    {id:'FAF', name:'FINAL FIX', x:52, y:26, type:'final'},
    {id:'OM', name:'OUTER MARKER', x:66, y:38, type:'marker'},
    {id:'HLD', name:'HOLD NW', x:22, y:24, type:'hold'},
    {id:'SID', name:'DEP FIX', x:14, y:64, type:'departure'}
  ],
  routes: [
    {id:'STAR 27', type:'arrival', color:'rgba(91,240,109,.55)', pts:[{x:14,y:14},{x:36,y:18},{x:52,y:26},{x:82,y:50}]},
    {id:'SID 27', type:'departure', color:'rgba(88,183,255,.52)', pts:[{x:24,y:50},{x:14,y:64},{x:8,y:78}]},
    {id:'MISSED', type:'missed', color:'rgba(255,191,61,.50)', pts:[{x:82,y:50},{x:88,y:44},{x:86,y:28},{x:72,y:20}]}
  ]
};


