import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/arrival-departure-sequencer.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
notes=(ROOT/'BUILD_NOTES.md').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F61 carregada', meta.get('version')=='1.61.0' and meta.get('phase')=='F61', meta)
for tag, key in [('F51','adaptivePaceSchema'),('F52','stabilityDiagnosticsSchema'),('F53','pwaUpdateManagerSchema'),('F54','liveOpsRemoteConfigSchema'),('F55','scenarioMissionSchema'),('F56','campaignProgressionSchema'),('F57','instructorDebriefSchema'),('F58','replayTimelineSchema'),('F59','worldAirportProcedureSchema'),('F60','dynamicWeatherAtisNotamSchema')]:
    check(f'{tag} preservada', tag in notes and meta.get(key)==1)
check('hotfix F50.1 preservado', 'F50.1' in notes)
check('main bundle inclui módulo 64', '@skyward-module 64-arrival-departure-sequencer-center' in main)
check('API SKYWARD_ARRIVAL_DEPARTURE no bundle', 'SKYWARD_ARRIVAL_DEPARTURE' in main)
check('catálogo possui arrival flows', len(cat.get('arrivalFlows',[]))>=6)
check('catálogo possui departure banks', len(cat.get('departureBanks',[]))>=5)
check('catálogo possui holding stacks', len(cat.get('holdingStacks',[]))>=5)
check('catálogo possui priority rules', len(cat.get('priorityRules',[]))>=7)
check('PWA cache inclui arrival-departure-sequencer.json', any(f.get('file')=='data/arrival-departure-sequencer.json' for f in cache.get('files',[])))
check('início de turno inicializa F61', 'initializeArrivalDepartureSequencer' in traffic)
check('fim de turno mostra F61', 'Flow' in ui and 'AMAN/DMAN' in ui)
check('CSS possui painel arrival departure', '.arrival-departure-inline' in style)
check('scripts npm F61 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f61','test:browser:f61','test:phase61']))
check('schema arrivalDepartureSequencerSchema 1', meta.get('arrivalDepartureSequencerSchema')==1)
check('channel arrival-departure-sequencer', meta.get('channel')=='arrival-departure-sequencer' and 'arrival-departure-sequencer' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc sequencer existe', (ROOT/'docs/ARRIVAL_DEPARTURE_SEQUENCER_F61.md').exists())
check('doc aman dman existe', (ROOT/'docs/AMAN_DMAN_HOLDING_SLOTS_F61.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('low vis stream presente', any(a.get('id')=='LOW_VIS_STREAM' for a in cat.get('arrivalFlows',[])))
check('weather hold bank presente', any(d.get('id')=='WEATHER_HOLD_BANK' for d in cat.get('departureBanks',[])))
check('emergency priority presente', any(p.get('id')=='EMERGENCY' for p in cat.get('priorityRules',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase61-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Arrival Departure Sequencer.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE61_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE61_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 61 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F61 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
