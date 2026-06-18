import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8');CSS=(ROOT/'style.css').read_text(encoding='utf8');BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8');MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8');AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8');PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase8-browser','mode':'inline-controlled-runtime','environmentLimitation':'Chromium local navigation is blocked by policy; exact app HTML/CSS/JS are loaded in memory while file integrity is verified separately.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
def check(name,ok,detail=''):results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})
def inline_html():
 shim=f'''<script>
window.SKYWARD_QA_MODE=true;window.SKYWARD_PWA_TEST_MODE=true;
const __store=new Map();Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:k=>__store.has(String(k))?__store.get(String(k)):null,setItem:(k,v)=>__store.set(String(k),String(v)),removeItem:k=>__store.delete(String(k)),clear:()=>__store.clear(),key:i=>Array.from(__store.keys())[i]||null,get length(){{return __store.size;}}}}}});
Object.defineProperty(navigator,'vibrate',{{configurable:true,value:p=>{{window.__lastVibration=p;return true;}}}});
let __online=true;Object.defineProperty(navigator,'onLine',{{configurable:true,get:()=>__online}});window.__setOnline=v=>{{__online=!!v;window.dispatchEvent(new Event(v?'online':'offline'));}};
const __worker={{messages:[],postMessage(m){{this.messages.push(m);}}}};const __reg={{scope:'https://pwa-test.invalid/',waiting:null,installing:null,active:__worker,update:async()=>true,addEventListener:()=>{{}}}};const __swListeners={{}};
Object.defineProperty(navigator,'serviceWorker',{{configurable:true,value:{{controller:__worker,ready:Promise.resolve(__reg),register:async()=>__reg,addEventListener:(n,f)=>(__swListeners[n]=f),getRegistrations:async()=>[__reg]}}}});
window.fetch=async url=>{{const key=String(url);if(key.includes('airports.json'))return{{ok:true,status:200,json:async()=>({AIRPORTS})}};if(key.includes('aircraft.json'))return{{ok:true,status:200,json:async()=>({AIRCRAFT})}};if(key.includes('pwa-cache-manifest.json'))return{{ok:true,status:200,json:async()=>({PWA_MANIFEST})}};return{{ok:false,status:404,json:async()=>({{}})}};}};
let __fullscreen=null;Object.defineProperty(document,'fullscreenElement',{{configurable:true,get:()=>__fullscreen}});document.documentElement.requestFullscreen=async()=>{{__fullscreen=document.documentElement;document.dispatchEvent(new Event('fullscreenchange'));}};document.exitFullscreen=async()=>{{__fullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));}};try{{Object.defineProperty(screen,'orientation',{{configurable:true,value:{{lock:async()=>true}}}});}}catch(_e){{}}
</script>'''
 html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>')
 html=html.replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
 return html.replace('<script src="main.js"></script>',shim+f'<script>{MAIN_JS}</script>')
