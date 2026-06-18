/*
 * SKYWARD CONTROL — GENERATED RUNTIME BUNDLE
 * Do not edit main.js directly. Edit src/runtime modules and run npm run build:runtime.
 * Architecture generation: 12
 */

/* ===== MODULE 01: runtime-registry (00-runtime-registry.js) ===== */
/* @skyward-module 00-runtime-registry
 * Runtime architecture registry. Generated bundle consumers can inspect
 * window.SKYWARD_ARCHITECTURE without depending on internal variables.
 */
window.SKYWARD_MODULES = [];
window.SKYWARD_MODULES.push('runtime-registry');
window.SKYWARD_ARCHITECTURE = {
  generation: 10,
  strategy: 'professional-accessibility-settings-desktop-tablet-workspace-adaptive-mobile-ux-installable-offline-pwa-transactional-save-vault-quality-gated-typescript-modules',
  entry: 'main.js',
  sourceRoot: 'src/runtime',
  modules: window.SKYWARD_MODULES,
  loadedAt: Date.now()
};

/* ===== MODULE 02: quality-kernel (00-quality-kernel.js) ===== */
/* @skyward-module 00-quality-kernel
 * Pure deterministic rules shared by the production runtime and F05 automated tests.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('00-quality-kernel');
(function(){
  const REQUEST_PRIORITY=Object.freeze({urgent:300,warn:160,normal:60});
  const REQUEST_TYPE=Object.freeze({emergency:220,landing:120,takeoff:100,lineup:90,taxi:55,pushback:45,lowfuel:180,panpan:150});
  const DEFAULT_WAKE=Object.freeze({'J-H':8,'J-M':9,'J-L':10,'H-H':5,'H-M':6,'H-L':7,'M-M':4,'M-L':5,'L-L':3});
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)));
  const normalizeHeading=value=>((Number(value)%360)+360)%360;
  const shortestTurn=(from,to)=>((normalizeHeading(to)-normalizeHeading(from)+540)%360)-180;
  const distance=(a,b)=>Math.hypot(Number(a?.x||0)-Number(b?.x||0),Number(a?.y||0)-Number(b?.y||0));
  const headingTo=(from,to)=>normalizeHeading(Math.atan2(Number(to?.y||0)-Number(from?.y||0),Number(to?.x||0)-Number(from?.x||0))*180/Math.PI);
  const range=(min,max,unit)=>Number(min)+clamp(Number(unit),0,1)*(Number(max)-Number(min));
  const requestPriorityScore=(request,nowMs=0)=>{
    const age=Math.max(0,(Number(nowMs)-Number(request?.time||0))/1000);
    return (REQUEST_PRIORITY[request?.priority]||40)+(REQUEST_TYPE[request?.type]||40)+age;
  };
  const wakeSpacing=(leadCategory,trailCategory,weatherMultiplier=1,spacingTable=DEFAULT_WAKE)=>{
    const key=`${String(leadCategory||'M')}-${String(trailCategory||'M')}`;
    return Number(spacingTable?.[key]||4)*Math.max(1,Number(weatherMultiplier)||1);
  };
  const api=Object.freeze({
    schema:1,version:'1.0.0',clamp,normalizeHeading,shortestTurn,distance,headingTo,range,
    requestPriorityScore,wakeSpacing,
    tables:Object.freeze({requestPriority:REQUEST_PRIORITY,requestType:REQUEST_TYPE,wake:DEFAULT_WAKE})
  });
  window.SKYWARD_QUALITY_KERNEL=api;
})();

/* ===== MODULE 03: typescript-contracts (00-typescript-contracts.js) ===== */
"use strict";
/* Skyward Control F08 — canonical TypeScript domain contracts. */
/* @skyward-module 00-typescript-contracts
 * TypeScript-generated domain contracts and runtime validators.
 * Source: src/types/domain.ts + src/contracts/runtime-contracts.ts
 */
var SkywardContractRuntime;
(function (SkywardContractRuntime) {
    const CONTRACT_SCHEMA = 2;
    const VERSION = '2.0.0';
    const diagnostics = [];
    const statuses = ['PARKED', 'PUSHBACK', 'READY_TAXI', 'TAXI', 'HOLD_SHORT', 'LINEUP', 'DEP', 'APP', 'HOLD', 'FINAL', 'EMERG'];
    const requestTypes = ['landing', 'pushback', 'taxi', 'lineup', 'takeoff', 'emergency', 'lowfuel', 'panpan'];
    const priorities = ['normal', 'warn', 'urgent'];
    const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
    const finite = (value) => typeof value === 'number' && Number.isFinite(value);
    const integer = (value) => finite(value) && Number.isInteger(value);
    const text = (value) => typeof value === 'string' && value.trim().length > 0;
    const bounded = (value, min, max) => Math.max(min, Math.min(max, value));
    const issue = (path, code, message, value) => ({ path, code, message, value });
    const finish = (contract, value, issues, context = '') => {
        const result = issues.length ? { ok: false, issues } : { ok: true, value: value, issues: [] };
        diagnostics.unshift({ contract, ok: result.ok, issueCount: issues.length, at: Date.now(), context });
        diagnostics.splice(50);
        return result;
    };
    function validateBuildInfo(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('BuildInfo', undefined, [issue('$', 'type', 'BuildInfo deve ser objeto', value)], context);
        const required = ['product', 'version', 'phase', 'phaseName', 'channel', 'build', 'builtAt', 'builtAtIso', 'target'];
        for (const key of required)
            if (!text(value[key]))
                issues.push(issue(`$.${key}`, 'required', `${key} deve ser texto não vazio`, value[key]));
        if (text(value.version) && !/^\d+\.\d+\.\d+$/.test(value.version))
            issues.push(issue('$.version', 'format', 'version deve seguir SemVer', value.version));
        if (text(value.phase) && !/^F\d{2}$/.test(value.phase))
            issues.push(issue('$.phase', 'format', 'phase deve seguir Fnn', value.phase));
        if (text(value.build) && !/^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(value.build))
            issues.push(issue('$.build', 'format', 'build não segue padrão oficial', value.build));
        if (!integer(value.schema) || value.schema < 1)
            issues.push(issue('$.schema', 'range', 'schema deve ser inteiro positivo', value.schema));
        if (value.contractSchema !== undefined && (!integer(value.contractSchema) || value.contractSchema < 1))
            issues.push(issue('$.contractSchema', 'range', 'contractSchema deve ser inteiro positivo', value.contractSchema));
        if (value.testSchema !== undefined && (!integer(value.testSchema) || value.testSchema < 1))
            issues.push(issue('$.testSchema', 'range', 'testSchema deve ser inteiro positivo', value.testSchema));
        if (value.saveVaultSchema !== undefined && (!integer(value.saveVaultSchema) || value.saveVaultSchema < 1))
            issues.push(issue('$.saveVaultSchema', 'range', 'saveVaultSchema deve ser inteiro positivo', value.saveVaultSchema));
        if (value.pwaSchema !== undefined && (!integer(value.pwaSchema) || value.pwaSchema < 1))
            issues.push(issue('$.pwaSchema', 'range', 'pwaSchema deve ser inteiro positivo', value.pwaSchema));
        if (value.cacheSchema !== undefined && (!integer(value.cacheSchema) || value.cacheSchema < 1))
            issues.push(issue('$.cacheSchema', 'range', 'cacheSchema deve ser inteiro positivo', value.cacheSchema));
        if (value.uxSchema !== undefined && (!integer(value.uxSchema) || value.uxSchema < 1))
            issues.push(issue('$.uxSchema', 'range', 'uxSchema deve ser inteiro positivo', value.uxSchema));
        return finish('BuildInfo', value, issues, context);
    }
    SkywardContractRuntime.validateBuildInfo = validateBuildInfo;
    function validateAirport(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('AirportDefinition', undefined, [issue('$', 'type', 'Aeroporto deve ser objeto', value)], context);
        for (const key of ['icao', 'name', 'city', 'country', 'traffic', 'weather'])
            if (!text(value[key]))
                issues.push(issue(`$.${key}`, 'required', `${key} inválido`, value[key]));
        if (text(value.icao) && !/^[A-Z0-9]{4}$/.test(value.icao))
            issues.push(issue('$.icao', 'format', 'ICAO deve ter 4 caracteres maiúsculos', value.icao));
        if (!integer(value.level) || value.level < 1)
            issues.push(issue('$.level', 'range', 'level deve ser inteiro >= 1', value.level));
        if (!integer(value.runways) || value.runways < 1 || value.runways > 12)
            issues.push(issue('$.runways', 'range', 'runways deve estar entre 1 e 12', value.runways));
        if (typeof value.unlocked !== 'boolean')
            issues.push(issue('$.unlocked', 'type', 'unlocked deve ser booleano', value.unlocked));
        return finish('AirportDefinition', value, issues, context);
    }
    SkywardContractRuntime.validateAirport = validateAirport;
    function validateAirports(value, context = '') {
        if (!Array.isArray(value))
            return finish('AirportDefinition[]', undefined, [issue('$', 'type', 'Lista de aeroportos deve ser array', value)], context);
        const issues = [];
        const seen = new Set();
        value.forEach((item, index) => {
            const result = validateAirport(item, `${context}[${index}]`);
            result.issues.forEach(entry => issues.push({ ...entry, path: `$[${index}]${entry.path.slice(1)}` }));
            if (isRecord(item) && text(item.icao)) {
                if (seen.has(item.icao))
                    issues.push(issue(`$[${index}].icao`, 'duplicate', 'ICAO duplicado', item.icao));
                seen.add(item.icao);
            }
        });
        if (value.length < 1)
            issues.push(issue('$', 'minItems', 'Ao menos um aeroporto é obrigatório'));
        return finish('AirportDefinition[]', value, issues, context);
    }
    SkywardContractRuntime.validateAirports = validateAirports;
    function validateProfile(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('ControllerProfile', undefined, [issue('$', 'type', 'Perfil deve ser objeto', value)], context);
        for (const key of ['name', 'avatar', 'country', 'airport'])
            if (!text(value[key]))
                issues.push(issue(`$.${key}`, 'required', `${key} inválido`, value[key]));
        if (text(value.airport) && !/^[A-Z0-9]{4}$/.test(value.airport))
            issues.push(issue('$.airport', 'format', 'airport deve ser ICAO', value.airport));
        for (const key of ['xp', 'score', 'turns'])
            if (!finite(value[key]) || value[key] < 0)
                issues.push(issue(`$.${key}`, 'range', `${key} deve ser número >= 0`, value[key]));
        if (!integer(value.level) || value.level < 1)
            issues.push(issue('$.level', 'range', 'level deve ser inteiro >= 1', value.level));
        return finish('ControllerProfile', value, issues, context);
    }
    SkywardContractRuntime.validateProfile = validateProfile;
    function validateProfileSave(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('ProfileSaveV1', undefined, [issue('$', 'type', 'Save de perfil deve ser objeto', value)], context);
        if (value.schema !== 1)
            issues.push(issue('$.schema', 'schema_mismatch', 'schema de perfil esperado 1', value.schema));
        if (!text(value.build))
            issues.push(issue('$.build', 'required', 'build obrigatório', value.build));
        if (!finite(value.at) || value.at < 0)
            issues.push(issue('$.at', 'range', 'at inválido', value.at));
        if (!text(value.reason))
            issues.push(issue('$.reason', 'required', 'reason obrigatório', value.reason));
        const profileResult = validateProfile(value.profile, `${context}.profile`);
        profileResult.issues.forEach(entry => issues.push({ ...entry, path: `$.profile${entry.path.slice(1)}` }));
        return finish('ProfileSaveV1', value, issues, context);
    }
    SkywardContractRuntime.validateProfileSave = validateProfileSave;
    function validateAircraft(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('AircraftState', undefined, [issue('$', 'type', 'Aeronave deve ser objeto', value)], context);
        if (!text(value.id) || !/^[A-Z0-9]{3,10}$/.test(value.id))
            issues.push(issue('$.id', 'format', 'Callsign inválido', value.id));
        if (!text(value.type))
            issues.push(issue('$.type', 'required', 'Tipo de aeronave obrigatório', value.type));
        if (value.kind !== 'arrival' && value.kind !== 'departure')
            issues.push(issue('$.kind', 'enum', 'kind inválido', value.kind));
        if (!statuses.includes(value.status))
            issues.push(issue('$.status', 'enum', 'status inválido', value.status));
        for (const key of ['x', 'y', 'heading', 'speed', 'alt', 'targetAlt', 'risk', 'fuel', 'damage', 'groundTimer', 'requestedAt'])
            if (!finite(value[key]))
                issues.push(issue(`$.${key}`, 'type', `${key} deve ser número finito`, value[key]));
        if (finite(value.heading) && (value.heading < 0 || value.heading >= 360))
            issues.push(issue('$.heading', 'range', 'heading deve estar entre 0 e 359.999', value.heading));
        if (finite(value.speed) && (value.speed < 0 || value.speed > 500))
            issues.push(issue('$.speed', 'range', 'speed fora do limite', value.speed));
        if (finite(value.alt) && (value.alt < 0 || value.alt > 500))
            issues.push(issue('$.alt', 'range', 'alt fora do limite', value.alt));
        if (finite(value.fuel) && (value.fuel < 0 || value.fuel > 100))
            issues.push(issue('$.fuel', 'range', 'fuel deve estar entre 0 e 100', value.fuel));
        for (const key of ['selected', 'cleared', 'emergency', 'hold'])
            if (typeof value[key] !== 'boolean')
                issues.push(issue(`$.${key}`, 'type', `${key} deve ser booleano`, value[key]));
        if (!Array.isArray(value.trail))
            issues.push(issue('$.trail', 'type', 'trail deve ser array', value.trail));
        else
            value.trail.forEach((point, index) => {
                if (!isRecord(point) || !finite(point.x) || !finite(point.y))
                    issues.push(issue(`$.trail[${index}]`, 'type', 'Ponto de trilha inválido', point));
            });
        if (value.request !== null && value.request !== undefined && !requestTypes.includes(value.request))
            issues.push(issue('$.request', 'enum', 'request inválido', value.request));
        return finish('AircraftState', value, issues, context);
    }
    SkywardContractRuntime.validateAircraft = validateAircraft;
    function validateAircraftList(value, context = '') {
        if (!Array.isArray(value))
            return finish('AircraftState[]', undefined, [issue('$', 'type', 'Lista de aeronaves deve ser array', value)], context);
        const issues = [];
        const seen = new Set();
        value.forEach((item, index) => {
            const result = validateAircraft(item, `${context}[${index}]`);
            result.issues.forEach(entry => issues.push({ ...entry, path: `$[${index}]${entry.path.slice(1)}` }));
            if (isRecord(item) && text(item.id)) {
                if (seen.has(item.id))
                    issues.push(issue(`$[${index}].id`, 'duplicate', 'Callsign duplicado', item.id));
                seen.add(item.id);
            }
        });
        return finish('AircraftState[]', value, issues, context);
    }
    SkywardContractRuntime.validateAircraftList = validateAircraftList;
    function validateAircraftCatalog(value, context = '') {
        if (!Array.isArray(value))
            return finish('AircraftCatalogEntry[]', undefined, [issue('$', 'type', 'Catálogo deve ser array', value)], context);
        const issues = [];
        value.forEach((item, index) => {
            if (!isRecord(item)) {
                issues.push(issue(`$[${index}]`, 'type', 'Entrada deve ser objeto', item));
                return;
            }
            if (!text(item.call))
                issues.push(issue(`$[${index}].call`, 'required', 'call obrigatório', item.call));
            if (!text(item.type))
                issues.push(issue(`$[${index}].type`, 'required', 'type obrigatório', item.type));
            if (item.kind !== 'arrival' && item.kind !== 'departure')
                issues.push(issue(`$[${index}].kind`, 'enum', 'kind inválido', item.kind));
            if (!statuses.includes(item.state))
                issues.push(issue(`$[${index}].state`, 'enum', 'state inválido', item.state));
            if (!finite(item.alt) || !finite(item.speed))
                issues.push(issue(`$[${index}]`, 'number', 'alt e speed devem ser finitos', item));
        });
        return finish('AircraftCatalogEntry[]', value, issues, context);
    }
    SkywardContractRuntime.validateAircraftCatalog = validateAircraftCatalog;
    function validateRequest(value, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('AtcRequest', undefined, [issue('$', 'type', 'Solicitação deve ser objeto', value)], context);
        if (!text(value.id))
            issues.push(issue('$.id', 'required', 'id obrigatório', value.id));
        if (!requestTypes.includes(value.type))
            issues.push(issue('$.type', 'enum', 'type inválido', value.type));
        if (!priorities.includes(value.priority))
            issues.push(issue('$.priority', 'enum', 'priority inválida', value.priority));
        if (!text(value.text))
            issues.push(issue('$.text', 'required', 'text obrigatório', value.text));
        if (!finite(value.time) || value.time < 0)
            issues.push(issue('$.time', 'range', 'time inválido', value.time));
        return finish('AtcRequest', value, issues, context);
    }
    SkywardContractRuntime.validateRequest = validateRequest;
    function validateRequests(value, context = '') {
        if (!Array.isArray(value))
            return finish('AtcRequest[]', undefined, [issue('$', 'type', 'Lista de solicitações deve ser array', value)], context);
        const issues = [];
        const seen = new Set();
        value.forEach((item, index) => {
            const result = validateRequest(item, `${context}[${index}]`);
            result.issues.forEach(entry => issues.push({ ...entry, path: `$[${index}]${entry.path.slice(1)}` }));
            if (isRecord(item) && text(item.id) && text(item.type)) {
                const key = `${item.id}|${item.type}`;
                if (seen.has(key))
                    issues.push(issue(`$[${index}]`, 'duplicate', 'Solicitação duplicada', key));
                seen.add(key);
            }
        });
        return finish('AtcRequest[]', value, issues, context);
    }
    SkywardContractRuntime.validateRequests = validateRequests;
    function validateSnapshot(value, expectedSchema, context = '') {
        const issues = [];
        if (!isRecord(value))
            return finish('SnapshotV3', undefined, [issue('$', 'type', 'Snapshot deve ser objeto', value)], context);
        if (!integer(value.schema) || value.schema < 1)
            issues.push(issue('$.schema', 'range', 'schema inválido', value.schema));
        if (expectedSchema !== undefined && value.schema !== expectedSchema)
            issues.push(issue('$.schema', 'schema_mismatch', `schema esperado ${expectedSchema}`, value.schema));
        if (value.schema === 3) {
            if (!text(value.saveId))
                issues.push(issue('$.saveId', 'required', 'saveId obrigatório', value.saveId));
            if (!text(value.sessionId))
                issues.push(issue('$.sessionId', 'required', 'sessionId obrigatório', value.sessionId));
            const profileResult = validateProfile(value.profile, `${context}.profile`);
            profileResult.issues.forEach(entry => issues.push({ ...entry, path: `$.profile${entry.path.slice(1)}` }));
        }
        if (!text(value.build))
            issues.push(issue('$.build', 'required', 'build obrigatório', value.build));
        if (!text(value.reason))
            issues.push(issue('$.reason', 'required', 'reason obrigatório', value.reason));
        for (const key of ['at', 'elapsed', 'score'])
            if (!finite(value[key]))
                issues.push(issue(`$.${key}`, 'type', `${key} deve ser finito`, value[key]));
        const aircraftResult = validateAircraftList(value.aircraft, `${context}.aircraft`);
        aircraftResult.issues.forEach(entry => issues.push({ ...entry, path: `$.aircraft${entry.path.slice(1)}` }));
        const requestsResult = validateRequests(value.requests, `${context}.requests`);
        requestsResult.issues.forEach(entry => issues.push({ ...entry, path: `$.requests${entry.path.slice(1)}` }));
        if (value.selectedRequest !== null && value.selectedRequest !== undefined) {
            const requestResult = validateRequest(value.selectedRequest, `${context}.selectedRequest`);
            requestResult.issues.forEach(entry => issues.push({ ...entry, path: `$.selectedRequest${entry.path.slice(1)}` }));
        }
        if (!isRecord(value.stats))
            issues.push(issue('$.stats', 'type', 'stats deve ser objeto', value.stats));
        if (!text(value.profileAirport))
            issues.push(issue('$.profileAirport', 'required', 'profileAirport obrigatório', value.profileAirport));
        return finish('SnapshotV3', value, issues, context);
    }
    SkywardContractRuntime.validateSnapshot = validateSnapshot;
    function sanitizeProfile(value, fallback) {
        const base = fallback || { name: 'Controlador', avatar: 'male', country: 'Brasil', airport: 'SBGR', xp: 0, level: 1, score: 0, turns: 0 };
        const source = isRecord(value) ? value : {};
        return {
            name: text(source.name) ? source.name.slice(0, 48) : base.name,
            avatar: text(source.avatar) ? source.avatar.slice(0, 32) : base.avatar,
            country: text(source.country) ? source.country.slice(0, 48) : base.country,
            airport: text(source.airport) && /^[A-Z0-9]{4}$/.test(source.airport) ? source.airport : base.airport,
            xp: finite(source.xp) ? Math.max(0, source.xp) : base.xp,
            level: integer(source.level) ? Math.max(1, source.level) : base.level,
            score: finite(source.score) ? Math.max(0, source.score) : base.score,
            turns: integer(source.turns) ? Math.max(0, source.turns) : base.turns
        };
    }
    SkywardContractRuntime.sanitizeProfile = sanitizeProfile;
    function sanitizeAircraft(value) {
        if (!isRecord(value) || !text(value.id) || !text(value.type))
            return null;
        const kind = value.kind === 'departure' ? 'departure' : 'arrival';
        const status = statuses.includes(value.status) ? value.status : (kind === 'arrival' ? 'APP' : 'PARKED');
        const trail = Array.isArray(value.trail) ? value.trail.filter(point => isRecord(point) && finite(point.x) && finite(point.y)).slice(-54).map(point => ({ x: bounded(point.x, -8, 108), y: bounded(point.y, -8, 108) })) : [];
        return {
            ...value, id: value.id.slice(0, 10), type: value.type.slice(0, 12), kind, status,
            x: bounded(finite(value.x) ? value.x : 50, -8, 108), y: bounded(finite(value.y) ? value.y : 50, -8, 108),
            heading: ((finite(value.heading) ? value.heading : 0) % 360 + 360) % 360, speed: bounded(finite(value.speed) ? value.speed : 0, 0, 500),
            alt: bounded(finite(value.alt) ? value.alt : 0, 0, 500), targetAlt: bounded(finite(value.targetAlt) ? value.targetAlt : 0, 0, 500),
            trail, risk: bounded(finite(value.risk) ? value.risk : 0, 0, 100), selected: Boolean(value.selected), cleared: Boolean(value.cleared),
            emergency: Boolean(value.emergency), emergencyType: text(value.emergencyType) ? value.emergencyType : null,
            fuel: bounded(finite(value.fuel) ? value.fuel : 50, 0, 100), fuelState: text(value.fuelState) ? value.fuelState : 'OK',
            damage: bounded(finite(value.damage) ? value.damage : 0, 0, 100), hold: Boolean(value.hold), groundTimer: Math.max(0, finite(value.groundTimer) ? value.groundTimer : 0),
            request: requestTypes.includes(value.request) ? value.request : null,
            requestedAt: Math.max(0, finite(value.requestedAt) ? value.requestedAt : 0), nextFix: text(value.nextFix) ? value.nextFix : null
        };
    }
    SkywardContractRuntime.sanitizeAircraft = sanitizeAircraft;
    function sanitizeRequest(value) {
        if (!isRecord(value) || !text(value.id) || !requestTypes.includes(value.type))
            return null;
        return { id: value.id.slice(0, 10), type: value.type, priority: priorities.includes(value.priority) ? value.priority : 'normal', text: text(value.text) ? value.text.slice(0, 160) : String(value.type), time: Math.max(0, finite(value.time) ? value.time : 0) };
    }
    SkywardContractRuntime.sanitizeRequest = sanitizeRequest;
    function validate(contract, value, context = '') {
        const map = {
            BuildInfo: validateBuildInfo, AirportDefinition: validateAirport, 'AirportDefinition[]': validateAirports,
            ControllerProfile: validateProfile, ProfileSaveV1: validateProfileSave, SnapshotV3: (item, ctx) => validateSnapshot(item, undefined, ctx), AircraftState: validateAircraft, 'AircraftState[]': validateAircraftList,
            'AircraftCatalogEntry[]': validateAircraftCatalog, AtcRequest: validateRequest, 'AtcRequest[]': validateRequests
        };
        const validator = map[contract];
        return validator ? validator(value, context) : finish(contract, undefined, [issue('$', 'unknown_contract', `Contrato desconhecido: ${contract}`)], context);
    }
    SkywardContractRuntime.validate = validate;
    function assertContract(contract, value, context = '') {
        const result = validate(contract, value, context);
        if (!result.ok) {
            const summary = result.issues.slice(0, 4).map(entry => `${entry.path}: ${entry.message}`).join('; ');
            throw new TypeError(`[${contract}] ${summary}`);
        }
        return result.value;
    }
    SkywardContractRuntime.assertContract = assertContract;
    SkywardContractRuntime.api = Object.freeze({
        contractSchema: CONTRACT_SCHEMA, version: VERSION,
        validateBuildInfo, validateAirport, validateAirports, validateProfile, validateProfileSave, validateAircraft, validateAircraftList,
        validateAircraftCatalog, validateRequest, validateRequests, validateSnapshot, validate,
        assert: assertContract, sanitizeProfile, sanitizeAircraft, sanitizeRequest,
        getDiagnostics: () => Object.freeze(diagnostics.slice()), clearDiagnostics: () => { diagnostics.length = 0; }
    });
})(SkywardContractRuntime || (SkywardContractRuntime = {}));
window.SKYWARD_CONTRACTS = SkywardContractRuntime.api;
window.SKYWARD_MODULES?.push('00-typescript-contracts');

