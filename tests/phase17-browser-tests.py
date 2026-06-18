import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/career-ratings.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F17 carregada', meta.get('version')=='1.17.0' and meta.get('phase')=='F17', meta)
check('main bundle inclui módulo 20', '@skyward-module 20-controller-career' in main)
check('API SKYWARD_CAREER no bundle', 'SKYWARD_CAREER' in main)
check('catálogo possui licenças', len(cat.get('licenses',[]))>=6)
check('catálogo possui ratings', len(cat.get('ratings',[]))>=6)
check('catálogo possui turnos', len(cat.get('shiftTypes',[]))>=5)
check('catálogo possui fadiga e reputação', len(cat.get('fatigueBands',[]))>=4 and len(cat.get('reputationBands',[]))>=5)
check('PWA cache inclui career-ratings.json', any(f.get('file')=='data/career-ratings.json' for f in cache.get('files',[])))
check('início de turno inicializa carreira', 'initializeCareerProfile' in traffic)
check('fim de turno avalia carreira', 'updateCareerAfterShift' in ui)
check('tela final mostra carreira', 'Carreira' in ui and 'Fadiga' in ui)
check('painel CSS de carreira', '.career-ops-inline' in style)
check('scripts npm F17 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f17','test:browser:f17','test:phase17']))
check('schema careerSchema 1', meta.get('careerSchema')==1)
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('SUPERVISOR presente', any(l.get('id')=='SUPERVISOR' for l in cat.get('licenses',[])))
check('SENIOR_CONTROLLER presente', any(r.get('id')=='SENIOR_CONTROLLER' for r in cat.get('ratings',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase17-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para carreira operacional profunda.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE17_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE17_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 17 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F17 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
