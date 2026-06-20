import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/31-training-academy-certification.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/training-academy-scenarios.json'),'utf8'));
check('metadados F28+',/^F(28|[3-9][0-9])$/.test(metadata.phase)&&metadata.trainingAcademySchema===1,JSON.stringify(metadata));
check('módulo F28 identificado',source.includes('@skyward-module 31-training-academy-certification'));
check('API congelada',source.includes('window.SKYWARD_TRAINING_ACADEMY=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo tracks missions exams',catalog.tracks?.length>=6&&catalog.missions?.length>=7&&catalog.exams?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(36).fill('m'), SKYWARD_NETWORK_FLOW:{status:()=>({slotCompliance:.9,connectionsProtected:2})}, SKYWARD_INCIDENTS:{state:()=>({agencies:{ARFF:true}})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.28.0-F28-20260620-1745',
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_TRAINING_ACADEMY;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const mission=api.start('TWR_01');
  check('start missão básica',mission.id==='TWR_01'&&mission.track==='BASIC_TOWER',JSON.stringify(mission));
  const eval1=api.evaluate(1200,{landed:1,departed:1,conflicts:0,runwayIncursions:0,denied:0,commands:5},false,'SBSP');
  check('missão saudável aprova',eval1.attempt.passed===true,JSON.stringify(eval1.attempt));
  const exam=api.exam('EXAM_TOWER_LOCAL');
  check('exame iniciado',exam.exam.id==='EXAM_TOWER_LOCAL',JSON.stringify(exam.exam));
  const fail=api.evaluate(300,{landed:0,departed:0,conflicts:1,runwayIncursions:1,denied:2,commands:1},false,'SBSP');
  check('falha gera remediação',fail.attempt.passed===false&&fail.attempt.remediation,JSON.stringify(fail.attempt));
  const progress=api.progress();
  check('progresso calculado',progress.total>=7&&progress.completed>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.rubric.length>=4,JSON.stringify(status.catalog.rubric));
  check('trilhas avançadas presentes',api.catalog.tracks.some(t=>t.id==='EMERGENCY_OPS') && api.catalog.tracks.some(t=>t.id==='NETWORK_FLOW'),JSON.stringify(api.catalog.tracks));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase28-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE28_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE28_UNIT_TESTS_SUMMARY.md'),`# Fase 28 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F28 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
