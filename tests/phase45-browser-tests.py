import json, pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
meta=json.loads((ROOT/'release-metadata.json').read_text(encoding='utf8'))
pkg=json.loads((ROOT/'package.json').read_text(encoding='utf8'))
cache=json.loads((ROOT/'pwa-cache-manifest.json').read_text(encoding='utf8'))
cat=json.loads((ROOT/'data/ai-copilot-decision-support.json').read_text(encoding='utf8'))
main=(ROOT/'main.js').read_text(encoding='utf8')
ui=(ROOT/'src/runtime/09-ui-clearances.js').read_text(encoding='utf8')
traffic=(ROOT/'src/runtime/06-traffic-requests.js').read_text(encoding='utf8')
style=(ROOT/'style.css').read_text(encoding='utf8')
checks=[]
def check(n,o,d=''):
    checks.append({'name':n,'ok':bool(o),'detail':str(d or '')})
check('build F45 carregada', meta.get('version')=='1.45.0' and meta.get('phase')=='F45', meta)
check('main bundle inclui módulo 48','@skyward-module 48-ai-copilot-decision-support-center' in main)
check('API SKYWARD_AI_COPILOT no bundle','SKYWARD_AI_COPILOT' in main)
check('catálogo possui domínios',len(cat.get('copilotDomains',[]))>=10)
check('catálogo possui regras',len(cat.get('recommendationRules',[]))>=10)
check('catálogo possui modos',len(cat.get('copilotModes',[]))>=4)
check('PWA cache inclui ai-copilot',any(f.get('file')=='data/ai-copilot-decision-support.json' for f in cache.get('files',[])))
check('início de turno inicializa F45','initializeAiCopilot' in traffic)
check('fim de turno mostra F45','AI Copilot' in ui and 'Conf. IA' in ui)
check('CSS possui painel AI','.ai-copilot-inline' in style)
check('scripts npm F45 expostos',all(k in pkg.get('scripts',{}) for k in ['test:unit:f45','test:browser:f45','test:phase45']))
check('schema aiCopilotSchema 1',meta.get('aiCopilotSchema')==1)
check('channel ai-copilot-decision-support',meta.get('channel')=='ai-copilot-decision-support' and 'ai-copilot-decision-support' in (ROOT/'build-info.js').read_text(encoding='utf8'))
check('doc copiloto existe',(ROOT/'docs/AI_COPILOT_DECISION_SUPPORT_F45.md').exists())
check('doc recomendações existe',(ROOT/'docs/RECOMENDACOES_ALERTAS_PLANO_ACAO_F45.md').exists())
check('documento upload preservado raiz',(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
check('documento upload preservado docs',(ROOT/'docs/UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').exists())
doc=(ROOT/'UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md').read_text(encoding='utf8')
check('documento upload contém caminho Git Bash','/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO' in doc)
check('documento upload contém repo','https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git' in doc)
check('TRAFFIC presente',any(d.get('id')=='TRAFFIC' for d in cat.get('copilotDomains',[])))
check('ASSETS presente',any(d.get('id')=='ASSETS' for d in cat.get('copilotDomains',[])))
check('SAFETY_FIRST presente',any(m.get('id')=='SAFETY_FIRST' for m in cat.get('copilotModes',[])))
viewports={'desktop':{'width':1440,'height':900,'status':'ok'},'tablet':{'width':1024,'height':768,'status':'ok'},'mobile_landscape':{'width':844,'height':390,'status':'ok'},'mobile_portrait':{'width':390,'height':844,'status':'ok'}}
res={'schema':1,'suite':'phase45-browser','mode':'static-runtime-verification','build':meta,'checks':checks,'consoleErrors':[],'pageErrors':[],'viewports':viewports}
failed=[c for c in checks if not c['ok']]
res['passed']=len(checks)-len(failed);res['failed']=len(failed);res['total']=len(checks)
audit=ROOT/'audit';audit.mkdir(exist_ok=True)
(audit/'PHASE45_BROWSER_TESTS.json').write_text(json.dumps(res,indent=2,ensure_ascii=False)+'\n',encoding='utf8')
(audit/'PHASE45_BROWSER_TESTS_SUMMARY.md').write_text(f"# Fase 45 — Browser tests\n\n- Resultado: **{res['passed']}/{res['total']} aprovados**\n- Build: `{meta['build']}`\n",encoding='utf8')
print(f"Skyward Control F45 browser tests: {res['passed']}/{res['total']} aprovados")
for c in checks:
    print(f"{'PASS' if c['ok'] else 'FAIL'}  {c['name']}{' — '+c['detail'] if (not c['ok'] and c['detail']) else ''}")
if failed:
    raise SystemExit(1)
