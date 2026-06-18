import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const prepackage=process.argv.includes('--prepackage');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const json=rel=>JSON.parse(read(rel));
const sha=text=>crypto.createHash('sha256').update(text).digest('hex');
const checks=[];
const check=(name,condition,detail='')=>checks.push({name,ok:Boolean(condition),detail});

let metadata,config,tsconfig,contractManifest,runtimeManifest,order,bundle,generated,api;
try{metadata=json('release-metadata.json');check('metadados F04 legíveis',true);}catch(e){check('metadados F04 legíveis',false,e.message);}
try{config=json('config/release.json');check('config F04 legível',true);}catch(e){check('config F04 legível',false,e.message);}
try{tsconfig=json('tsconfig.json');check('tsconfig legível',true);}catch(e){check('tsconfig legível',false,e.message);}
try{contractManifest=json('contracts-manifest.json');check('manifesto de contratos legível',true);}catch(e){check('manifesto de contratos legível',false,e.message);}
try{runtimeManifest=json('runtime-manifest.json');check('manifesto runtime legível',true);}catch(e){check('manifesto runtime legível',false,e.message);}
try{order=json('src/runtime/module-order.json');check('ordem modular legível',true);}catch(e){check('ordem modular legível',false,e.message);}
try{bundle=read('main.js');generated=read('src/runtime/00-typescript-contracts.js');check('runtime e contratos gerados legíveis',true);}catch(e){check('runtime e contratos gerados legíveis',false,e.message);}

if(metadata&&config){
  const semver=metadata.version.split('.').map(Number), phase=Number(String(metadata.phase).slice(1));
  check('versão e fase F04 corretas',(semver[0]>1||(semver[0]===1&&semver[1]>=4))&&phase>=4);
  check('baseline F04 válida',(semver[0]>1||(semver[0]===1&&semver[1]>=4))&&phase>=4);
  check('build oficial F04+',/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(metadata.build));
  check('save schema preservado',metadata.saveSchema>=2&&config.saveSchema===metadata.saveSchema);
  check('contract schema consistente',metadata.contractSchema>=1&&config.contractSchema===metadata.contractSchema);
}
if(tsconfig){
  const c=tsconfig.compilerOptions||{};
  check('TypeScript strict habilitado',c.strict===true&&c.noImplicitAny===true&&c.noEmitOnError===true);
  check('target moderno e DOM',c.target==='ES2020'&&Array.isArray(c.lib)&&c.lib.includes('DOM'));
  check('bundle de contratos determinístico',c.module==='none'&&c.outFile==='src/runtime/00-typescript-contracts.js');
  check('fontes canônicas declaradas',Array.isArray(tsconfig.files)&&tsconfig.files.includes('src/types/domain.ts')&&tsconfig.files.includes('src/contracts/runtime-contracts.ts'));
}
if(contractManifest&&generated){
  check('manifesto usa contract schema atual',contractManifest.schema===1&&contractManifest.contractSchema===metadata.contractSchema&&contractManifest.strict===true);
  check('hash do JavaScript gerado consistente',contractManifest.output?.sha256===sha(generated.replace(/\r\n/g,'\n')));
  check('hashes das fontes TypeScript consistentes',(contractManifest.sources||[]).every(item=>sha(read(item.file).replace(/\r\n/g,'\n'))===item.sha256));
  check('saída gerada possui API global',generated.includes('window.SKYWARD_CONTRACTS')&&generated.includes('@skyward-module 00-typescript-contracts'));
}
if(order&&runtimeManifest&&bundle){
  const modules=order.modules||[];
  check('módulo de contratos preservado na fundação',modules[0]?.file==='00-runtime-registry.js'&&modules.some(item=>item.file==='00-typescript-contracts.js'));
  check('arquitetura geração 4+',runtimeManifest.architectureGeneration>=4&&String(runtimeManifest.strategy).includes('modules'));
  check('13 módulos no mínimo',runtimeManifest.moduleCount>=13&&modules.length>=13);
  check('contratos incorporados ao bundle',bundle.includes('typescript-contracts')&&bundle.includes('SkywardContractRuntime'));
  check('runtime conecta contratos aos dados',['validateSnapshot','sanitizeAircraft','sanitizeRequest','sanitizeProfile','validateAirports'].every(token=>bundle.includes(`CONTRACTS.${token}`)||bundle.includes(`CONTRACTS?.${token}`)));
  check('autoteste cobre contratos',bundle.includes("check('typescript contracts available'")&&bundle.includes("check('typescript aircraft contract'")&&bundle.includes("check('typescript requests contract'"));
}

try{
  const sandbox={window:{SKYWARD_MODULES:[]},console};
  vm.createContext(sandbox);
  vm.runInContext(generated,sandbox,{filename:'00-typescript-contracts.js'});
  api=sandbox.window.SKYWARD_CONTRACTS;
  check('API de contratos executa isoladamente',!!api&&api.contractSchema===metadata.contractSchema&&Object.isFrozen(api));
}catch(e){check('API de contratos executa isoladamente',false,e.message);}

