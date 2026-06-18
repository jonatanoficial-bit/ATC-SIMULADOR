import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const prepackage = process.argv.includes('--prepackage');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const json = rel => JSON.parse(read(rel));
const sha = text => crypto.createHash('sha256').update(text).digest('hex');
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});

let metadata, order, runtimeManifest, bundle;
try { metadata=json('release-metadata.json'); check('metadados de release válidos',true); } catch(e){ check('metadados de release válidos',false,e.message); }
try { order=json('src/runtime/module-order.json'); check('ordem modular válida',true); } catch(e){ check('ordem modular válida',false,e.message); }
try { runtimeManifest=json('runtime-manifest.json'); check('manifesto runtime válido',true); } catch(e){ check('manifesto runtime válido',false,e.message); }
try { bundle=read('main.js'); check('bundle runtime legível',true); } catch(e){ check('bundle runtime legível',false,e.message); }

if(metadata){
  const semver=metadata.version.split('.').map(Number); const phaseNumber=Number(String(metadata.phase).replace('F',''));
  check('baseline F03 preservada',(semver[0]>1 || (semver[0]===1 && semver[1]>=3)) && phaseNumber>=3);
  const escapedVersion=metadata.version.replace(/\./g,'\\.');
  check('build F03+ oficial',new RegExp(`^SC-${escapedVersion}-${metadata.phase}-\\d{8}-\\d{4}$`).test(metadata.build));
  check('schema de save preservado',metadata.saveSchema>=2);
}
if(order){
  const modules=order.modules||[];
  check('mínimo de módulos arquiteturais',modules.length>=12);
  check('nomes de módulos únicos',new Set(modules.map(x=>x.name)).size===modules.length);
  check('arquivos de módulos únicos',new Set(modules.map(x=>x.file)).size===modules.length);
  check('todos os módulos existem',modules.every(x=>fs.existsSync(path.join(root,'src/runtime',x.file))));
  check('módulos possuem responsabilidade descrita',modules.every(x=>String(x.description||'').length>=8));
  const lineCounts=modules.map(x=>read(`src/runtime/${x.file}`).split('\n').length-1);
  check('nenhum módulo voltou a ser monolítico',Math.max(...lineCounts)<=350,`maior módulo: ${Math.max(...lineCounts)} linhas`);
  check('ordem inicia pelo registro runtime',modules[0]?.file==='00-runtime-registry.js');
  if(bundle){
    const positions=modules.map(x=>bundle.indexOf(`(${x.file})`));
    check('bundle preserva ordem declarada',positions.every((v,i)=>v>=0 && (i===0 || v>positions[i-1])));
  }
}
if(runtimeManifest && order && bundle){
  check('manifesto preserva arquitetura geração 3+',runtimeManifest.architectureGeneration>=3);
  check('contagem do manifesto consistente',runtimeManifest.moduleCount===order.modules.length && runtimeManifest.modules.length===order.modules.length);
  check('hash do bundle consistente',runtimeManifest.bundle?.sha256===sha(bundle));
  check('hashes dos módulos consistentes',runtimeManifest.modules.every(item=>sha(read(`src/runtime/${item.file}`).replace(/\r\n/g,'\n').trimEnd()+'\n')===item.sha256));
  check('bundle marcado como gerado',bundle.includes('Do not edit main.js directly'));
  check('registro arquitetural exposto',bundle.includes('window.SKYWARD_ARCHITECTURE') && bundle.includes("sourceRoot: 'src/runtime'"));
  check('lista de módulos selada',bundle.includes('Object.freeze(window.SKYWARD_MODULES)') && bundle.includes('Object.freeze(window.SKYWARD_ARCHITECTURE)'));
  check('autoteste valida modularização',bundle.includes("check('modular runtime registry'") && bundle.includes("check('modular runtime sealed'"));
}

const buildCheck=spawnSync(process.execPath,['tools/build-runtime.mjs','--check'],{cwd:root,encoding:'utf8'});
check('geração runtime determinística',buildCheck.status===0,(buildCheck.stderr||buildCheck.stdout).trim());
const packageJson=json('package.json');
check('scripts modulares disponíveis',['build:runtime','check:runtime','test:phase3'].every(k=>packageJson.scripts?.[k]));
const release=read('tools/release.mjs');
check('pipeline recompila runtime antes de auditar',release.indexOf("tools/build-runtime.mjs")>=0 && release.indexOf("tools/build-runtime.mjs")<release.indexOf("tools/validate-source.mjs"));
check('pipeline executa auditoria F03',release.includes('tests/phase3-audit.mjs'));
check('sem dependência externa de bundler',!packageJson.dependencies && !packageJson.devDependencies);
check('documentação arquitetural presente',fs.existsSync(path.join(root,'docs/ARQUITETURA_RUNTIME_F03.md')));
if(!prepackage){
  check('manifesto criptográfico da release presente',fs.existsSync(path.join(root,'MANIFEST_SHA256.txt')));
}

const failed=checks.filter(x=>!x.ok);
console.log(`Skyward Control F03 audit: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
