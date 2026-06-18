/* @skyward-module 02-save-vault
 * Transactional local save vault with SHA-256 integrity, backup, journal,
 * quarantine, automatic rollback and legacy import support.
 */
window.SKYWARD_MODULES?.push('02-save-vault');
(function(){
  const VAULT_SCHEMA=1;
  const VERSION='1.0.0';
  const PREFIX='skyward:vault:v1';
  const SLOT_NAMES=Object.freeze(['primary','backup','journal','quarantine']);
  const diagnostics=[];
  const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
  const now=()=>Date.now();
  const pushDiagnostic=(event,name,detail={})=>{
    diagnostics.unshift({event,name,at:now(),...clone(detail)});
    diagnostics.splice(40);
  };
  const storageKey=(name,slot)=>`${PREFIX}:${String(name)}:${String(slot)}`;
  const safeReadRaw=key=>{ try{return localStorage.getItem(key);}catch(error){pushDiagnostic('storage-read-error',key,{message:String(error?.message||error)});return null;} };
  const safeWriteRaw=(key,value)=>{ try{localStorage.setItem(key,value);return true;}catch(error){pushDiagnostic('storage-write-error',key,{message:String(error?.message||error)});return false;} };
  const safeRemove=key=>{ try{localStorage.removeItem(key);return true;}catch(error){pushDiagnostic('storage-remove-error',key,{message:String(error?.message||error)});return false;} };
  const parseRaw=(raw,key='')=>{
    if(typeof raw!=='string'||!raw.length) return {ok:false,reason:'missing',value:null};
    try{return {ok:true,value:JSON.parse(raw)};}catch(error){pushDiagnostic('json-corrupt',key,{message:String(error?.message||error),bytes:raw.length});return {ok:false,reason:'json',value:null};}
  };
  function canonicalize(value){
    if(value===null) return 'null';
    const type=typeof value;
    if(type==='string'||type==='boolean') return JSON.stringify(value);
    if(type==='number') return Number.isFinite(value)?JSON.stringify(value):'null';
    if(Array.isArray(value)) return '['+value.map(item=>canonicalize(item===undefined?null:item)).join(',')+']';
    if(type==='object'){
      const keys=Object.keys(value).filter(key=>value[key]!==undefined&&typeof value[key]!=='function'&&typeof value[key]!=='symbol').sort();
      return '{'+keys.map(key=>JSON.stringify(key)+':'+canonicalize(value[key])).join(',')+'}';
    }
    return 'null';
  }
  function sha256(input){
    const bytes=new TextEncoder().encode(String(input));
    const K=new Uint32Array([
      0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
      0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
      0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
      0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
      0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
    ]);
    const bitLength=bytes.length*8;
    const totalLength=((bytes.length+9+63)>>6)<<6;
    const data=new Uint8Array(totalLength); data.set(bytes); data[bytes.length]=0x80;
    const view=new DataView(data.buffer);
    const high=Math.floor(bitLength/0x100000000), low=bitLength>>>0;
    view.setUint32(totalLength-8,high,false); view.setUint32(totalLength-4,low,false);
    const H=new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]);
    const W=new Uint32Array(64);
    const rotr=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let offset=0;offset<totalLength;offset+=64){
      for(let i=0;i<16;i++) W[i]=view.getUint32(offset+i*4,false);
      for(let i=16;i<64;i++){
        const s0=(rotr(W[i-15],7)^rotr(W[i-15],18)^(W[i-15]>>>3))>>>0;
        const s1=(rotr(W[i-2],17)^rotr(W[i-2],19)^(W[i-2]>>>10))>>>0;
        W[i]=(W[i-16]+s0+W[i-7]+s1)>>>0;
      }
      let a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for(let i=0;i<64;i++){
        const S1=(rotr(e,6)^rotr(e,11)^rotr(e,25))>>>0;
        const ch=((e&f)^((~e)&g))>>>0;
        const t1=(h+S1+ch+K[i]+W[i])>>>0;
        const S0=(rotr(a,2)^rotr(a,13)^rotr(a,22))>>>0;
        const maj=((a&b)^(a&c)^(b&c))>>>0;
        const t2=(S0+maj)>>>0;
        h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;
      }
      H[0]=(H[0]+a)>>>0;H[1]=(H[1]+b)>>>0;H[2]=(H[2]+c)>>>0;H[3]=(H[3]+d)>>>0;
      H[4]=(H[4]+e)>>>0;H[5]=(H[5]+f)>>>0;H[6]=(H[6]+g)>>>0;H[7]=(H[7]+h)>>>0;
    }
    return Array.from(H).map(value=>value.toString(16).padStart(8,'0')).join('');
  }
  const hashCanonical=value=>sha256(canonicalize(value));
  const without=(value,key)=>{const copy=clone(value)||{};delete copy[key];return copy;};
  const validatePayload=(payload,validator)=>{
    if(typeof validator!=='function') return {ok:true};
    try{
      const result=validator(payload);
      if(result===true) return {ok:true};
      if(result&&typeof result==='object'&&'ok' in result) return result;
      return {ok:Boolean(result)};
    }catch(error){return {ok:false,reason:'validator',message:String(error?.message||error)};}
  };
  function createEnvelope(name,payload,options={},previous=null){
    const payloadCopy=clone(payload);
    const envelope={
      vaultSchema:VAULT_SCHEMA,
      name:String(name),
      saveSchema:Number(options.saveSchema)||1,
      revision:Math.max(1,Number(options.revision)||((Number(previous?.revision)||0)+1)),
      transactionId:String(options.transactionId||`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`),
      build:String(options.build||window.SKYWARD_BUILD_INFO?.build||'UNKNOWN'),
      createdAt:Number(options.createdAt)||now(),
      reason:String(options.reason||'save'),
      previousHash:previous?.envelopeHash||null,
      hashAlgorithm:'SHA-256',
      payload:payloadCopy,
      payloadHash:hashCanonical(payloadCopy)
    };
    envelope.envelopeHash=hashCanonical(without(envelope,'envelopeHash'));
    return envelope;
  }
  function inspectEnvelope(envelope,name,options={}){
    const issues=[];
    if(!envelope||typeof envelope!=='object'||Array.isArray(envelope)) return {ok:false,issues:['envelope_not_object']};
    if(envelope.vaultSchema!==VAULT_SCHEMA) issues.push('vault_schema');
    if(envelope.name!==String(name)) issues.push('name');
    if(!Number.isInteger(envelope.saveSchema)||envelope.saveSchema<1) issues.push('save_schema');
    if(options.expectedSaveSchema!==undefined&&envelope.saveSchema>Number(options.expectedSaveSchema)) issues.push('future_schema');
    if(!Number.isInteger(envelope.revision)||envelope.revision<1) issues.push('revision');
    if(typeof envelope.transactionId!=='string'||!envelope.transactionId) issues.push('transaction_id');
    if(envelope.hashAlgorithm!=='SHA-256') issues.push('hash_algorithm');
    if(envelope.payloadHash!==hashCanonical(envelope.payload)) issues.push('payload_hash');
    if(envelope.envelopeHash!==hashCanonical(without(envelope,'envelopeHash'))) issues.push('envelope_hash');
    const migrationPending=Number(options.expectedSaveSchema)>envelope.saveSchema&&typeof options.migrate==='function';
    const payloadResult=issues.length?{ok:false}:(migrationPending?{ok:true,migrationPending:true}:validatePayload(envelope.payload,options.validate));
    if(!payloadResult.ok) issues.push('payload_contract');
    return {ok:issues.length===0,issues,payloadResult,envelope};
  }
  function readEnvelope(name,slot,options={}){
    const key=storageKey(name,slot),raw=safeReadRaw(key),parsed=parseRaw(raw,key);
    if(!parsed.ok) return {ok:false,slot,key,reason:parsed.reason,raw};
    const checked=inspectEnvelope(parsed.value,name,options);
    return {...checked,slot,key,raw,envelope:parsed.value,reason:checked.ok?'ok':checked.issues.join(',')};
  }
  function quarantine(name,slot,raw,reason){
    if(raw===null||raw===undefined) return false;
    const key=storageKey(name,'quarantine');
    const current=parseRaw(safeReadRaw(key),key);
    const list=Array.isArray(current.value)?current.value:[];
    list.unshift({slot,reason:String(reason||'invalid'),at:now(),raw:String(raw).slice(0,300000)});
    const ok=safeWriteRaw(key,JSON.stringify(list.slice(0,3)));
    if(ok) pushDiagnostic('quarantined',name,{slot,reason});
    return ok;
  }
  function createJournal(name,previous,next){
    const journal={vaultSchema:VAULT_SCHEMA,name:String(name),state:'PREPARED',at:now(),previous:previous||null,next:next||null};
    journal.journalHash=hashCanonical(without(journal,'journalHash'));
    return journal;
  }
  function inspectJournal(journal,name){
    if(!journal||typeof journal!=='object'||Array.isArray(journal)) return {ok:false,reason:'journal_not_object'};
    if(journal.vaultSchema!==VAULT_SCHEMA||journal.name!==String(name)||journal.state!=='PREPARED') return {ok:false,reason:'journal_header'};
    if(journal.journalHash!==hashCanonical(without(journal,'journalHash'))) return {ok:false,reason:'journal_hash'};
    const prevOk=journal.previous===null||inspectEnvelope(journal.previous,name).ok;
    const nextOk=journal.next!==null&&inspectEnvelope(journal.next,name).ok;
    return {ok:prevOk&&nextOk,reason:prevOk&&nextOk?'ok':'journal_envelope'};
  }
  function recoverJournal(name,options={}){
    const key=storageKey(name,'journal'),raw=safeReadRaw(key);
    if(!raw) return {ok:true,action:'none'};
    const parsed=parseRaw(raw,key);
    if(!parsed.ok){quarantine(name,'journal',raw,'journal_json');safeRemove(key);return {ok:false,action:'quarantined-journal'};}
    const checked=inspectJournal(parsed.value,name);
    if(!checked.ok){quarantine(name,'journal',raw,checked.reason);safeRemove(key);return {ok:false,action:'quarantined-journal'};}
    const journal=parsed.value;
    const primary=readEnvelope(name,'primary',options);
    if(primary.ok&&primary.envelope.envelopeHash===journal.next.envelopeHash){
      safeRemove(key);pushDiagnostic('journal-committed',name,{revision:primary.envelope.revision});return {ok:true,action:'commit-confirmed'};
    }
    const rollback=journal.previous&&inspectEnvelope(journal.previous,name,options).ok?journal.previous:null;
    if(rollback&&safeWriteRaw(storageKey(name,'primary'),JSON.stringify(rollback))){
      safeRemove(key);pushDiagnostic('journal-rollback',name,{revision:rollback.revision});return {ok:true,action:'rolled-back'};
    }
    const backup=readEnvelope(name,'backup',options);
    if(backup.ok&&safeWriteRaw(storageKey(name,'primary'),JSON.stringify(backup.envelope))){
      safeRemove(key);pushDiagnostic('journal-backup-restore',name,{revision:backup.envelope.revision});return {ok:true,action:'backup-restored'};
    }
    quarantine(name,'journal',raw,'journal_unrecoverable');safeRemove(key);
    return {ok:false,action:'unrecoverable'};
  }
  function write(name,payload,options={}){
    const payloadResult=validatePayload(payload,options.validate);
    if(!payloadResult.ok){pushDiagnostic('write-rejected',name,{reason:'payload_contract'});return {ok:false,reason:'payload_contract',payloadResult};}
    recoverJournal(name,options);
    const current=readEnvelope(name,'primary',options);
    const previous=current.ok?current.envelope:null;
    const envelope=createEnvelope(name,payload,options,previous);
    const journal=createJournal(name,previous,envelope);
    const journalKey=storageKey(name,'journal');
    if(!safeWriteRaw(journalKey,JSON.stringify(journal))) return {ok:false,reason:'journal_write'};
    if(previous&&!safeWriteRaw(storageKey(name,'backup'),JSON.stringify(previous))){safeRemove(journalKey);return {ok:false,reason:'backup_write'};}
    if(!safeWriteRaw(storageKey(name,'primary'),JSON.stringify(envelope))){
      if(previous) safeWriteRaw(storageKey(name,'primary'),JSON.stringify(previous));
      safeRemove(journalKey);return {ok:false,reason:'primary_write'};
    }
    const verify=readEnvelope(name,'primary',options);
    if(!verify.ok||verify.envelope.envelopeHash!==envelope.envelopeHash){
      quarantine(name,'primary',verify.raw,'post_write_verification');
      if(previous) safeWriteRaw(storageKey(name,'primary'),JSON.stringify(previous)); else safeRemove(storageKey(name,'primary'));
      safeRemove(journalKey);pushDiagnostic('write-rollback',name,{reason:verify.reason});return {ok:false,reason:'verification'};
    }
    safeRemove(journalKey);
    pushDiagnostic('write-committed',name,{revision:envelope.revision,hash:envelope.envelopeHash});
    return {ok:true,envelope:clone(envelope),revision:envelope.revision};
  }
  function restoreBackup(name,options={},reason='primary_invalid'){
    const backup=readEnvelope(name,'backup',options);
    if(!backup.ok) return {ok:false,reason:'backup_invalid'};
    const primaryRaw=safeReadRaw(storageKey(name,'primary'));
    if(primaryRaw) quarantine(name,'primary',primaryRaw,reason);
    if(backup.envelope.saveSchema<Number(options.expectedSaveSchema||backup.envelope.saveSchema)&&typeof options.migrate==='function'){
      try{
        const migrated=options.migrate(backup.envelope.payload,{source:'backup',envelope:backup.envelope});
        if(migrated?.ok!==false){
          const payload=migrated?.payload??migrated?.value??backup.envelope.payload;
          safeRemove(storageKey(name,'primary'));
          const committed=write(name,payload,{...options,saveSchema:options.expectedSaveSchema,reason:'backup-schema-migration'});
          if(committed.ok){pushDiagnostic('automatic-rollback-migrated',name,{fromRevision:backup.envelope.revision,toRevision:committed.envelope.revision,reason});return {ok:true,envelope:committed.envelope,payload:clone(payload),source:'backup',recovered:true,migrated:true};}
        }
      }catch(error){pushDiagnostic('backup-migration-error',name,{message:String(error?.message||error)});}
    }
    if(!safeWriteRaw(storageKey(name,'primary'),JSON.stringify(backup.envelope))) return {ok:false,reason:'restore_write'};
    pushDiagnostic('automatic-rollback',name,{revision:backup.envelope.revision,reason});
    return {ok:true,envelope:backup.envelope,payload:clone(backup.envelope.payload),source:'backup',recovered:true};
  }

  function importLegacy(name,options={}){
    for(const legacyKey of options.legacyKeys||[]){
      const raw=safeReadRaw(legacyKey); if(!raw) continue;
      const parsed=parseRaw(raw,legacyKey); if(!parsed.ok){quarantine(name,`legacy:${legacyKey}`,raw,'legacy_json');continue;}
      let payload=parsed.value,migration=null;
      if(typeof options.migrate==='function'){
        try{migration=options.migrate(payload,{source:'legacy',key:legacyKey});if(migration?.ok===false) continue;payload=migration?.payload??migration?.value??payload;}catch(error){pushDiagnostic('legacy-migration-error',name,{key:legacyKey,message:String(error?.message||error)});continue;}
      }
      const valid=validatePayload(payload,options.validate); if(!valid.ok) continue;
      const committed=write(name,payload,{...options,reason:`legacy-import:${legacyKey}`});
      if(committed.ok){pushDiagnostic('legacy-imported',name,{key:legacyKey,migratedFrom:migration?.migratedFrom??null});return {ok:true,payload:clone(payload),envelope:committed.envelope,source:'legacy',migrated:Boolean(migration?.migratedFrom),legacyKey};}
    }
    return {ok:false,reason:'no_legacy'};
  }
  function read(name,options={}){
    const journalRecovery=recoverJournal(name,options);
    let primary=readEnvelope(name,'primary',options);
    if(primary.ok){
      let payload=primary.envelope.payload;
      if(primary.envelope.saveSchema<Number(options.expectedSaveSchema||primary.envelope.saveSchema)&&typeof options.migrate==='function'){
        try{
          const migrated=options.migrate(payload,{source:'vault',envelope:primary.envelope});
          if(migrated?.ok!==false){
            payload=migrated?.payload??migrated?.value??payload;
            const committed=write(name,payload,{...options,saveSchema:options.expectedSaveSchema,reason:'schema-migration'});
            if(committed.ok) return {ok:true,payload:clone(payload),envelope:committed.envelope,source:'migration',migrated:true,journalRecovery};
          }
        }catch(error){pushDiagnostic('migration-error',name,{message:String(error?.message||error)});}
      }
      return {ok:true,payload:clone(payload),envelope:clone(primary.envelope),source:'primary',recovered:journalRecovery.action!=='none',journalRecovery};
    }
    if(primary.raw) quarantine(name,'primary',primary.raw,primary.reason||'invalid');
    const rollback=restoreBackup(name,options,primary.reason||'primary_invalid');
    if(rollback.ok) return {...rollback,journalRecovery};
    const legacy=importLegacy(name,options);
    if(legacy.ok) return {...legacy,journalRecovery};
    return {ok:false,reason:'no_valid_save',journalRecovery,primaryReason:primary.reason,backupReason:rollback.reason};
  }
  function clear(name,options={}){
    for(const slot of SLOT_NAMES){if(slot==='quarantine'&&options.keepQuarantine) continue;safeRemove(storageKey(name,slot));}
    pushDiagnostic('cleared',name,{keepQuarantine:Boolean(options.keepQuarantine)});return true;
  }
  function inspect(name){
    const slots={};
    for(const slot of SLOT_NAMES){
      const raw=safeReadRaw(storageKey(name,slot));
      const parsed=parseRaw(raw,storageKey(name,slot));
      slots[slot]={key:storageKey(name,slot),exists:typeof raw==='string',bytes:raw?.length||0,value:parsed.ok?clone(parsed.value):null,parseOk:parsed.ok};
    }
    return Object.freeze({name:String(name),vaultSchema:VAULT_SCHEMA,slots:Object.freeze(slots)});
  }
  const api=Object.freeze({
    vaultSchema:VAULT_SCHEMA,version:VERSION,prefix:PREFIX,hashAlgorithm:'SHA-256',
    canonicalize,sha256,hashCanonical,storageKey,createEnvelope,inspectEnvelope,createJournal,inspectJournal,
    write,read,clear,inspect,recover:name=>recoverJournal(name,{}),
    getDiagnostics:()=>Object.freeze(clone(diagnostics)),clearDiagnostics:()=>{diagnostics.length=0;}
  });
  window.SKYWARD_SAVE_VAULT=api;
})();
