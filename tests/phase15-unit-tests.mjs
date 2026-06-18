import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
const defaultRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stageArg=process.argv.slice(2).find(a=>a.includes('SKYWARD_CONTROL_SC-')||a.endsWith('SKYWARD_CONTROL'));
const root=stageArg?path.resolve(stageArg):defaultRoot;
const reportMode=process.argv.includes('--report') && root===defaultRoot;
const checks=[]; const check=(name,ok,detail='')=>checks.push({name,ok:Boolean(ok),detail:String(detail||'')});
const source=fs.readFileSync(path.join(root,'src/runtime/18-advanced-weather-ifr.js'),'utf8');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
const catalog=JSON.parse(fs.readFileSync(path.join(root,'data/weather-profiles.json'),'utf8'));
check('metadados F15+',/^F(1[5-9]|[2-9][0-9])$/.test(metadata.phase)&&metadata.weatherOpsSchema===1,JSON.stringify(metadata));
check('módulo F15 identificado',source.includes('@skyward-module 18-advanced-weather-ifr'));
check('API congelada',source.includes('window.SKYWARD_WEATHER_OPS=Object.freeze'));
check('catálogo schema 1',catalog.schema===1&&catalog.version&&catalog.profiles);
check('catálogo tem 5 perfis',Object.keys(catalog.profiles||{}).length>=5);
check('perfil LIFR presente',!!catalog.profiles.LIFR_RAIN&&catalog.profiles.LIFR_RAIN.flightRules==='LIFR');
const context={
  console,Math,Number,String,Array,Object,RegExp,Map,Set,JSON,Date,
  window:{SKYWARD_MODULES:[]},
  performance:{now:()=>1000},
  profile:{turns:1},
  airport:()=>({icao:'SBGR',level:1}),
  WX_STATE:{severity:.1},
  document:{querySelector:()=>null},
  safeLogError:()=>{},
  updateWeatherPanel:null,
  performanceTargetSpeed:()=>150
};
context.window.window=context.window; vm.createContext(context);
try{
  vm.runInContext(source,context);
  const api=context.window.SKYWARD_WEATHER_OPS;
  check('API executa em isolamento',!!api);
  check('schema 1',api.schema===1);
  check('selfcheck aprovado',api.selfCheck().ok===true,JSON.stringify(api.selfCheck()));
  const vmc=api.apply('VMC_CLEAR');
  check('VMC aplica VFR',vmc.flightRules==='VFR'&&vmc.visibilityKm>=10,JSON.stringify(vmc));
  const lifr=api.apply('FOG_RVR');
  check('FOG aplica LIFR',lifr.flightRules==='LIFR'&&lifr.rvrMeters<1500,JSON.stringify(lifr));
  const impactVmc=api.impact(api.catalog.profiles.VMC_CLEAR);
  const stormProfile={...api.catalog.profiles.THUNDERSTORM_CELLS,rvrMeters:900};
  const impactStorm=api.impact(stormProfile);
  check('risco severo maior que VMC',impactStorm.risk>impactVmc.risk,JSON.stringify({impactVmc,impactStorm}));
  api.apply('THUNDERSTORM_CELLS');
  const landing=api.commandRisk('clearLanding',{type:'A320',speed:160});
  check('pouso em TS gera alerta ou bloqueio',landing.level==='warn'||landing.level==='danger',JSON.stringify(landing));
  const xwind=api.apply({id:'XWIND',flightRules:'IFR',visibilityKm:8,ceilingFt:1500,rainMmH:0,windDir:270,windKt:35,gustKt:48,crosswindKt:33,runwayCondition:'DRY',brakingAction:'GOOD',severity:.7});
  const takeoff=api.commandRisk('clearTakeoff',{type:'B738'});
  check('decolagem bloqueia crosswind severo',takeoff.block===true,JSON.stringify({xwind,takeoff}));
  api.apply('LIFR_RAIN');
  check('risco de pouso climático positivo',api.landingRisk({type:'A320',speed:190})>20,String(api.landingRisk({type:'A320',speed:190})));
  check('risco de decolagem climático positivo',api.takeoffRisk({type:'B752',performance:{wake:'H'}})>10,String(api.takeoffRisk({type:'B752',performance:{wake:'H'}})));
  check('perfil por aeroporto retorna válido',api.profileForAirport('SBSP',2).id&&api.profileForAirport('SBSP',2).flightRules,JSON.stringify(api.profileForAirport('SBSP',2)));
}catch(e){ check('API executa em isolamento',false,e.stack||e.message); }
const failed=checks.filter(c=>!c.ok);
const report={schema:1,suite:'phase15-unit',build:metadata.build,passed:checks.length-failed.length,total:checks.length,failed:failed.length,checks};
if(reportMode){
  fs.mkdirSync(path.join(root,'audit'),{recursive:true});
  fs.writeFileSync(path.join(root,'audit/PHASE15_UNIT_TESTS.json'),JSON.stringify(report,null,2)+'\n');
  fs.writeFileSync(path.join(root,'audit/PHASE15_UNIT_TESTS_SUMMARY.md'),`# Fase 15 — Testes unitários\n\n- Resultado: **${report.passed}/${report.total} aprovados**\n- Build: \`${report.build}\`\n`);
}
console.log(`Skyward Control F15 unit tests: ${report.passed}/${report.total} aprovados`);
for(const c of checks) console.log(`${c.ok?'PASS':'FAIL'}  ${c.name}${!c.ok&&c.detail?` — ${c.detail}`:''}`);
if(failed.length) process.exit(1);
