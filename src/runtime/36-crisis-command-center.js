/* @skyward-module 36-crisis-command-center
 * Crisis Command Center for irregular operations, ground stop, cyber incident, severe weather, labor disruption and recovery planning.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('36-crisis-command-center');
const CRISIS_COMMAND_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f33',
  crisisTypes:[
    {id:'GROUND_STOP',name:'Ground stop regional',severity:'CRITICAL',risk:85,impact:['network','airline','terminal']},
    {id:'POWER_OUTAGE',name:'Falha elétrica parcial',severity:'MAJOR',risk:72,impact:['tower','terminal','baggage']},
    {id:'CYBER_INCIDENT',name:'Incidente cyber operacional',severity:'CRITICAL',risk:88,impact:['systems','pwa','dispatch']},
    {id:'LABOR_DISRUPTION',name:'Greve/equipe reduzida',severity:'MAJOR',risk:68,impact:['terminal','ground','airline']},
    {id:'SEVERE_WEATHER_CELL',name:'Célula severa',severity:'CRITICAL',risk:82,impact:['approach','runway','network']},
    {id:'SECURITY_ALERT',name:'Alerta de segurança no terminal',severity:'MAJOR',risk:74,impact:['terminal','boarding','authority']}
  ],
  commandActions:[
    {id:'ACTIVATE_EOC',name:'Ativar centro de emergência',reduces:['coordination'],cost:12000},
    {id:'GROUND_DELAY_PROGRAM',name:'Programa de atraso no solo',reduces:['network'],cost:9000},
    {id:'MANUAL_FALLBACK',name:'Fallback manual de sistemas',reduces:['systems'],cost:15000},
    {id:'MUTUAL_AID',name:'Apoio multiagência',reduces:['terminal','safety'],cost:18000},
    {id:'RUNWAY_RATE_REDUCTION',name:'Reduzir taxa de pista',reduces:['runway','approach'],cost:7000},
    {id:'PASSENGER_CARE',name:'Cuidado ao passageiro',reduces:['passenger','airline'],cost:11000}
  ],
  recoveryStages:[
    {id:'ASSESS',name:'Avaliar impacto',target:1},
    {id:'STABILIZE',name:'Estabilizar segurança',target:2},
    {id:'RECOVER_FLOW',name:'Recuperar fluxo',target:3},
    {id:'RESTORE_SERVICE',name:'Restaurar serviço',target:4},
    {id:'DEBRIEF',name:'Debrief e prevenção',target:5}
  ],
  stakeholders:[
    {id:'ATC',name:'Controle de tráfego aéreo',priority:5},
    {id:'AIRPORT_AUTH',name:'Autoridade aeroportuária',priority:4},
    {id:'AIRLINES',name:'Companhias aéreas',priority:4},
    {id:'GROUND_HANDLING',name:'Solo e rampa',priority:3},
    {id:'SECURITY',name:'Segurança',priority:5},
    {id:'PASSENGERS',name:'Passageiros',priority:3}
  ],
  scoreBands:[
    {id:'RESILIENT',min:90,name:'Operação resiliente'},
    {id:'STABLE',min:75,name:'Crise controlada'},
    {id:'STRAINED',min:55,name:'Operação pressionada'},
    {id:'FAILED',min:0,name:'Falha de comando'}
  ]
});
const CRISIS_COMMAND_KEY='skywardCrisisCommand_v1';
let crisisCommandState={schema:1,activeCrisis:null,actionsTaken:[],recoveryStage:'ASSESS',crisisScore:100,status:'RESILIENT',history:[],lastEvaluation:null};
function loadCrisisCommand(){
  try{ const raw=localStorage?.getItem?.(CRISIS_COMMAND_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) crisisCommandState={...crisisCommandState,...parsed}; } }catch(e){ safeLogError?.(e,'crisis-command-load'); }
  return crisisCommandState;
}
function saveCrisisCommand(){
  try{ localStorage?.setItem?.(CRISIS_COMMAND_KEY,JSON.stringify(crisisCommandState)); }catch(e){ safeLogError?.(e,'crisis-command-save'); }
  return crisisCommandState;
}
function crisisById(id){ return CRISIS_COMMAND_CATALOG.crisisTypes.find(c=>c.id===id)||CRISIS_COMMAND_CATALOG.crisisTypes[0]; }
function actionById(id){ return CRISIS_COMMAND_CATALOG.commandActions.find(a=>a.id===id)||CRISIS_COMMAND_CATALOG.commandActions[0]; }
function scoreBand(score){ return CRISIS_COMMAND_CATALOG.scoreBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||CRISIS_COMMAND_CATALOG.scoreBands.at(-1); }
function triggerCrisis(id='GROUND_STOP', note=''){
  loadCrisisCommand();
  const crisis=crisisById(id);
  crisisCommandState.activeCrisis={id:crisis.id,name:crisis.name,severity:crisis.severity,risk:crisis.risk,impact:crisis.impact,note:String(note||''),startedAt:new Date().toISOString(),status:'ACTIVE'};
  crisisCommandState.recoveryStage='ASSESS';
  crisisCommandState.actionsTaken=[];
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return crisisCommandState.activeCrisis;
}
function takeCrisisAction(id='ACTIVATE_EOC'){
  loadCrisisCommand();
  const action=actionById(id);
  const item={id:`CAC-${String(Date.now()).slice(-6)}`,actionId:action.id,name:action.name,cost:action.cost,at:new Date().toISOString()};
  crisisCommandState.actionsTaken.unshift(item);
  crisisCommandState.actionsTaken=crisisCommandState.actionsTaken.slice(0,20);
  advanceRecoveryStage();
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return item;
}
function advanceRecoveryStage(){
  const idx=CRISIS_COMMAND_CATALOG.recoveryStages.findIndex(s=>s.id===crisisCommandState.recoveryStage);
  const next=CRISIS_COMMAND_CATALOG.recoveryStages[Math.min(idx+1,CRISIS_COMMAND_CATALOG.recoveryStages.length-1)];
  crisisCommandState.recoveryStage=next.id;
  return next;
}
function autoCrisisPressure(finalScore=0,statsObj={},fail=false){
  const network=window.SKYWARD_NETWORK_FLOW?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  let pressure=0;
  pressure+=(statsObj.conflicts||0)*16;
  pressure+=(statsObj.runwayIncursions||0)*24;
  pressure+=(statsObj.denied||0)*4;
  pressure+=fail?24:0;
  pressure+=Math.max(0,Number(network.networkDelayMin||0))*0.7;
  pressure+=Math.max(0,75-Number(airline.progress?.score||85))*0.4;
  pressure+=Math.max(0,75-Number(airportAuth.progress?.score||85))*0.45;
  pressure+=finalScore<800?10:0;
  return Math.max(0,Math.min(100,Math.round(pressure)));
}
function maybeAutoTriggerCrisis(finalScore=0,statsObj={},fail=false){
  if(crisisCommandState.activeCrisis?.status==='ACTIVE') return null;
  const pressure=autoCrisisPressure(finalScore,statsObj,fail);
  if(pressure>=75) return triggerCrisis('GROUND_STOP','pressão sistêmica automática');
  if((statsObj.runwayIncursions||0)>0) return triggerCrisis('SEVERE_WEATHER_CELL','proteção de pista e aproximação');
  if((statsObj.denied||0)>=3) return triggerCrisis('LABOR_DISRUPTION','acúmulo de pedidos negados');
  return null;
}
function actionMitigation(){
  const ids=crisisCommandState.actionsTaken.map(a=>a.actionId);
  let mitigation=0;
  if(ids.includes('ACTIVATE_EOC')) mitigation+=14;
  if(ids.includes('GROUND_DELAY_PROGRAM')) mitigation+=12;
  if(ids.includes('MANUAL_FALLBACK')) mitigation+=11;
  if(ids.includes('MUTUAL_AID')) mitigation+=13;
  if(ids.includes('RUNWAY_RATE_REDUCTION')) mitigation+=10;
  if(ids.includes('PASSENGER_CARE')) mitigation+=8;
  return mitigation;
}
function evaluateCrisisCommand(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCrisisCommand();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  maybeAutoTriggerCrisis(finalScore,statsObj,fail);
  const active=crisisCommandState.activeCrisis;
  const baseRisk=active?.status==='ACTIVE'?Number(active.risk||0):autoCrisisPressure(finalScore,statsObj,fail);
  const pressure=autoCrisisPressure(finalScore,statsObj,fail);
  const mitigation=actionMitigation();
  let score=Math.max(0,Math.min(100,Math.round(100-baseRisk*0.35-pressure*0.45+mitigation+Math.min(8,finalScore/1000))));
  const band=scoreBand(score);
  crisisCommandState.crisisScore=score;
  crisisCommandState.status=band.id;
  if(active && score>=88 && crisisCommandState.recoveryStage==='DEBRIEF'){
    active.status='RESOLVED';
    active.resolvedAt=new Date().toISOString();
  }
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),activeCrisis:active?.id||null,recoveryStage:crisisCommandState.recoveryStage,pressure,mitigation,crisisScore:score,status:band.id,actions:crisisCommandState.actionsTaken.length};
  crisisCommandState.history.unshift(evaluation);
  crisisCommandState.history=crisisCommandState.history.slice(0,80);
  crisisCommandState.lastEvaluation=evaluation;
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return {state:crisisCommandState,evaluation};
}
function crisisCommandProgress(){
  loadCrisisCommand();
  return {score:crisisCommandState.crisisScore,status:crisisCommandState.status,active:crisisCommandState.activeCrisis,recoveryStage:crisisCommandState.recoveryStage,actions:crisisCommandState.actionsTaken.length,last:crisisCommandState.lastEvaluation||null};
}
function renderCrisisCommandBoard(){
  try{
    const anchor=document.querySelector('#airportAuthorityInline') || document.querySelector('#airlineOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#crisisCommandInline'); if(old) old.remove();
    const p=crisisCommandProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="crisisCommandInline" class="airport-ops-board crisis-command-inline">
      <div class="airport-ops-head"><b>CRISIS CMD</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}%</b></div>
        <div><small>CRISE</small><b>${p.active?.id||'NONE'}</b></div>
        <div><small>RECOVERY</small><b>${p.recoveryStage}</b></div>
        <div><small>AÇÕES</small><b>${p.actions}</b></div>
        <div><small>PRESSÃO</small><b>${p.last?.pressure??0}</b></div>
        <div><small>MITIGAÇÃO</small><b>${p.last?.mitigation??0}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'crisis-command-board'); }
}
function initializeCrisisCommand(){
  loadCrisisCommand();
  renderCrisisCommandBoard();
  return crisisCommandState;
}
function crisisCommandStatus(){ loadCrisisCommand(); return {...crisisCommandState,progress:crisisCommandProgress(),catalog:CRISIS_COMMAND_CATALOG}; }
function crisisCommandSelfCheck(){
  const issues=[];
  if(CRISIS_COMMAND_CATALOG.crisisTypes.length<6) issues.push('tipos de crise insuficientes');
  if(CRISIS_COMMAND_CATALOG.commandActions.length<6) issues.push('ações insuficientes');
  if(CRISIS_COMMAND_CATALOG.recoveryStages.length<5) issues.push('recovery insuficiente');
  const crisis=triggerCrisis('GROUND_STOP','selfcheck');
  takeCrisisAction('ACTIVATE_EOC'); takeCrisisAction('GROUND_DELAY_PROGRAM');
  const res=evaluateCrisisCommand(1800,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!crisis.id || !Number.isFinite(res.evaluation.crisisScore)) issues.push('avaliação inválida');
  return {ok:issues.length===0,issues,crisisTypes:CRISIS_COMMAND_CATALOG.crisisTypes.length,actions:CRISIS_COMMAND_CATALOG.commandActions.length};
}
window.SKYWARD_CRISIS_COMMAND=Object.freeze({
  schema:1,
  catalog:CRISIS_COMMAND_CATALOG,
  load:loadCrisisCommand,
  save:saveCrisisCommand,
  init:initializeCrisisCommand,
  trigger:triggerCrisis,
  action:takeCrisisAction,
  evaluate:evaluateCrisisCommand,
  progress:crisisCommandProgress,
  status:crisisCommandStatus,
  board:renderCrisisCommandBoard,
  selfCheck:crisisCommandSelfCheck
});
