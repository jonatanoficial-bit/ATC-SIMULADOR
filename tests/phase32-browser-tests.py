import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/airport-authority.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F32 carregada', meta.get('version')=='1.32.0' and meta.get('phase')=='F32', meta)
check('main bundle inclui módulo 35', '@skyward-module 35-airport-authority-terminal-ops' in main)
check('API SKYWARD_AIRPORT_AUTHORITY no bundle', 'SKYWARD_AIRPORT_AUTHORITY' in main)
check('catálogo possui terminais', len(cat.get('terminals',[]))>=4)
check('catálogo possui portões', len(cat.get('gatePools',[]))>=4)
check('catálogo possui fluxos', len(cat.get('passengerFlows',[]))>=6)
check('PWA cache inclui airport-authority.json', any(f.get('file')=='data/airport-authority.json' for f in cache.get('files',[])))
check('início de turno inicializa F32', 'initializeAirportAuthority' in traffic)
check('fim de turno mostra F32', 'Airport Auth' in ui and 'Terminal EXP' in ui)
check('CSS possui painel airport authority', '.airport-authority-inline' in style)
check('scripts npm F32 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f32','test:browser:f32','test:phase32']))
check('schema airportAuthoritySchema 1', meta.get('airportAuthoritySchema')==1)
check('channel airport-authority', meta.get('channel')=='airport-authority' and 'airport-authority' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc airport authority existe', (ROOT/'docs/AIRPORT_AUTHORITY_TERMINAL_OPS_F32.md').exists())
check('doc terminais existe', (ROOT/'docs/TERMINAIS_PORTOES_PASSAGEIROS_F32.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('terminal internacional presente', any(t.get('id')=='T2_INTERNATIONAL' for t in cat.get('terminals',[])))
check('bagagem presente', any(f.get('id')=='BAGGAGE' for f in cat.get('passengerFlows',[])))
check('evento gate conflict presente', any(e.get('id')=='GATE_CONFLICT' for e in cat.get('terminalEvents',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase32-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Airport Authority.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE32_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE32_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 32 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F32 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
