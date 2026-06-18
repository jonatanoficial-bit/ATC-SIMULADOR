/* @skyward-module 12-quality-test-bridge
 * Controlled integration-test bridge. Mutation is disabled in normal gameplay.
 * Enable only with window.SKYWARD_QA_MODE=true before main.js or ?qa=1.
 */
window.SKYWARD_MODULES?.push('12-quality-test-bridge');
(function(){
  const TEST_SCHEMA=Number(BUILD_INFO?.testSchema||2);
  const qaEnabled=window.SKYWARD_QA_MODE===true || (()=>{ try{return new URLSearchParams(location.search).get('qa')==='1';}catch(_e){return false;} })();
  const ensureQa=()=>{ if(!qaEnabled) throw new Error('SKYWARD QA bridge is read-only outside explicit QA mode.'); };
  const clone=value=>cloneSafe(value);
  const baseStats=()=>({ landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 });
  const seededRandom=seed=>{
    let state=(Number(seed)||1)>>>0;
    return ()=>{ state=(state+0x6D2B79F5)>>>0; let t=state; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
  };
  const getState=()=>clone({
    build:BUILD,testSchema:BUILD_INFO.testSchema||TEST_SCHEMA,running,paused,score,selected,selectedRequest,runwayOccupiedBy,
    profile,aircraft,requests,stats,mission,safetyState,weather:WX_STATE,currentOpsProfile,
    safeMode:{errors:SAFE_MODE.errors,contractFailures:SAFE_MODE.contractFailures,saveRecoveries:SAFE_MODE.saveRecoveries,saveMigrations:SAFE_MODE.saveMigrations,lastSaveStatus:SAFE_MODE.lastSaveStatus,diagnostics:SAFE_MODE.diagnostics,perf:SAFE_MODE.perf}
  });
  const setRandomSeed=seed=>{ ensureQa(); SKYWARD_RANDOM_SOURCE=seededRandom(seed); return true; };
  const restoreProductionRandom=()=>{ ensureQa(); SKYWARD_RANDOM_SOURCE=()=>Math.random(); return true; };
  const reset=(seed=5005)=>{
    ensureQa(); setRandomSeed(seed); running=false; paused=false; score=0; selected=null; selectedRequest=null; runwayOccupiedBy=null;
    aircraft=[]; requests=[]; stats=baseStats(); mission=buildMission(); missionHistory=[]; conflictPredictions=[]; logLines=[];
    SAFE_MODE.errors=[]; SAFE_MODE.contractFailures=0; SAFE_MODE.saveRecoveries=0; SAFE_MODE.saveMigrations=0; SAFE_MODE.lastSaveStatus='qa-reset'; SAFE_MODE.diagnostics=[]; SAFE_MODE.lastGoodState=null; lastSnapshotAt=0;
    startTime=performance.now(); last=startTime; callsignSequence=0; clearGoodState();
    renderGameplayUi(true); renderMobileGameplay(); return getState();
  };
  const setState=payload=>{
    ensureQa(); const source=payload&&typeof payload==='object'?payload:{};
    if(Array.isArray(source.aircraft)) aircraft=source.aircraft.map(p=>CONTRACTS?.sanitizeAircraft?CONTRACTS.sanitizeAircraft(p):p).filter(Boolean);
    if(Array.isArray(source.requests)) requests=source.requests.map(r=>CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(r):r).filter(Boolean);
    if(source.stats&&typeof source.stats==='object') stats={...baseStats(),...clone(source.stats)};
    if(Number.isFinite(Number(source.score))) score=Number(source.score);
    if('selected' in source) selected=source.selected;
    if('selectedRequest' in source) selectedRequest=clone(source.selectedRequest);
    if('runwayOccupiedBy' in source) runwayOccupiedBy=source.runwayOccupiedBy;
    if('running' in source) running=Boolean(source.running);
    if('paused' in source) paused=Boolean(source.paused);
    sanitizeAircraftList(); renderGameplayUi(true); renderMobileGameplay(); return getState();
  };
  const createPlane=(index=0,kind='arrival')=>{ ensureQa(); const plane=makePlane(Number(index)||0,kind==='departure'?'departure':'arrival'); aircraft.push(plane); return clone(plane); };
  const generateTraffic=(count=6,seed=5005)=>{ ensureQa(); reset(seed); const n=Math.max(1,Math.min(16,Number(count)||6)); for(let i=0;i<n;i++){ const p=makePlane(i,i%2===0?'arrival':'departure'); aircraft.push(p); addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'); } return getState(); };
  const addRequestFor=(id,type,priority='normal')=>{ ensureQa(); const p=aircraft.find(x=>x.id===id); if(!p) return false; addRequest(p,type,priority); return requests.some(r=>r.id===id&&r.type===type); };
  const select=id=>{ ensureQa(); selected=id; selectedRequest=requests.find(r=>r.id===id)||null; renderGameplayUi(true); return getState(); };
  const issueCommand=(id,cmd)=>{ ensureQa(); select(id); command(cmd); return getState(); };
  const runSoak=(steps=600,dt=.1)=>{
    ensureQa(); const total=Math.max(1,Math.min(5000,Number(steps)||600)); const step=Math.max(.01,Math.min(1,Number(dt)||.1));
    const wasRunning=running; running=false;
    for(let i=0;i<total;i++){
      updateWeatherOps(step); updateFuelAndEmergency(step); updatePlanes(step); checkRunway(); checkConflicts(); updateRunwayOps();
      if(!Array.isArray(aircraft)||!Array.isArray(requests)) throw new Error('Estado de simulação corrompido no soak.');
      sanitizeAircraftList();
    }
    running=wasRunning;
    return {steps:total,dt:step,state:getState(),aircraftContract:CONTRACTS.validateAircraftList(aircraft,'qa-soak').ok,requestsContract:CONTRACTS.validateRequests(requests,'qa-soak').ok};
  };
  const saveSnapshot=reason=>{ ensureQa(); return saveGoodState(reason||'qa-test',true); };
  const restoreSnapshot=()=>{ ensureQa(); return restoreGoodState(); };
  const clearSnapshot=()=>{ ensureQa(); clearGoodState(); return true; };
  const setAirport=icao=>{ ensureQa(); if(!airports.some(a=>a.icao===icao)) return false; profile.airport=icao; applyAirportOpsProfile(); return true; };
  const vaultInspect=name=>clone(saveVault()?.inspect(String(name||'snapshot'))||null);
  const setVaultSlot=(name,slot,value,raw=false)=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; const key=vault.storageKey(String(name),String(slot)); localStorage.setItem(key,raw?String(value):JSON.stringify(value)); return true; };
  const removeVaultSlot=(name,slot)=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; localStorage.removeItem(vault.storageKey(String(name),String(slot))); return true; };
  const corruptVaultSlot=(name,slot='primary',mode='json')=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; const key=vault.storageKey(String(name),String(slot)); const raw=localStorage.getItem(key); if(mode==='json') localStorage.setItem(key,'{corrupted-json'); else if(raw){ const value=JSON.parse(raw); if(mode==='payload'&&value.payload){ value.payload.score=(Number(value.payload.score)||0)+999; } else value.envelopeHash='0'.repeat(64); localStorage.setItem(key,JSON.stringify(value)); } return true; };
  const injectLegacySnapshot=(payload,key='skywardGoodState_v2')=>{ ensureQa(); saveVault()?.clear('snapshot'); localStorage.removeItem(SNAPSHOT_KEY); LEGACY_SNAPSHOT_KEYS.forEach(item=>localStorage.removeItem(item)); localStorage.setItem(String(key),JSON.stringify(payload)); SAFE_MODE.lastGoodState=null; return true; };
  const setProfileState=value=>{ ensureQa(); profile=CONTRACTS.sanitizeProfile(value,profile); return clone(profile); };
  const persistProfileForTest=reason=>{ ensureQa(); return persistProfile(reason||'qa-profile'); };
  const reloadProfileForTest=()=>{ ensureQa(); loadProfile(); return clone(profile); };
  const clearProfileVault=()=>{ ensureQa(); saveVault()?.clear('profile'); localStorage.removeItem('skywardProfile'); return true; };
  const api=Object.freeze({
    testSchema:TEST_SCHEMA,version:'2.0.0',enabled:qaEnabled,getState,
    kernel:window.SKYWARD_QUALITY_KERNEL,
    reset,setState,setRandomSeed,restoreProductionRandom,createPlane,generateTraffic,addRequestFor,select,issueCommand,runSoak,
    saveSnapshot,restoreSnapshot,clearSnapshot,setAirport,vaultInspect,setVaultSlot,removeVaultSlot,corruptVaultSlot,injectLegacySnapshot,setProfileState,persistProfileForTest,reloadProfileForTest,clearProfileVault,
    predictConflicts:()=>clone(predictConflicts()),commandRisk:(plane,cmd)=>clone(commandRisk(plane,cmd)),
    contextActions:plane=>clone(contextActions(plane)),requestPriorityScore:request=>requestPriorityScore(request),
    requiredWakeSpacing:(lead,trail)=>requiredWakeSpacing(lead,trail),runwayFlowState:()=>clone(runwayFlowState()),
    validateCurrentState:()=>Object.freeze({aircraft:CONTRACTS.validateAircraftList(aircraft,'qa-current-aircraft'),requests:CONTRACTS.validateRequests(requests,'qa-current-requests')})
  });
  window.SKYWARD_TEST_API=api;
})();
