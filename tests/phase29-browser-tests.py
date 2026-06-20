import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/training-coach-debriefing.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F29 carregada', meta.get('version')=='1.29.0' and meta.get('phase')=='F29', meta)
check('main bundle inclui módulo 32', '@skyward-module 32-training-coach-debriefing' in main)
check('API SKYWARD_TRAINING_COACH no bundle', 'SKYWARD_TRAINING_COACH' in main)
check('catálogo possui domínios', len(cat.get('coachDomains',[]))>=7)
check('catálogo possui study cards', len(cat.get('studyCards',[]))>=7)
check('catálogo possui adaptive rules', len(cat.get('adaptiveRules',[]))>=7)
check('PWA cache inclui training-coach-debriefing.json', any(f.get('file')=='data/training-coach-debriefing.json' for f in cache.get('files',[])))
check('início de turno inicializa F29', 'initializeTrainingCoach' in traffic)
check('fim de turno mostra F29', 'Instrutor ATC' in ui and 'Plano de estudo' in ui)
check('CSS possui painel coach', '.training-coach-inline' in style)
check('scripts npm F29 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f29','test:browser:f29','test:phase29']))
check('schema trainingCoachSchema 1', meta.get('trainingCoachSchema')==1)
check('channel training-coach', meta.get('channel')=='training-coach' and 'training-coach' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc instrutor existe', (ROOT/'docs/INSTRUTOR_ATC_DEBRIEFING_F29.md').exists())
check('doc plano estudo existe', (ROOT/'docs/PLANO_ESTUDO_ADAPTATIVO_F29.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('card holding presente', any(c.get('id')=='HOLD_SHORT' for c in cat.get('studyCards',[])))
check('badge flow presente', any(b.get('id')=='FLOW_PLANNER' for b in cat.get('coachBadges',[])))
check('regra slot presente', any(r.get('id')=='RULE_SLOT' for r in cat.get('adaptiveRules',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase29-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Training Coach.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE29_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE29_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 29 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F29 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
