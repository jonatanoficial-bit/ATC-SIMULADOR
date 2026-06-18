/* @skyward-module 05-profile-navigation
 * Utilities, profile persistence, scenes, fullscreen and logs.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('05-profile-navigation');
let SKYWARD_RANDOM_SOURCE=()=>Math.random();
function rand(a,b){ const unit=SKYWARD_RANDOM_SOURCE(); return QUALITY?.range ? QUALITY.range(a,b,unit) : unit*(b-a)+a; }
function clamp(v,a,b){ return QUALITY?.clamp ? QUALITY.clamp(v,a,b) : Math.max(a,Math.min(b,v)); }
function degToRad(d){ return d*Math.PI/180; }
function headingTo(p,t){ return QUALITY?.headingTo ? QUALITY.headingTo(p,t) : (Math.atan2(t.y-p.y,t.x-p.x)*180/Math.PI+360)%360; }
function pctToPx(p,w,h){ return {x:p.x/100*w, y:p.y/100*h}; }
function dist(a,b){ return QUALITY?.distance ? QUALITY.distance(a,b) : Math.hypot(a.x-b.x,a.y-b.y); }

function profileSavePayload(reason='profile-save'){
  const clean=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,profile):cloneSafe(profile);
  return {schema:PROFILE_SAVE_SCHEMA,build:BUILD,at:Date.now(),reason,profile:clean};
}
function migrateProfileSavePayload(input,context={}){
  try{
    const raw=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
    const payload=raw.schema===PROFILE_SAVE_SCHEMA&&raw.profile?cloneSafe(raw):{
      schema:PROFILE_SAVE_SCHEMA,build:String(raw.build||BUILD),at:Number(raw.at)||Date.now(),reason:String(context.source==='legacy'?'legacy-profile-import':'profile-migration'),profile:raw.profile||raw
    };
    payload.schema=PROFILE_SAVE_SCHEMA;payload.build=String(payload.build||BUILD);payload.at=Number(payload.at)||Date.now();payload.reason=String(payload.reason||'profile-migration');
    payload.profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(payload.profile,profile):payload.profile;
    const validation=CONTRACTS?.validateProfileSave?CONTRACTS.validateProfileSave(payload,'profile-migration'):{ok:CONTRACTS?.validateProfile?.(payload.profile)?.ok!==false};
    return validation.ok?{ok:true,payload,migratedFrom:raw.schema===PROFILE_SAVE_SCHEMA?null:'legacy'}:{ok:false,reason:'contract',issues:validation.issues};
  }catch(error){safeLogError(error,'profile-migration');return {ok:false,reason:'exception'};}
}
function profileVaultOptions(reason='profile-save'){
  return {
    saveSchema:PROFILE_SAVE_SCHEMA,expectedSaveSchema:PROFILE_SAVE_SCHEMA,build:BUILD,reason,
    validate:value=>CONTRACTS?.validateProfileSave?CONTRACTS.validateProfileSave(value,'profile-vault'):{ok:Boolean(value?.profile)},
    migrate:migrateProfileSavePayload,legacyKeys:['skywardProfile']
  };
}
function persistProfile(reason='profile-save'){
  try{
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,profile):profile;
    const payload=profileSavePayload(reason);
    const result=saveVault()?.write?saveVault().write('profile',payload,profileVaultOptions(reason)):{ok:safeStorageSet('skywardProfile',profile)};
    if(!result?.ok){SAFE_MODE.lastSaveStatus=`profile-write-failed:${result?.reason||'unknown'}`;return false;}
    safeStorageSet('skywardProfile',profile); // compatibility shadow for previous builds
    SAFE_MODE.lastSaveStatus='profile-committed';return true;
  }catch(error){safeLogError(error,'profile-save');return false;}
}
function loadProfile(){
  const vault=saveVault();
  const result=vault?.read?vault.read('profile',profileVaultOptions('profile-load')):null;
  if(result?.ok&&result.payload?.profile){
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(result.payload.profile,profile):result.payload.profile;
    if(result.recovered||result.source==='backup') SAFE_MODE.saveRecoveries++;
    if(result.migrated||result.source==='legacy'||result.source==='migration') SAFE_MODE.saveMigrations++;
  }else{
    const stored={...profile,...safeStorageGet('skywardProfile',{})};
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(stored,profile):stored;
    persistProfile('profile-bootstrap');
  }
  const validation=CONTRACTS?.validateProfile?.(profile,'load-profile');
  if(validation&&!validation.ok) SAFE_MODE.contractFailures+=validation.issues.length;
}
function airport(){ return airports.find(a=>a.icao===profile.airport) || airports[0] || {icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável'}; }
async function loadAirports(){
  const fallback=[{icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável',unlocked:true,level:1}];
  try{
    const payload=await fetch('data/airports.json').then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const result=CONTRACTS?.validateAirports ? CONTRACTS.validateAirports(payload,'data/airports.json') : {ok:Array.isArray(payload),value:payload,issues:[]};
    if(!result.ok) throw new TypeError('Contrato de aeroportos inválido: '+result.issues.slice(0,3).map(x=>`${x.path} ${x.message}`).join('; '));
    airports=result.value;
  }catch(e){ safeLogError(e,'airports-contract'); SAFE_MODE.contractFailures++; airports=fallback; }
  if(!airports.some(a=>a.icao===profile.airport)) profile.airport=airports[0]?.icao||'SBGR';
  populateAirports(); updateProfileUI();
}
function saveProfile(){
  profile.name = $('#pilotName')?.value?.trim() || profile.name;
  profile.country = $('#countrySelect')?.value || profile.country;
  profile.airport = $('#airportSelect')?.value || profile.airport;
  profile=CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(profile,profile) : profile;
  const contract=CONTRACTS?.validateProfile?.(profile,'save-profile');
  if(contract && !contract.ok){ SAFE_MODE.contractFailures += contract.issues.length; setDiagnostic('PERFIL CORRIGIDO PELO CONTRATO','warn'); }
  persistProfile('profile-form');
  updateProfileUI();
}
function populateAirports(){
  const sel = $('#airportSelect');
  if(sel){ sel.innerHTML = airports.filter(a=>a.unlocked).map(a=>`<option value="${a.icao}">${a.icao} - ${a.city} / ${a.name}</option>`).join(''); sel.value = profile.airport; }
  const grid = $('#airportGrid');
  if(grid){
    grid.innerHTML = airports.map(a=>`<button class="glass airport-choice ${a.icao===profile.airport?'selected':''} ${a.unlocked?'':'locked'}" data-airport="${a.icao}"><span class="code">${a.icao}</span><b>${a.city}</b><span>${a.name}</span><div class="meta"><span>${a.country}</span><span>${a.runways} pista(s)</span><span>Tráfego: ${a.traffic}</span><span>Clima: ${a.weather}</span><span>Nível ${a.level}</span></div></button>`).join('');
    $$('[data-airport]').forEach(b=>b.onclick=()=>{ const a=airports.find(x=>x.icao===b.dataset.airport); if(!a?.unlocked){ alert('Aeroporto bloqueado para futuras fases da carreira.'); return; } profile.airport=a.icao; persistProfile('airport-selection'); populateAirports(); updateProfileUI(); go('lobby'); });
  }
}
function updateProfileUI(){
  const av = profile.avatar==='female' ? 'assets/characters/CHAR_CONTROLLER_FEMALE01_V1.png' : 'assets/characters/CHAR_CONTROLLER_MALE01_V1.png';
  const a = airport();
  if($('#lobbyAvatar')) $('#lobbyAvatar').src = av;
  if($('#lobbyName')) $('#lobbyName').textContent = profile.name.toUpperCase();
  if($('#profileScore')) $('#profileScore').textContent = (profile.score||0).toLocaleString('pt-BR');
  if($('#careerLine')) $('#careerLine').textContent = `Nível ${profile.level} • ${profile.country}`;
  if($('#careerLevel')) $('#careerLevel').textContent = profile.level;
  if($('#careerXp')) $('#careerXp').textContent = `${profile.xp} / ${profile.level*1000}`;
  if($('#careerTurns')) $('#careerTurns').textContent = profile.turns || 0;
  if($('#airportTitle')) $('#airportTitle').textContent = `${a.icao} - ${a.city.toUpperCase()}`;
  if($('#airportDesc')) $('#airportDesc').textContent = `${a.name} • ${a.country} • ${a.runways} pista(s) • tráfego ${a.traffic} • clima ${a.weather}.`;
  if($('#gameAirport')) $('#gameAirport').textContent = a.icao;
  if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao;
}

function updateSceneBodyClass(id){
  try{
    const inGame=id==='game';
    document.body.classList.toggle('game-active', inGame);
    document.body.classList.toggle('game-is-active', inGame);
    if(!inGame){
      mobileActiveTab=null;
      closeMobilePanels();
    }else{
      mobileActiveTab=null;
      closeMobilePanels();
      requestAnimationFrame(()=>renderMobileGameplay());
    }
  }catch(e){ safeLogError(e,'scene-body-class'); }
}

function go(id){
  try{
    if(id==='lobby' || id==='profile') saveProfile();
    const target = $('#'+id) || $('#menu') || $('#boot');
    $$('.screen').forEach(s=>s.classList.remove('active'));
    target.classList.add('active');
    SAFE_MODE.lastScene = target.id;
    updateSceneBodyClass(target.id);
    document.querySelector('#crashShield')?.classList.remove('open');
    if(target.id==='game'){ validateGameplayDom(); startGame(); }
    else { running=false; paused=false; }
    updateProfileUI(); resize();
    if(target.id!=='game') target.scrollTop=0;
  }catch(e){ showSafeMode(e); }
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$$('[data-avatar]').forEach(b=>b.addEventListener('click',()=>{ profile.avatar=b.dataset.avatar; $$('[data-avatar]').forEach(x=>x.classList.toggle('selected',x===b)); saveProfile(); }));
$('#pauseBtn')?.addEventListener('click',()=>{ paused=!paused; $('#pauseBtn').textContent = paused ? '▶' : 'Ⅱ'; });


async function requestFullscreenAndLandscape(){
  try{
    const el = document.documentElement;
    if(!document.fullscreenElement && el.requestFullscreen){ await el.requestFullscreen(); }
  }catch(e){}
  try{
    if(screen.orientation && screen.orientation.lock){ await screen.orientation.lock('landscape'); }
  }catch(e){}
  setTimeout(resize, 250);
}
function updateOrientationState(){
  document.body.classList.toggle('portrait-lock', window.innerHeight > window.innerWidth && window.innerWidth < 900);
  resize();
}
$('#fullscreenBtn')?.addEventListener('click', requestFullscreenAndLandscape);
document.addEventListener('click', (ev)=>{
  const goBtn = ev.target.closest && ev.target.closest('[data-go]');
  if(goBtn && goBtn.dataset.go==='game') requestFullscreenAndLandscape();
}, {capture:true});
window.addEventListener('orientationchange', ()=>setTimeout(updateOrientationState, 350));
window.addEventListener('resize', updateOrientationState);
updateOrientationState();

function resize(){ try{ if(!canvas||!ctx) return; const r=canvas.getBoundingClientRect(), d=window.devicePixelRatio||1; canvas.width=Math.max(320,Math.floor((r.width||320)*d)); canvas.height=Math.max(240,Math.floor((r.height||240)*d)); ctx.setTransform(d,0,0,d,0,0); }catch(e){ safeLogError(e,'resize'); } }
window.addEventListener('resize', resize);

function addLog(msg,type=''){
  const e = running ? Math.floor((performance.now()-startTime)/1000) : 0;
  const t = new Date(e*1000).toISOString().substring(14,19);
  logLines.unshift({t,msg,type}); logLines = logLines.slice(0,60); renderLog();
}
function renderLog(){ const l=$('#log'); if(l) l.innerHTML = logLines.map(x=>`<div class="logline ${x.type}"><em>${x.t}</em> ${x.msg}</div>`).join(''); }

