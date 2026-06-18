/* @skyward-module 16-airport-surface-graph
 * Realistic airport surface graph, taxiways, gates and runway occupancy helpers.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('16-airport-surface-graph');
const AIRPORT_SURFACE_CATALOG = Object.freeze({
  schema: 1,
  version: '2026.06-f13',
  airports: {
    SBGR: { airport:'SBGR', displayName:'São Paulo / Guarulhos', activeRunway:'09R/27L', finalFix:{x:50,y:24},
      runways:[
        { id:'09R/27L', x1:17, y1:49, x2:84, y2:49, width:6.0, heading:90, lineup:{x:24,y:49}, departureEnd:{x:18,y:49}, arrivalThreshold:{x:82,y:49}, exits:[{id:'E1',x:33,y:54},{id:'E2',x:47,y:54},{id:'E3',x:60,y:54},{id:'E4',x:72,y:54}] },
        { id:'09L/27R', x1:18, y1:58, x2:83, y2:58, width:5.0, heading:90, secondary:true }
      ],
      holdingPoints:[
        {id:'HS1',x:33,y:56,runway:'09R/27L',lineup:{x:25,y:49}}, {id:'HS2',x:48,y:56,runway:'09R/27L',lineup:{x:27,y:49}},
        {id:'HS3',x:63,y:56,runway:'09R/27L',lineup:{x:29,y:49}}, {id:'HS4',x:76,y:56,runway:'09R/27L',lineup:{x:31,y:49}}
      ],
      taxiways:[
        {id:'A', points:[{x:24,y:56},{x:82,y:56}]}, {id:'B', points:[{x:58,y:64},{x:80,y:64}]}, {id:'C', points:[{x:58,y:72},{x:80,y:72}]},
        {id:'L1', points:[{x:58,y:56},{x:58,y:76}]}, {id:'L2', points:[{x:66,y:56},{x:66,y:76}]}, {id:'L3', points:[{x:74,y:56},{x:74,y:76}]}
      ],
      gates:[
        {id:'T1',label:'T',x:58,y:76,pushback:{x:58,y:72},routeToHolding:['PB1','N1','HS2']}, {id:'T2',label:'T',x:66,y:76,pushback:{x:66,y:72},routeToHolding:['PB2','N2','HS3']},
        {id:'T3',label:'T',x:74,y:76,pushback:{x:74,y:72},routeToHolding:['PB3','N3','HS4']}, {id:'S1',label:'S',x:60,y:68,pushback:{x:60,y:64},routeToHolding:['PB4','N4','HS2']},
        {id:'S2',label:'S',x:68,y:68,pushback:{x:68,y:64},routeToHolding:['PB5','N5','HS3']}, {id:'S3',label:'S',x:76,y:68,pushback:{x:76,y:64},routeToHolding:['PB6','N6','HS4']}
      ],
      nodes:{ PB1:{x:58,y:72},PB2:{x:66,y:72},PB3:{x:74,y:72},PB4:{x:60,y:64},PB5:{x:68,y:64},PB6:{x:76,y:64},N1:{x:58,y:56},N2:{x:66,y:56},N3:{x:74,y:56},N4:{x:60,y:56},N5:{x:68,y:56},N6:{x:76,y:56},HS1:{x:33,y:56},HS2:{x:48,y:56},HS3:{x:63,y:56},HS4:{x:76,y:56} }
    },
    SBSP: { airport:'SBSP', displayName:'São Paulo / Congonhas', activeRunway:'17R/35L', finalFix:{x:61,y:22},
      runways:[{id:'17R/35L',x1:36,y1:18,x2:68,y2:82,width:5.6,heading:170,lineup:{x:46,y:38},departureEnd:{x:40,y:28},arrivalThreshold:{x:64,y:74},exits:[{id:'E1',x:58,y:64},{id:'E2',x:53,y:55},{id:'E3',x:48,y:46}]}],
      holdingPoints:[{id:'HS1',x:42,y:48,runway:'17R/35L',lineup:{x:46,y:39}},{id:'HS2',x:50,y:56,runway:'17R/35L',lineup:{x:48,y:43}}],
      taxiways:[{id:'P',points:[{x:40,y:50},{x:58,y:68}]},{id:'Q',points:[{x:46,y:42},{x:60,y:56}]},{id:'R',points:[{x:48,y:60},{x:72,y:84}]},{id:'TERM',points:[{x:58,y:68},{x:80,y:68}]},{id:'TERM2',points:[{x:56,y:60},{x:78,y:60}]}],
      gates:[{id:'P1',label:'P',x:78,y:68,pushback:{x:74,y:68},routeToHolding:['PB1','N1','HS2']},{id:'P2',label:'P',x:72,y:68,pushback:{x:68,y:68},routeToHolding:['PB2','N2','HS2']},{id:'Q1',label:'Q',x:76,y:60,pushback:{x:72,y:60},routeToHolding:['PB3','N3','HS1']},{id:'Q2',label:'Q',x:70,y:60,pushback:{x:66,y:60},routeToHolding:['PB4','N4','HS1']}],
      nodes:{PB1:{x:74,y:68},PB2:{x:68,y:68},PB3:{x:72,y:60},PB4:{x:66,y:60},N1:{x:58,y:68},N2:{x:56,y:66},N3:{x:56,y:60},N4:{x:52,y:56},HS1:{x:42,y:48},HS2:{x:50,y:56}}
    },
    SBKP: { airport:'SBKP', displayName:'Viracopos / Campinas', activeRunway:'15/33', finalFix:{x:44,y:20},
      runways:[{id:'15/33',x1:24,y1:20,x2:76,y2:80,width:5.4,heading:150,lineup:{x:34,y:32},departureEnd:{x:28,y:24},arrivalThreshold:{x:72,y:76},exits:[{id:'E1',x:49,y:49},{id:'E2',x:57,y:57},{id:'E3',x:66,y:67}]}],
      holdingPoints:[{id:'HS1',x:34,y:44,runway:'15/33',lineup:{x:36,y:34}},{id:'HS2',x:46,y:56,runway:'15/33',lineup:{x:38,y:36}}],
      taxiways:[{id:'A',points:[{x:32,y:44},{x:58,y:70}]},{id:'B',points:[{x:38,y:36},{x:64,y:62}]},{id:'C',points:[{x:58,y:70},{x:82,y:70}]},{id:'D',points:[{x:52,y:62},{x:80,y:62}]}],
      gates:[{id:'C1',label:'C',x:80,y:70,pushback:{x:76,y:70},routeToHolding:['PB1','N1','HS2']},{id:'C2',label:'C',x:74,y:70,pushback:{x:70,y:70},routeToHolding:['PB2','N2','HS2']},{id:'D1',label:'D',x:78,y:62,pushback:{x:74,y:62},routeToHolding:['PB3','N3','HS1']},{id:'D2',label:'D',x:72,y:62,pushback:{x:68,y:62},routeToHolding:['PB4','N4','HS1']}],
      nodes:{PB1:{x:76,y:70},PB2:{x:70,y:70},PB3:{x:74,y:62},PB4:{x:68,y:62},N1:{x:58,y:70},N2:{x:54,y:66},N3:{x:52,y:62},N4:{x:48,y:58},HS1:{x:34,y:44},HS2:{x:46,y:56}}
    },
    SBBR: { airport:'SBBR', displayName:'Brasília', activeRunway:'11L/29R', finalFix:{x:48,y:22},
      runways:[{id:'11L/29R',x1:16,y1:40,x2:84,y2:56,width:5.8,heading:110,lineup:{x:25,y:42},departureEnd:{x:18,y:40},arrivalThreshold:{x:82,y:56},exits:[{id:'E1',x:36,y:48},{id:'E2',x:50,y:50},{id:'E3',x:63,y:52},{id:'E4',x:74,y:55}]},{id:'11R/29L',x1:18,y1:58,x2:82,y2:72,width:4.8,heading:110,secondary:true}],
      holdingPoints:[{id:'HS1',x:34,y:54,runway:'11L/29R',lineup:{x:26,y:43}},{id:'HS2',x:48,y:58,runway:'11L/29R',lineup:{x:28,y:44}},{id:'HS3',x:62,y:61,runway:'11L/29R',lineup:{x:30,y:45}}],
      taxiways:[{id:'A',points:[{x:30,y:54},{x:80,y:66}]},{id:'B',points:[{x:36,y:62},{x:82,y:72}]},{id:'L1',points:[{x:56,y:54},{x:56,y:74}]},{id:'L2',points:[{x:68,y:56},{x:68,y:74}]}],
      gates:[{id:'N1',label:'N',x:56,y:74,pushback:{x:56,y:70},routeToHolding:['PB1','N4','HS2']},{id:'N2',label:'N',x:68,y:74,pushback:{x:68,y:70},routeToHolding:['PB2','N5','HS3']},{id:'M1',label:'M',x:60,y:66,pushback:{x:60,y:62},routeToHolding:['PB3','N6','HS2']},{id:'M2',label:'M',x:72,y:66,pushback:{x:72,y:62},routeToHolding:['PB4','N7','HS3']}],
      nodes:{PB1:{x:56,y:70},PB2:{x:68,y:70},PB3:{x:60,y:62},PB4:{x:72,y:62},N4:{x:56,y:54},N5:{x:68,y:56},N6:{x:60,y:54},N7:{x:72,y:56},HS1:{x:34,y:54},HS2:{x:48,y:58},HS3:{x:62,y:61}}
    },
    KATL: { airport:'KATL', displayName:'Atlanta Hartsfield-Jackson', activeRunway:'09L/27R', finalFix:{x:50,y:22},
      runways:[{id:'09L/27R',x1:14,y1:46,x2:86,y2:46,width:5.8,heading:90,lineup:{x:22,y:46},departureEnd:{x:16,y:46},arrivalThreshold:{x:84,y:46},exits:[{id:'E1',x:30,y:52},{id:'E2',x:42,y:52},{id:'E3',x:54,y:52},{id:'E4',x:66,y:52},{id:'E5',x:78,y:52}]},{id:'08R/26L',x1:14,y1:56,x2:86,y2:56,width:5.2,heading:90,secondary:true},{id:'08L/26R',x1:14,y1:66,x2:86,y2:66,width:4.8,heading:90,secondary:true}],
      holdingPoints:[{id:'HS1',x:28,y:54,runway:'09L/27R',lineup:{x:23,y:46}},{id:'HS2',x:42,y:54,runway:'09L/27R',lineup:{x:25,y:46}},{id:'HS3',x:56,y:54,runway:'09L/27R',lineup:{x:27,y:46}},{id:'HS4',x:70,y:54,runway:'09L/27R',lineup:{x:29,y:46}}],
      taxiways:[{id:'A',points:[{x:20,y:54},{x:82,y:54}]},{id:'B',points:[{x:24,y:62},{x:82,y:62}]},{id:'C',points:[{x:28,y:70},{x:82,y:70}]},{id:'L1',points:[{x:54,y:54},{x:54,y:76}]},{id:'L2',points:[{x:62,y:54},{x:62,y:76}]},{id:'L3',points:[{x:70,y:54},{x:70,y:76}]}],
      gates:[{id:'A1',label:'A',x:54,y:76,pushback:{x:54,y:70},routeToHolding:['PB1','N1','HS3']},{id:'A2',label:'A',x:62,y:76,pushback:{x:62,y:70},routeToHolding:['PB2','N2','HS3']},{id:'A3',label:'A',x:70,y:76,pushback:{x:70,y:70},routeToHolding:['PB3','N3','HS4']},{id:'B1',label:'B',x:58,y:68,pushback:{x:58,y:62},routeToHolding:['PB4','N4','HS2']},{id:'B2',label:'B',x:66,y:68,pushback:{x:66,y:62},routeToHolding:['PB5','N5','HS3']},{id:'B3',label:'B',x:74,y:68,pushback:{x:74,y:62},routeToHolding:['PB6','N6','HS4']}],
      nodes:{PB1:{x:54,y:70},PB2:{x:62,y:70},PB3:{x:70,y:70},PB4:{x:58,y:62},PB5:{x:66,y:62},PB6:{x:74,y:62},N1:{x:54,y:54},N2:{x:62,y:54},N3:{x:70,y:54},N4:{x:58,y:54},N5:{x:66,y:54},N6:{x:74,y:54},HS1:{x:28,y:54},HS2:{x:42,y:54},HS3:{x:56,y:54},HS4:{x:70,y:54}}
    }
  }
});
function copyPoint(p){ return p ? {x:Number(p.x), y:Number(p.y)} : null; }
function cloneRoutePoints(points){ return Array.isArray(points) ? points.filter(Boolean).map(copyPoint).filter(Boolean) : []; }
function graphDefault(){
  return {
    airport: airport()?.icao || 'GEN', displayName: airport()?.name || 'Generic field', activeRunway: runway.name,
    runways:[{ id:runway.name, x1:runway.x1, y1:runway.y1, x2:runway.x2, y2:runway.y2, width:runway.width, heading:Math.round(headingTo({x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2})), lineup:{x:runway.x1+6,y:runway.y1}, departureEnd:{x:runway.x1+2,y:runway.y1}, arrivalThreshold:{x:runway.x2-2,y:runway.y2}, exits:(runway.exits||[]).map((x,i)=>({id:`E${i+1}`,x,y:(runway.y1+runway.y2)/2+6})) }],
    taxiways:[{id:'GEN-A',points:[{x:20,y:58},{x:82,y:58}]},{id:'GEN-B',points:[{x:56,y:58},{x:56,y:78}]},{id:'GEN-C',points:[{x:66,y:58},{x:66,y:78}]}],
    gates:gates.map((g,i)=>({id:`G${i+1}`,label:g.label||'G',x:g.x,y:g.y,pushback:{x:g.x,y:Math.max(8,g.y-6)},routeToHolding:[`PB${i+1}`,`HS${(i%Math.max(1,holdingPoints.length))+1}`]})),
    holdingPoints:holdingPoints.map((h,i)=>({id:`HS${i+1}`,x:h.x,y:h.y,runway:runway.name,lineup:{x:Math.min(runway.x1+10,runway.x2-10),y:runway.y1}})),
    nodes:Object.fromEntries([].concat(gates.map((g,i)=>[[`PB${i+1}`,{x:g.x,y:Math.max(8,g.y-6)}]]), holdingPoints.map((h,i)=>[[`HS${i+1}`,{x:h.x,y:h.y}]])).flat())
  };
}
function airportSurfaceGraphFor(icao){ const code=String(icao||airport()?.icao||'').toUpperCase(); return AIRPORT_SURFACE_CATALOG.airports[code] || graphDefault(); }
function resolveNode(graph,id){ if(!graph||!id) return null; const node=graph.nodes?.[id]; if(node) return copyPoint(node); const gate=(graph.gates||[]).find(g=>g.id===id); if(gate) return {x:Number(gate.x), y:Number(gate.y)}; const hold=(graph.holdingPoints||[]).find(h=>h.id===id); if(hold) return {x:Number(hold.x), y:Number(hold.y)}; return null; }
function resolveSurfaceRoute(graph, route){ if(!Array.isArray(route)) return []; return route.map(id=>typeof id==='string' ? resolveNode(graph,id) : copyPoint(id)).filter(Boolean); }
function applyAirportSurfaceGraph(icao){
  const graph=airportSurfaceGraphFor(icao); activeAirportGraph=graph;
  const active=(graph.runways||[]).find(r=>r.id===graph.activeRunway) || graph.runways?.[0];
  runway={ name:active?.id || runway.name, x1:active?.x1 ?? runway.x1, y1:active?.y1 ?? runway.y1, x2:active?.x2 ?? runway.x2, y2:active?.y2 ?? runway.y2, width:active?.width ?? runway.width, exits:(active?.exits||[]).map(e=>Number(e.x)) };
  gates=(graph.gates||[]).map(g=>({x:Number(g.x), y:Number(g.y), label:g.label||String(g.id||'G').replace(/\d+/g,'').slice(0,1)||'G', id:g.id, pushback:copyPoint(g.pushback), routeToHolding:Array.isArray(g.routeToHolding)?g.routeToHolding.slice():[]}));
  holdingPoints=(graph.holdingPoints||[]).map(h=>({x:Number(h.x), y:Number(h.y), id:h.id, runway:h.runway, lineup:copyPoint(h.lineup)}));
  finalFix=copyPoint(graph.finalFix) || finalFix;
  secondaryRunways=(graph.runways||[]).filter(r=>r.id!==active?.id);
  airportSurfaceState={ activeRunway:runway.name, taxiwayCount:(graph.taxiways||[]).length, gateCount:gates.length, holdingCount:holdingPoints.length };
  if(PROCEDURE_LAYER?.ils && active?.arrivalThreshold){ PROCEDURE_LAYER.ils.threshold=copyPoint(active.arrivalThreshold); PROCEDURE_LAYER.ils.name=`ILS RWY ${runway.name}`; }
  if($('#runwayTextTop')) $('#runwayTextTop').textContent=`RWY ${runway.name}`;
  return graph;
}
function assignDepartureSurfaceRoute(plane, stage){
  if(!plane) return [];
  const graph=activeAirportGraph||airportSurfaceGraphFor();
  const gate=(graph.gates||[]).find(g=>g.id===plane.gateId) || (graph.gates||[])[plane.gateIndex||0] || (graph.gates||[])[0];
  const hold=(graph.holdingPoints||[])[plane.groundIndex||0] || (graph.holdingPoints||[])[0];
  if(stage==='pushback') return gate?.pushback ? [copyPoint(gate.pushback)] : [];
  if(stage==='taxi'){
    const route=resolveSurfaceRoute(graph, gate?.routeToHolding || []);
    if(route.length) return route;
    return [gate?.pushback?copyPoint(gate.pushback):null, hold?copyPoint(hold):null].filter(Boolean);
  }
  if(stage==='lineup') return [copyPoint(hold?.lineup || activeRunwayObject()?.lineup || {x:runway.x1+6,y:runway.y1})].filter(Boolean);
  return [];
}
function activeRunwayObject(){ const graph=activeAirportGraph||airportSurfaceGraphFor(); return (graph.runways||[]).find(r=>r.id===runway.name) || graph.runways?.[0] || null; }
function runwayHeadingValue(){ return Math.round(headingTo({x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2})); }
function nearestRunwayExit(point){ const active=activeRunwayObject(); if(!active||!Array.isArray(active.exits)||!active.exits.length) return null; let best=null, bestD=Infinity; for(const ex of active.exits){ const d=Math.hypot((ex.x??0)-(point?.x??0),(ex.y??0)-(point?.y??0)); if(d<bestD){ best=ex; bestD=d; } } return best ? {id:best.id,x:Number(best.x),y:Number(best.y)} : null; }
function assignArrivalVacateRoute(plane){ const exit=nearestRunwayExit(plane); if(!exit) return []; const graph=activeAirportGraph||airportSurfaceGraphFor(); const taxi=(graph.taxiways||[])[0]; const tail=Array.isArray(taxi?.points)&&taxi.points.length ? copyPoint(taxi.points[Math.max(0,taxi.points.length-1)]) : {x:exit.x+8,y:exit.y+8}; return [copyPoint(exit), tail]; }
function beginSurfaceRoute(plane, route, statusAfter){ if(!plane) return plane; plane.surfaceRoute=cloneRoutePoints(route); plane.surfaceLeg=0; plane.surfaceStatusAfter=statusAfter||null; return plane; }
function stepSurfaceRoute(plane, dt, speedFactor){
  if(!plane||!Array.isArray(plane.surfaceRoute)||!plane.surfaceRoute.length) return true;
  const target=plane.surfaceRoute[Math.min(plane.surfaceLeg||0, plane.surfaceRoute.length-1)];
  if(!target) return true;
  plane.heading=headingTo(plane,target);
  moveToward(plane,target,Math.max(0.04, (speedFactor||SIM_SPEED*.55))*dt);
  if(Math.hypot(plane.x-target.x, plane.y-target.y)<1.3){ plane.surfaceLeg=(plane.surfaceLeg||0)+1; }
  return (plane.surfaceLeg||0) >= plane.surfaceRoute.length;
}
function airportSurfaceSummary(){ const graph=activeAirportGraph||airportSurfaceGraphFor(); return { airport:graph.airport, graph:graph.displayName, runways:(graph.runways||[]).length, taxiways:(graph.taxiways||[]).length, gates:(graph.gates||[]).length, holds:(graph.holdingPoints||[]).length, activeRunway:graph.activeRunway||runway.name } }
function airportSurfaceSelfCheck(){
  try{
    const issues=[]; const graphs=AIRPORT_SURFACE_CATALOG.airports||{}; const keys=Object.keys(graphs); if(keys.length<5) issues.push('menos de 5 aeroportos grafo');
    keys.forEach(code=>{ const g=graphs[code]; if(!g.activeRunway) issues.push(`${code} sem pista ativa`); if(!Array.isArray(g.runways)||!g.runways.length) issues.push(`${code} sem runways`); if(!Array.isArray(g.gates)||!g.gates.length) issues.push(`${code} sem gates`); if(!Array.isArray(g.taxiways)||!g.taxiways.length) issues.push(`${code} sem taxiways`); });
    return { ok:issues.length===0, issues, summary:keys.length };
  }catch(error){ return { ok:false, issues:[error.message] }; }
}
window.SKYWARD_AIRPORT_SURFACE=Object.freeze({ schema:1, catalog:AIRPORT_SURFACE_CATALOG, getGraph:airportSurfaceGraphFor, apply:applyAirportSurfaceGraph, resolveRoute:resolveSurfaceRoute, resolveNode, assignDepartureSurfaceRoute, assignArrivalVacateRoute, beginSurfaceRoute, stepSurfaceRoute, activeRunway:activeRunwayObject, runwayHeading:runwayHeadingValue, nearestRunwayExit, summary:airportSurfaceSummary, selfCheck:airportSurfaceSelfCheck });
