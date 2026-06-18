import contextlib
import http.server
import json
import os
import socketserver
import threading
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
AUDIT=ROOT/'audit'
AUDIT.mkdir(exist_ok=True)
FIXTURES=json.loads((ROOT/'tests/fixtures/phase5-scenarios.json').read_text(encoding='utf8'))
REPORT_MODE='--no-report' not in os.sys.argv

RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8')
CSS=(ROOT/'style.css').read_text(encoding='utf8')
BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8')
MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8')
AIRCRAFT_CATALOG=(ROOT/'data/aircraft.json').read_text(encoding='utf8')
def inline_html(qa=True):
    fetch_shim=f"""<script>
{'window.SKYWARD_QA_MODE=true;' if qa else ''}
const __skywardStore=new Map();
Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:key=>__skywardStore.has(String(key))?__skywardStore.get(String(key)):null,setItem:(key,value)=>__skywardStore.set(String(key),String(value)),removeItem:key=>__skywardStore.delete(String(key)),clear:()=>__skywardStore.clear(),key:index=>Array.from(__skywardStore.keys())[index]||null,get length(){{return __skywardStore.size;}}}}}});
window.fetch=async function(url){{
  const key=String(url);
  if(key.includes('airports.json')) return {{ok:true,status:200,json:async()=>({AIRPORTS})}};
  if(key.includes('aircraft.json')) return {{ok:true,status:200,json:async()=>({AIRCRAFT_CATALOG})}};
  return {{ok:false,status:404,json:async()=>({{}})}};
}};
</script>"""
    html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>')
    html=html.replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
    html=html.replace('<script src="main.js"></script>',fetch_shim+f'<script>{MAIN_JS}</script>')
    return html
QA_HTML=inline_html(True)
NORMAL_HTML=inline_html(False)

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

@contextlib.contextmanager
def server():
    old=os.getcwd(); os.chdir(ROOT)
    httpd=socketserver.ThreadingTCPServer(('127.0.0.1',0),QuietHandler)
    thread=threading.Thread(target=httpd.serve_forever,daemon=True); thread.start()
    try:
        yield f'http://127.0.0.1:{httpd.server_address[1]}/index.html'
    finally:
        httpd.shutdown(); httpd.server_close(); os.chdir(old)

results={'schema':1,'suite':'phase5-browser','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{},'timings':{}}
def check(name,ok,detail=''):
    results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})

def plane(pid='TST1001',kind='arrival',status='APP',request='landing',**overrides):
    base={
        'id':pid,'type':'A320' if kind=='arrival' else 'B738','kind':kind,'status':status,
        'x':35,'y':30,'heading':90,'speed':170 if kind=='arrival' else 0,'alt':80 if kind=='arrival' else 0,
        'targetAlt':45 if kind=='arrival' else 0,'trail':[],'risk':0,'selected':False,'cleared':False,
        'emergency':False,'emergencyType':None,'fuel':60,'fuelState':'OK','damage':0,'hold':False,
        'groundTimer':0,'request':request,'requestedAt':1,'nextFix':None
    }
    base.update(overrides)
    return base

def request(pid,rtype,priority='normal',time_value=1):
    labels={'landing':'solicita pouso','pushback':'solicita pushback','taxi':'solicita taxi','lineup':'solicita alinhar','takeoff':'solicita decolagem','emergency':'MAYDAY prioridade','lowfuel':'combustível mínimo','panpan':'PAN-PAN'}
    return {'id':pid,'type':rtype,'priority':priority,'text':labels.get(rtype,rtype),'time':time_value}

def wait_runtime(page):
    page.wait_for_function("window.SKYWARD_SELF_TEST && window.SKYWARD_TEST_API && window.SKYWARD_QUALITY_KERNEL && window.SKYWARD_ARCHITECTURE",timeout=15000)

def open_game(page):
    page.locator('[data-go="menu"]').first.click()
    page.locator('[data-go="lobby"]').first.click()
    page.wait_for_timeout(150)
    page.locator('#lobby [data-go="game"]').click()
    page.wait_for_timeout(700)

