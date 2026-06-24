/* @skyward-module 63-dynamic-weather-atis-notam-center
 * Dynamic Weather Radar, ATIS and NOTAM Center for crosswind, visibility, ceiling, storm cells and operational impact.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('63-dynamic-weather-atis-notam-center');
const DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f60',
  weatherPhenomena:[
    {id:'VFR_CLEAR',name:'Céu aberto VFR',severity:4,visibilityKm:10,ceilingFt:8000,windKt:8},
    {id:'MVFR_HAZE',name:'Névoa MVFR',severity:14,visibilityKm:6,ceilingFt:2500,windKt:12},
    {id:'IFR_LOW_CEILING',name:'Teto baixo IFR',severity:24,visibilityKm:4,ceilingFt:900,windKt:15},
    {id:'STORM_CELL',name:'Célula de tempestade',severity:36,visibilityKm:2,ceilingFt:700,windKt:28},
    {id:'CROSSWIND_ALERT',name:'Alerta vento cruzado',severity:30,visibilityKm:8,ceilingFt:3500,windKt:26},
    {id:'LOW_VIS_FOG',name:'Nevoeiro baixa visibilidade',severity:34,visibilityKm:1.5,ceilingFt:400,windKt:6},
    {id:'WET_RUNWAY',name:'Pista molhada',severity:22,visibilityKm:7,ceilingFt:1800,windKt:14},
    {id:'GUST_FRONT',name:'Rajada/gust front',severity:32,visibilityKm:5,ceilingFt:1600,windKt:32}
  ],
  atisTemplates:[
    {id:'INFO_ALPHA',name:'Informação Alpha',runwayMode:'SINGLE_ACTIVE',procedure:'VISUAL_URBAN'},
    {id:'INFO_BRAVO',name:'Informação Bravo',runwayMode:'PARALLEL_SEGREGATED',procedure:'INSTRUMENT_IFR'},
    {id:'INFO_CHARLIE',name:'Informação Charlie',runwayMode:'PARALLEL_MIXED',procedure:'PARALLEL_RUNWAY'},
    {id:'INFO_DELTA',name:'Informação Delta',runwayMode:'LOW_VIS_PROCEDURAL',procedure:'LOW_VIS_IFR'},
    {id:'INFO_ECHO',name:'Informação Echo',runwayMode:'CROSSWIND_RESTRICTED',procedure:'INSTRUMENT_IFR'}
  ],
  notamTypes:[
    {id:'RUNWAY_PARTIAL_CLOSURE',name:'Fechamento parcial de pista',severity:28,impact:'capacity-1'},
    {id:'ILS_MAINTENANCE',name:'ILS em manutenção',severity:24,impact:'ifr-risk+8'},
    {id:'TAXIWAY_WORK',name:'Obra em taxiway',severity:18,impact:'ground-delay+12'},
    {id:'BIRD_ACTIVITY',name:'Atividade de aves',severity:16,impact:'departure-risk+6'},
    {id:'LIGHTING_RESTRICTION',name:'Restrição de balizamento',severity:20,impact:'night-risk+8'},
    {id:'VIP_MOVEMENT',name:'Movimento VIP',severity:14,impact:'flow-hold+6'},
    {id:'FUEL_TRUCK_DELAY',name:'Atraso abastecimento',severity:12,impact:'turnaround-delay+8'}
  ],
  radarCells:[
    {id:'CELL_LIGHT',name:'Eco leve',risk:8,movementKt:12},
    {id:'CELL_MODERATE',name:'Eco moderado',risk:18,movementKt:18},
    {id:'CELL_HEAVY',name:'Eco forte',risk:30,movementKt:24},
    {id:'CELL_SEVERE',name:'Eco severo',risk:42,movementKt:32},
    {id:'CELL_STATIONARY',name:'Célula quase estacionária',risk:26,movementKt:5}
  ],
  operationalImpacts:[
    {id:'RUNWAY_SWITCH',name:'Troca de pista',penalty:16},
    {id:'ARRIVAL_SPACING',name:'Aumentar separação de chegada',penalty:12},
    {id:'GROUND_DELAY',name:'Atraso em solo',penalty:10},
    {id:'DEPARTURE_HOLD',name:'Segurar decolagens',penalty:14},
    {id:'LOW_VIS_PROCEDURE',name:'Procedimento baixa visibilidade',penalty:18},
    {id:'CROSSWIND_LIMIT',name:'Limite vento cruzado',penalty:16}
  ],
  weatherBands:[
    {id:'NORMAL',min:88,name:'Normal'},
    {id:'WATCH',min:72,name:'Atenção'},
    {id:'ADVERSE',min:52,name:'Adverso'},
    {id:'SEVERE',min:0,name:'Severo'}
  ]
});
const DYNAMIC_WEATHER_KEY='skywardDynamicWeatherAtisNotam_v1';
let dynamicWeatherState={schema:1,activePhenomenon:'VFR_CLEAR',activeAtis:'INFO_ALPHA',activeNotams:[],radarCells:[],weatherScore:90,status:'NORMAL',crosswindKt:0,visibilityKm:10,ceilingFt:8000,operationalImpacts:[],history:[],lastEvaluation:null};
function loadDynamicWeather(){try{const raw=localStorage?.getItem?.(DYNAMIC_WEATHER_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)dynamicWeatherState={...dynamicWeatherState,...parsed};}}catch(e){safeLogError?.(e,'dynamic-weather-load');}return dynamicWeatherState;}
function saveDynamicWeather(){try{localStorage?.setItem?.(DYNAMIC_WEATHER_KEY,JSON.stringify(dynamicWeatherState));}catch(e){safeLogError?.(e,'dynamic-weather-save');}return dynamicWeatherState;}
function phenomenonById(id){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.find(w=>w.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena[0];}
function atisById(id){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.atisTemplates.find(a=>a.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.atisTemplates[0];}
function bandForWeather(score){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherBands.at(-1);}
function pickWeatherForAirport(){
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const procedure=String(airport.procedure||'VISUAL_URBAN');
  const active=String(airport.activeAirport||'SBSP');
  if(procedure.includes('LOW_VIS')) return 'LOW_VIS_FOG';
  if(procedure.includes('IFR')) return 'IFR_LOW_CEILING';
  if(procedure.includes('PARALLEL') && ['KJFK','RJTT','OMDB'].includes(active)) return 'CROSSWIND_ALERT';
  if(procedure.includes('COASTAL')) return 'MVFR_HAZE';
  return 'VFR_CLEAR';
}
function generateRadarCells(phenomenon){
  if(['VFR_CLEAR','MVFR_HAZE'].includes(phenomenon.id)) return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[0]];
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='GUST_FRONT') return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[2],DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[3]];
  if(phenomenon.id==='LOW_VIS_FOG') return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[4]];
  return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[1]];
}
function generateNotams(phenomenon){
  const list=[];
  if(phenomenon.id==='LOW_VIS_FOG') list.push('ILS_MAINTENANCE','LIGHTING_RESTRICTION');
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='GUST_FRONT') list.push('RUNWAY_PARTIAL_CLOSURE','BIRD_ACTIVITY');
  if(phenomenon.id==='WET_RUNWAY') list.push('TAXIWAY_WORK');
  if(phenomenon.id==='CROSSWIND_ALERT') list.push('RUNWAY_PARTIAL_CLOSURE');
  return list.map((id,idx)=>{
    const n=DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.find(x=>x.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes[idx]||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes[0];
    return {id:`NOTAM-${id}-${String(Date.now()+idx).slice(-5)}`,type:n.id,name:n.name,severity:n.severity,impact:n.impact,active:true,at:new Date().toISOString()};
  });
}
function chooseAtisForWeather(phenomenon){
  if(phenomenon.id==='LOW_VIS_FOG') return 'INFO_DELTA';
  if(phenomenon.id==='CROSSWIND_ALERT'||phenomenon.id==='GUST_FRONT') return 'INFO_ECHO';
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='IFR_LOW_CEILING') return 'INFO_BRAVO';
  if(phenomenon.id==='WET_RUNWAY') return 'INFO_BRAVO';
  return 'INFO_ALPHA';
}
function refreshDynamicWeather(typeId='AUTO'){
  loadDynamicWeather();
  const chosen=typeId==='AUTO'?pickWeatherForAirport():typeId;
  const phenomenon=phenomenonById(chosen);
  dynamicWeatherState.activePhenomenon=phenomenon.id;
  dynamicWeatherState.visibilityKm=phenomenon.visibilityKm;
  dynamicWeatherState.ceilingFt=phenomenon.ceilingFt;
  dynamicWeatherState.crosswindKt=Math.max(0,Math.round(phenomenon.windKt*(phenomenon.id.includes('CROSSWIND')?0.82:0.38)));
  dynamicWeatherState.radarCells=generateRadarCells(phenomenon);
  dynamicWeatherState.activeNotams=generateNotams(phenomenon);
  dynamicWeatherState.activeAtis=chooseAtisForWeather(phenomenon);
  const atis=atisById(dynamicWeatherState.activeAtis);
  try{
    if(window.SKYWARD_WORLD_AIRPORTS?.procedure && atis.procedure) window.SKYWARD_WORLD_AIRPORTS.procedure(atis.procedure);
  }catch(e){safeLogError?.(e,'dynamic-weather-apply-procedure');}
  saveDynamicWeather();
  renderDynamicWeatherBoard();
  return dynamicWeatherState;
}
function computeOperationalImpacts(){
  loadDynamicWeather();
  const p=phenomenonById(dynamicWeatherState.activePhenomenon);
  const impacts=[];
  if(p.visibilityKm<=3||p.ceilingFt<=900) impacts.push('LOW_VIS_PROCEDURE','ARRIVAL_SPACING');
  if(dynamicWeatherState.crosswindKt>=18) impacts.push('CROSSWIND_LIMIT','RUNWAY_SWITCH');
  if(dynamicWeatherState.activeNotams.some(n=>n.type==='RUNWAY_PARTIAL_CLOSURE')) impacts.push('DEPARTURE_HOLD');
  if(dynamicWeatherState.activeNotams.some(n=>n.type==='TAXIWAY_WORK'||n.type==='FUEL_TRUCK_DELAY')) impacts.push('GROUND_DELAY');
  if(p.id==='STORM_CELL'||p.id==='GUST_FRONT') impacts.push('ARRIVAL_SPACING','DEPARTURE_HOLD');
  return [...new Set(impacts)].map(id=>DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.operationalImpacts.find(i=>i.id===id)).filter(Boolean);
}
function evaluateDynamicWeather(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadDynamicWeather();
  if(!dynamicWeatherState.activePhenomenon) refreshDynamicWeather('AUTO');
  const p=phenomenonById(dynamicWeatherState.activePhenomenon);
  const radarRisk=dynamicWeatherState.radarCells.reduce((a,c)=>a+Number(c.risk||0),0);
  const notamRisk=dynamicWeatherState.activeNotams.reduce((a,n)=>a+Number(n.severity||0),0);
  const impacts=computeOperationalImpacts();
  const impactPenalty=impacts.reduce((a,i)=>a+Number(i.penalty||0),0);
  const world=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const replay=window.SKYWARD_REPLAY_TIMELINE?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0), denied=Number(statsObj.denied||0);
  const base=100 - p.severity*.72 - radarRisk*.28 - notamRisk*.16 - impactPenalty*.20 - conflicts*6 - incursions*10 - Math.max(0,denied-1)*2 - (fail?10:0);
  const support=Math.min(10,Number(world.score||70)/12)+Math.min(6,Number(replay.score||70)/18)+Math.min(6,Number(finalScore||0)/650);
  const weatherScore=Math.max(0,Math.min(100,Math.round(base+support)));
  const band=bandForWeather(weatherScore);
  dynamicWeatherState.operationalImpacts=impacts;
  dynamicWeatherState.weatherScore=weatherScore;
  dynamicWeatherState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||world.activeAirport||'SBSP',weatherScore,status:band.id,statusName:band.name,phenomenon:p.id,atis:dynamicWeatherState.activeAtis,notams:dynamicWeatherState.activeNotams.length,crosswindKt:dynamicWeatherState.crosswindKt,visibilityKm:dynamicWeatherState.visibilityKm,ceilingFt:dynamicWeatherState.ceilingFt,radarRisk,impactCount:impacts.length,procedure:atisById(dynamicWeatherState.activeAtis).procedure,finalScore:Math.round(finalScore||0)};
  dynamicWeatherState.lastEvaluation=evaluation;
  dynamicWeatherState.history.unshift(evaluation);
  dynamicWeatherState.history=dynamicWeatherState.history.slice(0,100);
  saveDynamicWeather();
  renderDynamicWeatherBoard();
  return {state:dynamicWeatherState,evaluation};
}
function dynamicWeatherProgress(){
  loadDynamicWeather();
  return {score:dynamicWeatherState.weatherScore,status:dynamicWeatherState.status,phenomenon:dynamicWeatherState.activePhenomenon,atis:dynamicWeatherState.activeAtis,notams:dynamicWeatherState.activeNotams.length,crosswindKt:dynamicWeatherState.crosswindKt,visibilityKm:dynamicWeatherState.visibilityKm,ceilingFt:dynamicWeatherState.ceilingFt,radarRisk:dynamicWeatherState.radarCells.reduce((a,c)=>a+Number(c.risk||0),0),impacts:dynamicWeatherState.operationalImpacts.length,last:dynamicWeatherState.lastEvaluation||null};
}
function renderDynamicWeatherBoard(){
  try{
    const anchor=document.querySelector('#worldAirportInline') || document.querySelector('#replayTimelineInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#dynamicWeatherInline'); if(old) old.remove();
    const p=dynamicWeatherProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="dynamicWeatherInline" class="airport-ops-board dynamic-weather-inline">
      <div class="airport-ops-head"><b>WEATHER OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>WX</small><b>${p.phenomenon}</b></div>
        <div><small>ATIS</small><b>${p.atis}</b></div>
        <div><small>VIS</small><b>${p.visibilityKm}km</b></div>
        <div><small>XWIND</small><b>${p.crosswindKt}kt</b></div>
        <div><small>NOTAM</small><b>${p.notams}</b></div>
        <div><small>RISK</small><b>${p.radarRisk}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'dynamic-weather-board');}
}
function initializeDynamicWeather(){
  loadDynamicWeather();
  if(!dynamicWeatherState.activePhenomenon) refreshDynamicWeather('AUTO');
  else renderDynamicWeatherBoard();
  return dynamicWeatherState;
}
function dynamicWeatherStatus(){loadDynamicWeather();return {...dynamicWeatherState,progress:dynamicWeatherProgress(),catalog:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG};}
function dynamicWeatherSelfCheck(){
  const issues=[];
  if(DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.length<8) issues.push('fenômenos insuficientes');
  if(DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.length<7) issues.push('NOTAMs insuficientes');
  refreshDynamicWeather('CROSSWIND_ALERT');
  const evalResult=evaluateDynamicWeather(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!Number.isFinite(evalResult.evaluation.weatherScore)) issues.push('score inválido');
  if(evalResult.evaluation.crosswindKt<=0) issues.push('vento cruzado inválido');
  return {ok:issues.length===0,issues,phenomena:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.length,notams:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.length};
}
window.SKYWARD_DYNAMIC_WEATHER=Object.freeze({
  schema:1,
  catalog:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG,
  load:loadDynamicWeather,
  save:saveDynamicWeather,
  init:initializeDynamicWeather,
  refresh:refreshDynamicWeather,
  evaluate:evaluateDynamicWeather,
  impacts:computeOperationalImpacts,
  progress:dynamicWeatherProgress,
  status:dynamicWeatherStatus,
  board:renderDynamicWeatherBoard,
  selfCheck:dynamicWeatherSelfCheck
});
