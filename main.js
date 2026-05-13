const BUILD = 'v0.8.1_20260513_2146';

const SAFE_MODE = { errors: [], lastFrame: 0, lastScene: 'boot', maxAircraft: 18, recovering:false };
function safeLogError(err, where='runtime'){
  try{
    const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err);
    SAFE_MODE.errors.unshift({ where, msg: msg.slice(0,500), at: Date.now() });
    SAFE_MODE.errors = SAFE_MODE.errors.slice(0,8);
    localStorage.setItem('skywardLastError', JSON.stringify(SAFE_MODE.errors[0]));
  }catch(_e){}
}
function showSafeMode(err){
  safeLogError(err,'safe-mode');
  try{
    running=false; paused=true;
    const shield=document.querySelector('#crashShield');
    const detail=document.querySelector('#safeErrorText');
    if(detail) detail.textContent = SAFE_MODE.errors[0]?.msg || 'Falha desconhecida recuperada.';
    if(shield) shield.classList.add('open');
  }catch(_e){}
}
window.addEventListener('error', e=>{ showSafeMode(e.error || e.message); });
window.addEventListener('unhandledrejection', e=>{ showSafeMode(e.reason || 'Promise rejeitada'); });
function safeStorageGet(key, fallback){ try{ const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ safeLogError(e,'storage-get'); return fallback; } }
function safeStorageSet(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); return true; }catch(e){ safeLogError(e,'storage-set'); return false; } }
function sanitizeAircraftList(){
  if(!Array.isArray(aircraft)) aircraft=[];
  aircraft = aircraft.filter(p=>p && typeof p.id==='string' && Number.isFinite(p.x) && Number.isFinite(p.y)).slice(0, SAFE_MODE.maxAircraft);
  aircraft.forEach(p=>{
    p.x=clamp(Number(p.x)||50,-8,108); p.y=clamp(Number(p.y)||50,-8,108);
    p.alt=clamp(Number(p.alt)||0,0,420); p.targetAlt=clamp(Number(p.targetAlt)||0,0,420);
    p.speed=clamp(Number(p.speed)||0,0,360); p.heading=((Number(p.heading)||0)%360+360)%360;
    if(!Array.isArray(p.trail)) p.trail=[]; p.trail=p.trail.slice(-54);
  });
  requests = (Array.isArray(requests)?requests:[]).filter(r=>r && aircraft.some(p=>p.id===r.id)).slice(0,30);
  if(selected && !aircraft.some(p=>p.id===selected)){ selected=null; selectedRequest=null; }
}
function validateGameplayDom(){
  const required=['#radar','#actionGrid','#requests','#freqCall','#log','#selectedBox'];
  const missing=required.filter(s=>!document.querySelector(s));
  if(missing.length) throw new Error('Elementos de gameplay ausentes: '+missing.join(', '));
}
function recoverGameplayState(reason='auto'){
  safeLogError(reason,'recover-state');
  sanitizeAircraftList();
  if(running && aircraft.length===0){ for(let i=0;i<4;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure')); aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal')); }
  if(!selected && requests[0]){ selected=requests[0].id; selectedRequest=requests[0]; }
  try{ renderStrips(); renderRequests(); renderSelected(); updateFrequencyPanel(); renderActionGrid(); renderLog(); }catch(e){ showSafeMode(e); }
}
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const canvas = $('#radar');
const ctx = canvas.getContext('2d');
const asset = { map: new Image(), radar: new Image() };
asset.map.src = 'assets/maps/MAP_KATL_AIRPORT_CLEAN_V1.png';
asset.radar.src = 'assets/radar/RADAR_BASE_CLEAN_V1.png';

let airports = [];
let profile = { name:'Controlador', avatar:'male', country:'Brasil', airport:'SBGR', xp:0, level:1, score:0, turns:0 };
let aircraft = [];
let requests = [];
let selected = null;
let selectedRequest = null;
let running = false;
let paused = false;
let last = 0;
let startTime = 0;
let score = 0;
let spawnTimer = 0;
let requestTimer = 0;
let logLines = [];
let runwayOccupiedBy = null;
let stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0 };

const SIM_SPEED = 0.092;
const runway = { name:'09/27', x1:18, y1:50, x2:82, y2:50, width:6.2, exits:[32,45,56,68] };
const gates = [
  {x:55,y:70, label:'A'}, {x:61,y:70, label:'A'}, {x:67,y:70, label:'B'}, {x:73,y:70, label:'B'},
  {x:58,y:78, label:'C'}, {x:65,y:78, label:'C'}, {x:72,y:78, label:'D'}, {x:78,y:77, label:'D'}
];
const holdingPoints = [{x:31,y:57},{x:47,y:57},{x:64,y:57},{x:78,y:57}];
const finalFix = {x:52, y:26};

function rand(a,b){ return Math.random()*(b-a)+a; }
function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
function degToRad(d){ return d*Math.PI/180; }
function headingTo(p,t){ return (Math.atan2(t.y-p.y,t.x-p.x)*180/Math.PI+360)%360; }
function pctToPx(p,w,h){ return {x:p.x/100*w, y:p.y/100*h}; }
function dist(a,b){ return Math.hypot(a.x-b.x,a.y-b.y); }

