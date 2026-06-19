/* @skyward-module 23-network-flow-coordination
 * International network flow, slots, connection banks, alternates and inter-airport coordination.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('23-network-flow-coordination');
const NETWORK_FLOW_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f20',
  hubs:{
    SBGR:{name:'São Paulo Guarulhos',region:'BR-SE',capacityPerHour:48,internationalWeight:.72,bankWindows:['06:00-08:30','14:00-16:00','21:00-23:30']},
    SBSP:{name:'São Paulo Congonhas',region:'BR-SE',capacityPerHour:36,internationalWeight:.08,bankWindows:['07:00-09:30','17:00-20:00']},
    SBKP:{name:'Campinas Viracopos',region:'BR-SE',capacityPerHour:34,internationalWeight:.35,bankWindows:['05:30-07:30','22:00-23:59']},
    SBBR:{name:'Brasília',region:'BR-CO',capacityPerHour:42,internationalWeight:.28,bankWindows:['08:00-10:30','18:00-21:00']},
    KATL:{name:'Atlanta Hartsfield-Jackson',region:'US-SE',capacityPerHour:92,internationalWeight:.55,bankWindows:['06:00-09:00','12:00-14:30','18:00-22:00']}
  },
  routes:[
    {id:'SBGR-KATL',from:'SBGR',to:'KATL',type:'international_trunk',distanceNm:4050,slotPressure:.82,minTurnMin:105,alternatePool:['SBKP','SBBR']},
    {id:'KATL-SBGR',from:'KATL',to:'SBGR',type:'international_trunk',distanceNm:4050,slotPressure:.86,minTurnMin:110,alternatePool:['SBKP','SBBR']},
    {id:'SBGR-SBBR',from:'SBGR',to:'SBBR',type:'domestic_trunk',distanceNm:470,slotPressure:.64,minTurnMin:48,alternatePool:['SBKP','SBSP']},
    {id:'SBBR-SBGR',from:'SBBR',to:'SBGR',type:'domestic_trunk',distanceNm:470,slotPressure:.68,minTurnMin:50,alternatePool:['SBKP','SBSP']},
    {id:'SBSP-SBGR',from:'SBSP',to:'SBGR',type:'metro_reposition',distanceNm:18,slotPressure:.42,minTurnMin:30,alternatePool:['SBKP']},
    {id:'SBKP-SBGR',from:'SBKP',to:'SBGR',type:'cargo_feed',distanceNm:52,slotPressure:.5,minTurnMin:42,alternatePool:['SBBR','SBSP']}
  ],
  slotPolicies:[
    {id:'CTOT',name:'Calculated Take-Off Time',windowMin:10,penaltyPerMin:220,bonusOnTime:1800},
    {id:'EDCT',name:'Expected Departure Clearance Time',windowMin:12,penaltyPerMin:260,bonusOnTime:2200},
    {id:'GDP',name:'Ground Delay Program',windowMin:20,penaltyPerMin:140,bonusOnTime:900},
    {id:'MILES_IN_TRAIL',name:'Miles in Trail Restriction',windowMin:15,penaltyPerMin:170,bonusOnTime:1200}
  ],
  connectionBanks:[
    {id:'GRU_INTL_NIGHT',hub:'SBGR',name:'GRU International Night Bank',requiredOnTime:.84,minConnections:7,bonus:54000,missPenalty:42000},
    {id:'ATL_GLOBAL_EVENING',hub:'KATL',name:'ATL Global Evening Bank',requiredOnTime:.87,minConnections:10,bonus:76000,missPenalty:61000},
    {id:'BSB_DOMESTIC_WAVE',hub:'SBBR',name:'BSB Domestic Wave',requiredOnTime:.81,minConnections:6,bonus:36000,missPenalty:28000}
  ],
  alternateRules:[
    {id:'LOW_VIS_ALTERNATE',trigger:'LIFR',minRvrMeters:1400,diversionCost:26000},
    {id:'RUNWAY_CLOSURE_ALTERNATE',trigger:'RUNWAY_CLOSED',minClosureMin:12,diversionCost:32000},
    {id:'NETWORK_SATURATION_ALTERNATE',trigger:'NETWORK_DELAY',maxDelayMin:28,diversionCost:18000}
  ]
});
const NETWORK_FLOW_KEY='skywardNetworkFlow_v1';
let networkFlowState = {schema:1,regulated:false,networkDelayMin:0,slotCompliance:1,connectionsProtected:0,connectionsMissed:0,alternates:0,coordinationScore:100,balanceImpact:0,history:[],lastShift:null};
function netClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function routeForAirport(icao, index=0){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const routes=NETWORK_FLOW_CATALOG.routes.filter(r=>r.from===code || r.to===code);
  return routes[Math.abs(Math.floor(index||0)) % Math.max(1,routes.length)] || NETWORK_FLOW_CATALOG.routes[0];
}
function slotPolicyFor(route){
  if(!route) return NETWORK_FLOW_CATALOG.slotPolicies[0];
  if(route.type==='international_trunk') return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='EDCT');
  if(route.slotPressure>.7) return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='CTOT');
  if(route.type==='metro_reposition') return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='MILES_IN_TRAIL');
  return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='GDP');
}
function estimateNetworkDelay(statsObj={}, route=routeForAirport()){
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const incident=window.SKYWARD_INCIDENTS?.state?.();
  let delay=Math.round((route?.slotPressure||.5)*12);
  delay+=Math.max(0,(statsObj.requests||0)-8)*1.4;
  delay+=(statsObj.denied||0)*2.2+(statsObj.conflicts||0)*4+(statsObj.runwayIncursions||0)*7+(statsObj.surfaceConflicts||0)*3;
  if(wx?.flightRules==='IFR') delay+=4;
  if(wx?.flightRules==='LIFR') delay+=10;
  if(incident?.runwayClosed) delay+=12;
  return Math.round(netClamp(delay,0,120));
}
function computeSlotCompliance(delayMin=0, policy=NETWORK_FLOW_CATALOG.slotPolicies[0]){
  const windowMin=policy?.windowMin||10;
  if(delayMin<=windowMin) return 1;
  return Number(netClamp(1-((delayMin-windowMin)/(windowMin*3.5)),0,1).toFixed(2));
}
function evaluateConnectionBanks(icao, statsObj={}, onTimeRatio=1){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const movement=(statsObj.landed||0)+(statsObj.departed||0);
  return NETWORK_FLOW_CATALOG.connectionBanks.filter(b=>b.hub===code || movement>=b.minConnections).map(bank=>{
    const enough=movement>=bank.minConnections;
    const achieved=enough && onTimeRatio>=bank.requiredOnTime;
    return {id:bank.id,name:bank.name,hub:bank.hub,achieved,protected:achieved?bank.minConnections:Math.max(0,Math.min(movement,bank.minConnections-1)),missed:achieved?0:Math.max(0,bank.minConnections-movement),bonus:achieved?bank.bonus:0,penalty:(!achieved&&enough)?bank.missPenalty:Math.round(bank.missPenalty*.45)};
  });
}
function evaluateAlternates(icao, statsObj={}, delayMin=0){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const route=routeForAirport(code, statsObj.requests||0);
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const incident=window.SKYWARD_INCIDENTS?.state?.();
  const alternates=[];
  const low=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='LOW_VIS_ALTERNATE');
  if(wx?.flightRules==='LIFR' || (wx?.rvrMeters||9999)<(low?.minRvrMeters||1400)) alternates.push({rule:low.id,airport:route.alternatePool?.[0]||'SBKP',cost:low.diversionCost,reason:'Baixa visibilidade'});
  const closure=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='RUNWAY_CLOSURE_ALTERNATE');
  if(incident?.runwayClosed) alternates.push({rule:closure.id,airport:route.alternatePool?.[1]||route.alternatePool?.[0]||'SBBR',cost:closure.diversionCost,reason:'Pista fechada'});
  const saturation=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='NETWORK_SATURATION_ALTERNATE');
  if(delayMin>(saturation?.maxDelayMin||28)) alternates.push({rule:saturation.id,airport:route.alternatePool?.[0]||'SBKP',cost:saturation.diversionCost,reason:'Saturação de rede'});
  return alternates.slice(0,3);
}
function loadNetworkFlow(){
  try{ const raw=localStorage?.getItem?.(NETWORK_FLOW_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) networkFlowState={...networkFlowState,...parsed}; } }catch(e){ safeLogError?.(e,'network-load'); }
  return networkFlowState;
}
function saveNetworkFlow(){
  try{ localStorage?.setItem?.(NETWORK_FLOW_KEY,JSON.stringify(networkFlowState)); }catch(e){ safeLogError?.(e,'network-save'); }
  return networkFlowState;
}
function evaluateNetworkFlow(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadNetworkFlow();
  const code=String(airportCode||airport?.()?.icao||'SBGR').toUpperCase();
  const route=routeForAirport(code,(statsObj.requests||0)+(statsObj.departed||0));
  const policy=slotPolicyFor(route);
  const delayMin=estimateNetworkDelay(statsObj,route);
  const slotCompliance=computeSlotCompliance(delayMin,policy);
  const onTimeRatio=slotCompliance;
  const banks=evaluateConnectionBanks(code,statsObj,onTimeRatio);
  const alternates=evaluateAlternates(code,statsObj,delayMin);
  const bonus=banks.reduce((a,b)=>a+b.bonus,0)+(slotCompliance>=.9?(policy?.bonusOnTime||0):0);
  const penalties=banks.reduce((a,b)=>a+b.penalty,0)+Math.max(0,delayMin-(policy?.windowMin||10))*(policy?.penaltyPerMin||150)+alternates.reduce((a,b)=>a+b.cost,0)+(fail?28000:0);
  const coordinationScore=Math.round(netClamp(100-delayMin*1.45-(statsObj.denied||0)*2-(statsObj.conflicts||0)*7-(statsObj.runwayIncursions||0)*10+slotCompliance*18,0,100));
  const impact=Math.round(bonus-penalties);
  networkFlowState.regulated=delayMin>(policy?.windowMin||10);
  networkFlowState.networkDelayMin=delayMin;
  networkFlowState.slotCompliance=slotCompliance;
  networkFlowState.connectionsProtected=(networkFlowState.connectionsProtected||0)+banks.reduce((a,b)=>a+b.protected,0);
  networkFlowState.connectionsMissed=(networkFlowState.connectionsMissed||0)+banks.reduce((a,b)=>a+b.missed,0);
  networkFlowState.alternates=(networkFlowState.alternates||0)+alternates.length;
  networkFlowState.coordinationScore=Math.round(((networkFlowState.coordinationScore||coordinationScore)*(networkFlowState.history?.length||0)+coordinationScore)/((networkFlowState.history?.length||0)+1));
  networkFlowState.balanceImpact=Math.round((networkFlowState.balanceImpact||0)+impact);
  networkFlowState.lastShift={build:BUILD,airport:code,route:route.id,policy:policy.id,delayMin,slotCompliance,coordinationScore,impact,banks,alternates,regulated:networkFlowState.regulated};
  networkFlowState.history.unshift(networkFlowState.lastShift);
  networkFlowState.history=networkFlowState.history.slice(0,30);
  saveNetworkFlow();
  renderNetworkFlowBoard();
  return {network:networkFlowState,shift:networkFlowState.lastShift};
}
function networkCommandRisk(cmd, plane){
  const st=networkFlowState;
  if(st.regulated && ['clearTakeoff','takeoff','lineup'].includes(cmd) && st.slotCompliance<.45) return {level:'danger',block:true,msg:`Slot ${Math.round(st.slotCompliance*100)}%: decolagem bloqueada por fluxo de rede.`};
  if(st.regulated && ['clearTakeoff','takeoff','lineup'].includes(cmd)) return {level:'warn',block:false,msg:`Fluxo regulado: respeitar slot ${Math.round(st.slotCompliance*100)}%.`};
  if((st.alternates||0)>0 && cmd==='clearLanding') return {level:'warn',block:false,msg:'Alternados ativos na rede: priorize combustível e conexões.'};
  return {level:'ok',block:false,msg:''};
}
function networkEconomicImpact(){ return {impact:networkFlowState.balanceImpact||0,delayMin:networkFlowState.networkDelayMin||0,alternates:networkFlowState.alternates||0,connectionsMissed:networkFlowState.connectionsMissed||0}; }
function networkStatus(){ loadNetworkFlow(); return networkFlowState; }
function resetNetworkFlow(){ networkFlowState={schema:1,regulated:false,networkDelayMin:0,slotCompliance:1,connectionsProtected:0,connectionsMissed:0,alternates:0,coordinationScore:100,balanceImpact:0,history:[],lastShift:null}; saveNetworkFlow(); renderNetworkFlowBoard(); return networkFlowState; }
function renderNetworkFlowBoard(){
  try{
    const anchor=document.querySelector('#incidentOpsInline') || document.querySelector('#economyOpsInline') || document.querySelector('#careerOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#networkOpsInline'); if(old) old.remove();
    const s=networkStatus(); const last=s.lastShift||{};
    anchor.insertAdjacentHTML('afterend',`<div id="networkOpsInline" class="airport-ops-board network-ops-inline">
      <div class="airport-ops-head"><b>NETWORK FLOW</b><span>${s.regulated?'REGULADO':'NORMAL'}</span></div>
      <div class="airport-ops-grid">
        <div><small>ROTA</small><b>${last.route||'---'}</b></div>
        <div><small>SLOT</small><b>${Math.round((s.slotCompliance||1)*100)}%</b></div>
        <div><small>ATRASO REDE</small><b>${Math.round(s.networkDelayMin||0)} MIN</b></div>
        <div><small>CONEXÕES</small><b>${s.connectionsProtected||0}/${(s.connectionsProtected||0)+(s.connectionsMissed||0)}</b></div>
        <div><small>ALTERNADOS</small><b>${s.alternates||0}</b></div>
        <div><small>COORD.</small><b>${Math.round(s.coordinationScore||100)}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'network-board'); }
}
function networkSelfCheck(){
  const issues=[];
  if(Object.keys(NETWORK_FLOW_CATALOG.hubs).length<5) issues.push('hubs insuficientes');
  if(NETWORK_FLOW_CATALOG.routes.length<6) issues.push('rotas insuficientes');
  if(NETWORK_FLOW_CATALOG.slotPolicies.length<4) issues.push('políticas de slot insuficientes');
  const route=routeForAirport('SBGR',0);
  const policy=slotPolicyFor(route);
  if(!route.id.includes('SBGR')) issues.push('rota SBGR inválida');
  if(!policy?.id) issues.push('política de slot inválida');
  if(!(computeSlotCompliance(0,policy)>computeSlotCompliance(60,policy))) issues.push('compliance não cai com atraso');
  const banks=evaluateConnectionBanks('SBGR',{landed:8,departed:8,requests:18},.95);
  if(!banks.some(b=>b.achieved)) issues.push('banco bom não protege conexão');
  return {ok:issues.length===0,issues,hubs:Object.keys(NETWORK_FLOW_CATALOG.hubs).length,routes:NETWORK_FLOW_CATALOG.routes.length};
}
window.SKYWARD_NETWORK_FLOW=Object.freeze({
  schema:1,
  catalog:NETWORK_FLOW_CATALOG,
  load:loadNetworkFlow,
  save:saveNetworkFlow,
  reset:resetNetworkFlow,
  status:networkStatus,
  evaluate:evaluateNetworkFlow,
  delay:estimateNetworkDelay,
  compliance:computeSlotCompliance,
  route:routeForAirport,
  policy:slotPolicyFor,
  banks:evaluateConnectionBanks,
  alternates:evaluateAlternates,
  risk:networkCommandRisk,
  economy:networkEconomicImpact,
  render:renderNetworkFlowBoard,
  selfCheck:networkSelfCheck
});
