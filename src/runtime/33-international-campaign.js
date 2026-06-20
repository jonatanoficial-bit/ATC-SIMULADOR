/* @skyward-module 33-international-campaign
 * International ATC campaign, seasons, airport contracts, career calendar and local global milestones.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('33-international-campaign');
const INTERNATIONAL_CAMPAIGN_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f30',
  regions:[
    {id:'BR_SOUTHEAST',name:'Brasil Sudeste',airports:['SBSP','SBGR','SBKP'],difficulty:2},
    {id:'BR_CAPITAL',name:'Brasil Capital',airports:['SBBR'],difficulty:3},
    {id:'US_MAJOR_HUB',name:'EUA Mega Hub',airports:['KATL'],difficulty:5},
    {id:'INTERNATIONAL_FLOW',name:'Fluxo Internacional',airports:['SBGR','KATL'],difficulty:4}
  ],
  seasons:[
    {id:'SEASON_01',name:'Licença Operacional',weeks:4,targetReputation:120,targetSafety:78},
    {id:'SEASON_02',name:'Controle Regional',weeks:6,targetReputation:280,targetSafety:82},
    {id:'SEASON_03',name:'Operação Internacional',weeks:8,targetReputation:520,targetSafety:86},
    {id:'SEASON_04',name:'Supervisor Global',weeks:10,targetReputation:900,targetSafety:90}
  ],
  contracts:[
    {id:'CONTRACT_SBSP_STARTER',airport:'SBSP',name:'Congonhas Starter Tower',durationShifts:3,minSafety:70,rewardRep:45,rewardBudget:30000},
    {id:'CONTRACT_SBGR_REGIONAL',airport:'SBGR',name:'Guarulhos Regional Flow',durationShifts:5,minSafety:78,rewardRep:90,rewardBudget:85000},
    {id:'CONTRACT_SBKP_CARGO',airport:'SBKP',name:'Viracopos Cargo Reliability',durationShifts:4,minSafety:76,rewardRep:70,rewardBudget:65000},
    {id:'CONTRACT_SBBR_GOV',airport:'SBBR',name:'Brasília Priority Ops',durationShifts:5,minSafety:82,rewardRep:110,rewardBudget:100000},
    {id:'CONTRACT_KATL_GLOBAL',airport:'KATL',name:'Atlanta Global Hub',durationShifts:7,minSafety:88,rewardRep:180,rewardBudget:180000}
  ],
  calendarEvents:[
    {id:'WX_FRONT',name:'Frente fria IFR',week:2,modifier:'weatherRisk+15'},
    {id:'HOLIDAY_RUSH',name:'Pico de feriado',week:3,modifier:'traffic+20'},
    {id:'CARGO_SURGE',name:'Surto cargueiro',week:5,modifier:'cargo+25'},
    {id:'INTERNATIONAL_AUDIT',name:'Auditoria internacional',week:7,modifier:'safetyRequired+5'},
    {id:'RUNWAY_WORKS',name:'Obras de pista',week:9,modifier:'runwayCapacity-20'}
  ],
  milestones:[
    {id:'FIRST_CONTRACT',name:'Primeiro contrato concluído',requirement:'contractsCompleted>=1',rewardRep:30},
    {id:'SAFE_SEASON',name:'Temporada segura',requirement:'seasonSafety>=85',rewardRep:80},
    {id:'GLOBAL_CONTROLLER',name:'Controlador Global',requirement:'regionsUnlocked>=3',rewardRep:150},
    {id:'HUB_SPECIALIST',name:'Especialista em Hub',requirement:'KATL shifts>=5',rewardRep:120}
  ],
  riskBands:[
    {id:'LOW',name:'Baixo',min:0,max:29},
    {id:'MODERATE',name:'Moderado',min:30,max:59},
    {id:'HIGH',name:'Alto',min:60,max:84},
    {id:'CRITICAL',name:'Crítico',min:85,max:100}
  ]
});
const INTERNATIONAL_CAMPAIGN_KEY='skywardInternationalCampaign_v1';
let internationalCampaignState={schema:1,seasonId:'SEASON_01',week:1,reputation:0,budget:0,activeContractId:'CONTRACT_SBSP_STARTER',contractProgress:{},completedContracts:[],unlockedRegions:['BR_SOUTHEAST'],milestones:[],history:[],campaignScore:0,status:'LOCAL_TRAINEE',lastEvaluation:null};
function loadInternationalCampaign(){
  try{ const raw=localStorage?.getItem?.(INTERNATIONAL_CAMPAIGN_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) internationalCampaignState={...internationalCampaignState,...parsed}; } }catch(e){ safeLogError?.(e,'intl-campaign-load'); }
  return internationalCampaignState;
}
function saveInternationalCampaign(){
  try{ localStorage?.setItem?.(INTERNATIONAL_CAMPAIGN_KEY,JSON.stringify(internationalCampaignState)); }catch(e){ safeLogError?.(e,'intl-campaign-save'); }
  return internationalCampaignState;
}
function currentSeason(){ return INTERNATIONAL_CAMPAIGN_CATALOG.seasons.find(s=>s.id===internationalCampaignState.seasonId)||INTERNATIONAL_CAMPAIGN_CATALOG.seasons[0]; }
function currentContract(){ return INTERNATIONAL_CAMPAIGN_CATALOG.contracts.find(c=>c.id===internationalCampaignState.activeContractId)||INTERNATIONAL_CAMPAIGN_CATALOG.contracts[0]; }
function contractForAirport(icao){
  return INTERNATIONAL_CAMPAIGN_CATALOG.contracts.find(c=>c.airport===icao && !internationalCampaignState.completedContracts.includes(c.id)) || currentContract();
}
function campaignSafetyScore(finalScore=0,statsObj={},fail=false){
  return Math.max(0,Math.min(100,Math.round(92-(statsObj.conflicts||0)*14-(statsObj.runwayIncursions||0)*22-(statsObj.denied||0)*2-(fail?24:0)+Math.min(8,finalScore/1000))));
}
function weekEvents(){
  return INTERNATIONAL_CAMPAIGN_CATALOG.calendarEvents.filter(e=>e.week===internationalCampaignState.week);
}
function campaignRisk(){
  const season=currentSeason();
  const events=weekEvents();
  let risk=season.targetSafety-65 + events.length*10 + currentRegionDifficulty()*5;
  const contract=currentContract();
  if(contract.minSafety>=85) risk+=10;
  risk=Math.max(0,Math.min(100,Math.round(risk)));
  const band=INTERNATIONAL_CAMPAIGN_CATALOG.riskBands.find(b=>risk>=b.min&&risk<=b.max)||INTERNATIONAL_CAMPAIGN_CATALOG.riskBands[0];
  return {risk,band,events};
}
function currentRegionDifficulty(){
  const contract=currentContract();
  const region=INTERNATIONAL_CAMPAIGN_CATALOG.regions.find(r=>r.airports.includes(contract.airport));
  return region?.difficulty||2;
}
function unlockRegions(){
  if(internationalCampaignState.reputation>=160 && !internationalCampaignState.unlockedRegions.includes('BR_CAPITAL')) internationalCampaignState.unlockedRegions.push('BR_CAPITAL');
  if(internationalCampaignState.reputation>=360 && !internationalCampaignState.unlockedRegions.includes('INTERNATIONAL_FLOW')) internationalCampaignState.unlockedRegions.push('INTERNATIONAL_FLOW');
  if(internationalCampaignState.reputation>=620 && !internationalCampaignState.unlockedRegions.includes('US_MAJOR_HUB')) internationalCampaignState.unlockedRegions.push('US_MAJOR_HUB');
}
function evaluateMilestones(){
  const completed=internationalCampaignState.completedContracts.length;
  const regions=internationalCampaignState.unlockedRegions.length;
  const katlShifts=internationalCampaignState.history.filter(h=>h.airport==='KATL').length;
  const recent=internationalCampaignState.history.slice(0,5);
  const seasonSafety=recent.length?Math.round(recent.reduce((a,b)=>a+b.safety,0)/recent.length):100;
  const checks=[
    ['FIRST_CONTRACT',completed>=1],
    ['SAFE_SEASON',seasonSafety>=85 && recent.length>=3],
    ['GLOBAL_CONTROLLER',regions>=3],
    ['HUB_SPECIALIST',katlShifts>=5]
  ];
  for(const [id,ok] of checks){
    const ms=INTERNATIONAL_CAMPAIGN_CATALOG.milestones.find(m=>m.id===id);
    if(ok && ms && !internationalCampaignState.milestones.includes(id)){
      internationalCampaignState.milestones.push(id);
      internationalCampaignState.reputation+=ms.rewardRep;
    }
  }
}
function advanceSeasonIfNeeded(){
  const season=currentSeason();
  if(internationalCampaignState.week>season.weeks){
    const idx=INTERNATIONAL_CAMPAIGN_CATALOG.seasons.findIndex(s=>s.id===season.id);
    const next=INTERNATIONAL_CAMPAIGN_CATALOG.seasons[Math.min(idx+1,INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length-1)];
    internationalCampaignState.seasonId=next.id;
    internationalCampaignState.week=1;
  }
}
function selectNextContract(){
  const available=INTERNATIONAL_CAMPAIGN_CATALOG.contracts.filter(c=>{
    if(internationalCampaignState.completedContracts.includes(c.id)) return false;
    return internationalCampaignState.unlockedRegions.some(rid=>{
      const region=INTERNATIONAL_CAMPAIGN_CATALOG.regions.find(r=>r.id===rid);
      return region?.airports.includes(c.airport);
    });
  });
  internationalCampaignState.activeContractId=(available[0]||INTERNATIONAL_CAMPAIGN_CATALOG.contracts[0]).id;
  return currentContract();
}
function evaluateInternationalCampaign(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInternationalCampaign();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || currentContract().airport;
  const contract=contractForAirport(icao);
  internationalCampaignState.activeContractId=contract.id;
  const safety=campaignSafetyScore(finalScore,statsObj,fail);
  const passed=safety>=contract.minSafety && !fail;
  const progress=internationalCampaignState.contractProgress[contract.id]||{shifts:0,passed:0};
  progress.shifts+=1;
  if(passed) progress.passed+=1;
  internationalCampaignState.contractProgress[contract.id]=progress;
  let contractCompleted=false;
  if(progress.passed>=contract.durationShifts && !internationalCampaignState.completedContracts.includes(contract.id)){
    internationalCampaignState.completedContracts.push(contract.id);
    internationalCampaignState.reputation+=contract.rewardRep;
    internationalCampaignState.budget+=contract.rewardBudget;
    contractCompleted=true;
  }
  const repDelta=Math.max(0,Math.round(finalScore/500)) + (passed?8:-6);
  internationalCampaignState.reputation=Math.max(0,internationalCampaignState.reputation+repDelta);
  internationalCampaignState.budget+=Math.round((finalScore||0)*7) - ((statsObj.denied||0)*1200) - ((statsObj.conflicts||0)*8000);
  internationalCampaignState.week+=1;
  unlockRegions();
  evaluateMilestones();
  advanceSeasonIfNeeded();
  if(contractCompleted) selectNextContract();
  internationalCampaignState.campaignScore=Math.max(0,Math.round(internationalCampaignState.reputation*10 + internationalCampaignState.budget/1000 + internationalCampaignState.completedContracts.length*500));
  internationalCampaignState.status=internationalCampaignState.reputation>=900?'GLOBAL_SUPERVISOR':internationalCampaignState.reputation>=520?'INTERNATIONAL_CONTROLLER':internationalCampaignState.reputation>=280?'REGIONAL_CONTROLLER':internationalCampaignState.reputation>=120?'LICENSED_CONTROLLER':'LOCAL_TRAINEE';
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,contractId:contract.id,seasonId:internationalCampaignState.seasonId,week:internationalCampaignState.week,finalScore:Math.round(finalScore||0),safety,passed,contractCompleted,reputation:internationalCampaignState.reputation,budget:internationalCampaignState.budget,status:internationalCampaignState.status,risk:campaignRisk()};
  internationalCampaignState.history.unshift(evaluation);
  internationalCampaignState.history=internationalCampaignState.history.slice(0,80);
  internationalCampaignState.lastEvaluation=evaluation;
  saveInternationalCampaign();
  renderInternationalCampaignBoard();
  return {state:internationalCampaignState,evaluation,nextContract:currentContract(),season:currentSeason()};
}
function internationalCampaignProgress(){
  loadInternationalCampaign();
  const contract=currentContract();
  const progress=internationalCampaignState.contractProgress[contract.id]||{shifts:0,passed:0};
  return {season:currentSeason(),week:internationalCampaignState.week,contract,progress,reputation:internationalCampaignState.reputation,budget:internationalCampaignState.budget,status:internationalCampaignState.status,regions:internationalCampaignState.unlockedRegions.length,milestones:internationalCampaignState.milestones.length,risk:campaignRisk()};
}
function renderInternationalCampaignBoard(){
  try{
    const anchor=document.querySelector('#trainingCoachInline') || document.querySelector('#trainingAcademyInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#internationalCampaignInline'); if(old) old.remove();
    const p=internationalCampaignProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="internationalCampaignInline" class="airport-ops-board international-campaign-inline">
      <div class="airport-ops-head"><b>INTL CAMPAIGN</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>TEMPORADA</small><b>${p.season.id}</b></div>
        <div><small>SEMANA</small><b>${p.week}</b></div>
        <div><small>CONTRATO</small><b>${p.progress.passed}/${p.contract.durationShifts}</b></div>
        <div><small>REP</small><b>${p.reputation}</b></div>
        <div><small>REGIÕES</small><b>${p.regions}</b></div>
        <div><small>RISCO</small><b>${p.risk.band.id}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'intl-campaign-board'); }
}
function initializeInternationalCampaign(){
  loadInternationalCampaign();
  renderInternationalCampaignBoard();
  return internationalCampaignState;
}
function internationalCampaignStatus(){ loadInternationalCampaign(); return {...internationalCampaignState,progress:internationalCampaignProgress(),catalog:INTERNATIONAL_CAMPAIGN_CATALOG}; }
function internationalCampaignSelfCheck(){
  const issues=[];
  if(INTERNATIONAL_CAMPAIGN_CATALOG.regions.length<4) issues.push('regiões insuficientes');
  if(INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length<4) issues.push('temporadas insuficientes');
  if(INTERNATIONAL_CAMPAIGN_CATALOG.contracts.length<5) issues.push('contratos insuficientes');
  const res=evaluateInternationalCampaign(2200,{conflicts:0,runwayIncursions:0,denied:0},false,'SBSP');
  if(!res.evaluation.passed) issues.push('contrato saudável não passou');
  if(!internationalCampaignProgress().contract.id) issues.push('sem contrato ativo');
  return {ok:issues.length===0,issues,regions:INTERNATIONAL_CAMPAIGN_CATALOG.regions.length,seasons:INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length,contracts:INTERNATIONAL_CAMPAIGN_CATALOG.contracts.length};
}
window.SKYWARD_INTERNATIONAL_CAMPAIGN=Object.freeze({
  schema:1,
  catalog:INTERNATIONAL_CAMPAIGN_CATALOG,
  load:loadInternationalCampaign,
  save:saveInternationalCampaign,
  init:initializeInternationalCampaign,
  evaluate:evaluateInternationalCampaign,
  progress:internationalCampaignProgress,
  status:internationalCampaignStatus,
  board:renderInternationalCampaignBoard,
  selfCheck:internationalCampaignSelfCheck
});
