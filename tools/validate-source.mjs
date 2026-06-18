import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, readJson, validateConfig } from './release-lib.mjs';

const required = [
  'index.html','style.css','main.js','build-info.js','release-metadata.json','version.txt',
  'data/aircraft.json','data/airports.json','config/release.json','tools/release.mjs',
  'tools/verify-integrity.mjs','tools/build-runtime.mjs','tests/phase1-audit.mjs','tests/phase2-audit.mjs','tests/phase3-audit.mjs','tests/pipeline-guard.mjs',
  'src/runtime/module-order.json','runtime-manifest.json','tsconfig.json','contracts-manifest.json',
  'src/types/domain.ts','src/contracts/runtime-contracts.ts','src/runtime/00-typescript-contracts.js','tools/build-contracts.mjs','tests/phase4-audit.mjs',
  'src/runtime/00-quality-kernel.js','src/runtime/12-quality-test-bridge.js','tests/phase5-unit-tests.mjs','tests/phase5-browser-tests.py','tests/phase5-audit.mjs','tests/fixtures/phase5-scenarios.json',
  'src/runtime/02-save-vault.js','tests/phase6-unit-tests.mjs','tests/phase6-browser-tests.py','tests/phase6-audit.mjs','docs/SAVE_VAULT_F06.md','docs/FASE_06_CHECKLIST.md','docs/FASE_06_AUDITORIA.md',
  'manifest.webmanifest','service-worker.js','pwa-cache-manifest.json','tools/build-pwa.mjs','src/runtime/01-pwa-runtime.js','tests/phase7-unit-tests.mjs','tests/phase7-service-worker-tests.mjs','tests/phase7-browser-tests.py','tests/phase7-audit.mjs','docs/PWA_OFFLINE_FULLSCREEN_F07.md','docs/FASE_07_CHECKLIST.md','docs/FASE_07_AUDITORIA.md',
  'assets/icons/icon-180.png','assets/icons/icon-192.png','assets/icons/icon-512.png','assets/icons/icon-maskable-512.png',
  'tests/phase8-unit-tests.mjs','tests/phase8-browser-tests.py','tests/phase8-audit.mjs','docs/MOBILE_UX_F08.md','docs/FASE_08_CHECKLIST.md','docs/FASE_08_AUDITORIA.md',
  'src/runtime/12-desktop-workspace.js','tests/phase9-unit-tests.mjs','tests/phase9-browser-tests.py','tests/phase9-audit.mjs','docs/DESKTOP_TABLET_WORKSPACE_F09.md','docs/FASE_09_CHECKLIST.md','docs/FASE_09_AUDITORIA.md',
  'src/runtime/13-accessibility-settings.js','tests/phase10-unit-tests.mjs','tests/phase10-browser-tests.py','tests/phase10-audit.mjs','docs/ACESSIBILIDADE_CONFIGURACOES_F10.md','docs/FASE_10_CHECKLIST.md','docs/FASE_10_AUDITORIA.md',
  'src/runtime/14-deterministic-replay.js','tests/phase11-unit-tests.mjs','tests/phase11-browser-tests.py','tests/phase11-audit.mjs','docs/RELOGIO_DETERMINISTICO_REPLAY_F11.md','docs/FASE_11_CHECKLIST.md','docs/FASE_11_AUDITORIA.md'
];
const checks = [];
const check = (name, condition, detail='') => checks.push({ name, ok:Boolean(condition), detail });

for (const rel of required) check(`arquivo obrigatório: ${rel}`, fs.existsSync(path.join(ROOT, rel)));

let config = null, metadata = null;
try { config = readJson(path.join(ROOT, 'config/release.json')); validateConfig(config); check('config de release válida', true); }
catch (error) { check('config de release válida', false, error.message); }
try { metadata = readJson(path.join(ROOT, 'release-metadata.json')); check('release-metadata.json válido', true); }
catch (error) { check('release-metadata.json válido', false, error.message); }

for (const rel of ['data/aircraft.json','data/airports.json','package.json','BUILD_HISTORY.json']) {
  try { readJson(path.join(ROOT, rel)); check(`JSON válido: ${rel}`, true); }
  catch (error) { check(`JSON válido: ${rel}`, false, error.message); }
}