if(api&&metadata){
  const buildInfo={product:metadata.product,version:metadata.version,phase:metadata.phase,phaseName:metadata.phaseName,channel:metadata.channel,build:metadata.build,builtAt:metadata.builtAt,builtAtIso:metadata.builtAtIso,schema:metadata.saveSchema,contractSchema:metadata.contractSchema,target:metadata.target};
  const airports=json('data/airports.json');
  const catalog=json('data/aircraft.json');
  const profile={name:'Controlador Teste',avatar:'male',country:'Brasil',airport:'SBGR',xp:0,level:1,score:0,turns:0};
  const aircraft={id:'TST1001',type:'A320',kind:'arrival',status:'APP',x:20,y:30,heading:90,speed:180,alt:120,targetAlt:45,trail:[],risk:0,selected:false,cleared:false,emergency:false,emergencyType:null,fuel:60,fuelState:'OK',damage:0,hold:false,groundTimer:0,request:'landing',requestedAt:1,nextFix:null};
  const request={id:'TST1001',type:'landing',priority:'warn',text:'solicita pouso',time:1};
  const snapshot={schema:metadata.saveSchema,saveId:'phase4-audit-save',sessionId:'phase4-audit-session',build:metadata.build,reason:'phase4-audit',at:Date.now(),elapsed:10,selected:'TST1001',selectedRequest:request,runwayOccupiedBy:null,aircraft:[aircraft],requests:[request],score:100,stats:{landed:0},mission:null,profileAirport:'SBGR',profile};
  check('BuildInfo válido aceito',api.validateBuildInfo(buildInfo,'audit').ok);
  check('20 aeroportos válidos aceitos',airports.length===20&&api.validateAirports(airports,'audit-airports').ok);
  check('catálogo de aeronaves válido aceito',catalog.length>=6&&api.validateAircraftCatalog(catalog,'audit-catalog').ok);
  check('perfil válido aceito',api.validateProfile(profile,'audit-profile').ok);
  check('aeronave válida aceita',api.validateAircraft(aircraft,'audit-aircraft').ok);
  check('solicitação válida aceita',api.validateRequest(request,'audit-request').ok);
  check('snapshot válido aceito',api.validateSnapshot(snapshot,metadata.saveSchema,'audit-snapshot').ok);
  check('BuildInfo inválido rejeitado',!api.validateBuildInfo({...buildInfo,build:'INVALID'},'negative-build').ok);
  check('ICAO inválido rejeitado',!api.validateAirport({...airports[0],icao:'XX'},'negative-airport').ok);
  check('ICAO duplicado rejeitado',!api.validateAirports([airports[0],airports[0]],'negative-duplicate').ok);
  check('aeronave inválida rejeitada',!api.validateAircraft({...aircraft,fuel:140},'negative-aircraft').ok);
  check('pedido inválido rejeitado',!api.validateRequest({...request,type:'teleport'},'negative-request').ok);
  check('snapshot de schema divergente rejeitado',!api.validateSnapshot({...snapshot,schema:99},metadata.saveSchema,'negative-snapshot').ok);
  const cleanedProfile=api.sanitizeProfile({name:'',airport:'?',xp:-5,level:0},profile);
  check('sanitizador de perfil recupera dados',cleanedProfile.name===profile.name&&cleanedProfile.airport==='SBGR'&&cleanedProfile.xp===0&&cleanedProfile.level===1);
  const cleanedAircraft=api.sanitizeAircraft({...aircraft,heading:725,fuel:-20,speed:900,trail:[{x:1,y:2},{x:'bad',y:2}]});
  check('sanitizador de aeronave limita valores',cleanedAircraft?.heading===5&&cleanedAircraft?.fuel===0&&cleanedAircraft?.speed===500&&cleanedAircraft?.trail.length===1);
  let threw=false; try{api.assert('AircraftState',{id:'X'});}catch{threw=true;}
  check('assert lança erro tipado',threw);
  check('diagnósticos contratuais registrados',api.getDiagnostics().length>=10&&api.getDiagnostics().some(item=>item.ok===false));
}

const contractCheck=spawnSync(process.execPath,['tools/build-contracts.mjs','--check'],{cwd:root,encoding:'utf8'});
check('geração TypeScript determinística',contractCheck.status===0,(contractCheck.stderr||contractCheck.stdout).trim());
const typecheck=spawnSync('tsc',['-p','tsconfig.json','--noEmit','--pretty','false'],{cwd:root,encoding:'utf8'});
check('typecheck strict aprovado',typecheck.status===0,(typecheck.stderr||typecheck.stdout).trim());
const tscVersion=spawnSync('tsc',['-v'],{cwd:root,encoding:'utf8'});
check('compilador TypeScript disponível',tscVersion.status===0&&/Version 5\./.test(tscVersion.stdout),(tscVersion.stderr||tscVersion.stdout).trim());
const pkg=json('package.json');
check('scripts F04 disponíveis',['build:contracts','check:contracts','typecheck','test:phase4'].every(key=>pkg.scripts?.[key]));
check('sem dependência runtime adicional',!pkg.dependencies&&!pkg.devDependencies);
const release=read('tools/release.mjs');
check('pipeline compila contratos antes do runtime',release.indexOf('tools/build-contracts.mjs')>=0&&release.indexOf('tools/build-contracts.mjs')<release.indexOf('tools/build-runtime.mjs'));
check('pipeline executa auditoria F04',release.includes('tests/phase4-audit.mjs'));
check('documentação F04 presente',['docs/CONTRATOS_TYPESCRIPT_F04.md','docs/FASE_04_CHECKLIST.md','docs/FASE_04_AUDITORIA.md'].every(rel=>fs.existsSync(path.join(root,rel))));
if(!prepackage) check('manifesto criptográfico presente',fs.existsSync(path.join(root,'MANIFEST_SHA256.txt')));

const failed=checks.filter(item=>!item.ok);
console.log(`Skyward Control F04 audit: ${checks.length-failed.length}/${checks.length} aprovadas`);
for(const item of checks) console.log(`${item.ok?'PASS':'FAIL'}  ${item.name}${!item.ok&&item.detail?` — ${item.detail}`:''}`);
if(failed.length) process.exit(1);
