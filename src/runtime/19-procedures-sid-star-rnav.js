/* @skyward-module 19-procedures-sid-star-rnav
 * Published-style SID/STAR/ILS/RNAV, missed approach and holding patterns.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('19-procedures-sid-star-rnav');
const PUBLISHED_PROCEDURES_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f16',
  airports:{
    SBGR:{
      activeRunway:'09R/27L',
      stars:[
        {id:'MRC1A',name:'MARICA ONE ALFA STAR',type:'STAR',runway:'09R/27L',fixes:[{id:'MRC',name:'MARICA',x:16,y:17,altitudeFt:11000,speedKt:230},{id:'ANVIL',name:'ANVIL',x:34,y:22,altitudeFt:8000,speedKt:210},{id:'FAF09R',name:'FAF 09R',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THRESHOLD 09R',x:82,y:49,altitudeFt:0,speedKt:140}]},
        {id:'PAG2B',name:'PAGAN TWO BRAVO RNAV STAR',type:'RNAV_STAR',runway:'09R/27L',fixes:[{id:'PAG',name:'PAGAN',x:18,y:34,altitudeFt:10000,speedKt:230},{id:'SUGRE',name:'SUGRE',x:38,y:28,altitudeFt:7000,speedKt:210},{id:'FAF09R',name:'FAF 09R',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THRESHOLD 09R',x:82,y:49,altitudeFt:0,speedKt:140}]}
      ],
      sids:[
        {id:'PAG1C',name:'PAGAN ONE CHARLIE SID',type:'SID',runway:'09R/27L',fixes:[{id:'DER09R',name:'DER 09R',x:17,y:49,altitudeFt:0,speedKt:160},{id:'CLB01',name:'CLIMB FIX',x:11,y:42,altitudeFt:3000,speedKt:190},{id:'PAG',name:'PAGAN',x:6,y:30,altitudeFt:7000,speedKt:230}]},
        {id:'MRC2D',name:'MARICA TWO DELTA SID',type:'SID',runway:'09R/27L',fixes:[{id:'DER09R',name:'DER 09R',x:17,y:49,altitudeFt:0,speedKt:160},{id:'EAST1',name:'EAST CLIMB',x:8,y:56,altitudeFt:3000,speedKt:190},{id:'MRC',name:'MARICA',x:4,y:72,altitudeFt:7000,speedKt:230}]}
      ],
      approaches:[
        {id:'ILS09R',name:'ILS RWY 09R',type:'ILS',runway:'09R/27L',minimums:{decisionAltitudeFt:230,rvrMeters:750},localizer:90,glideSlope:3.0,fixes:[{id:'IAF09R',name:'IAF',x:33,y:23,altitudeFt:7000,speedKt:210},{id:'FAF09R',name:'FAF',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THR',x:82,y:49,altitudeFt:0,speedKt:140}]},
        {id:'RNAV09R',name:'RNAV GNSS RWY 09R',type:'RNAV',runway:'09R/27L',minimums:{decisionAltitudeFt:420,rvrMeters:1200},fixes:[{id:'IF09R',name:'IF',x:40,y:26,altitudeFt:6000,speedKt:200},{id:'FAF09R',name:'FAF',x:55,y:31,altitudeFt:3200,speedKt:170},{id:'MAP09R',name:'MAPt',x:82,y:49,altitudeFt:0,speedKt:140}]}
      ],
      missedApproach:{id:'MISSED09R',name:'MISSED APPROACH RWY 09R',fixes:[{id:'CLIMB09R',name:'CLIMB STRAIGHT',x:88,y:45,altitudeFt:1500,speedKt:170},{id:'TURNN',name:'LEFT TURN',x:80,y:28,altitudeFt:3000,speedKt:190},{id:'HLDGR',name:'GR HOLD',x:62,y:22,altitudeFt:5000,speedKt:210}]},
      holds:[{id:'GRHLD',name:'GUARULHOS NORTH HOLD',fix:'HLDGR',x:62,y:22,inboundCourse:270,legNm:5,altitudeFt:5000}]
    },
    SBSP:{
      activeRunway:'17R/35L',
      stars:[{id:'CGO1A',name:'CONGONHAS CURVED VISUAL STAR',type:'STAR',runway:'17R/35L',fixes:[{id:'NORTH',name:'NORTH ENTRY',x:62,y:18,altitudeFt:7000,speedKt:200},{id:'BASE17',name:'BASE 17',x:58,y:34,altitudeFt:4500,speedKt:180},{id:'FAF17',name:'FAF 17',x:54,y:49,altitudeFt:2600,speedKt:155},{id:'THR17',name:'THR 17',x:64,y:74,altitudeFt:0,speedKt:135}]}],
      sids:[{id:'CGO2B',name:'CONGONHAS TWO BRAVO SID',type:'SID',runway:'17R/35L',fixes:[{id:'DER17',name:'DER 17',x:40,y:28,altitudeFt:0,speedKt:150},{id:'CLB17',name:'URBAN CLIMB',x:32,y:18,altitudeFt:3000,speedKt:180},{id:'NORTH',name:'NORTH EXIT',x:24,y:10,altitudeFt:6000,speedKt:210}]}],
      approaches:[{id:'RNAV17',name:'RNAV RWY 17R',type:'RNAV',runway:'17R/35L',minimums:{decisionAltitudeFt:620,rvrMeters:1600},fixes:[{id:'IF17',name:'IF',x:62,y:24,altitudeFt:6000,speedKt:190},{id:'FAF17',name:'FAF',x:54,y:49,altitudeFt:2600,speedKt:155},{id:'MAP17',name:'MAPt',x:64,y:74,altitudeFt:0,speedKt:135}]}],
      missedApproach:{id:'MISSED17',name:'MISSED APPROACH RWY 17',fixes:[{id:'CLIMB17',name:'RUNWAY HDG',x:70,y:84,altitudeFt:1500,speedKt:160},{id:'EAST17',name:'RIGHT TURN',x:82,y:68,altitudeFt:3000,speedKt:180}]},
      holds:[{id:'CGOHLD',name:'URBAN HOLD EAST',fix:'EAST17',x:82,y:68,inboundCourse:350,legNm:4,altitudeFt:4000}]
    },
    KATL:{
      activeRunway:'09L/27R',
      stars:[{id:'ATL1A',name:'ATLANTA BANK ONE STAR',type:'STAR',runway:'09L/27R',fixes:[{id:'BANKN',name:'NORTH BANK',x:18,y:18,altitudeFt:12000,speedKt:250},{id:'DOWNW',name:'DOWNWIND',x:38,y:22,altitudeFt:8000,speedKt:220},{id:'FAF09L',name:'FAF 09L',x:58,y:30,altitudeFt:3200,speedKt:175},{id:'THR09L',name:'THR 09L',x:84,y:46,altitudeFt:0,speedKt:145}]}],
      sids:[{id:'ATL2C',name:'ATLANTA TWO CHARLIE SID',type:'SID',runway:'09L/27R',fixes:[{id:'DER09L',name:'DER 09L',x:16,y:46,altitudeFt:0,speedKt:160},{id:'WEST1',name:'WEST CLIMB',x:8,y:38,altitudeFt:4000,speedKt:210},{id:'BANKW',name:'BANK WEST',x:4,y:25,altitudeFt:9000,speedKt:250}]}],
      approaches:[{id:'ILS09L',name:'ILS RWY 09L',type:'ILS',runway:'09L/27R',minimums:{decisionAltitudeFt:210,rvrMeters:700},localizer:90,glideSlope:3.0,fixes:[{id:'IF09L',name:'IF',x:40,y:25,altitudeFt:7000,speedKt:210},{id:'FAF09L',name:'FAF',x:58,y:30,altitudeFt:3200,speedKt:175},{id:'THR09L',name:'THR',x:84,y:46,altitudeFt:0,speedKt:145}]}],
      missedApproach:{id:'MISSED09L',name:'MISSED APPROACH RWY 09L',fixes:[{id:'CLIMB09L',name:'CLIMB',x:90,y:43,altitudeFt:1500,speedKt:170},{id:'HLDATL',name:'HOLD EAST',x:80,y:25,altitudeFt:5000,speedKt:210}]},
      holds:[{id:'ATLHLD',name:'ATL EAST HOLD',fix:'HLDATL',x:80,y:25,inboundCourse:270,legNm:6,altitudeFt:5000}]
    }
  }
});
let activeProcedureSet = null;
function copyFix(f){ return f ? {id:f.id,name:f.name,x:Number(f.x),y:Number(f.y),altitudeFt:Number(f.altitudeFt||0),speedKt:Number(f.speedKt||0)} : null; }
function procedureSetForAirport(icao){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  return PUBLISHED_PROCEDURES_CATALOG.airports[code] || PUBLISHED_PROCEDURES_CATALOG.airports.SBGR;
}
function primaryStar(set=activeProcedureSet){ return (set?.stars||[])[0] || null; }
function primarySid(set=activeProcedureSet){ return (set?.sids||[])[0] || null; }
function primaryApproach(set=activeProcedureSet){ return (set?.approaches||[])[0] || null; }
function initializeProceduresLayer(){
  const set=procedureSetForAirport(airport?.()?.icao);
  activeProcedureSet=set;
  try{
    const star=primaryStar(set), sid=primarySid(set), app=primaryApproach(set);
    if(PROCEDURE_LAYER){
      PROCEDURE_LAYER.routes=[
        ...(star?[{id:star.id,type:'arrival',color:'rgba(91,240,109,.58)',pts:star.fixes.map(copyFix)}]:[]),
        ...(sid?[{id:sid.id,type:'departure',color:'rgba(88,183,255,.54)',pts:sid.fixes.map(copyFix)}]:[]),
        ...(set.missedApproach?[{id:set.missedApproach.id,type:'missed',color:'rgba(255,191,61,.55)',pts:set.missedApproach.fixes.map(copyFix)}]:[])
      ];
      PROCEDURE_LAYER.fixes=[...(star?.fixes||[]),...(sid?.fixes||[]),...(app?.fixes||[])].slice(0,12).map(f=>({id:f.id,name:f.name,x:f.x,y:f.y,type:f.id.includes('FAF')?'final':f.id.includes('DER')?'departure':'arrival'}));
      if(app?.fixes?.length){ const last=app.fixes[app.fixes.length-1]; const faf=app.fixes[Math.max(0,app.fixes.length-2)]; PROCEDURE_LAYER.ils={...(PROCEDURE_LAYER.ils||{}),name:app.name,threshold:{x:last.x,y:last.y},faf:{x:faf.x,y:faf.y},minimums:app.minimums}; }
    }
    return set;
  }catch(e){ safeLogError?.(e,'initialize-procedures-layer'); return set; }
}
function assignProcedureToAircraft(plane, procedure, mode){
  if(!plane||!procedure) return plane;
  plane.procedureId=procedure.id;
  plane.procedureName=procedure.name;
  plane.procedureType=procedure.type || mode;
  plane.procedureFixes=(procedure.fixes||[]).map(copyFix).filter(Boolean);
  plane.procedureLeg=0;
  plane.nextFix=plane.procedureFixes[0]?.id || null;
  return plane;
}
function assignArrivalProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  const approach=primaryApproach(set), star=primaryStar(set);
  const procedure = approach || star;
  return assignProcedureToAircraft(plane, procedure, 'APPROACH');
}
function assignDepartureProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  return assignProcedureToAircraft(plane, primarySid(set), 'SID');
}
function assignMissedApproachProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  return assignProcedureToAircraft(plane, set?.missedApproach, 'MISSED');
}
function assignHoldingPattern(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  const hold=(set?.holds||[])[0];
  if(!plane||!hold) return plane;
  plane.holdingPattern={...hold};
  plane.procedureId=hold.id;
  plane.procedureName=hold.name;
  plane.procedureType='HOLD';
  plane.nextFix=hold.fix;
  return plane;
}
function procedureGuidance(plane){
  if(!plane||!Array.isArray(plane.procedureFixes)||!plane.procedureFixes.length) return null;
  const fix=plane.procedureFixes[Math.min(plane.procedureLeg||0, plane.procedureFixes.length-1)];
  if(!fix) return null;
  const distance=Math.hypot((plane.x||0)-fix.x,(plane.y||0)-fix.y);
  if(distance<4 && (plane.procedureLeg||0)<plane.procedureFixes.length-1){
    plane.procedureLeg=(plane.procedureLeg||0)+1;
    plane.nextFix=plane.procedureFixes[plane.procedureLeg]?.id || null;
    return plane.procedureFixes[plane.procedureLeg];
  }
  return fix;
}
function stepProcedureGuidance(plane, phase){
  const fix=procedureGuidance(plane);
  if(!fix) return null;
  plane.heading += shortTurn?.(plane.heading||0, headingTo(plane,fix))*.03;
  if(fix.altitudeFt!==undefined){
    const targetFl=Math.round(Number(fix.altitudeFt||0)/100);
    if(phase==='SID'||plane.kind==='departure') plane.targetAlt=Math.max(plane.targetAlt||0,targetFl);
    else plane.targetAlt=Math.min(plane.targetAlt||targetFl,targetFl);
  }
  if(fix.speedKt) plane.targetSpeed=fix.speedKt;
  return fix;
}
function procedureClearancePhrase(plane,type){
  if(!plane) return 'Sem aeronave.';
  if(type==='STAR') return `${plane.id} autorizado chegada ${primaryStar()?.id||'STAR'} pista ${runway?.name||''}.`;
  if(type==='SID') return `${plane.id} autorizado saída ${primarySid()?.id||'SID'} pista ${runway?.name||''}.`;
  if(type==='MISSED') return `${plane.id} execute aproximação perdida publicada.`;
  if(type==='HOLD') return `${plane.id} entre em espera ${plane.holdingPattern?.id||primaryStar()?.id||''}.`;
  return `${plane.id} autorizado procedimento publicado.`;
}
function procedureMinimumRisk(){
  const app=primaryApproach(activeProcedureSet||initializeProceduresLayer());
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  if(!app||!wx) return {level:'ok',block:false,msg:''};
  const rvr=app.minimums?.rvrMeters||0;
  if(wx.rvrMeters && rvr && wx.rvrMeters<rvr) return {level:'danger',block:true,msg:`RVR ${wx.rvrMeters}m abaixo do mínimo ${rvr}m para ${app.id}.`};
  if(wx.flightRules==='LIFR' && (app.minimums?.decisionAltitudeFt||0)>500) return {level:'warn',block:false,msg:`LIFR: confirmar mínimos ${app.id}.`};
  return {level:'ok',block:false,msg:''};
}
function drawPublishedProceduresOverlay(ctx,w,h){
  try{
    const set=activeProcedureSet||initializeProceduresLayer(); if(!set||!ctx) return;
    const P=o=>({x:o.x/100*w,y:o.y/100*h});
    const draw=(procedure,color,label)=>{
      if(!procedure?.fixes?.length) return;
      ctx.save(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=Math.max(1.5,w*.0018); ctx.setLineDash([8,7]); ctx.beginPath();
      procedure.fixes.forEach((f,i)=>{ const p=P(f); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
      ctx.stroke(); ctx.setLineDash([]);
      procedure.fixes.forEach(f=>{ const p=P(f); ctx.beginPath(); ctx.arc(p.x,p.y,3.2,0,Math.PI*2); ctx.fill(); ctx.font='800 9px ui-monospace'; ctx.fillText(f.id,p.x+5,p.y-5); });
      const m=P(procedure.fixes[Math.floor(procedure.fixes.length/2)]); ctx.font='900 10px ui-monospace'; ctx.fillText(label||procedure.id,m.x+8,m.y+11); ctx.restore();
    };
    draw(primaryStar(set),'rgba(91,240,109,.60)',primaryStar(set)?.id);
    draw(primarySid(set),'rgba(88,183,255,.55)',primarySid(set)?.id);
    if(set.missedApproach) draw(set.missedApproach,'rgba(255,191,61,.58)',set.missedApproach.id);
    (set.holds||[]).forEach(h=>{ const p=P(h); ctx.save(); ctx.strokeStyle='rgba(255,191,61,.75)'; ctx.setLineDash([5,5]); ctx.beginPath(); ctx.ellipse(p.x,p.y,24,12,-.2,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='rgba(255,191,61,.90)'; ctx.font='900 10px ui-monospace'; ctx.fillText(h.id,p.x+12,p.y-12); ctx.restore(); });
  }catch(e){ safeLogError?.(e,'draw-published-procedures'); }
}
function proceduresSelfCheck(){
  const issues=[]; const airports=PUBLISHED_PROCEDURES_CATALOG.airports||{}; const keys=Object.keys(airports);
  if(keys.length<3) issues.push('menos de 3 aeroportos com procedimentos');
  keys.forEach(code=>{ const a=airports[code]; if(!(a.stars||[]).length) issues.push(`${code} sem STAR`); if(!(a.sids||[]).length) issues.push(`${code} sem SID`); if(!(a.approaches||[]).length) issues.push(`${code} sem approach`); if(!a.missedApproach) issues.push(`${code} sem missed approach`); if(!(a.holds||[]).length) issues.push(`${code} sem hold`); });
  return {ok:issues.length===0,issues,airports:keys.length};
}
window.SKYWARD_PROCEDURES=Object.freeze({
  schema:1,
  catalog:PUBLISHED_PROCEDURES_CATALOG,
  getSet:procedureSetForAirport,
  initialize:initializeProceduresLayer,
  assignArrival:assignArrivalProcedure,
  assignDeparture:assignDepartureProcedure,
  assignMissed:assignMissedApproachProcedure,
  assignHold:assignHoldingPattern,
  stepGuidance:stepProcedureGuidance,
  phrase:procedureClearancePhrase,
  minimumRisk:procedureMinimumRisk,
  draw:drawPublishedProceduresOverlay,
  selfCheck:proceduresSelfCheck
});
