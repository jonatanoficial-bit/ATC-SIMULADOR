/* @skyward-module 35-airport-authority-terminal-ops
 * Airport Authority and Terminal Operations: terminals, gates, passenger queues, baggage, connections and passenger experience.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('35-airport-authority-terminal-ops');
const AIRPORT_AUTHORITY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f32',
  terminals:[
    {id:'T1_DOMESTIC',name:'Terminal Doméstico',capacity:18000,gateCount:16,focus:'ponte aérea'},
    {id:'T2_INTERNATIONAL',name:'Terminal Internacional',capacity:26000,gateCount:22,focus:'conexões internacionais'},
    {id:'T3_CARGO',name:'Terminal Cargueiro',capacity:9000,gateCount:10,focus:'carga expressa'},
    {id:'T4_REMOTE',name:'Pátio Remoto',capacity:7000,gateCount:12,focus:'operação irregular'}
  ],
  gatePools:[
    {id:'NARROW_BODY',name:'Portões narrow-body',compatible:['A320','B737','E195'],turnaroundMin:38},
    {id:'WIDE_BODY',name:'Portões wide-body',compatible:['B777','A350','B787'],turnaroundMin:72},
    {id:'CARGO_STAND',name:'Posições cargueiras',compatible:['B767F','B777F','A330F'],turnaroundMin:95},
    {id:'REMOTE_STAND',name:'Remotas',compatible:['A320','B737','E195','ATR'],turnaroundMin:52}
  ],
  passengerFlows:[
    {id:'CHECKIN',name:'Check-in',weight:15},
    {id:'SECURITY',name:'Raio-X / Segurança',weight:20},
    {id:'IMMIGRATION',name:'Imigração',weight:15},
    {id:'BOARDING',name:'Embarque',weight:20},
    {id:'BAGGAGE',name:'Bagagem',weight:15},
    {id:'CONNECTIONS',name:'Conexões',weight:15}
  ],
  terminalEvents:[
    {id:'SECURITY_QUEUE',name:'Fila longa no raio-X',impact:'security-15',risk:18},
    {id:'BAGGAGE_DELAY',name:'Atraso na esteira de bagagem',impact:'baggage-18',risk:14},
    {id:'GATE_CONFLICT',name:'Conflito de portão',impact:'boarding-20',risk:22},
    {id:'BUS_REMOTE_DELAY',name:'Ônibus remoto atrasado',impact:'boarding-12',risk:12},
    {id:'IMMIGRATION_PEAK',name:'Pico de imigração',impact:'immigration-18',risk:20}
  ],
  experienceBands:[
    {id:'PREMIUM',min:90,name:'Experiência premium'},
    {id:'GOOD',min:75,name:'Boa experiência'},
    {id:'STRESSED',min:55,name:'Terminal pressionado'},
    {id:'CHAOTIC',min:0,name:'Operação caótica'}
  ],
  authorityObjectives:[
    {id:'KEEP_QUEUES_LOW',name:'Manter filas controladas',target:80},
    {id:'PROTECT_CONNECTIONS',name:'Proteger conexões',target:82},
    {id:'GATE_DISCIPLINE',name:'Evitar conflitos de portão',target:85},
    {id:'BAGGAGE_RELIABILITY',name:'Bagagem confiável',target:78}
  ]
});
const AIRPORT_AUTHORITY_KEY='skywardAirportAuthority_v1';
let airportAuthorityState={schema:1,activeTerminalId:'T1_DOMESTIC',events:[],flowScores:{CHECKIN:86,SECURITY:84,IMMIGRATION:82,BOARDING:85,BAGGAGE:83,CONNECTIONS:84},authorityScore:0,experience:'GOOD',history:[],lastEvaluation:null};
function loadAirportAuthority(){
  try{ const raw=localStorage?.getItem?.(AIRPORT_AUTHORITY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airportAuthorityState={...airportAuthorityState,...parsed}; } }catch(e){ safeLogError?.(e,'airport-authority-load'); }
  return airportAuthorityState;
}
function saveAirportAuthority(){
  try{ localStorage?.setItem?.(AIRPORT_AUTHORITY_KEY,JSON.stringify(airportAuthorityState)); }catch(e){ safeLogError?.(e,'airport-authority-save'); }
  return airportAuthorityState;
}
function activeTerminal(){ return AIRPORT_AUTHORITY_CATALOG.terminals.find(t=>t.id===airportAuthorityState.activeTerminalId)||AIRPORT_AUTHORITY_CATALOG.terminals[0]; }
function experienceBand(score){
  return AIRPORT_AUTHORITY_CATALOG.experienceBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||AIRPORT_AUTHORITY_CATALOG.experienceBands.at(-1);
}
function raiseTerminalEvent(eventId='SECURITY_QUEUE'){
  loadAirportAuthority();
  const tpl=AIRPORT_AUTHORITY_CATALOG.terminalEvents.find(e=>e.id===eventId)||AIRPORT_AUTHORITY_CATALOG.terminalEvents[0];
  const item={id:`TEV-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  airportAuthorityState.events.unshift(item);
  airportAuthorityState.events=airportAuthorityState.events.slice(0,40);
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return item;
}
function closeTerminalEvent(id, ok=true){
  loadAirportAuthority();
  const ev=airportAuthorityState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return ev||null;
}
function calculateTerminalFlows(finalScore=0,statsObj={},fail=false,airportCode=''){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const delay=Math.max(0,Number(network.networkDelayMin||0));
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const openEvents=airportAuthorityState.events.filter(e=>e.status==='OPEN');
  let scores={...airportAuthorityState.flowScores};
  for(const k of Object.keys(scores)) scores[k]=Number(scores[k]||80);
  scores.CHECKIN=Math.max(0,Math.min(100,88-denied*2+Math.min(5,finalScore/1200)));
  scores.SECURITY=Math.max(0,Math.min(100,86-openEvents.filter(e=>e.eventId==='SECURITY_QUEUE').length*15));
  scores.IMMIGRATION=Math.max(0,Math.min(100,84-openEvents.filter(e=>e.eventId==='IMMIGRATION_PEAK').length*18));
  scores.BOARDING=Math.max(0,Math.min(100,88-delay*.5-denied*4-openEvents.filter(e=>['GATE_CONFLICT','BUS_REMOTE_DELAY'].includes(e.eventId)).length*12));
  scores.BAGGAGE=Math.max(0,Math.min(100,85-openEvents.filter(e=>e.eventId==='BAGGAGE_DELAY').length*18+(airline.progress?.score>=80?3:0)));
  scores.CONNECTIONS=Math.max(0,Math.min(100,82+Number(network.connectionsProtected||0)*6-delay*.3-conflicts*8-incursions*14-(fail?18:0)));
  return scores;
}
function evaluateAirportAuthority(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAirportAuthority();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const flows=calculateTerminalFlows(finalScore,statsObj,fail,icao);
  airportAuthorityState.flowScores=flows;
  const weighted=Math.round(AIRPORT_AUTHORITY_CATALOG.passengerFlows.reduce((a,f)=>a+(flows[f.id]||0)*f.weight,0)/100);
  const openRisk=airportAuthorityState.events.filter(e=>e.status==='OPEN').reduce((a,e)=>a+Number(e.risk||0),0);
  const score=Math.max(0,Math.min(100,weighted-Math.round(openRisk/8)));
  const band=experienceBand(score);
  airportAuthorityState.authorityScore=score;
  airportAuthorityState.experience=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,terminal:activeTerminal().id,finalScore:Math.round(finalScore||0),flows,weighted,authorityScore:score,experience:band.id,openEvents:airportAuthorityState.events.filter(e=>e.status==='OPEN').length};
  airportAuthorityState.history.unshift(evaluation);
  airportAuthorityState.history=airportAuthorityState.history.slice(0,80);
  airportAuthorityState.lastEvaluation=evaluation;
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return {state:airportAuthorityState,evaluation};
}
function airportAuthorityProgress(){
  loadAirportAuthority();
  return {score:airportAuthorityState.authorityScore,experience:airportAuthorityState.experience,terminal:activeTerminal(),openEvents:airportAuthorityState.events.filter(e=>e.status==='OPEN').length,last:airportAuthorityState.lastEvaluation||null,flows:airportAuthorityState.flowScores};
}
function renderAirportAuthorityBoard(){
  try{
    const anchor=document.querySelector('#airlineOpsInline') || document.querySelector('#internationalCampaignInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#airportAuthorityInline'); if(old) old.remove();
    const p=airportAuthorityProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="airportAuthorityInline" class="airport-ops-board airport-authority-inline">
      <div class="airport-ops-head"><b>AIRPORT AUTH</b><span>${p.experience}</span></div>
      <div class="airport-ops-grid">
        <div><small>EXP</small><b>${p.score}%</b></div>
        <div><small>TERMINAL</small><b>${p.terminal.id}</b></div>
        <div><small>EVENTOS</small><b>${p.openEvents}</b></div>
        <div><small>BOARD</small><b>${Math.round(p.flows.BOARDING||0)}</b></div>
        <div><small>BAG</small><b>${Math.round(p.flows.BAGGAGE||0)}</b></div>
        <div><small>CONN</small><b>${Math.round(p.flows.CONNECTIONS||0)}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'airport-authority-board'); }
}
function initializeAirportAuthority(){
  loadAirportAuthority();
  renderAirportAuthorityBoard();
  return airportAuthorityState;
}
function airportAuthorityStatus(){ loadAirportAuthority(); return {...airportAuthorityState,progress:airportAuthorityProgress(),catalog:AIRPORT_AUTHORITY_CATALOG}; }
function airportAuthoritySelfCheck(){
  const issues=[];
  if(AIRPORT_AUTHORITY_CATALOG.terminals.length<4) issues.push('terminais insuficientes');
  if(AIRPORT_AUTHORITY_CATALOG.gatePools.length<4) issues.push('portões insuficientes');
  if(AIRPORT_AUTHORITY_CATALOG.passengerFlows.length<6) issues.push('fluxos insuficientes');
  const event=raiseTerminalEvent('GATE_CONFLICT');
  if(!event.id) issues.push('evento não criado');
  const res=evaluateAirportAuthority(2400,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  if(!Number.isFinite(res.evaluation.authorityScore)) issues.push('score inválido');
  closeTerminalEvent(event.id,true);
  return {ok:issues.length===0,issues,terminals:AIRPORT_AUTHORITY_CATALOG.terminals.length,flows:AIRPORT_AUTHORITY_CATALOG.passengerFlows.length};
}
window.SKYWARD_AIRPORT_AUTHORITY=Object.freeze({
  schema:1,
  catalog:AIRPORT_AUTHORITY_CATALOG,
  load:loadAirportAuthority,
  save:saveAirportAuthority,
  init:initializeAirportAuthority,
  event:raiseTerminalEvent,
  close:closeTerminalEvent,
  evaluate:evaluateAirportAuthority,
  progress:airportAuthorityProgress,
  status:airportAuthorityStatus,
  board:renderAirportAuthorityBoard,
  selfCheck:airportAuthoritySelfCheck
});
