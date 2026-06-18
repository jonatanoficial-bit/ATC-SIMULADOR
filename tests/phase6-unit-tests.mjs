import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportMode=process.argv.includes('--report');
const source=fs.readFileSync(path.join(root,'src/runtime/02-save-vault.js'),'utf8');
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});
const store=new Map();
const localStorage={
  getItem:key=>store.has(String(key))?store.get(String(key)):null,
  setItem:(key,value)=>store.set(String(key),String(value)),
  removeItem:key=>store.delete(String(key)),clear:()=>store.clear(),
  key:index=>Array.from(store.keys())[index]||null,get length(){return store.size;}
};
const sandbox={window:{SKYWARD_MODULES:[],SKYWARD_BUILD_INFO:{build:'SC-1.6.0-F06-TEST'}},localStorage,TextEncoder,Date,Math,JSON,Object,Array,Number,String,Boolean,Uint8Array,Uint32Array,DataView,Set,Map,console};
vm.createContext(sandbox);vm.runInContext(source,sandbox,{filename:'02-save-vault.js'});
const vault=sandbox.window.SKYWARD_SAVE_VAULT;
check('API do vault criada',!!vault&&Object.isFrozen(vault));
check('schema do vault é 1',vault.vaultSchema===1);
check('SHA-256 conhecido',vault.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',vault.sha256('abc'));
check('serialização canônica independe da ordem',vault.canonicalize({b:2,a:1})===vault.canonicalize({a:1,b:2}));
check('hash canônico independe da ordem',vault.hashCanonical({b:2,a:1})===vault.hashCanonical({a:1,b:2}));
const validate=value=>({ok:Boolean(value&&Number.isFinite(value.score)&&Number.isInteger(value.schema))});
let result=vault.write('snapshot',{schema:3,score:100},{saveSchema:3,expectedSaveSchema:3,validate,reason:'first'});
check('primeira transação é confirmada',result.ok&&result.revision===1,JSON.stringify(result));
let inspect=vault.inspect('snapshot');
check('primeiro save ocupa slot primário',inspect.slots.primary.exists&&!inspect.slots.backup.exists);
result=vault.write('snapshot',{schema:3,score:200},{saveSchema:3,expectedSaveSchema:3,validate,reason:'second'});
check('segunda transação incrementa revisão',result.ok&&result.revision===2,JSON.stringify(result));
inspect=vault.inspect('snapshot');
check('segunda transação cria backup',inspect.slots.backup.exists&&inspect.slots.backup.value.payload.score===100);
let read=vault.read('snapshot',{expectedSaveSchema:3,validate});
check('leitura retorna versão primária mais recente',read.ok&&read.payload.score===200&&read.source==='primary',JSON.stringify(read));
localStorage.setItem(vault.storageKey('snapshot','primary'),'{broken-json');
read=vault.read('snapshot',{expectedSaveSchema:3,validate});
check('JSON corrompido aciona rollback automático',read.ok&&read.payload.score===100&&read.source==='backup'&&read.recovered,JSON.stringify(read));
inspect=vault.inspect('snapshot');
check('save corrompido é enviado à quarentena',inspect.slots.quarantine.exists&&inspect.slots.quarantine.value.length>=1);
check('rollback restaura slot primário válido',vault.inspectEnvelope(inspect.slots.primary.value,'snapshot',{expectedSaveSchema:3,validate}).ok);
// Rebuild two healthy revisions for hash tampering tests.
vault.clear('snapshot');
vault.write('snapshot',{schema:3,score:300},{saveSchema:3,expectedSaveSchema:3,validate,reason:'base'});
vault.write('snapshot',{schema:3,score:400},{saveSchema:3,expectedSaveSchema:3,validate,reason:'latest'});
inspect=vault.inspect('snapshot');
const tampered=inspect.slots.primary.value;tampered.payload.score=999;
localStorage.setItem(vault.storageKey('snapshot','primary'),JSON.stringify(tampered));
read=vault.read('snapshot',{expectedSaveSchema:3,validate});
check('adulteração do payload é detectada pelo SHA-256',read.ok&&read.payload.score===300&&read.source==='backup',JSON.stringify(read));
// Confirm a journal whose primary already equals next.
vault.clear('journalcase');
vault.write('journalcase',{schema:3,score:10},{saveSchema:3,expectedSaveSchema:3,validate});
vault.write('journalcase',{schema:3,score:20},{saveSchema:3,expectedSaveSchema:3,validate});
let ji=vault.inspect('journalcase');
let journal=vault.createJournal('journalcase',ji.slots.backup.value,ji.slots.primary.value);
localStorage.setItem(vault.storageKey('journalcase','journal'),JSON.stringify(journal));
read=vault.read('journalcase',{expectedSaveSchema:3,validate});
check('journal confirmado após commit interrompido',read.ok&&read.payload.score===20&&read.journalRecovery.action==='commit-confirmed',JSON.stringify(read));
check('journal confirmado é removido',!vault.inspect('journalcase').slots.journal.exists);
// Roll back a prepared transaction when primary is still previous.
const next=vault.createEnvelope('journalcase',{schema:3,score:30},{saveSchema:3,revision:3,reason:'pending'},ji.slots.primary.value);
journal=vault.createJournal('journalcase',ji.slots.primary.value,next);
localStorage.setItem(vault.storageKey('journalcase','journal'),JSON.stringify(journal));
localStorage.setItem(vault.storageKey('journalcase','primary'),JSON.stringify(ji.slots.primary.value));
read=vault.read('journalcase',{expectedSaveSchema:3,validate});
check('transação preparada incompleta sofre rollback',read.ok&&read.payload.score===20&&read.journalRecovery.action==='rolled-back',JSON.stringify(read));
// Migration from an older valid envelope.
vault.clear('migration');
vault.write('migration',{schema:2,score:55},{saveSchema:2,expectedSaveSchema:2,validate:value=>({ok:value?.schema===2})});
read=vault.read('migration',{expectedSaveSchema:3,validate,migrate:value=>({ok:true,payload:{...value,schema:3,score:value.score+1},migratedFrom:2})});
check('envelope antigo é migrado automaticamente',read.ok&&read.payload.schema===3&&read.payload.score===56&&read.migrated,JSON.stringify(read));
check('migração grava envelope no schema atual',vault.inspect('migration').slots.primary.value.saveSchema===3);
// Legacy raw import.
vault.clear('legacy');localStorage.setItem('legacyRaw',JSON.stringify({schema:2,score:70}));
read=vault.read('legacy',{expectedSaveSchema:3,validate,migrate:value=>({ok:true,payload:{...value,schema:3,score:value.score+2},migratedFrom:2}),legacyKeys:['legacyRaw']});
check('save legado sem envelope é importado',read.ok&&read.source==='legacy'&&read.payload.score===72,JSON.stringify(read));
check('save legado importado recebe integridade',vault.inspect('legacy').slots.primary.value.hashAlgorithm==='SHA-256');
// Future schema must not replace a known-good backup.
vault.clear('future');vault.write('future',{schema:3,score:80},{saveSchema:3,expectedSaveSchema:3,validate});vault.write('future',{schema:3,score:90},{saveSchema:3,expectedSaveSchema:3,validate});
inspect=vault.inspect('future');
const future=vault.createEnvelope('future',{schema:99,score:999},{saveSchema:99,revision:3,reason:'future'},inspect.slots.primary.value);
localStorage.setItem(vault.storageKey('future','primary'),JSON.stringify(future));
read=vault.read('future',{expectedSaveSchema:3,validate});
check('schema futuro desconhecido é rejeitado',read.ok&&read.payload.score===80&&read.source==='backup',JSON.stringify(read));
result=vault.write('invalid',{schema:3,score:'bad'},{saveSchema:3,expectedSaveSchema:3,validate});
check('payload contratualmente inválido não é gravado',!result.ok&&result.reason==='payload_contract');
check('diagnósticos registram commits e recuperações',vault.getDiagnostics().some(item=>item.event==='write-committed')&&vault.getDiagnostics().some(item=>item.event==='automatic-rollback'));

const failed=checks.filter(item=>!item.ok);
const report={schema:1,suite:'phase6-unit',build:'SC-1.6.0-F06-TEST',passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
  report.build=metadata.build;
  const audit=path.join(root,'audit');fs.mkdirSync(audit,{recursive:true});
  fs.writeFileSync(path.join(audit,'PHASE6_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  const lines=['# Fase 06 — Testes unitários do save vault','',`- Resultado: **${report.passed}/${report.total} aprovados**`,`- Build: \`${report.build}\``,'','## Verificações',...checks.map(item=>`- [${item.ok?'x':' '}] ${item.name}`)];
  fs.writeFileSync(path.join(audit,'PHASE6_UNIT_TESTS_SUMMARY.md'),lines.join('\n')+'\n');
}
console.log(`Skyward Control F06 unit tests: ${report.passed}/${report.total} aprovados`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
