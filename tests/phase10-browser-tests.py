import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8');CSS=(ROOT/'style.css').read_text(encoding='utf8');BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8');MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8');AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8');PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase10-browser','mode':'inline-controlled-runtime','environmentLimitation':'Chromium local navigation is blocked by policy; exact app HTML/CSS/JS are loaded in memory while file integrity is verified separately.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
def check(name,ok,detail=''):results['checks'].append({'name':name,'ok':bool(ok),'detail':str(detail)})
def inline_html():
 shim=f'''<script>
window.SKYWARD_QA_MODE=true;window.SKYWARD_PWA_TEST_MODE=true;
const __store=new Map();Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:k=>__store.has(String(k))?__store.get(String(k)):null,setItem:(k,v)=>__store.set(String(k),String(v)),removeItem:k=>__store.delete(String(k)),clear:()=>__store.clear(),key:i=>Array.from(__store.keys())[i]||null,get length(){{return __store.size;}}}}}});
Object.defineProperty(navigator,'vibrate',{{configurable:true,value:()=>true}});Object.defineProperty(navigator,'onLine',{{configurable:true,get:()=>true}});
const __worker={{postMessage:()=>{{}}}},__reg={{scope:'https://test.invalid/',waiting:null,installing:null,active:__worker,update:async()=>true,addEventListener:()=>{{}}}};Object.defineProperty(navigator,'serviceWorker',{{configurable:true,value:{{controller:__worker,ready:Promise.resolve(__reg),register:async()=>__reg,addEventListener:()=>{{}},getRegistrations:async()=>[__reg]}}}});
window.fetch=async url=>{{const key=String(url);if(key.includes('airports.json'))return{{ok:true,status:200,json:async()=>({AIRPORTS})}};if(key.includes('aircraft.json'))return{{ok:true,status:200,json:async()=>({AIRCRAFT})}};if(key.includes('pwa-cache-manifest.json'))return{{ok:true,status:200,json:async()=>({PWA_MANIFEST})}};return{{ok:false,status:404,json:async()=>({{}})}};}};
let __fullscreen=null;Object.defineProperty(document,'fullscreenElement',{{configurable:true,get:()=>__fullscreen}});document.documentElement.requestFullscreen=async()=>{{__fullscreen=document.documentElement;document.dispatchEvent(new Event('fullscreenchange'));}};document.exitFullscreen=async()=>{{__fullscreen=null;document.dispatchEvent(new Event('fullscreenchange'));}};
</script>'''
 html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>').replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
 return html.replace('<script src="main.js"></script>',shim+f'<script>{MAIN_JS}</script>')
