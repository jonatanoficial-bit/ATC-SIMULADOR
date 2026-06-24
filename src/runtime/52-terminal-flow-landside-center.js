/* @skyward-module 52-terminal-flow-landside-center
 * Terminal flow and landside operations center with check-in, security queues, immigration, baggage claim, curbside, parking, wayfinding, lounges and density.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('52-terminal-flow-landside-center');
const TERMINAL_FLOW_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f49',
  terminalZones:[
    {id:'CURBSIDE',name:'Curbside/drop-off',weight:10,target:78},
    {id:'CHECKIN',name:'Check-in e despacho',weight:14,target:82},
    {id:'SECURITY_QUEUE',name:'Fila segurança',weight:16,target:84},
    {id:'IMMIGRATION',name:'Imigração/passaporte',weight:12,target:80},
    {id:'WAYFINDING',name:'Sinalização/wayfinding',weight:10,target:78},
    {id:'GATE_HOLDROOM',name:'Sala de embarque',weight:12,target:80},
    {id:'BAGGAGE_CLAIM',name:'Restituição bagagem',weight:12,target:80},
    {id:'PARKING_LANDSIDE',name:'Estacionamento/landside',weight:8,target:76},
    {id:'LOUNGES_RETAIL',name:'Lounges/varejo',weight:6,target:76}
  ],
  queueIncidents:[
    {id:'CHECKIN_SURGE',name:'Pico check-in',zone:'CHECKIN',severity:22},
    {id:'SECURITY_BACKLOG',name:'Backlog segurança',zone:'SECURITY_QUEUE',severity:30},
    {id:'IMMIGRATION_HOLD',name:'Retenção imigração',zone:'IMMIGRATION',severity:26},
    {id:'WAYFINDING_CONFUSION',name:'Passageiro perdido',zone:'WAYFINDING',severity:16},
    {id:'GATE_CROWDING',name:'Gate lotado',zone:'GATE_HOLDROOM',severity:24},
    {id:'BAGGAGE_DELAY',name:'Atraso restituição bagagem',zone:'BAGGAGE_CLAIM',severity:22},
    {id:'CURBSIDE_JAM',name:'Curbside congestionado',zone:'CURBSIDE',severity:20},
    {id:'PARKING_QUEUE',name:'Fila estacionamento',zone:'PARKING_LANDSIDE',severity:18}
  ],
  flowPrograms:[
    {id:'OPEN_SECURITY_LANES',name:'Abrir canais segurança',cost:12000,benefit:{SECURITY_QUEUE:13,CHECKIN:2}},
    {id:'MOBILE_CHECKIN_PUSH',name:'Push check-in móvel',cost:7000,benefit:{CHECKIN:11}},
    {id:'IMMIGRATION_FAST_TRACK',name:'Fast track imigração',cost:15000,benefit:{IMMIGRATION:12}},
    {id:'WAYFINDING_REFRESH',name:'Reforço sinalização',cost:8000,benefit:{WAYFINDING:12,GATE_HOLDROOM:2}},
    {id:'GATE_BALANCER',name:'Balanceamento de gates',cost:11000,benefit:{GATE_HOLDROOM:12}},
    {id:'BAGGAGE_CLAIM_EXPEDITE',name:'Expedição bagagem chegada',cost:10000,benefit:{BAGGAGE_CLAIM:12}},
    {id:'CURBSIDE_MARSHALS',name:'Sinaleiros curbside',cost:9000,benefit:{CURBSIDE:11,PARKING_LANDSIDE:2}},
    {id:'PARKING_DYNAMIC_FLOW',name:'Fluxo dinâmico estacionamento',cost:8000,benefit:{PARKING_LANDSIDE:11}},
    {id:'LOUNGE_OVERFLOW',name:'Overflow lounge/varejo',cost:9000,benefit:{LOUNGES_RETAIL:10}}
  ],
  flowBands:[
    {id:'SEAMLESS_TERMINAL',min:90,name:'Terminal fluido'},
    {id:'CONTROLLED_FLOW',min:75,name:'Fluxo controlado'},
    {id:'QUEUE_PRESSURE',min:55,name:'Pressão de filas'},
    {id:'TERMINAL_GRIDLOCK',min:0,name:'Terminal travado'}
  ],
  terminalKPIs:[
    {id:'AVG_QUEUE_TIME',name:'Tempo médio de fila'},
    {id:'SECURITY_WAIT',name:'Espera segurança'},
    {id:'CHECKIN_WAIT',name:'Espera check-in'},
    {id:'DENSITY_INDEX',name:'Índice de lotação'},
    {id:'BAGGAGE_CLAIM_TIME',name:'Tempo restituição bagagem'},
    {id:'LANDSIDE_DELAY',name:'Atraso landside'}
  ]
});
const TERMINAL_FLOW_KEY='skywardTerminalFlow_v1';
let terminalFlowState={schema:1,zoneScores:{CURBSIDE:77,CHECKIN:80,SECURITY_QUEUE:78,IMMIGRATION:76,WAYFINDING:78,GATE_HOLDROOM:80,BAGGAGE_CLAIM:79,PARKING_LANDSIDE:75,LOUNGES_RETAIL:76},programs:[],incidents:[],terminalScore:78,avgQueueMin:14,securityWaitMin:12,checkinWaitMin:10,densityIndex:42,baggageClaimMin:16,landsideDelayMin:0,status:'CONTROLLED_FLOW',history:[],lastEvaluation:null};
function loadTerminalFlow(){try{const raw=localStorage?.getItem?.(TERMINAL_FLOW_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)terminalFlowState={...terminalFlowState,...parsed};}}catch(e){safeLogError?.(e,'terminal-flow-load');}return terminalFlowState;}
function saveTerminalFlow(){try{localStorage?.setItem?.(TERMINAL_FLOW_KEY,JSON.stringify(terminalFlowState));}catch(e){safeLogError?.(e,'terminal-flow-save');}return terminalFlowState;}
function terminalBand(score){return TERMINAL_FLOW_CATALOG.flowBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||TERMINAL_FLOW_CATALOG.flowBands.at(-1);}
function programById(id){return TERMINAL_FLOW_CATALOG.flowPrograms.find(p=>p.id===id)||TERMINAL_FLOW_CATALOG.flowPrograms[0];}
function incidentById(id){return TERMINAL_FLOW_CATALOG.queueIncidents.find(i=>i.id===id)||TERMINAL_FLOW_CATALOG.queueIncidents[0];}
function runTerminalProgram(id='OPEN_SECURITY_LANES'){
  loadTerminalFlow();
  const program=programById(id);
  if(terminalFlowState.programs.some(p=>p.programId===program.id)) return terminalFlowState.programs.find(p=>p.programId===program.id);
  const item={id:`TFP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  terminalFlowState.programs.unshift(item);
  for(const [zone,gain] of Object.entries(program.benefit||{})){
    terminalFlowState.zoneScores[zone]=Math.min(100,Number(terminalFlowState.zoneScores[zone]||75)+Number(gain||0));
  }
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return item;
}
function raiseTerminalIncident(id='SECURITY_BACKLOG'){
  loadTerminalFlow();
  const tpl=incidentById(id);
  const item={id:`TFI-${String(Date.now()).slice(-6)}`,incidentId:tpl.id,name:tpl.name,zone:tpl.zone,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  terminalFlowState.incidents.unshift(item);
  terminalFlowState.incidents=terminalFlowState.incidents.slice(0,80);
  terminalFlowState.zoneScores[tpl.zone]=Math.max(0,Number(terminalFlowState.zoneScores[tpl.zone]||75)-Math.round(tpl.severity/4));
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return item;
}
function closeTerminalIncident(id,ok=true){
  loadTerminalFlow();
  const incident=terminalFlowState.incidents.find(x=>x.id===id);
  if(incident){incident.status=ok?'CLEARED':'ESCALATED';incident.closedAt=new Date().toISOString();if(ok)terminalFlowState.zoneScores[incident.zone]=Math.min(100,Number(terminalFlowState.zoneScores[incident.zone]||75)+2);}
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return incident||null;
}
function calculateTerminalMetrics(finalScore=0,statsObj={},fail=false){
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const ground=window.SKYWARD_GROUND_TURNAROUND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const cargo=window.SKYWARD_CARGO_LOGISTICS?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const open=terminalFlowState.incidents.filter(i=>i.status==='OPEN');
  const scores={...terminalFlowState.zoneScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0);
  const passengerScore=Number(passenger.progress?.score||78);
  const securityScore=Number(security.progress?.score||80);
  const groundScore=Number(ground.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const cargoScore=Number(cargo.progress?.score||78);
  const revenueScore=Number(revenue.progress?.score||78);
  const airlineScore=Number(airline.progress?.score||78);
  const penalty=(zone)=>open.filter(i=>i.zone===zone).reduce((a,i)=>a+Number(i.severity||0),0)/3;
  scores.CURBSIDE=Math.max(0,Math.min(100,Number(scores.CURBSIDE||77)+groundScore*.03-denied*1.0-penalty('CURBSIDE')));
  scores.CHECKIN=Math.max(0,Math.min(100,Number(scores.CHECKIN||80)+airlineScore*.04+workforceScore*.03-denied*1.5-penalty('CHECKIN')));
  scores.SECURITY_QUEUE=Math.max(0,Math.min(100,Number(scores.SECURITY_QUEUE||78)+securityScore*.05+workforceScore*.02-penalty('SECURITY_QUEUE')));
  scores.IMMIGRATION=Math.max(0,Math.min(100,Number(scores.IMMIGRATION||76)+securityScore*.03+workforceScore*.03-penalty('IMMIGRATION')));
  scores.WAYFINDING=Math.max(0,Math.min(100,Number(scores.WAYFINDING||78)+passengerScore*.04-penalty('WAYFINDING')));
  scores.GATE_HOLDROOM=Math.max(0,Math.min(100,Number(scores.GATE_HOLDROOM||80)+groundScore*.04-denied*1.2-penalty('GATE_HOLDROOM')));
  scores.BAGGAGE_CLAIM=Math.max(0,Math.min(100,Number(scores.BAGGAGE_CLAIM||79)+groundScore*.03+cargoScore*.03-penalty('BAGGAGE_CLAIM')));
  scores.PARKING_LANDSIDE=Math.max(0,Math.min(100,Number(scores.PARKING_LANDSIDE||75)+revenueScore*.03-penalty('PARKING_LANDSIDE')));
  scores.LOUNGES_RETAIL=Math.max(0,Math.min(100,Number(scores.LOUNGES_RETAIL||76)+revenueScore*.04+passengerScore*.03-penalty('LOUNGES_RETAIL')));
  const trafficLoad=Math.max(1,landed+departed+denied);
  const weighted=Math.round(TERMINAL_FLOW_CATALOG.terminalZones.reduce((a,z)=>a+(scores[z.id]||0)*z.weight,0)/100);
  const openSeverity=open.reduce((a,i)=>a+Number(i.severity||0),0);
  const avgQueueMin=Math.max(3,Math.round(35-weighted*.28+trafficLoad*1.9+open.length*2+(fail?5:0)));
  const securityWaitMin=Math.max(2,Math.round(28-scores.SECURITY_QUEUE*.22+open.filter(i=>i.zone==='SECURITY_QUEUE').length*7));
  const checkinWaitMin=Math.max(2,Math.round(24-scores.CHECKIN*.20+open.filter(i=>i.zone==='CHECKIN').length*6));
  const baggageClaimMin=Math.max(4,Math.round(30-scores.BAGGAGE_CLAIM*.18+open.filter(i=>i.zone==='BAGGAGE_CLAIM').length*7));
  const densityIndex=Math.max(0,Math.min(100,Math.round(100-weighted+trafficLoad*3+openSeverity/5)));
  const landsideDelayMin=Math.max(0,Math.round(open.filter(i=>['CURBSIDE','PARKING_LANDSIDE'].includes(i.zone)).reduce((a,i)=>a+i.severity,0)/4+Math.max(0,65-scores.CURBSIDE)/3));
  return {scores,weighted,avgQueueMin,securityWaitMin,checkinWaitMin,baggageClaimMin,densityIndex,landsideDelayMin,openIncidents:open.length,drivers:{landed,departed,denied,passengerScore,securityScore,groundScore,workforceScore,cargoScore,revenueScore,airlineScore}};
}
function evaluateTerminalFlow(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTerminalFlow();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !terminalFlowState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='GATE_CROWDING')) raiseTerminalIncident('GATE_CROWDING');
  if((statsObj.landed||0)>=3 && !terminalFlowState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='BAGGAGE_DELAY')) raiseTerminalIncident('BAGGAGE_DELAY');
  const metrics=calculateTerminalMetrics(finalScore,statsObj,fail);
  terminalFlowState.zoneScores=metrics.scores;
  terminalFlowState.avgQueueMin=metrics.avgQueueMin;
  terminalFlowState.securityWaitMin=metrics.securityWaitMin;
  terminalFlowState.checkinWaitMin=metrics.checkinWaitMin;
  terminalFlowState.baggageClaimMin=metrics.baggageClaimMin;
  terminalFlowState.densityIndex=metrics.densityIndex;
  terminalFlowState.landsideDelayMin=metrics.landsideDelayMin;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.58+Math.max(0,100-metrics.avgQueueMin*2)*.18+Math.max(0,100-metrics.densityIndex)*.14+Math.max(0,100-metrics.landsideDelayMin*3)*.10-(fail?5:0))));
  terminalFlowState.terminalScore=score;
  terminalFlowState.status=terminalBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,terminalScore:score,status:terminalFlowState.status,programs:terminalFlowState.programs.length};
  terminalFlowState.history.unshift(evaluation);
  terminalFlowState.history=terminalFlowState.history.slice(0,100);
  terminalFlowState.lastEvaluation=evaluation;
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return {state:terminalFlowState,evaluation};
}
function terminalFlowProgress(){
  loadTerminalFlow();
  return {score:terminalFlowState.terminalScore,status:terminalFlowState.status,avgQueueMin:terminalFlowState.avgQueueMin,securityWaitMin:terminalFlowState.securityWaitMin,checkinWaitMin:terminalFlowState.checkinWaitMin,densityIndex:terminalFlowState.densityIndex,baggageClaimMin:terminalFlowState.baggageClaimMin,landsideDelayMin:terminalFlowState.landsideDelayMin,openIncidents:terminalFlowState.incidents.filter(i=>i.status==='OPEN').length,last:terminalFlowState.lastEvaluation||null};
}
function renderTerminalFlowBoard(){
  try{
    const anchor=document.querySelector('#cargoLogisticsInline') || document.querySelector('#groundTurnaroundInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#terminalFlowInline'); if(old) old.remove();
    const p=terminalFlowProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="terminalFlowInline" class="airport-ops-board terminal-flow-inline">
      <div class="airport-ops-head"><b>TERMINAL FLOW</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>FLUXO</small><b>${p.score}%</b></div>
        <div><small>FILA</small><b>${p.avgQueueMin}m</b></div>
        <div><small>SEC.</small><b>${p.securityWaitMin}m</b></div>
        <div><small>CHECK</small><b>${p.checkinWaitMin}m</b></div>
        <div><small>DENS.</small><b>${p.densityIndex}%</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'terminal-flow-board'); }
}
function initializeTerminalFlow(){loadTerminalFlow();renderTerminalFlowBoard();return terminalFlowState;}
function terminalFlowStatus(){loadTerminalFlow();return {...terminalFlowState,progress:terminalFlowProgress(),catalog:TERMINAL_FLOW_CATALOG};}
function terminalFlowSelfCheck(){
  const issues=[];
  if(TERMINAL_FLOW_CATALOG.terminalZones.length<9) issues.push('zonas insuficientes');
  if(TERMINAL_FLOW_CATALOG.queueIncidents.length<8) issues.push('incidentes insuficientes');
  const program=runTerminalProgram('OPEN_SECURITY_LANES');
  const incident=raiseTerminalIncident('SECURITY_BACKLOG');
  const res=evaluateTerminalFlow(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.terminalScore)) issues.push('score terminal inválido');
  return {ok:issues.length===0,issues,zones:TERMINAL_FLOW_CATALOG.terminalZones.length,incidents:TERMINAL_FLOW_CATALOG.queueIncidents.length};
}
window.SKYWARD_TERMINAL_FLOW=Object.freeze({
  schema:1,
  catalog:TERMINAL_FLOW_CATALOG,
  load:loadTerminalFlow,
  save:saveTerminalFlow,
  program:runTerminalProgram,
  incident:raiseTerminalIncident,
  close:closeTerminalIncident,
  evaluate:evaluateTerminalFlow,
  progress:terminalFlowProgress,
  status:terminalFlowStatus,
  board:renderTerminalFlowBoard,
  init:initializeTerminalFlow,
  selfCheck:terminalFlowSelfCheck
});
