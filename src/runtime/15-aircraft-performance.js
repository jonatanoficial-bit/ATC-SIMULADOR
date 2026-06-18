/* @skyward-module 15-aircraft-performance
 * Data-driven aircraft performance envelopes, speeds, fuel burn and phase physics.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('15-aircraft-performance');
const AIRCRAFT_PERFORMANCE_SCHEMA = 1;
const AIRCRAFT_PERFORMANCE_TABLE = Object.freeze({
  A320:Object.freeze({family:'Airbus A320ceo',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:142,finalSpeed:135,minApproachSpeed:128,maxApproachSpeed:220,rotationSpeed:145,initialClimbSpeed:185,holdSpeed:165,taxiSpeed:18,pushbackSpeed:4,accelKtSec:7.0,decelKtSec:6.4,climbFpm:2300,descentFpm:1900,fuelBurn:Object.freeze({arrival:1.00,departure:1.05,hold:1.18,taxi:0.42})}),
  A20N:Object.freeze({family:'Airbus A320neo',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:139,finalSpeed:132,minApproachSpeed:126,maxApproachSpeed:220,rotationSpeed:142,initialClimbSpeed:184,holdSpeed:164,taxiSpeed:18,pushbackSpeed:4,accelKtSec:7.1,decelKtSec:6.5,climbFpm:2450,descentFpm:1900,fuelBurn:Object.freeze({arrival:0.88,departure:0.92,hold:1.06,taxi:0.39})}),
  A321:Object.freeze({family:'Airbus A321',wake:'M',engine:'turbofan',className:'Large narrow-body jet',approachSpeed:150,finalSpeed:142,minApproachSpeed:134,maxApproachSpeed:230,rotationSpeed:151,initialClimbSpeed:195,holdSpeed:170,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.2,decelKtSec:5.7,climbFpm:2050,descentFpm:1850,fuelBurn:Object.freeze({arrival:1.12,departure:1.20,hold:1.28,taxi:0.45})}),
  B738:Object.freeze({family:'Boeing 737-800',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:144,finalSpeed:137,minApproachSpeed:130,maxApproachSpeed:225,rotationSpeed:146,initialClimbSpeed:188,holdSpeed:166,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.9,decelKtSec:6.2,climbFpm:2250,descentFpm:1900,fuelBurn:Object.freeze({arrival:1.02,departure:1.08,hold:1.20,taxi:0.42})}),
  B739:Object.freeze({family:'Boeing 737-900',wake:'M',engine:'turbofan',className:'Long narrow-body jet',approachSpeed:149,finalSpeed:141,minApproachSpeed:134,maxApproachSpeed:225,rotationSpeed:151,initialClimbSpeed:192,holdSpeed:169,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.4,decelKtSec:5.8,climbFpm:2100,descentFpm:1850,fuelBurn:Object.freeze({arrival:1.09,departure:1.16,hold:1.26,taxi:0.44})}),
  B752:Object.freeze({family:'Boeing 757-200',wake:'H',engine:'turbofan',className:'High-performance narrow-body',approachSpeed:154,finalSpeed:146,minApproachSpeed:138,maxApproachSpeed:240,rotationSpeed:156,initialClimbSpeed:205,holdSpeed:180,taxiSpeed:19,pushbackSpeed:4,accelKtSec:7.5,decelKtSec:5.8,climbFpm:2850,descentFpm:2100,fuelBurn:Object.freeze({arrival:1.28,departure:1.38,hold:1.40,taxi:0.50})}),
  E190:Object.freeze({family:'Embraer 190',wake:'M',engine:'turbofan',className:'Regional jet',approachSpeed:132,finalSpeed:126,minApproachSpeed:118,maxApproachSpeed:205,rotationSpeed:130,initialClimbSpeed:170,holdSpeed:150,taxiSpeed:17,pushbackSpeed:4,accelKtSec:7.4,decelKtSec:6.8,climbFpm:2600,descentFpm:1900,fuelBurn:Object.freeze({arrival:0.76,departure:0.82,hold:0.94,taxi:0.34})}),
  B77W:Object.freeze({family:'Boeing 777-300ER',wake:'H',engine:'widebody-turbofan',className:'Wide-body heavy jet',approachSpeed:160,finalSpeed:151,minApproachSpeed:143,maxApproachSpeed:250,rotationSpeed:165,initialClimbSpeed:210,holdSpeed:190,taxiSpeed:20,pushbackSpeed:3,accelKtSec:5.3,decelKtSec:4.8,climbFpm:1900,descentFpm:1800,fuelBurn:Object.freeze({arrival:1.85,departure:2.10,hold:1.92,taxi:0.72})}),
  C208:Object.freeze({family:'Cessna 208 Caravan',wake:'L',engine:'turboprop',className:'Light turboprop',approachSpeed:92,finalSpeed:84,minApproachSpeed:74,maxApproachSpeed:165,rotationSpeed:75,initialClimbSpeed:115,holdSpeed:105,taxiSpeed:14,pushbackSpeed:3,accelKtSec:4.2,decelKtSec:4.8,climbFpm:1050,descentFpm:1200,fuelBurn:Object.freeze({arrival:0.34,departure:0.38,hold:0.44,taxi:0.18})})
});
function aircraftTypeKey(type){ return String(type||'A320').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4) || 'A320'; }
function aircraftPerformanceProfile(type){
  const key=aircraftTypeKey(type);
  return AIRCRAFT_PERFORMANCE_TABLE[key] || AIRCRAFT_PERFORMANCE_TABLE.A320;
}
function normalizeAircraftPerformance(p){
  if(!p) return null;
  const profile=aircraftPerformanceProfile(p.type);
  p.performance={schema:AIRCRAFT_PERFORMANCE_SCHEMA,type:aircraftTypeKey(p.type),family:profile.family,wake:profile.wake,className:profile.className,engine:profile.engine,vRef:profile.finalSpeed,approachSpeed:profile.approachSpeed,holdSpeed:profile.holdSpeed,taxiSpeed:profile.taxiSpeed,climbFpm:profile.climbFpm,descentFpm:profile.descentFpm};
  p.wakeCategory=profile.wake;
  p.targetSpeed=Number.isFinite(p.targetSpeed)?p.targetSpeed:performanceTargetSpeed(p,p.status);
  p.speed=clamp(Number(p.speed)||0,0,profile.maxApproachSpeed+80);
  p.alt=clamp(Number(p.alt)||0,0,500);
  p.targetAlt=clamp(Number(p.targetAlt)||0,0,500);
  return p;
}
function performanceTargetSpeed(p, phase){
  const profile=aircraftPerformanceProfile(p?.type);
  const status=String(phase||p?.status||'APP');
  const wx=(typeof WX_STATE==='object' && WX_STATE) ? Number(WX_STATE.severity||0) : 0;
  const damage=Math.min(18,Number(p?.damage||0)*0.10);
  if(status==='PUSHBACK') return profile.pushbackSpeed;
  if(status==='TAXI') return profile.taxiSpeed;
  if(status==='HOLD_SHORT'||status==='LINEUP'||status==='PARKED'||status==='READY_TAXI') return 0;
  if(status==='DEP') return profile.initialClimbSpeed + Math.min(22,Math.max(0,(Number(p?.alt||0)-20)*0.10));
  if(status==='HOLD') return profile.holdSpeed;
  if(status==='FINAL') return profile.finalSpeed + Math.round(wx*10) + damage;
  if(status==='EMERG') return Math.max(profile.minApproachSpeed, profile.finalSpeed-4 + Math.round(wx*12));
  return profile.approachSpeed + Math.round(wx*8);
}
function approachNumber(current,target,rate){
  current=Number(current)||0; target=Number(target)||0; rate=Math.max(0,Number(rate)||0);
  if(Math.abs(target-current)<=rate) return target;
  return current + Math.sign(target-current)*rate;
}
function aircraftVerticalStep(p,dt,mode){
  const profile=aircraftPerformanceProfile(p?.type);
  const target=clamp(Number(p?.targetAlt ?? p?.alt ?? 0),0,500);
  const current=clamp(Number(p?.alt||0),0,500);
  const wxPenalty=(typeof WX_STATE==='object' && WX_STATE) ? 1+Math.min(.28,Number(WX_STATE.severity||0)*.25) : 1;
  const fpm=mode==='climb'?profile.climbFpm:profile.descentFpm;
  const step=Math.max(.08,(fpm/100/60)*Math.max(.1,dt)*8/wxPenalty);
  return approachNumber(current,target,step);
}
function updateAircraftPerformanceStep(p,dt,phase){
  if(!p) return p;
  const profile=aircraftPerformanceProfile(p.type);
  normalizeAircraftPerformance(p);
  const status=phase||p.status;
  const target=performanceTargetSpeed(p,status);
  const accel=target>=p.speed ? profile.accelKtSec : profile.decelKtSec;
  const wxPenalty=(typeof WX_STATE==='object' && WX_STATE) ? 1+Math.min(.30,Number(WX_STATE.severity||0)*.32) : 1;
  p.targetSpeed=target;
  p.speed=clamp(approachNumber(p.speed,target,accel*Math.max(.05,dt)/wxPenalty),0,profile.maxApproachSpeed+90);
  if(['DEP'].includes(status)) p.alt=aircraftVerticalStep(p,dt,'climb');
  else if(['APP','HOLD','FINAL','EMERG'].includes(status)) p.alt=aircraftVerticalStep(p,dt,'descent');
  p.envelopeState=aircraftEnvelopeState(p);
  return p;
}
function aircraftFuelMultiplier(p){
  const profile=aircraftPerformanceProfile(p?.type);
  const burn=profile.fuelBurn || {};
  let mult=p?.kind==='departure' ? (burn.departure||1) : (burn.arrival||1);
  if(p?.status==='HOLD') mult*=burn.hold||1.15;
  if(['TAXI','PUSHBACK','READY_TAXI','HOLD_SHORT','LINEUP'].includes(String(p?.status))) mult*=burn.taxi||0.45;
  if(p?.emergency) mult*=1.12;
  return mult;
}
function aircraftEnvelopeState(p){
  const profile=aircraftPerformanceProfile(p?.type);
  if(!p) return 'UNKNOWN';
  if(['FINAL','EMERG'].includes(p.status)){
    if((p.speed||0)>profile.finalSpeed+24) return 'FAST_FINAL';
    if((p.speed||0)<profile.minApproachSpeed) return 'SLOW_FINAL';
  }
  if(p.status==='DEP' && (p.speed||0)<profile.rotationSpeed && (p.alt||0)>3) return 'LOW_ENERGY_CLIMB';
  if((p.speed||0)>profile.maxApproachSpeed+55) return 'OVERSPEED';
  return 'NORMAL';
}
function aircraftLandingRisk(p){
  const profile=aircraftPerformanceProfile(p?.type);
  const speedExcess=Math.max(0,Number(p?.speed||0)-(profile.finalSpeed+13));
  const wx=(typeof WX_STATE==='object' && WX_STATE) ? Number(WX_STATE.severity||0)*18 : 0;
  const damage=Number(p?.damage||0)*0.35;
  const lowEnergy=(Number(p?.speed||0)<profile.minApproachSpeed)?18:0;
  return Math.round(speedExcess*1.6+wx+damage+lowEnergy);
}
function performanceTelemetry(p){
  const profile=aircraftPerformanceProfile(p?.type);
  return {type:aircraftTypeKey(p?.type),family:profile.family,wake:profile.wake,vRef:profile.finalSpeed,targetSpeed:performanceTargetSpeed(p,p?.status),envelope:aircraftEnvelopeState(p),fuelMultiplier:Number(aircraftFuelMultiplier(p).toFixed(2))};
}
function validatePerformanceCatalog(catalog){
  const profiles=catalog?.profiles || AIRCRAFT_PERFORMANCE_TABLE;
  const entries=Object.entries(profiles);
  const issues=[];
  if((catalog?.schema || AIRCRAFT_PERFORMANCE_SCHEMA)!==1) issues.push('schema inválido');
  if(entries.length<7) issues.push('menos de 7 perfis');
  for(const [type,p] of entries){
    if(!/^[A-Z0-9]{3,4}$/.test(type)) issues.push(`${type}: código inválido`);
    if(!['L','M','H','J'].includes(p.wake)) issues.push(`${type}: wake inválido`);
    for(const key of ['approachSpeed','finalSpeed','minApproachSpeed','rotationSpeed','initialClimbSpeed','climbFpm','descentFpm','accelKtSec','decelKtSec']) if(!Number.isFinite(Number(p[key])) || Number(p[key])<=0) issues.push(`${type}.${key} inválido`);
    if(Number(p.minApproachSpeed)>=Number(p.finalSpeed) || Number(p.finalSpeed)>=Number(p.approachSpeed)+28) issues.push(`${type}: envelope de aproximação incoerente`);
  }
  return {ok:issues.length===0,issues,total:entries.length};
}
window.SKYWARD_AIRCRAFT_PERFORMANCE=Object.freeze({
  schema:AIRCRAFT_PERFORMANCE_SCHEMA,
  table:AIRCRAFT_PERFORMANCE_TABLE,
  getProfile:aircraftPerformanceProfile,
  normalize:normalizeAircraftPerformance,
  targetSpeed:performanceTargetSpeed,
  step:updateAircraftPerformanceStep,
  fuelMultiplier:aircraftFuelMultiplier,
  envelope:aircraftEnvelopeState,
  landingRisk:aircraftLandingRisk,
  telemetry:performanceTelemetry,
  validateCatalog:validatePerformanceCatalog,
  selfCheck:()=>validatePerformanceCatalog({schema:1,profiles:AIRCRAFT_PERFORMANCE_TABLE})
});
