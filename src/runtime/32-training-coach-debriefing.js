/* @skyward-module 32-training-coach-debriefing
 * ATC instructor coach, post-shift debriefing, adaptive study plan and personalized training recommendations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('32-training-coach-debriefing');
const TRAINING_COACH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f29',
  coachDomains:[
    {id:'SAFETY',name:'Segurança operacional',priority:5,signals:['conflicts','runwayIncursions','fail']},
    {id:'RUNWAY',name:'Pista e solo',priority:5,signals:['lineup','clearTakeoff','holdShort']},
    {id:'APPROACH',name:'Aproximação e vetoração',priority:4,signals:['vectorFinal','spacing','altitude']},
    {id:'WEATHER',name:'Meteorologia e mínimos',priority:4,signals:['rvr','crosswind','missedApproach']},
    {id:'NETWORK',name:'Slots e fluxo de rede',priority:3,signals:['slotCompliance','connectionsProtected','alternatePlan']},
    {id:'ECONOMY',name:'Eficiência e custo operacional',priority:3,signals:['delay','profit','denied']},
    {id:'CAREER',name:'Carreira e fadiga',priority:2,signals:['fatigue','rating','license']}
  ],
  debriefLevels:[
    {id:'EXCELLENT',name:'Excelente',minScore:90,tone:'reforço positivo'},
    {id:'PROFICIENT',name:'Proficiente',minScore:75,tone:'ajustes pontuais'},
    {id:'DEVELOPING',name:'Em desenvolvimento',minScore:55,tone:'treino guiado'},
    {id:'REMEDIAL',name:'Remediação necessária',minScore:0,tone:'revisão obrigatória'}
  ],
  studyCards:[
    {id:'HOLD_SHORT',domain:'RUNWAY',title:'Holding point antes da pista',minutes:8,drill:'Repita taxi + hold short antes de qualquer lineup.'},
    {id:'SEPARATION',domain:'SAFETY',title:'Separação mínima',minutes:10,drill:'Treine spacing antes de liberar pouso/decolagem.'},
    {id:'MISSED_APPROACH',domain:'WEATHER',title:'Aproximação perdida',minutes:12,drill:'Pratique ILS/RNAV com arremetida e holding.'},
    {id:'VECTORING',domain:'APPROACH',title:'Vetoração final',minutes:12,drill:'Ajuste heading, altitude e speed até estabilizar final.'},
    {id:'SLOT_FLOW',domain:'NETWORK',title:'CTOT/EDCT e conexões',minutes:15,drill:'Proteja banco de conexão sem estourar slot.'},
    {id:'DELAY_COST',domain:'ECONOMY',title:'Atraso e custo',minutes:10,drill:'Compare negar comando vs sequenciar com atraso menor.'},
    {id:'FATIGUE',domain:'CAREER',title:'Fadiga operacional',minutes:6,drill:'Revise quando aceitar turnos e quando descansar.'}
  ],
  adaptiveRules:[
    {id:'RULE_INCursion',condition:'runwayIncursions>0',domain:'RUNWAY',cards:['HOLD_SHORT','SEPARATION']},
    {id:'RULE_CONFLICT',condition:'conflicts>0',domain:'SAFETY',cards:['SEPARATION','VECTORING']},
    {id:'RULE_LOW_SCORE',condition:'finalScore<targetScore',domain:'SAFETY',cards:['SEPARATION','DELAY_COST']},
    {id:'RULE_WEATHER',condition:'weatherRisk>=70',domain:'WEATHER',cards:['MISSED_APPROACH']},
    {id:'RULE_SLOT',condition:'slotCompliance<0.75',domain:'NETWORK',cards:['SLOT_FLOW']},
    {id:'RULE_ECONOMY',condition:'economyProfit<0',domain:'ECONOMY',cards:['DELAY_COST']},
    {id:'RULE_FATIGUE',condition:'fatigue>70',domain:'CAREER',cards:['FATIGUE']}
  ],
  coachBadges:[
    {id:'SAFE_HANDS',name:'Mãos seguras',condition:'3 turnos sem conflito'},
    {id:'RUNWAY_MASTER',name:'Mestre de pista',condition:'5 turnos sem incursão'},
    {id:'IFR_STUDENT',name:'Aluno IFR',condition:'concluir treino meteorológico'},
    {id:'FLOW_PLANNER',name:'Planejador de fluxo',condition:'3 turnos com slot compliance alto'}
  ]
});
const TRAINING_COACH_KEY='skywardTrainingCoach_v1';
let trainingCoachState={schema:1,debriefs:[],studyPlan:[],badges:[],coachScore:0,lastDebrief:null,status:'INSTRUTOR_ATIVO'};
function loadTrainingCoach(){
  try{ const raw=localStorage?.getItem?.(TRAINING_COACH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) trainingCoachState={...trainingCoachState,...parsed}; } }catch(e){ safeLogError?.(e,'training-coach-load'); }
  return trainingCoachState;
}
function saveTrainingCoach(){
  try{ localStorage?.setItem?.(TRAINING_COACH_KEY,JSON.stringify(trainingCoachState)); }catch(e){ safeLogError?.(e,'training-coach-save'); }
  return trainingCoachState;
}
function coachLevel(score){
  return TRAINING_COACH_CATALOG.debriefLevels.slice().sort((a,b)=>b.minScore-a.minScore).find(l=>score>=l.minScore)||TRAINING_COACH_CATALOG.debriefLevels.at(-1);
}
function collectCoachSignals(finalScore=0,statsObj={},fail=false){
  const academy=window.SKYWARD_TRAINING_ACADEMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const weather=window.SKYWARD_WEATHER_OPS?.status?.() || {};
  const mission=academy.progress?.activeMission || {};
  return {
    finalScore:Number(finalScore||0),
    targetScore:Number(mission.targetScore||1000),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    denied:Number(statsObj.denied||0),
    landed:Number(statsObj.landed||0),
    departed:Number(statsObj.departed||0),
    fail:Boolean(fail),
    slotCompliance:Number(network.slotCompliance ?? 1),
    economyProfit:Number(economy.lastShift?.profit||0),
    fatigue:Number(career.fatigue||0),
    weatherRisk:Number(weather.risk||0),
    missionId:mission.id||'FREE_SHIFT',
    missionTrack:mission.track||'FREE'
  };
}
function evaluateRule(rule,signals){
  if(rule.id==='RULE_INCursion') return signals.runwayIncursions>0;
  if(rule.id==='RULE_CONFLICT') return signals.conflicts>0;
  if(rule.id==='RULE_LOW_SCORE') return signals.finalScore<signals.targetScore;
  if(rule.id==='RULE_WEATHER') return signals.weatherRisk>=70;
  if(rule.id==='RULE_SLOT') return signals.slotCompliance<.75;
  if(rule.id==='RULE_ECONOMY') return signals.economyProfit<0;
  if(rule.id==='RULE_FATIGUE') return signals.fatigue>70;
  return false;
}
function cardById(id){ return TRAINING_COACH_CATALOG.studyCards.find(c=>c.id===id); }
function buildStudyPlan(signals){
  const cards=[];
  for(const rule of TRAINING_COACH_CATALOG.adaptiveRules){
    if(evaluateRule(rule,signals)){
      for(const id of rule.cards){
        const card=cardById(id);
        if(card && !cards.some(c=>c.id===card.id)) cards.push({...card,reason:rule.id});
      }
    }
  }
  if(!cards.length) cards.push({...cardById('SEPARATION'),reason:'MAINTENANCE'});
  return cards.slice(0,5);
}
function buildCoachText(level,signals,studyPlan){
  const strengths=[];
  if(!signals.conflicts && !signals.runwayIncursions) strengths.push('segurança operacional preservada');
  if(signals.finalScore>=signals.targetScore) strengths.push('pontuação acima do objetivo da missão');
  if(signals.slotCompliance>=.9) strengths.push('boa disciplina de slot');
  const focus=studyPlan.map(c=>c.title).join(', ');
  return {
    summary:`Nível ${level.name}: ${level.tone}.`,
    strengths:strengths.length?strengths:['turno concluído com dados suficientes para treino'],
    focus:focus||'manutenção de separação e fraseologia operacional',
    nextAction:studyPlan[0]?.drill||'Repita uma missão curta mantendo separação antes de aumentar a dificuldade.'
  };
}
function evaluateTrainingCoach(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTrainingCoach();
  const signals=collectCoachSignals(finalScore,statsObj,fail);
  let raw=100;
  raw-=signals.conflicts*18;
  raw-=signals.runwayIncursions*24;
  raw-=signals.denied*4;
  if(signals.fail) raw-=25;
  if(signals.finalScore<signals.targetScore) raw-=15;
  if(signals.slotCompliance<.75) raw-=8;
  if(signals.economyProfit<0) raw-=5;
  if(signals.fatigue>70) raw-=6;
  const score=Math.max(0,Math.min(100,Math.round(raw)));
  const level=coachLevel(score);
  const studyPlan=buildStudyPlan(signals);
  const text=buildCoachText(level,signals,studyPlan);
  const debrief={at:new Date().toISOString(),build:BUILD,airport:airportCode||'---',score,level:level.id,missionId:signals.missionId,missionTrack:signals.missionTrack,signals,studyPlan:studyPlan.map(c=>c.id),text};
  trainingCoachState.debriefs.unshift(debrief);
  trainingCoachState.debriefs=trainingCoachState.debriefs.slice(0,60);
  trainingCoachState.studyPlan=studyPlan;
  trainingCoachState.lastDebrief=debrief;
  trainingCoachState.coachScore=Math.round(trainingCoachState.debriefs.slice(0,5).reduce((a,b)=>a+b.score,0)/Math.max(1,Math.min(5,trainingCoachState.debriefs.length)));
  awardCoachBadges();
  saveTrainingCoach();
  renderTrainingCoachBoard();
  return {state:trainingCoachState,debrief,studyPlan};
}
function awardCoachBadges(){
  const recent=trainingCoachState.debriefs;
  if(recent.slice(0,3).length===3 && recent.slice(0,3).every(d=>!d.signals.conflicts) && !trainingCoachState.badges.includes('SAFE_HANDS')) trainingCoachState.badges.push('SAFE_HANDS');
  if(recent.slice(0,5).length===5 && recent.slice(0,5).every(d=>!d.signals.runwayIncursions) && !trainingCoachState.badges.includes('RUNWAY_MASTER')) trainingCoachState.badges.push('RUNWAY_MASTER');
  if(recent.some(d=>d.studyPlan.includes('MISSED_APPROACH')) && !trainingCoachState.badges.includes('IFR_STUDENT')) trainingCoachState.badges.push('IFR_STUDENT');
  if(recent.filter(d=>d.signals.slotCompliance>=.9).length>=3 && !trainingCoachState.badges.includes('FLOW_PLANNER')) trainingCoachState.badges.push('FLOW_PLANNER');
  return trainingCoachState.badges;
}
function trainingCoachProgress(){
  loadTrainingCoach();
  const last=trainingCoachState.lastDebrief;
  return {coachScore:trainingCoachState.coachScore,status:trainingCoachState.status,badges:trainingCoachState.badges.length,studyCards:trainingCoachState.studyPlan.length,lastLevel:last?.level||'---',lastFocus:last?.text?.focus||'---'};
}
function renderTrainingCoachBoard(){
  try{
    const anchor=document.querySelector('#trainingAcademyInline') || document.querySelector('#publicOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#trainingCoachInline'); if(old) old.remove();
    const p=trainingCoachProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="trainingCoachInline" class="airport-ops-board training-coach-inline">
      <div class="airport-ops-head"><b>ATC COACH</b><span>${p.lastLevel}</span></div>
      <div class="airport-ops-grid">
        <div><small>COACH</small><b>${p.coachScore}</b></div>
        <div><small>ESTUDO</small><b>${p.studyCards}</b></div>
        <div><small>BADGES</small><b>${p.badges}</b></div>
        <div><small>FOCO</small><b>${String(p.lastFocus).slice(0,16)}</b></div>
        <div><small>DEBRIEFS</small><b>${trainingCoachState.debriefs.length}</b></div>
        <div><small>STATUS</small><b>ATIVO</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'training-coach-board'); }
}
function initializeTrainingCoach(){
  loadTrainingCoach();
  renderTrainingCoachBoard();
  return trainingCoachState;
}
function trainingCoachStatus(){ loadTrainingCoach(); return {...trainingCoachState,progress:trainingCoachProgress(),catalog:TRAINING_COACH_CATALOG}; }
function trainingCoachSelfCheck(){
  const issues=[];
  if(TRAINING_COACH_CATALOG.coachDomains.length<7) issues.push('domínios insuficientes');
  if(TRAINING_COACH_CATALOG.studyCards.length<7) issues.push('cards insuficientes');
  if(TRAINING_COACH_CATALOG.adaptiveRules.length<7) issues.push('regras adaptativas insuficientes');
  const res=evaluateTrainingCoach(300,{conflicts:1,runwayIncursions:1,denied:1},false,'SBSP');
  if(!res.studyPlan.some(c=>c.id==='HOLD_SHORT')) issues.push('plano não recomendou pista');
  if(res.debrief.score>=75) issues.push('score ruim ficou alto demais');
  return {ok:issues.length===0,issues,domains:TRAINING_COACH_CATALOG.coachDomains.length,cards:TRAINING_COACH_CATALOG.studyCards.length};
}
window.SKYWARD_TRAINING_COACH=Object.freeze({
  schema:1,
  catalog:TRAINING_COACH_CATALOG,
  load:loadTrainingCoach,
  save:saveTrainingCoach,
  init:initializeTrainingCoach,
  evaluate:evaluateTrainingCoach,
  progress:trainingCoachProgress,
  status:trainingCoachStatus,
  board:renderTrainingCoachBoard,
  selfCheck:trainingCoachSelfCheck
});
