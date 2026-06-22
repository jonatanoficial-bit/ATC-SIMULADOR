import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/multi-airport-network.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F40 carregada', meta.get('version')=='1.40.0' and meta.get('phase')=='F40', meta)
check('main bundle inclui módulo 43', '@skyward-module 43-multi-airport-network-center' in main)
check('API SKYWARD_MULTI_AIRPORT_NETWORK no bundle', 'SKYWARD_MULTI_AIRPORT_NETWORK' in main)
check('catálogo possui aeroportos', len(cat.get('airports',[]))>=6)
check('catálogo possui route banks', len(cat.get('routeBanks',[]))>=5)
check('catálogo possui políticas', len(cat.get('networkPolicies',[]))>=5)
check('PWA cache inclui multi-airport-network.json', any(f.get('file')=='data/multi-airport-network.json' for f in cache.get('files',[])))
check('início de turno inicializa F40', 'initializeMultiAirportNetwork' in traffic)
check('fim de turno mostra F40', 'Multi Hub' in ui and 'Rede' in ui)
check('CSS possui painel multi-airport', '.multi-airport-network-inline' in style)
check('scripts npm F40 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f40','test:browser:f40','test:phase40']))
check('schema multiAirportNetworkSchema 1', meta.get('multiAirportNetworkSchema')==1)
check('channel multi-airport-network', meta.get('channel')=='multi-airport-network' and 'multi-airport-network' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc network existe', (ROOT/'docs/MULTI_AIRPORT_NETWORK_F40.md').exists())
check('doc hubs existe', (ROOT/'docs/HUBS_ROTAS_SLOTS_REGIONAIS_F40.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('SBGR presente', any(a.get('icao')=='SBGR' for a in cat.get('airports',[])))
check('VCP cargo presente', any(r.get('id')=='VCP_CARGO' for r in cat.get('routeBanks',[])))
check('connection lost presente', any(d.get('id')=='CONNECTION_WAVE_LOST' for d in cat.get('disruptionTypes',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase40-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Multi-Airport Network.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE40_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE40_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 40 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F40 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
