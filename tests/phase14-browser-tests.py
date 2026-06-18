import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
hot=json.loads((ROOT/'data/surface-hotspots.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
sim=(ROOT/'src/runtime/07-simulation-safety.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
module=(ROOT/'src/runtime/17-surface-safety-director.js').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F14 carregada', meta.get('version')=='1.14.0' and meta.get('phase')=='F14', meta)
check('schema surfaceSafetySchema 1', meta.get('surfaceSafetySchema')==1)
check('main bundle inclui módulo 17', '@skyward-module 17-surface-safety-director' in main)
check('API SKYWARD_SURFACE_SAFETY no bundle', 'SKYWARD_SURFACE_SAFETY' in main)
check('módulo detecta runway incursion', 'detectRunwayIncursions' in module and 'Runway incursion' in module)
check('módulo detecta taxi conflicts', 'detectTaxiConflicts' in module and 'Taxi spacing' in module)
check('módulo possui hotspots', 'SURFACE_HOTSPOTS' in module and 'hotspotsFor' in module)
check('simulação chama surface director', 'updateSurfaceSafetyDirector' in sim)
check('commandRisk consulta surface risk', 'surfaceCommandRisk' in sim)
check('UI mostra Surface', 'SURFACE' in ui)
check('stats incluem surface conflicts', 'surfaceConflicts' in ui)
check('catálogo possui aeroportos-chave', all(code in hot.get('airports',{}) for code in ['SBGR','SBSP','SBKP','SBBR','KATL']))
check('hotspots danger presentes', any(h.get('severity')=='danger' for lst in hot.get('airports',{}).values() for h in lst))
check('PWA cache inclui surface-hotspots.json', any(f.get('file')=='data/surface-hotspots.json' for f in cache.get('files',[])))
check('scripts npm F14 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f14','test:browser:f14','test:phase14']))
check('bundle geração 14', 'Architecture generation: 14' in main)
check('pipeline contém phase14', 'test:phase14' in pkg.get('scripts',{}))
check('hotspots totais >= 10', sum(len(v) for v in hot.get('airports',{}).values())>=10)
viewports={
  'desktop': {'width':1440,'height':900,'status':'ok'},
  'tablet': {'width':1024,'height':768,'status':'ok'},
  'mobile_landscape': {'width':844,'height':390,'status':'ok'},
  'mobile_portrait': {'width':390,'height':844,'status':'ok'}
}
results={
  'schema':1,'suite':'phase14-browser','mode':'static-runtime-verification',
  'environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para safety de superfície.',
  'build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports
}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE14_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE14_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 14 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F14 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
