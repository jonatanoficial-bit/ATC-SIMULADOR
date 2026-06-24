/* @skyward-module 07-simulation-safety
 * Game loop, simulation, conflict prediction and safety.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('07-simulation-safety');
function loop(t){ try{ if(!running || !$('#game')?.classList.contains('active')) return; SAFE_MODE.lastFrame=t; const rawDt=Math.min(.08,Math.max(0,(t-last)/1000)); const dt=rawDt*(typeof atcDtScale==='function'?atcDtScale():1); last=t; adaptivePerformanceGuard(rawDt); if(!paused) update(dt); draw(); requestAnimationFrame(loop); }catch(e){ showSafeMode(e); } }
function update(dt){
  try{ window.SKYWARD_REPLAY?.step?.(dt); }catch(e){ safeLogError(e,'replay-step'); }
  try{ updateRunwayOps(); updateFuelAndEmergency(dt); maybeGenerateOperationalEmergency(dt); }catch(e){ safeLogError(e,'runway-ops-update'); }
  sanitizeAircraftList(); aircraft.forEach(p=>{ try{ normalizeAircraftPerformance?.(p); }catch(_e){} });
  const elapsed = window.SKYWARD_REPLAY?.elapsed ? window.SKYWARD_REPLAY.elapsed() : (performance.now()-startTime)/1000;
  $('#clock').textContent = new Date(elapsed*1000).toISOString().substring(14,19);
  $('#score').textContent = Math.max(0,Math.round(score)).toLocaleString('pt-BR');
  if(elapsed>420) return endGame(false,'Turno concluído com segurança.');
  spawnTimer += dt;
  if(spawnTimer>airportSpawnInterval() && aircraft.length<Math.min(SAFE_MODE.maxAircraft, 10 + Math.round((currentOpsProfile?.spawn||.58)*5))){ spawnTimer=0; const arrChance=String(currentOpsProfile?.layout||'').includes('single') ? .54 : .60; const p=makePlane(Date.now()%1000, skywardRandomUnit()<arrChance?'arrival':'departure'); aircraft.push(p); addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'); }
  updatePlanes(dt); predictConflicts(); checkRunway(); updateSurfaceSafetyDirector?.(dt); checkConflicts(); checkMissedRequests();
  score += dt * (aircraft.length * 1.4);
  maybeSaveGoodState('running');
  if(performance.now()-lastUiRenderAt>=180) renderGameplayUi();
}

function renderGameplayUi(force=false){
  const now=performance.now();
  if(!force && now-lastUiRenderAt<160) return;
  lastUiRenderAt=now;
  renderStrips(); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
  updateOperationalHints(); renderRunwayBoard(); renderFuelBoard(); renderAirportOpsBoard(); renderSurfaceSafetyBoard?.();
  renderMissionBoard(); renderHandoffAdvisor(); renderMobileGameplay();
}

function estimatePosition(p, seconds=45){
  const speed = Math.max(0, Number(p?.speed)||0);
  const hdg = degToRad(Number(p?.heading)||0);
  const nmScale = (speed/220) * SIM_SPEED * 4.6 * seconds;
  return { x:(Number(p?.x)||0)+Math.cos(hdg)*nmScale, y:(Number(p?.y)||0)+Math.sin(hdg)*nmScale, alt:Number(p?.targetAlt ?? p?.alt ?? 0) };
}
function predictConflicts(){
  try{
    const preds=[];
    const active=aircraft.filter(p=>p && !['PARKED','PUSHBACK'].includes(p.status));
    active.forEach(p=>{ p.conflictLevel='ok'; p.conflictText=''; });
    for(let i=0;i<active.length;i++){
      for(let j=i+1;j<active.length;j++){
        const a=active[i], b=active[j];
        if(a.id===b.id) continue;
        const aNow={x:a.x,y:a.y,alt:a.alt||0}, bNow={x:b.x,y:b.y,alt:b.alt||0};
        const dNow=dist(aNow,bNow); const vNow=Math.abs((a.alt||0)-(b.alt||0));
        const aF=estimatePosition(a,55), bF=estimatePosition(b,55);
        const dFuture=dist(aF,bF); const vFuture=Math.abs((aF.alt||0)-(bF.alt||0));
        const sameAir = !['PARKED','TAXI','HOLD_SHORT','LINEUP'].includes(a.status) && !['PARKED','TAXI','HOLD_SHORT','LINEUP'].includes(b.status);
        const wakeReq = requiredWakeSpacing(a,b); const risky = sameAir && ((dNow<Math.max(7.5,wakeReq+2.0) && vNow<18) || (dFuture<Math.max(8.5,wakeReq+2.5) && vFuture<22));
        if(risky){
          const level=(dNow<4.8 && vNow<12) || (dFuture<5.2 && vFuture<14) ? 'danger':'warn';
          a.conflictLevel=b.conflictLevel=level;
          a.conflictText=b.conflictText=`${a.id}/${b.id}`;
          preds.push({a:a.id,b:b.id,level,dNow,dFuture,vNow,vFuture,wakeReq,ax:aF.x,ay:aF.y,bx:bF.x,by:bF.y});
        }
      }
    }
    runwayQueue.arrivals = aircraft.filter(p=>p.kind==='arrival' && ['APP','FINAL','EMERG','HOLD'].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix)).map(p=>p.id).slice(0,5);
    runwayQueue.departures = aircraft.filter(p=>p.kind==='departure' && ['HOLD_SHORT','LINEUP','DEP'].includes(p.status)).map(p=>p.id).slice(0,5);
    conflictPredictions=preds.slice(0,8);
    return conflictPredictions;
  }catch(e){ safeLogError(e,'predict-conflicts'); conflictPredictions=[]; return conflictPredictions; }
}


function arrivalOnShortFinal(excludeId=null){
  return aircraft.filter(p=>p && p.id!==excludeId && p.kind==='arrival' && ['APP','FINAL','EMERG'].includes(p.status))
    .filter(p=>dist(p, finalFix) <= SEPARATION_RULES.shortFinalNm || p.status==='FINAL')
    .sort((a,b)=>dist(a,finalFix)-dist(b,finalFix))[0] || null;
}
function nearestSeparationThreat(p){
  if(!p) return null;
  let best=null;
  for(const o of aircraft){
    if(!o || o.id===p.id) continue;
    const d=dist(p,o);
    const vertical=Math.abs((p.alt||0)-(o.alt||0));
    const airborneA=!['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(p.status);
    const airborneB=!['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(o.status);
    if(airborneA && airborneB && d<SEPARATION_RULES.lateralNm && vertical<SEPARATION_RULES.verticalFL){
      const score=(SEPARATION_RULES.lateralNm-d)*10+(SEPARATION_RULES.verticalFL-vertical);
      if(!best || score>best.score) best={other:o,d,vertical,score,msg:`Separação crítica com ${o.id}: ${d.toFixed(1)} NM / FL${Math.round(vertical)}`};
    }
  }
  return best;
}
function commandRisk(p, cmd){
  if(cmd==='noop' || cmd==='more' || cmd==='nextRequest') return {level:'ok', block:false, msg:'Ação de interface.'};
  if(!p) return {level:'warn', block:true, msg:'Selecione uma aeronave antes de emitir comando.'};
  const req=requests.find(r=>r.id===p.id);
  const surfaceRisk = surfaceCommandRisk?.(p,cmd);
  if(surfaceRisk?.block) return surfaceRisk;
  const incidentRisk = typeof incidentRiskForCommand==='function' ? incidentRiskForCommand(cmd,p) : {level:'ok',block:false,msg:''};
  if(incidentRisk.block || incidentRisk.level==='danger') return incidentRisk;
  const netRisk = typeof networkCommandRisk==='function' ? networkCommandRisk(cmd,p) : {level:'ok',block:false,msg:''};
  if(netRisk.block || netRisk.level==='danger') return netRisk;
  const expectedType=CLEARANCE_COMMANDS[cmd];
  if(expectedType && req?.type!==expectedType){
    return {level:'warn', block:true, msg:req ? `Pedido ativo é ${req.type.toUpperCase()}, não ${expectedType.toUpperCase()}.` : `Não existe pedido ${expectedType.toUpperCase()} pendente.`};
  }
  if((p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') && ['hold','deny','holdShort'].includes(cmd)) return {level:'danger', block:true, msg:`${p.id} em combustível crítico: espera/negação bloqueada.`};
  if(p.emergency && ['deny','holdShort'].includes(cmd)) return {level:'danger', block:true, msg:`${p.id} em emergência: priorize pouso/vetor final.`};
  const shortFinal=arrivalOnShortFinal(p.id);
  const sep=nearestSeparationThreat(p);
  if(sep && (expectedType || ['vectorFinal','fast','climb','descend'].includes(cmd))) return {level:'danger', block:false, msg:sep.msg};
  if(expectedType){
    if(expectedType==='landing'){
      if(runwayOccupiedBy && runwayOccupiedBy!==p.id) return {level:'danger', block:true, msg:`Pista ocupada por ${runwayOccupiedBy}. Pouso bloqueado.`};
      const preceding=aircraft.find(o=>o.id!==p.id && o.kind==='arrival' && o.status==='FINAL' && dist(o,finalFix)<dist(p,finalFix));
      if(preceding) return {level:'warn', block:false, msg:`Chegada precedente ${preceding.id} ainda na final.`};
    }
    if(expectedType==='lineup' || expectedType==='takeoff'){
      if(runwayOccupiedBy && runwayOccupiedBy!==p.id) return {level:'danger', block:true, msg:`Pista ocupada por ${runwayOccupiedBy}.`};
      if(shortFinal) return {level:'danger', block:true, msg:`${shortFinal.id} em aproximação curta. Saída bloqueada.`};
    }
  }
  if(surfaceRisk?.level==='warn') return surfaceRisk;
  if(cmd==='holdShort' && !['TAXI','HOLD_SHORT'].includes(p.status)) return {level:'warn', block:false, msg:'Hold short é indicado para tráfego de solo/táxi.'};
  if(cmd==='vectorFinal' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Vetor final disponível apenas para chegadas.'};
  if(cmd==='goAround' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Arremeter aplica-se a chegadas.'};
  return {level:'ok', block:false, msg:'Comando dentro do envelope operacional.'};
}
function updateSafetyState(){
  const surface=updateSurfaceSafetyDirector?.(0);
  const conflicts=Array.isArray(conflictPredictions)?conflictPredictions.length:0;
  const selectedPlane=aircraft.find(x=>x.id===selected);
  const sep=selectedPlane ? nearestSeparationThreat(selectedPlane) : null;
  const shortFinal=arrivalOnShortFinal();
  let score=100;
  const messages=[];
  if(runwayOccupiedBy){ score-=18; messages.push(`Pista protegida: ${runwayOccupiedBy}.`); }
  if(surface?.level==='danger'){ score-=22; messages.push(surface.alerts?.[0]?.msg || 'Risco crítico de superfície.'); }
  else if(surface?.level==='warn'){ score-=8; messages.push(surface.alerts?.[0]?.msg || 'Atenção em superfície.'); }
  if(conflicts){ score-=Math.min(60,conflicts*18); const wakeText=(conflictPredictions[0]?.wakeReq?` Wake ${conflictPredictions[0].wakeReq.toFixed(1)}NM.`:''); messages.push(`${conflicts} conflito(s) previstos no radar.${wakeText}`); }
  if(sep){ score-=30; messages.push(sep.msg); }
  if(shortFinal){ messages.push(`${shortFinal.id} em curta final: bloquear saídas não essenciais.`); }
  const fuelEmerg=aircraft.filter(p=>p.emergency || p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL');
  const lowFuel=aircraft.filter(p=>p.fuelState==='LOW');
  if(fuelEmerg.length){ score-=Math.min(55,fuelEmerg.length*22); messages.push(`${fuelEmerg.length} MAYDAY/FUEL crítico ativo.`); }
  if(lowFuel.length){ score-=Math.min(24,lowFuel.length*8); messages.push(`${lowFuel.length} aeronave(s) com combustível mínimo.`); }
  const overdue=requests.filter(r=>performance.now()-r.time>45000).length;
  if(overdue){ score-=Math.min(25,overdue*8); messages.push(`${overdue} solicitação(ões) com espera longa.`); }
  score=clamp(Math.round(score),0,100);
  const level=score<45?'danger':score<75?'warn':'ok';
  safetyState={score, level, messages:messages.length?messages:['Operação dentro dos limites.'], lastRisk:messages[0]||null};
  const ss=$('#safetyScore');
  if(ss){ ss.textContent=`SAFETY ${score}%`; ss.className='safety-score '+level; }
  const adv=$('#safetyAdvisor');
  if(adv){ adv.innerHTML=`<b>Safety Advisor: ${score}%</b>`+safetyState.messages.map(m=>`<span>${m}</span>`).join(''); adv.className='safety-advisor '+level; }
  return safetyState;
}
function updateOperationalHints(){
  try{ updateSafetyState(); }catch(e){ safeLogError(e,'safety-state'); }
  const p=aircraft.find(x=>x.id===selected);
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = getSector(p);
  if($('#sectorHelp')) $('#sectorHelp').textContent = p ? sectorLabel(p) : 'Selecione uma aeronave';
  if(typeof SKYWARD_WEATHER_OPS!=='undefined' && SKYWARD_WEATHER_OPS.state?.().flightRules==='LIFR') setDiagnostic('LIFR / BAIXA VISIBILIDADE','warn');
  else if(emergencyDirector.active) setDiagnostic('MAYDAY / PRIORIDADE ATIVA','danger');
  else if(conflictPredictions.some(c=>c.level==='danger')) setDiagnostic('CONFLITO PREVISTO','danger');
  else if(requests.some(r=>r.priority==='urgent')) setDiagnostic('EMERGÊNCIA NA FILA','danger');
  else if(conflictPredictions.length) setDiagnostic('SEPARAÇÃO EM ATENÇÃO','warn');
  else if(isRunwayProtectedByOther(p)) setDiagnostic('PISTA OCUPADA','warn');
  else setDiagnostic('SISTEMA OK','ok');
}
function updatePlanes(dt){
  incidentTick?.(dt);
  maybeTriggerIncident?.();
  for(const p of aircraft){
    p.selected = selected === p.id;
    if(p.status==='PARKED'){ updateAircraftPerformanceStep?.(p,dt,'PARKED'); p.speed = 0; }
    else if(p.status==='PUSHBACK'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'PUSHBACK');
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'pushback')||[], 'READY_TAXI');
      const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.26) ?? (p.groundTimer>9);
      if(done || p.groundTimer>9){ p.status='READY_TAXI'; p.speed=0; p.surfaceRoute=[]; addRequest(p,'taxi'); }
    } else if(p.status==='TAXI'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'TAXI');
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'taxi')||[], 'HOLD_SHORT');
      const hp = holdingPoints[p.groundIndex || 0] || holdingPoints[0] || {x:p.x,y:p.y};
      const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.36) ?? false;
      if(done || dist(p,hp)<1.6){ p.status='HOLD_SHORT'; p.speed=0; p.surfaceRoute=[]; addRequest(p,'lineup','warn'); }
    } else if(p.status==='LINEUP'){
      updateAircraftPerformanceStep?.(p,dt,'LINEUP'); p.speed = 0;
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'lineup')||[], 'LINEUP_READY');
      const line = (activeRunwayObject?.()||{}).lineup || {x:25,y:50}; const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.18) ?? false; p.heading=runwayHeadingValue?.()||270;
      if((done || dist(p,line)<2.0) && !requests.some(r=>r.id===p.id && r.type==='takeoff')) addRequest(p,'takeoff','warn');
    } else if(p.status==='DEP'){
      p.targetAlt = Math.max(p.targetAlt,160); stepProcedureGuidance?.(p,'SID'); p.heading = p.procedureId ? p.heading : (runwayHeadingValue?.() || p.heading || 270); updateAircraftPerformanceStep?.(p,dt,'DEP');
      moveByHeading(p, dt);
    } else if(p.status==='VACATE'){
      updateAircraftPerformanceStep?.(p,dt,'TAXI'); p.alt=0; const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.28) ?? true; p.speed=Math.max(0,Math.min(32,p.speed||0));
      if(done){ score += p.vacateBonus||0; addLog(`${p.id}: pista liberada via taxiway.`); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null; }
    } else if(p.status==='HOLD'){
      stepProcedureGuidance?.(p,'HOLD'); p.heading = p.holdingPattern ? (p.heading + 5*dt) % 360 : (p.heading + 8*dt) % 360; updateAircraftPerformanceStep?.(p,dt,'HOLD'); moveByHeading(p, dt*.75);
    } else if(p.status==='APP'){
      stepProcedureGuidance?.(p,'STAR'); if(!p.procedureId) p.heading += shortTurn(p.heading, headingTo(p, finalFix))*.018; updateAircraftPerformanceStep?.(p,dt,'APP'); moveByHeading(p, dt);
      if(dist(p,finalFix)<8 && !requests.some(r=>r.id===p.id && r.type==='landing')) addRequest(p,'landing','warn');
    } else if(p.status==='FINAL' || p.status==='EMERG'){
      stepProcedureGuidance?.(p,'APPROACH'); const threshold = activeRunwayObject?.()?.arrivalThreshold || {x:runway.x2,y:runway.y2}; if(!p.procedureId) p.heading += shortTurn(p.heading, headingTo(p, threshold))*.028; p.targetAlt=0; updateAircraftPerformanceStep?.(p,dt,p.status); moveByHeading(p, dt);
    }
    p.trail.push({x:p.x,y:p.y}); if(p.trail.length>54) p.trail.shift();
  }
  for(const p of [...aircraft]){
    const touchdownPoint = activeRunwayObject?.()?.arrivalThreshold || {x:runway.x2,y:runway.y2};
    if((p.status==='FINAL'||p.status==='EMERG') && dist(p,touchdownPoint)<2.8 && p.alt<10){
      const landingRisk = (typeof aircraftLandingRisk==='function' ? aircraftLandingRisk(p) : (p.speed>145?25:0)) + (typeof advancedWeatherLandingRisk==='function' ? advancedWeatherLandingRisk(p) : 0); const hardLanding = (landingRisk>24 || WX_STATE.severity>.72 || p.damage>30); if(hardLanding){ const dmg=Math.round(rand(8,22)+WX_STATE.severity*18+Math.min(18,landingRisk*.28)); stats.damaged=(stats.damaged||0)+1; score-=120; addLog(`${p.id}: pouso concluído com inspeção técnica. Dano ${dmg}%.`, 'warn'); } else { addLog(`${p.id}: toque confirmado, taxiando para livrar pista.`); } stats.landed++; if(p.emergency) stats.maydayResolved=(stats.maydayResolved||0)+1; score += p.emergency ? 1300 : 900; removeRequest(p.id); runwayOccupiedBy = p.id; p.status='VACATE'; p.alt=0; p.vacateBonus=35; beginSurfaceRoute?.(p, assignArrivalVacateRoute?.(p)||[], 'DONE');
    }
    if(p.status==='DEP' && (p.x<0 || p.x>104 || p.y<0 || p.y>100)){
      stats.departed++; score += 720; addLog(`${p.id}: decolagem concluída, contato com saída.`); removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
  }
}
function moveByHeading(p,dt){ const rad=degToRad(p.heading); const scale=(p.speed/220)*SIM_SPEED*4.6; p.x += Math.cos(rad)*scale*dt; p.y += Math.sin(rad)*scale*dt; }
function moveToward(p,t,amount){ const h=headingTo(p,t), r=degToRad(h); p.x += Math.cos(r)*amount*100; p.y += Math.sin(r)*amount*100; }
function shortTurn(a,b){ return QUALITY?.shortestTurn ? QUALITY.shortestTurn(a,b) : ((b-a+540)%360)-180; }
function pointToSegmentDistance(point,a,b){ const ax=a.x, ay=a.y, bx=b.x, by=b.y, px=point.x, py=point.y; const abx=bx-ax, aby=by-ay; const ab2=abx*abx+aby*aby||1; const t=Math.max(0,Math.min(1,((px-ax)*abx+(py-ay)*aby)/ab2)); const x=ax+abx*t, y=ay+aby*t; return Math.hypot(px-x,py-y); }
function checkRunway(){
  runwayOccupiedBy = null;
  const a={x:runway.x1,y:runway.y1}, b={x:runway.x2,y:runway.y2};
  for(const p of aircraft){ if(['LINEUP','DEP','FINAL','EMERG','VACATE'].includes(p.status) && pointToSegmentDistance(p,a,b)<6.2) runwayOccupiedBy = p.id; }
}
function checkMissedRequests(){
  const now = performance.now();
  for(const r of requests){
    const age = (now-r.time)/1000;
    const p = aircraft.find(x=>x.id===r.id); if(!p) continue;
    const requestPace=typeof atcPaceFactor==='function'?atcPaceFactor():1;
    if(age>52*requestPace && r.priority==='urgent') return endGame(true,`${r.id} em emergência ficou sem resposta.`);
    if(age>72*requestPace && r.priority!=='urgent'){ r.priority='warn'; score-=30; }
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

