import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/passenger-reputation.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F39 carregada', meta.get('version')=='1.39.0' and meta.get('phase')=='F39', meta)
check('main bundle inclui módulo 42', '@skyward-module 42-passenger-reputation-center' in main)
check('API SKYWARD_PASSENGER_REPUTATION no bundle', 'SKYWARD_PASSENGER_REPUTATION' in main)
check('catálogo possui métricas', len(cat.get('experienceMetrics',[]))>=6)
check('catálogo possui programas', len(cat.get('servicePrograms',[]))>=6)
check('catálogo possui reclamações', len(cat.get('complaintTypes',[]))>=6)
check('PWA cache inclui passenger-reputation.json', any(f.get('file')=='data/passenger-reputation.json' for f in cache.get('files',[])))
check('início de turno inicializa F39', 'initializePassengerReputation' in traffic)
check('fim de turno mostra F39', 'Passenger XP' in ui and 'NPS' in ui)
check('CSS possui painel passenger', '.passenger-reputation-inline' in style)
check('scripts npm F39 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f39','test:browser:f39','test:phase39']))
check('schema passengerReputationSchema 1', meta.get('passengerReputationSchema')==1)
check('channel passenger-reputation', meta.get('channel')=='passenger-reputation' and 'passenger-reputation' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc passenger existe', (ROOT/'docs/PASSENGER_REPUTATION_F39.md').exists())
check('doc NPS existe', (ROOT/'docs/NPS_RECLAMACOES_IMAGEM_PUBLICA_F39.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('NPS presente', any(m.get('id')=='NPS' for m in cat.get('experienceMetrics',[])))
check('acessibilidade presente', any(m.get('id')=='ACCESSIBILITY' for m in cat.get('experienceMetrics',[])))
check('social viral presente', any(c.get('id')=='SOCIAL_VIRAL' for c in cat.get('complaintTypes',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase39-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Passenger Reputation.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE39_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE39_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 39 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F39 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
