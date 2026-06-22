import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/36-crisis-command-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/crisis-command-center.json'),'utf8'));
check('metadados F33+',/^F(33|[4-9][0-9])$/.test(metadata.phase)&&metadata.crisisCommandSchema===1,JSON.stringify(metadata));
check('módulo F33 identificado',source.includes('@skyward-module 36-crisis-command-center'));
check('API congelada',source.includes('window.SKYWARD_CRISIS_COMMAND=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo crises ações recovery',catalog.crisisTypes?.length>=6&&catalog.commandActions?.length>=6&&catalog.recoveryStages?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(41).fill('m'),
    SKYWARD_NETWORK_FLOW:{status:()=>({networkDelayMin:20})},
    SKYWARD_AIRLINE_OPS:{status:()=>({progress:{score:60}})},
    SKYWARD_AIRPORT_AUTHORITY:{status:()=>({progress:{score:62}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.33.0-F33-20260620-2115',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_CRISIS_COMMAND;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const crisis=api.trigger('CYBER_INCIDENT','teste');
  check('crise cyber criada',crisis.id==='CYBER_INCIDENT'&&crisis.status==='ACTIVE',JSON.stringify(crisis));
  const action=api.action('MANUAL_FALLBACK');
  check('ação de comando registrada',action.actionId==='MANUAL_FALLBACK',JSON.stringify(action));
  const eval1=api.evaluate(900,{conflicts:1,runwayIncursions:0,denied:2},false,'SBGR');
  check('crise avaliada',Number.isFinite(eval1.evaluation.crisisScore)&&eval1.evaluation.activeCrisis==='CYBER_INCIDENT',JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém recovery',progress.recoveryStage&&Number.isFinite(progress.score),JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.stakeholders.length>=6,JSON.stringify(status.catalog.stakeholders));
  check('ground stop presente',api.catalog.crisisTypes.some(c=>c.id==='GROUND_STOP'),JSON.stringify(api.catalog.crisisTypes));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase33-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE33_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE33_UNIT_TESTS_SUMMARY.md'),`# Fase 33 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F33 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
