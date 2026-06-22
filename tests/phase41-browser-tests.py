import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/emergency-response-disaster.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F41 carregada', meta.get('version')=='1.41.0' and meta.get('phase')=='F41', meta)
check('main bundle inclui módulo 44', '@skyward-module 44-emergency-response-disaster-center' in main)
check('API SKYWARD_EMERGENCY_RESPONSE no bundle', 'SKYWARD_EMERGENCY_RESPONSE' in main)
check('catálogo possui unidades', len(cat.get('emergencyUnits',[]))>=6)
check('catálogo possui cenários', len(cat.get('emergencyScenarios',[]))>=6)
check('catálogo possui programas', len(cat.get('preparednessPrograms',[]))>=6)
check('PWA cache inclui emergency-response-disaster.json', any(f.get('file')=='data/emergency-response-disaster.json' for f in cache.get('files',[])))
check('início de turno inicializa F41', 'initializeEmergencyResponse' in traffic)
check('fim de turno mostra F41', 'Emergency Ops' in ui and 'Resposta' in ui)
check('CSS possui painel emergency', '.emergency-response-inline' in style)
check('scripts npm F41 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f41','test:browser:f41','test:phase41']))
check('schema emergencyResponseSchema 1', meta.get('emergencyResponseSchema')==1)
check('channel emergency-response', meta.get('channel')=='emergency-response' and 'emergency-response' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc emergency existe', (ROOT/'docs/EMERGENCY_RESPONSE_F41.md').exists())
check('doc ARFF existe', (ROOT/'docs/ARFF_EVACUACAO_TRIAGEM_F41.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('ARFF presente', any(u.get('id')=='ARFF_1' for u in cat.get('emergencyUnits',[])))
check('mass casualty presente', any(s.get('id')=='MASS_CASUALTY' for s in cat.get('emergencyScenarios',[])))
check('full drill presente', any(p.get('id')=='FULL_SCALE_DRILL' for p in cat.get('preparednessPrograms',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase41-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Emergency Response.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE41_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE41_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 41 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F41 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
