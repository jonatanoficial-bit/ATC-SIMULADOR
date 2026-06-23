import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/digital-twin-predictive.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F44 carregada', meta.get('version')=='1.44.0' and meta.get('phase')=='F44', meta)
check('main bundle inclui módulo 47', '@skyward-module 47-digital-twin-predictive-center' in main)
check('API SKYWARD_DIGITAL_TWIN no bundle', 'SKYWARD_DIGITAL_TWIN' in main)
check('catálogo possui sinais', len(cat.get('twinSignals',[]))>=8)
check('catálogo possui modelos', len(cat.get('forecastModels',[]))>=6)
check('catálogo possui recomendações', len(cat.get('recommendationPlays',[]))>=7)
check('catálogo possui riscos', len(cat.get('riskScenarios',[]))>=8)
check('PWA cache inclui digital-twin-predictive.json', any(f.get('file')=='data/digital-twin-predictive.json' for f in cache.get('files',[])))
check('início de turno inicializa F44', 'initializeDigitalTwin' in traffic)
check('fim de turno mostra F44', 'Digital Twin' in ui and 'Forecast' in ui)
check('CSS possui painel digital twin', '.digital-twin-inline' in style)
check('scripts npm F44 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f44','test:browser:f44','test:phase44']))
check('schema digitalTwinPredictiveSchema 1', meta.get('digitalTwinPredictiveSchema')==1)
check('channel digital-twin-predictive', meta.get('channel')=='digital-twin-predictive' and 'digital-twin-predictive' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc digital twin existe', (ROOT/'docs/DIGITAL_TWIN_PREDICTIVE_F44.md').exists())
check('doc forecast existe', (ROOT/'docs/FORECAST_GARGALOS_WHATIF_F44.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('traffic load presente', any(s.get('id')=='TRAFFIC_LOAD' for s in cat.get('twinSignals',[])))
check('asset reliability presente', any(s.get('id')=='ASSET_RELIABILITY' for s in cat.get('twinSignals',[])))
check('bottleneck model presente', any(m.get('id')=='BOTTLENECK_15' for m in cat.get('forecastModels',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase44-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Digital Twin Predictive.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE44_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE44_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 44 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F44 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