const syntax = spawnSync(process.execPath, ['--check', path.join(ROOT, 'main.js')], { encoding:'utf8' });
check('main.js sem erro de sintaxe', syntax.status === 0, syntax.stderr.trim());
const buildSyntax = spawnSync(process.execPath, ['--check', path.join(ROOT, 'build-info.js')], { encoding:'utf8' });
check('build-info.js sem erro de sintaxe', buildSyntax.status === 0, buildSyntax.stderr.trim());
const contractCheck = spawnSync(process.execPath, ['tools/build-contracts.mjs', '--check'], { cwd:ROOT, encoding:'utf8' });
check('contratos TypeScript sincronizados', contractCheck.status === 0, (contractCheck.stderr || contractCheck.stdout).trim());
const typeCheck = spawnSync('tsc', ['-p','tsconfig.json','--noEmit','--pretty','false'], { cwd:ROOT, encoding:'utf8' });
check('TypeScript strict sem erros', typeCheck.status === 0, (typeCheck.stderr || typeCheck.stdout).trim());
const pwaCheck = spawnSync(process.execPath, ['tools/build-pwa.mjs', '--check'], { cwd:ROOT, encoding:'utf8' });
check('PWA e cache sincronizados com a build', pwaCheck.status === 0, (pwaCheck.stderr || pwaCheck.stdout).trim());
const runtimeCheck = spawnSync(process.execPath, ['tools/build-runtime.mjs', '--check'], { cwd:ROOT, encoding:'utf8' });
check('bundle runtime sincronizado com módulos', runtimeCheck.status === 0, (runtimeCheck.stderr || runtimeCheck.stdout).trim());
try {
  const order = readJson(path.join(ROOT, 'src/runtime/module-order.json'));
  for (const item of order.modules || []) {
    const syntax = spawnSync(process.execPath, ['--check', path.join(ROOT, 'src/runtime', item.file)], { encoding:'utf8' });
    check(`módulo sem erro de sintaxe: ${item.file}`, syntax.status === 0, syntax.stderr.trim());
  }
} catch (error) { check('módulos runtime verificáveis', false, error.message); }