print('F05:start',flush=True)
with sync_playwright() as p:
    print('F05:launch',flush=True)
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])

    # Full deterministic scenario suite on desktop using the actual served build.
    context=browser.new_context(viewport=FIXTURES['viewports']['desktop'],device_scale_factor=1)
    page=context.new_page()
    page.on('console',lambda msg: results['consoleErrors'].append({'scope':'scenario','type':msg.type,'text':msg.text}) if msg.type=='error' else None)
    page.on('pageerror',lambda err: results['pageErrors'].append({'scope':'scenario','text':str(err)}))
    print('F05:setcontent scenario',flush=True)
    page.set_content(QA_HTML,wait_until='domcontentloaded')
    wait_runtime(page)
    print('F05:runtime ready',flush=True)
    runtime=page.evaluate("""() => ({
      build:window.SKYWARD_BUILD_INFO,
      architecture:{generation:window.SKYWARD_ARCHITECTURE.generation,moduleCount:window.SKYWARD_MODULES.length,sealed:Object.isFrozen(window.SKYWARD_MODULES)},
      selfTest:window.SKYWARD_SELF_TEST,
      qa:{enabled:window.SKYWARD_TEST_API.enabled,testSchema:window.SKYWARD_TEST_API.testSchema,frozen:Object.isFrozen(window.SKYWARD_TEST_API)},
      kernel:{schema:window.SKYWARD_QUALITY_KERNEL.schema,frozen:Object.isFrozen(window.SKYWARD_QUALITY_KERNEL)}
    })""")
    results['build']=runtime['build']
    check('baseline F05 carregada',int(runtime['build'].get('version','0.0.0').split('.')[1])>=5 and int(runtime['build'].get('phase','F00')[1:])>=5,str(runtime['build']))
    check('test schema atual carregado',runtime['build'].get('testSchema')>=1 and runtime['qa']['testSchema']==runtime['build'].get('testSchema'))
    check('arquitetura geração 5+',runtime['architecture']['generation']>=5 and runtime['architecture']['moduleCount']>=15)
    check('runtime modular selado',runtime['architecture']['sealed'])
    check('kernel de qualidade selado',runtime['kernel']['schema']==1 and runtime['kernel']['frozen'])
    check('bridge QA habilitado e selado',runtime['qa']['enabled'] and runtime['qa']['frozen'])
    check('autoteste interno aprovado',runtime['selfTest'].get('ok') is True,json.dumps(runtime['selfTest'].get('errors',[]),ensure_ascii=False))

    print('F05:open game',flush=True)
    open_game(page)
    print('F05:game open',flush=True)
    initial=page.evaluate("() => window.SKYWARD_TEST_API.getState()")
    ids=[a['id'] for a in initial['aircraft']]
    check('turno inicia com tráfego controlado',4<=len(initial['aircraft'])<=8,str(len(initial['aircraft'])))
    check('callsigns iniciais únicos',len(ids)==len(set(ids)),str(ids))
    check('solicitações iniciais vinculadas',all(any(a['id']==r['id'] for a in initial['aircraft']) for r in initial['requests']))
    validation=page.evaluate("() => window.SKYWARD_TEST_API.validateCurrentState()")
    check('estado inicial cumpre contrato de aeronaves',validation['aircraft']['ok'],str(validation['aircraft'].get('issues')))
    check('estado inicial cumpre contrato de solicitações',validation['requests']['ok'],str(validation['requests'].get('issues')))

    deterministic=page.evaluate("""() => {
      const api=window.SKYWARD_TEST_API;
      const compact=s=>s.aircraft.map(p=>({id:p.id,type:p.type,kind:p.kind,x:p.x,y:p.y,alt:p.alt,fuel:p.fuel}));
      const a=compact(api.generateTraffic(8,5005));
      const b=compact(api.generateTraffic(8,5005));
      const c=compact(api.generateTraffic(8,5006));
      return {same:JSON.stringify(a)===JSON.stringify(b),different:JSON.stringify(a)!==JSON.stringify(c),a,b,c};
    }""")
    check('geração de tráfego reproduzível por seed',deterministic['same'])
    check('seeds diferentes geram cenários diferentes',deterministic['different'])
    check('tráfego determinístico mantém callsigns únicos',len({x['id'] for x in deterministic['a']})==len(deterministic['a']))

    def set_state(planes,requests,**extra):
        payload={'aircraft':planes,'requests':requests,'score':extra.pop('score',0),'stats':extra.pop('stats',{}),'running':False,'runwayOccupiedBy':extra.pop('runwayOccupiedBy',None),'selected':extra.pop('selected',None),'selectedRequest':extra.pop('selectedRequest',None),**extra}
        return page.evaluate("payload => window.SKYWARD_TEST_API.setState(payload)",payload)
    def issue(pid,cmd):
        return page.evaluate("args => window.SKYWARD_TEST_API.issueCommand(args.id,args.cmd)",{'id':pid,'cmd':cmd})

    print('F05:determinism done',flush=True)
    # Explicit clearance state transitions.
    set_state([plane('ARR1001')],[request('ARR1001','landing','warn')])
    state=issue('ARR1001','clearLanding')
    check('clearance de pouso leva chegada para FINAL',state['aircraft'][0]['status']=='FINAL')
    check('pouso protege pista pela aeronave autorizada',state['runwayOccupiedBy']=='ARR1001')
    check('pedido de pouso é removido após clearance',not any(r['id']=='ARR1001' and r['type']=='landing' for r in state['requests']))

    set_state([plane('ARR1002')],[request('ARR1002','landing','warn')],runwayOccupiedBy='BLOCK1')
    state=issue('ARR1002','clearLanding')
    check('pouso é bloqueado com pista ocupada',state['aircraft'][0]['status']=='APP' and state['stats']['blocked']>=1)
    check('pedido permanece após bloqueio de pista',any(r['id']=='ARR1002' and r['type']=='landing' for r in state['requests']))

    set_state([plane('DEP1001','departure','PARKED','pushback',speed=0,alt=0,targetAlt=0)],[request('DEP1001','pushback')])
    state=issue('DEP1001','approvePushback')
    check('pushback muda status corretamente',state['aircraft'][0]['status']=='PUSHBACK')
    check('pedido pushback é removido',not state['requests'])

    set_state([plane('DEP1002','departure','READY_TAXI','taxi',speed=0,alt=0,targetAlt=0)],[request('DEP1002','taxi')])
    state=issue('DEP1002','approveTaxi')
    check('táxi muda status corretamente',state['aircraft'][0]['status']=='TAXI')

    set_state([plane('DEP1003','departure','HOLD_SHORT','lineup',speed=0,alt=0,targetAlt=0)],[request('DEP1003','lineup','warn')])
    state=issue('DEP1003','lineUp')
    check('line up muda status e ocupa pista',state['aircraft'][0]['status']=='LINEUP' and state['runwayOccupiedBy']=='DEP1003')

    set_state([plane('DEP1004','departure','LINEUP','takeoff',speed=0,alt=0,targetAlt=0)],[request('DEP1004','takeoff','warn')])
    state=issue('DEP1004','clearTakeoff')
    check('decolagem muda status para DEP',state['aircraft'][0]['status']=='DEP')
    check('decolagem aplica envelope inicial',state['aircraft'][0]['speed']>=130 and state['aircraft'][0]['targetAlt']==160)

    set_state([plane('EMG1001','arrival','EMERG','emergency',emergency=True,emergencyType='LOW FUEL',fuel=7,fuelState='CRITICAL')],[request('EMG1001','emergency','urgent')])
    state=issue('EMG1001','clearEmergency')
    check('emergência recebe prioridade operacional',state['aircraft'][0]['status']=='EMERG' and state['aircraft'][0]['cleared'])
    check('pedido de emergência é encerrado',not any(r['type']=='emergency' for r in state['requests']))

    set_state([plane('DEP1005','departure','PARKED','pushback',speed=0,alt=0,targetAlt=0)],[request('DEP1005','pushback')])
    state=issue('DEP1005','clearTakeoff')
    check('clearance incompatível é bloqueado',state['aircraft'][0]['status']=='PARKED' and state['stats']['blocked']>=1)

    # Vectoring and command envelope.
    set_state([plane('ARR2001',heading=180,speed=220,targetAlt=100)],[request('ARR2001','landing','warn')])
    state=issue('ARR2001','vectorFinal')
    arr=state['aircraft'][0]
    check('vetor final reduz perfil de chegada',arr['speed']<=170 and arr['targetAlt']<=45 and arr['status']=='APP')
    state=issue('ARR2001','slow')
    check('redução de velocidade aplica passo de 10 kt',state['aircraft'][0]['speed']==arr['speed']-10)
    state=issue('ARR2001','descend')
    check('descida aplica passo de FL10',state['aircraft'][0]['targetAlt']==max(0,arr['targetAlt']-10))
    state=issue('ARR2001','hold')
    check('espera alterna status HOLD',state['aircraft'][0]['status']=='HOLD' and state['aircraft'][0]['hold'])

    set_state([plane('DEP2001','departure','PARKED','pushback',speed=0,alt=0,targetAlt=0)],[request('DEP2001','pushback')])
    state=issue('DEP2001','vectorFinal')
    check('vetor final para partida é bloqueado',state['stats']['blocked']>=1 and state['aircraft'][0]['status']=='PARKED')

    # Priority and safety predictions.
    now=page.evaluate('performance.now()')
    planes=[plane('LOW1001'),plane('EMG2001',emergency=True,status='EMERG',request='emergency',fuel=8,fuelState='CRITICAL')]
    reqs=[request('LOW1001','landing','normal',now-1000),request('EMG2001','emergency','urgent',now)]
    set_state(planes,reqs)
    state=issue(None,'nextRequest')
    check('fila seleciona emergência antes de pouso normal',state['selected']=='EMG2001')

    conflict_planes=[
        plane('CNF1001',x=40,y=40,heading=0,speed=180,alt=100,targetAlt=100,request=None),
        plane('CNF1002',x=43,y=40,heading=180,speed=180,alt=104,targetAlt=104,request=None)
    ]
    set_state(conflict_planes,[])
    conflicts=page.evaluate("() => window.SKYWARD_TEST_API.predictConflicts()")
    check('preditor detecta conflito convergente',len(conflicts)>=1,str(conflicts))
    check('conflito recebe nível operacional',all(c['level'] in ['warn','danger'] for c in conflicts))

    wake=page.evaluate("""() => {
      const api=window.SKYWARD_TEST_API;
      const lead={type:'B77W'}, medium={type:'A320'}, light={type:'C208'};
      return {heavyMedium:api.requiredWakeSpacing(lead,medium),mediumMedium:api.requiredWakeSpacing(medium,medium),heavyLight:api.requiredWakeSpacing(lead,light)};
    }""")
    check('wake heavy-medium excede medium-medium',wake['heavyMedium']>wake['mediumMedium'],str(wake))
    check('wake heavy-light é o maior cenário testado',wake['heavyLight']>=wake['heavyMedium'],str(wake))

    print('F05:commands done',flush=True)
    # Snapshot round-trip.
    set_state([plane('SNP1001')],[request('SNP1001','landing','warn')],score=777,selected='SNP1001')
    saved=page.evaluate("() => window.SKYWARD_TEST_API.saveSnapshot('phase5-roundtrip')")
    page.evaluate("() => window.SKYWARD_TEST_API.setState({score:1,aircraft:[],requests:[],selected:null})")
    restored=page.evaluate("() => window.SKYWARD_TEST_API.restoreSnapshot()")
    restored_state=page.evaluate("() => window.SKYWARD_TEST_API.getState()")
    check('snapshot é gravado',saved is True)
    check('snapshot é restaurado',restored is True)
    check('snapshot recupera pontuação e aeronave',abs(restored_state['score']-777)<1 and any(a['id']=='SNP1001' for a in restored_state['aircraft']),str(restored_state))
    page.evaluate("() => window.SKYWARD_TEST_API.reset(5005)")

    print('F05:snapshot done',flush=True)
    # Sanitization and long-running deterministic soak.
    invalid=plane('BAD1001',fuel=140,speed=900,heading=725,x=500,y=-500)
    duplicate=plane('BAD1001',x=10,y=10)
    state=set_state([invalid,duplicate],[request('BAD1001','landing','warn')])
    check('saneamento remove callsign duplicado',len(state['aircraft'])==1)
    sanitized=state['aircraft'][0]
    check('saneamento limita envelope da aeronave',sanitized['fuel']==100 and sanitized['speed']<=360 and sanitized['heading']==5 and sanitized['x']<=108 and sanitized['y']>=-8,str(sanitized))

    page.evaluate("seed => window.SKYWARD_TEST_API.generateTraffic(10,seed)",FIXTURES['seed'])
    t0=time.perf_counter()
    soak=page.evaluate("cfg => window.SKYWARD_TEST_API.runSoak(cfg.steps,cfg.dt)",FIXTURES['soak'])
    elapsed=time.perf_counter()-t0
    results['timings']['soakSeconds']=elapsed
    check('soak executa todos os passos',soak['steps']==FIXTURES['soak']['steps'])
    check('soak preserva contrato das aeronaves',soak['aircraftContract'],str(soak))
    check('soak preserva contrato das solicitações',soak['requestsContract'],str(soak))
    check('soak completa sem congelamento',elapsed<15,f'{elapsed:.3f}s')
    check('soak respeita limite anti-sobrecarga',len(soak['state']['aircraft'])<=16 and len(soak['state']['requests'])<=30)

    print('F05:soak done',flush=True)
    page.screenshot(path=str(AUDIT/'PHASE5_scenario_desktop.png'),full_page=True)
    print('F05:scenario screenshot',flush=True)
    context.close()

    # QA bridge must be read-only when not explicitly enabled.
    context=browser.new_context(viewport=FIXTURES['viewports']['desktop'],device_scale_factor=1)
    normal=context.new_page()
    print('F05:security setcontent',flush=True)
    normal.set_content(NORMAL_HTML,wait_until='domcontentloaded')
    wait_runtime(normal)
    security=normal.evaluate("""() => {
      let threw=false; try{window.SKYWARD_TEST_API.reset(1);}catch(_e){threw=true;}
      return {enabled:window.SKYWARD_TEST_API.enabled,threw,state:window.SKYWARD_TEST_API.getState()};
    }""")
    check('bridge mutável desabilitado em gameplay normal',security['enabled'] is False and security['threw'] is True)
    context.close()

    # Cross-device regression using real assets and URLs.
    print('F05:responsive loop',flush=True)
    for name,vp in FIXTURES['viewports'].items():
        print('F05:viewport',name,flush=True)
        context=browser.new_context(viewport=vp,device_scale_factor=1)
        device=context.new_page()
        device.on('console',lambda msg,n=name: results['consoleErrors'].append({'scope':n,'type':msg.type,'text':msg.text}) if msg.type=='error' else None)
        device.on('pageerror',lambda err,n=name: results['pageErrors'].append({'scope':n,'text':str(err)}))
        print('F05:vp setcontent',name,flush=True)
        device.set_content(QA_HTML,wait_until='domcontentloaded')
        print('F05:vp content done',name,flush=True)
        wait_runtime(device)
        print('F05:vp runtime',name,flush=True)
        if name=='mobile_landscape':
            print('F05:mobile menu',flush=True)
            device.locator('[data-go="menu"]').first.click(); device.locator('#menu [data-go="profile"]').click(); device.wait_for_timeout(120)
            print('F05:mobile profile',flush=True)
            scroll=device.evaluate("""() => {const el=document.querySelector('#profile');const doc=document.scrollingElement;const before={screen:el.scrollTop,doc:doc.scrollTop};el.scrollTop=el.scrollHeight;window.scrollTo(0,doc.scrollHeight);return {before,screenAfter:el.scrollTop,docAfter:doc.scrollTop,screenScrollHeight:el.scrollHeight,screenClientHeight:el.clientHeight,docScrollHeight:doc.scrollHeight,docClientHeight:doc.clientHeight}}""")
            print('F05:mobile lobby click',flush=True)
            device.locator('#profile [data-go="lobby"]').click(force=True); device.wait_for_timeout(100); device.locator('#lobby [data-go="game"]').click(); device.wait_for_timeout(650)
            print('F05:mobile game',flush=True)
            device.evaluate("()=>{const c=document.querySelector('#mobileGestureCoach');if(c){c.classList.remove('show');c.hidden=true;}}")
            device.locator('.mobile-nav[data-mobile-tab="requests"]').click(force=True); device.wait_for_timeout(100)
            print('F05:mobile panel',flush=True)
            layout=device.evaluate("""() => {const c=document.querySelector('#radar').getBoundingClientRect();const p=document.querySelector('#mobilePanel').getBoundingClientRect();return {canvas:{w:c.width,h:c.height},panel:{w:p.width,h:p.height,active:document.querySelector('#mobilePanel').classList.contains('active')},guard:document.querySelector('#orientationGuard')?.offsetParent!==null,selfTest:window.SKYWARD_SELF_TEST.ok}}""")
            check('mobile horizontal mantém perfil rolável',scroll['screenAfter']>0 or scroll['docAfter']>0,str(scroll))
            check('mobile horizontal preserva radar',layout['canvas']['w']>=800 and layout['canvas']['h']>=300,str(layout))
            check('mobile horizontal usa painel único',layout['panel']['active'] and layout['panel']['h']<390,str(layout))
            check('mobile horizontal sem guard de orientação',layout['guard'] is False)
        else:
            open_game(device)
            layout=device.evaluate("""() => ({game:document.querySelector('#game').classList.contains('active'),bodyGame:document.body.classList.contains('game-active'),selfTest:window.SKYWARD_SELF_TEST.ok,qaSchema:window.SKYWARD_TEST_API.testSchema})""")
            layout['guard']=device.locator('#orientationGuard').is_visible()
            check(f'{name}: gameplay ativo',layout['game'] and layout['bodyGame'])
            check(f'{name}: autoteste aprovado',layout['selfTest'])
            check(f'{name}: test schema presente',layout['qaSchema']==runtime['build'].get('testSchema'))
            if name=='mobile_portrait': check('mobile vertical protege turno com guard',layout['guard'] is True)
            if name=='desktop': check('desktop não exibe guard de orientação',layout['guard'] is False)
        print('F05:vp screenshot',name,flush=True)
        device.screenshot(path=str(AUDIT/f'PHASE5_{name}.png'),full_page=True)
        print('F05:vp done',name,flush=True)
        results['viewports'][name]={'viewport':vp,'layout':layout}
        context.close()
    print('F05:browser close',flush=True)
    browser.close()

