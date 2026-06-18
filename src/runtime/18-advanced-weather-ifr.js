/* @skyward-module 18-advanced-weather-ifr
 * Advanced IFR/VFR weather, wind, visibility, ceiling and runway condition director.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('18-advanced-weather-ifr');
const ADVANCED_WEATHER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f15',
  profiles:{
    VMC_CLEAR:{label:'VMC clear',flightRules:'VFR',visibilityKm:10,ceilingFt:6500,rainMmH:0,windDir:90,windKt:8,gustKt:12,crosswindKt:4,runwayCondition:'DRY',brakingAction:'GOOD',severity:.12,arrivalSpacingNm:5,departureSpacingSec:55},
    IFR_LOW_CEILING:{label:'IFR low ceiling',flightRules:'IFR',visibilityKm:5,ceilingFt:900,rainMmH:.8,windDir:110,windKt:13,gustKt:20,crosswindKt:9,runwayCondition:'DAMP',brakingAction:'GOOD_TO_MEDIUM',severity:.48,arrivalSpacingNm:7,departureSpacingSec:75},
    LIFR_RAIN:{label:'LIFR heavy rain',flightRules:'LIFR',visibilityKm:1.8,ceilingFt:350,rainMmH:7.5,windDir:130,windKt:19,gustKt:31,crosswindKt:16,runwayCondition:'WET',brakingAction:'MEDIUM',severity:.78,arrivalSpacingNm:10,departureSpacingSec:120},
    THUNDERSTORM_CELLS:{label:'TS cells nearby',flightRules:'IFR',visibilityKm:3.2,ceilingFt:1200,rainMmH:12,windDir:240,windKt:22,gustKt:42,crosswindKt:24,runwayCondition:'WET',brakingAction:'MEDIUM_TO_POOR',severity:.92,arrivalSpacingNm:12,departureSpacingSec:150},
    FOG_RVR:{label:'Fog / RVR operations',flightRules:'LIFR',visibilityKm:.8,ceilingFt:180,rainMmH:.2,windDir:70,windKt:5,gustKt:8,crosswindKt:2,runwayCondition:'DAMP',brakingAction:'MEDIUM',severity:.84,arrivalSpacingNm:11,departureSpacingSec:135}
  },
  airportBias:{
    SBGR:['VMC_CLEAR','IFR_LOW_CEILING','LIFR_RAIN','THUNDERSTORM_CELLS'],
    SBSP:['VMC_CLEAR','IFR_LOW_CEILING','FOG_RVR','LIFR_RAIN'],
    SBKP:['VMC_CLEAR','IFR_LOW_CEILING','THUNDERSTORM_CELLS'],
    SBBR:['VMC_CLEAR','IFR_LOW_CEILING','THUNDERSTORM_CELLS'],
    KATL:['VMC_CLEAR','IFR_LOW_CEILING','LIFR_RAIN','THUNDERSTORM_CELLS','FOG_RVR']
  }
});
let advancedWeatherState = {
  schema:1, profileId:'VMC_CLEAR', flightRules:'VFR', visibilityKm:10, ceilingFt:6500,
  windDir:90, windKt:8, gustKt:12, crosswindKt:4, rainMmH:0,
  runwayCondition:'DRY', brakingAction:'GOOD', severity:.12,
  arrivalSpacingNm:5, departureSpacingSec:55, rvrMeters:9999,
  ifrActive:false, updatedAt:0, advisory:['VMC: separação padrão.']
};
function weatherClamp(value,min,max){ return Math.max(min,Math.min(max,Number(value)||0)); }
function cloneWeatherProfile(profile){
  return JSON.parse(JSON.stringify(profile || ADVANCED_WEATHER_CATALOG.profiles.VMC_CLEAR));
}
function weatherProfileForAirport(icao, index){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const bias=ADVANCED_WEATHER_CATALOG.airportBias[code] || Object.keys(ADVANCED_WEATHER_CATALOG.profiles);
  const pick=bias[Math.abs(Math.floor(index||0))%bias.length] || 'VMC_CLEAR';
  return { id:pick, ...cloneWeatherProfile(ADVANCED_WEATHER_CATALOG.profiles[pick]) };
}
function calculateRvrMeters(profile){
  const vis=weatherClamp(profile.visibilityKm,0.05,15);
  const rainPenalty=weatherClamp(profile.rainMmH,0,20)*45;
  const ceilingPenalty=profile.ceilingFt<400 ? 260 : profile.ceilingFt<800 ? 120 : 0;
  return Math.max(350, Math.round(vis*1000 - rainPenalty - ceilingPenalty));
}
function weatherOperationalImpact(profile){
  const p=profile || advancedWeatherState;
  let risk=Math.round((p.severity||0)*55);
  if(p.flightRules==='IFR') risk+=12;
  if(p.flightRules==='LIFR') risk+=24;
  if((p.crosswindKt||0)>18) risk+=18;
  if((p.gustKt||0)-(p.windKt||0)>12) risk+=8;
  if(['WET','DAMP'].includes(p.runwayCondition)) risk+=p.runwayCondition==='WET'?12:5;
  if(String(p.brakingAction).includes('POOR')) risk+=20;
  if((p.rvrMeters||9999)<800) risk+=18;
  return {
    risk:weatherClamp(risk,0,100),
    arrivalSpacingNm:Math.max(5, p.arrivalSpacingNm||5),
    departureSpacingSec:Math.max(55, p.departureSpacingSec||55),
    landingPenalty:Math.round(weatherClamp(risk*.42,0,42)),
    takeoffPenalty:Math.round(weatherClamp(risk*.32,0,34)),
    allowVfr:p.flightRules==='VFR' && (p.visibilityKm||0)>=5 && (p.ceilingFt||0)>=1500
  };
}
function applyAdvancedWeather(profileIdOrProfile){
  try{
    const profile = typeof profileIdOrProfile==='string'
      ? { id:profileIdOrProfile, ...cloneWeatherProfile(ADVANCED_WEATHER_CATALOG.profiles[profileIdOrProfile]) }
      : { id:profileIdOrProfile?.id || profileIdOrProfile?.profileId || 'CUSTOM', ...cloneWeatherProfile(profileIdOrProfile) };
    profile.rvrMeters=calculateRvrMeters(profile);
    const impact=weatherOperationalImpact(profile);
    advancedWeatherState={
      schema:1,
      profileId:profile.id||'CUSTOM',
      flightRules:profile.flightRules||'VFR',
      visibilityKm:weatherClamp(profile.visibilityKm,0.05,20),
      ceilingFt:Math.round(weatherClamp(profile.ceilingFt,0,50000)),
      windDir:Math.round(weatherClamp(profile.windDir,0,360)),
      windKt:Math.round(weatherClamp(profile.windKt,0,90)),
      gustKt:Math.round(weatherClamp(profile.gustKt,0,120)),
      crosswindKt:Math.round(weatherClamp(profile.crosswindKt,0,80)),
      rainMmH:weatherClamp(profile.rainMmH,0,80),
      runwayCondition:profile.runwayCondition||'DRY',
      brakingAction:profile.brakingAction||'GOOD',
      severity:weatherClamp(profile.severity,0,1),
      arrivalSpacingNm:impact.arrivalSpacingNm,
      departureSpacingSec:impact.departureSpacingSec,
      rvrMeters:profile.rvrMeters,
      ifrActive:profile.flightRules!=='VFR',
      updatedAt:performance?.now?.()||Date.now(),
      advisory:buildWeatherAdvisory(profile,impact)
    };
    if(typeof WX_STATE==='object' && WX_STATE){
      WX_STATE.severity=Math.max(WX_STATE.severity||0, advancedWeatherState.severity);
      WX_STATE.visibility=advancedWeatherState.visibilityKm;
      WX_STATE.ceiling=advancedWeatherState.ceilingFt;
      WX_STATE.wind=`${advancedWeatherState.windDir}/${advancedWeatherState.windKt}G${advancedWeatherState.gustKt}`;
      WX_STATE.runwayCondition=advancedWeatherState.runwayCondition;
      WX_STATE.brakingAction=advancedWeatherState.brakingAction;
      WX_STATE.flightRules=advancedWeatherState.flightRules;
    }
    updateWeatherPanel?.();
    return advancedWeatherState;
  }catch(e){ safeLogError?.(e,'advanced-weather-apply'); return advancedWeatherState; }
}
function buildWeatherAdvisory(profile, impact){
  const notes=[];
  notes.push(`${profile.flightRules||'VFR'} • VIS ${profile.visibilityKm} km • TETO ${profile.ceilingFt} ft`);
  notes.push(`Vento ${profile.windDir}/${profile.windKt}G${profile.gustKt} kt • XWIND ${profile.crosswindKt} kt`);
  if(profile.runwayCondition!=='DRY') notes.push(`Pista ${profile.runwayCondition} • frenagem ${profile.brakingAction}`);
  if((profile.rvrMeters||9999)<1500) notes.push(`RVR ${profile.rvrMeters} m: operação de baixa visibilidade`);
  if(impact.risk>70) notes.push('Aumente separação e evite autorizações simultâneas.');
  return notes;
}
function weatherRiskForCommand(cmd, plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  if(cmd==='clearLanding'){
    if(advancedWeatherState.flightRules==='LIFR' && (advancedWeatherState.rvrMeters||9999)<550) return {level:'danger',block:true,msg:'LIFR/RVR abaixo do mínimo: pouso bloqueado.'};
    if((advancedWeatherState.crosswindKt||0)>28) return {level:'danger',block:true,msg:'Crosswind acima do limite operacional.'};
    if(impact.risk>68) return {level:'warn',block:false,msg:`Clima severo: aplicar ${impact.arrivalSpacingNm} NM na final.`};
  }
  if(cmd==='clearTakeoff'){
    if((advancedWeatherState.crosswindKt||0)>32) return {level:'danger',block:true,msg:'Decolagem bloqueada por crosswind severo.'};
    if(String(advancedWeatherState.brakingAction).includes('POOR')) return {level:'warn',block:false,msg:'Frenagem degradada: confirme decolagem e espaçamento.'};
  }
  if(cmd==='vectorFinal' && impact.risk>82) return {level:'warn',block:false,msg:'Células/baixa visibilidade: vetor final com cautela.'};
  return {level:'ok',block:false,msg:''};
}
function advancedWeatherLandingRisk(plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  let risk=impact.landingPenalty;
  if(plane && (plane.speed||0)>(performanceTargetSpeed?.(plane,'FINAL')||160)+18) risk+=14;
  if(advancedWeatherState.runwayCondition==='WET') risk+=8;
  if(String(advancedWeatherState.brakingAction).includes('POOR')) risk+=18;
  if((advancedWeatherState.crosswindKt||0)>18) risk+=Math.round((advancedWeatherState.crosswindKt-18)*1.5);
  return weatherClamp(risk,0,100);
}
function advancedWeatherTakeoffRisk(plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  let risk=impact.takeoffPenalty;
  if((advancedWeatherState.crosswindKt||0)>20) risk+=Math.round((advancedWeatherState.crosswindKt-20)*1.4);
  if(plane && String(plane.performance?.wake||'').includes('H') && advancedWeatherState.flightRules!=='VFR') risk+=4;
  return weatherClamp(risk,0,100);
}
function updateWeatherPanel(){
  try{
    const box=document.querySelector('#weatherOpsBoard') || document.querySelector('#airportOpsBoard');
    if(!box || !box.insertAdjacentHTML) return;
    const existing=document.querySelector('#weatherOpsInline'); if(existing) existing.remove();
    const s=advancedWeatherState;
    box.insertAdjacentHTML('afterend',`<div id="weatherOpsInline" class="airport-ops-board weather-ops-inline">
      <div class="airport-ops-head"><b>WX OPS</b><span>${s.flightRules}</span></div>
      <div class="airport-ops-grid">
        <div><small>VIS</small><b>${s.visibilityKm} KM</b></div>
        <div><small>TETO</small><b>${s.ceilingFt} FT</b></div>
        <div><small>VENTO</small><b>${s.windDir}/${s.windKt}G${s.gustKt}</b></div>
        <div><small>RVR</small><b>${s.rvrMeters} M</b></div>
        <div><small>PISTA</small><b>${s.runwayCondition}</b></div>
        <div><small>FREIO</small><b>${s.brakingAction}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'weather-panel'); }
}
function cycleAdvancedWeather(){
  const bias=ADVANCED_WEATHER_CATALOG.airportBias[String(airport?.()?.icao||'SBGR').toUpperCase()] || Object.keys(ADVANCED_WEATHER_CATALOG.profiles);
  const current=Math.max(0,bias.indexOf(advancedWeatherState.profileId));
  return applyAdvancedWeather(weatherProfileForAirport(airport?.()?.icao, current+1));
}
function initializeAdvancedWeather(){
  const idx=(profile?.turns||0)+(airport?.()?.level||1);
  return applyAdvancedWeather(weatherProfileForAirport(airport?.()?.icao, idx));
}
function advancedWeatherSelfCheck(){
  const issues=[];
  const keys=Object.keys(ADVANCED_WEATHER_CATALOG.profiles||{});
  if(keys.length<5) issues.push('catálogo climático insuficiente');
  keys.forEach(k=>{ const p=ADVANCED_WEATHER_CATALOG.profiles[k]; if(!p.flightRules||!Number.isFinite(p.visibilityKm)||!Number.isFinite(p.ceilingFt)) issues.push(`${k} incompleto`); });
  const low=weatherOperationalImpact({...ADVANCED_WEATHER_CATALOG.profiles.VMC_CLEAR,rvrMeters:9999});
  const severe=weatherOperationalImpact({...ADVANCED_WEATHER_CATALOG.profiles.THUNDERSTORM_CELLS,rvrMeters:calculateRvrMeters(ADVANCED_WEATHER_CATALOG.profiles.THUNDERSTORM_CELLS)});
  if(!(severe.risk>low.risk)) issues.push('risco severo não supera VMC');
  return {ok:issues.length===0,issues,profiles:keys.length};
}
window.SKYWARD_WEATHER_OPS=Object.freeze({
  schema:1,
  catalog:ADVANCED_WEATHER_CATALOG,
  state:()=>advancedWeatherState,
  profileForAirport:weatherProfileForAirport,
  apply:applyAdvancedWeather,
  cycle:cycleAdvancedWeather,
  initialize:initializeAdvancedWeather,
  impact:weatherOperationalImpact,
  commandRisk:weatherRiskForCommand,
  landingRisk:advancedWeatherLandingRisk,
  takeoffRisk:advancedWeatherTakeoffRisk,
  selfCheck:advancedWeatherSelfCheck
});
