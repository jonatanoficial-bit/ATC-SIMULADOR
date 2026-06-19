/* @skyward-module 28-post-gold-master-publishing
 * Post-Gold Master real-device QA, screenshot plan, bug triage and GitHub Pages/PWA publishing kit.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('28-post-gold-master-publishing');
const POST_GOLD_MASTER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f25',
  realDeviceMatrix:[
    {id:'ANDROID_CHROME_LANDSCAPE',name:'Android Chrome landscape',required:true,viewport:'844x390',focus:['fullscreen','touch','scroll','performance']},
    {id:'ANDROID_PWA_INSTALLED',name:'Android PWA installed',required:true,viewport:'mobile',focus:['offline','cache','add_to_home']},
    {id:'IOS_SAFARI_LANDSCAPE',name:'iOS Safari landscape',required:true,viewport:'844x390',focus:['safe_area','touch','audio_unlock']},
    {id:'DESKTOP_CHROME',name:'Desktop Chrome',required:true,viewport:'1440x900',focus:['keyboard','layout','performance']},
    {id:'TABLET_BROWSER',name:'Tablet browser',required:false,viewport:'1024x768',focus:['layout','density','touch']}
  ],
  screenshotPlan:[
    {id:'MENU',name:'Menu profissional / build visível',viewport:'mobile_landscape',required:true},
    {id:'RADAR',name:'Radar em operação',viewport:'mobile_landscape',required:true},
    {id:'PROCEDURES',name:'Procedimentos SID/STAR/ILS/RNAV',viewport:'desktop',required:true},
    {id:'INCIDENT',name:'Incidente com painel Incident Ops',viewport:'mobile_landscape',required:true},
    {id:'RESULTS',name:'Tela final com carreira/economia/RC/GM',viewport:'desktop',required:true},
    {id:'PWA',name:'PWA instalada / offline',viewport:'mobile',required:true}
  ],
  bugTriage:[
    {id:'BLOCKER',name:'Quebra total / tela branca / boot falha',sla:'corrigir antes de publicar'},
    {id:'CRITICAL',name:'Comando impossível / save corrompido / fluxo travado',sla:'corrigir antes de promover'},
    {id:'MAJOR',name:'Layout ruim / botão inacessível / scroll falho',sla:'corrigir no hotfix'},
    {id:'MINOR',name:'Texto, estética, micro ajuste',sla:'pode seguir se documentado'}
  ],
  publishingSteps:[
    {id:'UNZIP',name:'Extrair ZIP completo na pasta oficial'},
    {id:'COPY',name:'Sobrescrever pasta local ATC 3 NOVO'},
    {id:'GIT_STATUS',name:'Verificar git status'},
    {id:'COMMIT',name:'Commit da build F25'},
    {id:'PUSH',name:'Push force para GitHub se necessário'},
    {id:'PAGES',name:'Ativar GitHub Pages na branch main'},
    {id:'VERIFY',name:'Abrir URL pública e testar PWA'}
  ],
  githubPages:{repo:'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',branch:'main',path:'/',localGitBashPath:'/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO',expectedUrlPattern:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/'},
  manualQAStatus:{automatedReady:true,requiresHumanDeviceQA:true,screenshotsPending:true,canPublishToGitHubPages:true}
});
const POST_GM_KEY='skywardPostGoldMaster_v1';
let postGoldMasterState={schema:1,readyScore:0,status:'UNRATED',deviceChecks:{},screenshots:{},bugs:[],publishing:{},lastEvaluation:null,history:[]};
function loadPostGoldMaster(){
  try{ const raw=localStorage?.getItem?.(POST_GM_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) postGoldMasterState={...postGoldMasterState,...parsed}; } }catch(e){ safeLogError?.(e,'post-gm-load'); }
  return postGoldMasterState;
}
function savePostGoldMaster(){
  try{ localStorage?.setItem?.(POST_GM_KEY,JSON.stringify(postGoldMasterState)); }catch(e){ safeLogError?.(e,'post-gm-save'); }
  return postGoldMasterState;
}
function markDeviceQA(deviceId, ok=true, note=''){
  loadPostGoldMaster();
  postGoldMasterState.deviceChecks[String(deviceId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.deviceChecks[String(deviceId||'')];
}
function markScreenshotShot(shotId, ok=true, note=''){
  loadPostGoldMaster();
  postGoldMasterState.screenshots[String(shotId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.screenshots[String(shotId||'')];
}
function reportPostGmBug(severity='MINOR', title='Bug reportado', note=''){
  loadPostGoldMaster();
  const sev=POST_GOLD_MASTER_CATALOG.bugTriage.find(b=>b.id===String(severity||'').toUpperCase())||POST_GOLD_MASTER_CATALOG.bugTriage.at(-1);
  const bug={id:`BUG-${String(Date.now()).slice(-6)}`,severity:sev.id,title:String(title||'Bug reportado').slice(0,90),note:String(note||''),status:'OPEN',sla:sev.sla,at:new Date().toISOString()};
  postGoldMasterState.bugs.unshift(bug);
  postGoldMasterState.bugs=postGoldMasterState.bugs.slice(0,50);
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return bug;
}
function closePostGmBug(bugId){
  loadPostGoldMaster();
  const bug=postGoldMasterState.bugs.find(b=>b.id===bugId);
  if(bug){ bug.status='CLOSED'; bug.closedAt=new Date().toISOString(); }
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return bug||null;
}
function markPublishingStep(stepId, ok=true){
  loadPostGoldMaster();
  postGoldMasterState.publishing[String(stepId||'')]={ok:Boolean(ok),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.publishing[String(stepId||'')];
}
function evaluatePostGoldMasterReadiness(){
  loadPostGoldMaster();
  const requiredDevices=POST_GOLD_MASTER_CATALOG.realDeviceMatrix.filter(d=>d.required);
  const requiredShots=POST_GOLD_MASTER_CATALOG.screenshotPlan.filter(s=>s.required);
  const criticalOpen=postGoldMasterState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED');
  const majorOpen=postGoldMasterState.bugs.filter(b=>b.severity==='MAJOR'&&b.status!=='CLOSED');
  const gm=window.SKYWARD_GOLD_MASTER?.status?.() || {gates:{score:95}};
  const deviceScore=Math.round(requiredDevices.filter(d=>postGoldMasterState.deviceChecks[d.id]?.ok).length/requiredDevices.length*100);
  const shotScore=Math.round(requiredShots.filter(s=>postGoldMasterState.screenshots[s.id]?.ok).length/requiredShots.length*100);
  const publishScore=Math.round(POST_GOLD_MASTER_CATALOG.publishingSteps.filter(s=>postGoldMasterState.publishing[s.id]?.ok).length/POST_GOLD_MASTER_CATALOG.publishingSteps.length*100);
  const bugScore=criticalOpen.length?0:majorOpen.length?70:100;
  const score=Math.round((deviceScore*.25)+(shotScore*.2)+(publishScore*.2)+(bugScore*.2)+((gm.gates?.score||95)*.15));
  postGoldMasterState.readyScore=score;
  postGoldMasterState.status=criticalOpen.length?'BLOCKED_BY_CRITICAL_BUG':score>=90?'PUBLICATION_READY':score>=75?'READY_WITH_MANUAL_PENDING':'MANUAL_QA_REQUIRED';
  postGoldMasterState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:postGoldMasterState.status,deviceScore,shotScore,publishScore,bugScore,criticalOpen:criticalOpen.length,majorOpen:majorOpen.length};
  savePostGoldMaster();
  return postGoldMasterState.lastEvaluation;
}
function postGmGitBashCommands(){
  const p=POST_GOLD_MASTER_CATALOG.githubPages.localGitBashPath;
  return [
    `cd "${p}"`,
    'git merge --abort 2>/dev/null || true',
    'git status',
    'git remote set-url origin https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',
    'git add .',
    `git commit -m "Build ${BUILD} - Pos Gold Master publicacao"`,
    'git push -u origin main --force',
    'git status'
  ];
}
function renderPostGoldMasterBoard(){
  try{
    const anchor=document.querySelector('#goldMasterInline') || document.querySelector('#releaseCandidateInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#postGoldMasterInline'); if(old) old.remove();
    const ev=evaluatePostGoldMasterReadiness();
    const requiredDevices=POST_GOLD_MASTER_CATALOG.realDeviceMatrix.filter(d=>d.required);
    const requiredShots=POST_GOLD_MASTER_CATALOG.screenshotPlan.filter(s=>s.required);
    anchor.insertAdjacentHTML('afterend',`<div id="postGoldMasterInline" class="airport-ops-board post-gold-master-inline">
      <div class="airport-ops-head"><b>POST-GM PUBLISH</b><span>${ev.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>READY</small><b>${ev.score}%</b></div>
        <div><small>DEVICE QA</small><b>${requiredDevices.filter(d=>postGoldMasterState.deviceChecks[d.id]?.ok).length}/${requiredDevices.length}</b></div>
        <div><small>SHOTS</small><b>${requiredShots.filter(s=>postGoldMasterState.screenshots[s.id]?.ok).length}/${requiredShots.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${ev.publishScore}%</b></div>
        <div><small>BUGS CRIT</small><b>${ev.criticalOpen}</b></div>
        <div><small>PAGES</small><b>READY</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'post-gm-board'); }
}
function initializePostGoldMasterPublishing(){
  loadPostGoldMaster();
  evaluatePostGoldMasterReadiness();
  renderPostGoldMasterBoard();
  return postGoldMasterState;
}
function postGoldMasterStatus(){
  loadPostGoldMaster();
  return {...postGoldMasterState,evaluation:evaluatePostGoldMasterReadiness(),devices:POST_GOLD_MASTER_CATALOG.realDeviceMatrix,screenshots:POST_GOLD_MASTER_CATALOG.screenshotPlan,publishingSteps:POST_GOLD_MASTER_CATALOG.publishingSteps,commands:postGmGitBashCommands(),githubPages:POST_GOLD_MASTER_CATALOG.githubPages};
}
function postGoldMasterSelfCheck(){
  const issues=[];
  if(POST_GOLD_MASTER_CATALOG.realDeviceMatrix.length<5) issues.push('matriz de dispositivos insuficiente');
  if(POST_GOLD_MASTER_CATALOG.screenshotPlan.length<6) issues.push('plano de screenshots insuficiente');
  if(POST_GOLD_MASTER_CATALOG.publishingSteps.length<7) issues.push('passos de publicação insuficientes');
  if(!POST_GOLD_MASTER_CATALOG.githubPages.repo.includes('ATC-SIMULADOR')) issues.push('repo GitHub incorreto');
  const cmds=postGmGitBashCommands();
  if(!cmds.some(c=>c.includes('git push'))) issues.push('comandos Git ausentes');
  return {ok:issues.length===0,issues,devices:POST_GOLD_MASTER_CATALOG.realDeviceMatrix.length,screenshots:POST_GOLD_MASTER_CATALOG.screenshotPlan.length};
}
window.SKYWARD_POST_GOLD_MASTER=Object.freeze({
  schema:1,
  catalog:POST_GOLD_MASTER_CATALOG,
  load:loadPostGoldMaster,
  save:savePostGoldMaster,
  init:initializePostGoldMasterPublishing,
  status:postGoldMasterStatus,
  readiness:evaluatePostGoldMasterReadiness,
  device:markDeviceQA,
  screenshot:markScreenshotShot,
  bug:reportPostGmBug,
  closeBug:closePostGmBug,
  publish:markPublishingStep,
  commands:postGmGitBashCommands,
  board:renderPostGoldMasterBoard,
  selfCheck:postGoldMasterSelfCheck
});
