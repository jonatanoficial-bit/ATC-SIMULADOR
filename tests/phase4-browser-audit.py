import contextlib, http.server, json, os, socketserver, threading, time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
AUDIT=ROOT/'audit'
AUDIT.mkdir(exist_ok=True)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

@contextlib.contextmanager
def server():
    old=os.getcwd(); os.chdir(ROOT)
    httpd=socketserver.TCPServer(('127.0.0.1',0),QuietHandler)
    thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start()
    try: yield f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
    finally:
        httpd.shutdown(); httpd.server_close(); os.chdir(old)

viewports={
    'desktop': {'width':1440,'height':900},
    'tablet': {'width':1024,'height':768},
    'mobile_landscape': {'width':844,'height':390},
    'mobile_portrait': {'width':390,'height':844},
}
results={'build':None,'viewports':{},'consoleErrors':[],'pageErrors':[],'checks':[]}
def check(name, ok, detail=''):
    results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})

def open_game(page):
    page.locator('[data-go="menu"]').first.click()
    page.locator('[data-go="lobby"]').first.click()
    page.wait_for_timeout(250)
    page.locator('#lobby [data-go="game"]').click()
    page.wait_for_timeout(900)

def wait_runtime(page):
    page.wait_for_function("window.SKYWARD_SELF_TEST && window.SKYWARD_CONTRACTS && window.SKYWARD_ARCHITECTURE",timeout=10000)

html=(ROOT/'index.html').read_text(encoding='utf8')
css=(ROOT/'style.css').read_text(encoding='utf8')
build_js=(ROOT/'build-info.js').read_text(encoding='utf8')
main_js=(ROOT/'main.js').read_text(encoding='utf8')
airports=(ROOT/'data/airports.json').read_text(encoding='utf8')
aircraft_catalog=(ROOT/'data/aircraft.json').read_text(encoding='utf8')
fetch_shim=f"""<script>
const __skywardStore=new Map();
Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:key=>__skywardStore.has(String(key))?__skywardStore.get(String(key)):null,setItem:(key,value)=>__skywardStore.set(String(key),String(value)),removeItem:key=>__skywardStore.delete(String(key)),clear:()=>__skywardStore.clear(),key:index=>Array.from(__skywardStore.keys())[index]||null,get length(){{return __skywardStore.size;}}}}}});
window.fetch=async function(url){{
  const key=String(url);
  if(key.includes('airports.json')) return {{ok:true,status:200,json:async()=>({airports})}};
  if(key.includes('aircraft.json')) return {{ok:true,status:200,json:async()=>({aircraft_catalog})}};
  return {{ok:false,status:404,json:async()=>({{}})}};
}};
</script>"""
html=html.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{css}</style>')
html=html.replace('<script src="build-info.js"></script>',f'<script>{build_js}</script>')
html=html.replace('<script src="main.js"></script>',fetch_shim+f'<script>{main_js}</script>')

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu'])
    for name,vp in viewports.items():
        context=browser.new_context(viewport=vp,device_scale_factor=1)
        page=context.new_page()
        page.on('console',lambda msg,n=name: results['consoleErrors'].append({'viewport':n,'type':msg.type,'text':msg.text}) if msg.type=='error' else None)
        page.on('pageerror',lambda err,n=name: results['pageErrors'].append({'viewport':n,'text':str(err)}))
        page.set_content(html,wait_until='load')
        wait_runtime(page)
        runtime=page.evaluate("""() => ({
          build: window.SKYWARD_BUILD_INFO,
          contracts:{schema:window.SKYWARD_CONTRACTS.contractSchema,version:window.SKYWARD_CONTRACTS.version,frozen:Object.isFrozen(window.SKYWARD_CONTRACTS)},
          architecture:{generation:window.SKYWARD_ARCHITECTURE.generation,moduleCount:window.SKYWARD_MODULES.length,sealed:Object.isFrozen(window.SKYWARD_MODULES)},
          selfTest:window.SKYWARD_SELF_TEST
        })""")
        if results['build'] is None: results['build']=runtime['build']
        viewport_result={'runtime':runtime}
        if name=='mobile_landscape':
            page.locator('[data-go="menu"]').first.click(); page.locator('#menu [data-go="profile"]').click(); page.wait_for_timeout(250)
            scroll=page.evaluate("""() => {const el=document.querySelector('#profile');const doc=document.scrollingElement;const before={screen:el.scrollTop,doc:doc.scrollTop};el.scrollTop=el.scrollHeight;window.scrollTo(0,doc.scrollHeight);return {before,screenAfter:el.scrollTop,docAfter:doc.scrollTop,screenScrollHeight:el.scrollHeight,screenClientHeight:el.clientHeight,docScrollHeight:doc.scrollHeight,docClientHeight:doc.clientHeight}}""")
            viewport_result['profileScroll']=scroll
            page.screenshot(path=str(AUDIT/'PHASE4_mobile_profile.png'),full_page=True)
            page.locator('#profile [data-go="lobby"]').click(); page.wait_for_timeout(200); page.locator('#lobby [data-go="game"]').click(); page.wait_for_timeout(900)
            page.locator('.mobile-nav[data-mobile-tab="requests"]').click(); page.wait_for_timeout(150)
            layout=page.evaluate("""() => {const c=document.querySelector('#radar').getBoundingClientRect();const p=document.querySelector('#mobilePanel').getBoundingClientRect();return {canvas:{w:c.width,h:c.height},panel:{w:p.width,h:p.height,active:document.querySelector('#mobilePanel').classList.contains('active')},bodyGame:document.body.classList.contains('game-active')}}""")
            viewport_result['gameLayout']=layout
            page.screenshot(path=str(AUDIT/'PHASE4_mobile_game.png'),full_page=True)
        else:
            open_game(page)
            guard=page.locator('#orientationGuard')
            guard_visible=guard.is_visible() if guard.count() else False
            viewport_result['orientationGuardVisible']=guard_visible
            viewport_result['gameState']=page.evaluate("""() => ({gameActive:document.querySelector('#game').classList.contains('active'),bodyGame:document.body.classList.contains('game-active'),aircraft:window.SKYWARD_SELF_TEST?.ok,diagnostics:window.SKYWARD_CONTRACTS.getDiagnostics().length})""")
            page.screenshot(path=str(AUDIT/f'PHASE4_{name}.png'),full_page=True)
        results['viewports'][name]=viewport_result
        context.close()
    browser.close()

