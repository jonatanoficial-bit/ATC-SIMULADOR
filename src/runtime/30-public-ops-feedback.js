/* @skyward-module 30-public-ops-feedback
 * Public operations feedback, offline telemetry, bug inbox and hotfix planning.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('30-public-ops-feedback');
const PUBLIC_OPS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f27',
  feedbackCategories:[
    {id:'GAMEPLAY',name:'Gameplay / realismo',priority:3},
    {id:'MOBILE_UX',name:'Mobile / toque / rolagem',priority:5},
    {id:'PERFORMANCE',name:'Performance / travamento',priority:5},
    {id:'ATC_REALISM',name:'Procedimentos ATC',priority:4},
    {id:'VISUAL',name:'Visual / HUD',priority:2},
    {id:'AUDIO',name:'Áudio / alertas',priority:2}
  ],
  telemetryCounters:[
    {id:'sessions',name:'Sessões abertas'},
    {id:'turnsStarted',name:'Turnos iniciados'},
    {id:'turnsCompleted',name:'Turnos concluídos'},
    {id:'criticalBugs',name:'Bugs críticos reportados'},
    {id:'feedbackItems',name:'Feedbacks registrados'},
    {id:'hotfixCandidates',name:'Candidatos a hotfix'}
  ],
  bugSeverity:[
    {id:'BLOCKER',name:'Bloqueador',releaseAction:'Hotfix imediato antes de divulgar'},
    {id:'CRITICAL',name:'Crítico',releaseAction:'Hotfix antes de próxima campanha'},
    {id:'MAJOR',name:'Maior',releaseAction:'Planejar patch curto'},
    {id:'MINOR',name:'Menor',releaseAction:'Agrupar em polish patch'}
  ],
  hotfixTemplates:[
    {id:'MOBILE_SCROLL_PATCH',name:'Patch rolagem mobile',severity:'MAJOR',files:['style.css','src/runtime/25-commercial-polish-ux.js']},
    {id:'PWA_CACHE_PATCH',name:'Patch cache PWA',severity:'CRITICAL',files:['sw.js','tools/build-pwa.mjs','pwa-cache-manifest.json']},
    {id:'SAVE_SCHEMA_PATCH',name:'Patch save/schema',severity:'CRITICAL',files:['src/runtime/03-storage-save.js','build-info.js']},
    {id:'ATC_COMMAND_PATCH',name:'Patch comandos ATC',severity:'MAJOR',files:['src/runtime/09-ui-clearances.js','src/runtime/07-simulation-safety.js']},
    {id:'VISUAL_HUD_PATCH',name:'Patch HUD visual',severity:'MINOR',files:['style.css','src/runtime/25-commercial-polish-ux.js']}
  ],
  publicOpsTargets:{maxCriticalOpen:0,maxMajorOpen:3,minCompletionRatio:.45,minSatisfaction:4,hotfixThreshold:70}
});
const PUBLIC_OPS_KEY='skywardPublicOps_v1';
let publicOpsState={schema:1,counters:{sessions:0,turnsStarted:0,turnsCompleted:0,criticalBugs:0,feedbackItems:0,hotfixCandidates:0},feedback:[],bugs:[],hotfixPlan:[],opsScore:0,status:'UNRATED',lastSummary:null};
function loadPublicOps(){
  try{ const raw=localStorage?.getItem?.(PUBLIC_OPS_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) publicOpsState={...publicOpsState,...parsed}; } }catch(e){ safeLogError?.(e,'public-ops-load'); }
  return publicOpsState;
}
function savePublicOps(){
  try{ localStorage?.setItem?.(PUBLIC_OPS_KEY,JSON.stringify(publicOpsState)); }catch(e){ safeLogError?.(e,'public-ops-save'); }
  return publicOpsState;
}
function incPublicOpsCounter(id, amount=1){
  loadPublicOps();
  publicOpsState.counters[id]=(Number(publicOpsState.counters[id]||0)+Number(amount||1));
  savePublicOps();
  return publicOpsState.counters[id];
}
function startPublicOpsSession(){
  loadPublicOps();
  incPublicOpsCounter('sessions',1);
  evaluatePublicOps();
  renderPublicOpsBoard();
  return publicOpsState;
}
function markPublicTurnStarted(){ incPublicOpsCounter('turnsStarted',1); renderPublicOpsBoard(); return publicOpsState; }
function markPublicTurnCompleted(){ incPublicOpsCounter('turnsCompleted',1); renderPublicOpsBoard(); return publicOpsState; }
function addPublicFeedback(category='GAMEPLAY',rating=5,message=''){
  loadPublicOps();
  const cat=PUBLIC_OPS_CATALOG.feedbackCategories.find(c=>c.id===category)||PUBLIC_OPS_CATALOG.feedbackCategories[0];
  const item={id:`FDB-${String(Date.now()).slice(-6)}`,at:new Date().toISOString(),category:cat.id,rating:Math.max(1,Math.min(5,Number(rating)||5)),message:String(message||'').slice(0,240),build:BUILD};
  publicOpsState.feedback.unshift(item);
  publicOpsState.feedback=publicOpsState.feedback.slice(0,80);
  publicOpsState.counters.feedbackItems=publicOpsState.feedback.length;
  savePublicOps();
  renderPublicOpsBoard();
  return item;
}
function reportPublicBug(severity='MINOR',title='Bug reportado',steps=''){
  loadPublicOps();
  const sev=PUBLIC_OPS_CATALOG.bugSeverity.find(s=>s.id===String(severity||'').toUpperCase())||PUBLIC_OPS_CATALOG.bugSeverity.at(-1);
  const bug={id:`PUBBUG-${String(Date.now()).slice(-6)}`,at:new Date().toISOString(),severity:sev.id,title:String(title||'Bug reportado').slice(0,90),steps:String(steps||'').slice(0,500),status:'OPEN',releaseAction:sev.releaseAction,build:BUILD};
  publicOpsState.bugs.unshift(bug);
  publicOpsState.bugs=publicOpsState.bugs.slice(0,80);
  publicOpsState.counters.criticalBugs=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  generateHotfixPlan();
  savePublicOps();
  renderPublicOpsBoard();
  return bug;
}
function closePublicBug(id){
  loadPublicOps();
  const bug=publicOpsState.bugs.find(b=>b.id===id);
  if(bug){ bug.status='CLOSED'; bug.closedAt=new Date().toISOString(); }
  publicOpsState.counters.criticalBugs=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  generateHotfixPlan();
  savePublicOps();
  renderPublicOpsBoard();
  return bug||null;
}
function generateHotfixPlan(){
  const open=publicOpsState.bugs.filter(b=>b.status!=='CLOSED');
  const plans=[];
  for(const bug of open){
    let tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.severity===bug.severity) || PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.severity==='MAJOR');
    if(/cache|pwa|offline/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='PWA_CACHE_PATCH');
    if(/scroll|toque|touch|mobile|rolagem/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='MOBILE_SCROLL_PATCH');
    if(/save|salv/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='SAVE_SCHEMA_PATCH');
    plans.push({bugId:bug.id,templateId:tpl.id,name:tpl.name,severity:bug.severity,files:tpl.files,action:bug.releaseAction});
  }
  publicOpsState.hotfixPlan=plans.slice(0,20);
  publicOpsState.counters.hotfixCandidates=publicOpsState.hotfixPlan.length;
  return publicOpsState.hotfixPlan;
}
function publicOpsCompletionRatio(){
  const started=Number(publicOpsState.counters.turnsStarted||0);
  return started?Number(((publicOpsState.counters.turnsCompleted||0)/started).toFixed(2)):0;
}
function publicOpsSatisfaction(){
  const fb=publicOpsState.feedback||[];
  if(!fb.length) return 5;
  return Number((fb.reduce((a,b)=>a+Number(b.rating||0),0)/fb.length).toFixed(2));
}
function evaluatePublicOps(){
  loadPublicOps();
  generateHotfixPlan();
  const targets=PUBLIC_OPS_CATALOG.publicOpsTargets;
  const criticalOpen=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  const majorOpen=publicOpsState.bugs.filter(b=>b.severity==='MAJOR'&&b.status!=='CLOSED').length;
  const completion=publicOpsCompletionRatio();
  const satisfaction=publicOpsSatisfaction();
  let score=100;
  if(criticalOpen>targets.maxCriticalOpen) score-=45;
  if(majorOpen>targets.maxMajorOpen) score-=20;
  if(completion<targets.minCompletionRatio && (publicOpsState.counters.turnsStarted||0)>2) score-=15;
  if(satisfaction<targets.minSatisfaction) score-=15;
  score=Math.max(0,Math.min(100,Math.round(score)));
  publicOpsState.opsScore=score;
  publicOpsState.status=criticalOpen?'HOTFIX_REQUIRED':score>=90?'PUBLIC_STABLE':score>=75?'WATCHLIST':'PATCH_RECOMMENDED';
  publicOpsState.lastSummary={at:new Date().toISOString(),build:BUILD,score,status:publicOpsState.status,criticalOpen,majorOpen,completion,satisfaction,hotfixCandidates:publicOpsState.hotfixPlan.length};
  savePublicOps();
  return publicOpsState.lastSummary;
}
function exportPublicOpsDossier(){
  loadPublicOps();
  return JSON.stringify({schema:1,build:BUILD,summary:evaluatePublicOps(),feedback:publicOpsState.feedback,bugs:publicOpsState.bugs,hotfixPlan:publicOpsState.hotfixPlan,counters:publicOpsState.counters},null,2);
}
function renderPublicOpsBoard(){
  try{
    const anchor=document.querySelector('#postPublishHealthInline') || document.querySelector('#postGoldMasterInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#publicOpsInline'); if(old) old.remove();
    const summary=evaluatePublicOps();
    anchor.insertAdjacentHTML('afterend',`<div id="publicOpsInline" class="airport-ops-board public-ops-inline">
      <div class="airport-ops-head"><b>PUBLIC OPS</b><span>${summary.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>OPS SCORE</small><b>${summary.score}%</b></div>
        <div><small>SESSÕES</small><b>${publicOpsState.counters.sessions||0}</b></div>
        <div><small>TURNOS</small><b>${publicOpsState.counters.turnsCompleted||0}/${publicOpsState.counters.turnsStarted||0}</b></div>
        <div><small>FEEDBACK</small><b>${publicOpsState.feedback.length}</b></div>
        <div><small>BUGS CRIT</small><b>${summary.criticalOpen}</b></div>
        <div><small>HOTFIX</small><b>${summary.hotfixCandidates}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'public-ops-board'); }
}
function initializePublicOps(){
  startPublicOpsSession();
  return publicOpsState;
}
function publicOpsStatus(){
  loadPublicOps();
  return {...publicOpsState,summary:evaluatePublicOps(),dossier:exportPublicOpsDossier(),catalog:PUBLIC_OPS_CATALOG};
}
function publicOpsSelfCheck(){
  const issues=[];
  if(PUBLIC_OPS_CATALOG.feedbackCategories.length<6) issues.push('categorias insuficientes');
  if(PUBLIC_OPS_CATALOG.hotfixTemplates.length<5) issues.push('templates hotfix insuficientes');
  if(PUBLIC_OPS_CATALOG.telemetryCounters.length<6) issues.push('telemetria insuficiente');
  const f=addPublicFeedback('MOBILE_UX',5,'selfcheck');
  const b=reportPublicBug('MINOR','selfcheck minor','nenhum');
  if(!f.id || !b.id) issues.push('feedback/bug não registrou');
  closePublicBug(b.id);
  return {ok:issues.length===0,issues,categories:PUBLIC_OPS_CATALOG.feedbackCategories.length,templates:PUBLIC_OPS_CATALOG.hotfixTemplates.length};
}
window.SKYWARD_PUBLIC_OPS=Object.freeze({
  schema:1,
  catalog:PUBLIC_OPS_CATALOG,
  load:loadPublicOps,
  save:savePublicOps,
  init:initializePublicOps,
  startTurn:markPublicTurnStarted,
  completeTurn:markPublicTurnCompleted,
  feedback:addPublicFeedback,
  bug:reportPublicBug,
  closeBug:closePublicBug,
  hotfixPlan:generateHotfixPlan,
  evaluate:evaluatePublicOps,
  export:exportPublicOpsDossier,
  status:publicOpsStatus,
  board:renderPublicOpsBoard,
  selfCheck:publicOpsSelfCheck
});
