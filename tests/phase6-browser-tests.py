import json
import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
AUDIT=ROOT/'audit'; AUDIT.mkdir(exist_ok=True)
RAW_HTML=(ROOT/'index.html').read_text(encoding='utf8')
CSS=(ROOT/'style.css').read_text(encoding='utf8')
BUILD_JS=(ROOT/'build-info.js').read_text(encoding='utf8')
MAIN_JS=(ROOT/'main.js').read_text(encoding='utf8')
AIRPORTS=(ROOT/'data/airports.json').read_text(encoding='utf8')
AIRCRAFT_CATALOG=(ROOT/'data/aircraft.json').read_text(encoding='utf8')
REPORT_MODE='--no-report' not in os.sys.argv
VIEWPORTS={
  'desktop':{'width':1440,'height':900},'tablet':{'width':1024,'height':768},
  'mobile_landscape':{'width':844,'height':390},'mobile_portrait':{'width':390,'height':844}
}
def inline_html(qa=True):
    shim=f"""<script>
{'window.SKYWARD_QA_MODE=true;' if qa else ''}
const __skywardStore=new Map();
Object.defineProperty(window,'localStorage',{{configurable:true,value:{{getItem:key=>__skywardStore.has(String(key))?__skywardStore.get(String(key)):null,setItem:(key,value)=>__skywardStore.set(String(key),String(value)),removeItem:key=>__skywardStore.delete(String(key)),clear:()=>__skywardStore.clear(),key:index=>Array.from(__skywardStore.keys())[index]||null,get length(){{return __skywardStore.size;}}}}}});
window.fetch=async function(url){{const key=String(url);if(key.includes('airports.json'))return{{ok:true,status:200,json:async()=>({AIRPORTS})}};if(key.includes('aircraft.json'))return{{ok:true,status:200,json:async()=>({AIRCRAFT_CATALOG})}};return{{ok:false,status:404,json:async()=>({{}})}};}};
</script>"""
    html=RAW_HTML.replace('<link rel="stylesheet" href="style.css"/>',f'<style>{CSS}</style>')
    html=html.replace('<script src="build-info.js"></script>',f'<script>{BUILD_JS}</script>')
    html=html.replace('<script src="main.js"></script>',shim+f'<script>{MAIN_JS}</script>')
    return html
QA_HTML=inline_html(True); NORMAL_HTML=inline_html(False)
results={'schema':1,'suite':'phase6-browser','build':None,'checks':[],'consoleErrors':[],'pageErrors':[],'viewports':{}}
def check(name,ok,detail=''): results['checks'].append({'name':name,'ok':bool(ok),'detail':detail})
def plane(pid='SAV1001'):
    return {'id':pid,'type':'A320','kind':'arrival','status':'APP','x':35,'y':30,'heading':90,'speed':170,'alt':80,'targetAlt':45,'trail':[],'risk':0,'selected':False,'cleared':False,'emergency':False,'emergencyType':None,'fuel':60,'fuelState':'OK','damage':0,'hold':False,'groundTimer':0,'request':'landing','requestedAt':1,'nextFix':None}
def request(pid='SAV1001'):
    return {'id':pid,'type':'landing','priority':'warn','text':'solicita pouso','time':1}
def wait_runtime(page): page.wait_for_function("window.SKYWARD_SELF_TEST && window.SKYWARD_TEST_API && window.SKYWARD_SAVE_VAULT",timeout=15000)
def open_game(page):
    page.locator('[data-go="menu"]').first.click(); page.locator('[data-go="lobby"]').first.click(); page.wait_for_timeout(100); page.locator('#lobby [data-go="game"]').click(); page.wait_for_timeout(500)

def set_state(page,score,pid='SAV1001'):
    payload={'aircraft':[plane(pid)],'requests':[request(pid)],'score':score,'selected':pid,'selectedRequest':request(pid),'running':False}
    return page.evaluate("payload=>window.SKYWARD_TEST_API.setState(payload)",payload)

