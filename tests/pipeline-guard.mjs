import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { validateConfig, buildMetadata, saoPauloStamp, writeManifest, sha256 } from '../tools/release-lib.mjs';

const base={
  product:'Skyward Control', prefix:'SC', version:'1.2.0', phase:'F02',
  phaseName:'Pipeline Profissional', channel:'alpha', saveSchema:2, contractSchema:1, testSchema:1, saveVaultSchema:1, pwaSchema:1, cacheSchema:1, uxSchema:1, desktopSchema:1, accessibilitySchema:1, replaySchema:1, aircraftPerformanceSchema:1,
  target:'Mobile-first / Tablet / Desktop', timeZone:'America/Sao_Paulo'
};
const checks=[];
const check=(name,condition)=>checks.push({name,ok:Boolean(condition)});
const rejects=cfg=>{ try{ validateConfig(cfg); return false; }catch{return true;} };

check('configuração válida aceita', validateConfig({...base})===true);
check('SemVer inválido bloqueado', rejects({...base,version:'1.2'}));
check('fase inválida bloqueada', rejects({...base,phase:'FASE2'}));
check('schema inválido bloqueado', rejects({...base,saveSchema:0}));
check('contract schema inválido bloqueado', rejects({...base,contractSchema:0}));
check('test schema inválido bloqueado', rejects({...base,testSchema:0}));
check('save vault schema inválido bloqueado', rejects({...base,saveVaultSchema:0}));
check('PWA schema inválido bloqueado', rejects({...base,pwaSchema:0}));
check('cache schema inválido bloqueado', rejects({...base,cacheSchema:0}));
check('UX schema inválido bloqueado', rejects({...base,uxSchema:0}));
check('desktop schema inválido bloqueado', rejects({...base,desktopSchema:0}));
check('accessibility schema inválido bloqueado', rejects({...base,accessibilitySchema:0}));
check('replay schema inválido bloqueado', rejects({...base,replaySchema:0}));
check('aircraft performance schema inválido bloqueado', rejects({...base,aircraftPerformanceSchema:0}));
const deterministic=buildMetadata(base,new Date('2026-06-17T15:30:00Z'));
check('build determinística em BRT', deterministic.build==='SC-1.2.0-F02-20260617-1230');
check('timestamp BRT determinístico', saoPauloStamp(new Date('2026-06-17T15:30:00Z')).display==='2026-06-17 12:30 BRT');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'skyward-guard-'));
fs.writeFileSync(path.join(temp,'sample.txt'),'original');
const count=writeManifest(temp);
const line=fs.readFileSync(path.join(temp,'MANIFEST_SHA256.txt'),'utf8').trim();
const expected=line.split('  ')[0];
check('manifesto inclui arquivo', count===1 && line.endsWith('sample.txt'));
fs.writeFileSync(path.join(temp,'sample.txt'),'alterado');
check('adulteração muda SHA-256', sha256(path.join(temp,'sample.txt'))!==expected);
fs.rmSync(temp,{recursive:true,force:true});

const failed=checks.filter(x=>!x.ok);
console.log(`Pipeline guard: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}`);
if(failed.length) process.exit(1);
