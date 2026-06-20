import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/33-international-campaign.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/international-campaign.json'),'utf8'));
check('metadados F30+',/^F(30|[4-9][0-9])$/.test(metadata.phase)&&metadata.internationalCampaignSchema===1,JSON.stringify(metadata));
check('módulo F30 identificado',source.includes('@skyward-module 33-international-campaign'));
check('API congelada',source.includes('window.SKYWARD_INTERNATIONAL_CAMPAIGN=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo regiões temporadas contratos',catalog.regions?.length>=4&&catalog.seasons?.length>=4&&catalog.contracts?.length>=5);
const storage=new Map();
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:new Array(38).fill('m')},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.30.0-F30-20260620-1905',
  airport:()=>({icao:'SBSP'}),
  document:{body:{appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_INTERNATIONAL_CAMPAIGN;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();
  check('init gera estado',init.schema===1&&init.seasonId==='SEASON_01',JSON.stringify(init));
  const good=api.evaluate(2600,{conflicts:0,runwayIncursions:0,denied:0},false,'SBSP');
  check('turno saudável passa contrato',good.evaluation.passed===true&&good.evaluation.reputation>0,JSON.stringify(good.evaluation));
  const bad=api.evaluate(400,{conflicts:2,runwayIncursions:1,denied:2},false,'SBGR');
  check('turno ruim falha segurança',bad.evaluation.passed===false,JSON.stringify(bad.evaluation));
  const progress=api.progress();
  check('progress contém contrato',progress.contract.id&&progress.season.id&&progress.risk.band.id,JSON.stringify(progress));
  const status=api.status();
  check('status contém catálogo',status.catalog.milestones.length>=4,JSON.stringify(status.catalog.milestones));
  check('contrato KATL presente',api.catalog.contracts.some(c=>c.id==='CONTRACT_KATL_GLOBAL'),JSON.stringify(api.catalog.contracts));
  check('temporadas avançadas presentes',api.catalog.seasons.some(s=>s.id==='SEASON_03')&&api.catalog.seasons.some(s=>s.id==='SEASON_04'),JSON.stringify(api.catalog.seasons));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase30-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE30_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE30_UNIT_TESTS_SUMMARY.md'),`# Fase 30 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F30 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
