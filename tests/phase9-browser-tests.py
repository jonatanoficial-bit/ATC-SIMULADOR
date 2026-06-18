import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8');CSS=(ROOT/'style.css').read_text(encoding='utf8');BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8');MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8');AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8');PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'wide_desktop':{'width':1920,'height':1080},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase9-browser','mode':'inline-controlled-runtime','environmentLimitation':'Chromium local navigation is blocked by policy; exact app HTML/CSS/JS are loaded in memory while file integrity is verified separately.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
def check(name,ok,detail=''):results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})
def inline_html():
 shim=f'''<script>
window.SKYWARD_QA_MODE=true;window.SKYWARD_PWA_TEST_MODE=true;
const __store=new Map();Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:k=>__store.has(String(k))?__store.get(String(k)):null,setItem:(k,v)=>__store.set(String(k),String(v)),removeItem:k=>__store.delete(String(k)),clear:()=>__store.clear(),key:i=>Array.from(__store.keys())[i]||null,get length(){{return __store.size;}}}}}});
Object.defineProperty(navigator,'vibrate',{{configurable:true,value:()=>true}});let __online=true;Object.defineProperty(navigator,'onLine',{{configurable:true,get:()=>__online}});
const __worker={{postMessage:()=>{{}}}},__reg={{scope:'https://test.invalid/',waiting:null,installing:null,active:__worker,update:async()=>true,addEventListener:()=>{{}}}};Object.defineProperty(navigator,'serviceWorker',{{configurable:true,value:{{controller:__worker,ready:Promise.resolve(__reg),register:async()=>__reg,addEventListener:()=>{{}},getRegistrations:async()=>[__reg]}}}});
window.fetch=async url=>{{const key=String(url);if(key.includes('airports.json'))return{{ok:true,status:200,json:async()=>({AIRPORTS})}};if(key.includes('aircraft.json'))return{{ok:true,status:200,json:async()=>({AIRCRAFT})}};if(key.includes('pwa-cache-manifest.json'))return{{ok:true,status:200,json:async()=>({PWA_MANIFEST})}};return{{ok:false,status:404,json:async()=>({{}})}};}};
let __fullscreen=null;Object.defineProperty(document,'fullscreenElement',{{configurable:true,get:()=>__fullscreen}});document.documentElement.requestFullscreen=async()=>{{__fullscreen=document.documentElement;document.dispatchEvent(new Event('fullscreenchange'));}};document.exitFullscreen=async()=>{{__fullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));}};
</script>'''
 html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>').replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
 return html.replace('<script src="main.js"></script>',shim+f'<script>{MAIN_JS}</script>')
