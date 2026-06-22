/* @skyward-module 41-workforce-staffing-center
 * Workforce and staffing center with ATC teams, roster coverage, fatigue, training, hiring, absence and readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('41-workforce-staffing-center');
const WORKFORCE_STAFFING_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f38',
  roles:[
    {id:'TOWER_CONTROLLER',name:'Controlador de Torre',minCoverage:2,skill:'TWR'},
    {id:'GROUND_CONTROLLER',name:'Controlador de Solo',minCoverage:1,skill:'GND'},
    {id:'APPROACH_CONTROLLER',name:'Controle de Aproximação',minCoverage:2,skill:'APP'},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minCoverage:1,skill:'SUP'},
    {id:'FLOW_MANAGER',name:'Gestor de Fluxo',minCoverage:1,skill:'FLOW'},
    {id:'TECH_SUPPORT',name:'Suporte Técnico',minCoverage:1,skill:'TECH'}
  ],
  trainingPrograms:[
    {id:'SIM_REFRESHER',name:'Reciclagem em simulador',cost:9000,skillGain:6,fatigueRelief:2},
    {id:'CRM_ATC',name:'Comunicação e CRM ATC',cost:6500,skillGain:5,fatigueRelief:1},
    {id:'EMERGENCY_DRILL',name:'Treino de emergência',cost:11000,skillGain:8,fatigueRelief:0},
    {id:'SURFACE_SAFETY',name:'Segurança de solo/pista',cost:8000,skillGain:7,fatigueRelief:1},
    {id:'FLOW_SLOT_TRAINING',name:'Slots e fluxo',cost:7200,skillGain:6,fatigueRelief:1}
  ],
  hiringPools:[
    {id:'TRAINEE',name:'Trainee ATC',cost:18000,skill:55,readyIn:4},
    {id:'LICENSED',name:'Controlador licenciado',cost:42000,skill:72,readyIn:2},
    {id:'SENIOR',name:'Sênior internacional',cost:76000,skill:86,readyIn:1},
    {id:'CONTRACTOR',name:'Contrato temporário',cost:30000,skill:68,readyIn:0}
  ],
  laborEvents:[
    {id:'SICK_LEAVE',name:'Baixa médica',risk:16,impact:'coverage-1'},
    {id:'OVERTIME_DISPUTE',name:'Disputa de hora extra',risk:22,impact:'morale-12'},
    {id:'UNION_WARNING',name:'Alerta sindical',risk:28,impact:'laborRisk+15'},
    {id:'TRAINING_BACKLOG',name:'Fila de treinamento',risk:14,impact:'skill-8'},
    {id:'BURNOUT_ALERT',name:'Alerta de burnout',risk:26,impact:'fatigue+18'}
  ],
  readinessBands:[
    {id:'ELITE_CREW',min:90,name:'Equipe elite'},
    {id:'READY',min:75,name:'Pronta'},
    {id:'STRETCHED',min:55,name:'Sobrecarregada'},
    {id:'UNDERSTAFFED',min:0,name:'Subdimensionada'}
  ],
  shiftPatterns:[
    {id:'NORMAL_DAY',name:'Turno diurno normal',fatigue:8,coverageBoost:0},
    {id:'PEAK_OPS',name:'Pico operacional',fatigue:14,coverageBoost:1},
    {id:'NIGHT_OPS',name:'Turno noturno',fatigue:18,coverageBoost:-1},
    {id:'RECOVERY_DAY',name:'Dia de recuperação',fatigue:-12,coverageBoost:-1}
  ]
});
const WORKFORCE_STAFFING_KEY='skywardWorkforceStaffing_v1';
let workforceStaffingState={schema:1,staff:[
  {id:'ATC-001',role:'TOWER_CONTROLLER',skill:78,fatigue:18,status:'ACTIVE'},
  {id:'ATC-002',role:'TOWER_CONTROLLER',skill:74,fatigue:24,status:'ACTIVE'},
  {id:'ATC-003',role:'GROUND_CONTROLLER',skill:72,fatigue:20,status:'ACTIVE'},
  {id:'ATC-004',role:'APPROACH_CONTROLLER',skill:80,fatigue:22,status:'ACTIVE'},
  {id:'ATC-005',role:'APPROACH_CONTROLLER',skill:76,fatigue:26,status:'ACTIVE'},
  {id:'ATC-006',role:'SUPERVISOR',skill:85,fatigue:18,status:'ACTIVE'},
  {id:'ATC-007',role:'FLOW_MANAGER',skill:77,fatigue:21,status:'ACTIVE'},
  {id:'ATC-008',role:'TECH_SUPPORT',skill:73,fatigue:17,status:'ACTIVE'}
],trainees:[],events:[],readinessScore:78,morale:76,laborRisk:12,status:'READY',shiftPattern:'NORMAL_DAY',history:[],lastEvaluation:null};
function loadWorkforceStaffing(){
  try{ const raw=localStorage?.getItem?.(WORKFORCE_STAFFING_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) workforceStaffingState={...workforceStaffingState,...parsed}; } }catch(e){ safeLogError?.(e,'workforce-staffing-load'); }
  return workforceStaffingState;
}
function saveWorkforceStaffing(){
  try{ localStorage?.setItem?.(WORKFORCE_STAFFING_KEY,JSON.stringify(workforceStaffingState)); }catch(e){ safeLogError?.(e,'workforce-staffing-save'); }
  return workforceStaffingState;
}
function readinessBand(score){
  return WORKFORCE_STAFFING_CATALOG.readinessBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||WORKFORCE_STAFFING_CATALOG.readinessBands.at(-1);
}
function roleById(id){ return WORKFORCE_STAFFING_CATALOG.roles.find(r=>r.id===id)||WORKFORCE_STAFFING_CATALOG.roles[0]; }
function trainingById(id){ return WORKFORCE_STAFFING_CATALOG.trainingPrograms.find(t=>t.id===id)||WORKFORCE_STAFFING_CATALOG.trainingPrograms[0]; }
function hiringById(id){ return WORKFORCE_STAFFING_CATALOG.hiringPools.find(h=>h.id===id)||WORKFORCE_STAFFING_CATALOG.hiringPools[0]; }
function shiftById(id){ return WORKFORCE_STAFFING_CATALOG.shiftPatterns.find(s=>s.id===id)||WORKFORCE_STAFFING_CATALOG.shiftPatterns[0]; }
function setShiftPattern(id='NORMAL_DAY'){
  loadWorkforceStaffing();
  workforceStaffingState.shiftPattern=shiftById(id).id;
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return shiftById(workforceStaffingState.shiftPattern);
}
function trainWorkforce(programId='SIM_REFRESHER',roleId='TOWER_CONTROLLER'){
  loadWorkforceStaffing();
  const program=trainingById(programId);
  const targets=workforceStaffingState.staff.filter(s=>s.role===roleId && s.status==='ACTIVE');
  for(const s of targets){
    s.skill=Math.min(100,Number(s.skill||60)+program.skillGain);
    s.fatigue=Math.max(0,Number(s.fatigue||0)-program.fatigueRelief);
  }
  workforceStaffingState.morale=Math.min(100,workforceStaffingState.morale+2);
  const item={id:`TRN-${String(Date.now()).slice(-6)}`,programId:program.id,roleId,cost:program.cost,trained:targets.length,at:new Date().toISOString()};
  workforceStaffingState.history.unshift({type:'TRAINING',...item});
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return item;
}
function hireStaff(poolId='LICENSED',roleId='GROUND_CONTROLLER'){
  loadWorkforceStaffing();
  const pool=hiringById(poolId);
  const item={id:`ATC-${String(Date.now()).slice(-5)}`,role:roleId,skill:pool.skill,fatigue:10,status:pool.readyIn>0?'TRAINING':'ACTIVE',readyIn:pool.readyIn,source:pool.id,cost:pool.cost};
  if(item.status==='ACTIVE') workforceStaffingState.staff.push(item); else workforceStaffingState.trainees.push(item);
  workforceStaffingState.history.unshift({type:'HIRE',...item,at:new Date().toISOString()});
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return item;
}
function raiseLaborEvent(id='SICK_LEAVE'){
  loadWorkforceStaffing();
  const tpl=WORKFORCE_STAFFING_CATALOG.laborEvents.find(e=>e.id===id)||WORKFORCE_STAFFING_CATALOG.laborEvents[0];
  const event={id:`LAB-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  if(tpl.id==='SICK_LEAVE'){
    const active=workforceStaffingState.staff.find(s=>s.status==='ACTIVE');
    if(active) active.status='SICK';
  }
  if(tpl.id==='OVERTIME_DISPUTE') workforceStaffingState.morale=Math.max(0,workforceStaffingState.morale-12);
  if(tpl.id==='UNION_WARNING') workforceStaffingState.laborRisk=Math.min(100,workforceStaffingState.laborRisk+15);
  if(tpl.id==='BURNOUT_ALERT') workforceStaffingState.staff.forEach(s=>s.fatigue=Math.min(100,Number(s.fatigue||0)+8));
  workforceStaffingState.events.unshift(event);
  workforceStaffingState.events=workforceStaffingState.events.slice(0,40);
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return event;
}
function closeLaborEvent(id,ok=true){
  loadWorkforceStaffing();
  const ev=workforceStaffingState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return ev||null;
}
function advanceTrainees(){
  const ready=[];
  for(const t of workforceStaffingState.trainees){
    t.readyIn=Math.max(0,Number(t.readyIn||0)-1);
    if(t.readyIn===0){ t.status='ACTIVE'; ready.push(t); }
  }
  workforceStaffingState.trainees=workforceStaffingState.trainees.filter(t=>t.status!=='ACTIVE');
  workforceStaffingState.staff.push(...ready);
  return ready;
}
function coverageReport(){
  const active=workforceStaffingState.staff.filter(s=>s.status==='ACTIVE');
  const result={};
  let shortage=0;
  for(const role of WORKFORCE_STAFFING_CATALOG.roles){
    const count=active.filter(s=>s.role===role.id).length;
    const missing=Math.max(0,role.minCoverage-count);
    result[role.id]={count,required:role.minCoverage,missing};
    shortage+=missing;
  }
  const avgSkill=active.length?Math.round(active.reduce((a,s)=>a+Number(s.skill||0),0)/active.length):0;
  const avgFatigue=active.length?Math.round(active.reduce((a,s)=>a+Number(s.fatigue||0),0)/active.length):100;
  return {roles:result,active:active.length,shortage,avgSkill,avgFatigue};
}
function evaluateWorkforceStaffing(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadWorkforceStaffing();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const shift=shiftById(workforceStaffingState.shiftPattern);
  advanceTrainees();
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const pressure=(statsObj.conflicts||0)*6+(statsObj.runwayIncursions||0)*10+(statsObj.denied||0)*3+(fail?10:0)+Math.max(0,75-Number(crisis.progress?.score||90))*0.1;
  for(const s of workforceStaffingState.staff){
    if(s.status==='ACTIVE'){
      s.fatigue=Math.max(0,Math.min(100,Number(s.fatigue||0)+shift.fatigue+pressure/8-Math.min(2,finalScore/1800)));
      if(s.fatigue>85) workforceStaffingState.laborRisk=Math.min(100,workforceStaffingState.laborRisk+1);
    }
    if(s.status==='SICK' && Math.random()<0.15) s.status='ACTIVE';
  }
  const coverage=coverageReport();
  const safetyScore=Number(safety.progress?.score||78);
  const cashPressure=Number(revenue.progress?.cash||320000)<0?10:0;
  const openEvents=workforceStaffingState.events.filter(e=>e.status==='OPEN');
  const moralePenalty=Math.max(0,70-workforceStaffingState.morale)*0.25;
  const riskPenalty=workforceStaffingState.laborRisk*0.22+openEvents.length*2+cashPressure;
  const readiness=Math.max(0,Math.min(100,Math.round(coverage.avgSkill*.42+(100-coverage.avgFatigue)*.28+Math.min(100,safetyScore)*.12+workforceStaffingState.morale*.12+Math.max(0,100-riskPenalty-moralePenalty)*.06-coverage.shortage*14)));
  workforceStaffingState.readinessScore=readiness;
  workforceStaffingState.status=readinessBand(readiness).id;
  if(readiness<55 && !openEvents.some(e=>e.eventId==='BURNOUT_ALERT')) raiseLaborEvent('BURNOUT_ALERT');
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),coverage,readinessScore:readiness,status:workforceStaffingState.status,morale:workforceStaffingState.morale,laborRisk:workforceStaffingState.laborRisk,shiftPattern:workforceStaffingState.shiftPattern,openEvents:workforceStaffingState.events.filter(e=>e.status==='OPEN').length,trainees:workforceStaffingState.trainees.length};
  workforceStaffingState.history.unshift(evaluation);
  workforceStaffingState.history=workforceStaffingState.history.slice(0,100);
  workforceStaffingState.lastEvaluation=evaluation;
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return {state:workforceStaffingState,evaluation};
}
function workforceStaffingProgress(){
  loadWorkforceStaffing();
  const coverage=coverageReport();
  return {score:workforceStaffingState.readinessScore,status:workforceStaffingState.status,morale:workforceStaffingState.morale,laborRisk:workforceStaffingState.laborRisk,activeStaff:coverage.active,shortage:coverage.shortage,avgFatigue:coverage.avgFatigue,trainees:workforceStaffingState.trainees.length,openEvents:workforceStaffingState.events.filter(e=>e.status==='OPEN').length,last:workforceStaffingState.lastEvaluation||null};
}
function renderWorkforceStaffingBoard(){
  try{
    const anchor=document.querySelector('#revenueManagementInline') || document.querySelector('#environmentSustainabilityInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#workforceStaffingInline'); if(old) old.remove();
    const p=workforceStaffingProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="workforceStaffingInline" class="airport-ops-board workforce-staffing-inline">
      <div class="airport-ops-head"><b>WORKFORCE</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PRONT.</small><b>${p.score}%</b></div>
        <div><small>EQUIPE</small><b>${p.activeStaff}</b></div>
        <div><small>FALTA</small><b>${p.shortage}</b></div>
        <div><small>FADIGA</small><b>${p.avgFatigue}</b></div>
        <div><small>MORAL</small><b>${p.morale}</b></div>
        <div><small>RISCO</small><b>${p.laborRisk}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'workforce-staffing-board'); }
}
function initializeWorkforceStaffing(){
  loadWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return workforceStaffingState;
}
function workforceStaffingStatus(){ loadWorkforceStaffing(); return {...workforceStaffingState,progress:workforceStaffingProgress(),catalog:WORKFORCE_STAFFING_CATALOG}; }
function workforceStaffingSelfCheck(){
  const issues=[];
  if(WORKFORCE_STAFFING_CATALOG.roles.length<6) issues.push('funções insuficientes');
  if(WORKFORCE_STAFFING_CATALOG.trainingPrograms.length<5) issues.push('treinamentos insuficientes');
  const shift=setShiftPattern('PEAK_OPS');
  const training=trainWorkforce('SIM_REFRESHER','TOWER_CONTROLLER');
  const hire=hireStaff('CONTRACTOR','GROUND_CONTROLLER');
  const res=evaluateWorkforceStaffing(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!shift.id || !training.id || !hire.id) issues.push('shift/training/hire inválido');
  if(!Number.isFinite(res.evaluation.readinessScore)) issues.push('readiness inválido');
  return {ok:issues.length===0,issues,roles:WORKFORCE_STAFFING_CATALOG.roles.length,training:WORKFORCE_STAFFING_CATALOG.trainingPrograms.length};
}
window.SKYWARD_WORKFORCE_STAFFING=Object.freeze({
  schema:1,
  catalog:WORKFORCE_STAFFING_CATALOG,
  load:loadWorkforceStaffing,
  save:saveWorkforceStaffing,
  init:initializeWorkforceStaffing,
  shift:setShiftPattern,
  training:trainWorkforce,
  hire:hireStaff,
  event:raiseLaborEvent,
  close:closeLaborEvent,
  evaluate:evaluateWorkforceStaffing,
  progress:workforceStaffingProgress,
  status:workforceStaffingStatus,
  board:renderWorkforceStaffingBoard,
  selfCheck:workforceStaffingSelfCheck
});
