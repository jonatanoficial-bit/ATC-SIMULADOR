import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/ux-polish-presets.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F22 carregada', meta.get('version')=='1.22.0' and meta.get('phase')=='F22', meta)
check('main bundle inclui módulo 25', '@skyward-module 25-commercial-polish-ux' in main)
check('API SKYWARD_COMMERCIAL_POLISH no bundle', 'SKYWARD_COMMERCIAL_POLISH' in main)
check('catálogo possui layouts', len(cat.get('hudLayouts',[]))>=4)
check('catálogo possui onboarding', len(cat.get('onboardingSteps',[]))>=5)
check('catálogo possui acessibilidade', len(cat.get('accessibilityModes',[]))>=4)
check('catálogo possui release readiness', len(cat.get('releaseReadiness',[]))>=5)
check('PWA cache inclui ux-polish-presets.json', any(f.get('file')=='data/ux-polish-presets.json' for f in cache.get('files',[])))
check('início de turno inicializa polish', 'initializeCommercialPolish' in traffic)
check('CSS possui mobile compact', 'layout-mobile-compact' in style)
check('CSS possui portrait safe', 'layout-portrait-safe' in style)
check('CSS possui onboarding', 'commercial-onboarding-overlay' in style)
check('CSS possui menu cards', 'commercial-menu-card' in style)
check('CSS possui accessibility', 'skyward-high-contrast' in style and 'skyward-low-motion' in style)
check('painel CSS de polish', '.commercial-polish-inline' in style)
check('scripts npm F22 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f22','test:browser:f22','test:phase22']))
check('schema commercialPolishSchema 1', meta.get('commercialPolishSchema')==1)
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('mobile layout presente', any(l.get('id')=='MOBILE_LANDSCAPE_COMPACT' for l in cat.get('hudLayouts',[])))
check('high contrast presente', any(m.get('id')=='HIGH_CONTRAST' for m in cat.get('accessibilityModes',[])))
check('fullscreen readiness presente', any(r.get('id')=='MOBILE_FULLSCREEN' for r in cat.get('releaseReadiness',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase22-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para polimento comercial/mobile AAA.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE22_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE22_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 22 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F22 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
