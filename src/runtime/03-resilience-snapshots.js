/* @skyward-module 03-resilience-snapshots
 * Transactional snapshots, automatic schema migrations, recovery,
 * state sanitization and DOM validation.
 */
window.SKYWARD_MODULES?.push('03-resilience-snapshots');
function snapshotProfileFallback(airportCode='SBGR'){
  const fallback={name:'Controlador',avatar:'male',country:'Brasil',airport:airportCode||'SBGR',xp:0,level:1,score:0,turns:0};
  try{return CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(typeof profile==='object'?profile:fallback,fallback) : fallback;}catch(_e){return fallback;}
}
function normalizeSnapshotStats(value){
  const defaults={landed:0,departed:0,conflicts:0,commands:0,emergencies:0,requests:0,denied:0,runwayIncursions:0,blocked:0,safetyWarnings:0,lowFuel:0,damaged:0,maydayResolved:0};
  const source=value&&typeof value==='object'?value:{};
  return Object.fromEntries(Object.keys(defaults).map(key=>[key,Math.max(0,Number.isFinite(Number(source[key]))?Number(source[key]):0)]));
}
function migrateSnapshotPayload(input,context={}){
  try{
    if(!input||typeof input!=='object'||Array.isArray(input)) return {ok:false,reason:'snapshot_not_object'};
    let value=cloneSafe(input);
    const originalSchema=Number.isInteger(Number(value.schema))?Number(value.schema):1;
    if(originalSchema>BUILD_INFO.schema) return {ok:false,reason:'future_schema',migratedFrom:originalSchema};
    const steps=[];
    if(originalSchema<=1){
      value={
        schema:2,build:String(value.build||'LEGACY-F01'),reason:String(value.reason||'legacy-v1'),
        at:Number(value.at)||Date.now(),elapsed:Math.max(0,Number(value.elapsed)||0),
        selected:value.selected||null,selectedRequest:value.selectedRequest||null,runwayOccupiedBy:value.runwayOccupiedBy||null,
        aircraft:Array.isArray(value.aircraft)?value.aircraft:[],requests:Array.isArray(value.requests)?value.requests:[],
        score:Number(value.score)||0,stats:normalizeSnapshotStats(value.stats),mission:value.mission??null,
        profileAirport:String(value.profileAirport||value.airport||snapshotProfileFallback().airport)
      };
      steps.push('1>2');
    }
    if(Number(value.schema)===2){
      const fallbackProfile=snapshotProfileFallback(String(value.profileAirport||'SBGR'));
      value={...value,
        schema:3,
        saveId:String(value.saveId||`save-${Number(value.at||Date.now()).toString(36)}-${String(value.build||'legacy').replace(/[^A-Z0-9]/gi,'').slice(-10)}`),
        sessionId:String(value.sessionId||`migrated-${Number(value.at||Date.now()).toString(36)}`),
        profile:CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(value.profile||{...fallbackProfile,airport:String(value.profileAirport||fallbackProfile.airport)},fallbackProfile) : fallbackProfile
      };
      steps.push('2>3');
    }
    if(Number(value.schema)!==BUILD_INFO.schema) return {ok:false,reason:'unsupported_schema',migratedFrom:originalSchema,steps};
    value.schema=BUILD_INFO.schema;
    value.build=String(value.build||BUILD);
    value.reason=String(value.reason||context.reason||'migrated');
    value.at=Number(value.at)||Date.now();
    value.elapsed=Math.max(0,Number(value.elapsed)||0);
    value.aircraft=(Array.isArray(value.aircraft)?value.aircraft:[]).map(item=>CONTRACTS?.sanitizeAircraft?CONTRACTS.sanitizeAircraft(item):item).filter(Boolean).slice(0,SAFE_MODE.maxAircraft);
    const ids=new Set(value.aircraft.map(item=>item.id));
    value.requests=(Array.isArray(value.requests)?value.requests:[]).map(item=>CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(item):item).filter(item=>item&&ids.has(item.id)).slice(0,30);
    value.selected=ids.has(value.selected)?value.selected:null;
    value.selectedRequest=value.selectedRequest&&value.requests.some(item=>item.id===value.selectedRequest.id&&item.type===value.selectedRequest.type)?(CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(value.selectedRequest):value.selectedRequest):null;
    value.runwayOccupiedBy=ids.has(value.runwayOccupiedBy)?value.runwayOccupiedBy:null;
    value.score=Number(value.score)||0;
    value.stats=normalizeSnapshotStats(value.stats);
    value.mission=value.mission??null;
    value.profileAirport=/^[A-Z0-9]{4}$/.test(String(value.profileAirport||''))?String(value.profileAirport):snapshotProfileFallback().airport;
    value.profile=CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(value.profile||{airport:value.profileAirport},snapshotProfileFallback(value.profileAirport)) : snapshotProfileFallback(value.profileAirport);
    value.saveId=String(value.saveId||`save-${Date.now().toString(36)}`);
    value.sessionId=String(value.sessionId||SAVE_SESSION_ID);
    const validation=CONTRACTS?.validateSnapshot?CONTRACTS.validateSnapshot(value,BUILD_INFO.schema,'snapshot-migration'):{ok:isValidSnapshot(value),issues:[]};
    if(!validation.ok) return {ok:false,reason:'contract',issues:validation.issues,migratedFrom:originalSchema,steps};
    return {ok:true,payload:value,migratedFrom:originalSchema<BUILD_INFO.schema?originalSchema:null,steps};
  }catch(error){safeLogError(error,'snapshot-migration');return {ok:false,reason:'exception',message:String(error?.message||error)};}
}
function createSnapshotPayload(reason='snapshot'){
  const now=Date.now();
  const elapsed=running?Math.max(0,(performance.now()-startTime)/1000):0;
  return {
    schema:BUILD_INFO.schema,saveId:`save-${SAVE_SESSION_ID}`,sessionId:SAVE_SESSION_ID,build:BUILD,reason,at:now,elapsed,
    selected,selectedRequest:cloneSafe(selectedRequest),runwayOccupiedBy,
    aircraft:cloneSafe((aircraft||[]).slice(0,SAFE_MODE.maxAircraft)),requests:cloneSafe((requests||[]).slice(0,30)),
    score:Number(score)||0,stats:normalizeSnapshotStats(stats),mission:cloneSafe(mission||null),profileAirport:profile.airport,
    profile:CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,snapshotProfileFallback(profile.airport)):cloneSafe(profile)
  };
}
function snapshotVaultOptions(reason='snapshot'){
  return {
    saveSchema:BUILD_INFO.schema,expectedSaveSchema:BUILD_INFO.schema,build:BUILD,reason,
    validate:value=>CONTRACTS?.validateSnapshot?CONTRACTS.validateSnapshot(value,BUILD_INFO.schema,'snapshot-vault'):{ok:isValidSnapshot(value)},
    migrate:migrateSnapshotPayload,legacyKeys:[SNAPSHOT_KEY,...LEGACY_SNAPSHOT_KEYS]
  };
}
function saveGoodState(reason='snapshot',force=false){
  try{
    const now=Date.now();
    if(!force&&now-lastSnapshotAt<SNAPSHOT_INTERVAL_MS) return false;
    const snapshot=createSnapshotPayload(reason);
    if(!isValidSnapshot(snapshot)){SAFE_MODE.lastSaveStatus='rejected-contract';return false;}
    const vault=saveVault();
    const result=vault?.write?vault.write('snapshot',snapshot,snapshotVaultOptions(reason)):{ok:safeStorageSet(SNAPSHOT_KEY,snapshot)};
    if(!result?.ok){SAFE_MODE.lastSaveStatus=`write-failed:${result?.reason||'unknown'}`;return false;}
    SAFE_MODE.lastGoodState=snapshot;SAFE_MODE.lastSaveStatus='committed';lastSnapshotAt=now;
    safeStorageSet(SNAPSHOT_KEY,snapshot); // compatibility shadow for rollback to older builds
    return true;
  }catch(error){SAFE_MODE.lastSaveStatus='exception';safeLogError(error,'save-good-state');return false;}
}
function readTransactionalSnapshot(){
  const vault=saveVault();
  if(vault?.read){
    const result=vault.read('snapshot',snapshotVaultOptions('restore'));
    if(result.ok){
      if(result.recovered||result.source==='backup'){SAFE_MODE.saveRecoveries++;SAFE_MODE.lastSaveStatus='rollback-recovered';}
      if(result.migrated||result.source==='migration'||result.source==='legacy'){SAFE_MODE.saveMigrations++;SAFE_MODE.lastSaveStatus='migrated';}
      return result;
    }
  }
  const candidates=[SAFE_MODE.lastGoodState,safeStorageGet(SNAPSHOT_KEY,null),...LEGACY_SNAPSHOT_KEYS.map(key=>safeStorageGet(key,null))];
  for(const candidate of candidates){
    const migrated=migrateSnapshotPayload(candidate,{source:'fallback'});
    if(migrated.ok){const committed=saveVault()?.write?.('snapshot',migrated.payload,snapshotVaultOptions('fallback-import')); if(committed?.ok) safeStorageSet(SNAPSHOT_KEY,migrated.payload); SAFE_MODE.saveMigrations++; return {ok:true,payload:migrated.payload,source:'fallback',migrated:Boolean(migrated.migratedFrom)};}
  }
  return {ok:false,reason:'no_valid_snapshot'};
}
function restoreGoodState(){
  const result=readTransactionalSnapshot();
  const snapshot=result?.payload;
  if(!snapshot||!isValidSnapshot(snapshot)) return false;
  try{
    SAFE_MODE.lastGoodState=snapshot;
    aircraft=cloneSafe(snapshot.aircraft);requests=cloneSafe(snapshot.requests);
    selected=snapshot.selected||null;selectedRequest=cloneSafe(snapshot.selectedRequest)||null;
    score=Number(snapshot.score)||0;stats={...stats,...normalizeSnapshotStats(snapshot.stats)};
    mission=cloneSafe(snapshot.mission)||buildMission();runwayOccupiedBy=snapshot.runwayOccupiedBy||null;
    if(snapshot.profileAirport&&/^[A-Z0-9]{4}$/.test(snapshot.profileAirport)) profile.airport=snapshot.profileAirport;
    startTime=performance.now()-Math.max(0,Number(snapshot.elapsed)||0)*1000;last=performance.now();
    running=true;paused=false;sanitizeAircraftList();
    document.querySelector('#crashShield')?.classList.remove('open');
    updateSceneBodyClass('game');renderGameplayUi(true);draw();
    const recovered=result.source==='backup'||result.recovered;
    setDiagnostic(recovered?'SAVE RECUPERADO POR ROLLBACK':'ESTADO SEGURO RESTAURADO',recovered?'warn':'ok');
    addLog(`Sistema: snapshot restaurado (${snapshot.reason||'seguro'})${recovered?' via backup':''}.`,recovered?'warn':'');
    requestAnimationFrame(loop);return true;
  }catch(error){safeLogError(error,'restore-good-state');return false;}
}
function maybeSaveGoodState(reason='running'){return saveGoodState(reason,false);}
function requestPriorityScore(r){
  if(QUALITY?.requestPriorityScore) return QUALITY.requestPriorityScore(r,performance.now());
  const age=(performance.now()-(r?.time||0))/1000;
  const p={urgent:300,warn:160,normal:60}[r?.priority]||40;
  const t={emergency:220,landing:120,takeoff:100,lineup:90,taxi:55,pushback:45}[r?.type]||40;
  return p+t+age;
}
function selectNextRequest(){
  sanitizeAircraftList();
  const next=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a))[0];
  if(!next){ addLog('Fila vazia. Nenhuma solicitação pendente.','warn'); setDiagnostic('SEM SOLICITAÇÕES','warn'); return false; }
  selected=next.id; selectedRequest=next;
  setTrafficTab(aircraft.find(p=>p.id===selected)?.kind==='departure' ? 'groundList' : 'arrivals');
  addLog(`Próxima solicitação: ${next.id} (${next.type.toUpperCase()}).`);
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); renderHandoffAdvisor(); setDiagnostic(`${next.id} SELECIONADO`,'ok');
  return true;
}
function isRunwayProtectedByOther(p){ return runwayOccupiedBy && (!p || runwayOccupiedBy!==p.id); }
function sectorLabel(p){ const s=getSector(p); return s==='GND'?'SOLO/GND':s==='APP'?'APROXIMAÇÃO/APP':s==='EMERG'?'EMERGÊNCIA':'TORRE/TWR'; }
function sanitizeAircraftList(){
  if(!Array.isArray(aircraft)) aircraft=[];
  const seenCallsigns=new Set();
  aircraft = aircraft.map(p=>CONTRACTS?.sanitizeAircraft ? CONTRACTS.sanitizeAircraft(p) : p).filter(p=>{
    if(!p || typeof p.id!=='string' || !Number.isFinite(p.x) || !Number.isFinite(p.y) || seenCallsigns.has(p.id)) return false;
    seenCallsigns.add(p.id); return true;
  }).slice(0, SAFE_MODE.maxAircraft);
  aircraft.forEach(p=>{
    const validStatus=['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP','DEP','APP','HOLD','FINAL','EMERG'];
    if(!validStatus.includes(p.status)) p.status = p.kind==='arrival'?'APP':'PARKED';
    p.sector=getSector(p);
    p.x=clamp(Number(p.x)||50,-8,108); p.y=clamp(Number(p.y)||50,-8,108);
    p.alt=clamp(Number(p.alt)||0,0,420); p.targetAlt=clamp(Number(p.targetAlt)||0,0,420);
    p.speed=clamp(Number(p.speed)||0,0,360); p.heading=((Number(p.heading)||0)%360+360)%360;
    if(!Array.isArray(p.trail)) p.trail=[]; p.trail=p.trail.slice(-54);
  });
  requests = (Array.isArray(requests)?requests:[]).map(r=>CONTRACTS?.sanitizeRequest ? CONTRACTS.sanitizeRequest(r) : r).filter(r=>r && aircraft.some(p=>p.id===r.id)).slice(0,30);
  const aircraftContract=CONTRACTS?.validateAircraftList?.(aircraft,'sanitize-aircraft-list');
  const requestContract=CONTRACTS?.validateRequests?.(requests,'sanitize-request-list');
  if(aircraftContract && !aircraftContract.ok) SAFE_MODE.contractFailures += aircraftContract.issues.length;
  if(requestContract && !requestContract.ok) SAFE_MODE.contractFailures += requestContract.issues.length;
  if(selected && !aircraft.some(p=>p.id===selected)){ selected=null; selectedRequest=null; }
  if(selectedRequest && !requests.some(r=>r.id===selectedRequest.id && r.type===selectedRequest.type)) selectedRequest=null;
}
function validateGameplayDom(){
  const required=['#radar','#actionGrid','#requests','#freqCall','#log','#selectedBox'];
  const missing=required.filter(s=>!document.querySelector(s));
  if(missing.length) throw new Error('Elementos de gameplay ausentes: '+missing.join(', '));
}
function recoverGameplayState(reason='auto'){
  sanitizeAircraftList();
  if(running && aircraft.length===0){
    for(let i=0;i<4;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure'));
    aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'));
  }
  if(!selected && requests[0]){ selected=requests[0].id; selectedRequest=requests[0]; }
  try{
    renderGameplayUi(true);
    SAFE_MODE.diagnostics.unshift({msg:`Estado estabilizado: ${reason}`,level:'ok',at:Date.now()});
  }catch(e){ showSafeMode(e); }
}
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const canvas = $('#radar');
const ctx = canvas.getContext('2d');
const asset = { map: new Image(), radar: new Image() };
asset.map.src = 'assets/maps/MAP_KATL_AIRPORT_CLEAN_V1.png';
asset.radar.src = 'assets/radar/RADAR_BASE_CLEAN_V1.png';

