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
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});

let metadata,config,order,runtimeManifest,unitReport,browserReport,bundle,pkg;
for(const [name,rel,setter] of [
  ['metadados F05','release-metadata.json',v=>metadata=v],
  ['config F05','config/release.json',v=>config=v],
  ['ordem modular','src/runtime/module-order.json',v=>order=v],
  ['manifesto runtime','runtime-manifest.json',v=>runtimeManifest=v],
  ['relatório unitário','audit/PHASE5_UNIT_TESTS.json',v=>unitReport=v],
  ['relatório Chromium','audit/PHASE5_BROWSER_TESTS.json',v=>browserReport=v],
  ['package.json','package.json',v=>pkg=v]
]){
  try{const v=json(rel);setter(v);check(`${name} legível`,true);}catch(error){check(`${name} legível`,false,error.message);}
}
try{bundle=read('main.js');check('bundle runtime legível',true);}catch(error){check('bundle runtime legível',false,error.message);}

if(metadata&&config){
  check('baseline F05 preservada',Number(metadata.version.split('.')[1])>=5&&Number(String(metadata.phase).slice(1))>=5);
  check('build F05+ oficial',/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(metadata.build),metadata.build);
  check('save schema preservado',metadata.saveSchema>=2&&config.saveSchema===metadata.saveSchema);
  check('contract schema preservado',metadata.contractSchema>=1&&config.contractSchema===metadata.contractSchema);
  check('test schema consistente',metadata.testSchema>=1&&config.testSchema===metadata.testSchema);
  check('metadados sincronizados',['product','version','phase','phaseName','channel','saveSchema','contractSchema','testSchema','target','build','builtAt','builtAtIso'].every(key=>metadata[key]===config[key]));
}
if(order&&runtimeManifest&&bundle){
  const modules=order.modules||[];
  check('arquitetura geração 5+',runtimeManifest.architectureGeneration>=5&&String(runtimeManifest.strategy).includes('quality'));
  check('15+ módulos oficiais',runtimeManifest.moduleCount>=15&&modules.length===runtimeManifest.moduleCount);
  check('kernel vem antes dos contratos',modules[0]?.file==='00-runtime-registry.js'&&modules[1]?.file==='00-quality-kernel.js'&&modules[2]?.file==='00-typescript-contracts.js');
  check('bridge QA é o último módulo',modules.at(-1)?.file==='12-quality-test-bridge.js');
  check('hash do bundle consistente',runtimeManifest.bundle?.sha256===sha(bundle.replace(/\r\n/g,'\n')));
  check('kernel incorporado ao runtime',bundle.includes('@skyward-module 00-quality-kernel')&&bundle.includes('window.SKYWARD_QUALITY_KERNEL'));
  check('runtime usa kernel em produção',['QUALITY.range','QUALITY.clamp','QUALITY.headingTo','QUALITY.distance','QUALITY.requestPriorityScore','QUALITY.wakeSpacing','QUALITY.shortestTurn'].every(token=>bundle.includes(token)));
  check('bridge QA incorporado e protegido',bundle.includes('@skyward-module 12-quality-test-bridge')&&bundle.includes('SKYWARD_QA_MODE')&&bundle.includes('read-only outside explicit QA mode'));
  check('autoteste cobre F05',bundle.includes("check('quality kernel available'")&&bundle.includes("check('test schema metadata'")&&bundle.includes("check('qa bridge available'"));
}

const unit=spawnSync(process.execPath,['tests/phase5-unit-tests.mjs'],{cwd:root,encoding:'utf8'});
check('testes unitários executam novamente',unit.status===0,(unit.stderr||unit.stdout).trim());
if(unitReport&&metadata){
  check('relatório unitário pertence à build atual',unitReport.build===metadata.build,`${unitReport.build} != ${metadata.build}`);
  check('relatório unitário integralmente aprovado',unitReport.failed===0&&unitReport.passed===unitReport.total&&unitReport.total>=70,`${unitReport.passed}/${unitReport.total}`);
}
if(browserReport&&metadata){
  check('relatório Chromium pertence à build atual',browserReport.build?.build===metadata.build,`${browserReport.build?.build} != ${metadata.build}`);
  check('cenários Chromium integralmente aprovados',browserReport.failed===0&&browserReport.passed===browserReport.total&&browserReport.total>=55,`${browserReport.passed}/${browserReport.total}`);
  check('soak Chromium executado',Number(browserReport.timings?.soakSeconds)>=0&&browserReport.checks?.some(item=>item.name==='soak executa todos os passos'&&item.ok));
  check('quatro resoluções auditadas',['desktop','tablet','mobile_landscape','mobile_portrait'].every(name=>browserReport.viewports?.[name]));
  check('Chromium sem erros de console',Array.isArray(browserReport.consoleErrors)&&browserReport.consoleErrors.length===0,JSON.stringify(browserReport.consoleErrors));
  check('Chromium sem exceções de página',Array.isArray(browserReport.pageErrors)&&browserReport.pageErrors.length===0,JSON.stringify(browserReport.pageErrors));
}

if(pkg){
  check('scripts de qualidade disponíveis',['test:unit','test:browser','test:phase5'].every(key=>pkg.scripts?.[key]));
  check('npm test inclui todas as camadas',String(pkg.scripts?.test).includes('test:unit')&&String(pkg.scripts?.test).includes('test:browser')&&String(pkg.scripts?.test).includes('test:phase5'));
  check('sem dependências runtime novas',!pkg.dependencies&&!pkg.devDependencies);
}
const release=read('tools/release.mjs');
check('release executa testes unitários',release.includes("tests/phase5-unit-tests.mjs",));
check('release executa cenários Chromium',release.includes("tests/phase5-browser-tests.py"));
check('release executa auditoria F05',release.includes("tests/phase5-audit.mjs"));
check('quality gates ocorrem antes do pacote',release.indexOf('tests/phase5-browser-tests.py')>=0&&release.indexOf('tests/phase5-browser-tests.py')<release.indexOf("if (!has('--package'))"));
check('pacote final revalida F05',release.lastIndexOf('tests/phase5-audit.mjs')>release.indexOf('writeManifest(stage)'));

const required=[
  'src/runtime/00-quality-kernel.js','src/runtime/12-quality-test-bridge.js','tests/phase5-unit-tests.mjs','tests/phase5-browser-tests.py',
  'tests/fixtures/phase5-scenarios.json','docs/TESTES_AUTOMATIZADOS_F05.md','docs/FASE_05_CHECKLIST.md','docs/FASE_05_AUDITORIA.md',
  'audit/PHASE5_UNIT_TESTS.json','audit/PHASE5_BROWSER_TESTS.json','audit/PHASE5_UNIT_TESTS_SUMMARY.md','audit/PHASE5_BROWSER_TESTS_SUMMARY.md'
];
check('artefatos F05 completos',required.every(rel=>fs.existsSync(path.join(root,rel))),required.filter(rel=>!fs.existsSync(path.join(root,rel))).join(', '));
const fixture=json('tests/fixtures/phase5-scenarios.json');
check('fixture de cenários versionada',fixture.schema===1&&fixture.seed===5005&&fixture.soak?.steps>=900);
check('matriz de resolução completa',Object.keys(fixture.viewports||{}).length===4);
if(!prepackage) check('manifesto criptográfico presente',fs.existsSync(path.join(root,'MANIFEST_SHA256.txt')));

const failed=checks.filter(item=>!item.ok);
console.log(`Skyward Control F05 audit: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
