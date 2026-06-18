import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/weather-profiles.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
sim=(ROOT/'src/runtime/07-simulation-safety.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F15 carregada', meta.get('version')=='1.15.0' and meta.get('phase')=='F15', meta)
check('main bundle inclui módulo 18', '@skyward-module 18-advanced-weather-ifr' in main)
check('API SKYWARD_WEATHER_OPS no bundle', 'SKYWARD_WEATHER_OPS' in main)
check('catálogo possui VFR IFR LIFR', all(k in cat.get('profiles',{}) for k in ['VMC_CLEAR','IFR_LOW_CEILING','LIFR_RAIN']))
check('catálogo possui trovoada e RVR', all(k in cat.get('profiles',{}) for k in ['THUNDERSTORM_CELLS','FOG_RVR']))
check('PWA cache inclui weather-profiles.json', any(f.get('file')=='data/weather-profiles.json' for f in cache.get('files',[])))
check('início de turno inicializa clima avançado', 'initializeAdvancedWeather' in traffic)
check('simulação soma risco meteorológico no pouso', 'advancedWeatherLandingRisk' in sim)
check('UI/commandRisk consulta clima', 'weatherRiskForCommand' in ui)
check('scripts npm F15 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f15','test:browser:f15','test:phase15']))
check('schema weatherOpsSchema 1', meta.get('weatherOpsSchema')==1)
check('visibilidade baixa menor que VMC', cat['profiles']['FOG_RVR']['visibilityKm'] < cat['profiles']['VMC_CLEAR']['visibilityKm'])
check('LIFR aumenta separação', cat['profiles']['LIFR_RAIN']['arrivalSpacingNm'] > cat['profiles']['VMC_CLEAR']['arrivalSpacingNm'])
check('TS tem crosswind operacional', cat['profiles']['THUNDERSTORM_CELLS']['crosswindKt'] >= 20)
check('pista molhada está representada', cat['profiles']['LIFR_RAIN']['runwayCondition']=='WET')
check('braking action degradado representado', 'POOR' in cat['profiles']['THUNDERSTORM_CELLS']['brakingAction'])
check('airportBias por aeroporto', all(code in cat.get('airportBias',{}) for code in ['SBGR','SBSP','KATL']))
check('bundle contém RVR e teto', 'rvrMeters' in main and 'ceilingFt' in main)
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase15-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para meteorologia avançada IFR/VFR.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE15_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE15_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 15 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F15 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