HTML=inline_html()
def start_game(page):
 page.locator('[data-go="menu"]').first.click();page.wait_for_timeout(40);page.locator('[data-go="lobby"]').first.click();page.wait_for_timeout(40);page.locator('#lobby [data-go="game"]').click();page.wait_for_timeout(700)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
 page=context.new_page();page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_DESKTOP_WORKSPACE && window.SKYWARD_TEST_API',timeout=20000);page.wait_for_timeout(900)
 base=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,arch:window.SKYWARD_ARCHITECTURE,desktop:{schema:window.SKYWARD_DESKTOP_WORKSPACE.schema,mode:window.SKYWARD_DESKTOP_WORKSPACE.viewportMode()}})");results['build']=base['build']
 check('build F09+ carregada',int(str(base['build'].get('phase','F0'))[1:])>=9,str(base['build']))
 check('desktop schema carregado',base['build'].get('desktopSchema')==1 and base['desktop']['schema']==1,str(base['desktop']))
 check('arquitetura geração 9+',base['arch'].get('generation')>=9,str(base['arch']))
 check('autoteste interno aprovado',base['self'].get('ok') is True,json.dumps(base['self'].get('errors',[]),ensure_ascii=False))
 check('viewport desktop detectado',base['desktop']['mode']=='desktop',str(base['desktop']))
 start_game(page);page.evaluate('()=>window.SKYWARD_TEST_API.generateTraffic(10,9090)');page.wait_for_timeout(250)
 initial=page.evaluate("()=>{const r=document.querySelector('#radar').getBoundingClientRect(),v=innerWidth*innerHeight;return {hud:getComputedStyle(document.querySelector('#desktopWorkspaceHud')).display,traffic:getComputedStyle(document.querySelector('.traffic-stack')).display,ops:getComputedStyle(document.querySelector('.ops-panel')).display,bottom:getComputedStyle(document.querySelector('.bottom-dock')).display,buttons:document.querySelectorAll('[data-workspace-action]').length,radarRatio:r.width*r.height/v,mode:document.documentElement.dataset.workspaceMode};}")
 check('HUD desktop visível',initial['hud']!='none',str(initial));check('workspace inicia com quatro áreas',initial['traffic']!='none' and initial['ops']!='none' and initial['bottom']!='none',str(initial));check('toolbar possui controles completos',initial['buttons']>=12,str(initial));check('modo inicial balanceado',initial['mode']=='balanced',str(initial))
 page.locator('[data-workspace-action="radar"]').click();page.wait_for_timeout(140)
 radar=page.evaluate("()=>{const r=document.querySelector('#radar').getBoundingClientRect();return {cls:document.body.className,traffic:getComputedStyle(document.querySelector('.traffic-stack')).display,ops:getComputedStyle(document.querySelector('.ops-panel')).display,bottom:getComputedStyle(document.querySelector('.bottom-dock')).display,ratio:r.width*r.height/(innerWidth*innerHeight)};}")
 check('modo radar oculta três painéis',radar['traffic']=='none' and radar['ops']=='none' and radar['bottom']=='none',str(radar));check('modo radar amplia área útil',radar['ratio']>initial['radarRatio'],str(radar))
 page.keyboard.press('KeyW');page.wait_for_timeout(120);balanced=page.evaluate("()=>({mode:document.documentElement.dataset.workspaceMode,traffic:getComputedStyle(document.querySelector('.traffic-stack')).display,ops:getComputedStyle(document.querySelector('.ops-panel')).display,bottom:getComputedStyle(document.querySelector('.bottom-dock')).display})")
 check('atalho W restaura workspace',balanced['mode']=='balanced' and all(balanced[k]!='none' for k in ['traffic','ops','bottom']),str(balanced))
 page.keyboard.press('BracketLeft');page.wait_for_timeout(80);check('atalho [ alterna tráfego',page.evaluate("()=>getComputedStyle(document.querySelector('.traffic-stack')).display")=='none')
 page.keyboard.press('BracketLeft');page.keyboard.press('BracketRight');page.wait_for_timeout(80);check('atalho ] alterna operações',page.evaluate("()=>getComputedStyle(document.querySelector('.ops-panel')).display")=='none')
 page.keyboard.press('BracketRight');page.keyboard.press('KeyB');page.wait_for_timeout(80);check('atalho B alterna dock',page.evaluate("()=>getComputedStyle(document.querySelector('.bottom-dock')).display")=='none');page.keyboard.press('KeyB')
 page.keyboard.press('Shift+KeyA');page.wait_for_timeout(100);analysis=page.evaluate("()=>({mode:document.documentElement.dataset.workspaceMode,left:getComputedStyle(document.querySelector('.atc-scene')).getPropertyValue('--workspace-left-width'),right:getComputedStyle(document.querySelector('.atc-scene')).getPropertyValue('--workspace-right-width'),bottom:getComputedStyle(document.querySelector('.atc-scene')).getPropertyValue('--workspace-bottom-height')})")
 check('Shift+A ativa análise',analysis['mode']=='analysis',str(analysis));check('análise amplia painéis',int(float(analysis['left'].replace('px','')))>=260 and int(float(analysis['right'].replace('px','')))>=370 and int(float(analysis['bottom'].replace('px','')))>=160,str(analysis))
 before=page.evaluate('()=>window.SKYWARD_DESKTOP_WORKSPACE.getPreferences().leftWidth');page.locator('[data-workspace-action="wide-left"]').click();after=page.evaluate('()=>window.SKYWARD_DESKTOP_WORKSPACE.getPreferences().leftWidth');check('largura ajustável funciona',after>before,f'{before}->{after}')
 page.locator('[data-workspace-action="density"]').click();page.wait_for_timeout(60);check('densidade compacta persiste',page.evaluate("()=>document.body.classList.contains('workspace-compact')&&localStorage.getItem('skywardDesktopWorkspace_v1')!==null"))
 page.keyboard.press('KeyN');page.wait_for_timeout(80);sel1=page.evaluate('()=>document.querySelector("#selectedBox").textContent');check('atalho N seleciona solicitação','Nenhuma aeronave' not in sel1,sel1)
 page.keyboard.press('ArrowRight');page.wait_for_timeout(80);sel2=page.evaluate('()=>document.querySelector("#selectedBox").textContent');check('seta alterna aeronave',sel2!=sel1,f'{sel1} -> {sel2}')
 page.keyboard.press('Digit5');page.wait_for_timeout(50);check('atalho 5 abre Safety',page.locator('[data-dock="safety"]').evaluate("e=>e.classList.contains('active')"))
 page.keyboard.press('Slash');page.wait_for_timeout(60);check('atalho ? abre ajuda',page.locator('#desktopShortcutSheet').evaluate("e=>e.classList.contains('open')"));page.keyboard.press('Escape');page.wait_for_timeout(50);check('Escape fecha ajuda',not page.locator('#desktopShortcutSheet').evaluate("e=>e.classList.contains('open')"))
 before_pause=page.locator('#pauseBtn').text_content();page.keyboard.press('KeyP');page.wait_for_timeout(50);after_pause=page.locator('#pauseBtn').text_content();check('atalho P pausa ou retoma',before_pause!=after_pause,f'{before_pause}->{after_pause}')
 page.keyboard.press('KeyC');page.wait_for_timeout(70);check('atalho C abre comandos',page.locator('#moreCommandSheet').evaluate("e=>e.classList.contains('open')"));page.keyboard.press('Escape')
 page.screenshot(path=str(AUDIT/'PHASE9_desktop_workspace.png'),full_page=True)
 for name,viewport in VIEWPORTS.items():
  vp=context.new_page();vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None);vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}));vp.set_viewport_size(viewport);vp.set_content(HTML,wait_until='domcontentloaded');vp.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_DESKTOP_WORKSPACE && window.SKYWARD_MOBILE_UX',timeout=20000);vp.wait_for_timeout(800)
  start_game(vp);mode=vp.evaluate('()=>window.SKYWARD_DESKTOP_WORKSPACE.viewportMode()');hud=vp.evaluate("()=>getComputedStyle(document.querySelector('#desktopWorkspaceHud')).display");mobile=vp.evaluate("()=>getComputedStyle(document.querySelector('#mobileAtcLayer')).display")
  expected='desktop' if viewport['width']>=1181 else ('tablet' if viewport['width']>=981 else 'compact');check(f'{name}: modo workspace correto',mode==expected,mode)
  check(f'{name}: visibilidade correta do HUD',(hud!='none') if viewport['width']>=981 else (hud=='none'),hud)
  check(f'{name}: camada mobile preservada',(mobile!='none') if name=='mobile_landscape' else (mobile=='none'),mobile)
  if name=='tablet':
   heights=vp.evaluate("()=>Array.from(document.querySelectorAll('#desktopWorkspaceHud button')).filter(e=>getComputedStyle(e).display!=='none').map(e=>e.getBoundingClientRect().height)");check('tablet: alvos touch-safe >=36px',all(h>=36 for h in heights),str(heights));check('tablet: painéis simultâneos',vp.evaluate("()=>['.traffic-stack','.ops-panel','.bottom-dock'].every(s=>getComputedStyle(document.querySelector(s)).display!=='none')"))
  vp.screenshot(path=str(AUDIT/f'PHASE9_{name}.png'),full_page=True);results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'mode':mode,'selfTest':vp.evaluate('()=>window.SKYWARD_SELF_TEST.ok')};vp.close()
 browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
 (AUDIT/'PHASE9_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 lines=['# Fase 09 — Auditoria Chromium do workspace tablet/desktop','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: HTML, CSS e JavaScript exatos carregados em memória por bloqueio administrativo de URLs locais.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
 (AUDIT/'PHASE9_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F09 browser tests: {results['passed']}/{results['total']} aprovados")
for c in results['checks']:print(('PASS' if c['ok'] else 'FAIL')+'  '+c['name']+((' — '+str(c['detail'])) if not c['ok'] and c.get('detail') else ''))
if results['failed']:raise SystemExit(1)
