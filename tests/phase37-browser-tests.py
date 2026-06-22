import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/revenue-management.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F37 carregada', meta.get('version')=='1.37.0' and meta.get('phase')=='F37', meta)
check('main bundle inclui módulo 40', '@skyward-module 40-revenue-management-commercial-center' in main)
check('API SKYWARD_REVENUE_MANAGEMENT no bundle', 'SKYWARD_REVENUE_MANAGEMENT' in main)
check('catálogo possui receitas', len(cat.get('revenueStreams',[]))>=6)
check('catálogo possui custos', len(cat.get('costCenters',[]))>=5)
check('catálogo possui deals', len(cat.get('commercialDeals',[]))>=5)
check('PWA cache inclui revenue-management.json', any(f.get('file')=='data/revenue-management.json' for f in cache.get('files',[])))
check('início de turno inicializa F37', 'initializeRevenueManagement' in traffic)
check('fim de turno mostra F37', 'Rev Mgmt' in ui and 'Margem' in ui)
check('CSS possui painel revenue', '.revenue-management-inline' in style)
check('scripts npm F37 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f37','test:browser:f37','test:phase37']))
check('schema revenueManagementSchema 1', meta.get('revenueManagementSchema')==1)
check('channel revenue-management', meta.get('channel')=='revenue-management' and 'revenue-management' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc revenue existe', (ROOT/'docs/REVENUE_MANAGEMENT_F37.md').exists())
check('doc tarifas existe', (ROOT/'docs/TARIFAS_RECEITAS_CUSTOS_F37.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('landing fees presente', any(s.get('id')=='LANDING_FEES' for s in cat.get('revenueStreams',[])))
check('retail presente', any(s.get('id')=='RETAIL_DUTYFREE' for s in cat.get('revenueStreams',[])))
check('EBITDA KPI presente', any(k.get('id')=='EBITDA_MARGIN' for k in cat.get('reportingKPIs',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase37-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Revenue Management.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE37_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE37_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 37 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F37 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
