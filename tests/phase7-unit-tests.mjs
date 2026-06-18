import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportMode=process.argv.includes('--report');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex');
const checks=[];const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});
let config,manifest,cacheManifest,order,runtimeManifest;
try{config=json('config/release.json');check('config legível',true);}catch(e){check('config legível',false,e.message);}
try{manifest=json('manifest.webmanifest');check('manifest PWA legível',true);}catch(e){check('manifest PWA legível',false,e.message);}
try{cacheManifest=json('pwa-cache-manifest.json');check('manifesto de cache legível',true);}catch(e){check('manifesto de cache legível',false,e.message);}
try{order=json('src/runtime/module-order.json');runtimeManifest=json('runtime-manifest.json');check('arquitetura modular legível',true);}catch(e){check('arquitetura modular legível',false,e.message);}
const sw=read('service-worker.js');const html=read('index.html');const js=read('main.js');
if(config){
  check('fase F07+ configurada',Number(config.phase.slice(1))>=7,`${config.version}/${config.phase}`);
  check('schemas PWA válidos',config.pwaSchema===1&&config.cacheSchema===1);
  check('build carimbada',/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(config.build),config.build);
}
if(manifest){
  check('manifesto inicia no escopo relativo',manifest.id==='./'&&manifest.start_url==='./'&&manifest.scope==='./');
  check('modo standalone e orientação landscape',manifest.display==='standalone'&&manifest.orientation==='landscape');
  check('display override contém fullscreen',Array.isArray(manifest.display_override)&&manifest.display_override.includes('fullscreen'));
  check('tema escuro configurado',manifest.theme_color==='#05080d'&&manifest.background_color==='#03060a');
  check('três ícones PWA declarados',Array.isArray(manifest.icons)&&manifest.icons.length===3);
  check('ícone maskable declarado',manifest.icons.some(icon=>icon.purpose==='maskable'&&icon.sizes==='512x512'));
}
const pngSize=rel=>{const b=fs.readFileSync(path.join(root,rel));return {w:b.readUInt32BE(16),h:b.readUInt32BE(20),sig:b.subarray(1,4).toString()==='PNG'};};
for(const [rel,size] of [['assets/icons/icon-180.png',180],['assets/icons/icon-192.png',192],['assets/icons/icon-512.png',512],['assets/icons/icon-maskable-512.png',512]]){
  const data=pngSize(rel);check(`ícone ${size}px íntegro: ${path.basename(rel)}`,data.sig&&data.w===size&&data.h===size,JSON.stringify(data));
}
if(cacheManifest&&config){
  check('cache pertence à build atual',cacheManifest.build===config.build,`${cacheManifest.build} != ${config.build}`);
  check('nome de cache versionado',cacheManifest.cacheName===`skyward-control-${config.cacheSchema}-${config.build.toLowerCase()}`,cacheManifest.cacheName);
  check('estratégia de atualização controlada',String(cacheManifest.strategy).includes('controlled-update'));
  check('15+ recursos precacheados',cacheManifest.files.length>=15,String(cacheManifest.files.length));
  const urls=cacheManifest.files.map(item=>item.url);const files=cacheManifest.files.map(item=>item.file);
  check('lista de cache sem duplicações',new Set(urls).size===urls.length&&new Set(files).size===files.length);
  check('lista de cache sem caminhos inseguros',files.every(file=>!file.includes('..')&&!path.isAbsolute(file)));
  for(const item of cacheManifest.files){
    check(`cache hash válido: ${item.file}`,fs.existsSync(path.join(root,item.file))&&hash(item.file)===item.sha256,`${hash(item.file)} != ${item.sha256}`);
    check(`cache tamanho válido: ${item.file}`,fs.statSync(path.join(root,item.file)).size===item.bytes);
  }
  check('app shell completo',['index.html','style.css','build-info.js','main.js','manifest.webmanifest','data/airports.json','data/aircraft.json'].every(file=>files.includes(file)));
}
check('service worker contém build atual',config&&sw.includes(config.build));
check('service worker não força atualização de build ativa',sw.includes("if(!self.registration.active)await self.skipWaiting()")&&sw.includes("data.type==='SKIP_WAITING'"));
check('service worker remove apenas caches Skyward antigos',sw.includes("name.startsWith(CACHE_PREFIX)")&&sw.includes("name!==PWA_META.cacheName"));
check('navegação tem fallback offline',sw.includes("NAVIGATION_FALLBACK='./index.html'")&&sw.includes('navigationResponse'));
check('recursos usam cache-first',sw.includes('const cached=await cache.match')&&sw.includes('if(cached)return cached'));
check('worker informa versão ao app',sw.includes("data.type==='GET_VERSION'")&&sw.includes("type:'PWA_VERSION'"));
check('HTML liga manifesto e Apple icon',html.includes('rel="manifest"')&&html.includes('apple-touch-icon'));
check('HTML possui painel PWA e banner offline',html.includes('id="pwaPanel"')&&html.includes('id="networkBanner"'));
check('runtime expõe API PWA congelada',js.includes('window.SKYWARD_PWA=Object.freeze')&&js.includes('applyPwaUpdate'));
check('atualização salva progresso antes de ativar',js.includes("persistProfile('pwa-update')")&&js.includes("saveGoodState('pwa-update')")&&js.indexOf("saveGoodState('pwa-update')")<js.indexOf("worker.postMessage({type:'SKIP_WAITING'"));
check('ciclo de vida protege progresso',js.includes("protectPwaProgress('visibility-hidden')")&&js.includes("protectPwaProgress('pagehide')"));
check('registro usa updateViaCache none',js.includes("updateViaCache:'none'"));
check('fullscreen profissional e landscape integrados',js.includes('toggleProfessionalFullscreen')&&js.includes("screen.orientation.lock('landscape')"));
if(order&&runtimeManifest){
  const modules=order.modules||[];check('módulo PWA pertence à ordem oficial',modules.some(item=>item.file==='01-pwa-runtime.js'));
  check('arquitetura geração 7+',runtimeManifest.architectureGeneration>=7&&runtimeManifest.moduleCount===modules.length);
  check('17+ módulos oficiais',modules.length>=17,String(modules.length));
}
const failed=checks.filter(item=>!item.ok);
const metadata=json('release-metadata.json');
const report={schema:1,suite:'phase7-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){const audit=path.join(root,'audit');fs.mkdirSync(audit,{recursive:true});fs.writeFileSync(path.join(audit,'PHASE7_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(audit,'PHASE7_UNIT_TESTS_SUMMARY.md'),['# Fase 07 — Testes unitários PWA','',`- Resultado: **${report.passed}/${report.total} aprovados**`,`- Build: \`${report.build}\``,'','## Verificações',...checks.map(item=>`- [${item.ok?'x':' '}] ${item.name}`)].join('\n')+'\n');}
console.log(`Skyward Control F07 unit tests: ${report.passed}/${report.total} aprovados`);
for(const item of checks)console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length)process.exit(1);
