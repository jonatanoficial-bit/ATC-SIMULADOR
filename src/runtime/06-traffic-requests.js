/* @skyward-module 06-traffic-requests
 * Aircraft creation, callsigns, requests and game start.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('06-traffic-requests');
function uniqueCallsign(preferred){
  const prefix=(String(preferred).match(/[A-Z]+/)||['ATC'])[0].slice(0,3);
  const baseNumber=Number((String(preferred).match(/\d+/)||['1000'])[0]);
  let candidate=String(preferred);
  let guard=0;
  while(aircraft.some(p=>p.id===candidate) && guard<100){
    callsignSequence++; guard++;
    candidate=prefix+String((baseNumber+callsignSequence)%10000).padStart(4,'0');
  }
  return candidate;
}
function makePlane(i,kind){
  const br = airport().country === 'Brasil';
  const calls = br ? ['GLO1204','TAM3307','AZU4211','PTB7021','ONE8902','SID4405','MAP2190','TTL3030','VRG2218'] : ['DAL1234','AAL0567','SWA0789','UAL0890','JBU0789','FFT0321','BAW0612','KLM0208'];
  const types = ['A320','B738','B739','E190','A321','B752','A20N','B77W','C208'];
  const preferred=calls[(i+callsignSequence)%calls.length];
  const p = { id:uniqueCallsign(preferred), type:types[i%types.length], kind, status:kind==='arrival'?'APP':'PARKED', x:0, y:0, heading:0, speed:0, alt:0, targetAlt:0, trail:[], risk:0, selected:false, cleared:false, emergency:false, emergencyType:null, fuel:kind==='arrival'?Math.round(rand(42,72)):Math.round(rand(68,94)), fuelState:'OK', damage:0, hold:false, groundTimer:0, request:null, requestedAt:0, nextFix:null };
  if(kind==='arrival'){
    const profile=currentOpsProfile||airportOpsProfile();
    const side = Math.floor(rand(0,4));
    p.x = side===0 ? rand(8,20) : side===1 ? rand(80,92) : rand(18,82);
    p.y = side===2 ? rand(6,14) : side===3 ? rand(86,94) : rand(10,36);
    p.alt = Math.round(rand(90,180)); p.targetAlt = profile.layout&&String(profile.layout).includes('short') ? 35 : 45; normalizeAircraftPerformance?.(p); p.speed = Math.round(rand(Math.max(120,(p.performance?.approachSpeed||145)-18), Math.min(210,(p.performance?.approachSpeed||170)+28))); p.targetSpeed = performanceTargetSpeed?.(p,'APP') || p.speed; p.heading = headingTo(p, finalFix);
    p.request = 'landing'; p.requestedAt = performance.now();
  } else {
    const profile=currentOpsProfile||airportOpsProfile();
    const gateIndex=i%Math.max(1,gates.length);
    const g = gates[gateIndex]; p.x = g.x + rand(-.5,.5); p.y = g.y + rand(-.5,.5); p.heading = 270; p.request = 'pushback'; p.requestedAt = performance.now();
    p.gateIndex=gateIndex; p.gateId=g.id || `${g.label||'G'}${gateIndex+1}`; p.groundIndex=gateIndex%Math.max(1,holdingPoints.length);
  }
  normalizeAircraftPerformance?.(p); const sanitized=CONTRACTS?.sanitizeAircraft ? CONTRACTS.sanitizeAircraft(p) : p; normalizeAircraftPerformance?.(sanitized);
  if(!sanitized) throw new TypeError('Contrato rejeitou aeronave recém-criada.');
  return sanitized;
}
function addRequest(p,type,priority='normal'){
  if(!p || !type || requests.some(r=>r.id===p.id && r.type===type)) return;
  const labels = { landing:'solicita pouso', pushback:'solicita pushback', taxi:'solicita taxi para pista', lineup:'solicita alinhar', takeoff:'solicita decolagem', emergency:'MAYDAY - prioridade', lowfuel:'combustível mínimo', panpan:'PAN-PAN operacional' };
  const now=performance.now();
  const candidate={ id:p.id, type, priority, text:labels[type]||type, time:now };
  const normalized=CONTRACTS?.sanitizeRequest ? CONTRACTS.sanitizeRequest(candidate) : candidate;
  const contract=normalized && CONTRACTS?.validateRequest ? CONTRACTS.validateRequest(normalized,'add-request') : {ok:!!normalized,issues:[]};
  if(!normalized || !contract.ok){ SAFE_MODE.contractFailures += contract.issues?.length||1; safeLogError(new TypeError('Solicitação rejeitada pelo contrato'),'add-request'); return; }
  requests.unshift(normalized);
  p.request = normalized.type; p.requestedAt = now; stats.requests++;
  addLog(`${p.id}: ${labels[type] || type}.`, priority==='urgent'?'danger':priority==='warn'?'warn':'');
  renderRequests(); renderMobileGameplay();
}
function removeRequest(id,type){
  requests = requests.filter(r=>!(r.id===id && (!type || r.type===type)));
  if(selectedRequest && selectedRequest.id===id && (!type || selectedRequest.type===type)) selectedRequest=null;
  const plane=aircraft.find(p=>p.id===id);
  if(plane){
    const next=requests.find(r=>r.id===id);
    plane.request=next?.type||null;
    plane.requestedAt=next?.time||0;
  }
  renderRequests();
}

function atcPhrase(r){
  const ap = airport().icao;
  const map = { landing: `${r.id}: ${ap} Tower, request landing RWY ${runway.name}.`, pushback: `${r.id}: ${ap} Ground, request pushback.`, taxi: `${r.id}: ${ap} Ground, ready to taxi.`, lineup: `${r.id}: ${ap} Tower, holding short, request line up.`, takeoff: `${r.id}: ${ap} Tower, lined up, ready for departure.`, emergency: `${r.id}: MAYDAY, request immediate landing.`, lowfuel: `${r.id}: minimum fuel, request priority sequencing.`, panpan: `${r.id}: PAN-PAN, operational abnormality.` };
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
  saveProfile(); resize(); SAFE_MODE.lastGoodState=null; lastSnapshotAt=0; running=true; paused=false; score=0; selected=null; selectedRequest=null; runwayOccupiedBy=null; spawnTimer=0; requestTimer=0; startTime=performance.now(); last=startTime; lastUiRenderAt=0; callsignSequence=0; logLines=[]; requests=[];
  stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, surfaceConflicts:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
  mission = buildMission(); missionHistory=[];
  aircraft = [];
  const a = airport(); applyAirportSurfaceGraph?.(a.icao); applyAirportOpsProfile(); initializeAdvancedWeather?.(); initializeProceduresLayer?.(); initializeCareerProfile?.(); renderEconomyBoard?.(); renderIncidentBoard?.(); renderNetworkFlowBoard?.(); renderControlRoomBoard?.(); initializeCommercialPolish?.(); initializeReleaseCandidateQA?.(); initializeGoldMasterPackage?.(); initializePostGoldMasterPublishing?.(); initializePostPublishHealthcheck?.(); initializePublicOps?.(); initializeTrainingAcademy?.(); initializeTrainingCoach?.(); initializeInternationalCampaign?.(); initializeAirlineOps?.(); initializeAirportAuthority?.(); initializeCrisisCommand?.(); initializeSafetyCompliance?.(); initializeInfrastructureExpansion?.(); initializeEnvironmentSustainability?.(); initializeRevenueManagement?.(); initializeWorkforceStaffing?.(); initializePassengerReputation?.(); initializeMultiAirportNetwork?.(); initializeEmergencyResponse?.(); initializeSecurityCyber?.(); initializeAssetMaintenance?.(); initializeDigitalTwin?.(); initializeAiCopilot?.(); initializeRadioPhraseology?.(); initializeGroundTurnaround?.(); initializeCargoLogistics?.(); initializeTerminalFlow?.(); initializeNonAeroRevenue?.(); initializeAdaptivePace?.(); initializeStabilityDiagnostics?.(); initializePwaUpdateManager?.(); initializeLiveOpsConfig?.(); initializeScenarioMission?.(); initializeCampaignProgression?.(); initializeInstructorDebrief?.(); initializeReplayTimeline?.(); initializeWorldAirports?.(); window.SKYWARD_PUBLIC_OPS?.startTurn?.(); $('#weather').textContent = (a.weather || 'VARIÁVEL').toUpperCase().slice(0,18); if($('#gameAirport')) $('#gameAirport').textContent = a.icao; if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao; if($('#gameAirportMode')) $('#gameAirportMode').textContent='TORRE'; if($('#sectorHelp')) $('#sectorHelp').textContent=(currentOpsProfile?.ops||'Torre ativa');
  const initialTraffic=airportInitialTrafficCount();
  for(let i=0;i<initialTraffic;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure')); // v0.9.6: tráfego inicial por perfil do aeroporto
  emergencyDirector={active:false,target:null,message:'Sem emergência ativa.',lastTick:performance.now()};
  // v0.5.0: menor carga inicial para mobile, evitando poluicao visual e permitindo controle real
  aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'));
  if(requests[0]){ selected = requests[0].id; selectedRequest = requests[0]; }
  addLog(`${a.icao} APP/TWR online. Pista ativa ${runway.name}.`);
  addLog('Aguarde solicitações e emita clearance conforme pista livre.');
  recoverGameplayState('start-game');
  saveGoodState('start-game',true);
  requestAnimationFrame(loop);
}
