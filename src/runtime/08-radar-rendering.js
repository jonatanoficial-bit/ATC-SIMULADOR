/* @skyward-module 08-radar-rendering
 * Radar, operational map, procedures, telemetry and aircraft drawing.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('08-radar-rendering');
function draw(){
  const r = canvas.getBoundingClientRect(), w=r.width, h=r.height;
  ctx.clearRect(0,0,w,h);
  if(radarFilters.map && asset.map.complete){ ctx.globalAlpha=.30; ctx.drawImage(asset.map,0,0,w,h); ctx.globalAlpha=1; }
  drawScope(w,h);
  drawWeatherOverlay(w,h);
  drawOperationalMap(w,h);
  drawProfessionalProcedures(w,h);
  drawPublishedProceduresOverlay?.(ctx,w,h);
  drawConflictPredictions(w,h);
  drawSafetyEnvelope(w,h);
  drawRunwayQueue(w,h);
  for(const p of aircraft) drawPlane(p,w,h);
  drawRadarTelemetry(w,h);
}
function drawOperationalMap(w,h){
  const P = (x,y)=>({x:x/100*w,y:y/100*h});
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  const graph=activeAirportGraph || airportSurfaceGraphFor?.();
  // taxiway network
  ctx.strokeStyle='rgba(210,168,68,.32)'; ctx.lineWidth=Math.max(2,w*.004);
  (graph?.taxiways||[]).forEach(t=>{
    const pts=Array.isArray(t.points)?t.points:[]; if(pts.length<2) return;
    ctx.beginPath(); pts.forEach((pt,i)=>{ const px=P(pt.x,pt.y); if(i===0) ctx.moveTo(px.x,px.y); else ctx.lineTo(px.x,px.y); }); ctx.stroke();
    const mid=pts[Math.floor(pts.length/2)]||pts[0]; const mp=P(mid.x,mid.y); ctx.fillStyle='rgba(255,214,122,.72)'; ctx.font='700 9px ui-monospace'; ctx.fillText(t.id,mp.x+4,mp.y-4);
  });
  // secondary runways
  (secondaryRunways||[]).forEach(rw=>{
    const a=P(rw.x1,rw.y1), b=P(rw.x2,rw.y2); ctx.lineWidth=Math.max(10,h*.024); ctx.strokeStyle='rgba(15,18,22,.65)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    ctx.lineWidth=1.5; ctx.strokeStyle='rgba(175,190,205,.28)'; ctx.setLineDash([10,9]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  });
  // active runway
  const a=P(runway.x1,runway.y1), b=P(runway.x2,runway.y2); ctx.lineWidth=Math.max(16,h*.035); ctx.strokeStyle='rgba(20,24,28,.98)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.lineWidth=Math.max(2,h*.004); ctx.strokeStyle=runwayOccupiedBy?'rgba(255,77,66,.95)':'rgba(100,255,130,.85)'; ctx.setLineDash([12,8]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='rgba(255,255,255,.58)'; ctx.lineWidth=1; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // approach corridor and final sector
  const ff=P(finalFix.x,finalFix.y), th=P((activeRunwayObject?.()?.arrivalThreshold?.x)||runway.x2,(activeRunwayObject?.()?.arrivalThreshold?.y)||runway.y2); ctx.strokeStyle='rgba(91,240,109,.28)'; ctx.lineWidth=2; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(ff.x,ff.y); ctx.lineTo(th.x,th.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle='rgba(91,240,109,.75)'; ctx.beginPath(); ctx.arc(ff.x,ff.y,5,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText('FINAL FIX', ff.x+8, ff.y+4);
  ctx.font='700 12px ui-monospace,Consolas,monospace'; ctx.fillStyle='rgba(235,245,255,.90)'; ctx.fillText(`RWY ${String(runway.name).split('/')[0]}`, a.x-8, a.y-18); ctx.fillText(`RWY ${String(runway.name).split('/')[1]||runway.name}`, b.x-42, b.y-18);
  (activeRunwayObject?.()?.exits||[]).forEach((ex,i)=>{ const e=P(ex.x,ex.y); ctx.fillStyle='rgba(216,163,72,.95)'; ctx.beginPath(); ctx.arc(e.x,e.y,4,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText(ex.id||`E${i+1}`, e.x+6, e.y+4); });
  gates.forEach((g,i)=>{ const gp=P(g.x,g.y); ctx.strokeStyle='rgba(120,180,220,.25)'; ctx.strokeRect(gp.x-10,gp.y-7,20,14); ctx.fillStyle='rgba(190,215,235,.72)'; ctx.font='700 9px ui-monospace'; ctx.fillText(g.id||`${g.label}${i+1}`,gp.x-9,gp.y+3); });
  holdingPoints.forEach((h,i)=>{ const hp=P(h.x,h.y); ctx.fillStyle='rgba(255,191,61,.84)'; ctx.beginPath(); ctx.arc(hp.x,hp.y,3.2,0,Math.PI*2); ctx.fill(); ctx.font='700 9px ui-monospace'; ctx.fillText(h.id||`H${i+1}`,hp.x+5,hp.y-4); });
  if(runwayOccupiedBy){ ctx.fillStyle='rgba(255,77,66,.92)'; ctx.font='900 13px ui-monospace'; ctx.fillText(`PISTA OCUPADA: ${runwayOccupiedBy}`, P(19,Math.max(8,runway.y1-5)).x, P(19,Math.max(8,runway.y1-5)).y); }
  ctx.restore();
}

function drawScope(w,h){
  const cx=w/2, cy=h/2, rr=Math.min(w,h)*.46;
  ctx.save();
  ctx.fillStyle='rgba(2,7,10,.20)'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(82,220,110,.08)'; ctx.lineWidth=1;
  const step=Math.max(28,Math.min(w,h)/12);
  for(let x=(w%step);x<w;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=(h%step);y<h;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.strokeStyle='rgba(110,230,135,.16)';
  for(let i=1;i<=5;i++){ ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(cx,cy,rr*i/5,0,Math.PI*2); ctx.stroke(); }
  ctx.setLineDash([8,14]);
  for(let a=0;a<360;a+=15){
    const r=degToRad(a); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(r)*rr,cy+Math.sin(r)*rr); ctx.stroke();
    if(a%30===0){ ctx.save(); ctx.fillStyle='rgba(150,210,170,.36)'; ctx.font='700 9px ui-monospace'; ctx.fillText(String(a).padStart(3,'0'), cx+Math.cos(r)*(rr+10)-8, cy+Math.sin(r)*(rr+10)+3); ctx.restore(); }
  }
  ctx.setLineDash([]); ctx.strokeStyle='rgba(91,240,109,.28)'; ctx.beginPath(); ctx.moveTo(cx-9,cy); ctx.lineTo(cx+9,cy); ctx.moveTo(cx,cy-9); ctx.lineTo(cx,cy+9); ctx.stroke();
  // sweeping radar arm
  const t=(performance.now()/4800)%(Math.PI*2); const grd=ctx.createRadialGradient(cx,cy,8,cx,cy,rr);
  grd.addColorStop(0,'rgba(91,240,109,.16)'); grd.addColorStop(1,'rgba(91,240,109,0)');
  ctx.fillStyle=grd; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,rr,t-.10,t+.10); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawConflictPredictions(w,h){
  if(!radarFilters.safety || !Array.isArray(conflictPredictions)) return;
  ctx.save();
  conflictPredictions.forEach(c=>{
    const a=aircraft.find(p=>p.id===c.a), b=aircraft.find(p=>p.id===c.b); if(!a||!b) return;
    const ax=a.x/100*w, ay=a.y/100*h, bx=b.x/100*w, by=b.y/100*h;
    const col=c.level==='danger'?'rgba(255,77,66,.78)':'rgba(255,191,61,.68)';
    ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=c.level==='danger'?2.4:1.7; ctx.setLineDash([8,6]);
    ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke(); ctx.setLineDash([]);
    const mx=(ax+bx)/2, my=(ay+by)/2;
    ctx.font='900 11px ui-monospace,Consolas,monospace'; ctx.fillText(c.level==='danger'?'CONFLITO':'SEPARAÇÃO', mx+6, my-6);
    ctx.beginPath(); ctx.arc(a.x/100*w,a.y/100*h,c.level==='danger'?26:20,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(b.x/100*w,b.y/100*h,c.level==='danger'?26:20,0,Math.PI*2); ctx.stroke();
  });
  ctx.restore();
}

function drawSafetyEnvelope(w,h){
  if(!radarFilters.safety) return;
  const p=aircraft.find(x=>x.id===selected);
  if(!p) return;
  const pt=pctToPx(p,w,h);
  const risk=nearestSeparationThreat(p);
  ctx.save();
  ctx.setLineDash([5,5]);
  ctx.strokeStyle = risk ? 'rgba(255,77,66,.85)' : 'rgba(91,240,109,.28)';
  ctx.lineWidth = risk ? 2.2 : 1.2;
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,Math.max(24,w*.055),0,Math.PI*2);
  ctx.stroke();
  if(risk){
    const op=pctToPx(risk.other,w,h);
    ctx.setLineDash([]);
    ctx.strokeStyle='rgba(255,77,66,.9)';
    ctx.beginPath(); ctx.moveTo(pt.x,pt.y); ctx.lineTo(op.x,op.y); ctx.stroke();
    ctx.fillStyle='rgba(255,77,66,.95)'; ctx.font='700 12px ui-monospace,monospace';
    ctx.fillText('SEP ALERT', (pt.x+op.x)/2+8, (pt.y+op.y)/2-8);
  }
  ctx.restore();
}
function drawRunwayQueue(w,h){
  ctx.save();
  const x=14, y=44; ctx.font='700 10px ui-monospace,Consolas,monospace';
  ctx.fillStyle='rgba(230,245,255,.70)'; ctx.fillText('APP SEQ: '+(runwayQueue.arrivals.join(' > ')||'---'), x, y);
  ctx.fillStyle='rgba(88,183,255,.70)'; ctx.fillText('DEP SEQ: '+(runwayQueue.departures.join(' > ')||'---'), x, y+13);
  ctx.restore();
}


function drawProcedurePath(points,w,h,color,label){
  if(!Array.isArray(points) || points.length<2) return;
  const P=(o)=>pctToPx(o,w,h);
  ctx.save();
  ctx.strokeStyle=color || 'rgba(91,240,109,.45)';
  ctx.lineWidth=Math.max(1.2,w*.0018);
  ctx.setLineDash([10,8]);
  ctx.beginPath();
  points.forEach((pt,i)=>{ const p=P(pt); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
  ctx.stroke();
  ctx.setLineDash([]);
  if(label){
    const p=P(points[Math.max(0,Math.floor(points.length/2))]);
    ctx.fillStyle=color || 'rgba(91,240,109,.75)';
    ctx.font='800 10px ui-monospace,Consolas,monospace';
    ctx.fillText(label,p.x+8,p.y-6);
  }
  ctx.restore();
}

function drawProfessionalProcedures(w,h){
  if(!radarFilters.procedures) return;
  try{
    const P=(o)=>pctToPx(o,w,h);
    ctx.save();
    // controlled terminal area boundary
    ctx.strokeStyle='rgba(79,181,255,.18)';
    ctx.lineWidth=1.2;
    ctx.setLineDash([12,10]);
    ctx.beginPath();
    ctx.ellipse(w*.50,h*.48,w*.43,h*.36,0,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ILS localizer fan / feather
    if(radarFilters.final){
      const th=P(PROCEDURE_LAYER.ils.threshold), faf=P(PROCEDURE_LAYER.ils.faf), iaf=P(PROCEDURE_LAYER.ils.iaf);
      const fanA=P({x:56,y:22}), fanB=P({x:60,y:39});
      ctx.fillStyle='rgba(91,240,109,.045)';
      ctx.beginPath(); ctx.moveTo(th.x,th.y); ctx.lineTo(fanA.x,fanA.y); ctx.lineTo(fanB.x,fanB.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(91,240,109,.38)'; ctx.lineWidth=1.8; ctx.setLineDash([8,6]);
      ctx.beginPath(); ctx.moveTo(th.x,th.y); ctx.lineTo(iaf.x,iaf.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(91,240,109,.78)'; ctx.font='900 10px ui-monospace,Consolas,monospace';
      ctx.fillText(PROCEDURE_LAYER.ils.name, faf.x+8, faf.y+12);
    }

    PROCEDURE_LAYER.routes.forEach(r=>{
      if(r.type==='arrival' && !radarFilters.final) return;
      drawProcedurePath(r.pts,w,h,r.color,r.id);
    });

    PROCEDURE_LAYER.fixes.forEach(f=>{
      if(f.type==='departure' && !radarFilters.vectors) return;
      const p=P(f);
      const col=f.type==='arrival'?'rgba(91,240,109,.80)':f.type==='departure'?'rgba(88,183,255,.80)':f.type==='hold'?'rgba(255,191,61,.80)':'rgba(230,245,255,.75)';
      ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=1.4;
      if(f.type==='hold'){
        ctx.setLineDash([4,4]); ctx.beginPath(); ctx.ellipse(p.x,p.y,18,10,-.25,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
      }else{
        ctx.beginPath(); ctx.moveTo(p.x-5,p.y); ctx.lineTo(p.x+5,p.y); ctx.moveTo(p.x,p.y-5); ctx.lineTo(p.x,p.y+5); ctx.stroke();
      }
      ctx.font='800 9px ui-monospace,Consolas,monospace';
      ctx.fillText(`${f.id} ${f.name}`,p.x+7,p.y-7);
    });
    ctx.restore();
  }catch(e){ safeLogError(e,'draw-professional-procedures'); }
}

function drawRadarTelemetry(w,h){
  try{
    ctx.save();
    const mode = SAFE_MODE.perf?.mode==='reduced' ? 'PERF REDUZIDA' : 'NORMAL';
    const scope = PROCEDURE_LAYER.scopeNm || 60;
    const selectedPlane=aircraft.find(p=>p.id===selected);
    const lines=[
      `${airport().icao} ${currentOpsProfile?.layout||'GEN'} SCOPE ${scope}NM`,
      `RWY ${runway.name} ${runwayOccupiedBy?'OCC '+runwayOccupiedBy:'FREE'} ${RUNWAY_OPS.mode}`,
      `ACFT ${aircraft.length}/${SAFE_MODE.maxAircraft} PERF ${mode}`,
      selectedPlane ? `SEL ${selectedPlane.id} ${getSector(selectedPlane)} HDG ${Math.round(selectedPlane.heading)} FL${Math.round(selectedPlane.alt)} FUEL ${Math.round(selectedPlane.fuel??0)}%` : (emergencyDirector.active ? `EMERG ${emergencyDirector.target}` : 'SEL ---')
    ];
    ctx.fillStyle='rgba(3,8,14,.60)';
    ctx.strokeStyle='rgba(151,202,255,.16)';
    ctx.lineWidth=1;
    const boxW=Math.min(w*.38,260), boxH=18+lines.length*14;
    ctx.fillRect(w-boxW-10,10,boxW,boxH);
    ctx.strokeRect(w-boxW-10,10,boxW,boxH);
    ctx.font='800 10px ui-monospace,Consolas,monospace';
    lines.forEach((line,i)=>{
      ctx.fillStyle=i===1 && runwayOccupiedBy ? 'rgba(255,191,61,.90)' : 'rgba(203,236,255,.82)';
      ctx.fillText(line,w-boxW,28+i*14);
    });
    if(radarFilters.range){
      ctx.strokeStyle='rgba(230,245,255,.36)';
      ctx.beginPath(); ctx.moveTo(16,h-20); ctx.lineTo(Math.min(156,w*.22),h-20); ctx.stroke();
      ctx.fillStyle='rgba(230,245,255,.70)';
      ctx.font='800 10px ui-monospace,Consolas,monospace';
      ctx.fillText('10 NM',18,h-26);
    }
    const badge=document.querySelector('#radarModeBadge');
    if(badge) badge.textContent = `RADAR PROFISSIONAL • ${scope}NM • ${mode}`;
    ctx.restore();
  }catch(e){ safeLogError(e,'draw-radar-telemetry'); }
}

function drawPlane(p,w,h){
  const pos = {x:p.x/100*w, y:p.y/100*h};
  const col = p.conflictLevel==='danger' ? '#ff4d42' : p.conflictLevel==='warn' ? '#ffbf3d' : p.risk>.45 ? '#ff4d42' : p.emergency ? '#ffbf3d' : p.status==='PARKED' ? '#a8b3bd' : p.kind==='departure' ? '#58b7ff' : '#5bf06d';
  ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=p.selected?2.5:1.4; ctx.shadowColor=col; ctx.shadowBlur=p.selected?15:5;
  ctx.globalAlpha=.45; ctx.beginPath(); p.trail.forEach((q,i)=>{ const x=q.x/100*w, y=q.y/100*h; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.globalAlpha=1;
  const rad=degToRad(p.heading);
  if(radarFilters.vectors && !['PARKED','HOLD_SHORT','LINEUP'].includes(p.status)){ const len=14+Math.min(52,p.speed/5.5); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pos.x+Math.cos(rad)*len,pos.y+Math.sin(rad)*len); ctx.stroke(); const pred=estimatePosition(p,45); ctx.globalAlpha=.55; ctx.setLineDash([4,5]); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pred.x/100*w,pred.y/100*h); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }
  ctx.translate(pos.x,pos.y); ctx.rotate(rad+Math.PI/2); ctx.beginPath();
  if(['PARKED','PUSHBACK','TAXI','HOLD_SHORT'].includes(p.status) || p.alt<8){ ctx.rect(-5,-5,10,10); }
  else { ctx.moveTo(0,-8); ctx.lineTo(5,6); ctx.lineTo(0,3); ctx.lineTo(-5,6); ctx.closePath(); }
  ctx.stroke(); ctx.setTransform(1,0,0,1,0,0);
  if(p.selected){ ctx.beginPath(); ctx.arc(pos.x,pos.y,19,0,Math.PI*2); ctx.stroke(); }
  ctx.shadowBlur=0;
  const hasReq = requests.some(r=>r.id===p.id);
  const showLabel = radarFilters.labels && (p.selected || hasReq || p.conflictLevel!=='ok' || !['PARKED','PUSHBACK'].includes(p.status));
  if(showLabel){
    ctx.font=(w<430?'9px':'11px')+' ui-monospace,Menlo,Consolas,monospace'; ctx.fillStyle=col;
    const tx=pos.x+10, ty=pos.y-10;
    ctx.fillText(p.id,tx,ty);
    if(p.selected || w>=430 || !['PARKED','PUSHBACK','TAXI'].includes(p.status)){
      ctx.fillStyle='rgba(230,245,255,.86)'; ctx.fillText(`${p.status} FL${Math.max(0,Math.round(p.alt)).toString().padStart(3,'0')}`,tx,ty+12);
      ctx.fillText(`${Math.round(p.speed)}KT F${Math.round(p.fuel??0)}%`,tx,ty+24);
      if(p.selected && typeof aircraftEnvelopeState==='function'){ ctx.fillStyle='rgba(88,183,255,.86)'; ctx.fillText(`${wakeCategory(p)} ${aircraftEnvelopeState(p)}`,tx,ty+36); }
    }
    if(hasReq){ ctx.fillStyle='rgba(255,191,61,.95)'; ctx.fillText('REQ',tx,ty+(p.selected?36:28)); }
    if((p.fuelState&&p.fuelState!=='OK') || p.emergency){ ctx.fillStyle=p.emergency?'#ff4d42':'#ffbf3d'; ctx.fillText(p.emergency?'MAYDAY':p.fuelState,tx,ty+(p.selected?60:52)); }
    if(p.conflictLevel && p.conflictLevel!=='ok'){ ctx.fillStyle=p.conflictLevel==='danger'?'#ff4d42':'#ffbf3d'; ctx.fillText(p.conflictLevel==='danger'?'CNFL':'SEP',tx,ty+(p.selected?48:40)); }
  }
  ctx.restore();
}