for name,v in results['viewports'].items():
    st=v['runtime']['selfTest']
    check(f'{name}: autoteste interno aprovado',st.get('ok') is True, json.dumps(st.get('errors',[]),ensure_ascii=False))
    check(f'{name}: contratos carregados',v['runtime']['contracts']['schema']==1 and v['runtime']['contracts']['frozen'])
    check(f'{name}: arquitetura geração 4+',v['runtime']['architecture']['generation']>=4 and v['runtime']['architecture']['moduleCount']>=13 and v['runtime']['architecture']['sealed'])
check('mobile: perfil rolável',results['viewports']['mobile_landscape']['profileScroll']['screenAfter']>0 or results['viewports']['mobile_landscape']['profileScroll']['docAfter']>0,str(results['viewports']['mobile_landscape']['profileScroll']))
layout=results['viewports']['mobile_landscape']['gameLayout']
check('mobile: radar preservado',layout['canvas']['w']>=800 and layout['canvas']['h']>=300,str(layout))
check('mobile: painel único ativo',layout['panel']['active'] and layout['panel']['h']<390,str(layout))
check('portrait: guard de orientação visível',results['viewports']['mobile_portrait']['orientationGuardVisible'] is True)
check('desktop: guard de orientação oculto',results['viewports']['desktop']['orientationGuardVisible'] is False)
check('sem exceções de página',len(results['pageErrors'])==0,json.dumps(results['pageErrors'],ensure_ascii=False))
check('sem erros de console',len(results['consoleErrors'])==0,json.dumps(results['consoleErrors'],ensure_ascii=False))

(AUDIT/'PHASE4_BROWSER_AUDIT.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
passed=sum(1 for x in results['checks'] if x['ok']); total=len(results['checks'])
summary=[f'# Fase 04 — Auditoria Chromium', '', f'- Resultado: **{passed}/{total} verificações aprovadas**', f"- Build: `{results['build'].get('build') if results['build'] else 'N/A'}`", '- Resoluções: 844×390, 390×844, 1024×768 e 1440×900', f"- Erros de console: {len(results['consoleErrors'])}", f"- Exceções de página: {len(results['pageErrors'])}", '', '## Verificações']
summary += [f"- [{'x' if x['ok'] else ' '}] {x['name']}" for x in results['checks']]
(AUDIT/'PHASE4_BROWSER_AUDIT_SUMMARY.md').write_text('\n'.join(summary)+'\n',encoding='utf8')
print(f'Phase 4 browser audit: {passed}/{total} approved')
for x in results['checks']:
    print(('PASS' if x['ok'] else 'FAIL'),x['name'],('— '+x['detail'] if not x['ok'] and x['detail'] else ''))
if passed!=total: raise SystemExit(1)
