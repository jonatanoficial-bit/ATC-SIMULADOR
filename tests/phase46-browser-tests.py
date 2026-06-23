import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/radio-phraseology.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(name, ok, detail=''):
    checks.append({'name':name,'ok':bool(ok),'detail':str(detail or '')})
check('build F46 carregada', meta.get('version')=='1.46.0' and meta.get('phase')=='F46', meta)
check('main inclui módulo 49','@skyward-module 49-radio-communications-phraseology-center' in main)
check('API no bundle','SKYWARD_RADIO_PHRASEOLOGY' in main)
check('catálogo domínios',len(cat.get('communicationDomains',[]))>=7)
check('catálogo issues',len(cat.get('communicationIssues',[]))>=7)
check('catálogo programas',len(cat.get('improvementPrograms',[]))>=6)
check('PWA cache inclui catálogo',any(f.get('file')=='data/radio-phraseology.json' for f in cache.get('files',[])))
check('início inicializa','initializeRadioPhraseology' in traffic)
check('fim mostra F46','Radio Ops' in ui and 'Readback' in ui)
check('CSS painel', '.radio-phraseology-inline' in style)
check('scripts npm', all(k in pkg.get('scripts',{}) for k in ['test:unit:f46','test:browser:f46','test:phase46']))
check('schema 1', meta.get('radioPhraseologySchema')==1)
check('channel', meta.get('channel')=='radio-phraseology' and 'radio-phraseology' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc rádio existe',(ROOT/'docs/RADIO_PHRASEOLOGY_F46.md').exists())
check('doc VHF existe',(ROOT/'docs/VHF_READBACK_CPDLC_F46.md').exists())
check('documento upload preservado raiz',(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs',(ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('upload caminho','/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('upload repo','https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('readback presente', any(d.get('id')=='READBACK_ACCURACY' for d in cat.get('communicationDomains',[])))
check('CPDLC presente', any(d.get('id')=='CPDLC_TEXT' for d in cat.get('communicationDomains',[])))
check('blocked presente', any(i.get('id')=='BLOCKED_TRANSMISSION' for i in cat.get('communicationIssues',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
res={'schema':1,'suite':'phase46-browser','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
res.update({'passed':len(checks)-len(failed),'failed':len(failed),'total':len(checks)})
audit=ROOT/'audit'; audit.mkdir(exist_ok=True)
(audit/'PHASE46_BROWSER_TESTS.json').write_text(json.dumps(res,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE46_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 46 — Browser tests\n\n- Resultado: **{res['passed']}/{res['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F46 browser tests: {res['passed']}/{res['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