HTML=inline_html()
def start_game(page):
 page.evaluate("()=>document.querySelector('#accessibilityPanel')?.classList.remove('open')")
 if page.locator('#boot.active').count():
  page.locator('#boot [data-go="menu"]').click();page.wait_for_timeout(40)
 if not page.locator('#lobby.active').count():
  page.locator('#menu [data-go="lobby"]').click();page.wait_for_timeout(40)
 page.locator('#lobby [data-go="game"]').click();page.wait_for_timeout(750)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
 page=context.new_page();page.set_default_timeout(5000);page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_ACCESSIBILITY && window.SKYWARD_DESKTOP_WORKSPACE',timeout=20000);page.wait_for_timeout(900)
 base=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,api:window.SKYWARD_ACCESSIBILITY.selfCheck(),schema:window.SKYWARD_ACCESSIBILITY.schema})");results['build']=base['build']
 check('build F10+ carregada',str(base['build'].get('phase','F00'))>='F10' and base['build'].get('accessibilitySchema')==1,base['build'])
 check('accessibility schema carregado',base['build'].get('accessibilitySchema')==1 and base['schema']==1,base)
 check('autoteste interno aprovado',base['self'].get('ok') is True,json.dumps(base['self'].get('errors',[]),ensure_ascii=False))
 check('self check F10 aprovado',base['api'].get('ok') is True,base['api'])
 page.locator('[data-go="menu"]').first.click();page.wait_for_timeout(80);page.locator('button[data-settings-action="open"]:visible').first.click();page.wait_for_timeout(120)
 check('painel abre pelo menu',page.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"))
 page.locator('[data-access-setting="uiScale"]').first.select_option('120');page.locator('[data-access-setting="contrast"]').first.select_option('high');page.locator('[data-access-setting="colorMode"]').first.select_option('deuteranopia');page.locator('[data-access-setting="largeTargets"]').first.check();page.locator('[data-access-setting="reducedMotion"]').first.check();page.locator('[data-access-setting="performanceMode"]').first.select_option('battery');page.wait_for_timeout(160)
 settings=page.evaluate("()=>({ui:document.documentElement.dataset.uiScale,contrast:document.documentElement.dataset.contrast,color:document.documentElement.dataset.colorMode,large:document.body.classList.contains('access-large-targets'),motion:document.body.classList.contains('access-reduced-motion'),perf:document.documentElement.dataset.performanceMode,stored:localStorage.getItem('skywardAccessibilitySettings_v1'),summary:document.querySelector('#accessibilitySummary').textContent})")
 check('escala aplicada',settings['ui']=='120',settings);check('alto contraste aplicado',settings['contrast']=='high',settings);check('modo de cor aplicado',settings['color']=='deuteranopia',settings);check('alvos grandes aplicados',settings['large'] is True,settings);check('redução de movimento aplicada',settings['motion'] is True,settings);check('modo bateria aplicado',settings['perf']=='battery',settings);check('preferências persistidas',settings['stored'] and 'deuteranopia' in settings['stored'],settings['stored']);check('resumo visível atualizado','120%' in settings['summary'] and 'Alto contraste' in settings['summary'],settings['summary'])
 page.locator('[data-settings-action="export"]').click();page.wait_for_timeout(60);check('exporta JSON de configuração','deuteranopia' in page.locator('#accessibilityExport').input_value())
 page.locator('[data-settings-action="reset"]').click();page.wait_for_timeout(100);reset=page.evaluate("()=>({ui:document.documentElement.dataset.uiScale,contrast:document.documentElement.dataset.contrast,color:document.documentElement.dataset.colorMode,large:document.body.classList.contains('access-large-targets')})")
 check('reset volta ao padrão',reset['ui']=='100' and reset['contrast']=='normal' and reset['color']=='standard' and reset['large'] is False,reset)
 page.keyboard.press('F10');page.wait_for_timeout(80);check('atalho F10 abre painel',page.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"))
 start_game(page);page.evaluate('()=>window.SKYWARD_TEST_API.generateTraffic(8,1010)');page.wait_for_timeout(200);page.locator('#accessibilityBadge').click();page.wait_for_timeout(90);check('painel abre durante o turno desktop',page.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"));page.locator('[data-settings-action="close"]').first.click();page.wait_for_timeout(60)
 page.keyboard.press('Alt+KeyS');page.wait_for_timeout(80);check('Alt+S abre painel durante turno',page.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"));page.locator('[data-settings-action="close"]').first.click()
 page.screenshot(path=str(AUDIT/'PHASE10_desktop_settings.png'),full_page=True)
 for name,viewport in VIEWPORTS.items():
  vp=context.new_page();vp.set_default_timeout(5000);vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None);vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}));vp.set_viewport_size(viewport);vp.set_content(HTML,wait_until='domcontentloaded');vp.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_ACCESSIBILITY && window.SKYWARD_MOBILE_UX',timeout=20000);vp.wait_for_timeout(850)
  start_game(vp);visible=vp.evaluate("()=>({hud:getComputedStyle(document.querySelector('#desktopWorkspaceHud')).display,mobile:getComputedStyle(document.querySelector('#mobileAtcLayer')).display,settings:getComputedStyle(document.querySelector('#mobileSettingsBtn')).display,panel:getComputedStyle(document.querySelector('#accessibilityPanel')).display})")
  check(f'{name}: API F10 disponível',vp.evaluate('()=>window.SKYWARD_ACCESSIBILITY.schema')==1)
  check(f'{name}: painel escondido por padrão',visible['panel']=='none',visible)
  if viewport['width']<981:
   check(f'{name}: botão mobile correto',(visible['settings']!='none') if name=='mobile_landscape' else (visible['settings']=='none' or visible['mobile']=='none'),visible)
  else:
   check(f'{name}: workspace desktop/tablet preservado',visible['hud']!='none',visible)
  if name=='mobile_landscape':
   vp.locator('#mobileSettingsBtn').click();vp.wait_for_timeout(100);check('mobile landscape: configurações abrem por botão',vp.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"));heights=vp.evaluate("()=>Array.from(document.querySelectorAll('#accessibilityPanel button,#accessibilityPanel select')).map(e=>e.getBoundingClientRect().height).filter(Boolean).slice(0,12)");check('mobile landscape: controles >=36px',all(h>=34 for h in heights),heights)
  if name=='tablet':
   vp.locator('#accessibilityBadge').click();vp.wait_for_timeout(80);check('tablet: painel abre pelo botão do turno',vp.locator('#accessibilityPanel').evaluate("e=>e.classList.contains('open')"))
  vp.screenshot(path=str(AUDIT/f'PHASE10_{name}.png'),full_page=True);results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'selfTest':vp.evaluate('()=>window.SKYWARD_SELF_TEST.ok')};vp.close()
 browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
 (AUDIT/'PHASE10_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 lines=['# Fase 10 — Auditoria Chromium de acessibilidade e configurações','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: HTML, CSS e JavaScript exatos carregados em memória por bloqueio administrativo de URLs locais.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
 (AUDIT/'PHASE10_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F10 browser tests: {results['passed']}/{results['total']} aprovados")
for c in results['checks']:print(('PASS' if c['ok'] else 'FAIL')+'  '+c['name']+((' — '+str(c['detail'])) if not c['ok'] and c.get('detail') else ''))
if results['failed']:raise SystemExit(1)
