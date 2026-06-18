/* @skyward-module 12-desktop-workspace
 * Professional tablet/desktop workspace, panel density, persistence and keyboard shortcuts.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('12-desktop-workspace');
const DESKTOP_WORKSPACE_SCHEMA=1;
const DESKTOP_WORKSPACE_KEY=`skywardDesktopWorkspace_v${DESKTOP_WORKSPACE_SCHEMA}`;
function desktopClamp(value,min,max){ return Math.max(min,Math.min(max,Number(value)||0)); }
function desktopViewportMode(width=innerWidth){ const w=Number(width)||0; return w>=1181?'desktop':w>=981?'tablet':'compact'; }
function desktopShortcutAction(code,shift=false){
  const map={KeyW:'balanced',KeyR:'radar',BracketLeft:'traffic',BracketRight:'ops',KeyB:'bottom',KeyN:'next-request',ArrowLeft:'previous-aircraft',ArrowRight:'next-aircraft',KeyC:'commands',KeyP:'pause',KeyA:'arrivals',KeyD:'departures',KeyG:'ground',Digit1:'dock-comms',Digit2:'dock-selected',Digit3:'dock-help',Digit4:'dock-filters',Digit5:'dock-safety',Escape:'escape',Slash:'help'};
  if(code==='KeyA'&&shift) return 'analysis';
  return map[code]||null;
}
function defaultDesktopPrefs(){return {schema:DESKTOP_WORKSPACE_SCHEMA,mode:'balanced',hideTraffic:false,hideOps:false,hideBottom:false,compact:false,leftWidth:235,rightWidth:330,bottomHeight:126};}
function sanitizeDesktopPrefs(value){
  const base=defaultDesktopPrefs(),src=value&&typeof value==='object'?value:{};
  const mode=['balanced','radar','analysis'].includes(src.mode)?src.mode:'balanced';
  return {...base,...src,schema:DESKTOP_WORKSPACE_SCHEMA,mode,hideTraffic:!!src.hideTraffic,hideOps:!!src.hideOps,hideBottom:!!src.hideBottom,compact:!!src.compact,leftWidth:desktopClamp(src.leftWidth||base.leftWidth,175,340),rightWidth:desktopClamp(src.rightWidth||base.rightWidth,250,460),bottomHeight:desktopClamp(src.bottomHeight||base.bottomHeight,88,220)};
}
let desktopWorkspacePrefs=sanitizeDesktopPrefs(safeStorageGet(DESKTOP_WORKSPACE_KEY,defaultDesktopPrefs()));
let desktopWorkspaceLastSelected='';
function saveDesktopWorkspacePrefs(){safeStorageSet(DESKTOP_WORKSPACE_KEY,desktopWorkspacePrefs);}
function desktopWorkspaceLabel(){return desktopWorkspacePrefs.mode==='radar'?'Foco Radar':desktopWorkspacePrefs.mode==='analysis'?'Análise ampliada':'Balanceado';}
function applyDesktopWorkspace(){
  const body=document.body,scene=document.querySelector('.atc-scene');if(!body||!scene)return;
  body.classList.toggle('workspace-mode-radar',desktopWorkspacePrefs.mode==='radar');body.classList.toggle('workspace-mode-analysis',desktopWorkspacePrefs.mode==='analysis');
  body.classList.toggle('workspace-hide-traffic',desktopWorkspacePrefs.hideTraffic);body.classList.toggle('workspace-hide-ops',desktopWorkspacePrefs.hideOps);body.classList.toggle('workspace-hide-bottom',desktopWorkspacePrefs.hideBottom);body.classList.toggle('workspace-compact',desktopWorkspacePrefs.compact);
  scene.style.setProperty('--workspace-left-width',`${desktopWorkspacePrefs.leftWidth}px`);scene.style.setProperty('--workspace-right-width',`${desktopWorkspacePrefs.rightWidth}px`);scene.style.setProperty('--workspace-bottom-height',`${desktopWorkspacePrefs.bottomHeight}px`);
  document.documentElement.dataset.desktopViewport=desktopViewportMode();document.documentElement.dataset.workspaceMode=desktopWorkspacePrefs.mode;
  document.querySelectorAll('[data-workspace-action]').forEach(btn=>{const a=btn.dataset.workspaceAction;const active=(a===desktopWorkspacePrefs.mode)||(a==='traffic'&&!desktopWorkspacePrefs.hideTraffic&&desktopWorkspacePrefs.mode!=='radar')||(a==='ops'&&!desktopWorkspacePrefs.hideOps&&desktopWorkspacePrefs.mode!=='radar')||(a==='bottom'&&!desktopWorkspacePrefs.hideBottom&&desktopWorkspacePrefs.mode!=='radar')||(a==='density'&&desktopWorkspacePrefs.compact);btn.classList.toggle('active',active);});
  renderDesktopWorkspaceStatus();
}
function renderDesktopWorkspaceStatus(){
  const el=document.querySelector('#desktopWorkspaceStatus span');if(!el)return;const p=aircraft.find(x=>x.id===selected);const selection=p?`${p.id} • ${p.status}`:'SEM SELEÇÃO';const pending=requests.length;el.textContent=`${desktopWorkspaceLabel()} • ${selection} • ${pending} PED.`;el.title=el.textContent;
}
function setDesktopWorkspaceMode(mode){
  if(!['balanced','radar','analysis'].includes(mode))return false;desktopWorkspacePrefs.mode=mode;
  if(mode==='balanced'){desktopWorkspacePrefs.hideTraffic=false;desktopWorkspacePrefs.hideOps=false;desktopWorkspacePrefs.hideBottom=false;}
  if(mode==='analysis'){desktopWorkspacePrefs.hideTraffic=false;desktopWorkspacePrefs.hideOps=false;desktopWorkspacePrefs.hideBottom=false;desktopWorkspacePrefs.leftWidth=Math.max(260,desktopWorkspacePrefs.leftWidth);desktopWorkspacePrefs.rightWidth=Math.max(370,desktopWorkspacePrefs.rightWidth);desktopWorkspacePrefs.bottomHeight=Math.max(160,desktopWorkspacePrefs.bottomHeight);}
  saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return true;
}
function toggleDesktopPanel(panel){
  if(panel==='traffic')desktopWorkspacePrefs.hideTraffic=!desktopWorkspacePrefs.hideTraffic;
  if(panel==='ops')desktopWorkspacePrefs.hideOps=!desktopWorkspacePrefs.hideOps;
  if(panel==='bottom')desktopWorkspacePrefs.hideBottom=!desktopWorkspacePrefs.hideBottom;
  if(desktopWorkspacePrefs.mode==='radar')desktopWorkspacePrefs.mode='balanced';saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return true;
}
function adjustDesktopPanel(panel,delta){
  if(panel==='left')desktopWorkspacePrefs.leftWidth=desktopClamp(desktopWorkspacePrefs.leftWidth+delta,175,340);
  if(panel==='right')desktopWorkspacePrefs.rightWidth=desktopClamp(desktopWorkspacePrefs.rightWidth+delta,250,460);
  if(panel==='bottom')desktopWorkspacePrefs.bottomHeight=desktopClamp(desktopWorkspacePrefs.bottomHeight+delta,88,220);
  saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return {...desktopWorkspacePrefs};
}
function cycleDesktopAircraft(step=1){
  if(!aircraft.length)return false;const list=[...aircraft].sort((a,b)=>requestPriorityScore({type:b.request||'',priority:b.emergency?'urgent':'normal',time:0})-requestPriorityScore({type:a.request||'',priority:a.emergency?'urgent':'normal',time:0})||a.id.localeCompare(b.id));let i=list.findIndex(p=>p.id===selected);if(i<0)i=step>0?-1:0;i=(i+step+list.length)%list.length;selected=list[i].id;selectedRequest=requests.find(r=>r.id===selected)||null;renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();renderDesktopWorkspaceStatus();return selected;
}
function setDesktopShortcutSheet(open){const sheet=document.querySelector('#desktopShortcutSheet');if(!sheet)return;sheet.classList.toggle('open',!!open);sheet.setAttribute('aria-hidden',String(!open));if(open)document.querySelector('#desktopShortcutClose')?.focus();}
function executeDesktopWorkspaceAction(action){
  if(['balanced','radar','analysis'].includes(action))return setDesktopWorkspaceMode(action);
  if(['traffic','ops','bottom'].includes(action))return toggleDesktopPanel(action);
  if(action==='narrow-left')return adjustDesktopPanel('left',-20);if(action==='wide-left')return adjustDesktopPanel('left',20);if(action==='narrow-right')return adjustDesktopPanel('right',-20);if(action==='wide-right')return adjustDesktopPanel('right',20);
  if(action==='density'){desktopWorkspacePrefs.compact=!desktopWorkspacePrefs.compact;saveDesktopWorkspacePrefs();applyDesktopWorkspace();return true;}
  if(action==='help'){setDesktopShortcutSheet(true);return true;}
  if(action==='next-request'){selectNextRequest();renderDesktopWorkspaceStatus();return true;}
  if(action==='previous-aircraft')return cycleDesktopAircraft(-1);if(action==='next-aircraft')return cycleDesktopAircraft(1);
  if(action==='arrivals'){setTrafficTab('arrivals');return true;}if(action==='departures'){setTrafficTab('departures');return true;}if(action==='ground'){setTrafficTab('groundList');return true;}
  if(action?.startsWith('dock-')){setDock(action.slice(5));return true;}
  if(action==='commands'){if(!selected){selectNextRequest();}document.querySelector('#moreCommandSheet')?.classList.add('open');renderActionGrid();return true;}
  if(action==='pause'){document.querySelector('#pauseBtn')?.click();return true;}
  if(action==='escape'){const sheet=document.querySelector('#desktopShortcutSheet');if(sheet?.classList.contains('open')){setDesktopShortcutSheet(false);return true;}const cmd=document.querySelector('#moreCommandSheet');if(cmd?.classList.contains('open')){cmd.classList.remove('open');return true;}selected=null;selectedRequest=null;renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();renderDesktopWorkspaceStatus();return true;}
  return false;
}
function desktopTypingTarget(target){return !!target?.closest?.('input,select,textarea,[contenteditable="true"]');}
function initDesktopWorkspace(){
  applyDesktopWorkspace();
  document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-workspace-action]');if(btn&&desktopViewportMode()!=='compact')executeDesktopWorkspaceAction(btn.dataset.workspaceAction);});
  document.querySelector('#desktopShortcutClose')?.addEventListener('click',()=>setDesktopShortcutSheet(false));document.querySelector('#desktopShortcutSheet')?.addEventListener('click',e=>{if(e.target.id==='desktopShortcutSheet')setDesktopShortcutSheet(false);});
  document.addEventListener('keydown',e=>{if(desktopViewportMode()==='compact'||desktopTypingTarget(e.target)||!document.body.classList.contains('game-active'))return;const action=desktopShortcutAction(e.code,e.shiftKey);if(!action)return;if(['ArrowLeft','ArrowRight','BracketLeft','BracketRight','Slash'].includes(e.code))e.preventDefault();executeDesktopWorkspaceAction(action);});
  window.addEventListener('resize',()=>{applyDesktopWorkspace();resize();},{passive:true});
  setInterval(()=>{if(document.body.classList.contains('game-active')){if(desktopWorkspaceLastSelected!==String(selected||'')){desktopWorkspaceLastSelected=String(selected||'');renderDesktopWorkspaceStatus();}else renderDesktopWorkspaceStatus();}},500);
}
window.SKYWARD_DESKTOP_WORKSPACE=Object.freeze({schema:DESKTOP_WORKSPACE_SCHEMA,viewportMode:desktopViewportMode,shortcutAction:desktopShortcutAction,clamp:desktopClamp,getPreferences:()=>Object.freeze({...desktopWorkspacePrefs}),setMode:setDesktopWorkspaceMode,togglePanel:toggleDesktopPanel,adjustPanel:adjustDesktopPanel,execute:executeDesktopWorkspaceAction,render:applyDesktopWorkspace});
window.addEventListener('load',()=>setTimeout(initDesktopWorkspace,540));