HTML=inline_html()
def start_game(page):
 page.locator('[data-go="menu"]').first.click();page.wait_for_timeout(50);page.locator('[data-go="lobby"]').first.click();page.wait_for_timeout(50);page.locator('#lobby [data-go="game"]').click();page.wait_for_timeout(650)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 context=browser.new_context(viewport=VIEWPORTS['mobile_landscape'],device_scale_factor=1,has_touch=True)
 page=context.new_page();page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_MOBILE_UX && window.SKYWARD_TEST_API',timeout=20000);page.wait_for_timeout(800)
 base=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,arch:window.SKYWARD_ARCHITECTURE,ux:{schema:window.SKYWARD_MOBILE_UX.uxSchema,mode:window.SKYWARD_MOBILE_UX.viewportMode(),target:window.SKYWARD_MOBILE_UX.touchTargetPx()}})");results['build']=base['build']
 check('build F08+ carregada',int(base['build'].get('phase','F00')[1:])>=8,str(base['build']))
 check('UX schema carregado',base['build'].get('uxSchema')==1 and base['ux']['schema']==1,str(base['ux']))
 check('arquitetura geração 8+',base['arch'].get('generation',0)>=8,str(base['arch']))
 check('autoteste interno aprovado',base['self'].get('ok') is True,json.dumps(base['self'].get('errors',[]),ensure_ascii=False))
 check('viewport mobile horizontal detectado',base['ux']['mode']=='mobile-landscape',str(base['ux']))
 check('alvo de toque mobile >=46px',base['ux']['target']>=46,str(base['ux']))
 start_game(page)
 page.evaluate('()=>window.SKYWARD_TEST_API.generateTraffic(8,8080)');page.wait_for_timeout(200)
 page.evaluate("()=>{const c=document.querySelector('#mobileGestureCoach');if(c){c.classList.remove('show');c.hidden=true;}}")
 initial=page.evaluate("()=>{const p=document.querySelector('#mobilePanel'),a=document.querySelector('#mobileActionSheet'),r=document.querySelector('#radar').getBoundingClientRect(),l=document.querySelector('#mobileAtcLayer').getBoundingClientRect();return {panel:p.classList.contains('active'),actions:a.classList.contains('active'),dock:document.querySelectorAll('.mobile-nav').length,layer:getComputedStyle(document.querySelector('#mobileAtcLayer')).display,radarRatio:(r.width*r.height)/(innerWidth*innerHeight),requestBadge:document.querySelector('#mobileRequestsBadge').textContent,trafficBadge:document.querySelector('#mobileTrafficBadge').textContent,mode:document.documentElement.dataset.viewportMode};}")
 check('turno inicia sem painel cobrindo radar',not initial['panel'] and not initial['actions'],str(initial))
 check('dock operacional possui cinco áreas',initial['dock']==5,str(initial))
 check('camada móvel está visível',initial['layer']!='none',str(initial))
 check('radar ocupa maior parte do viewport',initial['radarRatio']>=0.58,str(initial))
 check('badges refletem tráfego e pedidos',int(initial['trafficBadge'])==8 and int(initial['requestBadge'])>=1,str(initial))
 check('dataset responsivo sincronizado',initial['mode']=='mobile-landscape',str(initial))
 heights=page.evaluate("()=>Array.from(document.querySelectorAll('.mobile-nav')).map(e=>e.getBoundingClientRect().height)")
 check('todos os botões têm alvo >=44px',all(h>=44 for h in heights),str(heights))
 page.locator('[data-mobile-tab="traffic"]').click();page.wait_for_timeout(100)
 traffic=page.evaluate("()=>{const p=document.querySelector('#mobilePanel'),a=document.querySelector('#mobileActionSheet'),rect=p.getBoundingClientRect();return {panel:p.classList.contains('active'),actions:a.classList.contains('active'),rows:document.querySelectorAll('[data-mobile-aircraft]').length,width:rect.width/innerWidth};}")
 check('tráfego abre painel único',traffic['panel'] and not traffic['actions'],str(traffic))
 check('lista mostra oito aeronaves',traffic['rows']==8,str(traffic))
 check('painel lateral preserva pelo menos 55% do radar',traffic['width']<=0.44,str(traffic))
 page.locator('[data-mobile-aircraft]').first.click();page.wait_for_timeout(120)
 action=page.evaluate("()=>({panel:document.querySelector('#mobilePanel').classList.contains('active'),actions:document.querySelector('#mobileActionSheet').classList.contains('active'),chip:!document.querySelector('#mobileSelectedChip').hidden,commands:document.querySelectorAll('#mobilePrimaryActions .mobile-cmd').length,selected:document.querySelector('#mobileSelectedChipId').textContent})")
 check('seleção troca painel por action sheet',not action['panel'] and action['actions'],str(action))
 check('chip mostra aeronave selecionada',action['chip'] and action['selected']!='---',str(action))
 check('ações contextuais disponíveis',action['commands']>=4,str(action))
 # Swipe down over action sheet to close.
 page.evaluate("()=>{const e=document.querySelector('#mobileActionSheet');e.dispatchEvent(new PointerEvent('pointerdown',{pointerId:41,pointerType:'touch',clientX:700,clientY:100,bubbles:true}));e.dispatchEvent(new PointerEvent('pointerup',{pointerId:41,pointerType:'touch',clientX:700,clientY:190,bubbles:true}));}");page.wait_for_timeout(100)
 check('swipe para baixo fecha action sheet',not page.locator('#mobileActionSheet').evaluate("e=>e.classList.contains('active')"))
 # Edge gestures on radar.
 page.evaluate("()=>{const e=document.querySelector('#radar');e.dispatchEvent(new PointerEvent('pointerdown',{pointerId:42,pointerType:'touch',clientX:2,clientY:180,bubbles:true}));e.dispatchEvent(new PointerEvent('pointerup',{pointerId:42,pointerType:'touch',clientX:110,clientY:180,bubbles:true}));}");page.wait_for_timeout(100)
 check('swipe da borda esquerda abre pedidos',page.locator('#mobilePanel').evaluate("e=>e.classList.contains('active')") and page.locator('#mobilePanelTitle').text_content()=='PEDIDOS ATC')
 page.evaluate('()=>window.SKYWARD_MOBILE_UX.close()');page.wait_for_timeout(60)
 page.evaluate("()=>{const e=document.querySelector('#radar');e.dispatchEvent(new PointerEvent('pointerdown',{pointerId:43,pointerType:'touch',clientX:842,clientY:180,bubbles:true}));e.dispatchEvent(new PointerEvent('pointerup',{pointerId:43,pointerType:'touch',clientX:730,clientY:180,bubbles:true}));}");page.wait_for_timeout(100)
 check('swipe da borda direita abre comandos',page.locator('#mobileActionSheet').evaluate("e=>e.classList.contains('active')"))
 page.evaluate('()=>window.SKYWARD_MOBILE_UX.close()');page.locator('[data-mobile-tab="safety"]').click();page.wait_for_timeout(100)
 old=page.evaluate('()=>window.SKYWARD_MOBILE_UX.getPreferences().haptics');page.locator('[data-mobile-setting="haptics"]').click();page.wait_for_timeout(80);new=page.evaluate('()=>window.SKYWARD_MOBILE_UX.getPreferences().haptics')
 check('preferência háptica alterna',old!=new,f'{old}->{new}')
 check('preferência háptica persiste',page.evaluate("()=>localStorage.getItem('skywardMobilePrefs_v1')") is not None)
 page.locator('[data-mobile-setting="coach"]').click();page.wait_for_timeout(60)
 check('guia de gestos pode ser reaberto',page.locator('#mobileGestureCoach').evaluate("e=>e.classList.contains('show')"))
 page.locator('#mobileGestureCoachClose').click();page.wait_for_timeout(50)
 page.screenshot(path=str(AUDIT/'PHASE8_mobile_game.png'),full_page=True)
 # Responsive mode and visibility matrix.
 for name,viewport in VIEWPORTS.items():
  vp=context.new_page();vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None);vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}));vp.set_viewport_size(viewport);vp.set_content(HTML,wait_until='domcontentloaded');vp.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_MOBILE_UX',timeout=20000);vp.wait_for_timeout(700)
  expected={'desktop':'desktop','tablet':'tablet','mobile_landscape':'mobile-landscape','mobile_portrait':'mobile-portrait'}[name]
  mode=vp.evaluate('()=>window.SKYWARD_MOBILE_UX.viewportMode()');check(f'{name}: modo responsivo correto',mode==expected,mode)
  if name=='mobile_portrait':
   vp.locator('[data-go="menu"]').first.click();vp.locator('[data-go="profile"]').click();vp.wait_for_timeout(50);access=vp.evaluate("()=>{const s=document.querySelector('#profile');s.scrollTop=9999;return {scrollTop:s.scrollTop,scrollHeight:s.scrollHeight,clientHeight:s.clientHeight,guard:getComputedStyle(document.querySelector('#orientationGuard')).display};}");check('retrato mantém menus roláveis',access['scrollHeight']<=access['clientHeight'] or access['scrollTop']>0,str(access));check('retrato não bloqueia menus',access['guard']=='none',str(access))
  else:
   start_game(vp);vis=vp.evaluate("()=>({mobile:getComputedStyle(document.querySelector('#mobileAtcLayer')).display,game:document.body.classList.contains('game-active')})");check(f'{name}: turno inicia',vis['game'],str(vis));check(f'{name}: camada móvel adequada',(vis['mobile']!='none') if name=='mobile_landscape' else (vis['mobile']=='none'),str(vis))
  vp.screenshot(path=str(AUDIT/f'PHASE8_{name}.png'),full_page=True);results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'mode':mode,'selfTest':vp.evaluate('()=>window.SKYWARD_SELF_TEST.ok')};vp.close()
 browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
 (AUDIT/'PHASE8_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 lines=['# Fase 08 — Auditoria Chromium da UX móvel','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: HTML, CSS e JavaScript exatos carregados em memória por bloqueio administrativo de URLs locais.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
 (AUDIT/'PHASE8_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F08 browser tests: {results['passed']}/{results['total']} aprovados")
for c in results['checks']:print(('PASS' if c['ok'] else 'FAIL')+'  '+c['name']+((' — '+str(c['detail'])) if not c['ok'] and c.get('detail') else ''))
if results['failed']:raise SystemExit(1)
