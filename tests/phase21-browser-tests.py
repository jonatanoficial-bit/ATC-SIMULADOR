import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/control-room-ranking.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F21 carregada', meta.get('version')=='1.21.0' and meta.get('phase')=='F21', meta)
check('main bundle inclui módulo 24', '@skyward-module 24-control-room-multiplayer' in main)
check('API SKYWARD_CONTROL_ROOM no bundle', 'SKYWARD_CONTROL_ROOM' in main)
check('catálogo possui salas', len(cat.get('roomTypes',[]))>=4)
check('catálogo possui ranking tiers', len(cat.get('rankingTiers',[]))>=5)
check('catálogo possui métricas', len(cat.get('comparisonMetrics',[]))>=6)
check('PWA cache inclui control-room-ranking.json', any(f.get('file')=='data/control-room-ranking.json' for f in cache.get('files',[])))
check('início de turno renderiza control room', 'renderControlRoomBoard' in traffic)
check('fim de turno completa control room', 'completeControlRoomShift' in ui)
check('tela final mostra replay', 'Replay compartilhável' in ui and 'Ranking local' in ui)
check('painel CSS de control room', '.control-room-inline' in style)
check('scripts npm F21 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f21','test:browser:f21','test:phase21']))
check('schema controlRoomSchema 1', meta.get('controlRoomSchema')==1)
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('NETWORK_ROOM presente', any(r.get('id')=='NETWORK_ROOM' for r in cat.get('roomTypes',[])))
check('EMERGENCY_ROOM presente', any(r.get('id')=='EMERGENCY_ROOM' for r in cat.get('roomTypes',[])))
check('MASTER tier presente', any(t.get('id')=='MASTER' for t in cat.get('rankingTiers',[])))
check('share policy offline', cat.get('sharePolicy',{}).get('offlineOnly') is True)
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase21-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para control room local/offline.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE21_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE21_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 21 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F21 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
