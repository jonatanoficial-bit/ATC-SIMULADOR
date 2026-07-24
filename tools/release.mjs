import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  ROOT,
  RELEASE_CONFIG,
  readJson,
  writeJson,
  buildMetadata,
  writeGeneratedFiles,
  writeManifest,
  sha256
} from './release-lib.mjs';

const args = process.argv.slice(2);
const value = flag => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const has = flag => args.includes(flag);
const config = readJson(RELEASE_CONFIG);

if (value('--version')) config.version = value('--version');
if (value('--phase')) config.phase = value('--phase').toUpperCase();
if (value('--phase-name')) config.phaseName = value('--phase-name');
if (value('--channel')) config.channel = value('--channel');
if (value('--schema')) config.saveSchema = Number(value('--schema'));

const reuseStamp = has('--reuse-stamp');
const metadata = reuseStamp ? config : buildMetadata(config);
if (reuseStamp && (!metadata.build || !metadata.builtAt || !metadata.builtAtIso)) {
  throw new Error('--reuse-stamp requires an existing stamped build');
}
writeJson(RELEASE_CONFIG, metadata);
writeGeneratedFiles(ROOT, metadata);
const packagePath = path.join(ROOT, 'package.json');
const packageJson = readJson(packagePath);
packageJson.scripts['test:current'] = 'node tools/run-current-tests.mjs';
packageJson.scripts['test:commercial'] = 'node tests/commercial-release-regression.mjs';
packageJson.scripts.test = 'npm run build:contracts && npm run build:runtime && npm run build:pwa && npm run validate && npm run test:current';
writeJson(packagePath, packageJson);

const run = (command, commandArgs, cwd = ROOT) => {
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 32 * 1024 * 1024
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(' ')} failed`);
  }
};

run(process.execPath, ['tools/build-contracts.mjs']);
run(process.execPath, ['tools/build-runtime.mjs']);
run(process.execPath, ['tools/build-pwa.mjs']);
run(process.execPath, ['tools/validate-source.mjs']);
run(process.execPath, ['tools/run-current-tests.mjs']);

if (!has('--package')) {
  console.log(`STAMPED ${metadata.build}`);
  process.exit(0);
}

const outputDir = path.resolve(value('--output') || path.join(ROOT, 'dist'));
fs.mkdirSync(outputDir, { recursive: true });
const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'skyward-release-'));
const folderName = `Skyward-Control-v${metadata.version}-${metadata.build.split('-').slice(-2).join('-')}`;
const stage = path.join(tempParent, folderName);
fs.cpSync(ROOT, stage, {
  recursive: true,
  filter: source => {
    const rel = path.relative(ROOT, source).replaceAll(path.sep, '/');
    return !rel || !['dist', 'node_modules', '.git', 'audit'].some(
      excluded => rel === excluded || rel.startsWith(`${excluded}/`)
    );
  }
});
fs.mkdirSync(path.join(stage, 'audit'), { recursive: true });
for (const report of ['CURRENT_RELEASE_TESTS.json', 'COMMERCIAL_RELEASE_REGRESSION.json']) {
  fs.copyFileSync(path.join(ROOT, 'audit', report), path.join(stage, 'audit', report));
}
fs.rmSync(path.join(stage, 'MANIFEST_SHA256.txt'), { force: true });
const manifestFiles = writeManifest(stage);
run(process.execPath, ['tools/verify-integrity.mjs'], stage);

const zipPath = path.join(outputDir, `${folderName}.zip`);
fs.rmSync(zipPath, { force: true });
if (process.platform === 'win32') {
  const psStage = stage.replaceAll("'", "''");
  const psZipPath = zipPath.replaceAll("'", "''");
  run('powershell.exe', [
    '-NoProfile',
    '-Command',
    `Compress-Archive -LiteralPath '${psStage}' -DestinationPath '${psZipPath}' -CompressionLevel Optimal`
  ], tempParent);
} else {
  run('zip', ['-qr', zipPath, folderName], tempParent);
}

const archiveHash = sha256(zipPath);
fs.writeFileSync(`${zipPath}.sha256`, `${archiveHash}  ${path.basename(zipPath)}\n`);
writeJson(`${zipPath}.metadata.json`, {
  ...metadata,
  manifestFiles,
  archive: path.basename(zipPath),
  sha256: archiveHash
});
console.log(`RELEASE ${zipPath}`);
console.log(`SHA256 ${archiveHash}`);
fs.rmSync(tempParent, { recursive: true, force: true });
