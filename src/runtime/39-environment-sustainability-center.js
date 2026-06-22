/* @skyward-module 39-environment-sustainability-center
 * Environmental and sustainability center with noise, emissions, fuel burn, community impact, green initiatives and permits.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('39-environment-sustainability-center');
const ENVIRONMENT_SUSTAINABILITY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f36',
  environmentMetrics:[
    {id:'NOISE',name:'Ruído operacional',weight:25,target:78},
    {id:'CO2',name:'Emissões CO₂',weight:25,target:76},
    {id:'FUEL',name:'Eficiência de combustível',weight:18,target:74},
    {id:'COMMUNITY',name:'Comunidade',weight:17,target:72},
    {id:'WASTE',name:'Resíduos/solo',weight:8,target:70},
    {id:'PERMIT',name:'Licenças ambientais',weight:7,target:80}
  ],
  greenInitiatives:[
    {id:'CDA_APPROACH',name:'Continuous Descent Approach',cost:45000,benefit:{NOISE:8,CO2:6,FUEL:7}},
    {id:'GPU_PROGRAM',name:'Ground Power Units elétricos',cost:90000,benefit:{CO2:10,FUEL:6,COMMUNITY:4}},
    {id:'NIGHT_CURFEW',name:'Janela noturna sensível',cost:25000,benefit:{NOISE:12,COMMUNITY:9}},
    {id:'TAXI_OPTIMIZATION',name:'Taxi otimizado',cost:35000,benefit:{CO2:7,FUEL:9}},
    {id:'WASTE_RECYCLING',name:'Reciclagem terminal/rampa',cost:28000,benefit:{WASTE:13,COMMUNITY:3}},
    {id:'GREEN_CONSTRUCTION',name:'Obra verde certificada',cost:75000,benefit:{PERMIT:8,COMMUNITY:5,CO2:4}}
  ],
  noiseZones:[
    {id:'URBAN_NORTH',name:'Zona urbana norte',sensitivity:5},
    {id:'SCHOOL_AREA',name:'Área escolar',sensitivity:4},
    {id:'HOSPITAL_CORRIDOR',name:'Corredor hospitalar',sensitivity:5},
    {id:'INDUSTRIAL',name:'Zona industrial',sensitivity:2}
  ],
  environmentEvents:[
    {id:'COMMUNITY_COMPLAINT',name:'Reclamações da comunidade',impact:'community-12',risk:18},
    {id:'AIR_QUALITY_ALERT',name:'Alerta de qualidade do ar',impact:'co2-10',risk:16},
    {id:'NOISE_AUDIT',name:'Auditoria de ruído',impact:'permit-8',risk:20},
    {id:'FUEL_SPIKE',name:'Pico de consumo combustível',impact:'fuel-14',risk:14},
    {id:'CONSTRUCTION_DUST',name:'Poeira de obra',impact:'waste-10',risk:12}
  ],
  permitLevels:[
    {id:'FULL_COMPLIANCE',min:90,name:'Licença plena'},
    {id:'COMPLIANT',min:75,name:'Conforme'},
    {id:'WATCHLIST',min:55,name:'Em observação'},
    {id:'AT_RISK',min:0,name:'Risco de sanção'}
  ],
  esgBands:[
    {id:'LEADER',min:90,name:'ESG líder'},
    {id:'STRONG',min:75,name:'ESG forte'},
    {id:'PRESSURED',min:55,name:'ESG pressionado'},
    {id:'NON_COMPLIANT',min:0,name:'Não conforme'}
  ]
});
const ENVIRONMENT_SUSTAINABILITY_KEY='skywardEnvironmentSustainability_v1';
let environmentSustainabilityState={schema:1,metrics:{NOISE:82,CO2:80,FUEL:78,COMMUNITY:79,WASTE:76,PERMIT:84},initiatives:[],events:[],esgScore:80,permitStatus:'COMPLIANT',status:'STRONG',history:[],lastEvaluation:null};
function loadEnvironmentSustainability(){
  try{ const raw=localStorage?.getItem?.(ENVIRONMENT_SUSTAINABILITY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) environmentSustainabilityState={...environmentSustainabilityState,...parsed}; } }catch(e){ safeLogError?.(e,'environment-sustainability-load'); }
  return environmentSustainabilityState;
}
function saveEnvironmentSustainability(){
  try{ localStorage?.setItem?.(ENVIRONMENT_SUSTAINABILITY_KEY,JSON.stringify(environmentSustainabilityState)); }catch(e){ safeLogError?.(e,'environment-sustainability-save'); }
  return environmentSustainabilityState;
}
function esgBand(score){
  return ENVIRONMENT_SUSTAINABILITY_CATALOG.esgBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ENVIRONMENT_SUSTAINABILITY_CATALOG.esgBands.at(-1);
}
function permitBand(score){
  return ENVIRONMENT_SUSTAINABILITY_CATALOG.permitLevels.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ENVIRONMENT_SUSTAINABILITY_CATALOG.permitLevels.at(-1);
}
function initiativeById(id){ return ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.find(i=>i.id===id)||ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives[0]; }
function launchGreenInitiative(id='TAXI_OPTIMIZATION'){
  loadEnvironmentSustainability();
  const init=initiativeById(id);
  if(environmentSustainabilityState.initiatives.some(i=>i.initiativeId===init.id)) return environmentSustainabilityState.initiatives.find(i=>i.initiativeId===init.id);
  const item={id:`GRN-${String(Date.now()).slice(-6)}`,initiativeId:init.id,name:init.name,cost:init.cost,status:'ACTIVE',startedAt:new Date().toISOString()};
  environmentSustainabilityState.initiatives.unshift(item);
  for(const [metric,gain] of Object.entries(init.benefit||{})){
    environmentSustainabilityState.metrics[metric]=Math.min(100,Number(environmentSustainabilityState.metrics[metric]||75)+Number(gain||0));
  }
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return item;
}
function raiseEnvironmentEvent(id='COMMUNITY_COMPLAINT'){
  loadEnvironmentSustainability();
  const tpl=ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentEvents.find(e=>e.id===id)||ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentEvents[0];
  const item={id:`ENV-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  environmentSustainabilityState.events.unshift(item);
  environmentSustainabilityState.events=environmentSustainabilityState.events.slice(0,40);
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return item;
}
function closeEnvironmentEvent(id,ok=true){
  loadEnvironmentSustainability();
  const ev=environmentSustainabilityState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return ev||null;
}
function calculateEnvironmentalMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const openEvents=environmentSustainabilityState.events.filter(e=>e.status==='OPEN');
  const metrics={...environmentSustainabilityState.metrics};
  const airlineScore=Number(airline.progress?.score||80);
  const infraRisk=Number(infra.progress?.risk||0);
  const terminalScore=Number(airportAuth.progress?.score||80);
  const crisisScore=Number(crisis.progress?.score||100);
  metrics.NOISE=Math.max(0,Math.min(100,Number(metrics.NOISE||80)-denied*1.5-conflicts*2-openEvents.filter(e=>e.eventId==='NOISE_AUDIT').length*10+(finalScore>1800?1:0)));
  metrics.CO2=Math.max(0,Math.min(100,Number(metrics.CO2||80)-denied*2-Math.max(0,75-airlineScore)*0.18-infraRisk*0.08));
  metrics.FUEL=Math.max(0,Math.min(100,Number(metrics.FUEL||78)-denied*2-conflicts*1.2+(airlineScore>=85?2:0)));
  metrics.COMMUNITY=Math.max(0,Math.min(100,Number(metrics.COMMUNITY||78)-openEvents.filter(e=>e.eventId==='COMMUNITY_COMPLAINT').length*12-Math.max(0,70-terminalScore)*0.15));
  metrics.WASTE=Math.max(0,Math.min(100,Number(metrics.WASTE||76)-openEvents.filter(e=>e.eventId==='CONSTRUCTION_DUST').length*10-infraRisk*0.06));
  metrics.PERMIT=Math.max(0,Math.min(100,Number(metrics.PERMIT||82)-openEvents.length*3-Math.max(0,75-crisisScore)*0.12-incursions*5-(fail?4:0)));
  return metrics;
}
function evaluateEnvironmentSustainability(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadEnvironmentSustainability();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const metrics=calculateEnvironmentalMetrics(finalScore,statsObj,fail);
  environmentSustainabilityState.metrics=metrics;
  const weighted=Math.round(ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.reduce((a,m)=>a+(metrics[m.id]||0)*m.weight,0)/100);
  const openRisk=environmentSustainabilityState.events.filter(e=>e.status==='OPEN').reduce((a,e)=>a+Number(e.risk||0),0);
  const esg=Math.max(0,Math.min(100,Math.round(weighted-openRisk/12+environmentSustainabilityState.initiatives.length*1.5)));
  environmentSustainabilityState.esgScore=esg;
  environmentSustainabilityState.status=esgBand(esg).id;
  environmentSustainabilityState.permitStatus=permitBand(metrics.PERMIT||0).id;
  if(esg<55 && !environmentSustainabilityState.events.some(e=>e.status==='OPEN'&&e.eventId==='COMMUNITY_COMPLAINT')) raiseEnvironmentEvent('COMMUNITY_COMPLAINT');
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),metrics,weighted,esgScore:esg,status:environmentSustainabilityState.status,permitStatus:environmentSustainabilityState.permitStatus,openEvents:environmentSustainabilityState.events.filter(e=>e.status==='OPEN').length,initiatives:environmentSustainabilityState.initiatives.length};
  environmentSustainabilityState.history.unshift(evaluation);
  environmentSustainabilityState.history=environmentSustainabilityState.history.slice(0,80);
  environmentSustainabilityState.lastEvaluation=evaluation;
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return {state:environmentSustainabilityState,evaluation};
}
function environmentSustainabilityProgress(){
  loadEnvironmentSustainability();
  return {score:environmentSustainabilityState.esgScore,status:environmentSustainabilityState.status,permitStatus:environmentSustainabilityState.permitStatus,openEvents:environmentSustainabilityState.events.filter(e=>e.status==='OPEN').length,initiatives:environmentSustainabilityState.initiatives.length,metrics:environmentSustainabilityState.metrics,last:environmentSustainabilityState.lastEvaluation||null};
}
function renderEnvironmentSustainabilityBoard(){
  try{
    const anchor=document.querySelector('#infrastructureExpansionInline') || document.querySelector('#safetyComplianceInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#environmentSustainabilityInline'); if(old) old.remove();
    const p=environmentSustainabilityProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="environmentSustainabilityInline" class="airport-ops-board environment-sustainability-inline">
      <div class="airport-ops-head"><b>ENV ESG</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>ESG</small><b>${p.score}%</b></div>
        <div><small>LICENÇA</small><b>${p.permitStatus}</b></div>
        <div><small>RUÍDO</small><b>${Math.round(p.metrics.NOISE||0)}</b></div>
        <div><small>CO₂</small><b>${Math.round(p.metrics.CO2||0)}</b></div>
        <div><small>EVENTOS</small><b>${p.openEvents}</b></div>
        <div><small>VERDE</small><b>${p.initiatives}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'environment-sustainability-board'); }
}
function initializeEnvironmentSustainability(){
  loadEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return environmentSustainabilityState;
}
function environmentSustainabilityStatus(){ loadEnvironmentSustainability(); return {...environmentSustainabilityState,progress:environmentSustainabilityProgress(),catalog:ENVIRONMENT_SUSTAINABILITY_CATALOG}; }
function environmentSustainabilitySelfCheck(){
  const issues=[];
  if(ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.length<6) issues.push('métricas insuficientes');
  if(ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.length<6) issues.push('iniciativas insuficientes');
  const init=launchGreenInitiative('TAXI_OPTIMIZATION');
  const ev=raiseEnvironmentEvent('NOISE_AUDIT');
  const res=evaluateEnvironmentSustainability(2000,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!init.id || !ev.id) issues.push('iniciativa/evento inválidos');
  if(!Number.isFinite(res.evaluation.esgScore)) issues.push('score ESG inválido');
  closeEnvironmentEvent(ev.id,true);
  return {ok:issues.length===0,issues,metrics:ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.length,initiatives:ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.length};
}
window.SKYWARD_ENVIRONMENT_SUSTAINABILITY=Object.freeze({
  schema:1,
  catalog:ENVIRONMENT_SUSTAINABILITY_CATALOG,
  load:loadEnvironmentSustainability,
  save:saveEnvironmentSustainability,
  init:initializeEnvironmentSustainability,
  initiative:launchGreenInitiative,
  event:raiseEnvironmentEvent,
  close:closeEnvironmentEvent,
  evaluate:evaluateEnvironmentSustainability,
  progress:environmentSustainabilityProgress,
  status:environmentSustainabilityStatus,
  board:renderEnvironmentSustainabilityBoard,
  selfCheck:environmentSustainabilitySelfCheck
});
