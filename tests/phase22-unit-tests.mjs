import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/25-commercial-polish-ux.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/ux-polish-presets.json'),'utf8'));
check('metadados F22+',/^F(22|[3-9][0-9])$/.test(metadata.phase)&&metadata.commercialPolishSchema===1,JSON.stringify(metadata));
check('módulo F22 identificado',source.includes('@skyward-module 25-commercial-polish-ux'));
check('API congelada',source.includes('window.SKYWARD_COMMERCIAL_POLISH=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version);
check('catálogo layouts onboarding acessibilidade',catalog.hudLayouts?.length>=4&&catalog.onboardingSteps?.length>=5&&catalog.accessibilityModes?.length>=4);
const storage=new Map();
const fakeClassList={classes:new Set(),add(...c){c.forEach(x=>this.classes.add(x));},remove(...c){c.forEach(x=>this.classes.delete(x));},toggle(c,v){if(v)this.classes.add(c);else this.classes.delete(c);}};
const fakeStyle={values:{},setProperty(k,v){this.values[k]=String(v);}};
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[],SKYWARD_BUILD_INFO:{},innerWidth:844,innerHeight:390,addEventListener:()=>{}},
  localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
  BUILD:'SC-1.22.0-F22-20260619-1212',
  document:{documentElement:{clientWidth:844,clientHeight:390,style:fakeStyle,classList:fakeClassList},body:{classList:fakeClassList,appendChild:()=>{}},querySelector:()=>null,createElement:()=>({id:'',className:'',innerHTML:'',querySelector:()=>null})},
  safeLogError:()=>{}
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_COMMERCIAL_POLISH;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const mobile=api.layout({width:844,height:390,orientation:'landscape',isMobile:true,isTablet:false});
  check('layout mobile landscape correto',mobile.id==='MOBILE_LANDSCAPE_COMPACT',JSON.stringify(mobile));
  const portrait=api.layout({width:390,height:844,orientation:'portrait',isMobile:true,isTablet:false});
  check('layout portrait safe correto',portrait.id==='PORTRAIT_SAFE',JSON.stringify(portrait));
  const applied=api.apply();
  check('apply responsive retorna layout',applied.layout.id==='MOBILE_LANDSCAPE_COMPACT',JSON.stringify(applied));
  const mode=api.accessibility('HIGH_CONTRAST');
  check('acessibilidade alto contraste aplicada',mode.id==='HIGH_CONTRAST',JSON.stringify(mode));
  const card=api.onboarding(true);
  check('onboarding retorna card',card && card.id==='WELCOME',JSON.stringify(card));
  const ready=api.readiness();
  check('release readiness alto',ready.score>=80,JSON.stringify(ready));
  const status=api.status();
  check('status contém readiness',status.readiness.score>=80,JSON.stringify(status));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase22-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE22_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE22_UNIT_TESTS_SUMMARY.md'),`# Fase 22 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F22 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