/* ===== MODULE 04: 01-build-and-radio (01-build-and-radio.js) ===== */
/* @skyward-module 01-build-and-radio
 * Build metadata and ATC radio/readback.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('01-build-and-radio');
const BUILD_INFO = Object.freeze({
  product: 'Skyward Control',
  version: '0.0.0',
  phase: 'F00',
  phaseName: 'Build não carimbada',
  channel: 'development',
  build: 'SC-0.0.0-F00-UNSTAMPED',
  builtAt: 'UNSTAMPED',
  builtAtIso: '',
  schema: 1,
  contractSchema: 1,
  testSchema: 1,
  saveVaultSchema: 1,
  pwaSchema: 1,
  cacheSchema: 1,
  uxSchema: 1,
  desktopSchema: 1,
  accessibilitySchema: 1,
  replaySchema: 1,
  target: 'Mobile-first / Tablet / Desktop',
  ...(window.SKYWARD_BUILD_INFO || {})
});
const QUALITY = window.SKYWARD_QUALITY_KERNEL || null;
const CONTRACTS = window.SKYWARD_CONTRACTS || null;
const BUILD = BUILD_INFO.build;
const BUILD_METADATA_RESULT = CONTRACTS?.validateBuildInfo ? CONTRACTS.validateBuildInfo(window.SKYWARD_BUILD_INFO, 'boot') : {ok:false,issues:[{path:'$',code:'contracts_missing',message:'Camada de contratos indisponível'}]};
const BUILD_METADATA_VALID = Boolean(window.SKYWARD_BUILD_INFO) && BUILD_METADATA_RESULT.ok && /^SC-\d+\.\d+\.\d+-F\d{2}-\d{8}-\d{4}$/.test(BUILD) && BUILD_INFO.phase !== 'F00';
const SNAPSHOT_KEY = `skywardGoodState_v${BUILD_INFO.schema}`;
const LEGACY_SNAPSHOT_KEYS = Object.freeze(['skywardGoodState_v2','skywardGoodState_v1','skywardGoodStateF01']);
const PROFILE_SAVE_SCHEMA = 1;
const SAVE_SESSION_ID = `session-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
const saveVault = () => window.SKYWARD_SAVE_VAULT || null;
const SNAPSHOT_INTERVAL_MS = 8000;
let lastSnapshotAt = 0;
let lastUiRenderAt = 0;
let callsignSequence = 0;
let mobileActiveTab = null;
const CLEARANCE_COMMANDS = Object.freeze({
  clearLanding: 'landing',
  approvePushback: 'pushback',
  approveTaxi: 'taxi',
  lineUp: 'lineup',
  clearTakeoff: 'takeoff',
  clearEmergency: 'emergency'
});

function applyBuildInfo(){
  document.querySelectorAll('[data-build]').forEach(el=>{ el.textContent = BUILD_INFO.build; });
  document.querySelectorAll('[data-build-version]').forEach(el=>{ el.textContent = `v${BUILD_INFO.version}`; });
  document.querySelectorAll('[data-build-date]').forEach(el=>{ el.textContent = BUILD_INFO.builtAt; });
  document.querySelectorAll('[data-build-phase]').forEach(el=>{ el.textContent = BUILD_INFO.phase; });
  document.querySelectorAll('[data-build-channel]').forEach(el=>{ el.textContent = BUILD_INFO.channel.toUpperCase(); });
  document.documentElement.dataset.buildId = BUILD_INFO.build;
  document.documentElement.dataset.buildPhase = BUILD_INFO.phase;
  document.documentElement.dataset.contractSchema = String(BUILD_INFO.contractSchema || CONTRACTS?.contractSchema || 0);
  document.documentElement.dataset.testSchema = String(BUILD_INFO.testSchema || 0);
  document.documentElement.dataset.saveVaultSchema = String(BUILD_INFO.saveVaultSchema || saveVault()?.vaultSchema || 0);
  document.documentElement.dataset.pwaSchema = String(BUILD_INFO.pwaSchema || 0);
  document.documentElement.dataset.cacheSchema = String(BUILD_INFO.cacheSchema || 0);
  document.documentElement.dataset.uxSchema = String(BUILD_INFO.uxSchema || 0);
  document.documentElement.dataset.replaySchema = String(BUILD_INFO.replaySchema || 0);
  document.title = `${BUILD_INFO.product} v${BUILD_INFO.version} — ${BUILD_INFO.phase}`;
}

const SAFE_MODE = { errors: [], contractFailures:0, saveRecoveries:0, saveMigrations:0, lastSaveStatus:'idle', lastFrame: 0, lastScene: 'boot', maxAircraft: 16, recovering:false, lastGoodState:null, diagnostics:[], perf:{badFrames:0, mode:'normal'} };
function safeLogError(err, where='runtime'){
  try{
    const msg = (err && (err.stack || err.message)) ? (err.stack || err.message) : String(err);
    SAFE_MODE.errors.unshift({ where, msg: msg.slice(0,500), at: Date.now() });
    SAFE_MODE.errors = SAFE_MODE.errors.slice(0,8);
    localStorage.setItem('skywardLastError', JSON.stringify(SAFE_MODE.errors[0]));
  }catch(_e){}
}
function showSafeMode(err){
  safeLogError(err,'safe-mode');
  try{
    running=false; paused=true;
    const shield=document.querySelector('#crashShield');
    const detail=document.querySelector('#safeErrorText');
    if(detail) detail.textContent = SAFE_MODE.errors[0]?.msg || 'Falha desconhecida recuperada.';
    if(shield) shield.classList.add('open');
  }catch(_e){}
}
window.addEventListener('error', e=>{ showSafeMode(e.error || e.message); });
window.addEventListener('unhandledrejection', e=>{ showSafeMode(e.reason || 'Promise rejeitada'); });
function safeStorageGet(key, fallback){ try{ const raw=localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; }catch(e){ safeLogError(e,'storage-get'); return fallback; } }
function safeStorageSet(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); return true; }catch(e){ safeLogError(e,'storage-set'); return false; } }
function cloneSafe(value){ return JSON.parse(JSON.stringify(value)); }
function isValidSnapshot(snapshot){
  if(CONTRACTS?.validateSnapshot){
    const result=CONTRACTS.validateSnapshot(snapshot, BUILD_INFO.schema, 'snapshot');
    if(!result.ok) SAFE_MODE.contractFailures += result.issues.length;
    return result.ok;
  }
  return !!snapshot && snapshot.schema===BUILD_INFO.schema && Array.isArray(snapshot.aircraft) && Array.isArray(snapshot.requests) && Number.isFinite(Number(snapshot.score));
}
function clearGoodState(){
  SAFE_MODE.lastGoodState=null;
  SAFE_MODE.lastSaveStatus='cleared';
  lastSnapshotAt=0;
  try{
    saveVault()?.clear('snapshot');
    localStorage.removeItem(SNAPSHOT_KEY);
    LEGACY_SNAPSHOT_KEYS.forEach(key=>localStorage.removeItem(key));
  }catch(_e){}
}

function setDiagnostic(msg='SISTEMA OK', level='ok'){
  try{
    const d=document.querySelector('#opsDiagnostic');
    if(d){ d.textContent=msg; d.className='ops-diagnostic '+level; }
    SAFE_MODE.diagnostics.unshift({msg,level,at:Date.now()});
    SAFE_MODE.diagnostics=SAFE_MODE.diagnostics.slice(0,12);
  }catch(_e){}
}

function setReadback(text='', level='ok'){
  try{
    const el=document.querySelector('#readbackLine');
    if(!el) return;
    el.textContent = 'READBACK: ' + (text || 'aguardando transmissão.');
    el.className = 'readback-line ' + (level || 'ok');
  }catch(e){ safeLogError(e,'readback'); }
}
function atcReadbackFor(p, cmd){
  if(!p) return '';
  const req = requests.find(r=>r.id===p.id);
  if(cmd==='left' || cmd==='right') return `${p.id} rumo ${Math.round(p.heading)} graus.`;
  if(cmd==='slow' || cmd==='fast') return `${p.id} velocidade ${Math.round(p.speed)} nós.`;
  if(cmd==='climb' || cmd==='descend') return `${p.id} nível alvo FL${Math.round(p.targetAlt)}.`;
  if(cmd==='hold') return `${p.id} ${p.status==='HOLD'?'entrando em espera':'prosseguindo aproximação'}.`;
  if(cmd==='holdShort') return `${p.id} mantendo antes da pista ${runway.name}.`;
  if(cmd==='vectorFinal') return `${p.id} vetor final pista ${runway.name}.`;
  if(cmd==='goAround') return `${p.id} arremetendo, subindo FL080.`;
  if(cmd==='deny') return `${p.id} aguardando nova autorização.`;
  if(cmd==='emergency') return `${p.id} MAYDAY reconhecido, prioridade máxima.`;
  if(cmd==='clearLanding') return `${p.id} autorizado pouso pista ${runway.name}.`;
  if(cmd==='clearTakeoff') return `${p.id} autorizado decolagem pista ${runway.name}.`;
  if(cmd==='lineUp') return `${p.id} alinhar e aguardar pista ${runway.name}.`;
  if(cmd==='approveTaxi') return `${p.id} taxi autorizado para ponto de espera ${runway.name}.`;
  if(cmd==='approvePushback') return `${p.id} pushback aprovado.`;
  if(cmd==='clearEmergency') return `${p.id} pouso imediato autorizado.`;
  return `${p.id} comando ${cmd.toUpperCase()} recebido.`;
}

/* ===== MODULE 05: 01-pwa-runtime (01-pwa-runtime.js) ===== */
/* @skyward-module 01-pwa-runtime
 * Installable PWA, offline cache status, controlled updates and fullscreen lifecycle.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('01-pwa-runtime');
const PWA_RUNTIME_SCHEMA = Number(BUILD_INFO.pwaSchema || 1);
const PWA_CACHE_SCHEMA = Number(BUILD_INFO.cacheSchema || 1);
const PWA_STATE = {
  supported:'serviceWorker' in navigator,
  online:navigator.onLine !== false,
  standalone:false,
  installPrompt:null,
  registration:null,
  waitingWorker:null,
  cacheReady:false,
  cacheName:'',
  applyingUpdate:false,
  lastMessage:'Inicializando recursos offline.',
  history:[]
};
function pwaStandalone(){
  return Boolean(window.matchMedia?.('(display-mode: standalone)').matches || window.matchMedia?.('(display-mode: fullscreen)').matches || navigator.standalone === true);
}
function pwaRecord(event,detail=''){
  PWA_STATE.history.unshift({event,detail:String(detail||''),at:Date.now()});
  PWA_STATE.history=PWA_STATE.history.slice(0,20);
}
function pwaSetMessage(message){ PWA_STATE.lastMessage=String(message||''); renderPwaStatus(); }
function pwaStatusSnapshot(){
  return Object.freeze({schema:PWA_RUNTIME_SCHEMA,cacheSchema:PWA_CACHE_SCHEMA,supported:PWA_STATE.supported,online:PWA_STATE.online,standalone:PWA_STATE.standalone,installable:Boolean(PWA_STATE.installPrompt),registered:Boolean(PWA_STATE.registration),waiting:Boolean(PWA_STATE.waitingWorker),cacheReady:PWA_STATE.cacheReady,cacheName:PWA_STATE.cacheName,fullscreen:Boolean(document.fullscreenElement),build:BUILD,history:Object.freeze(PWA_STATE.history.slice())});
}
function renderPwaStatus(){
  PWA_STATE.standalone=pwaStandalone();
  const mode=PWA_STATE.standalone?'APP INSTALADO':document.fullscreenElement?'TELA CHEIA':'NAVEGADOR';
  const network=PWA_STATE.online?'ONLINE':'OFFLINE';
  const cache=PWA_STATE.cacheReady?'PRONTO':PWA_STATE.supported?'PREPARANDO':'INDISPONÍVEL';
  const update=PWA_STATE.waitingWorker?'DISPONÍVEL':'ATUAL';
  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set('pwaModeValue',mode); set('pwaNetworkValue',network); set('pwaCacheValue',cache); set('pwaUpdateValue',update);
  set('pwaMessage',PWA_STATE.lastMessage);
  set('pwaMenuStatus',`${PWA_STATE.online?'ONLINE':'OFFLINE'} • cache ${cache.toLowerCase()} • ${PWA_STATE.standalone?'app instalado':'navegador'}`);
  document.querySelectorAll('[data-pwa-cache-name]').forEach(el=>el.textContent=PWA_STATE.cacheName||`schema-${PWA_CACHE_SCHEMA}`);
  document.querySelectorAll('[data-pwa-action="install"]').forEach(el=>{el.hidden=PWA_STATE.standalone || (!PWA_STATE.installPrompt && !/iphone|ipad|ipod/i.test(navigator.userAgent));});
  document.querySelectorAll('[data-pwa-action="update"]').forEach(el=>{el.hidden=!PWA_STATE.waitingWorker;});
  document.body.classList.toggle('is-offline',!PWA_STATE.online);
  document.body.classList.toggle('is-standalone',PWA_STATE.standalone);
  document.body.classList.toggle('is-fullscreen',Boolean(document.fullscreenElement));
  const banner=document.getElementById('networkBanner'); if(banner) banner.classList.toggle('show',!PWA_STATE.online);
}
function openPwaPanel(){const panel=document.getElementById('pwaPanel');if(panel){panel.classList.add('open');panel.setAttribute('aria-hidden','false');renderPwaStatus();}}
function closePwaPanel(){const panel=document.getElementById('pwaPanel');if(panel){panel.classList.remove('open');panel.setAttribute('aria-hidden','true');}}
async function installPwa(){
  if(PWA_STATE.standalone){pwaSetMessage('O Skyward Control já está instalado neste dispositivo.');return {ok:true,already:true};}
  if(PWA_STATE.installPrompt){
    const prompt=PWA_STATE.installPrompt; PWA_STATE.installPrompt=null; await prompt.prompt();
    const choice=await prompt.userChoice; pwaRecord('install-choice',choice?.outcome||'unknown'); renderPwaStatus();
    return {ok:choice?.outcome==='accepted',outcome:choice?.outcome||'unknown'};
  }
  const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  pwaSetMessage(ios?'No Safari, use Compartilhar → Adicionar à Tela de Início.':'A instalação aparecerá quando o navegador concluir os requisitos PWA.');
  openPwaPanel(); return {ok:false,reason:'prompt-unavailable'};
}
async function toggleProfessionalFullscreen(){
  try{
    if(document.fullscreenElement && document.exitFullscreen){await document.exitFullscreen();pwaRecord('fullscreen-exit');}
    else if(document.documentElement.requestFullscreen){await document.documentElement.requestFullscreen({navigationUI:'hide'});pwaRecord('fullscreen-enter');}
    else {pwaSetMessage(PWA_STATE.standalone?'O app já está usando o modo de tela independente.':'Tela cheia não é suportada neste navegador.');return false;}
    if(document.body.classList.contains('game-active') && screen.orientation?.lock){try{await screen.orientation.lock('landscape');}catch(_e){}}
    setTimeout(()=>{renderPwaStatus();resize();},120); return true;
  }catch(error){safeLogError(error,'pwa-fullscreen');pwaSetMessage('O navegador bloqueou a tela cheia. Toque novamente após interagir com a página.');return false;}
}
function trackPwaWorker(registration){
  if(!registration)return;
  PWA_STATE.registration=registration;
  if(registration.waiting){PWA_STATE.waitingWorker=registration.waiting;pwaSetMessage('Nova versão pronta. A atualização será aplicada somente com sua autorização.');}
  registration.addEventListener('updatefound',()=>{
    const worker=registration.installing;if(!worker)return;
    pwaRecord('update-found');
    worker.addEventListener('statechange',()=>{
      if(worker.state==='installed' && navigator.serviceWorker.controller){PWA_STATE.waitingWorker=registration.waiting||worker;pwaSetMessage('Nova versão armazenada. Salve o turno e atualize quando estiver pronto.');openPwaPanel();}
      if(worker.state==='activated'){PWA_STATE.cacheReady=true;renderPwaStatus();}
    });
  });
}
async function registerPwa(){
  if(!PWA_STATE.supported || (!/^https?:$/.test(location.protocol) && window.SKYWARD_PWA_TEST_MODE!==true)){pwaSetMessage('PWA disponível quando o jogo é servido por HTTPS ou localhost.');return null;}
  try{
    const registration=await navigator.serviceWorker.register('./service-worker.js',{scope:'./',updateViaCache:'none'});
    trackPwaWorker(registration);
    const ready=await navigator.serviceWorker.ready; trackPwaWorker(ready); PWA_STATE.cacheReady=true;
    pwaRecord('registered',ready.scope); renderPwaStatus();
    navigator.serviceWorker.controller?.postMessage({type:'GET_VERSION'});
    return ready;
  }catch(error){safeLogError(error,'pwa-register');pwaSetMessage('Não foi possível ativar o cache offline neste ambiente.');return null;}
}
async function checkPwaUpdate(){
  try{const reg=PWA_STATE.registration||await registerPwa();if(!reg)return false;await reg.update();pwaSetMessage(PWA_STATE.waitingWorker?'Atualização pronta para aplicar.':'Esta build já é a versão mais recente disponível.');return true;}
  catch(error){safeLogError(error,'pwa-update-check');pwaSetMessage('Falha ao verificar atualização; o jogo atual continua disponível.');return false;}
}
async function applyPwaUpdate(){
  const worker=PWA_STATE.waitingWorker||PWA_STATE.registration?.waiting;
  if(!worker){pwaSetMessage('Nenhuma atualização pendente.');return false;}
  try{
    PWA_STATE.applyingUpdate=true;
    if(typeof paused!=='undefined') paused=true;
    if(typeof persistProfile==='function') persistProfile('pwa-update');
    if(typeof saveGoodState==='function' && typeof running!=='undefined' && running) saveGoodState('pwa-update');
    pwaRecord('update-authorized',BUILD); pwaSetMessage('Progresso protegido. Ativando a nova build...');
    worker.postMessage({type:'SKIP_WAITING',build:BUILD}); return true;
  }catch(error){PWA_STATE.applyingUpdate=false;safeLogError(error,'pwa-apply-update');pwaSetMessage('Atualização cancelada para preservar o turno atual.');return false;}
}
function protectPwaProgress(reason){
  try{
    if(typeof persistProfile==='function') persistProfile(reason);
    if(typeof saveGoodState==='function' && typeof running!=='undefined' && running) saveGoodState(reason);
  }catch(error){safeLogError(error,'pwa-lifecycle-save');}
}
function initPwaRuntime(){
  PWA_STATE.standalone=pwaStandalone(); PWA_STATE.online=navigator.onLine!==false; renderPwaStatus();
  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('[data-pwa-action]');if(!trigger)return;
    const action=trigger.dataset.pwaAction;
    if(action==='open')openPwaPanel(); else if(action==='close')closePwaPanel(); else if(action==='install')installPwa(); else if(action==='fullscreen')toggleProfessionalFullscreen(); else if(action==='update')applyPwaUpdate(); else if(action==='check-update')checkPwaUpdate();
  });
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();PWA_STATE.installPrompt=event;pwaRecord('install-ready');pwaSetMessage('Instalação disponível. O app ocupará a tela inteira e funcionará offline.');});
  window.addEventListener('appinstalled',()=>{PWA_STATE.installPrompt=null;PWA_STATE.standalone=true;pwaRecord('installed');pwaSetMessage('Aplicativo instalado com sucesso.');closePwaPanel();});
  window.addEventListener('online',()=>{PWA_STATE.online=true;pwaRecord('online');pwaSetMessage('Conexão restaurada. O cache offline permanece ativo.');checkPwaUpdate();});
  window.addEventListener('offline',()=>{PWA_STATE.online=false;pwaRecord('offline');pwaSetMessage('Sem internet. O turno continua usando os arquivos protegidos em cache.');});
  document.addEventListener('fullscreenchange',renderPwaStatus);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')protectPwaProgress('visibility-hidden');else if(document.visibilityState==='visible'&&PWA_STATE.online)checkPwaUpdate();});
  window.addEventListener('pagehide',()=>protectPwaProgress('pagehide'));
  navigator.serviceWorker?.addEventListener('message',event=>{const data=event.data||{};if(data.type==='PWA_VERSION'){PWA_STATE.cacheName=String(data.cacheName||'');PWA_STATE.cacheReady=Boolean(data.cacheReady);pwaRecord('worker-version',data.build||'');renderPwaStatus();}});
  navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(PWA_STATE.applyingUpdate)location.reload();});
  registerPwa();
}
window.SKYWARD_PWA=Object.freeze({pwaSchema:PWA_RUNTIME_SCHEMA,cacheSchema:PWA_CACHE_SCHEMA,getStatus:pwaStatusSnapshot,register:registerPwa,install:installPwa,checkUpdate:checkPwaUpdate,applyUpdate:applyPwaUpdate,toggleFullscreen:toggleProfessionalFullscreen,openPanel:openPwaPanel});
setTimeout(initPwaRuntime,0);

/* ===== MODULE 06: 02-save-vault (02-save-vault.js) ===== */
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

/* ===== MODULE 07: 02-weather-fuel-operations (02-weather-fuel-operations.js) ===== */
/* @skyward-module 02-weather-fuel-operations
 * Weather, fuel, runway, mission and handoff operations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('02-weather-fuel-operations');
const WAKE_RULES = {
  categories:{ 'A320':'M', 'B738':'M', 'E190':'M', 'A321':'M', 'B77W':'H', 'A359':'H', 'B744':'H', 'C208':'L', 'PC12':'L', 'GLEX':'M' },
  spacing:{ 'H-H':5.0, 'H-M':6.0, 'H-L':7.0, 'M-H':4.0, 'M-M':4.0, 'M-L':5.0, 'L-H':3.0, 'L-M':3.0, 'L-L':3.0 }
};
const RUNWAY_OPS = { mode:'MIXED', wind:'120/06', qnh:'1016', ceiling:'BKN018', visibility:'10KM', metarSeq:0 };
const WX_STATE = { condition:'VMC', precip:0, visibilityKm:10, ceilingFt:1800, crosswindKt:6, severity:0, tick:0, ops:'NORMAL' };
function updateWeatherOps(dt=0){
  try{
    WX_STATE.tick += dt || 0.016;
    const t = WX_STATE.tick;
    const wave = (Math.sin(t*0.055)+1)/2;
    const gust = (Math.sin(t*0.14+1.7)+1)/2;
    WX_STATE.precip = Math.max(0, Math.min(1, wave*.65 + (gust>.83?.25:0)));
    WX_STATE.visibilityKm = Math.max(2.2, 10 - WX_STATE.precip*6.5 - (gust>.88?1.0:0));
    WX_STATE.ceilingFt = Math.round(Math.max(500, 2200 - WX_STATE.precip*1300 - gust*250));
    WX_STATE.crosswindKt = Math.round(5 + gust*14 + WX_STATE.precip*5);
    WX_STATE.severity = Math.max(WX_STATE.precip, WX_STATE.crosswindKt>16?.85:0, WX_STATE.visibilityKm<4?.9:0, WX_STATE.ceilingFt<900?.8:0);
    WX_STATE.condition = WX_STATE.severity>.82 ? 'STORM OPS' : WX_STATE.severity>.58 ? 'LOW VIS' : WX_STATE.precip>.35 ? 'RAIN' : 'VMC';
    WX_STATE.ops = WX_STATE.severity>.82 ? 'CAT I / EXTRA SEP' : WX_STATE.severity>.58 ? 'REDUCED RATE' : WX_STATE.precip>.35 ? 'WET RWY' : 'NORMAL';
    RUNWAY_OPS.wind = `${String(Math.round((115+gust*35)%360)).padStart(3,'0')}/${String(WX_STATE.crosswindKt).padStart(2,'0')}`;
    RUNWAY_OPS.ceiling = WX_STATE.ceilingFt<1000 ? `OVC${String(Math.round(WX_STATE.ceilingFt/100)).padStart(3,'0')}` : `BKN${String(Math.round(WX_STATE.ceilingFt/100)).padStart(3,'0')}`;
    RUNWAY_OPS.visibility = `${WX_STATE.visibilityKm.toFixed(1)}KM`;
    RUNWAY_OPS.mode = WX_STATE.ops;
    const wEl=document.querySelector('#weather'); if(wEl) wEl.textContent = WX_STATE.condition;
  }catch(e){ safeLogError(e,'weather-ops'); }
}
function weatherSeparationMultiplier(){
  return WX_STATE.severity>.82 ? 1.45 : WX_STATE.severity>.58 ? 1.28 : WX_STATE.precip>.35 ? 1.15 : 1;
}
function renderWeatherBoard(){
  try{
    const box=document.querySelector('#weatherBoard'); if(!box) return;
    box.className = 'weather-board ' + (WX_STATE.severity>.82?'danger':WX_STATE.severity>.58?'warn':'ok');
    box.innerHTML = `<div class="wx-head"><b>WX / OPS</b><span>${WX_STATE.condition}</span></div>
      <div class="wx-grid"><div><small>WIND</small><b>${RUNWAY_OPS.wind}</b></div><div><small>VIS</small><b>${RUNWAY_OPS.visibility}</b></div><div><small>CEILING</small><b>${RUNWAY_OPS.ceiling}</b></div><div><small>OPS</small><b>${WX_STATE.ops}</b></div></div>`;
  }catch(e){ safeLogError(e,'weather-board'); }
}

function updateFuelAndEmergency(dt){
  try{
    emergencyDirector.active=false; emergencyDirector.target=null; emergencyDirector.message='Sem emergência ativa.';
    for(const p of aircraft){
      if(!p) continue;
      const moving = !['PARKED'].includes(p.status);
      const base = (p.kind==='arrival' ? FUEL_RULES.arrivalBurn : FUEL_RULES.departureBurn) * (typeof aircraftFuelMultiplier==='function' ? aircraftFuelMultiplier(p) : 1);
      const wxMul = WX_STATE.severity>.82 ? 1.55 : WX_STATE.severity>.58 ? 1.28 : 1;
      const holdMul = p.status==='HOLD' ? 1.45 : 1;
      if(moving) p.fuel = Math.max(0, Number(p.fuel ?? 60) - dt*base*wxMul*holdMul*18);
      if(p.damage>0) p.fuel = Math.max(0, p.fuel - dt*0.015);
      const prev=p.fuelState || 'OK';
      p.fuelState = p.fuel <= FUEL_RULES.criticalThreshold ? 'CRITICAL' : p.fuel <= FUEL_RULES.emergencyThreshold ? 'EMERGENCY' : p.fuel <= FUEL_RULES.lowThreshold ? 'LOW' : 'OK';
      if(p.fuelState==='LOW' && prev==='OK'){
        stats.lowFuel=(stats.lowFuel||0)+1;
        addRequest(p,'lowfuel','warn');
        addLog(`${p.id}: combustível mínimo, solicita prioridade.`, 'warn');
      }
      if((p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') && !p.emergency){
        p.emergency=true; p.emergencyType='LOW FUEL'; p.status = p.kind==='arrival' ? 'EMERG' : p.status;
        stats.emergencies=(stats.emergencies||0)+1;
        addRequest(p,'emergency','urgent');
        addLog(`${p.id}: MAYDAY combustível crítico. Vetor imediato para pouso.`, 'danger');
      }
      if(p.emergency){
        emergencyDirector.active=true; emergencyDirector.target=p.id;
        emergencyDirector.message = `${p.id} ${p.emergencyType || 'EMERG'} • FUEL ${Math.round(p.fuel)}% • prioridade máxima`;
      }
      if(p.fuel<=0){
        endGame(true,`${p.id} ficou sem combustível.`);
        return;
      }
    }
  }catch(e){ safeLogError(e,'fuel-emergency-update'); }
}
function fuelClass(p){
  if(!p) return 'ok';
  if(p.fuelState==='CRITICAL' || p.fuelState==='EMERGENCY' || p.emergency) return 'danger';
  if(p.fuelState==='LOW' || (p.damage||0)>0) return 'warn';
  return 'ok';
}
function renderFuelBoard(){
  try{
    const box=document.querySelector('#fuelBoard'); if(!box) return;
    const sorted=[...aircraft].sort((a,b)=>(a.fuel??99)-(b.fuel??99)).slice(0,5);
    const rows=sorted.map(p=>`<div class="fuel-row ${fuelClass(p)}"><b>${p.id}</b><span>${p.fuelState||'OK'}</span><em>FUEL ${Math.round(p.fuel??0)}% • DMG ${Math.round(p.damage||0)}%</em></div>`).join('') || '<em>sem tráfego</em>';
    box.className='fuel-board '+(emergencyDirector.active?'danger':sorted.some(p=>fuelClass(p)==='warn')?'warn':'ok');
    box.innerHTML=`<div class="fuel-head"><b>FUEL / EMERG</b><span>${emergencyDirector.active?'EMERGÊNCIA ATIVA':'NORMAL'}</span></div><div class="fuel-director">${emergencyDirector.message}</div>${rows}`;
  }catch(e){ safeLogError(e,'fuel-board'); }
}
function maybeGenerateOperationalEmergency(dt){
  try{
    const now=performance.now();
    if(now-(emergencyDirector.lastTick||0)<22000) return;
    emergencyDirector.lastTick=now;
    if(aircraft.length<4 || skywardRandomUnit()>0.18) return;
    const candidates=aircraft.filter(p=>p.kind==='arrival' && !p.emergency && ['APP','HOLD','FINAL'].includes(p.status));
    if(!candidates.length) return;
    const p=candidates[Math.floor(skywardRandomUnit()*candidates.length)];
    p.emergency=true; p.emergencyType = skywardRandomUnit()<.55 ? 'MEDICAL' : 'ENGINE';
    p.status='EMERG'; p.targetAlt=Math.min(p.targetAlt||45,35); p.fuel=Math.min(p.fuel||40, Math.round(rand(18,30)));
    stats.emergencies=(stats.emergencies||0)+1;
    addRequest(p,'emergency','urgent');
    addLog(`${p.id}: MAYDAY ${p.emergencyType}, solicita vetores imediatos para RWY ${runway.name}.`, 'danger');
  }catch(e){ safeLogError(e,'generate-emergency'); }
}

function drawWeatherOverlay(w,h){
  try{
    if(!radarFilters.wx || WX_STATE.precip<=.05) return;
    ctx.save();
    const bands = 7;
    for(let i=0;i<bands;i++){
      const x = ((i*17 + WX_STATE.tick*1.4)%115-10)/100*w;
      const y = (12 + (i*11)%70)/100*h;
      const rw = (18 + i*3)/100*w;
      const rh = (10 + (i%3)*7)/100*h;
      ctx.globalAlpha = 0.05 + WX_STATE.precip*0.11;
      const g=ctx.createRadialGradient(x+rw*.5,y+rh*.5,2,x+rw*.5,y+rh*.5,Math.max(rw,rh));
      g.addColorStop(0,'rgba(70,170,255,.65)'); g.addColorStop(.65,'rgba(20,90,160,.22)'); g.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(x+rw*.5,y+rh*.5,rw*.5,rh*.5,0,0,Math.PI*2); ctx.fill();
    }
    if(WX_STATE.severity>.82){ ctx.globalAlpha=.09; ctx.fillStyle='rgba(255,191,61,.25)'; ctx.fillRect(0,0,w,h); }
    ctx.restore();
  }catch(e){ safeLogError(e,'weather-overlay'); }
}

function wakeCategory(p){
  try{ return p?.wakeCategory || (typeof aircraftPerformanceProfile==='function' ? aircraftPerformanceProfile(p?.type).wake : null) || WAKE_RULES.categories[String(p?.type||'').toUpperCase()] || ((p?.type||'').includes('77')?'H':'M'); }catch(_e){ return 'M'; }
}
function requiredWakeSpacing(lead, trail){
  const leadCat=wakeCategory(lead), trailCat=wakeCategory(trail), wx=weatherSeparationMultiplier();
  if(QUALITY?.wakeSpacing) return QUALITY.wakeSpacing(leadCat,trailCat,wx,WAKE_RULES.spacing);
  const key = `${leadCat}-${trailCat}`;
  return (WAKE_RULES.spacing[key] || 4.0) * wx;
}
function updateRunwayOps(){
  try{
    updateWeatherOps(0.05);
    const wx = ['120/06','090/08','270/05','160/12','330/09'];
    const qnh = ['1016','1013','1019','1011'];
    if(!RUNWAY_OPS.lastUpdate || performance.now()-RUNWAY_OPS.lastUpdate>90000){
      RUNWAY_OPS.lastUpdate=performance.now();
      RUNWAY_OPS.metarSeq=(RUNWAY_OPS.metarSeq+1)%wx.length;
      RUNWAY_OPS.wind=wx[RUNWAY_OPS.metarSeq];
      RUNWAY_OPS.qnh=qnh[RUNWAY_OPS.metarSeq%qnh.length];
      RUNWAY_OPS.mode = conflictPredictions?.length ? 'ARR PRIORITY' : (runwayOccupiedBy?'PROTECTED':'MIXED');
    }
  }catch(e){ safeLogError(e,'runway-ops'); }
}
function renderWakeBoard(){
  try{
    const box=document.querySelector('#runwayBoard');
    if(!box) return;
    updateRunwayOps();
    const final = runwayFlowState().final;
    const depq = runwayFlowState().depq;
    const spacing = final.slice(0,3).map((p,i)=>{
      const lead = final[i-1];
      const req = lead ? requiredWakeSpacing(lead,p).toFixed(1)+'NM' : 'LEAD';
      return `<b>${p.id}</b><span>${wakeCategory(p)} ${req}</span>`;
    }).join('') || '<em>sem sequência</em>';
    const dep = depq.slice(0,3).map(p=>`<b>${p.id}</b><span>${wakeCategory(p)} ${p.status}</span>`).join('') || '<em>sem saída</em>';
    const extra = `<div class="runway-board-extra">
      <div><small>OPS MODE</small><b>${RUNWAY_OPS.mode}</b></div>
      <div><small>METAR</small><b>${RUNWAY_OPS.wind} Q${RUNWAY_OPS.qnh}</b></div>
      <div><small>WAKE APP</small>${spacing}</div>
      <div><small>DEP WAKE</small>${dep}</div>
    </div>`;
    if(!box.querySelector('.runway-board-extra')) box.insertAdjacentHTML('beforeend',extra);
    else box.querySelector('.runway-board-extra').outerHTML=extra;
  }catch(e){ safeLogError(e,'wake-board'); }
}

function adaptivePerformanceGuard(dt){
  try{
    if(!Number.isFinite(dt)) return;
    if(dt>.11) SAFE_MODE.perf.badFrames++; else SAFE_MODE.perf.badFrames=Math.max(0,SAFE_MODE.perf.badFrames-1);
    if(SAFE_MODE.perf.badFrames>16 && SAFE_MODE.perf.mode==='normal'){
      SAFE_MODE.perf.mode='reduced';
      SAFE_MODE.maxAircraft=Math.min(SAFE_MODE.maxAircraft,12);
      if(typeof radarFilters==='object'){ radarFilters.vectors=false; }
      setDiagnostic('MODO PERFORMANCE: vetores reduzidos','warn');
      addLog('Sistema: performance reduzida automaticamente para proteger jogabilidade mobile.','warn');
    }
  }catch(e){ safeLogError(e,'performance-guard'); }
}

function buildMission(){
  const a = airport();
  const traffic = String(a.traffic||'Médio').toLowerCase();
  const heavy = traffic.includes('alto') || traffic.includes('muito');
  const level = Number(profile.level)||1;
  const baseLand = heavy ? 3 : 2;
  const baseDep = heavy ? 2 : 1;
  return {
    startedAt: performance.now(),
    duration: 420,
    targets:{ landed:baseLand+Math.min(2,Math.floor(level/4)), departed:baseDep+Math.min(2,Math.floor(level/5)), safety:86, blockedMax:3, commands:8, maydayResolved:0 },
    completed:false,
    announced:{},
    airport:a.icao
  };
}
function missionProgress(){
  if(!mission) mission=buildMission();
  const safeScore = Math.round(safetyState?.score ?? 100);
  return [
    {key:'landed', label:'Pousos seguros', value:stats.landed||0, target:mission.targets.landed, good:true},
    {key:'departed', label:'Decolagens seguras', value:stats.departed||0, target:mission.targets.departed, good:true},
    {key:'commands', label:'Comandos corretos', value:stats.commands||0, target:mission.targets.commands, good:true},
    {key:'safety', label:'Safety mínimo', value:safeScore, target:mission.targets.safety, good:safeScore>=mission.targets.safety, percent:true},
    {key:'blocked', label:'Bloqueios máximos', value:stats.blocked||0, target:mission.targets.blockedMax, good:(stats.blocked||0)<=mission.targets.blockedMax, inverse:true},
    {key:'mayday', label:'Emergências resolvidas', value:stats.maydayResolved||0, target:mission.targets.maydayResolved||0, good:(stats.maydayResolved||0)>=(mission.targets.maydayResolved||0)}
  ];
}
function renderMissionBoard(){
  try{
    if(!mission) mission=buildMission();
    const box=document.querySelector('#missionBoard');
    const timer=document.querySelector('#missionTimer');
    if(timer){ const elapsed=Math.max(0,(performance.now()-mission.startedAt)/1000); timer.textContent=new Date(elapsed*1000).toISOString().substring(14,19); }
    if(!box) return;
    const rows=missionProgress();
    box.innerHTML=rows.map(r=>{
      const done = r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target);
      const bad = r.inverse && !r.good;
      const val = r.percent ? `${r.value}% / ${r.target}%` : `${r.value}/${r.target}`;
      return `<div class="mission-row ${done?'done':''} ${bad?'danger':''}" data-obj="${r.key}"><b>${r.label}</b><span>${val}</span></div>`;
    }).join('');
    rows.forEach(r=>{
      const done = r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target);
      if(done && !mission.announced[r.key]){
        mission.announced[r.key]=true;
        missionHistory.unshift(`${r.label} concluído`);
        const node=box.querySelector(`[data-obj="${r.key}"]`); if(node) node.classList.add('objective-flash');
      }
    });
    const coreComplete = rows.filter(r=>['landed','departed','safety'].includes(r.key)).every(r=> r.inverse ? r.good : (r.percent ? r.good : r.value>=r.target));
    if(coreComplete && !mission.completed){ mission.completed=true; addLog('Missão do turno: objetivos principais concluídos. Mantenha segurança até o fim.'); setDiagnostic('OBJETIVOS CONCLUÍDOS','ok'); }
  }catch(e){ safeLogError(e,'mission-board'); }
}
function handoffAdvice(p){
  if(!p) return {level:'warn', msg:'Selecione uma aeronave ou use PRÓXIMA SOLICITAÇÃO para iniciar o fluxo operacional.'};
  const req=requests.find(r=>r.id===p.id);
  if(p.emergency || req?.type==='emergency') return {level:'danger', msg:`${p.id}: prioridade de emergência. Proteja a pista, remova conflitos e autorize pouso imediato quando seguro.`};
  if(getSector(p)==='APP') return {level:'ok', msg:`${p.id} em APP: controle altitude/velocidade, vetor final e transfira para TWR quando estabilizado.`};
  if(getSector(p)==='GND') return {level:'ok', msg:`${p.id} em GND: pushback/táxi somente se taxiway e ponto de espera estiverem livres.`};
  if(p.status==='FINAL') return {level:'warn', msg:`${p.id} na final: confirme pista livre. Se houver risco, execute ARREMETER.`};
  if(p.status==='LINEUP') return {level:'warn', msg:`${p.id} alinhado: autorize decolagem apenas sem tráfego em curta final.`};
  return {level:'ok', msg:`${p.id} em ${getSector(p)}: responda ao pedido ativo com comando contextual.`};
}
function renderHandoffAdvisor(){
  try{
    const el=document.querySelector('#handoffAdvisor'); if(!el) return;
    const p=aircraft.find(x=>x.id===selected);
    const a=handoffAdvice(p);
    el.textContent='HANDOFF: '+a.msg;
    el.className='handoff-advisor '+a.level;
  }catch(e){ safeLogError(e,'handoff-advisor'); }
}

function runwayFlowState(){
  const final = aircraft.filter(p=>p.kind==='arrival' && ['APP','FINAL','EMERG','HOLD'].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix));
  const depq = aircraft.filter(p=>['HOLD_SHORT','LINEUP','DEP','TAXI'].includes(p.status)).sort((a,b)=>dist(a,holdingPoints[0]||{x:24,y:57})-dist(b,holdingPoints[0]||{x:24,y:57}));
  const ground = aircraft.filter(p=>['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT'].includes(p.status));
  const blocked = runwayOccupiedBy ? `OCUPADA ${runwayOccupiedBy}` : 'LIVRE';
  return {final, depq, ground, blocked};
}
function renderRunwayBoard(){
  try{
    const box=document.querySelector('#runwayBoard');
    if(!box) return;
    const st=runwayFlowState();
    const fmt=list=>list.slice(0,3).map(p=>`<b>${p.id}</b> <span>${p.status} FL${Math.round(p.alt||0)}</span>`).join('') || '<em>sem tráfego</em>';
    box.innerHTML = `<div class="runway-board-head"><b>RWY ${runway.name}</b><span>${st.blocked}</span></div>
      <div class="runway-board-grid">
        <div><small>APP SEQ</small>${fmt(st.final)}</div>
        <div><small>DEP/TAXI</small>${fmt(st.depq)}</div>
      </div>`;
    renderWakeBoard();
    renderWeatherBoard();
    renderFuelBoard();
  }catch(e){ safeLogError(e,'runway-board'); }
}

/* ===== MODULE 08: 03-resilience-snapshots (03-resilience-snapshots.js) ===== */
/* @skyward-module 03-resilience-snapshots
 * Transactional snapshots, automatic schema migrations, recovery,
 * state sanitization and DOM validation.
 */
