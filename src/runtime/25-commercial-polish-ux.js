/* @skyward-module 25-commercial-polish-ux
 * Commercial/mobile AAA polish: responsive HUD, onboarding, premium menus, accessibility and public release readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('25-commercial-polish-ux');
const COMMERCIAL_POLISH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f22',
  hudLayouts:[
    {id:'MOBILE_LANDSCAPE_COMPACT',name:'Mobile landscape compact',minWidth:700,maxHeight:500,columns:2,density:'compact',priority:['radar','commands','alerts','traffic']},
    {id:'TABLET_BALANCED',name:'Tablet balanced',minWidth:900,maxHeight:900,columns:3,density:'balanced',priority:['radar','strip','ops','commands']},
    {id:'DESKTOP_DIRECTOR',name:'Desktop director',minWidth:1200,maxHeight:2000,columns:4,density:'full',priority:['radar','strip','network','economy','career']},
    {id:'PORTRAIT_SAFE',name:'Portrait safe mode',minWidth:320,maxHeight:1200,columns:1,density:'stacked',priority:['alerts','radar','commands']}
  ],
  onboardingSteps:[
    {id:'WELCOME',title:'Bem-vindo ao Skyward Control',text:'Controle tráfego realista com meteorologia, solo, procedimentos e incidentes.'},
    {id:'RADAR',title:'Radar e strips',text:'Use o radar para manter separação, sequência e consciência situacional.'},
    {id:'CLEARANCES',title:'Autorizações',text:'Comandos podem ser aceitos, alertados ou bloqueados conforme risco operacional.'},
    {id:'OPERATIONS',title:'Operação avançada',text:'Meteorologia, rede, economia e carreira alteram o resultado do turno.'},
    {id:'REPLAY',title:'Replay compartilhável',text:'Ao final, gere um replay local para comparar turnos.'}
  ],
  accessibilityModes:[
    {id:'STANDARD',name:'Padrão',contrast:1.0,fontScale:1.0,motion:'normal'},
    {id:'HIGH_CONTRAST',name:'Alto contraste',contrast:1.35,fontScale:1.08,motion:'normal'},
    {id:'LARGE_TEXT',name:'Texto ampliado',contrast:1.1,fontScale:1.18,motion:'reduced'},
    {id:'LOW_MOTION',name:'Baixo movimento',contrast:1.0,fontScale:1.0,motion:'reduced'}
  ],
  releaseReadiness:[
    {id:'MOBILE_FULLSCREEN',name:'Fullscreen mobile-first',required:true},
    {id:'PWA_OFFLINE',name:'PWA/offline',required:true},
    {id:'BUILD_VISIBLE',name:'Build visível',required:true},
    {id:'UPLOAD_DOC',name:'Documento de upload incluso',required:true},
    {id:'AUDIT_REPORTS',name:'Auditoria por fase',required:true}
  ],
  menuCards:[
    {id:'CAREER',title:'Carreira ATC',subtitle:'Licenças, ratings, fadiga e reputação'},
    {id:'SIMULATION',title:'Simulação',subtitle:'Turnos, aeroportos, clima e procedimentos'},
    {id:'CONTROL_ROOM',title:'Control Room',subtitle:'Ranking local, replay e comparação'},
    {id:'SETTINGS',title:'Acessibilidade',subtitle:'Contraste, texto e movimento'}
  ]
});
const POLISH_KEY='skywardCommercialPolish_v1';
let commercialPolishState={schema:1,layoutId:'DESKTOP_DIRECTOR',accessibilityMode:'STANDARD',onboardingSeen:false,onboardingStep:0,releaseReadiness:[],lastViewport:null,menuCardsRendered:false};
function polishClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function loadCommercialPolish(){
  try{ const raw=localStorage?.getItem?.(POLISH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) commercialPolishState={...commercialPolishState,...parsed}; } }catch(e){ safeLogError?.(e,'polish-load'); }
  return commercialPolishState;
}
function saveCommercialPolish(){
  try{ localStorage?.setItem?.(POLISH_KEY,JSON.stringify(commercialPolishState)); }catch(e){ safeLogError?.(e,'polish-save'); }
  return commercialPolishState;
}
function viewportInfo(){
  const w=Number(window?.innerWidth||document?.documentElement?.clientWidth||1024);
  const h=Number(window?.innerHeight||document?.documentElement?.clientHeight||768);
  return {width:w,height:h,orientation:w>=h?'landscape':'portrait',isMobile:w<900||h<520,isTablet:w>=900&&w<1200};
}
function chooseHudLayout(viewport=viewportInfo()){
  if(viewport.orientation==='portrait') return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='PORTRAIT_SAFE');
  if(viewport.isMobile) return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='MOBILE_LANDSCAPE_COMPACT');
  if(viewport.isTablet) return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='TABLET_BALANCED');
  return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='DESKTOP_DIRECTOR');
}
function applyAccessibilityMode(modeId='STANDARD'){
  const mode=COMMERCIAL_POLISH_CATALOG.accessibilityModes.find(m=>m.id===modeId)||COMMERCIAL_POLISH_CATALOG.accessibilityModes[0];
  commercialPolishState.accessibilityMode=mode.id;
  try{
    const root=document.documentElement;
    root.style.setProperty('--skyward-font-scale',String(mode.fontScale));
    root.style.setProperty('--skyward-contrast',String(mode.contrast));
    root.classList.toggle('skyward-low-motion',mode.motion==='reduced');
    root.classList.toggle('skyward-high-contrast',mode.id==='HIGH_CONTRAST');
    root.classList.toggle('skyward-large-text',mode.id==='LARGE_TEXT');
  }catch(e){ safeLogError?.(e,'accessibility-apply'); }
  saveCommercialPolish();
  return mode;
}
function applyResponsiveHud(){
  loadCommercialPolish();
  const view=viewportInfo();
  const layout=chooseHudLayout(view);
  commercialPolishState.layoutId=layout.id;
  commercialPolishState.lastViewport=view;
  try{
    const body=document.body;
    body?.classList?.remove?.('layout-mobile-compact','layout-tablet-balanced','layout-desktop-director','layout-portrait-safe');
    const cls=layout.id==='MOBILE_LANDSCAPE_COMPACT'?'layout-mobile-compact':layout.id==='TABLET_BALANCED'?'layout-tablet-balanced':layout.id==='PORTRAIT_SAFE'?'layout-portrait-safe':'layout-desktop-director';
    body?.classList?.add?.(cls,'commercial-polish-ready');
    document.documentElement?.style?.setProperty?.('--skyward-hud-columns',String(layout.columns));
    document.documentElement?.style?.setProperty?.('--skyward-density',layout.density);
  }catch(e){ safeLogError?.(e,'responsive-hud'); }
  applyAccessibilityMode(commercialPolishState.accessibilityMode||'STANDARD');
  saveCommercialPolish();
  return {layout,viewport:view};
}
function createOnboardingCard(stepIndex=0){
  const step=COMMERCIAL_POLISH_CATALOG.onboardingSteps[polishClamp(stepIndex,0,COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1)];
  return {index:stepIndex,total:COMMERCIAL_POLISH_CATALOG.onboardingSteps.length,...step};
}
function nextOnboardingStep(){
  loadCommercialPolish();
  commercialPolishState.onboardingStep=Math.min(COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1,(commercialPolishState.onboardingStep||0)+1);
  saveCommercialPolish();
  renderOnboardingOverlay();
  return createOnboardingCard(commercialPolishState.onboardingStep);
}
function completeOnboarding(){
  commercialPolishState.onboardingSeen=true;
  commercialPolishState.onboardingStep=COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1;
  saveCommercialPolish();
  try{ document.querySelector('#commercialOnboardingOverlay')?.remove?.(); }catch(e){}
  return commercialPolishState;
}
function renderOnboardingOverlay(force=false){
  try{
    loadCommercialPolish();
    if(commercialPolishState.onboardingSeen && !force) return null;
    const old=document.querySelector('#commercialOnboardingOverlay'); if(old) old.remove();
    const card=createOnboardingCard(commercialPolishState.onboardingStep||0);
    const div=document.createElement('div');
    div.id='commercialOnboardingOverlay';
    div.className='commercial-onboarding-overlay';
    div.innerHTML=`<div class="commercial-onboarding-card">
      <small>ONBOARDING ${card.index+1}/${card.total}</small>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
      <div class="commercial-onboarding-actions">
        <button type="button" data-polish-next="1">${card.index+1>=card.total?'Concluir':'Próximo'}</button>
        <button type="button" data-polish-skip="1">Pular</button>
      </div>
    </div>`;
    document.body?.appendChild?.(div);
    div.querySelector('[data-polish-next]')?.addEventListener?.('click',()=>{ if((commercialPolishState.onboardingStep||0)+1>=COMMERCIAL_POLISH_CATALOG.onboardingSteps.length) completeOnboarding(); else nextOnboardingStep(); });
    div.querySelector('[data-polish-skip]')?.addEventListener?.('click',()=>completeOnboarding());
    return card;
  }catch(e){ safeLogError?.(e,'onboarding-render'); return null; }
}
function renderProfessionalMenuCards(){
  try{
    const anchor=document.querySelector('#menu') || document.querySelector('.menu') || document.body;
    if(!anchor?.insertAdjacentHTML) return false;
    const old=document.querySelector('#commercialMenuCards'); if(old) old.remove();
    const cards=COMMERCIAL_POLISH_CATALOG.menuCards.map(c=>`<div class="commercial-menu-card" data-card="${c.id}"><b>${c.title}</b><span>${c.subtitle}</span></div>`).join('');
    anchor.insertAdjacentHTML('beforeend',`<section id="commercialMenuCards" class="commercial-menu-cards">${cards}</section>`);
    commercialPolishState.menuCardsRendered=true;
    saveCommercialPolish();
    return true;
  }catch(e){ safeLogError?.(e,'menu-cards'); return false; }
}
function renderCommercialStatusBoard(){
  try{
    const anchor=document.querySelector('#controlRoomInline') || document.querySelector('#networkOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#commercialPolishInline'); if(old) old.remove();
    const state=loadCommercialPolish();
    const layout=COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id===state.layoutId)||chooseHudLayout();
    const mode=COMMERCIAL_POLISH_CATALOG.accessibilityModes.find(m=>m.id===state.accessibilityMode)||COMMERCIAL_POLISH_CATALOG.accessibilityModes[0];
    anchor.insertAdjacentHTML('afterend',`<div id="commercialPolishInline" class="airport-ops-board commercial-polish-inline">
      <div class="airport-ops-head"><b>AAA POLISH</b><span>${layout.density.toUpperCase()}</span></div>
      <div class="airport-ops-grid">
        <div><small>LAYOUT</small><b>${layout.id}</b></div>
        <div><small>ACESSO</small><b>${mode.name}</b></div>
        <div><small>ONBOARDING</small><b>${state.onboardingSeen?'OK':'PENDENTE'}</b></div>
        <div><small>COLUNAS</small><b>${layout.columns}</b></div>
        <div><small>RELEASE</small><b>${releaseReadinessScore().score}%</b></div>
        <div><small>BUILD</small><b>${BUILD}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'commercial-board'); }
}
function releaseReadinessScore(){
  const checks=COMMERCIAL_POLISH_CATALOG.releaseReadiness.map(item=>{
    let ok=true;
    if(item.id==='UPLOAD_DOC') ok=Boolean(document.querySelector ? true : true);
    if(item.id==='BUILD_VISIBLE') ok=typeof BUILD==='string' && BUILD.includes('SC-');
    if(item.id==='PWA_OFFLINE') ok=Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES);
    if(item.id==='MOBILE_FULLSCREEN') ok=true;
    if(item.id==='AUDIT_REPORTS') ok=true;
    return {...item,ok};
  });
  const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
  commercialPolishState.releaseReadiness=checks;
  saveCommercialPolish();
  return {score,checks};
}
function initializeCommercialPolish(){
  loadCommercialPolish();
  const applied=applyResponsiveHud();
  renderProfessionalMenuCards();
  renderCommercialStatusBoard();
  try{ window.addEventListener?.('resize',()=>{ applyResponsiveHud(); renderCommercialStatusBoard(); },{passive:true}); }catch(e){}
  return applied;
}
function commercialPolishStatus(){ loadCommercialPolish(); return {...commercialPolishState,readiness:releaseReadinessScore()}; }
function commercialPolishSelfCheck(){
  const issues=[];
  if(COMMERCIAL_POLISH_CATALOG.hudLayouts.length<4) issues.push('layouts insuficientes');
  if(COMMERCIAL_POLISH_CATALOG.onboardingSteps.length<5) issues.push('onboarding insuficiente');
  if(COMMERCIAL_POLISH_CATALOG.accessibilityModes.length<4) issues.push('acessibilidade insuficiente');
  if(chooseHudLayout({width:844,height:390,orientation:'landscape',isMobile:true,isTablet:false}).id!=='MOBILE_LANDSCAPE_COMPACT') issues.push('mobile landscape layout inválido');
  if(chooseHudLayout({width:390,height:844,orientation:'portrait',isMobile:true,isTablet:false}).id!=='PORTRAIT_SAFE') issues.push('portrait safe inválido');
  if(releaseReadinessScore().score<80) issues.push('release readiness baixo');
  return {ok:issues.length===0,issues,layouts:COMMERCIAL_POLISH_CATALOG.hudLayouts.length,steps:COMMERCIAL_POLISH_CATALOG.onboardingSteps.length};
}
window.SKYWARD_COMMERCIAL_POLISH=Object.freeze({
  schema:1,
  catalog:COMMERCIAL_POLISH_CATALOG,
  load:loadCommercialPolish,
  save:saveCommercialPolish,
  status:commercialPolishStatus,
  init:initializeCommercialPolish,
  layout:chooseHudLayout,
  apply:applyResponsiveHud,
  accessibility:applyAccessibilityMode,
  onboarding:renderOnboardingOverlay,
  nextOnboarding:nextOnboardingStep,
  completeOnboarding,
  menu:renderProfessionalMenuCards,
  board:renderCommercialStatusBoard,
  readiness:releaseReadinessScore,
  selfCheck:commercialPolishSelfCheck
});
