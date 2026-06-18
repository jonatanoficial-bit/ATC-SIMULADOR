import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/20-controller-career.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/career-ratings.json'),'utf8'));
check('metadados F17+',/^F(1[7-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.careerSchema===1,JSON.stringify(metadata));
check('módulo F17 identificado',source.includes('@skyward-module 20-controller-career'));
check('API congelada',source.includes('window.SKYWARD_CAREER=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo licenças e ratings',catalog.licenses?.length>=6&&catalog.ratings?.length>=6);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[], SKYWARD_WEATHER_OPS:{state:()=>({flightRules:'LIFR',rvrMeters:900})}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.17.0-F17-20260618-1905',
  airport:()=>({icao:'SBGR'}),
  airportOpsProfile:()=>({complexity:1.45}),
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_CAREER;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  check('supervisor por XP',api.licenseForXp(16000).id==='SUPERVISOR');
  check('senior por turnos e segurança',api.ratingFor(30,90).id==='SENIOR_CONTROLLER');
  const safe=api.safety(3000,{landed:6,departed:4,conflicts:0,denied:0},false);
  const bad=api.safety(200,{conflicts:5,runwayIncursions:2,denied:8},true);
  check('safety diferencia turno bom e ruim',safe>bad,JSON.stringify({safe,bad}));
  const result=api.evaluate(3600,{landed:7,departed:5,commands:40,requests:12,emergencies:1,maydayResolved:1,conflicts:0,denied:0},false,'SBGR');
  check('evaluate gera XP carreira',result.career.totalXp>0,JSON.stringify(result));
  check('evaluate registra histórico',result.career.history.length===1&&result.shift.airport==='SBGR',JSON.stringify(result.career.history));
  check('fadiga aumenta após turno',result.career.fatigue>0,String(result.career.fatigue));
  const beforeFatigue=result.career.fatigue;
  api.rest(8);
  check('descanso reduz fadiga',api.status().fatigue<beforeFatigue,JSON.stringify(api.status()));
  check('bandas de reputação funcionam',api.reputationBand(700).id==='INTERNATIONAL');
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase17-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE17_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE17_UNIT_TESTS_SUMMARY.md'),`# Fase 17 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F17 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
