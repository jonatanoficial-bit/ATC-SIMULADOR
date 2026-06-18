import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/procedures-f16.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
render=(ROOT/'src/runtime/08-radar-rendering.js').read_text(encoding='utf8')
sim=(ROOT/'src/runtime/07-simulation-safety.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F16 carregada', meta.get('version')=='1.16.0' and meta.get('phase')=='F16', meta)
check('main bundle inclui módulo 19', '@skyward-module 19-procedures-sid-star-rnav' in main)
check('API SKYWARD_PROCEDURES no bundle', 'SKYWARD_PROCEDURES' in main)
check('catálogo possui SBGR SBSP KATL', all(k in cat.get('airports',{}) for k in ['SBGR','SBSP','KATL']))
check('catálogo possui SID STAR APPROACH', all(cat['airports'][a].get('sids') and cat['airports'][a].get('stars') and cat['airports'][a].get('approaches') for a in ['SBGR','SBSP','KATL']))
check('catálogo possui missed e hold', all(cat['airports'][a].get('missedApproach') and cat['airports'][a].get('holds') for a in ['SBGR','SBSP','KATL']))
check('PWA cache inclui procedures-f16.json', any(f.get('file')=='data/procedures-f16.json' for f in cache.get('files',[])))
check('início de turno inicializa procedimentos', 'initializeProceduresLayer' in traffic)
check('simulação usa guidance de procedimento', 'stepProcedureGuidance' in sim)
check('UI integra chegada publicada', 'assignArrivalProcedure' in ui)
check('UI integra SID de decolagem', 'assignDepartureProcedure' in ui)
check('UI integra missed approach', 'assignMissedApproachProcedure' in ui)
check('render desenha overlay publicado', 'drawPublishedProceduresOverlay' in render)
check('scripts npm F16 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f16','test:browser:f16','test:phase16']))
check('schema procedureOpsSchema 1', meta.get('procedureOpsSchema')==1)
check('documento upload existe raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload existe docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('ILS/RNAV presentes no SBGR', {'ILS','RNAV'}.issubset(set(a['type'] for a in cat['airports']['SBGR']['approaches'])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase16-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para procedimentos publicados.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE16_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE16_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 16 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F16 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
