/* @skyward-module 11-mobile-runtime
 * Adaptive mobile UX, edge gestures, touch-safe dock, haptics and viewport modes.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('11-mobile-runtime');
const MOBILE_UX_SCHEMA = Number(BUILD_INFO.uxSchema || 1);
const MOBILE_PREFS_KEY = `skywardMobilePrefs_v${MOBILE_UX_SCHEMA}`;
const MOBILE_DEFAULT_PREFS = Object.freeze({ haptics:true, gestureCoach:true, density:'comfortable', lastTab:null });
let mobilePrefs = {...MOBILE_DEFAULT_PREFS, ...(safeStorageGet(MOBILE_PREFS_KEY,{}) || {})};
let mobileRenderSignature = '';
let mobileGestureState = null;
let mobileLongPressTimer = 0;
let mobileLastRadarTap = 0;
let mobileToastTimer = 0;

function mobileEsc(v){ return String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function mobileViewportMode(width=innerWidth,height=innerHeight){
  if(width<=980 && width>height) return 'mobile-landscape';
  if(width<=980) return 'mobile-portrait';
  if(width<=1180) return 'tablet';
  return 'desktop';
}
function mobileTouchTargetPx(mode=mobileViewportMode()){
  return mode==='mobile-landscape' ? 46 : mode==='mobile-portrait' ? 48 : mode==='tablet' ? 44 : 40;
}
function classifyMobileGesture(start,end,width=innerWidth,height=innerHeight){
  if(!start||!end) return 'none';
  const dx=end.x-start.x, dy=end.y-start.y, ax=Math.abs(dx), ay=Math.abs(dy);
  if(Math.max(ax,ay)<42) return 'tap';
  if(start.x<=Math.max(28,width*.045) && dx>70 && ax>ay*1.2) return 'open-requests';
  if(start.x>=width-Math.max(28,width*.045) && dx<-70 && ax>ay*1.2) return 'open-actions';
  if(dy>58 && ay>ax*1.15) return 'close-panel';
  if(ax>70 && ax>ay*1.25) return dx>0?'cycle-previous':'cycle-next';
  return 'none';
}
function saveMobilePrefs(){ mobilePrefs={...MOBILE_DEFAULT_PREFS,...mobilePrefs}; safeStorageSet(MOBILE_PREFS_KEY,mobilePrefs); applyMobilePreferences(); }
function applyMobilePreferences(){
  const root=document.documentElement;
  root.dataset.viewportMode=mobileViewportMode();
  root.dataset.mobileDensity=mobilePrefs.density;
  root.style.setProperty('--mobile-touch-target',`${mobileTouchTargetPx()}px`);
}
function mobileHaptic(pattern=12){
  try{ if(mobilePrefs.haptics && typeof navigator.vibrate==='function') navigator.vibrate(pattern); }catch(_e){}
}
function showMobileToast(text,level='ok'){
  const el=document.getElementById('mobileToast'); if(!el) return;
  el.textContent=text; el.className=`mobile-toast show ${level}`;
  clearTimeout(mobileToastTimer); mobileToastTimer=setTimeout(()=>el.classList.remove('show'),1500);
}
function mobileCommandButton(a,p){
  const risk = p ? commandRisk(p,a[1]) : {block:a[1]!=='nextRequest',level:'warn',msg:'Selecione aeronave'};
  const disabled = risk.block || a[1]==='noop';
  const label=`${a[0]}${disabled?' bloqueado':''}`;
  return `<button class="mobile-cmd ${a[2]||'dark'} ${disabled?'blocked':''}" data-cmd="${mobileEsc(a[1])}" aria-label="${mobileEsc(label)}" ${disabled?'disabled aria-disabled="true"':''}>
    <span>${mobileEsc(a[0])}</span><small>${disabled?'BLOQUEADO':mobileEsc(a[3]||'')}</small>
  </button>`;
}
function mobilePriority(p){
  const req=requests.find(r=>r.id===p.id);
  return (p.emergency?10000:0)+(req?requestPriorityScore(req)*100:0)+(p.risk||0)*50+(p.fuelState==='EMERGENCY'?5000:p.fuelState==='CRITICAL'?2500:0);
}
function mobileAircraftRows(){
  return [...aircraft].sort((a,b)=>mobilePriority(b)-mobilePriority(a)).map(p=>{
    const req=requests.find(r=>r.id===p.id); const isSelected=p.id===selected;
    return `<button class="mobile-aircraft ${isSelected?'selected':''} ${p.emergency?'urgent':p.risk>.4?'warn':''}" data-mobile-aircraft="${mobileEsc(p.id)}">
      <span><b>${mobileEsc(p.id)}</b><em>${mobileEsc(p.type)}</em></span>
      <span>${mobileEsc(p.status)} • FL${Math.round(p.alt)} • ${Math.round(p.speed)}kt</span>
      <small>${req?mobileEsc(req.text):`FUEL ${Math.round(p.fuel??0)}% • HDG ${Math.round(p.heading)}°`}</small>
    </button>`;
  }).join('') || '<div class="mobile-info-line">Nenhum tráfego ativo.</div>';
}
function mobileSafetyHtml(){
  const level=safetyState?.level||'ok';
  const msgs=(safetyState?.messages||['Operação normal']).slice(0,5).map(m=>`<div class="mobile-info-line ${level}">${mobileEsc(m)}</div>`).join('');
  return `<div class="mobile-safety-summary ${level}"><b>SAFETY ${Math.round(safetyState?.score??100)}%</b><span>${runwayOccupiedBy?`RWY ocupada: ${mobileEsc(runwayOccupiedBy)}`:'RWY livre'}</span></div>${msgs}
    <div class="mobile-info-line">${mobileEsc(emergencyDirector?.message||'Sem emergência ativa.')}</div>
    <div class="mobile-ux-settings">
      <button type="button" data-mobile-setting="haptics" aria-pressed="${mobilePrefs.haptics}">HÁPTICO ${mobilePrefs.haptics?'ON':'OFF'}</button>
      <button type="button" data-mobile-setting="density" aria-pressed="${mobilePrefs.density==='comfortable'}">TOQUE ${mobilePrefs.density==='comfortable'?'CONFORTÁVEL':'COMPACTO'}</button>
      <button type="button" data-mobile-setting="coach">GUIA DE GESTOS</button>
    </div>`;
}
function renderMobileGameplay(force=false){
  try{
    const layer=document.getElementById('mobileAtcLayer');
    const inGame=document.getElementById('game')?.classList.contains('active');
    if(!layer || !inGame){ document.body.classList.remove('game-active'); return; }
    document.body.classList.add('game-active'); applyMobilePreferences();
    const p=aircraft.find(x=>x.id===selected);
    const requestUrgent=requests.filter(r=>r.priority==='urgent').length;
    const safetyLevel=safetyState?.level||'ok';
    const signature=[selected,p?.status,p?.fuel,p?.alt,p?.speed,requests.length,requestUrgent,aircraft.length,safetyState?.score,safetyLevel,runwayOccupiedBy,emergencyDirector?.target,mobileActiveTab,mobilePrefs.haptics,mobilePrefs.density,Math.floor(performance.now()/1000)].join('|');
    if(!force && signature===mobileRenderSignature) return;
    mobileRenderSignature=signature;

    const mini=document.getElementById('mobileMiniStatus');
    if(mini){
      mini.textContent=`${airport().icao} • RWY ${runway.name} • ${runwayOccupiedBy?'OCUPADA '+runwayOccupiedBy:'LIVRE'} • SAFETY ${Math.round(safetyState?.score??100)}%${emergencyDirector?.active?' • MAYDAY '+emergencyDirector.target:''}`;
      mini.classList.toggle('warn',safetyLevel==='warn'); mini.classList.toggle('danger',safetyLevel==='danger');
    }
    const chip=document.getElementById('mobileSelectedChip');
    if(chip){
      chip.hidden=!p;
      document.getElementById('mobileSelectedChipId').textContent=p?.id||'---';
      document.getElementById('mobileSelectedChipData').textContent=p?`${p.status} • FL${Math.round(p.alt)} • ${Math.round(p.speed)}KT • F${Math.round(p.fuel??0)}%`:'SEM SELEÇÃO';
      chip.classList.toggle('danger',Boolean(p?.emergency||p?.fuelState==='EMERGENCY'));
    }
    const title=document.getElementById('mobileSelectedTitle');
    if(title) title.textContent=p?`${p.id} • ${p.status} • FUEL ${Math.round(p.fuel??0)}%`:'Nenhuma aeronave';
    const primary=document.getElementById('mobilePrimaryActions');
    if(primary) primary.innerHTML=contextActions(p).slice(0,6).map(a=>mobileCommandButton(a,p)).join('');
    const more=document.getElementById('mobileMoreActions');
    if(more) more.innerHTML=moreActions(p).map(a=>mobileCommandButton(a,p)).join('');
    const reqBadge=document.getElementById('mobileRequestsBadge');
    if(reqBadge){ reqBadge.textContent=requests.length>99?'99+':String(requests.length); reqBadge.hidden=requests.length===0; reqBadge.classList.toggle('urgent',requestUrgent>0); }
    const trafficBadge=document.getElementById('mobileTrafficBadge'); if(trafficBadge) trafficBadge.textContent=String(aircraft.length);
    const safetyBadge=document.getElementById('mobileSafetyBadge'); if(safetyBadge){ safetyBadge.hidden=safetyLevel==='ok'; safetyBadge.classList.toggle('urgent',safetyLevel==='danger'); }
    if(mobileActiveTab) renderMobilePanel(mobileActiveTab); else closeMobilePanels(false);
  }catch(e){ safeLogError(e,'mobile-render'); }
}
function closeMobilePanels(clearState=true){
  document.getElementById('mobilePanel')?.classList.remove('active');
  document.getElementById('mobileActionSheet')?.classList.remove('active');
  document.getElementById('mobilePanel')?.setAttribute('aria-hidden','true');
  document.getElementById('mobileActionSheet')?.setAttribute('aria-hidden','true');
  document.querySelectorAll('.mobile-nav').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-expanded','false'); });
  if(clearState) mobileActiveTab=null;
}
function setMobileTab(tab,options={}){
  const next=(mobileActiveTab===tab && options.toggle!==false)?null:(tab||null);
  mobileActiveTab=next; mobilePrefs.lastTab=next; saveMobilePrefs();
  document.querySelectorAll('.mobile-nav').forEach(b=>{ const active=b.dataset.mobileTab===next; b.classList.toggle('active',active); b.setAttribute('aria-expanded',String(active)); });
  if(next){ mobileHaptic(10); renderMobilePanel(next); } else closeMobilePanels(false);
}
function renderMobilePanel(tab){
  try{
    const title=document.getElementById('mobilePanelTitle'), body=document.getElementById('mobilePanelBody'), panel=document.getElementById('mobilePanel'), actions=document.getElementById('mobileActionSheet');
    if(!body||!panel||!actions) return;
    const actionMode=tab==='actions';
    panel.classList.toggle('active',Boolean(tab&&!actionMode)); actions.classList.toggle('active',actionMode);
    panel.setAttribute('aria-hidden',String(!tab||actionMode)); actions.setAttribute('aria-hidden',String(!actionMode));
    if(!tab) return;
    if(title) title.textContent=tab==='comms'?'COMUNICAÇÕES':tab==='safety'?'SAFETY / OPS':tab==='traffic'?'TRÁFEGO ATIVO':'PEDIDOS ATC';
    if(tab==='requests'){
      const ordered=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a));
      body.innerHTML=ordered.map(r=>{ const age=Math.max(0,Math.floor((performance.now()-r.time)/1000)); return `<button class="mobile-request ${r.priority==='urgent'?'urgent':r.priority==='warn'?'warn':''}" data-mobile-req="${mobileEsc(r.id)}|${mobileEsc(r.type)}"><b>${mobileEsc(r.id)}</b><span>${mobileEsc(r.text)} • ${mobileEsc(r.type.toUpperCase())}</span><em>${age}s aguardando</em></button>`; }).join('')||'<div class="mobile-info-line ok">Nenhuma solicitação pendente.</div>';
    }else if(tab==='traffic') body.innerHTML=mobileAircraftRows();
    else if(tab==='comms') body.innerHTML=logLines.slice(0,16).map(l=>`<div class="mobile-info-line ${l.type||''}"><b>${mobileEsc(l.t)}</b> ${mobileEsc(l.msg)}</div>`).join('')||'<div class="mobile-info-line">Sem comunicações.</div>';
    else if(tab==='safety') body.innerHTML=mobileSafetyHtml();
  }catch(e){ safeLogError(e,'mobile-panel'); }
}
function selectMobileAircraft(id,openActions=false){
  const p=aircraft.find(x=>x.id===id); if(!p) return false;
  selected=p.id; selectedRequest=requests.find(r=>r.id===p.id)||null;
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
  mobileHaptic(14); showMobileToast(`${p.id} selecionado`,'ok');
  renderMobileGameplay(true);
  if(openActions) setMobileTab('actions',{toggle:false});
  return true;
}
function cycleMobileAircraft(step=1){
  if(!aircraft.length) return false;
  const list=[...aircraft].sort((a,b)=>mobilePriority(b)-mobilePriority(a)||a.id.localeCompare(b.id));
  let index=list.findIndex(p=>p.id===selected); if(index<0) index=step>0?-1:0;
  index=(index+step+list.length)%list.length;
  return selectMobileAircraft(list[index].id,false);
}
function handleMobileGesture(kind){
  if(kind==='open-requests'){ setMobileTab('requests',{toggle:false}); showMobileToast('Pedidos abertos'); return true; }
  if(kind==='open-actions'){ if(selected){ setMobileTab('actions',{toggle:false}); showMobileToast('Comandos abertos'); } else { setMobileTab('traffic',{toggle:false}); showMobileToast('Selecione uma aeronave','warn'); } return true; }
  if(kind==='close-panel'){ closeMobilePanels(); mobileHaptic(8); return true; }
  if(kind==='cycle-next') return cycleMobileAircraft(1);
  if(kind==='cycle-previous') return cycleMobileAircraft(-1);
  return false;
}
function showGestureCoach(force=false){
  if(!force && !mobilePrefs.gestureCoach) return;
  const coach=document.getElementById('mobileGestureCoach'); if(!coach) return;
  coach.hidden=false; coach.classList.add('show');
}
function hideGestureCoach(permanent=true){
  const coach=document.getElementById('mobileGestureCoach'); coach?.classList.remove('show'); if(coach) coach.hidden=true;
  if(permanent){ mobilePrefs.gestureCoach=false; saveMobilePrefs(); }
}
function mobilePointerPoint(e){ return {x:Number(e.clientX||0),y:Number(e.clientY||0),t:performance.now()}; }
function initMobileGestures(){
  const radar=canvas, layer=document.getElementById('mobileAtcLayer'); if(!radar||!layer) return;
  const down=e=>{
    if(mobileViewportMode()!=='mobile-landscape'||e.pointerType==='mouse') return;
    mobileGestureState={...mobilePointerPoint(e),pointerId:e.pointerId,moved:false,target:e.currentTarget};
    clearTimeout(mobileLongPressTimer);
    if(e.currentTarget===radar) mobileLongPressTimer=setTimeout(()=>{ if(selected&&!mobileGestureState?.moved){ setMobileTab('actions',{toggle:false}); mobileHaptic([18,30,18]); showMobileToast('Comandos rápidos'); } },520);
  };
  const move=e=>{ if(!mobileGestureState||mobileGestureState.pointerId!==e.pointerId) return; if(Math.hypot(e.clientX-mobileGestureState.x,e.clientY-mobileGestureState.y)>14){mobileGestureState.moved=true;clearTimeout(mobileLongPressTimer);} };
  const up=e=>{
    if(!mobileGestureState||mobileGestureState.pointerId!==e.pointerId) return;
    clearTimeout(mobileLongPressTimer); const start=mobileGestureState,end=mobilePointerPoint(e); mobileGestureState=null;
    let kind=classifyMobileGesture(start,end,innerWidth,innerHeight);
    if(start.target?.matches?.('.mobile-panel,.mobile-action-sheet') && kind!=='close-panel') kind='none';
    if(kind!=='tap' && kind!=='none') handleMobileGesture(kind);
    else if(e.currentTarget===radar){ const now=performance.now(); if(now-mobileLastRadarTap<330&&selected){ setMobileTab('actions',{toggle:false}); mobileHaptic(12); } mobileLastRadarTap=now; }
  };
  [radar].forEach(el=>{el.addEventListener('pointerdown',down,{passive:true});el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerup',up,{passive:true});el.addEventListener('pointercancel',()=>{clearTimeout(mobileLongPressTimer);mobileGestureState=null;},{passive:true});});
  document.querySelectorAll('.mobile-panel,.mobile-action-sheet').forEach(el=>{el.addEventListener('pointerdown',down,{passive:true});el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerup',up,{passive:true});});
}
function initMobileDockV2(){
  try{
    applyMobilePreferences();
    document.querySelectorAll('.mobile-nav').forEach(btn=>btn.addEventListener('click',()=>{ if(document.body.classList.contains('game-active')) setMobileTab(btn.dataset.mobileTab); }));
    document.getElementById('mobilePanelClose')?.addEventListener('click',()=>closeMobilePanels());
    document.getElementById('mobileDeselect')?.addEventListener('click',()=>{ selected=null; selectedRequest=null; closeMobilePanels(); renderSelected(); renderMobileGameplay(true); mobileHaptic(8); });
    document.getElementById('mobileMoreToggle')?.addEventListener('click',e=>{ const box=document.getElementById('mobileMoreActions'); const open=box?.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded',String(Boolean(open))); mobileHaptic(8); });
    document.getElementById('mobileMiniStatus')?.addEventListener('click',()=>setMobileTab('safety'));
    document.getElementById('mobileSelectedChip')?.addEventListener('click',()=>selected&&setMobileTab('actions'));
    document.getElementById('mobileGestureCoachClose')?.addEventListener('click',()=>hideGestureCoach(true));
    document.addEventListener('click',e=>{
      const req=e.target.closest?.('[data-mobile-req]');
      if(req){ const [id,type]=req.dataset.mobileReq.split('|'); selected=id; selectedRequest=requests.find(r=>r.id===id&&r.type===type)||null; renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();mobileHaptic(14);setMobileTab('actions',{toggle:false});renderMobileGameplay(true);return; }
      const traffic=e.target.closest?.('[data-mobile-aircraft]'); if(traffic){selectMobileAircraft(traffic.dataset.mobileAircraft,true);return;}
      const setting=e.target.closest?.('[data-mobile-setting]');
      if(setting){
        if(setting.dataset.mobileSetting==='haptics') mobilePrefs.haptics=!mobilePrefs.haptics;
        if(setting.dataset.mobileSetting==='density') mobilePrefs.density=mobilePrefs.density==='comfortable'?'compact':'comfortable';
        if(setting.dataset.mobileSetting==='coach'){mobilePrefs.gestureCoach=true;showGestureCoach(true);}
        saveMobilePrefs();renderMobileGameplay(true);mobileHaptic(10);return;
      }
      const cmd=e.target.closest?.('.mobile-cmd[data-cmd]'); if(cmd&&!cmd.disabled){mobileHaptic(cmd.classList.contains('red')?[20,30,20]:12);showMobileToast(cmd.querySelector('span')?.textContent||'Comando enviado',cmd.classList.contains('red')?'danger':'ok');}
    });
    window.addEventListener('resize',()=>{applyMobilePreferences();resize();renderMobileGameplay(true);},{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(()=>{applyMobilePreferences();resize();renderMobileGameplay(true);},180),{passive:true});
    initMobileGestures();
    setTimeout(()=>{if(mobileViewportMode()==='mobile-landscape'&&document.body.classList.contains('game-active'))showGestureCoach(false);},1000);
  }catch(e){ safeLogError(e,'mobile-init'); }
}
window.SKYWARD_MOBILE_UX=Object.freeze({
  uxSchema:MOBILE_UX_SCHEMA,
  classifyGesture:classifyMobileGesture,
  viewportMode:mobileViewportMode,
  touchTargetPx:mobileTouchTargetPx,
  getPreferences:()=>Object.freeze({...mobilePrefs}),
  openTab:tab=>setMobileTab(tab,{toggle:false}),
  close:()=>closeMobilePanels(),
  cycleAircraft:cycleMobileAircraft,
  render:()=>renderMobileGameplay(true)
});
window.addEventListener('load',()=>setTimeout(initMobileDockV2,500));
