const BUILD = 'v0.1.0_20260430_1303';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
let profile = JSON.parse(localStorage.getItem('skywardProfile')||'{}');
let selectedAvatar = profile.avatar || 'male';
let selected = null, paused = false, running = false, score = 0, startTime = 0, last = 0;
let aircraft = [], logLines = [], stats = {landed:0, departed:0, conflicts:0, commands:0, emergencies:0};
const canvas = $('#radar'); const ctx = canvas.getContext('2d');
const asset = {radar:new Image(), map:new Image()};
asset.radar.src='assets/radar/RADAR_BASE_CLEAN_V1.png'; asset.map.src='assets/maps/MAP_KATL_AIRPORT_CLEAN_V1.png';

function go(id){
  $$('.screen').forEach(s=>s.classList.remove('active')); $('#'+id).classList.add('active');
  if(id==='lobby') updateLobby(); if(id==='game') startGame();
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$$('.avatar').forEach(b=>b.addEventListener('click',()=>{selectedAvatar=b.dataset.avatar; $$('.avatar').forEach(x=>x.classList.remove('selected')); b.classList.add('selected');}));
$('#pauseBtn').addEventListener('click',()=>{paused=!paused; $('#pauseBtn').textContent=paused?'▶':'Ⅱ'; addLog(paused?'Simulação pausada.':'Simulação retomada.','warn')});

function saveProfile(){profile.name=($('#pilotName').value||'Controlador').trim(); profile.avatar=selectedAvatar; localStorage.setItem('skywardProfile',JSON.stringify(profile));}
function updateLobby(){saveProfile(); $('#lobbyName').textContent=(profile.name||'Controlador').toUpperCase(); $('#lobbyAvatar').src= selectedAvatar==='female'?'assets/characters/CHAR_CONTROLLER_FEMALE01_V1.png':'assets/characters/CHAR_CONTROLLER_MALE01_V1.png'; $('#profileScore').textContent=Number(localStorage.getItem('skywardBest')||0).toLocaleString('pt-BR');}

function resize(){const dpr=Math.min(devicePixelRatio||1,2); const r=canvas.getBoundingClientRect(); canvas.width=Math.max(320,Math.floor(r.width*dpr)); canvas.height=Math.max(320,Math.floor(r.height*dpr)); ctx.setTransform(dpr,0,0,dpr,0,0);} window.addEventListener('resize',resize);
function rand(a,b){return a+Math.random()*(b-a)} function degToRad(d){return (d-90)*Math.PI/180} function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function headingTo(from,to){return (Math.atan2(to.y-from.y,to.x-from.x)*180/Math.PI+90+360)%360}
function addLog(msg,type=''){const t=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit',second:'2-digit'}); logLines.unshift({t,msg,type}); logLines=logLines.slice(0,80); renderLog();}
function renderLog(){ $('#log').innerHTML=logLines.map(l=>`<div class="logline ${l.type}"><em>${l.t}</em> ${l.msg}</div>`).join(''); }
function makePlane(i, kind){
  const calls=['DAL1234','AAL567','SWA789','UAL890','JBU789','FFT321','AZU221','TAM445','AFR390','BAW612','KLM208','IBE732'];
  const types=['A320','B738','B739','E190','A321','B752']; const call=calls[i%calls.length];
  let p={id:call, type:types[i%types.length], kind, status:kind==='arrival'?'APP':'TAXI', x:0,y:0, heading:0, speed:0, alt:0, targetAlt:0, trail:[], risk:0, selected:false, cleared:false, emergency:false, hold:false};
  if(kind==='arrival'){
    const side=Math.floor(rand(0,4));
    p.x=side===0?rand(4,18):side===1?rand(82,96):rand(10,90); p.y=side===2?rand(4,18):side===3?rand(82,96):rand(10,90);
    p.alt=Math.round(rand(140,260)); p.targetAlt=30; p.speed=Math.round(rand(210,280)); p.heading=headingTo(p,{x:52,y:53});
  } else {
    p.x=rand(56,72); p.y=rand(61,76); p.alt=0; p.targetAlt=0; p.speed=0; p.heading=rand(240,300);
  }
  return p;
}
function startGame(){
  saveProfile(); resize(); running=true; paused=false; score=0; startTime=performance.now(); last=startTime; selected=null; logLines=[]; stats={landed:0,departed:0,conflicts:0,commands:0,emergencies:0};
  aircraft=[]; for(let i=0;i<8;i++) aircraft.push(makePlane(i,i%3===2?'departure':'arrival'));
  addLog('KATL APP/TWR online. Radar operacional.'); addLog('Mantenha separação e organize aproximações.');
  requestAnimationFrame(loop);
}
function loop(t){ if(!running || !$('#game').classList.contains('active')) return; const dt=Math.min(.05,(t-last)/1000); last=t; if(!paused) update(dt); draw(); requestAnimationFrame(loop); }
function update(dt){
  const elapsed=(performance.now()-startTime)/1000; $('#clock').textContent=new Date(elapsed*1000).toISOString().substring(14,19); $('#score').textContent=Math.max(0,Math.round(score)).toLocaleString('pt-BR');
  if(elapsed>280) return endGame(false,'Turno concluído com segurança.');
  if(Math.random()<0.0009 && aircraft.length<14){ const p=makePlane(Date.now()%1000,Math.random()<.62?'arrival':'departure'); aircraft.push(p); addLog(`${p.id}: novo tráfego ${p.kind==='arrival'?'em aproximação':'no solo'}.`); }
  if(Math.random()<0.00035){ const p=aircraft[Math.floor(Math.random()*aircraft.length)]; if(p && !p.emergency){p.emergency=true;p.status='EMERG';p.speed=Math.max(170,p.speed-30);stats.emergencies++;addLog(`${p.id}: MAYDAY, solicito prioridade imediata.`, 'danger')} }
  for(const p of aircraft){
    p.selected = selected===p.id; if(p.hold){ p.heading=(p.heading+12*dt)%360; p.speed=clamp(p.speed,120,210); }
    if(p.status==='TAXI'){ p.speed = p.cleared ? Math.min(165,p.speed+22*dt) : Math.max(0,p.speed-15*dt); if(p.cleared){ p.alt += 18*dt; p.status = p.alt>5?'DEP':'TAXI'; }}
    else { const rad=degToRad(p.heading); const scale=(p.speed/250)*6; p.x += Math.cos(rad)*scale*dt; p.y += Math.sin(rad)*scale*dt; p.alt += (p.targetAlt-p.alt)*0.025; }
    if(p.status==='APP' && p.cleared){ p.heading += (((headingTo(p,{x:53,y:58})-p.heading+540)%360)-180)*0.025; p.targetAlt=0; }
    p.trail.push({x:p.x,y:p.y}); if(p.trail.length>28) p.trail.shift();
  }
  // score and completions
  for(const p of [...aircraft]){
    if(p.status==='APP' && p.cleared && Math.hypot(p.x-53,p.y-58)<4 && p.alt<18){ stats.landed++; score+=700; addLog(`${p.id}: pouso concluído.`, ''); aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null; }
    if(p.status==='DEP' && (p.x<0||p.x>100||p.y<0||p.y>100)){ stats.departed++; score+=520; addLog(`${p.id}: saída concluída, deixando setor.`); aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null; }
    if(p.x<-8||p.x>108||p.y<-8||p.y>108){ aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null; }
  }
  checkConflicts(); score += dt*(aircraft.length*2);
  renderStrips(); renderSelected();
}
function checkConflicts(){
  for(const p of aircraft) p.risk=Math.max(0,p.risk-.012);
  for(let i=0;i<aircraft.length;i++) for(let j=i+1;j<aircraft.length;j++){
    const a=aircraft[i], b=aircraft[j]; const d=Math.hypot(a.x-b.x,a.y-b.y); const vSep=Math.abs(a.alt-b.alt);
    const onGround=a.alt<8&&b.alt<8; const lateralMin=onGround?3.2:5.2; const verticalMin=onGround?999:10;
    if(d<lateralMin && (onGround || vSep<verticalMin)){ a.risk+=.05; b.risk+=.05; if(a.risk>.1 && b.risk>.1) stats.conflicts++; if(a.risk>.9 || b.risk>.9){ return endGame(true,`Separação perdida entre ${a.id} e ${b.id}.`); } }
  }
}
function pct(p){const r=canvas.getBoundingClientRect(); return {x:p.x/100*r.width,y:p.y/100*r.height};}
function draw(){
  const r=canvas.getBoundingClientRect(); const w=r.width,h=r.height; ctx.clearRect(0,0,w,h);
  if(asset.map.complete) {ctx.globalAlpha=.35; ctx.drawImage(asset.map,0,0,w,h); ctx.globalAlpha=1;}
  if(asset.radar.complete){ctx.globalAlpha=.58; ctx.drawImage(asset.radar,0,0,w,h); ctx.globalAlpha=1;}
  // extra scope grid
  const cx=w/2, cy=h/2, rr=Math.min(w,h)*.43; ctx.save(); ctx.strokeStyle='rgba(110,230,135,.18)'; ctx.lineWidth=1;
  for(let i=1;i<=4;i++){ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(cx,cy,rr*i/4,0,Math.PI*2); ctx.stroke();}
  for(let a=0;a<360;a+=30){const rad=(a-90)*Math.PI/180; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(rad)*rr,cy+Math.sin(rad)*rr); ctx.stroke();}
  ctx.setLineDash([]); ctx.restore();
  for(const p of aircraft) drawPlane(p,w,h);
}
function drawPlane(p,w,h){
  const pos={x:p.x/100*w,y:p.y/100*h}; const col=p.risk>.45?'#ff4d42':p.emergency?'#ffba3b':p.kind==='departure'?'#58b7ff':'#5bf06d';
  ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=p.selected?2.5:1.4; ctx.shadowColor=col; ctx.shadowBlur=p.selected?14:6;
  // trail
  ctx.globalAlpha=.45; ctx.beginPath(); p.trail.forEach((q,i)=>{const x=q.x/100*w,y=q.y/100*h; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y)}); ctx.stroke(); ctx.globalAlpha=1;
  // vector
  const rad=degToRad(p.heading); const len=18+Math.min(55,p.speed/5); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pos.x+Math.cos(rad)*len,pos.y+Math.sin(rad)*len); ctx.stroke();
  // blip aircraft shape
  ctx.translate(pos.x,pos.y); ctx.rotate(rad+Math.PI/2); ctx.beginPath(); ctx.moveTo(0,-8); ctx.lineTo(5,6); ctx.lineTo(0,3); ctx.lineTo(-5,6); ctx.closePath(); ctx.stroke(); ctx.setTransform(1,0,0,1,0,0);
  if(p.selected){ctx.beginPath();ctx.arc(pos.x,pos.y,18,0,Math.PI*2);ctx.stroke();}
  // tag generated by code: dynamic, not asset image
  ctx.shadowBlur=0; ctx.font='12px ui-monospace, Menlo, Consolas, monospace'; ctx.fillStyle=col; const tx=pos.x+12, ty=pos.y-12;
  const tag=[p.id, `${p.type} ${p.status}`, `FL${Math.max(0,Math.round(p.alt)).toString().padStart(3,'0')} ${Math.round(p.speed)}KT`];
  ctx.fillText(tag[0],tx,ty); ctx.fillStyle='rgba(230,245,255,.86)'; ctx.fillText(tag[1],tx,ty+14); ctx.fillText(tag[2],tx,ty+28);
  ctx.restore();
}
function renderStrips(){
  const mk=p=>`<button class="strip ${p.risk>.4?'danger':p.emergency?'warning':''}" data-select="${p.id}"><b>${p.id}</b><span>${p.type} • ${p.status} • FL${Math.round(p.alt)}</span></button>`;
  $('#arrivals').innerHTML=aircraft.filter(p=>p.kind==='arrival').slice(0,8).map(mk).join('');
  $('#departures').innerHTML=aircraft.filter(p=>p.kind==='departure').slice(0,8).map(mk).join('');
  $$('[data-select]').forEach(b=>b.onclick=()=>{selected=b.dataset.select; renderSelected();});
}
function renderSelected(){ const p=aircraft.find(x=>x.id===selected); if(!p){$('#selectedBox').textContent='Nenhuma aeronave selecionada';return;} $('#selectedBox').innerHTML=`<b>${p.id}</b><br>${p.type} • ${p.status}<br>Heading ${Math.round(p.heading)}°<br>Speed ${Math.round(p.speed)} KT<br>FL${Math.round(p.alt)}`; }
canvas.addEventListener('pointerdown',e=>{ const rect=canvas.getBoundingClientRect(); const x=e.clientX-rect.left,y=e.clientY-rect.top; let best=null,bd=999; for(const p of aircraft){const px=p.x/100*rect.width,py=p.y/100*rect.height; const d=Math.hypot(px-x,py-y); if(d<bd){bd=d;best=p}} if(best&&bd<42){selected=best.id; addLog(`${best.id} selecionado.`); renderSelected();}});
$$('[data-cmd]').forEach(b=>b.addEventListener('click',()=>command(b.dataset.cmd)));
function command(cmd){ const p=aircraft.find(x=>x.id===selected); if(!p){addLog('Nenhuma aeronave selecionada.', 'warn'); return;} stats.commands++; score-=5;
  if(cmd==='left') p.heading=(p.heading+345)%360; if(cmd==='right') p.heading=(p.heading+15)%360; if(cmd==='slow') p.speed=clamp(p.speed-20,80,480); if(cmd==='fast') p.speed=clamp(p.speed+20,0,480);
  if(cmd==='climb') p.targetAlt=clamp(p.targetAlt+20,0,400); if(cmd==='descend') p.targetAlt=clamp(p.targetAlt-20,0,400);
  if(cmd==='hold'){p.hold=!p.hold;p.status=p.hold?'HOLD':(p.kind==='arrival'?'APP':'DEP')}
  if(cmd==='clear'){p.cleared=true;p.status=p.kind==='arrival'?'FINAL':'DEP'; if(p.kind==='arrival'){p.targetAlt=0;p.speed=Math.min(p.speed,190)} else {p.speed=Math.max(p.speed,90);p.targetAlt=120;}}
  if(cmd==='emergency'){p.emergency=true;p.status='EMERG';stats.emergencies++;}
  addLog(`KATL: ${p.id} ${cmd.toUpperCase()} autorizado.`); renderSelected(); }
function endGame(fail, reason){ if(!running) return; running=false; const final=Math.max(0,Math.round(score - stats.conflicts*60 + stats.landed*100 + stats.departed*80)); const best=Math.max(Number(localStorage.getItem('skywardBest')||0),final); localStorage.setItem('skywardBest',best); $('#resultTitle').textContent=fail?'GAME OVER':'FIM DE TURNO'; $('#resultReason').textContent=reason; $('#finalScore').textContent=final.toLocaleString('pt-BR'); $('#finalStats').innerHTML=`<div><span>Pousos concluídos</span><b>${stats.landed}</b></div><div><span>Decolagens concluídas</span><b>${stats.departed}</b></div><div><span>Conflitos detectados</span><b>${stats.conflicts}</b></div><div><span>Comandos emitidos</span><b>${stats.commands}</b></div><div><span>Emergências</span><b>${stats.emergencies}</b></div><div><span>Build</span><b>${BUILD}</b></div>`; go('result'); }
renderLog();