if (config && metadata) {
  for (const field of ['product','version','phase','phaseName','channel','saveSchema','contractSchema','testSchema','saveVaultSchema','pwaSchema','cacheSchema','uxSchema','desktopSchema','target','build','builtAt','builtAtIso']) {
    check(`metadado consistente: ${field}`, config[field] === metadata[field], `${config[field]} != ${metadata[field]}`);
  }
  check('build segue padrão oficial', new RegExp(`^${config.prefix}-\\d+\\.\\d+\\.\\d+-F\\d{2}-\\d{8}-\\d{4}$`).test(metadata.build));
  check('package.json segue versão da release', readJson(path.join(ROOT, 'package.json')).version === metadata.version);
}

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'main.js'), 'utf8');
check('build-info carregado antes do jogo', html.indexOf('build-info.js') >= 0 && html.indexOf('build-info.js') < html.indexOf('main.js'));
check('HTML sem versão comercial hardcoded', !/v1\.\d+\.\d+/.test(html));
check('main.js usa metadados gerados', js.includes('window.SKYWARD_BUILD_INFO'));
check('main.js é bundle gerado', js.includes('SKYWARD CONTROL — GENERATED RUNTIME BUNDLE'));
check('fonte modular registrada', js.includes('window.SKYWARD_ARCHITECTURE') && js.includes('src/runtime'));
check('contratos TypeScript presentes no bundle', js.includes('window.SKYWARD_CONTRACTS') && js.includes('@skyward-module 00-typescript-contracts'));
check('contratos conectados ao snapshot', js.includes('CONTRACTS.validateSnapshot') && js.includes('CONTRACTS.sanitizeAircraft'));
check('schema de contrato exposto', Number(config?.contractSchema)>=1 && metadata?.contractSchema===config?.contractSchema);
check('schema de testes exposto', Number(config?.testSchema)>=1 && metadata?.testSchema===config?.testSchema && js.includes('SKYWARD_TEST_API'));
check('quality kernel incorporado', js.includes('SKYWARD_QUALITY_KERNEL') && js.includes('@skyward-module 00-quality-kernel'));
check('save vault transacional incorporado', js.includes('window.SKYWARD_SAVE_VAULT') && js.includes('@skyward-module 02-save-vault') && js.includes('automatic-rollback'));
check('save vault conectado aos snapshots e perfil', js.includes("write('snapshot'") && js.includes("write('profile'") && js.includes('migrateSnapshotPayload'));
check('save vault schema exposto', config?.saveVaultSchema===1 && metadata?.saveVaultSchema===1);
check('PWA schemas expostos', Number(config?.pwaSchema)>=1 && metadata?.pwaSchema===config?.pwaSchema && Number(config?.cacheSchema)>=1 && metadata?.cacheSchema===config?.cacheSchema);
check('manifesto PWA ligado ao HTML', html.includes('rel="manifest"') && html.includes('manifest.webmanifest') && html.includes('apple-touch-icon'));
check('runtime PWA incorporado', js.includes('window.SKYWARD_PWA') && js.includes('@skyward-module 01-pwa-runtime') && js.includes('applyPwaUpdate'));
check('service worker versionado', fs.readFileSync(path.join(ROOT,'service-worker.js'),'utf8').includes(config?.build) && fs.readFileSync(path.join(ROOT,'service-worker.js'),'utf8').includes('SKIP_WAITING'));
check('cache offline auditável', readJson(path.join(ROOT,'pwa-cache-manifest.json')).build===config?.build && readJson(path.join(ROOT,'pwa-cache-manifest.json')).files.length>=15);
check('UX schema exposto', Number(config?.uxSchema)>=1 && metadata?.uxSchema===config?.uxSchema);
check('desktop schema exposto', Number(config?.desktopSchema)>=1 && metadata?.desktopSchema===config?.desktopSchema);
check('workspace desktop incorporado', js.includes('window.SKYWARD_DESKTOP_WORKSPACE') && js.includes('@skyward-module 12-desktop-workspace') && html.includes('desktopWorkspaceHud'));
check('runtime mobile adaptativo incorporado', js.includes('window.SKYWARD_MOBILE_UX') && js.includes('classifyMobileGesture') && js.includes('mobileTouchTargetPx'));
check('HTML possui dock mobile F08', html.includes('mobileDockV2') && html.includes('mobileSelectedChip') && html.includes('mobileGestureCoach'));
check('bridge QA protegido', js.includes('SKYWARD_QA_MODE') && js.includes('read-only outside explicit QA mode'));
check('main.js sem build F01 hardcoded', !/SC-1\.1\.0-F01-/.test(js));
check('fase visível gerada em runtime', html.includes('data-build-phase') && js.includes("'[data-build-phase]'"));
check('schema de replay exposto', Number(config?.replaySchema)>=1 && metadata?.replaySchema===config?.replaySchema && js.includes('SKYWARD_REPLAY'));
check('runtime replay incorporado', js.includes('@skyward-module 14-deterministic-replay') && js.includes('replayBeginTurn') && html.includes('replayPanel'));
check('documentação F11 presente', fs.existsSync(path.join(ROOT,'docs/RELOGIO_DETERMINISTICO_REPLAY_F11.md')));
check('testes F11 presentes', fs.existsSync(path.join(ROOT,'tests/phase11-unit-tests.mjs')) && fs.existsSync(path.join(ROOT,'tests/phase11-browser-tests.py')) && fs.existsSync(path.join(ROOT,'tests/phase11-audit.mjs')));

const refs = new Set();
const css = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
for (const match of html.matchAll(/(?:src|href)=["'](?!data:|https?:|#)([^"']+)["']/g)) refs.add(match[1].split('?')[0]);
for (const match of css.matchAll(/url\(["']?(?!data:|https?:)([^"')]+)["']?\)/g)) refs.add(match[1].split('?')[0]);
for (const ref of refs) check(`recurso referenciado existe: ${ref}`, fs.existsSync(path.join(ROOT, ref)));

const failed = checks.filter(c => !c.ok);
console.log(`Source validation: ${checks.length - failed.length}/${checks.length} aprovadas`);
for (const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${item.detail && !item.ok ? ` — ${item.detail}`:''}`);
if (failed.length) process.exit(1);
