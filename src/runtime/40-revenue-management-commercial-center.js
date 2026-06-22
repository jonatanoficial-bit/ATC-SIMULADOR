/* @skyward-module 40-revenue-management-commercial-center
 * Revenue management and commercial strategy center with airport fees, non-aero revenue, airline incentives, costs and margin.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('40-revenue-management-commercial-center');
const REVENUE_MANAGEMENT_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f37',
  revenueStreams:[
    {id:'LANDING_FEES',name:'Tarifas de pouso/decolagem',base:42000,elasticity:.18,risk:8},
    {id:'PASSENGER_FEES',name:'Tarifas de passageiros',base:36000,elasticity:.22,risk:10},
    {id:'RETAIL_DUTYFREE',name:'Varejo e duty free',base:28000,elasticity:.35,risk:12},
    {id:'PARKING_GROUND',name:'Estacionamento e solo',base:18000,elasticity:.20,risk:7},
    {id:'CARGO_HANDLING',name:'Carga e handling',base:26000,elasticity:.25,risk:9},
    {id:'PREMIUM_SERVICES',name:'Serviços premium',base:12000,elasticity:.32,risk:14}
  ],
  costCenters:[
    {id:'STAFFING',name:'Equipes e turnos',base:38000,driver:'traffic'},
    {id:'MAINTENANCE',name:'Manutenção operacional',base:26000,driver:'infrastructure'},
    {id:'ENERGY',name:'Energia e sistemas',base:18000,driver:'terminal'},
    {id:'CRISIS_COST',name:'Custos de crise',base:9000,driver:'crisis'},
    {id:'ENVIRONMENT',name:'Ambiental/ESG',base:7000,driver:'environment'}
  ],
  pricingLevers:[
    {id:'BALANCED',name:'Preço equilibrado',revenueBoost:1.00,satisfactionImpact:0,regulatoryRisk:0},
    {id:'GROWTH_INCENTIVE',name:'Incentivo de crescimento',revenueBoost:.92,satisfactionImpact:8,regulatoryRisk:-2},
    {id:'PREMIUM_YIELD',name:'Yield premium',revenueBoost:1.12,satisfactionImpact:-5,regulatoryRisk:4},
    {id:'CARGO_PUSH',name:'Push cargueiro',revenueBoost:1.08,satisfactionImpact:2,regulatoryRisk:2},
    {id:'ESG_DISCOUNT',name:'Desconto verde',revenueBoost:.96,satisfactionImpact:4,regulatoryRisk:-4}
  ],
  commercialDeals:[
    {id:'AIRLINE_REBATE',name:'Rebate por pontualidade',cost:14000,benefit:{airline:9,traffic:4}},
    {id:'RETAIL_CONTRACT',name:'Contrato varejo premium',cost:25000,benefit:{retail:14,passenger:4}},
    {id:'CARGO_INCENTIVE',name:'Incentivo cargueiro',cost:20000,benefit:{cargo:12,airline:3}},
    {id:'PARKING_DYNAMIC',name:'Estacionamento dinâmico',cost:9000,benefit:{parking:10}},
    {id:'GREEN_AIRLINE_DEAL',name:'Acordo companhia verde',cost:18000,benefit:{environment:8,airline:5}}
  ],
  financialBands:[
    {id:'PROFIT_LEADER',min:90,name:'Alta rentabilidade'},
    {id:'HEALTHY',min:75,name:'Saudável'},
    {id:'TIGHT',min:55,name:'Margem apertada'},
    {id:'LOSS_RISK',min:0,name:'Risco de prejuízo'}
  ],
  reportingKPIs:[
    {id:'EBITDA_MARGIN',name:'Margem EBITDA'},
    {id:'AERO_REVENUE',name:'Receita aeronáutica'},
    {id:'NON_AERO_REVENUE',name:'Receita não aeronáutica'},
    {id:'COST_PER_TURN',name:'Custo por turno'},
    {id:'AIRLINE_YIELD',name:'Yield companhias'},
    {id:'PASSENGER_SPEND',name:'Gasto por passageiro'}
  ]
});
const REVENUE_MANAGEMENT_KEY='skywardRevenueManagement_v1';
let revenueManagementState={schema:1,pricingLever:'BALANCED',cash:320000,activeDeals:[],history:[],revenueScore:76,margin:0,status:'HEALTHY',lastEvaluation:null};
function loadRevenueManagement(){
  try{ const raw=localStorage?.getItem?.(REVENUE_MANAGEMENT_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) revenueManagementState={...revenueManagementState,...parsed}; } }catch(e){ safeLogError?.(e,'revenue-management-load'); }
  return revenueManagementState;
}
function saveRevenueManagement(){
  try{ localStorage?.setItem?.(REVENUE_MANAGEMENT_KEY,JSON.stringify(revenueManagementState)); }catch(e){ safeLogError?.(e,'revenue-management-save'); }
  return revenueManagementState;
}
function financialBand(score){
  return REVENUE_MANAGEMENT_CATALOG.financialBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||REVENUE_MANAGEMENT_CATALOG.financialBands.at(-1);
}
function pricingLeverById(id){ return REVENUE_MANAGEMENT_CATALOG.pricingLevers.find(p=>p.id===id)||REVENUE_MANAGEMENT_CATALOG.pricingLevers[0]; }
function dealById(id){ return REVENUE_MANAGEMENT_CATALOG.commercialDeals.find(d=>d.id===id)||REVENUE_MANAGEMENT_CATALOG.commercialDeals[0]; }
function setPricingLever(id='BALANCED'){
  loadRevenueManagement();
  revenueManagementState.pricingLever=pricingLeverById(id).id;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return pricingLeverById(revenueManagementState.pricingLever);
}
function signCommercialDeal(id='RETAIL_CONTRACT'){
  loadRevenueManagement();
  const deal=dealById(id);
  if(revenueManagementState.activeDeals.some(d=>d.dealId===deal.id)) return revenueManagementState.activeDeals.find(d=>d.dealId===deal.id);
  const item={id:`DEA-${String(Date.now()).slice(-6)}`,dealId:deal.id,name:deal.name,cost:deal.cost,status:'ACTIVE',signedAt:new Date().toISOString()};
  revenueManagementState.activeDeals.unshift(item);
  revenueManagementState.cash-=deal.cost;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return item;
}
function dealBenefit(kind){
  let gain=0;
  for(const d of revenueManagementState.activeDeals){
    const tpl=dealById(d.dealId);
    gain+=Number(tpl.benefit?.[kind]||0);
  }
  return gain;
}
function collectCommercialDrivers(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const env=window.SKYWARD_ENVIRONMENT_SUSTAINABILITY?.status?.()||{};
  const campaign=window.SKYWARD_INTERNATIONAL_CAMPAIGN?.status?.()||{};
  return {
    finalScore:Number(finalScore||0),
    landed:Number(statsObj.landed||0),
    departed:Number(statsObj.departed||0),
    denied:Number(statsObj.denied||0),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    fail:Boolean(fail),
    airlineScore:Number(airline.progress?.score||78),
    terminalScore:Number(airportAuth.progress?.score||78),
    infraScore:Number(infra.progress?.score||72),
    infraRisk:Number(infra.progress?.risk||0),
    crisisScore:Number(crisis.progress?.score||100),
    esgScore:Number(env.progress?.score||78),
    campaignReputation:Number(campaign.reputation||campaign.progress?.reputation||0)
  };
}
function calculateRevenue(finalScore=0,statsObj={},fail=false){
  const drivers=collectCommercialDrivers(finalScore,statsObj,fail);
  const lever=pricingLeverById(revenueManagementState.pricingLever);
  const movements=Math.max(1,drivers.landed+drivers.departed+2);
  const trafficFactor=Math.min(1.45,Math.max(.55, movements/5 + finalScore/5000));
  const satisfactionFactor=Math.max(.55,Math.min(1.2,(drivers.airlineScore+drivers.terminalScore+drivers.esgScore)/255));
  const riskPenalty=Math.max(.65,1-(drivers.conflicts*.035+drivers.runwayIncursions*.08+drivers.denied*.025+(fail?.10:0)));
  const reputationBoost=Math.min(.12,drivers.campaignReputation/8000);
  const revenueByStream={};
  for(const s of REVENUE_MANAGEMENT_CATALOG.revenueStreams){
    let value=s.base*trafficFactor*satisfactionFactor*riskPenalty*lever.revenueBoost*(1+reputationBoost);
    if(s.id==='RETAIL_DUTYFREE') value+=dealBenefit('retail')*900+dealBenefit('passenger')*600;
    if(s.id==='CARGO_HANDLING') value+=dealBenefit('cargo')*1100;
    if(s.id==='PARKING_GROUND') value+=dealBenefit('parking')*800;
    if(s.id==='LANDING_FEES') value+=dealBenefit('airline')*500;
    if(s.id==='PREMIUM_SERVICES') value+=dealBenefit('traffic')*700;
    revenueByStream[s.id]=Math.max(0,Math.round(value));
  }
  const aeroRevenue=(revenueByStream.LANDING_FEES||0)+(revenueByStream.PASSENGER_FEES||0)+(revenueByStream.CARGO_HANDLING||0);
  const nonAeroRevenue=(revenueByStream.RETAIL_DUTYFREE||0)+(revenueByStream.PARKING_GROUND||0)+(revenueByStream.PREMIUM_SERVICES||0);
  const costs={};
  for(const c of REVENUE_MANAGEMENT_CATALOG.costCenters){
    let value=c.base;
    if(c.driver==='traffic') value*=1+trafficFactor*.18;
    if(c.driver==='infrastructure') value*=1+drivers.infraRisk/110;
    if(c.driver==='terminal') value*=1+Math.max(0,75-drivers.terminalScore)/160;
    if(c.driver==='crisis') value*=1+Math.max(0,100-drivers.crisisScore)/90;
    if(c.driver==='environment') value*=1+Math.max(0,75-drivers.esgScore)/120;
    value+=drivers.denied*900+drivers.conflicts*3000+drivers.runwayIncursions*7000;
    costs[c.id]=Math.round(value);
  }
  const totalRevenue=Object.values(revenueByStream).reduce((a,b)=>a+b,0);
  const totalCosts=Object.values(costs).reduce((a,b)=>a+b,0)+revenueManagementState.activeDeals.reduce((a,d)=>a+Math.round((dealById(d.dealId).cost||0)/8),0);
  const ebitda=totalRevenue-totalCosts;
  const margin=totalRevenue>0?Math.round((ebitda/totalRevenue)*100):0;
  return {drivers,lever:lever.id,revenueByStream,costs,aeroRevenue,nonAeroRevenue,totalRevenue,totalCosts,ebitda,margin};
}
function evaluateRevenueManagement(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadRevenueManagement();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const report=calculateRevenue(finalScore,statsObj,fail);
  revenueManagementState.cash+=report.ebitda;
  revenueManagementState.margin=report.margin;
  const marginScore=Math.max(0,Math.min(100,50+report.margin));
  const diversityScore=report.totalRevenue?Math.round(Math.min(100,(report.nonAeroRevenue/report.totalRevenue)*200)):50;
  const stabilityPenalty=(report.drivers.conflicts*5)+(report.drivers.runwayIncursions*10)+(fail?12:0);
  const score=Math.max(0,Math.min(100,Math.round(marginScore*.58+diversityScore*.22+Math.min(100,report.drivers.airlineScore)*.12+Math.min(100,report.drivers.esgScore)*.08-stabilityPenalty)));
  revenueManagementState.revenueScore=score;
  revenueManagementState.status=financialBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...report,cash:revenueManagementState.cash,revenueScore:score,status:revenueManagementState.status,activeDeals:revenueManagementState.activeDeals.length};
  revenueManagementState.history.unshift(evaluation);
  revenueManagementState.history=revenueManagementState.history.slice(0,80);
  revenueManagementState.lastEvaluation=evaluation;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return {state:revenueManagementState,evaluation};
}
function revenueManagementProgress(){
  loadRevenueManagement();
  return {score:revenueManagementState.revenueScore,status:revenueManagementState.status,cash:revenueManagementState.cash,margin:revenueManagementState.margin,pricingLever:revenueManagementState.pricingLever,activeDeals:revenueManagementState.activeDeals.length,last:revenueManagementState.lastEvaluation||null};
}
function renderRevenueManagementBoard(){
  try{
    const anchor=document.querySelector('#environmentSustainabilityInline') || document.querySelector('#infrastructureExpansionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#revenueManagementInline'); if(old) old.remove();
    const p=revenueManagementProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="revenueManagementInline" class="airport-ops-board revenue-management-inline">
      <div class="airport-ops-head"><b>REV MGMT</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}%</b></div>
        <div><small>MARGEM</small><b>${p.margin}%</b></div>
        <div><small>CAIXA</small><b>${Math.round(p.cash/1000)}k</b></div>
        <div><small>PREÇO</small><b>${p.pricingLever}</b></div>
        <div><small>DEALS</small><b>${p.activeDeals}</b></div>
        <div><small>EBITDA</small><b>${Math.round((p.last?.ebitda||0)/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'revenue-management-board'); }
}
function initializeRevenueManagement(){
  loadRevenueManagement();
  renderRevenueManagementBoard();
  return revenueManagementState;
}
function revenueManagementStatus(){ loadRevenueManagement(); return {...revenueManagementState,progress:revenueManagementProgress(),catalog:REVENUE_MANAGEMENT_CATALOG}; }
function revenueManagementSelfCheck(){
  const issues=[];
  if(REVENUE_MANAGEMENT_CATALOG.revenueStreams.length<6) issues.push('receitas insuficientes');
  if(REVENUE_MANAGEMENT_CATALOG.costCenters.length<5) issues.push('custos insuficientes');
  const lever=setPricingLever('PREMIUM_YIELD');
  const deal=signCommercialDeal('RETAIL_CONTRACT');
  const res=evaluateRevenueManagement(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!lever.id || !deal.id) issues.push('alavanca/deal inválido');
  if(!Number.isFinite(res.evaluation.totalRevenue) || !Number.isFinite(res.evaluation.ebitda)) issues.push('relatório financeiro inválido');
  return {ok:issues.length===0,issues,streams:REVENUE_MANAGEMENT_CATALOG.revenueStreams.length,costs:REVENUE_MANAGEMENT_CATALOG.costCenters.length};
}
window.SKYWARD_REVENUE_MANAGEMENT=Object.freeze({
  schema:1,
  catalog:REVENUE_MANAGEMENT_CATALOG,
  load:loadRevenueManagement,
  save:saveRevenueManagement,
  init:initializeRevenueManagement,
  price:setPricingLever,
  deal:signCommercialDeal,
  evaluate:evaluateRevenueManagement,
  progress:revenueManagementProgress,
  status:revenueManagementStatus,
  board:renderRevenueManagementBoard,
  selfCheck:revenueManagementSelfCheck
});