window.SKYWARD_MODULES?.push('03-resilience-snapshots');
function snapshotProfileFallback(airportCode='SBGR'){
  const fallback={name:'Controlador',avatar:'male',country:'Brasil',airport:airportCode||'SBGR',xp:0,level:1,score:0,turns:0};
  try{return CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(typeof profile==='object'?profile:fallback,fallback) : fallback;}catch(_e){return fallback;}
}
function normalizeSnapshotStats(value){
  const defaults={landed:0,departed:0,conflicts:0,commands:0,emergencies:0,requests:0,denied:0,runwayIncursions:0,blocked:0,safetyWarnings:0,lowFuel:0,damaged:0,maydayResolved:0};
  const source=value&&typeof value==='object'?value:{};
  return Object.fromEntries(Object.keys(defaults).map(key=>[key,Math.max(0,Number.isFinite(Number(source[key]))?Number(source[key]):0)]));
}
function migrateSnapshotPayload(input,context={}){
  try{
    if(!input||typeof input!=='object'||Array.isArray(input)) return {ok:false,reason:'snapshot_not_object'};
    let value=cloneSafe(input);
    const originalSchema=Number.isInteger(Number(value.schema))?Number(value.schema):1;
    if(originalSchema>BUILD_INFO.schema) return {ok:false,reason:'future_schema',migratedFrom:originalSchema};
    const steps=[];
    if(originalSchema<=1){
      value={
        schema:2,build:String(value.build||'LEGACY-F01'),reason:String(value.reason||'legacy-v1'),
        at:Number(value.at)||Date.now(),elapsed:Math.max(0,Number(value.elapsed)||0),
        selected:value.selected||null,selectedRequest:value.selectedRequest||null,runwayOccupiedBy:value.runwayOccupiedBy||null,
        aircraft:Array.isArray(value.aircraft)?value.aircraft:[],requests:Array.isArray(value.requests)?value.requests:[],
        score:Number(value.score)||0,stats:normalizeSnapshotStats(value.stats),mission:value.mission??null,
        profileAirport:String(value.profileAirport||value.airport||snapshotProfileFallback().airport)
      };
      steps.push('1>2');
    }
    if(Number(value.schema)===2){
      const fallbackProfile=snapshotProfileFallback(String(value.profileAirport||'SBGR'));
      value={...value,
        schema:3,
        saveId:String(value.saveId||`save-${Number(value.at||Date.now()).toString(36)}-${String(value.build||'legacy').replace(/[^A-Z0-9]/gi,'').slice(-10)}`),
        sessionId:String(value.sessionId||`migrated-${Number(value.at||Date.now()).toString(36)}`),
        profile:CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(value.profile||{...fallbackProfile,airport:String(value.profileAirport||fallbackProfile.airport)},fallbackProfile) : fallbackProfile
      };
      steps.push('2>3');
    }
    if(Number(value.schema)!==BUILD_INFO.schema) return {ok:false,reason:'unsupported_schema',migratedFrom:originalSchema,steps};
    value.schema=BUILD_INFO.schema;
    value.build=String(value.build||BUILD);
    value.reason=String(value.reason||context.reason||'migrated');
    value.at=Number(value.at)||Date.now();
    value.elapsed=Math.max(0,Number(value.elapsed)||0);
    value.aircraft=(Array.isArray(value.aircraft)?value.aircraft:[]).map(item=>CONTRACTS?.sanitizeAircraft?CONTRACTS.sanitizeAircraft(item):item).filter(Boolean).slice(0,SAFE_MODE.maxAircraft);
    const ids=new Set(value.aircraft.map(item=>item.id));
    value.requests=(Array.isArray(value.requests)?value.requests:[]).map(item=>CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(item):item).filter(item=>item&&ids.has(item.id)).slice(0,30);
    value.selected=ids.has(value.selected)?value.selected:null;
    value.selectedRequest=value.selectedRequest&&value.requests.some(item=>item.id===value.selectedRequest.id&&item.type===value.selectedRequest.type)?(CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(value.selectedRequest):value.selectedRequest):null;
    value.runwayOccupiedBy=ids.has(value.runwayOccupiedBy)?value.runwayOccupiedBy:null;
    value.score=Number(value.score)||0;
    value.stats=normalizeSnapshotStats(value.stats);
    value.mission=value.mission??null;
    value.profileAirport=/^[A-Z0-9]{4}$/.test(String(value.profileAirport||''))?String(value.profileAirport):snapshotProfileFallback().airport;
    value.profile=CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(value.profile||{airport:value.profileAirport},snapshotProfileFallback(value.profileAirport)) : snapshotProfileFallback(value.profileAirport);
    value.saveId=String(value.saveId||`save-${Date.now().toString(36)}`);
    value.sessionId=String(value.sessionId||SAVE_SESSION_ID);
    const validation=CONTRACTS?.validateSnapshot?CONTRACTS.validateSnapshot(value,BUILD_INFO.schema,'snapshot-migration'):{ok:isValidSnapshot(value),issues:[]};
    if(!validation.ok) return {ok:false,reason:'contract',issues:validation.issues,migratedFrom:originalSchema,steps};
    return {ok:true,payload:value,migratedFrom:originalSchema<BUILD_INFO.schema?originalSchema:null,steps};
  }catch(error){safeLogError(error,'snapshot-migration');return {ok:false,reason:'exception',message:String(error?.message||error)};}
}
function createSnapshotPayload(reason='snapshot'){
  const now=Date.now();
  const elapsed=running?Math.max(0,(performance.now()-startTime)/1000):0;
  return {
    schema:BUILD_INFO.schema,saveId:`save-${SAVE_SESSION_ID}`,sessionId:SAVE_SESSION_ID,build:BUILD,reason,at:now,elapsed,
    selected,selectedRequest:cloneSafe(selectedRequest),runwayOccupiedBy,
    aircraft:cloneSafe((aircraft||[]).slice(0,SAFE_MODE.maxAircraft)),requests:cloneSafe((requests||[]).slice(0,30)),
    score:Number(score)||0,stats:normalizeSnapshotStats(stats),mission:cloneSafe(mission||null),profileAirport:profile.airport,
    profile:CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,snapshotProfileFallback(profile.airport)):cloneSafe(profile)
  };
}
function snapshotVaultOptions(reason='snapshot'){
  return {
    saveSchema:BUILD_INFO.schema,expectedSaveSchema:BUILD_INFO.schema,build:BUILD,reason,
    validate:value=>CONTRACTS?.validateSnapshot?CONTRACTS.validateSnapshot(value,BUILD_INFO.schema,'snapshot-vault'):{ok:isValidSnapshot(value)},
    migrate:migrateSnapshotPayload,legacyKeys:[SNAPSHOT_KEY,...LEGACY_SNAPSHOT_KEYS]
  };
}
function saveGoodState(reason='snapshot',force=false){
  try{
    const now=Date.now();
    if(!force&&now-lastSnapshotAt<SNAPSHOT_INTERVAL_MS) return false;
    const snapshot=createSnapshotPayload(reason);
    if(!isValidSnapshot(snapshot)){SAFE_MODE.lastSaveStatus='rejected-contract';return false;}
    const vault=saveVault();
    const result=vault?.write?vault.write('snapshot',snapshot,snapshotVaultOptions(reason)):{ok:safeStorageSet(SNAPSHOT_KEY,snapshot)};
    if(!result?.ok){SAFE_MODE.lastSaveStatus=`write-failed:${result?.reason||'unknown'}`;return false;}
    SAFE_MODE.lastGoodState=snapshot;SAFE_MODE.lastSaveStatus='committed';lastSnapshotAt=now;
    safeStorageSet(SNAPSHOT_KEY,snapshot); // compatibility shadow for rollback to older builds
    return true;
  }catch(error){SAFE_MODE.lastSaveStatus='exception';safeLogError(error,'save-good-state');return false;}
}
function readTransactionalSnapshot(){
  const vault=saveVault();
  if(vault?.read){
    const result=vault.read('snapshot',snapshotVaultOptions('restore'));
    if(result.ok){
      if(result.recovered||result.source==='backup'){SAFE_MODE.saveRecoveries++;SAFE_MODE.lastSaveStatus='rollback-recovered';}
      if(result.migrated||result.source==='migration'||result.source==='legacy'){SAFE_MODE.saveMigrations++;SAFE_MODE.lastSaveStatus='migrated';}
      return result;
    }
  }
  const candidates=[SAFE_MODE.lastGoodState,safeStorageGet(SNAPSHOT_KEY,null),...LEGACY_SNAPSHOT_KEYS.map(key=>safeStorageGet(key,null))];
  for(const candidate of candidates){
    const migrated=migrateSnapshotPayload(candidate,{source:'fallback'});
    if(migrated.ok){const committed=saveVault()?.write?.('snapshot',migrated.payload,snapshotVaultOptions('fallback-import')); if(committed?.ok) safeStorageSet(SNAPSHOT_KEY,migrated.payload); SAFE_MODE.saveMigrations++; return {ok:true,payload:migrated.payload,source:'fallback',migrated:Boolean(migrated.migratedFrom)};}
  }
  return {ok:false,reason:'no_valid_snapshot'};
}
function restoreGoodState(){
  const result=readTransactionalSnapshot();
  const snapshot=result?.payload;
  if(!snapshot||!isValidSnapshot(snapshot)) return false;
  try{
    SAFE_MODE.lastGoodState=snapshot;
    aircraft=cloneSafe(snapshot.aircraft);requests=cloneSafe(snapshot.requests);
    selected=snapshot.selected||null;selectedRequest=cloneSafe(snapshot.selectedRequest)||null;
    score=Number(snapshot.score)||0;stats={...stats,...normalizeSnapshotStats(snapshot.stats)};
    mission=cloneSafe(snapshot.mission)||buildMission();runwayOccupiedBy=snapshot.runwayOccupiedBy||null;
    if(snapshot.profileAirport&&/^[A-Z0-9]{4}$/.test(snapshot.profileAirport)) profile.airport=snapshot.profileAirport;
    startTime=performance.now()-Math.max(0,Number(snapshot.elapsed)||0)*1000;last=performance.now();
    running=true;paused=false;sanitizeAircraftList();
    document.querySelector('#crashShield')?.classList.remove('open');
    updateSceneBodyClass('game');renderGameplayUi(true);draw();
    const recovered=result.source==='backup'||result.recovered;
    setDiagnostic(recovered?'SAVE RECUPERADO POR ROLLBACK':'ESTADO SEGURO RESTAURADO',recovered?'warn':'ok');
    addLog(`Sistema: snapshot restaurado (${snapshot.reason||'seguro'})${recovered?' via backup':''}.`,recovered?'warn':'');
    requestAnimationFrame(loop);return true;
  }catch(error){safeLogError(error,'restore-good-state');return false;}
}
function maybeSaveGoodState(reason='running'){return saveGoodState(reason,false);}
function requestPriorityScore(r){
  if(QUALITY?.requestPriorityScore) return QUALITY.requestPriorityScore(r,performance.now());
  const age=(performance.now()-(r?.time||0))/1000;
  const p={urgent:300,warn:160,normal:60}[r?.priority]||40;
  const t={emergency:220,landing:120,takeoff:100,lineup:90,taxi:55,pushback:45}[r?.type]||40;
  return p+t+age;
}
function selectNextRequest(){
  sanitizeAircraftList();
  const next=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a))[0];
  if(!next){ addLog('Fila vazia. Nenhuma solicitação pendente.','warn'); setDiagnostic('SEM SOLICITAÇÕES','warn'); return false; }
  selected=next.id; selectedRequest=next;
  setTrafficTab(aircraft.find(p=>p.id===selected)?.kind==='departure' ? 'groundList' : 'arrivals');
  addLog(`Próxima solicitação: ${next.id} (${next.type.toUpperCase()}).`);
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); renderHandoffAdvisor(); setDiagnostic(`${next.id} SELECIONADO`,'ok');
  return true;
}
function isRunwayProtectedByOther(p){ return runwayOccupiedBy && (!p || runwayOccupiedBy!==p.id); }
function sectorLabel(p){ const s=getSector(p); return s==='GND'?'SOLO/GND':s==='APP'?'APROXIMAÇÃO/APP':s==='EMERG'?'EMERGÊNCIA':'TORRE/TWR'; }
function sanitizeAircraftList(){
  if(!Array.isArray(aircraft)) aircraft=[];
  const seenCallsigns=new Set();
  aircraft = aircraft.map(p=>CONTRACTS?.sanitizeAircraft ? CONTRACTS.sanitizeAircraft(p) : p).filter(p=>{
    if(!p || typeof p.id!=='string' || !Number.isFinite(p.x) || !Number.isFinite(p.y) || seenCallsigns.has(p.id)) return false;
    seenCallsigns.add(p.id); return true;
  }).slice(0, SAFE_MODE.maxAircraft);
  aircraft.forEach(p=>{
    const validStatus=['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP','DEP','APP','HOLD','FINAL','EMERG'];
    if(!validStatus.includes(p.status)) p.status = p.kind==='arrival'?'APP':'PARKED';
    p.sector=getSector(p);
    p.x=clamp(Number(p.x)||50,-8,108); p.y=clamp(Number(p.y)||50,-8,108);
    p.alt=clamp(Number(p.alt)||0,0,420); p.targetAlt=clamp(Number(p.targetAlt)||0,0,420);
    p.speed=clamp(Number(p.speed)||0,0,360); p.heading=((Number(p.heading)||0)%360+360)%360;
    if(!Array.isArray(p.trail)) p.trail=[]; p.trail=p.trail.slice(-54);
  });
  requests = (Array.isArray(requests)?requests:[]).map(r=>CONTRACTS?.sanitizeRequest ? CONTRACTS.sanitizeRequest(r) : r).filter(r=>r && aircraft.some(p=>p.id===r.id)).slice(0,30);
  const aircraftContract=CONTRACTS?.validateAircraftList?.(aircraft,'sanitize-aircraft-list');
  const requestContract=CONTRACTS?.validateRequests?.(requests,'sanitize-request-list');
  if(aircraftContract && !aircraftContract.ok) SAFE_MODE.contractFailures += aircraftContract.issues.length;
  if(requestContract && !requestContract.ok) SAFE_MODE.contractFailures += requestContract.issues.length;
  if(selected && !aircraft.some(p=>p.id===selected)){ selected=null; selectedRequest=null; }
  if(selectedRequest && !requests.some(r=>r.id===selectedRequest.id && r.type===selectedRequest.type)) selectedRequest=null;
}
function validateGameplayDom(){
  const required=['#radar','#actionGrid','#requests','#freqCall','#log','#selectedBox'];
  const missing=required.filter(s=>!document.querySelector(s));
  if(missing.length) throw new Error('Elementos de gameplay ausentes: '+missing.join(', '));
}
function recoverGameplayState(reason='auto'){
  sanitizeAircraftList();
  if(running && aircraft.length===0){
    for(let i=0;i<4;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure'));
    aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'));
  }
  if(!selected && requests[0]){ selected=requests[0].id; selectedRequest=requests[0]; }
  try{
    renderGameplayUi(true);
    SAFE_MODE.diagnostics.unshift({msg:`Estado estabilizado: ${reason}`,level:'ok',at:Date.now()});
  }catch(e){ showSafeMode(e); }
}
const $ = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));

const canvas = $('#radar');
const ctx = canvas.getContext('2d');
const asset = { map: new Image(), radar: new Image() };
asset.map.src = 'assets/maps/MAP_KATL_AIRPORT_CLEAN_V1.png';
asset.radar.src = 'assets/radar/RADAR_BASE_CLEAN_V1.png';