with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu','--disable-dev-shm-usage'])
    context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
    page=context.new_page()
    page.on('console',lambda msg: results['consoleErrors'].append({'scope':'scenario','type':msg.type,'text':msg.text}) if msg.type=='error' else None)
    page.on('pageerror',lambda err: results['pageErrors'].append({'scope':'scenario','text':str(err)}))
    page.set_content(QA_HTML,wait_until='load'); wait_runtime(page)
    runtime=page.evaluate("""()=>({build:window.SKYWARD_BUILD_INFO,selfTest:window.SKYWARD_SELF_TEST,vault:{schema:window.SKYWARD_SAVE_VAULT.vaultSchema,frozen:Object.isFrozen(window.SKYWARD_SAVE_VAULT),hash:window.SKYWARD_SAVE_VAULT.sha256('abc')},qa:{schema:window.SKYWARD_TEST_API.testSchema,enabled:window.SKYWARD_TEST_API.enabled},arch:window.SKYWARD_ARCHITECTURE})""")
    results['build']=runtime['build']
    check('build F06+ carregada',int(runtime['build'].get('phase','F00')[1:])>=6,str(runtime['build']))
    check('save schema 3 carregado',runtime['build'].get('schema')==3)
    check('contract schema 2 carregado',runtime['build'].get('contractSchema')==2)
    check('test schema >= 2 carregado',runtime['build'].get('testSchema',0)>=2 and runtime['qa']['schema']>=2)
    check('save vault schema 1 carregado',runtime['build'].get('saveVaultSchema')==1 and runtime['vault']['schema']==1)
    check('save vault congelado',runtime['vault']['frozen'])
    check('SHA-256 do runtime correto',runtime['vault']['hash']=='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
    check('arquitetura geração 6+',runtime['arch']['generation']>=6)
    check('autoteste interno F06+ aprovado',runtime['selfTest'].get('ok') is True,json.dumps(runtime['selfTest'].get('errors',[]),ensure_ascii=False))
    open_game(page)

    # Healthy two-revision snapshot followed by primary corruption.
    set_state(page,111,'BKP1001'); check('snapshot revisão 1 gravado',page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('f06-rev1')") is True)
    set_state(page,222,'BKP1002'); check('snapshot revisão 2 gravado',page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('f06-rev2')") is True)
    slots=page.evaluate("()=>window.SKYWARD_TEST_API.vaultInspect('snapshot')")
    check('slots primário e backup existem',slots['slots']['primary']['exists'] and slots['slots']['backup']['exists'])
    check('revisões são encadeadas',slots['slots']['primary']['value']['revision']==slots['slots']['backup']['value']['revision']+1,str(slots))
    page.evaluate("()=>window.SKYWARD_TEST_API.corruptVaultSlot('snapshot','primary','json')")
    set_state(page,1,'TMP1001')
    restored=page.evaluate("()=>window.SKYWARD_TEST_API.restoreSnapshot()")
    state=page.evaluate("()=>window.SKYWARD_TEST_API.getState()")
    check('corrupção JSON restaura backup',restored is True and abs(state['score']-111)<1 and any(a['id']=='BKP1001' for a in state['aircraft']),str(state))
    slots=page.evaluate("()=>window.SKYWARD_TEST_API.vaultInspect('snapshot')")
    check('save corrompido fica em quarentena',slots['slots']['quarantine']['exists'] and len(slots['slots']['quarantine']['value'])>=1)
    check('telemetria registra recuperação',state['safeMode']['saveRecoveries']>=1,str(state['safeMode']))

    # Payload tampering with valid JSON but invalid hash.
    set_state(page,333,'HSH1001'); page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('hash-base')")
    set_state(page,444,'HSH1002'); page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('hash-latest')")
    page.evaluate("()=>window.SKYWARD_TEST_API.corruptVaultSlot('snapshot','primary','payload')")
    set_state(page,2,'TMP1002'); restored=page.evaluate("()=>window.SKYWARD_TEST_API.restoreSnapshot()")
    state=page.evaluate("()=>window.SKYWARD_TEST_API.getState()")
    check('adulteração de payload aciona rollback',restored is True and abs(state['score']-333)<1 and any(a['id']=='HSH1001' for a in state['aircraft']),str(state))

    # Journal commit confirmation and rollback paths.
    set_state(page,500,'JRN1001'); page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('journal-a')")
    set_state(page,600,'JRN1002'); page.evaluate("()=>window.SKYWARD_TEST_API.saveSnapshot('journal-b')")
    journal_commit=page.evaluate("""()=>{const api=window.SKYWARD_TEST_API,v=window.SKYWARD_SAVE_VAULT,i=api.vaultInspect('snapshot');const j=v.createJournal('snapshot',i.slots.backup.value,i.slots.primary.value);api.setVaultSlot('snapshot','journal',j);return api.vaultInspect('snapshot');}""")
    check('journal preparado pode ser inspecionado',journal_commit['slots']['journal']['exists'])
    page.evaluate("()=>window.SKYWARD_SAVE_VAULT.read('snapshot',{expectedSaveSchema:3,validate:v=>window.SKYWARD_CONTRACTS.validateSnapshot(v,3,'browser-journal')})")
    check('journal de commit confirmado é removido',not page.evaluate("()=>window.SKYWARD_TEST_API.vaultInspect('snapshot').slots.journal.exists"))
    journal_rollback=page.evaluate("""()=>{const api=window.SKYWARD_TEST_API,v=window.SKYWARD_SAVE_VAULT,i=api.vaultInspect('snapshot');const previous=i.slots.backup.value;const current=i.slots.primary.value;const next=v.createEnvelope('snapshot',{...current.payload,score:700},{saveSchema:3,revision:current.revision+1,reason:'pending'},current);const j=v.createJournal('snapshot',current,next);api.setVaultSlot('snapshot','journal',j);api.setVaultSlot('snapshot','primary',current);return v.read('snapshot',{expectedSaveSchema:3,validate:x=>window.SKYWARD_CONTRACTS.validateSnapshot(x,3,'journal-rollback')});}""")
    check('journal incompleto é resolvido sem perda',journal_rollback['ok'] and journal_rollback['payload']['score']==600 and journal_rollback['journalRecovery']['action']=='rolled-back',str(journal_rollback))

    # Legacy v2 migration into schema 3.
    legacy={'schema':2,'build':'SC-1.5.0-F05-LEGACY','reason':'legacy-test','at':1000,'elapsed':12,'selected':'LEG1001','selectedRequest':request('LEG1001'),'runwayOccupiedBy':None,'aircraft':[plane('LEG1001')],'requests':[request('LEG1001')],'score':777,'stats':{'landed':1},'mission':None,'profileAirport':'SBGR'}
    page.evaluate("payload=>window.SKYWARD_TEST_API.injectLegacySnapshot(payload,'skywardGoodState_v2')",legacy)
    set_state(page,3,'TMP1003'); restored=page.evaluate("()=>window.SKYWARD_TEST_API.restoreSnapshot()")
    state=page.evaluate("()=>window.SKYWARD_TEST_API.getState()")
    slots=page.evaluate("()=>window.SKYWARD_TEST_API.vaultInspect('snapshot')")
    check('snapshot v2 é migrado e restaurado',restored is True and abs(state['score']-777) < 1 and any(a['id']=='LEG1001' for a in state['aircraft']),str(state))
    check('migração grava payload schema 3',slots['slots']['primary']['value']['payload']['schema']==3,str(slots['slots']['primary']['value']))
    check('migração adiciona saveId e sessionId',bool(slots['slots']['primary']['value']['payload'].get('saveId')) and bool(slots['slots']['primary']['value']['payload'].get('sessionId')))
    check('telemetria registra migração',state['safeMode']['saveMigrations']>=1,str(state['safeMode']))

    # Transactional profile rollback.
    page.evaluate("()=>window.SKYWARD_TEST_API.clearProfileVault()")
    page.evaluate("()=>window.SKYWARD_TEST_API.setProfileState({name:'Perfil Backup',avatar:'male',country:'Brasil',airport:'SBGR',xp:100,level:2,score:1000,turns:5})")
    check('perfil revisão 1 gravado',page.evaluate("()=>window.SKYWARD_TEST_API.persistProfileForTest('profile-a')") is True)
    page.evaluate("()=>window.SKYWARD_TEST_API.setProfileState({name:'Perfil Atual',avatar:'female',country:'Brasil',airport:'SBSP',xp:200,level:3,score:2000,turns:6})")
    check('perfil revisão 2 gravado',page.evaluate("()=>window.SKYWARD_TEST_API.persistProfileForTest('profile-b')") is True)
    page.evaluate("()=>window.SKYWARD_TEST_API.corruptVaultSlot('profile','primary','payload')")
    page.evaluate("()=>window.SKYWARD_TEST_API.setProfileState({name:'Temporário',avatar:'male',country:'Brasil',airport:'SBGR',xp:0,level:1,score:0,turns:0})")
    restored_profile=page.evaluate("()=>window.SKYWARD_TEST_API.reloadProfileForTest()")
    check('perfil corrompido recupera backup',restored_profile['name']=='Perfil Backup' and restored_profile['score']==1000,str(restored_profile))
    check('backup de perfil mantém progressão íntegra',restored_profile['level']==2 and restored_profile['turns']==5,str(restored_profile))

    page.screenshot(path=str(AUDIT/'PHASE6_desktop_save_recovery.png'),full_page=True)
    context.close()

    # Mutation remains gated outside QA.
    context=browser.new_context(viewport=VIEWPORTS['desktop'],device_scale_factor=1)
    normal=context.new_page(); normal.set_content(NORMAL_HTML,wait_until='load'); wait_runtime(normal)
    security=normal.evaluate("""()=>{let threw=false;try{window.SKYWARD_TEST_API.corruptVaultSlot('snapshot');}catch(_e){threw=true;}return{enabled:window.SKYWARD_TEST_API.enabled,threw,vaultFrozen:Object.isFrozen(window.SKYWARD_SAVE_VAULT)}}""")
    check('ferramentas destrutivas bloqueadas fora de QA',security['enabled'] is False and security['threw'] is True,str(security))
    check('save vault permanece congelado no jogo normal',security['vaultFrozen'])
    context.close()

    # Cross-device smoke after persistence changes.
    for name,vp in VIEWPORTS.items():
        context=browser.new_context(viewport=vp,device_scale_factor=1); device=context.new_page()
        device.on('console',lambda msg,n=name: results['consoleErrors'].append({'scope':n,'type':msg.type,'text':msg.text}) if msg.type=='error' else None)
        device.on('pageerror',lambda err,n=name: results['pageErrors'].append({'scope':n,'text':str(err)}))
        device.set_content(QA_HTML,wait_until='load'); wait_runtime(device); open_game(device)
        layout=device.evaluate("""()=>({selfTest:window.SKYWARD_SELF_TEST.ok,game:document.querySelector('#game').classList.contains('active'),vault:window.SKYWARD_SAVE_VAULT.vaultSchema,saveSchema:window.SKYWARD_BUILD_INFO.schema})"""); layout['guard']=device.locator('#orientationGuard').is_visible()
        check(f'{name}: runtime e vault ativos',layout['selfTest'] and layout['game'] and layout['vault']==1 and layout['saveSchema']==3,str(layout))
        if name=='mobile_portrait': check('mobile vertical mantém guard de orientação',layout['guard'] is True)
        if name=='mobile_landscape': check('mobile horizontal não exibe guard',layout['guard'] is False)
        device.screenshot(path=str(AUDIT/f'PHASE6_{name}.png'),full_page=True)
        results['viewports'][name]={'viewport':vp,'layout':layout}; context.close()
    browser.close()

check('sem exceções de página',len(results['pageErrors'])==0,json.dumps(results['pageErrors'],ensure_ascii=False))
check('sem erros de console',len(results['consoleErrors'])==0,json.dumps(results['consoleErrors'],ensure_ascii=False))
failed=[item for item in results['checks'] if not item['ok']]
results['passed']=len(results['checks'])-len(failed); results['total']=len(results['checks']); results['failed']=len(failed)
if REPORT_MODE:
    (AUDIT/'PHASE6_BROWSER_TESTS.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    lines=['# Fase 06 — Recuperação transacional em Chromium','',f"- Resultado: **{results['passed']}/{results['total']} aprovados**",f"- Build: `{results['build'].get('build') if results['build'] else 'N/A'}`",f"- Erros de console: {len(results['consoleErrors'])}",f"- Exceções de página: {len(results['pageErrors'])}",'','## Verificações',*[f"- [{'x' if item['ok'] else ' '}] {item['name']}" for item in results['checks']]]
    (AUDIT/'PHASE6_BROWSER_TESTS_SUMMARY.md').write_text('\n'.join(lines)+'\n',encoding='utf8')
print(f"Skyward Control F06 browser tests: {results['passed']}/{results['total']} aprovados")
for item in results['checks']: print(('PASS' if item['ok'] else 'FAIL'),item['name'],('— '+item['detail'] if not item['ok'] and item['detail'] else ''))
if failed: raise SystemExit(1)
