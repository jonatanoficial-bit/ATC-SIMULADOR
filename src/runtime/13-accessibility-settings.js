/* @skyward-module 13-accessibility-settings
 * Professional accessibility, visual, audio, performance and control settings.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('13-accessibility-settings');
const ACCESSIBILITY_SCHEMA=1;
const ACCESSIBILITY_KEY=`skywardAccessibilitySettings_v${ACCESSIBILITY_SCHEMA}`;
const ACCESSIBILITY_DEFAULTS=Object.freeze({
  schema:ACCESSIBILITY_SCHEMA,
  uiScale:'100',
  contrast:'normal',
  colorMode:'standard',
  radarBrightness:'100',
  largeTargets:false,
  focusRing:true,
  reducedMotion:false,
  subtitles:true,
  masterVolume:70,
  radioVolume:82,
  sfxVolume:58,
  haptics:true,
  performanceMode:'auto',
  fpsCap:'60',
  effects:'normal',
  touchMode:'standard',
  shortcutHints:true
});
function accessClamp(value,min,max){return Math.max(min,Math.min(max,Number(value)||0));}
function sanitizeAccessibilityPrefs(value){
  const src=value&&typeof value==='object'?value:{};
  const pick=(key,list,fb)=>list.includes(String(src[key]))?String(src[key]):fb;
  return {
    ...ACCESSIBILITY_DEFAULTS,
    schema:ACCESSIBILITY_SCHEMA,
    uiScale:pick('uiScale',['90','100','110','120','130'],'100'),
    contrast:pick('contrast',['normal','high','night'],'normal'),
    colorMode:pick('colorMode',['standard','protanopia','deuteranopia','tritanopia','mono'],'standard'),
    radarBrightness:String(accessClamp(src.radarBrightness??100,70,130)),
    largeTargets:!!src.largeTargets,
    focusRing:src.focusRing!==false,
    reducedMotion:!!src.reducedMotion,
    subtitles:src.subtitles!==false,
    masterVolume:accessClamp(src.masterVolume??70,0,100),
    radioVolume:accessClamp(src.radioVolume??82,0,100),
    sfxVolume:accessClamp(src.sfxVolume??58,0,100),
    haptics:src.haptics!==false,
    performanceMode:pick('performanceMode',['auto','battery','performance'],'auto'),
    fpsCap:pick('fpsCap',['30','45','60'],'60'),
    effects:pick('effects',['minimal','normal','rich'],'normal'),
    touchMode:pick('touchMode',['standard','large','compact'],'standard'),
    shortcutHints:src.shortcutHints!==false
  };
}
let accessibilityPrefs=sanitizeAccessibilityPrefs(safeStorageGet(ACCESSIBILITY_KEY,ACCESSIBILITY_DEFAULTS));
function saveAccessibilityPrefs(){safeStorageSet(ACCESSIBILITY_KEY,accessibilityPrefs);}
function applyAccessibilitySettings(){
  const root=document.documentElement,body=document.body;if(!root||!body)return;
  root.dataset.accessibilitySchema=String(ACCESSIBILITY_SCHEMA);
  root.dataset.uiScale=accessibilityPrefs.uiScale;
  root.dataset.contrast=accessibilityPrefs.contrast;
  root.dataset.colorMode=accessibilityPrefs.colorMode;
  root.dataset.performanceMode=accessibilityPrefs.performanceMode;
  root.dataset.effectsMode=accessibilityPrefs.effects;
  root.dataset.touchMode=accessibilityPrefs.touchMode;
  root.style.setProperty('--ui-scale',String(Number(accessibilityPrefs.uiScale)/100));
  root.style.setProperty('--radar-brightness',`${accessibilityPrefs.radarBrightness}%`);
  root.style.setProperty('--master-volume',String(accessibilityPrefs.masterVolume/100));
  body.classList.toggle('access-large-targets',accessibilityPrefs.largeTargets||accessibilityPrefs.touchMode==='large');
  body.classList.toggle('access-focus-ring',accessibilityPrefs.focusRing);
  body.classList.toggle('access-reduced-motion',accessibilityPrefs.reducedMotion||accessibilityPrefs.performanceMode==='battery'||accessibilityPrefs.effects==='minimal');
  body.classList.toggle('access-subtitles',accessibilityPrefs.subtitles);
  body.classList.toggle('access-shortcut-hints',accessibilityPrefs.shortcutHints);
  if(accessibilityPrefs.reducedMotion){root.style.scrollBehavior='auto';}
  updateAccessibilityPanel();
  updateAccessibilityStatus();
  try{resize();}catch(e){}
}
function accessibilitySummary(){
  const contrast={normal:'Normal',high:'Alto contraste',night:'Noite'}[accessibilityPrefs.contrast]||'Normal';
  const color={standard:'Cores padrão',protanopia:'Protanopia',deuteranopia:'Deuteranopia',tritanopia:'Tritanopia',mono:'Monocromático'}[accessibilityPrefs.colorMode]||'Cores padrão';
  return `${accessibilityPrefs.uiScale}% • ${contrast} • ${color} • ${accessibilityPrefs.performanceMode.toUpperCase()}`;
}
function updateAccessibilityStatus(){
  document.querySelectorAll('[data-accessibility-status]').forEach(el=>{el.textContent=accessibilitySummary();});
  const badge=document.querySelector('#accessibilityBadge');if(badge)badge.textContent=accessibilityPrefs.contrast==='normal'&&accessibilityPrefs.uiScale==='100'?'ACESS':'ACESS*';
}
function setAccessibilityPanel(open){
  const panel=document.querySelector('#accessibilityPanel');if(!panel)return;
  panel.classList.toggle('open',!!open);panel.setAttribute('aria-hidden',String(!open));
  if(open){updateAccessibilityPanel();setTimeout(()=>document.querySelector('#accessibilityPanelClose')?.focus(),0);}
}
function updateAccessibilityPanel(){
  const panel=document.querySelector('#accessibilityPanel');if(!panel)return;
  for(const [key,value] of Object.entries(accessibilityPrefs)){
    panel.querySelectorAll(`[data-access-setting="${key}"]`).forEach(input=>{
      if(input.type==='checkbox')input.checked=!!value;else input.value=String(value);
    });
  }
  const summary=panel.querySelector('#accessibilitySummary');if(summary)summary.textContent=accessibilitySummary();
  const vol=panel.querySelector('#accessibilityVolumeSummary');if(vol)vol.textContent=`Master ${accessibilityPrefs.masterVolume}% • Rádio ${accessibilityPrefs.radioVolume}% • FX ${accessibilityPrefs.sfxVolume}%`;
}
function setAccessibilityPreference(key,value){
  if(!(key in ACCESSIBILITY_DEFAULTS))return false;
  const next={...accessibilityPrefs,[key]:value};
  accessibilityPrefs=sanitizeAccessibilityPrefs(next);saveAccessibilityPrefs();applyAccessibilitySettings();return true;
}
function resetAccessibilitySettings(){accessibilityPrefs=sanitizeAccessibilityPrefs(ACCESSIBILITY_DEFAULTS);saveAccessibilityPrefs();applyAccessibilitySettings();return true;}
function exportAccessibilitySettings(){return JSON.stringify(accessibilityPrefs,null,2);}
function cycleContrast(){const list=['normal','high','night'];const i=list.indexOf(accessibilityPrefs.contrast);setAccessibilityPreference('contrast',list[(i+1)%list.length]);return accessibilityPrefs.contrast;}
function runAccessibilitySelfCheck(){
  const issues=[];
  if(!document.querySelector('#accessibilityPanel'))issues.push('painel ausente');
  if(!document.querySelector('[data-settings-action="open"]'))issues.push('gatilho ausente');
  if(Number(accessibilityPrefs.uiScale)<90||Number(accessibilityPrefs.uiScale)>130)issues.push('escala fora do limite');
  if(!['normal','high','night'].includes(accessibilityPrefs.contrast))issues.push('contraste inválido');
  if(!['standard','protanopia','deuteranopia','tritanopia','mono'].includes(accessibilityPrefs.colorMode))issues.push('modo de cor inválido');
  return {schema:ACCESSIBILITY_SCHEMA,ok:issues.length===0,issues,preferences:{...accessibilityPrefs}};
}
function handleAccessibilityInput(target){
  const key=target?.dataset?.accessSetting;if(!key)return false;
  const value=target.type==='checkbox'?target.checked:target.value;
  return setAccessibilityPreference(key,value);
}
document.addEventListener('click',e=>{
  const action=e.target.closest?.('[data-settings-action]')?.dataset?.settingsAction;if(!action)return;
  if(action==='open'){setAccessibilityPanel(true);return;}
  if(action==='close'){setAccessibilityPanel(false);return;}
  if(action==='reset'){resetAccessibilitySettings();return;}
  if(action==='contrast'){cycleContrast();return;}
  if(action==='export'){const out=document.querySelector('#accessibilityExport');if(out)out.value=exportAccessibilitySettings();return;}
});
document.addEventListener('input',e=>handleAccessibilityInput(e.target));
document.addEventListener('change',e=>handleAccessibilityInput(e.target));
document.addEventListener('keydown',e=>{if(e.altKey&&e.code==='KeyS'&&!desktopTypingTarget?.(e.target)){e.preventDefault();setAccessibilityPanel(true);}if(e.code==='F10'&&!desktopTypingTarget?.(e.target)){e.preventDefault();setAccessibilityPanel(true);}});
window.SKYWARD_ACCESSIBILITY=Object.freeze({schema:ACCESSIBILITY_SCHEMA,defaults:ACCESSIBILITY_DEFAULTS,sanitize:sanitizeAccessibilityPrefs,clamp:accessClamp,getPreferences:()=>Object.freeze({...accessibilityPrefs}),setPreference:setAccessibilityPreference,apply:applyAccessibilitySettings,reset:resetAccessibilitySettings,summary:accessibilitySummary,selfCheck:runAccessibilitySelfCheck,open:()=>setAccessibilityPanel(true),close:()=>setAccessibilityPanel(false)});
window.addEventListener('load',()=>setTimeout(applyAccessibilitySettings,620));
