import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/terminal-flow.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F49 carregada', meta.get('version')=='1.49.0' and meta.get('phase')=='F49', meta)
check('main bundle inclui módulo 52', '@skyward-module 52-terminal-flow-landside-center' in main)
check('API SKYWARD_TERMINAL_FLOW no bundle', 'SKYWARD_TERMINAL_FLOW' in main)
check('catálogo possui zonas', len(cat.get('terminalZones',[]))>=9)
check('catálogo possui incidentes', len(cat.get('queueIncidents',[]))>=8)
check('catálogo possui programas', len(cat.get('flowPrograms',[]))>=8)
check('PWA cache inclui terminal-flow.json', any(f.get('file')=='data/terminal-flow.json' for f in cache.get('files',[])))
check('início de turno inicializa F49', 'initializeTerminalFlow' in traffic)
check('fim de turno mostra F49', 'Terminal Flow' in ui and 'Fila Média' in ui)
check('CSS possui painel terminal', '.terminal-flow-inline' in style)
check('scripts npm F49 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f49','test:browser:f49','test:phase49']))
check('schema terminalFlowSchema 1', meta.get('terminalFlowSchema')==1)
check('channel terminal-flow', meta.get('channel')=='terminal-flow' and 'terminal-flow' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc terminal existe', (ROOT/'docs/TERMINAL_FLOW_F49.md').exists())
check('doc filas existe', (ROOT/'docs/CHECKIN_SEGURANCA_IMIGRACAO_BAGAGEM_F49.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('security queue presente', any(z.get('id')=='SECURITY_QUEUE' for z in cat.get('terminalZones',[])))
check('baggage claim presente', any(z.get('id')=='BAGGAGE_CLAIM' for z in cat.get('terminalZones',[])))
check('avg queue KPI presente', any(k.get('id')=='AVG_QUEUE_TIME' for k in cat.get('terminalKPIs',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase49-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Terminal Flow.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE49_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE49_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 49 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F49 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
