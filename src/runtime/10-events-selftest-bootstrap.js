/* @skyward-module 10-events-selftest-bootstrap
 * Desktop events, filters, safe-mode controls and self-test bootstrap.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('10-events-selftest-bootstrap');
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


document.querySelector('#nextRequestBtn')?.addEventListener('click',()=>selectNextRequest());

document.addEventListener('change',(e)=>{
  const t=e.target;
  if(!t || !t.matches || !t.matches('[data-filter]')) return;
  radarFilters[t.dataset.filter]=!!t.checked;
  addLog('Filtro radar: '+t.dataset.filter+' '+(t.checked?'ON':'OFF'));
});

document.querySelector('#safeRestoreBtn')?.addEventListener('click',()=>{
  if(!restoreGoodState()){
    setDiagnostic('SNAPSHOT INDISPONÍVEL','warn');
    document.querySelector('#safeErrorText').textContent='Nenhum snapshot compatível foi encontrado. Inicie um novo turno.';
  }
});
document.querySelector('#safeRestartBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('game'); });
document.querySelector('#safeLobbyBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('lobby'); });
function selfTest(){
  const report={ build:BUILD, ok:true, checks:[], errors:[] };
  const check=(name,fn)=>{ try{ const ok=!!fn(); report.checks.push({name,ok}); if(!ok) report.ok=false; }catch(e){ report.ok=false; report.errors.push({name,msg:String(e.message||e)}); } };
  check('required dom',()=>['#app','#radar','#actionGrid','#requests','#freqCall','#readbackLine','#log','#selectedBox','#nextRequestBtn','#opsDiagnostic','#moreCommandSheet','#safetyAdvisor','#safetyScore','#runwayBoard','#missionBoard','#handoffAdvisor','#radarModeBadge','#weatherBoard'].every(s=>document.querySelector(s))); 
  check('conflict predictor',()=>Array.isArray(predictConflicts()));
  check('safety advisor',()=>commandRisk({id:'TST',kind:'arrival',status:'APP',alt:50,speed:180,x:50,y:30},'vectorFinal').level==='ok');
  check('context action generator',()=>Array.isArray(contextActions(null)) && contextActions(null).some(a=>a[1]==='nextRequest'));
  check('priority sorter',()=>Number.isFinite(requestPriorityScore({type:'landing',priority:'warn',time:performance.now()})));
  check('airports data fallback',()=>Array.isArray(airports));
  check('canvas context',()=>!!ctx);
  check('runway board',()=>{ renderRunwayBoard(); return !!document.querySelector('#runwayBoard'); });
  check('professional radar layer',()=>{ drawProfessionalProcedures(800,420); drawRadarTelemetry(800,420); drawWeatherOverlay(800,420); return !!PROCEDURE_LAYER && Array.isArray(PROCEDURE_LAYER.routes); });
  check('weather ops',()=>{ updateWeatherOps(1); renderWeatherBoard();
    renderFuelBoard(); return !!WX_STATE.condition && !!document.querySelector('#weatherBoard'); });
  check('mission board',()=>{ mission=buildMission(); renderMissionBoard(); return !!document.querySelector('#missionBoard')?.innerHTML; });
  check('handoff advisor',()=>{ renderHandoffAdvisor(); return !!document.querySelector('#handoffAdvisor'); });
  check('readback line',()=>{ setReadback('teste de transmissão','ok'); return document.querySelector('#readbackLine')?.textContent.includes('teste'); });
  check('command block enforcement',()=>commandRisk({id:'TST',kind:'departure',status:'LINEUP',alt:0,speed:0,x:30,y:50},'vectorFinal').block===true);
  check('safe storage',()=>safeStorageSet('skywardSelfTest',{build:BUILD,t:Date.now()}));
  check('build metadata',()=>document.querySelectorAll('[data-build]').length>0 && BUILD_METADATA_VALID);
  check('explicit clearances',()=>Object.keys(CLEARANCE_COMMANDS).length===6 && !contextActions({id:'TST',kind:'departure',status:'PARKED'}).some(a=>a[1]==='clear'));
  check('snapshot schema',()=>isValidSnapshot({schema:BUILD_INFO.schema,saveId:'self-test-save',sessionId:'self-test-session',build:BUILD,reason:'self-test',at:Date.now(),elapsed:0,selected:null,selectedRequest:null,runwayOccupiedBy:null,aircraft:[],requests:[],score:0,stats:normalizeSnapshotStats({}),mission:null,profileAirport:profile.airport,profile:CONTRACTS.sanitizeProfile(profile,profile)}));
  check('release metadata source',()=>!!window.SKYWARD_BUILD_INFO && window.SKYWARD_BUILD_INFO.build===BUILD);
  check('modular runtime registry',()=>window.SKYWARD_ARCHITECTURE?.generation>=8 && Array.isArray(window.SKYWARD_MODULES) && window.SKYWARD_MODULES.length>=17);
  check('typescript contracts available',()=>CONTRACTS?.contractSchema===BUILD_INFO.contractSchema && typeof CONTRACTS.validateAircraft==='function');
  check('typescript build contract',()=>BUILD_METADATA_RESULT.ok===true);
  check('typescript airport contract',()=>CONTRACTS.validateAirports(airports,'self-test-airports').ok);
  check('typescript profile contract',()=>CONTRACTS.validateProfile(profile,'self-test-profile').ok);
  check('typescript aircraft contract',()=>aircraft.every(p=>CONTRACTS.validateAircraft(p,'self-test-aircraft').ok));
  check('typescript requests contract',()=>CONTRACTS.validateRequests(requests,'self-test-requests').ok);
  check('quality kernel available',()=>QUALITY?.schema===1 && Object.isFrozen(QUALITY) && QUALITY.normalizeHeading(-10)===350);
  check('test schema metadata',()=>Number(BUILD_INFO.testSchema)>=2);
  check('qa bridge available',()=>window.SKYWARD_TEST_API?.testSchema===BUILD_INFO.testSchema && Object.isFrozen(window.SKYWARD_TEST_API));
  check('transactional save vault',()=>saveVault()?.vaultSchema===BUILD_INFO.saveVaultSchema && saveVault()?.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  check('pwa runtime available',()=>window.SKYWARD_PWA?.pwaSchema===BUILD_INFO.pwaSchema && window.SKYWARD_PWA?.cacheSchema===BUILD_INFO.cacheSchema && Object.isFrozen(window.SKYWARD_PWA));
  check('pwa install manifest linked',()=>document.querySelector('link[rel="manifest"]')?.getAttribute('href')==='manifest.webmanifest');
  check('mobile UX schema and API',()=>window.SKYWARD_MOBILE_UX?.uxSchema===BUILD_INFO.uxSchema && Object.isFrozen(window.SKYWARD_MOBILE_UX));
  check('mobile gesture classifier',()=>window.SKYWARD_MOBILE_UX?.classifyGesture({x:2,y:100},{x:120,y:104},844,390)==='open-requests');
  check('mobile touch target',()=>window.SKYWARD_MOBILE_UX?.touchTargetPx('mobile-landscape')>=44);
  check('desktop workspace schema and API',()=>window.SKYWARD_DESKTOP_WORKSPACE?.schema===BUILD_INFO.desktopSchema && Object.isFrozen(window.SKYWARD_DESKTOP_WORKSPACE));
  check('desktop shortcut map',()=>window.SKYWARD_DESKTOP_WORKSPACE?.shortcutAction('KeyN',false)==='next-request' && window.SKYWARD_DESKTOP_WORKSPACE?.shortcutAction('KeyA',true)==='analysis');
  check('profile save contract',()=>CONTRACTS.validateProfileSave(profileSavePayload('self-test'),'self-test-profile-save').ok);
  check('snapshot migrator v2 to v3',()=>migrateSnapshotPayload({schema:2,build:'LEGACY',reason:'test',at:1,elapsed:0,selected:null,selectedRequest:null,runwayOccupiedBy:null,aircraft:[],requests:[],score:0,stats:{},mission:null,profileAirport:profile.airport}).ok);
  check('modular runtime sealed',()=>Object.isFrozen(window.SKYWARD_MODULES) && Object.isFrozen(window.SKYWARD_ARCHITECTURE));
  check('unique callsign helper',()=>{ const existing=aircraft; aircraft=[{id:'TST1000'}]; const id=uniqueCallsign('TST1000'); aircraft=existing; return id!=='TST1000'; });
  check('replay schema and API',()=>window.SKYWARD_REPLAY?.schema===BUILD_INFO.replaySchema && Object.isFrozen(window.SKYWARD_REPLAY));
  check('deterministic replay self check',()=>window.SKYWARD_REPLAY?.selfCheck?.().ok===true);
  check('deterministic replay checksum',()=>window.SKYWARD_REPLAY?.checksum?.({a:1})===window.SKYWARD_REPLAY?.checksum?.({a:1}));
  check('aircraft performance schema and API',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.schema===Number(BUILD_INFO.aircraftPerformanceSchema||1) && Object.isFrozen(window.SKYWARD_AIRCRAFT_PERFORMANCE));
  check('aircraft performance self check',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.selfCheck?.().ok===true);
  check('aircraft performance envelope',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.telemetry?.({type:'B752',status:'FINAL',speed:160,alt:20,targetAlt:0}).wake==='H');
  window.SKYWARD_SELF_TEST = report;
  return report;
}
setTimeout(()=>{ try{ selfTest(); }catch(e){ safeLogError(e,'self-test'); } },500);

applyBuildInfo();
if(!BUILD_METADATA_VALID) setTimeout(()=>showSafeMode(new Error('Metadados de build ausentes ou inválidos. Execute o pipeline de release.')),0);
loadProfile(); loadAirports(); resize();

