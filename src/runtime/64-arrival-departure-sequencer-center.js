/* @skyward-module 64-arrival-departure-sequencer-center
 * Arrival Manager, Departure Sequencer and Holding Stack Center for runway flow, arrival spacing, departure slots, priorities and sequencing.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('64-arrival-departure-sequencer-center');
const ARRIVAL_DEPARTURE_SEQUENCER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f61',
  arrivalFlows:[
    {id:'STANDARD_STREAM',name:'Fluxo padrão',spacingNm:5,risk:8},
    {id:'TIGHT_URBAN',name:'Urbano apertado',spacingNm:6,risk:16},
    {id:'WEATHER_EXTENDED',name:'Clima espaçado',spacingNm:9,risk:20},
    {id:'HEAVY_MIX',name:'Misto com pesados',spacingNm:8,risk:18},
    {id:'LOW_VIS_STREAM',name:'Baixa visibilidade',spacingNm:10,risk:28},
    {id:'EMERGENCY_PRIORITY',name:'Prioridade emergência',spacingNm:11,risk:30}
  ],
  departureBanks:[
    {id:'LIGHT_BANK',name:'Banco leve',slots:3,spacingSec:90,risk:8},
    {id:'REGIONAL_BANK',name:'Banco regional',slots:4,spacingSec:105,risk:12},
    {id:'INTERNATIONAL_BANK',name:'Banco internacional',slots:5,spacingSec:130,risk:18},
    {id:'CARGO_BANK',name:'Banco cargueiro',slots:4,spacingSec:150,risk:16},
    {id:'WEATHER_HOLD_BANK',name:'Banco com espera meteorológica',slots:3,spacingSec:170,risk:24}
  ],
  holdingStacks:[
    {id:'HOLD_NORTH',name:'Espera Norte',capacity:4,risk:14},
    {id:'HOLD_SOUTH',name:'Espera Sul',capacity:4,risk:14},
    {id:'HOLD_COASTAL',name:'Espera Costeira',capacity:3,risk:18},
    {id:'HOLD_HIGH_ALT',name:'Espera Alta',capacity:5,risk:12},
    {id:'HOLD_EMERGENCY_CLEAR',name:'Espera limpa para emergência',capacity:2,risk:26}
  ],
  priorityRules:[
    {id:'MEDICAL',name:'Prioridade médica',weight:34},
    {id:'FUEL_LOW',name:'Combustível baixo',weight:32},
    {id:'EMERGENCY',name:'Emergência declarada',weight:40},
    {id:'VIP',name:'Movimento VIP',weight:16},
    {id:'CARGO_PERISHABLE',name:'Carga perecível',weight:14},
    {id:'SLOT_CRITICAL',name:'Slot crítico',weight:18},
    {id:'TRAINING',name:'Treinamento',weight:6}
  ],
  slotPolicies:[
    {id:'FAIR_QUEUE',name:'Fila justa',delayBias:0,safetyBias:8},
    {id:'SAFETY_FIRST',name:'Segurança primeiro',delayBias:8,safetyBias:18},
    {id:'AIRLINE_BANK',name:'Banco companhia',delayBias:-4,safetyBias:6},
    {id:'WEATHER_RECOVERY',name:'Recuperação meteorológica',delayBias:10,safetyBias:16},
    {id:'EMERGENCY_CLEARANCE',name:'Corredor de emergência',delayBias:16,safetyBias:22}
  ],
  flowBands:[
    {id:'OPTIMAL',min:90,name:'Fluxo ótimo'},
    {id:'STABLE',min:76,name:'Fluxo estável'},
    {id:'CONGESTED',min:58,name:'Congestionado'},
    {id:'SATURATED',min:0,name:'Saturado'}
  ]
});
const ARRIVAL_DEPARTURE_KEY='skywardArrivalDepartureSequencer_v1';
let sequencerState={schema:1,arrivalFlow:'STANDARD_STREAM',departureBank:'LIGHT_BANK',holdingStack:'HOLD_NORTH',slotPolicy:'FAIR_QUEUE',arrivalQueue:[],departureQueue:[],holdingLoad:0,priorityLoad:0,flowScore:84,status:'STABLE',runwayBalance:80,history:[],lastEvaluation:null};
function loadArrivalDepartureSequencer(){try{const raw=localStorage?.getItem?.(ARRIVAL_DEPARTURE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)sequencerState={...sequencerState,...parsed};}}catch(e){safeLogError?.(e,'sequencer-load');}return sequencerState;}
function saveArrivalDepartureSequencer(){try{localStorage?.setItem?.(ARRIVAL_DEPARTURE_KEY,JSON.stringify(sequencerState));}catch(e){safeLogError?.(e,'sequencer-save');}return sequencerState;}
function arrivalFlowById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows[0];}
function departureBankById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks[0];}
function holdingStackById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.holdingStacks.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.holdingStacks[0];}
function slotPolicyById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.slotPolicies.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.slotPolicies[0];}
function flowBand(score){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.flowBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.flowBands.at(-1);}
function chooseFlowFromContext(){
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const status=String(weather.status||'NORMAL');
  const proc=String(airport.procedure||'VISUAL_URBAN');
  const active=String(airport.activeAirport||'SBSP');
  if(status==='SEVERE'||weather.visibilityKm<=2) return {arrival:'LOW_VIS_STREAM',bank:'WEATHER_HOLD_BANK',stack:'HOLD_EMERGENCY_CLEAR',policy:'WEATHER_RECOVERY'};
  if(status==='ADVERSE'||weather.crosswindKt>=18) return {arrival:'WEATHER_EXTENDED',bank:'WEATHER_HOLD_BANK',stack:'HOLD_HIGH_ALT',policy:'SAFETY_FIRST'};
  if(proc.includes('PARALLEL')||['KJFK','RJTT','OMDB','EGLL'].includes(active)) return {arrival:'HEAVY_MIX',bank:'INTERNATIONAL_BANK',stack:'HOLD_HIGH_ALT',policy:'AIRLINE_BANK'};
  if(['SBSP','SBRJ'].includes(active)) return {arrival:'TIGHT_URBAN',bank:'REGIONAL_BANK',stack:'HOLD_COASTAL',policy:'FAIR_QUEUE'};
  return {arrival:'STANDARD_STREAM',bank:'LIGHT_BANK',stack:'HOLD_NORTH',policy:'FAIR_QUEUE'};
}
function generateSequencerQueues(){
  loadArrivalDepartureSequencer();
  const flow=arrivalFlowById(sequencerState.arrivalFlow);
  const bank=departureBankById(sequencerState.departureBank);
  const priorityRules=ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.priorityRules;
  const now=Date.now();
  sequencerState.arrivalQueue=Array.from({length:Math.max(2,Math.min(7,Math.round(12/flow.spacingNm)+2))},(_,i)=>({
    id:`ARR-${String(now+i).slice(-5)}`,
    sequence:i+1,
    spacingNm:flow.spacingNm+i,
    priority:i===0?'SLOT_CRITICAL':(i===1&&flow.id.includes('EMERGENCY')?'MEDICAL':'NORMAL'),
    etaMin:Math.round(3+i*flow.spacingNm*.9)
  }));
  sequencerState.departureQueue=Array.from({length:bank.slots},(_,i)=>({
    id:`DEP-${String(now+i+20).slice(-5)}`,
    slot:i+1,
    spacingSec:bank.spacingSec+i*12,
    priority:i===0?'SLOT_CRITICAL':'NORMAL',
    etdMin:Math.round(2+i*bank.spacingSec/60)
  }));
  sequencerState.priorityLoad=sequencerState.arrivalQueue.concat(sequencerState.departureQueue).reduce((sum,item)=>{
    const rule=priorityRules.find(r=>r.id===item.priority);
    return sum+(rule?Number(rule.weight||0):0);
  },0);
  sequencerState.holdingLoad=Math.max(0,sequencerState.arrivalQueue.length-holdingStackById(sequencerState.holdingStack).capacity);
  saveArrivalDepartureSequencer();
  return {arrivals:sequencerState.arrivalQueue,departures:sequencerState.departureQueue};
}
function refreshArrivalDepartureSequencer(mode='AUTO'){
  loadArrivalDepartureSequencer();
  const choice=chooseFlowFromContext();
  if(mode==='AUTO'){
    sequencerState.arrivalFlow=choice.arrival;
    sequencerState.departureBank=choice.bank;
    sequencerState.holdingStack=choice.stack;
    sequencerState.slotPolicy=choice.policy;
  }
  generateSequencerQueues();
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return sequencerState;
}
function setSequencerPolicy(policyId='FAIR_QUEUE'){
  loadArrivalDepartureSequencer();
  sequencerState.slotPolicy=slotPolicyById(policyId).id;
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return slotPolicyById(sequencerState.slotPolicy);
}
function evaluateArrivalDepartureSequencer(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadArrivalDepartureSequencer();
  if(!sequencerState.arrivalQueue.length||!sequencerState.departureQueue.length) refreshArrivalDepartureSequencer('AUTO');
  const flow=arrivalFlowById(sequencerState.arrivalFlow);
  const bank=departureBankById(sequencerState.departureBank);
  const stack=holdingStackById(sequencerState.holdingStack);
  const policy=slotPolicyById(sequencerState.slotPolicy);
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const weatherPenalty=String(weather.status||'NORMAL')==='SEVERE'?18:String(weather.status||'NORMAL')==='ADVERSE'?11:String(weather.status||'NORMAL')==='WATCH'?5:0;
  const loadPenalty=sequencerState.holdingLoad*8+sequencerState.priorityLoad*.12+denied*2+conflicts*8+incursions*12+(fail?10:0);
  const runwayBalance=Math.max(0,Math.min(100,Math.round(92-flow.risk*.45-bank.risk*.38-stack.risk*.22-weatherPenalty*.35+policy.safetyBias*.4)));
  const base=78+Math.min(10,Number(airport.score||75)/12)+Math.min(8,Number(finalScore||0)/550)+policy.safetyBias*.32-policy.delayBias*.18;
  const flowScore=Math.max(0,Math.min(100,Math.round(base-loadPenalty*.44-weatherPenalty-flow.risk*.18-bank.risk*.14+runwayBalance*.18)));
  const band=flowBand(flowScore);
  sequencerState.runwayBalance=runwayBalance;
  sequencerState.flowScore=flowScore;
  sequencerState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport.activeAirport||'SBSP',flowScore,status:band.id,statusName:band.name,arrivalFlow:flow.id,arrivalSpacingNm:flow.spacingNm,departureBank:bank.id,departureSlots:bank.slots,holdingStack:stack.id,holdingLoad:sequencerState.holdingLoad,priorityLoad:Math.round(sequencerState.priorityLoad),slotPolicy:policy.id,runwayBalance,weatherStatus:weather.status||'NORMAL',finalScore:Math.round(finalScore||0)};
  sequencerState.lastEvaluation=evaluation;
  sequencerState.history.unshift(evaluation);
  sequencerState.history=sequencerState.history.slice(0,100);
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return {state:sequencerState,evaluation};
}
function arrivalDepartureProgress(){
  loadArrivalDepartureSequencer();
  return {score:sequencerState.flowScore,status:sequencerState.status,arrivalFlow:sequencerState.arrivalFlow,departureBank:sequencerState.departureBank,holdingStack:sequencerState.holdingStack,slotPolicy:sequencerState.slotPolicy,arrivals:sequencerState.arrivalQueue.length,departures:sequencerState.departureQueue.length,holdingLoad:sequencerState.holdingLoad,priorityLoad:Math.round(sequencerState.priorityLoad||0),runwayBalance:sequencerState.runwayBalance,last:sequencerState.lastEvaluation||null};
}
function renderArrivalDepartureBoard(){
  try{
    const anchor=document.querySelector('#dynamicWeatherInline') || document.querySelector('#worldAirportInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#arrivalDepartureInline'); if(old) old.remove();
    const p=arrivalDepartureProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="arrivalDepartureInline" class="airport-ops-board arrival-departure-inline">
      <div class="airport-ops-head"><b>FLOW OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>AMAN</small><b>${p.arrivalFlow}</b></div>
        <div><small>DMAN</small><b>${p.departureBank}</b></div>
        <div><small>ARR</small><b>${p.arrivals}</b></div>
        <div><small>DEP</small><b>${p.departures}</b></div>
        <div><small>HOLD</small><b>${p.holdingLoad}</b></div>
        <div><small>RWY</small><b>${p.runwayBalance}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'arrival-departure-board');}
}
function initializeArrivalDepartureSequencer(){
  loadArrivalDepartureSequencer();
  if(!sequencerState.arrivalQueue.length) refreshArrivalDepartureSequencer('AUTO');
  else renderArrivalDepartureBoard();
  return sequencerState;
}
function arrivalDepartureStatus(){loadArrivalDepartureSequencer();return {...sequencerState,progress:arrivalDepartureProgress(),catalog:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG};}
function arrivalDepartureSelfCheck(){
  const issues=[];
  if(ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.length<6) issues.push('arrival flows insuficientes');
  if(ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.length<5) issues.push('departure banks insuficientes');
  refreshArrivalDepartureSequencer('AUTO');
  const policy=setSequencerPolicy('SAFETY_FIRST');
  const evalResult=evaluateArrivalDepartureSequencer(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!policy.id) issues.push('policy inválida');
  if(!Number.isFinite(evalResult.evaluation.flowScore)) issues.push('score inválido');
  if(evalResult.state.arrivalQueue.length<1||evalResult.state.departureQueue.length<1) issues.push('filas inválidas');
  return {ok:issues.length===0,issues,arrivals:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.length,banks:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.length};
}
window.SKYWARD_ARRIVAL_DEPARTURE=Object.freeze({
  schema:1,
  catalog:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG,
  load:loadArrivalDepartureSequencer,
  save:saveArrivalDepartureSequencer,
  init:initializeArrivalDepartureSequencer,
  refresh:refreshArrivalDepartureSequencer,
  policy:setSequencerPolicy,
  evaluate:evaluateArrivalDepartureSequencer,
  progress:arrivalDepartureProgress,
  status:arrivalDepartureStatus,
  board:renderArrivalDepartureBoard,
  selfCheck:arrivalDepartureSelfCheck
});
