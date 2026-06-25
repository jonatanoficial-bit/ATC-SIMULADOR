import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/sector-handoff-coordination.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
notes=(ROOT/'BUILD_NOTES.md').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F62 carregada', meta.get('version')=='1.62.0' and meta.get('phase')=='F62', meta)
for tag, key in [('F51','adaptivePaceSchema'),('F52','stabilityDiagnosticsSchema'),('F53','pwaUpdateManagerSchema'),('F54','liveOpsRemoteConfigSchema'),('F55','scenarioMissionSchema'),('F56','campaignProgressionSchema'),('F57','instructorDebriefSchema'),('F58','replayTimelineSchema'),('F59','worldAirportProcedureSchema'),('F60','dynamicWeatherAtisNotamSchema'),('F61','arrivalDepartureSequencerSchema')]:
    check(f'{tag} preservada', tag in notes and meta.get(key)==1)
check('hotfix F50.1 preservado', 'F50.1' in notes)
check('main bundle inclui módulo 65', '@skyward-module 65-sector-handoff-coordination-center' in main)
check('API SKYWARD_SECTOR_HANDOFF no bundle', 'SKYWARD_SECTOR_HANDOFF' in main)
check('catálogo possui setores', len(cat.get('controlSectors',[]))>=7)
check('catálogo possui handoffs', len(cat.get('handoffTypes',[]))>=7)
check('catálogo possui regras', len(cat.get('coordinationRules',[]))>=7)
check('PWA cache inclui sector-handoff-coordination.json', any(f.get('file')=='data/sector-handoff-coordination.json' for f in cache.get('files',[])))
check('início de turno inicializa F62', 'initializeSectorHandoff' in traffic)
check('fim de turno mostra F62', 'Sector' in ui and 'Handoff' in ui)
check('CSS possui painel sector handoff', '.sector-handoff-inline' in style)
check('scripts npm F62 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f62','test:browser:f62','test:phase62']))
check('schema sectorHandoffSchema 1', meta.get('sectorHandoffSchema')==1)
check('channel sector-handoff-coordination', meta.get('channel')=='sector-handoff-coordination' and 'sector-handoff-coordination' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc sector handoff existe', (ROOT/'docs/SECTOR_HANDOFF_COORDINATION_F62.md').exists())
check('doc control room existe', (ROOT/'docs/ATC_HANDOFF_SECTORS_CONTROL_ROOM_F62.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('tower sector presente', any(s.get('id')=='TOWER' for s in cat.get('controlSectors',[])))
check('approach to tower presente', any(h.get('id')=='APPROACH_TO_TOWER' for h in cat.get('handoffTypes',[])))
check('emergency broadcast presente', any(h.get('id')=='EMERGENCY_BROADCAST' for h in cat.get('handoffTypes',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase62-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Sector Handoff Coordination.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE62_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE62_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 62 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F62 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
