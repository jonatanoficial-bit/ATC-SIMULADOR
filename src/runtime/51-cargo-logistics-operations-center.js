/* @skyward-module 51-cargo-logistics-operations-center
 * Cargo and logistics operations center with ULD, dangerous goods, perishables, customs, cold chain, cargo SLA, freight revenue and logistics risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('51-cargo-logistics-operations-center');
const CARGO_LOGISTICS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f48',
  cargoProcesses:[
    {id:'ULD_BUILDUP',name:'Montagem ULD',weight:13,target:82},
    {id:'CARGO_ACCEPTANCE',name:'Aceitação de carga',weight:12,target:80},
    {id:'CUSTOMS_CLEARANCE',name:'Alfândega/despacho',weight:14,target:78},
    {id:'DANGEROUS_GOODS',name:'Cargas perigosas/DG',weight:13,target:84},
    {id:'PERISHABLE_COLD',name:'Perecíveis/cadeia fria',weight:12,target:80},
    {id:'CARGO_SECURITY',name:'Segurança carga',weight:12,target:84},
    {id:'RAMP_TRANSFER',name:'Transferência rampa',weight:12,target:82},
    {id:'FREIGHT_YIELD',name:'Yield freight',weight:12,target:78}
  ],
  shipmentTypes:[
    {id:'GENERAL_CARGO',name:'Carga geral',value:18,risk:8},
    {id:'EXPRESS',name:'Express/e-commerce',value:28,risk:14},
    {id:'PHARMA_COLD',name:'Farmacêutica fria',value:44,risk:24},
    {id:'PERISHABLES',name:'Perecíveis',value:32,risk:20},
    {id:'DANGEROUS_GOODS',name:'Cargas perigosas',value:38,risk:30},
    {id:'LIVE_ANIMALS',name:'Animais vivos',value:30,risk:26},
    {id:'HIGH_VALUE',name:'Alto valor',value:52,risk:28}
  ],
  logisticsDisruptions:[
    {id:'ULD_SHORTAGE',name:'Falta de ULD',process:'ULD_BUILDUP',severity:22},
    {id:'CUSTOMS_HOLD',name:'Retenção alfandegária',process:'CUSTOMS_CLEARANCE',severity:26},
    {id:'DG_DOC_ERROR',name:'Erro documentação DG',process:'DANGEROUS_GOODS',severity:30},
    {id:'COLD_CHAIN_BREAK',name:'Quebra cadeia fria',process:'PERISHABLE_COLD',severity:32},
    {id:'XRAY_BACKLOG',name:'Fila raio-X carga',process:'CARGO_SECURITY',severity:20},
    {id:'LOADER_DOWN',name:'Loader indisponível',process:'RAMP_TRANSFER',severity:24},
    {id:'FREIGHT_MISROUTE',name:'Carga roteada errado',process:'FREIGHT_YIELD',severity:18}
  ],
  cargoPrograms:[
    {id:'ULD_POOL',name:'Pool ULD inteligente',cost:16000,benefit:{ULD_BUILDUP:12,RAMP_TRANSFER:3}},
    {id:'CUSTOMS_FASTLANE',name:'Fast lane alfândega',cost:22000,benefit:{CUSTOMS_CLEARANCE:13}},
    {id:'DG_RECERT',name:'Recertificação DG',cost:14000,benefit:{DANGEROUS_GOODS:12,CARGO_SECURITY:2}},
    {id:'COLD_CHAIN_AUDIT',name:'Auditoria cadeia fria',cost:18000,benefit:{PERISHABLE_COLD:13}},
    {id:'CARGO_SECURITY_SWEEP',name:'Varredura segurança carga',cost:12000,benefit:{CARGO_SECURITY:11}},
    {id:'RAMP_LOADER_PM',name:'Preventiva loaders',cost:15000,benefit:{RAMP_TRANSFER:12}},
    {id:'FREIGHT_YIELD_ENGINE',name:'Motor yield freight',cost:20000,benefit:{FREIGHT_YIELD:13}}
  ],
  cargoBands:[
    {id:'CARGO_EXCELLENCE',min:90,name:'Excelência cargueira'},
    {id:'FREIGHT_READY',min:75,name:'Freight pronto'},
    {id:'LOGISTICS_DELAY',min:55,name:'Logística atrasada'},
    {id:'CARGO_CRISIS',min:0,name:'Crise cargueira'}
  ],
  cargoKPIs:[
    {id:'CARGO_SLA',name:'SLA carga'},
    {id:'ULD_AVAILABILITY',name:'Disponibilidade ULD'},
    {id:'CUSTOMS_TIME',name:'Tempo alfândega'},
    {id:'COLD_CHAIN_INTEGRITY',name:'Integridade cadeia fria'},
    {id:'DG_COMPLIANCE',name:'Compliance DG'},
    {id:'FREIGHT_REVENUE',name:'Receita freight'}
  ]
});
const CARGO_LOGISTICS_KEY='skywardCargoLogistics_v1';
let cargoLogisticsState={schema:1,processScores:{ULD_BUILDUP:78,CARGO_ACCEPTANCE:80,CUSTOMS_CLEARANCE:76,DANGEROUS_GOODS:82,PERISHABLE_COLD:78,CARGO_SECURITY:80,RAMP_TRANSFER:79,FREIGHT_YIELD:77},programs:[],disruptions:[],shipments:[],cargoScore:78,cargoSla:78,freightRevenue:0,customsDelayMin:0,coldChainIntegrity:82,dgCompliance:84,status:'FREIGHT_READY',history:[],lastEvaluation:null};
function loadCargoLogistics(){try{const raw=localStorage?.getItem?.(CARGO_LOGISTICS_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)cargoLogisticsState={...cargoLogisticsState,...parsed};}}catch(e){safeLogError?.(e,'cargo-logistics-load');}return cargoLogisticsState;}
function saveCargoLogistics(){try{localStorage?.setItem?.(CARGO_LOGISTICS_KEY,JSON.stringify(cargoLogisticsState));}catch(e){safeLogError?.(e,'cargo-logistics-save');}return cargoLogisticsState;}
function cargoBand(score){return CARGO_LOGISTICS_CATALOG.cargoBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||CARGO_LOGISTICS_CATALOG.cargoBands.at(-1);}
function programById(id){return CARGO_LOGISTICS_CATALOG.cargoPrograms.find(p=>p.id===id)||CARGO_LOGISTICS_CATALOG.cargoPrograms[0];}
function disruptionById(id){return CARGO_LOGISTICS_CATALOG.logisticsDisruptions.find(d=>d.id===id)||CARGO_LOGISTICS_CATALOG.logisticsDisruptions[0];}
function shipmentById(id){return CARGO_LOGISTICS_CATALOG.shipmentTypes.find(s=>s.id===id)||CARGO_LOGISTICS_CATALOG.shipmentTypes[0];}
function runCargoProgram(id='ULD_POOL'){
  loadCargoLogistics();
  const program=programById(id);
  if(cargoLogisticsState.programs.some(p=>p.programId===program.id)) return cargoLogisticsState.programs.find(p=>p.programId===program.id);
  const item={id:`CGP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  cargoLogisticsState.programs.unshift(item);
  for(const [proc,gain] of Object.entries(program.benefit||{})){
    cargoLogisticsState.processScores[proc]=Math.min(100,Number(cargoLogisticsState.processScores[proc]||75)+Number(gain||0));
  }
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function acceptCargoShipment(id='GENERAL_CARGO'){
  loadCargoLogistics();
  const s=shipmentById(id);
  const item={id:`SHP-${String(Date.now()).slice(-6)}`,shipmentId:s.id,name:s.name,value:s.value,risk:s.risk,status:'ACCEPTED',at:new Date().toISOString()};
  cargoLogisticsState.shipments.unshift(item);
  cargoLogisticsState.shipments=cargoLogisticsState.shipments.slice(0,100);
  cargoLogisticsState.freightRevenue+=Math.round(s.value*1200);
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function raiseCargoDisruption(id='ULD_SHORTAGE'){
  loadCargoLogistics();
  const tpl=disruptionById(id);
  const item={id:`CGD-${String(Date.now()).slice(-6)}`,disruptionId:tpl.id,name:tpl.name,process:tpl.process,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  cargoLogisticsState.disruptions.unshift(item);
  cargoLogisticsState.disruptions=cargoLogisticsState.disruptions.slice(0,80);
  cargoLogisticsState.processScores[tpl.process]=Math.max(0,Number(cargoLogisticsState.processScores[tpl.process]||75)-Math.round(tpl.severity/4));
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function closeCargoDisruption(id,ok=true){
  loadCargoLogistics();
  const d=cargoLogisticsState.disruptions.find(x=>x.id===id);
  if(d){d.status=ok?'CLEARED':'ESCALATED';d.closedAt=new Date().toISOString();if(ok)cargoLogisticsState.processScores[d.process]=Math.min(100,Number(cargoLogisticsState.processScores[d.process]||75)+2);}
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return d||null;
}
function calculateCargoMetrics(finalScore=0,statsObj={},fail=false){
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const ground=window.SKYWARD_GROUND_TURNAROUND?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const open=cargoLogisticsState.disruptions.filter(d=>d.status==='OPEN');
  const scores={...cargoLogisticsState.processScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0);
  const revenueScore=Number(revenue.progress?.score||78);
  const groundScore=Number(ground.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const networkScore=Number(network.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const delayPenalty=(proc)=>open.filter(d=>d.process===proc).reduce((a,d)=>a+Number(d.severity||0),0)/3;
  scores.ULD_BUILDUP=Math.max(0,Math.min(100,Number(scores.ULD_BUILDUP||78)+groundScore*.04-delayPenalty('ULD_BUILDUP')));
  scores.CARGO_ACCEPTANCE=Math.max(0,Math.min(100,Number(scores.CARGO_ACCEPTANCE||80)+workforceScore*.04-denied*1.2));
  scores.CUSTOMS_CLEARANCE=Math.max(0,Math.min(100,Number(scores.CUSTOMS_CLEARANCE||76)-delayPenalty('CUSTOMS_CLEARANCE')+networkScore*.03));
  scores.DANGEROUS_GOODS=Math.max(0,Math.min(100,Number(scores.DANGEROUS_GOODS||82)-delayPenalty('DANGEROUS_GOODS')+securityScore*.04-conflicts*1.4));
  scores.PERISHABLE_COLD=Math.max(0,Math.min(100,Number(scores.PERISHABLE_COLD||78)-delayPenalty('PERISHABLE_COLD')+assetScore*.04));
  scores.CARGO_SECURITY=Math.max(0,Math.min(100,Number(scores.CARGO_SECURITY||80)-delayPenalty('CARGO_SECURITY')+securityScore*.05));
  scores.RAMP_TRANSFER=Math.max(0,Math.min(100,Number(scores.RAMP_TRANSFER||79)-delayPenalty('RAMP_TRANSFER')+groundScore*.04));
  scores.FREIGHT_YIELD=Math.max(0,Math.min(100,Number(scores.FREIGHT_YIELD||77)-delayPenalty('FREIGHT_YIELD')+revenueScore*.05));
  const weighted=Math.round(CARGO_LOGISTICS_CATALOG.cargoProcesses.reduce((a,p)=>a+(scores[p.id]||0)*p.weight,0)/100);
  const openSeverity=open.reduce((a,d)=>a+Number(d.severity||0),0);
  const cargoMoves=Math.max(1,landed+departed);
  const cargoSla=Math.max(0,Math.min(100,Math.round(weighted-openSeverity/6-denied*1.5+(finalScore>2400?2:0))));
  const customsDelayMin=Math.max(0,Math.round(open.filter(d=>d.process==='CUSTOMS_CLEARANCE').reduce((a,d)=>a+d.severity,0)/2+Math.max(0,70-scores.CUSTOMS_CLEARANCE)/2));
  const coldChainIntegrity=Math.max(0,Math.min(100,Math.round(scores.PERISHABLE_COLD-open.filter(d=>d.process==='PERISHABLE_COLD').length*8)));
  const dgCompliance=Math.max(0,Math.min(100,Math.round(scores.DANGEROUS_GOODS-open.filter(d=>d.process==='DANGEROUS_GOODS').length*9)));
  const freightRevenue=Math.max(0,Math.round(cargoLogisticsState.freightRevenue + cargoMoves*5200 + scores.FREIGHT_YIELD*600 - openSeverity*300));
  return {scores,weighted,cargoSla,customsDelayMin,coldChainIntegrity,dgCompliance,freightRevenue,openDisruptions:open.length,drivers:{landed,departed,denied,conflicts,revenueScore,groundScore,assetScore,securityScore,networkScore,workforceScore}};
}
function evaluateCargoLogistics(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCargoLogistics();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !cargoLogisticsState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='CUSTOMS_HOLD')) raiseCargoDisruption('CUSTOMS_HOLD');
  if((statsObj.conflicts||0)>=2 && !cargoLogisticsState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='DG_DOC_ERROR')) raiseCargoDisruption('DG_DOC_ERROR');
  const metrics=calculateCargoMetrics(finalScore,statsObj,fail);
  cargoLogisticsState.processScores=metrics.scores;
  cargoLogisticsState.cargoSla=metrics.cargoSla;
  cargoLogisticsState.customsDelayMin=metrics.customsDelayMin;
  cargoLogisticsState.coldChainIntegrity=metrics.coldChainIntegrity;
  cargoLogisticsState.dgCompliance=metrics.dgCompliance;
  cargoLogisticsState.freightRevenue=metrics.freightRevenue;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.52+metrics.cargoSla*.24+metrics.coldChainIntegrity*.08+metrics.dgCompliance*.08+Math.max(0,100-metrics.customsDelayMin*2)*.08-(fail?5:0))));
  cargoLogisticsState.cargoScore=score;
  cargoLogisticsState.status=cargoBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,cargoScore:score,status:cargoLogisticsState.status,programs:cargoLogisticsState.programs.length,shipments:cargoLogisticsState.shipments.length};
  cargoLogisticsState.history.unshift(evaluation);
  cargoLogisticsState.history=cargoLogisticsState.history.slice(0,100);
  cargoLogisticsState.lastEvaluation=evaluation;
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return {state:cargoLogisticsState,evaluation};
}
function cargoLogisticsProgress(){
  loadCargoLogistics();
  return {score:cargoLogisticsState.cargoScore,status:cargoLogisticsState.status,cargoSla:cargoLogisticsState.cargoSla,freightRevenue:cargoLogisticsState.freightRevenue,customsDelayMin:cargoLogisticsState.customsDelayMin,coldChainIntegrity:cargoLogisticsState.coldChainIntegrity,dgCompliance:cargoLogisticsState.dgCompliance,openDisruptions:cargoLogisticsState.disruptions.filter(d=>d.status==='OPEN').length,shipments:cargoLogisticsState.shipments.length,last:cargoLogisticsState.lastEvaluation||null};
}
function renderCargoLogisticsBoard(){
  try{
    const anchor=document.querySelector('#groundTurnaroundInline') || document.querySelector('#radioPhraseologyInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#cargoLogisticsInline'); if(old) old.remove();
    const p=cargoLogisticsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="cargoLogisticsInline" class="airport-ops-board cargo-logistics-inline">
      <div class="airport-ops-head"><b>CARGO OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.cargoSla}%</b></div>
        <div><small>RECEITA</small><b>${Math.round(p.freightRevenue/1000)}k</b></div>
        <div><small>ALF.</small><b>${p.customsDelayMin}m</b></div>
        <div><small>FRIO</small><b>${p.coldChainIntegrity}%</b></div>
        <div><small>DG</small><b>${p.dgCompliance}%</b></div>
        <div><small>RISCO</small><b>${p.openDisruptions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'cargo-logistics-board'); }
}
function initializeCargoLogistics(){loadCargoLogistics();renderCargoLogisticsBoard();return cargoLogisticsState;}
function cargoLogisticsStatus(){loadCargoLogistics();return {...cargoLogisticsState,progress:cargoLogisticsProgress(),catalog:CARGO_LOGISTICS_CATALOG};}
function cargoLogisticsSelfCheck(){
  const issues=[];
  if(CARGO_LOGISTICS_CATALOG.cargoProcesses.length<8) issues.push('processos insuficientes');
  if(CARGO_LOGISTICS_CATALOG.logisticsDisruptions.length<7) issues.push('disrupções insuficientes');
  const program=runCargoProgram('ULD_POOL');
  const shipment=acceptCargoShipment('PHARMA_COLD');
  const disruption=raiseCargoDisruption('COLD_CHAIN_BREAK');
  const res=evaluateCargoLogistics(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !shipment.id || !disruption.id) issues.push('programa/carga/disrupção inválido');
  if(!Number.isFinite(res.evaluation.cargoScore)) issues.push('score cargo inválido');
  return {ok:issues.length===0,issues,processes:CARGO_LOGISTICS_CATALOG.cargoProcesses.length,disruptions:CARGO_LOGISTICS_CATALOG.logisticsDisruptions.length};
}
window.SKYWARD_CARGO_LOGISTICS=Object.freeze({
  schema:1,
  catalog:CARGO_LOGISTICS_CATALOG,
  load:loadCargoLogistics,
  save:saveCargoLogistics,
  program:runCargoProgram,
  shipment:acceptCargoShipment,
  disruption:raiseCargoDisruption,
  close:closeCargoDisruption,
  evaluate:evaluateCargoLogistics,
  progress:cargoLogisticsProgress,
  status:cargoLogisticsStatus,
  board:renderCargoLogisticsBoard,
  init:initializeCargoLogistics,
  selfCheck:cargoLogisticsSelfCheck
});
