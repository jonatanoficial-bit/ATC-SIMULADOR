/* @skyward-module 61-replay-timeline-heatmap-center
 * Replay timeline, performance heatmap and session export center for mission review, bookmarks, critical moments and training reports.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('61-replay-timeline-heatmap-center');
const REPLAY_TIMELINE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f58',
  timelineTracks:[
    {id:'TRAFFIC',name:'Tráfego',weight:14,colorHint:'blue'},
    {id:'CLEARANCE',name:'Autorizações',weight:14,colorHint:'green'},
    {id:'SAFETY',name:'Segurança',weight:20,colorHint:'red'},
    {id:'RADIO',name:'Rádio',weight:12,colorHint:'purple'},
    {id:'WEATHER',name:'Clima',weight:10,colorHint:'cyan'},
    {id:'MISSION',name:'Missão',weight:12,colorHint:'gold'},
    {id:'PACE',name:'Ritmo',weight:10,colorHint:'teal'},
    {id:'SYSTEM',name:'Sistema',weight:8,colorHint:'gray'}
  ],
  bookmarkTypes:[
    {id:'FIRST_CLEARANCE',name:'Primeira autorização',importance:8,track:'CLEARANCE'},
    {id:'CONFLICT_AVOIDED',name:'Conflito evitado',importance:18,track:'SAFETY'},
    {id:'LOSS_SEPARATION',name:'Perda de separação',importance:34,track:'SAFETY'},
    {id:'RUNWAY_EVENT',name:'Evento de pista',importance:30,track:'SAFETY'},
    {id:'RADIO_ERROR',name:'Erro de rádio',importance:18,track:'RADIO'},
    {id:'WEATHER_SHIFT',name:'Mudança climática',importance:20,track:'WEATHER'},
    {id:'WORKLOAD_SPIKE',name:'Pico de workload',importance:22,track:'PACE'},
    {id:'MISSION_OBJECTIVE',name:'Objetivo de missão',importance:16,track:'MISSION'},
    {id:'SAFE_MODE',name:'Modo seguro',importance:32,track:'SYSTEM'},
    {id:'RANK_UP',name:'Promoção de carreira',importance:14,track:'MISSION'}
  ],
  heatmapZones:[
    {id:'RUNWAY',name:'Pista',riskWeight:24},
    {id:'APPROACH',name:'Aproximação',riskWeight:20},
    {id:'GROUND',name:'Solo',riskWeight:14},
    {id:'RADIO',name:'Rádio',riskWeight:12},
    {id:'WEATHER',name:'Clima',riskWeight:16},
    {id:'WORKLOAD',name:'Workload',riskWeight:18},
    {id:'MISSION',name:'Objetivos',riskWeight:10},
    {id:'STABILITY',name:'Estabilidade',riskWeight:15}
  ],
  exportProfiles:[
    {id:'QUICK_REVIEW',name:'Revisão rápida',includeTimeline:true,includeHeatmap:true,includeRaw:false},
    {id:'INSTRUCTOR_FULL',name:'Instrutor completo',includeTimeline:true,includeHeatmap:true,includeRaw:true},
    {id:'MOBILE_SUMMARY',name:'Resumo mobile',includeTimeline:true,includeHeatmap:false,includeRaw:false},
    {id:'DEBUG_SESSION',name:'Debug sessão',includeTimeline:true,includeHeatmap:true,includeRaw:true}
  ],
  replayBands:[
    {id:'CLEAN',min:92,name:'Replay limpo'},
    {id:'REVIEWABLE',min:78,name:'Bom para revisão'},
    {id:'LESSON',min:58,name:'Replay de aprendizado'},
    {id:'CRITICAL',min:0,name:'Replay crítico'}
  ]
});
const REPLAY_TIMELINE_KEY='skywardReplayTimeline_v1';
let replayTimelineState={schema:1,replayScore:0,status:'LESSON',bookmarks:[],timeline:[],heatmap:{},exports:[],criticalMoments:0,topZone:'MISSION',lastEvaluation:null,history:[]};
function loadReplayTimeline(){try{const raw=localStorage?.getItem?.(REPLAY_TIMELINE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)replayTimelineState={...replayTimelineState,...parsed};}}catch(e){safeLogError?.(e,'replay-timeline-load');}return replayTimelineState;}
function saveReplayTimeline(){try{localStorage?.setItem?.(REPLAY_TIMELINE_KEY,JSON.stringify(replayTimelineState));}catch(e){safeLogError?.(e,'replay-timeline-save');}return replayTimelineState;}
function replayBand(score){return REPLAY_TIMELINE_CATALOG.replayBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||REPLAY_TIMELINE_CATALOG.replayBands.at(-1);}
function bookmarkType(id){return REPLAY_TIMELINE_CATALOG.bookmarkTypes.find(b=>b.id===id)||REPLAY_TIMELINE_CATALOG.bookmarkTypes[0];}
function addReplayBookmark(typeId,minute=0,detail=''){
  loadReplayTimeline();
  const type=bookmarkType(typeId);
  const item={id:`RBK-${String(Date.now()).slice(-6)}-${replayTimelineState.bookmarks.length+1}`,type:type.id,name:type.name,track:type.track,importance:type.importance,minute:Number(minute||0),detail:String(detail||type.name),at:new Date().toISOString(),build:BUILD};
  replayTimelineState.bookmarks.push(item);
  replayTimelineState.timeline.push({...item,kind:'BOOKMARK'});
  replayTimelineState.bookmarks=replayTimelineState.bookmarks.slice(-120);
  replayTimelineState.timeline=replayTimelineState.timeline.slice(-180);
  saveReplayTimeline();
  return item;
}
function buildSessionBookmarks(statsObj={},fail=false){
  const marks=[];
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const campaign=window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  marks.push({type:'FIRST_CLEARANCE',minute:1,detail:'Sessão iniciada e primeira autorização registrada.'});
  if(conflicts>0) marks.push({type:'LOSS_SEPARATION',minute:3,detail:`${conflicts} conflito(s) detectado(s).`});
  else marks.push({type:'CONFLICT_AVOIDED',minute:4,detail:'Separação mantida sem conflitos.'});
  if(incursions>0) marks.push({type:'RUNWAY_EVENT',minute:5,detail:`${incursions} evento(s) de pista.`});
  if(denied>1) marks.push({type:'WORKLOAD_SPIKE',minute:6,detail:`${denied} negativas indicam pressão operacional.`});
  if(Number(pace.workload||0)>=75) marks.push({type:'WORKLOAD_SPIKE',minute:7,detail:`Workload alto: ${pace.workload}.`});
  if(Number(stability.safeModeCount||0)>0||fail) marks.push({type:'SAFE_MODE',minute:8,detail:'Modo seguro ou falha de sessão observado.'});
  if(scenario.last?.grade||scenario.grade) marks.push({type:'MISSION_OBJECTIVE',minute:9,detail:`Missão avaliada com nota ${scenario.last?.grade||scenario.grade}.`});
  if(Number(campaign.last?.xpGained||0)>0) marks.push({type:'RANK_UP',minute:10,detail:`XP ganho: ${campaign.last.xpGained}.`});
  if(String(debrief.status||'').includes('TRAINING')||String(debrief.status||'').includes('REMEDIAL')) marks.push({type:'RADIO_ERROR',minute:11,detail:`Treino recomendado: ${debrief.recommendedDrill||'revisão'}.`});
  return marks;
}
function buildReplayHeatmap(statsObj={},fail=false){
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.status?.()||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  const heat={};
  for(const z of REPLAY_TIMELINE_CATALOG.heatmapZones) heat[z.id]=0;
  heat.RUNWAY+=incursions*34;
  heat.APPROACH+=conflicts*26;
  heat.GROUND+=denied*7;
  heat.RADIO+=Math.max(0,84-Number(radio.score||84))*.8;
  heat.WORKLOAD+=Number(pace.workload||0)*.45+denied*5;
  heat.STABILITY+=Number(stability.safeModeCount||0)*32+(fail?20:0);
  heat.MISSION+=Math.max(0,80-Number((debrief.lastDebrief||debrief.last||{}).missionScore||80))*.55;
  heat.WEATHER+=String((window.SKYWARD_SCENARIO_MISSION?.progress?.().activeMission?.weather?.id)||'').includes('STORM')?26:8;
  for(const key of Object.keys(heat)) heat[key]=Math.max(0,Math.min(100,Math.round(heat[key])));
  return heat;
}
function topHeatZone(heatmap){
  return Object.entries(heatmap||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||'MISSION';
}
function exportReplaySession(profileId='QUICK_REVIEW'){
  loadReplayTimeline();
  const profile=REPLAY_TIMELINE_CATALOG.exportProfiles.find(p=>p.id===profileId)||REPLAY_TIMELINE_CATALOG.exportProfiles[0];
  const report={
    schema:1,
    profile:profile.id,
    build:BUILD,
    at:new Date().toISOString(),
    replayScore:replayTimelineState.replayScore,
    status:replayTimelineState.status,
    criticalMoments:replayTimelineState.criticalMoments,
    topZone:replayTimelineState.topZone,
    timeline:profile.includeTimeline?replayTimelineState.timeline.slice(-60):[],
    heatmap:profile.includeHeatmap?replayTimelineState.heatmap:{},
    debrief:window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||null,
    campaign:window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||null,
    mission:window.SKYWARD_SCENARIO_MISSION?.progress?.()||null,
    raw:profile.includeRaw?{bookmarks:replayTimelineState.bookmarks,history:replayTimelineState.history}:undefined
  };
  replayTimelineState.exports.unshift({id:`EXP-${String(Date.now()).slice(-6)}`,profile:profile.id,at:report.at,score:report.replayScore,status:report.status,events:report.timeline.length});
  replayTimelineState.exports=replayTimelineState.exports.slice(0,40);
  saveReplayTimeline();
  return report;
}
function evaluateReplayTimeline(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadReplayTimeline();
  const sessionMarks=buildSessionBookmarks(statsObj,fail);
  for(const m of sessionMarks) addReplayBookmark(m.type,m.minute,m.detail);
  const heat=buildReplayHeatmap(statsObj,fail);
  const risk=Object.values(heat).reduce((a,b)=>a+Number(b||0),0)/Math.max(1,Object.values(heat).length);
  const critical=replayTimelineState.bookmarks.filter(b=>Number(b.importance||0)>=24).length;
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const mission=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const base=Math.round((Number(debrief.score||76)*.35)+(Number(mission.score||76)*.28)+(Math.max(0,100-risk)*.27)+Math.min(10,Number(finalScore||0)/500));
  const replayScore=Math.max(0,Math.min(100,base-(fail?12:0)-Math.min(14,critical*1.2)));
  const band=replayBand(replayScore);
  replayTimelineState.heatmap=heat;
  replayTimelineState.replayScore=replayScore;
  replayTimelineState.status=band.id;
  replayTimelineState.criticalMoments=critical;
  replayTimelineState.topZone=topHeatZone(heat);
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',replayScore,status:band.id,statusName:band.name,criticalMoments:critical,heatmapRisk:Math.round(risk),topZone:replayTimelineState.topZone,timelineEvents:replayTimelineState.timeline.length,bookmarks:replayTimelineState.bookmarks.length,exportProfile:'QUICK_REVIEW',finalScore:Math.round(finalScore||0)};
  replayTimelineState.lastEvaluation=evaluation;
  replayTimelineState.history.unshift(evaluation);
  replayTimelineState.history=replayTimelineState.history.slice(0,100);
  saveReplayTimeline();
  renderReplayTimelineBoard();
  return {state:replayTimelineState,evaluation};
}
function replayTimelineProgress(){
  loadReplayTimeline();
  return {score:replayTimelineState.replayScore,status:replayTimelineState.status,bookmarks:replayTimelineState.bookmarks.length,timelineEvents:replayTimelineState.timeline.length,criticalMoments:replayTimelineState.criticalMoments,topZone:replayTimelineState.topZone,exports:replayTimelineState.exports.length,last:replayTimelineState.lastEvaluation||null};
}
function renderReplayTimelineBoard(){
  try{
    const anchor=document.querySelector('#instructorDebriefInline') || document.querySelector('#campaignProgressionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#replayTimelineInline'); if(old) old.remove();
    const p=replayTimelineProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="replayTimelineInline" class="airport-ops-board replay-timeline-inline">
      <div class="airport-ops-head"><b>REPLAY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>BOOK</small><b>${p.bookmarks}</b></div>
        <div><small>CRIT.</small><b>${p.criticalMoments}</b></div>
        <div><small>ZONE</small><b>${p.topZone}</b></div>
        <div><small>EVENT.</small><b>${p.timelineEvents}</b></div>
        <div><small>EXP.</small><b>${p.exports}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'replay-timeline-board');}
}
function initializeReplayTimeline(){
  loadReplayTimeline();
  if(!replayTimelineState.timeline.length) addReplayBookmark('FIRST_CLEARANCE',0,'Replay iniciado.');
  renderReplayTimelineBoard();
  return replayTimelineState;
}
function replayTimelineStatus(){loadReplayTimeline();return {...replayTimelineState,progress:replayTimelineProgress(),catalog:REPLAY_TIMELINE_CATALOG};}
function replayTimelineSelfCheck(){
  const issues=[];
  if(REPLAY_TIMELINE_CATALOG.timelineTracks.length<8) issues.push('tracks insuficientes');
  if(REPLAY_TIMELINE_CATALOG.bookmarkTypes.length<10) issues.push('bookmarks insuficientes');
  const mark=addReplayBookmark('CONFLICT_AVOIDED',2,'self-check');
  const evalResult=evaluateReplayTimeline(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  const exported=exportReplaySession('INSTRUCTOR_FULL');
  if(!mark.id) issues.push('bookmark inválido');
  if(!Number.isFinite(evalResult.evaluation.replayScore)) issues.push('score inválido');
  if(!exported.schema||!Array.isArray(exported.timeline)) issues.push('export inválido');
  return {ok:issues.length===0,issues,tracks:REPLAY_TIMELINE_CATALOG.timelineTracks.length,bookmarks:REPLAY_TIMELINE_CATALOG.bookmarkTypes.length};
}
window.SKYWARD_REPLAY_TIMELINE=Object.freeze({
  schema:1,
  catalog:REPLAY_TIMELINE_CATALOG,
  load:loadReplayTimeline,
  save:saveReplayTimeline,
  init:initializeReplayTimeline,
  bookmark:addReplayBookmark,
  export:exportReplaySession,
  evaluate:evaluateReplayTimeline,
  progress:replayTimelineProgress,
  status:replayTimelineStatus,
  board:renderReplayTimelineBoard,
  selfCheck:replayTimelineSelfCheck
});
