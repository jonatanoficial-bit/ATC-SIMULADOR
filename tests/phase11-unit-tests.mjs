import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/14-deterministic-replay.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
check('metadados F11+',Number(String(metadata.version||'0.0.0').split('.')[1])>=11&&Number(String(metadata.phase||'F00').slice(1))>=11&&metadata.replaySchema===1,JSON.stringify(metadata));
check('marcador de módulo',source.includes('@skyward-module 14-deterministic-replay'));
check('API congelada no código',source.includes('window.SKYWARD_REPLAY=Object.freeze'));
check('seed hash implementado',source.includes('function replayHash'));
check('PRNG mulberry implementado',source.includes('function replayMulberry32'));
check('exportação JSON implementada',source.includes('function replayExport'));
check('importação validada implementada',source.includes('function replayImport'));
check('wrappers start/command',source.includes('originalStartGameF11')&&source.includes('originalCommandF11'));
let classList=new Set(),listeners={},store=new Map(),panel={classList:{add:c=>classList.add(c),remove:c=>classList.delete(c),contains:c=>classList.has(c)},setAttribute:()=>{},querySelector:()=>null};
const context={console,Date,Math,JSON,Number,String,Array,Object,RegExp,Map,Set,performance:{now:()=>1000},setTimeout:(fn)=>{if(typeof fn==='function')fn();return 0;},window:{SKYWARD_MODULES:[],addEventListener:(n,f)=>{listeners[n]=f;}},document:{querySelector:(s)=>s==='#replayPanel'?panel:(s==='#replayStatusValue'?{textContent:''}:s==='#replaySeedValue'?{textContent:''}:s==='#replayExportText'?{value:''}:s==='#replayBadge'?{textContent:''}:null),addEventListener:(n,f)=>{listeners[n]=f;}},profile:{name:'QA',airport:'SBGR',turns:2},BUILD:'SC-1.11.0-F11-20260618-0000',BUILD_INFO:{version:'1.11.0',phase:'F11',replaySchema:1},aircraft:[],requests:[],selected:null,runwayOccupiedBy:null,score:0,stats:{},safeLogError:()=>{},safeStorageSet:(k,v)=>{store.set(k,v);return true;},cloneSafe:v=>JSON.parse(JSON.stringify(v)),setDiagnostic:()=>{},SKYWARD_RANDOM_SOURCE:()=>0.5};
context.window.window=context.window;vm.createContext(context);
try{vm.runInContext(source,context);const api=context.window.SKYWARD_REPLAY;check('API executa em isolamento',!!api);check('schema 1',api.schema===1);const a=api.seedHash('abc'),b=api.seedHash('abc'),c=api.seedHash('xyz');check('hash determinístico',a===b&&a!==c);const self=api.selfCheck();check('selfcheck determinístico',self.ok===true,self);api.beginTurn('seed-1');const r1=[api.random(),api.random(),api.random()].map(n=>n.toFixed(8));api.beginTurn('seed-1');const r2=[api.random(),api.random(),api.random()].map(n=>n.toFixed(8));api.beginTurn('seed-2');const r3=[api.random(),api.random(),api.random()].map(n=>n.toFixed(8));check('mesma seed repete sequência',r1.join('|')===r2.join('|'),r1+' '+r2);check('seed diferente muda sequência',r1.join('|')!==r3.join('|'),r1+' '+r3);api.beginTurn('audit');api.step(0.1);api.record('unit',{x:1});const exported=api.export();check('export schema/build',exported.schema===1&&exported.build===context.BUILD);check('export contém evento',exported.events.some(e=>e.type==='unit'));check('checksum estável',api.checksum({a:1})===api.checksum({a:1}));check('import aceita payload',api.import(exported).ok===true);check('estado resumo seguro',api.summary().events.length<=12);check('storage recebe último replay',store.has('skywardReplayLast_v1'));}catch(e){check('API executa em isolamento',false,e.stack||e.message);}
const failed=checks.filter(c=>!c.ok);const report={schema:1,suite:'phase11-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){fs.mkdirSync(path.join(root,'audit'),{recursive:true});fs.writeFileSync(path.join(root,'audit/PHASE11_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(root,'audit/PHASE11_UNIT_TESTS_SUMMARY.md'),`# Fase 11 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);} 
console.log(`Skyward Control F11 unit tests: ${report.passed}/${report.total} aprovados`);for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);if(failed.length)process.exit(1);
