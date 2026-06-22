/* @skyward-module 38-infrastructure-expansion-program
 * Infrastructure and expansion program with runway works, terminal expansion, maintenance, CAPEX, capacity and construction risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('38-infrastructure-expansion-program');
const INFRASTRUCTURE_EXPANSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f35',
  projects:[
    {id:'RWY_REHAB',name:'Recapeamento de pista',type:'RUNWAY',cost:180000,durationShifts:4,capacityGain:8,risk:26},
    {id:'TML_EXPANSION',name:'Expansão de terminal',type:'TERMINAL',cost:260000,durationShifts:6,capacityGain:15,risk:22},
    {id:'ILS_UPGRADE',name:'Upgrade ILS CAT II',type:'NAV_AID',cost:210000,durationShifts:5,capacityGain:10,risk:18},
    {id:'CARGO_APRON',name:'Novo pátio cargueiro',type:'CARGO',cost:190000,durationShifts:5,capacityGain:12,risk:20},
    {id:'TOWER_SYSTEMS',name:'Modernização de sistemas da torre',type:'SYSTEMS',cost:150000,durationShifts:3,capacityGain:7,risk:16},
    {id:'REMOTE_STANDS',name:'Posições remotas adicionais',type:'APRON',cost:120000,durationShifts:3,capacityGain:9,risk:14}
  ],
  maintenancePrograms:[
    {id:'DAILY_INSPECTION',name:'Inspeção diária de pista',cost:8000,reliabilityGain:5},
    {id:'LIGHTING_CHECK',name:'Checagem balizamento',cost:12000,reliabilityGain:7},
    {id:'RADAR_CALIBRATION',name:'Calibração radar/navaids',cost:18000,reliabilityGain:9},
    {id:'BAGGAGE_PM',name:'Manutenção preventiva bagagem',cost:10000,reliabilityGain:6}
  ],
  fundingSources:[
    {id:'AIRPORT_REVENUE',name:'Receita aeroportuária',limit:300000,risk:5},
    {id:'PUBLIC_GRANT',name:'Fomento público',limit:500000,risk:12},
    {id:'AIRLINE_CONSORTIUM',name:'Consórcio de companhias',limit:450000,risk:10},
    {id:'EMERGENCY_CAPEX',name:'CAPEX emergencial',limit:250000,risk:18}
  ],
  constructionRisks:[
    {id:'RUNWAY_RESTRICTION',name:'Restrição de pista',impact:'capacity-12',risk:28},
    {id:'NOISE_WINDOW',name:'Janela de ruído',impact:'schedule-8',risk:12},
    {id:'SUPPLY_DELAY',name:'Atraso de fornecedor',impact:'duration+1',risk:20},
    {id:'COST_OVERRUN',name:'Estouro de orçamento',impact:'cost+15',risk:18}
  ],
  capacityBands:[
    {id:'WORLD_CLASS',min:90,name:'Infraestrutura world-class'},
    {id:'EXPANDING',min:75,name:'Infraestrutura em expansão'},
    {id:'LIMITED',min:55,name:'Capacidade limitada'},
    {id:'CONSTRAINED',min:0,name:'Aeroporto estrangulado'}
  ]
});
const INFRASTRUCTURE_EXPANSION_KEY='skywardInfrastructureExpansion_v1';
let infrastructureExpansionState={schema:1,capexBudget:250000,activeProjects:[],completedProjects:[],maintenanceLog:[],capacityScore:72,reliabilityScore:76,constructionRisk:0,status:'LIMITED',history:[],lastEvaluation:null};
function loadInfrastructureExpansion(){
  try{ const raw=localStorage?.getItem?.(INFRASTRUCTURE_EXPANSION_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) infrastructureExpansionState={...infrastructureExpansionState,...parsed}; } }catch(e){ safeLogError?.(e,'infrastructure-expansion-load'); }
  return infrastructureExpansionState;
}
function saveInfrastructureExpansion(){
  try{ localStorage?.setItem?.(INFRASTRUCTURE_EXPANSION_KEY,JSON.stringify(infrastructureExpansionState)); }catch(e){ safeLogError?.(e,'infrastructure-expansion-save'); }
  return infrastructureExpansionState;
}
function capacityBand(score){
  return INFRASTRUCTURE_EXPANSION_CATALOG.capacityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||INFRASTRUCTURE_EXPANSION_CATALOG.capacityBands.at(-1);
}
function projectById(id){ return INFRASTRUCTURE_EXPANSION_CATALOG.projects.find(p=>p.id===id)||INFRASTRUCTURE_EXPANSION_CATALOG.projects[0]; }
function maintenanceById(id){ return INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.find(p=>p.id===id)||INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms[0]; }
function startInfrastructureProject(id='REMOTE_STANDS',funding='AIRPORT_REVENUE'){
  loadInfrastructureExpansion();
  const project=projectById(id);
  if(infrastructureExpansionState.activeProjects.some(p=>p.projectId===project.id)) return infrastructureExpansionState.activeProjects.find(p=>p.projectId===project.id);
  const item={id:`PRJ-${String(Date.now()).slice(-6)}`,projectId:project.id,name:project.name,type:project.type,remaining:project.durationShifts,cost:project.cost,funding,status:'ACTIVE',risk:project.risk,startedAt:new Date().toISOString()};
  infrastructureExpansionState.activeProjects.unshift(item);
  infrastructureExpansionState.capexBudget-=Math.round(project.cost*.25);
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return item;
}
function runMaintenance(id='DAILY_INSPECTION'){
  loadInfrastructureExpansion();
  const maint=maintenanceById(id);
  infrastructureExpansionState.capexBudget-=maint.cost;
  infrastructureExpansionState.reliabilityScore=Math.min(100,infrastructureExpansionState.reliabilityScore+maint.reliabilityGain);
  const item={id:`MNT-${String(Date.now()).slice(-6)}`,programId:maint.id,name:maint.name,cost:maint.cost,reliabilityGain:maint.reliabilityGain,at:new Date().toISOString()};
  infrastructureExpansionState.maintenanceLog.unshift(item);
  infrastructureExpansionState.maintenanceLog=infrastructureExpansionState.maintenanceLog.slice(0,60);
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return item;
}
function advanceProjects(statsObj={},fail=false){
  const finished=[];
  for(const p of infrastructureExpansionState.activeProjects){
    if(p.status!=='ACTIVE') continue;
    const delay=(statsObj.conflicts||0)>0 || fail ? 0 : 1;
    p.remaining=Math.max(0,p.remaining-delay);
    if(p.remaining===0){
      p.status='COMPLETED';
      p.completedAt=new Date().toISOString();
      finished.push(p);
      if(!infrastructureExpansionState.completedProjects.includes(p.projectId)) infrastructureExpansionState.completedProjects.push(p.projectId);
      const tpl=projectById(p.projectId);
      infrastructureExpansionState.capacityScore=Math.min(100,infrastructureExpansionState.capacityScore+tpl.capacityGain);
      infrastructureExpansionState.capexBudget-=Math.round(tpl.cost*.75);
    }
  }
  infrastructureExpansionState.activeProjects=infrastructureExpansionState.activeProjects.filter(p=>p.status==='ACTIVE');
  return finished;
}
function evaluateInfrastructureExpansion(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInfrastructureExpansion();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const airlineOps=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const finished=advanceProjects(statsObj,fail);
  const activeRisk=infrastructureExpansionState.activeProjects.reduce((a,p)=>a+Number(p.risk||0),0);
  const externalPressure=Math.max(0,75-Number(airportAuth.progress?.score||80))*0.35 + Math.max(0,75-Number(airlineOps.progress?.score||80))*0.25 + Math.max(0,75-Number(safety.progress?.score||80))*0.3;
  const operationalPenalty=(statsObj.conflicts||0)*3+(statsObj.runwayIncursions||0)*6+(fail?8:0);
  infrastructureExpansionState.constructionRisk=Math.max(0,Math.min(100,Math.round(activeRisk/2+externalPressure+operationalPenalty)));
  infrastructureExpansionState.reliabilityScore=Math.max(0,Math.min(100,Math.round(infrastructureExpansionState.reliabilityScore - infrastructureExpansionState.constructionRisk/30 + Math.min(2,finalScore/1800))));
  const totalScore=Math.max(0,Math.min(100,Math.round(infrastructureExpansionState.capacityScore*.55+infrastructureExpansionState.reliabilityScore*.35+Math.max(0,100-infrastructureExpansionState.constructionRisk)*.10)));
  infrastructureExpansionState.capacityScore=totalScore;
  infrastructureExpansionState.status=capacityBand(totalScore).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),finishedProjects:finished.map(p=>p.projectId),activeProjects:infrastructureExpansionState.activeProjects.length,capexBudget:infrastructureExpansionState.capexBudget,capacityScore:totalScore,reliabilityScore:infrastructureExpansionState.reliabilityScore,constructionRisk:infrastructureExpansionState.constructionRisk,status:infrastructureExpansionState.status};
  infrastructureExpansionState.history.unshift(evaluation);
  infrastructureExpansionState.history=infrastructureExpansionState.history.slice(0,80);
  infrastructureExpansionState.lastEvaluation=evaluation;
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return {state:infrastructureExpansionState,evaluation};
}
function infrastructureExpansionProgress(){
  loadInfrastructureExpansion();
  return {score:infrastructureExpansionState.capacityScore,status:infrastructureExpansionState.status,budget:infrastructureExpansionState.capexBudget,activeProjects:infrastructureExpansionState.activeProjects.length,completedProjects:infrastructureExpansionState.completedProjects.length,risk:infrastructureExpansionState.constructionRisk,reliability:infrastructureExpansionState.reliabilityScore,last:infrastructureExpansionState.lastEvaluation||null};
}
function renderInfrastructureExpansionBoard(){
  try{
    const anchor=document.querySelector('#safetyComplianceInline') || document.querySelector('#crisisCommandInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#infrastructureExpansionInline'); if(old) old.remove();
    const p=infrastructureExpansionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="infrastructureExpansionInline" class="airport-ops-board infrastructure-expansion-inline">
      <div class="airport-ops-head"><b>INFRA CAPEX</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CAPAC.</small><b>${p.score}%</b></div>
        <div><small>CONFIAB.</small><b>${p.reliability}%</b></div>
        <div><small>OBRAS</small><b>${p.activeProjects}</b></div>
        <div><small>CONCL.</small><b>${p.completedProjects}</b></div>
        <div><small>RISCO</small><b>${p.risk}%</b></div>
        <div><small>CAPEX</small><b>${Math.round(p.budget/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'infrastructure-expansion-board'); }
}
function initializeInfrastructureExpansion(){
  loadInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return infrastructureExpansionState;
}
function infrastructureExpansionStatus(){ loadInfrastructureExpansion(); return {...infrastructureExpansionState,progress:infrastructureExpansionProgress(),catalog:INFRASTRUCTURE_EXPANSION_CATALOG}; }
function infrastructureExpansionSelfCheck(){
  const issues=[];
  if(INFRASTRUCTURE_EXPANSION_CATALOG.projects.length<6) issues.push('projetos insuficientes');
  if(INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.length<4) issues.push('manutenção insuficiente');
  const prj=startInfrastructureProject('REMOTE_STANDS','AIRPORT_REVENUE');
  const mnt=runMaintenance('DAILY_INSPECTION');
  const res=evaluateInfrastructureExpansion(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!prj.id || !mnt.id) issues.push('obra/manutenção não criou registro');
  if(!Number.isFinite(res.evaluation.capacityScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,projects:INFRASTRUCTURE_EXPANSION_CATALOG.projects.length,maintenance:INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.length};
}
window.SKYWARD_INFRASTRUCTURE_EXPANSION=Object.freeze({
  schema:1,
  catalog:INFRASTRUCTURE_EXPANSION_CATALOG,
  load:loadInfrastructureExpansion,
  save:saveInfrastructureExpansion,
  init:initializeInfrastructureExpansion,
  start:startInfrastructureProject,
  maintenance:runMaintenance,
  evaluate:evaluateInfrastructureExpansion,
  progress:infrastructureExpansionProgress,
  status:infrastructureExpansionStatus,
  board:renderInfrastructureExpansionBoard,
  selfCheck:infrastructureExpansionSelfCheck
});
