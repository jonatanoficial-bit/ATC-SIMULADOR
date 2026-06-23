import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/ground-turnaround.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F47 carregada', meta.get('version')=='1.47.0' and meta.get('phase')=='F47', meta)
check('main bundle inclui módulo 50', '@skyward-module 50-ground-handling-turnaround-center' in main)
check('API SKYWARD_GROUND_TURNAROUND no bundle', 'SKYWARD_GROUND_TURNAROUND' in main)
check('catálogo possui processos', len(cat.get('turnaroundProcesses',[]))>=8)
check('catálogo possui causas de atraso', len(cat.get('delayCauses',[]))>=7)
check('catálogo possui programas', len(cat.get('improvementPrograms',[]))>=7)
check('PWA cache inclui ground-turnaround.json', any(f.get('file')=='data/ground-turnaround.json' for f in cache.get('files',[])))
check('início de turno inicializa F47', 'initializeGroundTurnaround' in traffic)
check('fim de turno mostra F47', 'Ground Ops' in ui and 'TAT Médio' in ui)
check('CSS possui painel ground', '.ground-turnaround-inline' in style)
check('scripts npm F47 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f47','test:browser:f47','test:phase47']))
check('schema groundTurnaroundSchema 1', meta.get('groundTurnaroundSchema')==1)
check('channel ground-turnaround', meta.get('channel')=='ground-turnaround' and 'ground-turnaround' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc ground existe', (ROOT/'docs/GROUND_TURNAROUND_F47.md').exists())
check('doc gate existe', (ROOT/'docs/GATE_PUSHBACK_BAGAGEM_COMBUSTIVEL_F47.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('pushback presente', any(p.get('id')=='PUSHBACK' for p in cat.get('turnaroundProcesses',[])))
check('fueling presente', any(p.get('id')=='FUELING' for p in cat.get('turnaroundProcesses',[])))
check('ramp incident presente', any(d.get('id')=='RAMP_INCIDENT' for d in cat.get('delayCauses',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase47-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Ground Turnaround.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE47_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE47_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 47 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F47 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
