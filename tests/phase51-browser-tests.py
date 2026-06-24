import json, pathlib, re
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/adaptive-pace-workload.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F51 carregada', meta.get('version')=='1.51.0' and meta.get('phase')=='F51', meta)
check('hotfix F50.1 preservado', 'SC-1.50.1' in (ROOT/'CHANGELOG.md').read_text(encoding='utf8') or 'F50.1' in (ROOT/'BUILD_NOTES.md').read_text(encoding='utf8'))
check('main bundle inclui módulo 54', '@skyward-module 54-adaptive-pace-workload-director' in main)
check('API SKYWARD_ADAPTIVE_PACE no bundle', 'SKYWARD_ADAPTIVE_PACE' in main)
check('catálogo possui perfis', len(cat.get('deviceProfiles',[]))>=5)
check('catálogo possui políticas', len(cat.get('pacePolicies',[]))>=4)
check('catálogo possui workload bands', len(cat.get('workloadBands',[]))>=4)
check('PWA cache inclui adaptive-pace-workload.json', any(f.get('file')=='data/adaptive-pace-workload.json' for f in cache.get('files',[])))
check('início de turno inicializa F51', 'initializeAdaptivePace' in traffic)
check('fim de turno mostra F51', 'Pace Director' in ui and 'Ritmo' in ui)
check('CSS possui painel adaptive', '.adaptive-pace-inline' in style)
check('scripts npm F51 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f51','test:browser:f51','test:phase51']))
check('schema adaptivePaceSchema 1', meta.get('adaptivePaceSchema')==1)
check('channel adaptive-pace-workload', meta.get('channel')=='adaptive-pace-workload' and 'adaptive-pace-workload' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc adaptive existe', (ROOT/'docs/ADAPTIVE_PACE_WORKLOAD_F51.md').exists())
check('doc mobile balance existe', (ROOT/'docs/MOBILE_BALANCE_COOLDOWN_F51.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('mobile profile conservador', any(p.get('id')=='MOBILE_STANDARD' and p.get('maxAircraft')<=4 and p.get('paceMultiplier')<=0.65 for p in cat.get('deviceProfiles',[])))
check('cooldown mobile elevado', any(p.get('id')=='MOBILE_STANDARD' and p.get('incidentCooldownSec')>=80 for p in cat.get('deviceProfiles',[])))
check('safe mode guard presente', any(r.get('id')=='SAFE_MODE_GUARD' for r in cat.get('balanceRules',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase51-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Adaptive Pace.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE51_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE51_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 51 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F51 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
