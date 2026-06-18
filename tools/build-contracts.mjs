import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT, readJson, writeJson } from './release-lib.mjs';

const args=new Set(process.argv.slice(2));
const checkOnly=args.has('--check');
const tsconfig=path.join(ROOT,'tsconfig.json');
const output=path.join(ROOT,'src/runtime/00-typescript-contracts.js');
const manifestPath=path.join(ROOT,'contracts-manifest.json');
const sources=['src/types/domain.ts','src/contracts/runtime-contracts.ts'];
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const fail=message=>{throw new Error(`TypeScript contracts: ${message}`);};
if(!fs.existsSync(tsconfig)) fail('tsconfig.json ausente');
for(const rel of sources) if(!fs.existsSync(path.join(ROOT,rel))) fail(`fonte ausente: ${rel}`);

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'skyward-contracts-'));
const tempOutput=path.join(temp,'contracts.js');
const config=readJson(tsconfig);
const compile=spawnSync('tsc',['-p',tsconfig,'--outFile',tempOutput,'--pretty','false'],{cwd:ROOT,encoding:'utf8'});
if(compile.status!==0){
  fs.rmSync(temp,{recursive:true,force:true});
  fail(`compilação falhou\n${compile.stdout||''}${compile.stderr||''}`.trim());
}
let generated=fs.readFileSync(tempOutput,'utf8').replace(/\r\n/g,'\n').trimEnd()+'\n';
fs.rmSync(temp,{recursive:true,force:true});
if(!generated.includes('@skyward-module 00-typescript-contracts')) fail('marcador de módulo removido pela compilação');
if(!generated.includes('window.SKYWARD_CONTRACTS')) fail('API de contratos não foi emitida');
const sourceAudit=sources.map(rel=>{
  const content=fs.readFileSync(path.join(ROOT,rel),'utf8').replace(/\r\n/g,'\n');
  return {file:rel,lines:content.split('\n').length-1,bytes:Buffer.byteLength(content),sha256:sha(content)};
});
const manifest={schema:1,contractSchema:2,typescript:'5.8+',strict:true,tsconfig:'tsconfig.json',sources:sourceAudit,output:{file:'src/runtime/00-typescript-contracts.js',lines:generated.split('\n').length-1,bytes:Buffer.byteLength(generated),sha256:sha(generated)}};
if(checkOnly){
  const current=fs.existsSync(output)?fs.readFileSync(output,'utf8').replace(/\r\n/g,'\n'):'';
  if(current!==generated) fail('JavaScript gerado está desatualizado; execute npm run build:contracts');
  const stored=fs.existsSync(manifestPath)?readJson(manifestPath):null;
  if(!stored || stored.output?.sha256!==manifest.output.sha256 || stored.contractSchema!==manifest.contractSchema) fail('contracts-manifest.json desatualizado');
  console.log(`TypeScript contracts check: ${sources.length} fontes, SHA-256 ${manifest.output.sha256}`);
  process.exit(0);
}
fs.writeFileSync(output,generated,'utf8');
writeJson(manifestPath,manifest);
console.log(`TypeScript contracts built: ${sources.length} fontes, ${manifest.output.lines} linhas, SHA-256 ${manifest.output.sha256}`);
