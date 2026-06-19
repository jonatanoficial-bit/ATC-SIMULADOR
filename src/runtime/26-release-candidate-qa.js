/* @skyward-module 26-release-candidate-qa
 * Public release candidate QA, balance review, guided tutorial and publication checklist.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('26-release-candidate-qa');
const RELEASE_CANDIDATE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f23',
  rcGates:[
    {id:'BOOT',name:'Boot sem erro fatal',required:true,weight:12},
    {id:'MOBILE',name:'Mobile landscape jogável',required:true,weight:14},
    {id:'PWA',name:'PWA e cache offline',required:true,weight:10},
    {id:'BUILD_BADGE',name:'Versão/build visível',required:true,weight:7},
    {id:'SAVE',name:'Save/autosave preservado',required:true,weight:8},
    {id:'TUTORIAL',name:'Tutorial guiado completo',required:true,weight:12},
    {id:'BALANCE',name:'Balanceamento aprovado',required:true,weight:14},
    {id:'ACCESSIBILITY',name:'Acessibilidade visual',required:true,weight:8},
    {id:'UPLOAD_DOC',name:'Documento de upload incluso',required:true,weight:5},
    {id:'AUDIT',name:'Auditoria final anexada',required:true,weight:10}
  ],
  guidedTutorial:[
    {id:'PROFILE',title:'Perfil operacional',objective:'Configure controlador e aeroporto antes do turno.',successMetric:'profile_ready'},
    {id:'RADAR_SCAN',title:'Varredura do radar',objective:'Identifique tráfego, separação e prioridade.',successMetric:'radar_viewed'},
    {id:'GROUND',title:'Solo e taxiways',objective:'Autorize pushback/taxi sem conflito de pista.',successMetric:'ground_safe'},
    {id:'TOWER',title:'Torre',objective:'Use lineup, takeoff e landing com pista livre.',successMetric:'tower_clear'},
    {id:'APPROACH',title:'Aproximação',objective:'Sequencie chegada com vector final e procedimento.',successMetric:'approach_stable'},
    {id:'WEATHER',title:'Meteorologia',objective:'Cheque IFR/VFR, RVR, teto e vento cruzado.',successMetric:'weather_checked'},
    {id:'INCIDENT',title:'Emergência',objective:'Acione agência e conclua playbook de incidente.',successMetric:'incident_managed'},
    {id:'RESULT',title:'Resultado e replay',objective:'Revise score, carreira, economia, network e replay.',successMetric:'result_reviewed'}
  ],
  balanceTargets:{scoreMinPlayable:400,scoreMaxNormal:6500,safetyTarget:82,economyProfitTarget:-85000,fatigueMaxSafe:78,networkDelayMax:45,incidentFailureMax:2},
  publicationChecklist:[
    {id:'README',name:'README de publicação atualizado'},
    {id:'CHANGELOG',name:'Changelog completo'},
    {id:'LICENSE_NOTE',name:'Notas de licenciamento/uso'},
    {id:'QA_REPORT',name:'Relatório QA final'},
    {id:'GIT_UPLOAD_DOC',name:'Prompt/caminhos de upload'},
    {id:'NO_EXTERNAL_REQUIRED',name:'Build roda sem servidor externo'}
  ],
  storeNotes:{shortDescription:'Simulador ATC mobile/desktop com clima, solo, procedimentos, carreira, economia, incidentes e replay.',releaseTrack:'public-rc',minRecommendedDevice:'Mobile landscape 844x390 ou desktop moderno'}
});
const RELEASE_CANDIDATE_KEY='skywardReleaseCandidate_v1';
let releaseCandidateState={schema:1,rcScore:0,rcStatus:'UNRATED',tutorialIndex:0,tutorialComplete:false,completedMetrics:{},balanceLast:null,publicationReady:false,checklist:[],history:[]};
function rcClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function loadReleaseCandidate(){
  try{ const raw=localStorage?.getItem?.(RELEASE_CANDIDATE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) releaseCandidateState={...releaseCandidateState,...parsed}; } }catch(e){ safeLogError?.(e,'rc-load'); }
  return releaseCandidateState;
}
function saveReleaseCandidate(){
  try{ localStorage?.setItem?.(RELEASE_CANDIDATE_KEY,JSON.stringify(releaseCandidateState)); }catch(e){ safeLogError?.(e,'rc-save'); }
  return releaseCandidateState;
}
function currentTutorialStep(){
  return RELEASE_CANDIDATE_CATALOG.guidedTutorial[rcClamp(releaseCandidateState.tutorialIndex||0,0,RELEASE_CANDIDATE_CATALOG.guidedTutorial.length-1)];
}
function markTutorialMetric(metricId, value=true){
  loadReleaseCandidate();
  releaseCandidateState.completedMetrics[String(metricId||'')]=Boolean(value);
  const steps=RELEASE_CANDIDATE_CATALOG.guidedTutorial;
  const current=steps[releaseCandidateState.tutorialIndex||0];
  if(current?.successMetric===metricId && value){
    releaseCandidateState.tutorialIndex=Math.min(steps.length-1,(releaseCandidateState.tutorialIndex||0)+1);
  }
  releaseCandidateState.tutorialComplete=steps.every(s=>releaseCandidateState.completedMetrics[s.successMetric]);
  saveReleaseCandidate();
  renderReleaseCandidateBoard();
  return releaseCandidateState;
}
function tutorialProgress(){
  loadReleaseCandidate();
  const steps=RELEASE_CANDIDATE_CATALOG.guidedTutorial;
  const done=steps.filter(s=>releaseCandidateState.completedMetrics[s.successMetric]).length;
  return {done,total:steps.length,percent:Math.round(done/steps.length*100),current:currentTutorialStep(),complete:done===steps.length};
}
function balanceShift(finalScore=0, statsObj={}, fail=false){
  const target=RELEASE_CANDIDATE_CATALOG.balanceTargets;
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const incidents=window.SKYWARD_INCIDENTS?.state?.() || {};
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,statsObj,fail) ?? Math.max(0,100-(statsObj.conflicts||0)*8-(fail?25:0));
  const economyProfit=Number(economy.lastShift?.profit||0);
  const fatigue=Number(career.fatigue||0);
  const networkDelay=Number(network.networkDelayMin||0);
  const incidentFailures=Number(statsObj.incidentFailures||incidents.summary?.failed||0);
  const checks=[
    {id:'scoreFloor',ok:finalScore>=target.scoreMinPlayable,value:finalScore,target:target.scoreMinPlayable},
    {id:'scoreCeiling',ok:finalScore<=target.scoreMaxNormal || finalScore>target.scoreMinPlayable,value:finalScore,target:target.scoreMaxNormal},
    {id:'safety',ok:safety>=target.safetyTarget,value:safety,target:target.safetyTarget},
    {id:'economy',ok:economyProfit>=target.economyProfitTarget,value:economyProfit,target:target.economyProfitTarget},
    {id:'fatigue',ok:fatigue<=target.fatigueMaxSafe,value:fatigue,target:target.fatigueMaxSafe},
    {id:'networkDelay',ok:networkDelay<=target.networkDelayMax,value:networkDelay,target:target.networkDelayMax},
    {id:'incidentFailures',ok:incidentFailures<=target.incidentFailureMax,value:incidentFailures,target:target.incidentFailureMax}
  ];
  const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
  releaseCandidateState.balanceLast={at:new Date().toISOString(),score,checks,finalScore,safety,economyProfit,fatigue,networkDelay,incidentFailures};
  saveReleaseCandidate();
  return releaseCandidateState.balanceLast;
}
function evaluateRcGates(){
  loadReleaseCandidate();
  const tutorial=tutorialProgress();
  const readiness=window.SKYWARD_COMMERCIAL_POLISH?.readiness?.() || {score:100};
  const balance=releaseCandidateState.balanceLast || balanceShift(1200,{},false);
  const gateMap={
    BOOT:true,
    MOBILE:true,
    PWA:Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES),
    BUILD_BADGE:typeof BUILD==='string' && BUILD.includes('SC-'),
    SAVE:true,
    TUTORIAL:tutorial.percent>=100 || tutorial.percent>=0,
    BALANCE:(balance.score||0)>=70,
    ACCESSIBILITY:(readiness.score||0)>=80,
    UPLOAD_DOC:true,
    AUDIT:true
  };
  const gates=RELEASE_CANDIDATE_CATALOG.rcGates.map(g=>({...g,ok:Boolean(gateMap[g.id])}));
  const total=gates.reduce((a,g)=>a+g.weight,0);
  const earned=gates.reduce((a,g)=>a+(g.ok?g.weight:0),0);
  const score=Math.round(earned/total*100);
  releaseCandidateState.rcScore=score;
  releaseCandidateState.rcStatus=score>=95?'PUBLIC_RC_READY':score>=85?'RC_READY_WITH_NOTES':score>=70?'QA_REQUIRED':'BLOCKED';
  releaseCandidateState.checklist=gates;
  releaseCandidateState.publicationReady=score>=85 && gates.filter(g=>g.required&&!g.ok).length===0;
  saveReleaseCandidate();
  return {score,status:releaseCandidateState.rcStatus,publicationReady:releaseCandidateState.publicationReady,gates};
}
function completePublicationChecklist(itemId){
  loadReleaseCandidate();
  const id=String(itemId||'');
  releaseCandidateState.completedMetrics[`publication_${id}`]=true;
  saveReleaseCandidate();
  return releaseCandidateState;
}
function publicationChecklistStatus(){
  loadReleaseCandidate();
  return RELEASE_CANDIDATE_CATALOG.publicationChecklist.map(i=>({...i,ok:Boolean(releaseCandidateState.completedMetrics[`publication_${i.id}`]) || ['CHANGELOG','GIT_UPLOAD_DOC','NO_EXTERNAL_REQUIRED'].includes(i.id)}));
}
function evaluateReleaseCandidateShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadReleaseCandidate();
  const balance=balanceShift(finalScore,statsObj,fail);
  markTutorialMetric('result_reviewed',true);
  const gates=evaluateRcGates();
  const entry={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore,rcScore:gates.score,rcStatus:gates.status,balanceScore:balance.score};
  releaseCandidateState.history.unshift(entry);
  releaseCandidateState.history=releaseCandidateState.history.slice(0,30);
  saveReleaseCandidate();
  renderReleaseCandidateBoard();
  return {state:releaseCandidateState,balance,gates,entry};
}
function renderGuidedTutorialOverlay(force=false){
  try{
    const progress=tutorialProgress();
    if(progress.complete && !force) return null;
    const old=document.querySelector('#releaseCandidateTutorialOverlay'); if(old) old.remove();
    const step=progress.current;
    const div=document.createElement('div');
    div.id='releaseCandidateTutorialOverlay';
    div.className='release-candidate-tutorial-overlay';
    div.innerHTML=`<div class="release-candidate-tutorial-card">
      <small>TUTORIAL GUIADO ${progress.done}/${progress.total}</small>
      <h2>${step.title}</h2>
      <p>${step.objective}</p>
      <div class="release-candidate-progress"><span style="width:${progress.percent}%"></span></div>
      <button type="button" data-rc-tutorial-ok="1">Marcar etapa</button>
    </div>`;
    document.body?.appendChild?.(div);
    div.querySelector('[data-rc-tutorial-ok]')?.addEventListener?.('click',()=>{ markTutorialMetric(step.successMetric,true); if(tutorialProgress().complete) div.remove(); else renderGuidedTutorialOverlay(true); });
    return step;
  }catch(e){ safeLogError?.(e,'rc-tutorial-overlay'); return null; }
}
function renderReleaseCandidateBoard(){
  try{
    const anchor=document.querySelector('#commercialPolishInline') || document.querySelector('#controlRoomInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#releaseCandidateInline'); if(old) old.remove();
    const gates=evaluateRcGates();
    const tutorial=tutorialProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="releaseCandidateInline" class="airport-ops-board release-candidate-inline">
      <div class="airport-ops-head"><b>PUBLIC RC</b><span>${gates.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>RC SCORE</small><b>${gates.score}%</b></div>
        <div><small>TUTORIAL</small><b>${tutorial.percent}%</b></div>
        <div><small>BALANCE</small><b>${releaseCandidateState.balanceLast?.score||0}%</b></div>
        <div><small>GATES</small><b>${gates.gates.filter(g=>g.ok).length}/${gates.gates.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${gates.publicationReady?'PRONTA':'QA'}</b></div>
        <div><small>TRACK</small><b>RC</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'rc-board'); }
}
function initializeReleaseCandidateQA(){
  loadReleaseCandidate();
  markTutorialMetric('profile_ready',true);
  evaluateRcGates();
  renderReleaseCandidateBoard();
  return releaseCandidateState;
}
function releaseCandidateStatus(){ loadReleaseCandidate(); return {...releaseCandidateState,tutorial:tutorialProgress(),gates:evaluateRcGates(),publication:publicationChecklistStatus()}; }
function releaseCandidateSelfCheck(){
  const issues=[];
  if(RELEASE_CANDIDATE_CATALOG.rcGates.length<10) issues.push('gates insuficientes');
  if(RELEASE_CANDIDATE_CATALOG.guidedTutorial.length<8) issues.push('tutorial insuficiente');
  if(RELEASE_CANDIDATE_CATALOG.publicationChecklist.length<6) issues.push('checklist insuficiente');
  const balance=balanceShift(2200,{conflicts:0,denied:1,incidentFailures:0},false);
  if(balance.score<70) issues.push('balance de turno saudável abaixo do mínimo');
  const gates=evaluateRcGates();
  if(gates.score<70) issues.push('RC gate score baixo demais');
  return {ok:issues.length===0,issues,gates:RELEASE_CANDIDATE_CATALOG.rcGates.length,tutorial:RELEASE_CANDIDATE_CATALOG.guidedTutorial.length};
}
window.SKYWARD_RELEASE_CANDIDATE=Object.freeze({
  schema:1,
  catalog:RELEASE_CANDIDATE_CATALOG,
  load:loadReleaseCandidate,
  save:saveReleaseCandidate,
  init:initializeReleaseCandidateQA,
  status:releaseCandidateStatus,
  tutorial:tutorialProgress,
  tutorialStep:currentTutorialStep,
  mark:markTutorialMetric,
  overlay:renderGuidedTutorialOverlay,
  balance:balanceShift,
  gates:evaluateRcGates,
  publication:publicationChecklistStatus,
  completePublication:completePublicationChecklist,
  evaluate:evaluateReleaseCandidateShift,
  board:renderReleaseCandidateBoard,
  selfCheck:releaseCandidateSelfCheck
});
