/* @skyward-module 17-surface-safety-director
 * Surface Safety Director: taxi conflicts, runway incursions, hotspots and ground command risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('17-surface-safety-director');
const SURFACE_HOTSPOTS = Object.freeze({
  schema: 1,
  version: '2026.06-f14',
  airports: {
    SBGR:[{id:'HS-RWY-09R-A',type:'runway-entry',x:33,y:56,radius:4.8,severity:'danger',label:'Entry A / 09R'},{id:'HS-RWY-09R-B',type:'runway-entry',x:48,y:56,radius:4.8,severity:'danger',label:'Entry B / 09R'},{id:'HS-TAXI-A',type:'taxi-converge',x:66,y:56,radius:5.2,severity:'warn',label:'Taxiway A merge'}],
    SBSP:[{id:'HS-URBAN-17',type:'runway-entry',x:42,y:48,radius:5.2,severity:'danger',label:'Urban short-field entry'},{id:'HS-TERM-P',type:'taxi-converge',x:58,y:68,radius:5.0,severity:'warn',label:'Terminal pinch point'}],
    SBKP:[{id:'HS-CARGO-15',type:'runway-entry',x:34,y:44,radius:5.0,severity:'danger',label:'Cargo entry 15'},{id:'HS-CARGO-D',type:'taxi-converge',x:58,y:70,radius:5.4,severity:'warn',label:'Cargo apron merge'}],
    SBBR:[{id:'HS-BSB-11',type:'runway-entry',x:48,y:58,radius:5.2,severity:'danger',label:'Central runway entry'},{id:'HS-BSB-PAR',type:'parallel-runway',x:68,y:66,radius:5.2,severity:'warn',label:'Parallel runway crossflow'}],
    KATL:[{id:'HS-ATL-A',type:'runway-entry',x:42,y:54,radius:5.6,severity:'danger',label:'ATL north entry'},{id:'HS-ATL-B',type:'runway-entry',x:56,y:54,radius:5.6,severity:'danger',label:'ATL central entry'},{id:'HS-ATL-C',type:'taxi-converge',x:66,y:62,radius:5.6,severity:'warn',label:'ATL banked taxi merge'}]
  }
});
let surfaceSafetyState = { schema:1, score:100, level:'ok', alerts:[], lastIncursionAt:0, lastTaxiConflictAt:0, runwayProtected:false, hotspots:[] };
function surfaceHotspotsFor(icao){ const code=String(icao||airport()?.icao||'').toUpperCase(); return SURFACE_HOTSPOTS.airports[code] || []; }
function surfaceGroundStatus(status){ return ['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP','LINEUP_READY','VACATE'].includes(String(status||'')); }
function surfaceControlledStatus(status){ return ['LINEUP','LINEUP_READY','DEP','FINAL','EMERG','VACATE'].includes(String(status||'')); }
function surfacePointToSegmentDistance(point,a,b){
  const ax=a.x, ay=a.y, bx=b.x, by=b.y, px=Number(point?.x)||0, py=Number(point?.y)||0;
  const abx=bx-ax, aby=by-ay, ab2=abx*abx+aby*aby||1;
  const t=Math.max(0,Math.min(1,((px-ax)*abx+(py-ay)*aby)/ab2));
  return Math.hypot(px-(ax+abx*t), py-(ay+aby*t));
}
function runwayProtectedDistance(p){ return surfacePointToSegmentDistance(p,{x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2}); }
function surfaceDetectHotspots(){
  const spots=surfaceHotspotsFor();
  const hits=[];
  for(const h of spots){
    const occupants=aircraft.filter(p=>surfaceGroundStatus(p.status) && Math.hypot((p.x||0)-h.x,(p.y||0)-h.y)<=Number(h.radius||4));
    if(occupants.length) hits.push({ id:h.id, label:h.label, type:h.type, severity:h.severity||'warn', occupants:occupants.map(p=>p.id) });
  }
  return hits;
}
function detectTaxiConflicts(){
  const ground=aircraft.filter(p=>surfaceGroundStatus(p.status) && !['PARKED'].includes(p.status));
  const conflicts=[];
  for(let i=0;i<ground.length;i++) for(let j=i+1;j<ground.length;j++){
    const a=ground[i], b=ground[j];
    if(a.id===b.id) continue;
    const d=Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
    if(d<2.2) conflicts.push({level:'danger',a:a.id,b:b.id,d,msg:`Conflito de solo ${a.id}/${b.id}: ${d.toFixed(1)} NM`});
    else if(d<3.8 && (a.status==='TAXI'||b.status==='TAXI')) conflicts.push({level:'warn',a:a.id,b:b.id,d,msg:`Taxi spacing reduzido ${a.id}/${b.id}: ${d.toFixed(1)} NM`});
  }
  return conflicts;
}
function detectRunwayIncursions(){
  const alerts=[];
  const protectedRadius=Math.max(5.2,Number(runway.width)||5.2);
  for(const p of aircraft){
    if(!surfaceGroundStatus(p.status)) continue;
    const d=runwayProtectedDistance(p);
    const unauthorized=d<protectedRadius && !surfaceControlledStatus(p.status) && !p.cleared;
    if(unauthorized) alerts.push({level:'danger',id:p.id,d,msg:`Runway incursion: ${p.id} entrou na área protegida da ${runway.name}.`});
    else if(d<protectedRadius+2.6 && p.status==='TAXI') alerts.push({level:'warn',id:p.id,d,msg:`${p.id} próximo da área protegida da pista.`});
  }
  return alerts;
}
function updateSurfaceSafetyDirector(dt=0){
  const taxi=detectTaxiConflicts();
  const incursions=detectRunwayIncursions();
  const hotspots=surfaceDetectHotspots();
  let score=100;
  score-=incursions.filter(a=>a.level==='danger').length*32;
  score-=incursions.filter(a=>a.level==='warn').length*10;
  score-=taxi.filter(a=>a.level==='danger').length*22;
  score-=taxi.filter(a=>a.level==='warn').length*8;
  score-=hotspots.filter(h=>h.severity==='danger').length*8;
  const alerts=[...incursions,...taxi,...hotspots.map(h=>({level:h.severity||'warn',msg:`Hotspot ${h.label}: ${h.occupants.join(', ')}`,hotspot:h.id}))].slice(0,6);
  const level=score<55||alerts.some(a=>a.level==='danger')?'danger':score<82||alerts.length?'warn':'ok';
  surfaceSafetyState={ schema:1, score:Math.max(0,Math.round(score)), level, alerts, lastIncursionAt:surfaceSafetyState.lastIncursionAt, lastTaxiConflictAt:surfaceSafetyState.lastTaxiConflictAt, runwayProtected:Boolean(runwayOccupiedBy), hotspots };
  const now=performance.now?.()||0;
  if(incursions.some(a=>a.level==='danger') && now-surfaceSafetyState.lastIncursionAt>2500){ stats.runwayIncursions=(stats.runwayIncursions||0)+1; surfaceSafetyState.lastIncursionAt=now; }
  if(taxi.some(a=>a.level==='danger') && now-surfaceSafetyState.lastTaxiConflictAt>2500){ stats.surfaceConflicts=(stats.surfaceConflicts||0)+1; surfaceSafetyState.lastTaxiConflictAt=now; }
  return surfaceSafetyState;
}
function surfaceCommandRisk(p,cmd){
  if(!p) return {level:'warn',block:true,msg:'Selecione aeronave.'};
  const state=surfaceSafetyState?.alerts ? surfaceSafetyState : updateSurfaceSafetyDirector(0);
  const shortFinal=arrivalOnShortFinal?.();
  const ownIncursion=detectRunwayIncursions().find(a=>a.id===p.id && a.level==='danger');
  if(ownIncursion && ['approveTaxi','lineUp','clearTakeoff'].includes(cmd)) return {level:'danger',block:true,msg:ownIncursion.msg};
  if(['lineUp','clearTakeoff'].includes(cmd)){
    const other=aircraft.find(o=>o.id!==p.id && surfaceControlledStatus(o.status) && runwayProtectedDistance(o)<Math.max(6,runway.width||5.2));
    if(other) return {level:'danger',block:true,msg:`Área protegida ocupada por ${other.id}.`};
    if(shortFinal && shortFinal.id!==p.id) return {level:'danger',block:true,msg:`${shortFinal.id} na curta final. Entrada na pista bloqueada.`};
  }
  if(cmd==='approveTaxi'){
    const conflicts=detectTaxiConflicts().filter(c=>[c.a,c.b].includes(p.id));
    if(conflicts.some(c=>c.level==='danger')) return {level:'danger',block:true,msg:conflicts[0].msg};
    if(state.level==='warn' && state.hotspots?.length) return {level:'warn',block:false,msg:'Hotspot ativo no solo; monitore taxiway antes de prosseguir.'};
  }
  if(cmd==='holdShort' && runwayProtectedDistance(p)<Math.max(6,runway.width||5.2)) return {level:'warn',block:false,msg:'Hold short emitido dentro/próximo da área protegida.'};
  return {level:'ok',block:false,msg:'Surface safety aprovado.'};
}
function renderSurfaceSafetyBoard(){
  try{
    const state=updateSurfaceSafetyDirector(0);
    const box=document.querySelector('#surfaceSafetyBoard');
    if(box){
      box.className=`surface-safety-board ${state.level}`;
      box.innerHTML=`<div><b>SURFACE SAFETY</b><span>${state.score}% • ${state.level.toUpperCase()}</span></div>`+(state.alerts.length?state.alerts.map(a=>`<small>${a.msg}</small>`).join(''):'<small>Solo nominal. Sem hotspots críticos.</small>');
    }
    const marker=document.querySelector('#surfaceSafetyStatus');
    if(marker) marker.textContent=`SURFACE ${state.score}%`;
  }catch(e){ safeLogError?.(e,'surface-safety-board'); }
}
function surfaceSafetySelfCheck(){
  const issues=[];
  const codes=Object.keys(SURFACE_HOTSPOTS.airports||{});
  if(codes.length<5) issues.push('hotspots insuficientes');
  for(const code of codes){ if(!SURFACE_HOTSPOTS.airports[code].length) issues.push(`${code} sem hotspots`); }
  return { ok:issues.length===0, issues, airports:codes.length };
}
window.SKYWARD_SURFACE_SAFETY=Object.freeze({ schema:1, hotspots:SURFACE_HOTSPOTS, hotspotsFor:surfaceHotspotsFor, update:updateSurfaceSafetyDirector, commandRisk:surfaceCommandRisk, taxiConflicts:detectTaxiConflicts, runwayIncursions:detectRunwayIncursions, render:renderSurfaceSafetyBoard, selfCheck:surfaceSafetySelfCheck });
