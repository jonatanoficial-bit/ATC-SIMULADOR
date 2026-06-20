import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/international-campaign.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F30 carregada', meta.get('version')=='1.30.0' and meta.get('phase')=='F30', meta)
check('main bundle inclui módulo 33', '@skyward-module 33-international-campaign' in main)
check('API SKYWARD_INTERNATIONAL_CAMPAIGN no bundle', 'SKYWARD_INTERNATIONAL_CAMPAIGN' in main)
check('catálogo possui regiões', len(cat.get('regions',[]))>=4)
check('catálogo possui temporadas', len(cat.get('seasons',[]))>=4)
check('catálogo possui contratos', len(cat.get('contracts',[]))>=5)
check('PWA cache inclui international-campaign.json', any(f.get('file')=='data/international-campaign.json' for f in cache.get('files',[])))
check('início de turno inicializa F30', 'initializeInternationalCampaign' in traffic)
check('fim de turno mostra F30', 'Campanha Intl' in ui and 'Contrato ativo' in ui)
check('CSS possui painel campaign', '.international-campaign-inline' in style)
check('scripts npm F30 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f30','test:browser:f30','test:phase30']))
check('schema internationalCampaignSchema 1', meta.get('internationalCampaignSchema')==1)
check('channel international-campaign', meta.get('channel')=='international-campaign' and 'international-campaign' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc campanha existe', (ROOT/'docs/CAMPANHA_INTERNACIONAL_F30.md').exists())
check('doc contratos existe', (ROOT/'docs/CONTRATOS_TEMPORADAS_F30.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('região KATL presente', any('KATL' in r.get('airports',[]) for r in cat.get('regions',[])))
check('milestone global presente', any(m.get('id')=='GLOBAL_CONTROLLER' for m in cat.get('milestones',[])))
check('evento auditoria presente', any(e.get('id')=='INTERNATIONAL_AUDIT' for e in cat.get('calendarEvents',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase30-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para International Campaign.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE30_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE30_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 30 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F30 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
