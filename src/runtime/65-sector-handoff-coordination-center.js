/* @skyward-module 65-sector-handoff-coordination-center
 * Sector Handoff, Approach/Departure Coordination and Control Room Center for controller positions, transfer quality and coordination workload.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('65-sector-handoff-coordination-center');
const SECTOR_HANDOFF_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f62',
  controlSectors:[
    {id:'GROUND',name:'Solo',abbr:'GND',capacity:5,risk:10},
    {id:'TOWER',name:'Torre',abbr:'TWR',capacity:6,risk:14},
    {id:'DEPARTURE',name:'Partida',abbr:'DEP',capacity:5,risk:16},
    {id:'APPROACH',name:'Aproximação',abbr:'APP',capacity:7,risk:18},
    {id:'CENTER',name:'Centro',abbr:'CTR',capacity:8,risk:12},
    {id:'FLOW',name:'Fluxo',abbr:'FMP',capacity:4,risk:16},
    {id:'EMERGENCY_DESK',name:'Mesa emergência',abbr:'EMG',capacity:3,risk:22}
  ],
  handoffTypes:[
    {id:'GROUND_TO_TOWER',name:'Solo → Torre',from:'GROUND',to:'TOWER',requiredReadback:true,risk:10},
    {id:'TOWER_TO_DEPARTURE',name:'Torre → Partida',from:'TOWER',to:'DEPARTURE',requiredReadback:true,risk:14},
    {id:'APPROACH_TO_TOWER',name:'Aproximação → Torre',from:'APPROACH',to:'TOWER',requiredReadback:true,risk:16},
    {id:'CENTER_TO_APPROACH',name:'Centro → Aproximação',from:'CENTER',to:'APPROACH',requiredReadback:true,risk:18},
    {id:'TOWER_TO_GROUND',name:'Torre → Solo',from:'TOWER',to:'GROUND',requiredReadback:false,risk:9},
    {id:'FLOW_TO_TOWER',name:'Fluxo → Torre',from:'FLOW',to:'TOWER',requiredReadback:false,risk:12},
    {id:'EMERGENCY_BROADCAST',name:'Emergência → todos',from:'EMERGENCY_DESK',to:'ALL',requiredReadback:true,risk:26}
  ],
  coordinationRules:[
    {id:'FREQUENCY_CHANGE',name:'Troca de frequência',penalty:8},
    {id:'RADAR_IDENT',name:'Identificação radar',penalty:9},
    {id:'RUNWAY_RELEASE',name:'Liberação de pista',penalty:10},
    {id:'MISSED_APPROACH',name:'Aproximação perdida',penalty:18},
    {id:'DEPARTURE_RELEASE',name:'Liberação de partida',penalty:12},
    {id:'EMERGENCY_TRANSFER',name:'Transferência emergencial',penalty:22},
    {id:'WEATHER_REROUTE',name:'Desvio por clima',penalty:16}
  ],
  sectorLoadBands:[
    {id:'NORMAL',min:88,name:'Carga normal'},
    {id:'BUSY',min:74,name:'Setor ocupado'},
    {id:'OVERLOAD',min:55,name:'Setor sobrecarregado'},
    {id:'CRITICAL',min:0,name:'Coordenação crítica'}
  ],
  handoffQualityBands:[
    {id:'CLEAN',min:92,name:'Transferência limpa'},
    {id:'STABLE',min:78,name:'Transferência estável'},
    {id:'NOISY',min:60,name:'Transferência ruidosa'},
    {id:'FAILED',min:0,name:'Transferência falha'}
  ]
});
const SECTOR_HANDOFF_KEY='skywardSectorHandoffCoordination_v1';
let sectorState={schema:1,primarySector:'TOWER',handoffScore:84,status:'STABLE',sectorLoad:0,coordinationRisk:0,acceptanceRate:92,transfers:[],sectorLoads:{},activeRules:[],history:[],lastEvaluation:null};
function loadSectorHandoff(){try{const raw=localStorage?.getItem?.(SECTOR_HANDOFF_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)sectorState={...sectorState,...parsed};}}catch(e){safeLogError?.(e,'sector-handoff-load');}return sectorState;}
function saveSectorHandoff(){try{localStorage?.setItem?.(SECTOR_HANDOFF_KEY,JSON.stringify(sectorState));}catch(e){safeLogError?.(e,'sector-handoff-save');}return sectorState;}
function sectorById(id){return SECTOR_HANDOFF_CATALOG.controlSectors.find(s=>s.id===id)||SECTOR_HANDOFF_CATALOG.controlSectors[1];}
function handoffById(id){return SECTOR_HANDOFF_CATALOG.handoffTypes.find(h=>h.id===id)||SECTOR_HANDOFF_CATALOG.handoffTypes[0];}
function loadBand(score){return SECTOR_HANDOFF_CATALOG.sectorLoadBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECTOR_HANDOFF_CATALOG.sectorLoadBands.at(-1);}
function qualityBand(score){return SECTOR_HANDOFF_CATALOG.handoffQualityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECTOR_HANDOFF_CATALOG.handoffQualityBands.at(-1);}
function choosePrimarySector(){
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  if(String(weather.status||'NORMAL')==='SEVERE'||Number(weather.crosswindKt||0)>=22) return 'APPROACH';
  if(Number(flow.holdingLoad||0)>0||String(flow.status||'STABLE')==='CONGESTED') return 'FLOW';
  if(['SBSP','SBRJ'].includes(String(airport.activeAirport||''))) return 'TOWER';
  if(['KJFK','EGLL','RJTT','OMDB'].includes(String(airport.activeAirport||''))) return 'APPROACH';
  return 'TOWER';
}
function generateSectorLoads(){
  loadSectorHandoff();
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const baseTraffic=Number(flow.arrivals||3)+Number(flow.departures||3)+Number(flow.holdingLoad||0)*2;
  const weatherLoad=String(weather.status||'NORMAL')==='SEVERE'?5:String(weather.status||'NORMAL')==='ADVERSE'?3:String(weather.status||'NORMAL')==='WATCH'?1:0;
  const airportComplex=['KJFK','EGLL','RJTT','OMDB'].includes(String(airport.activeAirport||''))?3:1;
  const loads={};
  for(const s of SECTOR_HANDOFF_CATALOG.controlSectors){
    let value=Math.round(baseTraffic*.55+weatherLoad+airportComplex+s.risk*.12);
    if(s.id===sectorState.primarySector) value+=3;
    if(s.id==='FLOW') value+=Number(flow.holdingLoad||0)*2;
    if(s.id==='EMERGENCY_DESK' && (String(weather.status||'NORMAL')==='SEVERE')) value+=4;
    loads[s.id]=Math.max(0,Math.min(100,value));
  }
  sectorState.sectorLoads=loads;
  sectorState.sectorLoad=Math.max(...Object.values(loads));
  return loads;
}
function addHandoff(typeId='GROUND_TO_TOWER',accepted=true,detail=''){
  loadSectorHandoff();
  const h=handoffById(typeId);
  const item={id:`HOF-${String(Date.now()).slice(-6)}-${sectorState.transfers.length+1}`,type:h.id,name:h.name,from:h.from,to:h.to,accepted:Boolean(accepted),readbackRequired:h.requiredReadback,risk:h.risk,detail:String(detail||h.name),at:new Date().toISOString(),build:BUILD};
  sectorState.transfers.push(item);
  sectorState.transfers=sectorState.transfers.slice(-140);
  saveSectorHandoff();
  return item;
}
function generateHandoffsFromContext(){
  loadSectorHandoff();
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const result=[];
  result.push(addHandoff('GROUND_TO_TOWER',true,'partida para torre'));
  result.push(addHandoff('APPROACH_TO_TOWER',true,'chegada para torre'));
  if(Number(flow.departures||0)>2) result.push(addHandoff('TOWER_TO_DEPARTURE',true,'partidas em sequência'));
  if(Number(flow.holdingLoad||0)>0) result.push(addHandoff('CENTER_TO_APPROACH',true,'liberação do holding'));
  if(String(weather.status||'NORMAL')==='SEVERE') result.push(addHandoff('EMERGENCY_BROADCAST',false,'clima severo requer coordenação ampla'));
  if(String(flow.status||'STABLE')==='CONGESTED'||String(flow.status||'STABLE')==='SATURATED') result.push(addHandoff('FLOW_TO_TOWER',true,'restrição de fluxo'));
  return result;
}
function refreshSectorHandoff(mode='AUTO'){
  loadSectorHandoff();
  if(mode==='AUTO') sectorState.primarySector=choosePrimarySector();
  generateSectorLoads();
  if(!sectorState.transfers.length) generateHandoffsFromContext();
  saveSectorHandoff();
  renderSectorHandoffBoard();
  return sectorState;
}
function evaluateSectorHandoff(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSectorHandoff();
  refreshSectorHandoff('AUTO');
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const transfers=sectorState.transfers.slice(-20);
  const accepted=transfers.filter(t=>t.accepted).length;
  const acceptanceRate=transfers.length?Math.round((accepted/transfers.length)*100):100;
  const rulePenalty=SECTOR_HANDOFF_CATALOG.coordinationRules.reduce((sum,r)=>{
    if(r.id==='WEATHER_REROUTE'&&['ADVERSE','SEVERE'].includes(String(weather.status||''))) return sum+r.penalty;
    if(r.id==='MISSED_APPROACH'&&conflicts>0) return sum+r.penalty;
    if(r.id==='RUNWAY_RELEASE'&&incursions>0) return sum+r.penalty;
    if(r.id==='DEPARTURE_RELEASE'&&Number(flow.departures||0)>4) return sum+r.penalty*.5;
    return sum;
  },0);
  const transferRisk=transfers.reduce((sum,t)=>sum+Number(t.risk||0)*(t.accepted?.45:1),0);
  const loadPenalty=Math.max(0,Number(sectorState.sectorLoad||0)-sectorById(sectorState.primarySector).capacity*2);
  const radioBonus=Math.min(8,Number(radio.score||radio.accuracy||80)/12);
  const handoffScore=Math.max(0,Math.min(100,Math.round(92-transferRisk*.18-rulePenalty*.25-loadPenalty*.42-conflicts*7-incursions*10-denied*2-(fail?12:0)+radioBonus+Math.min(7,Number(finalScore||0)/650))));
  const quality=qualityBand(handoffScore);
  const loadStatus=loadBand(Math.max(0,100-Number(sectorState.sectorLoad||0)));
  sectorState.handoffScore=handoffScore;
  sectorState.status=quality.id;
  sectorState.acceptanceRate=acceptanceRate;
  sectorState.coordinationRisk=Math.round(transferRisk+rulePenalty+loadPenalty);
  sectorState.activeRules=SECTOR_HANDOFF_CATALOG.coordinationRules.filter(r=>{
    if(r.id==='WEATHER_REROUTE') return ['ADVERSE','SEVERE'].includes(String(weather.status||''));
    if(r.id==='RUNWAY_RELEASE') return incursions>0;
    if(r.id==='MISSED_APPROACH') return conflicts>0;
    return false;
  });
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',handoffScore,status:quality.id,statusName:quality.name,sectorLoad:sectorState.sectorLoad,loadStatus:loadStatus.id,primarySector:sectorState.primarySector,transferCount:transfers.length,acceptanceRate,coordinationRisk:sectorState.coordinationRisk,activeRules:sectorState.activeRules.length,flowStatus:flow.status||'STABLE',weatherStatus:weather.status||'NORMAL',finalScore:Math.round(finalScore||0)};
  sectorState.lastEvaluation=evaluation;
  sectorState.history.unshift(evaluation);
  sectorState.history=sectorState.history.slice(0,100);
  saveSectorHandoff();
  renderSectorHandoffBoard();
  return {state:sectorState,evaluation};
}
function sectorHandoffProgress(){
  loadSectorHandoff();
  return {score:sectorState.handoffScore,status:sectorState.status,primarySector:sectorState.primarySector,sectorLoad:sectorState.sectorLoad,transferCount:sectorState.transfers.length,acceptanceRate:sectorState.acceptanceRate,coordinationRisk:sectorState.coordinationRisk,activeRules:sectorState.activeRules.length,last:sectorState.lastEvaluation||null};
}
function renderSectorHandoffBoard(){
  try{
    const anchor=document.querySelector('#arrivalDepartureInline') || document.querySelector('#dynamicWeatherInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#sectorHandoffInline'); if(old) old.remove();
    const p=sectorHandoffProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="sectorHandoffInline" class="airport-ops-board sector-handoff-inline">
      <div class="airport-ops-head"><b>SECTOR OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SETOR</small><b>${p.primarySector}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>LOAD</small><b>${p.sectorLoad}</b></div>
        <div><small>HOF</small><b>${p.transferCount}</b></div>
        <div><small>ACC</small><b>${p.acceptanceRate}%</b></div>
        <div><small>RISK</small><b>${p.coordinationRisk}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'sector-handoff-board');}
}
function initializeSectorHandoff(){
  loadSectorHandoff();
  refreshSectorHandoff('AUTO');
  renderSectorHandoffBoard();
  return sectorState;
}
function sectorHandoffStatus(){loadSectorHandoff();return {...sectorState,progress:sectorHandoffProgress(),catalog:SECTOR_HANDOFF_CATALOG};}
function sectorHandoffSelfCheck(){
  const issues=[];
  if(SECTOR_HANDOFF_CATALOG.controlSectors.length<7) issues.push('setores insuficientes');
  if(SECTOR_HANDOFF_CATALOG.handoffTypes.length<7) issues.push('handoffs insuficientes');
  refreshSectorHandoff('AUTO');
  const hof=addHandoff('TOWER_TO_DEPARTURE',true,'self-check');
  const evalResult=evaluateSectorHandoff(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!hof.id) issues.push('handoff inválido');
  if(!Number.isFinite(evalResult.evaluation.handoffScore)) issues.push('score inválido');
  if(!evalResult.evaluation.primarySector) issues.push('setor inválido');
  return {ok:issues.length===0,issues,sectors:SECTOR_HANDOFF_CATALOG.controlSectors.length,handoffs:SECTOR_HANDOFF_CATALOG.handoffTypes.length};
}
window.SKYWARD_SECTOR_HANDOFF=Object.freeze({
  schema:1,
  catalog:SECTOR_HANDOFF_CATALOG,
  load:loadSectorHandoff,
  save:saveSectorHandoff,
  init:initializeSectorHandoff,
  refresh:refreshSectorHandoff,
  handoff:addHandoff,
  evaluate:evaluateSectorHandoff,
  progress:sectorHandoffProgress,
  status:sectorHandoffStatus,
  board:renderSectorHandoffBoard,
  selfCheck:sectorHandoffSelfCheck
});
