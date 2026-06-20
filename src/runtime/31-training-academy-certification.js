/* @skyward-module 31-training-academy-certification
 * ATC training academy, guided missions, certification exams and structured scenario progression.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('31-training-academy-certification');
const TRAINING_ACADEMY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f28',
  tracks:[
    {id:'BASIC_TOWER',name:'Torre Básica',order:1,requiredRating:'STUDENT'},
    {id:'GROUND_CONTROL',name:'Controle de Solo',order:2,requiredRating:'LOCAL_GROUND'},
    {id:'APPROACH_RADAR',name:'Aproximação Radar',order:3,requiredRating:'APP_PROCEDURAL'},
    {id:'IFR_PROCEDURES',name:'Procedimentos IFR',order:4,requiredRating:'APP_RADAR'},
    {id:'EMERGENCY_OPS',name:'Emergências e Multiagência',order:5,requiredRating:'SUPERVISOR'},
    {id:'NETWORK_FLOW',name:'Network Flow e Slots',order:6,requiredRating:'SUPERVISOR'}
  ],
  missions:[
    {id:'TWR_01',track:'BASIC_TOWER',title:'Primeira decolagem segura',airport:'SBSP',durationMin:8,targetScore:600,objectives:['lineup','clearTakeoff','noIncursion']},
    {id:'TWR_02',track:'BASIC_TOWER',title:'Sequência de pouso simples',airport:'SBSP',durationMin:10,targetScore:900,objectives:['clearLanding','spacing','runwayVacated']},
    {id:'GND_01',track:'GROUND_CONTROL',title:'Taxi e holding point',airport:'SBGR',durationMin:12,targetScore:1100,objectives:['pushback','taxi','holdShort']},
    {id:'APP_01',track:'APPROACH_RADAR',title:'Vetoração final',airport:'SBGR',durationMin:15,targetScore:1600,objectives:['vectorFinal','altitude','speed']},
    {id:'IFR_01',track:'IFR_PROCEDURES',title:'ILS e aproximação perdida',airport:'SBGR',durationMin:18,targetScore:2200,objectives:['assignILS','missedApproach','hold']},
    {id:'EMR_01',track:'EMERGENCY_OPS',title:'Bird strike com ARFF',airport:'SBGR',durationMin:20,targetScore:2600,objectives:['declareEmergency','ARFF','closeRunway']},
    {id:'NET_01',track:'NETWORK_FLOW',title:'Slots e conexão protegida',airport:'KATL',durationMin:22,targetScore:3000,objectives:['slotCompliance','connectionBank','alternatePlan']}
  ],
  exams:[
    {id:'EXAM_TOWER_LOCAL',name:'Certificação Torre Local',track:'BASIC_TOWER',minScore:1800,maxErrors:2,awards:'LOCAL_TOWER'},
    {id:'EXAM_GROUND',name:'Certificação Solo',track:'GROUND_CONTROL',minScore:2200,maxErrors:2,awards:'GROUND_CERTIFIED'},
    {id:'EXAM_APPROACH',name:'Certificação Aproximação',track:'APPROACH_RADAR',minScore:3200,maxErrors:3,awards:'APPROACH_RATED'},
    {id:'EXAM_SUPERVISOR',name:'Certificação Supervisor',track:'EMERGENCY_OPS',minScore:4200,maxErrors:3,awards:'SENIOR_CONTROLLER'}
  ],
  rubric:[
    {id:'SAFETY',name:'Segurança',weight:40},
    {id:'PROCEDURE',name:'Procedimento correto',weight:25},
    {id:'EFFICIENCY',name:'Eficiência',weight:20},
    {id:'COMMUNICATION',name:'Comunicação/fluxo',weight:15}
  ],
  remediation:[
    {id:'RUNWAY_INCURSION',message:'Revise holding point e autorização de pista.'},
    {id:'LOW_SCORE',message:'Repita missão com foco em separação e economia de comandos.'},
    {id:'WEATHER_RISK',message:'Revise RVR, teto, vento cruzado e aproximação perdida.'},
    {id:'SLOT_MISS',message:'Revise CTOT/EDCT, bancos de conexão e alternados.'}
  ]
});
const TRAINING_ACADEMY_KEY='skywardTrainingAcademy_v1';
let trainingAcademyState={schema:1,activeMissionId:'TWR_01',activeExamId:null,completedMissions:[],passedExams:[],attempts:[],academyScore:0,status:'CADETE',lastEvaluation:null};
function loadTrainingAcademy(){
  try{ const raw=localStorage?.getItem?.(TRAINING_ACADEMY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) trainingAcademyState={...trainingAcademyState,...parsed}; } }catch(e){ safeLogError?.(e,'training-academy-load'); }
  return trainingAcademyState;
}
function saveTrainingAcademy(){
  try{ localStorage?.setItem?.(TRAINING_ACADEMY_KEY,JSON.stringify(trainingAcademyState)); }catch(e){ safeLogError?.(e,'training-academy-save'); }
  return trainingAcademyState;
}
function missionById(id){ return TRAINING_ACADEMY_CATALOG.missions.find(m=>m.id===id)||TRAINING_ACADEMY_CATALOG.missions[0]; }
function examById(id){ return TRAINING_ACADEMY_CATALOG.exams.find(e=>e.id===id)||null; }
function activeTrainingMission(){ loadTrainingAcademy(); return missionById(trainingAcademyState.activeMissionId); }
function startTrainingMission(id='TWR_01'){
  loadTrainingAcademy();
  const mission=missionById(id);
  trainingAcademyState.activeMissionId=mission.id;
  trainingAcademyState.activeExamId=null;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return mission;
}
function startCertificationExam(id='EXAM_TOWER_LOCAL'){
  loadTrainingAcademy();
  const exam=examById(id);
  if(!exam) throw new Error('Exame inexistente');
  trainingAcademyState.activeExamId=exam.id;
  const first=TRAINING_ACADEMY_CATALOG.missions.find(m=>m.track===exam.track) || TRAINING_ACADEMY_CATALOG.missions[0];
  trainingAcademyState.activeMissionId=first.id;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return {exam,mission:first};
}
function objectiveScore(mission,statsObj={},finalScore=0){
  const max=mission.objectives.length||1;
  let hit=0;
  for(const obj of mission.objectives){
    if(obj==='noIncursion' && !(statsObj.runwayIncursions||0)) hit++;
    else if(obj==='spacing' && !(statsObj.conflicts||0)) hit++;
    else if(obj==='runwayVacated' && (statsObj.landed||0)>0) hit++;
    else if(obj==='slotCompliance' && ((window.SKYWARD_NETWORK_FLOW?.status?.().slotCompliance||1)>=.75)) hit++;
    else if(obj==='connectionBank' && ((window.SKYWARD_NETWORK_FLOW?.status?.().connectionsProtected||0)>=0)) hit++;
    else if(obj==='ARFF' && ((window.SKYWARD_INCIDENTS?.state?.().agencies?.ARFF)||true)) hit++;
    else if(finalScore>=mission.targetScore*.35) hit++;
  }
  return Math.round(hit/max*100);
}
function rubricScore(finalScore=0,statsObj={},fail=false){
  const safety=Math.max(0,100-(statsObj.conflicts||0)*18-(statsObj.runwayIncursions||0)*25-(fail?30:0));
  const procedure=Math.max(0,80+(statsObj.landed||0)*2+(statsObj.departed||0)*2-(statsObj.denied||0)*6);
  const efficiency=Math.max(0,Math.min(100,50+Math.round(finalScore/80)-(statsObj.denied||0)*4));
  const communication=Math.max(0,Math.min(100,70+(statsObj.commands||0>0?10:0)-(statsObj.denied||0)*3));
  const weighted=Math.round((safety*.40)+(procedure*.25)+(efficiency*.20)+(communication*.15));
  return {safety,procedure,efficiency,communication,weighted};
}
function remediationFor(statsObj={},finalScore=0,mission=null){
  if(statsObj.runwayIncursions>0) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='RUNWAY_INCURSION');
  if(mission?.track==='NETWORK_FLOW' && (window.SKYWARD_NETWORK_FLOW?.status?.().slotCompliance||1)<.75) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='SLOT_MISS');
  if(finalScore<(mission?.targetScore||1000)) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='LOW_SCORE');
  return null;
}
function evaluateTrainingShift(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTrainingAcademy();
  const mission=activeTrainingMission();
  const rub=rubricScore(finalScore,statsObj,fail);
  const obj=objectiveScore(mission,statsObj,finalScore);
  const passed=finalScore>=mission.targetScore && rub.weighted>=70 && obj>=60 && !fail;
  const remediation=passed?null:remediationFor(statsObj,finalScore,mission);
  const attempt={at:new Date().toISOString(),build:BUILD,missionId:mission.id,track:mission.track,airport:airportCode||mission.airport,finalScore:Math.round(finalScore||0),rubric:rub,objectiveScore:obj,passed,remediation:remediation?.message||'',examId:trainingAcademyState.activeExamId||null};
  trainingAcademyState.attempts.unshift(attempt);
  trainingAcademyState.attempts=trainingAcademyState.attempts.slice(0,60);
  if(passed && !trainingAcademyState.completedMissions.includes(mission.id)) trainingAcademyState.completedMissions.push(mission.id);
  const exam=examById(trainingAcademyState.activeExamId);
  if(exam){
    const errors=(statsObj.conflicts||0)+(statsObj.runwayIncursions||0)+(statsObj.denied||0);
    const examPassed=finalScore>=exam.minScore && errors<=exam.maxErrors && passed;
    attempt.examPassed=examPassed;
    if(examPassed && !trainingAcademyState.passedExams.includes(exam.id)) trainingAcademyState.passedExams.push(exam.id);
  }
  trainingAcademyState.academyScore=Math.round(trainingAcademyState.completedMissions.length*1000 + trainingAcademyState.passedExams.length*2500 + Math.max(0,rub.weighted*10));
  trainingAcademyState.status=trainingAcademyState.passedExams.length>=3?'INSTRUTOR':trainingAcademyState.completedMissions.length>=5?'CONTROLADOR_ACADEMIA':trainingAcademyState.completedMissions.length>=2?'ALUNO_AVANCADO':'CADETE';
  const next=TRAINING_ACADEMY_CATALOG.missions.find(m=>!trainingAcademyState.completedMissions.includes(m.id)) || mission;
  trainingAcademyState.activeMissionId=next.id;
  trainingAcademyState.lastEvaluation=attempt;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return {state:trainingAcademyState,attempt,nextMission:next};
}
function trainingAcademyProgress(){
  loadTrainingAcademy();
  const total=TRAINING_ACADEMY_CATALOG.missions.length;
  const completed=trainingAcademyState.completedMissions.length;
  const exams=trainingAcademyState.passedExams.length;
  return {completed,total,percent:Math.round(completed/total*100),exams,academyScore:trainingAcademyState.academyScore,status:trainingAcademyState.status,activeMission:activeTrainingMission()};
}
function renderTrainingAcademyBoard(){
  try{
    const anchor=document.querySelector('#publicOpsInline') || document.querySelector('#postPublishHealthInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#trainingAcademyInline'); if(old) old.remove();
    const p=trainingAcademyProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="trainingAcademyInline" class="airport-ops-board training-academy-inline">
      <div class="airport-ops-head"><b>ATC ACADEMY</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>MISSÃO</small><b>${p.activeMission.id}</b></div>
        <div><small>PROGRESSO</small><b>${p.completed}/${p.total}</b></div>
        <div><small>ACADEMY</small><b>${p.academyScore}</b></div>
        <div><small>EXAMES</small><b>${p.exams}</b></div>
        <div><small>ÚLTIMA</small><b>${trainingAcademyState.lastEvaluation?.passed?'APROVADO':'TREINO'}</b></div>
        <div><small>TRILHA</small><b>${p.activeMission.track}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'training-academy-board'); }
}
function initializeTrainingAcademy(){
  loadTrainingAcademy();
  if(!trainingAcademyState.activeMissionId) trainingAcademyState.activeMissionId='TWR_01';
  renderTrainingAcademyBoard();
  return trainingAcademyState;
}
function trainingAcademyStatus(){ loadTrainingAcademy(); return {...trainingAcademyState,progress:trainingAcademyProgress(),catalog:TRAINING_ACADEMY_CATALOG}; }
function trainingAcademySelfCheck(){
  const issues=[];
  if(TRAINING_ACADEMY_CATALOG.tracks.length<6) issues.push('trilhas insuficientes');
  if(TRAINING_ACADEMY_CATALOG.missions.length<7) issues.push('missões insuficientes');
  if(TRAINING_ACADEMY_CATALOG.exams.length<4) issues.push('exames insuficientes');
  const mission=startTrainingMission('TWR_01');
  const res=evaluateTrainingShift(1200,{landed:1,departed:1,conflicts:0,runwayIncursions:0,denied:0,commands:5},false,'SBSP');
  if(!res.attempt.passed) issues.push('missão básica não aprova cenário saudável');
  return {ok:issues.length===0,issues,tracks:TRAINING_ACADEMY_CATALOG.tracks.length,missions:TRAINING_ACADEMY_CATALOG.missions.length,exams:TRAINING_ACADEMY_CATALOG.exams.length};
}
window.SKYWARD_TRAINING_ACADEMY=Object.freeze({
  schema:1,
  catalog:TRAINING_ACADEMY_CATALOG,
  load:loadTrainingAcademy,
  save:saveTrainingAcademy,
  init:initializeTrainingAcademy,
  start:startTrainingMission,
  exam:startCertificationExam,
  evaluate:evaluateTrainingShift,
  progress:trainingAcademyProgress,
  status:trainingAcademyStatus,
  board:renderTrainingAcademyBoard,
  selfCheck:trainingAcademySelfCheck
});
