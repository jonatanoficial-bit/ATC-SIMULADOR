/* @skyward-module 34-airline-operations-center
 * Airline Operations Center with carrier profiles, scheduled banks, passenger/cargo demand, SLA and satisfaction.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('34-airline-operations-center');
const AIRLINE_OPS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f31',
  airlines:[
    {id:'AZU',name:'Azul Connect',baseAirports:['SBKP','SBGR'],priority:'CARGO_PASSENGER',slaTarget:82},
    {id:'GLO',name:'Gol Shuttle',baseAirports:['SBSP','SBGR','SBBR'],priority:'PUNCTUALITY',slaTarget:84},
    {id:'LAT',name:'LATAM Network',baseAirports:['SBGR','SBBR'],priority:'CONNECTIONS',slaTarget:86},
    {id:'DAL',name:'Delta Global',baseAirports:['KATL'],priority:'HUB_FLOW',slaTarget:88},
    {id:'BOX',name:'Box Cargo',baseAirports:['SBKP','KATL'],priority:'CARGO',slaTarget:80}
  ],
  routeBanks:[
    {id:'MORNING_SHUTTLE',name:'Ponte aérea manhã',airports:['SBSP','SBBR'],window:'06:00-10:00',demand:78},
    {id:'GRU_INTL_BANK',name:'Banco internacional GRU',airports:['SBGR'],window:'18:00-23:00',demand:92},
    {id:'VCP_CARGO_WAVE',name:'Onda cargueira VCP',airports:['SBKP'],window:'01:00-05:00',demand:88},
    {id:'ATL_GLOBAL_PUSH',name:'Push global ATL',airports:['KATL'],window:'12:00-16:00',demand:96}
  ],
  slaMetrics:[
    {id:'PUNCTUALITY',name:'Pontualidade',weight:30},
    {id:'SAFETY',name:'Segurança',weight:30},
    {id:'CONNECTIONS',name:'Conexões protegidas',weight:20},
    {id:'CARGO',name:'Carga dentro da janela',weight:10},
    {id:'COMMUNICATION',name:'Comunicação operacional',weight:10}
  ],
  serviceRequests:[
    {id:'REQ_PRIORITY_TURN',name:'Turnaround prioritário',impact:'delay-8',risk:10},
    {id:'REQ_CARGO_WINDOW',name:'Janela cargueira rígida',impact:'cargo+15',risk:12},
    {id:'REQ_CONNECTION_HOLD',name:'Segurar conexão crítica',impact:'connections+20',risk:18},
    {id:'REQ_HUB_PUSH',name:'Push de hub coordenado',impact:'flow+18',risk:20}
  ],
  demandProfiles:[
    {id:'NORMAL',passengers:1.0,cargo:1.0,delaySensitivity:1.0},
    {id:'HOLIDAY',passengers:1.35,cargo:.9,delaySensitivity:1.2},
    {id:'CARGO_PEAK',passengers:.9,cargo:1.55,delaySensitivity:1.1},
    {id:'IRREGULAR_OPS',passengers:1.1,cargo:1.2,delaySensitivity:1.45}
  ],
  satisfactionBands:[
    {id:'EXCELLENT',min:90,name:'Excelente'},
    {id:'GOOD',min:75,name:'Boa'},
    {id:'WATCH',min:55,name:'Atenção'},
    {id:'AT_RISK',min:0,name:'Contrato em risco'}
  ]
});
const AIRLINE_OPS_KEY='skywardAirlineOps_v1';
let airlineOpsState={schema:1,activeDemandProfile:'NORMAL',airlineScores:{},serviceQueue:[],history:[],airlineOpsScore:0,status:'OPS_NORMAL',lastEvaluation:null};
function loadAirlineOps(){
  try{ const raw=localStorage?.getItem?.(AIRLINE_OPS_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airlineOpsState={...airlineOpsState,...parsed}; } }catch(e){ safeLogError?.(e,'airline-ops-load'); }
  return airlineOpsState;
}
function saveAirlineOps(){
  try{ localStorage?.setItem?.(AIRLINE_OPS_KEY,JSON.stringify(airlineOpsState)); }catch(e){ safeLogError?.(e,'airline-ops-save'); }
  return airlineOpsState;
}
function airlinesForAirport(icao){
  return AIRLINE_OPS_CATALOG.airlines.filter(a=>a.baseAirports.includes(icao));
}
function routeBanksForAirport(icao){
  return AIRLINE_OPS_CATALOG.routeBanks.filter(b=>b.airports.includes(icao));
}
function demandProfile(){
  return AIRLINE_OPS_CATALOG.demandProfiles.find(d=>d.id===airlineOpsState.activeDemandProfile)||AIRLINE_OPS_CATALOG.demandProfiles[0];
}
function satisfactionBand(score){
  return AIRLINE_OPS_CATALOG.satisfactionBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||AIRLINE_OPS_CATALOG.satisfactionBands.at(-1);
}
function queueServiceRequest(requestId='REQ_PRIORITY_TURN', airlineId='GLO'){
  loadAirlineOps();
  const req=AIRLINE_OPS_CATALOG.serviceRequests.find(r=>r.id===requestId)||AIRLINE_OPS_CATALOG.serviceRequests[0];
  const item={id:`SRQ-${String(Date.now()).slice(-6)}`,requestId:req.id,airlineId,at:new Date().toISOString(),status:'OPEN',risk:req.risk};
  airlineOpsState.serviceQueue.unshift(item);
  airlineOpsState.serviceQueue=airlineOpsState.serviceQueue.slice(0,30);
  saveAirlineOps();
  renderAirlineOpsBoard();
  return item;
}
function closeServiceRequest(id, ok=true){
  loadAirlineOps();
  const item=airlineOpsState.serviceQueue.find(x=>x.id===id);
  if(item){ item.status=ok?'DONE':'MISSED'; item.closedAt=new Date().toISOString(); }
  saveAirlineOps();
  return item||null;
}
function calculateAirlineSla(finalScore=0,statsObj={},fail=false,icao='SBSP'){
  const demand=demandProfile();
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const safety=Math.max(0,100-(statsObj.conflicts||0)*15-(statsObj.runwayIncursions||0)*25-(fail?30:0));
  const delayPenalty=(statsObj.denied||0)*6 + Math.max(0,Number(network.networkDelayMin||0))*0.65*demand.delaySensitivity;
  const punctuality=Math.max(0,Math.round(95-delayPenalty+Math.min(6,finalScore/900)));
  const connections=Math.max(0,Math.min(100,70+Number(network.connectionsProtected||0)*8-(statsObj.denied||0)*3));
  const cargo=Math.max(0,Math.min(100,75+(demand.cargo>1?8:0)-(statsObj.denied||0)*2));
  const communication=Math.max(0,Math.min(100,82+(statsObj.commands||0>0?5:0)-(statsObj.denied||0)*3));
  const scores={PUNCTUALITY:punctuality,SAFETY:safety,CONNECTIONS:connections,CARGO:cargo,COMMUNICATION:communication};
  const weighted=Math.round(AIRLINE_OPS_CATALOG.slaMetrics.reduce((a,m)=>a+(scores[m.id]||0)*m.weight,0)/100);
  return {scores,weighted,band:satisfactionBand(weighted)};
}
function evaluateAirlineOps(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAirlineOps();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const carriers=airlinesForAirport(icao);
  const banks=routeBanksForAirport(icao);
  const sla=calculateAirlineSla(finalScore,statsObj,fail,icao);
  const queueOpen=airlineOpsState.serviceQueue.filter(q=>q.status==='OPEN').length;
  const banksDemand=banks.length?Math.round(banks.reduce((a,b)=>a+b.demand,0)/banks.length):60;
  for(const airline of carriers){
    const previous=Number(airlineOpsState.airlineScores[airline.id]?.score ?? airline.slaTarget);
    let delta=Math.round((sla.weighted-airline.slaTarget)/5) - queueOpen;
    if(airline.priority==='PUNCTUALITY' && sla.scores.PUNCTUALITY<airline.slaTarget) delta-=3;
    if(airline.priority==='CONNECTIONS' && sla.scores.CONNECTIONS<airline.slaTarget) delta-=3;
    if(airline.priority==='CARGO' && sla.scores.CARGO<airline.slaTarget) delta-=3;
    const score=Math.max(0,Math.min(100,previous+delta));
    airlineOpsState.airlineScores[airline.id]={score,band:satisfactionBand(score).id,lastDelta:delta,lastAirport:icao};
  }
  const average=carriers.length?Math.round(carriers.reduce((a,c)=>a+(airlineOpsState.airlineScores[c.id]?.score||c.slaTarget),0)/carriers.length):sla.weighted;
  airlineOpsState.airlineOpsScore=Math.round((sla.weighted*.65)+(average*.25)+(Math.max(0,100-banksDemand/2)*.10));
  airlineOpsState.status=airlineOpsState.airlineOpsScore>=90?'AIRLINE_EXCELLENT':airlineOpsState.airlineOpsScore>=75?'AIRLINE_STABLE':airlineOpsState.airlineOpsScore>=55?'AIRLINE_WATCH':'AIRLINE_AT_RISK';
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),sla,carriers:carriers.map(c=>c.id),banks:banks.map(b=>b.id),averageCarrierScore:average,opsScore:airlineOpsState.airlineOpsScore,status:airlineOpsState.status,openRequests:queueOpen};
  airlineOpsState.history.unshift(evaluation);
  airlineOpsState.history=airlineOpsState.history.slice(0,80);
  airlineOpsState.lastEvaluation=evaluation;
  saveAirlineOps();
  renderAirlineOpsBoard();
  return {state:airlineOpsState,evaluation};
}
function airlineOpsProgress(){
  loadAirlineOps();
  const last=airlineOpsState.lastEvaluation||{};
  return {score:airlineOpsState.airlineOpsScore,status:airlineOpsState.status,activeDemandProfile:airlineOpsState.activeDemandProfile,openRequests:airlineOpsState.serviceQueue.filter(q=>q.status==='OPEN').length,lastAirport:last.airport||'---',lastSla:last.sla?.weighted||0,carriers:Object.keys(airlineOpsState.airlineScores).length};
}
function renderAirlineOpsBoard(){
  try{
    const anchor=document.querySelector('#internationalCampaignInline') || document.querySelector('#trainingCoachInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#airlineOpsInline'); if(old) old.remove();
    const p=airlineOpsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="airlineOpsInline" class="airport-ops-board airline-ops-inline">
      <div class="airport-ops-head"><b>AIRLINE OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.lastSla}%</b></div>
        <div><small>OPS</small><b>${p.score}</b></div>
        <div><small>CIAS</small><b>${p.carriers}</b></div>
        <div><small>PEDIDOS</small><b>${p.openRequests}</b></div>
        <div><small>AEROPORTO</small><b>${p.lastAirport}</b></div>
        <div><small>DEMANDA</small><b>${p.activeDemandProfile}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'airline-ops-board'); }
}
function initializeAirlineOps(){
  loadAirlineOps();
  if(!airlineOpsState.serviceQueue.length) queueServiceRequest('REQ_PRIORITY_TURN','GLO');
  renderAirlineOpsBoard();
  return airlineOpsState;
}
function airlineOpsStatus(){ loadAirlineOps(); return {...airlineOpsState,progress:airlineOpsProgress(),catalog:AIRLINE_OPS_CATALOG}; }
function airlineOpsSelfCheck(){
  const issues=[];
  if(AIRLINE_OPS_CATALOG.airlines.length<5) issues.push('companhias insuficientes');
  if(AIRLINE_OPS_CATALOG.routeBanks.length<4) issues.push('bancos insuficientes');
  if(AIRLINE_OPS_CATALOG.slaMetrics.length<5) issues.push('métricas SLA insuficientes');
  const res=evaluateAirlineOps(2500,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  if(res.evaluation.sla.weighted<75) issues.push('SLA saudável baixo demais');
  if(!res.evaluation.carriers.length) issues.push('sem companhias no aeroporto testado');
  return {ok:issues.length===0,issues,airlines:AIRLINE_OPS_CATALOG.airlines.length,banks:AIRLINE_OPS_CATALOG.routeBanks.length,metrics:AIRLINE_OPS_CATALOG.slaMetrics.length};
}
window.SKYWARD_AIRLINE_OPS=Object.freeze({
  schema:1,
  catalog:AIRLINE_OPS_CATALOG,
  load:loadAirlineOps,
  save:saveAirlineOps,
  init:initializeAirlineOps,
  queue:queueServiceRequest,
  close:closeServiceRequest,
  evaluate:evaluateAirlineOps,
  progress:airlineOpsProgress,
  status:airlineOpsStatus,
  board:renderAirlineOpsBoard,
  selfCheck:airlineOpsSelfCheck
});
