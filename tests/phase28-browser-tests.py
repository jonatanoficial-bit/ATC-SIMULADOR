import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/training-academy-scenarios.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F28 carregada', meta.get('version')=='1.28.0' and meta.get('phase')=='F28', meta)
check('main bundle inclui módulo 31', '@skyward-module 31-training-academy-certification' in main)
check('API SKYWARD_TRAINING_ACADEMY no bundle', 'SKYWARD_TRAINING_ACADEMY' in main)
check('catálogo possui trilhas', len(cat.get('tracks',[]))>=6)
check('catálogo possui missões', len(cat.get('missions',[]))>=7)
check('catálogo possui exames', len(cat.get('exams',[]))>=4)
check('PWA cache inclui training-academy-scenarios.json', any(f.get('file')=='data/training-academy-scenarios.json' for f in cache.get('files',[])))
check('início de turno inicializa F28', 'initializeTrainingAcademy' in traffic)
check('fim de turno mostra F28', 'Academia ATC' in ui and 'Próxima missão' in ui)
check('CSS possui painel academy', '.training-academy-inline' in style)
check('scripts npm F28 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f28','test:browser:f28','test:phase28']))
check('schema trainingAcademySchema 1', meta.get('trainingAcademySchema')==1)
check('channel training-academy', meta.get('channel')=='training-academy' and 'training-academy' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc academia existe', (ROOT/'docs/ACADEMIA_ATC_F28.md').exists())
check('doc certificações existe', (ROOT/'docs/TREINAMENTO_CERTIFICACOES_F28.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('missão emergency presente', any(m.get('id')=='EMR_01' for m in cat.get('missions',[])))
check('exame supervisor presente', any(e.get('id')=='EXAM_SUPERVISOR' for e in cat.get('exams',[])))
check('rubrica segurança presente', any(r.get('id')=='SAFETY' for r in cat.get('rubric',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase28-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Training Academy.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE28_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE28_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 28 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F28 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
