/* @skyward-module 20-controller-career
 * Deep controller career: licenses, ratings, fatigue, promotions, shift history and reputation.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('20-controller-career');
const CONTROLLER_CAREER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f17',
  licenses:[
    {id:'STUDENT',name:'Aluno Controlador',minXp:0,maxComplexity:1.0,permissions:['OBSERVE','BASIC_GROUND']},
    {id:'LOCAL_GROUND',name:'Licença Solo Local',minXp:900,maxComplexity:1.2,permissions:['GROUND','PUSHBACK','TAXI']},
    {id:'LOCAL_TOWER',name:'Licença Torre Local',minXp:2200,maxComplexity:1.45,permissions:['GROUND','TOWER','TAKEOFF','LANDING']},
    {id:'APP_PROCEDURAL',name:'Aproximação Procedural',minXp:5200,maxComplexity:1.75,permissions:['TOWER','APP','STAR','SID','HOLD']},
    {id:'APP_RADAR',name:'Aproximação Radar',minXp:9500,maxComplexity:2.0,permissions:['APP','RADAR','IFR','RNAV','ILS']},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minXp:15000,maxComplexity:2.4,permissions:['SUPERVISE','EMERGENCY','INTERNATIONAL_HUB']}
  ],
  ratings:[
    {id:'TWR_TRAINEE',name:'Tower Trainee',minShifts:0,minSafety:0},
    {id:'GROUND_CERTIFIED',name:'Ground Certified',minShifts:3,minSafety:65},
    {id:'TOWER_CERTIFIED',name:'Tower Certified',minShifts:7,minSafety:72},
    {id:'APPROACH_RATED',name:'Approach Rated',minShifts:12,minSafety:78},
    {id:'IFR_RATED',name:'IFR / Low Visibility Rated',minShifts:18,minSafety:82},
    {id:'SENIOR_CONTROLLER',name:'Senior Controller',minShifts:28,minSafety:86}
  ],
  shiftTypes:[
    {id:'DAY_VFR',name:'Turno diurno VFR',fatigue:4,reputationWeight:1.0},
    {id:'NIGHT_IFR',name:'Turno noturno IFR',fatigue:8,reputationWeight:1.25},
    {id:'PEAK_HUB',name:'Pico de hub internacional',fatigue:11,reputationWeight:1.45},
    {id:'LOW_VIS',name:'Baixa visibilidade / LIFR',fatigue:13,reputationWeight:1.6},
    {id:'EMERGENCY_DESK',name:'Mesa de emergência',fatigue:15,reputationWeight:1.8}
  ],
  fatigueBands:[
    {id:'FIT',name:'Apto',max:25},{id:'TIRED',name:'Cansado',max:55},{id:'FATIGUED',name:'Fadigado',max:78},{id:'UNSAFE',name:'Inseguro',max:100}
  ],
  reputationBands:[
    {id:'LOCAL',name:'Local',min:0},{id:'REGIONAL',name:'Regional',min:120},{id:'NATIONAL',name:'Nacional',min:300},{id:'INTERNATIONAL',name:'Internacional',min:650},{id:'ELITE',name:'Elite',min:1100}
  ]
});
const CAREER_KEY='skywardCareer_v1';
let controllerCareer = {
  schema:1,
  totalXp:0,
  licenseId:'STUDENT',
  ratingId:'TWR_TRAINEE',
  reputation:0,
  fatigue:0,
  shifts:0,
  averageSafety:100,
  promotions:[],
  history:[],
  lastShift:null
};
function careerClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function careerLicenseForXp(xp){
  const list=CONTROLLER_CAREER_CATALOG.licenses.slice().sort((a,b)=>a.minXp-b.minXp);
  return list.filter(l=>xp>=l.minXp).pop() || list[0];
}
function careerRatingFor(shifts, averageSafety){
  const list=CONTROLLER_CAREER_CATALOG.ratings.slice().sort((a,b)=>a.minShifts-b.minShifts);
  return list.filter(r=>shifts>=r.minShifts && averageSafety>=r.minSafety).pop() || list[0];
}
function careerFatigueBand(fatigue){
  return CONTROLLER_CAREER_CATALOG.fatigueBands.find(b=>fatigue<=b.max) || CONTROLLER_CAREER_CATALOG.fatigueBands.at(-1);
}
function careerReputationBand(rep){
  return CONTROLLER_CAREER_CATALOG.reputationBands.slice().sort((a,b)=>a.min-b.min).filter(b=>rep>=b.min).pop() || CONTROLLER_CAREER_CATALOG.reputationBands[0];
}
function determineShiftType(stats={}){
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  if((stats.emergencies||0)>0 || (stats.maydayResolved||0)>0) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='EMERGENCY_DESK');
  if(wx?.flightRules==='LIFR' || (wx?.rvrMeters||9999)<1500) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='LOW_VIS');
  if((airportOpsProfile?.()?.complexity||1)>1.3 || (stats.requests||0)>10) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='PEAK_HUB');
  if(wx?.flightRules==='IFR') return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='NIGHT_IFR');
  return CONTROLLER_CAREER_CATALOG.shiftTypes[0];
}
function computeShiftSafety(finalScore, shiftStats={}, fail=false){
  let safety=100;
  safety-=Math.min(35,(shiftStats.conflicts||0)*8);
  safety-=Math.min(28,(shiftStats.runwayIncursions||0)*14);
  safety-=Math.min(22,(shiftStats.surfaceConflicts||0)*8);
  safety-=Math.min(18,(shiftStats.denied||0)*3);
  safety-=Math.min(14,(shiftStats.damaged||0)*7);
  safety+=Math.min(10,(shiftStats.maydayResolved||0)*5);
  safety+=Math.min(8,Math.floor((shiftStats.landed||0)/3));
  safety+=Math.min(8,Math.floor((shiftStats.departed||0)/3));
  if(fail) safety-=25;
  if(finalScore>2500) safety+=4;
  return Math.round(careerClamp(safety,0,100));
}
function loadCareer(){
  try{
    const raw=localStorage?.getItem?.(CAREER_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed?.schema===1) controllerCareer={...controllerCareer,...parsed};
    }
  }catch(e){ safeLogError?.(e,'career-load'); }
  return controllerCareer;
}
function saveCareer(){
  try{ localStorage?.setItem?.(CAREER_KEY,JSON.stringify(controllerCareer)); }catch(e){ safeLogError?.(e,'career-save'); }
  return controllerCareer;
}
function initializeCareerProfile(){
  loadCareer();
  const license=careerLicenseForXp(controllerCareer.totalXp);
  const rating=careerRatingFor(controllerCareer.shifts,controllerCareer.averageSafety);
  controllerCareer.licenseId=license.id;
  controllerCareer.ratingId=rating.id;
  renderCareerBoard();
  return controllerCareer;
}
function updateCareerAfterShift(finalScore=0, shiftStats={}, fail=false, airportCode=''){
  initializeCareerProfile();
  const type=determineShiftType(shiftStats);
  const safety=computeShiftSafety(finalScore,shiftStats,fail);
  const xpGain=Math.max(0,Math.round(finalScore/6 + (shiftStats.landed||0)*35 + (shiftStats.departed||0)*28 + (shiftStats.maydayResolved||0)*120 - (fail?180:0)));
  const repDelta=Math.round(((safety-55)/4 + Math.max(0,finalScore)/180) * (type?.reputationWeight||1));
  const fatigueDelta=(type?.fatigue||5)+Math.min(22,Math.round((shiftStats.commands||0)/9))+Math.min(12,(shiftStats.emergencies||0)*5);
  const oldLicense=controllerCareer.licenseId, oldRating=controllerCareer.ratingId;
  controllerCareer.totalXp=Math.max(0,(controllerCareer.totalXp||0)+xpGain);
  controllerCareer.reputation=Math.max(0,(controllerCareer.reputation||0)+repDelta);
  controllerCareer.fatigue=careerClamp((controllerCareer.fatigue||0)+fatigueDelta-(fail?0:4),0,100);
  controllerCareer.shifts=(controllerCareer.shifts||0)+1;
  controllerCareer.averageSafety=Math.round((((controllerCareer.averageSafety||100)*(controllerCareer.shifts-1))+safety)/controllerCareer.shifts);
  const newLicense=careerLicenseForXp(controllerCareer.totalXp);
  const newRating=careerRatingFor(controllerCareer.shifts,controllerCareer.averageSafety);
  controllerCareer.licenseId=newLicense.id;
  controllerCareer.ratingId=newRating.id;
  const promoted=[];
  if(oldLicense!==newLicense.id) promoted.push(`Licença: ${newLicense.name}`);
  if(oldRating!==newRating.id) promoted.push(`Rating: ${newRating.name}`);
  if(promoted.length) controllerCareer.promotions.unshift({build:BUILD,at:new Date().toISOString(),items:promoted});
  controllerCareer.lastShift={build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore,safety,xpGain,repDelta,fatigueDelta,shiftType:type?.id||'DAY_VFR',failed:Boolean(fail)};
  controllerCareer.history.unshift(controllerCareer.lastShift);
  controllerCareer.history=controllerCareer.history.slice(0,30);
  saveCareer();
  renderCareerBoard();
  return {career:controllerCareer,shift:controllerCareer.lastShift,promoted};
}
function restCareer(hours=8){
  initializeCareerProfile();
  controllerCareer.fatigue=careerClamp((controllerCareer.fatigue||0)-Number(hours||8)*4,0,100);
  saveCareer(); renderCareerBoard();
  return controllerCareer;
}
function careerStatus(){
  initializeCareerProfile();
  const license=CONTROLLER_CAREER_CATALOG.licenses.find(l=>l.id===controllerCareer.licenseId)||CONTROLLER_CAREER_CATALOG.licenses[0];
  const rating=CONTROLLER_CAREER_CATALOG.ratings.find(r=>r.id===controllerCareer.ratingId)||CONTROLLER_CAREER_CATALOG.ratings[0];
  return { ...controllerCareer, license, rating, fatigueBand:careerFatigueBand(controllerCareer.fatigue||0), reputationBand:careerReputationBand(controllerCareer.reputation||0) };
}
function careerRiskForShift(){
  const s=careerStatus();
  if(s.fatigue>=82) return {level:'danger',block:true,msg:'Fadiga insegura: descanso obrigatório antes do turno.'};
  if(s.fatigue>=65) return {level:'warn',block:false,msg:'Fadiga elevada: risco de erro operacional aumentado.'};
  return {level:'ok',block:false,msg:''};
}
function renderCareerBoard(){
  try{
    const anchor=document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#careerOpsInline'); if(old) old.remove();
    const s=careerStatus();
    anchor.insertAdjacentHTML('afterend',`<div id="careerOpsInline" class="airport-ops-board career-ops-inline">
      <div class="airport-ops-head"><b>CARREIRA ATC</b><span>${s.reputationBand.name}</span></div>
      <div class="airport-ops-grid">
        <div><small>LICENÇA</small><b>${s.license.name}</b></div>
        <div><small>RATING</small><b>${s.rating.name}</b></div>
        <div><small>XP</small><b>${Math.round(s.totalXp)}</b></div>
        <div><small>REPUTAÇÃO</small><b>${Math.round(s.reputation)}</b></div>
        <div><small>FADIGA</small><b>${Math.round(s.fatigue)}% ${s.fatigueBand.name}</b></div>
        <div><small>SEGURANÇA</small><b>${Math.round(s.averageSafety)}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'career-board'); }
}
function careerSelfCheck(){
  const issues=[];
  if(CONTROLLER_CAREER_CATALOG.licenses.length<5) issues.push('licenças insuficientes');
  if(CONTROLLER_CAREER_CATALOG.ratings.length<5) issues.push('ratings insuficientes');
  if(careerLicenseForXp(16000).id!=='SUPERVISOR') issues.push('licença supervisor não alcançada por XP');
  if(careerRatingFor(30,90).id!=='SENIOR_CONTROLLER') issues.push('rating senior não alcançado');
  const safe=computeShiftSafety(3000,{landed:5,departed:4,conflicts:0,denied:0},false);
  const bad=computeShiftSafety(300,{conflicts:4,runwayIncursions:2,denied:5},true);
  if(!(safe>bad)) issues.push('safety bom não supera turno ruim');
  return {ok:issues.length===0,issues,licenses:CONTROLLER_CAREER_CATALOG.licenses.length,ratings:CONTROLLER_CAREER_CATALOG.ratings.length};
}
window.SKYWARD_CAREER=Object.freeze({
  schema:1,
  catalog:CONTROLLER_CAREER_CATALOG,
  load:loadCareer,
  save:saveCareer,
  initialize:initializeCareerProfile,
  evaluate:updateCareerAfterShift,
  status:careerStatus,
  rest:restCareer,
  fatigueBand:careerFatigueBand,
  reputationBand:careerReputationBand,
  licenseForXp:careerLicenseForXp,
  ratingFor:careerRatingFor,
  safety:computeShiftSafety,
  shiftType:determineShiftType,
  risk:careerRiskForShift,
  selfCheck:careerSelfCheck
});