/* ===== MODULE 09: 04-state-airports-procedures (04-state-airports-procedures.js) ===== */
/* @skyward-module 04-state-airports-procedures
 * Runtime state, airport profiles and procedure data.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('04-state-airports-procedures');
let airports = [];
let profile = { name:'Controlador', avatar:'male', country:'Brasil', airport:'SBGR', xp:0, level:1, score:0, turns:0 };
let aircraft = [];
let requests = [];
let selected = null;
let selectedRequest = null;
let running = false;
let paused = false;
let last = 0;
let startTime = 0;
let score = 0;
let spawnTimer = 0;
let requestTimer = 0;
let logLines = [];
let runwayOccupiedBy = null;
let stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
let mission = null;
let missionHistory = [];
let conflictPredictions = [];
let radarFilters = { labels:true, ground:true, final:true, vectors:true, safety:true, procedures:true, range:true, map:true, wx:true, fuel:true, emerg:true };
let runwayQueue = { arrivals:[], departures:[] };
let safetyState = { score:100, level:'ok', messages:['Safety Advisor inicializado.'], lastRisk:null };
const SEPARATION_RULES = { lateralNm:6, verticalFL:10, shortFinalNm:10, runwayProtectedNm:14 };
const FUEL_RULES = { arrivalBurn:0.010, departureBurn:0.006, emergencyThreshold:14, lowThreshold:24, criticalThreshold:8 };
let emergencyDirector = { active:false, target:null, message:'Sem emergência ativa.', lastTick:0 };

const SIM_SPEED = 0.092;
const runway = { name:'09/27', x1:18, y1:50, x2:82, y2:50, width:6.2, exits:[32,45,56,68] };
const gates = [
  {x:55,y:70, label:'A'}, {x:61,y:70, label:'A'}, {x:67,y:70, label:'B'}, {x:73,y:70, label:'B'},
  {x:58,y:78, label:'C'}, {x:65,y:78, label:'C'}, {x:72,y:78, label:'D'}, {x:78,y:77, label:'D'}
];
const holdingPoints = [{x:31,y:57},{x:47,y:57},{x:64,y:57},{x:78,y:57}];
const finalFix = {x:52, y:26};

const AIRPORT_OPS_PROFILES = {
  SBGR:{runway:'09R/27L', layout:'parallel', complexity:1.18, spawn:0.72, finalFix:{x:50,y:24}, threshold:{x:82,y:50}, gates:'east', ops:'Parallel hub', wind:'E/SE', procedures:'STAR MRC / SID PAG'},
  SBSP:{runway:'17R/35L', layout:'urban', complexity:1.34, spawn:0.82, finalFix:{x:62,y:22}, threshold:{x:68,y:52}, gates:'south', ops:'Urban short-field', wind:'variable', procedures:'Curved visual / restricted'},
  SBKP:{runway:'15/33', layout:'single', complexity:1.02, spawn:0.58, finalFix:{x:44,y:20}, threshold:{x:78,y:52}, gates:'cargo', ops:'Cargo + pax flow', wind:'SE', procedures:'Cargo sequencing'},
  SBBR:{runway:'11L/29R', layout:'parallel', complexity:1.12, spawn:0.66, finalFix:{x:48,y:22}, threshold:{x:82,y:48}, gates:'central', ops:'Capital hub', wind:'E', procedures:'Dual runway ops'},
  SBGL:{runway:'10/28', layout:'coastal', complexity:1.22, spawn:0.68, finalFix:{x:52,y:22}, threshold:{x:84,y:51}, gates:'west', ops:'Coastal heavy jet', wind:'sea breeze', procedures:'Bay approach'},
  SBRJ:{runway:'02R/20L', layout:'coastal-short', complexity:1.40, spawn:0.60, finalFix:{x:58,y:18}, threshold:{x:74,y:54}, gates:'bay', ops:'Short coastal approach', wind:'crosswind', procedures:'Visual curve / terrain'},
  SBCF:{runway:'16/34', layout:'single', complexity:.96, spawn:0.50, finalFix:{x:44,y:20}, threshold:{x:79,y:52}, gates:'north', ops:'Regional hub', wind:'variable', procedures:'Single runway sequence'},
  SBPA:{runway:'11/29', layout:'single', complexity:1.04, spawn:0.52, finalFix:{x:49,y:24}, threshold:{x:82,y:51}, gates:'south', ops:'Frontal weather ops', wind:'S/SW', procedures:'Low ceiling sequencing'},
  SBSV:{runway:'10/28', layout:'coastal', complexity:1.05, spawn:0.52, finalFix:{x:52,y:24}, threshold:{x:82,y:50}, gates:'coast', ops:'Tropical coastal ops', wind:'E', procedures:'Sea breeze approach'},
  SBRE:{runway:'18/36', layout:'single', complexity:1.06, spawn:0.50, finalFix:{x:56,y:22}, threshold:{x:78,y:54}, gates:'east', ops:'Tropical rain cells', wind:'E/SE', procedures:'Rain cell vectoring'},
  KATL:{runway:'09L/27R', layout:'mega-parallel', complexity:1.38, spawn:0.90, finalFix:{x:50,y:22}, threshold:{x:84,y:50}, gates:'mega', ops:'Mega hub banked flow', wind:'W', procedures:'Parallel arrival streams'},
  EGLL:{runway:'09L/27R', layout:'parallel', complexity:1.45, spawn:0.82, finalFix:{x:50,y:22}, threshold:{x:82,y:50}, gates:'terminal', ops:'Low vis alternation', wind:'W', procedures:'Heathrow director'},
  LEMD:{runway:'14R/32L', layout:'parallel', complexity:1.30, spawn:0.76, finalFix:{x:48,y:20}, threshold:{x:82,y:49}, gates:'central', ops:'Four runway ops', wind:'N', procedures:'Madrid arrival manager'}
};
let currentOpsProfile = null;
function airportOpsProfile(){
  const a=airport();
  return AIRPORT_OPS_PROFILES[a.icao] || {runway: runway.name, layout:'generic', complexity:1, spawn:.58, finalFix:{x:52,y:26}, threshold:{x:82,y:50}, gates:'default', ops:`${a.runways||1} runway airport`, wind:'variable', procedures:'standard vectors'};
}
function applyAirportOpsProfile(){
  try{
    const p=airportOpsProfile(); currentOpsProfile=p;
    runway.name=p.runway || runway.name;
    if(p.finalFix){ finalFix.x=p.finalFix.x; finalFix.y=p.finalFix.y; }
    if(p.threshold && PROCEDURE_LAYER?.ils){ PROCEDURE_LAYER.ils.threshold={x:p.threshold.x,y:p.threshold.y}; }
    if(PROCEDURE_LAYER?.ils){ PROCEDURE_LAYER.ils.name=`ILS RWY ${runway.name}`; PROCEDURE_LAYER.ils.faf={x:Math.max(18,(p.finalFix?.x||52)+6), y:Math.max(16,(p.finalFix?.y||26)+8)}; PROCEDURE_LAYER.ils.iaf={x:Math.max(8,(p.finalFix?.x||52)-18), y:Math.max(8,(p.finalFix?.y||26)-10)}; }
    if($('#runwayTextTop')) $('#runwayTextTop').textContent=`RWY ${runway.name}`;
    return p;
  }catch(e){ safeLogError(e,'airport-ops-profile'); return airportOpsProfile(); }
}
function renderAirportOpsBoard(){
  try{
    const box=document.querySelector('#airportOpsBoard'); if(!box) return;
    const a=airport(), p=currentOpsProfile||airportOpsProfile();
    box.innerHTML=`<div class="airport-ops-head"><b>AIRPORT OPS</b><span>${a.icao}</span></div>
      <div class="airport-ops-grid">
        <div><small>RWY</small><b>${p.runway}</b></div>
        <div><small>LAYOUT</small><b>${p.layout}</b></div>
        <div><small>OPS</small><b>${p.ops}</b></div>
        <div><small>PROC</small><b>${p.procedures}</b></div>
      </div>`;
  }catch(e){ safeLogError(e,'airport-ops-board'); }
}
function airportSpawnInterval(){
  const p=currentOpsProfile||airportOpsProfile();
  const wx=WX_STATE?.severity>.75 ? 1.28 : WX_STATE?.severity>.55 ? 1.12 : 1;
  return Math.max(24, 45 / Math.max(.45, p.spawn||.58) * wx);
}
function airportInitialTrafficCount(){
  const p=currentOpsProfile||airportOpsProfile();
  return Math.max(4, Math.min(8, Math.round(4 + (p.spawn||.58)*3)));
}

const PROCEDURE_LAYER = {
  active: true,
  scopeNm: 60,
  ils: { name:'ILS RWY 27', localizer:270, threshold:{x:82,y:50}, faf:{x:58,y:30}, iaf:{x:36,y:18}, missed:{x:88,y:44} },
  fixes: [
    {id:'IAF', name:'ANVIL', x:36, y:18, type:'arrival'},
    {id:'FAF', name:'FINAL FIX', x:52, y:26, type:'final'},
    {id:'OM', name:'OUTER MARKER', x:66, y:38, type:'marker'},
    {id:'HLD', name:'HOLD NW', x:22, y:24, type:'hold'},
    {id:'SID', name:'DEP FIX', x:14, y:64, type:'departure'}
  ],
  routes: [
    {id:'STAR 27', type:'arrival', color:'rgba(91,240,109,.55)', pts:[{x:14,y:14},{x:36,y:18},{x:52,y:26},{x:82,y:50}]},
    {id:'SID 27', type:'departure', color:'rgba(88,183,255,.52)', pts:[{x:24,y:50},{x:14,y:64},{x:8,y:78}]},
    {id:'MISSED', type:'missed', color:'rgba(255,191,61,.50)', pts:[{x:82,y:50},{x:88,y:44},{x:86,y:28},{x:72,y:20}]}
  ]
};

/* ===== MODULE 10: aircraft-performance (15-aircraft-performance.js) ===== */
/* @skyward-module 15-aircraft-performance
 * Data-driven aircraft performance envelopes, speeds, fuel burn and phase physics.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('15-aircraft-performance');
const AIRCRAFT_PERFORMANCE_SCHEMA = 1;
const AIRCRAFT_PERFORMANCE_TABLE = Object.freeze({
  A320:Object.freeze({family:'Airbus A320ceo',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:142,finalSpeed:135,minApproachSpeed:128,maxApproachSpeed:220,rotationSpeed:145,initialClimbSpeed:185,holdSpeed:165,taxiSpeed:18,pushbackSpeed:4,accelKtSec:7.0,decelKtSec:6.4,climbFpm:2300,descentFpm:1900,fuelBurn:Object.freeze({arrival:1.00,departure:1.05,hold:1.18,taxi:0.42})}),
  A20N:Object.freeze({family:'Airbus A320neo',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:139,finalSpeed:132,minApproachSpeed:126,maxApproachSpeed:220,rotationSpeed:142,initialClimbSpeed:184,holdSpeed:164,taxiSpeed:18,pushbackSpeed:4,accelKtSec:7.1,decelKtSec:6.5,climbFpm:2450,descentFpm:1900,fuelBurn:Object.freeze({arrival:0.88,departure:0.92,hold:1.06,taxi:0.39})}),
  A321:Object.freeze({family:'Airbus A321',wake:'M',engine:'turbofan',className:'Large narrow-body jet',approachSpeed:150,finalSpeed:142,minApproachSpeed:134,maxApproachSpeed:230,rotationSpeed:151,initialClimbSpeed:195,holdSpeed:170,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.2,decelKtSec:5.7,climbFpm:2050,descentFpm:1850,fuelBurn:Object.freeze({arrival:1.12,departure:1.20,hold:1.28,taxi:0.45})}),
  B738:Object.freeze({family:'Boeing 737-800',wake:'M',engine:'turbofan',className:'Narrow-body jet',approachSpeed:144,finalSpeed:137,minApproachSpeed:130,maxApproachSpeed:225,rotationSpeed:146,initialClimbSpeed:188,holdSpeed:166,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.9,decelKtSec:6.2,climbFpm:2250,descentFpm:1900,fuelBurn:Object.freeze({arrival:1.02,departure:1.08,hold:1.20,taxi:0.42})}),
  B739:Object.freeze({family:'Boeing 737-900',wake:'M',engine:'turbofan',className:'Long narrow-body jet',approachSpeed:149,finalSpeed:141,minApproachSpeed:134,maxApproachSpeed:225,rotationSpeed:151,initialClimbSpeed:192,holdSpeed:169,taxiSpeed:18,pushbackSpeed:4,accelKtSec:6.4,decelKtSec:5.8,climbFpm:2100,descentFpm:1850,fuelBurn:Object.freeze({arrival:1.09,departure:1.16,hold:1.26,taxi:0.44})}),
  B752:Object.freeze({family:'Boeing 757-200',wake:'H',engine:'turbofan',className:'High-performance narrow-body',approachSpeed:154,finalSpeed:146,minApproachSpeed:138,maxApproachSpeed:240,rotationSpeed:156,initialClimbSpeed:205,holdSpeed:180,taxiSpeed:19,pushbackSpeed:4,accelKtSec:7.5,decelKtSec:5.8,climbFpm:2850,descentFpm:2100,fuelBurn:Object.freeze({arrival:1.28,departure:1.38,hold:1.40,taxi:0.50})}),
  E190:Object.freeze({family:'Embraer 190',wake:'M',engine:'turbofan',className:'Regional jet',approachSpeed:132,finalSpeed:126,minApproachSpeed:118,maxApproachSpeed:205,rotationSpeed:130,initialClimbSpeed:170,holdSpeed:150,taxiSpeed:17,pushbackSpeed:4,accelKtSec:7.4,decelKtSec:6.8,climbFpm:2600,descentFpm:1900,fuelBurn:Object.freeze({arrival:0.76,departure:0.82,hold:0.94,taxi:0.34})}),
  B77W:Object.freeze({family:'Boeing 777-300ER',wake:'H',engine:'widebody-turbofan',className:'Wide-body heavy jet',approachSpeed:160,finalSpeed:151,minApproachSpeed:143,maxApproachSpeed:250,rotationSpeed:165,initialClimbSpeed:210,holdSpeed:190,taxiSpeed:20,pushbackSpeed:3,accelKtSec:5.3,decelKtSec:4.8,climbFpm:1900,descentFpm:1800,fuelBurn:Object.freeze({arrival:1.85,departure:2.10,hold:1.92,taxi:0.72})}),
  C208:Object.freeze({family:'Cessna 208 Caravan',wake:'L',engine:'turboprop',className:'Light turboprop',approachSpeed:92,finalSpeed:84,minApproachSpeed:74,maxApproachSpeed:165,rotationSpeed:75,initialClimbSpeed:115,holdSpeed:105,taxiSpeed:14,pushbackSpeed:3,accelKtSec:4.2,decelKtSec:4.8,climbFpm:1050,descentFpm:1200,fuelBurn:Object.freeze({arrival:0.34,departure:0.38,hold:0.44,taxi:0.18})})
});
function aircraftTypeKey(type){ return String(type||'A320').trim().toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,4) || 'A320'; }
function aircraftPerformanceProfile(type){
  const key=aircraftTypeKey(type);
  return AIRCRAFT_PERFORMANCE_TABLE[key] || AIRCRAFT_PERFORMANCE_TABLE.A320;
}
function normalizeAircraftPerformance(p){
  if(!p) return null;
  const profile=aircraftPerformanceProfile(p.type);
  p.performance={schema:AIRCRAFT_PERFORMANCE_SCHEMA,type:aircraftTypeKey(p.type),family:profile.family,wake:profile.wake,className:profile.className,engine:profile.engine,vRef:profile.finalSpeed,approachSpeed:profile.approachSpeed,holdSpeed:profile.holdSpeed,taxiSpeed:profile.taxiSpeed,climbFpm:profile.climbFpm,descentFpm:profile.descentFpm};
  p.wakeCategory=profile.wake;
  p.targetSpeed=Number.isFinite(p.targetSpeed)?p.targetSpeed:performanceTargetSpeed(p,p.status);
  p.speed=clamp(Number(p.speed)||0,0,profile.maxApproachSpeed+80);
  p.alt=clamp(Number(p.alt)||0,0,500);
  p.targetAlt=clamp(Number(p.targetAlt)||0,0,500);
  return p;
}
function performanceTargetSpeed(p, phase){
  const profile=aircraftPerformanceProfile(p?.type);
  const status=String(phase||p?.status||'APP');
  const wx=(typeof WX_STATE==='object' && WX_STATE) ? Number(WX_STATE.severity||0) : 0;
  const damage=Math.min(18,Number(p?.damage||0)*0.10);
  if(status==='PUSHBACK') return profile.pushbackSpeed;
  if(status==='TAXI') return profile.taxiSpeed;
  if(status==='HOLD_SHORT'||status==='LINEUP'||status==='PARKED'||status==='READY_TAXI') return 0;
  if(status==='DEP') return profile.initialClimbSpeed + Math.min(22,Math.max(0,(Number(p?.alt||0)-20)*0.10));
  if(status==='HOLD') return profile.holdSpeed;
  if(status==='FINAL') return profile.finalSpeed + Math.round(wx*10) + damage;
  if(status==='EMERG') return Math.max(profile.minApproachSpeed, profile.finalSpeed-4 + Math.round(wx*12));
  return profile.approachSpeed + Math.round(wx*8);
}
function approachNumber(current,target,rate){
  current=Number(current)||0; target=Number(target)||0; rate=Math.max(0,Number(rate)||0);
  if(Math.abs(target-current)<=rate) return target;
  return current + Math.sign(target-current)*rate;
}
function aircraftVerticalStep(p,dt,mode){
  const profile=aircraftPerformanceProfile(p?.type);
  const target=clamp(Number(p?.targetAlt ?? p?.alt ?? 0),0,500);
  const current=clamp(Number(p?.alt||0),0,500);
  const wxPenalty=(typeof WX_STATE==='object' && WX_STATE) ? 1+Math.min(.28,Number(WX_STATE.severity||0)*.25) : 1;
  const fpm=mode==='climb'?profile.climbFpm:profile.descentFpm;
  const step=Math.max(.08,(fpm/100/60)*Math.max(.1,dt)*8/wxPenalty);
  return approachNumber(current,target,step);
}
function updateAircraftPerformanceStep(p,dt,phase){
  if(!p) return p;
  const profile=aircraftPerformanceProfile(p.type);
  normalizeAircraftPerformance(p);
  const status=phase||p.status;
  const target=performanceTargetSpeed(p,status);
  const accel=target>=p.speed ? profile.accelKtSec : profile.decelKtSec;
  const wxPenalty=(typeof WX_STATE==='object' && WX_STATE) ? 1+Math.min(.30,Number(WX_STATE.severity||0)*.32) : 1;
  p.targetSpeed=target;
  p.speed=clamp(approachNumber(p.speed,target,accel*Math.max(.05,dt)/wxPenalty),0,profile.maxApproachSpeed+90);
  if(['DEP'].includes(status)) p.alt=aircraftVerticalStep(p,dt,'climb');
  else if(['APP','HOLD','FINAL','EMERG'].includes(status)) p.alt=aircraftVerticalStep(p,dt,'descent');
  p.envelopeState=aircraftEnvelopeState(p);
  return p;
}
function aircraftFuelMultiplier(p){
  const profile=aircraftPerformanceProfile(p?.type);
  const burn=profile.fuelBurn || {};
  let mult=p?.kind==='departure' ? (burn.departure||1) : (burn.arrival||1);
  if(p?.status==='HOLD') mult*=burn.hold||1.15;
  if(['TAXI','PUSHBACK','READY_TAXI','HOLD_SHORT','LINEUP'].includes(String(p?.status))) mult*=burn.taxi||0.45;
  if(p?.emergency) mult*=1.12;
  return mult;
}
function aircraftEnvelopeState(p){
  const profile=aircraftPerformanceProfile(p?.type);
  if(!p) return 'UNKNOWN';
  if(['FINAL','EMERG'].includes(p.status)){
    if((p.speed||0)>profile.finalSpeed+24) return 'FAST_FINAL';
    if((p.speed||0)<profile.minApproachSpeed) return 'SLOW_FINAL';
  }
  if(p.status==='DEP' && (p.speed||0)<profile.rotationSpeed && (p.alt||0)>3) return 'LOW_ENERGY_CLIMB';
  if((p.speed||0)>profile.maxApproachSpeed+55) return 'OVERSPEED';
  return 'NORMAL';
}
function aircraftLandingRisk(p){
  const profile=aircraftPerformanceProfile(p?.type);
  const speedExcess=Math.max(0,Number(p?.speed||0)-(profile.finalSpeed+13));
  const wx=(typeof WX_STATE==='object' && WX_STATE) ? Number(WX_STATE.severity||0)*18 : 0;
  const damage=Number(p?.damage||0)*0.35;
  const lowEnergy=(Number(p?.speed||0)<profile.minApproachSpeed)?18:0;
  return Math.round(speedExcess*1.6+wx+damage+lowEnergy);
}
function performanceTelemetry(p){
  const profile=aircraftPerformanceProfile(p?.type);
  return {type:aircraftTypeKey(p?.type),family:profile.family,wake:profile.wake,vRef:profile.finalSpeed,targetSpeed:performanceTargetSpeed(p,p?.status),envelope:aircraftEnvelopeState(p),fuelMultiplier:Number(aircraftFuelMultiplier(p).toFixed(2))};
}
function validatePerformanceCatalog(catalog){
  const profiles=catalog?.profiles || AIRCRAFT_PERFORMANCE_TABLE;
  const entries=Object.entries(profiles);
  const issues=[];
  if((catalog?.schema || AIRCRAFT_PERFORMANCE_SCHEMA)!==1) issues.push('schema inválido');
  if(entries.length<7) issues.push('menos de 7 perfis');
  for(const [type,p] of entries){
    if(!/^[A-Z0-9]{3,4}$/.test(type)) issues.push(`${type}: código inválido`);
    if(!['L','M','H','J'].includes(p.wake)) issues.push(`${type}: wake inválido`);
    for(const key of ['approachSpeed','finalSpeed','minApproachSpeed','rotationSpeed','initialClimbSpeed','climbFpm','descentFpm','accelKtSec','decelKtSec']) if(!Number.isFinite(Number(p[key])) || Number(p[key])<=0) issues.push(`${type}.${key} inválido`);
    if(Number(p.minApproachSpeed)>=Number(p.finalSpeed) || Number(p.finalSpeed)>=Number(p.approachSpeed)+28) issues.push(`${type}: envelope de aproximação incoerente`);
  }
  return {ok:issues.length===0,issues,total:entries.length};
}
window.SKYWARD_AIRCRAFT_PERFORMANCE=Object.freeze({
  schema:AIRCRAFT_PERFORMANCE_SCHEMA,
  table:AIRCRAFT_PERFORMANCE_TABLE,
  getProfile:aircraftPerformanceProfile,
  normalize:normalizeAircraftPerformance,
  targetSpeed:performanceTargetSpeed,
  step:updateAircraftPerformanceStep,
  fuelMultiplier:aircraftFuelMultiplier,
  envelope:aircraftEnvelopeState,
  landingRisk:aircraftLandingRisk,
  telemetry:performanceTelemetry,
  validateCatalog:validatePerformanceCatalog,
  selfCheck:()=>validatePerformanceCatalog({schema:1,profiles:AIRCRAFT_PERFORMANCE_TABLE})
});

/* ===== MODULE 11: 05-profile-navigation (05-profile-navigation.js) ===== */
/* @skyward-module 05-profile-navigation
 * Utilities, profile persistence, scenes, fullscreen and logs.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('05-profile-navigation');
let SKYWARD_RANDOM_SOURCE=()=>Math.random();
function rand(a,b){ const unit=SKYWARD_RANDOM_SOURCE(); return QUALITY?.range ? QUALITY.range(a,b,unit) : unit*(b-a)+a; }
function clamp(v,a,b){ return QUALITY?.clamp ? QUALITY.clamp(v,a,b) : Math.max(a,Math.min(b,v)); }
function degToRad(d){ return d*Math.PI/180; }
function headingTo(p,t){ return QUALITY?.headingTo ? QUALITY.headingTo(p,t) : (Math.atan2(t.y-p.y,t.x-p.x)*180/Math.PI+360)%360; }
function pctToPx(p,w,h){ return {x:p.x/100*w, y:p.y/100*h}; }
function dist(a,b){ return QUALITY?.distance ? QUALITY.distance(a,b) : Math.hypot(a.x-b.x,a.y-b.y); }

function profileSavePayload(reason='profile-save'){
  const clean=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,profile):cloneSafe(profile);
  return {schema:PROFILE_SAVE_SCHEMA,build:BUILD,at:Date.now(),reason,profile:clean};
}
function migrateProfileSavePayload(input,context={}){
  try{
    const raw=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
    const payload=raw.schema===PROFILE_SAVE_SCHEMA&&raw.profile?cloneSafe(raw):{
      schema:PROFILE_SAVE_SCHEMA,build:String(raw.build||BUILD),at:Number(raw.at)||Date.now(),reason:String(context.source==='legacy'?'legacy-profile-import':'profile-migration'),profile:raw.profile||raw
    };
    payload.schema=PROFILE_SAVE_SCHEMA;payload.build=String(payload.build||BUILD);payload.at=Number(payload.at)||Date.now();payload.reason=String(payload.reason||'profile-migration');
    payload.profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(payload.profile,profile):payload.profile;
    const validation=CONTRACTS?.validateProfileSave?CONTRACTS.validateProfileSave(payload,'profile-migration'):{ok:CONTRACTS?.validateProfile?.(payload.profile)?.ok!==false};
    return validation.ok?{ok:true,payload,migratedFrom:raw.schema===PROFILE_SAVE_SCHEMA?null:'legacy'}:{ok:false,reason:'contract',issues:validation.issues};
  }catch(error){safeLogError(error,'profile-migration');return {ok:false,reason:'exception'};}
}
function profileVaultOptions(reason='profile-save'){
  return {
    saveSchema:PROFILE_SAVE_SCHEMA,expectedSaveSchema:PROFILE_SAVE_SCHEMA,build:BUILD,reason,
    validate:value=>CONTRACTS?.validateProfileSave?CONTRACTS.validateProfileSave(value,'profile-vault'):{ok:Boolean(value?.profile)},
    migrate:migrateProfileSavePayload,legacyKeys:['skywardProfile']
  };
}
function persistProfile(reason='profile-save'){
  try{
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(profile,profile):profile;
    const payload=profileSavePayload(reason);
    const result=saveVault()?.write?saveVault().write('profile',payload,profileVaultOptions(reason)):{ok:safeStorageSet('skywardProfile',profile)};
    if(!result?.ok){SAFE_MODE.lastSaveStatus=`profile-write-failed:${result?.reason||'unknown'}`;return false;}
    safeStorageSet('skywardProfile',profile); // compatibility shadow for previous builds
    SAFE_MODE.lastSaveStatus='profile-committed';return true;
  }catch(error){safeLogError(error,'profile-save');return false;}
}
function loadProfile(){
  const vault=saveVault();
  const result=vault?.read?vault.read('profile',profileVaultOptions('profile-load')):null;
  if(result?.ok&&result.payload?.profile){
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(result.payload.profile,profile):result.payload.profile;
    if(result.recovered||result.source==='backup') SAFE_MODE.saveRecoveries++;
    if(result.migrated||result.source==='legacy'||result.source==='migration') SAFE_MODE.saveMigrations++;
  }else{
    const stored={...profile,...safeStorageGet('skywardProfile',{})};
    profile=CONTRACTS?.sanitizeProfile?CONTRACTS.sanitizeProfile(stored,profile):stored;
    persistProfile('profile-bootstrap');
  }
  const validation=CONTRACTS?.validateProfile?.(profile,'load-profile');
  if(validation&&!validation.ok) SAFE_MODE.contractFailures+=validation.issues.length;
}
function airport(){ return airports.find(a=>a.icao===profile.airport) || airports[0] || {icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável'}; }
async function loadAirports(){
  const fallback=[{icao:'SBGR',name:'Guarulhos',city:'São Paulo',country:'Brasil',runways:2,traffic:'Alto',weather:'Variável',unlocked:true,level:1}];
  try{
    const payload=await fetch('data/airports.json').then(r=>{ if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); });
    const result=CONTRACTS?.validateAirports ? CONTRACTS.validateAirports(payload,'data/airports.json') : {ok:Array.isArray(payload),value:payload,issues:[]};
    if(!result.ok) throw new TypeError('Contrato de aeroportos inválido: '+result.issues.slice(0,3).map(x=>`${x.path} ${x.message}`).join('; '));
    airports=result.value;
  }catch(e){ safeLogError(e,'airports-contract'); SAFE_MODE.contractFailures++; airports=fallback; }
  if(!airports.some(a=>a.icao===profile.airport)) profile.airport=airports[0]?.icao||'SBGR';
  populateAirports(); updateProfileUI();
}
function saveProfile(){
  profile.name = $('#pilotName')?.value?.trim() || profile.name;
  profile.country = $('#countrySelect')?.value || profile.country;
  profile.airport = $('#airportSelect')?.value || profile.airport;
  profile=CONTRACTS?.sanitizeProfile ? CONTRACTS.sanitizeProfile(profile,profile) : profile;
  const contract=CONTRACTS?.validateProfile?.(profile,'save-profile');
  if(contract && !contract.ok){ SAFE_MODE.contractFailures += contract.issues.length; setDiagnostic('PERFIL CORRIGIDO PELO CONTRATO','warn'); }
  persistProfile('profile-form');
  updateProfileUI();
}
function populateAirports(){
  const sel = $('#airportSelect');
  if(sel){ sel.innerHTML = airports.filter(a=>a.unlocked).map(a=>`<option value="${a.icao}">${a.icao} - ${a.city} / ${a.name}</option>`).join(''); sel.value = profile.airport; }
  const grid = $('#airportGrid');
  if(grid){
    grid.innerHTML = airports.map(a=>`<button class="glass airport-choice ${a.icao===profile.airport?'selected':''} ${a.unlocked?'':'locked'}" data-airport="${a.icao}"><span class="code">${a.icao}</span><b>${a.city}</b><span>${a.name}</span><div class="meta"><span>${a.country}</span><span>${a.runways} pista(s)</span><span>Tráfego: ${a.traffic}</span><span>Clima: ${a.weather}</span><span>Nível ${a.level}</span></div></button>`).join('');
    $$('[data-airport]').forEach(b=>b.onclick=()=>{ const a=airports.find(x=>x.icao===b.dataset.airport); if(!a?.unlocked){ alert('Aeroporto bloqueado para futuras fases da carreira.'); return; } profile.airport=a.icao; persistProfile('airport-selection'); populateAirports(); updateProfileUI(); go('lobby'); });
  }
}
function updateProfileUI(){
  const av = profile.avatar==='female' ? 'assets/characters/CHAR_CONTROLLER_FEMALE01_V1.png' : 'assets/characters/CHAR_CONTROLLER_MALE01_V1.png';
  const a = airport();
  if($('#lobbyAvatar')) $('#lobbyAvatar').src = av;
  if($('#lobbyName')) $('#lobbyName').textContent = profile.name.toUpperCase();
  if($('#profileScore')) $('#profileScore').textContent = (profile.score||0).toLocaleString('pt-BR');
  if($('#careerLine')) $('#careerLine').textContent = `Nível ${profile.level} • ${profile.country}`;
  if($('#careerLevel')) $('#careerLevel').textContent = profile.level;
  if($('#careerXp')) $('#careerXp').textContent = `${profile.xp} / ${profile.level*1000}`;
  if($('#careerTurns')) $('#careerTurns').textContent = profile.turns || 0;
  if($('#airportTitle')) $('#airportTitle').textContent = `${a.icao} - ${a.city.toUpperCase()}`;
  if($('#airportDesc')) $('#airportDesc').textContent = `${a.name} • ${a.country} • ${a.runways} pista(s) • tráfego ${a.traffic} • clima ${a.weather}.`;
  if($('#gameAirport')) $('#gameAirport').textContent = a.icao;
  if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao;
}

function updateSceneBodyClass(id){
  try{
    const inGame=id==='game';
    document.body.classList.toggle('game-active', inGame);
    document.body.classList.toggle('game-is-active', inGame);
    if(!inGame){
      mobileActiveTab=null;
      closeMobilePanels();
    }else{
      mobileActiveTab=null;
      closeMobilePanels();
      requestAnimationFrame(()=>renderMobileGameplay());
    }
  }catch(e){ safeLogError(e,'scene-body-class'); }
}

function go(id){
  try{
    if(id==='lobby' || id==='profile') saveProfile();
    const target = $('#'+id) || $('#menu') || $('#boot');
    $$('.screen').forEach(s=>s.classList.remove('active'));
    target.classList.add('active');
    SAFE_MODE.lastScene = target.id;
    updateSceneBodyClass(target.id);
    document.querySelector('#crashShield')?.classList.remove('open');
    if(target.id==='game'){ validateGameplayDom(); startGame(); }
    else { running=false; paused=false; }
    updateProfileUI(); resize();
    if(target.id!=='game') target.scrollTop=0;
  }catch(e){ showSafeMode(e); }
}
$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
$$('[data-avatar]').forEach(b=>b.addEventListener('click',()=>{ profile.avatar=b.dataset.avatar; $$('[data-avatar]').forEach(x=>x.classList.toggle('selected',x===b)); saveProfile(); }));
$('#pauseBtn')?.addEventListener('click',()=>{ paused=!paused; $('#pauseBtn').textContent = paused ? '▶' : 'Ⅱ'; });


async function requestFullscreenAndLandscape(){
  try{
    const el = document.documentElement;
    if(!document.fullscreenElement && el.requestFullscreen){ await el.requestFullscreen(); }
  }catch(e){}
  try{
    if(screen.orientation && screen.orientation.lock){ await screen.orientation.lock('landscape'); }
  }catch(e){}
  setTimeout(resize, 250);
}
function updateOrientationState(){
  document.body.classList.toggle('portrait-lock', window.innerHeight > window.innerWidth && window.innerWidth < 900);
  resize();
}
$('#fullscreenBtn')?.addEventListener('click', requestFullscreenAndLandscape);
document.addEventListener('click', (ev)=>{
  const goBtn = ev.target.closest && ev.target.closest('[data-go]');
  if(goBtn && goBtn.dataset.go==='game') requestFullscreenAndLandscape();
}, {capture:true});
window.addEventListener('orientationchange', ()=>setTimeout(updateOrientationState, 350));
window.addEventListener('resize', updateOrientationState);
updateOrientationState();

function resize(){ try{ if(!canvas||!ctx) return; const r=canvas.getBoundingClientRect(), d=window.devicePixelRatio||1; canvas.width=Math.max(320,Math.floor((r.width||320)*d)); canvas.height=Math.max(240,Math.floor((r.height||240)*d)); ctx.setTransform(d,0,0,d,0,0); }catch(e){ safeLogError(e,'resize'); } }
window.addEventListener('resize', resize);

function addLog(msg,type=''){
  const e = running ? Math.floor((performance.now()-startTime)/1000) : 0;
  const t = new Date(e*1000).toISOString().substring(14,19);
  logLines.unshift({t,msg,type}); logLines = logLines.slice(0,60); renderLog();
}
function renderLog(){ const l=$('#log'); if(l) l.innerHTML = logLines.map(x=>`<div class="logline ${x.type}"><em>${x.t}</em> ${x.msg}</div>`).join(''); }

/* ===== MODULE 12: 06-traffic-requests (06-traffic-requests.js) ===== */
/* @skyward-module 06-traffic-requests
 * Aircraft creation, callsigns, requests and game start.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('06-traffic-requests');
function uniqueCallsign(preferred){
  const prefix=(String(preferred).match(/[A-Z]+/)||['ATC'])[0].slice(0,3);
  const baseNumber=Number((String(preferred).match(/\d+/)||['1000'])[0]);
  let candidate=String(preferred);
  let guard=0;
  while(aircraft.some(p=>p.id===candidate) && guard<100){
    callsignSequence++; guard++;
    candidate=prefix+String((baseNumber+callsignSequence)%10000).padStart(4,'0');
  }
  return candidate;
}
function makePlane(i,kind){
  const br = airport().country === 'Brasil';
  const calls = br ? ['GLO1204','TAM3307','AZU4211','PTB7021','ONE8902','SID4405','MAP2190','TTL3030','VRG2218'] : ['DAL1234','AAL0567','SWA0789','UAL0890','JBU0789','FFT0321','BAW0612','KLM0208'];
  const types = ['A320','B738','B739','E190','A321','B752','A20N','B77W','C208'];
  const preferred=calls[(i+callsignSequence)%calls.length];
  const p = { id:uniqueCallsign(preferred), type:types[i%types.length], kind, status:kind==='arrival'?'APP':'PARKED', x:0, y:0, heading:0, speed:0, alt:0, targetAlt:0, trail:[], risk:0, selected:false, cleared:false, emergency:false, emergencyType:null, fuel:kind==='arrival'?Math.round(rand(42,72)):Math.round(rand(68,94)), fuelState:'OK', damage:0, hold:false, groundTimer:0, request:null, requestedAt:0, nextFix:null };
  if(kind==='arrival'){
    const profile=currentOpsProfile||airportOpsProfile();
    const side = Math.floor(rand(0,4));
    p.x = side===0 ? rand(8,20) : side===1 ? rand(80,92) : rand(18,82);
    p.y = side===2 ? rand(6,14) : side===3 ? rand(86,94) : rand(10,36);
    p.alt = Math.round(rand(90,180)); p.targetAlt = profile.layout&&String(profile.layout).includes('short') ? 35 : 45; normalizeAircraftPerformance?.(p); p.speed = Math.round(rand(Math.max(120,(p.performance?.approachSpeed||145)-18), Math.min(210,(p.performance?.approachSpeed||170)+28))); p.targetSpeed = performanceTargetSpeed?.(p,'APP') || p.speed; p.heading = headingTo(p, finalFix);
    p.request = 'landing'; p.requestedAt = performance.now();
  } else {
    const profile=currentOpsProfile||airportOpsProfile();
    const g = gates[i%gates.length]; p.x = g.x + rand(-.5,.5); p.y = g.y + rand(-.5,.5); p.heading = 270; p.request = 'pushback'; p.requestedAt = performance.now();
  }
  normalizeAircraftPerformance?.(p); const sanitized=CONTRACTS?.sanitizeAircraft ? CONTRACTS.sanitizeAircraft(p) : p; normalizeAircraftPerformance?.(sanitized);
  if(!sanitized) throw new TypeError('Contrato rejeitou aeronave recém-criada.');
  return sanitized;
}
function addRequest(p,type,priority='normal'){
  if(!p || !type || requests.some(r=>r.id===p.id && r.type===type)) return;
  const labels = { landing:'solicita pouso', pushback:'solicita pushback', taxi:'solicita taxi para pista', lineup:'solicita alinhar', takeoff:'solicita decolagem', emergency:'MAYDAY - prioridade', lowfuel:'combustível mínimo', panpan:'PAN-PAN operacional' };
  const now=performance.now();
  const candidate={ id:p.id, type, priority, text:labels[type]||type, time:now };
  const normalized=CONTRACTS?.sanitizeRequest ? CONTRACTS.sanitizeRequest(candidate) : candidate;
  const contract=normalized && CONTRACTS?.validateRequest ? CONTRACTS.validateRequest(normalized,'add-request') : {ok:!!normalized,issues:[]};
  if(!normalized || !contract.ok){ SAFE_MODE.contractFailures += contract.issues?.length||1; safeLogError(new TypeError('Solicitação rejeitada pelo contrato'),'add-request'); return; }
  requests.unshift(normalized);
  p.request = normalized.type; p.requestedAt = now; stats.requests++;
  addLog(`${p.id}: ${labels[type] || type}.`, priority==='urgent'?'danger':priority==='warn'?'warn':'');
  renderRequests(); renderMobileGameplay();
}
function removeRequest(id,type){
  requests = requests.filter(r=>!(r.id===id && (!type || r.type===type)));
  if(selectedRequest && selectedRequest.id===id && (!type || selectedRequest.type===type)) selectedRequest=null;
  const plane=aircraft.find(p=>p.id===id);
  if(plane){
    const next=requests.find(r=>r.id===id);
    plane.request=next?.type||null;
    plane.requestedAt=next?.time||0;
  }
  renderRequests();
}

function atcPhrase(r){
  const ap = airport().icao;
  const map = { landing: `${r.id}: ${ap} Tower, request landing RWY ${runway.name}.`, pushback: `${r.id}: ${ap} Ground, request pushback.`, taxi: `${r.id}: ${ap} Ground, ready to taxi.`, lineup: `${r.id}: ${ap} Tower, holding short, request line up.`, takeoff: `${r.id}: ${ap} Tower, lined up, ready for departure.`, emergency: `${r.id}: MAYDAY, request immediate landing.`, lowfuel: `${r.id}: minimum fuel, request priority sequencing.`, panpan: `${r.id}: PAN-PAN, operational abnormality.` };
  return map[r.type] || `${r.id}: request ${r.type}.`;
}
function updateFrequencyPanel(){
  const f = $("#freqCall"), rs=$("#runwayStatus"), seq=$("#seqStatus");
  if(rs){ rs.textContent = runwayOccupiedBy ? `RWY OCUPADA ${runwayOccupiedBy}` : "RWY LIVRE"; rs.style.color = runwayOccupiedBy ? "#ff4d42" : "#5bf06d"; }
  const finals = aircraft.filter(p=>["APP","FINAL","EMERG","HOLD"].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix)).slice(0,3);
  if(seq) seq.textContent = "SEQ: " + (finals.map(p=>p.id).join(" > ") || "---");
  const r = selectedRequest || requests[0];
  if(!f) return;
  if(!r){ f.className="freq-call compact"; f.innerHTML=`<div class="call-id">STBY</div><div class="call-type">aguardando contato</div><small>Monitore aproximação, solo e pista ativa.</small>`; renderActionGrid(); return; }
  const p = aircraft.find(x=>x.id===r.id);
  const age = Math.floor((performance.now()-r.time)/1000);
  f.className = "freq-call compact " + (r.priority==="urgent" ? "danger" : "");
  f.innerHTML = `
    <div class="call-id">${r.id}</div>
    <div class="call-type">${r.text}</div>
    <div class="call-grid">
      <div><span>Setor</span><b>${getSector(p)}</b></div>
      <div><span>Tipo</span><b>${p?.type || '---'}</b></div>
      <div><span>Posição</span><b>${p?.kind==='arrival' ? Math.max(5,Math.round(dist(p,finalFix)))+' NM' : (p?.status||'SOLO')}</b></div>
      <div><span>Alt / Vel</span><b>FL${Math.round(p?.alt||0)} / ${Math.round(p?.speed||0)}</b></div>
      <div><span>Espera</span><b>${age}s</b></div>
      <div><span>Pista</span><b>${runwayOccupiedBy ? 'OCUPADA' : 'LIVRE'}</b></div>
    </div>`;
  renderActionGrid();
}
function startGame(){
  try{ validateGameplayDom(); }catch(e){ showSafeMode(e); return; }
  saveProfile(); resize(); SAFE_MODE.lastGoodState=null; lastSnapshotAt=0; running=true; paused=false; score=0; selected=null; selectedRequest=null; runwayOccupiedBy=null; spawnTimer=0; requestTimer=0; startTime=performance.now(); last=startTime; lastUiRenderAt=0; callsignSequence=0; logLines=[]; requests=[];
  stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
  mission = buildMission(); missionHistory=[];
  aircraft = [];
  const a = airport(); applyAirportOpsProfile(); $('#weather').textContent = (a.weather || 'VARIÁVEL').toUpperCase().slice(0,18); if($('#gameAirport')) $('#gameAirport').textContent = a.icao; if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao; if($('#gameAirportMode')) $('#gameAirportMode').textContent='TORRE'; if($('#sectorHelp')) $('#sectorHelp').textContent=(currentOpsProfile?.ops||'Torre ativa');
  const initialTraffic=airportInitialTrafficCount();
  for(let i=0;i<initialTraffic;i++) aircraft.push(makePlane(i, i%2===0?'arrival':'departure')); // v0.9.6: tráfego inicial por perfil do aeroporto
  emergencyDirector={active:false,target:null,message:'Sem emergência ativa.',lastTick:performance.now()};
  // v0.5.0: menor carga inicial para mobile, evitando poluicao visual e permitindo controle real
  aircraft.forEach(p=>addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'));
  if(requests[0]){ selected = requests[0].id; selectedRequest = requests[0]; }
  addLog(`${a.icao} APP/TWR online. Pista ativa ${runway.name}.`);
  addLog('Aguarde solicitações e emita clearance conforme pista livre.');
  recoverGameplayState('start-game');
  saveGoodState('start-game',true);
  requestAnimationFrame(loop);
}

/* ===== MODULE 13: 07-simulation-safety (07-simulation-safety.js) ===== */
/* @skyward-module 07-simulation-safety
 * Game loop, simulation, conflict prediction and safety.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('07-simulation-safety');
function loop(t){ try{ if(!running || !$('#game')?.classList.contains('active')) return; SAFE_MODE.lastFrame=t; const dt=Math.min(.08,Math.max(0,(t-last)/1000)); last=t; adaptivePerformanceGuard(dt); if(!paused) update(dt); draw(); requestAnimationFrame(loop); }catch(e){ showSafeMode(e); } }
function update(dt){
  try{ window.SKYWARD_REPLAY?.step?.(dt); }catch(e){ safeLogError(e,'replay-step'); }
  try{ updateRunwayOps(); updateFuelAndEmergency(dt); maybeGenerateOperationalEmergency(dt); }catch(e){ safeLogError(e,'runway-ops-update'); }
  sanitizeAircraftList(); aircraft.forEach(p=>{ try{ normalizeAircraftPerformance?.(p); }catch(_e){} });
  const elapsed = window.SKYWARD_REPLAY?.elapsed ? window.SKYWARD_REPLAY.elapsed() : (performance.now()-startTime)/1000;
  $('#clock').textContent = new Date(elapsed*1000).toISOString().substring(14,19);
  $('#score').textContent = Math.max(0,Math.round(score)).toLocaleString('pt-BR');
  if(elapsed>420) return endGame(false,'Turno concluído com segurança.');
  spawnTimer += dt;
  if(spawnTimer>airportSpawnInterval() && aircraft.length<Math.min(SAFE_MODE.maxAircraft, 10 + Math.round((currentOpsProfile?.spawn||.58)*5))){ spawnTimer=0; const arrChance=String(currentOpsProfile?.layout||'').includes('single') ? .54 : .60; const p=makePlane(Date.now()%1000, skywardRandomUnit()<arrChance?'arrival':'departure'); aircraft.push(p); addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'); }
  updatePlanes(dt); predictConflicts(); checkRunway(); checkConflicts(); checkMissedRequests();
  score += dt * (aircraft.length * 1.4);
  maybeSaveGoodState('running');
  if(performance.now()-lastUiRenderAt>=180) renderGameplayUi();
}

function renderGameplayUi(force=false){
  const now=performance.now();
  if(!force && now-lastUiRenderAt<160) return;
  lastUiRenderAt=now;
  renderStrips(); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
  updateOperationalHints(); renderRunwayBoard(); renderFuelBoard(); renderAirportOpsBoard();
  renderMissionBoard(); renderHandoffAdvisor(); renderMobileGameplay();
}

function estimatePosition(p, seconds=45){
  const speed = Math.max(0, Number(p?.speed)||0);
  const hdg = degToRad(Number(p?.heading)||0);
  const nmScale = (speed/220) * SIM_SPEED * 4.6 * seconds;
  return { x:(Number(p?.x)||0)+Math.cos(hdg)*nmScale, y:(Number(p?.y)||0)+Math.sin(hdg)*nmScale, alt:Number(p?.targetAlt ?? p?.alt ?? 0) };
}
function predictConflicts(){
  try{
    const preds=[];
    const active=aircraft.filter(p=>p && !['PARKED','PUSHBACK'].includes(p.status));
    active.forEach(p=>{ p.conflictLevel='ok'; p.conflictText=''; });
    for(let i=0;i<active.length;i++){
      for(let j=i+1;j<active.length;j++){
        const a=active[i], b=active[j];
        if(a.id===b.id) continue;
        const aNow={x:a.x,y:a.y,alt:a.alt||0}, bNow={x:b.x,y:b.y,alt:b.alt||0};
        const dNow=dist(aNow,bNow); const vNow=Math.abs((a.alt||0)-(b.alt||0));
        const aF=estimatePosition(a,55), bF=estimatePosition(b,55);
        const dFuture=dist(aF,bF); const vFuture=Math.abs((aF.alt||0)-(bF.alt||0));
        const sameAir = !['PARKED','TAXI','HOLD_SHORT','LINEUP'].includes(a.status) && !['PARKED','TAXI','HOLD_SHORT','LINEUP'].includes(b.status);
        const wakeReq = requiredWakeSpacing(a,b); const risky = sameAir && ((dNow<Math.max(7.5,wakeReq+2.0) && vNow<18) || (dFuture<Math.max(8.5,wakeReq+2.5) && vFuture<22));
        if(risky){
          const level=(dNow<4.8 && vNow<12) || (dFuture<5.2 && vFuture<14) ? 'danger':'warn';
          a.conflictLevel=b.conflictLevel=level;
          a.conflictText=b.conflictText=`${a.id}/${b.id}`;
          preds.push({a:a.id,b:b.id,level,dNow,dFuture,vNow,vFuture,wakeReq,ax:aF.x,ay:aF.y,bx:bF.x,by:bF.y});
        }
      }
    }
    runwayQueue.arrivals = aircraft.filter(p=>p.kind==='arrival' && ['APP','FINAL','EMERG','HOLD'].includes(p.status)).sort((a,b)=>dist(a,finalFix)-dist(b,finalFix)).map(p=>p.id).slice(0,5);
    runwayQueue.departures = aircraft.filter(p=>p.kind==='departure' && ['HOLD_SHORT','LINEUP','DEP'].includes(p.status)).map(p=>p.id).slice(0,5);
    conflictPredictions=preds.slice(0,8);
    return conflictPredictions;
  }catch(e){ safeLogError(e,'predict-conflicts'); conflictPredictions=[]; return conflictPredictions; }
}


function arrivalOnShortFinal(excludeId=null){
  return aircraft.filter(p=>p && p.id!==excludeId && p.kind==='arrival' && ['APP','FINAL','EMERG'].includes(p.status))
    .filter(p=>dist(p, finalFix) <= SEPARATION_RULES.shortFinalNm || p.status==='FINAL')
    .sort((a,b)=>dist(a,finalFix)-dist(b,finalFix))[0] || null;
}
function nearestSeparationThreat(p){
  if(!p) return null;
  let best=null;
  for(const o of aircraft){
    if(!o || o.id===p.id) continue;
    const d=dist(p,o);
    const vertical=Math.abs((p.alt||0)-(o.alt||0));
    const airborneA=!['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(p.status);
    const airborneB=!['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(o.status);
    if(airborneA && airborneB && d<SEPARATION_RULES.lateralNm && vertical<SEPARATION_RULES.verticalFL){
      const score=(SEPARATION_RULES.lateralNm-d)*10+(SEPARATION_RULES.verticalFL-vertical);
      if(!best || score>best.score) best={other:o,d,vertical,score,msg:`Separação crítica com ${o.id}: ${d.toFixed(1)} NM / FL${Math.round(vertical)}`};
    }
  }
  return best;
}
function commandRisk(p, cmd){
  if(cmd==='noop' || cmd==='more' || cmd==='nextRequest') return {level:'ok', block:false, msg:'Ação de interface.'};
  if(!p) return {level:'warn', block:true, msg:'Selecione uma aeronave antes de emitir comando.'};
  const req=requests.find(r=>r.id===p.id);
  const expectedType=CLEARANCE_COMMANDS[cmd];
  if(expectedType && req?.type!==expectedType){
    return {level:'warn', block:true, msg:req ? `Pedido ativo é ${req.type.toUpperCase()}, não ${expectedType.toUpperCase()}.` : `Não existe pedido ${expectedType.toUpperCase()} pendente.`};
  }
  if((p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') && ['hold','deny','holdShort'].includes(cmd)) return {level:'danger', block:true, msg:`${p.id} em combustível crítico: espera/negação bloqueada.`};
  if(p.emergency && ['deny','holdShort'].includes(cmd)) return {level:'danger', block:true, msg:`${p.id} em emergência: priorize pouso/vetor final.`};
  const shortFinal=arrivalOnShortFinal(p.id);
  const sep=nearestSeparationThreat(p);
  if(sep && (expectedType || ['vectorFinal','fast','climb','descend'].includes(cmd))) return {level:'danger', block:false, msg:sep.msg};
  if(expectedType){
    if(expectedType==='landing'){
      if(runwayOccupiedBy && runwayOccupiedBy!==p.id) return {level:'danger', block:true, msg:`Pista ocupada por ${runwayOccupiedBy}. Pouso bloqueado.`};
      const preceding=aircraft.find(o=>o.id!==p.id && o.kind==='arrival' && o.status==='FINAL' && dist(o,finalFix)<dist(p,finalFix));
      if(preceding) return {level:'warn', block:false, msg:`Chegada precedente ${preceding.id} ainda na final.`};
    }
    if(expectedType==='lineup' || expectedType==='takeoff'){
      if(runwayOccupiedBy && runwayOccupiedBy!==p.id) return {level:'danger', block:true, msg:`Pista ocupada por ${runwayOccupiedBy}.`};
      if(shortFinal) return {level:'danger', block:true, msg:`${shortFinal.id} em aproximação curta. Saída bloqueada.`};
    }
  }
  if(cmd==='holdShort' && !['TAXI','HOLD_SHORT'].includes(p.status)) return {level:'warn', block:false, msg:'Hold short é indicado para tráfego de solo/táxi.'};
  if(cmd==='vectorFinal' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Vetor final disponível apenas para chegadas.'};
  if(cmd==='goAround' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Arremeter aplica-se a chegadas.'};
  return {level:'ok', block:false, msg:'Comando dentro do envelope operacional.'};
}
function updateSafetyState(){
  const conflicts=Array.isArray(conflictPredictions)?conflictPredictions.length:0;
  const selectedPlane=aircraft.find(x=>x.id===selected);
  const sep=selectedPlane ? nearestSeparationThreat(selectedPlane) : null;
  const shortFinal=arrivalOnShortFinal();
  let score=100;
  const messages=[];
  if(runwayOccupiedBy){ score-=18; messages.push(`Pista protegida: ${runwayOccupiedBy}.`); }
  if(conflicts){ score-=Math.min(60,conflicts*18); const wakeText=(conflictPredictions[0]?.wakeReq?` Wake ${conflictPredictions[0].wakeReq.toFixed(1)}NM.`:''); messages.push(`${conflicts} conflito(s) previstos no radar.${wakeText}`); }
  if(sep){ score-=30; messages.push(sep.msg); }
  if(shortFinal){ messages.push(`${shortFinal.id} em curta final: bloquear saídas não essenciais.`); }
  const fuelEmerg=aircraft.filter(p=>p.emergency || p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL');
  const lowFuel=aircraft.filter(p=>p.fuelState==='LOW');
  if(fuelEmerg.length){ score-=Math.min(55,fuelEmerg.length*22); messages.push(`${fuelEmerg.length} MAYDAY/FUEL crítico ativo.`); }
  if(lowFuel.length){ score-=Math.min(24,lowFuel.length*8); messages.push(`${lowFuel.length} aeronave(s) com combustível mínimo.`); }
  const overdue=requests.filter(r=>performance.now()-r.time>45000).length;
  if(overdue){ score-=Math.min(25,overdue*8); messages.push(`${overdue} solicitação(ões) com espera longa.`); }
  score=clamp(Math.round(score),0,100);
  const level=score<45?'danger':score<75?'warn':'ok';
  safetyState={score, level, messages:messages.length?messages:['Operação dentro dos limites.'], lastRisk:messages[0]||null};
  const ss=$('#safetyScore');
  if(ss){ ss.textContent=`SAFETY ${score}%`; ss.className='safety-score '+level; }
  const adv=$('#safetyAdvisor');
  if(adv){ adv.innerHTML=`<b>Safety Advisor: ${score}%</b>`+safetyState.messages.map(m=>`<span>${m}</span>`).join(''); adv.className='safety-advisor '+level; }
  return safetyState;
}
function updateOperationalHints(){
  try{ updateSafetyState(); }catch(e){ safeLogError(e,'safety-state'); }
  const p=aircraft.find(x=>x.id===selected);
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = getSector(p);
  if($('#sectorHelp')) $('#sectorHelp').textContent = p ? sectorLabel(p) : 'Selecione uma aeronave';
  if(emergencyDirector.active) setDiagnostic('MAYDAY / PRIORIDADE ATIVA','danger');
  else if(conflictPredictions.some(c=>c.level==='danger')) setDiagnostic('CONFLITO PREVISTO','danger');
  else if(requests.some(r=>r.priority==='urgent')) setDiagnostic('EMERGÊNCIA NA FILA','danger');
  else if(conflictPredictions.length) setDiagnostic('SEPARAÇÃO EM ATENÇÃO','warn');
  else if(isRunwayProtectedByOther(p)) setDiagnostic('PISTA OCUPADA','warn');
  else setDiagnostic('SISTEMA OK','ok');
}
function updatePlanes(dt){
  for(const p of aircraft){
    p.selected = selected === p.id;
    if(p.status==='PARKED'){ updateAircraftPerformanceStep?.(p,dt,'PARKED'); p.speed = 0; }
    else if(p.status==='PUSHBACK'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'PUSHBACK'); p.y += .45*dt;
      if(p.groundTimer>9){ p.status='READY_TAXI'; p.speed=0; addRequest(p,'taxi'); }
    } else if(p.status==='TAXI'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'TAXI'); const hp = holdingPoints[p.groundIndex || 0]; p.heading = headingTo(p,hp); moveToward(p,hp,SIM_SPEED*.6*dt);
      if(dist(p,hp)<1.6){ p.status='HOLD_SHORT'; p.speed=0; addRequest(p,'lineup','warn'); }
    } else if(p.status==='LINEUP'){
      updateAircraftPerformanceStep?.(p,dt,'LINEUP'); p.speed = 0; const line = {x:25,y:50}; moveToward(p,line,SIM_SPEED*.35*dt); p.heading=270;
      if(dist(p,line)<2.0 && !requests.some(r=>r.id===p.id && r.type==='takeoff')) addRequest(p,'takeoff','warn');
    } else if(p.status==='DEP'){
      p.targetAlt = Math.max(p.targetAlt,160); p.heading = 270; updateAircraftPerformanceStep?.(p,dt,'DEP');
      moveByHeading(p, dt);
    } else if(p.status==='HOLD'){
      p.heading = (p.heading + 8*dt) % 360; updateAircraftPerformanceStep?.(p,dt,'HOLD'); moveByHeading(p, dt*.75);
    } else if(p.status==='APP'){
      p.heading += shortTurn(p.heading, headingTo(p, finalFix))*.018; updateAircraftPerformanceStep?.(p,dt,'APP'); moveByHeading(p, dt);
      if(dist(p,finalFix)<8 && !requests.some(r=>r.id===p.id && r.type==='landing')) addRequest(p,'landing','warn');
    } else if(p.status==='FINAL' || p.status==='EMERG'){
      const threshold = {x:82,y:50}; p.heading += shortTurn(p.heading, headingTo(p, threshold))*.028; p.targetAlt=0; updateAircraftPerformanceStep?.(p,dt,p.status); moveByHeading(p, dt);
    }
    p.trail.push({x:p.x,y:p.y}); if(p.trail.length>54) p.trail.shift();
  }
  for(const p of [...aircraft]){
    if((p.status==='FINAL'||p.status==='EMERG') && dist(p,{x:82,y:50})<2.8 && p.alt<10){
      const landingRisk = typeof aircraftLandingRisk==='function' ? aircraftLandingRisk(p) : (p.speed>145?25:0); const hardLanding = (landingRisk>24 || WX_STATE.severity>.72 || p.damage>30); if(hardLanding){ const dmg=Math.round(rand(8,22)+WX_STATE.severity*18+Math.min(18,landingRisk*.28)); stats.damaged=(stats.damaged||0)+1; score-=120; addLog(`${p.id}: pouso concluído com inspeção técnica. Dano ${dmg}%.`, 'warn'); } else { addLog(`${p.id}: pouso concluído, livrando pista pela saída rápida.`); } stats.landed++; if(p.emergency) stats.maydayResolved=(stats.maydayResolved||0)+1; score += p.emergency ? 1300 : 900; removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
    if(p.status==='DEP' && (p.x<0 || p.x>104 || p.y<0 || p.y>100)){
      stats.departed++; score += 720; addLog(`${p.id}: decolagem concluída, contato com saída.`); removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
  }
}
function moveByHeading(p,dt){ const rad=degToRad(p.heading); const scale=(p.speed/220)*SIM_SPEED*4.6; p.x += Math.cos(rad)*scale*dt; p.y += Math.sin(rad)*scale*dt; }
function moveToward(p,t,amount){ const h=headingTo(p,t), r=degToRad(h); p.x += Math.cos(r)*amount*100; p.y += Math.sin(r)*amount*100; }
function shortTurn(a,b){ return QUALITY?.shortestTurn ? QUALITY.shortestTurn(a,b) : ((b-a+540)%360)-180; }
function checkRunway(){
  runwayOccupiedBy = null;
  for(const p of aircraft){ if(['LINEUP','DEP','FINAL','EMERG'].includes(p.status) && p.x>15 && p.x<86 && Math.abs(p.y-50)<5.5) runwayOccupiedBy = p.id; }
}
function checkMissedRequests(){
  const now = performance.now();
  for(const r of requests){
    const age = (now-r.time)/1000;
    const p = aircraft.find(x=>x.id===r.id); if(!p) continue;
    if(age>52 && r.priority==='urgent') return endGame(true,`${r.id} em emergência ficou sem resposta.`);
    if(age>72 && r.priority!=='urgent'){ r.priority='warn'; score-=30; }
  }
}
function checkConflicts(){
  for(const p of aircraft) p.risk = Math.max(0,p.risk-.006);
  for(let i=0;i<aircraft.length;i++) for(let j=i+1;j<aircraft.length;j++){
    const a=aircraft[i], b=aircraft[j]; if(a.status==='PARKED'||b.status==='PARKED'||a.status==='PUSHBACK'||b.status==='PUSHBACK') continue;
    const d=dist(a,b), vSep=Math.abs(a.alt-b.alt), ground=a.alt<8 && b.alt<8;
    if(d < (ground?2.5:4.8) && (ground || vSep<10)){ a.risk+=.014; b.risk+=.014; if(a.risk>.22 && b.risk>.22) stats.conflicts++; if(a.risk>1.15 || b.risk>1.15) return endGame(true,`Separação perdida entre ${a.id} e ${b.id}.`); }
  }
  const finals = aircraft.filter(p=>p.status==='FINAL' || p.status==='EMERG');
  if(finals.length>1){ for(const p of finals) p.risk += .01; if(finals.some(p=>p.risk>.9)) return endGame(true,'Duas aeronaves autorizadas para a mesma final sem separação suficiente.'); }
}

/* ===== MODULE 14: 08-radar-rendering (08-radar-rendering.js) ===== */
/* @skyward-module 08-radar-rendering
 * Radar, operational map, procedures, telemetry and aircraft drawing.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('08-radar-rendering');
function draw(){
  const r = canvas.getBoundingClientRect(), w=r.width, h=r.height;
  ctx.clearRect(0,0,w,h);
  if(radarFilters.map && asset.map.complete){ ctx.globalAlpha=.30; ctx.drawImage(asset.map,0,0,w,h); ctx.globalAlpha=1; }
  drawScope(w,h);
  drawWeatherOverlay(w,h);
  drawOperationalMap(w,h);
  drawProfessionalProcedures(w,h);
  drawConflictPredictions(w,h);
  drawSafetyEnvelope(w,h);
  drawRunwayQueue(w,h);
  for(const p of aircraft) drawPlane(p,w,h);
  drawRadarTelemetry(w,h);
}
function drawOperationalMap(w,h){
  const P = (x,y)=>({x:x/100*w,y:y/100*h});
  ctx.save();
  ctx.lineCap='round'; ctx.lineJoin='round';
  // taxiway network
  ctx.strokeStyle='rgba(210,168,68,.30)'; ctx.lineWidth=Math.max(2,w*.004);
  const taxi = [[20,58,82,58],[28,65,78,65],[34,73,80,73],[32,58,32,50],[45,58,45,50],[56,58,56,50],[68,58,68,50],[78,58,78,50],[55,65,55,78],[62,65,62,78],[72,65,72,78]];
  taxi.forEach(t=>{ const a=P(t[0],t[1]), b=P(t[2],t[3]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); });
  // runway
  const a=P(runway.x1,runway.y1), b=P(runway.x2,runway.y2); ctx.lineWidth=Math.max(16,h*.035); ctx.strokeStyle='rgba(20,24,28,.98)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.lineWidth=Math.max(2,h*.004); ctx.strokeStyle=runwayOccupiedBy?'rgba(255,77,66,.95)':'rgba(100,255,130,.85)'; ctx.setLineDash([12,8]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // centerline and edges
  ctx.strokeStyle='rgba(255,255,255,.58)'; ctx.lineWidth=1; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // approach corridor and final sector
  const ff=P(finalFix.x,finalFix.y), th=P(82,50); ctx.strokeStyle="rgba(91,240,109,.28)"; ctx.lineWidth=2; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(ff.x,ff.y); ctx.lineTo(th.x,th.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle="rgba(91,240,109,.75)"; ctx.beginPath(); ctx.arc(ff.x,ff.y,5,0,Math.PI*2); ctx.fill(); ctx.font="700 10px ui-monospace"; ctx.fillText("FINAL FIX", ff.x+8, ff.y+4);
  // labels from code are okay: operational UI, not image asset
  ctx.font='700 12px ui-monospace,Consolas,monospace'; ctx.fillStyle='rgba(235,245,255,.90)'; ctx.fillText('RWY 09', a.x-8, a.y-18); ctx.fillText('RWY 27', b.x-42, b.y-18);
  runway.exits.forEach((x,i)=>{ const e=P(x,56); ctx.fillStyle='rgba(216,163,72,.95)'; ctx.beginPath(); ctx.arc(e.x,e.y,4,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText(`E${i+1}`, e.x+6, e.y+4); });
  gates.forEach((g,i)=>{ const gp=P(g.x,g.y); ctx.strokeStyle='rgba(120,180,220,.25)'; ctx.strokeRect(gp.x-10,gp.y-7,20,14); ctx.fillStyle='rgba(190,215,235,.55)'; ctx.font='700 9px ui-monospace'; ctx.fillText(`${g.label}${i+1}`,gp.x-9,gp.y+3); });
  if(runwayOccupiedBy){ ctx.fillStyle='rgba(255,77,66,.92)'; ctx.font='900 13px ui-monospace'; ctx.fillText(`PISTA OCUPADA: ${runwayOccupiedBy}`, P(19,44).x, P(19,44).y); }
  ctx.restore();
}
function drawScope(w,h){
  const cx=w/2, cy=h/2, rr=Math.min(w,h)*.46;
  ctx.save();
  ctx.fillStyle='rgba(2,7,10,.20)'; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(82,220,110,.08)'; ctx.lineWidth=1;
  const step=Math.max(28,Math.min(w,h)/12);
  for(let x=(w%step);x<w;x+=step){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=(h%step);y<h;y+=step){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  ctx.strokeStyle='rgba(110,230,135,.16)';
  for(let i=1;i<=5;i++){ ctx.setLineDash([6,8]); ctx.beginPath(); ctx.arc(cx,cy,rr*i/5,0,Math.PI*2); ctx.stroke(); }
  ctx.setLineDash([8,14]);
  for(let a=0;a<360;a+=15){
    const r=degToRad(a); ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(r)*rr,cy+Math.sin(r)*rr); ctx.stroke();
    if(a%30===0){ ctx.save(); ctx.fillStyle='rgba(150,210,170,.36)'; ctx.font='700 9px ui-monospace'; ctx.fillText(String(a).padStart(3,'0'), cx+Math.cos(r)*(rr+10)-8, cy+Math.sin(r)*(rr+10)+3); ctx.restore(); }
  }
  ctx.setLineDash([]); ctx.strokeStyle='rgba(91,240,109,.28)'; ctx.beginPath(); ctx.moveTo(cx-9,cy); ctx.lineTo(cx+9,cy); ctx.moveTo(cx,cy-9); ctx.lineTo(cx,cy+9); ctx.stroke();
  // sweeping radar arm
  const t=(performance.now()/4800)%(Math.PI*2); const grd=ctx.createRadialGradient(cx,cy,8,cx,cy,rr);
  grd.addColorStop(0,'rgba(91,240,109,.16)'); grd.addColorStop(1,'rgba(91,240,109,0)');
  ctx.fillStyle=grd; ctx.beginPath(); ctx.moveTo(cx,cy); ctx.arc(cx,cy,rr,t-.10,t+.10); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function drawConflictPredictions(w,h){
  if(!radarFilters.safety || !Array.isArray(conflictPredictions)) return;
  ctx.save();
  conflictPredictions.forEach(c=>{
    const a=aircraft.find(p=>p.id===c.a), b=aircraft.find(p=>p.id===c.b); if(!a||!b) return;
    const ax=a.x/100*w, ay=a.y/100*h, bx=b.x/100*w, by=b.y/100*h;
    const col=c.level==='danger'?'rgba(255,77,66,.78)':'rgba(255,191,61,.68)';
    ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=c.level==='danger'?2.4:1.7; ctx.setLineDash([8,6]);
    ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx,by); ctx.stroke(); ctx.setLineDash([]);
    const mx=(ax+bx)/2, my=(ay+by)/2;
    ctx.font='900 11px ui-monospace,Consolas,monospace'; ctx.fillText(c.level==='danger'?'CONFLITO':'SEPARAÇÃO', mx+6, my-6);
    ctx.beginPath(); ctx.arc(a.x/100*w,a.y/100*h,c.level==='danger'?26:20,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(b.x/100*w,b.y/100*h,c.level==='danger'?26:20,0,Math.PI*2); ctx.stroke();
  });
  ctx.restore();
}

function drawSafetyEnvelope(w,h){
  if(!radarFilters.safety) return;
  const p=aircraft.find(x=>x.id===selected);
  if(!p) return;
  const pt=pctToPx(p,w,h);
  const risk=nearestSeparationThreat(p);
  ctx.save();
  ctx.setLineDash([5,5]);
  ctx.strokeStyle = risk ? 'rgba(255,77,66,.85)' : 'rgba(91,240,109,.28)';
  ctx.lineWidth = risk ? 2.2 : 1.2;
  ctx.beginPath();
  ctx.arc(pt.x,pt.y,Math.max(24,w*.055),0,Math.PI*2);
  ctx.stroke();
  if(risk){
    const op=pctToPx(risk.other,w,h);
    ctx.setLineDash([]);
    ctx.strokeStyle='rgba(255,77,66,.9)';
    ctx.beginPath(); ctx.moveTo(pt.x,pt.y); ctx.lineTo(op.x,op.y); ctx.stroke();
    ctx.fillStyle='rgba(255,77,66,.95)'; ctx.font='700 12px ui-monospace,monospace';
    ctx.fillText('SEP ALERT', (pt.x+op.x)/2+8, (pt.y+op.y)/2-8);
  }
  ctx.restore();
}
function drawRunwayQueue(w,h){
  ctx.save();
  const x=14, y=44; ctx.font='700 10px ui-monospace,Consolas,monospace';
  ctx.fillStyle='rgba(230,245,255,.70)'; ctx.fillText('APP SEQ: '+(runwayQueue.arrivals.join(' > ')||'---'), x, y);
  ctx.fillStyle='rgba(88,183,255,.70)'; ctx.fillText('DEP SEQ: '+(runwayQueue.departures.join(' > ')||'---'), x, y+13);
  ctx.restore();
}


function drawProcedurePath(points,w,h,color,label){
  if(!Array.isArray(points) || points.length<2) return;
  const P=(o)=>pctToPx(o,w,h);
  ctx.save();
  ctx.strokeStyle=color || 'rgba(91,240,109,.45)';
  ctx.lineWidth=Math.max(1.2,w*.0018);
  ctx.setLineDash([10,8]);
  ctx.beginPath();
  points.forEach((pt,i)=>{ const p=P(pt); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
  ctx.stroke();
  ctx.setLineDash([]);
  if(label){
    const p=P(points[Math.max(0,Math.floor(points.length/2))]);
    ctx.fillStyle=color || 'rgba(91,240,109,.75)';
    ctx.font='800 10px ui-monospace,Consolas,monospace';
    ctx.fillText(label,p.x+8,p.y-6);
  }
  ctx.restore();
}

function drawProfessionalProcedures(w,h){
  if(!radarFilters.procedures) return;
  try{
    const P=(o)=>pctToPx(o,w,h);
    ctx.save();
    // controlled terminal area boundary
    ctx.strokeStyle='rgba(79,181,255,.18)';
    ctx.lineWidth=1.2;
    ctx.setLineDash([12,10]);
    ctx.beginPath();
    ctx.ellipse(w*.50,h*.48,w*.43,h*.36,0,0,Math.PI*2);
    ctx.stroke();
    ctx.setLineDash([]);

    // ILS localizer fan / feather
    if(radarFilters.final){
      const th=P(PROCEDURE_LAYER.ils.threshold), faf=P(PROCEDURE_LAYER.ils.faf), iaf=P(PROCEDURE_LAYER.ils.iaf);
      const fanA=P({x:56,y:22}), fanB=P({x:60,y:39});
      ctx.fillStyle='rgba(91,240,109,.045)';
      ctx.beginPath(); ctx.moveTo(th.x,th.y); ctx.lineTo(fanA.x,fanA.y); ctx.lineTo(fanB.x,fanB.y); ctx.closePath(); ctx.fill();
      ctx.strokeStyle='rgba(91,240,109,.38)'; ctx.lineWidth=1.8; ctx.setLineDash([8,6]);
      ctx.beginPath(); ctx.moveTo(th.x,th.y); ctx.lineTo(iaf.x,iaf.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle='rgba(91,240,109,.78)'; ctx.font='900 10px ui-monospace,Consolas,monospace';
      ctx.fillText(PROCEDURE_LAYER.ils.name, faf.x+8, faf.y+12);
    }

    PROCEDURE_LAYER.routes.forEach(r=>{
      if(r.type==='arrival' && !radarFilters.final) return;
      drawProcedurePath(r.pts,w,h,r.color,r.id);
    });

    PROCEDURE_LAYER.fixes.forEach(f=>{
      if(f.type==='departure' && !radarFilters.vectors) return;
      const p=P(f);
      const col=f.type==='arrival'?'rgba(91,240,109,.80)':f.type==='departure'?'rgba(88,183,255,.80)':f.type==='hold'?'rgba(255,191,61,.80)':'rgba(230,245,255,.75)';
      ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=1.4;
      if(f.type==='hold'){
        ctx.setLineDash([4,4]); ctx.beginPath(); ctx.ellipse(p.x,p.y,18,10,-.25,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
      }else{
        ctx.beginPath(); ctx.moveTo(p.x-5,p.y); ctx.lineTo(p.x+5,p.y); ctx.moveTo(p.x,p.y-5); ctx.lineTo(p.x,p.y+5); ctx.stroke();
      }
      ctx.font='800 9px ui-monospace,Consolas,monospace';
      ctx.fillText(`${f.id} ${f.name}`,p.x+7,p.y-7);
    });
    ctx.restore();
  }catch(e){ safeLogError(e,'draw-professional-procedures'); }
}

function drawRadarTelemetry(w,h){
  try{
    ctx.save();
    const mode = SAFE_MODE.perf?.mode==='reduced' ? 'PERF REDUZIDA' : 'NORMAL';
    const scope = PROCEDURE_LAYER.scopeNm || 60;
    const selectedPlane=aircraft.find(p=>p.id===selected);
    const lines=[
      `${airport().icao} ${currentOpsProfile?.layout||'GEN'} SCOPE ${scope}NM`,
      `RWY ${runway.name} ${runwayOccupiedBy?'OCC '+runwayOccupiedBy:'FREE'} ${RUNWAY_OPS.mode}`,
      `ACFT ${aircraft.length}/${SAFE_MODE.maxAircraft} PERF ${mode}`,
      selectedPlane ? `SEL ${selectedPlane.id} ${getSector(selectedPlane)} HDG ${Math.round(selectedPlane.heading)} FL${Math.round(selectedPlane.alt)} FUEL ${Math.round(selectedPlane.fuel??0)}%` : (emergencyDirector.active ? `EMERG ${emergencyDirector.target}` : 'SEL ---')
    ];
    ctx.fillStyle='rgba(3,8,14,.60)';
    ctx.strokeStyle='rgba(151,202,255,.16)';
    ctx.lineWidth=1;
    const boxW=Math.min(w*.38,260), boxH=18+lines.length*14;
    ctx.fillRect(w-boxW-10,10,boxW,boxH);
    ctx.strokeRect(w-boxW-10,10,boxW,boxH);
    ctx.font='800 10px ui-monospace,Consolas,monospace';
    lines.forEach((line,i)=>{
      ctx.fillStyle=i===1 && runwayOccupiedBy ? 'rgba(255,191,61,.90)' : 'rgba(203,236,255,.82)';
      ctx.fillText(line,w-boxW,28+i*14);
    });
    if(radarFilters.range){
      ctx.strokeStyle='rgba(230,245,255,.36)';
      ctx.beginPath(); ctx.moveTo(16,h-20); ctx.lineTo(Math.min(156,w*.22),h-20); ctx.stroke();
      ctx.fillStyle='rgba(230,245,255,.70)';
      ctx.font='800 10px ui-monospace,Consolas,monospace';
      ctx.fillText('10 NM',18,h-26);
    }
    const badge=document.querySelector('#radarModeBadge');
    if(badge) badge.textContent = `RADAR PROFISSIONAL • ${scope}NM • ${mode}`;
    ctx.restore();
  }catch(e){ safeLogError(e,'draw-radar-telemetry'); }
}

function drawPlane(p,w,h){
  const pos = {x:p.x/100*w, y:p.y/100*h};
  const col = p.conflictLevel==='danger' ? '#ff4d42' : p.conflictLevel==='warn' ? '#ffbf3d' : p.risk>.45 ? '#ff4d42' : p.emergency ? '#ffbf3d' : p.status==='PARKED' ? '#a8b3bd' : p.kind==='departure' ? '#58b7ff' : '#5bf06d';
  ctx.save(); ctx.strokeStyle=col; ctx.fillStyle=col; ctx.lineWidth=p.selected?2.5:1.4; ctx.shadowColor=col; ctx.shadowBlur=p.selected?15:5;
  ctx.globalAlpha=.45; ctx.beginPath(); p.trail.forEach((q,i)=>{ const x=q.x/100*w, y=q.y/100*h; if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke(); ctx.globalAlpha=1;
  const rad=degToRad(p.heading);
  if(radarFilters.vectors && !['PARKED','HOLD_SHORT','LINEUP'].includes(p.status)){ const len=14+Math.min(52,p.speed/5.5); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pos.x+Math.cos(rad)*len,pos.y+Math.sin(rad)*len); ctx.stroke(); const pred=estimatePosition(p,45); ctx.globalAlpha=.55; ctx.setLineDash([4,5]); ctx.beginPath(); ctx.moveTo(pos.x,pos.y); ctx.lineTo(pred.x/100*w,pred.y/100*h); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1; }
  ctx.translate(pos.x,pos.y); ctx.rotate(rad+Math.PI/2); ctx.beginPath();
  if(['PARKED','PUSHBACK','TAXI','HOLD_SHORT'].includes(p.status) || p.alt<8){ ctx.rect(-5,-5,10,10); }
  else { ctx.moveTo(0,-8); ctx.lineTo(5,6); ctx.lineTo(0,3); ctx.lineTo(-5,6); ctx.closePath(); }
  ctx.stroke(); ctx.setTransform(1,0,0,1,0,0);
  if(p.selected){ ctx.beginPath(); ctx.arc(pos.x,pos.y,19,0,Math.PI*2); ctx.stroke(); }
  ctx.shadowBlur=0;
  const hasReq = requests.some(r=>r.id===p.id);
  const showLabel = radarFilters.labels && (p.selected || hasReq || p.conflictLevel!=='ok' || !['PARKED','PUSHBACK'].includes(p.status));
  if(showLabel){
    ctx.font=(w<430?'9px':'11px')+' ui-monospace,Menlo,Consolas,monospace'; ctx.fillStyle=col;
    const tx=pos.x+10, ty=pos.y-10;
    ctx.fillText(p.id,tx,ty);
    if(p.selected || w>=430 || !['PARKED','PUSHBACK','TAXI'].includes(p.status)){
      ctx.fillStyle='rgba(230,245,255,.86)'; ctx.fillText(`${p.status} FL${Math.max(0,Math.round(p.alt)).toString().padStart(3,'0')}`,tx,ty+12);
      ctx.fillText(`${Math.round(p.speed)}KT F${Math.round(p.fuel??0)}%`,tx,ty+24);
      if(p.selected && typeof aircraftEnvelopeState==='function'){ ctx.fillStyle='rgba(88,183,255,.86)'; ctx.fillText(`${wakeCategory(p)} ${aircraftEnvelopeState(p)}`,tx,ty+36); }
    }
    if(hasReq){ ctx.fillStyle='rgba(255,191,61,.95)'; ctx.fillText('REQ',tx,ty+(p.selected?36:28)); }
    if((p.fuelState&&p.fuelState!=='OK') || p.emergency){ ctx.fillStyle=p.emergency?'#ff4d42':'#ffbf3d'; ctx.fillText(p.emergency?'MAYDAY':p.fuelState,tx,ty+(p.selected?60:52)); }
    if(p.conflictLevel && p.conflictLevel!=='ok'){ ctx.fillStyle=p.conflictLevel==='danger'?'#ff4d42':'#ffbf3d'; ctx.fillText(p.conflictLevel==='danger'?'CNFL':'SEP',tx,ty+(p.selected?48:40)); }
  }
  ctx.restore();
}

/* ===== MODULE 15: 09-ui-clearances (09-ui-clearances.js) ===== */
/* @skyward-module 09-ui-clearances
 * Traffic UI, requests, commands, clearances and action grids.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('09-ui-clearances');
function renderStrips(){
  const arr = aircraft.filter(p=>p.kind==='arrival').slice(0,9);
  const dep = aircraft.filter(p=>p.kind==='departure' && !['PARKED','PUSHBACK'].includes(p.status)).slice(0,9);
  const grd = aircraft.filter(p=>['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP'].includes(p.status)).slice(0,9);
  const mk = (p, type) => {
    const meta = type==='arr' ? `${p.type} • FL${Math.round(p.alt)} • ${Math.max(5,Math.round(dist(p,finalFix)))} NM • F${Math.round(p.fuel??0)}%` :
                  type==='dep' ? `${p.status==='LINEUP'?'PRONTO':p.status} • RWY ${runway.name} • F${Math.round(p.fuel??0)}%` :
                  `${p.status} • ${p.type} • VREF ${p.performance?.vRef||aircraftPerformanceProfile?.(p.type)?.finalSpeed||'--'}`;
    return `<button class="strip ref ${p.risk>.4?'danger':p.emergency?'warning':''}" data-select="${p.id}"><b>${p.id}</b><span>${meta}</span><small style="color:#9db0c3">${p.request ? ('PEDIDO: '+p.request.toUpperCase()) : 'MONITORANDO'}</small></button>`;
  };
  const aEl=$('#arrivals'), dEl=$('#departures'), gEl=$('#groundList');
  if(aEl) aEl.innerHTML = arr.map(p=>mk(p,'arr')).join('') || '<div class="muted">Sem entradas.</div>';
  if(dEl) dEl.innerHTML = dep.map(p=>mk(p,'dep')).join('') || '<div class="muted">Sem saídas.</div>';
  if(gEl) gEl.innerHTML = grd.map(p=>mk(p,'grd')).join('') || '<div class="muted">Sem solo.</div>';
  if($('#arrivalsCount')) $('#arrivalsCount').textContent = arr.length;
  if($('#departuresCount')) $('#departuresCount').textContent = dep.length;
  if($('#groundCount')) $('#groundCount').textContent = grd.length;
  const activeList = $('.traffic-list.active');
  if($('#trafficCount') && activeList){ $('#trafficCount').textContent = activeList.querySelectorAll('[data-select]').length; }
  $$('[data-select]').forEach(b=>b.onclick=()=>{ selected=b.dataset.select; selectedRequest=null; renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); renderActionGrid(); });
}
function renderRequests(){
  const box=$('#requests'); if(!box) return;
  if($('#requestsCount')) $('#requestsCount').textContent = `${requests.length} AGUARDANDO`;
  const ordered=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a));
  box.innerHTML = ordered.map(r=>{ const age=Math.floor((performance.now()-r.time)/1000); return `
    <button class="request ${r.priority==='urgent'?'urgent':r.priority==='warn'?'warn':''} ${selectedRequest===r?'selected':''}" data-req="${r.id}|${r.type}">
      <div class="request-head"><b>${r.id}</b><small>${String(age).padStart(2,'0')}:${String(age%60).padStart(2,'0')}</small></div>
      <span class="request-text">${r.text}</span>
      <span class="request-type">${r.type.toUpperCase()}</span>
    </button>`; }).join('') || '<div class="muted">Nenhuma solicitação pendente.</div>';
  $$('[data-req]').forEach(b=>b.onclick=()=>{ const [id,type]=b.dataset.req.split('|'); selected=id; selectedRequest=requests.find(r=>r.id===id && r.type===type) || null; renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); });
}
function renderSelected(){
  const box = $('#selectedBox');
  const p=aircraft.find(x=>x.id===selected); if(!p){ if(box) box.textContent='Nenhuma aeronave selecionada'; renderActionGrid(); return; }
  const req=requests.find(r=>r.id===p.id);
  const op = getSector(p);
  if(box) box.innerHTML = `
    <div class="sel-top"><div class="sel-name"><b>${p.id}</b><small>${p.type} • ${sectorLabel(p)}</small></div><div class="sel-status">${p.status.replace('_',' ')}</div></div>
    <div class="sel-grid">
      <div class="sel-item"><span>ALT</span><b>FL${Math.round(p.alt)}</b></div>
      <div class="sel-item"><span>SPD</span><b>${Math.round(p.speed)}kt</b></div>
      <div class="sel-item"><span>HDG</span><b>${Math.round(p.heading)}°</b></div>
      <div class="sel-item"><span>POS</span><b>${p.kind==='arrival' ? `${Math.max(5,Math.round(dist(p,finalFix)))}NM` : 'SOLO'}</b></div>
      <div class="sel-item"><span>REQ</span><b>${req ? req.text : '---'}</b></div>
      <div class="sel-item"><span>SETOR</span><b>${op}</b></div><div class="sel-item"><span>WAKE</span><b>${wakeCategory(p)}</b></div><div class="sel-item"><span>VREF</span><b>${p.performance?.vRef||aircraftPerformanceProfile?.(p.type)?.finalSpeed||'--'}kt</b></div><div class="sel-item"><span>ENVELOPE</span><b>${aircraftEnvelopeState?.(p)||'NORMAL'}</b></div><div class="sel-item"><span>FUEL</span><b class="fuel-${fuelClass(p)}">${Math.round(p.fuel??0)}%</b></div><div class="sel-item"><span>DMG</span><b>${Math.round(p.damage||0)}%</b></div>
    </div>`;
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = op;
  renderActionGrid();
}
canvas.addEventListener('pointerdown', e=>{
  const rect=canvas.getBoundingClientRect(), x=e.clientX-rect.left, y=e.clientY-rect.top; let best=null, bd=999;
  for(const p of aircraft){ const px=p.x/100*rect.width, py=p.y/100*rect.height, d=Math.hypot(px-x,py-y); if(d<bd){ bd=d; best=p; } }
  if(best && bd<48){ selected=best.id; selectedRequest=null; addLog(`${best.id} selecionado.`); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); }
});
function command(cmd){
  if(cmd==='nextRequest'){ selectNextRequest(); return; }
  const p=aircraft.find(x=>x.id===selected); if(!p){ addLog('Nenhuma aeronave selecionada.','warn'); setDiagnostic('SELECIONE UMA AERONAVE','warn'); setReadback('selecione uma aeronave antes do comando','warn'); return; }
  const preRisk = commandRisk(p, cmd);
  if(preRisk.block){
    stats.blocked=(stats.blocked||0)+1;
    stats.safetyWarnings=(stats.safetyWarnings||0)+1;
    addLog(`${airport().icao}: comando bloqueado para ${p.id} — ${preRisk.msg}`, 'danger');
    setDiagnostic('COMANDO BLOQUEADO PELO SAFETY ADVISOR','danger');
    setReadback(`${p.id} comando bloqueado: ${preRisk.msg}`,'danger');
    renderActionGrid(); renderRunwayBoard(); renderMobileGameplay();
    return;
  }
  if(preRisk.level==='warn'){
    stats.safetyWarnings=(stats.safetyWarnings||0)+1;
    addLog(`${airport().icao}: aviso safety para ${p.id} — ${preRisk.msg}`, 'warn');
    setDiagnostic('COMANDO COM AVISO OPERACIONAL','warn');
  }
  stats.commands++; score -= 2;
  if(cmd==='left') p.heading=(p.heading+350)%360;
  if(cmd==='right') p.heading=(p.heading+10)%360;
  if(cmd==='slow') p.speed=clamp(p.speed-10,Math.max(40,(aircraftPerformanceProfile?.(p.type)?.minApproachSpeed||70)-20),320);
  if(cmd==='fast') p.speed=clamp(p.speed+10,0,(aircraftPerformanceProfile?.(p.type)?.maxApproachSpeed||240)+60);
  if(cmd==='climb') p.targetAlt=clamp(p.targetAlt+10,0,360);
  if(cmd==='descend') p.targetAlt=clamp(p.targetAlt-10,0,360);
  if(cmd==='hold'){ p.hold=!p.hold; if(p.kind==='arrival') p.status=p.hold?'HOLD':'APP'; addLog(`${airport().icao}: ${p.id} ${p.hold?'entre em espera':'prossiga aproximação'}.`); }
  if(cmd==='holdShort'){ if(['TAXI','LINEUP','DEP'].includes(p.status)){ p.status='HOLD_SHORT'; p.speed=0; p.cleared=false; addLog(`${airport().icao}: ${p.id} hold short pista ${runway.name}.`); } }
  if(cmd==='vectorFinal'){ if(p.kind==='arrival'){ p.status='APP'; p.hold=false; p.heading=headingTo(p, finalFix); p.targetAlt=Math.min(p.targetAlt,45); p.speed=Math.min(p.speed,performanceTargetSpeed?.(p,'APP')||170); addLog(`${airport().icao}: ${p.id} vetor para interceptar final RWY ${runway.name}.`); } }
  if(cmd==='deny'){ denyRequest(p); }
  if(cmd==='goAround'){ p.status='APP'; p.cleared=false; p.targetAlt=80; p.speed=Math.max(p.speed,performanceTargetSpeed?.(p,'APP')||170); p.heading=headingTo(p,{x:p.x<50?20:80,y:18}); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; addLog(`${airport().icao}: ${p.id} arremeta, suba para FL080.`, 'warn'); }
  if(cmd==='emergency'){ if(!p.emergency){ stats.emergencies=(stats.emergencies||0)+1; } p.emergency=true; p.emergencyType=p.emergencyType||'ATC DECLARED'; p.status=p.kind==='arrival'?'EMERG':p.status; p.fuel=Math.min(p.fuel||40,24); addRequest(p,'emergency','urgent'); setReadback(`${p.id} MAYDAY acknowledged, priority handling approved.`,'danger'); }
  if(CLEARANCE_COMMANDS[cmd]) handleClearance(p,CLEARANCE_COMMANDS[cmd]);
  else if(!['hold','emergency','deny'].includes(cmd)) addLog(`${airport().icao}: ${p.id} ${cmd.toUpperCase()} autorizado.`);
  p.sector=getSector(p); setReadback(atcReadbackFor(p,cmd), commandRisk(p,cmd).level==='danger'?'danger':'ok'); saveGoodState('after-command',true);
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid(); updateOperationalHints(); renderRunwayBoard();
}
function denyRequest(p){
  const req = requests.find(r=>r.id===p.id);
  if(!req){ addLog(`${p.id}: sem solicitação ativa para negar.`, 'warn'); return; }
  stats.denied++;
  score -= req.priority==='urgent' ? 120 : 18;
  if(req.priority==='urgent'){
    addLog(`${airport().icao}: ${p.id}, emergência não pode aguardar. Prioridade mantida.`, 'danger');
    return;
  }
  req.time = performance.now();
  req.priority = req.type==='landing' || req.type==='lineup' || req.type==='takeoff' ? 'warn' : 'normal';
  addLog(`${airport().icao}: ${p.id}, aguarde. Clearance ainda não autorizado.`, 'warn');
  renderRequests();
}

function handleClearance(p, expectedType){
  const req = requests.find(r=>r.id===p.id && r.type===expectedType);
  if(!req){ addLog(`${p.id}: não há solicitação ${String(expectedType||'').toUpperCase()} pendente.`, 'warn'); stats.denied++; score-=20; return; }
  if(req.type==='landing'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO pouso, pista ocupada por ${runwayOccupiedBy}.`, 'warn'); stats.denied++; score-=50; return; }
    p.status='FINAL'; p.cleared=true; p.targetAlt=0; p.speed=Math.min(p.speed,performanceTargetSpeed?.(p,'FINAL')||165); p.sector='TWR'; removeRequest(p.id,'landing'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, autorizado pouso pista ${runway.name}.`); setReadback(`${p.id} autorizado pouso pista ${runway.name}.`,'ok'); score+=65; setDiagnostic('POUSO AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='pushback'){
    p.status='PUSHBACK'; p.sector='GND'; p.groundTimer=0; removeRequest(p.id,'pushback'); addLog(`${airport().icao} GND: ${p.id}, pushback aprovado.`); setReadback(`${p.id} pushback aprovado.`,'ok'); score+=30; setDiagnostic('PUSHBACK APROVADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='taxi'){
    p.status='TAXI'; p.sector='GND'; p.groundIndex=Math.floor(rand(0,holdingPoints.length)); removeRequest(p.id,'taxi'); addLog(`${airport().icao} GND: ${p.id}, taxeie até ponto de espera pista ${runway.name}.`); setReadback(`${p.id} taxi autorizado para ponto de espera ${runway.name}.`,'ok'); score+=35; setDiagnostic('TÁXI AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='lineup'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} mantenha posição, pista ocupada.`, 'warn'); stats.denied++; score-=25; return; }
    p.status='LINEUP'; p.sector='TWR'; p.cleared=true; removeRequest(p.id,'lineup'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, alinhe e aguarde pista ${runway.name}.`); setReadback(`${p.id} alinhe e aguarde pista ${runway.name}.`,'ok'); score+=40; setDiagnostic('LINE UP AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='takeoff'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO decolagem, pista ocupada.`, 'warn'); stats.denied++; score-=40; return; }
    p.status='DEP'; p.sector='TWR'; p.speed=Math.max(aircraftPerformanceProfile?.(p.type)?.rotationSpeed||130, p.speed||0); p.alt=0; p.targetAlt=160; p.heading=270; removeRequest(p.id,'takeoff'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, autorizado decolagem pista ${runway.name}. Após airborne contate DEP.`); setReadback(`${p.id} autorizado decolagem pista ${runway.name}.`,'ok'); score+=70; setDiagnostic('DECOLAGEM AUTORIZADA','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='emergency'){
    p.status='EMERG'; p.sector='EMERG'; p.cleared=true; p.targetAlt=0; p.speed=performanceTargetSpeed?.(p,'EMERG')||150; removeRequest(p.id,'emergency'); addLog(`${airport().icao}: ${p.id} emergência reconhecida, pista liberada, pouso imediato.`, 'danger'); setReadback(`${p.id} emergência reconhecida, pouso imediato autorizado.`,'danger'); score+=120; setDiagnostic('EMERGÊNCIA PRIORIZADA','danger'); renderRunwayBoard(); return;
  }
  addLog(`${p.id}: solicitação ${req.type} ainda não possui clearance seguro.`, 'warn'); stats.denied++; score-=12; setDiagnostic('COMANDO NÃO APLICÁVEL','warn');
}
function endGame(fail,reason){
  if(!running) return; running=false;
  const final = Math.max(0, Math.round(score - stats.conflicts*45 + stats.landed*120 + stats.departed*100 + stats.requests*10 - stats.denied*35));
  profile.score = Math.max(profile.score||0, final); profile.turns=(profile.turns||0)+1; profile.xp=(profile.xp||0)+Math.round(final/5)+stats.landed*30+stats.departed*20;
  while(profile.xp >= profile.level*1000){ profile.xp -= profile.level*1000; profile.level++; }
  persistProfile('end-game');
  $('#resultTitle').textContent = fail ? 'GAME OVER' : 'FIM DE TURNO';
  $('#resultReason').textContent = reason;
  $('#finalScore').textContent = final.toLocaleString('pt-BR');
  $('#finalStats').innerHTML = `<div><span>Pousos concluídos</span><b>${stats.landed}</b></div><div><span>Decolagens concluídas</span><b>${stats.departed}</b></div><div><span>Solicitações recebidas</span><b>${stats.requests}</b></div><div><span>Clearances negados/incorretos</span><b>${stats.denied}</b></div><div><span>Conflitos detectados</span><b>${stats.conflicts}</b></div><div><span>Comandos emitidos</span><b>${stats.commands}</b></div><div><span>Comandos bloqueados</span><b>${stats.blocked||0}</b></div><div><span>Avisos Safety</span><b>${stats.safetyWarnings||0}</b></div><div><span>Emergências</span><b>${stats.emergencies}</b></div><div><span>MAYDAY resolvidos</span><b>${stats.maydayResolved||0}</b></div><div><span>Combustível mínimo</span><b>${stats.lowFuel||0}</b></div><div><span>Danos/inspeções</span><b>${stats.damaged||0}</b></div><div><span>Aeroporto</span><b>${airport().icao}</b></div><div><span>Objetivos de missão</span><b>${mission?.completed?'concluídos':'parciais'}</b></div><div><span>Build</span><b>${BUILD}</b></div>`;
  go('result');
}

function getSector(p){
  if(!p) return 'TWR';
  if(p.emergency || p.status==='EMERG') return 'EMERG';
  if(p.kind==='arrival') return (p.status==='APP' || p.status==='HOLD') ? 'APP' : 'TWR';
  if(['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT'].includes(p.status)) return 'GND';
  if(['LINEUP','DEP'].includes(p.status)) return 'TWR';
  return 'TWR';
}
function makeAction(label, cmd, cls='dark', sub='', p=null){
  const risk = p ? commandRisk(p,cmd) : (cmd==='noop'?{block:true,level:'warn',msg:'Selecione uma aeronave.'}:{block:false,level:'ok',msg:''});
  const disabled = (cmd==='noop' || risk.block) ? ' disabled aria-disabled="true"' : '';
  const riskClass = risk.level && risk.level!=='ok' ? ' risk-'+risk.level : '';
  const title = risk.msg ? ` title="${risk.msg.replace(/"/g,'&quot;')}"` : '';
  return `<button class="atc-action ${cls}${cmd==='noop'?' disabled':''}${risk.block?' disabled blocked':''}${riskClass}" data-cmd="${cmd}"${disabled}${title}>${label}${sub?`<small>${risk.block?'BLOQUEADO':sub}</small>`:''}</button>`;
}
function contextActions(p){
  if(!p) return [
    ['PRÓXIMO','nextRequest','blue','pedido'],['SELECIONE','noop','dark','aeronave'],['RADAR','noop','dark','toque'],['COMMS','noop','dark','monitore']
  ];
  const req = requests.find(r=>r.id===p.id);
  if(p.emergency || req?.type==='emergency' || p.fuelState==='EMERGENCY' || p.fuelState==='CRITICAL') return [
    ['POUSO IMEDIATO','clearEmergency','red','emergência'],['VETOR FINAL','vectorFinal','amber','prioridade'],['REDUZIR','slow','amber','velocidade'],['DESCER','descend','amber','altitude'],['ESPERA','hold','dark','último caso'],['MAIS','more','dark','opções']
  ];
  if(p.kind==='arrival'){
    if(p.status==='APP' || p.status==='HOLD') return [
      ['VETOR FINAL','vectorFinal','green','interceptar'],['AUT. POUSO','clearLanding','green','se pista livre'],['REDUZIR','slow','blue','separação'],['DESCER','descend','blue','perfil'],['ESPERA','hold','amber','holding'],['MAIS','more','dark','opções']
    ];
    if(p.status==='FINAL') return [
      ['POUSO OK','clearLanding','green','confirmar'],['ARREMETER','goAround','red','go around'],['REDUZIR','slow','blue','final'],['ESPERA','hold','amber','instruir'],['HDG -10','left','dark','vetor'],['MAIS','more','dark','opções']
    ];
  }
  if(['PARKED','PUSHBACK','READY_TAXI'].includes(p.status)) return [
    ['PUSHBACK','approvePushback','blue','aprovar'],['TÁXI','approveTaxi','blue','para pista'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','solo'],['HDG +10','right','dark','solo'],['MAIS','more','dark','opções']
  ];
  if(['TAXI','HOLD_SHORT'].includes(p.status)) return [
    ['HOLD SHORT','holdShort','amber','antes pista'],['ALINHAR','lineUp','green','line up'],['MANTER','deny','amber','posição'],['TÁXI OK','approveTaxi','blue','prosseguir'],['EMERGÊNCIA','emergency','red','prioridade'],['MAIS','more','dark','opções']
  ];
  if(p.status==='LINEUP' || p.status==='DEP') return [
    ['DECOLAR','clearTakeoff','green','takeoff'],['MANTER','deny','amber','aguarde'],['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SUBIR','climb','blue','saída'],['MAIS','more','dark','opções']
  ];
  return [['POUSO','clearLanding','green','landing'],['ESPERA','hold','amber','hold'],['NEGAR','deny','red','aguarde'],['MAIS','more','dark','opções']];
}
function moreActions(p){
  return [
    ['HDG -10','left','dark','vetor'],['HDG +10','right','dark','vetor'],['SPD -10','slow','blue','reduzir'],['SPD +10','fast','blue','aumentar'],['SUBIR','climb','blue','altitude'],['DESCER','descend','blue','altitude'],['HOLD','hold','amber','espera'],['HOLD SHORT','holdShort','amber','pista'],['VETOR FINAL','vectorFinal','green','app'],['POUSO','clearLanding','green','landing'],['PUSHBACK','approvePushback','blue','solo'],['TÁXI','approveTaxi','blue','solo'],['ALINHAR','lineUp','green','pista'],['DECOLAR','clearTakeoff','green','takeoff'],['NEGAR','deny','red','aguarde'],['EMERGÊNCIA','emergency','red','mayday']
  ];
}
function renderActionGrid(){
  const p=aircraft.find(x=>x.id===selected);
  const grid=$('#actionGrid');
  if(grid){ grid.innerHTML=contextActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3],p)).join(''); }
  const more=$('#moreActionGrid');
  if(more){ more.innerHTML=moreActions(p).map(a=>makeAction(a[0],a[1],a[2],a[3],p)).join(''); }
  if($('#sectorIndicator')) $('#sectorIndicator').textContent = getSector(p);
  if($('#sectorHelp')) $('#sectorHelp').textContent = p ? `${p.id} selecionado` : 'Selecione uma aeronave';
  try{ updateSafetyState(); renderMissionBoard(); renderHandoffAdvisor(); }catch(e){ safeLogError(e,'render-action-safety'); }
}
function setTrafficTab(id){
  $$('.traffic-tab').forEach(b=>b.classList.toggle('active', b.dataset.trafficTab===id));
  $$('.traffic-list').forEach(l=>l.classList.toggle('active', l.id===id));
  const names={arrivals:'ENTRADAS',departures:'SAÍDAS',groundList:'SOLO'};
  if($('#trafficTitle')) $('#trafficTitle').textContent=names[id]||'TRÁFEGO';
  if($('#trafficCount')) $('#trafficCount').textContent=($('#'+id)?.querySelectorAll('[data-select]').length||0);
}
function setDock(id){
  $$('.dock-tab').forEach(b=>b.classList.toggle('active', b.dataset.dock===id));
  $$('.dock-body').forEach(b=>b.classList.toggle('active', b.id==='dock-'+id));
}

/* ===== MODULE 16: 10-events-selftest-bootstrap (10-events-selftest-bootstrap.js) ===== */
/* @skyward-module 10-events-selftest-bootstrap
 * Desktop events, filters, safe-mode controls and self-test bootstrap.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('10-events-selftest-bootstrap');
document.addEventListener('click',(e)=>{
  const t=e.target.closest && e.target.closest('[data-traffic-tab], [data-dock], #moreCommandsBtn, #closeMoreCommands, .command-sheet, [data-cmd]');
  if(!t) return;
  if(t.dataset.trafficTab){ setTrafficTab(t.dataset.trafficTab); return; }
  if(t.dataset.dock){ setDock(t.dataset.dock); return; }
  if(t.id==='moreCommandsBtn'){ $('#moreCommandSheet')?.classList.add('open'); renderActionGrid(); return; }
  if(t.id==='closeMoreCommands' || t.classList.contains('command-sheet')){ $('#moreCommandSheet')?.classList.remove('open'); return; }
  if(t.dataset.cmd){
    if(t.dataset.cmd==='more'){ $('#moreCommandSheet')?.classList.add('open'); renderActionGrid(); return; }
    if(t.dataset.cmd==='noop') return;
    command(t.dataset.cmd);
    $('#moreCommandSheet')?.classList.remove('open');
  }
});


document.querySelector('#nextRequestBtn')?.addEventListener('click',()=>selectNextRequest());

document.addEventListener('change',(e)=>{
  const t=e.target;
  if(!t || !t.matches || !t.matches('[data-filter]')) return;
  radarFilters[t.dataset.filter]=!!t.checked;
  addLog('Filtro radar: '+t.dataset.filter+' '+(t.checked?'ON':'OFF'));
});

document.querySelector('#safeRestoreBtn')?.addEventListener('click',()=>{
  if(!restoreGoodState()){
    setDiagnostic('SNAPSHOT INDISPONÍVEL','warn');
    document.querySelector('#safeErrorText').textContent='Nenhum snapshot compatível foi encontrado. Inicie um novo turno.';
  }
});
document.querySelector('#safeRestartBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('game'); });
document.querySelector('#safeLobbyBtn')?.addEventListener('click',()=>{ document.querySelector('#crashShield')?.classList.remove('open'); running=false; go('lobby'); });
function selfTest(){
  const report={ build:BUILD, ok:true, checks:[], errors:[] };
  const check=(name,fn)=>{ try{ const ok=!!fn(); report.checks.push({name,ok}); if(!ok) report.ok=false; }catch(e){ report.ok=false; report.errors.push({name,msg:String(e.message||e)}); } };
  check('required dom',()=>['#app','#radar','#actionGrid','#requests','#freqCall','#readbackLine','#log','#selectedBox','#nextRequestBtn','#opsDiagnostic','#moreCommandSheet','#safetyAdvisor','#safetyScore','#runwayBoard','#missionBoard','#handoffAdvisor','#radarModeBadge','#weatherBoard'].every(s=>document.querySelector(s))); 
  check('conflict predictor',()=>Array.isArray(predictConflicts()));
  check('safety advisor',()=>commandRisk({id:'TST',kind:'arrival',status:'APP',alt:50,speed:180,x:50,y:30},'vectorFinal').level==='ok');
  check('context action generator',()=>Array.isArray(contextActions(null)) && contextActions(null).some(a=>a[1]==='nextRequest'));
  check('priority sorter',()=>Number.isFinite(requestPriorityScore({type:'landing',priority:'warn',time:performance.now()})));
  check('airports data fallback',()=>Array.isArray(airports));
  check('canvas context',()=>!!ctx);
  check('runway board',()=>{ renderRunwayBoard(); return !!document.querySelector('#runwayBoard'); });
  check('professional radar layer',()=>{ drawProfessionalProcedures(800,420); drawRadarTelemetry(800,420); drawWeatherOverlay(800,420); return !!PROCEDURE_LAYER && Array.isArray(PROCEDURE_LAYER.routes); });
  check('weather ops',()=>{ updateWeatherOps(1); renderWeatherBoard();
    renderFuelBoard(); return !!WX_STATE.condition && !!document.querySelector('#weatherBoard'); });
  check('mission board',()=>{ mission=buildMission(); renderMissionBoard(); return !!document.querySelector('#missionBoard')?.innerHTML; });
  check('handoff advisor',()=>{ renderHandoffAdvisor(); return !!document.querySelector('#handoffAdvisor'); });
  check('readback line',()=>{ setReadback('teste de transmissão','ok'); return document.querySelector('#readbackLine')?.textContent.includes('teste'); });
  check('command block enforcement',()=>commandRisk({id:'TST',kind:'departure',status:'LINEUP',alt:0,speed:0,x:30,y:50},'vectorFinal').block===true);
  check('safe storage',()=>safeStorageSet('skywardSelfTest',{build:BUILD,t:Date.now()}));
  check('build metadata',()=>document.querySelectorAll('[data-build]').length>0 && BUILD_METADATA_VALID);
  check('explicit clearances',()=>Object.keys(CLEARANCE_COMMANDS).length===6 && !contextActions({id:'TST',kind:'departure',status:'PARKED'}).some(a=>a[1]==='clear'));
  check('snapshot schema',()=>isValidSnapshot({schema:BUILD_INFO.schema,saveId:'self-test-save',sessionId:'self-test-session',build:BUILD,reason:'self-test',at:Date.now(),elapsed:0,selected:null,selectedRequest:null,runwayOccupiedBy:null,aircraft:[],requests:[],score:0,stats:normalizeSnapshotStats({}),mission:null,profileAirport:profile.airport,profile:CONTRACTS.sanitizeProfile(profile,profile)}));
  check('release metadata source',()=>!!window.SKYWARD_BUILD_INFO && window.SKYWARD_BUILD_INFO.build===BUILD);
  check('modular runtime registry',()=>window.SKYWARD_ARCHITECTURE?.generation>=8 && Array.isArray(window.SKYWARD_MODULES) && window.SKYWARD_MODULES.length>=17);
  check('typescript contracts available',()=>CONTRACTS?.contractSchema===BUILD_INFO.contractSchema && typeof CONTRACTS.validateAircraft==='function');
  check('typescript build contract',()=>BUILD_METADATA_RESULT.ok===true);
  check('typescript airport contract',()=>CONTRACTS.validateAirports(airports,'self-test-airports').ok);
  check('typescript profile contract',()=>CONTRACTS.validateProfile(profile,'self-test-profile').ok);
  check('typescript aircraft contract',()=>aircraft.every(p=>CONTRACTS.validateAircraft(p,'self-test-aircraft').ok));
  check('typescript requests contract',()=>CONTRACTS.validateRequests(requests,'self-test-requests').ok);
  check('quality kernel available',()=>QUALITY?.schema===1 && Object.isFrozen(QUALITY) && QUALITY.normalizeHeading(-10)===350);
  check('test schema metadata',()=>Number(BUILD_INFO.testSchema)>=2);
  check('qa bridge available',()=>window.SKYWARD_TEST_API?.testSchema===BUILD_INFO.testSchema && Object.isFrozen(window.SKYWARD_TEST_API));
  check('transactional save vault',()=>saveVault()?.vaultSchema===BUILD_INFO.saveVaultSchema && saveVault()?.sha256('abc')==='ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  check('pwa runtime available',()=>window.SKYWARD_PWA?.pwaSchema===BUILD_INFO.pwaSchema && window.SKYWARD_PWA?.cacheSchema===BUILD_INFO.cacheSchema && Object.isFrozen(window.SKYWARD_PWA));
  check('pwa install manifest linked',()=>document.querySelector('link[rel="manifest"]')?.getAttribute('href')==='manifest.webmanifest');
  check('mobile UX schema and API',()=>window.SKYWARD_MOBILE_UX?.uxSchema===BUILD_INFO.uxSchema && Object.isFrozen(window.SKYWARD_MOBILE_UX));
  check('mobile gesture classifier',()=>window.SKYWARD_MOBILE_UX?.classifyGesture({x:2,y:100},{x:120,y:104},844,390)==='open-requests');
  check('mobile touch target',()=>window.SKYWARD_MOBILE_UX?.touchTargetPx('mobile-landscape')>=44);
  check('desktop workspace schema and API',()=>window.SKYWARD_DESKTOP_WORKSPACE?.schema===BUILD_INFO.desktopSchema && Object.isFrozen(window.SKYWARD_DESKTOP_WORKSPACE));
  check('desktop shortcut map',()=>window.SKYWARD_DESKTOP_WORKSPACE?.shortcutAction('KeyN',false)==='next-request' && window.SKYWARD_DESKTOP_WORKSPACE?.shortcutAction('KeyA',true)==='analysis');
  check('profile save contract',()=>CONTRACTS.validateProfileSave(profileSavePayload('self-test'),'self-test-profile-save').ok);
  check('snapshot migrator v2 to v3',()=>migrateSnapshotPayload({schema:2,build:'LEGACY',reason:'test',at:1,elapsed:0,selected:null,selectedRequest:null,runwayOccupiedBy:null,aircraft:[],requests:[],score:0,stats:{},mission:null,profileAirport:profile.airport}).ok);
  check('modular runtime sealed',()=>Object.isFrozen(window.SKYWARD_MODULES) && Object.isFrozen(window.SKYWARD_ARCHITECTURE));
  check('unique callsign helper',()=>{ const existing=aircraft; aircraft=[{id:'TST1000'}]; const id=uniqueCallsign('TST1000'); aircraft=existing; return id!=='TST1000'; });
  check('replay schema and API',()=>window.SKYWARD_REPLAY?.schema===BUILD_INFO.replaySchema && Object.isFrozen(window.SKYWARD_REPLAY));
  check('deterministic replay self check',()=>window.SKYWARD_REPLAY?.selfCheck?.().ok===true);
  check('deterministic replay checksum',()=>window.SKYWARD_REPLAY?.checksum?.({a:1})===window.SKYWARD_REPLAY?.checksum?.({a:1}));
  check('aircraft performance schema and API',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.schema===Number(BUILD_INFO.aircraftPerformanceSchema||1) && Object.isFrozen(window.SKYWARD_AIRCRAFT_PERFORMANCE));
  check('aircraft performance self check',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.selfCheck?.().ok===true);
  check('aircraft performance envelope',()=>window.SKYWARD_AIRCRAFT_PERFORMANCE?.telemetry?.({type:'B752',status:'FINAL',speed:160,alt:20,targetAlt:0}).wake==='H');
  window.SKYWARD_SELF_TEST = report;
  return report;
}
setTimeout(()=>{ try{ selfTest(); }catch(e){ safeLogError(e,'self-test'); } },500);

applyBuildInfo();
if(!BUILD_METADATA_VALID) setTimeout(()=>showSafeMode(new Error('Metadados de build ausentes ou inválidos. Execute o pipeline de release.')),0);
loadProfile(); loadAirports(); resize();

/* ===== MODULE 17: 11-mobile-runtime (11-mobile-runtime.js) ===== */
/* @skyward-module 11-mobile-runtime
 * Adaptive mobile UX, edge gestures, touch-safe dock, haptics and viewport modes.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('11-mobile-runtime');
const MOBILE_UX_SCHEMA = Number(BUILD_INFO.uxSchema || 1);
const MOBILE_PREFS_KEY = `skywardMobilePrefs_v${MOBILE_UX_SCHEMA}`;
const MOBILE_DEFAULT_PREFS = Object.freeze({ haptics:true, gestureCoach:true, density:'comfortable', lastTab:null });
let mobilePrefs = {...MOBILE_DEFAULT_PREFS, ...(safeStorageGet(MOBILE_PREFS_KEY,{}) || {})};
let mobileRenderSignature = '';
let mobileGestureState = null;
let mobileLongPressTimer = 0;
let mobileLastRadarTap = 0;
let mobileToastTimer = 0;

function mobileEsc(v){ return String(v??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function mobileViewportMode(width=innerWidth,height=innerHeight){
  if(width<=980 && width>height) return 'mobile-landscape';
  if(width<=980) return 'mobile-portrait';
  if(width<=1180) return 'tablet';
  return 'desktop';
}
function mobileTouchTargetPx(mode=mobileViewportMode()){
  return mode==='mobile-landscape' ? 46 : mode==='mobile-portrait' ? 48 : mode==='tablet' ? 44 : 40;
}
function classifyMobileGesture(start,end,width=innerWidth,height=innerHeight){
  if(!start||!end) return 'none';
  const dx=end.x-start.x, dy=end.y-start.y, ax=Math.abs(dx), ay=Math.abs(dy);
  if(Math.max(ax,ay)<42) return 'tap';
  if(start.x<=Math.max(28,width*.045) && dx>70 && ax>ay*1.2) return 'open-requests';
  if(start.x>=width-Math.max(28,width*.045) && dx<-70 && ax>ay*1.2) return 'open-actions';
  if(dy>58 && ay>ax*1.15) return 'close-panel';
  if(ax>70 && ax>ay*1.25) return dx>0?'cycle-previous':'cycle-next';
  return 'none';
}
function saveMobilePrefs(){ mobilePrefs={...MOBILE_DEFAULT_PREFS,...mobilePrefs}; safeStorageSet(MOBILE_PREFS_KEY,mobilePrefs); applyMobilePreferences(); }
function applyMobilePreferences(){
  const root=document.documentElement;
  root.dataset.viewportMode=mobileViewportMode();
  root.dataset.mobileDensity=mobilePrefs.density;
  root.style.setProperty('--mobile-touch-target',`${mobileTouchTargetPx()}px`);
}
function mobileHaptic(pattern=12){
  try{ if(mobilePrefs.haptics && typeof navigator.vibrate==='function') navigator.vibrate(pattern); }catch(_e){}
}
function showMobileToast(text,level='ok'){
  const el=document.getElementById('mobileToast'); if(!el) return;
  el.textContent=text; el.className=`mobile-toast show ${level}`;
  clearTimeout(mobileToastTimer); mobileToastTimer=setTimeout(()=>el.classList.remove('show'),1500);
}
function mobileCommandButton(a,p){
  const risk = p ? commandRisk(p,a[1]) : {block:a[1]!=='nextRequest',level:'warn',msg:'Selecione aeronave'};
  const disabled = risk.block || a[1]==='noop';
  const label=`${a[0]}${disabled?' bloqueado':''}`;
  return `<button class="mobile-cmd ${a[2]||'dark'} ${disabled?'blocked':''}" data-cmd="${mobileEsc(a[1])}" aria-label="${mobileEsc(label)}" ${disabled?'disabled aria-disabled="true"':''}>
    <span>${mobileEsc(a[0])}</span><small>${disabled?'BLOQUEADO':mobileEsc(a[3]||'')}</small>
  </button>`;
}
function mobilePriority(p){
  const req=requests.find(r=>r.id===p.id);
  return (p.emergency?10000:0)+(req?requestPriorityScore(req)*100:0)+(p.risk||0)*50+(p.fuelState==='EMERGENCY'?5000:p.fuelState==='CRITICAL'?2500:0);
}
function mobileAircraftRows(){
  return [...aircraft].sort((a,b)=>mobilePriority(b)-mobilePriority(a)).map(p=>{
    const req=requests.find(r=>r.id===p.id); const isSelected=p.id===selected;
    return `<button class="mobile-aircraft ${isSelected?'selected':''} ${p.emergency?'urgent':p.risk>.4?'warn':''}" data-mobile-aircraft="${mobileEsc(p.id)}">
      <span><b>${mobileEsc(p.id)}</b><em>${mobileEsc(p.type)}</em></span>
      <span>${mobileEsc(p.status)} • FL${Math.round(p.alt)} • ${Math.round(p.speed)}kt</span>
      <small>${req?mobileEsc(req.text):`FUEL ${Math.round(p.fuel??0)}% • HDG ${Math.round(p.heading)}°`}</small>
    </button>`;
  }).join('') || '<div class="mobile-info-line">Nenhum tráfego ativo.</div>';
}
function mobileSafetyHtml(){
  const level=safetyState?.level||'ok';
  const msgs=(safetyState?.messages||['Operação normal']).slice(0,5).map(m=>`<div class="mobile-info-line ${level}">${mobileEsc(m)}</div>`).join('');
  return `<div class="mobile-safety-summary ${level}"><b>SAFETY ${Math.round(safetyState?.score??100)}%</b><span>${runwayOccupiedBy?`RWY ocupada: ${mobileEsc(runwayOccupiedBy)}`:'RWY livre'}</span></div>${msgs}
    <div class="mobile-info-line">${mobileEsc(emergencyDirector?.message||'Sem emergência ativa.')}</div>
    <div class="mobile-ux-settings">
      <button type="button" data-mobile-setting="haptics" aria-pressed="${mobilePrefs.haptics}">HÁPTICO ${mobilePrefs.haptics?'ON':'OFF'}</button>
      <button type="button" data-mobile-setting="density" aria-pressed="${mobilePrefs.density==='comfortable'}">TOQUE ${mobilePrefs.density==='comfortable'?'CONFORTÁVEL':'COMPACTO'}</button>
      <button type="button" data-mobile-setting="coach">GUIA DE GESTOS</button>
    </div>`;
}
function renderMobileGameplay(force=false){
  try{
    const layer=document.getElementById('mobileAtcLayer');
    const inGame=document.getElementById('game')?.classList.contains('active');
    if(!layer || !inGame){ document.body.classList.remove('game-active'); return; }
    document.body.classList.add('game-active'); applyMobilePreferences();
    const p=aircraft.find(x=>x.id===selected);
    const requestUrgent=requests.filter(r=>r.priority==='urgent').length;
    const safetyLevel=safetyState?.level||'ok';
    const signature=[selected,p?.status,p?.fuel,p?.alt,p?.speed,requests.length,requestUrgent,aircraft.length,safetyState?.score,safetyLevel,runwayOccupiedBy,emergencyDirector?.target,mobileActiveTab,mobilePrefs.haptics,mobilePrefs.density,Math.floor(performance.now()/1000)].join('|');
    if(!force && signature===mobileRenderSignature) return;
    mobileRenderSignature=signature;

    const mini=document.getElementById('mobileMiniStatus');
    if(mini){
      mini.textContent=`${airport().icao} • RWY ${runway.name} • ${runwayOccupiedBy?'OCUPADA '+runwayOccupiedBy:'LIVRE'} • SAFETY ${Math.round(safetyState?.score??100)}%${emergencyDirector?.active?' • MAYDAY '+emergencyDirector.target:''}`;
      mini.classList.toggle('warn',safetyLevel==='warn'); mini.classList.toggle('danger',safetyLevel==='danger');
    }
    const chip=document.getElementById('mobileSelectedChip');
    if(chip){
      chip.hidden=!p;
      document.getElementById('mobileSelectedChipId').textContent=p?.id||'---';
      document.getElementById('mobileSelectedChipData').textContent=p?`${p.status} • FL${Math.round(p.alt)} • ${Math.round(p.speed)}KT • F${Math.round(p.fuel??0)}%`:'SEM SELEÇÃO';
      chip.classList.toggle('danger',Boolean(p?.emergency||p?.fuelState==='EMERGENCY'));
    }
    const title=document.getElementById('mobileSelectedTitle');
    if(title) title.textContent=p?`${p.id} • ${p.status} • FUEL ${Math.round(p.fuel??0)}%`:'Nenhuma aeronave';
    const primary=document.getElementById('mobilePrimaryActions');
    if(primary) primary.innerHTML=contextActions(p).slice(0,6).map(a=>mobileCommandButton(a,p)).join('');
    const more=document.getElementById('mobileMoreActions');
    if(more) more.innerHTML=moreActions(p).map(a=>mobileCommandButton(a,p)).join('');
    const reqBadge=document.getElementById('mobileRequestsBadge');
    if(reqBadge){ reqBadge.textContent=requests.length>99?'99+':String(requests.length); reqBadge.hidden=requests.length===0; reqBadge.classList.toggle('urgent',requestUrgent>0); }
    const trafficBadge=document.getElementById('mobileTrafficBadge'); if(trafficBadge) trafficBadge.textContent=String(aircraft.length);
    const safetyBadge=document.getElementById('mobileSafetyBadge'); if(safetyBadge){ safetyBadge.hidden=safetyLevel==='ok'; safetyBadge.classList.toggle('urgent',safetyLevel==='danger'); }
    if(mobileActiveTab) renderMobilePanel(mobileActiveTab); else closeMobilePanels(false);
  }catch(e){ safeLogError(e,'mobile-render'); }
}
function closeMobilePanels(clearState=true){
  document.getElementById('mobilePanel')?.classList.remove('active');
  document.getElementById('mobileActionSheet')?.classList.remove('active');
  document.getElementById('mobilePanel')?.setAttribute('aria-hidden','true');
  document.getElementById('mobileActionSheet')?.setAttribute('aria-hidden','true');
  document.querySelectorAll('.mobile-nav').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-expanded','false'); });
  if(clearState) mobileActiveTab=null;
}
function setMobileTab(tab,options={}){
  const next=(mobileActiveTab===tab && options.toggle!==false)?null:(tab||null);
  mobileActiveTab=next; mobilePrefs.lastTab=next; saveMobilePrefs();
  document.querySelectorAll('.mobile-nav').forEach(b=>{ const active=b.dataset.mobileTab===next; b.classList.toggle('active',active); b.setAttribute('aria-expanded',String(active)); });
  if(next){ mobileHaptic(10); renderMobilePanel(next); } else closeMobilePanels(false);
}
function renderMobilePanel(tab){
  try{
    const title=document.getElementById('mobilePanelTitle'), body=document.getElementById('mobilePanelBody'), panel=document.getElementById('mobilePanel'), actions=document.getElementById('mobileActionSheet');
    if(!body||!panel||!actions) return;
    const actionMode=tab==='actions';
    panel.classList.toggle('active',Boolean(tab&&!actionMode)); actions.classList.toggle('active',actionMode);
    panel.setAttribute('aria-hidden',String(!tab||actionMode)); actions.setAttribute('aria-hidden',String(!actionMode));
    if(!tab) return;
    if(title) title.textContent=tab==='comms'?'COMUNICAÇÕES':tab==='safety'?'SAFETY / OPS':tab==='traffic'?'TRÁFEGO ATIVO':'PEDIDOS ATC';
    if(tab==='requests'){
      const ordered=[...requests].sort((a,b)=>requestPriorityScore(b)-requestPriorityScore(a));
      body.innerHTML=ordered.map(r=>{ const age=Math.max(0,Math.floor((performance.now()-r.time)/1000)); return `<button class="mobile-request ${r.priority==='urgent'?'urgent':r.priority==='warn'?'warn':''}" data-mobile-req="${mobileEsc(r.id)}|${mobileEsc(r.type)}"><b>${mobileEsc(r.id)}</b><span>${mobileEsc(r.text)} • ${mobileEsc(r.type.toUpperCase())}</span><em>${age}s aguardando</em></button>`; }).join('')||'<div class="mobile-info-line ok">Nenhuma solicitação pendente.</div>';
    }else if(tab==='traffic') body.innerHTML=mobileAircraftRows();
    else if(tab==='comms') body.innerHTML=logLines.slice(0,16).map(l=>`<div class="mobile-info-line ${l.type||''}"><b>${mobileEsc(l.t)}</b> ${mobileEsc(l.msg)}</div>`).join('')||'<div class="mobile-info-line">Sem comunicações.</div>';
    else if(tab==='safety') body.innerHTML=mobileSafetyHtml();
  }catch(e){ safeLogError(e,'mobile-panel'); }
}
function selectMobileAircraft(id,openActions=false){
  const p=aircraft.find(x=>x.id===id); if(!p) return false;
  selected=p.id; selectedRequest=requests.find(r=>r.id===p.id)||null;
  renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
  mobileHaptic(14); showMobileToast(`${p.id} selecionado`,'ok');
  renderMobileGameplay(true);
  if(openActions) setMobileTab('actions',{toggle:false});
  return true;
}
function cycleMobileAircraft(step=1){
  if(!aircraft.length) return false;
  const list=[...aircraft].sort((a,b)=>mobilePriority(b)-mobilePriority(a)||a.id.localeCompare(b.id));
  let index=list.findIndex(p=>p.id===selected); if(index<0) index=step>0?-1:0;
  index=(index+step+list.length)%list.length;
  return selectMobileAircraft(list[index].id,false);
}
function handleMobileGesture(kind){
  if(kind==='open-requests'){ setMobileTab('requests',{toggle:false}); showMobileToast('Pedidos abertos'); return true; }
  if(kind==='open-actions'){ if(selected){ setMobileTab('actions',{toggle:false}); showMobileToast('Comandos abertos'); } else { setMobileTab('traffic',{toggle:false}); showMobileToast('Selecione uma aeronave','warn'); } return true; }
  if(kind==='close-panel'){ closeMobilePanels(); mobileHaptic(8); return true; }
  if(kind==='cycle-next') return cycleMobileAircraft(1);
  if(kind==='cycle-previous') return cycleMobileAircraft(-1);
  return false;
}
function showGestureCoach(force=false){
  if(!force && !mobilePrefs.gestureCoach) return;
  const coach=document.getElementById('mobileGestureCoach'); if(!coach) return;
  coach.hidden=false; coach.classList.add('show');
}
function hideGestureCoach(permanent=true){
  const coach=document.getElementById('mobileGestureCoach'); coach?.classList.remove('show'); if(coach) coach.hidden=true;
  if(permanent){ mobilePrefs.gestureCoach=false; saveMobilePrefs(); }
}
function mobilePointerPoint(e){ return {x:Number(e.clientX||0),y:Number(e.clientY||0),t:performance.now()}; }
function initMobileGestures(){
  const radar=canvas, layer=document.getElementById('mobileAtcLayer'); if(!radar||!layer) return;
  const down=e=>{
    if(mobileViewportMode()!=='mobile-landscape'||e.pointerType==='mouse') return;
    mobileGestureState={...mobilePointerPoint(e),pointerId:e.pointerId,moved:false,target:e.currentTarget};
    clearTimeout(mobileLongPressTimer);
    if(e.currentTarget===radar) mobileLongPressTimer=setTimeout(()=>{ if(selected&&!mobileGestureState?.moved){ setMobileTab('actions',{toggle:false}); mobileHaptic([18,30,18]); showMobileToast('Comandos rápidos'); } },520);
  };
  const move=e=>{ if(!mobileGestureState||mobileGestureState.pointerId!==e.pointerId) return; if(Math.hypot(e.clientX-mobileGestureState.x,e.clientY-mobileGestureState.y)>14){mobileGestureState.moved=true;clearTimeout(mobileLongPressTimer);} };
  const up=e=>{
    if(!mobileGestureState||mobileGestureState.pointerId!==e.pointerId) return;
    clearTimeout(mobileLongPressTimer); const start=mobileGestureState,end=mobilePointerPoint(e); mobileGestureState=null;
    let kind=classifyMobileGesture(start,end,innerWidth,innerHeight);
    if(start.target?.matches?.('.mobile-panel,.mobile-action-sheet') && kind!=='close-panel') kind='none';
    if(kind!=='tap' && kind!=='none') handleMobileGesture(kind);
    else if(e.currentTarget===radar){ const now=performance.now(); if(now-mobileLastRadarTap<330&&selected){ setMobileTab('actions',{toggle:false}); mobileHaptic(12); } mobileLastRadarTap=now; }
  };
  [radar].forEach(el=>{el.addEventListener('pointerdown',down,{passive:true});el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerup',up,{passive:true});el.addEventListener('pointercancel',()=>{clearTimeout(mobileLongPressTimer);mobileGestureState=null;},{passive:true});});
  document.querySelectorAll('.mobile-panel,.mobile-action-sheet').forEach(el=>{el.addEventListener('pointerdown',down,{passive:true});el.addEventListener('pointermove',move,{passive:true});el.addEventListener('pointerup',up,{passive:true});});
}
function initMobileDockV2(){
  try{
    applyMobilePreferences();
    document.querySelectorAll('.mobile-nav').forEach(btn=>btn.addEventListener('click',()=>{ if(document.body.classList.contains('game-active')) setMobileTab(btn.dataset.mobileTab); }));
    document.getElementById('mobilePanelClose')?.addEventListener('click',()=>closeMobilePanels());
    document.getElementById('mobileDeselect')?.addEventListener('click',()=>{ selected=null; selectedRequest=null; closeMobilePanels(); renderSelected(); renderMobileGameplay(true); mobileHaptic(8); });
    document.getElementById('mobileMoreToggle')?.addEventListener('click',e=>{ const box=document.getElementById('mobileMoreActions'); const open=box?.classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded',String(Boolean(open))); mobileHaptic(8); });
    document.getElementById('mobileMiniStatus')?.addEventListener('click',()=>setMobileTab('safety'));
    document.getElementById('mobileSelectedChip')?.addEventListener('click',()=>selected&&setMobileTab('actions'));
    document.getElementById('mobileGestureCoachClose')?.addEventListener('click',()=>hideGestureCoach(true));
    document.addEventListener('click',e=>{
      const req=e.target.closest?.('[data-mobile-req]');
      if(req){ const [id,type]=req.dataset.mobileReq.split('|'); selected=id; selectedRequest=requests.find(r=>r.id===id&&r.type===type)||null; renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();mobileHaptic(14);setMobileTab('actions',{toggle:false});renderMobileGameplay(true);return; }
      const traffic=e.target.closest?.('[data-mobile-aircraft]'); if(traffic){selectMobileAircraft(traffic.dataset.mobileAircraft,true);return;}
      const setting=e.target.closest?.('[data-mobile-setting]');
      if(setting){
        if(setting.dataset.mobileSetting==='haptics') mobilePrefs.haptics=!mobilePrefs.haptics;
        if(setting.dataset.mobileSetting==='density') mobilePrefs.density=mobilePrefs.density==='comfortable'?'compact':'comfortable';
        if(setting.dataset.mobileSetting==='coach'){mobilePrefs.gestureCoach=true;showGestureCoach(true);}
        saveMobilePrefs();renderMobileGameplay(true);mobileHaptic(10);return;
      }
      const cmd=e.target.closest?.('.mobile-cmd[data-cmd]'); if(cmd&&!cmd.disabled){mobileHaptic(cmd.classList.contains('red')?[20,30,20]:12);showMobileToast(cmd.querySelector('span')?.textContent||'Comando enviado',cmd.classList.contains('red')?'danger':'ok');}
    });
    window.addEventListener('resize',()=>{applyMobilePreferences();resize();renderMobileGameplay(true);},{passive:true});
    window.addEventListener('orientationchange',()=>setTimeout(()=>{applyMobilePreferences();resize();renderMobileGameplay(true);},180),{passive:true});
    initMobileGestures();
    setTimeout(()=>{if(mobileViewportMode()==='mobile-landscape'&&document.body.classList.contains('game-active'))showGestureCoach(false);},1000);
  }catch(e){ safeLogError(e,'mobile-init'); }
}
window.SKYWARD_MOBILE_UX=Object.freeze({
  uxSchema:MOBILE_UX_SCHEMA,
  classifyGesture:classifyMobileGesture,
  viewportMode:mobileViewportMode,
  touchTargetPx:mobileTouchTargetPx,
  getPreferences:()=>Object.freeze({...mobilePrefs}),
  openTab:tab=>setMobileTab(tab,{toggle:false}),
  close:()=>closeMobilePanels(),
  cycleAircraft:cycleMobileAircraft,
  render:()=>renderMobileGameplay(true)
});
window.addEventListener('load',()=>setTimeout(initMobileDockV2,500));

/* ===== MODULE 18: desktop-workspace (12-desktop-workspace.js) ===== */
/* @skyward-module 12-desktop-workspace
 * Professional tablet/desktop workspace, panel density, persistence and keyboard shortcuts.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('12-desktop-workspace');
const DESKTOP_WORKSPACE_SCHEMA=1;
const DESKTOP_WORKSPACE_KEY=`skywardDesktopWorkspace_v${DESKTOP_WORKSPACE_SCHEMA}`;
function desktopClamp(value,min,max){ return Math.max(min,Math.min(max,Number(value)||0)); }
function desktopViewportMode(width=innerWidth){ const w=Number(width)||0; return w>=1181?'desktop':w>=981?'tablet':'compact'; }
function desktopShortcutAction(code,shift=false){
  const map={KeyW:'balanced',KeyR:'radar',BracketLeft:'traffic',BracketRight:'ops',KeyB:'bottom',KeyN:'next-request',ArrowLeft:'previous-aircraft',ArrowRight:'next-aircraft',KeyC:'commands',KeyP:'pause',KeyA:'arrivals',KeyD:'departures',KeyG:'ground',Digit1:'dock-comms',Digit2:'dock-selected',Digit3:'dock-help',Digit4:'dock-filters',Digit5:'dock-safety',Escape:'escape',Slash:'help'};
  if(code==='KeyA'&&shift) return 'analysis';
  return map[code]||null;
}
function defaultDesktopPrefs(){return {schema:DESKTOP_WORKSPACE_SCHEMA,mode:'balanced',hideTraffic:false,hideOps:false,hideBottom:false,compact:false,leftWidth:235,rightWidth:330,bottomHeight:126};}
function sanitizeDesktopPrefs(value){
  const base=defaultDesktopPrefs(),src=value&&typeof value==='object'?value:{};
  const mode=['balanced','radar','analysis'].includes(src.mode)?src.mode:'balanced';
  return {...base,...src,schema:DESKTOP_WORKSPACE_SCHEMA,mode,hideTraffic:!!src.hideTraffic,hideOps:!!src.hideOps,hideBottom:!!src.hideBottom,compact:!!src.compact,leftWidth:desktopClamp(src.leftWidth||base.leftWidth,175,340),rightWidth:desktopClamp(src.rightWidth||base.rightWidth,250,460),bottomHeight:desktopClamp(src.bottomHeight||base.bottomHeight,88,220)};
}
let desktopWorkspacePrefs=sanitizeDesktopPrefs(safeStorageGet(DESKTOP_WORKSPACE_KEY,defaultDesktopPrefs()));
let desktopWorkspaceLastSelected='';
function saveDesktopWorkspacePrefs(){safeStorageSet(DESKTOP_WORKSPACE_KEY,desktopWorkspacePrefs);}
function desktopWorkspaceLabel(){return desktopWorkspacePrefs.mode==='radar'?'Foco Radar':desktopWorkspacePrefs.mode==='analysis'?'Análise ampliada':'Balanceado';}
function applyDesktopWorkspace(){
  const body=document.body,scene=document.querySelector('.atc-scene');if(!body||!scene)return;
  body.classList.toggle('workspace-mode-radar',desktopWorkspacePrefs.mode==='radar');body.classList.toggle('workspace-mode-analysis',desktopWorkspacePrefs.mode==='analysis');
  body.classList.toggle('workspace-hide-traffic',desktopWorkspacePrefs.hideTraffic);body.classList.toggle('workspace-hide-ops',desktopWorkspacePrefs.hideOps);body.classList.toggle('workspace-hide-bottom',desktopWorkspacePrefs.hideBottom);body.classList.toggle('workspace-compact',desktopWorkspacePrefs.compact);
  scene.style.setProperty('--workspace-left-width',`${desktopWorkspacePrefs.leftWidth}px`);scene.style.setProperty('--workspace-right-width',`${desktopWorkspacePrefs.rightWidth}px`);scene.style.setProperty('--workspace-bottom-height',`${desktopWorkspacePrefs.bottomHeight}px`);
  document.documentElement.dataset.desktopViewport=desktopViewportMode();document.documentElement.dataset.workspaceMode=desktopWorkspacePrefs.mode;
  document.querySelectorAll('[data-workspace-action]').forEach(btn=>{const a=btn.dataset.workspaceAction;const active=(a===desktopWorkspacePrefs.mode)||(a==='traffic'&&!desktopWorkspacePrefs.hideTraffic&&desktopWorkspacePrefs.mode!=='radar')||(a==='ops'&&!desktopWorkspacePrefs.hideOps&&desktopWorkspacePrefs.mode!=='radar')||(a==='bottom'&&!desktopWorkspacePrefs.hideBottom&&desktopWorkspacePrefs.mode!=='radar')||(a==='density'&&desktopWorkspacePrefs.compact);btn.classList.toggle('active',active);});
  renderDesktopWorkspaceStatus();
}
function renderDesktopWorkspaceStatus(){
  const el=document.querySelector('#desktopWorkspaceStatus span');if(!el)return;const p=aircraft.find(x=>x.id===selected);const selection=p?`${p.id} • ${p.status}`:'SEM SELEÇÃO';const pending=requests.length;el.textContent=`${desktopWorkspaceLabel()} • ${selection} • ${pending} PED.`;el.title=el.textContent;
}
function setDesktopWorkspaceMode(mode){
  if(!['balanced','radar','analysis'].includes(mode))return false;desktopWorkspacePrefs.mode=mode;
  if(mode==='balanced'){desktopWorkspacePrefs.hideTraffic=false;desktopWorkspacePrefs.hideOps=false;desktopWorkspacePrefs.hideBottom=false;}
  if(mode==='analysis'){desktopWorkspacePrefs.hideTraffic=false;desktopWorkspacePrefs.hideOps=false;desktopWorkspacePrefs.hideBottom=false;desktopWorkspacePrefs.leftWidth=Math.max(260,desktopWorkspacePrefs.leftWidth);desktopWorkspacePrefs.rightWidth=Math.max(370,desktopWorkspacePrefs.rightWidth);desktopWorkspacePrefs.bottomHeight=Math.max(160,desktopWorkspacePrefs.bottomHeight);}
  saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return true;
}
function toggleDesktopPanel(panel){
  if(panel==='traffic')desktopWorkspacePrefs.hideTraffic=!desktopWorkspacePrefs.hideTraffic;
  if(panel==='ops')desktopWorkspacePrefs.hideOps=!desktopWorkspacePrefs.hideOps;
  if(panel==='bottom')desktopWorkspacePrefs.hideBottom=!desktopWorkspacePrefs.hideBottom;
  if(desktopWorkspacePrefs.mode==='radar')desktopWorkspacePrefs.mode='balanced';saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return true;
}
function adjustDesktopPanel(panel,delta){
  if(panel==='left')desktopWorkspacePrefs.leftWidth=desktopClamp(desktopWorkspacePrefs.leftWidth+delta,175,340);
  if(panel==='right')desktopWorkspacePrefs.rightWidth=desktopClamp(desktopWorkspacePrefs.rightWidth+delta,250,460);
  if(panel==='bottom')desktopWorkspacePrefs.bottomHeight=desktopClamp(desktopWorkspacePrefs.bottomHeight+delta,88,220);
  saveDesktopWorkspacePrefs();applyDesktopWorkspace();resize();return {...desktopWorkspacePrefs};
}
function cycleDesktopAircraft(step=1){
  if(!aircraft.length)return false;const list=[...aircraft].sort((a,b)=>requestPriorityScore({type:b.request||'',priority:b.emergency?'urgent':'normal',time:0})-requestPriorityScore({type:a.request||'',priority:a.emergency?'urgent':'normal',time:0})||a.id.localeCompare(b.id));let i=list.findIndex(p=>p.id===selected);if(i<0)i=step>0?-1:0;i=(i+step+list.length)%list.length;selected=list[i].id;selectedRequest=requests.find(r=>r.id===selected)||null;renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();renderDesktopWorkspaceStatus();return selected;
}
function setDesktopShortcutSheet(open){const sheet=document.querySelector('#desktopShortcutSheet');if(!sheet)return;sheet.classList.toggle('open',!!open);sheet.setAttribute('aria-hidden',String(!open));if(open)document.querySelector('#desktopShortcutClose')?.focus();}
function executeDesktopWorkspaceAction(action){
  if(['balanced','radar','analysis'].includes(action))return setDesktopWorkspaceMode(action);
  if(['traffic','ops','bottom'].includes(action))return toggleDesktopPanel(action);
  if(action==='narrow-left')return adjustDesktopPanel('left',-20);if(action==='wide-left')return adjustDesktopPanel('left',20);if(action==='narrow-right')return adjustDesktopPanel('right',-20);if(action==='wide-right')return adjustDesktopPanel('right',20);
  if(action==='density'){desktopWorkspacePrefs.compact=!desktopWorkspacePrefs.compact;saveDesktopWorkspacePrefs();applyDesktopWorkspace();return true;}
  if(action==='help'){setDesktopShortcutSheet(true);return true;}
  if(action==='next-request'){selectNextRequest();renderDesktopWorkspaceStatus();return true;}
  if(action==='previous-aircraft')return cycleDesktopAircraft(-1);if(action==='next-aircraft')return cycleDesktopAircraft(1);
  if(action==='arrivals'){setTrafficTab('arrivals');return true;}if(action==='departures'){setTrafficTab('departures');return true;}if(action==='ground'){setTrafficTab('groundList');return true;}
  if(action?.startsWith('dock-')){setDock(action.slice(5));return true;}
  if(action==='commands'){if(!selected){selectNextRequest();}document.querySelector('#moreCommandSheet')?.classList.add('open');renderActionGrid();return true;}
  if(action==='pause'){document.querySelector('#pauseBtn')?.click();return true;}
  if(action==='escape'){const sheet=document.querySelector('#desktopShortcutSheet');if(sheet?.classList.contains('open')){setDesktopShortcutSheet(false);return true;}const cmd=document.querySelector('#moreCommandSheet');if(cmd?.classList.contains('open')){cmd.classList.remove('open');return true;}selected=null;selectedRequest=null;renderSelected();renderRequests();updateFrequencyPanel();renderActionGrid();renderDesktopWorkspaceStatus();return true;}
  return false;
}
function desktopTypingTarget(target){return !!target?.closest?.('input,select,textarea,[contenteditable="true"]');}
function initDesktopWorkspace(){
  applyDesktopWorkspace();
  document.addEventListener('click',e=>{const btn=e.target.closest?.('[data-workspace-action]');if(btn&&desktopViewportMode()!=='compact')executeDesktopWorkspaceAction(btn.dataset.workspaceAction);});
  document.querySelector('#desktopShortcutClose')?.addEventListener('click',()=>setDesktopShortcutSheet(false));document.querySelector('#desktopShortcutSheet')?.addEventListener('click',e=>{if(e.target.id==='desktopShortcutSheet')setDesktopShortcutSheet(false);});
  document.addEventListener('keydown',e=>{if(desktopViewportMode()==='compact'||desktopTypingTarget(e.target)||!document.body.classList.contains('game-active'))return;const action=desktopShortcutAction(e.code,e.shiftKey);if(!action)return;if(['ArrowLeft','ArrowRight','BracketLeft','BracketRight','Slash'].includes(e.code))e.preventDefault();executeDesktopWorkspaceAction(action);});
  window.addEventListener('resize',()=>{applyDesktopWorkspace();resize();},{passive:true});
  setInterval(()=>{if(document.body.classList.contains('game-active')){if(desktopWorkspaceLastSelected!==String(selected||'')){desktopWorkspaceLastSelected=String(selected||'');renderDesktopWorkspaceStatus();}else renderDesktopWorkspaceStatus();}},500);
}
window.SKYWARD_DESKTOP_WORKSPACE=Object.freeze({schema:DESKTOP_WORKSPACE_SCHEMA,viewportMode:desktopViewportMode,shortcutAction:desktopShortcutAction,clamp:desktopClamp,getPreferences:()=>Object.freeze({...desktopWorkspacePrefs}),setMode:setDesktopWorkspaceMode,togglePanel:toggleDesktopPanel,adjustPanel:adjustDesktopPanel,execute:executeDesktopWorkspaceAction,render:applyDesktopWorkspace});
window.addEventListener('load',()=>setTimeout(initDesktopWorkspace,540));

/* ===== MODULE 19: accessibility-settings (13-accessibility-settings.js) ===== */
/* @skyward-module 13-accessibility-settings
 * Professional accessibility, visual, audio, performance and control settings.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('13-accessibility-settings');
const ACCESSIBILITY_SCHEMA=1;
const ACCESSIBILITY_KEY=`skywardAccessibilitySettings_v${ACCESSIBILITY_SCHEMA}`;
const ACCESSIBILITY_DEFAULTS=Object.freeze({
  schema:ACCESSIBILITY_SCHEMA,
  uiScale:'100',
  contrast:'normal',
  colorMode:'standard',
  radarBrightness:'100',
  largeTargets:false,
  focusRing:true,
  reducedMotion:false,
  subtitles:true,
  masterVolume:70,
  radioVolume:82,
  sfxVolume:58,
  haptics:true,
  performanceMode:'auto',
  fpsCap:'60',
  effects:'normal',
  touchMode:'standard',
  shortcutHints:true
});
function accessClamp(value,min,max){return Math.max(min,Math.min(max,Number(value)||0));}
function sanitizeAccessibilityPrefs(value){
  const src=value&&typeof value==='object'?value:{};
  const pick=(key,list,fb)=>list.includes(String(src[key]))?String(src[key]):fb;
  return {
    ...ACCESSIBILITY_DEFAULTS,
    schema:ACCESSIBILITY_SCHEMA,
    uiScale:pick('uiScale',['90','100','110','120','130'],'100'),
    contrast:pick('contrast',['normal','high','night'],'normal'),
    colorMode:pick('colorMode',['standard','protanopia','deuteranopia','tritanopia','mono'],'standard'),
    radarBrightness:String(accessClamp(src.radarBrightness??100,70,130)),
    largeTargets:!!src.largeTargets,
    focusRing:src.focusRing!==false,
    reducedMotion:!!src.reducedMotion,
    subtitles:src.subtitles!==false,
    masterVolume:accessClamp(src.masterVolume??70,0,100),
    radioVolume:accessClamp(src.radioVolume??82,0,100),
    sfxVolume:accessClamp(src.sfxVolume??58,0,100),
    haptics:src.haptics!==false,
    performanceMode:pick('performanceMode',['auto','battery','performance'],'auto'),
    fpsCap:pick('fpsCap',['30','45','60'],'60'),
    effects:pick('effects',['minimal','normal','rich'],'normal'),
    touchMode:pick('touchMode',['standard','large','compact'],'standard'),
    shortcutHints:src.shortcutHints!==false
  };
}
let accessibilityPrefs=sanitizeAccessibilityPrefs(safeStorageGet(ACCESSIBILITY_KEY,ACCESSIBILITY_DEFAULTS));
function saveAccessibilityPrefs(){safeStorageSet(ACCESSIBILITY_KEY,accessibilityPrefs);}
function applyAccessibilitySettings(){
  const root=document.documentElement,body=document.body;if(!root||!body)return;
  root.dataset.accessibilitySchema=String(ACCESSIBILITY_SCHEMA);
  root.dataset.uiScale=accessibilityPrefs.uiScale;
  root.dataset.contrast=accessibilityPrefs.contrast;
  root.dataset.colorMode=accessibilityPrefs.colorMode;
  root.dataset.performanceMode=accessibilityPrefs.performanceMode;
  root.dataset.effectsMode=accessibilityPrefs.effects;
  root.dataset.touchMode=accessibilityPrefs.touchMode;
  root.style.setProperty('--ui-scale',String(Number(accessibilityPrefs.uiScale)/100));
  root.style.setProperty('--radar-brightness',`${accessibilityPrefs.radarBrightness}%`);
  root.style.setProperty('--master-volume',String(accessibilityPrefs.masterVolume/100));
  body.classList.toggle('access-large-targets',accessibilityPrefs.largeTargets||accessibilityPrefs.touchMode==='large');
  body.classList.toggle('access-focus-ring',accessibilityPrefs.focusRing);
  body.classList.toggle('access-reduced-motion',accessibilityPrefs.reducedMotion||accessibilityPrefs.performanceMode==='battery'||accessibilityPrefs.effects==='minimal');
  body.classList.toggle('access-subtitles',accessibilityPrefs.subtitles);
  body.classList.toggle('access-shortcut-hints',accessibilityPrefs.shortcutHints);
  if(accessibilityPrefs.reducedMotion){root.style.scrollBehavior='auto';}
  updateAccessibilityPanel();
  updateAccessibilityStatus();
  try{resize();}catch(e){}
}
function accessibilitySummary(){
  const contrast={normal:'Normal',high:'Alto contraste',night:'Noite'}[accessibilityPrefs.contrast]||'Normal';
  const color={standard:'Cores padrão',protanopia:'Protanopia',deuteranopia:'Deuteranopia',tritanopia:'Tritanopia',mono:'Monocromático'}[accessibilityPrefs.colorMode]||'Cores padrão';
  return `${accessibilityPrefs.uiScale}% • ${contrast} • ${color} • ${accessibilityPrefs.performanceMode.toUpperCase()}`;
}
function updateAccessibilityStatus(){
  document.querySelectorAll('[data-accessibility-status]').forEach(el=>{el.textContent=accessibilitySummary();});
  const badge=document.querySelector('#accessibilityBadge');if(badge)badge.textContent=accessibilityPrefs.contrast==='normal'&&accessibilityPrefs.uiScale==='100'?'ACESS':'ACESS*';
}
function setAccessibilityPanel(open){
  const panel=document.querySelector('#accessibilityPanel');if(!panel)return;
  panel.classList.toggle('open',!!open);panel.setAttribute('aria-hidden',String(!open));
  if(open){updateAccessibilityPanel();setTimeout(()=>document.querySelector('#accessibilityPanelClose')?.focus(),0);}
}
function updateAccessibilityPanel(){
  const panel=document.querySelector('#accessibilityPanel');if(!panel)return;
  for(const [key,value] of Object.entries(accessibilityPrefs)){
    panel.querySelectorAll(`[data-access-setting="${key}"]`).forEach(input=>{
      if(input.type==='checkbox')input.checked=!!value;else input.value=String(value);
    });
  }
  const summary=panel.querySelector('#accessibilitySummary');if(summary)summary.textContent=accessibilitySummary();
  const vol=panel.querySelector('#accessibilityVolumeSummary');if(vol)vol.textContent=`Master ${accessibilityPrefs.masterVolume}% • Rádio ${accessibilityPrefs.radioVolume}% • FX ${accessibilityPrefs.sfxVolume}%`;
}
function setAccessibilityPreference(key,value){
  if(!(key in ACCESSIBILITY_DEFAULTS))return false;
  const next={...accessibilityPrefs,[key]:value};
  accessibilityPrefs=sanitizeAccessibilityPrefs(next);saveAccessibilityPrefs();applyAccessibilitySettings();return true;
}
function resetAccessibilitySettings(){accessibilityPrefs=sanitizeAccessibilityPrefs(ACCESSIBILITY_DEFAULTS);saveAccessibilityPrefs();applyAccessibilitySettings();return true;}
function exportAccessibilitySettings(){return JSON.stringify(accessibilityPrefs,null,2);}
function cycleContrast(){const list=['normal','high','night'];const i=list.indexOf(accessibilityPrefs.contrast);setAccessibilityPreference('contrast',list[(i+1)%list.length]);return accessibilityPrefs.contrast;}
function runAccessibilitySelfCheck(){
  const issues=[];
  if(!document.querySelector('#accessibilityPanel'))issues.push('painel ausente');
  if(!document.querySelector('[data-settings-action="open"]'))issues.push('gatilho ausente');
  if(Number(accessibilityPrefs.uiScale)<90||Number(accessibilityPrefs.uiScale)>130)issues.push('escala fora do limite');
  if(!['normal','high','night'].includes(accessibilityPrefs.contrast))issues.push('contraste inválido');
  if(!['standard','protanopia','deuteranopia','tritanopia','mono'].includes(accessibilityPrefs.colorMode))issues.push('modo de cor inválido');
  return {schema:ACCESSIBILITY_SCHEMA,ok:issues.length===0,issues,preferences:{...accessibilityPrefs}};
}
function handleAccessibilityInput(target){
  const key=target?.dataset?.accessSetting;if(!key)return false;
  const value=target.type==='checkbox'?target.checked:target.value;
  return setAccessibilityPreference(key,value);
}
document.addEventListener('click',e=>{
  const action=e.target.closest?.('[data-settings-action]')?.dataset?.settingsAction;if(!action)return;
  if(action==='open'){setAccessibilityPanel(true);return;}
  if(action==='close'){setAccessibilityPanel(false);return;}
  if(action==='reset'){resetAccessibilitySettings();return;}
  if(action==='contrast'){cycleContrast();return;}
  if(action==='export'){const out=document.querySelector('#accessibilityExport');if(out)out.value=exportAccessibilitySettings();return;}
});
document.addEventListener('input',e=>handleAccessibilityInput(e.target));
document.addEventListener('change',e=>handleAccessibilityInput(e.target));
document.addEventListener('keydown',e=>{if(e.altKey&&e.code==='KeyS'&&!desktopTypingTarget?.(e.target)){e.preventDefault();setAccessibilityPanel(true);}if(e.code==='F10'&&!desktopTypingTarget?.(e.target)){e.preventDefault();setAccessibilityPanel(true);}});
window.SKYWARD_ACCESSIBILITY=Object.freeze({schema:ACCESSIBILITY_SCHEMA,defaults:ACCESSIBILITY_DEFAULTS,sanitize:sanitizeAccessibilityPrefs,clamp:accessClamp,getPreferences:()=>Object.freeze({...accessibilityPrefs}),setPreference:setAccessibilityPreference,apply:applyAccessibilitySettings,reset:resetAccessibilitySettings,summary:accessibilitySummary,selfCheck:runAccessibilitySelfCheck,open:()=>setAccessibilityPanel(true),close:()=>setAccessibilityPanel(false)});
window.addEventListener('load',()=>setTimeout(applyAccessibilitySettings,620));

/* ===== MODULE 20: deterministic-replay (14-deterministic-replay.js) ===== */
/* @skyward-module 14-deterministic-replay
 * Deterministic simulation clock, seeded replay recorder, state checksums and technical replay export.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('deterministic-replay');
const REPLAY_SCHEMA = 1;
const REPLAY_MAX_EVENTS = 900;
const REPLAY_STORAGE_KEY = `skywardReplayLast_v${REPLAY_SCHEMA}`;
let replayState = {
  enabled:true,
  recording:false,
  replaying:false,
  seed:'idle',
  seedHash:0,
  rngState:0,
  tick:0,
  elapsed:0,
  frame:0,
  events:[],
  lastChecksum:'00000000',
  startedAt:0,
  lastExport:null
};
function replayHash(value){
  const text=String(value||'');
  let h=2166136261>>>0;
  for(let i=0;i<text.length;i++){ h^=text.charCodeAt(i); h=Math.imul(h,16777619)>>>0; }
  return h>>>0;
}
function replaySeedFromProfile(reason='turn'){
  const airportCode = (profile && profile.airport) || 'SBGR';
  const name = (profile && profile.name) || 'Controlador';
  const turns = Number(profile?.turns||0);
  return `${BUILD}|${airportCode}|${name}|${turns}|${reason}`;
}
function replayMulberry32(){
  replayState.rngState = (replayState.rngState + 0x6D2B79F5) >>> 0;
  let t = replayState.rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function skywardRandomUnit(){
  try{
    if(window.SKYWARD_REPLAY?.isDeterministic?.()) return window.SKYWARD_REPLAY.random();
  }catch(_e){}
  return Math.random();
}
function replayStateSummary(){
  return {
    aircraft: aircraft.map(p=>({id:p.id,kind:p.kind,status:p.status,x:+Number(p.x||0).toFixed(2),y:+Number(p.y||0).toFixed(2),alt:+Number(p.alt||0).toFixed(1),speed:+Number(p.speed||0).toFixed(1),heading:+Number(p.heading||0).toFixed(1),fuel:+Number(p.fuel||0).toFixed(1),emergency:!!p.emergency})).sort((a,b)=>String(a.id).localeCompare(String(b.id))),
    requests: requests.map(r=>({id:r.id,type:r.type,priority:r.priority})).sort((a,b)=>`${a.id}|${a.type}`.localeCompare(`${b.id}|${b.type}`)),
    selected:selected||null,
    runwayOccupiedBy:runwayOccupiedBy||null,
    score:Math.round(score),
    stats:{...stats}
  };
}
function replayChecksum(payload=replayStateSummary()){
  return replayHash(JSON.stringify(payload)).toString(16).padStart(8,'0');
}
function replayRecord(type, detail={}){
  try{
    if(!replayState.enabled || !replayState.recording) return null;
    const entry={schema:REPLAY_SCHEMA,index:replayState.events.length,tick:replayState.tick,elapsed:+replayState.elapsed.toFixed(3),type,detail,checksum:replayChecksum(),at:Date.now()};
    replayState.lastChecksum=entry.checksum;
    replayState.events.push(entry);
    if(replayState.events.length>REPLAY_MAX_EVENTS) replayState.events.splice(0,replayState.events.length-REPLAY_MAX_EVENTS);
    renderReplayStatus();
    return entry;
  }catch(e){ safeLogError(e,'replay-record'); return null; }
}
function replayBeginTurn(seed){
  try{
    const resolved=String(seed||replaySeedFromProfile('turn'));
    replayState={...replayState,recording:true,replaying:false,seed:resolved,seedHash:replayHash(resolved),rngState:replayHash(resolved),tick:0,elapsed:0,frame:0,events:[],lastChecksum:'00000000',startedAt:Date.now(),lastExport:null};
    SKYWARD_RANDOM_SOURCE=()=>window.SKYWARD_REPLAY.random();
    replayRecord('turn-start',{seed:resolved,airport:profile?.airport||'SBGR',build:BUILD});
    renderReplayStatus();
    return cloneSafe(replayState);
  }catch(e){ safeLogError(e,'replay-begin'); return replayState; }
}
function replayStep(dt){
  if(!replayState.recording || replayState.replaying) return replayState;
  const safeDt=Math.max(0,Math.min(.25,Number(dt)||0));
  replayState.tick += 1;
  replayState.frame += 1;
  replayState.elapsed = +(replayState.elapsed + safeDt).toFixed(4);
  if(replayState.frame % 120 === 0) replayRecord('checkpoint',{aircraft:aircraft.length,requests:requests.length,score:Math.round(score)});
  return replayState;
}
function replayElapsedSeconds(){
  return replayState.recording ? replayState.elapsed : Math.max(0,(performance.now()-startTime)/1000);
}
function replayExport(){
  const payload={schema:REPLAY_SCHEMA,build:BUILD,version:BUILD_INFO.version,phase:BUILD_INFO.phase,replaySchema:BUILD_INFO.replaySchema||REPLAY_SCHEMA,seed:replayState.seed,seedHash:replayState.seedHash,tick:replayState.tick,elapsed:replayState.elapsed,startedAt:replayState.startedAt,exportedAt:Date.now(),airport:profile?.airport||null,events:cloneSafe(replayState.events),finalChecksum:replayChecksum(),state:replayStateSummary()};
  replayState.lastExport=payload;
  try{ safeStorageSet(REPLAY_STORAGE_KEY,payload); }catch(_e){}
  renderReplayStatus();
  return payload;
}
function replayImport(payload){
  try{
    const data=typeof payload==='string'?JSON.parse(payload):payload;
    if(!data || data.schema!==REPLAY_SCHEMA || !Array.isArray(data.events) || !data.seed) return {ok:false,reason:'payload inválido'};
    replayState.seed=String(data.seed); replayState.seedHash=replayHash(replayState.seed); replayState.rngState=replayState.seedHash; replayState.events=cloneSafe(data.events).slice(-REPLAY_MAX_EVENTS); replayState.tick=Number(data.tick)||0; replayState.elapsed=Number(data.elapsed)||0; replayState.lastChecksum=String(data.finalChecksum||'00000000'); replayState.lastExport=data; renderReplayStatus();
    return {ok:true,events:replayState.events.length,checksum:replayState.lastChecksum};
  }catch(e){ safeLogError(e,'replay-import'); return {ok:false,reason:String(e.message||e)}; }
}
function replaySelfCheck(){
  const s='SC-REPLAY-TEST';
  const a={...replayState};
  replayState.seed=s; replayState.rngState=replayHash(s);
  const seq1=[replayMulberry32(),replayMulberry32(),replayMulberry32()].map(n=>n.toFixed(8));
  replayState.seed=s; replayState.rngState=replayHash(s);
  const seq2=[replayMulberry32(),replayMulberry32(),replayMulberry32()].map(n=>n.toFixed(8));
  Object.assign(replayState,a);
  return {ok:seq1.join('|')===seq2.join('|') && replayChecksum({a:1})===replayChecksum({a:1}), sequence:seq1, checksum:replayChecksum({a:1})};
}
function renderReplayStatus(){
  try{
    const label=document.querySelector('#replayStatusValue');
    if(label) label.textContent = replayState.recording ? `REC ${replayState.events.length} • ${replayState.lastChecksum}` : 'AGUARDANDO TURNO';
    const badge=document.querySelector('#replayBadge');
    if(badge) badge.textContent = replayState.recording ? `REPLAY ${replayState.tick}` : 'REPLAY';
    const seed=document.querySelector('#replaySeedValue'); if(seed) seed.textContent=String(replayState.seed||'—').slice(0,42);
    const out=document.querySelector('#replayExportText'); if(out && replayState.lastExport) out.value=JSON.stringify(replayState.lastExport,null,2);
  }catch(_e){}
}
function openReplayPanel(){ document.querySelector('#replayPanel')?.classList.add('open'); document.querySelector('#replayPanel')?.setAttribute('aria-hidden','false'); renderReplayStatus(); }
function closeReplayPanel(){ document.querySelector('#replayPanel')?.classList.remove('open'); document.querySelector('#replayPanel')?.setAttribute('aria-hidden','true'); }
const originalStartGameF11 = typeof startGame==='function' ? startGame : null;
if(originalStartGameF11){
  startGame=function(){
    replayBeginTurn(replaySeedFromProfile('start-game'));
    const result=originalStartGameF11.apply(this,arguments);
    replayRecord('initial-state',{aircraft:aircraft.map(p=>p.id),requests:requests.map(r=>`${r.id}:${r.type}`)});
    return result;
  };
}
const originalCommandF11 = typeof command==='function' ? command : null;
if(originalCommandF11){
  command=function(cmd){
    replayRecord('command-before',{cmd,selected:selected||null});
    const result=originalCommandF11.apply(this,arguments);
    replayRecord('command-after',{cmd,selected:selected||null});
    return result;
  };
}
document.addEventListener('click',(e)=>{
  const target=e.target.closest&&e.target.closest('[data-replay-action]');
  if(!target) return;
  const action=target.dataset.replayAction;
  if(action==='open') openReplayPanel();
  if(action==='close') closeReplayPanel();
  if(action==='export'){ replayExport(); setDiagnostic('REPLAY TÉCNICO EXPORTADO','ok'); }
  if(action==='checkpoint'){ replayRecord('manual-checkpoint',{source:'operator'}); setDiagnostic('CHECKPOINT DE REPLAY CRIADO','ok'); }
});
window.addEventListener('keydown',(e)=>{ if(e.code==='F11'){ e.preventDefault(); openReplayPanel(); }});
window.SKYWARD_REPLAY=Object.freeze({
  schema:REPLAY_SCHEMA,
  isDeterministic:()=>replayState.recording && !replayState.replaying,
  random:()=>replayMulberry32(),
  beginTurn:replayBeginTurn,
  step:replayStep,
  elapsed:replayElapsedSeconds,
  record:replayRecord,
  export:replayExport,
  import:replayImport,
  checksum:replayChecksum,
  summary:()=>cloneSafe({...replayState,events:replayState.events.slice(-12)}),
  selfCheck:replaySelfCheck,
  seedHash:replayHash
});
setTimeout(()=>{ try{ renderReplayStatus(); }catch(_e){} },250);

/* ===== MODULE 21: quality-test-bridge (12-quality-test-bridge.js) ===== */
/* @skyward-module 12-quality-test-bridge
 * Controlled integration-test bridge. Mutation is disabled in normal gameplay.
 * Enable only with window.SKYWARD_QA_MODE=true before main.js or ?qa=1.
 */
