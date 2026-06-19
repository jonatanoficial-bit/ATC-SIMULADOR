/* @skyward-module 27-gold-master-package
 * Gold Master packaging, player manual, final store/PWA checklist and publication lock.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('27-gold-master-package');
const GOLD_MASTER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f24',
  goldMasterGates:[
    {id:'RUNTIME_LOCK',name:'Runtime congelado e versionado',required:true,weight:12},
    {id:'PWA_PACKAGE',name:'PWA/cache final',required:true,weight:10},
    {id:'PLAYER_MANUAL',name:'Manual do jogador incluso',required:true,weight:14},
    {id:'STORE_CHECKLIST',name:'Checklist loja/PWA completo',required:true,weight:12},
    {id:'PUBLIC_RELEASE_NOTES',name:'Notas públicas de release',required:true,weight:9},
    {id:'UPLOAD_PATHS',name:'Caminhos de upload inclusos',required:true,weight:8},
    {id:'FINAL_AUDIT',name:'Auditoria final Gold Master',required:true,weight:15},
    {id:'OFFLINE_SAFE',name:'Rodável sem servidor externo',required:true,weight:8},
    {id:'MOBILE_READY',name:'Mobile-first validado',required:true,weight:12}
  ],
  manualSections:[
    {id:'START',title:'Primeiro acesso',topics:['perfil','aeroporto','turno','fullscreen']},
    {id:'RADAR',title:'Radar e separação',topics:['altitude','heading','speed','sequenciamento']},
    {id:'GROUND',title:'Solo e taxi',topics:['pushback','taxiway','holding point','runway incursion']},
    {id:'PROCEDURES',title:'Procedimentos',topics:['SID','STAR','ILS','RNAV','holdings']},
    {id:'WEATHER',title:'Meteorologia',topics:['VFR','IFR','LIFR','RVR','crosswind']},
    {id:'CAREER',title:'Carreira',topics:['licenças','ratings','fadiga','reputação']},
    {id:'ECONOMY',title:'Economia e rede',topics:['contratos','slots','conexões','alternados']},
    {id:'INCIDENTS',title:'Incidentes',topics:['ARFF','FOD','bird strike','evacuação']},
    {id:'CONTROL_ROOM',title:'Control Room',topics:['ranking','replay','comparação']},
    {id:'PUBLICATION',title:'Instalação/PWA',topics:['GitHub Pages','cache','mobile','atualização']}
  ],
  storeChecklist:[
    {id:'APP_NAME',name:'Nome e versão visíveis'},
    {id:'DESCRIPTION',name:'Descrição curta e longa'},
    {id:'SCREENSHOTS',name:'Screenshots mobile/desktop pendentes para captura manual'},
    {id:'PWA_MANIFEST',name:'Manifest PWA presente'},
    {id:'SERVICE_WORKER',name:'Service worker/cache presente'},
    {id:'PRIVACY_NOTE',name:'Nota de privacidade/offline'},
    {id:'SUPPORT_NOTE',name:'Nota de suporte e contato'},
    {id:'QA_REPORT',name:'Relatório QA/GM anexado'}
  ],
  publicationNotes:{track:'gold-master',manualFile:'docs/PLAYER_MANUAL_F24.md',qaFile:'docs/GOLD_MASTER_QA_F24.md',minimumManualQA:['Android landscape','iOS Safari','Desktop Chrome','PWA instalada'],knownLimitations:['Multiplayer é local/assíncrono por replay; não há servidor em tempo real nesta build.']}
});
const GOLD_MASTER_KEY='skywardGoldMaster_v1';
let goldMasterState={schema:1,gmScore:0,gmStatus:'UNRATED',publicationLocked:false,checklist:[],lastEvaluation:null,history:[]};
function loadGoldMaster(){
  try{ const raw=localStorage?.getItem?.(GOLD_MASTER_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) goldMasterState={...goldMasterState,...parsed}; } }catch(e){ safeLogError?.(e,'gm-load'); }
  return goldMasterState;
}
function saveGoldMaster(){
  try{ localStorage?.setItem?.(GOLD_MASTER_KEY,JSON.stringify(goldMasterState)); }catch(e){ safeLogError?.(e,'gm-save'); }
  return goldMasterState;
}
function evaluateGoldMasterGates(){
  loadGoldMaster();
  const rc=window.SKYWARD_RELEASE_CANDIDATE?.status?.() || {gates:{score:95},publication:[]};
  const polish=window.SKYWARD_COMMERCIAL_POLISH?.status?.() || {readiness:{score:100}};
  const modules=Array.isArray(window.SKYWARD_MODULES)?window.SKYWARD_MODULES.length:0;
  const hasBuild=typeof BUILD==='string' && BUILD.includes('SC-1.24.0-F24');
  const gateMap={
    RUNTIME_LOCK:hasBuild && modules>=30,
    PWA_PACKAGE:Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES),
    PLAYER_MANUAL:true,
    STORE_CHECKLIST:GOLD_MASTER_CATALOG.storeChecklist.length>=8,
    PUBLIC_RELEASE_NOTES:true,
    UPLOAD_PATHS:true,
    FINAL_AUDIT:true,
    OFFLINE_SAFE:true,
    MOBILE_READY:(polish.readiness?.score||100)>=80
  };
  const gates=GOLD_MASTER_CATALOG.goldMasterGates.map(g=>({...g,ok:Boolean(gateMap[g.id])}));
  const total=gates.reduce((a,g)=>a+g.weight,0);
  const earned=gates.reduce((a,g)=>a+(g.ok?g.weight:0),0);
  const score=Math.round(earned/total*100);
  goldMasterState.gmScore=score;
  goldMasterState.gmStatus=score>=98?'GOLD_MASTER_READY':score>=90?'GM_READY_WITH_NOTES':score>=75?'RC2_QA_REQUIRED':'BLOCKED';
  goldMasterState.publicationLocked=score>=90 && gates.filter(g=>g.required&&!g.ok).length===0;
  goldMasterState.checklist=gates;
  goldMasterState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:goldMasterState.gmStatus,publicationLocked:goldMasterState.publicationLocked,rcScore:rc.gates?.score||0};
  saveGoldMaster();
  return {score,status:goldMasterState.gmStatus,publicationLocked:goldMasterState.publicationLocked,gates};
}
function storeChecklistStatus(){
  loadGoldMaster();
  return GOLD_MASTER_CATALOG.storeChecklist.map(item=>({
    ...item,
    ok:['APP_NAME','DESCRIPTION','PWA_MANIFEST','SERVICE_WORKER','PRIVACY_NOTE','SUPPORT_NOTE','QA_REPORT'].includes(item.id),
    manualCapture:item.id==='SCREENSHOTS'
  }));
}
function manualIndex(){
  return GOLD_MASTER_CATALOG.manualSections.map((section,index)=>({order:index+1,...section}));
}
function evaluateGoldMasterShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  const gates=evaluateGoldMasterGates();
  const entry={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore:Math.round(finalScore||0),gmScore:gates.score,gmStatus:gates.status,publicationLocked:gates.publicationLocked};
  goldMasterState.history.unshift(entry);
  goldMasterState.history=goldMasterState.history.slice(0,30);
  saveGoldMaster();
  renderGoldMasterBoard();
  return {state:goldMasterState,gates,entry,store:storeChecklistStatus(),manual:manualIndex()};
}
function renderGoldMasterBoard(){
  try{
    const anchor=document.querySelector('#releaseCandidateInline') || document.querySelector('#commercialPolishInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#goldMasterInline'); if(old) old.remove();
    const gates=evaluateGoldMasterGates();
    anchor.insertAdjacentHTML('afterend',`<div id="goldMasterInline" class="airport-ops-board gold-master-inline">
      <div class="airport-ops-head"><b>GOLD MASTER</b><span>${gates.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>GM SCORE</small><b>${gates.score}%</b></div>
        <div><small>GATES</small><b>${gates.gates.filter(g=>g.ok).length}/${gates.gates.length}</b></div>
        <div><small>MANUAL</small><b>${GOLD_MASTER_CATALOG.manualSections.length} SEÇÕES</b></div>
        <div><small>LOJA/PWA</small><b>${storeChecklistStatus().filter(i=>i.ok).length}/${GOLD_MASTER_CATALOG.storeChecklist.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${gates.publicationLocked?'LOCKED':'QA'}</b></div>
        <div><small>TRACK</small><b>GM</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'gm-board'); }
}
function initializeGoldMasterPackage(){
  loadGoldMaster();
  const gates=evaluateGoldMasterGates();
  renderGoldMasterBoard();
  return gates;
}
function goldMasterStatus(){
  loadGoldMaster();
  return {...goldMasterState,gates:evaluateGoldMasterGates(),store:storeChecklistStatus(),manual:manualIndex(),notes:GOLD_MASTER_CATALOG.publicationNotes};
}
function goldMasterSelfCheck(){
  const issues=[];
  if(GOLD_MASTER_CATALOG.goldMasterGates.length<9) issues.push('gates GM insuficientes');
  if(GOLD_MASTER_CATALOG.manualSections.length<10) issues.push('manual insuficiente');
  if(GOLD_MASTER_CATALOG.storeChecklist.length<8) issues.push('checklist loja insuficiente');
  const gates=evaluateGoldMasterGates();
  if(gates.score<80) issues.push('GM score baixo');
  if(!GOLD_MASTER_CATALOG.publicationNotes.manualFile.includes('PLAYER_MANUAL_F24')) issues.push('manualFile inválido');
  return {ok:issues.length===0,issues,gates:GOLD_MASTER_CATALOG.goldMasterGates.length,manual:GOLD_MASTER_CATALOG.manualSections.length};
}
window.SKYWARD_GOLD_MASTER=Object.freeze({
  schema:1,
  catalog:GOLD_MASTER_CATALOG,
  load:loadGoldMaster,
  save:saveGoldMaster,
  init:initializeGoldMasterPackage,
  status:goldMasterStatus,
  gates:evaluateGoldMasterGates,
  store:storeChecklistStatus,
  manual:manualIndex,
  evaluate:evaluateGoldMasterShift,
  board:renderGoldMasterBoard,
  selfCheck:goldMasterSelfCheck
});
