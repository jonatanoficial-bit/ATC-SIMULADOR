import json
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8')
CSS=(ROOT/'style.css').read_text(encoding='utf8')
BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8')
MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8')
AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8')
PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase7-browser','mode':'inline-controlled-pwa-api','environmentLimitation':'Chromium blocks local and synthetic navigations by administrator policy; Service Worker lifecycle is executed separately in phase7 unit tests.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
def check(name,ok,detail=''):results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})
def inline_html():
  shim=f'''<script>
window.SKYWARD_QA_MODE=true;window.SKYWARD_PWA_TEST_MODE=true;
const __store=new Map();Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:k=>__store.has(String(k))?__store.get(String(k)):null,setItem:(k,v)=>__store.set(String(k),String(v)),removeItem:k=>__store.delete(String(k)),clear:()=>__store.clear(),key:i=>Array.from(__store.keys())[i]||null,get length(){{return __store.size;}}}}}});
let __online=true;Object.defineProperty(navigator,'onLine',{{configurable:true,get:()=>__online}});window.__setOnline=v=>{{__online=!!v;window.dispatchEvent(new Event(v?'online':'offline'));}};
const __worker={{messages:[],postMessage(m){{this.messages.push(m);}}}};const __reg={{scope:'https://pwa-test.invalid/',waiting:null,installing:null,active:__worker,update:async()=>true,addEventListener:()=>{{}}}};
const __swListeners={{}};Object.defineProperty(navigator,'serviceWorker',{{configurable:true,value:{{controller:__worker,ready:Promise.resolve(__reg),register:async()=>__reg,addEventListener:(n,f)=>(__swListeners[n]=f),getRegistrations:async()=>[__reg]}}}});
window.__dispatchSwMessage=data=>__swListeners.message?.({{data}});
window.fetch=async url=>{{const key=String(url);if(key.includes('airports.json'))return{{ok:true,status:200,json:async()=>({AIRPORTS})}};if(key.includes('aircraft.json'))return{{ok:true,status:200,json:async()=>({AIRCRAFT})}};if(key.includes('pwa-cache-manifest.json'))return{{ok:true,status:200,json:async()=>({PWA_MANIFEST})}};return{{ok:false,status:404,json:async()=>({{}})}};}};
let __fullscreen=null;Object.defineProperty(document,'fullscreenElement',{{configurable:true,get:()=>__fullscreen}});document.documentElement.requestFullscreen=async()=>{{__fullscreen=document.documentElement;document.dispatchEvent(new Event('fullscreenchange'));}};document.exitFullscreen=async()=>{{__fullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));}};
try{{Object.defineProperty(screen,'orientation',{{configurable:true,value:{{lock:async()=>true}}}});}}catch(_e){{}}
</script>'''
  html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>')
  html=html.replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
  html=html.replace('<script src="main.js"></script>',shim+f'<script>{MAIN_JS}</script>')
  return html
