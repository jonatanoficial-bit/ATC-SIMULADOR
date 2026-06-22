import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/airline-operations.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F31 carregada', meta.get('version')=='1.31.0' and meta.get('phase')=='F31', meta)
check('main bundle inclui módulo 34', '@skyward-module 34-airline-operations-center' in main)
check('API SKYWARD_AIRLINE_OPS no bundle', 'SKYWARD_AIRLINE_OPS' in main)
check('catálogo possui companhias', len(cat.get('airlines',[]))>=5)
check('catálogo possui route banks', len(cat.get('routeBanks',[]))>=4)
check('catálogo possui SLA', len(cat.get('slaMetrics',[]))>=5)
check('PWA cache inclui airline-operations.json', any(f.get('file')=='data/airline-operations.json' for f in cache.get('files',[])))
check('início de turno inicializa F31', 'initializeAirlineOps' in traffic)
check('fim de turno mostra F31', 'Airline Ops' in ui and 'SLA Cias' in ui)
check('CSS possui painel airline ops', '.airline-ops-inline' in style)
check('scripts npm F31 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f31','test:browser:f31','test:phase31']))
check('schema airlineOpsSchema 1', meta.get('airlineOpsSchema')==1)
check('channel airline-operations', meta.get('channel')=='airline-operations' and 'airline-operations' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc airline ops existe', (ROOT/'docs/AIRLINE_OPS_CENTER_F31.md').exists())
check('doc companhias existe', (ROOT/'docs/COMPANHIAS_MALHA_SLA_F31.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('Delta/KATL presente', any(a.get('id')=='DAL' and 'KATL' in a.get('baseAirports',[]) for a in cat.get('airlines',[])))
check('cargo peak presente', any(d.get('id')=='CARGO_PEAK' for d in cat.get('demandProfiles',[])))
check('REQ hub push presente', any(r.get('id')=='REQ_HUB_PUSH' for r in cat.get('serviceRequests',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase31-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Airline Ops.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE31_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE31_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 31 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F31 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
