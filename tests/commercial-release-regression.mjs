import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const json = rel => JSON.parse(read(rel));
const checks = [];
const check = (name, ok, detail = '') => checks.push({
  name,
  ok: Boolean(ok),
  detail: String(detail || '')
});

const config = json('config/release.json');
const metadata = json('release-metadata.json');
const pkg = json('package.json');
const order = json('src/runtime/module-order.json');
const manifest = json('runtime-manifest.json');
const pwa = json('pwa-cache-manifest.json');
const html = read('index.html');
const css = read('style.css');
const main = read('main.js');
const sw = read('service-worker.js');

check('versão sincronizada', config.version === metadata.version && metadata.version === pkg.version);
check('build sincronizada', config.build === metadata.build && pwa.build === metadata.build);
check('fase interna atual', Number(config.phase?.slice?.(1) || 0) >= 62, config.phase);
check('canal de produção', config.channel === 'production', config.channel);
check('runtime modular sincronizado', manifest.modules.length === order.modules.length && manifest.modules.length >= 70);
check('bundle gerado', main.includes('GENERATED RUNTIME BUNDLE') && main.includes('window.SKYWARD_ARCHITECTURE'));
check('service worker versionado', sw.includes(metadata.build));
check('sem dependências runtime', !pkg.dependencies || Object.keys(pkg.dependencies).length === 0);
check('TypeScript fixado como ferramenta de desenvolvimento', pkg.devDependencies?.typescript === '5.8.3');

const syntax = spawnSync(process.execPath, ['--check', path.join(ROOT, 'main.js')], { encoding: 'utf8' });
check('bundle sem erro de sintaxe', syntax.status === 0, syntax.stderr || syntax.stdout);

const htmlWithoutMarkup = html
  .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ');
const forbiddenVisible = [
  /SC-\d+\.\d+\.\d+-F\d{2}/i,
  /QA t[ée]cnico/i,
  /fase a fase/i,
  /\brelease candidate\b/i,
  /\bgold master\b/i,
  /\bpost[- ]publish\b/i,
  /\bhotfix\b/i,
  /\bCodex\b/i,
  /\bChatGPT\b/i
];
const visibleLeaks = forbiddenVisible
  .filter(pattern => pattern.test(htmlWithoutMarkup))
  .map(pattern => String(pattern));
check('interface pública sem linguagem interna', visibleLeaks.length === 0, visibleLeaks.join(', '));
check('interface mostra somente a versão comercial', html.includes('data-build-version') && !html.includes('data-build-phase'));
check('perfil mobile protegido contra overflow', css.includes('.profile-card>*{min-width:0;') && css.includes('@media (max-width:520px)'));
check('alvos touch mínimos', css.includes('min-height:44px'));
check('modo retrato orienta o usuário', html.includes('orientationGuard'));
check('painéis administrativos ocultos', [
  '.release-candidate-inline',
  '.gold-master-inline',
  '.post-gold-master-inline',
  '.post-publish-health-inline',
  '.public-ops-inline'
].every(selector => css.includes(`${selector}{display:none!important}`)));

const productionText = [
  html,
  css,
  ...order.modules.map(item => read(path.posix.join('src/runtime', item.file))),
  ...fs.readdirSync(path.join(ROOT, 'data'))
    .filter(name => name.endsWith('.json'))
    .map(name => read(path.posix.join('data', name)))
].join('\n');
check('release sem caminho pessoal Windows', !/C:\\Users\\jonat/i.test(productionText));
check('release sem caminho pessoal Git Bash', !/\/c\/Users\/jonat/i.test(productionText));

const topLevelNames = new Map();
for (const item of order.modules) {
  const source = read(path.posix.join('src/runtime', item.file));
  for (const match of source.matchAll(/^(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/gm)) {
    const files = topLevelNames.get(match[1]) || [];
    files.push(item.file);
    topLevelNames.set(match[1], files);
  }
}
const duplicates = [...topLevelNames.entries()].filter(([, files]) => files.length > 1);
check('sem colisões globais entre módulos', duplicates.length === 0,
  duplicates.map(([name, files]) => `${name}: ${files.join(', ')}`).join('; '));

const missingPwaFiles = pwa.files
  .map(item => typeof item === 'string' ? item : item.file)
  .filter(rel => !fs.existsSync(path.join(ROOT, rel)));
check('cache PWA referencia somente arquivos existentes', missingPwaFiles.length === 0, missingPwaFiles.join(', '));

const failed = checks.filter(item => !item.ok);
const report = {
  schema: 1,
  suite: 'commercial-release-regression',
  build: metadata.build,
  passed: checks.length - failed.length,
  failed: failed.length,
  total: checks.length,
  checks
};
fs.mkdirSync(path.join(ROOT, 'audit'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'audit', 'COMMERCIAL_RELEASE_REGRESSION.json'),
  `${JSON.stringify(report, null, 2)}\n`
);
console.log(`Commercial release regression: ${report.passed}/${report.total} approved`);
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${!item.ok && item.detail ? ` — ${item.detail}` : ''}`);
}
if (failed.length) process.exit(1);
