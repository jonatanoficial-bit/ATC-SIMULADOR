/* @skyward-module 43-multi-airport-network-center
 * Multi-airport regional network center with hubs, routes, alternates, inter-airport slots, connection banks and resilience.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('43-multi-airport-network-center');
const MULTI_AIRPORT_NETWORK_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f40',
  airports:[
    {icao:'SBGR',name:'São Paulo Guarulhos',role:'GLOBAL_HUB',capacity:100,resilience:82},
    {icao:'SBSP',name:'Congonhas',role:'DOMESTIC_CORE',capacity:72,resilience:74},
    {icao:'SBKP',name:'Viracopos',role:'CARGO_RELIEF',capacity:86,resilience:78},
    {icao:'SBRJ',name:'Santos Dumont',role:'SHUTTLE_NODE',capacity:64,resilience:70},
    {icao:'SBGL',name:'Galeão',role:'INTERNATIONAL_RELIEF',capacity:82,resilience:76},
    {icao:'SBCF',name:'Confins',role:'REGIONAL_HUB',capacity:78,resilience:80}
  ],
  routeBanks:[
    {id:'PONTE_AEREA',name:'Ponte aérea SP-Rio',airports:['SBSP','SBRJ','SBGR'],value:34,connectionPressure:18},
    {id:'GRU_GLOBAL',name:'Banco global GRU',airports:['SBGR','SBGL','SBCF'],value:48,connectionPressure:26},
    {id:'VCP_CARGO',name:'Malha cargueira VCP',airports:['SBKP','SBGR','SBCF'],value:38,connectionPressure:14},
    {id:'REGIONAL_FEED',name:'Alimentação regional',airports:['SBCF','SBGR','SBSP'],value:30,connectionPressure:20},
    {id:'RIO_RELIEF',name:'Alívio Rio internacional',airports:['SBGL','SBRJ','SBGR'],value:32,connectionPressure:16}
  ],
  networkPolicies:[
    {id:'BALANCED_FLOW',name:'Fluxo equilibrado',slotBoost:0,reputationImpact:0,costImpact:0},
    {id:'HUB_PRIORITY',name:'Priorizar hub principal',slotBoost:8,reputationImpact:-2,costImpact:5},
    {id:'REGIONAL_RESILIENCE',name:'Resiliência regional',slotBoost:4,reputationImpact:4,costImpact:8},
    {id:'CARGO_PROTECTION',name:'Proteção cargueira',slotBoost:5,reputationImpact:0,costImpact:4},
    {id:'PASSENGER_PROTECTION',name:'Proteger conexões',slotBoost:3,reputationImpact:7,costImpact:6}
  ],
  disruptionTypes:[
    {id:'HUB_OVERLOAD',name:'Sobrecarga no hub',risk:24,metric:'hub'},
    {id:'ALTERNATE_SATURATION',name:'Alternados saturados',risk:20,metric:'resilience'},
    {id:'SLOT_MISALIGNMENT',name:'Desalinhamento de slots',risk:18,metric:'slots'},
    {id:'CONNECTION_WAVE_LOST',name:'Onda de conexão perdida',risk:28,metric:'connections'},
    {id:'CARGO_BANK_BREAK',name:'Banco cargueiro quebrado',risk:16,metric:'cargo'},
    {id:'REGIONAL_WEATHER_RING',name:'Anel meteorológico regional',risk:26,metric:'weather'}
  ],
  recoveryActions:[
    {id:'REROUTE_TO_RELIEF',name:'Redirecionar para aeroporto alívio',cost:18000,benefit:{resilience:9,slots:4}},
    {id:'PROTECT_BANK',name:'Proteger banco de conexões',cost:14000,benefit:{connections:11,reputation:3}},
    {id:'CARGO_SWEEP',name:'Varredura cargueira',cost:11000,benefit:{cargo:10,revenue:3}},
    {id:'REGIONAL_GROUND_DELAY',name:'Ground delay regional',cost:9000,benefit:{slots:8,hub:5}},
    {id:'OPEN_ALTERNATE_WINDOW',name:'Abrir janela de alternados',cost:16000,benefit:{resilience:12}}
  ],
  networkBands:[
    {id:'WORLD_NETWORK',min:90,name:'Rede world-class'},
    {id:'CONNECTED',min:75,name:'Rede conectada'},
    {id:'FRAGILE',min:55,name:'Rede frágil'},
    {id:'DISCONNECTED',min:0,name:'Rede desconectada'}
  ],
  networkKPIs:[
    {id:'HUB_SCORE',name:'Score de hub'},
    {id:'CONNECTION_PROTECTION',name:'Proteção de conexões'},
    {id:'ALTERNATE_CAPACITY',name:'Capacidade de alternados'},
    {id:'REGIONAL_REVENUE',name:'Receita regional'},
    {id:'NETWORK_RESILIENCE',name:'Resiliência de rede'}
  ]
});
const MULTI_AIRPORT_NETWORK_KEY='skywardMultiAirportNetwork_v1';
let multiAirportNetworkState={schema:1,policy:'BALANCED_FLOW',disruptions:[],actions:[],networkScore:78,hubScore:80,connectionProtection:76,alternateCapacity:74,regionalRevenue:0,status:'CONNECTED',history:[],lastEvaluation:null};
function loadMultiAirportNetwork(){
  try{ const raw=localStorage?.getItem?.(MULTI_AIRPORT_NETWORK_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) multiAirportNetworkState={...multiAirportNetworkState,...parsed}; } }catch(e){ safeLogError?.(e,'multi-airport-network-load'); }
  return multiAirportNetworkState;
}
function saveMultiAirportNetwork(){
  try{ localStorage?.setItem?.(MULTI_AIRPORT_NETWORK_KEY,JSON.stringify(multiAirportNetworkState)); }catch(e){ safeLogError?.(e,'multi-airport-network-save'); }
  return multiAirportNetworkState;
}
function networkBand(score){
  return MULTI_AIRPORT_NETWORK_CATALOG.networkBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||MULTI_AIRPORT_NETWORK_CATALOG.networkBands.at(-1);
}
function policyById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.networkPolicies.find(p=>p.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.networkPolicies[0]; }
function disruptionById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.disruptionTypes.find(d=>d.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.disruptionTypes[0]; }
function actionById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.recoveryActions.find(a=>a.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.recoveryActions[0]; }
function setNetworkPolicy(id='BALANCED_FLOW'){
  loadMultiAirportNetwork();
  multiAirportNetworkState.policy=policyById(id).id;
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return policyById(multiAirportNetworkState.policy);
}
function raiseNetworkDisruption(id='HUB_OVERLOAD'){
  loadMultiAirportNetwork();
  const tpl=disruptionById(id);
  const item={id:`NET-${String(Date.now()).slice(-6)}`,disruptionId:tpl.id,name:tpl.name,risk:tpl.risk,metric:tpl.metric,status:'OPEN',at:new Date().toISOString()};
  multiAirportNetworkState.disruptions.unshift(item);
  multiAirportNetworkState.disruptions=multiAirportNetworkState.disruptions.slice(0,50);
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return item;
}
function takeNetworkAction(id='PROTECT_BANK'){
  loadMultiAirportNetwork();
  const act=actionById(id);
  const item={id:`NAC-${String(Date.now()).slice(-6)}`,actionId:act.id,name:act.name,cost:act.cost,status:'ACTIVE',at:new Date().toISOString()};
  multiAirportNetworkState.actions.unshift(item);
  multiAirportNetworkState.actions=multiAirportNetworkState.actions.slice(0,50);
  for(const [k,gain] of Object.entries(act.benefit||{})){
    if(k==='resilience') multiAirportNetworkState.alternateCapacity=Math.min(100,multiAirportNetworkState.alternateCapacity+gain);
    if(k==='connections') multiAirportNetworkState.connectionProtection=Math.min(100,multiAirportNetworkState.connectionProtection+gain);
    if(k==='hub') multiAirportNetworkState.hubScore=Math.min(100,multiAirportNetworkState.hubScore+gain);
    if(k==='revenue') multiAirportNetworkState.regionalRevenue+=gain*1000;
  }
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return item;
}
function closeNetworkDisruption(id,ok=true){
  loadMultiAirportNetwork();
  const d=multiAirportNetworkState.disruptions.find(x=>x.id===id);
  if(d){ d.status=ok?'CLOSED':'ESCALATED'; d.closedAt=new Date().toISOString(); }
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return d||null;
}
function networkActionBenefit(kind){
  let total=0;
  for(const a of multiAirportNetworkState.actions){
    const tpl=actionById(a.actionId);
    total+=Number(tpl.benefit?.[kind]||0);
  }
  return total;
}
function calculateNetworkMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const networkFlow=window.SKYWARD_NETWORK_FLOW?.status?.()||{};
  const policy=policyById(multiAirportNetworkState.policy);
  const open=multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN');
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||80);
  const revenueScore=Number(revenue.progress?.score||75);
  const passengerScore=Number(passenger.progress?.score||78);
  const crisisScore=Number(crisis.progress?.score||90);
  const workforceScore=Number(workforce.progress?.score||78);
  const delay=Number(networkFlow.networkDelayMin||0);
  const hubBase=Math.round((airlineScore*.28+revenueScore*.18+workforceScore*.16+crisisScore*.12+finalScore/40)-denied*2-conflicts*4-incursions*9-delay*.25+policy.slotBoost);
  const connectionBase=Math.round((passengerScore*.30+airlineScore*.26+crisisScore*.16+workforceScore*.12+finalScore/55)-denied*3-open.filter(d=>d.metric==='connections').length*10+networkActionBenefit('connections'));
  const alternateBase=Math.round((multiAirportNetworkState.alternateCapacity*.35+crisisScore*.25+workforceScore*.18+passengerScore*.12)-open.filter(d=>d.metric==='resilience').length*8+networkActionBenefit('resilience'));
  const cargoRevenue=networkActionBenefit('cargo')*1500 + (MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.find(r=>r.id==='VCP_CARGO')?.value||0)*800;
  const regionalRevenue=Math.max(0,Math.round(120000 + revenueScore*900 + airlineScore*700 + cargoRevenue - open.length*4500 - policy.costImpact*1000));
  return {
    hubScore:Math.max(0,Math.min(100,hubBase)),
    connectionProtection:Math.max(0,Math.min(100,connectionBase)),
    alternateCapacity:Math.max(0,Math.min(100,alternateBase)),
    regionalRevenue,
    openRisk:open.reduce((a,d)=>a+Number(d.risk||0),0),
    policy:policy.id,
    drivers:{airlineScore,revenueScore,passengerScore,crisisScore,workforceScore,delay,denied,conflicts,incursions}
  };
}
function evaluateMultiAirportNetwork(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadMultiAirportNetwork();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=3 && !multiAirportNetworkState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='SLOT_MISALIGNMENT')) raiseNetworkDisruption('SLOT_MISALIGNMENT');
  if((statsObj.runwayIncursions||0)>0 && !multiAirportNetworkState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='REGIONAL_WEATHER_RING')) raiseNetworkDisruption('REGIONAL_WEATHER_RING');
  const metrics=calculateNetworkMetrics(finalScore,statsObj,fail);
  multiAirportNetworkState.hubScore=metrics.hubScore;
  multiAirportNetworkState.connectionProtection=metrics.connectionProtection;
  multiAirportNetworkState.alternateCapacity=metrics.alternateCapacity;
  multiAirportNetworkState.regionalRevenue=metrics.regionalRevenue;
  const revenueComponent=Math.max(0,Math.min(100,Math.round(metrics.regionalRevenue/2400)));
  const score=Math.max(0,Math.min(100,Math.round(metrics.hubScore*.26+metrics.connectionProtection*.25+metrics.alternateCapacity*.21+revenueComponent*.16+Math.max(0,100-metrics.openRisk)*.12-(fail?8:0))));
  multiAirportNetworkState.networkScore=score;
  multiAirportNetworkState.status=networkBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,networkScore:score,status:multiAirportNetworkState.status,openDisruptions:multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN').length,actions:multiAirportNetworkState.actions.length};
  multiAirportNetworkState.history.unshift(evaluation);
  multiAirportNetworkState.history=multiAirportNetworkState.history.slice(0,100);
  multiAirportNetworkState.lastEvaluation=evaluation;
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return {state:multiAirportNetworkState,evaluation};
}
function multiAirportNetworkProgress(){
  loadMultiAirportNetwork();
  return {score:multiAirportNetworkState.networkScore,status:multiAirportNetworkState.status,hubScore:multiAirportNetworkState.hubScore,connectionProtection:multiAirportNetworkState.connectionProtection,alternateCapacity:multiAirportNetworkState.alternateCapacity,regionalRevenue:multiAirportNetworkState.regionalRevenue,policy:multiAirportNetworkState.policy,openDisruptions:multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN').length,last:multiAirportNetworkState.lastEvaluation||null};
}
function renderMultiAirportNetworkBoard(){
  try{
    const anchor=document.querySelector('#passengerReputationInline') || document.querySelector('#workforceStaffingInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#multiAirportNetworkInline'); if(old) old.remove();
    const p=multiAirportNetworkProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="multiAirportNetworkInline" class="airport-ops-board multi-airport-network-inline">
      <div class="airport-ops-head"><b>MULTI HUB</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REDE</small><b>${p.score}%</b></div>
        <div><small>HUB</small><b>${p.hubScore}</b></div>
        <div><small>CONEX.</small><b>${p.connectionProtection}</b></div>
        <div><small>ALT.</small><b>${p.alternateCapacity}</b></div>
        <div><small>ROTAS</small><b>${MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length}</b></div>
        <div><small>RECEITA</small><b>${Math.round(p.regionalRevenue/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'multi-airport-network-board'); }
}
function initializeMultiAirportNetwork(){
  loadMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return multiAirportNetworkState;
}
function multiAirportNetworkStatus(){ loadMultiAirportNetwork(); return {...multiAirportNetworkState,progress:multiAirportNetworkProgress(),catalog:MULTI_AIRPORT_NETWORK_CATALOG}; }
function multiAirportNetworkSelfCheck(){
  const issues=[];
  if(MULTI_AIRPORT_NETWORK_CATALOG.airports.length<6) issues.push('aeroportos insuficientes');
  if(MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length<5) issues.push('bancos de rota insuficientes');
  const policy=setNetworkPolicy('PASSENGER_PROTECTION');
  const disruption=raiseNetworkDisruption('CONNECTION_WAVE_LOST');
  const action=takeNetworkAction('PROTECT_BANK');
  const res=evaluateMultiAirportNetwork(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!policy.id || !disruption.id || !action.id) issues.push('política/interrupção/ação inválida');
  if(!Number.isFinite(res.evaluation.networkScore)) issues.push('score de rede inválido');
  return {ok:issues.length===0,issues,airports:MULTI_AIRPORT_NETWORK_CATALOG.airports.length,routeBanks:MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length};
}
window.SKYWARD_MULTI_AIRPORT_NETWORK=Object.freeze({
  schema:1,
  catalog:MULTI_AIRPORT_NETWORK_CATALOG,
  load:loadMultiAirportNetwork,
  save:saveMultiAirportNetwork,
  init:initializeMultiAirportNetwork,
  policy:setNetworkPolicy,
  disruption:raiseNetworkDisruption,
  action:takeNetworkAction,
  close:closeNetworkDisruption,
  evaluate:evaluateMultiAirportNetwork,
  progress:multiAirportNetworkProgress,
  status:multiAirportNetworkStatus,
  board:renderMultiAirportNetworkBoard,
  selfCheck:multiAirportNetworkSelfCheck
});
