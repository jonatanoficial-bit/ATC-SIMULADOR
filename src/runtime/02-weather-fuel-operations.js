/* @skyward-module 02-weather-fuel-operations
 * Weather, fuel, runway, mission and handoff operations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('02-weather-fuel-operations');
const WAKE_RULES = {
  categories:{ 'A320':'M', 'B738':'M', 'E190':'M', 'A321':'M', 'B77W':'H', 'A359':'H', 'B744':'H', 'C208':'L', 'PC12':'L', 'GLEX':'M' },
  spacing:{ 'H-H':5.0, 'H-M':6.0, 'H-L':7.0, 'M-H':4.0, 'M-M':4.0, 'M-L':5.0, 'L-H':3.0, 'L-M':3.0, 'L-L':3.0 }
};
const RUNWAY_OPS = { mode:'MIXED', wind:'120/06', qnh:'1016', ceiling:'BKN018', visibility:'10KM', metarSeq:0 };
const WX_STATE = { condition:'VMC', precip:0, visibilityKm:10, ceilingFt:1800, crosswindKt:6, severity:0, tick:0, ops:'NORMAL' };
function updateWeatherOps(dt=0){
  try{
    WX_STATE.tick += dt || 0.016;
    const t = WX_STATE.tick;
    const wave = (Math.sin(t*0.055)+1)/2;
    const gust = (Math.sin(t*0.14+1.7)+1)/2;
    WX_STATE.precip = Math.max(0, Math.min(1, wave*.65 + (gust>.83?.25:0)));
    WX_STATE.visibilityKm = Math.max(2.2, 10 - WX_STATE.precip*6.5 - (gust>.88?1.0:0));
    WX_STATE.ceilingFt = Math.round(Math.max(500, 2200 - WX_STATE.precip*1300 - gust*250));
    WX_STATE.crosswindKt = Math.round(5 + gust*14 + WX_STATE.precip*5);
    WX_STATE.severity = Math.max(WX_STATE.precip, WX_STATE.crosswindKt>16?.85:0, WX_STATE.visibilityKm<4?.9:0, WX_STATE.ceilingFt<900?.8:0);
    WX_STATE.condition = WX_STATE.severity>.82 ? 'STORM OPS' : WX_STATE.severity>.58 ? 'LOW VIS' : WX_STATE.precip>.35 ? 'RAIN' : 'VMC';
    WX_STATE.ops = WX_STATE.severity>.82 ? 'CAT I / EXTRA SEP' : WX_STATE.severity>.58 ? 'REDUCED RATE' : WX_STATE.precip>.35 ? 'WET RWY' : 'NORMAL';
    RUNWAY_OPS.wind = `${String(Math.round((115+gust*35)%360)).padStart(3,'0')}/${String(WX_STATE.crosswindKt).padStart(2,'0')}`;
    RUNWAY_OPS.ceiling = WX_STATE.ceilingFt<1000 ? `OVC${String(Math.round(WX_STATE.ceilingFt/100)).padStart(3,'0')}` : `BKN${String(Math.round(WX_STATE.ceilingFt/100)).padStart(3,'0')}`;
    RUNWAY_OPS.visibility = `${WX_STATE.visibilityKm.toFixed(1)}KM`;
    RUNWAY_OPS.mode = WX_STATE.ops;
    const wEl=document.querySelector('#weather'); if(wEl) wEl.textContent = WX_STATE.condition;
  }catch(e){ safeLogError(e,'weather-ops'); }
}
function weatherSeparationMultiplier(){
  return WX_STATE.severity>.82 ? 1.45 : WX_STATE.severity>.58 ? 1.28 : WX_STATE.precip>.35 ? 1.15 : 1;
}
function renderWeatherBoard(){
  try{
    const box=document.querySelector('#weatherBoard'); if(!box) return;
    box.className = 'weather-board ' + (WX_STATE.severity>.82?'danger':WX_STATE.severity>.58?'warn':'ok');
    box.innerHTML = `<div class="wx-head"><b>WX / OPS</b><span>${WX_STATE.condition}</span></div>
      <div class="wx-grid"><div><small>WIND</small><b>${RUNWAY_OPS.wind}</b></div><div><small>VIS</small><b>${RUNWAY_OPS.visibility}</b></div><div><small>CEILING</small><b>${RUNWAY_OPS.ceiling}</b></div><div><small>OPS</small><b>${WX_STATE.ops}</b></div></div>`;
  }catch(e){ safeLogError(e,'weather-board'); }
}

function updateFuelAndEmergency(dt){
  try{
    emergencyDirector.active=false; emergencyDirector.target=null; emergencyDirector.message='Sem emergência ativa.';
    for(const p of aircraft){
      if(!p) continue;
      const moving = !['PARKED'].includes(p.status);
      const base = (p.kind==='arrival' ? FUEL_RULES.arrivalBurn : FUEL_RULES.departureBurn) * (typeof aircraftFuelMultiplier==='function' ? aircraftFuelMultiplier(p) : 1);
      const wxMul = WX_STATE.severity>.82 ? 1.55 : WX_STATE.severity>.58 ? 1.28 : 1;
      const holdMul = p.status==='HOLD' ? 1.45 : 1;
      if(moving) p.fuel = Math.max(0, Number(p.fuel ?? 60) - dt*base*wxMul*holdMul*18);
      if(p.damage>0) p.fuel = Math.max(0, p.fuel - dt*0.015);
      const prev=p.fuelState || 'OK';
      p.fuelState = p.fuel <= FUEL_RULES.criticalThreshold ? 'CRITICAL' : p.fuel <= FUEL_RULES.emergencyThreshold ? 'EMERGENCY' : p.fuel <= FUEL_RULES.lowThreshold ? 'LOW' : 'OK';
      if(p.fuelState==='LOW' && prev==='OK'){
        stats.lowFuel=(stats.lowFuel||0)+1;
        addRequest(p,'lowfuel','warn');
        addLog(`${p.id}: combustível mínimo, solicita prioridade.`, 'warn');
      }
      if((p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') && !p.emergency){
        p.emergency=true; p.emergencyType='LOW FUEL'; p.status = p.kind==='arrival' ? 'EMERG' : p.status;
        stats.emergencies=(stats.emergencies||0)+1;
        addRequest(p,'emergency','urgent');
        addLog(`${p.id}: MAYDAY combustível crítico. Vetor imediato para pouso.`, 'danger');
      }
      if(p.emergency){
        emergencyDirector.active=true; emergencyDirector.target=p.id;
        emergencyDirector.message = `${p.id} ${p.emergencyType || 'EMERG'} • FUEL ${Math.round(p.fuel)}% • prioridade máxima`;
      }
      if(p.fuel<=0){
        endGame(true,`${p.id} ficou sem combustível.`);
        return;
      }
    }
  }catch(e){ safeLogError(e,'fuel-emergency-update'); }
}
function fuelClass(p){
  if(!p) return 'ok';
  if(p.fuelState==='CRITICAL' || p.fuelState==='EMERGENCY' || p.emergency) return 'danger';
  if(p.fuelState==='LOW' || (p.damage||0)>0) return 'warn';
  return 'ok';
}
function renderFuelBoard(){
  try{
    const box=document.querySelector('#fuelBoard'); if(!box) return;
    const sorted=[...aircraft].sort((a,b)=>(a.fuel??99)-(b.fuel??99)).slice(0,5);
    const rows=sorted.map(p=>`<div class="fuel-row ${fuelClass(p)}"><b>${p.id}</b><span>${p.fuelState||'OK'}</span><em>FUEL ${Math.round(p.fuel??0)}% • DMG ${Math.round(p.damage||0)}%</em></div>`).join('') || '<em>sem tráfego</em>';
    box.className='fuel-board '+(emergencyDirector.active?'danger':sorted.some(p=>fuelClass(p)==='warn')?'warn':'ok');
    box.innerHTML=`<div class="fuel-head"><b>FUEL / EMERG</b><span>${emergencyDirector.active?'EMERGÊNCIA ATIVA':'NORMAL'}</span></div><div class="fuel-director">${emergencyDirector.message}</div>${rows}`;
  }catch(e){ safeLogError(e,'fuel-board'); }
}
function maybeGenerateOperationalEmergency(dt){
  try{
    const now=performance.now();
    if(now-(emergencyDirector.lastTick||0)<22000) return;
    emergencyDirector.lastTick=now;
    if(aircraft.length<4 || skywardRandomUnit()>0.18) return;
    const candidates=aircraft.filter(p=>p.kind==='arrival' && !p.emergency && ['APP','HOLD','FINAL'].includes(p.status));
    if(!candidates.length) return;
    const p=candidates[Math.floor(skywardRandomUnit()*candidates.length)];
    p.emergency=true; p.emergencyType = skywardRandomUnit()<.55 ? 'MEDICAL' : 'ENGINE';
    p.status='EMERG'; p.targetAlt=Math.min(p.targetAlt||45,35); p.fuel=Math.min(p.fuel||40, Math.round(rand(18,30)));
    stats.emergencies=(stats.emergencies||0)+1;
    addRequest(p,'emergency','urgent');
    addLog(`${p.id}: MAYDAY ${p.emergencyType}, solicita vetores imediatos para RWY ${runway.name}.`, 'danger');
  }catch(e){ safeLogError(e,'generate-emergency'); }
}

function drawWeatherOverlay(w,h){
  try{
    if(!radarFilters.wx || WX_STATE.precip<=.05) return;
    ctx.save();
    const bands = 7;
    for(let i=0;i<bands;i++){
      const x = ((i*17 + WX_STATE.tick*1.4)%115-10)/100*w;
      const y = (12 + (i*11)%70)/100*h;
      const rw = (18 + i*3)/100*w;
      const rh = (10 + (i%3)*7)/100*h;
      ctx.globalAlpha = 0.05 + WX_STATE.precip*0.11;
      const g=ctx.createRadialGradient(x+rw*.5,y+rh*.5,2,x+rw*.5,y+rh*.5,Math.max(rw,rh));
      g.addColorStop(0,'rgba(70,170,255,.65)'); g.addColorStop(.65,'rgba(20,90,160,.22)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(x+rw*.5,y+rh*.5,rw*.5,rh*.5,0,0,Math.PI*2); ctx.fill();
    }
    if(WX_STATE.severity>.82){ ctx.globalAlpha=.09; ctx.fillStyle='rgba(255,191,61,.25)'; ctx.fillRect(0,0,w,h); }
    ctx.restore();
  }catch(e){ safeLogError(e,'weather-overlay'); }
}

function wakeCategory(p){
  try{ return p?.wakeCategory || (typeof aircraftPerformanceProfile==='function' ? aircraftPerformanceProfile(p?.type).wake : null) || WAKE_RULES.categories[String(p?.type||'').toUpperCase()] || ((p?.type||'').includes('77')?'H':'M'); }catch(_e){ return 'M'; }
}
function requiredWakeSpacing(lead, trail){
  const leadCat=wakeCategory(lead), trailCat=wakeCategory(trail), wx=weatherSeparationMultiplier();
  if(QUALITY?.wakeSpacing) return QUALITY.wakeSpacing(leadCat,trailCat,wx,WAKE_RULES.spacing);
  const key = `${leadCat}-${trailCat}`;
  return (WAKE_RULES.spacing[key] || 4.0) * wx;
}
function updateRunwayOps(){
  try{
    updateWeatherOps(0.05);
    const wx = ['120/06','090/08','270/05','160/12','330/09'];
    const qnh = ['1016','1013','1019','1011'];
    if(!RUNWAY_OPS.lastUpdate || performance.now()-RUNWAY_OPS.lastUpdate>90000){
      RUNWAY_OPS.lastUpdate=performance.now();
      RUNWAY_OPS.metarSeq=(RUNWAY_OPS.metarSeq+1)%wx.length;
      RUNWAY_OPS.wind=wx[RUNWAY_OPS.metarSeq];
      RUNWAY_OPS.qnh=qnh[RUNWAY_OPS.metarSeq%qnh.length];
      RUNWAY_OPS.mode = conflictPredictions?.length ? 'ARR PRIORITY' : (runwayOccupiedBy?'PROTECTED':'MIXED');
    }
  }catch(e){ safeLogError(e,'runway-ops'); }
}
function renderWakeBoard(){
  try{
    const box=document.querySelector('#runwayBoard');
    if(!box) return;
    updateRunwayOps();
    const final = runwayFlowState().final;
    const depq = runwayFlowState().depq;
    const spacing = final.slice(0,3).map((p,i)=>{
      const lead = final[i-1];
      const req = lead ? requiredWakeSpacing(lead,p).toFixed(1)+'NM' : 'LEAD';
      return `<b>${p.id}</b><span>${wakeCategory(p)} ${req}</span>`;
    }).join('') || '<em>sem sequência</em>';
    const dep = depq.slice(0,3).map(p=>`<b>${p.id}</b><span>${wakeCategory(p)} ${p.status}</span>`).join('') || '<em>sem saída</em>';
    const extra = `<div class="runway-board-extra">
      <div><small>OPS MODE</small><b>${RUNWAY_OPS.mode}</b></div>
      <div><small>METAR</small><b>${RUNWAY_OPS.wind} Q${RUNWAY_OPS.qnh}</b></div>
      <div><small>WAKE APP</small>${spacing}</div>
      <div><small>DEP WAKE</small>${dep}</div>
    </div>`;
    if(!box.querySelector('.runway-board-extra')) box.insertAdjacentHTML('beforeend',extra);
    else box.querySelector('.runway-board-extra').outerHTML=extra;
  }catch(e){ safeLogError(e,'wake-board'); }
}

function adaptivePerformanceGuard(dt){
  try{
    if(!Number.isFinite(dt)) return;
    if(dt>.11) SAFE_MODE.perf.badFrames++; else SAFE_MODE.perf.badFrames=Math.max(0,SAFE_MODE.perf.badFrames-1);
    if(SAFE_MODE.perf.badFrames>16 && SAFE_MODE.perf.mode==='normal'){
      SAFE_MODE.perf.mode='reduced';
      SAFE_MODE.maxAircraft=Math.min(SAFE_MODE.maxAircraft,12);
      if(typeof radarFilters==='object'){ radarFilters.vectors=false; }
      setDiagnostic('MODO PERFORMANCE: vetores reduzidos','warn');
      addLog('Sistema: performance reduzida automaticamente para proteger jogabilidade mobile.','warn');
    }
  }catch(e){ safeLogError(e,'performance-guard'); }
}

function buildMission(){
  const a = airport();
  const traffic = String(a.traffic||'Médio').toLowerCase();
  const heavy = traffic.includes('alto') || traffic.includes('muito');
  const level = Number(profile.level)||1;
  const baseLand = heavy ? 3 : 2;
  const baseDep = heavy ? 2 : 1;
  return {
    startedAt: performance.now(),
    duration: 420,
    targets:{ landed:baseLand+Math.min(2,Math.floor(level/4)), departed:baseDep+Math.min(2,Math.floor(level/5)), safety:86, blockedMax:3, commands:8, maydayResolved:0 },
    completed:false,
    announced:{},
    airport:a.icao
  };
}
function missionProgress(){
  if(!mission) mission=buildMission();
  const safeScore = Math.round(safetyState?.score ?? 100);
  return [
    {key:'landed', label:'Pousos seguros', value:stats.landed||0, target:mission.targets.landed, good:true},
    {key:'departed', label:'Decolagens seguras', value:stats.departed||0, target:mission.targets.departed, good:true},
    {key:'commands', label:'Comandos corretos', value:stats.commands||0, target:mission.targets.commands, good:true},
    {key:'safety', label:'Safety mínimo', value:safeScore, target:mission.targets.safety, good:safeScore>=mission.targets.safety, percent:true},
    {key:'blocked', label:'Bloqueios máximos', value:stats.blocked||0, target:mission.targets.blockedMax, good:(stats.blocked||0)<=mission.targets.blockedMax, inverse:true},
    {key:'mayday', label:'Emergências resolvidas', value:stats.maydayResolved||0, target:mission.targets.maydayResolved||0, good:(stats.maydayResolved||0)>=(mission.targets.maydayResolved||0)}
  ];
}
function renderMissionBoard(){
  try{
    if(!mission) mission=buildMission();
    const box=document.querySelector('#missionBoard');
    const timer=document.querySelector('#missionTimer');
    if(timer){ const elapsed=Math.max(0,(performance.now()-mission.startedAt)/1000); timer.textContent=new Date(elapsed*1000).toISOString().substring(14,19); }
    if(!box) return;
    const rows=missionProgress();
    box.innerHTML=rows.map(r=>{
      const done = r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target);
      const bad = r.inverse && !r.good;
      const val = r.percent ? `${r.value}% / ${r.target}%` : `${r.value}/${r.target}`;
      return `<div class="mission-row ${done?'done':''} ${bad?'danger':''}" data-obj="${r.key}"><b>${r.label}</b><span>${val}</span></div>`;
    }).join('');
    rows.forEach(r=>{
      const done = r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target);
      if(done && !mission.announced[r.key]){
        mission.announced[r.key]=true;
        missionHistory.unshift(`${r.label} concluído`);
        const node=box.querySelector(`[data-obj="${r.key}"]`); if(node) node.classList.add('objective-flash');
      }
    });
    const coreComplete = rows.filter(r=>['landed','departed','safety'].includes(r.key)).every(r=> r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target));
    if(coreComplete && !mission.completed){ mission.completed=true; addLog('Missão do turno: objetivos principais concluídos. Mantenha segurança até o fim.'); setDiagnostic('OBJETIVOS CONCLUÍDOS','ok'); }
  }catch(e){ safeLogError(e,'mission-board'); }
}
function handoffAdvice(p){
  if(!p) return {level:'warn', msg:'Selecione uma aeronave ou use PRÓXIMA SOLICITAÇÃO para iniciar o fluxo operacional.'};
  const req=requests.find(r=>r.id===p.id);
  if(p.emergency || req?.type==='emergency') return {level:'danger', msg:`${p.id}: prioridade de emergência. Proteja a pista, remova conflitos e autorize pouso imediato quando seguro.`};
  if(getSector(p)==='APP') return {level:'ok', msg:`${p.id} em APP: controle altitude/velocidade, vetor final e transfira para TWR quando estabilizado.`};
  if(getSector(p)==='GND') return {level:'ok', msg:`${p.id} em GND: pushback/táxi somente se taxiway e ponto de espera estiverem livres.`};
  if(p.status==='FINAL') return {level:'warn', msg:`${p.id} na final: confirme pista livre. Se houver risco, execute ARREMETER.`};
  if(p.status==='LINEUP') return {level:'warn', msg:`${p.id} alinhado: autorize decolagem apenas sem tráfego em curta final.`};
  return {level:'ok', msg:`${p.id} em ${getSector(p)}: responda ao pedido ativo com comando contextual.`};
}
function renderHandoffAdvisor(){
  try{
    const el=document.querySelector('#handoffAdvisor'); if(!el) return;
    const p=aircraft.find(x=>x.id===selected);
    const a=handoffAdvice(p);
    el.textContent='HANDOFF: '+a.msg;
    el.className='handoff-advisor '+a.level;
  }catch(e){ safeLogError(e,'handoff-advisor'); }
}

function runwayFlowState(){
  const final = aircraft.filter(p=>p.kind==='arrival' && ['APP','FINAL','EMERG','HOLD'].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix));
  const depq = aircraft.filter(p=>['HOLD_SHORT','LINEUP','DEP','TAXI'].includes(p.status)).sort((a,b)=>dist(a,holdingPoints[0]||{x:24,y:57})-dist(b,holdingPoints[0]||{x:24,y:57}));
  const ground = aircraft.filter(p=>['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT'].includes(p.status));
  const blocked = runwayOccupiedBy ? `OCUPADA ${runwayOccupiedBy}` : 'LIVRE';
  return {final, depq, ground, blocked};
}
function renderRunwayBoard(){
  try{
    const box=document.querySelector('#runwayBoard');
    if(!box) return;
    const st=runwayFlowState();
    const fmt=list=>list.slice(0,3).map(p=>`<b>${p.id}</b> <span>${p.status} FL${Math.round(p.alt||0)}</span>`).join('') || '<em>sem tráfego</em>';
    box.innerHTML = `<div class="runway-board-head"><b>RWY ${runway.name}</b><span>${st.blocked}</span></div>
      <div class="runway-board-grid">
        <div><small>APP SEQ</small>${fmt(st.final)}</div>
        <div><small>DEP/TAXI</small>${fmt(st.depq)}</div>
      </div>`;
    renderWakeBoard();
    renderWeatherBoard();
    renderFuelBoard();
  }catch(e){ safeLogError(e,'runway-board'); }
}
