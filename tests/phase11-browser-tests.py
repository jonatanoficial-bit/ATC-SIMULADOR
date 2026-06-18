import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8');CSS=(ROOT/'style.css').read_text(encoding='utf8');BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8');MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8');AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8');PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase11-browser','mode':'inline-controlled-runtime','environmentLimitation':'Chromium local navigation is blocked by policy; exact app HTML/CSS/JS are loaded in memory while file integrity is verified separately.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
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
 if page.locator('#boot.active').count(): page.locator('#boot [data-go="menu"]').click();page.wait_for_timeout(50)
 if not page.locator('#lobby.active').count(): page.locator('#menu [data-go="lobby"]').click();page.wait_for_timeout(50)
 page.locator('#lobby [data-go="game"]').click();page.wait_for_timeout(1000)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
 page=context.new_page();page.set_default_timeout(6000);page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_REPLAY && window.SKYWARD_TEST_API',timeout=25000);page.wait_for_timeout(1000)
 base=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,replay:window.SKYWARD_REPLAY.selfCheck(),schema:window.SKYWARD_REPLAY.schema})");results['build']=base['build']
 check('build F11+ carregada',int(str(base['build'].get('version','0.0.0')).split('.')[1])>=11 and int(str(base['build'].get('phase','F00'))[1:])>=11,base['build'])
 check('replay schema carregado',base['build'].get('replaySchema')==1 and base['schema']==1,base)
 check('autoteste interno aprovado',base['self'].get('ok') is True,json.dumps(base['self'].get('errors',[]),ensure_ascii=False))
 check('self check replay aprovado',base['replay'].get('ok') is True,base['replay'])
 start_game(page)
 initial=page.evaluate("()=>({rec:window.SKYWARD_REPLAY.summary(),det:window.SKYWARD_REPLAY.isDeterministic(),status:document.querySelector('#replayStatusValue')?.textContent||''})")
 check('turno inicia replay determinístico',initial['det'] is True and initial['rec']['recording'] is True,initial)
 check('seed gerada',len(initial['rec']['seed'])>10,initial['rec']['seed'])
 check('evento inicial gravado',any(e['type']=='initial-state' for e in initial['rec']['events']),initial['rec']['events'])
 page.evaluate("()=>window.SKYWARD_TEST_API.generateTraffic(6,1111)");page.wait_for_timeout(200)
 page.keyboard.press('F11');page.wait_for_timeout(100);check('atalho F11 abre painel',page.locator('#replayPanel').evaluate("e=>e.classList.contains('open')"))
 page.locator('[data-replay-action="checkpoint"]').click();page.wait_for_timeout(100);page.locator('[data-replay-action="export"]').click();page.wait_for_timeout(100)
 exported=page.evaluate("()=>({value:document.querySelector('#replayExportText').value,summary:window.SKYWARD_REPLAY.summary(),last:window.SKYWARD_REPLAY.export()})")
 check('checkpoint manual registrado',any(e['type']=='manual-checkpoint' for e in exported['summary']['events']),exported['summary']['events'])
 check('export JSON visível','"schema": 1' in exported['value'] and '"events"' in exported['value'],exported['value'][:120])
 check('export contém checksum',bool(exported['last'].get('finalChecksum')),exported['last'])
 imp=page.evaluate("payload=>window.SKYWARD_REPLAY.import(payload)", exported['last'])
 check('import do próprio replay aprovado',imp.get('ok') is True,imp)
 seq=page.evaluate("()=>{window.SKYWARD_REPLAY.beginTurn('same');const a=[window.SKYWARD_REPLAY.random(),window.SKYWARD_REPLAY.random()].join('|');window.SKYWARD_REPLAY.beginTurn('same');const b=[window.SKYWARD_REPLAY.random(),window.SKYWARD_REPLAY.random()].join('|');return {a,b};}")
 check('sequência reproduzida no browser',seq['a']==seq['b'],seq)
 page.screenshot(path=str(AUDIT/'PHASE11_desktop_replay.png'),full_page=True)
 for name,viewport in VIEWPORTS.items():
  vp=context.new_page();vp.set_default_timeout(6000);vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None);vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}));vp.set_viewport_size(viewport);vp.set_content(HTML,wait_until='domcontentloaded');vp.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_REPLAY',timeout=25000);vp.wait_for_timeout(900)
  start_game(vp);vp.wait_for_timeout(300)
  data=vp.evaluate("()=>({schema:window.SKYWARD_REPLAY.schema,ok:window.SKYWARD_SELF_TEST.ok,panel:getComputedStyle(document.querySelector('#replayPanel')).display,badge:getComputedStyle(document.querySelector('#replayBadge')).display,det:window.SKYWARD_REPLAY.isDeterministic(),events:window.SKYWARD_REPLAY.summary().events.length})")
  check(f'{name}: replay API disponível',data['schema']==1 and data['ok'] is True,data)
  check(f'{name}: replay determinístico ativo',data['det'] is True and data['events']>=1,data)
  if viewport['width']>=981: check(f'{name}: botão replay visível',data['badge']!='none',data)
  vp.screenshot(path=str(AUDIT/f'PHASE11_{name}.png'),full_page=True);results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'selfTest':data['ok']};vp.close()
 browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
 (AUDIT/'PHASE11_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 lines=['# Fase 11 — Auditoria Chromium de replay técnico','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: HTML, CSS e JavaScript exatos carregados em memória por bloqueio administrativo de URLs locais.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
 (AUDIT/'PHASE11_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F11 browser tests: {results['passed']}/{results['total']} aprovados")
for c in results['checks']:print(('PASS' if c['ok'] else 'FAIL')+'  '+c['name']+((' — '+str(c['detail'])) if not c['ok'] and c.get('detail') else ''))
if results['failed']:raise SystemExit(1)
