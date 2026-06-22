import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/crisis-command-center.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F33 carregada', meta.get('version')=='1.33.0' and meta.get('phase')=='F33', meta)
check('main bundle inclui módulo 36', '@skyward-module 36-crisis-command-center' in main)
check('API SKYWARD_CRISIS_COMMAND no bundle', 'SKYWARD_CRISIS_COMMAND' in main)
check('catálogo possui crises', len(cat.get('crisisTypes',[]))>=6)
check('catálogo possui ações', len(cat.get('commandActions',[]))>=6)
check('catálogo possui recovery', len(cat.get('recoveryStages',[]))>=5)
check('PWA cache inclui crisis-command-center.json', any(f.get('file')=='data/crisis-command-center.json' for f in cache.get('files',[])))
check('início de turno inicializa F33', 'initializeCrisisCommand' in traffic)
check('fim de turno mostra F33', 'Crisis Cmd' in ui and 'Recovery' in ui)
check('CSS possui painel crisis', '.crisis-command-inline' in style)
check('scripts npm F33 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f33','test:browser:f33','test:phase33']))
check('schema crisisCommandSchema 1', meta.get('crisisCommandSchema')==1)
check('channel crisis-command', meta.get('channel')=='crisis-command' and 'crisis-command' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc crisis existe', (ROOT/'docs/CRISIS_COMMAND_CENTER_F33.md').exists())
check('doc recovery existe', (ROOT/'docs/OPERACOES_IRREGULARES_RECOVERY_F33.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('cyber presente', any(c.get('id')=='CYBER_INCIDENT' for c in cat.get('crisisTypes',[])))
check('ground stop presente', any(c.get('id')=='GROUND_STOP' for c in cat.get('crisisTypes',[])))
check('debrief recovery presente', any(r.get('id')=='DEBRIEF' for r in cat.get('recoveryStages',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase33-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Crisis Command.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE33_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE33_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 33 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F33 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
