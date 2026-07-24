import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const testsDir = path.join(ROOT, 'tests');
const unitTests = fs.readdirSync(testsDir)
  .filter(name => /^phase\d+-unit-tests\.mjs$/i.test(name))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
const suites = [
  ...unitTests,
  'phase7-service-worker-tests.mjs',
  'pipeline-guard.mjs',
  'commercial-release-regression.mjs'
];
const startedAt = new Date().toISOString();
const results = [];

for (const file of suites) {
  const started = Date.now();
  const run = spawnSync(process.execPath, [path.join(testsDir, file)], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024
  });
  const item = {
    file,
    ok: run.status === 0,
    exitCode: run.status,
    durationMs: Date.now() - started,
    output: String(run.stdout || '').trim(),
    error: String(run.stderr || run.error?.message || '').trim()
  };
  results.push(item);
  console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${file} (${item.durationMs} ms)`);
  if (!item.ok) {
    if (item.output) console.error(item.output);
    if (item.error) console.error(item.error);
  }
}

const failed = results.filter(item => !item.ok);
const report = {
  schema: 1,
  suite: 'current-release-regression',
  startedAt,
  finishedAt: new Date().toISOString(),
  passed: results.length - failed.length,
  failed: failed.length,
  total: results.length,
  results
};
fs.mkdirSync(path.join(ROOT, 'audit'), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, 'audit', 'CURRENT_RELEASE_TESTS.json'),
  `${JSON.stringify(report, null, 2)}\n`
);
console.log(`Current release regression: ${report.passed}/${report.total} suites approved`);
if (failed.length) process.exit(1);