window.SKYWARD_MODULES?.push('12-quality-test-bridge');
(function(){
  const TEST_SCHEMA=Number(BUILD_INFO?.testSchema||2);
  const qaEnabled=window.SKYWARD_QA_MODE===true || (()=>{ try{return new URLSearchParams(location.search).get('qa')==='1';}catch(_e){return false;} })();
  const ensureQa=()=>{ if(!qaEnabled) throw new Error('SKYWARD QA bridge is read-only outside explicit QA mode.'); };
  const clone=value=>cloneSafe(value);
  const baseStats=()=>({ landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 });
  const seededRandom=seed=>{
    let state=(Number(seed)||1)>>>0;
    return ()=>{ state=(state+0x6D2B79F5)>>>0; let t=state; t=Math.imul(t^(t>>>15),t|1); t^=t+Math.imul(t^(t>>>7),t|61); return ((t^(t>>>14))>>>0)/4294967296; };
  };
  const getState=()=>clone({
    build:BUILD,testSchema:BUILD_INFO.testSchema||TEST_SCHEMA,running,paused,score,selected,selectedRequest,runwayOccupiedBy,
    profile,aircraft,requests,stats,mission,safetyState,weather:WX_STATE,currentOpsProfile,
    safeMode:{errors:SAFE_MODE.errors,contractFailures:SAFE_MODE.contractFailures,saveRecoveries:SAFE_MODE.saveRecoveries,saveMigrations:SAFE_MODE.saveMigrations,lastSaveStatus:SAFE_MODE.lastSaveStatus,diagnostics:SAFE_MODE.diagnostics,perf:SAFE_MODE.perf}
  });
  const setRandomSeed=seed=>{ ensureQa(); SKYWARD_RANDOM_SOURCE=seededRandom(seed); return true; };
  const restoreProductionRandom=()=>{ ensureQa(); SKYWARD_RANDOM_SOURCE=()=>Math.random(); return true; };
  const reset=(seed=5005)=>{
    ensureQa(); setRandomSeed(seed); running=false; paused=false; score=0; selected=null; selectedRequest=null; runwayOccupiedBy=null;
    aircraft=[]; requests=[]; stats=baseStats(); mission=buildMission(); missionHistory=[]; conflictPredictions=[]; logLines=[];
    SAFE_MODE.errors=[]; SAFE_MODE.contractFailures=0; SAFE_MODE.saveRecoveries=0; SAFE_MODE.saveMigrations=0; SAFE_MODE.lastSaveStatus='qa-reset'; SAFE_MODE.diagnostics=[]; SAFE_MODE.lastGoodState=null; lastSnapshotAt=0;
    startTime=performance.now(); last=startTime; callsignSequence=0; clearGoodState();
    renderGameplayUi(true); renderMobileGameplay(); return getState();
  };
  const setState=payload=>{
    ensureQa(); const source=payload&&typeof payload==='object'?payload:{};
    if(Array.isArray(source.aircraft)) aircraft=source.aircraft.map(p=>CONTRACTS?.sanitizeAircraft?CONTRACTS.sanitizeAircraft(p):p).filter(Boolean);
    if(Array.isArray(source.requests)) requests=source.requests.map(r=>CONTRACTS?.sanitizeRequest?CONTRACTS.sanitizeRequest(r):r).filter(Boolean);
    if(source.stats&&typeof source.stats==='object') stats={...baseStats(),...clone(source.stats)};
    if(Number.isFinite(Number(source.score))) score=Number(source.score);
    if('selected' in source) selected=source.selected;
    if('selectedRequest' in source) selectedRequest=clone(source.selectedRequest);
    if('runwayOccupiedBy' in source) runwayOccupiedBy=source.runwayOccupiedBy;
    if('running' in source) running=Boolean(source.running);
    if('paused' in source) paused=Boolean(source.paused);
    sanitizeAircraftList(); renderGameplayUi(true); renderMobileGameplay(); return getState();
  };
  const createPlane=(index=0,kind='arrival')=>{ ensureQa(); const plane=makePlane(Number(index)||0,kind==='departure'?'departure':'arrival'); aircraft.push(plane); return clone(plane); };
  const generateTraffic=(count=6,seed=5005)=>{ ensureQa(); reset(seed); const n=Math.max(1,Math.min(16,Number(count)||6)); for(let i=0;i<n;i++){ const p=makePlane(i,i%2===0?'arrival':'departure'); aircraft.push(p); addRequest(p,p.request,p.kind==='arrival'?'warn':'normal'); } return getState(); };
  const addRequestFor=(id,type,priority='normal')=>{ ensureQa(); const p=aircraft.find(x=>x.id===id); if(!p) return false; addRequest(p,type,priority); return requests.some(r=>r.id===id&&r.type===type); };
  const select=id=>{ ensureQa(); selected=id; selectedRequest=requests.find(r=>r.id===id)||null; renderGameplayUi(true); return getState(); };
  const issueCommand=(id,cmd)=>{ ensureQa(); select(id); command(cmd); return getState(); };
  const runSoak=(steps=600,dt=.1)=>{
    ensureQa(); const total=Math.max(1,Math.min(5000,Number(steps)||600)); const step=Math.max(.01,Math.min(1,Number(dt)||.1));
    const wasRunning=running; running=false;
    for(let i=0;i<total;i++){
      updateWeatherOps(step); updateFuelAndEmergency(step); updatePlanes(step); checkRunway(); checkConflicts(); updateRunwayOps();
      if(!Array.isArray(aircraft)||!Array.isArray(requests)) throw new Error('Estado de simulação corrompido no soak.');
      sanitizeAircraftList();
    }
    running=wasRunning;
    return {steps:total,dt:step,state:getState(),aircraftContract:CONTRACTS.validateAircraftList(aircraft,'qa-soak').ok,requestsContract:CONTRACTS.validateRequests(requests,'qa-soak').ok};
  };
  const saveSnapshot=reason=>{ ensureQa(); return saveGoodState(reason||'qa-test',true); };
  const restoreSnapshot=()=>{ ensureQa(); return restoreGoodState(); };
  const clearSnapshot=()=>{ ensureQa(); clearGoodState(); return true; };
  const setAirport=icao=>{ ensureQa(); if(!airports.some(a=>a.icao===icao)) return false; profile.airport=icao; applyAirportOpsProfile(); return true; };
  const vaultInspect=name=>clone(saveVault()?.inspect(String(name||'snapshot'))||null);
  const setVaultSlot=(name,slot,value,raw=false)=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; const key=vault.storageKey(String(name),String(slot)); localStorage.setItem(key,raw?String(value):JSON.stringify(value)); return true; };
  const removeVaultSlot=(name,slot)=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; localStorage.removeItem(vault.storageKey(String(name),String(slot))); return true; };
  const corruptVaultSlot=(name,slot='primary',mode='json')=>{ ensureQa(); const vault=saveVault(); if(!vault) return false; const key=vault.storageKey(String(name),String(slot)); const raw=localStorage.getItem(key); if(mode==='json') localStorage.setItem(key,'{corrupted-json'); else if(raw){ const value=JSON.parse(raw); if(mode==='payload'&&value.payload){ value.payload.score=(Number(value.payload.score)||0)+999; } else value.envelopeHash='0'.repeat(64); localStorage.setItem(key,JSON.stringify(value)); } return true; };
  const injectLegacySnapshot=(payload,key='skywardGoodState_v2')=>{ ensureQa(); saveVault()?.clear('snapshot'); localStorage.removeItem(SNAPSHOT_KEY); LEGACY_SNAPSHOT_KEYS.forEach(item=>localStorage.removeItem(item)); localStorage.setItem(String(key),JSON.stringify(payload)); SAFE_MODE.lastGoodState=null; return true; };
  const setProfileState=value=>{ ensureQa(); profile=CONTRACTS.sanitizeProfile(value,profile); return clone(profile); };
  const persistProfileForTest=reason=>{ ensureQa(); return persistProfile(reason||'qa-profile'); };
  const reloadProfileForTest=()=>{ ensureQa(); loadProfile(); return clone(profile); };
  const clearProfileVault=()=>{ ensureQa(); saveVault()?.clear('profile'); localStorage.removeItem('skywardProfile'); return true; };
  const api=Object.freeze({
    testSchema:TEST_SCHEMA,version:'2.0.0',enabled:qaEnabled,getState,
    kernel:window.SKYWARD_QUALITY_KERNEL,
    reset,setState,setRandomSeed,restoreProductionRandom,createPlane,generateTraffic,addRequestFor,select,issueCommand,runSoak,
    saveSnapshot,restoreSnapshot,clearSnapshot,setAirport,vaultInspect,setVaultSlot,removeVaultSlot,corruptVaultSlot,injectLegacySnapshot,setProfileState,persistProfileForTest,reloadProfileForTest,clearProfileVault,
    predictConflicts:()=>clone(predictConflicts()),commandRisk:(plane,cmd)=>clone(commandRisk(plane,cmd)),
    contextActions:plane=>clone(contextActions(plane)),requestPriorityScore:request=>requestPriorityScore(request),
    requiredWakeSpacing:(lead,trail)=>requiredWakeSpacing(lead,trail),runwayFlowState:()=>clone(runwayFlowState()),
    validateCurrentState:()=>Object.freeze({aircraft:CONTRACTS.validateAircraftList(aircraft,'qa-current-aircraft'),requests:CONTRACTS.validateRequests(requests,'qa-current-requests')})
  });
  window.SKYWARD_TEST_API=api;
})();

/* ===== RUNTIME ARCHITECTURE FINALIZER ===== */
Object.freeze(window.SKYWARD_MODULES);
Object.freeze(window.SKYWARD_ARCHITECTURE);
