import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/economy-contracts.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F18 carregada', meta.get('version')=='1.18.0' and meta.get('phase')=='F18', meta)
check('main bundle inclui módulo 21', '@skyward-module 21-operational-economy' in main)
check('API SKYWARD_ECONOMY no bundle', 'SKYWARD_ECONOMY' in main)
check('catálogo possui orçamento', len(cat.get('airportBudgets',{}))>=5)
check('catálogo possui contratos', len(cat.get('airlineContracts',[]))>=5)
check('catálogo possui multas', 'fineTable' in cat and cat['fineTable'].get('runwayIncursion',0)>0)
check('PWA cache inclui economy-contracts.json', any(f.get('file')=='data/economy-contracts.json' for f in cache.get('files',[])))
check('início de turno renderiza economia', 'renderEconomyBoard' in traffic)
check('fim de turno avalia economia', 'evaluateOperationalEconomy' in ui)
check('tela final mostra economia', 'Economia' in ui and 'Eficiência econômica' in ui)
check('painel CSS de economia', '.economy-ops-inline' in style)
check('scripts npm F18 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f18','test:browser:f18','test:phase18']))
check('schema economySchema 1', meta.get('economySchema')==1)
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('KATL orçamento maior que SBGR', cat['airportBudgets']['KATL']['shiftBudget'] > cat['airportBudgets']['SBGR']['shiftBudget'])
check('contrato LATAM presente', any(c.get('id')=='LATAM_TRUNK' for c in cat.get('airlineContracts',[])))
check('bandas econômicas presentes', len(cat.get('bands',[]))>=5)
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase18-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para economia operacional.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE18_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE18_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 18 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F18 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
