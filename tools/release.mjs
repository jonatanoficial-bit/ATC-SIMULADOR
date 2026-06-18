import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, RELEASE_CONFIG, readJson, writeJson, buildMetadata, writeGeneratedFiles, writeManifest, sha256 } from './release-lib.mjs';

const args = process.argv.slice(2);
const value = flag => { const i=args.indexOf(flag); return i>=0 ? args[i+1] : undefined; };
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
  throw new Error('--reuse-stamp exige uma build previamente carimbada em config/release.json');
}
writeJson(RELEASE_CONFIG, metadata);
writeGeneratedFiles(ROOT, metadata);

const run = (cmd, cmdArgs, cwd=ROOT) => {
  const result = spawnSync(cmd, cmdArgs, { cwd, encoding:'utf8', stdio:'pipe' });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) throw new Error(`${cmd} ${cmdArgs.join(' ')} falhou`);
};
const reuseBrowserReports = has('--reuse-browser-reports');
const requirePassedBrowserReport = (relativePath) => {
  const report = readJson(path.join(ROOT, relativePath));
  const reportBuild = report.build?.build || report.build;
  if (report.failed !== 0 || report.passed !== report.total || !report.total) {
    throw new Error(`Relatório Chromium inválido: ${relativePath}`);
  }
  const suffix = reportBuild === metadata.build ? '' : ` — relatório de regressão anterior ${reportBuild}`;
  console.log(`REUSED AUDITED BROWSER REPORT ${relativePath} (${report.passed}/${report.total})${suffix}`);
};
run(process.execPath, ['tools/build-contracts.mjs']);
run(process.execPath, ['tools/build-runtime.mjs']);
run(process.execPath, ['tools/build-pwa.mjs']);
run(process.execPath, ['tools/validate-source.mjs']);
run(process.execPath, ['tests/phase1-audit.mjs']);
run(process.execPath, ['tests/phase2-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase3-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase4-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase5-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE5_BROWSER_TESTS.json'); else run('python3', ['tests/phase5-browser-tests.py']);
run(process.execPath, ['tests/phase5-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase6-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE6_BROWSER_TESTS.json'); else run('python3', ['tests/phase6-browser-tests.py']);
run(process.execPath, ['tests/phase6-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase7-unit-tests.mjs', '--report']);
run(process.execPath, ['tests/phase7-service-worker-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE7_BROWSER_TESTS.json'); else run('python3', ['tests/phase7-browser-tests.py']);
run(process.execPath, ['tests/phase7-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase8-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE8_BROWSER_TESTS.json'); else run('python3', ['tests/phase8-browser-tests.py']);
run(process.execPath, ['tests/phase8-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase9-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE9_BROWSER_TESTS.json'); else run('python3', ['tests/phase9-browser-tests.py']);
run(process.execPath, ['tests/phase9-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase10-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE10_BROWSER_TESTS.json'); else run('python3', ['tests/phase10-browser-tests.py']);
run(process.execPath, ['tests/phase10-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase11-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE11_BROWSER_TESTS.json'); else run('python3', ['tests/phase11-browser-tests.py']);
run(process.execPath, ['tests/phase11-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/phase12-unit-tests.mjs', '--report']);
if (reuseBrowserReports) requirePassedBrowserReport('audit/PHASE12_BROWSER_TESTS.json'); else run('python3', ['tests/phase12-browser-tests.py']);
run(process.execPath, ['tests/phase12-audit.mjs', '--prepackage']);
run(process.execPath, ['tests/pipeline-guard.mjs']);

if (!has('--package')) {
  console.log(`STAMPED ${metadata.build}`);
  process.exit(0);
}

const outputDir = path.resolve(value('--output') || path.join(ROOT, 'dist'));
fs.mkdirSync(outputDir, { recursive:true });
const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), 'skyward-release-'));
const folderName = `SKYWARD_CONTROL_${metadata.build}`;
const stage = path.join(tempParent, folderName);
fs.cpSync(ROOT, stage, {
  recursive:true,
  filter: source => {
    const rel = path.relative(ROOT, source).replaceAll(path.sep, '/');
    return !rel || !['dist','node_modules','.git'].some(x => rel === x || rel.startsWith(`${x}/`));
  }
});
fs.rmSync(path.join(stage, 'MANIFEST_SHA256.txt'), { force:true });
const manifestCount = writeManifest(stage);
run(process.execPath, ['tools/verify-integrity.mjs'], stage);
run(process.execPath, ['tests/phase2-audit.mjs'], stage);
run(process.execPath, ['tests/phase3-audit.mjs'], stage);
run(process.execPath, ['tests/phase4-audit.mjs'], stage);
run(process.execPath, ['tests/phase5-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase5-audit.mjs'], stage);
run(process.execPath, ['tests/phase6-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase6-audit.mjs'], stage);
run(process.execPath, ['tests/phase7-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase7-service-worker-tests.mjs'], stage);
run(process.execPath, ['tests/phase7-audit.mjs'], stage);
run(process.execPath, ['tests/phase8-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase8-audit.mjs'], stage);
run(process.execPath, ['tests/phase9-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase9-audit.mjs'], stage);
run(process.execPath, ['tests/phase10-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase10-audit.mjs'], stage);
run(process.execPath, ['tests/phase11-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase11-audit.mjs'], stage);
run(process.execPath, ['tests/phase12-unit-tests.mjs'], stage);
run(process.execPath, ['tests/phase12-audit.mjs'], stage);

const zipPath = path.join(outputDir, `${folderName}.zip`);
fs.rmSync(zipPath, { force:true });
run('zip', ['-qr', zipPath, folderName], tempParent);
const archiveHash = sha256(zipPath);
fs.writeFileSync(`${zipPath}.sha256`, `${archiveHash}  ${path.basename(zipPath)}\n`);
writeJson(`${zipPath}.metadata.json`, { ...metadata, manifestFiles:manifestCount, archive: path.basename(zipPath), sha256:archiveHash });
console.log(`RELEASE ${zipPath}`);
console.log(`SHA256 ${archiveHash}`);
fs.rmSync(tempParent, { recursive:true, force:true });
