import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/50-ground-handling-turnaround-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/ground-turnaround.json'),'utf8'));
check('metadados F47+',/^F(47|[5-9][0-9])$/.test(metadata.phase)&&metadata.groundTurnaroundSchema===1,JSON.stringify(metadata));
check('módulo F47 identificado',source.includes('@skyward-module 50-ground-handling-turnaround-center'));
check('API congelada',source.includes('window.SKYWARD_GROUND_TURNAROUND=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo processes delays programs',catalog.turnaroundProcesses?.length>=8&&catalog.delayCauses?.length>=7&&catalog.improvementPrograms?.length>=7);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(56).fill('m'),
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:84}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:82}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:80}})},
    SKYWARD_ASSET_MAINTENANCE:{status:()=>({progress:{score:83}})},
    SKYWARD_WEATHER_OPS:{status:()=>({progress:{score:78}})},
    SKYWARD_SURFACE_SAFETY:{status:()=>({progress:{score:84}})},
    SKYWARD_RADIO_PHRASEOLOGY:{status:()=>({progress:{score:86}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.47.0-F47-20260623-1115',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_GROUND_TURNAROUND;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('GATE_OPTIMIZER');
  check('programa de solo criado',program.programId==='GATE_OPTIMIZER'&&program.status==='ACTIVE',JSON.stringify(program));
  const delay=api.delay('FUEL_QUEUE');
  check('atraso de solo criado',delay.delayId==='FUEL_QUEUE'&&delay.status==='OPEN',JSON.stringify(delay));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('turnaround avaliado',Number.isFinite(eval1.evaluation.turnaroundScore)&&Number.isFinite(eval1.evaluation.avgTurnaroundMin),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém solo',Number.isFinite(progress.score)&&progress.status&&Number.isFinite(progress.avgTurnaroundMin),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.turnaroundBands.length>=4,JSON.stringify(status.catalog.turnaroundBands));
  check('processos essenciais presentes',api.catalog.turnaroundProcesses.some(p=>p.id==='PUSHBACK')&&api.catalog.turnaroundProcesses.some(p=>p.id==='FUELING'),JSON.stringify(api.catalog.turnaroundProcesses));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase47-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE47_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE47_UNIT_TESTS_SUMMARY.md'),`# Fase 47 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F47 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
