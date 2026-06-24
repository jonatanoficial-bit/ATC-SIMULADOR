/* @skyward-module 59-campaign-progression-licenses-achievements-center
 * Campaign progression, controller ranks, licenses, achievements, skill tree and unlocks for long-term ATC career gameplay.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('59-campaign-progression-licenses-achievements-center');
const CAMPAIGN_PROGRESSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f56',
  campaignChapters:[
    {id:'BASIC_TOWER',name:'Torre Básica',missionsRequired:2,xpReward:350,unlock:'LICENSE_TWR_1'},
    {id:'GROUND_RUNWAY',name:'Solo e Pista',missionsRequired:3,xpReward:520,unlock:'LICENSE_GND_1'},
    {id:'WEATHER_OPS',name:'Operação em Clima',missionsRequired:3,xpReward:680,unlock:'LICENSE_IFR_1'},
    {id:'EMERGENCY_DESK',name:'Mesa de Emergência',missionsRequired:4,xpReward:850,unlock:'LICENSE_EMG_1'},
    {id:'REGIONAL_NETWORK',name:'Rede Regional',missionsRequired:4,xpReward:980,unlock:'LICENSE_APP_1'},
    {id:'INTERNATIONAL_HUB',name:'Hub Internacional',missionsRequired:5,xpReward:1300,unlock:'LICENSE_SUP_1'}
  ],
  controllerRanks:[
    {id:'TRAINEE',name:'Controlador Trainee',minXp:0},
    {id:'JUNIOR',name:'Controlador Júnior',minXp:500},
    {id:'TOWER',name:'Controlador de Torre',minXp:1200},
    {id:'SENIOR',name:'Controlador Sênior',minXp:2400},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minXp:4200},
    {id:'CHIEF',name:'Chefe de Controle',minXp:7000}
  ],
  licenses:[
    {id:'LICENSE_TWR_1',name:'Licença Torre I',area:'Tower',requiredXp:300},
    {id:'LICENSE_GND_1',name:'Licença Solo I',area:'Ground',requiredXp:750},
    {id:'LICENSE_IFR_1',name:'Licença IFR I',area:'Weather',requiredXp:1400},
    {id:'LICENSE_EMG_1',name:'Licença Emergência I',area:'Emergency',requiredXp:2200},
    {id:'LICENSE_APP_1',name:'Licença Aproximação I',area:'Approach',requiredXp:3400},
    {id:'LICENSE_SUP_1',name:'Licença Supervisão',area:'Supervisor',requiredXp:5200}
  ],
  achievements:[
    {id:'FIRST_MISSION',name:'Primeira Missão',condition:'missions>=1',xp:80},
    {id:'NO_CONFLICT_RUN',name:'Turno Sem Conflitos',condition:'conflicts=0',xp:120},
    {id:'SAFE_MOBILE_PRO',name:'Mobile Seguro',condition:'safeMode=0;mobile=true',xp:120},
    {id:'GRADE_A',name:'Nota A',condition:'grade>=A',xp:160},
    {id:'GRADE_S',name:'Nota S',condition:'grade=S',xp:260},
    {id:'STORM_HANDLER',name:'Mestre da Tempestade',condition:'template=STORM_DIVERSION;grade>=B',xp:240},
    {id:'EMERGENCY_CALM',name:'Calma na Emergência',condition:'template=EMERGENCY_RUNWAY;conflicts=0',xp:280},
    {id:'NETWORK_CONTROLLER',name:'Controlador de Rede',condition:'template=REGIONAL_NETWORK;grade>=B',xp:260}
  ],
  skillTree:[
    {id:'RADIO_CLARITY',name:'Clareza de Rádio',cost:1,benefit:'radioAccuracy+4'},
    {id:'PACE_DISCIPLINE',name:'Disciplina de Ritmo',cost:1,benefit:'workload-4'},
    {id:'RUNWAY_AWARENESS',name:'Consciência de Pista',cost:2,benefit:'incursionRisk-6'},
    {id:'WEATHER_READING',name:'Leitura Meteorológica',cost:2,benefit:'weatherRisk-5'},
    {id:'EMERGENCY_RESPONSE',name:'Resposta Emergencial',cost:3,benefit:'emergencyScore+6'},
    {id:'NETWORK_FLOW',name:'Fluxo de Rede',cost:3,benefit:'networkScore+5'},
    {id:'SUPERVISOR_DECISION',name:'Decisão de Supervisor',cost:4,benefit:'finalScore+5'}
  ],
  unlockables:[
    {id:'MISSION_STORM_DIVERSION',name:'Missão Desvio por Tempestade',requires:'LICENSE_IFR_1'},
    {id:'MISSION_EMERGENCY_RUNWAY',name:'Missão Emergência em Pista',requires:'LICENSE_EMG_1'},
    {id:'MISSION_REGIONAL_NETWORK',name:'Missão Rede Regional',requires:'LICENSE_APP_1'},
    {id:'PROFILE_REALISTIC_DESKTOP',name:'Perfil Desktop Realista',requires:'LICENSE_SUP_1'}
  ]
});
const CAMPAIGN_PROGRESSION_KEY='skywardCampaignProgression_v1';
let campaignState={schema:1,xp:0,rank:'TRAINEE',licenses:[],achievements:[],skills:[],skillPoints:0,missionsCompleted:0,chapterProgress:{},unlocks:[],history:[],lastEvaluation:null};
function loadCampaignProgression(){try{const raw=localStorage?.getItem?.(CAMPAIGN_PROGRESSION_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)campaignState={...campaignState,...parsed};}}catch(e){safeLogError?.(e,'campaign-load');}return campaignState;}
function saveCampaignProgression(){try{localStorage?.setItem?.(CAMPAIGN_PROGRESSION_KEY,JSON.stringify(campaignState));}catch(e){safeLogError?.(e,'campaign-save');}return campaignState;}
function rankForXp(xp){return CAMPAIGN_PROGRESSION_CATALOG.controllerRanks.slice().sort((a,b)=>b.minXp-a.minXp).find(r=>xp>=r.minXp)||CAMPAIGN_PROGRESSION_CATALOG.controllerRanks[0];}
function gradeValue(g){return {S:5,A:4,B:3,C:2,D:1}[String(g||'D')]||1;}
function hasAchievement(id){return campaignState.achievements.some(a=>a.id===id);}
function awardAchievement(id,reason='auto'){
  loadCampaignProgression();
  const ach=CAMPAIGN_PROGRESSION_CATALOG.achievements.find(a=>a.id===id);
  if(!ach || hasAchievement(id)) return null;
  const item={id:ach.id,name:ach.name,xp:ach.xp,reason,at:new Date().toISOString()};
  campaignState.achievements.push(item);
  campaignState.xp+=Number(ach.xp||0);
  return item;
}
function unlockLicenses(){
  loadCampaignProgression();
  const before=campaignState.licenses.length;
  for(const lic of CAMPAIGN_PROGRESSION_CATALOG.licenses){
    if(campaignState.xp>=lic.requiredXp && !campaignState.licenses.some(l=>l.id===lic.id)){
      campaignState.licenses.push({id:lic.id,name:lic.name,area:lic.area,at:new Date().toISOString()});
    }
  }
  for(const unlock of CAMPAIGN_PROGRESSION_CATALOG.unlockables){
    if(campaignState.licenses.some(l=>l.id===unlock.requires) && !campaignState.unlocks.some(u=>u.id===unlock.id)){
      campaignState.unlocks.push({id:unlock.id,name:unlock.name,requires:unlock.requires,at:new Date().toISOString()});
    }
  }
  return campaignState.licenses.length-before;
}
function spendSkillPoint(id){
  loadCampaignProgression();
  const skill=CAMPAIGN_PROGRESSION_CATALOG.skillTree.find(s=>s.id===id);
  if(!skill) return {ok:false,reason:'skill not found'};
  if(campaignState.skills.some(s=>s.id===id)) return {ok:false,reason:'already unlocked'};
  if(campaignState.skillPoints<skill.cost) return {ok:false,reason:'not enough points'};
  campaignState.skillPoints-=skill.cost;
  campaignState.skills.push({id:skill.id,name:skill.name,benefit:skill.benefit,cost:skill.cost,at:new Date().toISOString()});
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return {ok:true,skill};
}
function computeMissionXp(missionEval,statsObj={},fail=false){
  const score=Number(missionEval?.missionScore||0);
  const grade=String(missionEval?.grade||'D');
  const difficulty=Number((window.SKYWARD_SCENARIO_MISSION?.status?.().activeMission?.difficulty)||3);
  const base=Math.round(80+difficulty*35+score*2.2);
  const gradeBonus={S:260,A:180,B:110,C:45,D:0}[grade]||0;
  const safetyBonus=(Number(statsObj.conflicts||0)===0&&Number(statsObj.runwayIncursions||0)===0)?80:0;
  return Math.max(20,base+gradeBonus+safetyBonus-(fail?80:0));
}
function updateChapterProgress(missionEval){
  loadCampaignProgression();
  const template=String(missionEval?.templateId||'MOBILE_TRAINING');
  const chapter = template.includes('STORM')?'WEATHER_OPS':template.includes('EMERGENCY')?'EMERGENCY_DESK':template.includes('REGIONAL')?'REGIONAL_NETWORK':template.includes('CARGO')?'GROUND_RUNWAY':'BASIC_TOWER';
  const prev=campaignState.chapterProgress[chapter]||{completed:0,claimed:false};
  prev.completed=Number(prev.completed||0)+1;
  campaignState.chapterProgress[chapter]=prev;
  const ch=CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.find(c=>c.id===chapter);
  if(ch && prev.completed>=ch.missionsRequired && !prev.claimed){
    prev.claimed=true;
    campaignState.xp+=Number(ch.xpReward||0);
    campaignState.history.unshift({type:'CHAPTER_COMPLETE',chapter:ch.id,name:ch.name,xp:ch.xpReward,unlock:ch.unlock,at:new Date().toISOString()});
  }
  return chapter;
}
function evaluateCampaignProgression(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCampaignProgression();
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const scenarioStatus=window.SKYWARD_SCENARIO_MISSION?.status?.()||{};
  const lastMission=scenario.last||scenarioStatus.lastEvaluation||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const missionEval={...lastMission,missionScore:Number(lastMission.missionScore||scenario.score||0),grade:String(lastMission.grade||scenario.grade||'D'),templateId:String(lastMission.templateId||scenario.activeMission?.templateId||'MOBILE_TRAINING')};
  const xpGained=computeMissionXp(missionEval,statsObj,fail);
  campaignState.xp+=xpGained;
  campaignState.missionsCompleted+=1;
  const chapter=updateChapterProgress(missionEval);
  if(campaignState.missionsCompleted>=1) awardAchievement('FIRST_MISSION','mission');
  if(Number(statsObj.conflicts||0)===0&&Number(statsObj.runwayIncursions||0)===0) awardAchievement('NO_CONFLICT_RUN','safety');
  if(Number(stability.safeModeCount||0)===0 && (window.SKYWARD_LIVE_OPS_CONFIG?.signals?.().mobile||false)) awardAchievement('SAFE_MOBILE_PRO','mobile');
  if(gradeValue(missionEval.grade)>=4) awardAchievement('GRADE_A','grade');
  if(missionEval.grade==='S') awardAchievement('GRADE_S','grade');
  if(missionEval.templateId==='STORM_DIVERSION'&&gradeValue(missionEval.grade)>=3) awardAchievement('STORM_HANDLER','scenario');
  if(missionEval.templateId==='EMERGENCY_RUNWAY'&&Number(statsObj.conflicts||0)===0) awardAchievement('EMERGENCY_CALM','scenario');
  if(missionEval.templateId==='REGIONAL_NETWORK'&&gradeValue(missionEval.grade)>=3) awardAchievement('NETWORK_CONTROLLER','scenario');
  unlockLicenses();
  const oldRank=campaignState.rank;
  campaignState.rank=rankForXp(campaignState.xp).id;
  if(campaignState.rank!==oldRank){
    campaignState.skillPoints+=1;
    campaignState.history.unshift({type:'RANK_UP',from:oldRank,to:campaignState.rank,skillPoints:campaignState.skillPoints,at:new Date().toISOString()});
  }
  const campaignProgress=Math.round(Math.min(100,(campaignState.licenses.length/CAMPAIGN_PROGRESSION_CATALOG.licenses.length)*60+(campaignState.missionsCompleted/18)*40));
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',xpTotal:campaignState.xp,xpGained,rank:campaignState.rank,licenses:campaignState.licenses.length,achievements:campaignState.achievements.length,skillPoints:campaignState.skillPoints,missionsCompleted:campaignState.missionsCompleted,chapter,campaignProgress,missionGrade:missionEval.grade,missionScore:missionEval.missionScore,finalScore:Math.round(finalScore||0)};
  campaignState.lastEvaluation=evaluation;
  campaignState.history.unshift({type:'MISSION_REWARD',...evaluation});
  campaignState.history=campaignState.history.slice(0,100);
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return {state:campaignState,evaluation};
}
function campaignProgressionProgress(){
  loadCampaignProgression();
  return {xp:campaignState.xp,rank:campaignState.rank,licenses:campaignState.licenses.length,achievements:campaignState.achievements.length,skillPoints:campaignState.skillPoints,missionsCompleted:campaignState.missionsCompleted,unlocks:campaignState.unlocks.length,last:campaignState.lastEvaluation||null};
}
function renderCampaignProgressionBoard(){
  try{
    const anchor=document.querySelector('#scenarioMissionInline') || document.querySelector('#liveOpsConfigInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#campaignProgressionInline'); if(old) old.remove();
    const p=campaignProgressionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="campaignProgressionInline" class="airport-ops-board campaign-progression-inline">
      <div class="airport-ops-head"><b>CAREER OPS</b><span>${p.rank}</span></div>
      <div class="airport-ops-grid">
        <div><small>XP</small><b>${p.xp}</b></div>
        <div><small>LIC.</small><b>${p.licenses}</b></div>
        <div><small>ACH.</small><b>${p.achievements}</b></div>
        <div><small>SKILL</small><b>${p.skillPoints}</b></div>
        <div><small>MISS.</small><b>${p.missionsCompleted}</b></div>
        <div><small>UNLOCK</small><b>${p.unlocks}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'campaign-progression-board');}
}
function initializeCampaignProgression(){
  loadCampaignProgression();
  campaignState.rank=rankForXp(campaignState.xp).id;
  unlockLicenses();
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return campaignState;
}
function campaignProgressionStatus(){loadCampaignProgression();return {...campaignState,progress:campaignProgressionProgress(),catalog:CAMPAIGN_PROGRESSION_CATALOG};}
function campaignProgressionSelfCheck(){
  const issues=[];
  if(CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.length<6) issues.push('capítulos insuficientes');
  if(CAMPAIGN_PROGRESSION_CATALOG.achievements.length<8) issues.push('conquistas insuficientes');
  const res=evaluateCampaignProgression(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!Number.isFinite(res.evaluation.xpTotal)||res.evaluation.xpGained<=0) issues.push('xp inválido');
  const spend=spendSkillPoint('RADIO_CLARITY');
  if(campaignState.skillPoints>0 && spend.ok===false && spend.reason!=='already unlocked') issues.push('skill inválida');
  return {ok:issues.length===0,issues,chapters:CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.length,achievements:CAMPAIGN_PROGRESSION_CATALOG.achievements.length};
}
window.SKYWARD_CAMPAIGN_PROGRESSION=Object.freeze({
  schema:1,
  catalog:CAMPAIGN_PROGRESSION_CATALOG,
  load:loadCampaignProgression,
  save:saveCampaignProgression,
  init:initializeCampaignProgression,
  award:awardAchievement,
  licenses:unlockLicenses,
  spend:spendSkillPoint,
  evaluate:evaluateCampaignProgression,
  progress:campaignProgressionProgress,
  status:campaignProgressionStatus,
  board:renderCampaignProgressionBoard,
  selfCheck:campaignProgressionSelfCheck
});
