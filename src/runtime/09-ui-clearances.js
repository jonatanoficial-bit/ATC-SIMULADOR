/* @skyward-module 09-ui-clearances
 * Traffic UI, requests, commands, clearances and action grids.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('09-ui-clearances');
// F15 bridge: commandRisk consults weatherRiskForCommand when available.
function renderStrips(){
  const arr = aircraft.filter(p=>p.kind==='arrival').slice(0,9);
  const dep = aircraft.filter(p=>p.kind==='departure' && !['PARKED','PUSHBACK'].includes(p.status)).slice(0,9);
  const grd = aircraft.filter(p=>['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(p.status)).slice(0,9);
  const mk = (p, type) => {
    const meta = type==='arr' ? `${p.type} • FL${Math.round(p.alt)} • ${Math.max(5,Math.round(dist(p,finalFix)))} NM • F${Math.round(p.fuel??0)}%` :
                  type==='dep' ? `${p.status==='LINEUP'?'PRONTO':p.status} • RWY ${runway.name} • F${Math.round(p.fuel??0)}%` :
                  `${p.status} • ${p.type} • VREF ${p.performance?.vRef||aircraftPerformanceProfile?.(p.type)?.finalSpeed||'--'}`;
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
  const ordered=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a));
  box.innerHTML = ordered.map(r=>{ const age=Math.floor((performance.now()-r.time)/1000); return `
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
    <div class="sel-top"><div class="sel-name"><b>${p.id}</b><small>${p.type} • ${sectorLabel(p)}</small></div><div class="sel-status">${p.status.replace('_',' ')}</div></div>
    <div class="sel-grid">
      <div class="sel-item"><span>ALT</span><b>FL${Math.round(p.alt)}</b></div>
      <div class="sel-item"><span>SPD</span><b>${Math.round(p.speed)}kt</b></div>
      <div class="sel-item"><span>HDG</span><b>${Math.round(p.heading)}°</b></div>
      <div class="sel-item"><span>POS</span><b>${p.kind==='arrival' ? `${Math.max(5,Math.round(dist(p,finalFix)))}NM` : 'SOLO'}</b></div>
      <div class="sel-item"><span>REQ</span><b>${req ? req.text : '---'}</b></div>
      <div class="sel-item"><span>SETOR</span><b>${op}</b></div><div class="sel-item"><span>WAKE</span><b>${wakeCategory(p)}</b></div><div class="sel-item"><span>VREF</span><b>${p.performance?.vRef||aircraftPerformanceProfile?.(p.type)?.finalSpeed||'--'}kt</b></div><div class="sel-item"><span>ENVELOPE</span><b>${aircraftEnvelopeState?.(p)||'NORMAL'}</b></div><div class="sel-item"><span>SURFACE</span><b>${surfaceSafetyState?.level?.toUpperCase?.()||'OK'}</b></div><div class="sel-item"><span>FUEL</span><b class="fuel-${fuelClass(p)}">${Math.round(p.fuel??0)}%</b></div><div class="sel-item"><span>DMG</span><b>${Math.round(p.damage||0)}%</b></div>
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
  if(cmd==='nextRequest'){ selectNextRequest(); return; }
  const p=aircraft.find(x=>x.id===selected); if(!p){ addLog('Nenhuma aeronave selecionada.','warn'); setDiagnostic('SELECIONE UMA AERONAVE','warn'); setReadback('selecione uma aeronave antes do comando','warn'); return; }
  const preRisk = commandRisk(p, cmd);
  if(preRisk.block){
    stats.blocked=(stats.blocked||0)+1;
    stats.safetyWarnings=(stats.safetyWarnings||0)+1;
    addLog(`${airport().icao}: comando bloqueado para ${p.id} — ${preRisk.msg}`, 'danger');
    setDiagnostic('COMANDO BLOQUEADO PELO SAFETY ADVISOR','danger');
    setReadback(`${p.id} comando bloqueado: ${preRisk.msg}`,'danger');
    renderActionGrid(); renderRunwayBoard(); renderMobileGameplay();
    return;
  }
  if(preRisk.level==='warn'){
    stats.safetyWarnings=(stats.safetyWarnings||0)+1;
    addLog(`${airport().icao}: aviso safety para ${p.id} — ${preRisk.msg}`, 'warn');
    setDiagnostic('COMANDO COM AVISO OPERACIONAL','warn');
  }
  stats.commands++; score -= 2;
  if(cmd==='left') p.heading=(p.heading+350)%360;
  if(cmd==='right') p.heading=(p.heading+10)%360;
  if(cmd==='slow') p.speed=clamp(p.speed-10,Math.max(40,(aircraftPerformanceProfile?.(p.type)?.minApproachSpeed||70)-20),320);
  if(cmd==='fast') p.speed=clamp(p.speed+10,0,(aircraftPerformanceProfile?.(p.type)?.maxApproachSpeed||240)+60);
  if(cmd==='climb') p.targetAlt=clamp(p.targetAlt+10,0,360);
  if(cmd==='descend') p.targetAlt=clamp(p.targetAlt-10,0,360);
  if(cmd==='hold'){ p.hold=!p.hold; if(p.kind==='arrival') p.status=p.hold?'HOLD':'APP'; if(p.hold) assignHoldingPattern?.(p); addLog(`${airport().icao}: ${p.id} ${p.hold?'entre em espera publicada':'prossiga aproximação'}.`); }
  if(cmd==='holdShort'){ if(['TAXI','LINEUP','DEP'].includes(p.status)){ p.status='HOLD_SHORT'; p.speed=0; p.cleared=false; addLog(`${airport().icao}: ${p.id} hold short pista ${runway.name}.`); } }
  if(cmd==='vectorFinal'){ if(p.kind==='arrival'){ p.status='APP'; p.hold=false; assignArrivalProcedure?.(p); p.heading=headingTo(p, finalFix); p.targetAlt=Math.min(p.targetAlt,45); p.speed=Math.min(p.speed,performanceTargetSpeed?.(p,'APP')||170); addLog(`${airport().icao}: ${p.id} vetor para interceptar ${p.procedureId||'final'} RWY ${runway.name}.`); } }
  if(cmd==='deny'){ denyRequest(p); }
  if(cmd==='goAround'){ p.status='APP'; p.cleared=false; assignMissedApproachProcedure?.(p); p.targetAlt=80; p.speed=Math.max(p.speed,performanceTargetSpeed?.(p,'APP')||170); p.heading=headingTo(p,{x:p.x<50?20:80,y:18}); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; addLog(`${airport().icao}: ${p.id} execute aproximação perdida publicada, suba para FL080.`, 'warn'); }
  if(cmd==='emergency'){ if(!p.emergency){ stats.emergencies=(stats.emergencies||0)+1; } p.emergency=true; p.emergencyType=p.emergencyType||'ATC DECLARED'; p.status=p.kind==='arrival'?'EMERG':p.status; p.fuel=Math.min(p.fuel||40,24); addRequest(p,'emergency','urgent'); setReadback(`${p.id} MAYDAY acknowledged, priority handling approved.`,'danger'); }
  if(CLEARANCE_COMMANDS[cmd]) handleClearance(p,CLEARANCE_COMMANDS[cmd]);
  else if(!['hold','emergency','deny'].includes(cmd)) addLog(`${airport().icao}: ${p.id} ${cmd.toUpperCase()} autorizado.`);
  p.sector=getSector(p); setReadback(atcReadbackFor(p,cmd), commandRisk(p,cmd).level==='danger'?'danger':'ok'); saveGoodState('after-command',true);
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); updateOperationalHints(); renderRunwayBoard();
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

function handleClearance(p, expectedType){
  const req = requests.find(r=>r.id===p.id && r.type===expectedType);
  if(!req){ addLog(`${p.id}: não há solicitação ${String(expectedType||'').toUpperCase()} pendente.`, 'warn'); stats.denied++; score-=20; return; }
  if(req.type==='landing'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO pouso, pista ocupada por ${runwayOccupiedBy}.`, 'warn'); stats.denied++; score-=50; return; }
    p.status='FINAL'; p.cleared=true; p.targetAlt=0; p.speed=Math.min(p.speed,performanceTargetSpeed?.(p,'FINAL')||165); p.sector='TWR'; removeRequest(p.id,'landing'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, autorizado pouso pista ${runway.name}.`); setReadback(`${p.id} autorizado pouso pista ${runway.name}.`,'ok'); score+=65; setDiagnostic('POUSO AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='pushback'){
    p.status='PUSHBACK'; p.sector='GND'; p.groundTimer=0; beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'pushback')||[], 'READY_TAXI'); removeRequest(p.id,'pushback'); addLog(`${airport().icao} GND: ${p.id}, pushback aprovado do gate ${p.gateId||'stand'}.`); setReadback(`${p.id} pushback aprovado.`,'ok'); score+=30; setDiagnostic('PUSHBACK APROVADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='taxi'){
    p.status='TAXI'; p.sector='GND'; p.groundIndex = Number.isInteger(p.groundIndex) ? p.groundIndex : Math.floor(rand(0,Math.max(1,holdingPoints.length))); beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'taxi')||[], 'HOLD_SHORT'); removeRequest(p.id,'taxi'); const hold=holdingPoints[p.groundIndex||0]; addLog(`${airport().icao} GND: ${p.id}, taxeie via grafo de solo até ponto ${hold?.id||'de espera'} pista ${runway.name}.`); setReadback(`${p.id} taxi autorizado para ponto de espera ${runway.name}.`,'ok'); score+=35; setDiagnostic('TÁXI AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='lineup'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} mantenha posição, pista ocupada.`, 'warn'); stats.denied++; score-=25; return; }
    p.status='LINEUP'; p.sector='TWR'; p.cleared=true; beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'lineup')||[], 'LINEUP_READY'); removeRequest(p.id,'lineup'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, alinhe e aguarde pista ${runway.name}.`); setReadback(`${p.id} alinhe e aguarde pista ${runway.name}.`,'ok'); score+=40; setDiagnostic('LINE UP AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='takeoff'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO decolagem, pista ocupada.`, 'warn'); stats.denied++; score-=40; return; }
    p.status='DEP'; p.sector='TWR'; assignDepartureProcedure?.(p); p.speed=Math.max(aircraftPerformanceProfile?.(p.type)?.rotationSpeed||130, p.speed||0); p.alt=0; p.targetAlt=160; p.heading=runwayHeadingValue?.()||270; p.surfaceRoute=[]; removeRequest(p.id,'takeoff'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, autorizado decolagem pista ${runway.name}. Após airborne contate DEP.`); setReadback(`${p.id} autorizado decolagem pista ${runway.name}.`,'ok'); score+=70; setDiagnostic('DECOLAGEM AUTORIZADA','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='emergency'){
    p.status='EMERG'; p.sector='EMERG'; p.cleared=true; p.targetAlt=0; p.speed=performanceTargetSpeed?.(p,'EMERG')||150; removeRequest(p.id,'emergency'); addLog(`${airport().icao}: ${p.id} emergência reconhecida, pista liberada, pouso imediato.`, 'danger'); setReadback(`${p.id} emergência reconhecida, pouso imediato autorizado.`,'danger'); score+=120; setDiagnostic('EMERGÊNCIA PRIORIZADA','danger'); renderRunwayBoard(); return;
  }
  addLog(`${p.id}: solicitação ${req.type} ainda não possui clearance seguro.`, 'warn'); stats.denied++; score-=12; setDiagnostic('COMANDO NÃO APLICÁVEL','warn');
}
function endGame(fail,reason){
  if(!running) return; running=false;
  const final = Math.max(0, Math.round(score - stats.conflicts*45 + stats.landed*120 + stats.departed*100 + stats.requests*10 - stats.denied*35));
  profile.score = Math.max(profile.score||0, final); profile.turns=(profile.turns||0)+1; profile.xp=(profile.xp||0)+Math.round(final/5)+stats.landed*30+stats.departed*20;
  while(profile.xp >= profile.level*1000){ profile.xp -= profile.level*1000; profile.level++; }
  const careerResult = updateCareerAfterShift?.(final, stats, fail, airport().icao);
  const economyResult = evaluateOperationalEconomy?.(final, stats, fail, airport().icao);
  const networkResult = evaluateNetworkFlow?.(final, stats, fail, airport().icao);
  const controlRoomResult = completeControlRoomShift?.(final, stats, fail, airport().icao);
  const releaseCandidateResult = evaluateReleaseCandidateShift?.(final, stats, fail, airport().icao);
  const goldMasterResult = evaluateGoldMasterShift?.(final, stats, fail, airport().icao);
  const postGoldMasterResult = window.SKYWARD_POST_GOLD_MASTER?.readiness?.();
  const postPublishHealthResult = window.SKYWARD_POST_PUBLISH_HEALTH?.evaluate?.();
  window.SKYWARD_PUBLIC_OPS?.completeTurn?.();
  const publicOpsResult = window.SKYWARD_PUBLIC_OPS?.evaluate?.();
  const trainingAcademyResult = evaluateTrainingShift?.(final, stats, fail, airport().icao);
  const trainingCoachResult = evaluateTrainingCoach?.(final, stats, fail, airport().icao);
  const internationalCampaignResult = evaluateInternationalCampaign?.(final, stats, fail, airport().icao);
  const airlineOpsResult = evaluateAirlineOps?.(final, stats, fail, airport().icao);
  const airportAuthorityResult = evaluateAirportAuthority?.(final, stats, fail, airport().icao);
  const crisisCommandResult = evaluateCrisisCommand?.(final, stats, fail, airport().icao);
  const safetyComplianceResult = auditSafetyCompliance?.(final, stats, fail, airport().icao);
  const infrastructureExpansionResult = evaluateInfrastructureExpansion?.(final, stats, fail, airport().icao);
  const environmentSustainabilityResult = evaluateEnvironmentSustainability?.(final, stats, fail, airport().icao);
  const revenueManagementResult = evaluateRevenueManagement?.(final, stats, fail, airport().icao);
  const workforceStaffingResult = evaluateWorkforceStaffing?.(final, stats, fail, airport().icao);
  const passengerReputationResult = evaluatePassengerReputation?.(final, stats, fail, airport().icao);
  const multiAirportNetworkResult = evaluateMultiAirportNetwork?.(final, stats, fail, airport().icao);
  const emergencyResponseResult = evaluateEmergencyResponse?.(final, stats, fail, airport().icao);
  const securityCyberResult = evaluateSecurityCyber?.(final, stats, fail, airport().icao);
  const assetMaintenanceResult = evaluateAssetMaintenance?.(final, stats, fail, airport().icao);
  const digitalTwinResult = evaluateDigitalTwin?.(final, stats, fail, airport().icao);
  const aiCopilotResult = evaluateAiCopilot?.(final, stats, fail, airport().icao);
  const radioPhraseologyResult = evaluateRadioPhraseology?.(final, stats, fail, airport().icao);
  const groundTurnaroundResult = evaluateGroundTurnaround?.(final, stats, fail, airport().icao);
  const cargoLogisticsResult = evaluateCargoLogistics?.(final, stats, fail, airport().icao);
  persistProfile('end-game');
  $('#resultTitle').textContent = fail ? 'GAME OVER' : 'FIM DE TURNO';
  $('#resultReason').textContent = reason;
  $('#finalScore').textContent = final.toLocaleString('pt-BR');
  $('#finalStats').innerHTML = `<div><span>Pousos concluídos</span><b>${stats.landed}</b></div><div><span>Decolagens concluídas</span><b>${stats.departed}</b></div><div><span>Solicitações recebidas</span><b>${stats.requests}</b></div><div><span>Clearances negados/incorretos</span><b>${stats.denied}</b></div><div><span>Conflitos detectados</span><b>${stats.conflicts}</b></div><div><span>Comandos emitidos</span><b>${stats.commands}</b></div><div><span>Comandos bloqueados</span><b>${stats.blocked||0}</b></div><div><span>Avisos Safety</span><b>${stats.safetyWarnings||0}</b></div><div><span>Conflitos de solo</span><b>${stats.surfaceConflicts||0}</b></div><div><span>Runway incursions</span><b>${stats.runwayIncursions||0}</b></div><div><span>Incidentes resolvidos</span><b>${stats.incidentsResolved||0}</b></div><div><span>Falhas em incidentes</span><b>${stats.incidentFailures||0}</b></div><div><span>Fechamentos de pista</span><b>${stats.runwayClosures||0}</b></div><div><span>Emergências</span><b>${stats.emergencies}</b></div><div><span>MAYDAY resolvidos</span><b>${stats.maydayResolved||0}</b></div><div><span>Combustível mínimo</span><b>${stats.lowFuel||0}</b></div><div><span>Danos/inspeções</span><b>${stats.damaged||0}</b></div><div><span>Aeroporto</span><b>${airport().icao}</b></div><div><span>Objetivos de missão</span><b>${mission?.completed?'concluídos':'parciais'}</b></div><div><span>Cargo Ops</span><b>${cargoLogisticsResult?.evaluation ? cargoLogisticsResult.evaluation.status : '---'}</b></div><div><span>Freight</span><b>${cargoLogisticsResult?.evaluation ? Math.round(cargoLogisticsResult.evaluation.freightRevenue/1000)+'k' : '---'}</b></div><div><span>Ground Ops</span><b>${groundTurnaroundResult?.evaluation ? groundTurnaroundResult.evaluation.status : '---'}</b></div><div><span>TAT Médio</span><b>${groundTurnaroundResult?.evaluation ? groundTurnaroundResult.evaluation.avgTurnaroundMin+'m' : '---'}</b></div><div><span>Radio Ops</span><b>${radioPhraseologyResult?.evaluation ? radioPhraseologyResult.evaluation.status : '---'}</b></div><div><span>Readback</span><b>${radioPhraseologyResult?.evaluation ? radioPhraseologyResult.evaluation.readbackRate+'%' : '---'}</b></div><div><span>AI Copilot</span><b>${aiCopilotResult?.evaluation ? aiCopilotResult.evaluation.status : '---'}</b></div><div><span>Conf. IA</span><b>${aiCopilotResult?.evaluation ? aiCopilotResult.evaluation.confidence+'%' : '---'}</b></div><div><span>Digital Twin</span><b>${digitalTwinResult?.evaluation ? digitalTwinResult.evaluation.status : '---'}</b></div><div><span>Forecast</span><b>${digitalTwinResult?.evaluation ? digitalTwinResult.evaluation.confidence+'%' : '---'}</b></div><div><span>Asset Rel</span><b>${assetMaintenanceResult?.evaluation ? assetMaintenanceResult.evaluation.status : '---'}</b></div><div><span>Disponib.</span><b>${assetMaintenanceResult?.evaluation ? assetMaintenanceResult.evaluation.availability+'%' : '---'}</b></div><div><span>Security SOC</span><b>${securityCyberResult?.evaluation ? securityCyberResult.evaluation.status : '---'}</b></div><div><span>Nível Seg.</span><b>${securityCyberResult?.evaluation ? securityCyberResult.evaluation.responseLevel : '---'}</b></div><div><span>Emergency Ops</span><b>${emergencyResponseResult?.evaluation ? emergencyResponseResult.evaluation.status : '---'}</b></div><div><span>Resposta</span><b>${emergencyResponseResult?.evaluation ? emergencyResponseResult.evaluation.responseTime+'m' : '---'}</b></div><div><span>Multi Hub</span><b>${multiAirportNetworkResult?.evaluation ? multiAirportNetworkResult.evaluation.status : '---'}</b></div><div><span>Rede</span><b>${multiAirportNetworkResult?.evaluation ? multiAirportNetworkResult.evaluation.networkScore+'%' : '---'}</b></div><div><span>Passenger XP</span><b>${passengerReputationResult?.evaluation ? passengerReputationResult.evaluation.status : '---'}</b></div><div><span>NPS</span><b>${passengerReputationResult?.evaluation ? Math.round(passengerReputationResult.evaluation.metrics.NPS) : '---'}</b></div><div><span>Workforce</span><b>${workforceStaffingResult?.evaluation ? workforceStaffingResult.evaluation.status : '---'}</b></div><div><span>Fadiga Média</span><b>${workforceStaffingResult?.evaluation ? workforceStaffingResult.evaluation.coverage.avgFatigue : '---'}</b></div><div><span>Rev Mgmt</span><b>${revenueManagementResult?.evaluation ? revenueManagementResult.evaluation.status : '---'}</b></div><div><span>Margem</span><b>${revenueManagementResult?.evaluation ? revenueManagementResult.evaluation.margin+'%' : '---'}</b></div><div><span>ENV ESG</span><b>${environmentSustainabilityResult?.evaluation ? environmentSustainabilityResult.evaluation.status : '---'}</b></div><div><span>Licença Amb.</span><b>${environmentSustainabilityResult?.evaluation ? environmentSustainabilityResult.evaluation.permitStatus : '---'}</b></div><div><span>Infra CAPEX</span><b>${infrastructureExpansionResult?.evaluation ? infrastructureExpansionResult.evaluation.status : '---'}</b></div><div><span>Capacidade</span><b>${infrastructureExpansionResult?.evaluation ? infrastructureExpansionResult.evaluation.capacityScore+'%' : '---'}</b></div><div><span>Safety SMS</span><b>${safetyComplianceResult?.evaluation ? safetyComplianceResult.evaluation.complianceStatus : '---'}</b></div><div><span>Achados SMS</span><b>${safetyComplianceResult?.evaluation ? safetyComplianceResult.evaluation.openFindings : '---'}</b></div><div><span>Crisis Cmd</span><b>${crisisCommandResult?.evaluation ? crisisCommandResult.evaluation.status : '---'}</b></div><div><span>Recovery</span><b>${crisisCommandResult?.evaluation ? crisisCommandResult.evaluation.recoveryStage : '---'}</b></div><div><span>Airport Auth</span><b>${airportAuthorityResult?.evaluation ? airportAuthorityResult.evaluation.experience : '---'}</b></div><div><span>Terminal EXP</span><b>${airportAuthorityResult?.evaluation ? airportAuthorityResult.evaluation.authorityScore+'%' : '---'}</b></div><div><span>Airline Ops</span><b>${airlineOpsResult?.evaluation ? airlineOpsResult.evaluation.status : '---'}</b></div><div><span>SLA Cias</span><b>${airlineOpsResult?.evaluation ? airlineOpsResult.evaluation.sla.weighted+'%' : '---'}</b></div><div><span>Campanha Intl</span><b>${internationalCampaignResult?.evaluation ? internationalCampaignResult.evaluation.status : '---'}</b></div><div><span>Contrato ativo</span><b>${internationalCampaignResult?.nextContract ? internationalCampaignResult.nextContract.airport : '---'}</b></div><div><span>Instrutor ATC</span><b>${trainingCoachResult?.debrief ? trainingCoachResult.debrief.level : '---'}</b></div><div><span>Plano de estudo</span><b>${trainingCoachResult?.studyPlan ? trainingCoachResult.studyPlan.length+' cards' : '---'}</b></div><div><span>Academia ATC</span><b>${trainingAcademyResult?.attempt ? (trainingAcademyResult.attempt.passed ? 'APROVADO' : 'TREINO') : '---'}</b></div><div><span>Próxima missão</span><b>${trainingAcademyResult?.nextMission ? trainingAcademyResult.nextMission.id : '---'}</b></div><div><span>Public Ops</span><b>${publicOpsResult ? publicOpsResult.status : '---'}</b></div><div><span>Ops Score</span><b>${publicOpsResult ? publicOpsResult.score+'%' : '---'}</b></div><div><span>Publish Health</span><b>${postPublishHealthResult ? postPublishHealthResult.status : '---'}</b></div><div><span>Health Score</span><b>${postPublishHealthResult ? postPublishHealthResult.score+'%' : '---'}</b></div><div><span>Publicação PWA</span><b>${postGoldMasterResult ? postGoldMasterResult.status : '---'}</b></div><div><span>Post-GM Ready</span><b>${postGoldMasterResult ? postGoldMasterResult.score+'%' : '---'}</b></div><div><span>Gold Master</span><b>${goldMasterResult?.gates ? goldMasterResult.gates.status : '---'}</b></div><div><span>GM Score</span><b>${goldMasterResult?.gates ? goldMasterResult.gates.score+'%' : '---'}</b></div><div><span>Release Candidate</span><b>${releaseCandidateResult?.gates ? releaseCandidateResult.gates.status : '---'}</b></div><div><span>QA Score</span><b>${releaseCandidateResult?.gates ? releaseCandidateResult.gates.score+'%' : '---'}</b></div><div><span>Replay compartilhável</span><b>${controlRoomResult?.replay ? 'GERADO' : '---'}</b></div><div><span>Ranking local</span><b>${controlRoomResult?.replay ? controlRoomResult.replay.tier : '---'}</b></div><div><span>Network Flow</span><b>${networkResult?.shift ? (networkResult.shift.route+' / '+Math.round(networkResult.shift.slotCompliance*100)+'%') : '---'}</b></div><div><span>Conexões protegidas</span><b>${networkResult?.network ? networkResult.network.connectionsProtected : 0}</b></div><div><span>Economia</span><b>${economyResult?.shift ? ('$'+Math.round(economyResult.shift.profit).toLocaleString('pt-BR')) : '---'}</b></div><div><span>Eficiência econômica</span><b>${economyResult?.shift ? economyResult.shift.efficiency+'%' : '---'}</b></div><div><span>Carreira</span><b>${careerResult?.career ? (careerResult.career.licenseId+' / '+careerResult.career.ratingId) : '---'}</b></div><div><span>Fadiga</span><b>${careerResult?.career ? Math.round(careerResult.career.fatigue)+'%' : '---'}</b></div><div><span>Build</span><b>${BUILD}</b></div>`;
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
function makeAction(label, cmd, cls='dark', sub='', p=null){
  const risk = p ? commandRisk(p,cmd) : (cmd==='noop'?{block:true,level:'warn',msg:'Selecione uma aeronave.'}:{block:false,level:'ok',msg:''});
  const disabled = (cmd==='noop' || risk.block) ? ' disabled aria-disabled="true"' : '';
  const riskClass = risk.level && risk.level!=='ok' ? ' risk-'+risk.level : '';
  const title = risk.msg ? ` title="${risk.msg.replace(/"/g,'&quot;')}"` : '';
  return `<button class="atc-action ${cls}${cmd==='noop'?' disabled':''}${risk.block?' disabled blocked':''}${riskClass}" data-cmd="${cmd}"${disabled}${title}>${label}${sub?`<small>${risk.block?'BLOQUEADO':sub}</small>`:''}</button>`;
}
function contextActions(p){
  if(!p) return [
    ['PRÓXIMO','nextRequest','blue','pedido'],['SELECIONE','noop','dark','aeronave'],['RADAR','noop','dark','toque'],['COMMS','noop','dark','monitore']
  ];
  const req = requests.find(r=>r.id===p.id);
  if(p.emergency || req?.type==='emergency' || p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') return [
    ['POUSO IMEDIATO','clearEmergency','red','emergência'],['VETOR FINAL','vectorFinal','amber','prioridade'],['REDUZIR','slow','amber','velocidade'],['DESCER','descend','amber','altitude'],['ESPERA','hold','dark','último caso'],['MAIS','more','dark','opções']
  ];
  if(p.kind==='arrival'){
    if(p.status==='APP' || p.status==='HOLD') return [
      ['VETOR FINAL','vectorFinal','green','interceptar'],['AUT. POUSO','clearLanding','green','se pista livre'],['REDUZIR','slow','blue','separação'],['DESCER','descend','blue','perfil'],['ESPERA','hold','amber','holding'],['MAIS','more','dark','opções']
    ];
    if(p.status==='FINAL') return [
      ['POUSO OK','clearLanding','green','confirmar'],['ARREMETER','goAround','red','go around'],['REDUZIR','slow','blue','final'],['ESPERA','hold','amber','instruir'],['HDG -10','left','dark','vetor'],['MAIS','more','dark','opções']
    ];
  }
  if(['PARKED','PUSHBACK','READY_TAXI'].includes(p.status)) return [
    ['PUSHBACK','approvePushback','blue','aprovar'],['TÁXI','approveTaxi','blue','para pista'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','solo'],['HDG +10','right','dark','solo'],['MAIS','more','dark','opções']
  ];
  if(['TAXI','HOLD_SHORT'].includes(p.status)) return [
    ['HOLD SHORT','holdShort','amber','antes pista'],['ALINHAR','lineUp','green','line up'],['MANTER','deny','amber','posição'],['TÁXI OK','approveTaxi','blue','prosseguir'],['EMERGÊNCIA','emergency','red','prioridade'],['MAIS','more','dark','opções']
  ];
  if(p.status==='LINEUP' || p.status==='DEP') return [
    ['DECOLAR','clearTakeoff','green','takeoff'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SUBIR','climb','blue','saída'],['MAIS','more','dark','opções']
  ];
  return [['POUSO','clearLanding','green','landing'],['ESPERA','hold','amber','hold'],['NEGAR','deny','red','aguarde'],['MAIS','more','dark','opções']];
}
function moreActions(p){
  return [
    ['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SPD -10','slow','blue','reduzir'],['SPD +10','fast','blue','aumentar'],['SUBIR','climb','blue','altitude'],['DESCER','descend','blue','altitude'],['HOLD','hold','amber','espera'],['HOLD SHORT','holdShort','amber','pista'],['VETOR FINAL','vectorFinal','green','app'],['POUSO','clearLanding','green','landing'],['PUSHBACK','approvePushback','blue','solo'],['TÁXI','approveTaxi','blue','solo'],['ALINHAR','lineUp','green','pista'],['DECOLAR','clearTakeoff','green','takeoff'],['NEGAR','deny','red','aguarde'],['EMERGÊNCIA','emergency','red','mayday']
  ];
}
function renderActionGrid(){
  const p=aircraft.find(x=>x.id===selected);
  const grid=$('#actionGrid');
  if(grid){ grid.innerHTML=contextActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3],p)).join(''); }
  const more=$('#moreActionGrid');
  if(more){ more.innerHTML=moreActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3],p)).join(''); }
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = getSector(p);
  if($('#sectorHelp')) $('#sectorHelp').textContent = p ? `${p.id} selecionado` : 'Selecione uma aeronave';
  try{ updateSafetyState(); renderMissionBoard(); renderHandoffAdvisor(); }catch(e){ safeLogError(e,'render-action-safety'); }
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
