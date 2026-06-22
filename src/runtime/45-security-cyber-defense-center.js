/* @skyward-module 45-security-cyber-defense-center
 * Security operations and cyber defense center with screening, perimeter, access control, insider threat, SOC and law enforcement response.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('45-security-cyber-defense-center');
const SECURITY_CYBER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f42',
  securityDomains:[
    {id:'PASSENGER_SCREENING',name:'Triagem de passageiros',weight:18,target:82},
    {id:'PERIMETER',name:'Perímetro e pátio',weight:18,target:80},
    {id:'BADGE_ACCESS',name:'Credenciais e acesso',weight:16,target:84},
    {id:'CYBER_SOC',name:'SOC/cibersegurança',weight:20,target:82},
    {id:'INSIDER_THREAT',name:'Ameaça interna',weight:14,target:78},
    {id:'LAW_ENFORCEMENT',name:'Resposta policial',weight:14,target:80}
  ],
  securityAssets:[
    {id:'CT_SCANNERS',name:'Scanners CT',domain:'PASSENGER_SCREENING',coverage:24,readiness:78},
    {id:'CCTV_ANALYTICS',name:'CCTV com analytics',domain:'PERIMETER',coverage:22,readiness:80},
    {id:'BADGE_GATEWAY',name:'Controle biométrico',domain:'BADGE_ACCESS',coverage:20,readiness:82},
    {id:'SOC_MONITORING',name:'SOC 24/7',domain:'CYBER_SOC',coverage:26,readiness:76},
    {id:'INSIDER_PROGRAM',name:'Programa insider threat',domain:'INSIDER_THREAT',coverage:16,readiness:74},
    {id:'POLICE_LIAISON',name:'Ligação policial',domain:'LAW_ENFORCEMENT',coverage:18,readiness:78}
  ],
  threatScenarios:[
    {id:'SCREENING_BREACH',name:'Falha na triagem',severity:76,domain:'PASSENGER_SCREENING',reputationRisk:18},
    {id:'PERIMETER_INTRUSION',name:'Intrusão no perímetro',severity:84,domain:'PERIMETER',reputationRisk:24},
    {id:'BADGE_CLONE',name:'Credencial clonada',severity:80,domain:'BADGE_ACCESS',reputationRisk:20},
    {id:'RANSOMWARE_ALERT',name:'Alerta ransomware',severity:88,domain:'CYBER_SOC',reputationRisk:26},
    {id:'INSIDER_LEAK',name:'Vazamento interno',severity:82,domain:'INSIDER_THREAT',reputationRisk:22},
    {id:'UNRULY_PASSENGER',name:'Passageiro indisciplinado',severity:64,domain:'LAW_ENFORCEMENT',reputationRisk:14}
  ],
  defensePrograms:[
    {id:'SCREENING_RECERT',name:'Recertificação triagem',cost:18000,benefit:{PASSENGER_SCREENING:10,LAW_ENFORCEMENT:2}},
    {id:'PERIMETER_SWEEP',name:'Varredura de perímetro',cost:14000,benefit:{PERIMETER:11}},
    {id:'BADGE_AUDIT',name:'Auditoria de credenciais',cost:16000,benefit:{BADGE_ACCESS:12,INSIDER_THREAT:3}},
    {id:'SOC_HARDENING',name:'Hardening SOC/PWA',cost:30000,benefit:{CYBER_SOC:14}},
    {id:'INSIDER_TRAINING',name:'Treino ameaça interna',cost:19000,benefit:{INSIDER_THREAT:12,BADGE_ACCESS:3}},
    {id:'POLICE_DRILL',name:'Exercício polícia/EOC',cost:22000,benefit:{LAW_ENFORCEMENT:12,PERIMETER:3}}
  ],
  responseLevels:[
    {id:'NORMAL',min:85,name:'Normal'},
    {id:'ELEVATED',min:70,name:'Elevado'},
    {id:'HIGH',min:50,name:'Alto'},
    {id:'LOCKDOWN',min:0,name:'Lockdown'}
  ],
  securityBands:[
    {id:'SECURE',min:90,name:'Seguro'},
    {id:'CONTROLLED',min:75,name:'Controlado'},
    {id:'EXPOSED',min:55,name:'Exposto'},
    {id:'COMPROMISED',min:0,name:'Comprometido'}
  ],
  securityKPIs:[
    {id:'THREAT_CONTAINMENT',name:'Contenção de ameaça'},
    {id:'ACCESS_INTEGRITY',name:'Integridade de acesso'},
    {id:'CYBER_RESILIENCE',name:'Resiliência cibernética'},
    {id:'PERIMETER_COVERAGE',name:'Cobertura de perímetro'},
    {id:'SCREENING_FLOW',name:'Fluxo de triagem'}
  ]
});
const SECURITY_CYBER_KEY='skywardSecurityCyberDefense_v1';
let securityCyberState={schema:1,domainScores:{PASSENGER_SCREENING:78,PERIMETER:80,BADGE_ACCESS:82,CYBER_SOC:76,INSIDER_THREAT:74,LAW_ENFORCEMENT:78},programs:[],threats:[],securityScore:78,responseLevel:'ELEVATED',status:'CONTROLLED',history:[],lastEvaluation:null};
function loadSecurityCyber(){
  try{ const raw=localStorage?.getItem?.(SECURITY_CYBER_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) securityCyberState={...securityCyberState,...parsed}; } }catch(e){ safeLogError?.(e,'security-cyber-load'); }
  return securityCyberState;
}
function saveSecurityCyber(){
  try{ localStorage?.setItem?.(SECURITY_CYBER_KEY,JSON.stringify(securityCyberState)); }catch(e){ safeLogError?.(e,'security-cyber-save'); }
  return securityCyberState;
}
function bandForSecurity(score){
  return SECURITY_CYBER_CATALOG.securityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECURITY_CYBER_CATALOG.securityBands.at(-1);
}
function responseForScore(score){
  return SECURITY_CYBER_CATALOG.responseLevels.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECURITY_CYBER_CATALOG.responseLevels.at(-1);
}
function programById(id){ return SECURITY_CYBER_CATALOG.defensePrograms.find(p=>p.id===id)||SECURITY_CYBER_CATALOG.defensePrograms[0]; }
function threatById(id){ return SECURITY_CYBER_CATALOG.threatScenarios.find(t=>t.id===id)||SECURITY_CYBER_CATALOG.threatScenarios[0]; }
function launchSecurityProgram(id='SOC_HARDENING'){
  loadSecurityCyber();
  const program=programById(id);
  if(securityCyberState.programs.some(p=>p.programId===program.id)) return securityCyberState.programs.find(p=>p.programId===program.id);
  const item={id:`SEC-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  securityCyberState.programs.unshift(item);
  for(const [domain,gain] of Object.entries(program.benefit||{})){
    securityCyberState.domainScores[domain]=Math.min(100,Number(securityCyberState.domainScores[domain]||75)+Number(gain||0));
  }
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return item;
}
function raiseSecurityThreat(id='PERIMETER_INTRUSION'){
  loadSecurityCyber();
  const tpl=threatById(id);
  const item={id:`THR-${String(Date.now()).slice(-6)}`,threatId:tpl.id,name:tpl.name,severity:tpl.severity,domain:tpl.domain,reputationRisk:tpl.reputationRisk,status:'OPEN',at:new Date().toISOString()};
  securityCyberState.threats.unshift(item);
  securityCyberState.threats=securityCyberState.threats.slice(0,60);
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return item;
}
function resolveSecurityThreat(id,ok=true){
  loadSecurityCyber();
  const threat=securityCyberState.threats.find(t=>t.id===id);
  if(threat){
    threat.status=ok?'RESOLVED':'ESCALATED';
    threat.closedAt=new Date().toISOString();
    if(ok) securityCyberState.domainScores[threat.domain]=Math.min(100,Number(securityCyberState.domainScores[threat.domain]||75)+2);
  }
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return threat||null;
}
function calculateSecurityMetrics(finalScore=0,statsObj={},fail=false){
  const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const open=securityCyberState.threats.filter(t=>t.status==='OPEN');
  const scores={...securityCyberState.domainScores};
  const denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0);
  const emergencyScore=Number(emergency.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const crisisScore=Number(crisis.progress?.score||86);
  const safetyScore=Number(safety.progress?.score||80);
  const threatLoad=(domain)=>open.filter(t=>t.domain===domain).reduce((a,t)=>a+Number(t.severity||0),0)/8;
  scores.PASSENGER_SCREENING=Math.max(0,Math.min(100,Number(scores.PASSENGER_SCREENING||78)+passengerScore*.03-denied*1.2-threatLoad('PASSENGER_SCREENING')));
  scores.PERIMETER=Math.max(0,Math.min(100,Number(scores.PERIMETER||80)+emergencyScore*.04-incursions*8-threatLoad('PERIMETER')));
  scores.BADGE_ACCESS=Math.max(0,Math.min(100,Number(scores.BADGE_ACCESS||82)+workforceScore*.04-threatLoad('BADGE_ACCESS')));
  scores.CYBER_SOC=Math.max(0,Math.min(100,Number(scores.CYBER_SOC||76)+crisisScore*.04-threatLoad('CYBER_SOC')-(fail?6:0)));
  scores.INSIDER_THREAT=Math.max(0,Math.min(100,Number(scores.INSIDER_THREAT||74)+safetyScore*.03-threatLoad('INSIDER_THREAT')-conflicts*1.2));
  scores.LAW_ENFORCEMENT=Math.max(0,Math.min(100,Number(scores.LAW_ENFORCEMENT||78)+emergencyScore*.03+workforceScore*.02-threatLoad('LAW_ENFORCEMENT')));
  return {scores,openThreats:open.length,reputationRisk:open.reduce((a,t)=>a+Number(t.reputationRisk||0),0),drivers:{denied,conflicts,incursions,emergencyScore,passengerScore,workforceScore,crisisScore,safetyScore}};
}
function evaluateSecurityCyber(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSecurityCyber();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.runwayIncursions||0)>0 && !securityCyberState.threats.some(t=>t.status==='OPEN'&&t.threatId==='PERIMETER_INTRUSION')) raiseSecurityThreat('PERIMETER_INTRUSION');
  if((statsObj.denied||0)>=3 && !securityCyberState.threats.some(t=>t.status==='OPEN'&&t.threatId==='SCREENING_BREACH')) raiseSecurityThreat('SCREENING_BREACH');
  const metrics=calculateSecurityMetrics(finalScore,statsObj,fail);
  securityCyberState.domainScores=metrics.scores;
  const weighted=Math.round(SECURITY_CYBER_CATALOG.securityDomains.reduce((a,d)=>a+(metrics.scores[d.id]||0)*d.weight,0)/100);
  const score=Math.max(0,Math.min(100,Math.round(weighted-metrics.reputationRisk/10-metrics.openThreats*2+(finalScore>2500?2:0))));
  securityCyberState.securityScore=score;
  securityCyberState.status=bandForSecurity(score).id;
  securityCyberState.responseLevel=responseForScore(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,weighted,securityScore:score,status:securityCyberState.status,responseLevel:securityCyberState.responseLevel,programs:securityCyberState.programs.length};
  securityCyberState.history.unshift(evaluation);
  securityCyberState.history=securityCyberState.history.slice(0,100);
  securityCyberState.lastEvaluation=evaluation;
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return {state:securityCyberState,evaluation};
}
function securityCyberProgress(){
  loadSecurityCyber();
  return {score:securityCyberState.securityScore,status:securityCyberState.status,responseLevel:securityCyberState.responseLevel,openThreats:securityCyberState.threats.filter(t=>t.status==='OPEN').length,programs:securityCyberState.programs.length,domainScores:securityCyberState.domainScores,last:securityCyberState.lastEvaluation||null};
}
function renderSecurityCyberBoard(){
  try{
    const anchor=document.querySelector('#emergencyResponseInline') || document.querySelector('#multiAirportNetworkInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#securityCyberInline'); if(old) old.remove();
    const p=securityCyberProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="securityCyberInline" class="airport-ops-board security-cyber-inline">
      <div class="airport-ops-head"><b>SECURITY SOC</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SEG.</small><b>${p.score}%</b></div>
        <div><small>NÍVEL</small><b>${p.responseLevel}</b></div>
        <div><small>SOC</small><b>${Math.round(p.domainScores.CYBER_SOC||0)}</b></div>
        <div><small>PERIM.</small><b>${Math.round(p.domainScores.PERIMETER||0)}</b></div>
        <div><small>AMEAÇAS</small><b>${p.openThreats}</b></div>
        <div><small>PROG.</small><b>${p.programs}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'security-cyber-board'); }
}
function initializeSecurityCyber(){
  loadSecurityCyber();
  renderSecurityCyberBoard();
  return securityCyberState;
}
function securityCyberStatus(){ loadSecurityCyber(); return {...securityCyberState,progress:securityCyberProgress(),catalog:SECURITY_CYBER_CATALOG}; }
function securityCyberSelfCheck(){
  const issues=[];
  if(SECURITY_CYBER_CATALOG.securityDomains.length<6) issues.push('domínios insuficientes');
  if(SECURITY_CYBER_CATALOG.threatScenarios.length<6) issues.push('ameaças insuficientes');
  const program=launchSecurityProgram('SOC_HARDENING');
  const threat=raiseSecurityThreat('RANSOMWARE_ALERT');
  const res=evaluateSecurityCyber(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !threat.id) issues.push('programa/ameaça inválido');
  if(!Number.isFinite(res.evaluation.securityScore)) issues.push('score de segurança inválido');
  return {ok:issues.length===0,issues,domains:SECURITY_CYBER_CATALOG.securityDomains.length,threats:SECURITY_CYBER_CATALOG.threatScenarios.length};
}
window.SKYWARD_SECURITY_CYBER=Object.freeze({
  schema:1,
  catalog:SECURITY_CYBER_CATALOG,
  load:loadSecurityCyber,
  save:saveSecurityCyber,
  init:initializeSecurityCyber,
  program:launchSecurityProgram,
  threat:raiseSecurityThreat,
  resolve:resolveSecurityThreat,
  evaluate:evaluateSecurityCyber,
  progress:securityCyberProgress,
  status:securityCyberStatus,
  board:renderSecurityCyberBoard,
  selfCheck:securityCyberSelfCheck
});
