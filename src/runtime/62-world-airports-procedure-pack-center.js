/* @skyward-module 62-world-airports-procedure-pack-center
 * World Airports, Procedure Packs and Route Challenge Center for airport content progression, simplified procedures and runway modes.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('62-world-airports-procedure-pack-center');
const WORLD_AIRPORT_PROCEDURES_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f59',
  airportPacks:[
    {icao:'SBSP',name:'São Paulo Congonhas',country:'Brasil',complexity:4,runways:['17R/35L','17L/35R'],profile:'URBAN_SHORT_RUNWAY',unlockXp:0},
    {icao:'SBGR',name:'São Paulo Guarulhos',country:'Brasil',complexity:5,runways:['10L/28R','10R/28L'],profile:'INTERNATIONAL_HUB',unlockXp:500},
    {icao:'SBRJ',name:'Rio Santos Dumont',country:'Brasil',complexity:5,runways:['02R/20L','02L/20R'],profile:'COASTAL_VISUAL',unlockXp:900},
    {icao:'SBGL',name:'Rio Galeão',country:'Brasil',complexity:4,runways:['10/28','15/33'],profile:'HEAVY_MIXED',unlockXp:1200},
    {icao:'KJFK',name:'New York JFK',country:'EUA',complexity:7,runways:['04L/22R','04R/22L','13L/31R','13R/31L'],profile:'MEGA_HUB',unlockXp:2400},
    {icao:'EGLL',name:'London Heathrow',country:'Reino Unido',complexity:7,runways:['09L/27R','09R/27L'],profile:'SLOT_CONSTRAINED',unlockXp:3000},
    {icao:'RJTT',name:'Tokyo Haneda',country:'Japão',complexity:8,runways:['16L/34R','16R/34L','04/22','05/23'],profile:'BAY_COMPLEX',unlockXp:3600},
    {icao:'OMDB',name:'Dubai International',country:'EAU',complexity:8,runways:['12L/30R','12R/30L'],profile:'DESERT_SUPERHUB',unlockXp:4200}
  ],
  procedurePacks:[
    {id:'VISUAL_URBAN',name:'Visual urbano',risk:18,skills:['RUNWAY_AWARENESS','PACE_DISCIPLINE']},
    {id:'INSTRUMENT_IFR',name:'IFR simplificado',risk:22,skills:['WEATHER_READING','RADIO_CLARITY']},
    {id:'PARALLEL_RUNWAY',name:'Pistas paralelas',risk:28,skills:['RUNWAY_AWARENESS','NETWORK_FLOW']},
    {id:'COASTAL_APPROACH',name:'Aproximação costeira',risk:24,skills:['WEATHER_READING','RADIO_CLARITY']},
    {id:'HEAVY_WAKE',name:'Esteira pesada',risk:26,skills:['PACE_DISCIPLINE','RUNWAY_AWARENESS']},
    {id:'LOW_VIS_IFR',name:'Baixa visibilidade IFR',risk:34,skills:['WEATHER_READING','EMERGENCY_RESPONSE']},
    {id:'SLOT_BANK',name:'Bancos de slots',risk:30,skills:['NETWORK_FLOW','SUPERVISOR_DECISION']}
  ],
  routeChallenges:[
    {id:'CGH_SHUTTLE',name:'Ponte aérea Congonhas-Santos Dumont',airports:['SBSP','SBRJ'],difficulty:5,durationMin:12},
    {id:'GRU_INTERNATIONAL_WAVE',name:'Onda internacional Guarulhos',airports:['SBGR'],difficulty:6,durationMin:14},
    {id:'RIO_MIXED_OPS',name:'Operação mista Rio',airports:['SBRJ','SBGL'],difficulty:6,durationMin:14},
    {id:'JFK_PARALLEL_PRESSURE',name:'Pressão em pistas paralelas JFK',airports:['KJFK'],difficulty:8,durationMin:16},
    {id:'HEATHROW_SLOT_BANK',name:'Banco de slots Heathrow',airports:['EGLL'],difficulty:8,durationMin:16},
    {id:'HANEDA_BAY_COMPLEX',name:'Complexo da baía Haneda',airports:['RJTT'],difficulty:9,durationMin:18},
    {id:'DUBAI_NIGHT_FLOW',name:'Fluxo noturno Dubai',airports:['OMDB'],difficulty:9,durationMin:18}
  ],
  runwayModes:[
    {id:'SINGLE_ACTIVE',name:'Pista única ativa',capacity:1,risk:10},
    {id:'PARALLEL_SEGREGATED',name:'Paralelas segregadas',capacity:2,risk:18},
    {id:'PARALLEL_MIXED',name:'Paralelas mistas',capacity:2,risk:28},
    {id:'CROSSWIND_RESTRICTED',name:'Restrição por vento cruzado',capacity:1,risk:30},
    {id:'LOW_VIS_PROCEDURAL',name:'Procedural baixa visibilidade',capacity:1,risk:34}
  ],
  airportBands:[
    {id:'MASTERED',min:92,name:'Dominado'},
    {id:'QUALIFIED',min:80,name:'Qualificado'},
    {id:'TRAINING',min:62,name:'Em treino'},
    {id:'RESTRICTED',min:0,name:'Restrito'}
  ]
});
const WORLD_AIRPORT_KEY='skywardWorldAirportProcedures_v1';
let worldAirportState={schema:1,activeAirport:'SBSP',procedurePack:'VISUAL_URBAN',routeChallenge:'CGH_SHUTTLE',runwayMode:'SINGLE_ACTIVE',airportScore:0,status:'TRAINING',unlockedAirports:['SBSP'],airportHistory:[],mastery:{},lastEvaluation:null};
function loadWorldAirports(){try{const raw=localStorage?.getItem?.(WORLD_AIRPORT_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)worldAirportState={...worldAirportState,...parsed};}}catch(e){safeLogError?.(e,'world-airport-load');}return worldAirportState;}
function saveWorldAirports(){try{localStorage?.setItem?.(WORLD_AIRPORT_KEY,JSON.stringify(worldAirportState));}catch(e){safeLogError?.(e,'world-airport-save');}return worldAirportState;}
function airportByIcao(icao){return WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.find(a=>a.icao===icao)||WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks[0];}
function procedureById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.find(p=>p.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks[0];}
function routeById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges.find(r=>r.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges[0];}
function runwayModeById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.runwayModes.find(r=>r.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.runwayModes[0];}
function airportBand(score){return WORLD_AIRPORT_PROCEDURES_CATALOG.airportBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||WORLD_AIRPORT_PROCEDURES_CATALOG.airportBands.at(-1);}
function refreshAirportUnlocks(){
  loadWorldAirports();
  const xp=Number(window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.().xp||0);
  for(const airport of WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks){
    if(xp>=Number(airport.unlockXp||0)&&!worldAirportState.unlockedAirports.includes(airport.icao)){
      worldAirportState.unlockedAirports.push(airport.icao);
    }
  }
  saveWorldAirports();
  return worldAirportState.unlockedAirports;
}
function chooseWorldAirport(icao='SBSP'){
  loadWorldAirports();
  refreshAirportUnlocks();
  const airport=airportByIcao(icao);
  if(!worldAirportState.unlockedAirports.includes(airport.icao)) return {ok:false,reason:'locked',airport};
  worldAirportState.activeAirport=airport.icao;
  const routes=WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges.filter(r=>r.airports.includes(airport.icao));
  if(routes[0]) worldAirportState.routeChallenge=routes[0].id;
  if(airport.profile==='URBAN_SHORT_RUNWAY') worldAirportState.procedurePack='VISUAL_URBAN';
  else if(airport.profile==='COASTAL_VISUAL') worldAirportState.procedurePack='COASTAL_APPROACH';
  else if(airport.profile==='INTERNATIONAL_HUB') worldAirportState.procedurePack='INSTRUMENT_IFR';
  else if(airport.profile==='SLOT_CONSTRAINED') worldAirportState.procedurePack='SLOT_BANK';
  else if(airport.profile==='MEGA_HUB'||airport.profile==='BAY_COMPLEX') worldAirportState.procedurePack='PARALLEL_RUNWAY';
  else if(airport.profile==='DESERT_SUPERHUB') worldAirportState.procedurePack='HEAVY_WAKE';
  worldAirportState.runwayMode=airport.runways.length>=3?'PARALLEL_MIXED':(airport.runways.length>=2?'PARALLEL_SEGREGATED':'SINGLE_ACTIVE');
  saveWorldAirports();
  renderWorldAirportBoard();
  return {ok:true,airport,procedure:procedureById(worldAirportState.procedurePack),route:routeById(worldAirportState.routeChallenge),runwayMode:runwayModeById(worldAirportState.runwayMode)};
}
function setProcedurePack(id='VISUAL_URBAN'){
  loadWorldAirports();
  worldAirportState.procedurePack=procedureById(id).id;
  saveWorldAirports();
  renderWorldAirportBoard();
  return procedureById(worldAirportState.procedurePack);
}
function setRouteChallenge(id='CGH_SHUTTLE'){
  loadWorldAirports();
  worldAirportState.routeChallenge=routeById(id).id;
  const route=routeById(worldAirportState.routeChallenge);
  if(route.airports[0]) worldAirportState.activeAirport=route.airports[0];
  saveWorldAirports();
  renderWorldAirportBoard();
  return route;
}
function evaluateWorldAirportProcedures(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadWorldAirports();
  refreshAirportUnlocks();
  const airport=airportByIcao(worldAirportState.activeAirport||airportCode||'SBSP');
  const procedure=procedureById(worldAirportState.procedurePack);
  const route=routeById(worldAirportState.routeChallenge);
  const runway=runwayModeById(worldAirportState.runwayMode);
  const replay=window.SKYWARD_REPLAY_TIMELINE?.progress?.()||{};
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const mission=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const base=55 + Number(mission.score||72)*.18 + Number(debrief.score||76)*.20 + Number(replay.score||76)*.16 + Math.min(10,Number(finalScore||0)/500);
  const difficultyPenalty=airport.complexity*1.6 + route.difficulty*1.4 + procedure.risk*.18 + runway.risk*.18;
  const safetyPenalty=conflicts*9+incursions*13+Math.max(0,denied-1)*3+(fail?12:0);
  const airportScore=Math.max(0,Math.min(100,Math.round(base-difficultyPenalty*.45-safetyPenalty+Math.min(8,worldAirportState.unlockedAirports.length))));
  const band=airportBand(airportScore);
  const mastery=worldAirportState.mastery[airport.icao]||{bestScore:0,runs:0,status:'TRAINING'};
  mastery.bestScore=Math.max(Number(mastery.bestScore||0),airportScore);
  mastery.runs=Number(mastery.runs||0)+1;
  mastery.status=airportBand(mastery.bestScore).id;
  mastery.lastScore=airportScore;
  mastery.lastAt=new Date().toISOString();
  worldAirportState.mastery[airport.icao]=mastery;
  worldAirportState.airportScore=airportScore;
  worldAirportState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airport.icao,airportName:airport.name,airportScore,status:band.id,statusName:band.name,procedure:procedure.id,procedureRisk:procedure.risk,routeChallenge:route.id,runwayMode:runway.id,unlockedAirports:worldAirportState.unlockedAirports.length,masteryBest:mastery.bestScore,finalScore:Math.round(finalScore||0)};
  worldAirportState.lastEvaluation=evaluation;
  worldAirportState.airportHistory.unshift(evaluation);
  worldAirportState.airportHistory=worldAirportState.airportHistory.slice(0,100);
  saveWorldAirports();
  renderWorldAirportBoard();
  return {state:worldAirportState,evaluation};
}
function worldAirportProgress(){
  loadWorldAirports();
  const airport=airportByIcao(worldAirportState.activeAirport);
  return {score:worldAirportState.airportScore,status:worldAirportState.status,activeAirport:worldAirportState.activeAirport,airportName:airport.name,procedure:worldAirportState.procedurePack,route:worldAirportState.routeChallenge,runwayMode:worldAirportState.runwayMode,unlocked:worldAirportState.unlockedAirports.length,totalAirports:WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length,last:worldAirportState.lastEvaluation||null};
}
function renderWorldAirportBoard(){
  try{
    const anchor=document.querySelector('#replayTimelineInline') || document.querySelector('#instructorDebriefInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#worldAirportInline'); if(old) old.remove();
    const p=worldAirportProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="worldAirportInline" class="airport-ops-board world-airport-inline">
      <div class="airport-ops-head"><b>AIRPORT PACK</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>ICAO</small><b>${p.activeAirport}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>PROC.</small><b>${p.procedure}</b></div>
        <div><small>PISTA</small><b>${p.runwayMode}</b></div>
        <div><small>UNLOCK</small><b>${p.unlocked}/${p.totalAirports}</b></div>
        <div><small>ROTA</small><b>${p.route}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'world-airport-board');}
}
function initializeWorldAirports(){
  loadWorldAirports();
  refreshAirportUnlocks();
  if(!worldAirportState.activeAirport) chooseWorldAirport('SBSP');
  renderWorldAirportBoard();
  return worldAirportState;
}
function worldAirportStatus(){loadWorldAirports();return {...worldAirportState,progress:worldAirportProgress(),catalog:WORLD_AIRPORT_PROCEDURES_CATALOG};}
function worldAirportSelfCheck(){
  const issues=[];
  if(WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length<8) issues.push('aeroportos insuficientes');
  if(WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.length<7) issues.push('procedimentos insuficientes');
  const chosen=chooseWorldAirport('SBSP');
  const proc=setProcedurePack('VISUAL_URBAN');
  const route=setRouteChallenge('CGH_SHUTTLE');
  const evalResult=evaluateWorldAirportProcedures(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!chosen.ok||!proc.id||!route.id) issues.push('seleção inválida');
  if(!Number.isFinite(evalResult.evaluation.airportScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,airports:WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length,procedures:WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.length};
}
window.SKYWARD_WORLD_AIRPORTS=Object.freeze({
  schema:1,
  catalog:WORLD_AIRPORT_PROCEDURES_CATALOG,
  load:loadWorldAirports,
  save:saveWorldAirports,
  init:initializeWorldAirports,
  choose:chooseWorldAirport,
  procedure:setProcedurePack,
  route:setRouteChallenge,
  unlocks:refreshAirportUnlocks,
  evaluate:evaluateWorldAirportProcedures,
  progress:worldAirportProgress,
  status:worldAirportStatus,
  board:renderWorldAirportBoard,
  selfCheck:worldAirportSelfCheck
});
