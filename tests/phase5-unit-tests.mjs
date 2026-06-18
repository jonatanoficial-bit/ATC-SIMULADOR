import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const reportMode=process.argv.includes('--report');
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});
const approx=(actual,expected,tolerance=1e-9)=>Math.abs(actual-expected)<=tolerance;

const sandbox={window:{SKYWARD_MODULES:[]},console,Math,Object,Number,String,Date,JSON,URLSearchParams};
vm.createContext(sandbox);
const source=fs.readFileSync(path.join(root,'src/runtime/00-quality-kernel.js'),'utf8');
try{
  vm.runInContext(source,sandbox,{filename:'00-quality-kernel.js'});
  check('kernel executa isoladamente',true);
}catch(error){
  check('kernel executa isoladamente',false,error.stack||error.message);
}
const q=sandbox.window.SKYWARD_QUALITY_KERNEL;
check('API global disponível',!!q);
check('schema de teste do kernel',q?.schema===1);
check('versão do kernel',q?.version==='1.0.0');
check('kernel congelado',Object.isFrozen(q));
check('tabelas congeladas',Object.isFrozen(q?.tables));
check('módulo registrado',sandbox.window.SKYWARD_MODULES.includes('00-quality-kernel'));

const clampCases=[
  [-10,0,100,0],[0,0,100,0],[42,0,100,42],[100,0,100,100],[999,0,100,100],
  [-5,-10,-1,-5],[-99,-10,-1,-10],[4.5,4,5,4.5]
];
for(const [value,min,max,expected] of clampCases) check(`clamp ${value} em [${min},${max}]`,q.clamp(value,min,max)===expected);

const headingCases=[[-720,0],[-370,350],[-10,350],[0,0],[90,90],[359,359],[360,0],[725,5]];
for(const [value,expected] of headingCases) check(`normalize heading ${value}`,q.normalizeHeading(value)===expected);

const turnCases=[[0,10,10],[10,0,-10],[350,10,20],[10,350,-20],[0,180,-180],[180,0,-180],[270,90,-180],[90,270,-180]];
for(const [from,to,expected] of turnCases) check(`shortest turn ${from}->${to}`,q.shortestTurn(from,to)===expected);

const distanceCases=[
  [{x:0,y:0},{x:3,y:4},5],
  [{x:3,y:4},{x:0,y:0},5],
  [{x:10,y:10},{x:10,y:10},0],
  [{x:-2,y:-3},{x:1,y:1},5],
  [{x:0,y:0},{x:6,y:8},10]
];
for(const [a,b,expected] of distanceCases) check(`distance ${JSON.stringify(a)} ${JSON.stringify(b)}`,approx(q.distance(a,b),expected));

const headingToCases=[
  [{x:0,y:0},{x:1,y:0},0],
  [{x:0,y:0},{x:0,y:1},90],
  [{x:0,y:0},{x:-1,y:0},180],
  [{x:0,y:0},{x:0,y:-1},270],
  [{x:1,y:1},{x:2,y:2},45],
  [{x:1,y:1},{x:0,y:0},225]
];
for(const [a,b,expected] of headingToCases) check(`headingTo ${expected}`,approx(q.headingTo(a,b),expected));

const rangeCases=[[0,10,0,0],[0,10,1,10],[0,10,.5,5],[-5,5,.25,-2.5],[10,20,2,20],[10,20,-2,10]];
for(const [min,max,unit,expected] of rangeCases) check(`range ${min}-${max} @ ${unit}`,approx(q.range(min,max,unit),expected));

const now=100_000;
const priorityCases=[
  [{priority:'urgent',type:'emergency',time:now},520],
  [{priority:'warn',type:'landing',time:now},280],
  [{priority:'normal',type:'takeoff',time:now},160],
  [{priority:'normal',type:'pushback',time:now},105],
  [{priority:'warn',type:'lowfuel',time:now},340],
  [{priority:'warn',type:'panpan',time:now},310],
  [{priority:'normal',type:'taxi',time:now-30_000},145],
  [{priority:'unknown',type:'unknown',time:now-10_000},90]
];
for(const [request,expected] of priorityCases) check(`priority ${request.priority}/${request.type}`,approx(q.requestPriorityScore(request,now),expected));
check('emergência supera pouso normal',q.requestPriorityScore({priority:'urgent',type:'emergency',time:now},now)>q.requestPriorityScore({priority:'normal',type:'landing',time:now-60_000},now));
check('idade aumenta prioridade',q.requestPriorityScore({priority:'normal',type:'taxi',time:0},now)>q.requestPriorityScore({priority:'normal',type:'taxi',time:now},now));

const wakeCases=[
  ['H','H',1,5],['H','M',1,6],['H','L',1,7],['M','M',1,4],['M','L',1,5],['L','L',1,3],
  ['H','M',1.5,9],['X','X',1,4],['M','M',0.5,4]
];
for(const [lead,trail,wx,expected] of wakeCases) check(`wake ${lead}-${trail} x${wx}`,approx(q.wakeSpacing(lead,trail,wx),expected));
const custom={'M-M':7};
check('wake usa tabela operacional injetada',q.wakeSpacing('M','M',1,custom)===7);

let mutationBlocked=false;
try{ q.schema=99; }catch{ mutationBlocked=true; }
check('API não aceita mutação',mutationBlocked || q.schema===1);
check('funções essenciais presentes',['clamp','normalizeHeading','shortestTurn','distance','headingTo','range','requestPriorityScore','wakeSpacing'].every(name=>typeof q?.[name]==='function'));

const failed=checks.filter(item=>!item.ok);
const report={suite:'phase5-unit',schema:1,build:null,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
try{
  const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
  report.build=metadata.build;
}catch{}
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE5_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  const lines=['# Fase 05 — Testes unitários','',`- Resultado: **${report.passed}/${report.total} aprovados**`,`- Build: \`${report.build||'N/A'}\``,'','## Verificações',...checks.map(item=>`- [${item.ok?'x':' '}] ${item.name}`),''];
  fs.writeFileSync(path.join(root,'audit/PHASE5_UNIT_TESTS_SUMMARY.md'),lines.join('\n'));
}
console.log(`Skyward Control F05 unit tests: ${report.passed}/${report.total} aprovados`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
