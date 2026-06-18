import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportMode=process.argv.includes('--report');
const read=r=>fs.readFileSync(path.join(root,r),'utf8');const json=r=>JSON.parse(read(r));
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail});
let config,metadata,order,runtime;
for(const [label,rel,set] of [['config','config/release.json',v=>config=v],['metadata','release-metadata.json',v=>metadata=v],['order','src/runtime/module-order.json',v=>order=v],['runtime','runtime-manifest.json',v=>runtime=v]]){try{set(json(rel));check(`${label} legível`,true);}catch(e){check(`${label} legível`,false,e.message);}}
const source=read('src/runtime/12-desktop-workspace.js'),html=read('index.html'),css=read('style.css'),bundle=read('main.js');
if(config&&metadata){check('fase F09+ configurada',Number(config.phase?.slice?.(1)||0)>=9,`${config.version}/${config.phase}`);check('desktop schema 1',config.desktopSchema===1&&metadata.desktopSchema===1);check('build F09+ carimbada',/^SC-1\.(?:9|1[0-9])\.0-F(?:09|1[0-9])-\d{8}-\d{4}$/.test(config.build),config.build);check('metadados sincronizados',config.build===metadata.build&&config.phaseName===metadata.phaseName);}
if(order&&runtime){check('18 módulos oficiais',order.modules.length>=18,String(order.modules.length));check('módulo desktop oficial',order.modules.some(m=>m.file==='12-desktop-workspace.js'));check('arquitetura geração 9+',runtime.architectureGeneration>=9,String(runtime.architectureGeneration));check('manifesto consistente',runtime.moduleCount===order.modules.length);}
check('HUD desktop presente',html.includes('desktopWorkspaceHud')&&html.includes('desktopWorkspaceStatus'));
check('três modos de workspace presentes',['balanced','radar','analysis'].every(x=>html.includes(`data-workspace-action="${x}"`)));
check('controles de painel presentes',['traffic','ops','bottom'].every(x=>html.includes(`data-workspace-action="${x}"`)));
check('ajustes de largura presentes',html.includes('narrow-left')&&html.includes('wide-left')&&html.includes('narrow-right')&&html.includes('wide-right'));
check('ajuda de atalhos presente',html.includes('desktopShortcutSheet')&&html.includes('desktop-shortcut-grid'));
check('CSS usa variáveis de workspace',css.includes('--workspace-left-width')&&css.includes('--workspace-right-width')&&css.includes('--workspace-bottom-height'));
check('modo radar remove painéis',css.includes('workspace-mode-radar .traffic-stack')&&css.includes('workspace-mode-radar .ops-panel')&&css.includes('workspace-mode-radar .bottom-dock'));
check('modo análise amplia painéis',css.includes('workspace-mode-analysis .atc-scene'));
check('tablet possui HUD touch-safe',css.includes('@media (min-width:981px) and (max-width:1180px)')&&css.includes('min-height:36px'));
check('mobile oculta workspace desktop',css.includes('@media (max-width:980px)')&&css.includes('.desktop-workspace-hud'));
check('API desktop congelada',source.includes('window.SKYWARD_DESKTOP_WORKSPACE=Object.freeze'));
check('preferências persistentes',source.includes('skywardDesktopWorkspace_v')&&source.includes('safeStorageSet'));
check('atalhos ignoram campos de edição',source.includes('desktopTypingTarget')&&source.includes('input,select,textarea'));
check('bundle sincronizado',bundle.includes('SKYWARD_DESKTOP_WORKSPACE')&&bundle.includes('@skyward-module 12-desktop-workspace'));
const listeners={};const store=new Map();const context={console,Object,setTimeout,clearTimeout,setInterval:()=>0,clearInterval:()=>{},innerWidth:1440,window:{SKYWARD_MODULES:[],addEventListener:(n,f)=>listeners[n]=f},document:{body:{classList:{toggle:()=>{},contains:()=>false}},documentElement:{dataset:{}},querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}},safeStorageGet:(k,f)=>f,safeStorageSet:(k,v)=>{store.set(k,v);return true;},aircraft:[],requests:[],selected:null,requestPriorityScore:()=>0,renderSelected:()=>{},renderRequests:()=>{},updateFrequencyPanel:()=>{},renderActionGrid:()=>{},resize:()=>{},selectNextRequest:()=>{},setTrafficTab:()=>{},setDock:()=>{}};context.window.window=context.window;vm.createContext(context);
try{vm.runInContext(source,context);const api=context.window.SKYWARD_DESKTOP_WORKSPACE;check('API executa em isolamento',!!api);check('viewport desktop',api.viewportMode(1440)==='desktop');check('viewport tablet',api.viewportMode(1024)==='tablet');check('viewport compacto',api.viewportMode(844)==='compact');check('clamp inferior',api.clamp(10,20,40)===20);check('clamp superior',api.clamp(80,20,40)===40);check('atalho N',api.shortcutAction('KeyN',false)==='next-request');check('atalho Shift+A',api.shortcutAction('KeyA',true)==='analysis');check('atalho 5 abre safety',api.shortcutAction('Digit5',false)==='dock-safety');check('preferências saneadas',api.getPreferences().mode==='balanced'&&api.getPreferences().leftWidth>=175);}catch(e){check('API executa em isolamento',false,e.stack||e.message);}
const failed=checks.filter(c=>!c.ok);const report={schema:1,suite:'phase9-unit',build:metadata?.build||config?.build||'UNKNOWN',passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){fs.mkdirSync(path.join(root,'audit'),{recursive:true});fs.writeFileSync(path.join(root,'audit/PHASE9_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(root,'audit/PHASE9_UNIT_TESTS_SUMMARY.md'),`# Fase 09 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);}
console.log(`Skyward Control F09 unit tests: ${report.passed}/${report.total} aprovados`);for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);if(failed.length)process.exit(1);
