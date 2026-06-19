/* @skyward-module 29-post-publish-healthcheck
 * Post-publish healthcheck, GitHub Pages/PWA diagnostics, manual QA capture and hotfix deck.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('29-post-publish-healthcheck');
const POST_PUBLISH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f26',
  healthChecks:[
    {id:'PUBLIC_URL',name:'URL pública abre index',required:true,weight:14},
    {id:'BUILD_MATCH',name:'Build pública confere com ZIP',required:true,weight:12},
    {id:'HTTPS',name:'HTTPS ativo',required:true,weight:8},
    {id:'SERVICE_WORKER',name:'Service worker registrado',required:true,weight:12},
    {id:'CACHE_READY',name:'Cache PWA pronto',required:true,weight:10},
    {id:'OFFLINE_BOOT',name:'Abre offline após instalar',required:true,weight:12},
    {id:'MOBILE_LANDSCAPE',name:'Mobile landscape jogável',required:true,weight:12},
    {id:'SAVE_RESTORE',name:'Save/restauração OK',required:true,weight:8},
    {id:'SCREENSHOTS',name:'Screenshots finais capturados',required:false,weight:6},
    {id:'NO_BLOCKERS',name:'Sem blockers/critical abertos',required:true,weight:6}
  ],
  hotfixDeck:[
    {id:'HF_BOOT_WHITE_SCREEN',severity:'BLOCKER',title:'Tela branca no boot',firstAction:'limpar cache/PWA e conferir console'},
    {id:'HF_PWA_STALE_CACHE',severity:'CRITICAL',title:'PWA abre build antiga',firstAction:'trocar cacheName e atualizar service worker'},
    {id:'HF_TOUCH_SCROLL',severity:'MAJOR',title:'Scroll/touch ruim no celular',firstAction:'ajustar overflow/touch-action em layout mobile'},
    {id:'HF_OFFLINE_ASSET',severity:'CRITICAL',title:'Asset não carrega offline',firstAction:'incluir no pwa-cache-manifest e service worker'},
    {id:'HF_SAVE_RESET',severity:'CRITICAL',title:'Save some após update',firstAction:'verificar schema/migração/localStorage'}
  ],
  publicVerification:{repo:'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',expectedUrl:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/',branch:'main',rootPath:'/',localPath:'/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO'},
  manualCaptureFields:['device','browser','url','orientation','pwaInstalled','offlineWorks','buildVisible','notes'],
  promotionRules:[
    {id:'PROMOTE_PUBLIC',name:'Pode anunciar link público',minHealth:90,requiresNoCritical:true},
    {id:'HOTFIX_REQUIRED',name:'Gerar hotfix antes de divulgar',maxHealth:74,requiresNoCritical:false},
    {id:'OBSERVE',name:'Publicar com observação',minHealth:75,requiresNoCritical:true}
  ]
});
const POST_PUBLISH_KEY='skywardPostPublishHealth_v1';
let postPublishState={schema:1,checks:{},captures:[],hotfixes:[],healthScore:0,status:'UNRATED',lastEvaluation:null};
function loadPostPublishHealth(){
  try{ const raw=localStorage?.getItem?.(POST_PUBLISH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) postPublishState={...postPublishState,...parsed}; } }catch(e){ safeLogError?.(e,'post-publish-load'); }
  return postPublishState;
}
function savePostPublishHealth(){
  try{ localStorage?.setItem?.(POST_PUBLISH_KEY,JSON.stringify(postPublishState)); }catch(e){ safeLogError?.(e,'post-publish-save'); }
  return postPublishState;
}
function markPublishHealth(checkId, ok=true, note=''){
  loadPostPublishHealth();
  postPublishState.checks[String(checkId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return postPublishState.checks[String(checkId||'')];
}
function captureManualQA(payload={}){
  loadPostPublishHealth();
  const capture={id:`QA-${String(Date.now()).slice(-6)}`,at:new Date().toISOString()};
  for(const field of POST_PUBLISH_CATALOG.manualCaptureFields) capture[field]=payload[field] ?? '';
  postPublishState.captures.unshift(capture);
  postPublishState.captures=postPublishState.captures.slice(0,30);
  if(capture.buildVisible) markPublishHealth('BUILD_MATCH',true,'capturado no QA manual');
  if(capture.offlineWorks) markPublishHealth('OFFLINE_BOOT',true,'offline confirmado no QA manual');
  if(capture.pwaInstalled) markPublishHealth('CACHE_READY',true,'PWA instalada no QA manual');
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return capture;
}
function openHotfix(deckId, note=''){
  loadPostPublishHealth();
  const tpl=POST_PUBLISH_CATALOG.hotfixDeck.find(h=>h.id===deckId)||POST_PUBLISH_CATALOG.hotfixDeck[0];
  const fix={id:`HFX-${String(Date.now()).slice(-6)}`,templateId:tpl.id,severity:tpl.severity,title:tpl.title,firstAction:tpl.firstAction,note:String(note||''),status:'OPEN',at:new Date().toISOString()};
  postPublishState.hotfixes.unshift(fix);
  postPublishState.hotfixes=postPublishState.hotfixes.slice(0,40);
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return fix;
}
function closeHotfix(hotfixId){
  loadPostPublishHealth();
  const h=postPublishState.hotfixes.find(x=>x.id===hotfixId);
  if(h){ h.status='CLOSED'; h.closedAt=new Date().toISOString(); }
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return h||null;
}
function detectLocalPublishSignals(){
  const protocol=String(location?.protocol||'');
  const href=String(location?.href||'');
  const serviceWorkerCapable=Boolean(navigator?.serviceWorker);
  const standalone=Boolean(window.matchMedia?.('(display-mode: standalone)')?.matches || navigator?.standalone);
  return {
    https: protocol==='https:' || href.startsWith('https://') || href.startsWith('file:'),
    publicUrl: href.includes('github.io') || href.startsWith('file:') || href.includes('localhost'),
    serviceWorkerCapable,
    standalone,
    buildMatch: typeof BUILD==='string' && BUILD.includes('SC-1.26.0-F26')
  };
}
function evaluatePostPublishHealth(){
  loadPostPublishHealth();
  const signals=detectLocalPublishSignals();
  if(signals.https) postPublishState.checks.HTTPS=postPublishState.checks.HTTPS||{ok:true,note:'sinal local detectado',at:new Date().toISOString()};
  if(signals.publicUrl) postPublishState.checks.PUBLIC_URL=postPublishState.checks.PUBLIC_URL||{ok:true,note:'URL local/pública detectada',at:new Date().toISOString()};
  if(signals.serviceWorkerCapable) postPublishState.checks.SERVICE_WORKER=postPublishState.checks.SERVICE_WORKER||{ok:true,note:'navigator.serviceWorker disponível',at:new Date().toISOString()};
  if(signals.buildMatch) postPublishState.checks.BUILD_MATCH=postPublishState.checks.BUILD_MATCH||{ok:true,note:'BUILD runtime confere',at:new Date().toISOString()};
  const criticalOpen=postPublishState.hotfixes.filter(h=>['BLOCKER','CRITICAL'].includes(h.severity)&&h.status!=='CLOSED');
  postPublishState.checks.NO_BLOCKERS={ok:criticalOpen.length===0,note:criticalOpen.length?'há blocker/critical aberto':'sem blocker/critical aberto',at:new Date().toISOString()};
  const total=POST_PUBLISH_CATALOG.healthChecks.reduce((a,c)=>a+c.weight,0);
  const earned=POST_PUBLISH_CATALOG.healthChecks.reduce((a,c)=>a+(postPublishState.checks[c.id]?.ok?c.weight:0),0);
  const score=Math.round(earned/total*100);
  postPublishState.healthScore=score;
  postPublishState.status=criticalOpen.length?'BLOCKED_BY_HOTFIX':score>=90?'PUBLIC_HEALTHY':score>=75?'PUBLIC_WITH_NOTES':'NEEDS_MANUAL_QA';
  postPublishState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:postPublishState.status,criticalOpen:criticalOpen.length,signals};
  savePostPublishHealth();
  return postPublishState.lastEvaluation;
}
function publishPromotionAdvice(){
  const ev=evaluatePostPublishHealth();
  const noCritical=ev.criticalOpen===0;
  if(ev.score>=90 && noCritical) return {rule:'PROMOTE_PUBLIC',message:'Pode anunciar o link público após conferência manual final.',evaluation:ev};
  if(ev.score>=75 && noCritical) return {rule:'OBSERVE',message:'Pode publicar com observações pendentes de screenshot/QA manual.',evaluation:ev};
  return {rule:'HOTFIX_REQUIRED',message:'Corrija pendências ou finalize QA manual antes de divulgar.',evaluation:ev};
}
function renderPostPublishHealthBoard(){
  try{
    const anchor=document.querySelector('#postGoldMasterInline') || document.querySelector('#goldMasterInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#postPublishHealthInline'); if(old) old.remove();
    const ev=evaluatePostPublishHealth();
    const passed=POST_PUBLISH_CATALOG.healthChecks.filter(c=>postPublishState.checks[c.id]?.ok).length;
    anchor.insertAdjacentHTML('afterend',`<div id="postPublishHealthInline" class="airport-ops-board post-publish-health-inline">
      <div class="airport-ops-head"><b>PUBLISH HEALTH</b><span>${ev.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>HEALTH</small><b>${ev.score}%</b></div>
        <div><small>CHECKS</small><b>${passed}/${POST_PUBLISH_CATALOG.healthChecks.length}</b></div>
        <div><small>QA MANUAL</small><b>${postPublishState.captures.length}</b></div>
        <div><small>HOTFIXES</small><b>${postPublishState.hotfixes.filter(h=>h.status!=='CLOSED').length}</b></div>
        <div><small>PAGES</small><b>${POST_PUBLISH_CATALOG.publicVerification.branch.toUpperCase()}</b></div>
        <div><small>PROMOÇÃO</small><b>${publishPromotionAdvice().rule}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'post-publish-board'); }
}
function initializePostPublishHealthcheck(){
  loadPostPublishHealth();
  evaluatePostPublishHealth();
  renderPostPublishHealthBoard();
  return postPublishState;
}
function postPublishStatus(){
  loadPostPublishHealth();
  return {...postPublishState,evaluation:evaluatePostPublishHealth(),advice:publishPromotionAdvice(),catalog:POST_PUBLISH_CATALOG};
}
function postPublishSelfCheck(){
  const issues=[];
  if(POST_PUBLISH_CATALOG.healthChecks.length<10) issues.push('health checks insuficientes');
  if(POST_PUBLISH_CATALOG.hotfixDeck.length<5) issues.push('hotfix deck insuficiente');
  if(!POST_PUBLISH_CATALOG.publicVerification.expectedUrl.includes('github.io')) issues.push('URL Pages inválida');
  const advice=publishPromotionAdvice();
  if(!advice.rule) issues.push('sem regra de promoção');
  return {ok:issues.length===0,issues,healthChecks:POST_PUBLISH_CATALOG.healthChecks.length,hotfixes:POST_PUBLISH_CATALOG.hotfixDeck.length};
}
window.SKYWARD_POST_PUBLISH_HEALTH=Object.freeze({
  schema:1,
  catalog:POST_PUBLISH_CATALOG,
  load:loadPostPublishHealth,
  save:savePostPublishHealth,
  init:initializePostPublishHealthcheck,
  mark:markPublishHealth,
  capture:captureManualQA,
  hotfix:openHotfix,
  closeHotfix,
  evaluate:evaluatePostPublishHealth,
  advice:publishPromotionAdvice,
  status:postPublishStatus,
  board:renderPostPublishHealthBoard,
  selfCheck:postPublishSelfCheck
});
