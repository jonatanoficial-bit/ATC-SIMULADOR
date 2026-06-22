import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/45-security-cyber-defense-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/security-cyber-defense.json'),'utf8'));
check('metadados F42+',/^F(42|[5-9][0-9])$/.test(metadata.phase)&&metadata.securityCyberDefenseSchema===1,JSON.stringify(metadata));
check('módulo F42 identificado',source.includes('@skyward-module 45-security-cyber-defense-center'));
check('API congelada',source.includes('window.SKYWARD_SECURITY_CYBER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo domains threats programs',catalog.securityDomains?.length>=6&&catalog.threatScenarios?.length>=6&&catalog.defensePrograms?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(50).fill('m'),
    SKYWARD_EMERGENCY_RESPONSE:{status:()=>({progress:{score:84}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:82}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:80}})},
    SKYWARD_CRISIS_COMMAND:{status:()=>({progress:{score:90}})},
    SKYWARD_SAFETY_COMPLIANCE:{status:()=>({progress:{score:84}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.42.0-F42-20260622-1500',
  airport:()=>({icao:'SBGR'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_SECURITY_CYBER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1,JSON.stringify(init));
  const program=api.program('SOC_HARDENING');
  check('programa SOC criado',program.programId==='SOC_HARDENING'&&program.status==='ACTIVE',JSON.stringify(program));
  const threat=api.threat('RANSOMWARE_ALERT');
  check('ameaça criada',threat.threatId==='RANSOMWARE_ALERT'&&threat.status==='OPEN',JSON.stringify(threat));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('segurança avaliada',Number.isFinite(eval1.evaluation.securityScore)&&eval1.evaluation.responseLevel,JSON.stringify(eval1.evaluation));
  const progress=api.progress();
  check('progress contém segurança',Number.isFinite(progress.score)&&progress.status&&progress.responseLevel,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.securityBands.length>=4,JSON.stringify(status.catalog.securityBands));
  check('domínios essenciais presentes',api.catalog.securityDomains.some(d=>d.id==='CYBER_SOC')&&api.catalog.securityDomains.some(d=>d.id==='PERIMETER'),JSON.stringify(api.catalog.securityDomains));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase42-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE42_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE42_UNIT_TESTS_SUMMARY.md'),`# Fase 42 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F42 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
