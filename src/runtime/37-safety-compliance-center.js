/* @skyward-module 37-safety-compliance-center
 * Safety Management System and Compliance Center with audit findings, investigation, root cause and corrective actions.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('37-safety-compliance-center');
const SAFETY_COMPLIANCE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f34',
  auditDomains:[
    {id:'RUNWAY_SAFETY',name:'Segurança de pista',criticality:5,signals:['runwayIncursions','surfaceSafety']},
    {id:'SEPARATION',name:'Separação e conflito',criticality:5,signals:['conflicts','lossOfSeparation']},
    {id:'PROCEDURE',name:'Procedimentos ATC',criticality:4,signals:['denied','wrongClearance']},
    {id:'FATIGUE',name:'Fadiga e prontidão',criticality:4,signals:['fatigue','career']},
    {id:'CRISIS_RESPONSE',name:'Resposta à crise',criticality:5,signals:['crisisScore','recoveryStage']},
    {id:'TERMINAL_RISK',name:'Risco de terminal',criticality:3,signals:['airportAuthority','passengerFlow']},
    {id:'PWA_RELEASE',name:'Publicação PWA',criticality:3,signals:['postPublishHealth','publicOps']}
  ],
  findingSeverity:[
    {id:'OBSERVATION',name:'Observação',risk:15,actionDays:30},
    {id:'MINOR',name:'Não conformidade menor',risk:35,actionDays:21},
    {id:'MAJOR',name:'Não conformidade maior',risk:65,actionDays:10},
    {id:'CRITICAL',name:'Risco crítico',risk:90,actionDays:3}
  ],
  rootCauses:[
    {id:'TRAINING_GAP',name:'Lacuna de treinamento',corrective:'Repetir missão guiada e cards do instrutor'},
    {id:'PROCEDURE_DRIFT',name:'Desvio de procedimento',corrective:'Auditar fraseologia e checklist de autorização'},
    {id:'WORKLOAD',name:'Carga de trabalho excessiva',corrective:'Reduzir taxa, usar hold/slots e redistribuir fluxo'},
    {id:'SYSTEM_FAILURE',name:'Falha de sistema',corrective:'Ativar fallback manual e revisar PWA/cache'},
    {id:'COMMUNICATION',name:'Comunicação deficiente',corrective:'Debrief e reclassificação de prioridades'}
  ],
  correctiveActions:[
    {id:'CAP_TRAINING',name:'Treinamento corretivo',cost:5000,effect:'risk-12'},
    {id:'CAP_CHECKLIST',name:'Checklist obrigatório',cost:3000,effect:'procedure+10'},
    {id:'CAP_RATE_LIMIT',name:'Limite temporário de taxa',cost:8000,effect:'workload-15'},
    {id:'CAP_SYSTEM_FALLBACK',name:'Plano fallback sistema',cost:12000,effect:'systems+12'},
    {id:'CAP_DEBRIEF',name:'Debrief estruturado',cost:2000,effect:'culture+8'}
  ],
  safetyCultureBands:[
    {id:'GENERATIVE',min:90,name:'Cultura generativa'},
    {id:'PROACTIVE',min:75,name:'Cultura proativa'},
    {id:'REACTIVE',min:55,name:'Cultura reativa'},
    {id:'VULNERABLE',min:0,name:'Cultura vulnerável'}
  ]
});
const SAFETY_COMPLIANCE_KEY='skywardSafetyCompliance_v1';
let safetyComplianceState={schema:1,findings:[],correctivePlan:[],closedFindings:[],safetyCultureScore:82,complianceStatus:'PROACTIVE',history:[],lastEvaluation:null};
function loadSafetyCompliance(){
  try{ const raw=localStorage?.getItem?.(SAFETY_COMPLIANCE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) safetyComplianceState={...safetyComplianceState,...parsed}; } }catch(e){ safeLogError?.(e,'safety-compliance-load'); }
  return safetyComplianceState;
}
function saveSafetyCompliance(){
  try{ localStorage?.setItem?.(SAFETY_COMPLIANCE_KEY,JSON.stringify(safetyComplianceState)); }catch(e){ safeLogError?.(e,'safety-compliance-save'); }
  return safetyComplianceState;
}
function bandForSafetyCulture(score){
  return SAFETY_COMPLIANCE_CATALOG.safetyCultureBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SAFETY_COMPLIANCE_CATALOG.safetyCultureBands.at(-1);
}
function severityForRisk(risk){
  return SAFETY_COMPLIANCE_CATALOG.findingSeverity.slice().sort((a,b)=>b.risk-a.risk).find(s=>risk>=s.risk)||SAFETY_COMPLIANCE_CATALOG.findingSeverity[0];
}
function rootCauseFor(domainId,statsObj={},signals={}){
  if(domainId==='RUNWAY_SAFETY' || domainId==='SEPARATION') return 'TRAINING_GAP';
  if(domainId==='PROCEDURE') return 'PROCEDURE_DRIFT';
  if(domainId==='FATIGUE' || Number(signals.fatigue||0)>70) return 'WORKLOAD';
  if(domainId==='PWA_RELEASE') return 'SYSTEM_FAILURE';
  if(domainId==='CRISIS_RESPONSE') return 'COMMUNICATION';
  return 'WORKLOAD';
}
function correctiveForRoot(rootId){
  if(rootId==='TRAINING_GAP') return 'CAP_TRAINING';
  if(rootId==='PROCEDURE_DRIFT') return 'CAP_CHECKLIST';
  if(rootId==='WORKLOAD') return 'CAP_RATE_LIMIT';
  if(rootId==='SYSTEM_FAILURE') return 'CAP_SYSTEM_FALLBACK';
  return 'CAP_DEBRIEF';
}
function collectSafetySignals(finalScore=0,statsObj={},fail=false){
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const coach=window.SKYWARD_TRAINING_COACH?.status?.()||{};
  const postPublish=window.SKYWARD_POST_PUBLISH_HEALTH?.status?.()||{};
  const publicOps=window.SKYWARD_PUBLIC_OPS?.status?.()||{};
  return {
    finalScore:Number(finalScore||0),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    denied:Number(statsObj.denied||0),
    fail:Boolean(fail),
    crisisScore:Number(crisis.progress?.score ?? 100),
    airportExperience:Number(airportAuth.progress?.score ?? 85),
    airlineScore:Number(airline.progress?.score ?? 85),
    coachScore:Number(coach.progress?.coachScore ?? 80),
    postPublishScore:Number(postPublish.healthScore ?? postPublish.evaluation?.score ?? 90),
    publicOpsScore:Number(publicOps.opsScore ?? publicOps.summary?.score ?? 90),
    fatigue:Number(window.SKYWARD_CAREER?.status?.().fatigue||0)
  };
}
function createFinding(domainId,risk,statsObj={},signals={},note=''){
  const sev=severityForRisk(risk);
  const rootId=rootCauseFor(domainId,statsObj,signals);
  const capId=correctiveForRoot(rootId);
  const root=SAFETY_COMPLIANCE_CATALOG.rootCauses.find(r=>r.id===rootId);
  const cap=SAFETY_COMPLIANCE_CATALOG.correctiveActions.find(c=>c.id===capId);
  const finding={id:`FND-${String(Date.now()+Math.floor(Math.random()*999)).slice(-7)}`,at:new Date().toISOString(),domainId,severity:sev.id,risk:Math.round(risk),rootCause:rootId,correctiveAction:capId,status:'OPEN',dueDays:sev.actionDays,note:String(note||root?.corrective||'').slice(0,180)};
  safetyComplianceState.findings.unshift(finding);
  safetyComplianceState.findings=safetyComplianceState.findings.slice(0,80);
  if(!safetyComplianceState.correctivePlan.some(p=>p.findingId===finding.id)){
    safetyComplianceState.correctivePlan.unshift({findingId:finding.id,actionId:capId,name:cap?.name||capId,cost:cap?.cost||0,status:'PLANNED',createdAt:new Date().toISOString()});
  }
  safetyComplianceState.correctivePlan=safetyComplianceState.correctivePlan.slice(0,80);
  return finding;
}
function closeFinding(id){
  loadSafetyCompliance();
  const finding=safetyComplianceState.findings.find(f=>f.id===id);
  if(finding){
    finding.status='CLOSED'; finding.closedAt=new Date().toISOString();
    if(!safetyComplianceState.closedFindings.includes(id)) safetyComplianceState.closedFindings.push(id);
    const plan=safetyComplianceState.correctivePlan.find(p=>p.findingId===id);
    if(plan) plan.status='DONE';
    safetyComplianceState.safetyCultureScore=Math.min(100,safetyComplianceState.safetyCultureScore+4);
  }
  saveSafetyCompliance();
  renderSafetyComplianceBoard();
  return finding||null;
}
function auditSafetyCompliance(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSafetyCompliance();
  const signals=collectSafetySignals(finalScore,statsObj,fail);
  const before=safetyComplianceState.findings.length;
  if(signals.runwayIncursions>0) createFinding('RUNWAY_SAFETY',90+signals.runwayIncursions*5,statsObj,signals,'incursão de pista exige ação corretiva imediata');
  if(signals.conflicts>0) createFinding('SEPARATION',72+signals.conflicts*8,statsObj,signals,'conflito/separação degradada');
  if(signals.denied>=3) createFinding('PROCEDURE',58+signals.denied*4,statsObj,signals,'alto volume de comandos negados');
  if(signals.fatigue>70) createFinding('FATIGUE',62+(signals.fatigue-70),statsObj,signals,'fadiga operacional elevada');
  if(signals.crisisScore<75) createFinding('CRISIS_RESPONSE',80-signals.crisisScore/3,statsObj,signals,'resposta à crise abaixo do alvo');
  if(signals.airportExperience<65) createFinding('TERMINAL_RISK',70-signals.airportExperience/4,statsObj,signals,'terminal pressionado');
  if(signals.postPublishScore<75 || signals.publicOpsScore<75) createFinding('PWA_RELEASE',65,statsObj,signals,'publicação/ops público abaixo do padrão');
  const newFindings=safetyComplianceState.findings.length-before;
  const open=safetyComplianceState.findings.filter(f=>f.status==='OPEN');
  const critical=open.filter(f=>f.severity==='CRITICAL').length;
  const major=open.filter(f=>f.severity==='MAJOR').length;
  let culture=100 - critical*22 - major*10 - open.length*3 + safetyComplianceState.closedFindings.length*2;
  if(!fail && !signals.conflicts && !signals.runwayIncursions) culture+=4;
  culture=Math.max(0,Math.min(100,Math.round(culture)));
  safetyComplianceState.safetyCultureScore=culture;
  safetyComplianceState.complianceStatus=bandForSafetyCulture(culture).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'---',finalScore:Math.round(finalScore||0),signals,newFindings,openFindings:open.length,critical,major,safetyCultureScore:culture,complianceStatus:safetyComplianceState.complianceStatus};
  safetyComplianceState.history.unshift(evaluation);
  safetyComplianceState.history=safetyComplianceState.history.slice(0,80);
  safetyComplianceState.lastEvaluation=evaluation;
  saveSafetyCompliance();
  renderSafetyComplianceBoard();
  return {state:safetyComplianceState,evaluation};
}
function safetyComplianceProgress(){
  loadSafetyCompliance();
  const open=safetyComplianceState.findings.filter(f=>f.status==='OPEN');
  return {score:safetyComplianceState.safetyCultureScore,status:safetyComplianceState.complianceStatus,openFindings:open.length,critical:open.filter(f=>f.severity==='CRITICAL').length,major:open.filter(f=>f.severity==='MAJOR').length,plans:safetyComplianceState.correctivePlan.filter(p=>p.status!=='DONE').length,last:safetyComplianceState.lastEvaluation||null};
}
function renderSafetyComplianceBoard(){
  try{
    const anchor=document.querySelector('#crisisCommandInline') || document.querySelector('#airportAuthorityInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#safetyComplianceInline'); if(old) old.remove();
    const p=safetyComplianceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="safetyComplianceInline" class="airport-ops-board safety-compliance-inline">
      <div class="airport-ops-head"><b>SAFETY SMS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CULTURA</small><b>${p.score}%</b></div>
        <div><small>ACHADOS</small><b>${p.openFindings}</b></div>
        <div><small>CRÍTICOS</small><b>${p.critical}</b></div>
        <div><small>MAJOR</small><b>${p.major}</b></div>
        <div><small>CAP</small><b>${p.plans}</b></div>
        <div><small>NOVOS</small><b>${p.last?.newFindings??0}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'safety-compliance-board'); }
}
function initializeSafetyCompliance(){
  loadSafetyCompliance();
  renderSafetyComplianceBoard();
  return safetyComplianceState;
}
function safetyComplianceStatus(){ loadSafetyCompliance(); return {...safetyComplianceState,progress:safetyComplianceProgress(),catalog:SAFETY_COMPLIANCE_CATALOG}; }
function safetyComplianceSelfCheck(){
  const issues=[];
  if(SAFETY_COMPLIANCE_CATALOG.auditDomains.length<7) issues.push('domínios insuficientes');
  if(SAFETY_COMPLIANCE_CATALOG.correctiveActions.length<5) issues.push('CAPs insuficientes');
  const res=auditSafetyCompliance(300,{conflicts:1,runwayIncursions:1,denied:3},false,'SBGR');
  if(res.evaluation.newFindings<2) issues.push('não gerou achados suficientes');
  const first=safetyComplianceState.findings[0];
  if(!first?.rootCause || !first?.correctiveAction) issues.push('sem causa raiz/CAP');
  return {ok:issues.length===0,issues,domains:SAFETY_COMPLIANCE_CATALOG.auditDomains.length,actions:SAFETY_COMPLIANCE_CATALOG.correctiveActions.length};
}
window.SKYWARD_SAFETY_COMPLIANCE=Object.freeze({
  schema:1,
  catalog:SAFETY_COMPLIANCE_CATALOG,
  load:loadSafetyCompliance,
  save:saveSafetyCompliance,
  init:initializeSafetyCompliance,
  audit:auditSafetyCompliance,
  close:closeFinding,
  progress:safetyComplianceProgress,
  status:safetyComplianceStatus,
  board:renderSafetyComplianceBoard,
  selfCheck:safetyComplianceSelfCheck
});
