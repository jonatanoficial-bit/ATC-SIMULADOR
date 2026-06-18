import fs from 'node:fs';
import path from 'node:path';
import { ROOT, sha256 } from './release-lib.mjs';

const manifestPath = path.join(ROOT, 'MANIFEST_SHA256.txt');
if (!fs.existsSync(manifestPath)) {
  console.error('FAIL  MANIFEST_SHA256.txt ausente');
  process.exit(1);
}
const rows = fs.readFileSync(manifestPath, 'utf8').split(/\r?\n/).filter(Boolean);
const failures = [];
for (const row of rows) {
  const match = row.match(/^([a-f0-9]{64})  (.+)$/);
  if (!match) { failures.push(`linha inválida: ${row}`); continue; }
  const [, expected, rel] = match;
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { failures.push(`arquivo ausente: ${rel}`); continue; }
  const actual = sha256(file);
  if (actual !== expected) failures.push(`checksum divergente: ${rel}`);
}
console.log(`Integrity verification: ${rows.length - failures.length}/${rows.length} arquivos íntegros`);
for (const failure of failures) console.log(`FAIL  ${failure}`);
if (failures.length) process.exit(1);
