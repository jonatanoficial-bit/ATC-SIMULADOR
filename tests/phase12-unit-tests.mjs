import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[];const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/15-aircraft-performance.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/aircraft-performance.json'),'utf8'));
check('metadados F12+',/^F(1[2-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.aircraftPerformanceSchema===1,JSON.stringify(metadata));
check('marcador de módulo',source.includes('@skyward-module 15-aircraft-performance'));
check('API congelada no código',source.includes('window.SKYWARD_AIRCRAFT_PERFORMANCE=Object.freeze'));
check('catálogo JSON schema 1',catalog.schema===1&&catalog.version&&catalog.profiles);
check('catálogo possui perfis suficientes',Object.keys(catalog.profiles||{}).length>=8);
const context={console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,window:{SKYWARD_MODULES:[]},clamp:(v,min,max)=>Math.max(min,Math.min(max,Number(v))),WX_STATE:{severity:0.2},safeLogError:()=>{}};
context.window.window=context.window;vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_AIRCRAFT_PERFORMANCE;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  check('B752 é heavy wake',api.telemetry({type:'B752',status:'APP',speed:170,alt:80,targetAlt:45}).wake==='H');
  check('E190 tem VREF menor que B752',api.getProfile('E190').finalSpeed<api.getProfile('B752').finalSpeed);
  check('B77W consome mais que A20N',api.fuelMultiplier({type:'B77W',kind:'arrival',status:'APP'})>api.fuelMultiplier({type:'A20N',kind:'arrival',status:'APP'}));
  let dep={type:'B752',kind:'departure',status:'DEP',speed:150,alt:0,targetAlt:160,damage:0};api.normalize(dep);api.step(dep,1,'DEP');check('decolagem acelera respeitando rotação',dep.speed>=150&&dep.targetSpeed>=api.getProfile('B752').initialClimbSpeed,JSON.stringify(dep));check('decolagem sobe com climb fpm',dep.alt>0,JSON.stringify(dep));
  let app={type:'E190',kind:'arrival',status:'APP',speed:220,alt:120,targetAlt:45,damage:0};api.normalize(app);api.step(app,1,'APP');check('aproximação desacelera',app.speed<220,JSON.stringify(app));check('aproximação desce',app.alt<120,JSON.stringify(app));
  let final={type:'A320',kind:'arrival',status:'FINAL',speed:190,alt:20,targetAlt:0,damage:0};check('pouso rápido gera risco',api.landingRisk(final)>35,JSON.stringify(api.telemetry(final)));api.step(final,2,'FINAL');check('final busca VREF',final.speed<190&&api.envelope(final)!=='UNKNOWN',JSON.stringify(final));
  let slow={type:'C208',kind:'arrival',status:'FINAL',speed:60,alt:5,targetAlt:0,damage:0};check('baixa energia detectada',api.envelope(slow)==='SLOW_FINAL',api.envelope(slow));
  const validation=api.validateCatalog(catalog);check('catálogo externo validado',validation.ok===true,JSON.stringify(validation.issues));
}catch(e){check('API executa em isolamento',false,e.stack||e.message);}
const failed=checks.filter(c=>!c.ok);const report={schema:1,suite:'phase12-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){fs.mkdirSync(path.join(root,'audit'),{recursive:true});fs.writeFileSync(path.join(root,'audit/PHASE12_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');fs.writeFileSync(path.join(root,'audit/PHASE12_UNIT_TESTS_SUMMARY.md'),`# Fase 12 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);} 
console.log(`Skyward Control F12 unit tests: ${report.passed}/${report.total} aprovados`);for(const c of checks)console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);if(failed.length)process.exit(1);
