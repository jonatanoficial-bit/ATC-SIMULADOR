import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];AUDIT=ROOT/'audit';AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8');CSS=(ROOT/'style.css').read_text(encoding='utf8');BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8');MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8');AIRCRAFT=(ROOT/'data/aircraft.json').read_text(encoding='utf8');PWA_MANIFEST=(ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}}
results={'schema':1,'suite':'phase12-browser','mode':'inline-controlled-runtime','environmentLimitation':'Chromium local navigation is blocked by policy; exact app HTML/CSS/JS are loaded in memory while file integrity is verified separately.','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
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
def go_game(page):
 if page.locator('#boot.active').count(): page.locator('#boot [data-go="menu"]').click();page.wait_for_timeout(20)
 if not page.locator('#lobby.active').count(): page.locator('#menu [data-go="lobby"]').click();page.wait_for_timeout(20)
 page.locator('#lobby [data-go="game"]').click();page.wait_for_timeout(250)
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
 page=browser.new_page(viewport=VIEWPORTS['desktop'],device_scale_factor=1);page.set_default_timeout(5000)
 page.on('console',lambda m:results['consoleErrors'].append({'type':m.type,'text':m.text}) if m.type=='error' else None);page.on('pageerror',lambda e:results['pageErrors'].append({'text':str(e)}))
 page.set_content(HTML,wait_until='domcontentloaded');page.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_AIRCRAFT_PERFORMANCE && window.SKYWARD_TEST_API',timeout=12000);page.wait_for_timeout(500)
 base=page.evaluate("()=>({build:window.SKYWARD_BUILD_INFO,self:window.SKYWARD_SELF_TEST,perf:window.SKYWARD_AIRCRAFT_PERFORMANCE.selfCheck(),schema:window.SKYWARD_AIRCRAFT_PERFORMANCE.schema})");results['build']=base['build']
 check('build F12 carregada',base['build'].get('version')=='1.12.0' and base['build'].get('phase')=='F12',base['build'])
 check('performance schema carregado',base['build'].get('aircraftPerformanceSchema')==1 and base['schema']==1,base)
 check('autoteste interno aprovado',base['self'].get('ok') is True,json.dumps(base['self'].get('errors',[]),ensure_ascii=False))
 check('self check performance aprovado',base['perf'].get('ok') is True,base['perf'])
 go_game(page)
 perf=page.evaluate("""()=>{const api=window.SKYWARD_AIRCRAFT_PERFORMANCE;const b752={type:'B752',kind:'arrival',status:'FINAL',speed:170,alt:20,targetAlt:0,damage:0};const e190={type:'E190',kind:'arrival',status:'FINAL',speed:170,alt:20,targetAlt:0,damage:0};const dep={type:'B752',kind:'departure',status:'DEP',speed:150,alt:0,targetAlt:160,damage:0};const app={type:'E190',kind:'arrival',status:'APP',speed:220,alt:120,targetAlt:45,damage:0};api.normalize(dep);api.normalize(app);api.step(dep,1,'DEP');api.step(app,1,'APP');return {b752:api.telemetry(b752),e190:api.telemetry(e190),heavyFuel:api.fuelMultiplier({type:'B77W',kind:'arrival',status:'APP'}),neoFuel:api.fuelMultiplier({type:'A20N',kind:'arrival',status:'APP'}),dep,app,planes:aircraft.map(p=>({id:p.id,type:p.type,wake:p.wakeCategory,vref:p.performance?.vRef,envelope:p.envelopeState,targetSpeed:p.targetSpeed})).slice(0,8)};}""")
 check('telemetria B752 heavy',perf['b752']['wake']=='H' and perf['b752']['vRef']>=140,perf)
 check('E190 tem VREF menor em runtime',perf['e190']['vRef']<perf['b752']['vRef'],perf)
 check('widebody consome mais que neo',perf['heavyFuel']>perf['neoFuel'],perf)
 check('step decolagem acelera e sobe',perf['dep']['speed']>150 and perf['dep']['alt']>0,perf['dep'])
 check('step aproximação desacelera e desce',perf['app']['speed']<220 and perf['app']['alt']<120,perf['app'])
 check('tráfego inicial recebeu envelope',all(x.get('vref') for x in perf['planes']) and all(x.get('wake') for x in perf['planes']),perf['planes'])
 page.evaluate("""()=>{
  const id=Array.isArray(aircraft)&&aircraft[0]?aircraft[0].id:null;
  if(id){ selected=id; selectedRequest=null; if(typeof renderSelected==='function')renderSelected(); if(typeof renderRequests==='function')renderRequests(); if(typeof updateFrequencyPanel==='function')updateFrequencyPanel(); if(typeof renderActionGrid==='function')renderActionGrid(); }
 }""")
 page.wait_for_timeout(100)
 selected_text=page.evaluate("()=>document.querySelector('#selectedBox')?.innerText||''")
 selected_data=page.evaluate("()=>{const p=aircraft.find(x=>x.id===selected);return p?{id:p.id,type:p.type,vref:p.performance?.vRef,envelope:p.envelopeState}:null;}")
 check('painel selecionado mostra VREF',('VREF' in selected_text and 'ENVELOPE' in selected_text and selected_data and selected_data.get('vref')), {'text':selected_text,'data':selected_data})
 page.screenshot(path=str(AUDIT/'PHASE12_desktop_performance.png'),full_page=False)
 page.close()
 for name,viewport in VIEWPORTS.items():
  vp=browser.new_page(viewport=viewport,device_scale_factor=1);vp.set_default_timeout(5000)
  vp.on('console',lambda m,n=name:results['consoleErrors'].append({'scope':n,'type':m.type,'text':m.text}) if m.type=='error' else None);vp.on('pageerror',lambda e,n=name:results['pageErrors'].append({'scope':n,'text':str(e)}))
  vp.set_content(HTML,wait_until='domcontentloaded');vp.wait_for_function('window.SKYWARD_SELF_TEST && window.SKYWARD_AIRCRAFT_PERFORMANCE',timeout=12000);vp.wait_for_timeout(250)
  go_game(vp)
  data=vp.evaluate("()=>({schema:window.SKYWARD_AIRCRAFT_PERFORMANCE.schema,ok:window.SKYWARD_SELF_TEST.ok,planes:aircraft.length,env:aircraft.filter(p=>p.performance&&p.performance.vRef).length})")
  check(f'{name}: performance API disponível',data['schema']==1 and data['ok'] is True,data)
  check(f'{name}: aeronaves com envelope',data['planes']>0 and data['env']==data['planes'],data)
  results['viewports'][name]={'width':viewport['width'],'height':viewport['height'],'selfTest':data['ok']};vp.close()
 browser.close()
results['passed']=sum(1 for c in results['checks'] if c['ok']);results['total']=len(results['checks']);results['failed']=results['total']-results['passed']
if REPORT_MODE:
 (AUDIT/'PHASE12_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
 lines=['# Fase 12 — Auditoria Chromium de performance de aeronaves','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'indisponível'}`",'- Ambiente: HTML, CSS e JavaScript exatos carregados em memória por bloqueio administrativo de URLs locais.','','## Verificações']+[f"- [{'x' if c['ok'] else ' '}] {c['name']}" for c in results['checks']]
 (AUDIT/'PHASE12_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F12 browser tests: {results['passed']}/{results['total']} aprovados")
for c in results['checks']:print(('PASS' if c['ok'] else 'FAIL')+'  '+c['name']+((' — '+str(c['detail'])) if not c['ok'] and c.get('detail') else ''))
if results['failed']:raise SystemExit(1)