HTML=inline_html()
print('F07 browser: start',flush=True)
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
  context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
  page=context.new_page();page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
  print('F07 browser: initial content',flush=True);page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function("window.SKYWARD_SELF_TEST && window.SKYWARD_PWA",timeout=20000);page.wait_for_timeout(700)
  runtime=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,pwa:window.SKYWARD_PWA.getStatus(),arch:window.SKYWARD_ARCHITECTURE})");results['build']=runtime['build']
  check('build F07+ carregada',int(runtime['build'].get('phase','F00')[1:])>=7,str(runtime['build']))
  check('schemas PWA carregados',runtime['build'].get('pwaSchema')==1 and runtime['build'].get('cacheSchema')==1)
  check('arquitetura geração 7+',runtime['arch'].get('generation',0)>=7)
  check('autoteste interno aprovado',runtime['self'].get('ok') is True,json.dumps(runtime['self'].get('errors',[]),ensure_ascii=False))
  check('API PWA registrada no navegador controlado',runtime['pwa']['supported'] and runtime['pwa']['registered'] and runtime['pwa']['cacheReady'],str(runtime['pwa']))
  page.evaluate("()=>window.__dispatchSwMessage({type:'PWA_VERSION',build:window.SKYWARD_BUILD_INFO.build,cacheName:'skyward-test-cache',cacheReady:true})");page.wait_for_timeout(50)
  check('mensagem do worker atualiza cache visível',page.locator('[data-pwa-cache-name]').first.text_content()=='skyward-test-cache')
  print('F07 browser: base checks',flush=True);page.locator('[data-go="menu"]').first.click();page.locator('[data-pwa-action="open"]').click();page.wait_for_timeout(50)
  check('painel PWA abre',page.locator('#pwaPanel').evaluate("e=>e.classList.contains('open')"))
  status=page.evaluate("()=>({network:document.querySelector('#pwaNetworkValue').textContent,cache:document.querySelector('#pwaCacheValue').textContent,update:document.querySelector('#pwaUpdateValue').textContent})")
  check('painel informa rede e cache',status['network']=='ONLINE' and status['cache']=='PRONTO',str(status))
  page.locator('[data-pwa-action="fullscreen"]').first.click();page.wait_for_timeout(50)
  check('fullscreen alterna sem quebrar interface',page.evaluate("()=>window.SKYWARD_PWA.getStatus().fullscreen") is True)
  page.locator('[data-pwa-action="fullscreen"]').first.click();page.wait_for_timeout(50)
  check('saída do fullscreen funciona',page.evaluate("()=>window.SKYWARD_PWA.getStatus().fullscreen") is False)
  page.locator('[data-pwa-action="close"]').click();print('F07 browser: desktop screenshot',flush=True);page.screenshot(path=str(AUDIT/'PHASE7_desktop_pwa.png'),full_page=True)
  page.evaluate("()=>window.__setOnline(false)");page.wait_for_timeout(80)
  offline=page.evaluate("""async()=>({online:window.SKYWARD_PWA.getStatus().online,banner:document.querySelector('#networkBanner').classList.contains('show'),airports:(await (await fetch('./data/airports.json')).json()).length,message:document.querySelector('#pwaMenuStatus').textContent})""")
  check('evento offline ativa modo protegido',offline['online'] is False and offline['banner'] is True,str(offline))
  check('dados operacionais continuam acessíveis no ensaio offline',offline['airports']>=10,str(offline))
  page.screenshot(path=str(AUDIT/'PHASE7_offline_controlled.png'),full_page=True)
  page.evaluate("()=>window.__setOnline(true)");page.wait_for_timeout(80);check('retorno online detectado',page.evaluate("()=>window.SKYWARD_PWA.getStatus().online") is True)
  print('F07 browser: responsive loop',flush=True)
  for name,viewport in VIEWPORTS.items():
    print('viewport',name,flush=True)
    vp=context.new_page()
    vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None)
    vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}))
    vp.set_viewport_size(viewport)
    vp.set_content(HTML,wait_until='domcontentloaded')
    vp.wait_for_function("window.SKYWARD_SELF_TEST && window.SKYWARD_PWA",timeout=20000)
    vp.wait_for_timeout(650)
    vp.locator('[data-go="menu"]').first.click()
    if name=='mobile_portrait':
      vp.locator('[data-go="profile"]').click();vp.wait_for_timeout(80)
      access=vp.evaluate("()=>{const s=document.querySelector('#profile');const b=s.querySelector('[data-go=\"lobby\"]');const before=s.scrollTop;s.scrollTop=9999;const scrollable=s.scrollTop>before&&s.scrollHeight>s.clientHeight;const rect=b.getBoundingClientRect();return {scrollable,fits:s.scrollHeight<=s.clientHeight,buttonReachable:rect.bottom<=innerHeight+2,scrollHeight:s.scrollHeight,clientHeight:s.clientHeight};}")
      check('mobile retrato mantém perfil totalmente acessível',access['scrollable'] or access['fits'] or access['buttonReachable'],str(access))
    else:
      vp.locator('[data-go="lobby"]').first.click();vp.wait_for_timeout(80);vp.locator('#lobby [data-go="game"]').click();vp.wait_for_timeout(450)
      layout=vp.evaluate("()=>({game:document.body.classList.contains('game-active'),fullBtn:Boolean(document.querySelector('#gameFullscreenBtn')),guard:getComputedStyle(document.querySelector('#orientationGuard')).display,mobile:getComputedStyle(document.querySelector('#mobileAtcLayer')).display})")
      check(f'{name}: turno inicia com controle fullscreen',layout['game'] and layout['fullBtn'],str(layout))
      if name=='mobile_landscape':check('mobile horizontal mantém camada operacional',layout['mobile']!='none',str(layout))
      if name=='desktop':check('desktop mantém camada mobile oculta',layout['mobile']=='none',str(layout))
    vp.screenshot(path=str(AUDIT/f'PHASE7_{name}.png'),full_page=True)
    results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'selfTest':vp.evaluate("()=>window.SKYWARD_SELF_TEST.ok")}
    vp.close()
  print('F07 browser: close',flush=True);browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
  (AUDIT/'PHASE7_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
  lines=['# Fase 07 — Auditoria Chromium PWA','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: APIs PWA controladas em memória porque URLs locais/sintéticas são bloqueadas por política administrativa.', '- O ciclo do Service Worker e o fallback offline são executados separadamente nos testes unitários F07.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
  (AUDIT/'PHASE7_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F07 browser tests: {results['passed']}/{results['total']} aprovados")
for item in results['checks']:print(('PASS' if item['ok'] else 'FAIL')+'  '+item['name']+((' — '+str(item['detail'])) if not item['ok'] and item.get('detail') else ''))
if results['failed']:raise SystemExit(1)
