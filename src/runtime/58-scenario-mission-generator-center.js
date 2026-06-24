/* @skyward-module 58-scenario-mission-generator-center
 * Scenario Designer and Mission Generator Center for mission templates, scheduled events, traffic/weather packs, objectives, grading and replay seeds.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('58-scenario-mission-generator-center');
const SCENARIO_MISSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f55',
  missionTemplates:[
    {id:'MOBILE_TRAINING',name:'Treino Mobile Seguro',difficulty:2,durationMin:8,traffic:'LOW',weather:'VFR',profile:'SAFE_MOBILE'},
    {id:'PEAK_HOUR',name:'Hora Pico Controlada',difficulty:4,durationMin:12,traffic:'MEDIUM',weather:'VFR',profile:'BALANCED'},
    {id:'STORM_DIVERSION',name:'Desvio por Tempestade',difficulty:6,durationMin:14,traffic:'MEDIUM',weather:'STORM',profile:'LIVE_OPS_GUARD'},
    {id:'RADIO_DISCIPLINE',name:'Fraseologia Rigorosa',difficulty:5,durationMin:10,traffic:'LOW',weather:'MVFR',profile:'TRAINING_EASY'},
    {id:'EMERGENCY_RUNWAY',name:'Emergência em Pista',difficulty:7,durationMin:15,traffic:'MEDIUM',weather:'IFR',profile:'LIVE_OPS_GUARD'},
    {id:'CARGO_NIGHT',name:'Operação Cargueira Noturna',difficulty:5,durationMin:12,traffic:'CARGO',weather:'NIGHT_VFR',profile:'BALANCED'},
    {id:'REGIONAL_NETWORK',name:'Rede Regional Multi-Hub',difficulty:6,durationMin:16,traffic:'NETWORK',weather:'MIXED',profile:'REALISTIC_DESKTOP'}
  ],
  eventTypes:[
    {id:'ARRIVAL_WAVE',name:'Onda de chegadas',severity:14},
    {id:'DEPARTURE_BANK',name:'Banco de decolagens',severity:16},
    {id:'WEATHER_CELL',name:'Célula meteorológica',severity:22},
    {id:'RADIO_CONGESTION',name:'Congestionamento rádio',severity:18},
    {id:'RUNWAY_INSPECTION',name:'Inspeção de pista',severity:24},
    {id:'MEDICAL_PRIORITY',name:'Prioridade médica',severity:26},
    {id:'LOW_VISIBILITY',name:'Baixa visibilidade',severity:28},
    {id:'CARGO_PRIORITY',name:'Prioridade cargueira',severity:16}
  ],
  trafficPacks:[
    {id:'LOW',name:'Baixo',aircraft:3,spacingSec:48},
    {id:'MEDIUM',name:'Médio',aircraft:5,spacingSec:36},
    {id:'HIGH',name:'Alto',aircraft:7,spacingSec:28},
    {id:'CARGO',name:'Cargueiro',aircraft:4,spacingSec:42},
    {id:'NETWORK',name:'Multi-Hub',aircraft:6,spacingSec:34}
  ],
  weatherPacks:[
    {id:'VFR',name:'Visual',visibility:10,wind:8,risk:6},
    {id:'MVFR',name:'Marginal',visibility:6,wind:14,risk:14},
    {id:'IFR',name:'Instrumento',visibility:3,wind:18,risk:24},
    {id:'STORM',name:'Tempestade',visibility:2,wind:28,risk:34},
    {id:'NIGHT_VFR',name:'Noite visual',visibility:8,wind:10,risk:12},
    {id:'MIXED',name:'Misto regional',visibility:5,wind:18,risk:22}
  ],
  objectiveTypes:[
    {id:'NO_CONFLICTS',name:'Sem conflitos',points:180},
    {id:'LOW_DENIALS',name:'Poucas negativas',points:120},
    {id:'RADIO_ACCURACY',name:'Fraseologia correta',points:140},
    {id:'PACE_CONTROL',name:'Controle de ritmo',points:100},
    {id:'SAFE_MODE_ZERO',name:'Sem modo seguro',points:160},
    {id:'MISSION_COMPLETION',name:'Missão concluída',points:200}
  ],
  gradeBands:[
    {id:'S',min:92,name:'Excelente'},
    {id:'A',min:82,name:'Ótimo'},
    {id:'B',min:70,name:'Bom'},
    {id:'C',min:55,name:'Regular'},
    {id:'D',min:0,name:'Repetir treino'}
  ]
});
const SCENARIO_MISSION_KEY='skywardScenarioMission_v1';
let scenarioMissionState={schema:1,activeMission:null,missionHistory:[],generatedEvents:[],missionScore:0,grade:'D',objectives:[],lastEvaluation:null};
function loadScenarioMission(){try{const raw=localStorage?.getItem?.(SCENARIO_MISSION_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)scenarioMissionState={...scenarioMissionState,...parsed};}}catch(e){safeLogError?.(e,'scenario-mission-load');}return scenarioMissionState;}
function saveScenarioMission(){try{localStorage?.setItem?.(SCENARIO_MISSION_KEY,JSON.stringify(scenarioMissionState));}catch(e){safeLogError?.(e,'scenario-mission-save');}return scenarioMissionState;}
function templateById(id){return SCENARIO_MISSION_CATALOG.missionTemplates.find(t=>t.id===id)||SCENARIO_MISSION_CATALOG.missionTemplates[0];}
function trafficById(id){return SCENARIO_MISSION_CATALOG.trafficPacks.find(t=>t.id===id)||SCENARIO_MISSION_CATALOG.trafficPacks[0];}
function weatherById(id){return SCENARIO_MISSION_CATALOG.weatherPacks.find(w=>w.id===id)||SCENARIO_MISSION_CATALOG.weatherPacks[0];}
function gradeFor(score){return SCENARIO_MISSION_CATALOG.gradeBands.slice().sort((a,b)=>b.min-a.min).find(g=>score>=g.min)||SCENARIO_MISSION_CATALOG.gradeBands.at(-1);}
function seedFromTemplate(id){let h=0; const s=String(id||'MISSION')+String(BUILD||''); for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0;} return h;}
function generateScenarioEvents(template){
  const traffic=trafficById(template.traffic);
  const weather=weatherById(template.weather);
  const count=Math.max(2,Math.min(6,Math.round(template.difficulty/2)+2));
  const pool=SCENARIO_MISSION_CATALOG.eventTypes.slice().sort((a,b)=>Math.abs(a.severity-weather.risk)-Math.abs(b.severity-weather.risk));
  return pool.slice(0,count).map((e,idx)=>({id:`EVT-${template.id}-${idx+1}`,type:e.id,name:e.name,severity:e.severity,minute:Math.max(1,Math.round((template.durationMin/(count+1))*(idx+1))),status:'SCHEDULED',traffic:traffic.id,weather:weather.id}));
}
function defaultObjectives(template){
  const ids=['MISSION_COMPLETION','NO_CONFLICTS','LOW_DENIALS','PACE_CONTROL','SAFE_MODE_ZERO'];
  if(template.id==='RADIO_DISCIPLINE') ids.push('RADIO_ACCURACY');
  return ids.map(id=>SCENARIO_MISSION_CATALOG.objectiveTypes.find(o=>o.id===id)).filter(Boolean).map(o=>({...o,status:'PENDING'}));
}
function startScenarioMission(id='MOBILE_TRAINING'){
  loadScenarioMission();
  const template=templateById(id);
  const traffic=trafficById(template.traffic);
  const weather=weatherById(template.weather);
  const mission={id:`MIS-${String(Date.now()).slice(-6)}`,templateId:template.id,name:template.name,difficulty:template.difficulty,durationMin:template.durationMin,traffic,weather,profile:template.profile,seed:seedFromTemplate(template.id),status:'ACTIVE',startedAt:new Date().toISOString(),build:BUILD};
  scenarioMissionState.activeMission=mission;
  scenarioMissionState.generatedEvents=generateScenarioEvents(template);
  scenarioMissionState.objectives=defaultObjectives(template);
  scenarioMissionState.missionScore=0;
  scenarioMissionState.grade='D';
  try{window.SKYWARD_LIVE_OPS_CONFIG?.setProfile?.(template.profile);}catch(e){safeLogError?.(e,'scenario-apply-liveops');}
  saveScenarioMission();
  renderScenarioMissionBoard();
  return mission;
}
function scheduleScenarioEvent(eventType='ARRIVAL_WAVE',minute=2){
  loadScenarioMission();
  const tpl=SCENARIO_MISSION_CATALOG.eventTypes.find(e=>e.id===eventType)||SCENARIO_MISSION_CATALOG.eventTypes[0];
  const item={id:`EVT-CUSTOM-${String(Date.now()).slice(-6)}`,type:tpl.id,name:tpl.name,severity:tpl.severity,minute:Number(minute||2),status:'SCHEDULED',custom:true};
  scenarioMissionState.generatedEvents.push(item);
  saveScenarioMission();
  renderScenarioMissionBoard();
  return item;
}
function completeObjective(id,ok=true){
  loadScenarioMission();
  const obj=scenarioMissionState.objectives.find(o=>o.id===id);
  if(obj){obj.status=ok?'DONE':'FAILED'; obj.completedAt=new Date().toISOString();}
  saveScenarioMission();
  return obj||null;
}
function evaluateScenarioMission(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadScenarioMission();
  if(!scenarioMissionState.activeMission) startScenarioMission('MOBILE_TRAINING');
  const mission=scenarioMissionState.activeMission;
  const conflicts=Number(statsObj.conflicts||0);
  const denied=Number(statsObj.denied||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  completeObjective('MISSION_COMPLETION',!fail);
  completeObjective('NO_CONFLICTS',conflicts===0&&incursions===0);
  completeObjective('LOW_DENIALS',denied<=1);
  completeObjective('PACE_CONTROL',Number(pace.workload||45)<80);
  completeObjective('SAFE_MODE_ZERO',Number(stability.safeModeCount||0)===0);
  if(scenarioMissionState.objectives.some(o=>o.id==='RADIO_ACCURACY')) completeObjective('RADIO_ACCURACY',Number(radio.score||radio.accuracy||84)>=75);
  const possible=scenarioMissionState.objectives.reduce((a,o)=>a+Number(o.points||0),0)||1;
  const earned=scenarioMissionState.objectives.filter(o=>o.status==='DONE').reduce((a,o)=>a+Number(o.points||0),0);
  const eventPenalty=scenarioMissionState.generatedEvents.filter(e=>e.status==='FAILED').reduce((a,e)=>a+Number(e.severity||0),0);
  const safetyPenalty=conflicts*8+incursions*14+denied*3+(fail?10:0)+eventPenalty/5;
  const score=Math.max(0,Math.min(100,Math.round((earned/possible)*100-safetyPenalty+Math.min(8,Number(finalScore||0)/500))));
  const grade=gradeFor(score);
  scenarioMissionState.missionScore=score;
  scenarioMissionState.grade=grade.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',missionId:mission.id,templateId:mission.templateId,missionName:mission.name,missionScore:score,grade:grade.id,gradeName:grade.name,objectivesDone:scenarioMissionState.objectives.filter(o=>o.status==='DONE').length,objectivesTotal:scenarioMissionState.objectives.length,events:scenarioMissionState.generatedEvents.length,seed:mission.seed,finalScore:Math.round(finalScore||0),stats:{conflicts,denied,incursions,fail:Boolean(fail)}};
  scenarioMissionState.lastEvaluation=evaluation;
  scenarioMissionState.missionHistory.unshift(evaluation);
  scenarioMissionState.missionHistory=scenarioMissionState.missionHistory.slice(0,80);
  saveScenarioMission();
  renderScenarioMissionBoard();
  return {state:scenarioMissionState,evaluation};
}
function scenarioMissionProgress(){
  loadScenarioMission();
  return {score:scenarioMissionState.missionScore,grade:scenarioMissionState.grade,activeMission:scenarioMissionState.activeMission,events:scenarioMissionState.generatedEvents.length,objectivesDone:scenarioMissionState.objectives.filter(o=>o.status==='DONE').length,objectivesTotal:scenarioMissionState.objectives.length,seed:scenarioMissionState.activeMission?.seed||0,last:scenarioMissionState.lastEvaluation||null};
}
function renderScenarioMissionBoard(){
  try{
    const anchor=document.querySelector('#liveOpsConfigInline') || document.querySelector('#pwaUpdateInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#scenarioMissionInline'); if(old) old.remove();
    const p=scenarioMissionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="scenarioMissionInline" class="airport-ops-board scenario-mission-inline">
      <div class="airport-ops-head"><b>MISSION OPS</b><span>${p.grade}</span></div>
      <div class="airport-ops-grid">
        <div><small>MISSÃO</small><b>${p.activeMission?p.activeMission.templateId:'---'}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>OBJ.</small><b>${p.objectivesDone}/${p.objectivesTotal}</b></div>
        <div><small>EVENT.</small><b>${p.events}</b></div>
        <div><small>SEED</small><b>${String(p.seed).slice(-4)}</b></div>
        <div><small>PERFIL</small><b>${p.activeMission?p.activeMission.profile:'---'}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'scenario-mission-board');}
}
function initializeScenarioMission(){
  loadScenarioMission();
  if(!scenarioMissionState.activeMission) startScenarioMission((window.SKYWARD_LIVE_OPS_CONFIG?.progress?.().activeProfile==='SAFE_MOBILE')?'MOBILE_TRAINING':'PEAK_HOUR');
  renderScenarioMissionBoard();
  return scenarioMissionState;
}
function scenarioMissionStatus(){loadScenarioMission();return {...scenarioMissionState,progress:scenarioMissionProgress(),catalog:SCENARIO_MISSION_CATALOG};}
function scenarioMissionSelfCheck(){
  const issues=[];
  if(SCENARIO_MISSION_CATALOG.missionTemplates.length<7) issues.push('templates insuficientes');
  if(SCENARIO_MISSION_CATALOG.eventTypes.length<8) issues.push('eventos insuficientes');
  const m=startScenarioMission('MOBILE_TRAINING');
  const ev=scheduleScenarioEvent('ARRIVAL_WAVE',2);
  const res=evaluateScenarioMission(2600,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!m.id||!ev.id) issues.push('missão/evento inválido');
  if(!Number.isFinite(res.evaluation.missionScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,templates:SCENARIO_MISSION_CATALOG.missionTemplates.length,events:SCENARIO_MISSION_CATALOG.eventTypes.length};
}
window.SKYWARD_SCENARIO_MISSION=Object.freeze({
  schema:1,
  catalog:SCENARIO_MISSION_CATALOG,
  load:loadScenarioMission,
  save:saveScenarioMission,
  init:initializeScenarioMission,
  start:startScenarioMission,
  event:scheduleScenarioEvent,
  complete:completeObjective,
  evaluate:evaluateScenarioMission,
  progress:scenarioMissionProgress,
  status:scenarioMissionStatus,
  board:renderScenarioMissionBoard,
  selfCheck:scenarioMissionSelfCheck
});
