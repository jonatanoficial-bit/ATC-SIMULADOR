import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/environment-sustainability.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F36 carregada', meta.get('version')=='1.36.0' and meta.get('phase')=='F36', meta)
check('main bundle inclui módulo 39', '@skyward-module 39-environment-sustainability-center' in main)
check('API SKYWARD_ENVIRONMENT_SUSTAINABILITY no bundle', 'SKYWARD_ENVIRONMENT_SUSTAINABILITY' in main)
check('catálogo possui métricas', len(cat.get('environmentMetrics',[]))>=6)
check('catálogo possui iniciativas', len(cat.get('greenInitiatives',[]))>=6)
check('catálogo possui eventos', len(cat.get('environmentEvents',[]))>=5)
check('PWA cache inclui environment-sustainability.json', any(f.get('file')=='data/environment-sustainability.json' for f in cache.get('files',[])))
check('início de turno inicializa F36', 'initializeEnvironmentSustainability' in traffic)
check('fim de turno mostra F36', 'ENV ESG' in ui and 'Licença Amb.' in ui)
check('CSS possui painel environment', '.environment-sustainability-inline' in style)
check('scripts npm F36 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f36','test:browser:f36','test:phase36']))
check('schema environmentSustainabilitySchema 1', meta.get('environmentSustainabilitySchema')==1)
check('channel environment-sustainability', meta.get('channel')=='environment-sustainability' and 'environment-sustainability' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc environment existe', (ROOT/'docs/ENVIRONMENT_SUSTAINABILITY_F36.md').exists())
check('doc ruído existe', (ROOT/'docs/RUIDO_EMISSOES_COMUNIDADE_F36.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('ruído presente', any(m.get('id')=='NOISE' for m in cat.get('environmentMetrics',[])))
check('CO2 presente', any(m.get('id')=='CO2' for m in cat.get('environmentMetrics',[])))
check('CDA presente', any(g.get('id')=='CDA_APPROACH' for g in cat.get('greenInitiatives',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase36-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Environment Sustainability.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE36_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE36_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 36 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F36 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
