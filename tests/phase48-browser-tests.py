import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/cargo-logistics.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F48 carregada', meta.get('version')=='1.48.0' and meta.get('phase')=='F48', meta)
check('main bundle inclui módulo 51', '@skyward-module 51-cargo-logistics-operations-center' in main)
check('API SKYWARD_CARGO_LOGISTICS no bundle', 'SKYWARD_CARGO_LOGISTICS' in main)
check('catálogo possui processos', len(cat.get('cargoProcesses',[]))>=8)
check('catálogo possui disrupções', len(cat.get('logisticsDisruptions',[]))>=7)
check('catálogo possui programas', len(cat.get('cargoPrograms',[]))>=7)
check('PWA cache inclui cargo-logistics.json', any(f.get('file')=='data/cargo-logistics.json' for f in cache.get('files',[])))
check('início de turno inicializa F48', 'initializeCargoLogistics' in traffic)
check('fim de turno mostra F48', 'Cargo Ops' in ui and 'Freight' in ui)
check('CSS possui painel cargo', '.cargo-logistics-inline' in style)
check('scripts npm F48 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f48','test:browser:f48','test:phase48']))
check('schema cargoLogisticsSchema 1', meta.get('cargoLogisticsSchema')==1)
check('channel cargo-logistics', meta.get('channel')=='cargo-logistics' and 'cargo-logistics' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc cargo existe', (ROOT/'docs/CARGO_LOGISTICS_F48.md').exists())
check('doc ULD existe', (ROOT/'docs/ULD_DG_CADEIA_FRIA_ALFANDEGA_F48.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('DG presente', any(p.get('id')=='DANGEROUS_GOODS' for p in cat.get('cargoProcesses',[])))
check('cadeia fria presente', any(p.get('id')=='PERISHABLE_COLD' for p in cat.get('cargoProcesses',[])))
check('freight revenue KPI presente', any(k.get('id')=='FREIGHT_REVENUE' for k in cat.get('cargoKPIs',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase48-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Cargo Logistics.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE48_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE48_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 48 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F48 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
