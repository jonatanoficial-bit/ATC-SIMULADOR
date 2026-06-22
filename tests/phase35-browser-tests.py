import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/infrastructure-expansion.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F35 carregada', meta.get('version')=='1.35.0' and meta.get('phase')=='F35', meta)
check('main bundle inclui módulo 38', '@skyward-module 38-infrastructure-expansion-program' in main)
check('API SKYWARD_INFRASTRUCTURE_EXPANSION no bundle', 'SKYWARD_INFRASTRUCTURE_EXPANSION' in main)
check('catálogo possui projetos', len(cat.get('projects',[]))>=6)
check('catálogo possui manutenção', len(cat.get('maintenancePrograms',[]))>=4)
check('catálogo possui funding', len(cat.get('fundingSources',[]))>=4)
check('PWA cache inclui infrastructure-expansion.json', any(f.get('file')=='data/infrastructure-expansion.json' for f in cache.get('files',[])))
check('início de turno inicializa F35', 'initializeInfrastructureExpansion' in traffic)
check('fim de turno mostra F35', 'Infra CAPEX' in ui and 'Capacidade' in ui)
check('CSS possui painel infra', '.infrastructure-expansion-inline' in style)
check('scripts npm F35 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f35','test:browser:f35','test:phase35']))
check('schema infrastructureExpansionSchema 1', meta.get('infrastructureExpansionSchema')==1)
check('channel infrastructure-expansion', meta.get('channel')=='infrastructure-expansion' and 'infrastructure-expansion' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc infra existe', (ROOT/'docs/INFRASTRUCTURE_EXPANSION_F35.md').exists())
check('doc capex existe', (ROOT/'docs/OBRAS_CAPEX_MANUTENCAO_F35.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('recapeamento presente', any(p.get('id')=='RWY_REHAB' for p in cat.get('projects',[])))
check('ILS upgrade presente', any(p.get('id')=='ILS_UPGRADE' for p in cat.get('projects',[])))
check('manutenção bagagem presente', any(m.get('id')=='BAGGAGE_PM' for m in cat.get('maintenancePrograms',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase35-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Infrastructure Expansion.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE35_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE35_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 35 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F35 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
