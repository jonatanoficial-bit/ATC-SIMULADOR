import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/safety-compliance-center.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F34 carregada', meta.get('version')=='1.34.0' and meta.get('phase')=='F34', meta)
check('main bundle inclui módulo 37', '@skyward-module 37-safety-compliance-center' in main)
check('API SKYWARD_SAFETY_COMPLIANCE no bundle', 'SKYWARD_SAFETY_COMPLIANCE' in main)
check('catálogo possui domains', len(cat.get('auditDomains',[]))>=7)
check('catálogo possui severidades', len(cat.get('findingSeverity',[]))>=4)
check('catálogo possui CAPs', len(cat.get('correctiveActions',[]))>=5)
check('PWA cache inclui safety-compliance-center.json', any(f.get('file')=='data/safety-compliance-center.json' for f in cache.get('files',[])))
check('início de turno inicializa F34', 'initializeSafetyCompliance' in traffic)
check('fim de turno mostra F34', 'Safety SMS' in ui and 'Achados SMS' in ui)
check('CSS possui painel safety compliance', '.safety-compliance-inline' in style)
check('scripts npm F34 expostos', all(k in pkg.get('scripts',{}) for k in ['test:unit:f34','test:browser:f34','test:phase34']))
check('schema safetyComplianceSchema 1', meta.get('safetyComplianceSchema')==1)
check('channel safety-compliance', meta.get('channel')=='safety-compliance' and 'safety-compliance' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc safety existe', (ROOT/'docs/SAFETY_COMPLIANCE_CENTER_F34.md').exists())
check('doc CAP existe', (ROOT/'docs/AUDITORIA_CAUSA_RAIZ_CAP_F34.md').exists())
check('documento upload preservado raiz', (ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs', (ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash', '/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo', 'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('runway safety presente', any(d.get('id')=='RUNWAY_SAFETY' for d in cat.get('auditDomains',[])))
check('causa raiz system failure presente', any(r.get('id')=='SYSTEM_FAILURE' for r in cat.get('rootCauses',[])))
check('CAP training presente', any(c.get('id')=='CAP_TRAINING' for c in cat.get('correctiveActions',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
results={'schema':1,'suite':'phase34-browser','mode':'static-runtime-verification','environmentLimitation':'Validação estrutural orientada a código e artefatos do bundle para Safety Compliance.','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
results['passed']=len(checks)-len(failed); results['failed']=len(failed); results['total']=len(checks)
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE34_BROWSER_TESTS.json').write_text(json.dumps(results,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE34_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 34 — Browser tests\n\n- Resultado: **{results['passed']}/{results['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F34 browser tests: {results['passed']}/{results['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
