import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportMode=process.argv.includes('--report');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail});
let config,metadata,order,runtime;
for(const [name,rel,set] of [['config','config/release.json',v=>config=v],['metadata','release-metadata.json',v=>metadata=v],['order','src/runtime/module-order.json',v=>order=v],['runtime','runtime-manifest.json',v=>runtime=v]]){try{set(json(rel));check(`${name} legível`,true);}catch(e){check(`${name} legível`,false,e.message);}}
const source=read('src/runtime/11-mobile-runtime.js');const html=read('index.html');const css=read('style.css');const bundle=read('main.js');
if(config&&metadata){
 check('fase F08+ configurada',Number(config.version.split('.')[1])>=8&&Number(config.phase.slice(1))>=8,`${config.version}/${config.phase}`);
 check('UX schema válido',config.uxSchema===1&&metadata.uxSchema===1);
 check('build F08+ carimbada',/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(config.build),config.build);
 check('metadados F08 sincronizados',config.build===metadata.build&&config.phaseName===metadata.phaseName);
}
if(order&&runtime){check('17+ módulos oficiais',order.modules.length>=17,String(order.modules.length));check('módulo mobile na ordem oficial',order.modules.some(m=>m.file==='11-mobile-runtime.js'));check('arquitetura geração 8+',runtime.architectureGeneration>=8,runtime.architectureGeneration);}
check('fonte expõe API congelada',source.includes('window.SKYWARD_MOBILE_UX=Object.freeze'));
check('classificador de gestos existe',source.includes('function classifyMobileGesture'));
check('quatro modos responsivos existem',['mobile-landscape','mobile-portrait','tablet','desktop'].every(x=>source.includes(`'${x}'`)));
check('alvo de toque calculado',source.includes('function mobileTouchTargetPx'));
check('gesto da borda esquerda abre pedidos',source.includes("return 'open-requests'"));
check('gesto da borda direita abre ações',source.includes("return 'open-actions'"));
check('gesto vertical fecha painel',source.includes("return 'close-panel'"));
check('gestos horizontais alternam aeronaves',source.includes("'cycle-previous':'cycle-next'"));
check('toque longo abre ações',source.includes('mobileLongPressTimer=setTimeout')&&source.includes("setMobileTab('actions'"));
check('toque duplo abre ações',source.includes('now-mobileLastRadarTap<330'));
check('haptics respeita preferência',source.includes('mobilePrefs.haptics')&&source.includes('navigator.vibrate'));
check('preferências são persistidas',source.includes('safeStorageSet(MOBILE_PREFS_KEY'));
check('painéis mutuamente exclusivos',source.includes("const actionMode=tab==='actions'")&&source.includes("panel.classList.toggle('active'")&&source.includes("actions.classList.toggle('active'"));
check('turno inicia radar-first',read('src/runtime/05-profile-navigation.js').includes('mobileActiveTab=null;')&&read('src/runtime/05-profile-navigation.js').includes('closeMobilePanels();'));
check('badges de pedidos, tráfego e safety',html.includes('mobileRequestsBadge')&&html.includes('mobileTrafficBadge')&&html.includes('mobileSafetyBadge'));
check('dock possui cinco botões',([...html.matchAll(/class="mobile-nav/g)]).length===5,String([...html.matchAll(/class="mobile-nav/g)].length));
check('tabs ARIA controlam painéis',html.includes('aria-controls="mobilePanel"')&&html.includes('aria-controls="mobileActionSheet"'));
check('chip de aeronave selecionada presente',html.includes('mobileSelectedChip')&&html.includes('mobileSelectedChipData'));
check('guia de gestos presente',html.includes('mobileGestureCoach')&&html.includes('mobileGestureCoachClose'));
check('toast móvel presente',html.includes('id="mobileToast"'));
check('safe areas aplicadas',css.includes('env(safe-area-inset-top)')&&css.includes('env(safe-area-inset-bottom)'));
check('dock usa cinco colunas',css.includes('grid-template-columns:repeat(5,minmax(0,1fr))'));
check('painel lateral preserva radar',css.includes('max-width:41vw')&&css.includes('max-width:43vw'));
check('touch target CSS variável',css.includes('--mobile-touch-target')&&css.includes('min-height:var(--mobile-touch-target)'));
check('modo tablet tem breakpoint próprio',css.includes('@media (min-width:981px) and (max-width:1180px)'));
check('movimento reduzido respeitado',css.includes('@media (prefers-reduced-motion:reduce)'));
check('bundle contém UX F08',bundle.includes('@skyward-module 11-mobile-runtime')&&bundle.includes('SKYWARD_MOBILE_UX'));
// Execute canonical module in a minimal isolated VM and validate pure public functions.
try{
 const storage=new Map();
 const context={
   window:{SKYWARD_MODULES:[],addEventListener(){}}, BUILD_INFO:{uxSchema:1}, innerWidth:844,innerHeight:390,
   safeStorageGet:(k,d)=>storage.has(k)?storage.get(k):d,safeStorageSet:(k,v)=>{storage.set(k,v);return true;},
   document:{documentElement:{dataset:{},style:{setProperty(){}}},getElementById(){return null;},querySelectorAll(){return[];}},
   navigator:{vibrate(){return true;}},performance:{now:()=>1000},setTimeout:()=>1,clearTimeout(){},console,
   Math,Object,Number,String,Boolean,Array,JSON,Map,Set
 };
 vm.createContext(context);vm.runInContext(source,context,{filename:'11-mobile-runtime.js'});
 const api=context.window.SKYWARD_MOBILE_UX;
 check('API F08 executa em isolamento',Boolean(api));
 check('API está congelada',Object.isFrozen(api));
 check('schema público correto',api.uxSchema===1);
 check('844×390 classificado como mobile horizontal',api.viewportMode(844,390)==='mobile-landscape');
 check('390×844 classificado como mobile retrato',api.viewportMode(390,844)==='mobile-portrait');
 check('1024×768 classificado como tablet',api.viewportMode(1024,768)==='tablet');
 check('1440×900 classificado como desktop',api.viewportMode(1440,900)==='desktop');
 check('alvo móvel horizontal >=46px',api.touchTargetPx('mobile-landscape')>=46,String(api.touchTargetPx('mobile-landscape')));
 check('alvo móvel retrato >=48px',api.touchTargetPx('mobile-portrait')>=48,String(api.touchTargetPx('mobile-portrait')));
 check('alvo tablet >=44px',api.touchTargetPx('tablet')>=44,String(api.touchTargetPx('tablet')));
 check('swipe esquerdo reconhecido',api.classifyGesture({x:2,y:170},{x:100,y:170},844,390)==='open-requests');
 check('swipe direito reconhecido',api.classifyGesture({x:842,y:170},{x:730,y:170},844,390)==='open-actions');
 check('swipe para baixo reconhecido',api.classifyGesture({x:350,y:80},{x:350,y:170},844,390)==='close-panel');
 check('swipe horizontal próximo reconhecido',api.classifyGesture({x:400,y:180},{x:300,y:180},844,390)==='cycle-next');
 check('movimento curto vira toque',api.classifyGesture({x:100,y:100},{x:110,y:105},844,390)==='tap');
}catch(e){check('API F08 executa em isolamento',false,e.stack||e.message);}
const failed=checks.filter(c=>!c.ok);const build=metadata?.build||config?.build||'unknown';
const report={schema:1,suite:'phase8-unit',build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){const audit=path.join(root,'audit');fs.mkdirSync(audit,{recursive:true});fs.writeFileSync(path.join(audit,'PHASE8_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(audit,'PHASE8_UNIT_TESTS_SUMMARY.md'),['# Fase 08 — Testes unitários de UX móvel','',`- Resultado: **${report.passed}/${report.total} aprovados**`,`- Build: \`${build}\``,'','## Verificações',...checks.map(c=>`- [${c.ok?'x':' '}] ${c.name}`)].join('\n')+'\n');}
console.log(`Skyward Control F08 unit tests: ${report.passed}/${report.total} aprovados`);for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);if(failed.length)process.exit(1);
