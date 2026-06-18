import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const json = name => JSON.parse(read(name));
const prepackage = process.argv.includes('--prepackage');
const config = json('config/release.json');
const metadata = json('release-metadata.json');
const runtime = read('build-info.js');
const checks=[];
const check=(name, condition)=>checks.push({name,ok:Boolean(condition)});

for (const field of ['product','version','phase','phaseName','channel','saveSchema','target','build','builtAt','builtAtIso']) {
  check(`fonte única consistente: ${field}`, config[field]===metadata[field]);
}
const semver = metadata.version.split('.').map(Number);
const phaseNumber = Number(String(metadata.phase).replace('F',''));
check('baseline F02 preservada', (semver[0]>1 || (semver[0]===1 && semver[1]>=2)) && phaseNumber>=2);
const escapedVersion = metadata.version.replace(/\./g, '\\.');
check('build oficial válida', new RegExp(`^SC-${escapedVersion}-${metadata.phase}-\\d{8}-\\d{4}$`).test(metadata.build));
check('runtime gerado contém build', runtime.includes(metadata.build));
check('runtime gerado contém fase', runtime.includes(`"phase": "${metadata.phase}"`));
check('version.txt gerado', read('version.txt').includes(metadata.build));
check('RELEASE.txt gerado', read('RELEASE.txt').includes(metadata.build));
check('BUILD_NOTES gerado', read('BUILD_NOTES.md').includes(metadata.build));
check('histórico contém build', json('BUILD_HISTORY.json').some(item=>item.build===metadata.build));
check('package.json sincronizado', json('package.json').version===metadata.version);
check('scripts npm disponíveis', ['validate','test','release','verify:integrity','build:runtime'].every(key=>json('package.json').scripts[key]));
check('pipeline sem dependências externas npm', !json('package.json').dependencies && !json('package.json').devDependencies);
check('release valida antes de empacotar', read('tools/release.mjs').includes('tools/validate-source.mjs') && read('tools/release.mjs').includes('tests/phase1-audit.mjs') && read('tools/release.mjs').includes('tests/pipeline-guard.mjs'));
check('reempacotamento preserva stamp auditado', read('tools/release.mjs').includes('--reuse-stamp'));
check('manifesto gerado no staging', read('tools/release.mjs').includes('writeManifest(stage)'));
check('checksum externo do ZIP', read('tools/release.mjs').includes(`${'zipPath'}.sha256`) || read('tools/release.mjs').includes('`${zipPath}.sha256`'));
check('metadados não hardcoded no HTML', !/SC-1\.\d+\.\d+-F\d{2}-/.test(read('index.html')));
check('build-info precede main.js', read('index.html').indexOf('build-info.js') < read('index.html').indexOf('main.js'));
check('snapshot independe da fase', read('main.js').includes('skywardGoodState_v${BUILD_INFO.schema}'));
check('config SemVer', /^\d+\.\d+\.\d+$/.test(config.version));
check('data ISO BRT', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-03:00$/.test(metadata.builtAtIso));
if (!prepackage) {
  check('manifesto presente no release', fs.existsSync(path.join(root,'MANIFEST_SHA256.txt')));
  const verify=spawnSync(process.execPath,['tools/verify-integrity.mjs'],{cwd:root,encoding:'utf8'});
  check('manifesto íntegro', verify.status===0);
}
const failed=checks.filter(x=>!x.ok);
console.log(`Skyward Control F02 audit: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}`);
if(failed.length) process.exit(1);
