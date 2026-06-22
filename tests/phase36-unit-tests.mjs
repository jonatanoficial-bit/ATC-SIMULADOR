import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/39-environment-sustainability-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/environment-sustainability.json'),'utf8'));
check('metadados F36+',/^F(36|[4-9][0-9])$/.test(metadata.phase)&&metadata.environmentSustainabilitySchema===1,JSON.stringify(metadata));
check('módulo F36 identificado',source.includes('@skyward-module 39-environment-sustainability-center'));
check('API congelada',source.includes('window.SKYWARD_ENVIRONMENT_SUSTAINABILITY=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo metrics initiatives events',catalog.environmentMetrics?.length>=6&&catalog.greenInitiatives?.length>=6&&catalog.environmentEvents?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(44).fill('m'),
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:84}})},
    SKYWARD_INFRASTRUCTURE_EXPANSION:{status:()=>({progress:{risk:12}})},
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:80}})},
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:88}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.36.0-F36-20260622-1045',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_ENVIRONMENT_SUSTAINABILITY;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const green=api.initiative('CDA_APPROACH');
  check('iniciativa verde criada',green.initiativeId==='CDA_APPROACH'&&green.status==='ACTIVE',JSON.stringify(green));
  const event=api.event('COMMUNITY_COMPLAINT');
  check('evento ambiental criado',event.eventId==='COMMUNITY_COMPLAINT'&&event.status==='OPEN',JSON.stringify(event));
  const eval1=api.evaluate(2200,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('ESG avaliado',Number.isFinite(eval1.evaluation.esgScore)&&eval1.evaluation.permitStatus,JSON.stringify(eval1.evaluation));
  api.close(event.id,true);
  const progress=api.progress();
  check('progress contém ESG',Number.isFinite(progress.score)&&progress.status&&progress.permitStatus,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.esgBands.length>=4,JSON.stringify(status.catalog.esgBands));
  check('métricas essenciais presentes',api.catalog.environmentMetrics.some(m=>m.id==='NOISE')&&api.catalog.environmentMetrics.some(m=>m.id==='CO2'),JSON.stringify(api.catalog.environmentMetrics));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase36-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE36_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE36_UNIT_TESTS_SUMMARY.md'),`# Fase 36 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F36 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
