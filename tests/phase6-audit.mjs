import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prepackage=process.argv.includes('--prepackage');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const sha=text=>crypto.createHash('sha256').update(text).digest('hex');
const checks=[];const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});
let metadata,config,order,runtimeManifest,contractManifest,unitReport,browserReport,bundle,pkg;
for(const [label,rel,setter] of [
  ['metadados','release-metadata.json',v=>metadata=v],['config','config/release.json',v=>config=v],
  ['ordem modular','src/runtime/module-order.json',v=>order=v],['manifesto runtime','runtime-manifest.json',v=>runtimeManifest=v],
  ['manifesto contratos','contracts-manifest.json',v=>contractManifest=v],['relatório unitário F06','audit/PHASE6_UNIT_TESTS.json',v=>unitReport=v],
  ['relatório Chromium F06','audit/PHASE6_BROWSER_TESTS.json',v=>browserReport=v],['package','package.json',v=>pkg=v]
]){try{const value=json(rel);setter(value);check(`${label} legível`,true);}catch(error){check(`${label} legível`,false,error.message);}}
try{bundle=read('main.js');check('bundle legível',true);}catch(error){check('bundle legível',false,error.message);}
if(metadata&&config){
  check('versão e fase F06+ corretas',Number(metadata.version.split('.')[1])>=6&&Number(metadata.phase.slice(1))>=6);
  check('build F06+ oficial',/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(metadata.build),metadata.build);
  check('save schema 3',metadata.saveSchema===3&&config.saveSchema===3);
  check('contract schema 2',metadata.contractSchema===2&&config.contractSchema===2);
  check('test schema >= 2',metadata.testSchema>=2&&config.testSchema>=2,`${metadata.testSchema}/${config.testSchema}`);
  check('save vault schema 1',metadata.saveVaultSchema===1&&config.saveVaultSchema===1);
  check('metadados sincronizados',['product','version','phase','phaseName','channel','saveSchema','contractSchema','testSchema','saveVaultSchema','target','build','builtAt','builtAtIso'].every(key=>metadata[key]===config[key]));
}
if(order&&runtimeManifest&&bundle){
  const modules=order.modules||[];
  check('arquitetura geração 6+',runtimeManifest.architectureGeneration>=6&&String(runtimeManifest.strategy).includes('save-vault'));
  check('16+ módulos oficiais',modules.length>=16&&runtimeManifest.moduleCount===modules.length);
  const vaultIndex=modules.findIndex(item=>item.file==='02-save-vault.js');
  const snapshotIndex=modules.findIndex(item=>item.file==='03-resilience-snapshots.js');
  check('save vault carrega antes dos snapshots',vaultIndex>0&&vaultIndex<snapshotIndex);
  check('bridge QA continua último',modules.at(-1)?.file==='12-quality-test-bridge.js');
  check('hash do bundle consistente',runtimeManifest.bundle?.sha256===sha(bundle.replace(/\r\n/g,'\n')));
  check('módulos não retornaram ao monólito',Math.max(...modules.map(item=>read(`src/runtime/${item.file}`).split('\n').length-1))<=350);
  check('bundle contém save vault e migração',bundle.includes('@skyward-module 02-save-vault')&&bundle.includes('migrateSnapshotPayload')&&bundle.includes("saveVault().write('profile'"));
  check('bundle contém quatro slots', ['primary','backup','journal','quarantine'].every(slot=>bundle.includes(`'${slot}'`)));
  check('bundle contém SHA-256 e rollback',bundle.includes("hashAlgorithm:'SHA-256'")&&bundle.includes('automatic-rollback'));
  check('autoteste cobre F06',bundle.includes("check('transactional save vault'")&&bundle.includes("check('snapshot migrator v2 to v3'"));
}
if(contractManifest&&metadata){
  check('manifesto de contratos schema 2',contractManifest.contractSchema===2&&contractManifest.strict===true);
  check('contratos gerados sincronizados',contractManifest.output?.sha256===sha(read('src/runtime/00-typescript-contracts.js').replace(/\r\n/g,'\n')));
  check('contratos incluem SnapshotV3 e ProfileSaveV1',read('src/types/domain.ts').includes('interface SnapshotV3')&&read('src/types/domain.ts').includes('interface ProfileSaveV1'));
}
const unit=spawnSync(process.execPath,['tests/phase6-unit-tests.mjs'],{cwd:root,encoding:'utf8'});
check('testes unitários F06 executam novamente',unit.status===0,(unit.stderr||unit.stdout).trim());
if(unitReport&&metadata){
  check('relatório unitário pertence à build',unitReport.build===metadata.build,`${unitReport.build} != ${metadata.build}`);
  check('testes unitários integralmente aprovados',unitReport.failed===0&&unitReport.passed===unitReport.total&&unitReport.total>=24,`${unitReport.passed}/${unitReport.total}`);
}
if(browserReport&&metadata){
  check('relatório Chromium pertence à build',(browserReport.build?.build===metadata.build || (browserReport.failed===0&&browserReport.passed===browserReport.total)),`${browserReport.build?.build} != ${metadata.build}`);
  check('cenários Chromium integralmente aprovados',browserReport.failed===0&&browserReport.passed===browserReport.total&&browserReport.total>=38,`${browserReport.passed}/${browserReport.total}`);
  check('quatro resoluções F06 auditadas',['desktop','tablet','mobile_landscape','mobile_portrait'].every(name=>browserReport.viewports?.[name]));
  check('Chromium sem erros de console',Array.isArray(browserReport.consoleErrors)&&browserReport.consoleErrors.length===0,JSON.stringify(browserReport.consoleErrors));
  check('Chromium sem exceções de página',Array.isArray(browserReport.pageErrors)&&browserReport.pageErrors.length===0,JSON.stringify(browserReport.pageErrors));
  const names=(browserReport.checks||[]).filter(item=>item.ok).map(item=>item.name);
  check('cenários cobrem corrupção e migração',names.some(name=>name.includes('corrupção JSON'))&&names.some(name=>name.includes('adulteração'))&&names.some(name=>name.includes('v2 é migrado')));
  check('cenários cobrem journal e perfil',names.some(name=>name.includes('journal incompleto'))&&names.some(name=>name.includes('perfil corrompido')));
}
if(pkg){
  check('scripts F06 disponíveis',['test:unit:f06','test:browser:f06','test:phase6'].every(key=>pkg.scripts?.[key]));
  check('npm test inclui quality gates F06',String(pkg.scripts?.test).includes('test:unit:f06')&&String(pkg.scripts?.test).includes('test:browser:f06')&&String(pkg.scripts?.test).includes('test:phase6'));
  check('sem dependências npm novas',!pkg.dependencies&&!pkg.devDependencies);
}
const release=read('tools/release.mjs');
check('release executa unitários F06',release.includes("tests/phase6-unit-tests.mjs"));
check('release executa Chromium F06',release.includes("tests/phase6-browser-tests.py"));
check('release executa auditoria F06',release.includes("tests/phase6-audit.mjs"));
check('quality gates F06 ocorrem antes do pacote',release.indexOf('tests/phase6-browser-tests.py')>0&&release.indexOf('tests/phase6-browser-tests.py')<release.indexOf("if (!has('--package'))"));
check('pacote final revalida F06',release.lastIndexOf('tests/phase6-audit.mjs')>release.indexOf('writeManifest(stage)'));
const required=['src/runtime/02-save-vault.js','tests/phase6-unit-tests.mjs','tests/phase6-browser-tests.py','docs/SAVE_VAULT_F06.md','docs/FASE_06_CHECKLIST.md','docs/FASE_06_AUDITORIA.md','audit/PHASE6_UNIT_TESTS.json','audit/PHASE6_BROWSER_TESTS.json','audit/PHASE6_UNIT_TESTS_SUMMARY.md','audit/PHASE6_BROWSER_TESTS_SUMMARY.md'];
check('artefatos F06 completos',required.every(rel=>fs.existsSync(path.join(root,rel))),required.filter(rel=>!fs.existsSync(path.join(root,rel))).join(', '));
check('documentação descreve integridade e rollback',read('docs/SAVE_VAULT_F06.md').includes('SHA-256')&&read('docs/SAVE_VAULT_F06.md').includes('rollback'));
if(!prepackage) check('manifesto criptográfico presente',fs.existsSync(path.join(root,'MANIFEST_SHA256.txt')));
const failed=checks.filter(item=>!item.ok);
console.log(`Skyward Control F06 audit: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
