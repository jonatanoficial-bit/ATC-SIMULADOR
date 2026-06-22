/* @skyward-module 44-emergency-response-disaster-center
 * Emergency response and disaster preparedness center with ARFF, evacuation, medical triage, mutual aid and response readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('44-emergency-response-disaster-center');
const EMERGENCY_RESPONSE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f41',
  emergencyUnits:[
    {id:'ARFF_1',name:'ARFF principal',type:'FIRE',coverage:32,readiness:82,responseMin:3},
    {id:'ARFF_2',name:'ARFF reserva',type:'FIRE',coverage:24,readiness:76,responseMin:4},
    {id:'MEDICAL_TEAM',name:'Equipe médica aeroportuária',type:'MEDICAL',coverage:20,readiness:78,responseMin:5},
    {id:'SECURITY_EOC',name:'Segurança/EOC',type:'COMMAND',coverage:18,readiness:80,responseMin:4},
    {id:'EVAC_TEAM',name:'Equipe de evacuação',type:'EVACUATION',coverage:16,readiness:74,responseMin:6},
    {id:'MUTUAL_AID',name:'Apoio externo municipal',type:'MUTUAL_AID',coverage:22,readiness:70,responseMin:9}
  ],
  emergencyScenarios:[
    {id:'AIRCRAFT_FIRE',name:'Fogo em aeronave',severity:92,unit:'ARFF_1',reputationRisk:28},
    {id:'RUNWAY_EXCURSION',name:'Excursão de pista',severity:84,unit:'ARFF_1',reputationRisk:24},
    {id:'TERMINAL_EVAC',name:'Evacuação de terminal',severity:78,unit:'EVAC_TEAM',reputationRisk:22},
    {id:'MASS_CASUALTY',name:'Múltiplas vítimas',severity:88,unit:'MEDICAL_TEAM',reputationRisk:26},
    {id:'FUEL_SPILL',name:'Derramamento de combustível',severity:72,unit:'ARFF_2',reputationRisk:18},
    {id:'SECURITY_LOCKDOWN',name:'Lockdown de segurança',severity:80,unit:'SECURITY_EOC',reputationRisk:21}
  ],
  preparednessPrograms:[
    {id:'FULL_SCALE_DRILL',name:'Simulado geral integrado',cost:42000,benefit:{readiness:12,coordination:10,response:2}},
    {id:'ARFF_RECERT',name:'Recertificação ARFF',cost:28000,benefit:{readiness:9,arff:12}},
    {id:'MEDICAL_TRIAGE',name:'Treino de triagem médica',cost:21000,benefit:{medical:12,coordination:4}},
    {id:'EVAC_ROUTE_AUDIT',name:'Auditoria de rotas de evacuação',cost:18000,benefit:{evacuation:10,response:1}},
    {id:'MUTUAL_AID_MOU',name:'Acordo de apoio externo',cost:26000,benefit:{mutualAid:14,coordination:5}},
    {id:'EOC_UPGRADE',name:'Upgrade centro de emergência',cost:36000,benefit:{coordination:12,response:2}}
  ],
  agencyPartners:[
    {id:'FIRE_DEPT',name:'Corpo de bombeiros',trust:82},
    {id:'EMS',name:'SAMU/Resgate',trust:78},
    {id:'POLICE',name:'Polícia/segurança',trust:76},
    {id:'CIVIL_DEFENSE',name:'Defesa civil',trust:74},
    {id:'AIRLINES_EOC',name:'EOC companhias',trust:80}
  ],
  incidentLevels:[
    {id:'ALERT',minSeverity:35,name:'Alerta'},
    {id:'LOCAL_STANDBY',minSeverity:55,name:'Prontidão local'},
    {id:'FULL_EMERGENCY',minSeverity:75,name:'Emergência completa'},
    {id:'DISASTER',minSeverity:90,name:'Desastre'}
  ],
  readinessBands:[
    {id:'MISSION_READY',min:90,name:'Pronto para missão'},
    {id:'READY',min:75,name:'Pronto'},
    {id:'GAPS',min:55,name:'Com lacunas'},
    {id:'UNPREPARED',min:0,name:'Despreparado'}
  ],
  responseKPIs:[
    {id:'RESPONSE_TIME',name:'Tempo de resposta'},
    {id:'ARFF_COVERAGE',name:'Cobertura ARFF'},
    {id:'EVACUATION_FLOW',name:'Fluxo de evacuação'},
    {id:'MEDICAL_TRIAGE',name:'Triagem médica'},
    {id:'AGENCY_COORDINATION',name:'Coordenação multiagência'}
  ]
});
const EMERGENCY_RESPONSE_KEY='skywardEmergencyResponse_v1';
let emergencyResponseState={schema:1,programs:[],incidents:[],actions:[],readinessScore:78,responseTime:5,arffCoverage:78,evacuationFlow:76,medicalTriage:77,agencyCoordination:75,status:'READY',history:[],lastEvaluation:null};
function loadEmergencyResponse(){
  try{ const raw=localStorage?.getItem?.(EMERGENCY_RESPONSE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) emergencyResponseState={...emergencyResponseState,...parsed}; } }catch(e){ safeLogError?.(e,'emergency-response-load'); }
  return emergencyResponseState;
}
function saveEmergencyResponse(){
  try{ localStorage?.setItem?.(EMERGENCY_RESPONSE_KEY,JSON.stringify(emergencyResponseState)); }catch(e){ safeLogError?.(e,'emergency-response-save'); }
  return emergencyResponseState;
}
function readinessBand(score){
  return EMERGENCY_RESPONSE_CATALOG.readinessBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||EMERGENCY_RESPONSE_CATALOG.readinessBands.at(-1);
}
function incidentLevel(severity){
  return EMERGENCY_RESPONSE_CATALOG.incidentLevels.slice().sort((a,b)=>b.minSeverity-a.minSeverity).find(l=>severity>=l.minSeverity)||EMERGENCY_RESPONSE_CATALOG.incidentLevels[0];
}
function programById(id){ return EMERGENCY_RESPONSE_CATALOG.preparednessPrograms.find(p=>p.id===id)||EMERGENCY_RESPONSE_CATALOG.preparednessPrograms[0]; }
function scenarioById(id){ return EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.find(s=>s.id===id)||EMERGENCY_RESPONSE_CATALOG.emergencyScenarios[0]; }
function runPreparednessProgram(id='FULL_SCALE_DRILL'){
  loadEmergencyResponse();
  const program=programById(id);
  if(emergencyResponseState.programs.some(p=>p.programId===program.id)) return emergencyResponseState.programs.find(p=>p.programId===program.id);
  const item={id:`ERP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  emergencyResponseState.programs.unshift(item);
  for(const [k,gain] of Object.entries(program.benefit||{})){
    if(k==='readiness') emergencyResponseState.readinessScore=Math.min(100,emergencyResponseState.readinessScore+gain);
    if(k==='coordination') emergencyResponseState.agencyCoordination=Math.min(100,emergencyResponseState.agencyCoordination+gain);
    if(k==='response') emergencyResponseState.responseTime=Math.max(2,emergencyResponseState.responseTime-gain);
    if(k==='arff') emergencyResponseState.arffCoverage=Math.min(100,emergencyResponseState.arffCoverage+gain);
    if(k==='medical') emergencyResponseState.medicalTriage=Math.min(100,emergencyResponseState.medicalTriage+gain);
    if(k==='evacuation') emergencyResponseState.evacuationFlow=Math.min(100,emergencyResponseState.evacuationFlow+gain);
    if(k==='mutualAid') emergencyResponseState.agencyCoordination=Math.min(100,emergencyResponseState.agencyCoordination+Math.round(gain/2));
  }
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return item;
}
function raiseEmergencyIncident(id='RUNWAY_EXCURSION'){
  loadEmergencyResponse();
  const tpl=scenarioById(id);
  const item={id:`EMG-${String(Date.now()).slice(-6)}`,scenarioId:tpl.id,name:tpl.name,severity:tpl.severity,unit:tpl.unit,level:incidentLevel(tpl.severity).id,reputationRisk:tpl.reputationRisk,status:'OPEN',at:new Date().toISOString()};
  emergencyResponseState.incidents.unshift(item);
  emergencyResponseState.incidents=emergencyResponseState.incidents.slice(0,60);
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return item;
}
function resolveEmergencyIncident(id,ok=true){
  loadEmergencyResponse();
  const incident=emergencyResponseState.incidents.find(i=>i.id===id);
  if(incident){
    incident.status=ok?'RESOLVED':'ESCALATED';
    incident.closedAt=new Date().toISOString();
    if(ok) emergencyResponseState.readinessScore=Math.min(100,emergencyResponseState.readinessScore+1);
  }
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return incident||null;
}
function calculateEmergencyMetrics(finalScore=0,statsObj={},fail=false){
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};
  const infrastructure=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const open=emergencyResponseState.incidents.filter(i=>i.status==='OPEN');
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const crisisScore=Number(crisis.progress?.score||90);
  const safetyScore=Number(safety.progress?.score||80);
  const workforceScore=Number(workforce.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||80);
  const networkScore=Number(network.progress?.score||78);
  const infraRisk=Number(infrastructure.progress?.risk||0);
  const severityLoad=open.reduce((a,i)=>a+Number(i.severity||0),0)/10;
  const responseTime=Math.max(2,Math.min(15,Math.round(emergencyResponseState.responseTime + open.length*.6 + incursions*.8 + Math.max(0,75-workforceScore)/20)));
  const arffCoverage=Math.max(0,Math.min(100,Math.round(emergencyResponseState.arffCoverage + safetyScore*.08 - incursions*10 - severityLoad*.4)));
  const evacuationFlow=Math.max(0,Math.min(100,Math.round(emergencyResponseState.evacuationFlow + passengerScore*.08 - denied*1.5 - open.filter(i=>i.scenarioId==='TERMINAL_EVAC').length*12)));
  const medicalTriage=Math.max(0,Math.min(100,Math.round(emergencyResponseState.medicalTriage + workforceScore*.06 - open.filter(i=>i.scenarioId==='MASS_CASUALTY').length*15)));
  const agencyCoordination=Math.max(0,Math.min(100,Math.round(emergencyResponseState.agencyCoordination + networkScore*.05 + crisisScore*.05 - open.length*4 - infraRisk*.05)));
  const reputationLoad=open.reduce((a,i)=>a+Number(i.reputationRisk||0),0);
  return {responseTime,arffCoverage,evacuationFlow,medicalTriage,agencyCoordination,reputationLoad,openIncidents:open.length,drivers:{conflicts,incursions,denied,crisisScore,safetyScore,workforceScore,passengerScore,networkScore,infraRisk}};
}
function evaluateEmergencyResponse(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadEmergencyResponse();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.runwayIncursions||0)>0 && !emergencyResponseState.incidents.some(i=>i.status==='OPEN'&&i.scenarioId==='RUNWAY_EXCURSION')) raiseEmergencyIncident('RUNWAY_EXCURSION');
  if((statsObj.conflicts||0)>=2 && !emergencyResponseState.incidents.some(i=>i.status==='OPEN'&&i.scenarioId==='AIRCRAFT_FIRE')) raiseEmergencyIncident('AIRCRAFT_FIRE');
  const metrics=calculateEmergencyMetrics(finalScore,statsObj,fail);
  emergencyResponseState.responseTime=metrics.responseTime;
  emergencyResponseState.arffCoverage=metrics.arffCoverage;
  emergencyResponseState.evacuationFlow=metrics.evacuationFlow;
  emergencyResponseState.medicalTriage=metrics.medicalTriage;
  emergencyResponseState.agencyCoordination=metrics.agencyCoordination;
  const responseScore=Math.max(0,100-metrics.responseTime*8);
  const score=Math.max(0,Math.min(100,Math.round(
    responseScore*.22 + metrics.arffCoverage*.24 + metrics.evacuationFlow*.16 + metrics.medicalTriage*.16 + metrics.agencyCoordination*.16 + Math.max(0,100-metrics.reputationLoad)*.06 - (fail?8:0)
  )));
  emergencyResponseState.readinessScore=score;
  emergencyResponseState.status=readinessBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,readinessScore:score,status:emergencyResponseState.status,programs:emergencyResponseState.programs.length};
  emergencyResponseState.history.unshift(evaluation);
  emergencyResponseState.history=emergencyResponseState.history.slice(0,100);
  emergencyResponseState.lastEvaluation=evaluation;
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return {state:emergencyResponseState,evaluation};
}
function emergencyResponseProgress(){
  loadEmergencyResponse();
  return {score:emergencyResponseState.readinessScore,status:emergencyResponseState.status,responseTime:emergencyResponseState.responseTime,arffCoverage:emergencyResponseState.arffCoverage,evacuationFlow:emergencyResponseState.evacuationFlow,medicalTriage:emergencyResponseState.medicalTriage,agencyCoordination:emergencyResponseState.agencyCoordination,openIncidents:emergencyResponseState.incidents.filter(i=>i.status==='OPEN').length,programs:emergencyResponseState.programs.length,last:emergencyResponseState.lastEvaluation||null};
}
function renderEmergencyResponseBoard(){
  try{
    const anchor=document.querySelector('#multiAirportNetworkInline') || document.querySelector('#passengerReputationInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#emergencyResponseInline'); if(old) old.remove();
    const p=emergencyResponseProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="emergencyResponseInline" class="airport-ops-board emergency-response-inline">
      <div class="airport-ops-head"><b>EMERGENCY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PRONT.</small><b>${p.score}%</b></div>
        <div><small>RESP.</small><b>${p.responseTime}m</b></div>
        <div><small>ARFF</small><b>${p.arffCoverage}</b></div>
        <div><small>EVAC.</small><b>${p.evacuationFlow}</b></div>
        <div><small>MÉD.</small><b>${p.medicalTriage}</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'emergency-response-board'); }
}
function initializeEmergencyResponse(){
  loadEmergencyResponse();
  renderEmergencyResponseBoard();
  return emergencyResponseState;
}
function emergencyResponseStatus(){ loadEmergencyResponse(); return {...emergencyResponseState,progress:emergencyResponseProgress(),catalog:EMERGENCY_RESPONSE_CATALOG}; }
function emergencyResponseSelfCheck(){
  const issues=[];
  if(EMERGENCY_RESPONSE_CATALOG.emergencyUnits.length<6) issues.push('unidades insuficientes');
  if(EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.length<6) issues.push('cenários insuficientes');
  const program=runPreparednessProgram('FULL_SCALE_DRILL');
  const incident=raiseEmergencyIncident('RUNWAY_EXCURSION');
  const res=evaluateEmergencyResponse(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.readinessScore)) issues.push('score emergência inválido');
  return {ok:issues.length===0,issues,units:EMERGENCY_RESPONSE_CATALOG.emergencyUnits.length,scenarios:EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.length};
}
window.SKYWARD_EMERGENCY_RESPONSE=Object.freeze({
  schema:1,
  catalog:EMERGENCY_RESPONSE_CATALOG,
  load:loadEmergencyResponse,
  save:saveEmergencyResponse,
  init:initializeEmergencyResponse,
  program:runPreparednessProgram,
  incident:raiseEmergencyIncident,
  resolve:resolveEmergencyIncident,
  evaluate:evaluateEmergencyResponse,
  progress:emergencyResponseProgress,
  status:emergencyResponseStatus,
  board:renderEmergencyResponseBoard,
  selfCheck:emergencyResponseSelfCheck
});
