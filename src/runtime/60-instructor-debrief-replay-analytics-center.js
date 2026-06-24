/* @skyward-module 60-instructor-debrief-replay-analytics-center
 * Instructor debrief, replay analytics and training feedback center for post-mission review, error taxonomy, strengths and next drills.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('60-instructor-debrief-replay-analytics-center');
const INSTRUCTOR_DEBRIEF_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f57',
  reviewAreas:[
    {id:'SEPARATION',name:'Separação',weight:18,target:90},
    {id:'RUNWAY_SAFETY',name:'Segurança de pista',weight:18,target:94},
    {id:'RADIO',name:'Fraseologia rádio',weight:14,target:88},
    {id:'PACE',name:'Ritmo e workload',weight:13,target:84},
    {id:'WEATHER',name:'Leitura meteorológica',weight:10,target:82},
    {id:'EMERGENCY',name:'Resposta emergencial',weight:10,target:84},
    {id:'MISSION_OBJECTIVES',name:'Objetivos de missão',weight:10,target:86},
    {id:'STABILITY',name:'Estabilidade da sessão',weight:7,target:90}
  ],
  errorTaxonomy:[
    {id:'LOSS_SEPARATION',name:'Perda de separação',severity:34,area:'SEPARATION'},
    {id:'RUNWAY_INCURSION',name:'Incursão de pista',severity:38,area:'RUNWAY_SAFETY'},
    {id:'DENIED_TOO_MANY',name:'Negativas em excesso',severity:16,area:'PACE'},
    {id:'RADIO_READBACK',name:'Readback/colação incompleta',severity:18,area:'RADIO'},
    {id:'WORKLOAD_SATURATION',name:'Workload saturado',severity:22,area:'PACE'},
    {id:'WEATHER_MISREAD',name:'Risco meteorológico mal antecipado',severity:20,area:'WEATHER'},
    {id:'EMERGENCY_DELAY',name:'Demora na resposta emergencial',severity:24,area:'EMERGENCY'},
    {id:'SAFE_MODE_TRIGGER',name:'Modo seguro acionado',severity:30,area:'STABILITY'}
  ],
  strengthTemplates:[
    {id:'CALM_FLOW',name:'Fluxo calmo e organizado'},
    {id:'GOOD_SPACING',name:'Boa separação entre aeronaves'},
    {id:'RADIO_CLEAR',name:'Comunicação clara'},
    {id:'MISSION_DISCIPLINE',name:'Disciplina nos objetivos'},
    {id:'MOBILE_CONTROL',name:'Boa condução no mobile'},
    {id:'SAFE_RECOVERY',name:'Recuperação segura de cenário'}
  ],
  trainingDrills:[
    {id:'DRILL_SEPARATION_BASIC',name:'Separação básica',area:'SEPARATION',minutes:8},
    {id:'DRILL_RUNWAY_SCAN',name:'Varredura de pista',area:'RUNWAY_SAFETY',minutes:8},
    {id:'DRILL_RADIO_READBACK',name:'Readback e fraseologia',area:'RADIO',minutes:10},
    {id:'DRILL_WORKLOAD_PACE',name:'Ritmo e prioridade',area:'PACE',minutes:8},
    {id:'DRILL_WEATHER_DIVERSION',name:'Desvio meteorológico',area:'WEATHER',minutes:12},
    {id:'DRILL_EMERGENCY_FIRST90',name:'Primeiros 90s da emergência',area:'EMERGENCY',minutes:12},
    {id:'DRILL_MOBILE_SAFE',name:'Mobile seguro',area:'STABILITY',minutes:6}
  ],
  feedbackBands:[
    {id:'ELITE',min:92,name:'Debrief de elite'},
    {id:'APPROVED',min:80,name:'Aprovado com bom controle'},
    {id:'TRAINING_NEEDED',min:62,name:'Treino recomendado'},
    {id:'REMEDIAL',min:0,name:'Revisão obrigatória'}
  ]
});
const INSTRUCTOR_DEBRIEF_KEY='skywardInstructorDebrief_v1';
let debriefState={schema:1,debriefScore:0,status:'TRAINING_NEEDED',weaknesses:[],strengths:[],recommendedDrills:[],replayNotes:[],nextGoal:'Concluir uma missão sem conflitos.',history:[],lastDebrief:null};
function loadInstructorDebrief(){try{const raw=localStorage?.getItem?.(INSTRUCTOR_DEBRIEF_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)debriefState={...debriefState,...parsed};}}catch(e){safeLogError?.(e,'debrief-load');}return debriefState;}
function saveInstructorDebrief(){try{localStorage?.setItem?.(INSTRUCTOR_DEBRIEF_KEY,JSON.stringify(debriefState));}catch(e){safeLogError?.(e,'debrief-save');}return debriefState;}
function feedbackBand(score){return INSTRUCTOR_DEBRIEF_CATALOG.feedbackBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||INSTRUCTOR_DEBRIEF_CATALOG.feedbackBands.at(-1);}
function drillForArea(area){return INSTRUCTOR_DEBRIEF_CATALOG.trainingDrills.find(d=>d.area===area)||INSTRUCTOR_DEBRIEF_CATALOG.trainingDrills[0];}
function errorById(id){return INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.find(e=>e.id===id)||INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy[0];}
function buildErrorList(statsObj={},fail=false){
  const errors=[];
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  if(conflicts>0) errors.push({...errorById('LOSS_SEPARATION'),count:conflicts});
  if(incursions>0) errors.push({...errorById('RUNWAY_INCURSION'),count:incursions});
  if(denied>1) errors.push({...errorById('DENIED_TOO_MANY'),count:denied});
  if(Number(radio.score||radio.accuracy||90)<75) errors.push({...errorById('RADIO_READBACK'),count:1});
  if(Number(pace.workload||0)>=80) errors.push({...errorById('WORKLOAD_SATURATION'),count:1});
  if(Number(stability.safeModeCount||0)>0||fail) errors.push({...errorById('SAFE_MODE_TRIGGER'),count:Number(stability.safeModeCount||1)});
  return errors;
}
function buildStrengthList(missionEval={},statsObj={}){
  const strengths=[];
  const grade=String(missionEval.grade||'D');
  const score=Number(missionEval.missionScore||0);
  const conflicts=Number(statsObj.conflicts||0);
  const denied=Number(statsObj.denied||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  if(conflicts===0) strengths.push({id:'GOOD_SPACING',name:'Boa separação entre aeronaves'});
  if(denied<=1) strengths.push({id:'CALM_FLOW',name:'Fluxo calmo e organizado'});
  if(Number(radio.score||radio.accuracy||88)>=82) strengths.push({id:'RADIO_CLEAR',name:'Comunicação clara'});
  if(score>=80||grade==='A'||grade==='S') strengths.push({id:'MISSION_DISCIPLINE',name:'Disciplina nos objetivos'});
  if(Number(stability.safeModeCount||0)===0) strengths.push({id:'SAFE_RECOVERY',name:'Sessão estável sem modo seguro'});
  return strengths.slice(0,5);
}
function computeAreaScores(errors,missionEval={},statsObj={}){
  const scores={};
  for(const area of INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas) scores[area.id]=100;
  for(const err of errors){
    scores[err.area]=Math.max(0,Number(scores[err.area]||100)-Number(err.severity||0)*Math.max(1,Number(err.count||1))*.7);
  }
  const missionScore=Number(missionEval.missionScore||0);
  scores.MISSION_OBJECTIVES=Math.max(0,Math.min(100,missionScore||scores.MISSION_OBJECTIVES));
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  scores.STABILITY=Math.max(0,Math.min(100,Number(stability.score||stability.sessionHealth||90)));
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  scores.PACE=Math.min(scores.PACE,Math.max(0,100-Number(pace.workload||35)*.45));
  return scores;
}
function generateReplayNotes(errors,strengths,missionEval={}){
  const notes=[];
  notes.push(`Missão: ${missionEval.missionName||missionEval.templateId||'treino'} — nota ${missionEval.grade||'D'}.`);
  if(strengths[0]) notes.push(`Ponto forte: ${strengths[0].name}.`);
  if(errors[0]) notes.push(`Revisar prioridade: ${errors[0].name}.`);
  notes.push(`Seed de replay: ${missionEval.seed||'sem seed'}.`);
  return notes;
}
function evaluateInstructorDebrief(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInstructorDebrief();
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const campaign=window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||{};
  const scenarioStatus=window.SKYWARD_SCENARIO_MISSION?.status?.()||{};
  const lastMission=scenario.last||scenarioStatus.lastEvaluation||{};
  const missionEval={...lastMission,missionScore:Number(lastMission.missionScore||scenario.score||0),grade:String(lastMission.grade||scenario.grade||'D'),templateId:String(lastMission.templateId||scenario.activeMission?.templateId||'MOBILE_TRAINING'),missionName:String(lastMission.missionName||scenario.activeMission?.name||'Missão')};
  const errors=buildErrorList(statsObj,fail);
  const strengths=buildStrengthList(missionEval,statsObj);
  const areaScores=computeAreaScores(errors,missionEval,statsObj);
  const weighted=Math.round(INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.reduce((sum,a)=>sum+Number(areaScores[a.id]||0)*Number(a.weight||0),0)/100);
  const penalty=errors.reduce((sum,e)=>sum+Number(e.severity||0)*Math.max(1,Number(e.count||1)),0)*.18;
  const bonus=strengths.length*2+Math.min(6,Number(campaign.achievements||0));
  const debriefScore=Math.max(0,Math.min(100,Math.round(weighted-penalty+bonus+Math.min(6,Number(finalScore||0)/600))));
  const band=feedbackBand(debriefScore);
  const weaknesses=errors.slice().sort((a,b)=>(b.severity*b.count)-(a.severity*a.count)).slice(0,4);
  if(!weaknesses.length && debriefScore<86) weaknesses.push({...errorById('WORKLOAD_SATURATION'),count:1,synthetic:true});
  const recommendedDrills=(weaknesses.length?weaknesses.map(w=>drillForArea(w.area)):[drillForArea('SEPARATION'),drillForArea('RADIO')]).filter((d,i,arr)=>arr.findIndex(x=>x.id===d.id)===i).slice(0,3);
  const nextGoal=weaknesses[0] ? `Reduzir ${weaknesses[0].name.toLowerCase()} na próxima missão.` : 'Manter missão sem conflitos e buscar nota S.';
  const replayNotes=generateReplayNotes(weaknesses,strengths,missionEval);
  debriefState.debriefScore=debriefScore;
  debriefState.status=band.id;
  debriefState.weaknesses=weaknesses;
  debriefState.strengths=strengths;
  debriefState.recommendedDrills=recommendedDrills;
  debriefState.replayNotes=replayNotes;
  debriefState.nextGoal=nextGoal;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',debriefScore,status:band.id,statusName:band.name,mainWeakness:weaknesses[0]?.name||'Sem falha crítica',topStrength:strengths[0]?.name||'Fluxo controlado',recommendedDrill:recommendedDrills[0]?.name||'Separação básica',nextGoal,replayNotes,areaScores,errors:weaknesses.length,strengths:strengths.length,missionGrade:missionEval.grade,missionScore:missionEval.missionScore,finalScore:Math.round(finalScore||0)};
  debriefState.lastDebrief=evaluation;
  debriefState.history.unshift(evaluation);
  debriefState.history=debriefState.history.slice(0,100);
  saveInstructorDebrief();
  renderInstructorDebriefBoard();
  return {state:debriefState,evaluation};
}
function instructorDebriefProgress(){
  loadInstructorDebrief();
  return {score:debriefState.debriefScore,status:debriefState.status,weaknesses:debriefState.weaknesses.length,strengths:debriefState.strengths.length,recommendedDrill:debriefState.recommendedDrills[0]?.name||'---',nextGoal:debriefState.nextGoal,last:debriefState.lastDebrief||null};
}
function renderInstructorDebriefBoard(){
  try{
    const anchor=document.querySelector('#campaignProgressionInline') || document.querySelector('#scenarioMissionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#instructorDebriefInline'); if(old) old.remove();
    const p=instructorDebriefProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="instructorDebriefInline" class="airport-ops-board instructor-debrief-inline">
      <div class="airport-ops-head"><b>DEBRIEF OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>FORTE</small><b>${p.strengths}</b></div>
        <div><small>FALHAS</small><b>${p.weaknesses}</b></div>
        <div><small>TREINO</small><b>${p.recommendedDrill.split(' ')[0]}</b></div>
        <div><small>META</small><b>${p.nextGoal?'OK':'---'}</b></div>
        <div><small>HIST.</small><b>${debriefState.history.length}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'instructor-debrief-board');}
}
function initializeInstructorDebrief(){
  loadInstructorDebrief();
  renderInstructorDebriefBoard();
  return debriefState;
}
function instructorDebriefStatus(){loadInstructorDebrief();return {...debriefState,progress:instructorDebriefProgress(),catalog:INSTRUCTOR_DEBRIEF_CATALOG};}
function instructorDebriefSelfCheck(){
  const issues=[];
  if(INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.length<8) issues.push('áreas insuficientes');
  if(INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.length<8) issues.push('erros insuficientes');
  const res=evaluateInstructorDebrief(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!Number.isFinite(res.evaluation.debriefScore)) issues.push('score inválido');
  if(!res.evaluation.recommendedDrill) issues.push('treino ausente');
  return {ok:issues.length===0,issues,areas:INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.length,errors:INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.length};
}
window.SKYWARD_INSTRUCTOR_DEBRIEF=Object.freeze({
  schema:1,
  catalog:INSTRUCTOR_DEBRIEF_CATALOG,
  load:loadInstructorDebrief,
  save:saveInstructorDebrief,
  init:initializeInstructorDebrief,
  evaluate:evaluateInstructorDebrief,
  progress:instructorDebriefProgress,
  status:instructorDebriefStatus,
  board:renderInstructorDebriefBoard,
  selfCheck:instructorDebriefSelfCheck
});
