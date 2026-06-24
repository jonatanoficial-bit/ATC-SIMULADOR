/* @skyward-module 22-incident-emergency-director
 * Complex operational incidents, runway closure and multi-agency emergency coordination.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('22-incident-emergency-director');
const INCIDENT_PLAYBOOK_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f19',
  incidentTypes:[
    {id:'BIRD_STRIKE',name:'Bird strike na decolagem',severity:'high',phase:'departure',probabilityWeight:.18,runwayClosureMin:18,requiredAgencies:['ARFF','WILDLIFE','OPS'],requiredActions:['stop_departures','inspect_runway','vector_return','coordinate_arff'],scorePenalty:220,economyPenalty:38000,careerStress:10},
    {id:'ENGINE_FAILURE',name:'Falha de motor após V1',severity:'critical',phase:'departure',probabilityWeight:.13,runwayClosureMin:22,requiredAgencies:['ARFF','TOWER','APPROACH','AIRLINE_OPS'],requiredActions:['declare_mayday','priority_vectors','hold_all_departures','clear_emergency_landing'],scorePenalty:320,economyPenalty:52000,careerStress:15},
    {id:'MEDICAL_EVAC',name:'Evacuação médica a bordo',severity:'medium',phase:'arrival',probabilityWeight:.16,runwayClosureMin:0,requiredAgencies:['MEDICAL','OPS','AIRLINE_OPS'],requiredActions:['priority_landing','assign_gate_medical','notify_medical'],scorePenalty:120,economyPenalty:18000,careerStress:7},
    {id:'GEAR_UNSAFE',name:'Trem de pouso inseguro',severity:'critical',phase:'arrival',probabilityWeight:.12,runwayClosureMin:35,requiredAgencies:['ARFF','TOWER','APPROACH','OPS'],requiredActions:['low_pass_inspection','emergency_landing','foam_standby','close_runway'],scorePenalty:360,economyPenalty:65000,careerStress:18},
    {id:'RUNWAY_FOD',name:'FOD na pista',severity:'high',phase:'surface',probabilityWeight:.20,runwayClosureMin:14,requiredAgencies:['OPS','GROUND','INSPECTION'],requiredActions:['close_runway','reroute_taxi','inspect_runway','reopen_runway'],scorePenalty:180,economyPenalty:26000,careerStress:6},
    {id:'BRAKE_FIRE',name:'Superaquecimento/fogo nos freios',severity:'high',phase:'surface',probabilityWeight:.14,runwayClosureMin:20,requiredAgencies:['ARFF','GROUND','OPS'],requiredActions:['stop_aircraft','coordinate_arff','evacuate_if_needed'],scorePenalty:240,economyPenalty:42000,careerStress:12},
    {id:'SECURITY_EVAC',name:'Evacuação de terminal / alerta de segurança',severity:'medium',phase:'airport',probabilityWeight:.09,runwayClosureMin:0,requiredAgencies:['SECURITY','OPS','AIRLINE_OPS'],requiredActions:['ground_delay_program','gate_hold','coordinate_security'],scorePenalty:160,economyPenalty:36000,careerStress:9}
  ],
  agencies:{
    ARFF:{name:'Resgate e Combate a Incêndio',responseMin:3,cost:8000},WILDLIFE:{name:'Controle de fauna',responseMin:8,cost:3500},OPS:{name:'Operações aeroportuárias',responseMin:5,cost:4200},GROUND:{name:'Controle de solo',responseMin:2,cost:1800},TOWER:{name:'Torre',responseMin:1,cost:1200},APPROACH:{name:'Aproximação',responseMin:2,cost:1500},AIRLINE_OPS:{name:'COA companhia aérea',responseMin:6,cost:2600},MEDICAL:{name:'Equipe médica',responseMin:7,cost:5200},INSPECTION:{name:'Inspeção de pista',responseMin:6,cost:4600},SECURITY:{name:'Segurança aeroportuária',responseMin:5,cost:6000}
  },
  resolutionGrades:[{id:'EXCELLENT',name:'Resposta excelente',minScore:88},{id:'CONTROLLED',name:'Controlado',minScore:70},{id:'DELAYED',name:'Resposta atrasada',minScore:48},{id:'FAILED',name:'Falha crítica',minScore:0}]
});
let incidentDirector = {schema:1,active:null,history:[],runwayClosed:false,runwayClosedUntil:0,agenciesDispatched:[],actions:[],lastTick:0,summary:{total:0,resolved:0,failed:0,closures:0,cost:0},lastGeneratedAt:0,lastAutoResolveAt:0};
function incidentNow(){ return performance?.now?.() || Date.now(); }
function incidentMobilePace(){ try{ return typeof atcPaceFactor==='function' ? atcPaceFactor() : ((window.matchMedia?.('(pointer: coarse)').matches || innerWidth<900) ? 1.8 : 1); }catch(_e){ return 1; } }
function pickIncidentType(seed=0){
  const list=INCIDENT_PLAYBOOK_CATALOG.incidentTypes;
  const total=list.reduce((a,i)=>a+(i.probabilityWeight||0),0);
  let roll=((Math.abs(Math.sin(seed+13.37))*10000)%1)*total;
  for(const item of list){ roll-=item.probabilityWeight||0; if(roll<=0) return item; }
  return list[0];
}
function incidentGrade(score){
  return INCIDENT_PLAYBOOK_CATALOG.resolutionGrades.find(g=>score>=g.minScore) || INCIDENT_PLAYBOOK_CATALOG.resolutionGrades.at(-1);
}
function startOperationalIncident(typeId='', targetPlane=null, reason='scheduled'){
  if(incidentDirector.active) return incidentDirector.active;
  const type=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id===typeId) || pickIncidentType((stats?.commands||0)+(stats?.requests||0)+(profile?.turns||0));
  const now=incidentNow();
  const incident={
    id:`INC-${String(Math.floor(now)%100000).padStart(5,'0')}`,
    typeId:type.id,name:type.name,severity:type.severity,phase:type.phase,startedAt:now,targetId:targetPlane?.id||selected||null,
    requiredAgencies:type.requiredAgencies.slice(),requiredActions:type.requiredActions.slice(),completedActions:[],dispatchedAgencies:[],
    runwayClosureMin:type.runwayClosureMin||0,scorePenalty:type.scorePenalty||0,economyPenalty:type.economyPenalty||0,careerStress:type.careerStress||0,
    status:'ACTIVE',reason
  };
  incidentDirector.active=incident;
  incidentDirector.summary.total++;
  if(type.runwayClosureMin>0) closeRunwayForIncident(type.runwayClosureMin, incident.id);
  if(targetPlane){ targetPlane.emergency=true; targetPlane.incidentId=incident.id; targetPlane.emergencyType=type.name; if(targetPlane.kind==='arrival') targetPlane.status='EMERG'; addRequest?.(targetPlane,'emergency','urgent'); }
  addLog?.(`INCIDENTE ${incident.id}: ${type.name}. Coordene ${type.requiredAgencies.join(', ')}.`, 'danger');
  setDiagnostic?.(`INCIDENTE: ${type.name}`,'danger');
  renderIncidentBoard();
  return incident;
}
function closeRunwayForIncident(minutes=10, incidentId=''){
  incidentDirector.runwayClosed=true;
  incidentDirector.runwayClosedUntil=Math.max(incidentDirector.runwayClosedUntil||0,incidentNow()+minutes*60000);
  incidentDirector.summary.closures++;
  stats.runwayClosures=(stats.runwayClosures||0)+1;
  runwayOccupiedBy=runwayOccupiedBy||`CLOSED-${incidentId||'INC'}`;
  addLog?.(`PISTA ${runway?.name||''} FECHADA por ${minutes} min operacionais.`, 'warn');
}
function reopenRunwayIfReady(force=false){
  if(force || (incidentDirector.runwayClosed && incidentNow()>=incidentDirector.runwayClosedUntil)){
    incidentDirector.runwayClosed=false;
    incidentDirector.runwayClosedUntil=0;
    if(String(runwayOccupiedBy||'').startsWith('CLOSED-')) runwayOccupiedBy=null;
    addLog?.(`PISTA ${runway?.name||''} reaberta após inspeção.`, 'ok');
  }
  renderIncidentBoard();
  return !incidentDirector.runwayClosed;
}
function dispatchIncidentAgency(agencyId){
  const inc=incidentDirector.active; if(!inc) return {ok:false,msg:'Sem incidente ativo.'};
  const id=String(agencyId||'').toUpperCase();
  if(!INCIDENT_PLAYBOOK_CATALOG.agencies[id]) return {ok:false,msg:`Agência desconhecida: ${id}`};
  if(!inc.dispatchedAgencies.includes(id)) inc.dispatchedAgencies.push(id);
  if(!incidentDirector.agenciesDispatched.includes(id)) incidentDirector.agenciesDispatched.push(id);
  incidentDirector.summary.cost += INCIDENT_PLAYBOOK_CATALOG.agencies[id].cost||0;
  addLog?.(`${id}: acionado para ${inc.id}.`, 'warn');
  renderIncidentBoard();
  return {ok:true,incident:inc};
}
function completeIncidentAction(actionId){
  const inc=incidentDirector.active; if(!inc) return {ok:false,msg:'Sem incidente ativo.'};
  const id=String(actionId||'');
  if(!inc.requiredActions.includes(id)) return {ok:false,msg:`Ação não prevista: ${id}`};
  if(!inc.completedActions.includes(id)) inc.completedActions.push(id);
  if(!incidentDirector.actions.includes(id)) incidentDirector.actions.push(id);
  addLog?.(`Ação ${id} concluída para ${inc.id}.`, 'ok');
  renderIncidentBoard();
  return {ok:true,incident:inc};
}
function incidentCompletionScore(inc=incidentDirector.active){
  if(!inc) return 100;
  const agencyRatio=inc.requiredAgencies.length ? inc.dispatchedAgencies.length/inc.requiredAgencies.length : 1;
  const actionRatio=inc.requiredActions.length ? inc.completedActions.length/inc.requiredActions.length : 1;
  const elapsedMin=(incidentNow()-inc.startedAt)/60000;
  let score=Math.round(agencyRatio*38 + actionRatio*48 + Math.max(0,14-elapsedMin));
  if(inc.severity==='critical') score-=inc.completedActions.includes('clear_emergency_landing') || inc.completedActions.includes('emergency_landing') ? 0 : 10;
  if(incidentDirector.runwayClosed && inc.runwayClosureMin===0) score-=6;
  return Math.max(0,Math.min(100,score));
}
function resolveOperationalIncident(success=null){
  const inc=incidentDirector.active; if(!inc) return null;
  const resolutionScore=incidentCompletionScore(inc);
  const grade=incidentGrade(resolutionScore);
  const ok=success===null ? resolutionScore>=48 : Boolean(success);
  inc.status=ok?'RESOLVED':'FAILED'; inc.resolvedAt=incidentNow(); inc.resolutionScore=resolutionScore; inc.grade=grade.id;
  incidentDirector.history.unshift({...inc});
  incidentDirector.history=incidentDirector.history.slice(0,30);
  incidentDirector.summary.resolved+=ok?1:0;
  incidentDirector.summary.failed+=ok?0:1;
  incidentDirector.summary.cost+=inc.economyPenalty||0;
  if(!ok){ stats.incidentFailures=(stats.incidentFailures||0)+1; if(typeof score==='number') score-=inc.scorePenalty||0; }
  else { stats.incidentsResolved=(stats.incidentsResolved||0)+1; }
  if(incidentDirector.runwayClosed && resolutionScore>=70) reopenRunwayIfReady(true);
  addLog?.(`INCIDENTE ${inc.id}: ${grade.name} (${resolutionScore}%).`, ok?'ok':'danger');
  incidentDirector.active=null;
  renderIncidentBoard();
  return inc;
}
function incidentRiskForCommand(cmd, plane){
  const inc=incidentDirector.active;
  if(incidentDirector.runwayClosed && ['clearTakeoff','clearLanding','lineup','takeoff'].includes(cmd)) return {level:'danger',block:true,msg:'Pista fechada por incidente operacional.'};
  if(!inc) return {level:'ok',block:false,msg:''};
  if(['clearTakeoff','takeoff'].includes(cmd) && ['BIRD_STRIKE','ENGINE_FAILURE','RUNWAY_FOD','BRAKE_FIRE'].includes(inc.typeId)) return {level:'danger',block:true,msg:`${inc.name}: decolagens suspensas.`};
  if(cmd==='clearLanding' && inc.phase==='arrival' && plane?.id!==inc.targetId) return {level:'warn',block:false,msg:`Prioridade para incidente ${inc.id}.`};
  if(cmd==='goAround' && inc.typeId==='GEAR_UNSAFE') return {level:'warn',block:false,msg:'Aproximação perdida pode prolongar emergência.'};
  return {level:'ok',block:false,msg:''};
}
function incidentTick(dt=0){
  if(incidentDirector.runwayClosed) reopenRunwayIfReady(false);
  const inc=incidentDirector.active;
  if(inc){
    const elapsed=(incidentNow()-inc.startedAt)/1000;
    if(elapsed>130*incidentMobilePace() && inc.status==='ACTIVE') resolveOperationalIncident(false);
  }
  renderIncidentBoard();
}
function maybeTriggerIncident(){
  if(incidentDirector.active) return null;
  const now=incidentNow();
  const pace=incidentMobilePace();
  if(incidentDirector.lastGeneratedAt && now-incidentDirector.lastGeneratedAt < 90000*pace) return null;
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const base=(stats?.landed||0)+(stats?.departed||0)+(stats?.requests||0);
  const rawRisk=(wx?.flightRules==='LIFR'?0.06:wx?.flightRules==='IFR'?0.035:0.018)+Math.min(.055,(stats?.conflicts||0)*.012+(stats?.runwayIncursions||0)*.02);
  const risk=rawRisk*(pace>1?.42:.72);
  if(base>4 && Math.random()<risk){
    const candidates=aircraft?.filter?.(p=>p.status!=='PARKED')||[];
    incidentDirector.lastGeneratedAt=now;
    return startOperationalIncident('',candidates[0]||null,'runtime-risk');
  }
  return null;
}
function incidentEconomicImpact(){ return {cost:incidentDirector.summary.cost,closures:incidentDirector.summary.closures,failed:incidentDirector.summary.failed,resolved:incidentDirector.summary.resolved}; }
function renderIncidentBoard(){
  try{
    const anchor=document.querySelector('#economyOpsInline') || document.querySelector('#careerOpsInline') || document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#incidentOpsInline'); if(old) old.remove();
    const inc=incidentDirector.active;
    const closed=incidentDirector.runwayClosed;
    anchor.insertAdjacentHTML('afterend',`<div id="incidentOpsInline" class="airport-ops-board incident-ops-inline">
      <div class="airport-ops-head"><b>INCIDENT OPS</b><span>${inc?inc.severity.toUpperCase():(closed?'RWY CLOSED':'NORMAL')}</span></div>
      <div class="airport-ops-grid">
        <div><small>ATIVO</small><b>${inc?inc.typeId:'---'}</b></div>
        <div><small>ALVO</small><b>${inc?.targetId||'---'}</b></div>
        <div><small>AGÊNCIAS</small><b>${inc?`${inc.dispatchedAgencies.length}/${inc.requiredAgencies.length}`:'0/0'}</b></div>
        <div><small>AÇÕES</small><b>${inc?`${inc.completedActions.length}/${inc.requiredActions.length}`:'0/0'}</b></div>
        <div><small>PISTA</small><b>${closed?'FECHADA':'ABERTA'}</b></div>
        <div><small>RESOLVIDOS</small><b>${incidentDirector.summary.resolved}/${incidentDirector.summary.total}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'incident-board'); }
}
function incidentSelfCheck(){
  const issues=[];
  if(INCIDENT_PLAYBOOK_CATALOG.incidentTypes.length<7) issues.push('incidentes insuficientes');
  if(Object.keys(INCIDENT_PLAYBOOK_CATALOG.agencies).length<8) issues.push('agências insuficientes');
  const bird=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id==='BIRD_STRIKE');
  if(!bird?.requiredAgencies?.includes('ARFF')) issues.push('bird strike sem ARFF');
  const engine=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id==='ENGINE_FAILURE');
  if(engine?.severity!=='critical') issues.push('engine failure não crítico');
  return {ok:issues.length===0,issues,types:INCIDENT_PLAYBOOK_CATALOG.incidentTypes.length,agencies:Object.keys(INCIDENT_PLAYBOOK_CATALOG.agencies).length};
}
window.SKYWARD_INCIDENTS=Object.freeze({
  schema:1,
  catalog:INCIDENT_PLAYBOOK_CATALOG,
  state:()=>incidentDirector,
  start:startOperationalIncident,
  closeRunway:closeRunwayForIncident,
  reopen:reopenRunwayIfReady,
  dispatch:dispatchIncidentAgency,
  action:completeIncidentAction,
  resolve:resolveOperationalIncident,
  score:incidentCompletionScore,
  risk:incidentRiskForCommand,
  tick:incidentTick,
  maybe:maybeTriggerIncident,
  economy:incidentEconomicImpact,
  render:renderIncidentBoard,
  selfCheck:incidentSelfCheck
});
