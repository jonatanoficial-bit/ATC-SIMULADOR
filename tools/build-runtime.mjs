import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, readJson, writeJson } from './release-lib.mjs';

const args = new Set(process.argv.slice(2));
const sourceRoot = path.join(ROOT, 'src', 'runtime');
const orderPath = path.join(sourceRoot, 'module-order.json');
const outputPath = path.join(ROOT, 'main.js');
const runtimeManifestPath = path.join(ROOT, 'runtime-manifest.json');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(`Runtime build: ${message}`); };

if (!fs.existsSync(orderPath)) fail('src/runtime/module-order.json ausente');
const order = readJson(orderPath);
if (order.schema !== 1 || order.entry !== 'main.js' || !Array.isArray(order.modules)) fail('manifesto de módulos inválido');
if (order.modules.length < 8) fail('arquitetura modular insuficiente');

const seenFiles = new Set();
const seenNames = new Set();
const parts = [];
const moduleAudit = [];
for (const [index, item] of order.modules.entries()) {
  if (!item?.file || !item?.name) fail(`módulo ${index + 1} incompleto`);
  if (seenFiles.has(item.file) || seenNames.has(item.name)) fail(`módulo duplicado: ${item.file}`);
  seenFiles.add(item.file); seenNames.add(item.name);
  if (path.basename(item.file) !== item.file || !item.file.endsWith('.js')) fail(`caminho inseguro: ${item.file}`);
  const absolute = path.join(sourceRoot, item.file);
  if (!fs.existsSync(absolute)) fail(`arquivo ausente: ${item.file}`);
  const source = fs.readFileSync(absolute, 'utf8').replace(/\r\n/g, '\n').trimEnd() + '\n';
  if (!source.includes('@skyward-module')) fail(`marcador ausente: ${item.file}`);
  const lines = source.split('\n').length - 1;
  moduleAudit.push({ order:index + 1, file:item.file, name:item.name, description:item.description || '', lines, bytes:Buffer.byteLength(source), sha256:hash(source) });
  parts.push(`\n/* ===== MODULE ${String(index + 1).padStart(2,'0')}: ${item.name} (${item.file}) ===== */\n${source}`);
}
parts.push(`\n/* ===== RUNTIME ARCHITECTURE FINALIZER ===== */\nObject.freeze(window.SKYWARD_MODULES);\nObject.freeze(window.SKYWARD_ARCHITECTURE);\n`);
const generated = `/*\n * SKYWARD CONTROL — GENERATED RUNTIME BUNDLE\n * Do not edit main.js directly. Edit src/runtime modules and run npm run build:runtime.\n * Architecture generation: 27\n */\n${parts.join('')}`;
const manifest = {
  schema:1,
  architectureGeneration:27,
  strategy:'advanced-advanced-weather-ifr-vfr-surface-safety-director-public-ops-feedback-telemetry-hotfix-post-publish-healthcheck-github-pages-pwa-hotfix-post-gold-master-real-device-qa-screenshots-github-pages-gold-master-packaging-final-store-pwa-player-manual-public-release-candidate-qa-final-balance-guided-tutorial-commercial-mobile-aaa-polish-responsive-hud-onboarding-local-async-control-room-ranking-shared-replay-international-network-flow-slots-connections-alternates-complex-operational-incidents-emergency-multiagency-airport-operational-economy-contracts-delay-costs-efficiency-deep-controller-career-licenses-ratings-fatigue-reputation-published-procedures-sid-star-ils-rnav-holdings-advanced-ifr-vfr-weather-realistic-airport-surface-graph-realistic-aircraft-performance-deterministic-replay-clock-professional-accessibility-settings-desktop-tablet-workspace-adaptive-mobile-ux-installable-offline-pwa-transactional-save-vault-quality-gated-typescript-modules',
  sourceRoot:'src/runtime',
  entry:'main.js',
  moduleCount:moduleAudit.length,
  modules:moduleAudit,
  bundle:{ bytes:Buffer.byteLength(generated), lines:generated.split('\n').length - 1, sha256:hash(generated) }
};

if (args.has('--check')) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8').replace(/\r\n/g, '\n') : '';
  if (current !== generated) fail('main.js está desatualizado; execute npm run build:runtime');
  const stored = fs.existsSync(runtimeManifestPath) ? readJson(runtimeManifestPath) : null;
  if (!stored || stored.bundle?.sha256 !== manifest.bundle.sha256 || stored.moduleCount !== manifest.moduleCount) fail('runtime-manifest.json está desatualizado');
  console.log(`Runtime bundle check: ${manifest.moduleCount} módulos, SHA-256 ${manifest.bundle.sha256}`);
  process.exit(0);
}

fs.writeFileSync(outputPath, generated, 'utf8');
writeJson(runtimeManifestPath, manifest);
console.log(`Runtime bundle built: ${manifest.moduleCount} módulos, ${manifest.bundle.lines} linhas, SHA-256 ${manifest.bundle.sha256}`);
