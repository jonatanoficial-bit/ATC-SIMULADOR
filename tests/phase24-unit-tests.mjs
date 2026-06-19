import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/27-gold-master-package.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/gold-master-package.json'),'utf8'));
check('metadados F24+',/^F(24|[3-9][0-9])$/.test(metadata.phase)&&metadata.goldMasterSchema===1,JSON.stringify(metadata));
check('módulo F24 identificado',source.includes('@skyward-module 27-gold-master-package'));
check('API congelada',source.includes('window.SKYWARD_GOLD_MASTER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo gates manual store',catalog.goldMasterGates?.length>=9&&catalog.manualSections?.length>=10&&catalog.storeChecklist?.length>=8);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(32).fill('m'),SKYWARD_BUILD_INFO:{}, SKYWARD_RELEASE_CANDIDATE:{status:()=>({gates:{score:96},publication:[]})}, SKYWARD_COMMERCIAL_POLISH:{status:()=>({readiness:{score:100}})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.24.0-F24-20260619-1402',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_GOLD_MASTER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const gates=api.gates();
  check('gates GM calculados',gates.score>=80&&gates.gates.length>=9,JSON.stringify(gates));
  const store=api.store();
  check('store checklist disponível',store.length>=8&&store.some(i=>i.manualCapture),JSON.stringify(store));
  const manual=api.manual();
  check('manual possui seções',manual.length>=10&&manual[0].order===1,JSON.stringify(manual.slice(0,2)));
  const init=api.init();
  check('init retorna gates',init.score>=80,JSON.stringify(init));
  const result=api.evaluate(4200,{landed:5},false,'SBGR');
  check('evaluate gera entry GM',result.entry.gmScore>=80&&result.entry.airport==='SBGR',JSON.stringify(result.entry));
  const status=api.status();
  check('status contém store manual notes',status.store&&status.manual&&status.notes,JSON.stringify(status.notes));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase24-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE24_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE24_UNIT_TESTS_SUMMARY.md'),`# Fase 24 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F24 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
