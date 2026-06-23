/* @skyward-module 50-ground-handling-turnaround-center
 * Ground handling and turnaround control center with gate, boarding, baggage, fueling, catering, cleaning, pushback, ramp safety, deicing, SLA and delay.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('50-ground-handling-turnaround-center');
const GROUND_TURNAROUND_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f47',
  turnaroundProcesses:[
    {id:'GATE_ASSIGNMENT',name:'Gate/stand assignment',weight:12,target:82},
    {id:'BOARDING',name:'Embarque/desembarque',weight:13,target:80},
    {id:'BAGGAGE',name:'Bagagem e sorter',weight:13,target:78},
    {id:'FUELING',name:'Abastecimento',weight:14,target:82},
    {id:'CATERING_CLEANING',name:'Catering/limpeza',weight:10,target:78},
    {id:'PUSHBACK',name:'Pushback e trator',weight:14,target:82},
    {id:'RAMP_SAFETY',name:'Segurança de rampa',weight:14,target:84},
    {id:'DEICING_WEATHER',name:'Clima/deicing',weight:10,target:76}
  ],
  groundAssets:[
    {id:'GATE_CREWS',name:'Equipes de gate',process:'GATE_ASSIGNMENT',capacity:24,readiness:78},
    {id:'BOARDING_AGENTS',name:'Agentes de embarque',process:'BOARDING',capacity:26,readiness:80},
    {id:'BAGGAGE_TUGS',name:'Tratores bagagem',process:'BAGGAGE',capacity:20,readiness:76},
    {id:'FUEL_TRUCKS',name:'Caminhões combustível',process:'FUELING',capacity:18,readiness:82},
    {id:'CATERING_TRUCKS',name:'Catering/limpeza',process:'CATERING_CLEANING',capacity:18,readiness:76},
    {id:'PUSHBACK_TUGS',name:'Tratores pushback',process:'PUSHBACK',capacity:16,readiness:78},
    {id:'RAMP_MARSHALS',name:'Sinaleiros/rampa',process:'RAMP_SAFETY',capacity:22,readiness:80},
    {id:'DEICING_RIGS',name:'Equipamentos deicing',process:'DEICING_WEATHER',capacity:10,readiness:70}
  ],
  delayCauses:[
    {id:'GATE_CONFLICT',name:'Conflito de gate',process:'GATE_ASSIGNMENT',severity:22},
    {id:'BAGGAGE_BACKLOG',name:'Backlog bagagem',process:'BAGGAGE',severity:20},
    {id:'FUEL_QUEUE',name:'Fila de abastecimento',process:'FUELING',severity:24},
    {id:'CLEANING_LATE',name:'Limpeza atrasada',process:'CATERING_CLEANING',severity:14},
    {id:'PUSHBACK_SHORTAGE',name:'Falta de pushback',process:'PUSHBACK',severity:26},
    {id:'RAMP_INCIDENT',name:'Incidente de rampa',process:'RAMP_SAFETY',severity:30},
    {id:'DEICING_HOLD',name:'Espera deicing/clima',process:'DEICING_WEATHER',severity:18}
  ],
  improvementPrograms:[
    {id:'GATE_OPTIMIZER',name:'Otimizador de gates',cost:18000,benefit:{GATE_ASSIGNMENT:11,BOARDING:3}},
    {id:'BAGGAGE_EXPEDITE',name:'Expedição bagagem',cost:14000,benefit:{BAGGAGE:12}},
    {id:'FUEL_SLOT_SYNC',name:'Sincronização combustível',cost:15000,benefit:{FUELING:11,PUSHBACK:2}},
    {id:'CLEANING_SWARM',name:'Equipe limpeza rápida',cost:9000,benefit:{CATERING_CLEANING:10}},
    {id:'PUSHBACK_POOL',name:'Pool pushback',cost:16000,benefit:{PUSHBACK:12}},
    {id:'RAMP_SAFETY_BRIEF',name:'Briefing rampa segura',cost:7000,benefit:{RAMP_SAFETY:10}},
    {id:'DEICING_READY',name:'Prontidão deicing',cost:12000,benefit:{DEICING_WEATHER:10}}
  ],
  turnaroundBands:[
    {id:'ELITE_TURN',min:90,name:'Turnaround elite'},
    {id:'ON_TIME',min:75,name:'Dentro do SLA'},
    {id:'DELAYED',min:55,name:'Solo atrasado'},
    {id:'GRIDLOCK',min:0,name:'Rampa travada'}
  ]
});
const GROUND_TURNAROUND_KEY='skywardGroundTurnaround_v1';
let groundTurnaroundState={schema:1,processScores:{GATE_ASSIGNMENT:78,BOARDING:80,BAGGAGE:76,FUELING:82,CATERING_CLEANING:76,PUSHBACK:78,RAMP_SAFETY:80,DEICING_WEATHER:70},programs:[],delays:[],turnaroundScore:78,avgTurnaroundMin:48,groundDelayMin:0,slaRate:78,status:'ON_TIME',history:[],lastEvaluation:null};
function loadGroundTurnaround(){try{const raw=localStorage?.getItem?.(GROUND_TURNAROUND_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)groundTurnaroundState={...groundTurnaroundState,...parsed};}}catch(e){safeLogError?.(e,'ground-turnaround-load');}return groundTurnaroundState;}
function saveGroundTurnaround(){try{localStorage?.setItem?.(GROUND_TURNAROUND_KEY,JSON.stringify(groundTurnaroundState));}catch(e){safeLogError?.(e,'ground-turnaround-save');}return groundTurnaroundState;}
function turnaroundBand(score){return GROUND_TURNAROUND_CATALOG.turnaroundBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||GROUND_TURNAROUND_CATALOG.turnaroundBands.at(-1);}
function programById(id){return GROUND_TURNAROUND_CATALOG.improvementPrograms.find(p=>p.id===id)||GROUND_TURNAROUND_CATALOG.improvementPrograms[0];}
function delayById(id){return GROUND_TURNAROUND_CATALOG.delayCauses.find(d=>d.id===id)||GROUND_TURNAROUND_CATALOG.delayCauses[0];}
function runGroundProgram(id='GATE_OPTIMIZER'){
  loadGroundTurnaround();
  const program=programById(id);
  if(groundTurnaroundState.programs.some(p=>p.programId===program.id)) return groundTurnaroundState.programs.find(p=>p.programId===program.id);
  const item={id:`GPR-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  groundTurnaroundState.programs.unshift(item);
  for(const [proc,gain] of Object.entries(program.benefit||{})){
    groundTurnaroundState.processScores[proc]=Math.min(100,Number(groundTurnaroundState.processScores[proc]||75)+Number(gain||0));
  }
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return item;
}
function raiseGroundDelay(id='GATE_CONFLICT'){
  loadGroundTurnaround();
  const tpl=delayById(id);
  const item={id:`GDL-${String(Date.now()).slice(-6)}`,delayId:tpl.id,name:tpl.name,process:tpl.process,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  groundTurnaroundState.delays.unshift(item);
  groundTurnaroundState.delays=groundTurnaroundState.delays.slice(0,80);
  groundTurnaroundState.processScores[tpl.process]=Math.max(0,Number(groundTurnaroundState.processScores[tpl.process]||75)-Math.round(tpl.severity/4));
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return item;
}
function closeGroundDelay(id,ok=true){
  loadGroundTurnaround();
  const d=groundTurnaroundState.delays.find(x=>x.id===id);
  if(d){d.status=ok?'CLEARED':'ESCALATED';d.closedAt=new Date().toISOString();if(ok)groundTurnaroundState.processScores[d.process]=Math.min(100,Number(groundTurnaroundState.processScores[d.process]||75)+2);}
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return d||null;
}
function calculateGroundMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const weather=window.SKYWARD_WEATHER_OPS?.status?.()||{};
  const surface=window.SKYWARD_SURFACE_SAFETY?.status?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()||{};
  const open=groundTurnaroundState.delays.filter(d=>d.status==='OPEN');
  const scores={...groundTurnaroundState.processScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0), incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const weatherScore=Number(weather.progress?.score||78);
  const surfaceScore=Number(surface.progress?.score||78);
  const radioScore=Number(radio.progress?.score||80);
  const delayPenalty=(proc)=>open.filter(d=>d.process===proc).reduce((a,d)=>a+Number(d.severity||0),0)/3;
  scores.GATE_ASSIGNMENT=Math.max(0,Math.min(100,Number(scores.GATE_ASSIGNMENT||78)+airlineScore*.04-denied*1.5-delayPenalty('GATE_ASSIGNMENT')));
  scores.BOARDING=Math.max(0,Math.min(100,Number(scores.BOARDING||80)+passengerScore*.04-denied*1.2-delayPenalty('BOARDING')));
  scores.BAGGAGE=Math.max(0,Math.min(100,Number(scores.BAGGAGE||76)+assetScore*.03-delayPenalty('BAGGAGE')));
  scores.FUELING=Math.max(0,Math.min(100,Number(scores.FUELING||82)-delayPenalty('FUELING')+(finalScore>2400?1:0)));
  scores.CATERING_CLEANING=Math.max(0,Math.min(100,Number(scores.CATERING_CLEANING||76)+workforceScore*.03-delayPenalty('CATERING_CLEANING')));
  scores.PUSHBACK=Math.max(0,Math.min(100,Number(scores.PUSHBACK||78)+radioScore*.03-denied*1.2-delayPenalty('PUSHBACK')));
  scores.RAMP_SAFETY=Math.max(0,Math.min(100,Number(scores.RAMP_SAFETY||80)+surfaceScore*.04-incursions*8-delayPenalty('RAMP_SAFETY')));
  scores.DEICING_WEATHER=Math.max(0,Math.min(100,Number(scores.DEICING_WEATHER||70)+weatherScore*.04-delayPenalty('DEICING_WEATHER')));
  const trafficLoad=Math.max(1,landed+departed);
  const weighted=Math.round(GROUND_TURNAROUND_CATALOG.turnaroundProcesses.reduce((a,p)=>a+(scores[p.id]||0)*p.weight,0)/100);
  const openSeverity=open.reduce((a,d)=>a+Number(d.severity||0),0);
  const avgTurnaround=Math.max(22,Math.round(62-weighted*.34+trafficLoad*2.2+open.length*3+(fail?5:0)));
  const groundDelay=Math.max(0,Math.round(openSeverity/5+denied*2+incursions*5+Math.max(0,65-weighted)/3));
  const slaRate=Math.max(0,Math.min(100,Math.round(weighted-groundDelay*.6+Math.max(0,finalScore-1800)/180)));
  return {scores,weighted,avgTurnaroundMin:avgTurnaround,groundDelayMin:groundDelay,slaRate,openDelays:open.length,drivers:{landed,departed,denied,incursions,airlineScore,passengerScore,workforceScore,assetScore,weatherScore,surfaceScore,radioScore}};
}
function evaluateGroundTurnaround(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadGroundTurnaround();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !groundTurnaroundState.delays.some(d=>d.status==='OPEN'&&d.delayId==='GATE_CONFLICT')) raiseGroundDelay('GATE_CONFLICT');
  if((statsObj.runwayIncursions||0)>0 && !groundTurnaroundState.delays.some(d=>d.status==='OPEN'&&d.delayId==='RAMP_INCIDENT')) raiseGroundDelay('RAMP_INCIDENT');
  const metrics=calculateGroundMetrics(finalScore,statsObj,fail);
  groundTurnaroundState.processScores=metrics.scores;
  groundTurnaroundState.avgTurnaroundMin=metrics.avgTurnaroundMin;
  groundTurnaroundState.groundDelayMin=metrics.groundDelayMin;
  groundTurnaroundState.slaRate=metrics.slaRate;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.55+metrics.slaRate*.25+Math.max(0,100-metrics.groundDelayMin*2)*.20)));
  groundTurnaroundState.turnaroundScore=score;
  groundTurnaroundState.status=turnaroundBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,turnaroundScore:score,status:groundTurnaroundState.status,programs:groundTurnaroundState.programs.length};
  groundTurnaroundState.history.unshift(evaluation);
  groundTurnaroundState.history=groundTurnaroundState.history.slice(0,100);
  groundTurnaroundState.lastEvaluation=evaluation;
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return {state:groundTurnaroundState,evaluation};
}
function groundTurnaroundProgress(){
  loadGroundTurnaround();
  return {score:groundTurnaroundState.turnaroundScore,status:groundTurnaroundState.status,avgTurnaroundMin:groundTurnaroundState.avgTurnaroundMin,groundDelayMin:groundTurnaroundState.groundDelayMin,slaRate:groundTurnaroundState.slaRate,openDelays:groundTurnaroundState.delays.filter(d=>d.status==='OPEN').length,programs:groundTurnaroundState.programs.length,last:groundTurnaroundState.lastEvaluation||null};
}
function renderGroundTurnaroundBoard(){
  try{
    const anchor=document.querySelector('#radioPhraseologyInline') || document.querySelector('#aiCopilotInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#groundTurnaroundInline'); if(old) old.remove();
    const p=groundTurnaroundProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="groundTurnaroundInline" class="airport-ops-board ground-turnaround-inline">
      <div class="airport-ops-head"><b>GROUND OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.slaRate}%</b></div>
        <div><small>TAT</small><b>${p.avgTurnaroundMin}m</b></div>
        <div><small>ATRASO</small><b>${p.groundDelayMin}m</b></div>
        <div><small>GATE</small><b>${Math.round(groundTurnaroundState.processScores.GATE_ASSIGNMENT||0)}</b></div>
        <div><small>PUSH</small><b>${Math.round(groundTurnaroundState.processScores.PUSHBACK||0)}</b></div>
        <div><small>FALHAS</small><b>${p.openDelays}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'ground-turnaround-board'); }
}
function initializeGroundTurnaround(){loadGroundTurnaround();renderGroundTurnaroundBoard();return groundTurnaroundState;}
function groundTurnaroundStatus(){loadGroundTurnaround();return {...groundTurnaroundState,progress:groundTurnaroundProgress(),catalog:GROUND_TURNAROUND_CATALOG};}
function groundTurnaroundSelfCheck(){
  const issues=[];
  if(GROUND_TURNAROUND_CATALOG.turnaroundProcesses.length<8) issues.push('processos insuficientes');
  if(GROUND_TURNAROUND_CATALOG.delayCauses.length<7) issues.push('causas insuficientes');
  const program=runGroundProgram('GATE_OPTIMIZER');
  const delay=raiseGroundDelay('FUEL_QUEUE');
  const res=evaluateGroundTurnaround(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !delay.id) issues.push('programa/atraso inválido');
  if(!Number.isFinite(res.evaluation.turnaroundScore)) issues.push('score turnaround inválido');
  return {ok:issues.length===0,issues,processes:GROUND_TURNAROUND_CATALOG.turnaroundProcesses.length,delays:GROUND_TURNAROUND_CATALOG.delayCauses.length};
}
window.SKYWARD_GROUND_TURNAROUND=Object.freeze({
  schema:1,
  catalog:GROUND_TURNAROUND_CATALOG,
  load:loadGroundTurnaround,
  save:saveGroundTurnaround,
  program:runGroundProgram,
  delay:raiseGroundDelay,
  close:closeGroundDelay,
  evaluate:evaluateGroundTurnaround,
  progress:groundTurnaroundProgress,
  status:groundTurnaroundStatus,
  board:renderGroundTurnaroundBoard,
  init:initializeGroundTurnaround,
  selfCheck:groundTurnaroundSelfCheck
});
