/* @skyward-module 53-non-aeronautical-revenue-center
 * Non-aeronautical revenue and commercial experience center with retail, duty free, food & beverage, parking, lounges, advertising, hotel, concessions and digital commerce.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('53-non-aeronautical-revenue-center');
const NON_AERO_REVENUE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f50',
  commercialChannels:[
    {id:'DUTY_FREE',name:'Duty free',weight:14,target:82},
    {id:'FOOD_BEVERAGE',name:'Alimentação/F&B',weight:14,target:80},
    {id:'RETAIL',name:'Varejo terminal',weight:12,target:78},
    {id:'PARKING',name:'Estacionamento',weight:12,target:80},
    {id:'LOUNGES',name:'Lounges premium',weight:11,target:78},
    {id:'ADVERTISING',name:'Publicidade/mídia',weight:10,target:76},
    {id:'HOTEL_LANDSIDE',name:'Hotel/landside',weight:9,target:76},
    {id:'CONCESSIONS',name:'Concessões',weight:10,target:80},
    {id:'DIGITAL_COMMERCE',name:'Comércio digital/app',weight:8,target:76}
  ],
  commercialIncidents:[
    {id:'DUTY_FREE_STOCKOUT',name:'Ruptura duty free',channel:'DUTY_FREE',severity:22},
    {id:'FOOD_QUEUE_SPIKE',name:'Fila alimentação',channel:'FOOD_BEVERAGE',severity:20},
    {id:'RETAIL_CLOSURE',name:'Loja fechada',channel:'RETAIL',severity:18},
    {id:'PARKING_FULL',name:'Estacionamento lotado',channel:'PARKING',severity:24},
    {id:'LOUNGE_OVERBOOKED',name:'Lounge superlotado',channel:'LOUNGES',severity:20},
    {id:'AD_SCREEN_DOWN',name:'Tela publicidade fora',channel:'ADVERTISING',severity:14},
    {id:'HOTEL_OCCUPANCY_DROP',name:'Queda hotel landside',channel:'HOTEL_LANDSIDE',severity:16},
    {id:'CONCESSION_DISPUTE',name:'Conflito concessionária',channel:'CONCESSIONS',severity:26},
    {id:'APP_CHECKOUT_FAIL',name:'Falha checkout digital',channel:'DIGITAL_COMMERCE',severity:18}
  ],
  revenuePrograms:[
    {id:'DUTY_FREE_BUNDLE',name:'Bundles duty free',cost:14000,benefit:{DUTY_FREE:12,DIGITAL_COMMERCE:2}},
    {id:'FNB_QUEUE_OPTIMIZER',name:'Otimização fila F&B',cost:10000,benefit:{FOOD_BEVERAGE:12}},
    {id:'RETAIL_MIX_REFRESH',name:'Refresh mix varejo',cost:16000,benefit:{RETAIL:12}},
    {id:'PARKING_DYNAMIC_PRICING',name:'Preço dinâmico parking',cost:12000,benefit:{PARKING:12}},
    {id:'LOUNGE_UPSELL',name:'Upsell lounges',cost:11000,benefit:{LOUNGES:11,DIGITAL_COMMERCE:2}},
    {id:'MEDIA_PACKAGES',name:'Pacotes mídia premium',cost:13000,benefit:{ADVERTISING:13}},
    {id:'HOTEL_STOP_OVER',name:'Stop-over hotel',cost:15000,benefit:{HOTEL_LANDSIDE:12}},
    {id:'CONCESSION_REBALANCE',name:'Rebalancear concessões',cost:17000,benefit:{CONCESSIONS:12}},
    {id:'PWA_PREORDER',name:'Pré-compra via PWA',cost:9000,benefit:{DIGITAL_COMMERCE:13,DUTY_FREE:2}}
  ],
  spendSegments:[
    {id:'BUSINESS',name:'Executivo',spend:48,sensitivity:14},
    {id:'LEISURE',name:'Lazer',spend:32,sensitivity:18},
    {id:'CONNECTING',name:'Conexão',spend:26,sensitivity:20},
    {id:'INTERNATIONAL',name:'Internacional',spend:54,sensitivity:16},
    {id:'FAMILY',name:'Família',spend:36,sensitivity:22},
    {id:'PREMIUM',name:'Premium',spend:70,sensitivity:12}
  ],
  commercialBands:[
    {id:'COMMERCIAL_EXCELLENCE',min:90,name:'Excelência comercial'},
    {id:'STRONG_YIELD',min:75,name:'Yield forte'},
    {id:'MISSED_SPEND',min:55,name:'Gasto perdido'},
    {id:'COMMERCIAL_CRISIS',min:0,name:'Crise comercial'}
  ],
  commercialKPIs:[
    {id:'NON_AERO_REVENUE',name:'Receita não aeronáutica'},
    {id:'SPEND_PER_PAX',name:'Gasto por passageiro'},
    {id:'CONVERSION_RATE',name:'Conversão comercial'},
    {id:'PARKING_YIELD',name:'Yield estacionamento'},
    {id:'LOUNGE_UPSELL',name:'Upsell lounge'},
    {id:'CONCESSION_HEALTH',name:'Saúde das concessões'}
  ]
});
const NON_AERO_REVENUE_KEY='skywardNonAeroRevenue_v1';
let nonAeroState={schema:1,channelScores:{DUTY_FREE:80,FOOD_BEVERAGE:78,RETAIL:76,PARKING:80,LOUNGES:76,ADVERTISING:75,HOTEL_LANDSIDE:74,CONCESSIONS:78,DIGITAL_COMMERCE:76},programs:[],incidents:[],commercialScore:78,nonAeroRevenue:0,spendPerPax:34,conversionRate:18,parkingYield:76,loungeUpsell:22,concessionHealth:78,status:'STRONG_YIELD',history:[],lastEvaluation:null};
function loadNonAeroRevenue(){try{const raw=localStorage?.getItem?.(NON_AERO_REVENUE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)nonAeroState={...nonAeroState,...parsed};}}catch(e){safeLogError?.(e,'non-aero-revenue-load');}return nonAeroState;}
function saveNonAeroRevenue(){try{localStorage?.setItem?.(NON_AERO_REVENUE_KEY,JSON.stringify(nonAeroState));}catch(e){safeLogError?.(e,'non-aero-revenue-save');}return nonAeroState;}
function commercialBand(score){return NON_AERO_REVENUE_CATALOG.commercialBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||NON_AERO_REVENUE_CATALOG.commercialBands.at(-1);}
function programById(id){return NON_AERO_REVENUE_CATALOG.revenuePrograms.find(p=>p.id===id)||NON_AERO_REVENUE_CATALOG.revenuePrograms[0];}
function incidentById(id){return NON_AERO_REVENUE_CATALOG.commercialIncidents.find(i=>i.id===id)||NON_AERO_REVENUE_CATALOG.commercialIncidents[0];}
function runCommercialProgram(id='DUTY_FREE_BUNDLE'){
  loadNonAeroRevenue();
  const program=programById(id);
  if(nonAeroState.programs.some(p=>p.programId===program.id)) return nonAeroState.programs.find(p=>p.programId===program.id);
  const item={id:`NAR-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  nonAeroState.programs.unshift(item);
  for(const [ch,gain] of Object.entries(program.benefit||{})){
    nonAeroState.channelScores[ch]=Math.min(100,Number(nonAeroState.channelScores[ch]||75)+Number(gain||0));
  }
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return item;
}
function raiseCommercialIncident(id='FOOD_QUEUE_SPIKE'){
  loadNonAeroRevenue();
  const tpl=incidentById(id);
  const item={id:`NAC-${String(Date.now()).slice(-6)}`,incidentId:tpl.id,name:tpl.name,channel:tpl.channel,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  nonAeroState.incidents.unshift(item);
  nonAeroState.incidents=nonAeroState.incidents.slice(0,80);
  nonAeroState.channelScores[tpl.channel]=Math.max(0,Number(nonAeroState.channelScores[tpl.channel]||75)-Math.round(tpl.severity/4));
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return item;
}
function closeCommercialIncident(id,ok=true){
  loadNonAeroRevenue();
  const incident=nonAeroState.incidents.find(x=>x.id===id);
  if(incident){incident.status=ok?'CLEARED':'ESCALATED';incident.closedAt=new Date().toISOString();if(ok)nonAeroState.channelScores[incident.channel]=Math.min(100,Number(nonAeroState.channelScores[incident.channel]||75)+2);}
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return incident||null;
}
function calculateCommercialMetrics(finalScore=0,statsObj={},fail=false){
  const terminal=window.SKYWARD_TERMINAL_FLOW?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const digital=window.SKYWARD_DIGITAL_TWIN?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const open=nonAeroState.incidents.filter(i=>i.status==='OPEN');
  const scores={...nonAeroState.channelScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0);
  const paxLoad=Math.max(1,(landed+departed)*88+denied*45);
  const terminalScore=Number(terminal.progress?.score||78);
  const queueMin=Number(terminal.progress?.avgQueueMin||14);
  const density=Number(terminal.progress?.densityIndex||42);
  const passengerScore=Number(passenger.progress?.score||78);
  const revenueScore=Number(revenue.progress?.score||78);
  const twinScore=Number(digital.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const penalty=(ch)=>open.filter(i=>i.channel===ch).reduce((a,i)=>a+Number(i.severity||0),0)/3;
  scores.DUTY_FREE=Math.max(0,Math.min(100,Number(scores.DUTY_FREE||80)+passengerScore*.03+twinScore*.02-penalty('DUTY_FREE')));
  scores.FOOD_BEVERAGE=Math.max(0,Math.min(100,Number(scores.FOOD_BEVERAGE||78)+terminalScore*.03-Math.max(0,queueMin-14)*.6-penalty('FOOD_BEVERAGE')));
  scores.RETAIL=Math.max(0,Math.min(100,Number(scores.RETAIL||76)+passengerScore*.03-density*.03-penalty('RETAIL')));
  scores.PARKING=Math.max(0,Math.min(100,Number(scores.PARKING||80)+terminalScore*.02-denied*1.0-penalty('PARKING')));
  scores.LOUNGES=Math.max(0,Math.min(100,Number(scores.LOUNGES||76)+passengerScore*.03-density*.02-penalty('LOUNGES')));
  scores.ADVERTISING=Math.max(0,Math.min(100,Number(scores.ADVERTISING||75)+twinScore*.03+assetScore*.02-penalty('ADVERTISING')));
  scores.HOTEL_LANDSIDE=Math.max(0,Math.min(100,Number(scores.HOTEL_LANDSIDE||74)+terminalScore*.02+passengerScore*.02-penalty('HOTEL_LANDSIDE')));
  scores.CONCESSIONS=Math.max(0,Math.min(100,Number(scores.CONCESSIONS||78)+revenueScore*.03+securityScore*.02-penalty('CONCESSIONS')));
  scores.DIGITAL_COMMERCE=Math.max(0,Math.min(100,Number(scores.DIGITAL_COMMERCE||76)+twinScore*.04+passengerScore*.02-penalty('DIGITAL_COMMERCE')-(fail?4:0)));
  const weighted=Math.round(NON_AERO_REVENUE_CATALOG.commercialChannels.reduce((a,c)=>a+(scores[c.id]||0)*c.weight,0)/100);
  const openSeverity=open.reduce((a,i)=>a+Number(i.severity||0),0);
  const conversionRate=Math.max(2,Math.min(60,Math.round(weighted*.32+Math.max(0,100-density)*.06-Math.max(0,queueMin-16)*.3-open.length)));
  const spendPerPax=Math.max(6,Math.round(18+weighted*.22+scores.DUTY_FREE*.08+scores.LOUNGES*.06+scores.DIGITAL_COMMERCE*.05-Math.max(0,queueMin-18)*.4));
  const nonAeroRevenue=Math.max(0,Math.round(nonAeroState.nonAeroRevenue + paxLoad*spendPerPax*(conversionRate/100) + scores.PARKING*180 + scores.ADVERTISING*120 - openSeverity*250));
  const parkingYield=Math.max(0,Math.min(100,Math.round(scores.PARKING-denied*.8-penalty('PARKING'))));
  const loungeUpsell=Math.max(0,Math.min(100,Math.round(scores.LOUNGES*.42+scores.DIGITAL_COMMERCE*.18-density*.08)));
  const concessionHealth=Math.max(0,Math.min(100,Math.round(scores.CONCESSIONS*.55+weighted*.25+revenueScore*.20-open.length*2)));
  return {scores,weighted,conversionRate,spendPerPax,nonAeroRevenue,parkingYield,loungeUpsell,concessionHealth,openIncidents:open.length,drivers:{landed,departed,denied,paxLoad,terminalScore,queueMin,density,passengerScore,revenueScore,twinScore,assetScore,securityScore}};
}
function evaluateNonAeroRevenue(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadNonAeroRevenue();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !nonAeroState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='PARKING_FULL')) raiseCommercialIncident('PARKING_FULL');
  if((statsObj.landed||0)+(statsObj.departed||0)>=5 && !nonAeroState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='FOOD_QUEUE_SPIKE')) raiseCommercialIncident('FOOD_QUEUE_SPIKE');
  const metrics=calculateCommercialMetrics(finalScore,statsObj,fail);
  nonAeroState.channelScores=metrics.scores;
  nonAeroState.conversionRate=metrics.conversionRate;
  nonAeroState.spendPerPax=metrics.spendPerPax;
  nonAeroState.nonAeroRevenue=metrics.nonAeroRevenue;
  nonAeroState.parkingYield=metrics.parkingYield;
  nonAeroState.loungeUpsell=metrics.loungeUpsell;
  nonAeroState.concessionHealth=metrics.concessionHealth;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.50+metrics.conversionRate*.18+Math.min(100,metrics.spendPerPax*2)*.12+metrics.parkingYield*.07+metrics.loungeUpsell*.05+metrics.concessionHealth*.08-(fail?5:0))));
  nonAeroState.commercialScore=score;
  nonAeroState.status=commercialBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,commercialScore:score,status:nonAeroState.status,programs:nonAeroState.programs.length};
  nonAeroState.history.unshift(evaluation);
  nonAeroState.history=nonAeroState.history.slice(0,100);
  nonAeroState.lastEvaluation=evaluation;
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return {state:nonAeroState,evaluation};
}
function nonAeroRevenueProgress(){
  loadNonAeroRevenue();
  return {score:nonAeroState.commercialScore,status:nonAeroState.status,nonAeroRevenue:nonAeroState.nonAeroRevenue,spendPerPax:nonAeroState.spendPerPax,conversionRate:nonAeroState.conversionRate,parkingYield:nonAeroState.parkingYield,loungeUpsell:nonAeroState.loungeUpsell,concessionHealth:nonAeroState.concessionHealth,openIncidents:nonAeroState.incidents.filter(i=>i.status==='OPEN').length,last:nonAeroState.lastEvaluation||null};
}
function renderNonAeroRevenueBoard(){
  try{
    const anchor=document.querySelector('#terminalFlowInline') || document.querySelector('#cargoLogisticsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#nonAeroRevenueInline'); if(old) old.remove();
    const p=nonAeroRevenueProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="nonAeroRevenueInline" class="airport-ops-board non-aero-revenue-inline">
      <div class="airport-ops-head"><b>NON-AERO REV</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REV</small><b>${Math.round(p.nonAeroRevenue/1000)}k</b></div>
        <div><small>SPEND</small><b>${p.spendPerPax}</b></div>
        <div><small>CONV.</small><b>${p.conversionRate}%</b></div>
        <div><small>PARK</small><b>${p.parkingYield}</b></div>
        <div><small>LOUNGE</small><b>${p.loungeUpsell}</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'non-aero-revenue-board'); }
}
function initializeNonAeroRevenue(){loadNonAeroRevenue();renderNonAeroRevenueBoard();return nonAeroState;}
function nonAeroRevenueStatus(){loadNonAeroRevenue();return {...nonAeroState,progress:nonAeroRevenueProgress(),catalog:NON_AERO_REVENUE_CATALOG};}
function nonAeroRevenueSelfCheck(){
  const issues=[];
  if(NON_AERO_REVENUE_CATALOG.commercialChannels.length<9) issues.push('canais insuficientes');
  if(NON_AERO_REVENUE_CATALOG.revenuePrograms.length<9) issues.push('programas insuficientes');
  const program=runCommercialProgram('DUTY_FREE_BUNDLE');
  const incident=raiseCommercialIncident('FOOD_QUEUE_SPIKE');
  const res=evaluateNonAeroRevenue(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.commercialScore)) issues.push('score comercial inválido');
  return {ok:issues.length===0,issues,channels:NON_AERO_REVENUE_CATALOG.commercialChannels.length,programs:NON_AERO_REVENUE_CATALOG.revenuePrograms.length};
}
window.SKYWARD_NON_AERO_REVENUE=Object.freeze({
  schema:1,
  catalog:NON_AERO_REVENUE_CATALOG,
  load:loadNonAeroRevenue,
  save:saveNonAeroRevenue,
  program:runCommercialProgram,
  incident:raiseCommercialIncident,
  close:closeCommercialIncident,
  evaluate:evaluateNonAeroRevenue,
  progress:nonAeroRevenueProgress,
  status:nonAeroRevenueStatus,
  board:renderNonAeroRevenueBoard,
  init:initializeNonAeroRevenue,
  selfCheck:nonAeroRevenueSelfCheck
});