check('sem exceções de página',len(results['pageErrors'])==0,json.dumps(results['pageErrors'],ensure_ascii=False))
check('sem erros de console',len(results['consoleErrors'])==0,json.dumps(results['consoleErrors'],ensure_ascii=False))
failed=[item for item in results['checks'] if not item['ok']]
results['passed']=len(results['checks'])-len(failed)
results['total']=len(results['checks'])
results['failed']=len(failed)
if REPORT_MODE:
    (AUDIT/'PHASE5_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    summary=['# Fase 05 — Cenários integrados em Chromium','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'N/A'}`",f"- Soak: {FIXTURES['soak']['steps']} passos em {results['timings'].get('soakSeconds',0):.3f}s",f"- Erros de console: {len(results['consoleErrors'])}",f"- Exceções de página: {len(results['pageErrors'])}",'','## Verificações']
    summary += [f"- [{'x' if item['ok'] else ' '}] {item['name']}" for item in results['checks']]
    (AUDIT/'PHASE5_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(summary)+'\n',encoding='utf8')
print(f"Skyward Control F05 browser tests: {results['passed']}/{results['total']} aprovados")
for item in results['checks']:
    print(('PASS' if item['ok'] else 'FAIL'),item['name'],('— '+item['detail'] if not item['ok'] and item['detail'] else ''))
if failed:
    raise SystemExit(1)