function loadProfile(){ profile = {...profile, ...safeStorageGet('skywardProfile', {})}; }
function airport(){ return airports.find(a=>a.icao===profile.airport) || airports[0] || {icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável'}; }
async function loadAirports(){
  try{ airports = await fetch('data/airports.json').then(r=>r.json()); }
  catch(e){ airports = [{icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável',unlocked:true,level:1}]; }
  populateAirports(); updateProfileUI();
}
function saveProfile(){
  profile.name = $('#pilotName')?.value?.trim() || profile.name;
  profile.country = $('#countrySelect')?.value || profile.country;
  profile.airport = $('#airportSelect')?.value || profile.airport;
  safeStorageSet('skywardProfile', profile);
  updateProfileUI();
}
function populateAirports(){
  const sel = $('#airportSelect');
  if(sel){ sel.innerHTML = airports.filter(a=>a.unlocked).map(a=>`<option value="${a.icao}">${a.icao} - ${a.city} / ${a.name}</option>`).join(''); sel.value = profile.airport; }
  const grid = $('#airportGrid');
  if(grid){
    grid.innerHTML = airports.map(a=>`<button class="glass airport-choice ${a.icao===profile.airport?'selected':''} ${a.unlocked?'':'locked'}" data-airport="${a.icao}"><span class="code">${a.icao}</span><b>${a.city}</b><span>${a.name}</span><div class="meta"><span>${a.country}</span><span>${a.runways} pista(s)</span><span>Tráfego: ${a.traffic}</span><span>Clima: ${a.weather}</span><span>Nível ${a.level}</span></div></button>`).join('');
    $$('[data-airport]').forEach(b=>b.onclick=()=>{ const a=airports.find(x=>x.icao===b.dataset.airport); if(!a?.unlocked){ alert('Aeroporto bloqueado para futuras fases da carreira.'); return; } profile.airport=a.icao; localStorage.setItem('skywardProfile',JSON.stringify(profile)); populateAirports(); updateProfileUI(); go('lobby'); });
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
function go(id){
  try{
    if(id==='lobby' || id==='profile') saveProfile();
    const target = $('#'+id) || $('#menu') || $('#boot');
    $$('.screen').forEach(s=>s.classList.remove('active'));
    target.classList.add('active');
    SAFE_MODE.lastScene = target.id;
    document.body.classList.toggle('game-is-active', target.id==='game');
    document.querySelector('#crashShield')?.classList.remove('open');
    if(target.id==='game'){ validateGameplayDom(); startGame(); }
    updateProfileUI(); resize();
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

function makePlane(i,kind){
  const br = airport().country === 'Brasil';
  const calls = br ? ['GLO1204','TAM3307','AZU4211','PTB7021','ONE8902','SID4405','MAP2190','TTL3030','VRG2218'] : ['DAL1234','AAL567','SWA789','UAL890','JBU789','FFT321','BAW612','KLM208'];
  const types = ['A320','B738','B739','E190','A321','B752','A20N'];
  const p = { id:calls[(i+Math.floor(rand(0,6)))%calls.length], type:types[i%types.length], kind, status:kind==='arrival'?'APP':'PARKED', x:0, y:0, heading:0, speed:0, alt:0, targetAlt:0, trail:[], risk:0, selected:false, cleared:false, emergency:false, hold:false, groundTimer:0, request:null, requestedAt:0, nextFix:null };
  if(kind==='arrival'){
    const side = Math.floor(rand(0,4));
    p.x = side===0 ? rand(8,20) : side===1 ? rand(80,92) : rand(18,82);
    p.y = side===2 ? rand(6,14) : side===3 ? rand(86,94) : rand(10,36);
    p.alt = Math.round(rand(90,180)); p.targetAlt = 45; p.speed = Math.round(rand(145,190)); p.heading = headingTo(p, finalFix);
    p.request = 'landing'; p.requestedAt = performance.now();
  } else {
    const g = gates[i%gates.length]; p.x = g.x + rand(-.5,.5); p.y = g.y + rand(-.5,.5); p.heading = 270; p.request = 'pushback'; p.requestedAt = performance.now();
  }
  return p;
}
function addRequest(p,type,priority='normal'){
  if(requests.some(r=>r.id===p.id && r.type===type)) return;
  const labels = { landing:'solicita pouso', pushback:'solicita pushback', taxi:'solicita taxi para pista', lineup:'solicita alinhar', takeoff:'solicita decolagem', emergency:'MAYDAY - prioridade' };
  requests.unshift({ id:p.id, type, priority, text:labels[type]||type, time:performance.now() });
  p.request = type; p.requestedAt = performance.now(); stats.requests++;
  addLog(`${p.id}: ${labels[type] || type}.`, priority==='urgent'?'danger':priority==='warn'?'warn':'');
  renderRequests();
}
function removeRequest(id,type){ requests = requests.filter(r=>!(r.id===id && (!type || r.type===type))); if(selectedRequest && selectedRequest.id===id && (!type || selectedRequest.type===type)) selectedRequest=null; renderRequests(); }

function atcPhrase(r){
  const ap = airport().icao;
  const map = { landing: `${r.id}: ${ap} Tower, request landing RWY ${runway.name}.`, pushback: `${r.id}: ${ap} Ground, request pushback.`, taxi: `${r.id}: ${ap} Ground, ready to taxi.`, lineup: `${r.id}: ${ap} Tower, holding short, request line up.`, takeoff: `${r.id}: ${ap} Tower, lined up, ready for departure.`, emergency: `${r.id}: MAYDAY, request immediate landing.` };
  return map[r.type] || `${r.id}: request ${r.type}.`;
}
function updateFrequencyPanel(){
  const f = $("#freqCall"), rs=$("#runwayStatus"), seq=$("#seqStatus");
  if(rs){ rs.textContent = runwayOccupiedBy ? `RWY OCUPADA ${runwayOccupiedBy}` : "RWY LIVRE"; rs.style.color = runwayOccupiedBy ? "#ff4d42" : "#5bf06d"; }
  const finals = aircraft.filter(p=>["APP","FINAL","EMERG","HOLD"].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix)).slice(0,3);
  if(seq) seq.textContent = "SEQ: " + (finals.map(p=>p.id).join(" > ") || "---");
  const r = selectedRequest || requests[0];
  if(!f) return;
  if(!r){ f.className="freq-call compact"; f.innerHTML=`<div class="call-id">STBY</div><div class="call-type">aguardando contato</div><small>Monitore aproximação, solo e pista ativa.</small>`; renderActionGrid(); return; }
  const p = aircraft.find(x=>x.id===r.id);
  const age = Math.floor((performance.now()-r.time)/1000);
  f.className = "freq-call compact " + (r.priority==="urgent" ? "danger" : "");
  f.innerHTML = `
    <div class="call-id">${r.id}</div>
    <div class="call-type">${r.text}</div>
    <div class="call-grid">
      <div><span>Setor</span><b>${getSector(p)}</b></div>
      <div><span>Tipo</span><b>${p?.type || '---'}</b></div>
      <div><span>Posição</span><b>${p?.kind==='arrival' ? Math.max(5,Math.round(dist(p,finalFix)))+' NM' : (p?.status||'SOLO')}</b></div>
      <div><span>Alt / Vel</span><b>FL${Math.round(p?.alt||0)} / ${Math.round(p?.speed||0)}</b></div>
      <div><span>Espera</span><b>${age}s</b></div>
      <div><span>Pista</span><b>${runwayOccupiedBy ? 'OCUPADA' : 'LIVRE'}</b></div>
    </div>`;
  renderActionGrid();
}
function startGame(){
  try{ validateGameplayDom(); }catch(e){ showSafeMode(e); return; }
  saveProfile(); resize(); running=true; paused=false; score=0; selected=null; selectedRequest=null; runwayOccupiedBy=null; spawnTimer=0; requestTimer=0; startTime=performance.now(); last=startTime; logLines=[]; requests=[];
  stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0 };
  aircraft = [];
  const a = airport(); $('#weather').textContent = (a.weather || 'VARIÁVEL').toUpperCase().slice(0,18); if($('#gameAirport')) $('#gameAirport').textContent = a.icao; if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao; if($('#gameAirportMode')) $('#gameAirportMode').textContent='TORRE';
  for(let i=0;i<5;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure')); // v0.8.1: carga inicial mais segura para mobile
  // v0.5.0: menor carga inicial para mobile, evitando poluicao visual e permitindo controle real
  aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'));
  if(requests[0]){ selected = requests[0].id; selectedRequest = requests[0]; }
  addLog(`${a.icao} APP/TWR online. Pista ativa ${runway.name}.`);
  addLog('Aguarde solicitações e emita clearance conforme pista livre.');
  recoverGameplayState('start-game');
  requestAnimationFrame(loop);
}
function loop(t){ try{ if(!running || !$('#game')?.classList.contains('active')) return; SAFE_MODE.lastFrame=t; const dt=Math.min(.08,Math.max(0,(t-last)/1000)); last=t; if(!paused) update(dt); draw(); requestAnimationFrame(loop); }catch(e){ showSafeMode(e); } }
function update(dt){
  sanitizeAircraftList();
  const elapsed = (performance.now()-startTime)/1000;
  $('#clock').textContent = new Date(elapsed*1000).toISOString().substring(14,19);
  $('#score').textContent = Math.max(0,Math.round(score)).toLocaleString('pt-BR');
  if(elapsed>420) return endGame(false,'Turno concluído com segurança.');
  spawnTimer += dt;
  if(spawnTimer>42 && aircraft.length<12){ spawnTimer=0; const p=makePlane(Date.now()%1000, Math.random()<.58?'arrival':'departure'); aircraft.push(p); addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'); }
  updatePlanes(dt); checkRunway(); checkConflicts(); checkMissedRequests();
  score += dt * (aircraft.length * 1.4);
  renderStrips(); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
}
function updatePlanes(dt){
  for(const p of aircraft){
    p.selected = selected === p.id;
    if(p.status==='PARKED'){ p.speed = 0; }
    else if(p.status==='PUSHBACK'){
      p.groundTimer += dt; p.speed = 5; p.y += .45*dt;
      if(p.groundTimer>9){ p.status='READY_TAXI'; p.speed=0; addRequest(p,'taxi'); }
    } else if(p.status==='TAXI'){
      p.groundTimer += dt; p.speed = 18; const hp = holdingPoints[p.groundIndex || 0]; p.heading = headingTo(p,hp); moveToward(p,hp,SIM_SPEED*.6*dt);
      if(dist(p,hp)<1.6){ p.status='HOLD_SHORT'; p.speed=0; addRequest(p,'lineup','warn'); }
    } else if(p.status==='LINEUP'){
      p.speed = 0; const line = {x:25,y:50}; moveToward(p,line,SIM_SPEED*.35*dt); p.heading=270;
      if(dist(p,line)<2.0 && !requests.some(r=>r.id===p.id && r.type==='takeoff')) addRequest(p,'takeoff','warn');
    } else if(p.status==='DEP'){
      p.speed = clamp(p.speed + 8*dt, 120, 230); p.targetAlt = Math.max(p.targetAlt,160); p.heading = 270;
      moveByHeading(p, dt); p.alt += (p.targetAlt-p.alt)*.025;
    } else if(p.status==='HOLD'){
      p.heading = (p.heading + 8*dt) % 360; p.speed = clamp(p.speed,120,170); moveByHeading(p, dt*.75); p.alt += (p.targetAlt-p.alt)*.012;
    } else if(p.status==='APP'){
      p.heading += shortTurn(p.heading, headingTo(p, finalFix))*.018; p.alt += (p.targetAlt-p.alt)*.015; moveByHeading(p, dt);
      if(dist(p,finalFix)<8 && !requests.some(r=>r.id===p.id && r.type==='landing')) addRequest(p,'landing','warn');
    } else if(p.status==='FINAL' || p.status==='EMERG'){
      const threshold = {x:82,y:50}; p.heading += shortTurn(p.heading, headingTo(p, threshold))*.028; p.speed = Math.max(115,p.speed-.8*dt); p.targetAlt=0; p.alt += (p.targetAlt-p.alt)*.035; moveByHeading(p, dt);
    }
    p.trail.push({x:p.x,y:p.y}); if(p.trail.length>54) p.trail.shift();
  }
  for(const p of [...aircraft]){
    if((p.status==='FINAL'||p.status==='EMERG') && dist(p,{x:82,y:50})<2.8 && p.alt<10){
      stats.landed++; score += p.emergency ? 1300 : 900; addLog(`${p.id}: pouso concluído, livrando pista pela saída rápida.`); removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
    if(p.status==='DEP' && (p.x<0 || p.x>104 || p.y<0 || p.y>100)){
      stats.departed++; score += 720; addLog(`${p.id}: decolagem concluída, contato com saída.`); removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
  }
}
function moveByHeading(p,dt){ const rad=degToRad(p.heading); const scale=(p.speed/220)*SIM_SPEED*4.6; p.x += Math.cos(rad)*scale*dt; p.y += Math.sin(rad)*scale*dt; }
function moveToward(p,t,amount){ const h=headingTo(p,t), r=degToRad(h); p.x += Math.cos(r)*amount*100; p.y += Math.sin(r)*amount*100; }
function shortTurn(a,b){ return ((b-a+540)%360)-180; }
function checkRunway(){
  runwayOccupiedBy = null;
  for(const p of aircraft){ if(['LINEUP','DEP','FINAL','EMERG'].includes(p.status) && p.x>15 && p.x<86 && Math.abs(p.y-50)<5.5) runwayOccupiedBy = p.id; }
}
function checkMissedRequests(){
  const now = performance.now();
  for(const r of requests){
    const age = (now-r.time)/1000;
    const p = aircraft.find(x=>x.id===r.id); if(!p) continue;
    if(age>52 && r.priority==='urgent') return endGame(true,`${r.id} em emergência ficou sem resposta.`);
    if(age>72 && r.priority!=='urgent'){ r.priority='warn'; score-=30; }
  }
}
function checkConflicts(){
  for(const p of aircraft) p.risk = Math.max(0,p.risk-.006);
  for(let i=0;i<aircraft.length;i++) for(let j=i+1;j<aircraft.length;j++){
    const a=aircraft[i], b=aircraft[j]; if(a.status==='PARKED'||b.status==='PARKED'||a.status==='PUSHBACK'||b.status==='PUSHBACK') continue;
    const d=dist(a,b), vSep=Math.abs(a.alt-b.alt), ground=a.alt<8 && b.alt<8;
    if(d < (ground?2.5:4.8) && (ground || vSep<10)){ a.risk+=.014; b.risk+=.014; if(a.risk>.22 && b.risk>.22) stats.conflicts++; if(a.risk>1.15 || b.risk>1.15) return endGame(true,`Separação perdida entre ${a.id} e ${b.id}.`); }
  }
  const finals = aircraft.filter(p=>p.status==='FINAL' || p.status==='EMERG');
  if(finals.length>1){ for(const p of finals) p.risk += .01; if(finals.some(p=>p.risk>.9)) return endGame(true,'Duas aeronaves autorizadas para a mesma final sem separação suficiente.'); }
}

function draw(){
  const r = canvas.getBoundingClientRect(), w=r.width, h=r.height;
  ctx.clearRect(0,0,w,h);
  if(asset.map.complete){ ctx.globalAlpha=.36; ctx.drawImage(asset.map,0,0,w,h); ctx.globalAlpha=1; }
  drawOperationalMap(w,h);
  drawScope(w,h);
  for(const p of aircraft) drawPlane(p,w,h);
}
function drawOperationalMap(w,h){
  const P = (x,y)=>({x:x/100*w,y:y/100*h});
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  // taxiway network
  ctx.strokeStyle='rgba(210,168,68,.30)'; ctx.lineWidth=Math.max(2,w*.004);
  const taxi = [[20,58,82,58],[28,65,78,65],[34,73,80,73],[32,58,32,50],[45,58,45,50],[56,58,56,50],[68,58,68,50],[78,58,78,50],[55,65,55,78],[62,65,62,78],[72,65,72,78]];
  taxi.forEach(t=>{ const a=P(t[0],t[1]), b=P(t[2],t[3]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
  // runway
  const a=P(runway.x1,runway.y1), b=P(runway.x2,runway.y2); ctx.lineWidth=Math.max(16,h*.035); ctx.strokeStyle='rgba(20,24,28,.98)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.lineWidth=Math.max(2,h*.004); ctx.strokeStyle=runwayOccupiedBy?'rgba(255,77,66,.95)':'rgba(100,255,130,.85)'; ctx.setLineDash([12,8]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // centerline and edges
  ctx.strokeStyle='rgba(255,255,255,.58)'; ctx.lineWidth=1; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // approach corridor and final sector
  const ff=P(finalFix.x,finalFix.y), th=P(82,50); ctx.strokeStyle="rgba(91,240,109,.28)"; ctx.lineWidth=2; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(ff.x,ff.y); ctx.lineTo(th.x,th.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle="rgba(91,240,109,.75)"; ctx.beginPath(); ctx.arc(ff.x,ff.y,5,0,Math.PI*2); ctx.fill(); ctx.font="700 10px ui-monospace"; ctx.fillText("FINAL FIX", ff.x+8, ff.y+4);
  // labels from code are okay: operational UI, not image asset
  ctx.font='700 12px ui-monospace,Consolas,monospace'; ctx.fillStyle='rgba(235,245,255,.90)'; ctx.fillText('RWY 09', a.x-8, a.y-18); ctx.fillText('RWY 27', b.x-42, b.y-18);
  runway.exits.forEach((x,i)=>{ const e=P(x,56); ctx.fillStyle='rgba(216,163,72,.95)'; ctx.beginPath(); ctx.arc(e.x,e.y,4,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText(`E${i+1}`, e.x+6, e.y+4); });
  gates.forEach((g,i)=>{ const gp=P(g.x,g.y); ctx.strokeStyle='rgba(120,180,220,.25)'; ctx.strokeRect(gp.x-10,gp.y-7,20,14); ctx.fillStyle='rgba(190,215,235,.55)'; ctx.font='700 9px ui-monospace'; ctx.fillText(`${g.label}${i+1}`,gp.x-9,gp.y+3); });
  if(runwayOccupiedBy){ ctx.fillStyle='rgba(255,77,66,.92)'; ctx.font='900 13px ui-monospace'; ctx.fillText(`PISTA OCUPADA: ${runwayOccupiedBy}`, P(19,44).x, P(19,44).y); }
  ctx.restore();
}
function drawScope(w,h){
  const cx=w/2, cy=h/2, rr=Math.min(w,h)*.44;
  ctx.save(); ctx.strokeStyle='rgba(110,230,135,.14)'; ctx.lineWidth=1;
  for(let i=1;i<=4;i++){ ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(cx,cy,rr*i/4,0,Math.PI*2); ctx.stroke(); }
  ctx.setLineDash([8,14]); for(let a=0;a<360;a+=30){ const r=degToRad(a); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(r)*rr,cy+Math.sin(r)*rr); ctx.stroke(); }
  ctx.restore();
}
function drawPlane(p,w,h){
  const pos = {x:p.x/100*w, y:p.y/100*h};
  const col = p.risk>.45 ? '#ff4d42' : p.emergency ? '#ffbf3d' : p.status==='PARKED' ? '#a8b3bd' : p.kind==='departure' ? '#58b7ff' : '#5bf06d';
  ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=p.selected?2.5:1.4; ctx.shadowColor=col; ctx.shadowBlur=p.selected?15:5;
  ctx.globalAlpha=.45; ctx.beginPath(); p.trail.forEach((q,i)=>{ const x=q.x/100*w, y=q.y/100*h; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.globalAlpha=1;
  const rad=degToRad(p.heading);
  if(!['PARKED','HOLD_SHORT','LINEUP'].includes(p.status)){ const len=14+Math.min(44,p.speed/6); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pos.x+Math.cos(rad)*len,pos.y+Math.sin(rad)*len); ctx.stroke(); }
  ctx.translate(pos.x,pos.y); ctx.rotate(rad+Math.PI/2); ctx.beginPath();
  if(['PARKED','PUSHBACK','TAXI','HOLD_SHORT'].includes(p.status) || p.alt<8){ ctx.rect(-5,-5,10,10); }
  else { ctx.moveTo(0,-8); ctx.lineTo(5,6); ctx.lineTo(0,3); ctx.lineTo(-5,6); ctx.closePath(); }
  ctx.stroke(); ctx.setTransform(1,0,0,1,0,0);
  if(p.selected){ ctx.beginPath(); ctx.arc(pos.x,pos.y,19,0,Math.PI*2); ctx.stroke(); }
  ctx.shadowBlur=0;
  const hasReq = requests.some(r=>r.id===p.id);
  const showLabel = p.selected || hasReq || !['PARKED','PUSHBACK'].includes(p.status);
  if(showLabel){
    ctx.font=(w<430?'9px':'11px')+' ui-monospace,Menlo,Consolas,monospace'; ctx.fillStyle=col;
    const tx=pos.x+10, ty=pos.y-10;
    ctx.fillText(p.id,tx,ty);
    if(p.selected || w>=430 || !['PARKED','PUSHBACK','TAXI'].includes(p.status)){
      ctx.fillStyle='rgba(230,245,255,.86)'; ctx.fillText(`${p.status} FL${Math.max(0,Math.round(p.alt)).toString().padStart(3,'0')}`,tx,ty+12);
      ctx.fillText(`${Math.round(p.speed)}KT`,tx,ty+24);
    }
    if(hasReq){ ctx.fillStyle='rgba(255,191,61,.95)'; ctx.fillText('REQ',tx,ty+(p.selected?36:28)); }
  }
  ctx.restore();
}

function renderStrips(){
  const arr = aircraft.filter(p=>p.kind==='arrival').slice(0,9);
  const dep = aircraft.filter(p=>p.kind==='departure' && !['PARKED','PUSHBACK'].includes(p.status)).slice(0,9);
  const grd = aircraft.filter(p=>['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(p.status)).slice(0,9);
  const mk = (p, type) => {
    const meta = type==='arr' ? `${p.type} • FL${Math.round(p.alt)} • ${Math.max(5,Math.round(dist(p,finalFix)))} NM` :
                  type==='dep' ? `${p.status==='LINEUP'?'PRONTO':p.status} • RWY ${runway.name}` :
                  `${p.status} • GATE/TAXI • ${p.type}`;
    return `<button class="strip ref ${p.risk>.4?'danger':p.emergency?'warning':''}" data-select="${p.id}"><b>${p.id}</b><span>${meta}</span><small style="color:#9db0c3">${p.request ? ('PEDIDO: '+p.request.toUpperCase()) : 'MONITORANDO'}</small></button>`;
  };
  const aEl=$('#arrivals'), dEl=$('#departures'), gEl=$('#groundList');
  if(aEl) aEl.innerHTML = arr.map(p=>mk(p,'arr')).join('') || '<div class="muted">Sem entradas.</div>';
  if(dEl) dEl.innerHTML = dep.map(p=>mk(p,'dep')).join('') || '<div class="muted">Sem saídas.</div>';
  if(gEl) gEl.innerHTML = grd.map(p=>mk(p,'grd')).join('') || '<div class="muted">Sem solo.</div>';
  if($('#arrivalsCount')) $('#arrivalsCount').textContent = arr.length;
  if($('#departuresCount')) $('#departuresCount').textContent = dep.length;
  if($('#groundCount')) $('#groundCount').textContent = grd.length;
  const activeList = $('.traffic-list.active');
  if($('#trafficCount') && activeList){ $('#trafficCount').textContent = activeList.querySelectorAll('[data-select]').length; }
  $$('[data-select]').forEach(b=>b.onclick=()=>{ selected=b.dataset.select; selectedRequest=null; renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); renderActionGrid(); });
}
function renderRequests(){
  const box=$('#requests'); if(!box) return;
  if($('#requestsCount')) $('#requestsCount').textContent = `${requests.length} AGUARDANDO`;
  box.innerHTML = requests.map(r=>{ const age=Math.floor((performance.now()-r.time)/1000); return `
    <button class="request ${r.priority==='urgent'?'urgent':r.priority==='warn'?'warn':''} ${selectedRequest===r?'selected':''}" data-req="${r.id}|${r.type}">
      <div class="request-head"><b>${r.id}</b><small>${String(age).padStart(2,'0')}:${String(age%60).padStart(2,'0')}</small></div>
      <span class="request-text">${r.text}</span>
      <span class="request-type">${r.type.toUpperCase()}</span>
    </button>`; }).join('') || '<div class="muted">Nenhuma solicitação pendente.</div>';
  $$('[data-req]').forEach(b=>b.onclick=()=>{ const [id,type]=b.dataset.req.split('|'); selected=id; selectedRequest=requests.find(r=>r.id===id && r.type===type) || null; renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); });
}
function renderSelected(){
  const box = $('#selectedBox');
  const p=aircraft.find(x=>x.id===selected); if(!p){ if(box) box.textContent='Nenhuma aeronave selecionada'; renderActionGrid(); return; }
  const req=requests.find(r=>r.id===p.id);
  const op = getSector(p);
  if(box) box.innerHTML = `
    <div class="sel-top"><div class="sel-name"><b>${p.id}</b><small>${p.type} • ${op}</small></div><div class="sel-status">${p.status.replace('_',' ')}</div></div>
    <div class="sel-grid">
      <div class="sel-item"><span>ALT</span><b>FL${Math.round(p.alt)}</b></div>
      <div class="sel-item"><span>SPD</span><b>${Math.round(p.speed)}kt</b></div>
      <div class="sel-item"><span>HDG</span><b>${Math.round(p.heading)}°</b></div>
      <div class="sel-item"><span>POS</span><b>${p.kind==='arrival' ? `${Math.max(5,Math.round(dist(p,finalFix)))}NM` : 'SOLO'}</b></div>
      <div class="sel-item"><span>REQ</span><b>${req ? req.text : '---'}</b></div>
      <div class="sel-item"><span>SETOR</span><b>${op}</b></div>
    </div>`;
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = op;
  renderActionGrid();
}
canvas.addEventListener('pointerdown', e=>{
  const rect=canvas.getBoundingClientRect(), x=e.clientX-rect.left, y=e.clientY-rect.top; let best=null, bd=999;
  for(const p of aircraft){ const px=p.x/100*rect.width, py=p.y/100*rect.height, d=Math.hypot(px-x,py-y); if(d<bd){ bd=d; best=p; } }
  if(best && bd<48){ selected=best.id; selectedRequest=null; addLog(`${best.id} selecionado.`); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); }
});
function command(cmd){
  const p=aircraft.find(x=>x.id===selected); if(!p){ addLog('Nenhuma aeronave selecionada.','warn'); return; }
  stats.commands++; score -= 2;
  if(cmd==='left') p.heading=(p.heading+350)%360;
  if(cmd==='right') p.heading=(p.heading+10)%360;
  if(cmd==='slow') p.speed=clamp(p.speed-10,40,320);
  if(cmd==='fast') p.speed=clamp(p.speed+10,0,320);
  if(cmd==='climb') p.targetAlt=clamp(p.targetAlt+10,0,360);
  if(cmd==='descend') p.targetAlt=clamp(p.targetAlt-10,0,360);
  if(cmd==='hold'){ p.hold=!p.hold; if(p.kind==='arrival') p.status=p.hold?'HOLD':'APP'; addLog(`${airport().icao}: ${p.id} ${p.hold?'entre em espera':'prossiga aproximação'}.`); }
  if(cmd==='holdShort'){ if(['TAXI','LINEUP','DEP'].includes(p.status)){ p.status='HOLD_SHORT'; p.speed=0; p.cleared=false; addLog(`${airport().icao}: ${p.id} hold short pista ${runway.name}.`); } }
  if(cmd==='vectorFinal'){ if(p.kind==='arrival'){ p.status='APP'; p.hold=false; p.heading=headingTo(p, finalFix); p.targetAlt=Math.min(p.targetAlt,45); p.speed=Math.min(p.speed,170); addLog(`${airport().icao}: ${p.id} vetor para interceptar final RWY ${runway.name}.`); } }
  if(cmd==='deny'){ denyRequest(p); }
  if(cmd==='goAround'){ p.status='APP'; p.cleared=false; p.targetAlt=80; p.speed=Math.max(p.speed,170); p.heading=headingTo(p,{x:p.x<50?20:80,y:18}); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; addLog(`${airport().icao}: ${p.id} arremeta, suba para FL080.`, 'warn'); }
  if(cmd==='emergency'){ p.emergency=true; p.status='EMERG'; stats.emergencies++; addRequest(p,'emergency','urgent'); }
  if(cmd==='clear') handleClearance(p);
  else if(!['hold','emergency','deny'].includes(cmd)) addLog(`${airport().icao}: ${p.id} ${cmd.toUpperCase()} autorizado.`);
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
}
function denyRequest(p){
  const req = requests.find(r=>r.id===p.id);
  if(!req){ addLog(`${p.id}: sem solicitação ativa para negar.`, 'warn'); return; }
  stats.denied++;
  score -= req.priority==='urgent' ? 120 : 18;
  if(req.priority==='urgent'){
    addLog(`${airport().icao}: ${p.id}, emergência não pode aguardar. Prioridade mantida.`, 'danger');
    return;
  }
  req.time = performance.now();
  req.priority = req.type==='landing' || req.type==='lineup' || req.type==='takeoff' ? 'warn' : 'normal';
  addLog(`${airport().icao}: ${p.id}, aguarde. Clearance ainda não autorizado.`, 'warn');
  renderRequests();
}

function handleClearance(p){
  const req = requests.find(r=>r.id===p.id);
  if(!req){ addLog(`${p.id}: não há solicitação pendente para CLEARANCE.`, 'warn'); stats.denied++; score-=20; return; }
  if(req.type==='landing'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO pouso, pista ocupada por ${runwayOccupiedBy}.`, 'warn'); stats.denied++; score-=50; return; }
    p.status='FINAL'; p.cleared=true; p.targetAlt=0; p.speed=Math.min(p.speed,165); removeRequest(p.id,'landing'); runwayOccupiedBy=p.id; addLog(`${airport().icao}: ${p.id} autorizado pouso pista ${runway.name}.`); score+=65; return;
  }
  if(req.type==='pushback'){
    p.status='PUSHBACK'; p.groundTimer=0; removeRequest(p.id,'pushback'); addLog(`${airport().icao}: ${p.id} pushback aprovado.`); score+=30; return;
  }
  if(req.type==='taxi'){
    p.status='TAXI'; p.groundIndex=Math.floor(rand(0,holdingPoints.length)); removeRequest(p.id,'taxi'); addLog(`${airport().icao}: ${p.id} taxeie até ponto de espera pista ${runway.name}.`); score+=35; return;
  }
  if(req.type==='lineup'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} mantenha posição, pista ocupada.`, 'warn'); stats.denied++; score-=25; return; }
    p.status='LINEUP'; p.cleared=true; removeRequest(p.id,'lineup'); runwayOccupiedBy=p.id; addLog(`${airport().icao}: ${p.id} alinhe e aguarde pista ${runway.name}.`); score+=40; return;
  }
  if(req.type==='takeoff'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO decolagem, pista ocupada.`, 'warn'); stats.denied++; score-=40; return; }
    p.status='DEP'; p.speed=130; p.alt=0; p.targetAlt=160; p.heading=270; removeRequest(p.id,'takeoff'); runwayOccupiedBy=p.id; addLog(`${airport().icao}: ${p.id} autorizado decolagem pista ${runway.name}.`); score+=70; return;
  }
  if(req.type==='emergency'){
    p.status='EMERG'; p.cleared=true; p.targetAlt=0; p.speed=150; removeRequest(p.id,'emergency'); addLog(`${airport().icao}: ${p.id} emergência reconhecida, pista liberada, pouso imediato.`, 'danger'); score+=120; return;
  }
}
function endGame(fail,reason){
  if(!running) return; running=false;
  const final = Math.max(0, Math.round(score - stats.conflicts*45 + stats.landed*120 + stats.departed*100 + stats.requests*10 - stats.denied*35));
  profile.score = Math.max(profile.score||0, final); profile.turns=(profile.turns||0)+1; profile.xp=(profile.xp||0)+Math.round(final/5)+stats.landed*30+stats.departed*20;
  while(profile.xp >= profile.level*1000){ profile.xp -= profile.level*1000; profile.level++; }
  safeStorageSet('skywardProfile', profile);
  $('#resultTitle').textContent = fail ? 'GAME OVER' : 'FIM DE TURNO';
  $('#resultReason').textContent = reason;
  $('#finalScore').textContent = final.toLocaleString('pt-BR');
  $('#finalStats').innerHTML = `<div><span>Pousos concluídos</span><b>${stats.landed}</b></div><div><span>Decolagens concluídas</span><b>${stats.departed}</b></div><div><span>Solicitações recebidas</span><b>${stats.requests}</b></div><div><span>Clearances negados/incorretos</span><b>${stats.denied}</b></div><div><span>Conflitos detectados</span><b>${stats.conflicts}</b></div><div><span>Comandos emitidos</span><b>${stats.commands}</b></div><div><span>Emergências</span><b>${stats.emergencies}</b></div><div><span>Aeroporto</span><b>${airport().icao}</b></div><div><span>Build</span><b>${BUILD}</b></div>`;
  go('result');
}

function getSector(p){
  if(!p) return 'TWR';
  if(p.emergency || p.status==='EMERG') return 'EMERG';
  if(p.kind==='arrival') return (p.status==='APP' || p.status==='HOLD') ? 'APP' : 'TWR';
  if(['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT'].includes(p.status)) return 'GND';
  if(['LINEUP','DEP'].includes(p.status)) return 'TWR';
  return 'TWR';
}
function makeAction(label, cmd, cls='dark', sub=''){
  const disabled = cmd==='noop' ? ' disabled aria-disabled="true"' : '';
  return `<button class="atc-action ${cls}${cmd==='noop'?' disabled':''}" data-cmd="${cmd}"${disabled}>${label}${sub?`<small>${sub}</small>`:''}</button>`;
}
function contextActions(p){
  if(!p) return [
    ['SELECIONE','noop','dark','aeronave'],['FILA','noop','dark','pedido'],['RADAR','noop','dark','toque'],['COMMS','noop','dark','monitore']
  ];
  const req = requests.find(r=>r.id===p.id);
  if(p.emergency || req?.type==='emergency') return [
    ['POUSO IMEDIATO','clear','red','emergência'],['VETOR FINAL','vectorFinal','amber','prioridade'],['REDUZIR','slow','amber','velocidade'],['DESCER','descend','amber','altitude'],['ESPERA','hold','dark','último caso'],['MAIS','more','dark','opções']
  ];
  if(p.kind==='arrival'){
    if(p.status==='APP' || p.status==='HOLD') return [
      ['VETOR FINAL','vectorFinal','green','interceptar'],['AUT. POUSO','clear','green','se pista livre'],['REDUZIR','slow','blue','separação'],['DESCER','descend','blue','perfil'],['ESPERA','hold','amber','holding'],['MAIS','more','dark','opções']
    ];
    if(p.status==='FINAL') return [
      ['POUSO OK','clear','green','confirmar'],['ARREMETER','goAround','red','go around'],['REDUZIR','slow','blue','final'],['ESPERA','hold','amber','instruir'],['HDG -10','left','dark','vetor'],['MAIS','more','dark','opções']
    ];
  }
  if(['PARKED','PUSHBACK','READY_TAXI'].includes(p.status)) return [
    ['PUSHBACK','clear','blue','aprovar'],['TÁXI','clear','blue','para pista'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','solo'],['HDG +10','right','dark','solo'],['MAIS','more','dark','opções']
  ];
  if(['TAXI','HOLD_SHORT'].includes(p.status)) return [
    ['HOLD SHORT','holdShort','amber','antes pista'],['ALINHAR','clear','green','line up'],['MANTER','deny','amber','posição'],['TÁXI OK','clear','blue','prosseguir'],['EMERGÊNCIA','emergency','red','prioridade'],['MAIS','more','dark','opções']
  ];
  if(p.status==='LINEUP' || p.status==='DEP') return [
    ['DECOLAR','clear','green','takeoff'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SUBIR','climb','blue','saída'],['MAIS','more','dark','opções']
  ];
  return [['CLEARANCE','clear','green','ação'],['ESPERA','hold','amber','hold'],['NEGAR','deny','red','aguarde'],['MAIS','more','dark','opções']];
}
function moreActions(p){
  return [
    ['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SPD -10','slow','blue','reduzir'],['SPD +10','fast','blue','aumentar'],['SUBIR','climb','blue','altitude'],['DESCER','descend','blue','altitude'],['HOLD','hold','amber','espera'],['HOLD SHORT','holdShort','amber','pista'],['VETOR FINAL','vectorFinal','green','app'],['CLEARANCE','clear','green','autorizar'],['NEGAR','deny','red','aguarde'],['EMERGÊNCIA','emergency','red','mayday']
  ];
}
function renderActionGrid(){
  const p=aircraft.find(x=>x.id===selected);
  const grid=$('#actionGrid');
  if(grid){ grid.innerHTML=contextActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3])).join(''); }
  const more=$('#moreActionGrid');
  if(more){ more.innerHTML=moreActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3])).join(''); }
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = getSector(p);
  if($('#sectorHelp')) $('#sectorHelp').textContent = p ? `${p.id} selecionado` : 'Selecione uma aeronave';
}
function setTrafficTab(id){
  $$('.traffic-tab').forEach(b=>b.classList.toggle('active', b.dataset.trafficTab===id));
  $$('.traffic-list').forEach(l=>l.classList.toggle('active', l.id===id));
  const names={arrivals:'ENTRADAS',departures:'SAÍDAS',groundList:'SOLO'};
  if($('#trafficTitle')) $('#trafficTitle').textContent=names[id]||'TRÁFEGO';
  if($('#trafficCount')) $('#trafficCount').textContent=($('#'+id)?.querySelectorAll('[data-select]').length||0);
}
function setDock(id){
  $$('.dock-tab').forEach(b=>b.classList.toggle('active', b.dataset.dock===id));
  $$('.dock-body').forEach(b=>b.classList.toggle('active', b.id==='dock-'+id));
}
document.addEventListener('click',(e)=>{
  const t=e.target.closest && e.target.closest('[data-traffic-tab], [data-dock], #moreCommandsBtn, #closeMoreCommands, .command-sheet, [data-cmd]');
  if(!t) return;
  if(t.dataset.trafficTab){ setTrafficTab(t.dataset.trafficTab); return; }
  if(t.dataset.dock){ setDock(t.dataset.dock); return; }
  if(t.id==='moreCommandsBtn'){ $('#moreCommandSheet')?.classList.add('open'); renderActionGrid(); return; }
  if(t.id==='closeMoreCommands' || t.classList.contains('command-sheet')){ $('#moreCommandSheet')?.classList.remove('open'); return; }
  if(t.dataset.cmd){
    if(t.dataset.cmd==='more'){ $('#moreCommandSheet')?.classList.add('open'); renderActionGrid(); return; }
    if(t.dataset.cmd==='noop') return;
    command(t.dataset.cmd);
    $('#moreCommandSheet')?.classList.remove('open');
  }
});


document.querySelector('#safeRestartBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('game'); });
document.querySelector('#safeLobbyBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('lobby'); });
function selfTest(){
  const report={ build:BUILD, ok:true, checks:[], errors:[] };
  const check=(name,fn)=>{ try{ const ok=!!fn(); report.checks.push({name,ok}); if(!ok) report.ok=false; }catch(e){ report.ok=false; report.errors.push({name,msg:String(e.message||e)}); } };
  check('required dom',()=>['#app','#radar','#actionGrid','#requests','#freqCall','#log','#selectedBox'].every(s=>document.querySelector(s)));
  check('airports data fallback',()=>Array.isArray(airports));
  check('canvas context',()=>!!ctx);
  check('safe storage',()=>safeStorageSet('skywardSelfTest',{build:BUILD,t:Date.now()}));
  window.SKYWARD_SELF_TEST = report;
  return report;
}
setTimeout(()=>{ try{ selfTest(); }catch(e){ safeLogError(e,'self-test'); } },500);

loadProfile(); loadAirports(); resize();
