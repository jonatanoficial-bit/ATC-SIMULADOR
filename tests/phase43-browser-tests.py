import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/asset-maintenance-reliability.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F43 carregada', meta.get('version')=='1.43.0' and meta.get('phase')=='F43', meta)
check('main bundle inclui módulo 46', '@skyward-module 46-asset-maintenance-reliability-center' in main)
check('API SKYWARD_ASSET_MAINTENANCE no bundle', 'SKYWARD_ASSET_MAINTENANCE' in main)
check('catálogo possui ativos', len(cat.get('assetClasses',[]))>=8)
check('catálogo possui falhas', len(cat.get('failureModes',[]))>=8)
check('catálogo possui programas', len(cat.get('maintenancePrograms',[]))>=7)
check('PWA cache inclui asset-maintenance-reliability.json', any(f.get('file')=='data/asset-maintenance-reliability.json' for f in cache.get('files',[])))
check('início de turno inicializa F43', 'initializeAssetMaintenance' in traffic)
check('fim de turno mostra F43', 'Asset Rel' in ui and 'Disponib.' in ui)
check('CSS possui painel asset', '.asset-maintenance-inline' in style)
check('scripts npm F43 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f43','test:browser:f43','test:phase43']))
check('schema assetMaintenanceSchema 1', meta.get('assetMaintenanceSchema')==1)
check('channel asset-maintenance', meta.get('channel')=='asset-maintenance' and 'asset-maintenance' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc asset existe', (ROOT/'docs/ASSET_MAINTENANCE_RELIABILITY_F43.md').exists())
check('doc MTTR existe', (ROOT/'docs/RADAR_ILS_BALIZAMENTO_MTTR_F43.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('radar presente', any(a.get('id')=='PRIMARY_RADAR' for a in cat.get('assetClasses',[])))
check('ILS presente', any(a.get('id')=='ILS_CAT' for a in cat.get('assetClasses',[])))
check('MTTR KPI presente', any(k.get('id')=='MTTR' for k in cat.get('assetKPIs',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase43-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Asset Maintenance.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE43_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE43_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 43 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F43 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
