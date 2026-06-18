/* @skyward-module 21-operational-economy
 * Airport operational economy: budget, delay cost, fines, efficiency and airline contracts.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('21-operational-economy');
const SKYWARD_ECONOMY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f18',
  baseCurrency:'USD',
  airportBudgets:{
    SBGR:{annualBudgetM:220,shiftBudget:185000,delayCostPerMin:95,fuelServiceRevenue:48,movementRevenue:620},
    SBSP:{annualBudgetM:130,shiftBudget:105000,delayCostPerMin:120,fuelServiceRevenue:35,movementRevenue:520},
    SBKP:{annualBudgetM:150,shiftBudget:125000,delayCostPerMin:85,fuelServiceRevenue:55,movementRevenue:590},
    SBBR:{annualBudgetM:145,shiftBudget:118000,delayCostPerMin:90,fuelServiceRevenue:42,movementRevenue:560},
    KATL:{annualBudgetM:520,shiftBudget:420000,delayCostPerMin:140,fuelServiceRevenue:70,movementRevenue:780}
  },
  airlineContracts:[
    {id:'AZUL_REGIONAL',name:'Azul Regional Flow',airline:'AZU',onTimeTarget:.82,safetyTarget:.90,bonus:42000,penalty:28000,priority:'regional connectivity'},
    {id:'GOL_DOMESTIC',name:'GOL Domestic Bank',airline:'GLO',onTimeTarget:.80,safetyTarget:.88,bonus:38000,penalty:26000,priority:'domestic peak banks'},
    {id:'LATAM_TRUNK',name:'LATAM Trunk Routes',airline:'TAM',onTimeTarget:.84,safetyTarget:.92,bonus:52000,penalty:36000,priority:'high capacity trunk'},
    {id:'DELTA_INTL',name:'Delta International Hub',airline:'DAL',onTimeTarget:.86,safetyTarget:.93,bonus:68000,penalty:46000,priority:'international bank'},
    {id:'CARGO_NIGHT',name:'Night Cargo SLA',airline:'CGO',onTimeTarget:.78,safetyTarget:.91,bonus:45000,penalty:30000,priority:'cargo punctuality'}
  ],
  fineTable:{conflict:18000,runwayIncursion:55000,surfaceConflict:22000,deniedClearance:3500,hardLandingInspection:12000,missedEmergency:75000},
  efficiencyWeights:{landed:1.25,departed:1.05,requestsHandled:.35,commands:-.04,denied:-.45,conflicts:-2.0,surfaceConflicts:-1.2,runwayIncursions:-4.0},
  bands:[
    {id:'LOSS',name:'Prejuízo operacional',min:-99999999},
    {id:'TIGHT',name:'Margem apertada',min:0},
    {id:'STABLE',name:'Operação estável',min:35000},
    {id:'PROFITABLE',name:'Operação lucrativa',min:95000},
    {id:'EXCELLENT',name:'Eficiência excelente',min:180000}
  ]
});
const ECONOMY_KEY='skywardEconomy_v1';
let airportEconomy = {schema:1,balance:0,totalRevenue:0,totalCosts:0,totalFines:0,contractsWon:0,contractsLost:0,efficiency:0,history:[],lastShift:null};
function econClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function airportBudgetFor(icao){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  return SKYWARD_ECONOMY_CATALOG.airportBudgets[code] || SKYWARD_ECONOMY_CATALOG.airportBudgets.SBGR;
}
function economyBand(value){
  return SKYWARD_ECONOMY_CATALOG.bands.slice().sort((a,b)=>a.min-b.min).filter(b=>value>=b.min).pop() || SKYWARD_ECONOMY_CATALOG.bands[0];
}
function estimateDelayMinutes(shiftStats={}){
  const requests=Math.max(1,shiftStats.requests||0);
  const denied=shiftStats.denied||0;
  const conflicts=shiftStats.conflicts||0;
  const surface=shiftStats.surfaceConflicts||0;
  const incursions=shiftStats.runwayIncursions||0;
  const weatherPenalty=(window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='LIFR') ? 6 : (window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='IFR' ? 3 : 0);
  return Math.round(denied*2.5 + conflicts*7 + surface*4 + incursions*12 + Math.max(0,requests-8)*0.8 + weatherPenalty);
}
function computeEfficiency(shiftStats={}){
  const w=SKYWARD_ECONOMY_CATALOG.efficiencyWeights;
  let raw=50;
  raw+=(shiftStats.landed||0)*w.landed*5;
  raw+=(shiftStats.departed||0)*w.departed*5;
  raw+=(shiftStats.requests||0)*w.requestsHandled*3;
  raw+=(shiftStats.commands||0)*w.commands;
  raw+=(shiftStats.denied||0)*w.denied*5;
  raw+=(shiftStats.conflicts||0)*w.conflicts*8;
  raw+=(shiftStats.surfaceConflicts||0)*w.surfaceConflicts*7;
  raw+=(shiftStats.runwayIncursions||0)*w.runwayIncursions*9;
  if((shiftStats.maydayResolved||0)>0) raw+=8*(shiftStats.maydayResolved||0);
  return Math.round(econClamp(raw,0,100));
}
function contractPrefixValue(stats={}){
  const prefixes=['AZU','GLO','TAM','DAL','CGO'];
  const total=(stats.landed||0)+(stats.departed||0)+(stats.requests||0);
  return Math.max(1,total || prefixes.length);
}
function evaluateContracts(shiftStats={}, safetyScore=100, onTimeRatio=1){
  const handled=contractPrefixValue(shiftStats);
  return SKYWARD_ECONOMY_CATALOG.airlineContracts.map((c,i)=>{
    const eligible=(handled+i)%2===0 || handled>12;
    const safetyOk=(safetyScore/100)>=c.safetyTarget;
    const onTimeOk=onTimeRatio>=c.onTimeTarget;
    const achieved=eligible && safetyOk && onTimeOk;
    return {id:c.id,name:c.name,airline:c.airline,achieved,bonus:achieved?c.bonus:0,penalty:(!achieved&&eligible)?c.penalty:0,eligible,safetyOk,onTimeOk};
  });
}
function loadEconomy(){
  try{ const raw=localStorage?.getItem?.(ECONOMY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airportEconomy={...airportEconomy,...parsed}; } }catch(e){ safeLogError?.(e,'economy-load'); }
  return airportEconomy;
}
function saveEconomy(){
  try{ localStorage?.setItem?.(ECONOMY_KEY,JSON.stringify(airportEconomy)); }catch(e){ safeLogError?.(e,'economy-save'); }
  return airportEconomy;
}
function evaluateOperationalEconomy(finalScore=0, shiftStats={}, fail=false, airportCode=''){
  loadEconomy();
  const code=String(airportCode||airport?.()?.icao||'SBGR').toUpperCase();
  const budget=airportBudgetFor(code);
  const movements=(shiftStats.landed||0)+(shiftStats.departed||0);
  const delayMinutes=estimateDelayMinutes(shiftStats);
  const efficiency=computeEfficiency(shiftStats);
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,shiftStats,fail) ?? Math.max(0,100-(shiftStats.conflicts||0)*8-(shiftStats.denied||0)*2-(fail?25:0));
  const onTimeRatio=econClamp(1-(delayMinutes/Math.max(24,(shiftStats.requests||1)*7)),0,1);
  const movementRevenue=movements*budget.movementRevenue;
  const fuelRevenue=Math.round((shiftStats.lowFuel||0)*budget.fuelServiceRevenue*12 + movements*budget.fuelServiceRevenue);
  const serviceRevenue=Math.round(Math.max(0,finalScore)*4.5 + movementRevenue + fuelRevenue);
  const delayCost=delayMinutes*budget.delayCostPerMin;
  const fines=(shiftStats.conflicts||0)*SKYWARD_ECONOMY_CATALOG.fineTable.conflict+
    (shiftStats.runwayIncursions||0)*SKYWARD_ECONOMY_CATALOG.fineTable.runwayIncursion+
    (shiftStats.surfaceConflicts||0)*SKYWARD_ECONOMY_CATALOG.fineTable.surfaceConflict+
    (shiftStats.denied||0)*SKYWARD_ECONOMY_CATALOG.fineTable.deniedClearance+
    (shiftStats.damaged||0)*SKYWARD_ECONOMY_CATALOG.fineTable.hardLandingInspection+
    (fail?SKYWARD_ECONOMY_CATALOG.fineTable.missedEmergency:0);
  const contracts=evaluateContracts(shiftStats,safety,onTimeRatio);
  const contractBonus=contracts.reduce((a,c)=>a+c.bonus,0);
  const contractPenalty=contracts.reduce((a,c)=>a+c.penalty,0);
  const staffingCost=Math.round(budget.shiftBudget*.22 + Math.max(0,(shiftStats.commands||0)-35)*45);
  const weatherCost=(window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='LIFR') ? Math.round(budget.shiftBudget*.08) : 0;
  const revenue=serviceRevenue+contractBonus;
  const incidentCost=(typeof incidentEconomicImpact==='function' ? incidentEconomicImpact().cost : 0);
  const costs=staffingCost+delayCost+fines+contractPenalty+weatherCost+incidentCost;
  const profit=Math.round(revenue-costs);
  airportEconomy.balance=Math.round((airportEconomy.balance||0)+profit);
  airportEconomy.totalRevenue=Math.round((airportEconomy.totalRevenue||0)+revenue);
  airportEconomy.totalCosts=Math.round((airportEconomy.totalCosts||0)+costs);
  airportEconomy.totalFines=Math.round((airportEconomy.totalFines||0)+fines);
  airportEconomy.contractsWon=(airportEconomy.contractsWon||0)+contracts.filter(c=>c.achieved).length;
  airportEconomy.contractsLost=(airportEconomy.contractsLost||0)+contracts.filter(c=>c.eligible&&!c.achieved).length;
  airportEconomy.efficiency=Math.round(((airportEconomy.efficiency||efficiency)*(airportEconomy.history?.length||0)+efficiency)/((airportEconomy.history?.length||0)+1));
  airportEconomy.lastShift={build:BUILD,airport:code,profit,revenue,costs,fines,delayMinutes,efficiency,onTimeRatio:Number(onTimeRatio.toFixed(2)),safety,band:economyBand(profit).id,contracts};
  airportEconomy.history.unshift(airportEconomy.lastShift);
  airportEconomy.history=airportEconomy.history.slice(0,30);
  saveEconomy();
  renderEconomyBoard();
  return {economy:airportEconomy,shift:airportEconomy.lastShift};
}
function economyStatus(){ loadEconomy(); return {...airportEconomy,band:economyBand(airportEconomy.lastShift?.profit||airportEconomy.balance||0)}; }
function resetEconomy(){ airportEconomy={schema:1,balance:0,totalRevenue:0,totalCosts:0,totalFines:0,contractsWon:0,contractsLost:0,efficiency:0,history:[],lastShift:null}; saveEconomy(); renderEconomyBoard(); return airportEconomy; }
function renderEconomyBoard(){
  try{
    const anchor=document.querySelector('#careerOpsInline') || document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#economyOpsInline'); if(old) old.remove();
    const s=economyStatus();
    const last=s.lastShift||{};
    anchor.insertAdjacentHTML('afterend',`<div id="economyOpsInline" class="airport-ops-board economy-ops-inline">
      <div class="airport-ops-head"><b>ECONOMIA OPS</b><span>${s.band.name}</span></div>
      <div class="airport-ops-grid">
        <div><small>SALDO</small><b>$${Math.round(s.balance||0).toLocaleString('pt-BR')}</b></div>
        <div><small>ÚLTIMO</small><b>$${Math.round(last.profit||0).toLocaleString('pt-BR')}</b></div>
        <div><small>EFICIÊNCIA</small><b>${Math.round(s.efficiency||0)}%</b></div>
        <div><small>MULTAS</small><b>$${Math.round(s.totalFines||0).toLocaleString('pt-BR')}</b></div>
        <div><small>CONTRATOS</small><b>${s.contractsWon||0}/${(s.contractsWon||0)+(s.contractsLost||0)}</b></div>
        <div><small>ATRASO</small><b>${Math.round(last.delayMinutes||0)} MIN</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'economy-board'); }
}
function economySelfCheck(){
  const issues=[];
  if(Object.keys(SKYWARD_ECONOMY_CATALOG.airportBudgets).length<5) issues.push('orçamentos insuficientes');
  if(SKYWARD_ECONOMY_CATALOG.airlineContracts.length<5) issues.push('contratos insuficientes');
  const good=evaluateContracts({landed:8,departed:6,requests:14},96,.94).filter(c=>c.achieved).length;
  const bad=evaluateContracts({landed:1,departed:1,requests:3},50,.45).filter(c=>c.penalty>0).length;
  if(!(good>0)) issues.push('contratos bons não bonificam');
  if(!(bad>0)) issues.push('contratos ruins não penalizam');
  if(!(computeEfficiency({landed:8,departed:6,requests:14,conflicts:0,denied:0})>computeEfficiency({landed:2,departed:1,requests:5,conflicts:4,denied:6,runwayIncursions:1}))) issues.push('eficiência não diferencia turno bom/ruim');
  return {ok:issues.length===0,issues,budgets:Object.keys(SKYWARD_ECONOMY_CATALOG.airportBudgets).length,contracts:SKYWARD_ECONOMY_CATALOG.airlineContracts.length};
}
window.SKYWARD_ECONOMY=Object.freeze({
  schema:1,
  catalog:SKYWARD_ECONOMY_CATALOG,
  load:loadEconomy,
  save:saveEconomy,
  reset:resetEconomy,
  status:economyStatus,
  evaluate:evaluateOperationalEconomy,
  efficiency:computeEfficiency,
  delay:estimateDelayMinutes,
  contracts:evaluateContracts,
  budget:airportBudgetFor,
  band:economyBand,
  render:renderEconomyBoard,
  selfCheck:economySelfCheck
});
