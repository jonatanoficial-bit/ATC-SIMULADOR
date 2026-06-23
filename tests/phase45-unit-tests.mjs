import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report')&&root===defaultRoot;
const checks=[];const check=(n,o,d='')=>checks.push({name:n,ok:Boolean(o),detail:String(d||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/48-ai-copilot-decision-support-center.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/ai-copilot-decision-support.json'),'utf8'));
check('metadados F45+',/^F(45|[5-9][0-9])$/.test(metadata.phase)&&metadata.aiCopilotSchema===1,JSON.stringify(metadata));
check('módulo F45 identificado',source.includes('@skyward-module 48-ai-copilot-decision-support-center'));
check('API congelada',source.includes('window.SKYWARD_AI_COPILOT=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo domains rules modes',catalog.copilotDomains?.length>=10&&catalog.recommendationRules?.length>=10&&catalog.copilotModes?.length>=4);
const storage=new Map();
const context={console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{
    SKYWARD_MODULES:new Array(52).fill('m'),
    SKYWARD_DIGITAL_TWIN:{status:()=>({progress:{score:86,confidence:80}})},
    SKYWARD_ASSET_MAINTENANCE:{status:()=>({progress:{score:82}})},
    SKYWARD_SECURITY_CYBER:{status:()=>({progress:{score:84}})},
    SKYWARD_EMERGENCY_RESPONSE:{status:()=>({progress:{score:83}})},
    SKYWARD_MULTI_AIRPORT_NETWORK:{status:()=>({progress:{score:82}})},
    SKYWARD_PASSENGER_REPUTATION:{status:()=>({progress:{score:81}})},
    SKYWARD_WORKFORCE_STAFFING:{status:()=>({progress:{score:80}})},
    SKYWARD_REVENUE_MANAGEMENT:{status:()=>({progress:{score:78,margin:14}})},
    SKYWARD_SURFACE_SAFETY:{status:()=>({progress:{score:80}})},
    SKYWARD_WEATHER_OPS:{status:()=>({progress:{score:79}})}
  },
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.45.0-F45-20260623-0945',
  airport:()=>({icao:'SBGR'}),
  document:{querySelector:()=>null},
  safeLogError:()=>{}
};
context.window.window=context.window;vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_AI_COPILOT;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const init=api.init();check('init gera estado',init.schema===1,JSON.stringify(init));
  const mode=api.mode('SAFETY_FIRST');check('modo aplicado',mode.id==='SAFETY_FIRST',JSON.stringify(mode));
  const alert=api.alert('TEST','TRAFFIC',42,'Teste');check('alerta criado',alert.status==='OPEN'&&alert.level,JSON.stringify(alert));
  const eval1=api.evaluate(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  check('copiloto avaliado',Number.isFinite(eval1.evaluation.decisionScore)&&Number.isFinite(eval1.evaluation.confidence),JSON.stringify(eval1.evaluation));
  const progress=api.progress();check('progress contém copiloto',Number.isFinite(progress.score)&&progress.status&&progress.priority,JSON.stringify(progress));
  const status=api.status();check('status contém catálogo',status.catalog.copilotBands.length>=4,JSON.stringify(status.catalog.copilotBands));
  check('domínios essenciais presentes',api.catalog.copilotDomains.some(d=>d.id==='TRAFFIC')&&api.catalog.copilotDomains.some(d=>d.id==='ASSETS'),JSON.stringify(api.catalog.copilotDomains));
}catch(e){check('API executa em isolamento',false,e.stack||e.message);}
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase45-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE45_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE45_UNIT_TESTS_SUMMARY.md'),`# Fase 45 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F45 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
