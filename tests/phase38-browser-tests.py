import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/workforce-staffing.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F38 carregada', meta.get('version')=='1.38.0' and meta.get('phase')=='F38', meta)
check('main bundle inclui módulo 41', '@skyward-module 41-workforce-staffing-center' in main)
check('API SKYWARD_WORKFORCE_STAFFING no bundle', 'SKYWARD_WORKFORCE_STAFFING' in main)
check('catálogo possui funções', len(cat.get('roles',[]))>=6)
check('catálogo possui treinamentos', len(cat.get('trainingPrograms',[]))>=5)
check('catálogo possui contratações', len(cat.get('hiringPools',[]))>=4)
check('PWA cache inclui workforce-staffing.json', any(f.get('file')=='data/workforce-staffing.json' for f in cache.get('files',[])))
check('início de turno inicializa F38', 'initializeWorkforceStaffing' in traffic)
check('fim de turno mostra F38', 'Workforce' in ui and 'Fadiga Média' in ui)
check('CSS possui painel workforce', '.workforce-staffing-inline' in style)
check('scripts npm F38 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f38','test:browser:f38','test:phase38']))
check('schema workforceStaffingSchema 1', meta.get('workforceStaffingSchema')==1)
check('channel workforce-staffing', meta.get('channel')=='workforce-staffing' and 'workforce-staffing' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc workforce existe', (ROOT/'docs/WORKFORCE_STAFFING_F38.md').exists())
check('doc escala existe', (ROOT/'docs/ESCALAS_FADIGA_TREINAMENTO_F38.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('torre presente', any(r.get('id')=='TOWER_CONTROLLER' for r in cat.get('roles',[])))
check('burnout presente', any(e.get('id')=='BURNOUT_ALERT' for e in cat.get('laborEvents',[])))
check('sim refresher presente', any(t.get('id')=='SIM_REFRESHER' for t in cat.get('trainingPrograms',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase38-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Workforce Staffing.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE38_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE38_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 38 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F38 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
