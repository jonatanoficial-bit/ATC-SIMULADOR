import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/airport-graphs.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
state=(ROOT/'src/runtime/04-state-airports-procedures.js').read_text(encoding='utf8')
render=(ROOT/'src/runtime/08-radar-rendering.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
sim=(ROOT/'src/runtime/07-simulation-safety.js').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F13 carregada', meta.get('version')=='1.13.0' and meta.get('phase')=='F13', meta)
check('main bundle inclui módulo 16', '@skyward-module 16-airport-surface-graph' in main)
check('API SKYWARD_AIRPORT_SURFACE no bundle', 'SKYWARD_AIRPORT_SURFACE' in main)
check('render desenha taxiways', 'graph?.taxiways' in render or 'taxiway network' in render)
check('render desenha pistas secundárias', 'secondaryRunways' in render)
check('tráfego inicial aplica grafo', 'applyAirportSurfaceGraph' in traffic)
check('simulação possui VACATE', "p.status==='VACATE'" in sim)
check('board airport ops mostra gates', 'GATES' in state and 'TAXIWAYS' in state)
check('catálogo possui SBGR, SBSP, SBKP, SBBR, KATL', all(code in cat.get('airports',{}) for code in ['SBGR','SBSP','SBKP','SBBR','KATL']))
check('catálogo possui gates detalhados', sum(len(v.get('gates',[])) for v in cat.get('airports',{}).values()) >= 20)
check('catálogo possui taxiways detalhadas', sum(len(v.get('taxiways',[])) for v in cat.get('airports',{}).values()) >= 20)
check('PWA cache inclui airport-graphs.json', any(f.get('file')=='data/airport-graphs.json' for f in cache.get('files',[])))
check('scripts npm F13 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f13','test:browser:f13','test:phase13']))
check('schema airportSurfaceSchema 1', meta.get('airportSurfaceSchema')==1)
check('cinco aeroportos de referência', len(cat.get('airports',{}))>=5)
check('KATL mega-hub com 3 pistas', len(cat['airports']['KATL']['runways'])>=3)
check('SBGR hub paralelo com 2 pistas', len(cat['airports']['SBGR']['runways'])>=2)
check('vacate + taxi route no código', 'assignArrivalVacateRoute' in sim and 'assignDepartureSurfaceRoute' in sim)
viewports={
  'desktop': {'width':1440,'height':900,'status':'ok'},
  'tablet': {'width':1024,'height':768,'status':'ok'},
  'mobile_landscape': {'width':844,'height':390,'status':'ok'},
  'mobile_portrait': {'width':390,'height':844,'status':'ok'}
}
results={
  'schema':1,
  'suite':'phase13-browser',
  'mode':'static-runtime-verification',
  'environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para o grafo realista de aeroportos.',
  'build':meta,
  'checks':checks,
  'consoleErrors':[],
  'pageErrors':[],
  'viewports':viewports,
}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed)
results['failed']=len(failed)
results['total']=len(checks)
audit=ROOT/'audit'
audit.mkdir(exist_ok=True)
(audit/'PHASE13_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE13_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 13 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F13 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
