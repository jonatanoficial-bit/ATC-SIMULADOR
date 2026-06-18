/* @skyward-module 01-pwa-runtime
 * Installable PWA, offline cache status, controlled updates and fullscreen lifecycle.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('01-pwa-runtime');
const PWA_RUNTIME_SCHEMA = Number(BUILD_INFO.pwaSchema || 1);
const PWA_CACHE_SCHEMA = Number(BUILD_INFO.cacheSchema || 1);
const PWA_STATE = {
  supported:'serviceWorker' in navigator,
  online:navigator.onLine !== false,
  standalone:false,
  installPrompt:null,
  registration:null,
  waitingWorker:null,
  cacheReady:false,
  cacheName:'',
  applyingUpdate:false,
  lastMessage:'Inicializando recursos offline.',
  history:[]
};
function pwaStandalone(){
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.matchMedia?.('(display-mode: fullscreen)').matches || navigator.standalone === true);
}
function pwaRecord(event,detail=''){
  PWA_STATE.history.unshift({event,detail:String(detail||''),at:Date.now()});
  PWA_STATE.history=PWA_STATE.history.slice(0,20);
}
function pwaSetMessage(message){ PWA_STATE.lastMessage=String(message||''); renderPwaStatus(); }
function pwaStatusSnapshot(){
  return Object.freeze({schema:PWA_RUNTIME_SCHEMA,cacheSchema:PWA_CACHE_SCHEMA,supported:PWA_STATE.supported,online:PWA_STATE.online,standalone:PWA_STATE.standalone,installable:Boolean(PWA_STATE.installPrompt),registered:Boolean(PWA_STATE.registration),waiting:Boolean(PWA_STATE.waitingWorker),cacheReady:PWA_STATE.cacheReady,cacheName:PWA_STATE.cacheName,fullscreen:Boolean(document.fullscreenElement),build:BUILD,history:Object.freeze(PWA_STATE.history.slice())});
}
function renderPwaStatus(){
  PWA_STATE.standalone=pwaStandalone();
  const mode=PWA_STATE.standalone?'APP INSTALADO':document.fullscreenElement?'TELA CHEIA':'NAVEGADOR';
  const network=PWA_STATE.online?'ONLINE':'OFFLINE';
  const cache=PWA_STATE.cacheReady?'PRONTO':PWA_STATE.supported?'PREPARANDO':'INDISPONÍVEL';
  const update=PWA_STATE.waitingWorker?'DISPONÍVEL':'ATUAL';
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set('pwaModeValue',mode); set('pwaNetworkValue',network); set('pwaCacheValue',cache); set('pwaUpdateValue',update);
  set('pwaMessage',PWA_STATE.lastMessage);
  set('pwaMenuStatus',`${PWA_STATE.online?'ONLINE':'OFFLINE'} • cache ${cache.toLowerCase()} • ${PWA_STATE.standalone?'app instalado':'navegador'}`);
  document.querySelectorAll('[data-pwa-cache-name]').forEach(el=>el.textContent=PWA_STATE.cacheName||`schema-${PWA_CACHE_SCHEMA}`);
  document.querySelectorAll('[data-pwa-action="install"]').forEach(el=>{el.hidden=PWA_STATE.standalone || (!PWA_STATE.installPrompt && !/iphone|ipad|ipod/i.test(navigator.userAgent));});
  document.querySelectorAll('[data-pwa-action="update"]').forEach(el=>{el.hidden=!PWA_STATE.waitingWorker;});
  document.body.classList.toggle('is-offline',!PWA_STATE.online);
  document.body.classList.toggle('is-standalone',PWA_STATE.standalone);
  document.body.classList.toggle('is-fullscreen',Boolean(document.fullscreenElement));
  const banner=document.getElementById('networkBanner'); if(banner) banner.classList.toggle('show',!PWA_STATE.online);
}
function openPwaPanel(){const panel=document.getElementById('pwaPanel');if(panel){panel.classList.add('open');panel.setAttribute('aria-hidden','false');renderPwaStatus();}}
function closePwaPanel(){const panel=document.getElementById('pwaPanel');if(panel){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');}}
async function installPwa(){
  if(PWA_STATE.standalone){pwaSetMessage('O Skyward Control já está instalado neste dispositivo.');return {ok:true,already:true};}
  if(PWA_STATE.installPrompt){
    const prompt=PWA_STATE.installPrompt; PWA_STATE.installPrompt=null; await prompt.prompt();
    const choice=await prompt.userChoice; pwaRecord('install-choice',choice?.outcome||'unknown'); renderPwaStatus();
    return {ok:choice?.outcome==='accepted',outcome:choice?.outcome||'unknown'};
  }
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  pwaSetMessage(ios?'No Safari, use Compartilhar → Adicionar à Tela de Início.':'A instalação aparecerá quando o navegador concluir os requisitos PWA.');
  openPwaPanel(); return {ok:false,reason:'prompt-unavailable'};
}
async function toggleProfessionalFullscreen(){
  try{
    if(document.fullscreenElement && document.exitFullscreen){await document.exitFullscreen();pwaRecord('fullscreen-exit');}
    else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen({navigationUI:'hide'});pwaRecord('fullscreen-enter');}
    else {pwaSetMessage(PWA_STATE.standalone?'O app já está usando o modo de tela independente.':'Tela cheia não é suportada neste navegador.');return false;}
    if(document.body.classList.contains('game-active') && screen.orientation?.lock){try{await screen.orientation.lock('landscape');}catch(_e){}}
    setTimeout(()=>{renderPwaStatus();resize();},120); return true;
  }catch(error){safeLogError(error,'pwa-fullscreen');pwaSetMessage('O navegador bloqueou a tela cheia. Toque novamente após interagir com a página.');return false;}
}
function trackPwaWorker(registration){
  if(!registration)return;
  PWA_STATE.registration=registration;
  if(registration.waiting){PWA_STATE.waitingWorker=registration.waiting;pwaSetMessage('Nova versão pronta. A atualização será aplicada somente com sua autorização.');}
  registration.addEventListener('updatefound',()=>{
    const worker=registration.installing;if(!worker)return;
    pwaRecord('update-found');
    worker.addEventListener('statechange',()=>{
      if(worker.state==='installed' && navigator.serviceWorker.controller){PWA_STATE.waitingWorker=registration.waiting||worker;pwaSetMessage('Nova versão armazenada. Salve o turno e atualize quando estiver pronto.');openPwaPanel();}
      if(worker.state==='activated'){PWA_STATE.cacheReady=true;renderPwaStatus();}
    });
  });
}
async function registerPwa(){
  if(!PWA_STATE.supported || (!/^https?:$/.test(location.protocol) && window.SKYWARD_PWA_TEST_MODE!==true)){pwaSetMessage('PWA disponível quando o jogo é servido por HTTPS ou localhost.');return null;}
  try{
    const registration=await navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'});
    trackPwaWorker(registration);
    const ready=await navigator.serviceWorker.ready; trackPwaWorker(ready); PWA_STATE.cacheReady=true;
    pwaRecord('registered',ready.scope); renderPwaStatus();
    navigator.serviceWorker.controller?.postMessage({type:'GET_VERSION'});
    return ready;
  }catch(error){safeLogError(error,'pwa-register');pwaSetMessage('Não foi possível ativar o cache offline neste ambiente.');return null;}
}
async function checkPwaUpdate(){
  try{const reg=PWA_STATE.registration||await registerPwa();if(!reg)return false;await reg.update();pwaSetMessage(PWA_STATE.waitingWorker?'Atualização pronta para aplicar.':'Esta build já é a versão mais recente disponível.');return true;}
  catch(error){safeLogError(error,'pwa-update-check');pwaSetMessage('Falha ao verificar atualização; o jogo atual continua disponível.');return false;}
}
async function applyPwaUpdate(){
  const worker=PWA_STATE.waitingWorker||PWA_STATE.registration?.waiting;
  if(!worker){pwaSetMessage('Nenhuma atualização pendente.');return false;}
  try{
    PWA_STATE.applyingUpdate=true;
    if(typeof paused!=='undefined') paused=true;
    if(typeof persistProfile==='function') persistProfile('pwa-update');
    if(typeof saveGoodState==='function' && typeof running!=='undefined' && running) saveGoodState('pwa-update');
    pwaRecord('update-authorized',BUILD); pwaSetMessage('Progresso protegido. Ativando a nova build...');
    worker.postMessage({type:'SKIP_WAITING',build:BUILD}); return true;
  }catch(error){PWA_STATE.applyingUpdate=false;safeLogError(error,'pwa-apply-update');pwaSetMessage('Atualização cancelada para preservar o turno atual.');return false;}
}
function protectPwaProgress(reason){
  try{
    if(typeof persistProfile==='function') persistProfile(reason);
    if(typeof saveGoodState==='function' && typeof running!=='undefined' && running) saveGoodState(reason);
  }catch(error){safeLogError(error,'pwa-lifecycle-save');}
}
function initPwaRuntime(){
  PWA_STATE.standalone=pwaStandalone(); PWA_STATE.online=navigator.onLine!==false; renderPwaStatus();
  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-pwa-action]');if(!trigger)return;
    const action=trigger.dataset.pwaAction;
    if(action==='open')openPwaPanel(); else if(action==='close')closePwaPanel(); else if(action==='install')installPwa(); else if(action==='fullscreen')toggleProfessionalFullscreen(); else if(action==='update')applyPwaUpdate(); else if(action==='check-update')checkPwaUpdate();
  });
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();PWA_STATE.installPrompt=event;pwaRecord('install-ready');pwaSetMessage('Instalação disponível. O app ocupará a tela inteira e funcionará offline.');});
  window.addEventListener('appinstalled',()=>{PWA_STATE.installPrompt=null;PWA_STATE.standalone=true;pwaRecord('installed');pwaSetMessage('Aplicativo instalado com sucesso.');closePwaPanel();});
  window.addEventListener('online',()=>{PWA_STATE.online=true;pwaRecord('online');pwaSetMessage('Conexão restaurada. O cache offline permanece ativo.');checkPwaUpdate();});
  window.addEventListener('offline',()=>{PWA_STATE.online=false;pwaRecord('offline');pwaSetMessage('Sem internet. O turno continua usando os arquivos protegidos em cache.');});
  document.addEventListener('fullscreenchange',renderPwaStatus);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')protectPwaProgress('visibility-hidden');else if(document.visibilityState==='visible'&&PWA_STATE.online)checkPwaUpdate();});
  window.addEventListener('pagehide',()=>protectPwaProgress('pagehide'));
  navigator.serviceWorker?.addEventListener('message',event=>{const data=event.data||{};if(data.type==='PWA_VERSION'){PWA_STATE.cacheName=String(data.cacheName||'');PWA_STATE.cacheReady=Boolean(data.cacheReady);pwaRecord('worker-version',data.build||'');renderPwaStatus();}});
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(PWA_STATE.applyingUpdate)location.reload();});
  registerPwa();
}
window.SKYWARD_PWA=Object.freeze({pwaSchema:PWA_RUNTIME_SCHEMA,cacheSchema:PWA_CACHE_SCHEMA,getStatus:pwaStatusSnapshot,register:registerPwa,install:installPwa,checkUpdate:checkPwaUpdate,applyUpdate:applyPwaUpdate,toggleFullscreen:toggleProfessionalFullscreen,openPanel:openPwaPanel});
setTimeout(initPwaRuntime,0);
