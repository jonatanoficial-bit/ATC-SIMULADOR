/* @skyward-module 42-passenger-reputation-center
 * Passenger experience and public reputation center with NPS, complaints, accessibility, customer care and public sentiment.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('42-passenger-reputation-center');
const PASSENGER_REPUTATION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f39',
  experienceMetrics:[
    {id:'NPS',name:'NPS passageiro',weight:24,target:78},
    {id:'WAIT_TIME',name:'Tempo de espera',weight:18,target:76},
    {id:'INFORMATION',name:'Informação ao passageiro',weight:16,target:80},
    {id:'ACCESSIBILITY',name:'Acessibilidade',weight:12,target:82},
    {id:'CARE',name:'Atendimento e acolhimento',weight:14,target:78},
    {id:'SOCIAL_SENTIMENT',name:'Sentimento em redes',weight:16,target:76}
  ],
  servicePrograms:[
    {id:'LIVE_INFO_BOARDS',name:'Painéis vivos de informação',cost:32000,benefit:{INFORMATION:10,NPS:4}},
    {id:'ACCESSIBILITY_CREW',name:'Equipe acessibilidade',cost:24000,benefit:{ACCESSIBILITY:12,CARE:4}},
    {id:'QUEUE_AMBASSADORS',name:'Anfitriões de fila',cost:18000,benefit:{WAIT_TIME:8,CARE:6}},
    {id:'CARE_DESK',name:'Balcão cuidado ao passageiro',cost:26000,benefit:{CARE:12,SOCIAL_SENTIMENT:4}},
    {id:'SOCIAL_RESPONSE',name:'Resposta social media',cost:15000,benefit:{SOCIAL_SENTIMENT:10,INFORMATION:3}},
    {id:'FAMILY_ASSIST',name:'Assistência famílias/conexões',cost:21000,benefit:{NPS:7,CARE:6}}
  ],
  complaintTypes:[
    {id:'DELAY_INFO',name:'Falta de informação sobre atraso',risk:18,metric:'INFORMATION'},
    {id:'LONG_QUEUE',name:'Fila longa',risk:15,metric:'WAIT_TIME'},
    {id:'ACCESSIBILITY_FAIL',name:'Falha de acessibilidade',risk:24,metric:'ACCESSIBILITY'},
    {id:'BAGGAGE_CLAIM',name:'Problema de bagagem',risk:17,metric:'CARE'},
    {id:'SOCIAL_VIRAL',name:'Post viral negativo',risk:28,metric:'SOCIAL_SENTIMENT'},
    {id:'CONNECTION_MISSED',name:'Conexão perdida',risk:22,metric:'NPS'}
  ],
  reputationBands:[
    {id:'LOVED_AIRPORT',min:90,name:'Aeroporto querido'},
    {id:'TRUSTED',min:75,name:'Imagem confiável'},
    {id:'UNDER_PRESSURE',min:55,name:'Imagem pressionada'},
    {id:'REPUTATION_CRISIS',min:0,name:'Crise reputacional'}
  ],
  communicationChannels:[
    {id:'APP_PUSH',name:'Notificação app/PWA'},
    {id:'PA_SYSTEM',name:'Sistema de som'},
    {id:'SOCIAL_MEDIA',name:'Redes sociais'},
    {id:'AIRLINE_DESKS',name:'Balcões das companhias'},
    {id:'ACCESSIBILITY_TEAM',name:'Equipe acessibilidade'}
  ],
  publicMoments:[
    {id:'HOLIDAY_PEAK',name:'Pico de feriado',attention:18},
    {id:'MAJOR_DELAY',name:'Grande atraso',attention:24},
    {id:'VIP_VISIT',name:'Visita institucional',attention:10},
    {id:'VIRAL_INCIDENT',name:'Incidente viral',attention:30}
  ]
});
const PASSENGER_REPUTATION_KEY='skywardPassengerReputation_v1';
let passengerReputationState={schema:1,metrics:{NPS:78,WAIT_TIME:76,INFORMATION:80,ACCESSIBILITY:82,CARE:78,SOCIAL_SENTIMENT:76},programs:[],complaints:[],reputationScore:78,status:'TRUSTED',publicAttention:12,history:[],lastEvaluation:null};
function loadPassengerReputation(){
  try{ const raw=localStorage?.getItem?.(PASSENGER_REPUTATION_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) passengerReputationState={...passengerReputationState,...parsed}; } }catch(e){ safeLogError?.(e,'passenger-reputation-load'); }
  return passengerReputationState;
}
function savePassengerReputation(){
  try{ localStorage?.setItem?.(PASSENGER_REPUTATION_KEY,JSON.stringify(passengerReputationState)); }catch(e){ safeLogError?.(e,'passenger-reputation-save'); }
  return passengerReputationState;
}
function reputationBand(score){
  return PASSENGER_REPUTATION_CATALOG.reputationBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||PASSENGER_REPUTATION_CATALOG.reputationBands.at(-1);
}
function programById(id){ return PASSENGER_REPUTATION_CATALOG.servicePrograms.find(p=>p.id===id)||PASSENGER_REPUTATION_CATALOG.servicePrograms[0]; }
function complaintById(id){ return PASSENGER_REPUTATION_CATALOG.complaintTypes.find(c=>c.id===id)||PASSENGER_REPUTATION_CATALOG.complaintTypes[0]; }
function launchPassengerProgram(id='LIVE_INFO_BOARDS'){
  loadPassengerReputation();
  const program=programById(id);
  if(passengerReputationState.programs.some(p=>p.programId===program.id)) return passengerReputationState.programs.find(p=>p.programId===program.id);
  const item={id:`PXP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',startedAt:new Date().toISOString()};
  passengerReputationState.programs.unshift(item);
  for(const [metric,gain] of Object.entries(program.benefit||{})){
    passengerReputationState.metrics[metric]=Math.min(100,Number(passengerReputationState.metrics[metric]||75)+Number(gain||0));
  }
  savePassengerReputation();
  renderPassengerReputationBoard();
  return item;
}
function raisePassengerComplaint(id='DELAY_INFO'){
  loadPassengerReputation();
  const tpl=complaintById(id);
  const item={id:`CMP-${String(Date.now()).slice(-6)}`,complaintId:tpl.id,name:tpl.name,risk:tpl.risk,metric:tpl.metric,status:'OPEN',at:new Date().toISOString()};
  passengerReputationState.complaints.unshift(item);
  passengerReputationState.complaints=passengerReputationState.complaints.slice(0,60);
  passengerReputationState.publicAttention=Math.min(100,passengerReputationState.publicAttention+Math.round(tpl.risk/3));
  savePassengerReputation();
  renderPassengerReputationBoard();
  return item;
}
function closePassengerComplaint(id,ok=true){
  loadPassengerReputation();
  const complaint=passengerReputationState.complaints.find(c=>c.id===id);
  if(complaint){
    complaint.status=ok?'CLOSED':'ESCALATED';
    complaint.closedAt=new Date().toISOString();
    if(ok) passengerReputationState.metrics[complaint.metric]=Math.min(100,Number(passengerReputationState.metrics[complaint.metric]||75)+2);
  }
  savePassengerReputation();
  renderPassengerReputationBoard();
  return complaint||null;
}
function calculatePassengerMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const environment=window.SKYWARD_ENVIRONMENT_SUSTAINABILITY?.status?.()||{};
  const metrics={...passengerReputationState.metrics};
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||80);
  const terminalScore=Number(airportAuth.progress?.score||80);
  const crisisScore=Number(crisis.progress?.score||100);
  const workforceScore=Number(workforce.progress?.score||80);
  const margin=Number(revenue.progress?.margin||0);
  const esg=Number(environment.progress?.score||80);
  const openComplaints=passengerReputationState.complaints.filter(c=>c.status==='OPEN');
  const complaintPenalty=(metric)=>openComplaints.filter(c=>c.metric===metric).reduce((a,c)=>a+Number(c.risk||0),0)/2.8;
  metrics.WAIT_TIME=Math.max(0,Math.min(100,Number(metrics.WAIT_TIME||76)-denied*3-Math.max(0,75-terminalScore)*0.25-complaintPenalty('WAIT_TIME')+(workforceScore>80?2:0)));
  metrics.INFORMATION=Math.max(0,Math.min(100,Number(metrics.INFORMATION||80)-denied*2-Math.max(0,75-crisisScore)*0.25-complaintPenalty('INFORMATION')+(finalScore>2000?2:0)));
  metrics.ACCESSIBILITY=Math.max(0,Math.min(100,Number(metrics.ACCESSIBILITY||82)-complaintPenalty('ACCESSIBILITY')+(terminalScore>82?2:0)));
  metrics.CARE=Math.max(0,Math.min(100,Number(metrics.CARE||78)-openComplaints.length*1.8-Math.max(0,75-workforceScore)*0.20-complaintPenalty('CARE')));
  metrics.SOCIAL_SENTIMENT=Math.max(0,Math.min(100,Number(metrics.SOCIAL_SENTIMENT||76)-passengerReputationState.publicAttention*0.15-complaintPenalty('SOCIAL_SENTIMENT')+Math.max(0,esg-75)*0.10));
  metrics.NPS=Math.max(0,Math.min(100,Number(metrics.NPS||78)+(airlineScore-75)*0.10+(terminalScore-75)*0.14+(metrics.CARE-75)*0.10+(metrics.INFORMATION-75)*0.10-margin*0.03-denied*1.4-conflicts*2.4-incursions*5-(fail?8:0)-complaintPenalty('NPS')));
  return metrics;
}
function evaluatePassengerReputation(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadPassengerReputation();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const metrics=calculatePassengerMetrics(finalScore,statsObj,fail);
  passengerReputationState.metrics=metrics;
  if((statsObj.denied||0)>=2 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='DELAY_INFO')) raisePassengerComplaint('DELAY_INFO');
  if(metrics.SOCIAL_SENTIMENT<55 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='SOCIAL_VIRAL')) raisePassengerComplaint('SOCIAL_VIRAL');
  if(metrics.ACCESSIBILITY<60 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='ACCESSIBILITY_FAIL')) raisePassengerComplaint('ACCESSIBILITY_FAIL');
  const openRisk=passengerReputationState.complaints.filter(c=>c.status==='OPEN').reduce((a,c)=>a+Number(c.risk||0),0);
  const weighted=Math.round(PASSENGER_REPUTATION_CATALOG.experienceMetrics.reduce((a,m)=>a+(metrics[m.id]||0)*m.weight,0)/100);
  const score=Math.max(0,Math.min(100,Math.round(weighted-openRisk/12+passengerReputationState.programs.length*1.2)));
  passengerReputationState.reputationScore=score;
  passengerReputationState.status=reputationBand(score).id;
  passengerReputationState.publicAttention=Math.max(0,Math.min(100,Math.round(passengerReputationState.publicAttention*0.92+openRisk/18)));
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),metrics,weighted,reputationScore:score,status:passengerReputationState.status,openComplaints:passengerReputationState.complaints.filter(c=>c.status==='OPEN').length,programs:passengerReputationState.programs.length,publicAttention:passengerReputationState.publicAttention};
  passengerReputationState.history.unshift(evaluation);
  passengerReputationState.history=passengerReputationState.history.slice(0,100);
  passengerReputationState.lastEvaluation=evaluation;
  savePassengerReputation();
  renderPassengerReputationBoard();
  return {state:passengerReputationState,evaluation};
}
function passengerReputationProgress(){
  loadPassengerReputation();
  return {score:passengerReputationState.reputationScore,status:passengerReputationState.status,nps:Math.round(passengerReputationState.metrics.NPS||0),sentiment:Math.round(passengerReputationState.metrics.SOCIAL_SENTIMENT||0),complaints:passengerReputationState.complaints.filter(c=>c.status==='OPEN').length,programs:passengerReputationState.programs.length,publicAttention:passengerReputationState.publicAttention,last:passengerReputationState.lastEvaluation||null};
}
function renderPassengerReputationBoard(){
  try{
    const anchor=document.querySelector('#workforceStaffingInline') || document.querySelector('#revenueManagementInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#passengerReputationInline'); if(old) old.remove();
    const p=passengerReputationProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="passengerReputationInline" class="airport-ops-board passenger-reputation-inline">
      <div class="airport-ops-head"><b>PASSENGER XP</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REP.</small><b>${p.score}%</b></div>
        <div><small>NPS</small><b>${p.nps}</b></div>
        <div><small>SOCIAL</small><b>${p.sentiment}</b></div>
        <div><small>QUEIXAS</small><b>${p.complaints}</b></div>
        <div><small>PROG.</small><b>${p.programs}</b></div>
        <div><small>ATENÇÃO</small><b>${p.publicAttention}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'passenger-reputation-board'); }
}
function initializePassengerReputation(){
  loadPassengerReputation();
  renderPassengerReputationBoard();
  return passengerReputationState;
}
function passengerReputationStatus(){ loadPassengerReputation(); return {...passengerReputationState,progress:passengerReputationProgress(),catalog:PASSENGER_REPUTATION_CATALOG}; }
function passengerReputationSelfCheck(){
  const issues=[];
  if(PASSENGER_REPUTATION_CATALOG.experienceMetrics.length<6) issues.push('métricas insuficientes');
  if(PASSENGER_REPUTATION_CATALOG.servicePrograms.length<6) issues.push('programas insuficientes');
  const program=launchPassengerProgram('LIVE_INFO_BOARDS');
  const complaint=raisePassengerComplaint('DELAY_INFO');
  const res=evaluatePassengerReputation(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !complaint.id) issues.push('programa/reclamação inválidos');
  if(!Number.isFinite(res.evaluation.reputationScore)) issues.push('score reputação inválido');
  return {ok:issues.length===0,issues,metrics:PASSENGER_REPUTATION_CATALOG.experienceMetrics.length,programs:PASSENGER_REPUTATION_CATALOG.servicePrograms.length};
}
window.SKYWARD_PASSENGER_REPUTATION=Object.freeze({
  schema:1,
  catalog:PASSENGER_REPUTATION_CATALOG,
  load:loadPassengerReputation,
  save:savePassengerReputation,
  init:initializePassengerReputation,
  program:launchPassengerProgram,
  complaint:raisePassengerComplaint,
  close:closePassengerComplaint,
  evaluate:evaluatePassengerReputation,
  progress:passengerReputationProgress,
  status:passengerReputationStatus,
  board:renderPassengerReputationBoard,
  selfCheck:passengerReputationSelfCheck
});
