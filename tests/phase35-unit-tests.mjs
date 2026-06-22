import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/38-infrastructure-expansion-program.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/infrastructure-expansion.json'),'utf8'));
check('metadados F35+',/^F(35|[4-9][0-9])$/.test(metadata.phase)&&metadata.infrastructureExpansionSchema===1,JSON.stringify(metadata));
check('módulo F35 identificado',source.includes('@skyward-module 38-infrastructure-expansion-program'));
check('API congelada',source.includes('window.SKYWARD_INFRASTRUCTURE_EXPANSION=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo projects maintenance funding',catalog.projects?.length>=6&&catalog.maintenancePrograms?.length>=4&&catalog.fundingSources?.length>=4);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(43).fill('m'),
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:82}})},
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:80}})},
    SKYWARD_SAFETY_COMPLIANCE:{status:()=>({progress:{score:78}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.35.0-F35-20260620-2245',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_INFRASTRUCTURE_EXPANSION;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const project=api.start('ILS_UPGRADE','PUBLIC_GRANT');
  check('obra iniciada',project.projectId==='ILS_UPGRADE'&&project.status==='ACTIVE',JSON.stringify(project));
  const maint=api.maintenance('RADAR_CALIBRATION');
  check('manutenção registrada',maint.programId==='RADAR_CALIBRATION',JSON.stringify(maint));
  const eval1=api.evaluate(2600,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('infra avaliada',Number.isFinite(eval1.evaluation.capacityScore)&&Number.isFinite(eval1.evaluation.reliabilityScore),JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém CAPEX',Number.isFinite(progress.budget)&&progress.activeProjects>=1,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.capacityBands.length>=4,JSON.stringify(status.catalog.capacityBands));
  check('projetos essenciais presentes',api.catalog.projects.some(p=>p.id==='RWY_REHAB')&&api.catalog.projects.some(p=>p.id==='TML_EXPANSION'),JSON.stringify(api.catalog.projects));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase35-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE35_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE35_UNIT_TESTS_SUMMARY.md'),`# Fase 35 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F35 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
