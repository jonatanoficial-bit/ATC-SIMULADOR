/* @skyward-module 46-asset-maintenance-reliability-center
 * Asset maintenance and reliability center with radar, ILS, lighting, ARFF vehicles, baggage systems, spare parts, MTBF and MTTR.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('46-asset-maintenance-reliability-center');
const ASSET_MAINTENANCE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f43',
  assetClasses:[
    {id:'PRIMARY_RADAR',name:'Radar primário',criticality:95,mtbfHours:620,mttrMin:45},
    {id:'SECONDARY_RADAR',name:'Radar secundário/SSR',criticality:90,mtbfHours:700,mttrMin:40},
    {id:'ILS_CAT',name:'ILS e auxílios à navegação',criticality:94,mtbfHours:540,mttrMin:55},
    {id:'RUNWAY_LIGHTING',name:'Balizamento de pista',criticality:88,mtbfHours:480,mttrMin:35},
    {id:'TOWER_SYSTEMS',name:'Sistemas da torre',criticality:92,mtbfHours:610,mttrMin:50},
    {id:'ARFF_VEHICLES',name:'Viaturas ARFF',criticality:86,mtbfHours:420,mttrMin:60},
    {id:'BAGGAGE_SORTER',name:'Esteiras e sorter bagagem',criticality:68,mtbfHours:360,mttrMin:45},
    {id:'PWA_RUNTIME',name:'Runtime PWA/offline',criticality:76,mtbfHours:800,mttrMin:20}
  ],
  maintenancePrograms:[
    {id:'RADAR_CALIBRATION',name:'Calibração radar',cost:24000,benefit:{PRIMARY_RADAR:10,SECONDARY_RADAR:9}},
    {id:'NAVAID_FLIGHT_CHECK',name:'Flight check ILS/NAVAID',cost:32000,benefit:{ILS_CAT:13}},
    {id:'LIGHTING_INSPECTION',name:'Inspeção balizamento',cost:12000,benefit:{RUNWAY_LIGHTING:12}},
    {id:'TOWER_IT_PM',name:'Preventiva torre/IT',cost:18000,benefit:{TOWER_SYSTEMS:10,PWA_RUNTIME:5}},
    {id:'ARFF_FLEET_PM',name:'Preventiva frota ARFF',cost:16000,benefit:{ARFF_VEHICLES:12}},
    {id:'BAGGAGE_PM',name:'Preventiva bagagem',cost:10000,benefit:{BAGGAGE_SORTER:11}},
    {id:'SPARE_PARTS_AUDIT',name:'Auditoria estoque crítico',cost:9000,benefit:{PRIMARY_RADAR:4,ILS_CAT:4,RUNWAY_LIGHTING:4,TOWER_SYSTEMS:4}}
  ],
  failureModes:[
    {id:'RADAR_DROP',name:'Queda radar',asset:'PRIMARY_RADAR',severity:92,opsPenalty:28},
    {id:'SSR_DEGRADED',name:'SSR degradado',asset:'SECONDARY_RADAR',severity:82,opsPenalty:20},
    {id:'ILS_OUTAGE',name:'ILS indisponível',asset:'ILS_CAT',severity:88,opsPenalty:24},
    {id:'LIGHTING_FAULT',name:'Falha balizamento',asset:'RUNWAY_LIGHTING',severity:78,opsPenalty:18},
    {id:'TOWER_COMMS',name:'Falha comunicação torre',asset:'TOWER_SYSTEMS',severity:90,opsPenalty:26},
    {id:'ARFF_DOWN',name:'Viatura ARFF fora',asset:'ARFF_VEHICLES',severity:76,opsPenalty:18},
    {id:'BAGGAGE_STOP',name:'Parada bagagem',asset:'BAGGAGE_SORTER',severity:60,opsPenalty:10},
    {id:'PWA_CACHE_FAIL',name:'Falha cache/offline',asset:'PWA_RUNTIME',severity:64,opsPenalty:12}
  ],
  spareParts:[
    {id:'RADAR_MODULE',name:'Módulo radar',asset:'PRIMARY_RADAR',stock:2,leadTime:3},
    {id:'ILS_TRANSMITTER',name:'Transmissor ILS',asset:'ILS_CAT',stock:1,leadTime:5},
    {id:'LIGHTING_KIT',name:'Kit balizamento',asset:'RUNWAY_LIGHTING',stock:6,leadTime:2},
    {id:'RADIO_STACK',name:'Stack rádio torre',asset:'TOWER_SYSTEMS',stock:2,leadTime:4},
    {id:'ARFF_PUMP',name:'Bomba ARFF',asset:'ARFF_VEHICLES',stock:1,leadTime:4},
    {id:'SORTER_MOTOR',name:'Motor sorter',asset:'BAGGAGE_SORTER',stock:3,leadTime:2}
  ],
  reliabilityBands:[
    {id:'WORLD_CLASS',min:90,name:'Confiabilidade world-class'},
    {id:'STABLE',min:75,name:'Estável'},
    {id:'DEGRADED',min:55,name:'Degradada'},
    {id:'CRITICAL',min:0,name:'Crítica'}
  ],
  assetKPIs:[
    {id:'MTBF',name:'Mean Time Between Failures'},
    {id:'MTTR',name:'Mean Time To Repair'},
    {id:'PM_COMPLIANCE',name:'Cumprimento preventiva'},
    {id:'SPARE_COVERAGE',name:'Cobertura de peças'},
    {id:'OPS_AVAILABILITY',name:'Disponibilidade operacional'}
  ]
});
const ASSET_MAINTENANCE_KEY='skywardAssetMaintenance_v1';
let assetMaintenanceState={schema:1,assetHealth:{PRIMARY_RADAR:82,SECONDARY_RADAR:84,ILS_CAT:80,RUNWAY_LIGHTING:78,TOWER_SYSTEMS:82,ARFF_VEHICLES:76,BAGGAGE_SORTER:74,PWA_RUNTIME:86},programs:[],failures:[],parts:{RADAR_MODULE:2,ILS_TRANSMITTER:1,LIGHTING_KIT:6,RADIO_STACK:2,ARFF_PUMP:1,SORTER_MOTOR:3},reliabilityScore:80,availability:82,mttrMin:42,pmCompliance:72,status:'STABLE',history:[],lastEvaluation:null};
function loadAssetMaintenance(){try{const raw=localStorage?.getItem?.(ASSET_MAINTENANCE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)assetMaintenanceState={...assetMaintenanceState,...parsed};}}catch(e){safeLogError?.(e,'asset-maintenance-load');}return assetMaintenanceState;}
function saveAssetMaintenance(){try{localStorage?.setItem?.(ASSET_MAINTENANCE_KEY,JSON.stringify(assetMaintenanceState));}catch(e){safeLogError?.(e,'asset-maintenance-save');}return assetMaintenanceState;}
function reliabilityBand(score){return ASSET_MAINTENANCE_CATALOG.reliabilityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ASSET_MAINTENANCE_CATALOG.reliabilityBands.at(-1);}
function programById(id){return ASSET_MAINTENANCE_CATALOG.maintenancePrograms.find(p=>p.id===id)||ASSET_MAINTENANCE_CATALOG.maintenancePrograms[0];}
function failureById(id){return ASSET_MAINTENANCE_CATALOG.failureModes.find(f=>f.id===id)||ASSET_MAINTENANCE_CATALOG.failureModes[0];}
function runMaintenanceProgram(id='RADAR_CALIBRATION'){
  loadAssetMaintenance();
  const program=programById(id);
  const item={id:`PM-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'DONE',at:new Date().toISOString()};
  assetMaintenanceState.programs.unshift(item);
  assetMaintenanceState.programs=assetMaintenanceState.programs.slice(0,80);
  for(const [asset,gain] of Object.entries(program.benefit||{})){
    assetMaintenanceState.assetHealth[asset]=Math.min(100,Number(assetMaintenanceState.assetHealth[asset]||70)+Number(gain||0));
  }
  assetMaintenanceState.pmCompliance=Math.min(100,assetMaintenanceState.pmCompliance+4);
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return item;
}
function raiseAssetFailure(id='ILS_OUTAGE'){
  loadAssetMaintenance();
  const tpl=failureById(id);
  const item={id:`FAIL-${String(Date.now()).slice(-6)}`,failureId:tpl.id,name:tpl.name,asset:tpl.asset,severity:tpl.severity,opsPenalty:tpl.opsPenalty,status:'OPEN',at:new Date().toISOString()};
  assetMaintenanceState.failures.unshift(item);
  assetMaintenanceState.failures=assetMaintenanceState.failures.slice(0,80);
  assetMaintenanceState.assetHealth[tpl.asset]=Math.max(0,Number(assetMaintenanceState.assetHealth[tpl.asset]||70)-Math.round(tpl.severity/8));
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return item;
}
function repairAssetFailure(id,ok=true){
  loadAssetMaintenance();
  const failure=assetMaintenanceState.failures.find(f=>f.id===id);
  if(failure){
    failure.status=ok?'REPAIRED':'DEFERRED';
    failure.closedAt=new Date().toISOString();
    if(ok) assetMaintenanceState.assetHealth[failure.asset]=Math.min(100,Number(assetMaintenanceState.assetHealth[failure.asset]||70)+6);
  }
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return failure||null;
}
function spareCoverage(){
  const important=ASSET_MAINTENANCE_CATALOG.spareParts.filter(p=>['PRIMARY_RADAR','ILS_CAT','RUNWAY_LIGHTING','TOWER_SYSTEMS','ARFF_VEHICLES'].includes(p.asset));
  if(!important.length) return 0;
  return Math.round(important.reduce((a,p)=>a+Math.min(100,Number(assetMaintenanceState.parts[p.id]??p.stock)*35),0)/important.length);
}
function calculateAssetMetrics(finalScore=0,statsObj={},fail=false){
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const open=assetMaintenanceState.failures.filter(f=>f.status==='OPEN');
  const health={...assetMaintenanceState.assetHealth};
  const incursions=Number(statsObj.runwayIncursions||0), conflicts=Number(statsObj.conflicts||0), denied=Number(statsObj.denied||0);
  const infraRisk=Number(infra.progress?.risk||0);
  const emergencyScore=Number(emergency.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const safetyScore=Number(safety.progress?.score||80);
  const cash=Number(revenue.progress?.cash||300000);
  const assetPenalty=(asset)=>open.filter(f=>f.asset===asset).reduce((a,f)=>a+Number(f.opsPenalty||0),0);
  for(const asset of Object.keys(health)){
    health[asset]=Math.max(0,Math.min(100,Number(health[asset]||70)-assetPenalty(asset)*0.45-infraRisk*0.03+(finalScore>2200?1:0)));
  }
  health.RUNWAY_LIGHTING=Math.max(0,health.RUNWAY_LIGHTING-incursions*4);
  health.PRIMARY_RADAR=Math.max(0,health.PRIMARY_RADAR-conflicts*3);
  health.TOWER_SYSTEMS=Math.max(0,health.TOWER_SYSTEMS-denied*1.5+(securityScore>85?1:0));
  health.ARFF_VEHICLES=Math.max(0,health.ARFF_VEHICLES+(emergencyScore-75)*0.04);
  const critical=['PRIMARY_RADAR','SECONDARY_RADAR','ILS_CAT','RUNWAY_LIGHTING','TOWER_SYSTEMS','ARFF_VEHICLES'];
  const avgCritical=Math.round(critical.reduce((a,k)=>a+Number(health[k]||0),0)/critical.length);
  const coverage=spareCoverage();
  const openPenalty=open.reduce((a,f)=>a+Number(f.severity||0),0)/18;
  const budgetPenalty=cash<0?10:0;
  const availability=Math.max(0,Math.min(100,Math.round(avgCritical*.62+coverage*.18+assetMaintenanceState.pmCompliance*.12+safetyScore*.08-openPenalty-budgetPenalty-(fail?6:0))));
  const mttr=Math.max(15,Math.min(120,Math.round(assetMaintenanceState.mttrMin+open.length*4+Math.max(0,70-coverage)/5-budgetPenalty)));
  return {health,avgCritical,spareCoverage:coverage,availability,mttr,openFailures:open.length,drivers:{incursions,conflicts,denied,infraRisk,emergencyScore,securityScore,safetyScore,cash}};
}
function evaluateAssetMaintenance(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAssetMaintenance();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.conflicts||0)>=2 && !assetMaintenanceState.failures.some(f=>f.status==='OPEN'&&f.failureId==='RADAR_DROP')) raiseAssetFailure('RADAR_DROP');
  if((statsObj.runwayIncursions||0)>0 && !assetMaintenanceState.failures.some(f=>f.status==='OPEN'&&f.failureId==='LIGHTING_FAULT')) raiseAssetFailure('LIGHTING_FAULT');
  const metrics=calculateAssetMetrics(finalScore,statsObj,fail);
  assetMaintenanceState.assetHealth=metrics.health;
  assetMaintenanceState.availability=metrics.availability;
  assetMaintenanceState.mttrMin=metrics.mttr;
  const score=Math.max(0,Math.min(100,Math.round(metrics.availability*.58+metrics.avgCritical*.24+metrics.spareCoverage*.10+Math.max(0,100-metrics.mttr)*.08)));
  assetMaintenanceState.reliabilityScore=score;
  assetMaintenanceState.status=reliabilityBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,reliabilityScore:score,status:assetMaintenanceState.status,programs:assetMaintenanceState.programs.length};
  assetMaintenanceState.history.unshift(evaluation);
  assetMaintenanceState.history=assetMaintenanceState.history.slice(0,100);
  assetMaintenanceState.lastEvaluation=evaluation;
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return {state:assetMaintenanceState,evaluation};
}
function assetMaintenanceProgress(){
  loadAssetMaintenance();
  return {score:assetMaintenanceState.reliabilityScore,status:assetMaintenanceState.status,availability:assetMaintenanceState.availability,mttrMin:assetMaintenanceState.mttrMin,pmCompliance:assetMaintenanceState.pmCompliance,spareCoverage:spareCoverage(),openFailures:assetMaintenanceState.failures.filter(f=>f.status==='OPEN').length,programs:assetMaintenanceState.programs.length,last:assetMaintenanceState.lastEvaluation||null};
}
function renderAssetMaintenanceBoard(){
  try{
    const anchor=document.querySelector('#securityCyberInline') || document.querySelector('#emergencyResponseInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#assetMaintenanceInline'); if(old) old.remove();
    const p=assetMaintenanceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="assetMaintenanceInline" class="airport-ops-board asset-maintenance-inline">
      <div class="airport-ops-head"><b>ASSET REL</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REL.</small><b>${p.score}%</b></div>
        <div><small>DISP.</small><b>${p.availability}%</b></div>
        <div><small>MTTR</small><b>${p.mttrMin}m</b></div>
        <div><small>PM</small><b>${p.pmCompliance}%</b></div>
        <div><small>PEÇAS</small><b>${p.spareCoverage}%</b></div>
        <div><small>FALHAS</small><b>${p.openFailures}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'asset-maintenance-board'); }
}
function initializeAssetMaintenance(){loadAssetMaintenance();renderAssetMaintenanceBoard();return assetMaintenanceState;}
function assetMaintenanceStatus(){loadAssetMaintenance();return {...assetMaintenanceState,progress:assetMaintenanceProgress(),catalog:ASSET_MAINTENANCE_CATALOG};}
function assetMaintenanceSelfCheck(){
  const issues=[];
  if(ASSET_MAINTENANCE_CATALOG.assetClasses.length<8) issues.push('ativos insuficientes');
  if(ASSET_MAINTENANCE_CATALOG.failureModes.length<8) issues.push('falhas insuficientes');
  const program=runMaintenanceProgram('RADAR_CALIBRATION');
  const failure=raiseAssetFailure('ILS_OUTAGE');
  const res=evaluateAssetMaintenance(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !failure.id) issues.push('programa/falha inválido');
  if(!Number.isFinite(res.evaluation.reliabilityScore)) issues.push('score confiabilidade inválido');
  return {ok:issues.length===0,issues,assets:ASSET_MAINTENANCE_CATALOG.assetClasses.length,failures:ASSET_MAINTENANCE_CATALOG.failureModes.length};
}
window.SKYWARD_ASSET_MAINTENANCE=Object.freeze({
  schema:1,
  catalog:ASSET_MAINTENANCE_CATALOG,
  load:loadAssetMaintenance,
  save:saveAssetMaintenance,
  init:initializeAssetMaintenance,
  program:runMaintenanceProgram,
  failure:raiseAssetFailure,
  repair:repairAssetFailure,
  evaluate:evaluateAssetMaintenance,
  progress:assetMaintenanceProgress,
  status:assetMaintenanceStatus,
  board:renderAssetMaintenanceBoard,
  selfCheck:assetMaintenanceSelfCheck
});
