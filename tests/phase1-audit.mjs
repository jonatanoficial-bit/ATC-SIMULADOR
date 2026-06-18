import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const html = read('index.html');
const js = read('main.js');
const css = read('style.css');
const metadata = JSON.parse(read('release-metadata.json'));
const checks = [];
const check = (name, condition) => checks.push({ name, ok:Boolean(condition) });

check('build gerada em version.txt', read('version.txt').includes(metadata.build));
check('metadados visíveis no HTML', html.includes('data-build') && html.includes('data-build-version') && html.includes('data-build-date'));
check('favicon embutido', html.includes('data:image/svg+xml'));
check('dock legado removido', !html.includes('id="mobileDock"'));
check('sem clearance genérico no HTML', !html.includes('data-cmd="clear"'));
check('clearances explícitos', ['clearLanding','approvePushback','approveTaxi','lineUp','clearTakeoff','clearEmergency'].every(x => js.includes(x)));
check('mapa de clearance por solicitação', js.includes('CLEARANCE_COMMANDS'));
check('snapshot versionado por schema', js.includes('SNAPSHOT_KEY') && js.includes('schema:BUILD_INFO.schema'));
check('migração de snapshot legado', js.includes('LEGACY_SNAPSHOT_KEYS'));
check('restauração conectada', js.includes('function restoreGoodState') && js.includes("querySelector('#safeRestoreBtn')"));
check('prevenção de callsign duplicado', js.includes('uniqueCallsign'));
check('um painel mobile por vez', css.includes('body.game-active .mobile-panel.active') && css.includes('body.game-active .mobile-action-sheet.active'));
check('menus roláveis', css.includes('overflow-y:auto') && css.includes('touch-action:pan-y'));
check('guard somente no gameplay', css.includes('body.game-active .orientation-guard{display:flex!important}') && css.includes('body:not(.game-active) .orientation-guard{display:none!important}'));
check('camada mobile oculta no desktop', css.includes('body.game-active .mobile-atc-layer,') && css.includes('display:none!important') && css.includes('@media (max-width:980px)'));
for (const file of ['data/aircraft.json','data/airports.json']) {
  try { JSON.parse(read(file)); check(`JSON válido: ${file}`, true); }
  catch { check(`JSON válido: ${file}`, false); }
}
const failed = checks.filter(x => !x.ok);
console.log(`Skyward Control F01 regression: ${checks.length-failed.length}/${checks.length} aprovadas`);
for (const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}`);
if (failed.length) process.exit(1);
