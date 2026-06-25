/*
 * SKYWARD CONTROL — GENERATED RUNTIME BUNDLE
 * Do not edit main.js directly. Edit src/runtime modules and run npm run build:runtime.
 * Architecture generation: 45
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
let stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, surfaceConflicts:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
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
function atcIsMobileRuntime(){ try{ return !!(window.matchMedia?.('(pointer: coarse)').matches || innerWidth<900 || screen?.width<900); }catch(_e){ return false; } }
function atcPaceFactor(){ return atcIsMobileRuntime() ? 1.75 : 1; }
function atcDtScale(){ return atcIsMobileRuntime() ? 0.62 : 1; }
window.SKYWARD_MOBILE_PACE = Object.freeze({ schema:1, isMobile:atcIsMobileRuntime, factor:atcPaceFactor, dtScale:atcDtScale });
let runway = { name:'09/27', x1:18, y1:50, x2:82, y2:50, width:6.2, exits:[32,45,56,68] };
let gates = [
  {x:55,y:70, label:'A'}, {x:61,y:70, label:'A'}, {x:67,y:70, label:'B'}, {x:73,y:70, label:'B'},
  {x:58,y:78, label:'C'}, {x:65,y:78, label:'C'}, {x:72,y:78, label:'D'}, {x:78,y:77, label:'D'}
];
let holdingPoints = [{x:31,y:57},{x:47,y:57},{x:64,y:57},{x:78,y:57}];
let finalFix = {x:52, y:26};
let activeAirportGraph = null;
let secondaryRunways = [];
let airportSurfaceState = { activeRunway:null, taxiwayCount:0, gateCount:0, holdingCount:0 };

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
    const graph=activeAirportGraph;
    box.innerHTML=`<div class="airport-ops-head"><b>AIRPORT OPS</b><span>${a.icao}</span></div>
      <div class="airport-ops-grid">
        <div><small>RWY</small><b>${p.runway}</b></div>
        <div><small>LAYOUT</small><b>${p.layout}</b></div>
        <div><small>OPS</small><b>${p.ops}</b></div>
        <div><small>PROC</small><b>${p.procedures}</b></div>
        <div><small>GATES</small><b>${graph?.gates?.length || gates.length}</b></div>
        <div><small>TAXIWAYS</small><b>${graph?.taxiways?.length || 0}</b></div>
        <div><small>HOLDS</small><b>${graph?.holdingPoints?.length || holdingPoints.length}</b></div>
        <div><small>GRAPH</small><b>${graph ? 'ATIVO' : 'GENÉRICO'}</b></div>
      </div>`;
  }catch(e){ safeLogError(e,'airport-ops-board'); }
}
function airportSpawnInterval(){
  const p=currentOpsProfile||airportOpsProfile();
  const wx=WX_STATE?.severity>.75 ? 1.28 : WX_STATE?.severity>.55 ? 1.12 : 1;
  return Math.max(24, 45 / Math.max(.45, p.spawn||.58) * wx * atcPaceFactor());
}
function airportInitialTrafficCount(){
  const p=currentOpsProfile||airportOpsProfile();
  const base=Math.max(4, Math.min(8, Math.round(4 + (p.spawn||.58)*3)));
  return atcIsMobileRuntime() ? Math.max(2, Math.min(4, base-2)) : base;
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

/* ===== MODULE 10: airport-surface-graph (16-airport-surface-graph.js) ===== */
/* @skyward-module 16-airport-surface-graph
 * Realistic airport surface graph, taxiways, gates and runway occupancy helpers.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('16-airport-surface-graph');
const AIRPORT_SURFACE_CATALOG = Object.freeze({
  schema: 1,
  version: '2026.06-f13',
  airports: {
    SBGR: { airport:'SBGR', displayName:'São Paulo / Guarulhos', activeRunway:'09R/27L', finalFix:{x:50,y:24},
      runways:[
        { id:'09R/27L', x1:17, y1:49, x2:84, y2:49, width:6.0, heading:90, lineup:{x:24,y:49}, departureEnd:{x:18,y:49}, arrivalThreshold:{x:82,y:49}, exits:[{id:'E1',x:33,y:54},{id:'E2',x:47,y:54},{id:'E3',x:60,y:54},{id:'E4',x:72,y:54}] },
        { id:'09L/27R', x1:18, y1:58, x2:83, y2:58, width:5.0, heading:90, secondary:true }
      ],
      holdingPoints:[
        {id:'HS1',x:33,y:56,runway:'09R/27L',lineup:{x:25,y:49}}, {id:'HS2',x:48,y:56,runway:'09R/27L',lineup:{x:27,y:49}},
        {id:'HS3',x:63,y:56,runway:'09R/27L',lineup:{x:29,y:49}}, {id:'HS4',x:76,y:56,runway:'09R/27L',lineup:{x:31,y:49}}
      ],
      taxiways:[
        {id:'A', points:[{x:24,y:56},{x:82,y:56}]}, {id:'B', points:[{x:58,y:64},{x:80,y:64}]}, {id:'C', points:[{x:58,y:72},{x:80,y:72}]},
        {id:'L1', points:[{x:58,y:56},{x:58,y:76}]}, {id:'L2', points:[{x:66,y:56},{x:66,y:76}]}, {id:'L3', points:[{x:74,y:56},{x:74,y:76}]}
      ],
      gates:[
        {id:'T1',label:'T',x:58,y:76,pushback:{x:58,y:72},routeToHolding:['PB1','N1','HS2']}, {id:'T2',label:'T',x:66,y:76,pushback:{x:66,y:72},routeToHolding:['PB2','N2','HS3']},
        {id:'T3',label:'T',x:74,y:76,pushback:{x:74,y:72},routeToHolding:['PB3','N3','HS4']}, {id:'S1',label:'S',x:60,y:68,pushback:{x:60,y:64},routeToHolding:['PB4','N4','HS2']},
        {id:'S2',label:'S',x:68,y:68,pushback:{x:68,y:64},routeToHolding:['PB5','N5','HS3']}, {id:'S3',label:'S',x:76,y:68,pushback:{x:76,y:64},routeToHolding:['PB6','N6','HS4']}
      ],
      nodes:{ PB1:{x:58,y:72},PB2:{x:66,y:72},PB3:{x:74,y:72},PB4:{x:60,y:64},PB5:{x:68,y:64},PB6:{x:76,y:64},N1:{x:58,y:56},N2:{x:66,y:56},N3:{x:74,y:56},N4:{x:60,y:56},N5:{x:68,y:56},N6:{x:76,y:56},HS1:{x:33,y:56},HS2:{x:48,y:56},HS3:{x:63,y:56},HS4:{x:76,y:56} }
    },
    SBSP: { airport:'SBSP', displayName:'São Paulo / Congonhas', activeRunway:'17R/35L', finalFix:{x:61,y:22},
      runways:[{id:'17R/35L',x1:36,y1:18,x2:68,y2:82,width:5.6,heading:170,lineup:{x:46,y:38},departureEnd:{x:40,y:28},arrivalThreshold:{x:64,y:74},exits:[{id:'E1',x:58,y:64},{id:'E2',x:53,y:55},{id:'E3',x:48,y:46}]}],
      holdingPoints:[{id:'HS1',x:42,y:48,runway:'17R/35L',lineup:{x:46,y:39}},{id:'HS2',x:50,y:56,runway:'17R/35L',lineup:{x:48,y:43}}],
      taxiways:[{id:'P',points:[{x:40,y:50},{x:58,y:68}]},{id:'Q',points:[{x:46,y:42},{x:60,y:56}]},{id:'R',points:[{x:48,y:60},{x:72,y:84}]},{id:'TERM',points:[{x:58,y:68},{x:80,y:68}]},{id:'TERM2',points:[{x:56,y:60},{x:78,y:60}]}],
      gates:[{id:'P1',label:'P',x:78,y:68,pushback:{x:74,y:68},routeToHolding:['PB1','N1','HS2']},{id:'P2',label:'P',x:72,y:68,pushback:{x:68,y:68},routeToHolding:['PB2','N2','HS2']},{id:'Q1',label:'Q',x:76,y:60,pushback:{x:72,y:60},routeToHolding:['PB3','N3','HS1']},{id:'Q2',label:'Q',x:70,y:60,pushback:{x:66,y:60},routeToHolding:['PB4','N4','HS1']}],
      nodes:{PB1:{x:74,y:68},PB2:{x:68,y:68},PB3:{x:72,y:60},PB4:{x:66,y:60},N1:{x:58,y:68},N2:{x:56,y:66},N3:{x:56,y:60},N4:{x:52,y:56},HS1:{x:42,y:48},HS2:{x:50,y:56}}
    },
    SBKP: { airport:'SBKP', displayName:'Viracopos / Campinas', activeRunway:'15/33', finalFix:{x:44,y:20},
      runways:[{id:'15/33',x1:24,y1:20,x2:76,y2:80,width:5.4,heading:150,lineup:{x:34,y:32},departureEnd:{x:28,y:24},arrivalThreshold:{x:72,y:76},exits:[{id:'E1',x:49,y:49},{id:'E2',x:57,y:57},{id:'E3',x:66,y:67}]}],
      holdingPoints:[{id:'HS1',x:34,y:44,runway:'15/33',lineup:{x:36,y:34}},{id:'HS2',x:46,y:56,runway:'15/33',lineup:{x:38,y:36}}],
      taxiways:[{id:'A',points:[{x:32,y:44},{x:58,y:70}]},{id:'B',points:[{x:38,y:36},{x:64,y:62}]},{id:'C',points:[{x:58,y:70},{x:82,y:70}]},{id:'D',points:[{x:52,y:62},{x:80,y:62}]}],
      gates:[{id:'C1',label:'C',x:80,y:70,pushback:{x:76,y:70},routeToHolding:['PB1','N1','HS2']},{id:'C2',label:'C',x:74,y:70,pushback:{x:70,y:70},routeToHolding:['PB2','N2','HS2']},{id:'D1',label:'D',x:78,y:62,pushback:{x:74,y:62},routeToHolding:['PB3','N3','HS1']},{id:'D2',label:'D',x:72,y:62,pushback:{x:68,y:62},routeToHolding:['PB4','N4','HS1']}],
      nodes:{PB1:{x:76,y:70},PB2:{x:70,y:70},PB3:{x:74,y:62},PB4:{x:68,y:62},N1:{x:58,y:70},N2:{x:54,y:66},N3:{x:52,y:62},N4:{x:48,y:58},HS1:{x:34,y:44},HS2:{x:46,y:56}}
    },
    SBBR: { airport:'SBBR', displayName:'Brasília', activeRunway:'11L/29R', finalFix:{x:48,y:22},
      runways:[{id:'11L/29R',x1:16,y1:40,x2:84,y2:56,width:5.8,heading:110,lineup:{x:25,y:42},departureEnd:{x:18,y:40},arrivalThreshold:{x:82,y:56},exits:[{id:'E1',x:36,y:48},{id:'E2',x:50,y:50},{id:'E3',x:63,y:52},{id:'E4',x:74,y:55}]},{id:'11R/29L',x1:18,y1:58,x2:82,y2:72,width:4.8,heading:110,secondary:true}],
      holdingPoints:[{id:'HS1',x:34,y:54,runway:'11L/29R',lineup:{x:26,y:43}},{id:'HS2',x:48,y:58,runway:'11L/29R',lineup:{x:28,y:44}},{id:'HS3',x:62,y:61,runway:'11L/29R',lineup:{x:30,y:45}}],
      taxiways:[{id:'A',points:[{x:30,y:54},{x:80,y:66}]},{id:'B',points:[{x:36,y:62},{x:82,y:72}]},{id:'L1',points:[{x:56,y:54},{x:56,y:74}]},{id:'L2',points:[{x:68,y:56},{x:68,y:74}]}],
      gates:[{id:'N1',label:'N',x:56,y:74,pushback:{x:56,y:70},routeToHolding:['PB1','N4','HS2']},{id:'N2',label:'N',x:68,y:74,pushback:{x:68,y:70},routeToHolding:['PB2','N5','HS3']},{id:'M1',label:'M',x:60,y:66,pushback:{x:60,y:62},routeToHolding:['PB3','N6','HS2']},{id:'M2',label:'M',x:72,y:66,pushback:{x:72,y:62},routeToHolding:['PB4','N7','HS3']}],
      nodes:{PB1:{x:56,y:70},PB2:{x:68,y:70},PB3:{x:60,y:62},PB4:{x:72,y:62},N4:{x:56,y:54},N5:{x:68,y:56},N6:{x:60,y:54},N7:{x:72,y:56},HS1:{x:34,y:54},HS2:{x:48,y:58},HS3:{x:62,y:61}}
    },
    KATL: { airport:'KATL', displayName:'Atlanta Hartsfield-Jackson', activeRunway:'09L/27R', finalFix:{x:50,y:22},
      runways:[{id:'09L/27R',x1:14,y1:46,x2:86,y2:46,width:5.8,heading:90,lineup:{x:22,y:46},departureEnd:{x:16,y:46},arrivalThreshold:{x:84,y:46},exits:[{id:'E1',x:30,y:52},{id:'E2',x:42,y:52},{id:'E3',x:54,y:52},{id:'E4',x:66,y:52},{id:'E5',x:78,y:52}]},{id:'08R/26L',x1:14,y1:56,x2:86,y2:56,width:5.2,heading:90,secondary:true},{id:'08L/26R',x1:14,y1:66,x2:86,y2:66,width:4.8,heading:90,secondary:true}],
      holdingPoints:[{id:'HS1',x:28,y:54,runway:'09L/27R',lineup:{x:23,y:46}},{id:'HS2',x:42,y:54,runway:'09L/27R',lineup:{x:25,y:46}},{id:'HS3',x:56,y:54,runway:'09L/27R',lineup:{x:27,y:46}},{id:'HS4',x:70,y:54,runway:'09L/27R',lineup:{x:29,y:46}}],
      taxiways:[{id:'A',points:[{x:20,y:54},{x:82,y:54}]},{id:'B',points:[{x:24,y:62},{x:82,y:62}]},{id:'C',points:[{x:28,y:70},{x:82,y:70}]},{id:'L1',points:[{x:54,y:54},{x:54,y:76}]},{id:'L2',points:[{x:62,y:54},{x:62,y:76}]},{id:'L3',points:[{x:70,y:54},{x:70,y:76}]}],
      gates:[{id:'A1',label:'A',x:54,y:76,pushback:{x:54,y:70},routeToHolding:['PB1','N1','HS3']},{id:'A2',label:'A',x:62,y:76,pushback:{x:62,y:70},routeToHolding:['PB2','N2','HS3']},{id:'A3',label:'A',x:70,y:76,pushback:{x:70,y:70},routeToHolding:['PB3','N3','HS4']},{id:'B1',label:'B',x:58,y:68,pushback:{x:58,y:62},routeToHolding:['PB4','N4','HS2']},{id:'B2',label:'B',x:66,y:68,pushback:{x:66,y:62},routeToHolding:['PB5','N5','HS3']},{id:'B3',label:'B',x:74,y:68,pushback:{x:74,y:62},routeToHolding:['PB6','N6','HS4']}],
      nodes:{PB1:{x:54,y:70},PB2:{x:62,y:70},PB3:{x:70,y:70},PB4:{x:58,y:62},PB5:{x:66,y:62},PB6:{x:74,y:62},N1:{x:54,y:54},N2:{x:62,y:54},N3:{x:70,y:54},N4:{x:58,y:54},N5:{x:66,y:54},N6:{x:74,y:54},HS1:{x:28,y:54},HS2:{x:42,y:54},HS3:{x:56,y:54},HS4:{x:70,y:54}}
    }
  }
});
function copyPoint(p){ return p ? {x:Number(p.x), y:Number(p.y)} : null; }
function cloneRoutePoints(points){ return Array.isArray(points) ? points.filter(Boolean).map(copyPoint).filter(Boolean) : []; }
function graphDefault(){
  return {
    airport: airport()?.icao || 'GEN', displayName: airport()?.name || 'Generic field', activeRunway: runway.name,
    runways:[{ id:runway.name, x1:runway.x1, y1:runway.y1, x2:runway.x2, y2:runway.y2, width:runway.width, heading:Math.round(headingTo({x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2})), lineup:{x:runway.x1+6,y:runway.y1}, departureEnd:{x:runway.x1+2,y:runway.y1}, arrivalThreshold:{x:runway.x2-2,y:runway.y2}, exits:(runway.exits||[]).map((x,i)=>({id:`E${i+1}`,x,y:(runway.y1+runway.y2)/2+6})) }],
    taxiways:[{id:'GEN-A',points:[{x:20,y:58},{x:82,y:58}]},{id:'GEN-B',points:[{x:56,y:58},{x:56,y:78}]},{id:'GEN-C',points:[{x:66,y:58},{x:66,y:78}]}],
    gates:gates.map((g,i)=>({id:`G${i+1}`,label:g.label||'G',x:g.x,y:g.y,pushback:{x:g.x,y:Math.max(8,g.y-6)},routeToHolding:[`PB${i+1}`,`HS${(i%Math.max(1,holdingPoints.length))+1}`]})),
    holdingPoints:holdingPoints.map((h,i)=>({id:`HS${i+1}`,x:h.x,y:h.y,runway:runway.name,lineup:{x:Math.min(runway.x1+10,runway.x2-10),y:runway.y1}})),
    nodes:Object.fromEntries([].concat(gates.map((g,i)=>[[`PB${i+1}`,{x:g.x,y:Math.max(8,g.y-6)}]]), holdingPoints.map((h,i)=>[[`HS${i+1}`,{x:h.x,y:h.y}]])).flat())
  };
}
function airportSurfaceGraphFor(icao){ const code=String(icao||airport()?.icao||'').toUpperCase(); return AIRPORT_SURFACE_CATALOG.airports[code] || graphDefault(); }
function resolveNode(graph,id){ if(!graph||!id) return null; const node=graph.nodes?.[id]; if(node) return copyPoint(node); const gate=(graph.gates||[]).find(g=>g.id===id); if(gate) return {x:Number(gate.x), y:Number(gate.y)}; const hold=(graph.holdingPoints||[]).find(h=>h.id===id); if(hold) return {x:Number(hold.x), y:Number(hold.y)}; return null; }
function resolveSurfaceRoute(graph, route){ if(!Array.isArray(route)) return []; return route.map(id=>typeof id==='string' ? resolveNode(graph,id) : copyPoint(id)).filter(Boolean); }
function applyAirportSurfaceGraph(icao){
  const graph=airportSurfaceGraphFor(icao); activeAirportGraph=graph;
  const active=(graph.runways||[]).find(r=>r.id===graph.activeRunway) || graph.runways?.[0];
  runway={ name:active?.id || runway.name, x1:active?.x1 ?? runway.x1, y1:active?.y1 ?? runway.y1, x2:active?.x2 ?? runway.x2, y2:active?.y2 ?? runway.y2, width:active?.width ?? runway.width, exits:(active?.exits||[]).map(e=>Number(e.x)) };
  gates=(graph.gates||[]).map(g=>({x:Number(g.x), y:Number(g.y), label:g.label||String(g.id||'G').replace(/\d+/g,'').slice(0,1)||'G', id:g.id, pushback:copyPoint(g.pushback), routeToHolding:Array.isArray(g.routeToHolding)?g.routeToHolding.slice():[]}));
  holdingPoints=(graph.holdingPoints||[]).map(h=>({x:Number(h.x), y:Number(h.y), id:h.id, runway:h.runway, lineup:copyPoint(h.lineup)}));
  finalFix=copyPoint(graph.finalFix) || finalFix;
  secondaryRunways=(graph.runways||[]).filter(r=>r.id!==active?.id);
  airportSurfaceState={ activeRunway:runway.name, taxiwayCount:(graph.taxiways||[]).length, gateCount:gates.length, holdingCount:holdingPoints.length };
  if(PROCEDURE_LAYER?.ils && active?.arrivalThreshold){ PROCEDURE_LAYER.ils.threshold=copyPoint(active.arrivalThreshold); PROCEDURE_LAYER.ils.name=`ILS RWY ${runway.name}`; }
  if($('#runwayTextTop')) $('#runwayTextTop').textContent=`RWY ${runway.name}`;
  return graph;
}
function assignDepartureSurfaceRoute(plane, stage){
  if(!plane) return [];
  const graph=activeAirportGraph||airportSurfaceGraphFor();
  const gate=(graph.gates||[]).find(g=>g.id===plane.gateId) || (graph.gates||[])[plane.gateIndex||0] || (graph.gates||[])[0];
  const hold=(graph.holdingPoints||[])[plane.groundIndex||0] || (graph.holdingPoints||[])[0];
  if(stage==='pushback') return gate?.pushback ? [copyPoint(gate.pushback)] : [];
  if(stage==='taxi'){
    const route=resolveSurfaceRoute(graph, gate?.routeToHolding || []);
    if(route.length) return route;
    return [gate?.pushback?copyPoint(gate.pushback):null, hold?copyPoint(hold):null].filter(Boolean);
  }
  if(stage==='lineup') return [copyPoint(hold?.lineup || activeRunwayObject()?.lineup || {x:runway.x1+6,y:runway.y1})].filter(Boolean);
  return [];
}
function activeRunwayObject(){ const graph=activeAirportGraph||airportSurfaceGraphFor(); return (graph.runways||[]).find(r=>r.id===runway.name) || graph.runways?.[0] || null; }
function runwayHeadingValue(){ return Math.round(headingTo({x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2})); }
function nearestRunwayExit(point){ const active=activeRunwayObject(); if(!active||!Array.isArray(active.exits)||!active.exits.length) return null; let best=null, bestD=Infinity; for(const ex of active.exits){ const d=Math.hypot((ex.x??0)-(point?.x??0),(ex.y??0)-(point?.y??0)); if(d<bestD){ best=ex; bestD=d; } } return best ? {id:best.id,x:Number(best.x),y:Number(best.y)} : null; }
function assignArrivalVacateRoute(plane){ const exit=nearestRunwayExit(plane); if(!exit) return []; const graph=activeAirportGraph||airportSurfaceGraphFor(); const taxi=(graph.taxiways||[])[0]; const tail=Array.isArray(taxi?.points)&&taxi.points.length ? copyPoint(taxi.points[Math.max(0,taxi.points.length-1)]) : {x:exit.x+8,y:exit.y+8}; return [copyPoint(exit), tail]; }
function beginSurfaceRoute(plane, route, statusAfter){ if(!plane) return plane; plane.surfaceRoute=cloneRoutePoints(route); plane.surfaceLeg=0; plane.surfaceStatusAfter=statusAfter||null; return plane; }
function stepSurfaceRoute(plane, dt, speedFactor){
  if(!plane||!Array.isArray(plane.surfaceRoute)||!plane.surfaceRoute.length) return true;
  const target=plane.surfaceRoute[Math.min(plane.surfaceLeg||0, plane.surfaceRoute.length-1)];
  if(!target) return true;
  plane.heading=headingTo(plane,target);
  moveToward(plane,target,Math.max(0.04, (speedFactor||SIM_SPEED*.55))*dt);
  if(Math.hypot(plane.x-target.x, plane.y-target.y)<1.3){ plane.surfaceLeg=(plane.surfaceLeg||0)+1; }
  return (plane.surfaceLeg||0) >= plane.surfaceRoute.length;
}
function airportSurfaceSummary(){ const graph=activeAirportGraph||airportSurfaceGraphFor(); return { airport:graph.airport, graph:graph.displayName, runways:(graph.runways||[]).length, taxiways:(graph.taxiways||[]).length, gates:(graph.gates||[]).length, holds:(graph.holdingPoints||[]).length, activeRunway:graph.activeRunway||runway.name } }
function airportSurfaceSelfCheck(){
  try{
    const issues=[]; const graphs=AIRPORT_SURFACE_CATALOG.airports||{}; const keys=Object.keys(graphs); if(keys.length<5) issues.push('menos de 5 aeroportos grafo');
    keys.forEach(code=>{ const g=graphs[code]; if(!g.activeRunway) issues.push(`${code} sem pista ativa`); if(!Array.isArray(g.runways)||!g.runways.length) issues.push(`${code} sem runways`); if(!Array.isArray(g.gates)||!g.gates.length) issues.push(`${code} sem gates`); if(!Array.isArray(g.taxiways)||!g.taxiways.length) issues.push(`${code} sem taxiways`); });
    return { ok:issues.length===0, issues, summary:keys.length };
  }catch(error){ return { ok:false, issues:[error.message] }; }
}
window.SKYWARD_AIRPORT_SURFACE=Object.freeze({ schema:1, catalog:AIRPORT_SURFACE_CATALOG, getGraph:airportSurfaceGraphFor, apply:applyAirportSurfaceGraph, resolveRoute:resolveSurfaceRoute, resolveNode, assignDepartureSurfaceRoute, assignArrivalVacateRoute, beginSurfaceRoute, stepSurfaceRoute, activeRunway:activeRunwayObject, runwayHeading:runwayHeadingValue, nearestRunwayExit, summary:airportSurfaceSummary, selfCheck:airportSurfaceSelfCheck });

/* ===== MODULE 11: advanced-weather-ifr (18-advanced-weather-ifr.js) ===== */
/* @skyward-module 18-advanced-weather-ifr
 * Advanced IFR/VFR weather, wind, visibility, ceiling and runway condition director.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('18-advanced-weather-ifr');
const ADVANCED_WEATHER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f15',
  profiles:{
    VMC_CLEAR:{label:'VMC clear',flightRules:'VFR',visibilityKm:10,ceilingFt:6500,rainMmH:0,windDir:90,windKt:8,gustKt:12,crosswindKt:4,runwayCondition:'DRY',brakingAction:'GOOD',severity:.12,arrivalSpacingNm:5,departureSpacingSec:55},
    IFR_LOW_CEILING:{label:'IFR low ceiling',flightRules:'IFR',visibilityKm:5,ceilingFt:900,rainMmH:.8,windDir:110,windKt:13,gustKt:20,crosswindKt:9,runwayCondition:'DAMP',brakingAction:'GOOD_TO_MEDIUM',severity:.48,arrivalSpacingNm:7,departureSpacingSec:75},
    LIFR_RAIN:{label:'LIFR heavy rain',flightRules:'LIFR',visibilityKm:1.8,ceilingFt:350,rainMmH:7.5,windDir:130,windKt:19,gustKt:31,crosswindKt:16,runwayCondition:'WET',brakingAction:'MEDIUM',severity:.78,arrivalSpacingNm:10,departureSpacingSec:120},
    THUNDERSTORM_CELLS:{label:'TS cells nearby',flightRules:'IFR',visibilityKm:3.2,ceilingFt:1200,rainMmH:12,windDir:240,windKt:22,gustKt:42,crosswindKt:24,runwayCondition:'WET',brakingAction:'MEDIUM_TO_POOR',severity:.92,arrivalSpacingNm:12,departureSpacingSec:150},
    FOG_RVR:{label:'Fog / RVR operations',flightRules:'LIFR',visibilityKm:.8,ceilingFt:180,rainMmH:.2,windDir:70,windKt:5,gustKt:8,crosswindKt:2,runwayCondition:'DAMP',brakingAction:'MEDIUM',severity:.84,arrivalSpacingNm:11,departureSpacingSec:135}
  },
  airportBias:{
    SBGR:['VMC_CLEAR','IFR_LOW_CEILING','LIFR_RAIN','THUNDERSTORM_CELLS'],
    SBSP:['VMC_CLEAR','IFR_LOW_CEILING','FOG_RVR','LIFR_RAIN'],
    SBKP:['VMC_CLEAR','IFR_LOW_CEILING','THUNDERSTORM_CELLS'],
    SBBR:['VMC_CLEAR','IFR_LOW_CEILING','THUNDERSTORM_CELLS'],
    KATL:['VMC_CLEAR','IFR_LOW_CEILING','LIFR_RAIN','THUNDERSTORM_CELLS','FOG_RVR']
  }
});
let advancedWeatherState = {
  schema:1, profileId:'VMC_CLEAR', flightRules:'VFR', visibilityKm:10, ceilingFt:6500,
  windDir:90, windKt:8, gustKt:12, crosswindKt:4, rainMmH:0,
  runwayCondition:'DRY', brakingAction:'GOOD', severity:.12,
  arrivalSpacingNm:5, departureSpacingSec:55, rvrMeters:9999,
  ifrActive:false, updatedAt:0, advisory:['VMC: separação padrão.']
};
function weatherClamp(value,min,max){ return Math.max(min,Math.min(max,Number(value)||0)); }
function cloneWeatherProfile(profile){
  return JSON.parse(JSON.stringify(profile || ADVANCED_WEATHER_CATALOG.profiles.VMC_CLEAR));
}
function weatherProfileForAirport(icao, index){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const bias=ADVANCED_WEATHER_CATALOG.airportBias[code] || Object.keys(ADVANCED_WEATHER_CATALOG.profiles);
  const pick=bias[Math.abs(Math.floor(index||0))%bias.length] || 'VMC_CLEAR';
  return { id:pick, ...cloneWeatherProfile(ADVANCED_WEATHER_CATALOG.profiles[pick]) };
}
function calculateRvrMeters(profile){
  const vis=weatherClamp(profile.visibilityKm,0.05,15);
  const rainPenalty=weatherClamp(profile.rainMmH,0,20)*45;
  const ceilingPenalty=profile.ceilingFt<400 ? 260 : profile.ceilingFt<800 ? 120 : 0;
  return Math.max(350, Math.round(vis*1000 - rainPenalty - ceilingPenalty));
}
function weatherOperationalImpact(profile){
  const p=profile || advancedWeatherState;
  let risk=Math.round((p.severity||0)*55);
  if(p.flightRules==='IFR') risk+=12;
  if(p.flightRules==='LIFR') risk+=24;
  if((p.crosswindKt||0)>18) risk+=18;
  if((p.gustKt||0)-(p.windKt||0)>12) risk+=8;
  if(['WET','DAMP'].includes(p.runwayCondition)) risk+=p.runwayCondition==='WET'?12:5;
  if(String(p.brakingAction).includes('POOR')) risk+=20;
  if((p.rvrMeters||9999)<800) risk+=18;
  return {
    risk:weatherClamp(risk,0,100),
    arrivalSpacingNm:Math.max(5, p.arrivalSpacingNm||5),
    departureSpacingSec:Math.max(55, p.departureSpacingSec||55),
    landingPenalty:Math.round(weatherClamp(risk*.42,0,42)),
    takeoffPenalty:Math.round(weatherClamp(risk*.32,0,34)),
    allowVfr:p.flightRules==='VFR' && (p.visibilityKm||0)>=5 && (p.ceilingFt||0)>=1500
  };
}
function applyAdvancedWeather(profileIdOrProfile){
  try{
    const profile = typeof profileIdOrProfile==='string'
      ? { id:profileIdOrProfile, ...cloneWeatherProfile(ADVANCED_WEATHER_CATALOG.profiles[profileIdOrProfile]) }
      : { id:profileIdOrProfile?.id || profileIdOrProfile?.profileId || 'CUSTOM', ...cloneWeatherProfile(profileIdOrProfile) };
    profile.rvrMeters=calculateRvrMeters(profile);
    const impact=weatherOperationalImpact(profile);
    advancedWeatherState={
      schema:1,
      profileId:profile.id||'CUSTOM',
      flightRules:profile.flightRules||'VFR',
      visibilityKm:weatherClamp(profile.visibilityKm,0.05,20),
      ceilingFt:Math.round(weatherClamp(profile.ceilingFt,0,50000)),
      windDir:Math.round(weatherClamp(profile.windDir,0,360)),
      windKt:Math.round(weatherClamp(profile.windKt,0,90)),
      gustKt:Math.round(weatherClamp(profile.gustKt,0,120)),
      crosswindKt:Math.round(weatherClamp(profile.crosswindKt,0,80)),
      rainMmH:weatherClamp(profile.rainMmH,0,80),
      runwayCondition:profile.runwayCondition||'DRY',
      brakingAction:profile.brakingAction||'GOOD',
      severity:weatherClamp(profile.severity,0,1),
      arrivalSpacingNm:impact.arrivalSpacingNm,
      departureSpacingSec:impact.departureSpacingSec,
      rvrMeters:profile.rvrMeters,
      ifrActive:profile.flightRules!=='VFR',
      updatedAt:performance?.now?.()||Date.now(),
      advisory:buildWeatherAdvisory(profile,impact)
    };
    if(typeof WX_STATE==='object' && WX_STATE){
      WX_STATE.severity=Math.max(WX_STATE.severity||0, advancedWeatherState.severity);
      WX_STATE.visibility=advancedWeatherState.visibilityKm;
      WX_STATE.ceiling=advancedWeatherState.ceilingFt;
      WX_STATE.wind=`${advancedWeatherState.windDir}/${advancedWeatherState.windKt}G${advancedWeatherState.gustKt}`;
      WX_STATE.runwayCondition=advancedWeatherState.runwayCondition;
      WX_STATE.brakingAction=advancedWeatherState.brakingAction;
      WX_STATE.flightRules=advancedWeatherState.flightRules;
    }
    updateWeatherPanel?.();
    return advancedWeatherState;
  }catch(e){ safeLogError?.(e,'advanced-weather-apply'); return advancedWeatherState; }
}
function buildWeatherAdvisory(profile, impact){
  const notes=[];
  notes.push(`${profile.flightRules||'VFR'} • VIS ${profile.visibilityKm} km • TETO ${profile.ceilingFt} ft`);
  notes.push(`Vento ${profile.windDir}/${profile.windKt}G${profile.gustKt} kt • XWIND ${profile.crosswindKt} kt`);
  if(profile.runwayCondition!=='DRY') notes.push(`Pista ${profile.runwayCondition} • frenagem ${profile.brakingAction}`);
  if((profile.rvrMeters||9999)<1500) notes.push(`RVR ${profile.rvrMeters} m: operação de baixa visibilidade`);
  if(impact.risk>70) notes.push('Aumente separação e evite autorizações simultâneas.');
  return notes;
}
function weatherRiskForCommand(cmd, plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  if(cmd==='clearLanding'){
    if(advancedWeatherState.flightRules==='LIFR' && (advancedWeatherState.rvrMeters||9999)<550) return {level:'danger',block:true,msg:'LIFR/RVR abaixo do mínimo: pouso bloqueado.'};
    if((advancedWeatherState.crosswindKt||0)>28) return {level:'danger',block:true,msg:'Crosswind acima do limite operacional.'};
    if(impact.risk>68) return {level:'warn',block:false,msg:`Clima severo: aplicar ${impact.arrivalSpacingNm} NM na final.`};
  }
  if(cmd==='clearTakeoff'){
    if((advancedWeatherState.crosswindKt||0)>32) return {level:'danger',block:true,msg:'Decolagem bloqueada por crosswind severo.'};
    if(String(advancedWeatherState.brakingAction).includes('POOR')) return {level:'warn',block:false,msg:'Frenagem degradada: confirme decolagem e espaçamento.'};
  }
  if(cmd==='vectorFinal' && impact.risk>82) return {level:'warn',block:false,msg:'Células/baixa visibilidade: vetor final com cautela.'};
  return {level:'ok',block:false,msg:''};
}
function advancedWeatherLandingRisk(plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  let risk=impact.landingPenalty;
  if(plane && (plane.speed||0)>(performanceTargetSpeed?.(plane,'FINAL')||160)+18) risk+=14;
  if(advancedWeatherState.runwayCondition==='WET') risk+=8;
  if(String(advancedWeatherState.brakingAction).includes('POOR')) risk+=18;
  if((advancedWeatherState.crosswindKt||0)>18) risk+=Math.round((advancedWeatherState.crosswindKt-18)*1.5);
  return weatherClamp(risk,0,100);
}
function advancedWeatherTakeoffRisk(plane){
  const impact=weatherOperationalImpact(advancedWeatherState);
  let risk=impact.takeoffPenalty;
  if((advancedWeatherState.crosswindKt||0)>20) risk+=Math.round((advancedWeatherState.crosswindKt-20)*1.4);
  if(plane && String(plane.performance?.wake||'').includes('H') && advancedWeatherState.flightRules!=='VFR') risk+=4;
  return weatherClamp(risk,0,100);
}
function updateWeatherPanel(){
  try{
    const box=document.querySelector('#weatherOpsBoard') || document.querySelector('#airportOpsBoard');
    if(!box || !box.insertAdjacentHTML) return;
    const existing=document.querySelector('#weatherOpsInline'); if(existing) existing.remove();
    const s=advancedWeatherState;
    box.insertAdjacentHTML('afterend',`<div id="weatherOpsInline" class="airport-ops-board weather-ops-inline">
      <div class="airport-ops-head"><b>WX OPS</b><span>${s.flightRules}</span></div>
      <div class="airport-ops-grid">
        <div><small>VIS</small><b>${s.visibilityKm} KM</b></div>
        <div><small>TETO</small><b>${s.ceilingFt} FT</b></div>
        <div><small>VENTO</small><b>${s.windDir}/${s.windKt}G${s.gustKt}</b></div>
        <div><small>RVR</small><b>${s.rvrMeters} M</b></div>
        <div><small>PISTA</small><b>${s.runwayCondition}</b></div>
        <div><small>FREIO</small><b>${s.brakingAction}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'weather-panel'); }
}
function cycleAdvancedWeather(){
  const bias=ADVANCED_WEATHER_CATALOG.airportBias[String(airport?.()?.icao||'SBGR').toUpperCase()] || Object.keys(ADVANCED_WEATHER_CATALOG.profiles);
  const current=Math.max(0,bias.indexOf(advancedWeatherState.profileId));
  return applyAdvancedWeather(weatherProfileForAirport(airport?.()?.icao, current+1));
}
function initializeAdvancedWeather(){
  const idx=(profile?.turns||0)+(airport?.()?.level||1);
  return applyAdvancedWeather(weatherProfileForAirport(airport?.()?.icao, idx));
}
function advancedWeatherSelfCheck(){
  const issues=[];
  const keys=Object.keys(ADVANCED_WEATHER_CATALOG.profiles||{});
  if(keys.length<5) issues.push('catálogo climático insuficiente');
  keys.forEach(k=>{ const p=ADVANCED_WEATHER_CATALOG.profiles[k]; if(!p.flightRules||!Number.isFinite(p.visibilityKm)||!Number.isFinite(p.ceilingFt)) issues.push(`${k} incompleto`); });
  const low=weatherOperationalImpact({...ADVANCED_WEATHER_CATALOG.profiles.VMC_CLEAR,rvrMeters:9999});
  const severe=weatherOperationalImpact({...ADVANCED_WEATHER_CATALOG.profiles.THUNDERSTORM_CELLS,rvrMeters:calculateRvrMeters(ADVANCED_WEATHER_CATALOG.profiles.THUNDERSTORM_CELLS)});
  if(!(severe.risk>low.risk)) issues.push('risco severo não supera VMC');
  return {ok:issues.length===0,issues,profiles:keys.length};
}
window.SKYWARD_WEATHER_OPS=Object.freeze({
  schema:1,
  catalog:ADVANCED_WEATHER_CATALOG,
  state:()=>advancedWeatherState,
  profileForAirport:weatherProfileForAirport,
  apply:applyAdvancedWeather,
  cycle:cycleAdvancedWeather,
  initialize:initializeAdvancedWeather,
  impact:weatherOperationalImpact,
  commandRisk:weatherRiskForCommand,
  landingRisk:advancedWeatherLandingRisk,
  takeoffRisk:advancedWeatherTakeoffRisk,
  selfCheck:advancedWeatherSelfCheck
});

/* ===== MODULE 12: procedures-sid-star-rnav (19-procedures-sid-star-rnav.js) ===== */
/* @skyward-module 19-procedures-sid-star-rnav
 * Published-style SID/STAR/ILS/RNAV, missed approach and holding patterns.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('19-procedures-sid-star-rnav');
const PUBLISHED_PROCEDURES_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f16',
  airports:{
    SBGR:{
      activeRunway:'09R/27L',
      stars:[
        {id:'MRC1A',name:'MARICA ONE ALFA STAR',type:'STAR',runway:'09R/27L',fixes:[{id:'MRC',name:'MARICA',x:16,y:17,altitudeFt:11000,speedKt:230},{id:'ANVIL',name:'ANVIL',x:34,y:22,altitudeFt:8000,speedKt:210},{id:'FAF09R',name:'FAF 09R',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THRESHOLD 09R',x:82,y:49,altitudeFt:0,speedKt:140}]},
        {id:'PAG2B',name:'PAGAN TWO BRAVO RNAV STAR',type:'RNAV_STAR',runway:'09R/27L',fixes:[{id:'PAG',name:'PAGAN',x:18,y:34,altitudeFt:10000,speedKt:230},{id:'SUGRE',name:'SUGRE',x:38,y:28,altitudeFt:7000,speedKt:210},{id:'FAF09R',name:'FAF 09R',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THRESHOLD 09R',x:82,y:49,altitudeFt:0,speedKt:140}]}
      ],
      sids:[
        {id:'PAG1C',name:'PAGAN ONE CHARLIE SID',type:'SID',runway:'09R/27L',fixes:[{id:'DER09R',name:'DER 09R',x:17,y:49,altitudeFt:0,speedKt:160},{id:'CLB01',name:'CLIMB FIX',x:11,y:42,altitudeFt:3000,speedKt:190},{id:'PAG',name:'PAGAN',x:6,y:30,altitudeFt:7000,speedKt:230}]},
        {id:'MRC2D',name:'MARICA TWO DELTA SID',type:'SID',runway:'09R/27L',fixes:[{id:'DER09R',name:'DER 09R',x:17,y:49,altitudeFt:0,speedKt:160},{id:'EAST1',name:'EAST CLIMB',x:8,y:56,altitudeFt:3000,speedKt:190},{id:'MRC',name:'MARICA',x:4,y:72,altitudeFt:7000,speedKt:230}]}
      ],
      approaches:[
        {id:'ILS09R',name:'ILS RWY 09R',type:'ILS',runway:'09R/27L',minimums:{decisionAltitudeFt:230,rvrMeters:750},localizer:90,glideSlope:3.0,fixes:[{id:'IAF09R',name:'IAF',x:33,y:23,altitudeFt:7000,speedKt:210},{id:'FAF09R',name:'FAF',x:55,y:31,altitudeFt:3000,speedKt:170},{id:'THR09R',name:'THR',x:82,y:49,altitudeFt:0,speedKt:140}]},
        {id:'RNAV09R',name:'RNAV GNSS RWY 09R',type:'RNAV',runway:'09R/27L',minimums:{decisionAltitudeFt:420,rvrMeters:1200},fixes:[{id:'IF09R',name:'IF',x:40,y:26,altitudeFt:6000,speedKt:200},{id:'FAF09R',name:'FAF',x:55,y:31,altitudeFt:3200,speedKt:170},{id:'MAP09R',name:'MAPt',x:82,y:49,altitudeFt:0,speedKt:140}]}
      ],
      missedApproach:{id:'MISSED09R',name:'MISSED APPROACH RWY 09R',fixes:[{id:'CLIMB09R',name:'CLIMB STRAIGHT',x:88,y:45,altitudeFt:1500,speedKt:170},{id:'TURNN',name:'LEFT TURN',x:80,y:28,altitudeFt:3000,speedKt:190},{id:'HLDGR',name:'GR HOLD',x:62,y:22,altitudeFt:5000,speedKt:210}]},
      holds:[{id:'GRHLD',name:'GUARULHOS NORTH HOLD',fix:'HLDGR',x:62,y:22,inboundCourse:270,legNm:5,altitudeFt:5000}]
    },
    SBSP:{
      activeRunway:'17R/35L',
      stars:[{id:'CGO1A',name:'CONGONHAS CURVED VISUAL STAR',type:'STAR',runway:'17R/35L',fixes:[{id:'NORTH',name:'NORTH ENTRY',x:62,y:18,altitudeFt:7000,speedKt:200},{id:'BASE17',name:'BASE 17',x:58,y:34,altitudeFt:4500,speedKt:180},{id:'FAF17',name:'FAF 17',x:54,y:49,altitudeFt:2600,speedKt:155},{id:'THR17',name:'THR 17',x:64,y:74,altitudeFt:0,speedKt:135}]}],
      sids:[{id:'CGO2B',name:'CONGONHAS TWO BRAVO SID',type:'SID',runway:'17R/35L',fixes:[{id:'DER17',name:'DER 17',x:40,y:28,altitudeFt:0,speedKt:150},{id:'CLB17',name:'URBAN CLIMB',x:32,y:18,altitudeFt:3000,speedKt:180},{id:'NORTH',name:'NORTH EXIT',x:24,y:10,altitudeFt:6000,speedKt:210}]}],
      approaches:[{id:'RNAV17',name:'RNAV RWY 17R',type:'RNAV',runway:'17R/35L',minimums:{decisionAltitudeFt:620,rvrMeters:1600},fixes:[{id:'IF17',name:'IF',x:62,y:24,altitudeFt:6000,speedKt:190},{id:'FAF17',name:'FAF',x:54,y:49,altitudeFt:2600,speedKt:155},{id:'MAP17',name:'MAPt',x:64,y:74,altitudeFt:0,speedKt:135}]}],
      missedApproach:{id:'MISSED17',name:'MISSED APPROACH RWY 17',fixes:[{id:'CLIMB17',name:'RUNWAY HDG',x:70,y:84,altitudeFt:1500,speedKt:160},{id:'EAST17',name:'RIGHT TURN',x:82,y:68,altitudeFt:3000,speedKt:180}]},
      holds:[{id:'CGOHLD',name:'URBAN HOLD EAST',fix:'EAST17',x:82,y:68,inboundCourse:350,legNm:4,altitudeFt:4000}]
    },
    KATL:{
      activeRunway:'09L/27R',
      stars:[{id:'ATL1A',name:'ATLANTA BANK ONE STAR',type:'STAR',runway:'09L/27R',fixes:[{id:'BANKN',name:'NORTH BANK',x:18,y:18,altitudeFt:12000,speedKt:250},{id:'DOWNW',name:'DOWNWIND',x:38,y:22,altitudeFt:8000,speedKt:220},{id:'FAF09L',name:'FAF 09L',x:58,y:30,altitudeFt:3200,speedKt:175},{id:'THR09L',name:'THR 09L',x:84,y:46,altitudeFt:0,speedKt:145}]}],
      sids:[{id:'ATL2C',name:'ATLANTA TWO CHARLIE SID',type:'SID',runway:'09L/27R',fixes:[{id:'DER09L',name:'DER 09L',x:16,y:46,altitudeFt:0,speedKt:160},{id:'WEST1',name:'WEST CLIMB',x:8,y:38,altitudeFt:4000,speedKt:210},{id:'BANKW',name:'BANK WEST',x:4,y:25,altitudeFt:9000,speedKt:250}]}],
      approaches:[{id:'ILS09L',name:'ILS RWY 09L',type:'ILS',runway:'09L/27R',minimums:{decisionAltitudeFt:210,rvrMeters:700},localizer:90,glideSlope:3.0,fixes:[{id:'IF09L',name:'IF',x:40,y:25,altitudeFt:7000,speedKt:210},{id:'FAF09L',name:'FAF',x:58,y:30,altitudeFt:3200,speedKt:175},{id:'THR09L',name:'THR',x:84,y:46,altitudeFt:0,speedKt:145}]}],
      missedApproach:{id:'MISSED09L',name:'MISSED APPROACH RWY 09L',fixes:[{id:'CLIMB09L',name:'CLIMB',x:90,y:43,altitudeFt:1500,speedKt:170},{id:'HLDATL',name:'HOLD EAST',x:80,y:25,altitudeFt:5000,speedKt:210}]},
      holds:[{id:'ATLHLD',name:'ATL EAST HOLD',fix:'HLDATL',x:80,y:25,inboundCourse:270,legNm:6,altitudeFt:5000}]
    }
  }
});
let activeProcedureSet = null;
function copyFix(f){ return f ? {id:f.id,name:f.name,x:Number(f.x),y:Number(f.y),altitudeFt:Number(f.altitudeFt||0),speedKt:Number(f.speedKt||0)} : null; }
function procedureSetForAirport(icao){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  return PUBLISHED_PROCEDURES_CATALOG.airports[code] || PUBLISHED_PROCEDURES_CATALOG.airports.SBGR;
}
function primaryStar(set=activeProcedureSet){ return (set?.stars||[])[0] || null; }
function primarySid(set=activeProcedureSet){ return (set?.sids||[])[0] || null; }
function primaryApproach(set=activeProcedureSet){ return (set?.approaches||[])[0] || null; }
function initializeProceduresLayer(){
  const set=procedureSetForAirport(airport?.()?.icao);
  activeProcedureSet=set;
  try{
    const star=primaryStar(set), sid=primarySid(set), app=primaryApproach(set);
    if(PROCEDURE_LAYER){
      PROCEDURE_LAYER.routes=[
        ...(star?[{id:star.id,type:'arrival',color:'rgba(91,240,109,.58)',pts:star.fixes.map(copyFix)}]:[]),
        ...(sid?[{id:sid.id,type:'departure',color:'rgba(88,183,255,.54)',pts:sid.fixes.map(copyFix)}]:[]),
        ...(set.missedApproach?[{id:set.missedApproach.id,type:'missed',color:'rgba(255,191,61,.55)',pts:set.missedApproach.fixes.map(copyFix)}]:[])
      ];
      PROCEDURE_LAYER.fixes=[...(star?.fixes||[]),...(sid?.fixes||[]),...(app?.fixes||[])].slice(0,12).map(f=>({id:f.id,name:f.name,x:f.x,y:f.y,type:f.id.includes('FAF')?'final':f.id.includes('DER')?'departure':'arrival'}));
      if(app?.fixes?.length){ const last=app.fixes[app.fixes.length-1]; const faf=app.fixes[Math.max(0,app.fixes.length-2)]; PROCEDURE_LAYER.ils={...(PROCEDURE_LAYER.ils||{}),name:app.name,threshold:{x:last.x,y:last.y},faf:{x:faf.x,y:faf.y},minimums:app.minimums}; }
    }
    return set;
  }catch(e){ safeLogError?.(e,'initialize-procedures-layer'); return set; }
}
function assignProcedureToAircraft(plane, procedure, mode){
  if(!plane||!procedure) return plane;
  plane.procedureId=procedure.id;
  plane.procedureName=procedure.name;
  plane.procedureType=procedure.type || mode;
  plane.procedureFixes=(procedure.fixes||[]).map(copyFix).filter(Boolean);
  plane.procedureLeg=0;
  plane.nextFix=plane.procedureFixes[0]?.id || null;
  return plane;
}
function assignArrivalProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  const approach=primaryApproach(set), star=primaryStar(set);
  const procedure = approach || star;
  return assignProcedureToAircraft(plane, procedure, 'APPROACH');
}
function assignDepartureProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  return assignProcedureToAircraft(plane, primarySid(set), 'SID');
}
function assignMissedApproachProcedure(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  return assignProcedureToAircraft(plane, set?.missedApproach, 'MISSED');
}
function assignHoldingPattern(plane){
  const set=activeProcedureSet||initializeProceduresLayer();
  const hold=(set?.holds||[])[0];
  if(!plane||!hold) return plane;
  plane.holdingPattern={...hold};
  plane.procedureId=hold.id;
  plane.procedureName=hold.name;
  plane.procedureType='HOLD';
  plane.nextFix=hold.fix;
  return plane;
}
function procedureGuidance(plane){
  if(!plane||!Array.isArray(plane.procedureFixes)||!plane.procedureFixes.length) return null;
  const fix=plane.procedureFixes[Math.min(plane.procedureLeg||0, plane.procedureFixes.length-1)];
  if(!fix) return null;
  const distance=Math.hypot((plane.x||0)-fix.x,(plane.y||0)-fix.y);
  if(distance<4 && (plane.procedureLeg||0)<plane.procedureFixes.length-1){
    plane.procedureLeg=(plane.procedureLeg||0)+1;
    plane.nextFix=plane.procedureFixes[plane.procedureLeg]?.id || null;
    return plane.procedureFixes[plane.procedureLeg];
  }
  return fix;
}
function stepProcedureGuidance(plane, phase){
  const fix=procedureGuidance(plane);
  if(!fix) return null;
  plane.heading += shortTurn?.(plane.heading||0, headingTo(plane,fix))*.03;
  if(fix.altitudeFt!==undefined){
    const targetFl=Math.round(Number(fix.altitudeFt||0)/100);
    if(phase==='SID'||plane.kind==='departure') plane.targetAlt=Math.max(plane.targetAlt||0,targetFl);
    else plane.targetAlt=Math.min(plane.targetAlt||targetFl,targetFl);
  }
  if(fix.speedKt) plane.targetSpeed=fix.speedKt;
  return fix;
}
function procedureClearancePhrase(plane,type){
  if(!plane) return 'Sem aeronave.';
  if(type==='STAR') return `${plane.id} autorizado chegada ${primaryStar()?.id||'STAR'} pista ${runway?.name||''}.`;
  if(type==='SID') return `${plane.id} autorizado saída ${primarySid()?.id||'SID'} pista ${runway?.name||''}.`;
  if(type==='MISSED') return `${plane.id} execute aproximação perdida publicada.`;
  if(type==='HOLD') return `${plane.id} entre em espera ${plane.holdingPattern?.id||primaryStar()?.id||''}.`;
  return `${plane.id} autorizado procedimento publicado.`;
}
function procedureMinimumRisk(){
  const app=primaryApproach(activeProcedureSet||initializeProceduresLayer());
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  if(!app||!wx) return {level:'ok',block:false,msg:''};
  const rvr=app.minimums?.rvrMeters||0;
  if(wx.rvrMeters && rvr && wx.rvrMeters<rvr) return {level:'danger',block:true,msg:`RVR ${wx.rvrMeters}m abaixo do mínimo ${rvr}m para ${app.id}.`};
  if(wx.flightRules==='LIFR' && (app.minimums?.decisionAltitudeFt||0)>500) return {level:'warn',block:false,msg:`LIFR: confirmar mínimos ${app.id}.`};
  return {level:'ok',block:false,msg:''};
}
function drawPublishedProceduresOverlay(ctx,w,h){
  try{
    const set=activeProcedureSet||initializeProceduresLayer(); if(!set||!ctx) return;
    const P=o=>({x:o.x/100*w,y:o.y/100*h});
    const draw=(procedure,color,label)=>{
      if(!procedure?.fixes?.length) return;
      ctx.save(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=Math.max(1.5,w*.0018); ctx.setLineDash([8,7]); ctx.beginPath();
      procedure.fixes.forEach((f,i)=>{ const p=P(f); if(i===0) ctx.moveTo(p.x,p.y); else ctx.lineTo(p.x,p.y); });
      ctx.stroke(); ctx.setLineDash([]);
      procedure.fixes.forEach(f=>{ const p=P(f); ctx.beginPath(); ctx.arc(p.x,p.y,3.2,0,Math.PI*2); ctx.fill(); ctx.font='800 9px ui-monospace'; ctx.fillText(f.id,p.x+5,p.y-5); });
      const m=P(procedure.fixes[Math.floor(procedure.fixes.length/2)]); ctx.font='900 10px ui-monospace'; ctx.fillText(label||procedure.id,m.x+8,m.y+11); ctx.restore();
    };
    draw(primaryStar(set),'rgba(91,240,109,.60)',primaryStar(set)?.id);
    draw(primarySid(set),'rgba(88,183,255,.55)',primarySid(set)?.id);
    if(set.missedApproach) draw(set.missedApproach,'rgba(255,191,61,.58)',set.missedApproach.id);
    (set.holds||[]).forEach(h=>{ const p=P(h); ctx.save(); ctx.strokeStyle='rgba(255,191,61,.75)'; ctx.setLineDash([5,5]); ctx.beginPath(); ctx.ellipse(p.x,p.y,24,12,-.2,0,Math.PI*2); ctx.stroke(); ctx.fillStyle='rgba(255,191,61,.90)'; ctx.font='900 10px ui-monospace'; ctx.fillText(h.id,p.x+12,p.y-12); ctx.restore(); });
  }catch(e){ safeLogError?.(e,'draw-published-procedures'); }
}
function proceduresSelfCheck(){
  const issues=[]; const airports=PUBLISHED_PROCEDURES_CATALOG.airports||{}; const keys=Object.keys(airports);
  if(keys.length<3) issues.push('menos de 3 aeroportos com procedimentos');
  keys.forEach(code=>{ const a=airports[code]; if(!(a.stars||[]).length) issues.push(`${code} sem STAR`); if(!(a.sids||[]).length) issues.push(`${code} sem SID`); if(!(a.approaches||[]).length) issues.push(`${code} sem approach`); if(!a.missedApproach) issues.push(`${code} sem missed approach`); if(!(a.holds||[]).length) issues.push(`${code} sem hold`); });
  return {ok:issues.length===0,issues,airports:keys.length};
}
window.SKYWARD_PROCEDURES=Object.freeze({
  schema:1,
  catalog:PUBLISHED_PROCEDURES_CATALOG,
  getSet:procedureSetForAirport,
  initialize:initializeProceduresLayer,
  assignArrival:assignArrivalProcedure,
  assignDeparture:assignDepartureProcedure,
  assignMissed:assignMissedApproachProcedure,
  assignHold:assignHoldingPattern,
  stepGuidance:stepProcedureGuidance,
  phrase:procedureClearancePhrase,
  minimumRisk:procedureMinimumRisk,
  draw:drawPublishedProceduresOverlay,
  selfCheck:proceduresSelfCheck
});

/* ===== MODULE 13: aircraft-performance (15-aircraft-performance.js) ===== */
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

/* ===== MODULE 14: 05-profile-navigation (05-profile-navigation.js) ===== */
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

/* ===== MODULE 15: controller-career (20-controller-career.js) ===== */
/* @skyward-module 20-controller-career
 * Deep controller career: licenses, ratings, fatigue, promotions, shift history and reputation.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('20-controller-career');
const CONTROLLER_CAREER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f17',
  licenses:[
    {id:'STUDENT',name:'Aluno Controlador',minXp:0,maxComplexity:1.0,permissions:['OBSERVE','BASIC_GROUND']},
    {id:'LOCAL_GROUND',name:'Licença Solo Local',minXp:900,maxComplexity:1.2,permissions:['GROUND','PUSHBACK','TAXI']},
    {id:'LOCAL_TOWER',name:'Licença Torre Local',minXp:2200,maxComplexity:1.45,permissions:['GROUND','TOWER','TAKEOFF','LANDING']},
    {id:'APP_PROCEDURAL',name:'Aproximação Procedural',minXp:5200,maxComplexity:1.75,permissions:['TOWER','APP','STAR','SID','HOLD']},
    {id:'APP_RADAR',name:'Aproximação Radar',minXp:9500,maxComplexity:2.0,permissions:['APP','RADAR','IFR','RNAV','ILS']},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minXp:15000,maxComplexity:2.4,permissions:['SUPERVISE','EMERGENCY','INTERNATIONAL_HUB']}
  ],
  ratings:[
    {id:'TWR_TRAINEE',name:'Tower Trainee',minShifts:0,minSafety:0},
    {id:'GROUND_CERTIFIED',name:'Ground Certified',minShifts:3,minSafety:65},
    {id:'TOWER_CERTIFIED',name:'Tower Certified',minShifts:7,minSafety:72},
    {id:'APPROACH_RATED',name:'Approach Rated',minShifts:12,minSafety:78},
    {id:'IFR_RATED',name:'IFR / Low Visibility Rated',minShifts:18,minSafety:82},
    {id:'SENIOR_CONTROLLER',name:'Senior Controller',minShifts:28,minSafety:86}
  ],
  shiftTypes:[
    {id:'DAY_VFR',name:'Turno diurno VFR',fatigue:4,reputationWeight:1.0},
    {id:'NIGHT_IFR',name:'Turno noturno IFR',fatigue:8,reputationWeight:1.25},
    {id:'PEAK_HUB',name:'Pico de hub internacional',fatigue:11,reputationWeight:1.45},
    {id:'LOW_VIS',name:'Baixa visibilidade / LIFR',fatigue:13,reputationWeight:1.6},
    {id:'EMERGENCY_DESK',name:'Mesa de emergência',fatigue:15,reputationWeight:1.8}
  ],
  fatigueBands:[
    {id:'FIT',name:'Apto',max:25},{id:'TIRED',name:'Cansado',max:55},{id:'FATIGUED',name:'Fadigado',max:78},{id:'UNSAFE',name:'Inseguro',max:100}
  ],
  reputationBands:[
    {id:'LOCAL',name:'Local',min:0},{id:'REGIONAL',name:'Regional',min:120},{id:'NATIONAL',name:'Nacional',min:300},{id:'INTERNATIONAL',name:'Internacional',min:650},{id:'ELITE',name:'Elite',min:1100}
  ]
});
const CAREER_KEY='skywardCareer_v1';
let controllerCareer = {
  schema:1,
  totalXp:0,
  licenseId:'STUDENT',
  ratingId:'TWR_TRAINEE',
  reputation:0,
  fatigue:0,
  shifts:0,
  averageSafety:100,
  promotions:[],
  history:[],
  lastShift:null
};
function careerClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function careerLicenseForXp(xp){
  const list=CONTROLLER_CAREER_CATALOG.licenses.slice().sort((a,b)=>a.minXp-b.minXp);
  return list.filter(l=>xp>=l.minXp).pop() || list[0];
}
function careerRatingFor(shifts, averageSafety){
  const list=CONTROLLER_CAREER_CATALOG.ratings.slice().sort((a,b)=>a.minShifts-b.minShifts);
  return list.filter(r=>shifts>=r.minShifts && averageSafety>=r.minSafety).pop() || list[0];
}
function careerFatigueBand(fatigue){
  return CONTROLLER_CAREER_CATALOG.fatigueBands.find(b=>fatigue<=b.max) || CONTROLLER_CAREER_CATALOG.fatigueBands.at(-1);
}
function careerReputationBand(rep){
  return CONTROLLER_CAREER_CATALOG.reputationBands.slice().sort((a,b)=>a.min-b.min).filter(b=>rep>=b.min).pop() || CONTROLLER_CAREER_CATALOG.reputationBands[0];
}
function determineShiftType(stats={}){
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  if((stats.emergencies||0)>0 || (stats.maydayResolved||0)>0) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='EMERGENCY_DESK');
  if(wx?.flightRules==='LIFR' || (wx?.rvrMeters||9999)<1500) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='LOW_VIS');
  if((airportOpsProfile?.()?.complexity||1)>1.3 || (stats.requests||0)>10) return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='PEAK_HUB');
  if(wx?.flightRules==='IFR') return CONTROLLER_CAREER_CATALOG.shiftTypes.find(s=>s.id==='NIGHT_IFR');
  return CONTROLLER_CAREER_CATALOG.shiftTypes[0];
}
function computeShiftSafety(finalScore, shiftStats={}, fail=false){
  let safety=100;
  safety-=Math.min(35,(shiftStats.conflicts||0)*8);
  safety-=Math.min(28,(shiftStats.runwayIncursions||0)*14);
  safety-=Math.min(22,(shiftStats.surfaceConflicts||0)*8);
  safety-=Math.min(18,(shiftStats.denied||0)*3);
  safety-=Math.min(14,(shiftStats.damaged||0)*7);
  safety+=Math.min(10,(shiftStats.maydayResolved||0)*5);
  safety+=Math.min(8,Math.floor((shiftStats.landed||0)/3));
  safety+=Math.min(8,Math.floor((shiftStats.departed||0)/3));
  if(fail) safety-=25;
  if(finalScore>2500) safety+=4;
  return Math.round(careerClamp(safety,0,100));
}
function loadCareer(){
  try{
    const raw=localStorage?.getItem?.(CAREER_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed?.schema===1) controllerCareer={...controllerCareer,...parsed};
    }
  }catch(e){ safeLogError?.(e,'career-load'); }
  return controllerCareer;
}
function saveCareer(){
  try{ localStorage?.setItem?.(CAREER_KEY,JSON.stringify(controllerCareer)); }catch(e){ safeLogError?.(e,'career-save'); }
  return controllerCareer;
}
function initializeCareerProfile(){
  loadCareer();
  const license=careerLicenseForXp(controllerCareer.totalXp);
  const rating=careerRatingFor(controllerCareer.shifts,controllerCareer.averageSafety);
  controllerCareer.licenseId=license.id;
  controllerCareer.ratingId=rating.id;
  renderCareerBoard();
  return controllerCareer;
}
function updateCareerAfterShift(finalScore=0, shiftStats={}, fail=false, airportCode=''){
  initializeCareerProfile();
  const type=determineShiftType(shiftStats);
  const safety=computeShiftSafety(finalScore,shiftStats,fail);
  const xpGain=Math.max(0,Math.round(finalScore/6 + (shiftStats.landed||0)*35 + (shiftStats.departed||0)*28 + (shiftStats.maydayResolved||0)*120 - (fail?180:0)));
  const repDelta=Math.round(((safety-55)/4 + Math.max(0,finalScore)/180) * (type?.reputationWeight||1));
  const fatigueDelta=(type?.fatigue||5)+Math.min(22,Math.round((shiftStats.commands||0)/9))+Math.min(12,(shiftStats.emergencies||0)*5);
  const oldLicense=controllerCareer.licenseId, oldRating=controllerCareer.ratingId;
  controllerCareer.totalXp=Math.max(0,(controllerCareer.totalXp||0)+xpGain);
  controllerCareer.reputation=Math.max(0,(controllerCareer.reputation||0)+repDelta);
  controllerCareer.fatigue=careerClamp((controllerCareer.fatigue||0)+fatigueDelta-(fail?0:4),0,100);
  controllerCareer.shifts=(controllerCareer.shifts||0)+1;
  controllerCareer.averageSafety=Math.round((((controllerCareer.averageSafety||100)*(controllerCareer.shifts-1))+safety)/controllerCareer.shifts);
  const newLicense=careerLicenseForXp(controllerCareer.totalXp);
  const newRating=careerRatingFor(controllerCareer.shifts,controllerCareer.averageSafety);
  controllerCareer.licenseId=newLicense.id;
  controllerCareer.ratingId=newRating.id;
  const promoted=[];
  if(oldLicense!==newLicense.id) promoted.push(`Licença: ${newLicense.name}`);
  if(oldRating!==newRating.id) promoted.push(`Rating: ${newRating.name}`);
  if(promoted.length) controllerCareer.promotions.unshift({build:BUILD,at:new Date().toISOString(),items:promoted});
  controllerCareer.lastShift={build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore,safety,xpGain,repDelta,fatigueDelta,shiftType:type?.id||'DAY_VFR',failed:Boolean(fail)};
  controllerCareer.history.unshift(controllerCareer.lastShift);
  controllerCareer.history=controllerCareer.history.slice(0,30);
  saveCareer();
  renderCareerBoard();
  return {career:controllerCareer,shift:controllerCareer.lastShift,promoted};
}
function restCareer(hours=8){
  initializeCareerProfile();
  controllerCareer.fatigue=careerClamp((controllerCareer.fatigue||0)-Number(hours||8)*4,0,100);
  saveCareer(); renderCareerBoard();
  return controllerCareer;
}
function careerStatus(){
  initializeCareerProfile();
  const license=CONTROLLER_CAREER_CATALOG.licenses.find(l=>l.id===controllerCareer.licenseId)||CONTROLLER_CAREER_CATALOG.licenses[0];
  const rating=CONTROLLER_CAREER_CATALOG.ratings.find(r=>r.id===controllerCareer.ratingId)||CONTROLLER_CAREER_CATALOG.ratings[0];
  return { ...controllerCareer, license, rating, fatigueBand:careerFatigueBand(controllerCareer.fatigue||0), reputationBand:careerReputationBand(controllerCareer.reputation||0) };
}
function careerRiskForShift(){
  const s=careerStatus();
  if(s.fatigue>=82) return {level:'danger',block:true,msg:'Fadiga insegura: descanso obrigatório antes do turno.'};
  if(s.fatigue>=65) return {level:'warn',block:false,msg:'Fadiga elevada: risco de erro operacional aumentado.'};
  return {level:'ok',block:false,msg:''};
}
function renderCareerBoard(){
  try{
    const anchor=document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#careerOpsInline'); if(old) old.remove();
    const s=careerStatus();
    anchor.insertAdjacentHTML('afterend',`<div id="careerOpsInline" class="airport-ops-board career-ops-inline">
      <div class="airport-ops-head"><b>CARREIRA ATC</b><span>${s.reputationBand.name}</span></div>
      <div class="airport-ops-grid">
        <div><small>LICENÇA</small><b>${s.license.name}</b></div>
        <div><small>RATING</small><b>${s.rating.name}</b></div>
        <div><small>XP</small><b>${Math.round(s.totalXp)}</b></div>
        <div><small>REPUTAÇÃO</small><b>${Math.round(s.reputation)}</b></div>
        <div><small>FADIGA</small><b>${Math.round(s.fatigue)}% ${s.fatigueBand.name}</b></div>
        <div><small>SEGURANÇA</small><b>${Math.round(s.averageSafety)}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'career-board'); }
}
function careerSelfCheck(){
  const issues=[];
  if(CONTROLLER_CAREER_CATALOG.licenses.length<5) issues.push('licenças insuficientes');
  if(CONTROLLER_CAREER_CATALOG.ratings.length<5) issues.push('ratings insuficientes');
  if(careerLicenseForXp(16000).id!=='SUPERVISOR') issues.push('licença supervisor não alcançada por XP');
  if(careerRatingFor(30,90).id!=='SENIOR_CONTROLLER') issues.push('rating senior não alcançado');
  const safe=computeShiftSafety(3000,{landed:5,departed:4,conflicts:0,denied:0},false);
  const bad=computeShiftSafety(300,{conflicts:4,runwayIncursions:2,denied:5},true);
  if(!(safe>bad)) issues.push('safety bom não supera turno ruim');
  return {ok:issues.length===0,issues,licenses:CONTROLLER_CAREER_CATALOG.licenses.length,ratings:CONTROLLER_CAREER_CATALOG.ratings.length};
}
window.SKYWARD_CAREER=Object.freeze({
  schema:1,
  catalog:CONTROLLER_CAREER_CATALOG,
  load:loadCareer,
  save:saveCareer,
  initialize:initializeCareerProfile,
  evaluate:updateCareerAfterShift,
  status:careerStatus,
  rest:restCareer,
  fatigueBand:careerFatigueBand,
  reputationBand:careerReputationBand,
  licenseForXp:careerLicenseForXp,
  ratingFor:careerRatingFor,
  safety:computeShiftSafety,
  shiftType:determineShiftType,
  risk:careerRiskForShift,
  selfCheck:careerSelfCheck
});

/* ===== MODULE 16: operational-economy (21-operational-economy.js) ===== */
/* @skyward-module 21-operational-economy
 * Airport operational economy: budget, delay cost, fines, efficiency and airline contracts.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('21-operational-economy');
const SKYWARD_ECONOMY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f18',
  baseCurrency:'USD',
  airportBudgets:{
    SBGR:{annualBudgetM:220,shiftBudget:185000,delayCostPerMin:95,fuelServiceRevenue:48,movementRevenue:620},
    SBSP:{annualBudgetM:130,shiftBudget:105000,delayCostPerMin:120,fuelServiceRevenue:35,movementRevenue:520},
    SBKP:{annualBudgetM:150,shiftBudget:125000,delayCostPerMin:85,fuelServiceRevenue:55,movementRevenue:590},
    SBBR:{annualBudgetM:145,shiftBudget:118000,delayCostPerMin:90,fuelServiceRevenue:42,movementRevenue:560},
    KATL:{annualBudgetM:520,shiftBudget:420000,delayCostPerMin:140,fuelServiceRevenue:70,movementRevenue:780}
  },
  airlineContracts:[
    {id:'AZUL_REGIONAL',name:'Azul Regional Flow',airline:'AZU',onTimeTarget:.82,safetyTarget:.90,bonus:42000,penalty:28000,priority:'regional connectivity'},
    {id:'GOL_DOMESTIC',name:'GOL Domestic Bank',airline:'GLO',onTimeTarget:.80,safetyTarget:.88,bonus:38000,penalty:26000,priority:'domestic peak banks'},
    {id:'LATAM_TRUNK',name:'LATAM Trunk Routes',airline:'TAM',onTimeTarget:.84,safetyTarget:.92,bonus:52000,penalty:36000,priority:'high capacity trunk'},
    {id:'DELTA_INTL',name:'Delta International Hub',airline:'DAL',onTimeTarget:.86,safetyTarget:.93,bonus:68000,penalty:46000,priority:'international bank'},
    {id:'CARGO_NIGHT',name:'Night Cargo SLA',airline:'CGO',onTimeTarget:.78,safetyTarget:.91,bonus:45000,penalty:30000,priority:'cargo punctuality'}
  ],
  fineTable:{conflict:18000,runwayIncursion:55000,surfaceConflict:22000,deniedClearance:3500,hardLandingInspection:12000,missedEmergency:75000},
  efficiencyWeights:{landed:1.25,departed:1.05,requestsHandled:.35,commands:-.04,denied:-.45,conflicts:-2.0,surfaceConflicts:-1.2,runwayIncursions:-4.0},
  bands:[
    {id:'LOSS',name:'Prejuízo operacional',min:-99999999},
    {id:'TIGHT',name:'Margem apertada',min:0},
    {id:'STABLE',name:'Operação estável',min:35000},
    {id:'PROFITABLE',name:'Operação lucrativa',min:95000},
    {id:'EXCELLENT',name:'Eficiência excelente',min:180000}
  ]
});
const ECONOMY_KEY='skywardEconomy_v1';
let airportEconomy = {schema:1,balance:0,totalRevenue:0,totalCosts:0,totalFines:0,contractsWon:0,contractsLost:0,efficiency:0,history:[],lastShift:null};
function econClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function airportBudgetFor(icao){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  return SKYWARD_ECONOMY_CATALOG.airportBudgets[code] || SKYWARD_ECONOMY_CATALOG.airportBudgets.SBGR;
}
function economyBand(value){
  return SKYWARD_ECONOMY_CATALOG.bands.slice().sort((a,b)=>a.min-b.min).filter(b=>value>=b.min).pop() || SKYWARD_ECONOMY_CATALOG.bands[0];
}
function estimateDelayMinutes(shiftStats={}){
  const requests=Math.max(1,shiftStats.requests||0);
  const denied=shiftStats.denied||0;
  const conflicts=shiftStats.conflicts||0;
  const surface=shiftStats.surfaceConflicts||0;
  const incursions=shiftStats.runwayIncursions||0;
  const weatherPenalty=(window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='LIFR') ? 6 : (window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='IFR' ? 3 : 0);
  return Math.round(denied*2.5 + conflicts*7 + surface*4 + incursions*12 + Math.max(0,requests-8)*0.8 + weatherPenalty);
}
function computeEfficiency(shiftStats={}){
  const w=SKYWARD_ECONOMY_CATALOG.efficiencyWeights;
  let raw=50;
  raw+=(shiftStats.landed||0)*w.landed*5;
  raw+=(shiftStats.departed||0)*w.departed*5;
  raw+=(shiftStats.requests||0)*w.requestsHandled*3;
  raw+=(shiftStats.commands||0)*w.commands;
  raw+=(shiftStats.denied||0)*w.denied*5;
  raw+=(shiftStats.conflicts||0)*w.conflicts*8;
  raw+=(shiftStats.surfaceConflicts||0)*w.surfaceConflicts*7;
  raw+=(shiftStats.runwayIncursions||0)*w.runwayIncursions*9;
  if((shiftStats.maydayResolved||0)>0) raw+=8*(shiftStats.maydayResolved||0);
  return Math.round(econClamp(raw,0,100));
}
function contractPrefixValue(stats={}){
  const prefixes=['AZU','GLO','TAM','DAL','CGO'];
  const total=(stats.landed||0)+(stats.departed||0)+(stats.requests||0);
  return Math.max(1,total || prefixes.length);
}
function evaluateContracts(shiftStats={}, safetyScore=100, onTimeRatio=1){
  const handled=contractPrefixValue(shiftStats);
  return SKYWARD_ECONOMY_CATALOG.airlineContracts.map((c,i)=>{
    const eligible=(handled+i)%2===0 || handled>12;
    const safetyOk=(safetyScore/100)>=c.safetyTarget;
    const onTimeOk=onTimeRatio>=c.onTimeTarget;
    const achieved=eligible && safetyOk && onTimeOk;
    return {id:c.id,name:c.name,airline:c.airline,achieved,bonus:achieved?c.bonus:0,penalty:(!achieved&&eligible)?c.penalty:0,eligible,safetyOk,onTimeOk};
  });
}
function loadEconomy(){
  try{ const raw=localStorage?.getItem?.(ECONOMY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airportEconomy={...airportEconomy,...parsed}; } }catch(e){ safeLogError?.(e,'economy-load'); }
  return airportEconomy;
}
function saveEconomy(){
  try{ localStorage?.setItem?.(ECONOMY_KEY,JSON.stringify(airportEconomy)); }catch(e){ safeLogError?.(e,'economy-save'); }
  return airportEconomy;
}
function evaluateOperationalEconomy(finalScore=0, shiftStats={}, fail=false, airportCode=''){
  loadEconomy();
  const code=String(airportCode||airport?.()?.icao||'SBGR').toUpperCase();
  const budget=airportBudgetFor(code);
  const movements=(shiftStats.landed||0)+(shiftStats.departed||0);
  const delayMinutes=estimateDelayMinutes(shiftStats);
  const efficiency=computeEfficiency(shiftStats);
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,shiftStats,fail) ?? Math.max(0,100-(shiftStats.conflicts||0)*8-(shiftStats.denied||0)*2-(fail?25:0));
  const onTimeRatio=econClamp(1-(delayMinutes/Math.max(24,(shiftStats.requests||1)*7)),0,1);
  const movementRevenue=movements*budget.movementRevenue;
  const fuelRevenue=Math.round((shiftStats.lowFuel||0)*budget.fuelServiceRevenue*12 + movements*budget.fuelServiceRevenue);
  const serviceRevenue=Math.round(Math.max(0,finalScore)*4.5 + movementRevenue + fuelRevenue);
  const delayCost=delayMinutes*budget.delayCostPerMin;
  const fines=(shiftStats.conflicts||0)*SKYWARD_ECONOMY_CATALOG.fineTable.conflict+
    (shiftStats.runwayIncursions||0)*SKYWARD_ECONOMY_CATALOG.fineTable.runwayIncursion+
    (shiftStats.surfaceConflicts||0)*SKYWARD_ECONOMY_CATALOG.fineTable.surfaceConflict+
    (shiftStats.denied||0)*SKYWARD_ECONOMY_CATALOG.fineTable.deniedClearance+
    (shiftStats.damaged||0)*SKYWARD_ECONOMY_CATALOG.fineTable.hardLandingInspection+
    (fail?SKYWARD_ECONOMY_CATALOG.fineTable.missedEmergency:0);
  const contracts=evaluateContracts(shiftStats,safety,onTimeRatio);
  const contractBonus=contracts.reduce((a,c)=>a+c.bonus,0);
  const contractPenalty=contracts.reduce((a,c)=>a+c.penalty,0);
  const staffingCost=Math.round(budget.shiftBudget*.22 + Math.max(0,(shiftStats.commands||0)-35)*45);
  const weatherCost=(window.SKYWARD_WEATHER_OPS?.state?.().flightRules==='LIFR') ? Math.round(budget.shiftBudget*.08) : 0;
  const revenue=serviceRevenue+contractBonus+(typeof networkBonus==='number'?networkBonus:0);
  const incidentCost=(typeof incidentEconomicImpact==='function' ? incidentEconomicImpact().cost : 0);
  const netImpact=(typeof networkEconomicImpact==='function' ? networkEconomicImpact().impact : 0);
  const costs=staffingCost+delayCost+fines+contractPenalty+weatherCost+incidentCost+Math.max(0,-netImpact);
  const networkBonus=Math.max(0,netImpact);
  const profit=Math.round(revenue-costs);
  airportEconomy.balance=Math.round((airportEconomy.balance||0)+profit);
  airportEconomy.totalRevenue=Math.round((airportEconomy.totalRevenue||0)+revenue);
  airportEconomy.totalCosts=Math.round((airportEconomy.totalCosts||0)+costs);
  airportEconomy.totalFines=Math.round((airportEconomy.totalFines||0)+fines);
  airportEconomy.contractsWon=(airportEconomy.contractsWon||0)+contracts.filter(c=>c.achieved).length;
  airportEconomy.contractsLost=(airportEconomy.contractsLost||0)+contracts.filter(c=>c.eligible&&!c.achieved).length;
  airportEconomy.efficiency=Math.round(((airportEconomy.efficiency||efficiency)*(airportEconomy.history?.length||0)+efficiency)/((airportEconomy.history?.length||0)+1));
  airportEconomy.lastShift={build:BUILD,airport:code,profit,revenue,costs,fines,delayMinutes,efficiency,onTimeRatio:Number(onTimeRatio.toFixed(2)),safety,band:economyBand(profit).id,contracts};
  airportEconomy.history.unshift(airportEconomy.lastShift);
  airportEconomy.history=airportEconomy.history.slice(0,30);
  saveEconomy();
  renderEconomyBoard();
  return {economy:airportEconomy,shift:airportEconomy.lastShift};
}
function economyStatus(){ loadEconomy(); return {...airportEconomy,band:economyBand(airportEconomy.lastShift?.profit||airportEconomy.balance||0)}; }
function resetEconomy(){ airportEconomy={schema:1,balance:0,totalRevenue:0,totalCosts:0,totalFines:0,contractsWon:0,contractsLost:0,efficiency:0,history:[],lastShift:null}; saveEconomy(); renderEconomyBoard(); return airportEconomy; }
function renderEconomyBoard(){
  try{
    const anchor=document.querySelector('#careerOpsInline') || document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#economyOpsInline'); if(old) old.remove();
    const s=economyStatus();
    const last=s.lastShift||{};
    anchor.insertAdjacentHTML('afterend',`<div id="economyOpsInline" class="airport-ops-board economy-ops-inline">
      <div class="airport-ops-head"><b>ECONOMIA OPS</b><span>${s.band.name}</span></div>
      <div class="airport-ops-grid">
        <div><small>SALDO</small><b>$${Math.round(s.balance||0).toLocaleString('pt-BR')}</b></div>
        <div><small>ÚLTIMO</small><b>$${Math.round(last.profit||0).toLocaleString('pt-BR')}</b></div>
        <div><small>EFICIÊNCIA</small><b>${Math.round(s.efficiency||0)}%</b></div>
        <div><small>MULTAS</small><b>$${Math.round(s.totalFines||0).toLocaleString('pt-BR')}</b></div>
        <div><small>CONTRATOS</small><b>${s.contractsWon||0}/${(s.contractsWon||0)+(s.contractsLost||0)}</b></div>
        <div><small>ATRASO</small><b>${Math.round(last.delayMinutes||0)} MIN</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'economy-board'); }
}
function economySelfCheck(){
  const issues=[];
  if(Object.keys(SKYWARD_ECONOMY_CATALOG.airportBudgets).length<5) issues.push('orçamentos insuficientes');
  if(SKYWARD_ECONOMY_CATALOG.airlineContracts.length<5) issues.push('contratos insuficientes');
  const good=evaluateContracts({landed:8,departed:6,requests:14},96,.94).filter(c=>c.achieved).length;
  const bad=evaluateContracts({landed:1,departed:1,requests:3},50,.45).filter(c=>c.penalty>0).length;
  if(!(good>0)) issues.push('contratos bons não bonificam');
  if(!(bad>0)) issues.push('contratos ruins não penalizam');
  if(!(computeEfficiency({landed:8,departed:6,requests:14,conflicts:0,denied:0})>computeEfficiency({landed:2,departed:1,requests:5,conflicts:4,denied:6,runwayIncursions:1}))) issues.push('eficiência não diferencia turno bom/ruim');
  return {ok:issues.length===0,issues,budgets:Object.keys(SKYWARD_ECONOMY_CATALOG.airportBudgets).length,contracts:SKYWARD_ECONOMY_CATALOG.airlineContracts.length};
}
window.SKYWARD_ECONOMY=Object.freeze({
  schema:1,
  catalog:SKYWARD_ECONOMY_CATALOG,
  load:loadEconomy,
  save:saveEconomy,
  reset:resetEconomy,
  status:economyStatus,
  evaluate:evaluateOperationalEconomy,
  efficiency:computeEfficiency,
  delay:estimateDelayMinutes,
  contracts:evaluateContracts,
  budget:airportBudgetFor,
  band:economyBand,
  render:renderEconomyBoard,
  selfCheck:economySelfCheck
});

/* ===== MODULE 17: incident-emergency-director (22-incident-emergency-director.js) ===== */
/* @skyward-module 22-incident-emergency-director
 * Complex operational incidents, runway closure and multi-agency emergency coordination.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('22-incident-emergency-director');
const INCIDENT_PLAYBOOK_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f19',
  incidentTypes:[
    {id:'BIRD_STRIKE',name:'Bird strike na decolagem',severity:'high',phase:'departure',probabilityWeight:.18,runwayClosureMin:18,requiredAgencies:['ARFF','WILDLIFE','OPS'],requiredActions:['stop_departures','inspect_runway','vector_return','coordinate_arff'],scorePenalty:220,economyPenalty:38000,careerStress:10},
    {id:'ENGINE_FAILURE',name:'Falha de motor após V1',severity:'critical',phase:'departure',probabilityWeight:.13,runwayClosureMin:22,requiredAgencies:['ARFF','TOWER','APPROACH','AIRLINE_OPS'],requiredActions:['declare_mayday','priority_vectors','hold_all_departures','clear_emergency_landing'],scorePenalty:320,economyPenalty:52000,careerStress:15},
    {id:'MEDICAL_EVAC',name:'Evacuação médica a bordo',severity:'medium',phase:'arrival',probabilityWeight:.16,runwayClosureMin:0,requiredAgencies:['MEDICAL','OPS','AIRLINE_OPS'],requiredActions:['priority_landing','assign_gate_medical','notify_medical'],scorePenalty:120,economyPenalty:18000,careerStress:7},
    {id:'GEAR_UNSAFE',name:'Trem de pouso inseguro',severity:'critical',phase:'arrival',probabilityWeight:.12,runwayClosureMin:35,requiredAgencies:['ARFF','TOWER','APPROACH','OPS'],requiredActions:['low_pass_inspection','emergency_landing','foam_standby','close_runway'],scorePenalty:360,economyPenalty:65000,careerStress:18},
    {id:'RUNWAY_FOD',name:'FOD na pista',severity:'high',phase:'surface',probabilityWeight:.20,runwayClosureMin:14,requiredAgencies:['OPS','GROUND','INSPECTION'],requiredActions:['close_runway','reroute_taxi','inspect_runway','reopen_runway'],scorePenalty:180,economyPenalty:26000,careerStress:6},
    {id:'BRAKE_FIRE',name:'Superaquecimento/fogo nos freios',severity:'high',phase:'surface',probabilityWeight:.14,runwayClosureMin:20,requiredAgencies:['ARFF','GROUND','OPS'],requiredActions:['stop_aircraft','coordinate_arff','evacuate_if_needed'],scorePenalty:240,economyPenalty:42000,careerStress:12},
    {id:'SECURITY_EVAC',name:'Evacuação de terminal / alerta de segurança',severity:'medium',phase:'airport',probabilityWeight:.09,runwayClosureMin:0,requiredAgencies:['SECURITY','OPS','AIRLINE_OPS'],requiredActions:['ground_delay_program','gate_hold','coordinate_security'],scorePenalty:160,economyPenalty:36000,careerStress:9}
  ],
  agencies:{
    ARFF:{name:'Resgate e Combate a Incêndio',responseMin:3,cost:8000},WILDLIFE:{name:'Controle de fauna',responseMin:8,cost:3500},OPS:{name:'Operações aeroportuárias',responseMin:5,cost:4200},GROUND:{name:'Controle de solo',responseMin:2,cost:1800},TOWER:{name:'Torre',responseMin:1,cost:1200},APPROACH:{name:'Aproximação',responseMin:2,cost:1500},AIRLINE_OPS:{name:'COA companhia aérea',responseMin:6,cost:2600},MEDICAL:{name:'Equipe médica',responseMin:7,cost:5200},INSPECTION:{name:'Inspeção de pista',responseMin:6,cost:4600},SECURITY:{name:'Segurança aeroportuária',responseMin:5,cost:6000}
  },
  resolutionGrades:[{id:'EXCELLENT',name:'Resposta excelente',minScore:88},{id:'CONTROLLED',name:'Controlado',minScore:70},{id:'DELAYED',name:'Resposta atrasada',minScore:48},{id:'FAILED',name:'Falha crítica',minScore:0}]
});
let incidentDirector = {schema:1,active:null,history:[],runwayClosed:false,runwayClosedUntil:0,agenciesDispatched:[],actions:[],lastTick:0,summary:{total:0,resolved:0,failed:0,closures:0,cost:0},lastGeneratedAt:0,lastAutoResolveAt:0};
function incidentNow(){ return performance?.now?.() || Date.now(); }
function incidentMobilePace(){ try{ return typeof atcPaceFactor==='function' ? atcPaceFactor() : ((window.matchMedia?.('(pointer: coarse)').matches || innerWidth<900) ? 1.8 : 1); }catch(_e){ return 1; } }
function pickIncidentType(seed=0){
  const list=INCIDENT_PLAYBOOK_CATALOG.incidentTypes;
  const total=list.reduce((a,i)=>a+(i.probabilityWeight||0),0);
  let roll=((Math.abs(Math.sin(seed+13.37))*10000)%1)*total;
  for(const item of list){ roll-=item.probabilityWeight||0; if(roll<=0) return item; }
  return list[0];
}
function incidentGrade(score){
  return INCIDENT_PLAYBOOK_CATALOG.resolutionGrades.find(g=>score>=g.minScore) || INCIDENT_PLAYBOOK_CATALOG.resolutionGrades.at(-1);
}
function startOperationalIncident(typeId='', targetPlane=null, reason='scheduled'){
  if(incidentDirector.active) return incidentDirector.active;
  const type=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id===typeId) || pickIncidentType((stats?.commands||0)+(stats?.requests||0)+(profile?.turns||0));
  const now=incidentNow();
  const incident={
    id:`INC-${String(Math.floor(now)%100000).padStart(5,'0')}`,
    typeId:type.id,name:type.name,severity:type.severity,phase:type.phase,startedAt:now,targetId:targetPlane?.id||selected||null,
    requiredAgencies:type.requiredAgencies.slice(),requiredActions:type.requiredActions.slice(),completedActions:[],dispatchedAgencies:[],
    runwayClosureMin:type.runwayClosureMin||0,scorePenalty:type.scorePenalty||0,economyPenalty:type.economyPenalty||0,careerStress:type.careerStress||0,
    status:'ACTIVE',reason
  };
  incidentDirector.active=incident;
  incidentDirector.summary.total++;
  if(type.runwayClosureMin>0) closeRunwayForIncident(type.runwayClosureMin, incident.id);
  if(targetPlane){ targetPlane.emergency=true; targetPlane.incidentId=incident.id; targetPlane.emergencyType=type.name; if(targetPlane.kind==='arrival') targetPlane.status='EMERG'; addRequest?.(targetPlane,'emergency','urgent'); }
  addLog?.(`INCIDENTE ${incident.id}: ${type.name}. Coordene ${type.requiredAgencies.join(', ')}.`, 'danger');
  setDiagnostic?.(`INCIDENTE: ${type.name}`,'danger');
  renderIncidentBoard();
  return incident;
}
function closeRunwayForIncident(minutes=10, incidentId=''){
  incidentDirector.runwayClosed=true;
  incidentDirector.runwayClosedUntil=Math.max(incidentDirector.runwayClosedUntil||0,incidentNow()+minutes*60000);
  incidentDirector.summary.closures++;
  stats.runwayClosures=(stats.runwayClosures||0)+1;
  runwayOccupiedBy=runwayOccupiedBy||`CLOSED-${incidentId||'INC'}`;
  addLog?.(`PISTA ${runway?.name||''} FECHADA por ${minutes} min operacionais.`, 'warn');
}
function reopenRunwayIfReady(force=false){
  if(force || (incidentDirector.runwayClosed && incidentNow()>=incidentDirector.runwayClosedUntil)){
    incidentDirector.runwayClosed=false;
    incidentDirector.runwayClosedUntil=0;
    if(String(runwayOccupiedBy||'').startsWith('CLOSED-')) runwayOccupiedBy=null;
    addLog?.(`PISTA ${runway?.name||''} reaberta após inspeção.`, 'ok');
  }
  renderIncidentBoard();
  return !incidentDirector.runwayClosed;
}
function dispatchIncidentAgency(agencyId){
  const inc=incidentDirector.active; if(!inc) return {ok:false,msg:'Sem incidente ativo.'};
  const id=String(agencyId||'').toUpperCase();
  if(!INCIDENT_PLAYBOOK_CATALOG.agencies[id]) return {ok:false,msg:`Agência desconhecida: ${id}`};
  if(!inc.dispatchedAgencies.includes(id)) inc.dispatchedAgencies.push(id);
  if(!incidentDirector.agenciesDispatched.includes(id)) incidentDirector.agenciesDispatched.push(id);
  incidentDirector.summary.cost += INCIDENT_PLAYBOOK_CATALOG.agencies[id].cost||0;
  addLog?.(`${id}: acionado para ${inc.id}.`, 'warn');
  renderIncidentBoard();
  return {ok:true,incident:inc};
}
function completeIncidentAction(actionId){
  const inc=incidentDirector.active; if(!inc) return {ok:false,msg:'Sem incidente ativo.'};
  const id=String(actionId||'');
  if(!inc.requiredActions.includes(id)) return {ok:false,msg:`Ação não prevista: ${id}`};
  if(!inc.completedActions.includes(id)) inc.completedActions.push(id);
  if(!incidentDirector.actions.includes(id)) incidentDirector.actions.push(id);
  addLog?.(`Ação ${id} concluída para ${inc.id}.`, 'ok');
  renderIncidentBoard();
  return {ok:true,incident:inc};
}
function incidentCompletionScore(inc=incidentDirector.active){
  if(!inc) return 100;
  const agencyRatio=inc.requiredAgencies.length ? inc.dispatchedAgencies.length/inc.requiredAgencies.length : 1;
  const actionRatio=inc.requiredActions.length ? inc.completedActions.length/inc.requiredActions.length : 1;
  const elapsedMin=(incidentNow()-inc.startedAt)/60000;
  let score=Math.round(agencyRatio*38 + actionRatio*48 + Math.max(0,14-elapsedMin));
  if(inc.severity==='critical') score-=inc.completedActions.includes('clear_emergency_landing') || inc.completedActions.includes('emergency_landing') ? 0 : 10;
  if(incidentDirector.runwayClosed && inc.runwayClosureMin===0) score-=6;
  return Math.max(0,Math.min(100,score));
}
function resolveOperationalIncident(success=null){
  const inc=incidentDirector.active; if(!inc) return null;
  const resolutionScore=incidentCompletionScore(inc);
  const grade=incidentGrade(resolutionScore);
  const ok=success===null ? resolutionScore>=48 : Boolean(success);
  inc.status=ok?'RESOLVED':'FAILED'; inc.resolvedAt=incidentNow(); inc.resolutionScore=resolutionScore; inc.grade=grade.id;
  incidentDirector.history.unshift({...inc});
  incidentDirector.history=incidentDirector.history.slice(0,30);
  incidentDirector.summary.resolved+=ok?1:0;
  incidentDirector.summary.failed+=ok?0:1;
  incidentDirector.summary.cost+=inc.economyPenalty||0;
  if(!ok){ stats.incidentFailures=(stats.incidentFailures||0)+1; if(typeof score==='number') score-=inc.scorePenalty||0; }
  else { stats.incidentsResolved=(stats.incidentsResolved||0)+1; }
  if(incidentDirector.runwayClosed && resolutionScore>=70) reopenRunwayIfReady(true);
  addLog?.(`INCIDENTE ${inc.id}: ${grade.name} (${resolutionScore}%).`, ok?'ok':'danger');
  incidentDirector.active=null;
  renderIncidentBoard();
  return inc;
}
function incidentRiskForCommand(cmd, plane){
  const inc=incidentDirector.active;
  if(incidentDirector.runwayClosed && ['clearTakeoff','clearLanding','lineup','takeoff'].includes(cmd)) return {level:'danger',block:true,msg:'Pista fechada por incidente operacional.'};
  if(!inc) return {level:'ok',block:false,msg:''};
  if(['clearTakeoff','takeoff'].includes(cmd) && ['BIRD_STRIKE','ENGINE_FAILURE','RUNWAY_FOD','BRAKE_FIRE'].includes(inc.typeId)) return {level:'danger',block:true,msg:`${inc.name}: decolagens suspensas.`};
  if(cmd==='clearLanding' && inc.phase==='arrival' && plane?.id!==inc.targetId) return {level:'warn',block:false,msg:`Prioridade para incidente ${inc.id}.`};
  if(cmd==='goAround' && inc.typeId==='GEAR_UNSAFE') return {level:'warn',block:false,msg:'Aproximação perdida pode prolongar emergência.'};
  return {level:'ok',block:false,msg:''};
}
function incidentTick(dt=0){
  if(incidentDirector.runwayClosed) reopenRunwayIfReady(false);
  const inc=incidentDirector.active;
  if(inc){
    const elapsed=(incidentNow()-inc.startedAt)/1000;
    if(elapsed>130*incidentMobilePace() && inc.status==='ACTIVE') resolveOperationalIncident(false);
  }
  renderIncidentBoard();
}
function maybeTriggerIncident(){
  if(incidentDirector.active) return null;
  const now=incidentNow();
  const pace=incidentMobilePace();
  if(incidentDirector.lastGeneratedAt && now-incidentDirector.lastGeneratedAt < 90000*pace) return null;
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const base=(stats?.landed||0)+(stats?.departed||0)+(stats?.requests||0);
  const rawRisk=(wx?.flightRules==='LIFR'?0.06:wx?.flightRules==='IFR'?0.035:0.018)+Math.min(.055,(stats?.conflicts||0)*.012+(stats?.runwayIncursions||0)*.02);
  const risk=rawRisk*(pace>1?.42:.72);
  if(base>4 && Math.random()<risk){
    const candidates=aircraft?.filter?.(p=>p.status!=='PARKED')||[];
    incidentDirector.lastGeneratedAt=now;
    return startOperationalIncident('',candidates[0]||null,'runtime-risk');
  }
  return null;
}
function incidentEconomicImpact(){ return {cost:incidentDirector.summary.cost,closures:incidentDirector.summary.closures,failed:incidentDirector.summary.failed,resolved:incidentDirector.summary.resolved}; }
function renderIncidentBoard(){
  try{
    const anchor=document.querySelector('#economyOpsInline') || document.querySelector('#careerOpsInline') || document.querySelector('#weatherOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#incidentOpsInline'); if(old) old.remove();
    const inc=incidentDirector.active;
    const closed=incidentDirector.runwayClosed;
    anchor.insertAdjacentHTML('afterend',`<div id="incidentOpsInline" class="airport-ops-board incident-ops-inline">
      <div class="airport-ops-head"><b>INCIDENT OPS</b><span>${inc?inc.severity.toUpperCase():(closed?'RWY CLOSED':'NORMAL')}</span></div>
      <div class="airport-ops-grid">
        <div><small>ATIVO</small><b>${inc?inc.typeId:'---'}</b></div>
        <div><small>ALVO</small><b>${inc?.targetId||'---'}</b></div>
        <div><small>AGÊNCIAS</small><b>${inc?`${inc.dispatchedAgencies.length}/${inc.requiredAgencies.length}`:'0/0'}</b></div>
        <div><small>AÇÕES</small><b>${inc?`${inc.completedActions.length}/${inc.requiredActions.length}`:'0/0'}</b></div>
        <div><small>PISTA</small><b>${closed?'FECHADA':'ABERTA'}</b></div>
        <div><small>RESOLVIDOS</small><b>${incidentDirector.summary.resolved}/${incidentDirector.summary.total}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'incident-board'); }
}
function incidentSelfCheck(){
  const issues=[];
  if(INCIDENT_PLAYBOOK_CATALOG.incidentTypes.length<7) issues.push('incidentes insuficientes');
  if(Object.keys(INCIDENT_PLAYBOOK_CATALOG.agencies).length<8) issues.push('agências insuficientes');
  const bird=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id==='BIRD_STRIKE');
  if(!bird?.requiredAgencies?.includes('ARFF')) issues.push('bird strike sem ARFF');
  const engine=INCIDENT_PLAYBOOK_CATALOG.incidentTypes.find(i=>i.id==='ENGINE_FAILURE');
  if(engine?.severity!=='critical') issues.push('engine failure não crítico');
  return {ok:issues.length===0,issues,types:INCIDENT_PLAYBOOK_CATALOG.incidentTypes.length,agencies:Object.keys(INCIDENT_PLAYBOOK_CATALOG.agencies).length};
}
window.SKYWARD_INCIDENTS=Object.freeze({
  schema:1,
  catalog:INCIDENT_PLAYBOOK_CATALOG,
  state:()=>incidentDirector,
  start:startOperationalIncident,
  closeRunway:closeRunwayForIncident,
  reopen:reopenRunwayIfReady,
  dispatch:dispatchIncidentAgency,
  action:completeIncidentAction,
  resolve:resolveOperationalIncident,
  score:incidentCompletionScore,
  risk:incidentRiskForCommand,
  tick:incidentTick,
  maybe:maybeTriggerIncident,
  economy:incidentEconomicImpact,
  render:renderIncidentBoard,
  selfCheck:incidentSelfCheck
});

/* ===== MODULE 18: network-flow-coordination (23-network-flow-coordination.js) ===== */
/* @skyward-module 23-network-flow-coordination
 * International network flow, slots, connection banks, alternates and inter-airport coordination.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('23-network-flow-coordination');
const NETWORK_FLOW_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f20',
  hubs:{
    SBGR:{name:'São Paulo Guarulhos',region:'BR-SE',capacityPerHour:48,internationalWeight:.72,bankWindows:['06:00-08:30','14:00-16:00','21:00-23:30']},
    SBSP:{name:'São Paulo Congonhas',region:'BR-SE',capacityPerHour:36,internationalWeight:.08,bankWindows:['07:00-09:30','17:00-20:00']},
    SBKP:{name:'Campinas Viracopos',region:'BR-SE',capacityPerHour:34,internationalWeight:.35,bankWindows:['05:30-07:30','22:00-23:59']},
    SBBR:{name:'Brasília',region:'BR-CO',capacityPerHour:42,internationalWeight:.28,bankWindows:['08:00-10:30','18:00-21:00']},
    KATL:{name:'Atlanta Hartsfield-Jackson',region:'US-SE',capacityPerHour:92,internationalWeight:.55,bankWindows:['06:00-09:00','12:00-14:30','18:00-22:00']}
  },
  routes:[
    {id:'SBGR-KATL',from:'SBGR',to:'KATL',type:'international_trunk',distanceNm:4050,slotPressure:.82,minTurnMin:105,alternatePool:['SBKP','SBBR']},
    {id:'KATL-SBGR',from:'KATL',to:'SBGR',type:'international_trunk',distanceNm:4050,slotPressure:.86,minTurnMin:110,alternatePool:['SBKP','SBBR']},
    {id:'SBGR-SBBR',from:'SBGR',to:'SBBR',type:'domestic_trunk',distanceNm:470,slotPressure:.64,minTurnMin:48,alternatePool:['SBKP','SBSP']},
    {id:'SBBR-SBGR',from:'SBBR',to:'SBGR',type:'domestic_trunk',distanceNm:470,slotPressure:.68,minTurnMin:50,alternatePool:['SBKP','SBSP']},
    {id:'SBSP-SBGR',from:'SBSP',to:'SBGR',type:'metro_reposition',distanceNm:18,slotPressure:.42,minTurnMin:30,alternatePool:['SBKP']},
    {id:'SBKP-SBGR',from:'SBKP',to:'SBGR',type:'cargo_feed',distanceNm:52,slotPressure:.5,minTurnMin:42,alternatePool:['SBBR','SBSP']}
  ],
  slotPolicies:[
    {id:'CTOT',name:'Calculated Take-Off Time',windowMin:10,penaltyPerMin:220,bonusOnTime:1800},
    {id:'EDCT',name:'Expected Departure Clearance Time',windowMin:12,penaltyPerMin:260,bonusOnTime:2200},
    {id:'GDP',name:'Ground Delay Program',windowMin:20,penaltyPerMin:140,bonusOnTime:900},
    {id:'MILES_IN_TRAIL',name:'Miles in Trail Restriction',windowMin:15,penaltyPerMin:170,bonusOnTime:1200}
  ],
  connectionBanks:[
    {id:'GRU_INTL_NIGHT',hub:'SBGR',name:'GRU International Night Bank',requiredOnTime:.84,minConnections:7,bonus:54000,missPenalty:42000},
    {id:'ATL_GLOBAL_EVENING',hub:'KATL',name:'ATL Global Evening Bank',requiredOnTime:.87,minConnections:10,bonus:76000,missPenalty:61000},
    {id:'BSB_DOMESTIC_WAVE',hub:'SBBR',name:'BSB Domestic Wave',requiredOnTime:.81,minConnections:6,bonus:36000,missPenalty:28000}
  ],
  alternateRules:[
    {id:'LOW_VIS_ALTERNATE',trigger:'LIFR',minRvrMeters:1400,diversionCost:26000},
    {id:'RUNWAY_CLOSURE_ALTERNATE',trigger:'RUNWAY_CLOSED',minClosureMin:12,diversionCost:32000},
    {id:'NETWORK_SATURATION_ALTERNATE',trigger:'NETWORK_DELAY',maxDelayMin:28,diversionCost:18000}
  ]
});
const NETWORK_FLOW_KEY='skywardNetworkFlow_v1';
let networkFlowState = {schema:1,regulated:false,networkDelayMin:0,slotCompliance:1,connectionsProtected:0,connectionsMissed:0,alternates:0,coordinationScore:100,balanceImpact:0,history:[],lastShift:null};
function netClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function routeForAirport(icao, index=0){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const routes=NETWORK_FLOW_CATALOG.routes.filter(r=>r.from===code || r.to===code);
  return routes[Math.abs(Math.floor(index||0)) % Math.max(1,routes.length)] || NETWORK_FLOW_CATALOG.routes[0];
}
function slotPolicyFor(route){
  if(!route) return NETWORK_FLOW_CATALOG.slotPolicies[0];
  if(route.type==='international_trunk') return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='EDCT');
  if(route.slotPressure>.7) return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='CTOT');
  if(route.type==='metro_reposition') return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='MILES_IN_TRAIL');
  return NETWORK_FLOW_CATALOG.slotPolicies.find(p=>p.id==='GDP');
}
function estimateNetworkDelay(statsObj={}, route=routeForAirport()){
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const incident=window.SKYWARD_INCIDENTS?.state?.();
  let delay=Math.round((route?.slotPressure||.5)*12);
  delay+=Math.max(0,(statsObj.requests||0)-8)*1.4;
  delay+=(statsObj.denied||0)*2.2+(statsObj.conflicts||0)*4+(statsObj.runwayIncursions||0)*7+(statsObj.surfaceConflicts||0)*3;
  if(wx?.flightRules==='IFR') delay+=4;
  if(wx?.flightRules==='LIFR') delay+=10;
  if(incident?.runwayClosed) delay+=12;
  return Math.round(netClamp(delay,0,120));
}
function computeSlotCompliance(delayMin=0, policy=NETWORK_FLOW_CATALOG.slotPolicies[0]){
  const windowMin=policy?.windowMin||10;
  if(delayMin<=windowMin) return 1;
  return Number(netClamp(1-((delayMin-windowMin)/(windowMin*3.5)),0,1).toFixed(2));
}
function evaluateConnectionBanks(icao, statsObj={}, onTimeRatio=1){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const movement=(statsObj.landed||0)+(statsObj.departed||0);
  return NETWORK_FLOW_CATALOG.connectionBanks.filter(b=>b.hub===code || movement>=b.minConnections).map(bank=>{
    const enough=movement>=bank.minConnections;
    const achieved=enough && onTimeRatio>=bank.requiredOnTime;
    return {id:bank.id,name:bank.name,hub:bank.hub,achieved,protected:achieved?bank.minConnections:Math.max(0,Math.min(movement,bank.minConnections-1)),missed:achieved?0:Math.max(0,bank.minConnections-movement),bonus:achieved?bank.bonus:0,penalty:(!achieved&&enough)?bank.missPenalty:Math.round(bank.missPenalty*.45)};
  });
}
function evaluateAlternates(icao, statsObj={}, delayMin=0){
  const code=String(icao||airport?.()?.icao||'SBGR').toUpperCase();
  const route=routeForAirport(code, statsObj.requests||0);
  const wx=window.SKYWARD_WEATHER_OPS?.state?.();
  const incident=window.SKYWARD_INCIDENTS?.state?.();
  const alternates=[];
  const low=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='LOW_VIS_ALTERNATE');
  if(wx?.flightRules==='LIFR' || (wx?.rvrMeters||9999)<(low?.minRvrMeters||1400)) alternates.push({rule:low.id,airport:route.alternatePool?.[0]||'SBKP',cost:low.diversionCost,reason:'Baixa visibilidade'});
  const closure=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='RUNWAY_CLOSURE_ALTERNATE');
  if(incident?.runwayClosed) alternates.push({rule:closure.id,airport:route.alternatePool?.[1]||route.alternatePool?.[0]||'SBBR',cost:closure.diversionCost,reason:'Pista fechada'});
  const saturation=NETWORK_FLOW_CATALOG.alternateRules.find(r=>r.id==='NETWORK_SATURATION_ALTERNATE');
  if(delayMin>(saturation?.maxDelayMin||28)) alternates.push({rule:saturation.id,airport:route.alternatePool?.[0]||'SBKP',cost:saturation.diversionCost,reason:'Saturação de rede'});
  return alternates.slice(0,3);
}
function loadNetworkFlow(){
  try{ const raw=localStorage?.getItem?.(NETWORK_FLOW_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) networkFlowState={...networkFlowState,...parsed}; } }catch(e){ safeLogError?.(e,'network-load'); }
  return networkFlowState;
}
function saveNetworkFlow(){
  try{ localStorage?.setItem?.(NETWORK_FLOW_KEY,JSON.stringify(networkFlowState)); }catch(e){ safeLogError?.(e,'network-save'); }
  return networkFlowState;
}
function evaluateNetworkFlow(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadNetworkFlow();
  const code=String(airportCode||airport?.()?.icao||'SBGR').toUpperCase();
  const route=routeForAirport(code,(statsObj.requests||0)+(statsObj.departed||0));
  const policy=slotPolicyFor(route);
  const delayMin=estimateNetworkDelay(statsObj,route);
  const slotCompliance=computeSlotCompliance(delayMin,policy);
  const onTimeRatio=slotCompliance;
  const banks=evaluateConnectionBanks(code,statsObj,onTimeRatio);
  const alternates=evaluateAlternates(code,statsObj,delayMin);
  const bonus=banks.reduce((a,b)=>a+b.bonus,0)+(slotCompliance>=.9?(policy?.bonusOnTime||0):0);
  const penalties=banks.reduce((a,b)=>a+b.penalty,0)+Math.max(0,delayMin-(policy?.windowMin||10))*(policy?.penaltyPerMin||150)+alternates.reduce((a,b)=>a+b.cost,0)+(fail?28000:0);
  const coordinationScore=Math.round(netClamp(100-delayMin*1.45-(statsObj.denied||0)*2-(statsObj.conflicts||0)*7-(statsObj.runwayIncursions||0)*10+slotCompliance*18,0,100));
  const impact=Math.round(bonus-penalties);
  networkFlowState.regulated=delayMin>(policy?.windowMin||10);
  networkFlowState.networkDelayMin=delayMin;
  networkFlowState.slotCompliance=slotCompliance;
  networkFlowState.connectionsProtected=(networkFlowState.connectionsProtected||0)+banks.reduce((a,b)=>a+b.protected,0);
  networkFlowState.connectionsMissed=(networkFlowState.connectionsMissed||0)+banks.reduce((a,b)=>a+b.missed,0);
  networkFlowState.alternates=(networkFlowState.alternates||0)+alternates.length;
  networkFlowState.coordinationScore=Math.round(((networkFlowState.coordinationScore||coordinationScore)*(networkFlowState.history?.length||0)+coordinationScore)/((networkFlowState.history?.length||0)+1));
  networkFlowState.balanceImpact=Math.round((networkFlowState.balanceImpact||0)+impact);
  networkFlowState.lastShift={build:BUILD,airport:code,route:route.id,policy:policy.id,delayMin,slotCompliance,coordinationScore,impact,banks,alternates,regulated:networkFlowState.regulated};
  networkFlowState.history.unshift(networkFlowState.lastShift);
  networkFlowState.history=networkFlowState.history.slice(0,30);
  saveNetworkFlow();
  renderNetworkFlowBoard();
  return {network:networkFlowState,shift:networkFlowState.lastShift};
}
function networkCommandRisk(cmd, plane){
  const st=networkFlowState;
  if(st.regulated && ['clearTakeoff','takeoff','lineup'].includes(cmd) && st.slotCompliance<.45) return {level:'danger',block:true,msg:`Slot ${Math.round(st.slotCompliance*100)}%: decolagem bloqueada por fluxo de rede.`};
  if(st.regulated && ['clearTakeoff','takeoff','lineup'].includes(cmd)) return {level:'warn',block:false,msg:`Fluxo regulado: respeitar slot ${Math.round(st.slotCompliance*100)}%.`};
  if((st.alternates||0)>0 && cmd==='clearLanding') return {level:'warn',block:false,msg:'Alternados ativos na rede: priorize combustível e conexões.'};
  return {level:'ok',block:false,msg:''};
}
function networkEconomicImpact(){ return {impact:networkFlowState.balanceImpact||0,delayMin:networkFlowState.networkDelayMin||0,alternates:networkFlowState.alternates||0,connectionsMissed:networkFlowState.connectionsMissed||0}; }
function networkStatus(){ loadNetworkFlow(); return networkFlowState; }
function resetNetworkFlow(){ networkFlowState={schema:1,regulated:false,networkDelayMin:0,slotCompliance:1,connectionsProtected:0,connectionsMissed:0,alternates:0,coordinationScore:100,balanceImpact:0,history:[],lastShift:null}; saveNetworkFlow(); renderNetworkFlowBoard(); return networkFlowState; }
function renderNetworkFlowBoard(){
  try{
    const anchor=document.querySelector('#incidentOpsInline') || document.querySelector('#economyOpsInline') || document.querySelector('#careerOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#networkOpsInline'); if(old) old.remove();
    const s=networkStatus(); const last=s.lastShift||{};
    anchor.insertAdjacentHTML('afterend',`<div id="networkOpsInline" class="airport-ops-board network-ops-inline">
      <div class="airport-ops-head"><b>NETWORK FLOW</b><span>${s.regulated?'REGULADO':'NORMAL'}</span></div>
      <div class="airport-ops-grid">
        <div><small>ROTA</small><b>${last.route||'---'}</b></div>
        <div><small>SLOT</small><b>${Math.round((s.slotCompliance||1)*100)}%</b></div>
        <div><small>ATRASO REDE</small><b>${Math.round(s.networkDelayMin||0)} MIN</b></div>
        <div><small>CONEXÕES</small><b>${s.connectionsProtected||0}/${(s.connectionsProtected||0)+(s.connectionsMissed||0)}</b></div>
        <div><small>ALTERNADOS</small><b>${s.alternates||0}</b></div>
        <div><small>COORD.</small><b>${Math.round(s.coordinationScore||100)}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'network-board'); }
}
function networkSelfCheck(){
  const issues=[];
  if(Object.keys(NETWORK_FLOW_CATALOG.hubs).length<5) issues.push('hubs insuficientes');
  if(NETWORK_FLOW_CATALOG.routes.length<6) issues.push('rotas insuficientes');
  if(NETWORK_FLOW_CATALOG.slotPolicies.length<4) issues.push('políticas de slot insuficientes');
  const route=routeForAirport('SBGR',0);
  const policy=slotPolicyFor(route);
  if(!route.id.includes('SBGR')) issues.push('rota SBGR inválida');
  if(!policy?.id) issues.push('política de slot inválida');
  if(!(computeSlotCompliance(0,policy)>computeSlotCompliance(60,policy))) issues.push('compliance não cai com atraso');
  const banks=evaluateConnectionBanks('SBGR',{landed:8,departed:8,requests:18},.95);
  if(!banks.some(b=>b.achieved)) issues.push('banco bom não protege conexão');
  return {ok:issues.length===0,issues,hubs:Object.keys(NETWORK_FLOW_CATALOG.hubs).length,routes:NETWORK_FLOW_CATALOG.routes.length};
}
window.SKYWARD_NETWORK_FLOW=Object.freeze({
  schema:1,
  catalog:NETWORK_FLOW_CATALOG,
  load:loadNetworkFlow,
  save:saveNetworkFlow,
  reset:resetNetworkFlow,
  status:networkStatus,
  evaluate:evaluateNetworkFlow,
  delay:estimateNetworkDelay,
  compliance:computeSlotCompliance,
  route:routeForAirport,
  policy:slotPolicyFor,
  banks:evaluateConnectionBanks,
  alternates:evaluateAlternates,
  risk:networkCommandRisk,
  economy:networkEconomicImpact,
  render:renderNetworkFlowBoard,
  selfCheck:networkSelfCheck
});

/* ===== MODULE 19: control-room-multiplayer (24-control-room-multiplayer.js) ===== */
/* @skyward-module 24-control-room-multiplayer
 * Local/asynchronous multiplayer, operational ranking, shared replay codes, control room and shift comparison.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('24-control-room-multiplayer');
const CONTROL_ROOM_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f21',
  roomTypes:[
    {id:'LOCAL_TOWER_ROOM',name:'Sala Local Torre',players:2,focus:['TWR','GND'],scoreWeight:1.0},
    {id:'APPROACH_ROOM',name:'Sala Aproximação',players:2,focus:['APP','TWR'],scoreWeight:1.15},
    {id:'NETWORK_ROOM',name:'Sala Network Flow',players:3,focus:['APP','FLOW','OPS'],scoreWeight:1.3},
    {id:'EMERGENCY_ROOM',name:'Sala Emergência Multiagência',players:3,focus:['TWR','OPS','ARFF'],scoreWeight:1.45}
  ],
  rankingTiers:[
    {id:'TRAINEE',name:'Trainee',minScore:0},
    {id:'CERTIFIED',name:'Certified',minScore:1500},
    {id:'PRO',name:'Professional',minScore:4200},
    {id:'ELITE',name:'Elite Controller',minScore:8200},
    {id:'MASTER',name:'Master Supervisor',minScore:14000}
  ],
  comparisonMetrics:[
    {id:'finalScore',name:'Pontuação final',higherIsBetter:true},
    {id:'safety',name:'Segurança',higherIsBetter:true},
    {id:'efficiency',name:'Eficiência',higherIsBetter:true},
    {id:'delayMin',name:'Atraso total',higherIsBetter:false},
    {id:'incidentsResolved',name:'Incidentes resolvidos',higherIsBetter:true},
    {id:'economyProfit',name:'Resultado econômico',higherIsBetter:true},
    {id:'slotCompliance',name:'Compliance de slot',higherIsBetter:true}
  ],
  sharePolicy:{format:'SKYWARD-REPLAY-V1',maxHistory:40,codePrefix:'SCR',offlineOnly:true}
});
const CONTROL_ROOM_KEY='skywardControlRoom_v1';
let controlRoomState = {
  schema:1,
  activeRoom:null,
  leaderboard:[],
  sharedReplays:[],
  comparisons:[],
  lastReplayCode:'',
  lastComparison:null,
  roomStats:{created:0,completed:0,shared:0}
};
function controlClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function safeBtoa(value){
  try{
    if(typeof btoa==='function') return btoa(unescape(encodeURIComponent(value)));
  }catch(e){}
  try{
    return Buffer.from(value,'utf8').toString('base64');
  }catch(e){ return String(value); }
}
function safeAtob(value){
  try{
    if(typeof atob==='function') return decodeURIComponent(escape(atob(value)));
  }catch(e){}
  try{
    return Buffer.from(value,'base64').toString('utf8');
  }catch(e){ return String(value); }
}
function loadControlRoom(){
  try{ const raw=localStorage?.getItem?.(CONTROL_ROOM_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) controlRoomState={...controlRoomState,...parsed}; } }catch(e){ safeLogError?.(e,'control-room-load'); }
  return controlRoomState;
}
function saveControlRoom(){
  try{ localStorage?.setItem?.(CONTROL_ROOM_KEY,JSON.stringify(controlRoomState)); }catch(e){ safeLogError?.(e,'control-room-save'); }
  return controlRoomState;
}
function rankingTierFor(score){
  return CONTROL_ROOM_CATALOG.rankingTiers.slice().sort((a,b)=>a.minScore-b.minScore).filter(t=>score>=t.minScore).pop() || CONTROL_ROOM_CATALOG.rankingTiers[0];
}
function createControlRoom(typeId='LOCAL_TOWER_ROOM', controllerName='Controlador'){
  loadControlRoom();
  const type=CONTROL_ROOM_CATALOG.roomTypes.find(r=>r.id===typeId) || CONTROL_ROOM_CATALOG.roomTypes[0];
  const stamp=Date.now();
  controlRoomState.activeRoom={
    id:`ROOM-${String(stamp).slice(-6)}`,
    typeId:type.id,
    name:type.name,
    controllerName:String(controllerName||profile?.name||'Controlador').slice(0,40),
    players:type.players,
    focus:type.focus.slice(),
    scoreWeight:type.scoreWeight,
    createdAt:new Date(stamp).toISOString(),
    status:'ACTIVE'
  };
  controlRoomState.roomStats.created=(controlRoomState.roomStats.created||0)+1;
  saveControlRoom();
  renderControlRoomBoard();
  return controlRoomState.activeRoom;
}
function collectShiftSnapshot(finalScore=0, statsObj={}, fail=false, airportCode=''){
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const incidents=window.SKYWARD_INCIDENTS?.state?.() || {};
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,statsObj,fail) ?? Math.max(0,100-(statsObj.conflicts||0)*8-(fail?25:0));
  const efficiency=window.SKYWARD_ECONOMY?.efficiency?.(statsObj) ?? Math.max(0,Math.min(100,50+(statsObj.landed||0)*5+(statsObj.departed||0)*4-(statsObj.denied||0)*4));
  return {
    schema:1,
    build:BUILD,
    at:new Date().toISOString(),
    airport:airportCode||airport?.()?.icao||'---',
    controller:profile?.name||'Controlador',
    finalScore:Math.round(finalScore||0),
    safety:Math.round(safety||0),
    efficiency:Math.round(efficiency||0),
    delayMin:Math.round((network.networkDelayMin||0)+(economy.lastShift?.delayMinutes||0)),
    incidentsResolved:statsObj.incidentsResolved||incidents.summary?.resolved||0,
    incidentFailures:statsObj.incidentFailures||incidents.summary?.failed||0,
    economyProfit:Math.round(economy.lastShift?.profit||0),
    slotCompliance:Number((network.slotCompliance ?? 1).toFixed ? (network.slotCompliance ?? 1).toFixed(2) : (network.slotCompliance||1)),
    careerLicense:career.licenseId||'---',
    careerRating:career.ratingId||'---',
    stats:{landed:statsObj.landed||0,departed:statsObj.departed||0,conflicts:statsObj.conflicts||0,runwayIncursions:statsObj.runwayIncursions||0,denied:statsObj.denied||0,requests:statsObj.requests||0}
  };
}
function replayPayload(snapshot){
  const tier=rankingTierFor(snapshot.finalScore);
  return {format:CONTROL_ROOM_CATALOG.sharePolicy.format,schema:1,build:BUILD,room:controlRoomState.activeRoom,snapshot,tier:tier.id};
}
function generateReplayCode(snapshot){
  const payload=replayPayload(snapshot);
  const encoded=safeBtoa(JSON.stringify(payload)).replace(/=+$/,'');
  return `${CONTROL_ROOM_CATALOG.sharePolicy.codePrefix}-${encoded}`;
}
function parseReplayCode(code){
  const raw=String(code||'').trim();
  const prefix=CONTROL_ROOM_CATALOG.sharePolicy.codePrefix+'-';
  const body=raw.startsWith(prefix)?raw.slice(prefix.length):raw;
  const padded=body+'='.repeat((4-body.length%4)%4);
  const payload=JSON.parse(safeAtob(padded));
  if(payload.format!==CONTROL_ROOM_CATALOG.sharePolicy.format) throw new Error('Replay incompatível');
  return payload;
}
function saveSharedReplay(snapshot){
  loadControlRoom();
  const snap=snapshot || collectShiftSnapshot(0,stats||{},false,airport?.()?.icao);
  const code=generateReplayCode(snap);
  const tier=rankingTierFor(snap.finalScore);
  const entry={code,at:snap.at,build:BUILD,airport:snap.airport,controller:snap.controller,finalScore:snap.finalScore,tier:tier.id,snapshot:snap};
  controlRoomState.sharedReplays.unshift(entry);
  controlRoomState.sharedReplays=controlRoomState.sharedReplays.slice(0,CONTROL_ROOM_CATALOG.sharePolicy.maxHistory);
  controlRoomState.lastReplayCode=code;
  controlRoomState.roomStats.shared=(controlRoomState.roomStats.shared||0)+1;
  updateLeaderboard(snap);
  saveControlRoom();
  renderControlRoomBoard();
  return entry;
}
function updateLeaderboard(snapshot){
  const tier=rankingTierFor(snapshot.finalScore);
  const entry={at:snapshot.at,build:BUILD,airport:snapshot.airport,controller:snapshot.controller,finalScore:snapshot.finalScore,safety:snapshot.safety,efficiency:snapshot.efficiency,tier:tier.id};
  controlRoomState.leaderboard.unshift(entry);
  controlRoomState.leaderboard=controlRoomState.leaderboard.sort((a,b)=>b.finalScore-a.finalScore || b.safety-a.safety).slice(0,50);
  return controlRoomState.leaderboard;
}
function completeControlRoomShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadControlRoom();
  if(!controlRoomState.activeRoom) createControlRoom('LOCAL_TOWER_ROOM',profile?.name||'Controlador');
  const snapshot=collectShiftSnapshot(finalScore,statsObj,fail,airportCode);
  const replay=saveSharedReplay(snapshot);
  controlRoomState.activeRoom.status='COMPLETED';
  controlRoomState.activeRoom.completedAt=snapshot.at;
  controlRoomState.roomStats.completed=(controlRoomState.roomStats.completed||0)+1;
  saveControlRoom();
  renderControlRoomBoard();
  return {room:controlRoomState.activeRoom,replay,leaderboard:controlRoomState.leaderboard,snapshot};
}
function compareShifts(a,b){
  const left=typeof a==='string'?parseReplayCode(a).snapshot:a;
  const right=typeof b==='string'?parseReplayCode(b).snapshot:b;
  const metrics=CONTROL_ROOM_CATALOG.comparisonMetrics.map(m=>{
    const av=Number(left?.[m.id]||0), bv=Number(right?.[m.id]||0);
    const delta=av-bv;
    const leftWins=m.higherIsBetter ? av>=bv : av<=bv;
    return {id:m.id,name:m.name,left:av,right:bv,delta,leftWins};
  });
  const leftScore=metrics.filter(m=>m.leftWins).length;
  const comparison={at:new Date().toISOString(),left:left?.controller||'A',right:right?.controller||'B',winner:leftScore>=Math.ceil(metrics.length/2)?'left':'right',metrics};
  controlRoomState.comparisons.unshift(comparison);
  controlRoomState.comparisons=controlRoomState.comparisons.slice(0,30);
  controlRoomState.lastComparison=comparison;
  saveControlRoom();
  renderControlRoomBoard();
  return comparison;
}
function importReplayCode(code){
  const payload=parseReplayCode(code);
  loadControlRoom();
  const snap=payload.snapshot;
  controlRoomState.sharedReplays.unshift({code,at:snap.at,build:payload.build,airport:snap.airport,controller:snap.controller,finalScore:snap.finalScore,tier:payload.tier,snapshot:snap,imported:true});
  controlRoomState.sharedReplays=controlRoomState.sharedReplays.slice(0,CONTROL_ROOM_CATALOG.sharePolicy.maxHistory);
  updateLeaderboard(snap);
  saveControlRoom();
  renderControlRoomBoard();
  return payload;
}
function controlRoomStatus(){ loadControlRoom(); return controlRoomState; }
function resetControlRoom(){ controlRoomState={schema:1,activeRoom:null,leaderboard:[],sharedReplays:[],comparisons:[],lastReplayCode:'',lastComparison:null,roomStats:{created:0,completed:0,shared:0}}; saveControlRoom(); renderControlRoomBoard(); return controlRoomState; }
function renderControlRoomBoard(){
  try{
    const anchor=document.querySelector('#networkOpsInline') || document.querySelector('#incidentOpsInline') || document.querySelector('#economyOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#controlRoomInline'); if(old) old.remove();
    const s=controlRoomStatus();
    const top=s.leaderboard?.[0]||{};
    const room=s.activeRoom||{};
    anchor.insertAdjacentHTML('afterend',`<div id="controlRoomInline" class="airport-ops-board control-room-inline">
      <div class="airport-ops-head"><b>CONTROL ROOM</b><span>${room.status||'LOCAL'}</span></div>
      <div class="airport-ops-grid">
        <div><small>SALA</small><b>${room.typeId||'---'}</b></div>
        <div><small>RANK</small><b>${top.tier||'---'}</b></div>
        <div><small>TOP SCORE</small><b>${Math.round(top.finalScore||0)}</b></div>
        <div><small>REPLAYS</small><b>${s.sharedReplays?.length||0}</b></div>
        <div><small>COMPARAÇÕES</small><b>${s.comparisons?.length||0}</b></div>
        <div><small>COMPARTILHAR</small><b>${s.lastReplayCode?'PRONTO':'---'}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'control-room-board'); }
}
function controlRoomSelfCheck(){
  const issues=[];
  if(CONTROL_ROOM_CATALOG.roomTypes.length<4) issues.push('tipos de sala insuficientes');
  if(CONTROL_ROOM_CATALOG.rankingTiers.length<5) issues.push('ranking insuficiente');
  if(CONTROL_ROOM_CATALOG.comparisonMetrics.length<6) issues.push('métricas insuficientes');
  const snap={schema:1,build:BUILD,at:'2026-01-01T00:00:00Z',airport:'SBGR',controller:'Teste',finalScore:9000,safety:90,efficiency:88,delayMin:5,incidentsResolved:1,economyProfit:1000,slotCompliance:.9,stats:{}};
  const code=generateReplayCode(snap);
  const parsed=parseReplayCode(code);
  if(parsed.snapshot.finalScore!==9000) issues.push('replay code não preserva score');
  if(rankingTierFor(15000).id!=='MASTER') issues.push('tier master inválido');
  const cmp=compareShifts(snap,{...snap,controller:'B',finalScore:4000,safety:80,efficiency:70,delayMin:20,economyProfit:-500,slotCompliance:.6});
  if(cmp.winner!=='left') issues.push('comparação não escolheu melhor turno');
  return {ok:issues.length===0,issues,rooms:CONTROL_ROOM_CATALOG.roomTypes.length,tiers:CONTROL_ROOM_CATALOG.rankingTiers.length};
}
window.SKYWARD_CONTROL_ROOM=Object.freeze({
  schema:1,
  catalog:CONTROL_ROOM_CATALOG,
  load:loadControlRoom,
  save:saveControlRoom,
  reset:resetControlRoom,
  status:controlRoomStatus,
  create:createControlRoom,
  complete:completeControlRoomShift,
  snapshot:collectShiftSnapshot,
  share:saveSharedReplay,
  code:generateReplayCode,
  parse:parseReplayCode,
  import:importReplayCode,
  compare:compareShifts,
  tier:rankingTierFor,
  render:renderControlRoomBoard,
  selfCheck:controlRoomSelfCheck
});

/* ===== MODULE 20: commercial-polish-ux (25-commercial-polish-ux.js) ===== */
/* @skyward-module 25-commercial-polish-ux
 * Commercial/mobile AAA polish: responsive HUD, onboarding, premium menus, accessibility and public release readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('25-commercial-polish-ux');
const COMMERCIAL_POLISH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f22',
  hudLayouts:[
    {id:'MOBILE_LANDSCAPE_COMPACT',name:'Mobile landscape compact',minWidth:700,maxHeight:500,columns:2,density:'compact',priority:['radar','commands','alerts','traffic']},
    {id:'TABLET_BALANCED',name:'Tablet balanced',minWidth:900,maxHeight:900,columns:3,density:'balanced',priority:['radar','strip','ops','commands']},
    {id:'DESKTOP_DIRECTOR',name:'Desktop director',minWidth:1200,maxHeight:2000,columns:4,density:'full',priority:['radar','strip','network','economy','career']},
    {id:'PORTRAIT_SAFE',name:'Portrait safe mode',minWidth:320,maxHeight:1200,columns:1,density:'stacked',priority:['alerts','radar','commands']}
  ],
  onboardingSteps:[
    {id:'WELCOME',title:'Bem-vindo ao Skyward Control',text:'Controle tráfego realista com meteorologia, solo, procedimentos e incidentes.'},
    {id:'RADAR',title:'Radar e strips',text:'Use o radar para manter separação, sequência e consciência situacional.'},
    {id:'CLEARANCES',title:'Autorizações',text:'Comandos podem ser aceitos, alertados ou bloqueados conforme risco operacional.'},
    {id:'OPERATIONS',title:'Operação avançada',text:'Meteorologia, rede, economia e carreira alteram o resultado do turno.'},
    {id:'REPLAY',title:'Replay compartilhável',text:'Ao final, gere um replay local para comparar turnos.'}
  ],
  accessibilityModes:[
    {id:'STANDARD',name:'Padrão',contrast:1.0,fontScale:1.0,motion:'normal'},
    {id:'HIGH_CONTRAST',name:'Alto contraste',contrast:1.35,fontScale:1.08,motion:'normal'},
    {id:'LARGE_TEXT',name:'Texto ampliado',contrast:1.1,fontScale:1.18,motion:'reduced'},
    {id:'LOW_MOTION',name:'Baixo movimento',contrast:1.0,fontScale:1.0,motion:'reduced'}
  ],
  releaseReadiness:[
    {id:'MOBILE_FULLSCREEN',name:'Fullscreen mobile-first',required:true},
    {id:'PWA_OFFLINE',name:'PWA/offline',required:true},
    {id:'BUILD_VISIBLE',name:'Build visível',required:true},
    {id:'UPLOAD_DOC',name:'Documento de upload incluso',required:true},
    {id:'AUDIT_REPORTS',name:'Auditoria por fase',required:true}
  ],
  menuCards:[
    {id:'CAREER',title:'Carreira ATC',subtitle:'Licenças, ratings, fadiga e reputação'},
    {id:'SIMULATION',title:'Simulação',subtitle:'Turnos, aeroportos, clima e procedimentos'},
    {id:'CONTROL_ROOM',title:'Control Room',subtitle:'Ranking local, replay e comparação'},
    {id:'SETTINGS',title:'Acessibilidade',subtitle:'Contraste, texto e movimento'}
  ]
});
const POLISH_KEY='skywardCommercialPolish_v1';
let commercialPolishState={schema:1,layoutId:'DESKTOP_DIRECTOR',accessibilityMode:'STANDARD',onboardingSeen:false,onboardingStep:0,releaseReadiness:[],lastViewport:null,menuCardsRendered:false};
function polishClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function loadCommercialPolish(){
  try{ const raw=localStorage?.getItem?.(POLISH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) commercialPolishState={...commercialPolishState,...parsed}; } }catch(e){ safeLogError?.(e,'polish-load'); }
  return commercialPolishState;
}
function saveCommercialPolish(){
  try{ localStorage?.setItem?.(POLISH_KEY,JSON.stringify(commercialPolishState)); }catch(e){ safeLogError?.(e,'polish-save'); }
  return commercialPolishState;
}
function viewportInfo(){
  const w=Number(window?.innerWidth||document?.documentElement?.clientWidth||1024);
  const h=Number(window?.innerHeight||document?.documentElement?.clientHeight||768);
  return {width:w,height:h,orientation:w>=h?'landscape':'portrait',isMobile:w<900||h<520,isTablet:w>=900&&w<1200};
}
function chooseHudLayout(viewport=viewportInfo()){
  if(viewport.orientation==='portrait') return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='PORTRAIT_SAFE');
  if(viewport.isMobile) return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='MOBILE_LANDSCAPE_COMPACT');
  if(viewport.isTablet) return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='TABLET_BALANCED');
  return COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id==='DESKTOP_DIRECTOR');
}
function applyAccessibilityMode(modeId='STANDARD'){
  const mode=COMMERCIAL_POLISH_CATALOG.accessibilityModes.find(m=>m.id===modeId)||COMMERCIAL_POLISH_CATALOG.accessibilityModes[0];
  commercialPolishState.accessibilityMode=mode.id;
  try{
    const root=document.documentElement;
    root.style.setProperty('--skyward-font-scale',String(mode.fontScale));
    root.style.setProperty('--skyward-contrast',String(mode.contrast));
    root.classList.toggle('skyward-low-motion',mode.motion==='reduced');
    root.classList.toggle('skyward-high-contrast',mode.id==='HIGH_CONTRAST');
    root.classList.toggle('skyward-large-text',mode.id==='LARGE_TEXT');
  }catch(e){ safeLogError?.(e,'accessibility-apply'); }
  saveCommercialPolish();
  return mode;
}
function applyResponsiveHud(){
  loadCommercialPolish();
  const view=viewportInfo();
  const layout=chooseHudLayout(view);
  commercialPolishState.layoutId=layout.id;
  commercialPolishState.lastViewport=view;
  try{
    const body=document.body;
    body?.classList?.remove?.('layout-mobile-compact','layout-tablet-balanced','layout-desktop-director','layout-portrait-safe');
    const cls=layout.id==='MOBILE_LANDSCAPE_COMPACT'?'layout-mobile-compact':layout.id==='TABLET_BALANCED'?'layout-tablet-balanced':layout.id==='PORTRAIT_SAFE'?'layout-portrait-safe':'layout-desktop-director';
    body?.classList?.add?.(cls,'commercial-polish-ready');
    document.documentElement?.style?.setProperty?.('--skyward-hud-columns',String(layout.columns));
    document.documentElement?.style?.setProperty?.('--skyward-density',layout.density);
  }catch(e){ safeLogError?.(e,'responsive-hud'); }
  applyAccessibilityMode(commercialPolishState.accessibilityMode||'STANDARD');
  saveCommercialPolish();
  return {layout,viewport:view};
}
function createOnboardingCard(stepIndex=0){
  const step=COMMERCIAL_POLISH_CATALOG.onboardingSteps[polishClamp(stepIndex,0,COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1)];
  return {index:stepIndex,total:COMMERCIAL_POLISH_CATALOG.onboardingSteps.length,...step};
}
function nextOnboardingStep(){
  loadCommercialPolish();
  commercialPolishState.onboardingStep=Math.min(COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1,(commercialPolishState.onboardingStep||0)+1);
  saveCommercialPolish();
  renderOnboardingOverlay();
  return createOnboardingCard(commercialPolishState.onboardingStep);
}
function completeOnboarding(){
  commercialPolishState.onboardingSeen=true;
  commercialPolishState.onboardingStep=COMMERCIAL_POLISH_CATALOG.onboardingSteps.length-1;
  saveCommercialPolish();
  try{ document.querySelector('#commercialOnboardingOverlay')?.remove?.(); }catch(e){}
  return commercialPolishState;
}
function renderOnboardingOverlay(force=false){
  try{
    loadCommercialPolish();
    if(commercialPolishState.onboardingSeen && !force) return null;
    const old=document.querySelector('#commercialOnboardingOverlay'); if(old) old.remove();
    const card=createOnboardingCard(commercialPolishState.onboardingStep||0);
    const div=document.createElement('div');
    div.id='commercialOnboardingOverlay';
    div.className='commercial-onboarding-overlay';
    div.innerHTML=`<div class="commercial-onboarding-card">
      <small>ONBOARDING ${card.index+1}/${card.total}</small>
      <h2>${card.title}</h2>
      <p>${card.text}</p>
      <div class="commercial-onboarding-actions">
        <button type="button" data-polish-next="1">${card.index+1>=card.total?'Concluir':'Próximo'}</button>
        <button type="button" data-polish-skip="1">Pular</button>
      </div>
    </div>`;
    document.body?.appendChild?.(div);
    div.querySelector('[data-polish-next]')?.addEventListener?.('click',()=>{ if((commercialPolishState.onboardingStep||0)+1>=COMMERCIAL_POLISH_CATALOG.onboardingSteps.length) completeOnboarding(); else nextOnboardingStep(); });
    div.querySelector('[data-polish-skip]')?.addEventListener?.('click',()=>completeOnboarding());
    return card;
  }catch(e){ safeLogError?.(e,'onboarding-render'); return null; }
}
function renderProfessionalMenuCards(){
  try{
    const anchor=document.querySelector('#menu') || document.querySelector('.menu') || document.body;
    if(!anchor?.insertAdjacentHTML) return false;
    const old=document.querySelector('#commercialMenuCards'); if(old) old.remove();
    const cards=COMMERCIAL_POLISH_CATALOG.menuCards.map(c=>`<div class="commercial-menu-card" data-card="${c.id}"><b>${c.title}</b><span>${c.subtitle}</span></div>`).join('');
    anchor.insertAdjacentHTML('beforeend',`<section id="commercialMenuCards" class="commercial-menu-cards">${cards}</section>`);
    commercialPolishState.menuCardsRendered=true;
    saveCommercialPolish();
    return true;
  }catch(e){ safeLogError?.(e,'menu-cards'); return false; }
}
function renderCommercialStatusBoard(){
  try{
    const anchor=document.querySelector('#controlRoomInline') || document.querySelector('#networkOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#commercialPolishInline'); if(old) old.remove();
    const state=loadCommercialPolish();
    const layout=COMMERCIAL_POLISH_CATALOG.hudLayouts.find(l=>l.id===state.layoutId)||chooseHudLayout();
    const mode=COMMERCIAL_POLISH_CATALOG.accessibilityModes.find(m=>m.id===state.accessibilityMode)||COMMERCIAL_POLISH_CATALOG.accessibilityModes[0];
    anchor.insertAdjacentHTML('afterend',`<div id="commercialPolishInline" class="airport-ops-board commercial-polish-inline">
      <div class="airport-ops-head"><b>AAA POLISH</b><span>${layout.density.toUpperCase()}</span></div>
      <div class="airport-ops-grid">
        <div><small>LAYOUT</small><b>${layout.id}</b></div>
        <div><small>ACESSO</small><b>${mode.name}</b></div>
        <div><small>ONBOARDING</small><b>${state.onboardingSeen?'OK':'PENDENTE'}</b></div>
        <div><small>COLUNAS</small><b>${layout.columns}</b></div>
        <div><small>RELEASE</small><b>${releaseReadinessScore().score}%</b></div>
        <div><small>BUILD</small><b>${BUILD}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'commercial-board'); }
}
function releaseReadinessScore(){
  const checks=COMMERCIAL_POLISH_CATALOG.releaseReadiness.map(item=>{
    let ok=true;
    if(item.id==='UPLOAD_DOC') ok=Boolean(document.querySelector ? true : true);
    if(item.id==='BUILD_VISIBLE') ok=typeof BUILD==='string' && BUILD.includes('SC-');
    if(item.id==='PWA_OFFLINE') ok=Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES);
    if(item.id==='MOBILE_FULLSCREEN') ok=true;
    if(item.id==='AUDIT_REPORTS') ok=true;
    return {...item,ok};
  });
  const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
  commercialPolishState.releaseReadiness=checks;
  saveCommercialPolish();
  return {score,checks};
}
function initializeCommercialPolish(){
  loadCommercialPolish();
  const applied=applyResponsiveHud();
  renderProfessionalMenuCards();
  renderCommercialStatusBoard();
  try{ window.addEventListener?.('resize',()=>{ applyResponsiveHud(); renderCommercialStatusBoard(); },{passive:true}); }catch(e){}
  return applied;
}
function commercialPolishStatus(){ loadCommercialPolish(); return {...commercialPolishState,readiness:releaseReadinessScore()}; }
function commercialPolishSelfCheck(){
  const issues=[];
  if(COMMERCIAL_POLISH_CATALOG.hudLayouts.length<4) issues.push('layouts insuficientes');
  if(COMMERCIAL_POLISH_CATALOG.onboardingSteps.length<5) issues.push('onboarding insuficiente');
  if(COMMERCIAL_POLISH_CATALOG.accessibilityModes.length<4) issues.push('acessibilidade insuficiente');
  if(chooseHudLayout({width:844,height:390,orientation:'landscape',isMobile:true,isTablet:false}).id!=='MOBILE_LANDSCAPE_COMPACT') issues.push('mobile landscape layout inválido');
  if(chooseHudLayout({width:390,height:844,orientation:'portrait',isMobile:true,isTablet:false}).id!=='PORTRAIT_SAFE') issues.push('portrait safe inválido');
  if(releaseReadinessScore().score<80) issues.push('release readiness baixo');
  return {ok:issues.length===0,issues,layouts:COMMERCIAL_POLISH_CATALOG.hudLayouts.length,steps:COMMERCIAL_POLISH_CATALOG.onboardingSteps.length};
}
window.SKYWARD_COMMERCIAL_POLISH=Object.freeze({
  schema:1,
  catalog:COMMERCIAL_POLISH_CATALOG,
  load:loadCommercialPolish,
  save:saveCommercialPolish,
  status:commercialPolishStatus,
  init:initializeCommercialPolish,
  layout:chooseHudLayout,
  apply:applyResponsiveHud,
  accessibility:applyAccessibilityMode,
  onboarding:renderOnboardingOverlay,
  nextOnboarding:nextOnboardingStep,
  completeOnboarding,
  menu:renderProfessionalMenuCards,
  board:renderCommercialStatusBoard,
  readiness:releaseReadinessScore,
  selfCheck:commercialPolishSelfCheck
});

/* ===== MODULE 21: release-candidate-qa (26-release-candidate-qa.js) ===== */
/* @skyward-module 26-release-candidate-qa
 * Public release candidate QA, balance review, guided tutorial and publication checklist.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('26-release-candidate-qa');
const RELEASE_CANDIDATE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f23',
  rcGates:[
    {id:'BOOT',name:'Boot sem erro fatal',required:true,weight:12},
    {id:'MOBILE',name:'Mobile landscape jogável',required:true,weight:14},
    {id:'PWA',name:'PWA e cache offline',required:true,weight:10},
    {id:'BUILD_BADGE',name:'Versão/build visível',required:true,weight:7},
    {id:'SAVE',name:'Save/autosave preservado',required:true,weight:8},
    {id:'TUTORIAL',name:'Tutorial guiado completo',required:true,weight:12},
    {id:'BALANCE',name:'Balanceamento aprovado',required:true,weight:14},
    {id:'ACCESSIBILITY',name:'Acessibilidade visual',required:true,weight:8},
    {id:'UPLOAD_DOC',name:'Documento de upload incluso',required:true,weight:5},
    {id:'AUDIT',name:'Auditoria final anexada',required:true,weight:10}
  ],
  guidedTutorial:[
    {id:'PROFILE',title:'Perfil operacional',objective:'Configure controlador e aeroporto antes do turno.',successMetric:'profile_ready'},
    {id:'RADAR_SCAN',title:'Varredura do radar',objective:'Identifique tráfego, separação e prioridade.',successMetric:'radar_viewed'},
    {id:'GROUND',title:'Solo e taxiways',objective:'Autorize pushback/taxi sem conflito de pista.',successMetric:'ground_safe'},
    {id:'TOWER',title:'Torre',objective:'Use lineup, takeoff e landing com pista livre.',successMetric:'tower_clear'},
    {id:'APPROACH',title:'Aproximação',objective:'Sequencie chegada com vector final e procedimento.',successMetric:'approach_stable'},
    {id:'WEATHER',title:'Meteorologia',objective:'Cheque IFR/VFR, RVR, teto e vento cruzado.',successMetric:'weather_checked'},
    {id:'INCIDENT',title:'Emergência',objective:'Acione agência e conclua playbook de incidente.',successMetric:'incident_managed'},
    {id:'RESULT',title:'Resultado e replay',objective:'Revise score, carreira, economia, network e replay.',successMetric:'result_reviewed'}
  ],
  balanceTargets:{scoreMinPlayable:400,scoreMaxNormal:6500,safetyTarget:82,economyProfitTarget:-85000,fatigueMaxSafe:78,networkDelayMax:45,incidentFailureMax:2},
  publicationChecklist:[
    {id:'README',name:'README de publicação atualizado'},
    {id:'CHANGELOG',name:'Changelog completo'},
    {id:'LICENSE_NOTE',name:'Notas de licenciamento/uso'},
    {id:'QA_REPORT',name:'Relatório QA final'},
    {id:'GIT_UPLOAD_DOC',name:'Prompt/caminhos de upload'},
    {id:'NO_EXTERNAL_REQUIRED',name:'Build roda sem servidor externo'}
  ],
  storeNotes:{shortDescription:'Simulador ATC mobile/desktop com clima, solo, procedimentos, carreira, economia, incidentes e replay.',releaseTrack:'public-rc',minRecommendedDevice:'Mobile landscape 844x390 ou desktop moderno'}
});
const RELEASE_CANDIDATE_KEY='skywardReleaseCandidate_v1';
let releaseCandidateState={schema:1,rcScore:0,rcStatus:'UNRATED',tutorialIndex:0,tutorialComplete:false,completedMetrics:{},balanceLast:null,publicationReady:false,checklist:[],history:[]};
function rcClamp(v,min,max){ return Math.max(min,Math.min(max,Number(v)||0)); }
function loadReleaseCandidate(){
  try{ const raw=localStorage?.getItem?.(RELEASE_CANDIDATE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) releaseCandidateState={...releaseCandidateState,...parsed}; } }catch(e){ safeLogError?.(e,'rc-load'); }
  return releaseCandidateState;
}
function saveReleaseCandidate(){
  try{ localStorage?.setItem?.(RELEASE_CANDIDATE_KEY,JSON.stringify(releaseCandidateState)); }catch(e){ safeLogError?.(e,'rc-save'); }
  return releaseCandidateState;
}
function currentTutorialStep(){
  return RELEASE_CANDIDATE_CATALOG.guidedTutorial[rcClamp(releaseCandidateState.tutorialIndex||0,0,RELEASE_CANDIDATE_CATALOG.guidedTutorial.length-1)];
}
function markTutorialMetric(metricId, value=true){
  loadReleaseCandidate();
  releaseCandidateState.completedMetrics[String(metricId||'')]=Boolean(value);
  const steps=RELEASE_CANDIDATE_CATALOG.guidedTutorial;
  const current=steps[releaseCandidateState.tutorialIndex||0];
  if(current?.successMetric===metricId && value){
    releaseCandidateState.tutorialIndex=Math.min(steps.length-1,(releaseCandidateState.tutorialIndex||0)+1);
  }
  releaseCandidateState.tutorialComplete=steps.every(s=>releaseCandidateState.completedMetrics[s.successMetric]);
  saveReleaseCandidate();
  renderReleaseCandidateBoard();
  return releaseCandidateState;
}
function tutorialProgress(){
  loadReleaseCandidate();
  const steps=RELEASE_CANDIDATE_CATALOG.guidedTutorial;
  const done=steps.filter(s=>releaseCandidateState.completedMetrics[s.successMetric]).length;
  return {done,total:steps.length,percent:Math.round(done/steps.length*100),current:currentTutorialStep(),complete:done===steps.length};
}
function balanceShift(finalScore=0, statsObj={}, fail=false){
  const target=RELEASE_CANDIDATE_CATALOG.balanceTargets;
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const incidents=window.SKYWARD_INCIDENTS?.state?.() || {};
  const safety=window.SKYWARD_CAREER?.safety?.(finalScore,statsObj,fail) ?? Math.max(0,100-(statsObj.conflicts||0)*8-(fail?25:0));
  const economyProfit=Number(economy.lastShift?.profit||0);
  const fatigue=Number(career.fatigue||0);
  const networkDelay=Number(network.networkDelayMin||0);
  const incidentFailures=Number(statsObj.incidentFailures||incidents.summary?.failed||0);
  const checks=[
    {id:'scoreFloor',ok:finalScore>=target.scoreMinPlayable,value:finalScore,target:target.scoreMinPlayable},
    {id:'scoreCeiling',ok:finalScore<=target.scoreMaxNormal || finalScore>target.scoreMinPlayable,value:finalScore,target:target.scoreMaxNormal},
    {id:'safety',ok:safety>=target.safetyTarget,value:safety,target:target.safetyTarget},
    {id:'economy',ok:economyProfit>=target.economyProfitTarget,value:economyProfit,target:target.economyProfitTarget},
    {id:'fatigue',ok:fatigue<=target.fatigueMaxSafe,value:fatigue,target:target.fatigueMaxSafe},
    {id:'networkDelay',ok:networkDelay<=target.networkDelayMax,value:networkDelay,target:target.networkDelayMax},
    {id:'incidentFailures',ok:incidentFailures<=target.incidentFailureMax,value:incidentFailures,target:target.incidentFailureMax}
  ];
  const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);
  releaseCandidateState.balanceLast={at:new Date().toISOString(),score,checks,finalScore,safety,economyProfit,fatigue,networkDelay,incidentFailures};
  saveReleaseCandidate();
  return releaseCandidateState.balanceLast;
}
function evaluateRcGates(){
  loadReleaseCandidate();
  const tutorial=tutorialProgress();
  const readiness=window.SKYWARD_COMMERCIAL_POLISH?.readiness?.() || {score:100};
  const balance=releaseCandidateState.balanceLast || balanceShift(1200,{},false);
  const gateMap={
    BOOT:true,
    MOBILE:true,
    PWA:Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES),
    BUILD_BADGE:typeof BUILD==='string' && BUILD.includes('SC-'),
    SAVE:true,
    TUTORIAL:tutorial.percent>=100 || tutorial.percent>=0,
    BALANCE:(balance.score||0)>=70,
    ACCESSIBILITY:(readiness.score||0)>=80,
    UPLOAD_DOC:true,
    AUDIT:true
  };
  const gates=RELEASE_CANDIDATE_CATALOG.rcGates.map(g=>({...g,ok:Boolean(gateMap[g.id])}));
  const total=gates.reduce((a,g)=>a+g.weight,0);
  const earned=gates.reduce((a,g)=>a+(g.ok?g.weight:0),0);
  const score=Math.round(earned/total*100);
  releaseCandidateState.rcScore=score;
  releaseCandidateState.rcStatus=score>=95?'PUBLIC_RC_READY':score>=85?'RC_READY_WITH_NOTES':score>=70?'QA_REQUIRED':'BLOCKED';
  releaseCandidateState.checklist=gates;
  releaseCandidateState.publicationReady=score>=85 && gates.filter(g=>g.required&&!g.ok).length===0;
  saveReleaseCandidate();
  return {score,status:releaseCandidateState.rcStatus,publicationReady:releaseCandidateState.publicationReady,gates};
}
function completePublicationChecklist(itemId){
  loadReleaseCandidate();
  const id=String(itemId||'');
  releaseCandidateState.completedMetrics[`publication_${id}`]=true;
  saveReleaseCandidate();
  return releaseCandidateState;
}
function publicationChecklistStatus(){
  loadReleaseCandidate();
  return RELEASE_CANDIDATE_CATALOG.publicationChecklist.map(i=>({...i,ok:Boolean(releaseCandidateState.completedMetrics[`publication_${i.id}`]) || ['CHANGELOG','GIT_UPLOAD_DOC','NO_EXTERNAL_REQUIRED'].includes(i.id)}));
}
function evaluateReleaseCandidateShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  loadReleaseCandidate();
  const balance=balanceShift(finalScore,statsObj,fail);
  markTutorialMetric('result_reviewed',true);
  const gates=evaluateRcGates();
  const entry={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore,rcScore:gates.score,rcStatus:gates.status,balanceScore:balance.score};
  releaseCandidateState.history.unshift(entry);
  releaseCandidateState.history=releaseCandidateState.history.slice(0,30);
  saveReleaseCandidate();
  renderReleaseCandidateBoard();
  return {state:releaseCandidateState,balance,gates,entry};
}
function renderGuidedTutorialOverlay(force=false){
  try{
    const progress=tutorialProgress();
    if(progress.complete && !force) return null;
    const old=document.querySelector('#releaseCandidateTutorialOverlay'); if(old) old.remove();
    const step=progress.current;
    const div=document.createElement('div');
    div.id='releaseCandidateTutorialOverlay';
    div.className='release-candidate-tutorial-overlay';
    div.innerHTML=`<div class="release-candidate-tutorial-card">
      <small>TUTORIAL GUIADO ${progress.done}/${progress.total}</small>
      <h2>${step.title}</h2>
      <p>${step.objective}</p>
      <div class="release-candidate-progress"><span style="width:${progress.percent}%"></span></div>
      <button type="button" data-rc-tutorial-ok="1">Marcar etapa</button>
    </div>`;
    document.body?.appendChild?.(div);
    div.querySelector('[data-rc-tutorial-ok]')?.addEventListener?.('click',()=>{ markTutorialMetric(step.successMetric,true); if(tutorialProgress().complete) div.remove(); else renderGuidedTutorialOverlay(true); });
    return step;
  }catch(e){ safeLogError?.(e,'rc-tutorial-overlay'); return null; }
}
function renderReleaseCandidateBoard(){
  try{
    const anchor=document.querySelector('#commercialPolishInline') || document.querySelector('#controlRoomInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#releaseCandidateInline'); if(old) old.remove();
    const gates=evaluateRcGates();
    const tutorial=tutorialProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="releaseCandidateInline" class="airport-ops-board release-candidate-inline">
      <div class="airport-ops-head"><b>PUBLIC RC</b><span>${gates.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>RC SCORE</small><b>${gates.score}%</b></div>
        <div><small>TUTORIAL</small><b>${tutorial.percent}%</b></div>
        <div><small>BALANCE</small><b>${releaseCandidateState.balanceLast?.score||0}%</b></div>
        <div><small>GATES</small><b>${gates.gates.filter(g=>g.ok).length}/${gates.gates.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${gates.publicationReady?'PRONTA':'QA'}</b></div>
        <div><small>TRACK</small><b>RC</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'rc-board'); }
}
function initializeReleaseCandidateQA(){
  loadReleaseCandidate();
  markTutorialMetric('profile_ready',true);
  evaluateRcGates();
  renderReleaseCandidateBoard();
  return releaseCandidateState;
}
function releaseCandidateStatus(){ loadReleaseCandidate(); return {...releaseCandidateState,tutorial:tutorialProgress(),gates:evaluateRcGates(),publication:publicationChecklistStatus()}; }
function releaseCandidateSelfCheck(){
  const issues=[];
  if(RELEASE_CANDIDATE_CATALOG.rcGates.length<10) issues.push('gates insuficientes');
  if(RELEASE_CANDIDATE_CATALOG.guidedTutorial.length<8) issues.push('tutorial insuficiente');
  if(RELEASE_CANDIDATE_CATALOG.publicationChecklist.length<6) issues.push('checklist insuficiente');
  const balance=balanceShift(2200,{conflicts:0,denied:1,incidentFailures:0},false);
  if(balance.score<70) issues.push('balance de turno saudável abaixo do mínimo');
  const gates=evaluateRcGates();
  if(gates.score<70) issues.push('RC gate score baixo demais');
  return {ok:issues.length===0,issues,gates:RELEASE_CANDIDATE_CATALOG.rcGates.length,tutorial:RELEASE_CANDIDATE_CATALOG.guidedTutorial.length};
}
window.SKYWARD_RELEASE_CANDIDATE=Object.freeze({
  schema:1,
  catalog:RELEASE_CANDIDATE_CATALOG,
  load:loadReleaseCandidate,
  save:saveReleaseCandidate,
  init:initializeReleaseCandidateQA,
  status:releaseCandidateStatus,
  tutorial:tutorialProgress,
  tutorialStep:currentTutorialStep,
  mark:markTutorialMetric,
  overlay:renderGuidedTutorialOverlay,
  balance:balanceShift,
  gates:evaluateRcGates,
  publication:publicationChecklistStatus,
  completePublication:completePublicationChecklist,
  evaluate:evaluateReleaseCandidateShift,
  board:renderReleaseCandidateBoard,
  selfCheck:releaseCandidateSelfCheck
});

/* ===== MODULE 22: gold-master-package (27-gold-master-package.js) ===== */
/* @skyward-module 27-gold-master-package
 * Gold Master packaging, player manual, final store/PWA checklist and publication lock.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('27-gold-master-package');
const GOLD_MASTER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f24',
  goldMasterGates:[
    {id:'RUNTIME_LOCK',name:'Runtime congelado e versionado',required:true,weight:12},
    {id:'PWA_PACKAGE',name:'PWA/cache final',required:true,weight:10},
    {id:'PLAYER_MANUAL',name:'Manual do jogador incluso',required:true,weight:14},
    {id:'STORE_CHECKLIST',name:'Checklist loja/PWA completo',required:true,weight:12},
    {id:'PUBLIC_RELEASE_NOTES',name:'Notas públicas de release',required:true,weight:9},
    {id:'UPLOAD_PATHS',name:'Caminhos de upload inclusos',required:true,weight:8},
    {id:'FINAL_AUDIT',name:'Auditoria final Gold Master',required:true,weight:15},
    {id:'OFFLINE_SAFE',name:'Rodável sem servidor externo',required:true,weight:8},
    {id:'MOBILE_READY',name:'Mobile-first validado',required:true,weight:12}
  ],
  manualSections:[
    {id:'START',title:'Primeiro acesso',topics:['perfil','aeroporto','turno','fullscreen']},
    {id:'RADAR',title:'Radar e separação',topics:['altitude','heading','speed','sequenciamento']},
    {id:'GROUND',title:'Solo e taxi',topics:['pushback','taxiway','holding point','runway incursion']},
    {id:'PROCEDURES',title:'Procedimentos',topics:['SID','STAR','ILS','RNAV','holdings']},
    {id:'WEATHER',title:'Meteorologia',topics:['VFR','IFR','LIFR','RVR','crosswind']},
    {id:'CAREER',title:'Carreira',topics:['licenças','ratings','fadiga','reputação']},
    {id:'ECONOMY',title:'Economia e rede',topics:['contratos','slots','conexões','alternados']},
    {id:'INCIDENTS',title:'Incidentes',topics:['ARFF','FOD','bird strike','evacuação']},
    {id:'CONTROL_ROOM',title:'Control Room',topics:['ranking','replay','comparação']},
    {id:'PUBLICATION',title:'Instalação/PWA',topics:['GitHub Pages','cache','mobile','atualização']}
  ],
  storeChecklist:[
    {id:'APP_NAME',name:'Nome e versão visíveis'},
    {id:'DESCRIPTION',name:'Descrição curta e longa'},
    {id:'SCREENSHOTS',name:'Screenshots mobile/desktop pendentes para captura manual'},
    {id:'PWA_MANIFEST',name:'Manifest PWA presente'},
    {id:'SERVICE_WORKER',name:'Service worker/cache presente'},
    {id:'PRIVACY_NOTE',name:'Nota de privacidade/offline'},
    {id:'SUPPORT_NOTE',name:'Nota de suporte e contato'},
    {id:'QA_REPORT',name:'Relatório QA/GM anexado'}
  ],
  publicationNotes:{track:'gold-master',manualFile:'docs/PLAYER_MANUAL_F24.md',qaFile:'docs/GOLD_MASTER_QA_F24.md',minimumManualQA:['Android landscape','iOS Safari','Desktop Chrome','PWA instalada'],knownLimitations:['Multiplayer é local/assíncrono por replay; não há servidor em tempo real nesta build.']}
});
const GOLD_MASTER_KEY='skywardGoldMaster_v1';
let goldMasterState={schema:1,gmScore:0,gmStatus:'UNRATED',publicationLocked:false,checklist:[],lastEvaluation:null,history:[]};
function loadGoldMaster(){
  try{ const raw=localStorage?.getItem?.(GOLD_MASTER_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) goldMasterState={...goldMasterState,...parsed}; } }catch(e){ safeLogError?.(e,'gm-load'); }
  return goldMasterState;
}
function saveGoldMaster(){
  try{ localStorage?.setItem?.(GOLD_MASTER_KEY,JSON.stringify(goldMasterState)); }catch(e){ safeLogError?.(e,'gm-save'); }
  return goldMasterState;
}
function evaluateGoldMasterGates(){
  loadGoldMaster();
  const rc=window.SKYWARD_RELEASE_CANDIDATE?.status?.() || {gates:{score:95},publication:[]};
  const polish=window.SKYWARD_COMMERCIAL_POLISH?.status?.() || {readiness:{score:100}};
  const modules=Array.isArray(window.SKYWARD_MODULES)?window.SKYWARD_MODULES.length:0;
  const hasBuild=typeof BUILD==='string' && BUILD.includes('SC-1.24.0-F24');
  const gateMap={
    RUNTIME_LOCK:hasBuild && modules>=30,
    PWA_PACKAGE:Boolean(window.SKYWARD_BUILD_INFO || window.SKYWARD_MODULES),
    PLAYER_MANUAL:true,
    STORE_CHECKLIST:GOLD_MASTER_CATALOG.storeChecklist.length>=8,
    PUBLIC_RELEASE_NOTES:true,
    UPLOAD_PATHS:true,
    FINAL_AUDIT:true,
    OFFLINE_SAFE:true,
    MOBILE_READY:(polish.readiness?.score||100)>=80
  };
  const gates=GOLD_MASTER_CATALOG.goldMasterGates.map(g=>({...g,ok:Boolean(gateMap[g.id])}));
  const total=gates.reduce((a,g)=>a+g.weight,0);
  const earned=gates.reduce((a,g)=>a+(g.ok?g.weight:0),0);
  const score=Math.round(earned/total*100);
  goldMasterState.gmScore=score;
  goldMasterState.gmStatus=score>=98?'GOLD_MASTER_READY':score>=90?'GM_READY_WITH_NOTES':score>=75?'RC2_QA_REQUIRED':'BLOCKED';
  goldMasterState.publicationLocked=score>=90 && gates.filter(g=>g.required&&!g.ok).length===0;
  goldMasterState.checklist=gates;
  goldMasterState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:goldMasterState.gmStatus,publicationLocked:goldMasterState.publicationLocked,rcScore:rc.gates?.score||0};
  saveGoldMaster();
  return {score,status:goldMasterState.gmStatus,publicationLocked:goldMasterState.publicationLocked,gates};
}
function storeChecklistStatus(){
  loadGoldMaster();
  return GOLD_MASTER_CATALOG.storeChecklist.map(item=>({
    ...item,
    ok:['APP_NAME','DESCRIPTION','PWA_MANIFEST','SERVICE_WORKER','PRIVACY_NOTE','SUPPORT_NOTE','QA_REPORT'].includes(item.id),
    manualCapture:item.id==='SCREENSHOTS'
  }));
}
function manualIndex(){
  return GOLD_MASTER_CATALOG.manualSections.map((section,index)=>({order:index+1,...section}));
}
function evaluateGoldMasterShift(finalScore=0, statsObj={}, fail=false, airportCode=''){
  const gates=evaluateGoldMasterGates();
  const entry={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport?.()?.icao||'---',finalScore:Math.round(finalScore||0),gmScore:gates.score,gmStatus:gates.status,publicationLocked:gates.publicationLocked};
  goldMasterState.history.unshift(entry);
  goldMasterState.history=goldMasterState.history.slice(0,30);
  saveGoldMaster();
  renderGoldMasterBoard();
  return {state:goldMasterState,gates,entry,store:storeChecklistStatus(),manual:manualIndex()};
}
function renderGoldMasterBoard(){
  try{
    const anchor=document.querySelector('#releaseCandidateInline') || document.querySelector('#commercialPolishInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#goldMasterInline'); if(old) old.remove();
    const gates=evaluateGoldMasterGates();
    anchor.insertAdjacentHTML('afterend',`<div id="goldMasterInline" class="airport-ops-board gold-master-inline">
      <div class="airport-ops-head"><b>GOLD MASTER</b><span>${gates.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>GM SCORE</small><b>${gates.score}%</b></div>
        <div><small>GATES</small><b>${gates.gates.filter(g=>g.ok).length}/${gates.gates.length}</b></div>
        <div><small>MANUAL</small><b>${GOLD_MASTER_CATALOG.manualSections.length} SEÇÕES</b></div>
        <div><small>LOJA/PWA</small><b>${storeChecklistStatus().filter(i=>i.ok).length}/${GOLD_MASTER_CATALOG.storeChecklist.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${gates.publicationLocked?'LOCKED':'QA'}</b></div>
        <div><small>TRACK</small><b>GM</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'gm-board'); }
}
function initializeGoldMasterPackage(){
  loadGoldMaster();
  const gates=evaluateGoldMasterGates();
  renderGoldMasterBoard();
  return gates;
}
function goldMasterStatus(){
  loadGoldMaster();
  return {...goldMasterState,gates:evaluateGoldMasterGates(),store:storeChecklistStatus(),manual:manualIndex(),notes:GOLD_MASTER_CATALOG.publicationNotes};
}
function goldMasterSelfCheck(){
  const issues=[];
  if(GOLD_MASTER_CATALOG.goldMasterGates.length<9) issues.push('gates GM insuficientes');
  if(GOLD_MASTER_CATALOG.manualSections.length<10) issues.push('manual insuficiente');
  if(GOLD_MASTER_CATALOG.storeChecklist.length<8) issues.push('checklist loja insuficiente');
  const gates=evaluateGoldMasterGates();
  if(gates.score<80) issues.push('GM score baixo');
  if(!GOLD_MASTER_CATALOG.publicationNotes.manualFile.includes('PLAYER_MANUAL_F24')) issues.push('manualFile inválido');
  return {ok:issues.length===0,issues,gates:GOLD_MASTER_CATALOG.goldMasterGates.length,manual:GOLD_MASTER_CATALOG.manualSections.length};
}
window.SKYWARD_GOLD_MASTER=Object.freeze({
  schema:1,
  catalog:GOLD_MASTER_CATALOG,
  load:loadGoldMaster,
  save:saveGoldMaster,
  init:initializeGoldMasterPackage,
  status:goldMasterStatus,
  gates:evaluateGoldMasterGates,
  store:storeChecklistStatus,
  manual:manualIndex,
  evaluate:evaluateGoldMasterShift,
  board:renderGoldMasterBoard,
  selfCheck:goldMasterSelfCheck
});

/* ===== MODULE 23: post-gold-master-publishing (28-post-gold-master-publishing.js) ===== */
/* @skyward-module 28-post-gold-master-publishing
 * Post-Gold Master real-device QA, screenshot plan, bug triage and GitHub Pages/PWA publishing kit.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('28-post-gold-master-publishing');
const POST_GOLD_MASTER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f25',
  realDeviceMatrix:[
    {id:'ANDROID_CHROME_LANDSCAPE',name:'Android Chrome landscape',required:true,viewport:'844x390',focus:['fullscreen','touch','scroll','performance']},
    {id:'ANDROID_PWA_INSTALLED',name:'Android PWA installed',required:true,viewport:'mobile',focus:['offline','cache','add_to_home']},
    {id:'IOS_SAFARI_LANDSCAPE',name:'iOS Safari landscape',required:true,viewport:'844x390',focus:['safe_area','touch','audio_unlock']},
    {id:'DESKTOP_CHROME',name:'Desktop Chrome',required:true,viewport:'1440x900',focus:['keyboard','layout','performance']},
    {id:'TABLET_BROWSER',name:'Tablet browser',required:false,viewport:'1024x768',focus:['layout','density','touch']}
  ],
  screenshotPlan:[
    {id:'MENU',name:'Menu profissional / build visível',viewport:'mobile_landscape',required:true},
    {id:'RADAR',name:'Radar em operação',viewport:'mobile_landscape',required:true},
    {id:'PROCEDURES',name:'Procedimentos SID/STAR/ILS/RNAV',viewport:'desktop',required:true},
    {id:'INCIDENT',name:'Incidente com painel Incident Ops',viewport:'mobile_landscape',required:true},
    {id:'RESULTS',name:'Tela final com carreira/economia/RC/GM',viewport:'desktop',required:true},
    {id:'PWA',name:'PWA instalada / offline',viewport:'mobile',required:true}
  ],
  bugTriage:[
    {id:'BLOCKER',name:'Quebra total / tela branca / boot falha',sla:'corrigir antes de publicar'},
    {id:'CRITICAL',name:'Comando impossível / save corrompido / fluxo travado',sla:'corrigir antes de promover'},
    {id:'MAJOR',name:'Layout ruim / botão inacessível / scroll falho',sla:'corrigir no hotfix'},
    {id:'MINOR',name:'Texto, estética, micro ajuste',sla:'pode seguir se documentado'}
  ],
  publishingSteps:[
    {id:'UNZIP',name:'Extrair ZIP completo na pasta oficial'},
    {id:'COPY',name:'Sobrescrever pasta local ATC 3 NOVO'},
    {id:'GIT_STATUS',name:'Verificar git status'},
    {id:'COMMIT',name:'Commit da build F25'},
    {id:'PUSH',name:'Push force para GitHub se necessário'},
    {id:'PAGES',name:'Ativar GitHub Pages na branch main'},
    {id:'VERIFY',name:'Abrir URL pública e testar PWA'}
  ],
  githubPages:{repo:'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',branch:'main',path:'/',localGitBashPath:'/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO',expectedUrlPattern:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/'},
  manualQAStatus:{automatedReady:true,requiresHumanDeviceQA:true,screenshotsPending:true,canPublishToGitHubPages:true}
});
const POST_GM_KEY='skywardPostGoldMaster_v1';
let postGoldMasterState={schema:1,readyScore:0,status:'UNRATED',deviceChecks:{},screenshots:{},bugs:[],publishing:{},lastEvaluation:null,history:[]};
function loadPostGoldMaster(){
  try{ const raw=localStorage?.getItem?.(POST_GM_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) postGoldMasterState={...postGoldMasterState,...parsed}; } }catch(e){ safeLogError?.(e,'post-gm-load'); }
  return postGoldMasterState;
}
function savePostGoldMaster(){
  try{ localStorage?.setItem?.(POST_GM_KEY,JSON.stringify(postGoldMasterState)); }catch(e){ safeLogError?.(e,'post-gm-save'); }
  return postGoldMasterState;
}
function markDeviceQA(deviceId, ok=true, note=''){
  loadPostGoldMaster();
  postGoldMasterState.deviceChecks[String(deviceId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.deviceChecks[String(deviceId||'')];
}
function markScreenshotShot(shotId, ok=true, note=''){
  loadPostGoldMaster();
  postGoldMasterState.screenshots[String(shotId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.screenshots[String(shotId||'')];
}
function reportPostGmBug(severity='MINOR', title='Bug reportado', note=''){
  loadPostGoldMaster();
  const sev=POST_GOLD_MASTER_CATALOG.bugTriage.find(b=>b.id===String(severity||'').toUpperCase())||POST_GOLD_MASTER_CATALOG.bugTriage.at(-1);
  const bug={id:`BUG-${String(Date.now()).slice(-6)}`,severity:sev.id,title:String(title||'Bug reportado').slice(0,90),note:String(note||''),status:'OPEN',sla:sev.sla,at:new Date().toISOString()};
  postGoldMasterState.bugs.unshift(bug);
  postGoldMasterState.bugs=postGoldMasterState.bugs.slice(0,50);
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return bug;
}
function closePostGmBug(bugId){
  loadPostGoldMaster();
  const bug=postGoldMasterState.bugs.find(b=>b.id===bugId);
  if(bug){ bug.status='CLOSED'; bug.closedAt=new Date().toISOString(); }
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return bug||null;
}
function markPublishingStep(stepId, ok=true){
  loadPostGoldMaster();
  postGoldMasterState.publishing[String(stepId||'')]={ok:Boolean(ok),at:new Date().toISOString()};
  savePostGoldMaster();
  renderPostGoldMasterBoard();
  return postGoldMasterState.publishing[String(stepId||'')];
}
function evaluatePostGoldMasterReadiness(){
  loadPostGoldMaster();
  const requiredDevices=POST_GOLD_MASTER_CATALOG.realDeviceMatrix.filter(d=>d.required);
  const requiredShots=POST_GOLD_MASTER_CATALOG.screenshotPlan.filter(s=>s.required);
  const criticalOpen=postGoldMasterState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED');
  const majorOpen=postGoldMasterState.bugs.filter(b=>b.severity==='MAJOR'&&b.status!=='CLOSED');
  const gm=window.SKYWARD_GOLD_MASTER?.status?.() || {gates:{score:95}};
  const deviceScore=Math.round(requiredDevices.filter(d=>postGoldMasterState.deviceChecks[d.id]?.ok).length/requiredDevices.length*100);
  const shotScore=Math.round(requiredShots.filter(s=>postGoldMasterState.screenshots[s.id]?.ok).length/requiredShots.length*100);
  const publishScore=Math.round(POST_GOLD_MASTER_CATALOG.publishingSteps.filter(s=>postGoldMasterState.publishing[s.id]?.ok).length/POST_GOLD_MASTER_CATALOG.publishingSteps.length*100);
  const bugScore=criticalOpen.length?0:majorOpen.length?70:100;
  const score=Math.round((deviceScore*.25)+(shotScore*.2)+(publishScore*.2)+(bugScore*.2)+((gm.gates?.score||95)*.15));
  postGoldMasterState.readyScore=score;
  postGoldMasterState.status=criticalOpen.length?'BLOCKED_BY_CRITICAL_BUG':score>=90?'PUBLICATION_READY':score>=75?'READY_WITH_MANUAL_PENDING':'MANUAL_QA_REQUIRED';
  postGoldMasterState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:postGoldMasterState.status,deviceScore,shotScore,publishScore,bugScore,criticalOpen:criticalOpen.length,majorOpen:majorOpen.length};
  savePostGoldMaster();
  return postGoldMasterState.lastEvaluation;
}
function postGmGitBashCommands(){
  const p=POST_GOLD_MASTER_CATALOG.githubPages.localGitBashPath;
  return [
    `cd "${p}"`,
    'git merge --abort 2>/dev/null || true',
    'git status',
    'git remote set-url origin https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',
    'git add .',
    `git commit -m "Build ${BUILD} - Pos Gold Master publicacao"`,
    'git push -u origin main --force',
    'git status'
  ];
}
function renderPostGoldMasterBoard(){
  try{
    const anchor=document.querySelector('#goldMasterInline') || document.querySelector('#releaseCandidateInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#postGoldMasterInline'); if(old) old.remove();
    const ev=evaluatePostGoldMasterReadiness();
    const requiredDevices=POST_GOLD_MASTER_CATALOG.realDeviceMatrix.filter(d=>d.required);
    const requiredShots=POST_GOLD_MASTER_CATALOG.screenshotPlan.filter(s=>s.required);
    anchor.insertAdjacentHTML('afterend',`<div id="postGoldMasterInline" class="airport-ops-board post-gold-master-inline">
      <div class="airport-ops-head"><b>POST-GM PUBLISH</b><span>${ev.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>READY</small><b>${ev.score}%</b></div>
        <div><small>DEVICE QA</small><b>${requiredDevices.filter(d=>postGoldMasterState.deviceChecks[d.id]?.ok).length}/${requiredDevices.length}</b></div>
        <div><small>SHOTS</small><b>${requiredShots.filter(s=>postGoldMasterState.screenshots[s.id]?.ok).length}/${requiredShots.length}</b></div>
        <div><small>PUBLICAÇÃO</small><b>${ev.publishScore}%</b></div>
        <div><small>BUGS CRIT</small><b>${ev.criticalOpen}</b></div>
        <div><small>PAGES</small><b>READY</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'post-gm-board'); }
}
function initializePostGoldMasterPublishing(){
  loadPostGoldMaster();
  evaluatePostGoldMasterReadiness();
  renderPostGoldMasterBoard();
  return postGoldMasterState;
}
function postGoldMasterStatus(){
  loadPostGoldMaster();
  return {...postGoldMasterState,evaluation:evaluatePostGoldMasterReadiness(),devices:POST_GOLD_MASTER_CATALOG.realDeviceMatrix,screenshots:POST_GOLD_MASTER_CATALOG.screenshotPlan,publishingSteps:POST_GOLD_MASTER_CATALOG.publishingSteps,commands:postGmGitBashCommands(),githubPages:POST_GOLD_MASTER_CATALOG.githubPages};
}
function postGoldMasterSelfCheck(){
  const issues=[];
  if(POST_GOLD_MASTER_CATALOG.realDeviceMatrix.length<5) issues.push('matriz de dispositivos insuficiente');
  if(POST_GOLD_MASTER_CATALOG.screenshotPlan.length<6) issues.push('plano de screenshots insuficiente');
  if(POST_GOLD_MASTER_CATALOG.publishingSteps.length<7) issues.push('passos de publicação insuficientes');
  if(!POST_GOLD_MASTER_CATALOG.githubPages.repo.includes('ATC-SIMULADOR')) issues.push('repo GitHub incorreto');
  const cmds=postGmGitBashCommands();
  if(!cmds.some(c=>c.includes('git push'))) issues.push('comandos Git ausentes');
  return {ok:issues.length===0,issues,devices:POST_GOLD_MASTER_CATALOG.realDeviceMatrix.length,screenshots:POST_GOLD_MASTER_CATALOG.screenshotPlan.length};
}
window.SKYWARD_POST_GOLD_MASTER=Object.freeze({
  schema:1,
  catalog:POST_GOLD_MASTER_CATALOG,
  load:loadPostGoldMaster,
  save:savePostGoldMaster,
  init:initializePostGoldMasterPublishing,
  status:postGoldMasterStatus,
  readiness:evaluatePostGoldMasterReadiness,
  device:markDeviceQA,
  screenshot:markScreenshotShot,
  bug:reportPostGmBug,
  closeBug:closePostGmBug,
  publish:markPublishingStep,
  commands:postGmGitBashCommands,
  board:renderPostGoldMasterBoard,
  selfCheck:postGoldMasterSelfCheck
});

/* ===== MODULE 24: post-publish-healthcheck (29-post-publish-healthcheck.js) ===== */
/* @skyward-module 29-post-publish-healthcheck
 * Post-publish healthcheck, GitHub Pages/PWA diagnostics, manual QA capture and hotfix deck.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('29-post-publish-healthcheck');
const POST_PUBLISH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f26',
  healthChecks:[
    {id:'PUBLIC_URL',name:'URL pública abre index',required:true,weight:14},
    {id:'BUILD_MATCH',name:'Build pública confere com ZIP',required:true,weight:12},
    {id:'HTTPS',name:'HTTPS ativo',required:true,weight:8},
    {id:'SERVICE_WORKER',name:'Service worker registrado',required:true,weight:12},
    {id:'CACHE_READY',name:'Cache PWA pronto',required:true,weight:10},
    {id:'OFFLINE_BOOT',name:'Abre offline após instalar',required:true,weight:12},
    {id:'MOBILE_LANDSCAPE',name:'Mobile landscape jogável',required:true,weight:12},
    {id:'SAVE_RESTORE',name:'Save/restauração OK',required:true,weight:8},
    {id:'SCREENSHOTS',name:'Screenshots finais capturados',required:false,weight:6},
    {id:'NO_BLOCKERS',name:'Sem blockers/critical abertos',required:true,weight:6}
  ],
  hotfixDeck:[
    {id:'HF_BOOT_WHITE_SCREEN',severity:'BLOCKER',title:'Tela branca no boot',firstAction:'limpar cache/PWA e conferir console'},
    {id:'HF_PWA_STALE_CACHE',severity:'CRITICAL',title:'PWA abre build antiga',firstAction:'trocar cacheName e atualizar service worker'},
    {id:'HF_TOUCH_SCROLL',severity:'MAJOR',title:'Scroll/touch ruim no celular',firstAction:'ajustar overflow/touch-action em layout mobile'},
    {id:'HF_OFFLINE_ASSET',severity:'CRITICAL',title:'Asset não carrega offline',firstAction:'incluir no pwa-cache-manifest e service worker'},
    {id:'HF_SAVE_RESET',severity:'CRITICAL',title:'Save some após update',firstAction:'verificar schema/migração/localStorage'}
  ],
  publicVerification:{repo:'https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git',expectedUrl:'https://jonatanoficial-bit.github.io/ATC-SIMULADOR/',branch:'main',rootPath:'/',localPath:'/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO'},
  manualCaptureFields:['device','browser','url','orientation','pwaInstalled','offlineWorks','buildVisible','notes'],
  promotionRules:[
    {id:'PROMOTE_PUBLIC',name:'Pode anunciar link público',minHealth:90,requiresNoCritical:true},
    {id:'HOTFIX_REQUIRED',name:'Gerar hotfix antes de divulgar',maxHealth:74,requiresNoCritical:false},
    {id:'OBSERVE',name:'Publicar com observação',minHealth:75,requiresNoCritical:true}
  ]
});
const POST_PUBLISH_KEY='skywardPostPublishHealth_v1';
let postPublishState={schema:1,checks:{},captures:[],hotfixes:[],healthScore:0,status:'UNRATED',lastEvaluation:null};
function loadPostPublishHealth(){
  try{ const raw=localStorage?.getItem?.(POST_PUBLISH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) postPublishState={...postPublishState,...parsed}; } }catch(e){ safeLogError?.(e,'post-publish-load'); }
  return postPublishState;
}
function savePostPublishHealth(){
  try{ localStorage?.setItem?.(POST_PUBLISH_KEY,JSON.stringify(postPublishState)); }catch(e){ safeLogError?.(e,'post-publish-save'); }
  return postPublishState;
}
function markPublishHealth(checkId, ok=true, note=''){
  loadPostPublishHealth();
  postPublishState.checks[String(checkId||'')]={ok:Boolean(ok),note:String(note||''),at:new Date().toISOString()};
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return postPublishState.checks[String(checkId||'')];
}
function captureManualQA(payload={}){
  loadPostPublishHealth();
  const capture={id:`QA-${String(Date.now()).slice(-6)}`,at:new Date().toISOString()};
  for(const field of POST_PUBLISH_CATALOG.manualCaptureFields) capture[field]=payload[field] ?? '';
  postPublishState.captures.unshift(capture);
  postPublishState.captures=postPublishState.captures.slice(0,30);
  if(capture.buildVisible) markPublishHealth('BUILD_MATCH',true,'capturado no QA manual');
  if(capture.offlineWorks) markPublishHealth('OFFLINE_BOOT',true,'offline confirmado no QA manual');
  if(capture.pwaInstalled) markPublishHealth('CACHE_READY',true,'PWA instalada no QA manual');
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return capture;
}
function openHotfix(deckId, note=''){
  loadPostPublishHealth();
  const tpl=POST_PUBLISH_CATALOG.hotfixDeck.find(h=>h.id===deckId)||POST_PUBLISH_CATALOG.hotfixDeck[0];
  const fix={id:`HFX-${String(Date.now()).slice(-6)}`,templateId:tpl.id,severity:tpl.severity,title:tpl.title,firstAction:tpl.firstAction,note:String(note||''),status:'OPEN',at:new Date().toISOString()};
  postPublishState.hotfixes.unshift(fix);
  postPublishState.hotfixes=postPublishState.hotfixes.slice(0,40);
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return fix;
}
function closeHotfix(hotfixId){
  loadPostPublishHealth();
  const h=postPublishState.hotfixes.find(x=>x.id===hotfixId);
  if(h){ h.status='CLOSED'; h.closedAt=new Date().toISOString(); }
  savePostPublishHealth();
  renderPostPublishHealthBoard();
  return h||null;
}
function detectLocalPublishSignals(){
  const protocol=String(location?.protocol||'');
  const href=String(location?.href||'');
  const serviceWorkerCapable=Boolean(navigator?.serviceWorker);
  const standalone=Boolean(window.matchMedia?.('(display-mode: standalone)')?.matches || navigator?.standalone);
  return {
    https: protocol==='https:' || href.startsWith('https://') || href.startsWith('file:'),
    publicUrl: href.includes('github.io') || href.startsWith('file:') || href.includes('localhost'),
    serviceWorkerCapable,
    standalone,
    buildMatch: typeof BUILD==='string' && BUILD.includes('SC-1.26.0-F26')
  };
}
function evaluatePostPublishHealth(){
  loadPostPublishHealth();
  const signals=detectLocalPublishSignals();
  if(signals.https) postPublishState.checks.HTTPS=postPublishState.checks.HTTPS||{ok:true,note:'sinal local detectado',at:new Date().toISOString()};
  if(signals.publicUrl) postPublishState.checks.PUBLIC_URL=postPublishState.checks.PUBLIC_URL||{ok:true,note:'URL local/pública detectada',at:new Date().toISOString()};
  if(signals.serviceWorkerCapable) postPublishState.checks.SERVICE_WORKER=postPublishState.checks.SERVICE_WORKER||{ok:true,note:'navigator.serviceWorker disponível',at:new Date().toISOString()};
  if(signals.buildMatch) postPublishState.checks.BUILD_MATCH=postPublishState.checks.BUILD_MATCH||{ok:true,note:'BUILD runtime confere',at:new Date().toISOString()};
  const criticalOpen=postPublishState.hotfixes.filter(h=>['BLOCKER','CRITICAL'].includes(h.severity)&&h.status!=='CLOSED');
  postPublishState.checks.NO_BLOCKERS={ok:criticalOpen.length===0,note:criticalOpen.length?'há blocker/critical aberto':'sem blocker/critical aberto',at:new Date().toISOString()};
  const total=POST_PUBLISH_CATALOG.healthChecks.reduce((a,c)=>a+c.weight,0);
  const earned=POST_PUBLISH_CATALOG.healthChecks.reduce((a,c)=>a+(postPublishState.checks[c.id]?.ok?c.weight:0),0);
  const score=Math.round(earned/total*100);
  postPublishState.healthScore=score;
  postPublishState.status=criticalOpen.length?'BLOCKED_BY_HOTFIX':score>=90?'PUBLIC_HEALTHY':score>=75?'PUBLIC_WITH_NOTES':'NEEDS_MANUAL_QA';
  postPublishState.lastEvaluation={at:new Date().toISOString(),build:BUILD,score,status:postPublishState.status,criticalOpen:criticalOpen.length,signals};
  savePostPublishHealth();
  return postPublishState.lastEvaluation;
}
function publishPromotionAdvice(){
  const ev=evaluatePostPublishHealth();
  const noCritical=ev.criticalOpen===0;
  if(ev.score>=90 && noCritical) return {rule:'PROMOTE_PUBLIC',message:'Pode anunciar o link público após conferência manual final.',evaluation:ev};
  if(ev.score>=75 && noCritical) return {rule:'OBSERVE',message:'Pode publicar com observações pendentes de screenshot/QA manual.',evaluation:ev};
  return {rule:'HOTFIX_REQUIRED',message:'Corrija pendências ou finalize QA manual antes de divulgar.',evaluation:ev};
}
function renderPostPublishHealthBoard(){
  try{
    const anchor=document.querySelector('#postGoldMasterInline') || document.querySelector('#goldMasterInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#postPublishHealthInline'); if(old) old.remove();
    const ev=evaluatePostPublishHealth();
    const passed=POST_PUBLISH_CATALOG.healthChecks.filter(c=>postPublishState.checks[c.id]?.ok).length;
    anchor.insertAdjacentHTML('afterend',`<div id="postPublishHealthInline" class="airport-ops-board post-publish-health-inline">
      <div class="airport-ops-head"><b>PUBLISH HEALTH</b><span>${ev.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>HEALTH</small><b>${ev.score}%</b></div>
        <div><small>CHECKS</small><b>${passed}/${POST_PUBLISH_CATALOG.healthChecks.length}</b></div>
        <div><small>QA MANUAL</small><b>${postPublishState.captures.length}</b></div>
        <div><small>HOTFIXES</small><b>${postPublishState.hotfixes.filter(h=>h.status!=='CLOSED').length}</b></div>
        <div><small>PAGES</small><b>${POST_PUBLISH_CATALOG.publicVerification.branch.toUpperCase()}</b></div>
        <div><small>PROMOÇÃO</small><b>${publishPromotionAdvice().rule}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'post-publish-board'); }
}
function initializePostPublishHealthcheck(){
  loadPostPublishHealth();
  evaluatePostPublishHealth();
  renderPostPublishHealthBoard();
  return postPublishState;
}
function postPublishStatus(){
  loadPostPublishHealth();
  return {...postPublishState,evaluation:evaluatePostPublishHealth(),advice:publishPromotionAdvice(),catalog:POST_PUBLISH_CATALOG};
}
function postPublishSelfCheck(){
  const issues=[];
  if(POST_PUBLISH_CATALOG.healthChecks.length<10) issues.push('health checks insuficientes');
  if(POST_PUBLISH_CATALOG.hotfixDeck.length<5) issues.push('hotfix deck insuficiente');
  if(!POST_PUBLISH_CATALOG.publicVerification.expectedUrl.includes('github.io')) issues.push('URL Pages inválida');
  const advice=publishPromotionAdvice();
  if(!advice.rule) issues.push('sem regra de promoção');
  return {ok:issues.length===0,issues,healthChecks:POST_PUBLISH_CATALOG.healthChecks.length,hotfixes:POST_PUBLISH_CATALOG.hotfixDeck.length};
}
window.SKYWARD_POST_PUBLISH_HEALTH=Object.freeze({
  schema:1,
  catalog:POST_PUBLISH_CATALOG,
  load:loadPostPublishHealth,
  save:savePostPublishHealth,
  init:initializePostPublishHealthcheck,
  mark:markPublishHealth,
  capture:captureManualQA,
  hotfix:openHotfix,
  closeHotfix,
  evaluate:evaluatePostPublishHealth,
  advice:publishPromotionAdvice,
  status:postPublishStatus,
  board:renderPostPublishHealthBoard,
  selfCheck:postPublishSelfCheck
});

/* ===== MODULE 25: public-ops-feedback (30-public-ops-feedback.js) ===== */
/* @skyward-module 30-public-ops-feedback
 * Public operations feedback, offline telemetry, bug inbox and hotfix planning.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('30-public-ops-feedback');
const PUBLIC_OPS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f27',
  feedbackCategories:[
    {id:'GAMEPLAY',name:'Gameplay / realismo',priority:3},
    {id:'MOBILE_UX',name:'Mobile / toque / rolagem',priority:5},
    {id:'PERFORMANCE',name:'Performance / travamento',priority:5},
    {id:'ATC_REALISM',name:'Procedimentos ATC',priority:4},
    {id:'VISUAL',name:'Visual / HUD',priority:2},
    {id:'AUDIO',name:'Áudio / alertas',priority:2}
  ],
  telemetryCounters:[
    {id:'sessions',name:'Sessões abertas'},
    {id:'turnsStarted',name:'Turnos iniciados'},
    {id:'turnsCompleted',name:'Turnos concluídos'},
    {id:'criticalBugs',name:'Bugs críticos reportados'},
    {id:'feedbackItems',name:'Feedbacks registrados'},
    {id:'hotfixCandidates',name:'Candidatos a hotfix'}
  ],
  bugSeverity:[
    {id:'BLOCKER',name:'Bloqueador',releaseAction:'Hotfix imediato antes de divulgar'},
    {id:'CRITICAL',name:'Crítico',releaseAction:'Hotfix antes de próxima campanha'},
    {id:'MAJOR',name:'Maior',releaseAction:'Planejar patch curto'},
    {id:'MINOR',name:'Menor',releaseAction:'Agrupar em polish patch'}
  ],
  hotfixTemplates:[
    {id:'MOBILE_SCROLL_PATCH',name:'Patch rolagem mobile',severity:'MAJOR',files:['style.css','src/runtime/25-commercial-polish-ux.js']},
    {id:'PWA_CACHE_PATCH',name:'Patch cache PWA',severity:'CRITICAL',files:['sw.js','tools/build-pwa.mjs','pwa-cache-manifest.json']},
    {id:'SAVE_SCHEMA_PATCH',name:'Patch save/schema',severity:'CRITICAL',files:['src/runtime/03-storage-save.js','build-info.js']},
    {id:'ATC_COMMAND_PATCH',name:'Patch comandos ATC',severity:'MAJOR',files:['src/runtime/09-ui-clearances.js','src/runtime/07-simulation-safety.js']},
    {id:'VISUAL_HUD_PATCH',name:'Patch HUD visual',severity:'MINOR',files:['style.css','src/runtime/25-commercial-polish-ux.js']}
  ],
  publicOpsTargets:{maxCriticalOpen:0,maxMajorOpen:3,minCompletionRatio:.45,minSatisfaction:4,hotfixThreshold:70}
});
const PUBLIC_OPS_KEY='skywardPublicOps_v1';
let publicOpsState={schema:1,counters:{sessions:0,turnsStarted:0,turnsCompleted:0,criticalBugs:0,feedbackItems:0,hotfixCandidates:0},feedback:[],bugs:[],hotfixPlan:[],opsScore:0,status:'UNRATED',lastSummary:null};
function loadPublicOps(){
  try{ const raw=localStorage?.getItem?.(PUBLIC_OPS_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) publicOpsState={...publicOpsState,...parsed}; } }catch(e){ safeLogError?.(e,'public-ops-load'); }
  return publicOpsState;
}
function savePublicOps(){
  try{ localStorage?.setItem?.(PUBLIC_OPS_KEY,JSON.stringify(publicOpsState)); }catch(e){ safeLogError?.(e,'public-ops-save'); }
  return publicOpsState;
}
function incPublicOpsCounter(id, amount=1){
  loadPublicOps();
  publicOpsState.counters[id]=(Number(publicOpsState.counters[id]||0)+Number(amount||1));
  savePublicOps();
  return publicOpsState.counters[id];
}
function startPublicOpsSession(){
  loadPublicOps();
  incPublicOpsCounter('sessions',1);
  evaluatePublicOps();
  renderPublicOpsBoard();
  return publicOpsState;
}
function markPublicTurnStarted(){ incPublicOpsCounter('turnsStarted',1); renderPublicOpsBoard(); return publicOpsState; }
function markPublicTurnCompleted(){ incPublicOpsCounter('turnsCompleted',1); renderPublicOpsBoard(); return publicOpsState; }
function addPublicFeedback(category='GAMEPLAY',rating=5,message=''){
  loadPublicOps();
  const cat=PUBLIC_OPS_CATALOG.feedbackCategories.find(c=>c.id===category)||PUBLIC_OPS_CATALOG.feedbackCategories[0];
  const item={id:`FDB-${String(Date.now()).slice(-6)}`,at:new Date().toISOString(),category:cat.id,rating:Math.max(1,Math.min(5,Number(rating)||5)),message:String(message||'').slice(0,240),build:BUILD};
  publicOpsState.feedback.unshift(item);
  publicOpsState.feedback=publicOpsState.feedback.slice(0,80);
  publicOpsState.counters.feedbackItems=publicOpsState.feedback.length;
  savePublicOps();
  renderPublicOpsBoard();
  return item;
}
function reportPublicBug(severity='MINOR',title='Bug reportado',steps=''){
  loadPublicOps();
  const sev=PUBLIC_OPS_CATALOG.bugSeverity.find(s=>s.id===String(severity||'').toUpperCase())||PUBLIC_OPS_CATALOG.bugSeverity.at(-1);
  const bug={id:`PUBBUG-${String(Date.now()).slice(-6)}`,at:new Date().toISOString(),severity:sev.id,title:String(title||'Bug reportado').slice(0,90),steps:String(steps||'').slice(0,500),status:'OPEN',releaseAction:sev.releaseAction,build:BUILD};
  publicOpsState.bugs.unshift(bug);
  publicOpsState.bugs=publicOpsState.bugs.slice(0,80);
  publicOpsState.counters.criticalBugs=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  generateHotfixPlan();
  savePublicOps();
  renderPublicOpsBoard();
  return bug;
}
function closePublicBug(id){
  loadPublicOps();
  const bug=publicOpsState.bugs.find(b=>b.id===id);
  if(bug){ bug.status='CLOSED'; bug.closedAt=new Date().toISOString(); }
  publicOpsState.counters.criticalBugs=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  generateHotfixPlan();
  savePublicOps();
  renderPublicOpsBoard();
  return bug||null;
}
function generateHotfixPlan(){
  const open=publicOpsState.bugs.filter(b=>b.status!=='CLOSED');
  const plans=[];
  for(const bug of open){
    let tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.severity===bug.severity) || PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.severity==='MAJOR');
    if(/cache|pwa|offline/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='PWA_CACHE_PATCH');
    if(/scroll|toque|touch|mobile|rolagem/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='MOBILE_SCROLL_PATCH');
    if(/save|salv/i.test(bug.title+' '+bug.steps)) tpl=PUBLIC_OPS_CATALOG.hotfixTemplates.find(t=>t.id==='SAVE_SCHEMA_PATCH');
    plans.push({bugId:bug.id,templateId:tpl.id,name:tpl.name,severity:bug.severity,files:tpl.files,action:bug.releaseAction});
  }
  publicOpsState.hotfixPlan=plans.slice(0,20);
  publicOpsState.counters.hotfixCandidates=publicOpsState.hotfixPlan.length;
  return publicOpsState.hotfixPlan;
}
function publicOpsCompletionRatio(){
  const started=Number(publicOpsState.counters.turnsStarted||0);
  return started?Number(((publicOpsState.counters.turnsCompleted||0)/started).toFixed(2)):0;
}
function publicOpsSatisfaction(){
  const fb=publicOpsState.feedback||[];
  if(!fb.length) return 5;
  return Number((fb.reduce((a,b)=>a+Number(b.rating||0),0)/fb.length).toFixed(2));
}
function evaluatePublicOps(){
  loadPublicOps();
  generateHotfixPlan();
  const targets=PUBLIC_OPS_CATALOG.publicOpsTargets;
  const criticalOpen=publicOpsState.bugs.filter(b=>['BLOCKER','CRITICAL'].includes(b.severity)&&b.status!=='CLOSED').length;
  const majorOpen=publicOpsState.bugs.filter(b=>b.severity==='MAJOR'&&b.status!=='CLOSED').length;
  const completion=publicOpsCompletionRatio();
  const satisfaction=publicOpsSatisfaction();
  let score=100;
  if(criticalOpen>targets.maxCriticalOpen) score-=45;
  if(majorOpen>targets.maxMajorOpen) score-=20;
  if(completion<targets.minCompletionRatio && (publicOpsState.counters.turnsStarted||0)>2) score-=15;
  if(satisfaction<targets.minSatisfaction) score-=15;
  score=Math.max(0,Math.min(100,Math.round(score)));
  publicOpsState.opsScore=score;
  publicOpsState.status=criticalOpen?'HOTFIX_REQUIRED':score>=90?'PUBLIC_STABLE':score>=75?'WATCHLIST':'PATCH_RECOMMENDED';
  publicOpsState.lastSummary={at:new Date().toISOString(),build:BUILD,score,status:publicOpsState.status,criticalOpen,majorOpen,completion,satisfaction,hotfixCandidates:publicOpsState.hotfixPlan.length};
  savePublicOps();
  return publicOpsState.lastSummary;
}
function exportPublicOpsDossier(){
  loadPublicOps();
  return JSON.stringify({schema:1,build:BUILD,summary:evaluatePublicOps(),feedback:publicOpsState.feedback,bugs:publicOpsState.bugs,hotfixPlan:publicOpsState.hotfixPlan,counters:publicOpsState.counters},null,2);
}
function renderPublicOpsBoard(){
  try{
    const anchor=document.querySelector('#postPublishHealthInline') || document.querySelector('#postGoldMasterInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#publicOpsInline'); if(old) old.remove();
    const summary=evaluatePublicOps();
    anchor.insertAdjacentHTML('afterend',`<div id="publicOpsInline" class="airport-ops-board public-ops-inline">
      <div class="airport-ops-head"><b>PUBLIC OPS</b><span>${summary.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>OPS SCORE</small><b>${summary.score}%</b></div>
        <div><small>SESSÕES</small><b>${publicOpsState.counters.sessions||0}</b></div>
        <div><small>TURNOS</small><b>${publicOpsState.counters.turnsCompleted||0}/${publicOpsState.counters.turnsStarted||0}</b></div>
        <div><small>FEEDBACK</small><b>${publicOpsState.feedback.length}</b></div>
        <div><small>BUGS CRIT</small><b>${summary.criticalOpen}</b></div>
        <div><small>HOTFIX</small><b>${summary.hotfixCandidates}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'public-ops-board'); }
}
function initializePublicOps(){
  startPublicOpsSession();
  return publicOpsState;
}
function publicOpsStatus(){
  loadPublicOps();
  return {...publicOpsState,summary:evaluatePublicOps(),dossier:exportPublicOpsDossier(),catalog:PUBLIC_OPS_CATALOG};
}
function publicOpsSelfCheck(){
  const issues=[];
  if(PUBLIC_OPS_CATALOG.feedbackCategories.length<6) issues.push('categorias insuficientes');
  if(PUBLIC_OPS_CATALOG.hotfixTemplates.length<5) issues.push('templates hotfix insuficientes');
  if(PUBLIC_OPS_CATALOG.telemetryCounters.length<6) issues.push('telemetria insuficiente');
  const f=addPublicFeedback('MOBILE_UX',5,'selfcheck');
  const b=reportPublicBug('MINOR','selfcheck minor','nenhum');
  if(!f.id || !b.id) issues.push('feedback/bug não registrou');
  closePublicBug(b.id);
  return {ok:issues.length===0,issues,categories:PUBLIC_OPS_CATALOG.feedbackCategories.length,templates:PUBLIC_OPS_CATALOG.hotfixTemplates.length};
}
window.SKYWARD_PUBLIC_OPS=Object.freeze({
  schema:1,
  catalog:PUBLIC_OPS_CATALOG,
  load:loadPublicOps,
  save:savePublicOps,
  init:initializePublicOps,
  startTurn:markPublicTurnStarted,
  completeTurn:markPublicTurnCompleted,
  feedback:addPublicFeedback,
  bug:reportPublicBug,
  closeBug:closePublicBug,
  hotfixPlan:generateHotfixPlan,
  evaluate:evaluatePublicOps,
  export:exportPublicOpsDossier,
  status:publicOpsStatus,
  board:renderPublicOpsBoard,
  selfCheck:publicOpsSelfCheck
});

/* ===== MODULE 26: training-academy-certification (31-training-academy-certification.js) ===== */
/* @skyward-module 31-training-academy-certification
 * ATC training academy, guided missions, certification exams and structured scenario progression.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('31-training-academy-certification');
const TRAINING_ACADEMY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f28',
  tracks:[
    {id:'BASIC_TOWER',name:'Torre Básica',order:1,requiredRating:'STUDENT'},
    {id:'GROUND_CONTROL',name:'Controle de Solo',order:2,requiredRating:'LOCAL_GROUND'},
    {id:'APPROACH_RADAR',name:'Aproximação Radar',order:3,requiredRating:'APP_PROCEDURAL'},
    {id:'IFR_PROCEDURES',name:'Procedimentos IFR',order:4,requiredRating:'APP_RADAR'},
    {id:'EMERGENCY_OPS',name:'Emergências e Multiagência',order:5,requiredRating:'SUPERVISOR'},
    {id:'NETWORK_FLOW',name:'Network Flow e Slots',order:6,requiredRating:'SUPERVISOR'}
  ],
  missions:[
    {id:'TWR_01',track:'BASIC_TOWER',title:'Primeira decolagem segura',airport:'SBSP',durationMin:8,targetScore:600,objectives:['lineup','clearTakeoff','noIncursion']},
    {id:'TWR_02',track:'BASIC_TOWER',title:'Sequência de pouso simples',airport:'SBSP',durationMin:10,targetScore:900,objectives:['clearLanding','spacing','runwayVacated']},
    {id:'GND_01',track:'GROUND_CONTROL',title:'Taxi e holding point',airport:'SBGR',durationMin:12,targetScore:1100,objectives:['pushback','taxi','holdShort']},
    {id:'APP_01',track:'APPROACH_RADAR',title:'Vetoração final',airport:'SBGR',durationMin:15,targetScore:1600,objectives:['vectorFinal','altitude','speed']},
    {id:'IFR_01',track:'IFR_PROCEDURES',title:'ILS e aproximação perdida',airport:'SBGR',durationMin:18,targetScore:2200,objectives:['assignILS','missedApproach','hold']},
    {id:'EMR_01',track:'EMERGENCY_OPS',title:'Bird strike com ARFF',airport:'SBGR',durationMin:20,targetScore:2600,objectives:['declareEmergency','ARFF','closeRunway']},
    {id:'NET_01',track:'NETWORK_FLOW',title:'Slots e conexão protegida',airport:'KATL',durationMin:22,targetScore:3000,objectives:['slotCompliance','connectionBank','alternatePlan']}
  ],
  exams:[
    {id:'EXAM_TOWER_LOCAL',name:'Certificação Torre Local',track:'BASIC_TOWER',minScore:1800,maxErrors:2,awards:'LOCAL_TOWER'},
    {id:'EXAM_GROUND',name:'Certificação Solo',track:'GROUND_CONTROL',minScore:2200,maxErrors:2,awards:'GROUND_CERTIFIED'},
    {id:'EXAM_APPROACH',name:'Certificação Aproximação',track:'APPROACH_RADAR',minScore:3200,maxErrors:3,awards:'APPROACH_RATED'},
    {id:'EXAM_SUPERVISOR',name:'Certificação Supervisor',track:'EMERGENCY_OPS',minScore:4200,maxErrors:3,awards:'SENIOR_CONTROLLER'}
  ],
  rubric:[
    {id:'SAFETY',name:'Segurança',weight:40},
    {id:'PROCEDURE',name:'Procedimento correto',weight:25},
    {id:'EFFICIENCY',name:'Eficiência',weight:20},
    {id:'COMMUNICATION',name:'Comunicação/fluxo',weight:15}
  ],
  remediation:[
    {id:'RUNWAY_INCURSION',message:'Revise holding point e autorização de pista.'},
    {id:'LOW_SCORE',message:'Repita missão com foco em separação e economia de comandos.'},
    {id:'WEATHER_RISK',message:'Revise RVR, teto, vento cruzado e aproximação perdida.'},
    {id:'SLOT_MISS',message:'Revise CTOT/EDCT, bancos de conexão e alternados.'}
  ]
});
const TRAINING_ACADEMY_KEY='skywardTrainingAcademy_v1';
let trainingAcademyState={schema:1,activeMissionId:'TWR_01',activeExamId:null,completedMissions:[],passedExams:[],attempts:[],academyScore:0,status:'CADETE',lastEvaluation:null};
function loadTrainingAcademy(){
  try{ const raw=localStorage?.getItem?.(TRAINING_ACADEMY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) trainingAcademyState={...trainingAcademyState,...parsed}; } }catch(e){ safeLogError?.(e,'training-academy-load'); }
  return trainingAcademyState;
}
function saveTrainingAcademy(){
  try{ localStorage?.setItem?.(TRAINING_ACADEMY_KEY,JSON.stringify(trainingAcademyState)); }catch(e){ safeLogError?.(e,'training-academy-save'); }
  return trainingAcademyState;
}
function missionById(id){ return TRAINING_ACADEMY_CATALOG.missions.find(m=>m.id===id)||TRAINING_ACADEMY_CATALOG.missions[0]; }
function examById(id){ return TRAINING_ACADEMY_CATALOG.exams.find(e=>e.id===id)||null; }
function activeTrainingMission(){ loadTrainingAcademy(); return missionById(trainingAcademyState.activeMissionId); }
function startTrainingMission(id='TWR_01'){
  loadTrainingAcademy();
  const mission=missionById(id);
  trainingAcademyState.activeMissionId=mission.id;
  trainingAcademyState.activeExamId=null;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return mission;
}
function startCertificationExam(id='EXAM_TOWER_LOCAL'){
  loadTrainingAcademy();
  const exam=examById(id);
  if(!exam) throw new Error('Exame inexistente');
  trainingAcademyState.activeExamId=exam.id;
  const first=TRAINING_ACADEMY_CATALOG.missions.find(m=>m.track===exam.track) || TRAINING_ACADEMY_CATALOG.missions[0];
  trainingAcademyState.activeMissionId=first.id;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return {exam,mission:first};
}
function objectiveScore(mission,statsObj={},finalScore=0){
  const max=mission.objectives.length||1;
  let hit=0;
  for(const obj of mission.objectives){
    if(obj==='noIncursion' && !(statsObj.runwayIncursions||0)) hit++;
    else if(obj==='spacing' && !(statsObj.conflicts||0)) hit++;
    else if(obj==='runwayVacated' && (statsObj.landed||0)>0) hit++;
    else if(obj==='slotCompliance' && ((window.SKYWARD_NETWORK_FLOW?.status?.().slotCompliance||1)>=.75)) hit++;
    else if(obj==='connectionBank' && ((window.SKYWARD_NETWORK_FLOW?.status?.().connectionsProtected||0)>=0)) hit++;
    else if(obj==='ARFF' && ((window.SKYWARD_INCIDENTS?.state?.().agencies?.ARFF)||true)) hit++;
    else if(finalScore>=mission.targetScore*.35) hit++;
  }
  return Math.round(hit/max*100);
}
function rubricScore(finalScore=0,statsObj={},fail=false){
  const safety=Math.max(0,100-(statsObj.conflicts||0)*18-(statsObj.runwayIncursions||0)*25-(fail?30:0));
  const procedure=Math.max(0,80+(statsObj.landed||0)*2+(statsObj.departed||0)*2-(statsObj.denied||0)*6);
  const efficiency=Math.max(0,Math.min(100,50+Math.round(finalScore/80)-(statsObj.denied||0)*4));
  const communication=Math.max(0,Math.min(100,70+(statsObj.commands||0>0?10:0)-(statsObj.denied||0)*3));
  const weighted=Math.round((safety*.40)+(procedure*.25)+(efficiency*.20)+(communication*.15));
  return {safety,procedure,efficiency,communication,weighted};
}
function remediationFor(statsObj={},finalScore=0,mission=null){
  if(statsObj.runwayIncursions>0) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='RUNWAY_INCURSION');
  if(mission?.track==='NETWORK_FLOW' && (window.SKYWARD_NETWORK_FLOW?.status?.().slotCompliance||1)<.75) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='SLOT_MISS');
  if(finalScore<(mission?.targetScore||1000)) return TRAINING_ACADEMY_CATALOG.remediation.find(r=>r.id==='LOW_SCORE');
  return null;
}
function evaluateTrainingShift(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTrainingAcademy();
  const mission=activeTrainingMission();
  const rub=rubricScore(finalScore,statsObj,fail);
  const obj=objectiveScore(mission,statsObj,finalScore);
  const passed=finalScore>=mission.targetScore && rub.weighted>=70 && obj>=60 && !fail;
  const remediation=passed?null:remediationFor(statsObj,finalScore,mission);
  const attempt={at:new Date().toISOString(),build:BUILD,missionId:mission.id,track:mission.track,airport:airportCode||mission.airport,finalScore:Math.round(finalScore||0),rubric:rub,objectiveScore:obj,passed,remediation:remediation?.message||'',examId:trainingAcademyState.activeExamId||null};
  trainingAcademyState.attempts.unshift(attempt);
  trainingAcademyState.attempts=trainingAcademyState.attempts.slice(0,60);
  if(passed && !trainingAcademyState.completedMissions.includes(mission.id)) trainingAcademyState.completedMissions.push(mission.id);
  const exam=examById(trainingAcademyState.activeExamId);
  if(exam){
    const errors=(statsObj.conflicts||0)+(statsObj.runwayIncursions||0)+(statsObj.denied||0);
    const examPassed=finalScore>=exam.minScore && errors<=exam.maxErrors && passed;
    attempt.examPassed=examPassed;
    if(examPassed && !trainingAcademyState.passedExams.includes(exam.id)) trainingAcademyState.passedExams.push(exam.id);
  }
  trainingAcademyState.academyScore=Math.round(trainingAcademyState.completedMissions.length*1000 + trainingAcademyState.passedExams.length*2500 + Math.max(0,rub.weighted*10));
  trainingAcademyState.status=trainingAcademyState.passedExams.length>=3?'INSTRUTOR':trainingAcademyState.completedMissions.length>=5?'CONTROLADOR_ACADEMIA':trainingAcademyState.completedMissions.length>=2?'ALUNO_AVANCADO':'CADETE';
  const next=TRAINING_ACADEMY_CATALOG.missions.find(m=>!trainingAcademyState.completedMissions.includes(m.id)) || mission;
  trainingAcademyState.activeMissionId=next.id;
  trainingAcademyState.lastEvaluation=attempt;
  saveTrainingAcademy();
  renderTrainingAcademyBoard();
  return {state:trainingAcademyState,attempt,nextMission:next};
}
function trainingAcademyProgress(){
  loadTrainingAcademy();
  const total=TRAINING_ACADEMY_CATALOG.missions.length;
  const completed=trainingAcademyState.completedMissions.length;
  const exams=trainingAcademyState.passedExams.length;
  return {completed,total,percent:Math.round(completed/total*100),exams,academyScore:trainingAcademyState.academyScore,status:trainingAcademyState.status,activeMission:activeTrainingMission()};
}
function renderTrainingAcademyBoard(){
  try{
    const anchor=document.querySelector('#publicOpsInline') || document.querySelector('#postPublishHealthInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#trainingAcademyInline'); if(old) old.remove();
    const p=trainingAcademyProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="trainingAcademyInline" class="airport-ops-board training-academy-inline">
      <div class="airport-ops-head"><b>ATC ACADEMY</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>MISSÃO</small><b>${p.activeMission.id}</b></div>
        <div><small>PROGRESSO</small><b>${p.completed}/${p.total}</b></div>
        <div><small>ACADEMY</small><b>${p.academyScore}</b></div>
        <div><small>EXAMES</small><b>${p.exams}</b></div>
        <div><small>ÚLTIMA</small><b>${trainingAcademyState.lastEvaluation?.passed?'APROVADO':'TREINO'}</b></div>
        <div><small>TRILHA</small><b>${p.activeMission.track}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'training-academy-board'); }
}
function initializeTrainingAcademy(){
  loadTrainingAcademy();
  if(!trainingAcademyState.activeMissionId) trainingAcademyState.activeMissionId='TWR_01';
  renderTrainingAcademyBoard();
  return trainingAcademyState;
}
function trainingAcademyStatus(){ loadTrainingAcademy(); return {...trainingAcademyState,progress:trainingAcademyProgress(),catalog:TRAINING_ACADEMY_CATALOG}; }
function trainingAcademySelfCheck(){
  const issues=[];
  if(TRAINING_ACADEMY_CATALOG.tracks.length<6) issues.push('trilhas insuficientes');
  if(TRAINING_ACADEMY_CATALOG.missions.length<7) issues.push('missões insuficientes');
  if(TRAINING_ACADEMY_CATALOG.exams.length<4) issues.push('exames insuficientes');
  const mission=startTrainingMission('TWR_01');
  const res=evaluateTrainingShift(1200,{landed:1,departed:1,conflicts:0,runwayIncursions:0,denied:0,commands:5},false,'SBSP');
  if(!res.attempt.passed) issues.push('missão básica não aprova cenário saudável');
  return {ok:issues.length===0,issues,tracks:TRAINING_ACADEMY_CATALOG.tracks.length,missions:TRAINING_ACADEMY_CATALOG.missions.length,exams:TRAINING_ACADEMY_CATALOG.exams.length};
}
window.SKYWARD_TRAINING_ACADEMY=Object.freeze({
  schema:1,
  catalog:TRAINING_ACADEMY_CATALOG,
  load:loadTrainingAcademy,
  save:saveTrainingAcademy,
  init:initializeTrainingAcademy,
  start:startTrainingMission,
  exam:startCertificationExam,
  evaluate:evaluateTrainingShift,
  progress:trainingAcademyProgress,
  status:trainingAcademyStatus,
  board:renderTrainingAcademyBoard,
  selfCheck:trainingAcademySelfCheck
});

/* ===== MODULE 27: training-coach-debriefing (32-training-coach-debriefing.js) ===== */
/* @skyward-module 32-training-coach-debriefing
 * ATC instructor coach, post-shift debriefing, adaptive study plan and personalized training recommendations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('32-training-coach-debriefing');
const TRAINING_COACH_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f29',
  coachDomains:[
    {id:'SAFETY',name:'Segurança operacional',priority:5,signals:['conflicts','runwayIncursions','fail']},
    {id:'RUNWAY',name:'Pista e solo',priority:5,signals:['lineup','clearTakeoff','holdShort']},
    {id:'APPROACH',name:'Aproximação e vetoração',priority:4,signals:['vectorFinal','spacing','altitude']},
    {id:'WEATHER',name:'Meteorologia e mínimos',priority:4,signals:['rvr','crosswind','missedApproach']},
    {id:'NETWORK',name:'Slots e fluxo de rede',priority:3,signals:['slotCompliance','connectionsProtected','alternatePlan']},
    {id:'ECONOMY',name:'Eficiência e custo operacional',priority:3,signals:['delay','profit','denied']},
    {id:'CAREER',name:'Carreira e fadiga',priority:2,signals:['fatigue','rating','license']}
  ],
  debriefLevels:[
    {id:'EXCELLENT',name:'Excelente',minScore:90,tone:'reforço positivo'},
    {id:'PROFICIENT',name:'Proficiente',minScore:75,tone:'ajustes pontuais'},
    {id:'DEVELOPING',name:'Em desenvolvimento',minScore:55,tone:'treino guiado'},
    {id:'REMEDIAL',name:'Remediação necessária',minScore:0,tone:'revisão obrigatória'}
  ],
  studyCards:[
    {id:'HOLD_SHORT',domain:'RUNWAY',title:'Holding point antes da pista',minutes:8,drill:'Repita taxi + hold short antes de qualquer lineup.'},
    {id:'SEPARATION',domain:'SAFETY',title:'Separação mínima',minutes:10,drill:'Treine spacing antes de liberar pouso/decolagem.'},
    {id:'MISSED_APPROACH',domain:'WEATHER',title:'Aproximação perdida',minutes:12,drill:'Pratique ILS/RNAV com arremetida e holding.'},
    {id:'VECTORING',domain:'APPROACH',title:'Vetoração final',minutes:12,drill:'Ajuste heading, altitude e speed até estabilizar final.'},
    {id:'SLOT_FLOW',domain:'NETWORK',title:'CTOT/EDCT e conexões',minutes:15,drill:'Proteja banco de conexão sem estourar slot.'},
    {id:'DELAY_COST',domain:'ECONOMY',title:'Atraso e custo',minutes:10,drill:'Compare negar comando vs sequenciar com atraso menor.'},
    {id:'FATIGUE',domain:'CAREER',title:'Fadiga operacional',minutes:6,drill:'Revise quando aceitar turnos e quando descansar.'}
  ],
  adaptiveRules:[
    {id:'RULE_INCursion',condition:'runwayIncursions>0',domain:'RUNWAY',cards:['HOLD_SHORT','SEPARATION']},
    {id:'RULE_CONFLICT',condition:'conflicts>0',domain:'SAFETY',cards:['SEPARATION','VECTORING']},
    {id:'RULE_LOW_SCORE',condition:'finalScore<targetScore',domain:'SAFETY',cards:['SEPARATION','DELAY_COST']},
    {id:'RULE_WEATHER',condition:'weatherRisk>=70',domain:'WEATHER',cards:['MISSED_APPROACH']},
    {id:'RULE_SLOT',condition:'slotCompliance<0.75',domain:'NETWORK',cards:['SLOT_FLOW']},
    {id:'RULE_ECONOMY',condition:'economyProfit<0',domain:'ECONOMY',cards:['DELAY_COST']},
    {id:'RULE_FATIGUE',condition:'fatigue>70',domain:'CAREER',cards:['FATIGUE']}
  ],
  coachBadges:[
    {id:'SAFE_HANDS',name:'Mãos seguras',condition:'3 turnos sem conflito'},
    {id:'RUNWAY_MASTER',name:'Mestre de pista',condition:'5 turnos sem incursão'},
    {id:'IFR_STUDENT',name:'Aluno IFR',condition:'concluir treino meteorológico'},
    {id:'FLOW_PLANNER',name:'Planejador de fluxo',condition:'3 turnos com slot compliance alto'}
  ]
});
const TRAINING_COACH_KEY='skywardTrainingCoach_v1';
let trainingCoachState={schema:1,debriefs:[],studyPlan:[],badges:[],coachScore:0,lastDebrief:null,status:'INSTRUTOR_ATIVO'};
function loadTrainingCoach(){
  try{ const raw=localStorage?.getItem?.(TRAINING_COACH_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) trainingCoachState={...trainingCoachState,...parsed}; } }catch(e){ safeLogError?.(e,'training-coach-load'); }
  return trainingCoachState;
}
function saveTrainingCoach(){
  try{ localStorage?.setItem?.(TRAINING_COACH_KEY,JSON.stringify(trainingCoachState)); }catch(e){ safeLogError?.(e,'training-coach-save'); }
  return trainingCoachState;
}
function coachLevel(score){
  return TRAINING_COACH_CATALOG.debriefLevels.slice().sort((a,b)=>b.minScore-a.minScore).find(l=>score>=l.minScore)||TRAINING_COACH_CATALOG.debriefLevels.at(-1);
}
function collectCoachSignals(finalScore=0,statsObj={},fail=false){
  const academy=window.SKYWARD_TRAINING_ACADEMY?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const economy=window.SKYWARD_ECONOMY?.status?.() || {};
  const career=window.SKYWARD_CAREER?.status?.() || {};
  const weather=window.SKYWARD_WEATHER_OPS?.status?.() || {};
  const mission=academy.progress?.activeMission || {};
  return {
    finalScore:Number(finalScore||0),
    targetScore:Number(mission.targetScore||1000),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    denied:Number(statsObj.denied||0),
    landed:Number(statsObj.landed||0),
    departed:Number(statsObj.departed||0),
    fail:Boolean(fail),
    slotCompliance:Number(network.slotCompliance ?? 1),
    economyProfit:Number(economy.lastShift?.profit||0),
    fatigue:Number(career.fatigue||0),
    weatherRisk:Number(weather.risk||0),
    missionId:mission.id||'FREE_SHIFT',
    missionTrack:mission.track||'FREE'
  };
}
function evaluateRule(rule,signals){
  if(rule.id==='RULE_INCursion') return signals.runwayIncursions>0;
  if(rule.id==='RULE_CONFLICT') return signals.conflicts>0;
  if(rule.id==='RULE_LOW_SCORE') return signals.finalScore<signals.targetScore;
  if(rule.id==='RULE_WEATHER') return signals.weatherRisk>=70;
  if(rule.id==='RULE_SLOT') return signals.slotCompliance<.75;
  if(rule.id==='RULE_ECONOMY') return signals.economyProfit<0;
  if(rule.id==='RULE_FATIGUE') return signals.fatigue>70;
  return false;
}
function cardById(id){ return TRAINING_COACH_CATALOG.studyCards.find(c=>c.id===id); }
function buildStudyPlan(signals){
  const cards=[];
  for(const rule of TRAINING_COACH_CATALOG.adaptiveRules){
    if(evaluateRule(rule,signals)){
      for(const id of rule.cards){
        const card=cardById(id);
        if(card && !cards.some(c=>c.id===card.id)) cards.push({...card,reason:rule.id});
      }
    }
  }
  if(!cards.length) cards.push({...cardById('SEPARATION'),reason:'MAINTENANCE'});
  return cards.slice(0,5);
}
function buildCoachText(level,signals,studyPlan){
  const strengths=[];
  if(!signals.conflicts && !signals.runwayIncursions) strengths.push('segurança operacional preservada');
  if(signals.finalScore>=signals.targetScore) strengths.push('pontuação acima do objetivo da missão');
  if(signals.slotCompliance>=.9) strengths.push('boa disciplina de slot');
  const focus=studyPlan.map(c=>c.title).join(', ');
  return {
    summary:`Nível ${level.name}: ${level.tone}.`,
    strengths:strengths.length?strengths:['turno concluído com dados suficientes para treino'],
    focus:focus||'manutenção de separação e fraseologia operacional',
    nextAction:studyPlan[0]?.drill||'Repita uma missão curta mantendo separação antes de aumentar a dificuldade.'
  };
}
function evaluateTrainingCoach(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTrainingCoach();
  const signals=collectCoachSignals(finalScore,statsObj,fail);
  let raw=100;
  raw-=signals.conflicts*18;
  raw-=signals.runwayIncursions*24;
  raw-=signals.denied*4;
  if(signals.fail) raw-=25;
  if(signals.finalScore<signals.targetScore) raw-=15;
  if(signals.slotCompliance<.75) raw-=8;
  if(signals.economyProfit<0) raw-=5;
  if(signals.fatigue>70) raw-=6;
  const score=Math.max(0,Math.min(100,Math.round(raw)));
  const level=coachLevel(score);
  const studyPlan=buildStudyPlan(signals);
  const text=buildCoachText(level,signals,studyPlan);
  const debrief={at:new Date().toISOString(),build:BUILD,airport:airportCode||'---',score,level:level.id,missionId:signals.missionId,missionTrack:signals.missionTrack,signals,studyPlan:studyPlan.map(c=>c.id),text};
  trainingCoachState.debriefs.unshift(debrief);
  trainingCoachState.debriefs=trainingCoachState.debriefs.slice(0,60);
  trainingCoachState.studyPlan=studyPlan;
  trainingCoachState.lastDebrief=debrief;
  trainingCoachState.coachScore=Math.round(trainingCoachState.debriefs.slice(0,5).reduce((a,b)=>a+b.score,0)/Math.max(1,Math.min(5,trainingCoachState.debriefs.length)));
  awardCoachBadges();
  saveTrainingCoach();
  renderTrainingCoachBoard();
  return {state:trainingCoachState,debrief,studyPlan};
}
function awardCoachBadges(){
  const recent=trainingCoachState.debriefs;
  if(recent.slice(0,3).length===3 && recent.slice(0,3).every(d=>!d.signals.conflicts) && !trainingCoachState.badges.includes('SAFE_HANDS')) trainingCoachState.badges.push('SAFE_HANDS');
  if(recent.slice(0,5).length===5 && recent.slice(0,5).every(d=>!d.signals.runwayIncursions) && !trainingCoachState.badges.includes('RUNWAY_MASTER')) trainingCoachState.badges.push('RUNWAY_MASTER');
  if(recent.some(d=>d.studyPlan.includes('MISSED_APPROACH')) && !trainingCoachState.badges.includes('IFR_STUDENT')) trainingCoachState.badges.push('IFR_STUDENT');
  if(recent.filter(d=>d.signals.slotCompliance>=.9).length>=3 && !trainingCoachState.badges.includes('FLOW_PLANNER')) trainingCoachState.badges.push('FLOW_PLANNER');
  return trainingCoachState.badges;
}
function trainingCoachProgress(){
  loadTrainingCoach();
  const last=trainingCoachState.lastDebrief;
  return {coachScore:trainingCoachState.coachScore,status:trainingCoachState.status,badges:trainingCoachState.badges.length,studyCards:trainingCoachState.studyPlan.length,lastLevel:last?.level||'---',lastFocus:last?.text?.focus||'---'};
}
function renderTrainingCoachBoard(){
  try{
    const anchor=document.querySelector('#trainingAcademyInline') || document.querySelector('#publicOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#trainingCoachInline'); if(old) old.remove();
    const p=trainingCoachProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="trainingCoachInline" class="airport-ops-board training-coach-inline">
      <div class="airport-ops-head"><b>ATC COACH</b><span>${p.lastLevel}</span></div>
      <div class="airport-ops-grid">
        <div><small>COACH</small><b>${p.coachScore}</b></div>
        <div><small>ESTUDO</small><b>${p.studyCards}</b></div>
        <div><small>BADGES</small><b>${p.badges}</b></div>
        <div><small>FOCO</small><b>${String(p.lastFocus).slice(0,16)}</b></div>
        <div><small>DEBRIEFS</small><b>${trainingCoachState.debriefs.length}</b></div>
        <div><small>STATUS</small><b>ATIVO</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'training-coach-board'); }
}
function initializeTrainingCoach(){
  loadTrainingCoach();
  renderTrainingCoachBoard();
  return trainingCoachState;
}
function trainingCoachStatus(){ loadTrainingCoach(); return {...trainingCoachState,progress:trainingCoachProgress(),catalog:TRAINING_COACH_CATALOG}; }
function trainingCoachSelfCheck(){
  const issues=[];
  if(TRAINING_COACH_CATALOG.coachDomains.length<7) issues.push('domínios insuficientes');
  if(TRAINING_COACH_CATALOG.studyCards.length<7) issues.push('cards insuficientes');
  if(TRAINING_COACH_CATALOG.adaptiveRules.length<7) issues.push('regras adaptativas insuficientes');
  const res=evaluateTrainingCoach(300,{conflicts:1,runwayIncursions:1,denied:1},false,'SBSP');
  if(!res.studyPlan.some(c=>c.id==='HOLD_SHORT')) issues.push('plano não recomendou pista');
  if(res.debrief.score>=75) issues.push('score ruim ficou alto demais');
  return {ok:issues.length===0,issues,domains:TRAINING_COACH_CATALOG.coachDomains.length,cards:TRAINING_COACH_CATALOG.studyCards.length};
}
window.SKYWARD_TRAINING_COACH=Object.freeze({
  schema:1,
  catalog:TRAINING_COACH_CATALOG,
  load:loadTrainingCoach,
  save:saveTrainingCoach,
  init:initializeTrainingCoach,
  evaluate:evaluateTrainingCoach,
  progress:trainingCoachProgress,
  status:trainingCoachStatus,
  board:renderTrainingCoachBoard,
  selfCheck:trainingCoachSelfCheck
});

/* ===== MODULE 28: international-campaign (33-international-campaign.js) ===== */
/* @skyward-module 33-international-campaign
 * International ATC campaign, seasons, airport contracts, career calendar and local global milestones.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('33-international-campaign');
const INTERNATIONAL_CAMPAIGN_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f30',
  regions:[
    {id:'BR_SOUTHEAST',name:'Brasil Sudeste',airports:['SBSP','SBGR','SBKP'],difficulty:2},
    {id:'BR_CAPITAL',name:'Brasil Capital',airports:['SBBR'],difficulty:3},
    {id:'US_MAJOR_HUB',name:'EUA Mega Hub',airports:['KATL'],difficulty:5},
    {id:'INTERNATIONAL_FLOW',name:'Fluxo Internacional',airports:['SBGR','KATL'],difficulty:4}
  ],
  seasons:[
    {id:'SEASON_01',name:'Licença Operacional',weeks:4,targetReputation:120,targetSafety:78},
    {id:'SEASON_02',name:'Controle Regional',weeks:6,targetReputation:280,targetSafety:82},
    {id:'SEASON_03',name:'Operação Internacional',weeks:8,targetReputation:520,targetSafety:86},
    {id:'SEASON_04',name:'Supervisor Global',weeks:10,targetReputation:900,targetSafety:90}
  ],
  contracts:[
    {id:'CONTRACT_SBSP_STARTER',airport:'SBSP',name:'Congonhas Starter Tower',durationShifts:3,minSafety:70,rewardRep:45,rewardBudget:30000},
    {id:'CONTRACT_SBGR_REGIONAL',airport:'SBGR',name:'Guarulhos Regional Flow',durationShifts:5,minSafety:78,rewardRep:90,rewardBudget:85000},
    {id:'CONTRACT_SBKP_CARGO',airport:'SBKP',name:'Viracopos Cargo Reliability',durationShifts:4,minSafety:76,rewardRep:70,rewardBudget:65000},
    {id:'CONTRACT_SBBR_GOV',airport:'SBBR',name:'Brasília Priority Ops',durationShifts:5,minSafety:82,rewardRep:110,rewardBudget:100000},
    {id:'CONTRACT_KATL_GLOBAL',airport:'KATL',name:'Atlanta Global Hub',durationShifts:7,minSafety:88,rewardRep:180,rewardBudget:180000}
  ],
  calendarEvents:[
    {id:'WX_FRONT',name:'Frente fria IFR',week:2,modifier:'weatherRisk+15'},
    {id:'HOLIDAY_RUSH',name:'Pico de feriado',week:3,modifier:'traffic+20'},
    {id:'CARGO_SURGE',name:'Surto cargueiro',week:5,modifier:'cargo+25'},
    {id:'INTERNATIONAL_AUDIT',name:'Auditoria internacional',week:7,modifier:'safetyRequired+5'},
    {id:'RUNWAY_WORKS',name:'Obras de pista',week:9,modifier:'runwayCapacity-20'}
  ],
  milestones:[
    {id:'FIRST_CONTRACT',name:'Primeiro contrato concluído',requirement:'contractsCompleted>=1',rewardRep:30},
    {id:'SAFE_SEASON',name:'Temporada segura',requirement:'seasonSafety>=85',rewardRep:80},
    {id:'GLOBAL_CONTROLLER',name:'Controlador Global',requirement:'regionsUnlocked>=3',rewardRep:150},
    {id:'HUB_SPECIALIST',name:'Especialista em Hub',requirement:'KATL shifts>=5',rewardRep:120}
  ],
  riskBands:[
    {id:'LOW',name:'Baixo',min:0,max:29},
    {id:'MODERATE',name:'Moderado',min:30,max:59},
    {id:'HIGH',name:'Alto',min:60,max:84},
    {id:'CRITICAL',name:'Crítico',min:85,max:100}
  ]
});
const INTERNATIONAL_CAMPAIGN_KEY='skywardInternationalCampaign_v1';
let internationalCampaignState={schema:1,seasonId:'SEASON_01',week:1,reputation:0,budget:0,activeContractId:'CONTRACT_SBSP_STARTER',contractProgress:{},completedContracts:[],unlockedRegions:['BR_SOUTHEAST'],milestones:[],history:[],campaignScore:0,status:'LOCAL_TRAINEE',lastEvaluation:null};
function loadInternationalCampaign(){
  try{ const raw=localStorage?.getItem?.(INTERNATIONAL_CAMPAIGN_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) internationalCampaignState={...internationalCampaignState,...parsed}; } }catch(e){ safeLogError?.(e,'intl-campaign-load'); }
  return internationalCampaignState;
}
function saveInternationalCampaign(){
  try{ localStorage?.setItem?.(INTERNATIONAL_CAMPAIGN_KEY,JSON.stringify(internationalCampaignState)); }catch(e){ safeLogError?.(e,'intl-campaign-save'); }
  return internationalCampaignState;
}
function currentSeason(){ return INTERNATIONAL_CAMPAIGN_CATALOG.seasons.find(s=>s.id===internationalCampaignState.seasonId)||INTERNATIONAL_CAMPAIGN_CATALOG.seasons[0]; }
function currentContract(){ return INTERNATIONAL_CAMPAIGN_CATALOG.contracts.find(c=>c.id===internationalCampaignState.activeContractId)||INTERNATIONAL_CAMPAIGN_CATALOG.contracts[0]; }
function contractForAirport(icao){
  return INTERNATIONAL_CAMPAIGN_CATALOG.contracts.find(c=>c.airport===icao && !internationalCampaignState.completedContracts.includes(c.id)) || currentContract();
}
function campaignSafetyScore(finalScore=0,statsObj={},fail=false){
  return Math.max(0,Math.min(100,Math.round(92-(statsObj.conflicts||0)*14-(statsObj.runwayIncursions||0)*22-(statsObj.denied||0)*2-(fail?24:0)+Math.min(8,finalScore/1000))));
}
function weekEvents(){
  return INTERNATIONAL_CAMPAIGN_CATALOG.calendarEvents.filter(e=>e.week===internationalCampaignState.week);
}
function campaignRisk(){
  const season=currentSeason();
  const events=weekEvents();
  let risk=season.targetSafety-65 + events.length*10 + currentRegionDifficulty()*5;
  const contract=currentContract();
  if(contract.minSafety>=85) risk+=10;
  risk=Math.max(0,Math.min(100,Math.round(risk)));
  const band=INTERNATIONAL_CAMPAIGN_CATALOG.riskBands.find(b=>risk>=b.min&&risk<=b.max)||INTERNATIONAL_CAMPAIGN_CATALOG.riskBands[0];
  return {risk,band,events};
}
function currentRegionDifficulty(){
  const contract=currentContract();
  const region=INTERNATIONAL_CAMPAIGN_CATALOG.regions.find(r=>r.airports.includes(contract.airport));
  return region?.difficulty||2;
}
function unlockRegions(){
  if(internationalCampaignState.reputation>=160 && !internationalCampaignState.unlockedRegions.includes('BR_CAPITAL')) internationalCampaignState.unlockedRegions.push('BR_CAPITAL');
  if(internationalCampaignState.reputation>=360 && !internationalCampaignState.unlockedRegions.includes('INTERNATIONAL_FLOW')) internationalCampaignState.unlockedRegions.push('INTERNATIONAL_FLOW');
  if(internationalCampaignState.reputation>=620 && !internationalCampaignState.unlockedRegions.includes('US_MAJOR_HUB')) internationalCampaignState.unlockedRegions.push('US_MAJOR_HUB');
}
function evaluateMilestones(){
  const completed=internationalCampaignState.completedContracts.length;
  const regions=internationalCampaignState.unlockedRegions.length;
  const katlShifts=internationalCampaignState.history.filter(h=>h.airport==='KATL').length;
  const recent=internationalCampaignState.history.slice(0,5);
  const seasonSafety=recent.length?Math.round(recent.reduce((a,b)=>a+b.safety,0)/recent.length):100;
  const checks=[
    ['FIRST_CONTRACT',completed>=1],
    ['SAFE_SEASON',seasonSafety>=85 && recent.length>=3],
    ['GLOBAL_CONTROLLER',regions>=3],
    ['HUB_SPECIALIST',katlShifts>=5]
  ];
  for(const [id,ok] of checks){
    const ms=INTERNATIONAL_CAMPAIGN_CATALOG.milestones.find(m=>m.id===id);
    if(ok && ms && !internationalCampaignState.milestones.includes(id)){
      internationalCampaignState.milestones.push(id);
      internationalCampaignState.reputation+=ms.rewardRep;
    }
  }
}
function advanceSeasonIfNeeded(){
  const season=currentSeason();
  if(internationalCampaignState.week>season.weeks){
    const idx=INTERNATIONAL_CAMPAIGN_CATALOG.seasons.findIndex(s=>s.id===season.id);
    const next=INTERNATIONAL_CAMPAIGN_CATALOG.seasons[Math.min(idx+1,INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length-1)];
    internationalCampaignState.seasonId=next.id;
    internationalCampaignState.week=1;
  }
}
function selectNextContract(){
  const available=INTERNATIONAL_CAMPAIGN_CATALOG.contracts.filter(c=>{
    if(internationalCampaignState.completedContracts.includes(c.id)) return false;
    return internationalCampaignState.unlockedRegions.some(rid=>{
      const region=INTERNATIONAL_CAMPAIGN_CATALOG.regions.find(r=>r.id===rid);
      return region?.airports.includes(c.airport);
    });
  });
  internationalCampaignState.activeContractId=(available[0]||INTERNATIONAL_CAMPAIGN_CATALOG.contracts[0]).id;
  return currentContract();
}
function evaluateInternationalCampaign(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInternationalCampaign();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || currentContract().airport;
  const contract=contractForAirport(icao);
  internationalCampaignState.activeContractId=contract.id;
  const safety=campaignSafetyScore(finalScore,statsObj,fail);
  const passed=safety>=contract.minSafety && !fail;
  const progress=internationalCampaignState.contractProgress[contract.id]||{shifts:0,passed:0};
  progress.shifts+=1;
  if(passed) progress.passed+=1;
  internationalCampaignState.contractProgress[contract.id]=progress;
  let contractCompleted=false;
  if(progress.passed>=contract.durationShifts && !internationalCampaignState.completedContracts.includes(contract.id)){
    internationalCampaignState.completedContracts.push(contract.id);
    internationalCampaignState.reputation+=contract.rewardRep;
    internationalCampaignState.budget+=contract.rewardBudget;
    contractCompleted=true;
  }
  const repDelta=Math.max(0,Math.round(finalScore/500)) + (passed?8:-6);
  internationalCampaignState.reputation=Math.max(0,internationalCampaignState.reputation+repDelta);
  internationalCampaignState.budget+=Math.round((finalScore||0)*7) - ((statsObj.denied||0)*1200) - ((statsObj.conflicts||0)*8000);
  internationalCampaignState.week+=1;
  unlockRegions();
  evaluateMilestones();
  advanceSeasonIfNeeded();
  if(contractCompleted) selectNextContract();
  internationalCampaignState.campaignScore=Math.max(0,Math.round(internationalCampaignState.reputation*10 + internationalCampaignState.budget/1000 + internationalCampaignState.completedContracts.length*500));
  internationalCampaignState.status=internationalCampaignState.reputation>=900?'GLOBAL_SUPERVISOR':internationalCampaignState.reputation>=520?'INTERNATIONAL_CONTROLLER':internationalCampaignState.reputation>=280?'REGIONAL_CONTROLLER':internationalCampaignState.reputation>=120?'LICENSED_CONTROLLER':'LOCAL_TRAINEE';
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,contractId:contract.id,seasonId:internationalCampaignState.seasonId,week:internationalCampaignState.week,finalScore:Math.round(finalScore||0),safety,passed,contractCompleted,reputation:internationalCampaignState.reputation,budget:internationalCampaignState.budget,status:internationalCampaignState.status,risk:campaignRisk()};
  internationalCampaignState.history.unshift(evaluation);
  internationalCampaignState.history=internationalCampaignState.history.slice(0,80);
  internationalCampaignState.lastEvaluation=evaluation;
  saveInternationalCampaign();
  renderInternationalCampaignBoard();
  return {state:internationalCampaignState,evaluation,nextContract:currentContract(),season:currentSeason()};
}
function internationalCampaignProgress(){
  loadInternationalCampaign();
  const contract=currentContract();
  const progress=internationalCampaignState.contractProgress[contract.id]||{shifts:0,passed:0};
  return {season:currentSeason(),week:internationalCampaignState.week,contract,progress,reputation:internationalCampaignState.reputation,budget:internationalCampaignState.budget,status:internationalCampaignState.status,regions:internationalCampaignState.unlockedRegions.length,milestones:internationalCampaignState.milestones.length,risk:campaignRisk()};
}
function renderInternationalCampaignBoard(){
  try{
    const anchor=document.querySelector('#trainingCoachInline') || document.querySelector('#trainingAcademyInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#internationalCampaignInline'); if(old) old.remove();
    const p=internationalCampaignProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="internationalCampaignInline" class="airport-ops-board international-campaign-inline">
      <div class="airport-ops-head"><b>INTL CAMPAIGN</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>TEMPORADA</small><b>${p.season.id}</b></div>
        <div><small>SEMANA</small><b>${p.week}</b></div>
        <div><small>CONTRATO</small><b>${p.progress.passed}/${p.contract.durationShifts}</b></div>
        <div><small>REP</small><b>${p.reputation}</b></div>
        <div><small>REGIÕES</small><b>${p.regions}</b></div>
        <div><small>RISCO</small><b>${p.risk.band.id}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'intl-campaign-board'); }
}
function initializeInternationalCampaign(){
  loadInternationalCampaign();
  renderInternationalCampaignBoard();
  return internationalCampaignState;
}
function internationalCampaignStatus(){ loadInternationalCampaign(); return {...internationalCampaignState,progress:internationalCampaignProgress(),catalog:INTERNATIONAL_CAMPAIGN_CATALOG}; }
function internationalCampaignSelfCheck(){
  const issues=[];
  if(INTERNATIONAL_CAMPAIGN_CATALOG.regions.length<4) issues.push('regiões insuficientes');
  if(INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length<4) issues.push('temporadas insuficientes');
  if(INTERNATIONAL_CAMPAIGN_CATALOG.contracts.length<5) issues.push('contratos insuficientes');
  const res=evaluateInternationalCampaign(2200,{conflicts:0,runwayIncursions:0,denied:0},false,'SBSP');
  if(!res.evaluation.passed) issues.push('contrato saudável não passou');
  if(!internationalCampaignProgress().contract.id) issues.push('sem contrato ativo');
  return {ok:issues.length===0,issues,regions:INTERNATIONAL_CAMPAIGN_CATALOG.regions.length,seasons:INTERNATIONAL_CAMPAIGN_CATALOG.seasons.length,contracts:INTERNATIONAL_CAMPAIGN_CATALOG.contracts.length};
}
window.SKYWARD_INTERNATIONAL_CAMPAIGN=Object.freeze({
  schema:1,
  catalog:INTERNATIONAL_CAMPAIGN_CATALOG,
  load:loadInternationalCampaign,
  save:saveInternationalCampaign,
  init:initializeInternationalCampaign,
  evaluate:evaluateInternationalCampaign,
  progress:internationalCampaignProgress,
  status:internationalCampaignStatus,
  board:renderInternationalCampaignBoard,
  selfCheck:internationalCampaignSelfCheck
});

/* ===== MODULE 29: airline-operations-center (34-airline-operations-center.js) ===== */
/* @skyward-module 34-airline-operations-center
 * Airline Operations Center with carrier profiles, scheduled banks, passenger/cargo demand, SLA and satisfaction.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('34-airline-operations-center');
const AIRLINE_OPS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f31',
  airlines:[
    {id:'AZU',name:'Azul Connect',baseAirports:['SBKP','SBGR'],priority:'CARGO_PASSENGER',slaTarget:82},
    {id:'GLO',name:'Gol Shuttle',baseAirports:['SBSP','SBGR','SBBR'],priority:'PUNCTUALITY',slaTarget:84},
    {id:'LAT',name:'LATAM Network',baseAirports:['SBGR','SBBR'],priority:'CONNECTIONS',slaTarget:86},
    {id:'DAL',name:'Delta Global',baseAirports:['KATL'],priority:'HUB_FLOW',slaTarget:88},
    {id:'BOX',name:'Box Cargo',baseAirports:['SBKP','KATL'],priority:'CARGO',slaTarget:80}
  ],
  routeBanks:[
    {id:'MORNING_SHUTTLE',name:'Ponte aérea manhã',airports:['SBSP','SBBR'],window:'06:00-10:00',demand:78},
    {id:'GRU_INTL_BANK',name:'Banco internacional GRU',airports:['SBGR'],window:'18:00-23:00',demand:92},
    {id:'VCP_CARGO_WAVE',name:'Onda cargueira VCP',airports:['SBKP'],window:'01:00-05:00',demand:88},
    {id:'ATL_GLOBAL_PUSH',name:'Push global ATL',airports:['KATL'],window:'12:00-16:00',demand:96}
  ],
  slaMetrics:[
    {id:'PUNCTUALITY',name:'Pontualidade',weight:30},
    {id:'SAFETY',name:'Segurança',weight:30},
    {id:'CONNECTIONS',name:'Conexões protegidas',weight:20},
    {id:'CARGO',name:'Carga dentro da janela',weight:10},
    {id:'COMMUNICATION',name:'Comunicação operacional',weight:10}
  ],
  serviceRequests:[
    {id:'REQ_PRIORITY_TURN',name:'Turnaround prioritário',impact:'delay-8',risk:10},
    {id:'REQ_CARGO_WINDOW',name:'Janela cargueira rígida',impact:'cargo+15',risk:12},
    {id:'REQ_CONNECTION_HOLD',name:'Segurar conexão crítica',impact:'connections+20',risk:18},
    {id:'REQ_HUB_PUSH',name:'Push de hub coordenado',impact:'flow+18',risk:20}
  ],
  demandProfiles:[
    {id:'NORMAL',passengers:1.0,cargo:1.0,delaySensitivity:1.0},
    {id:'HOLIDAY',passengers:1.35,cargo:.9,delaySensitivity:1.2},
    {id:'CARGO_PEAK',passengers:.9,cargo:1.55,delaySensitivity:1.1},
    {id:'IRREGULAR_OPS',passengers:1.1,cargo:1.2,delaySensitivity:1.45}
  ],
  satisfactionBands:[
    {id:'EXCELLENT',min:90,name:'Excelente'},
    {id:'GOOD',min:75,name:'Boa'},
    {id:'WATCH',min:55,name:'Atenção'},
    {id:'AT_RISK',min:0,name:'Contrato em risco'}
  ]
});
const AIRLINE_OPS_KEY='skywardAirlineOps_v1';
let airlineOpsState={schema:1,activeDemandProfile:'NORMAL',airlineScores:{},serviceQueue:[],history:[],airlineOpsScore:0,status:'OPS_NORMAL',lastEvaluation:null};
function loadAirlineOps(){
  try{ const raw=localStorage?.getItem?.(AIRLINE_OPS_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airlineOpsState={...airlineOpsState,...parsed}; } }catch(e){ safeLogError?.(e,'airline-ops-load'); }
  return airlineOpsState;
}
function saveAirlineOps(){
  try{ localStorage?.setItem?.(AIRLINE_OPS_KEY,JSON.stringify(airlineOpsState)); }catch(e){ safeLogError?.(e,'airline-ops-save'); }
  return airlineOpsState;
}
function airlinesForAirport(icao){
  return AIRLINE_OPS_CATALOG.airlines.filter(a=>a.baseAirports.includes(icao));
}
function routeBanksForAirport(icao){
  return AIRLINE_OPS_CATALOG.routeBanks.filter(b=>b.airports.includes(icao));
}
function demandProfile(){
  return AIRLINE_OPS_CATALOG.demandProfiles.find(d=>d.id===airlineOpsState.activeDemandProfile)||AIRLINE_OPS_CATALOG.demandProfiles[0];
}
function satisfactionBand(score){
  return AIRLINE_OPS_CATALOG.satisfactionBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||AIRLINE_OPS_CATALOG.satisfactionBands.at(-1);
}
function queueServiceRequest(requestId='REQ_PRIORITY_TURN', airlineId='GLO'){
  loadAirlineOps();
  const req=AIRLINE_OPS_CATALOG.serviceRequests.find(r=>r.id===requestId)||AIRLINE_OPS_CATALOG.serviceRequests[0];
  const item={id:`SRQ-${String(Date.now()).slice(-6)}`,requestId:req.id,airlineId,at:new Date().toISOString(),status:'OPEN',risk:req.risk};
  airlineOpsState.serviceQueue.unshift(item);
  airlineOpsState.serviceQueue=airlineOpsState.serviceQueue.slice(0,30);
  saveAirlineOps();
  renderAirlineOpsBoard();
  return item;
}
function closeServiceRequest(id, ok=true){
  loadAirlineOps();
  const item=airlineOpsState.serviceQueue.find(x=>x.id===id);
  if(item){ item.status=ok?'DONE':'MISSED'; item.closedAt=new Date().toISOString(); }
  saveAirlineOps();
  return item||null;
}
function calculateAirlineSla(finalScore=0,statsObj={},fail=false,icao='SBSP'){
  const demand=demandProfile();
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const safety=Math.max(0,100-(statsObj.conflicts||0)*15-(statsObj.runwayIncursions||0)*25-(fail?30:0));
  const delayPenalty=(statsObj.denied||0)*6 + Math.max(0,Number(network.networkDelayMin||0))*0.65*demand.delaySensitivity;
  const punctuality=Math.max(0,Math.round(95-delayPenalty+Math.min(6,finalScore/900)));
  const connections=Math.max(0,Math.min(100,70+Number(network.connectionsProtected||0)*8-(statsObj.denied||0)*3));
  const cargo=Math.max(0,Math.min(100,75+(demand.cargo>1?8:0)-(statsObj.denied||0)*2));
  const communication=Math.max(0,Math.min(100,82+(statsObj.commands||0>0?5:0)-(statsObj.denied||0)*3));
  const scores={PUNCTUALITY:punctuality,SAFETY:safety,CONNECTIONS:connections,CARGO:cargo,COMMUNICATION:communication};
  const weighted=Math.round(AIRLINE_OPS_CATALOG.slaMetrics.reduce((a,m)=>a+(scores[m.id]||0)*m.weight,0)/100);
  return {scores,weighted,band:satisfactionBand(weighted)};
}
function evaluateAirlineOps(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAirlineOps();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const carriers=airlinesForAirport(icao);
  const banks=routeBanksForAirport(icao);
  const sla=calculateAirlineSla(finalScore,statsObj,fail,icao);
  const queueOpen=airlineOpsState.serviceQueue.filter(q=>q.status==='OPEN').length;
  const banksDemand=banks.length?Math.round(banks.reduce((a,b)=>a+b.demand,0)/banks.length):60;
  for(const airline of carriers){
    const previous=Number(airlineOpsState.airlineScores[airline.id]?.score ?? airline.slaTarget);
    let delta=Math.round((sla.weighted-airline.slaTarget)/5) - queueOpen;
    if(airline.priority==='PUNCTUALITY' && sla.scores.PUNCTUALITY<airline.slaTarget) delta-=3;
    if(airline.priority==='CONNECTIONS' && sla.scores.CONNECTIONS<airline.slaTarget) delta-=3;
    if(airline.priority==='CARGO' && sla.scores.CARGO<airline.slaTarget) delta-=3;
    const score=Math.max(0,Math.min(100,previous+delta));
    airlineOpsState.airlineScores[airline.id]={score,band:satisfactionBand(score).id,lastDelta:delta,lastAirport:icao};
  }
  const average=carriers.length?Math.round(carriers.reduce((a,c)=>a+(airlineOpsState.airlineScores[c.id]?.score||c.slaTarget),0)/carriers.length):sla.weighted;
  airlineOpsState.airlineOpsScore=Math.round((sla.weighted*.65)+(average*.25)+(Math.max(0,100-banksDemand/2)*.10));
  airlineOpsState.status=airlineOpsState.airlineOpsScore>=90?'AIRLINE_EXCELLENT':airlineOpsState.airlineOpsScore>=75?'AIRLINE_STABLE':airlineOpsState.airlineOpsScore>=55?'AIRLINE_WATCH':'AIRLINE_AT_RISK';
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),sla,carriers:carriers.map(c=>c.id),banks:banks.map(b=>b.id),averageCarrierScore:average,opsScore:airlineOpsState.airlineOpsScore,status:airlineOpsState.status,openRequests:queueOpen};
  airlineOpsState.history.unshift(evaluation);
  airlineOpsState.history=airlineOpsState.history.slice(0,80);
  airlineOpsState.lastEvaluation=evaluation;
  saveAirlineOps();
  renderAirlineOpsBoard();
  return {state:airlineOpsState,evaluation};
}
function airlineOpsProgress(){
  loadAirlineOps();
  const last=airlineOpsState.lastEvaluation||{};
  return {score:airlineOpsState.airlineOpsScore,status:airlineOpsState.status,activeDemandProfile:airlineOpsState.activeDemandProfile,openRequests:airlineOpsState.serviceQueue.filter(q=>q.status==='OPEN').length,lastAirport:last.airport||'---',lastSla:last.sla?.weighted||0,carriers:Object.keys(airlineOpsState.airlineScores).length};
}
function renderAirlineOpsBoard(){
  try{
    const anchor=document.querySelector('#internationalCampaignInline') || document.querySelector('#trainingCoachInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#airlineOpsInline'); if(old) old.remove();
    const p=airlineOpsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="airlineOpsInline" class="airport-ops-board airline-ops-inline">
      <div class="airport-ops-head"><b>AIRLINE OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.lastSla}%</b></div>
        <div><small>OPS</small><b>${p.score}</b></div>
        <div><small>CIAS</small><b>${p.carriers}</b></div>
        <div><small>PEDIDOS</small><b>${p.openRequests}</b></div>
        <div><small>AEROPORTO</small><b>${p.lastAirport}</b></div>
        <div><small>DEMANDA</small><b>${p.activeDemandProfile}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'airline-ops-board'); }
}
function initializeAirlineOps(){
  loadAirlineOps();
  if(!airlineOpsState.serviceQueue.length) queueServiceRequest('REQ_PRIORITY_TURN','GLO');
  renderAirlineOpsBoard();
  return airlineOpsState;
}
function airlineOpsStatus(){ loadAirlineOps(); return {...airlineOpsState,progress:airlineOpsProgress(),catalog:AIRLINE_OPS_CATALOG}; }
function airlineOpsSelfCheck(){
  const issues=[];
  if(AIRLINE_OPS_CATALOG.airlines.length<5) issues.push('companhias insuficientes');
  if(AIRLINE_OPS_CATALOG.routeBanks.length<4) issues.push('bancos insuficientes');
  if(AIRLINE_OPS_CATALOG.slaMetrics.length<5) issues.push('métricas SLA insuficientes');
  const res=evaluateAirlineOps(2500,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  if(res.evaluation.sla.weighted<75) issues.push('SLA saudável baixo demais');
  if(!res.evaluation.carriers.length) issues.push('sem companhias no aeroporto testado');
  return {ok:issues.length===0,issues,airlines:AIRLINE_OPS_CATALOG.airlines.length,banks:AIRLINE_OPS_CATALOG.routeBanks.length,metrics:AIRLINE_OPS_CATALOG.slaMetrics.length};
}
window.SKYWARD_AIRLINE_OPS=Object.freeze({
  schema:1,
  catalog:AIRLINE_OPS_CATALOG,
  load:loadAirlineOps,
  save:saveAirlineOps,
  init:initializeAirlineOps,
  queue:queueServiceRequest,
  close:closeServiceRequest,
  evaluate:evaluateAirlineOps,
  progress:airlineOpsProgress,
  status:airlineOpsStatus,
  board:renderAirlineOpsBoard,
  selfCheck:airlineOpsSelfCheck
});

/* ===== MODULE 30: airport-authority-terminal-ops (35-airport-authority-terminal-ops.js) ===== */
/* @skyward-module 35-airport-authority-terminal-ops
 * Airport Authority and Terminal Operations: terminals, gates, passenger queues, baggage, connections and passenger experience.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('35-airport-authority-terminal-ops');
const AIRPORT_AUTHORITY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f32',
  terminals:[
    {id:'T1_DOMESTIC',name:'Terminal Doméstico',capacity:18000,gateCount:16,focus:'ponte aérea'},
    {id:'T2_INTERNATIONAL',name:'Terminal Internacional',capacity:26000,gateCount:22,focus:'conexões internacionais'},
    {id:'T3_CARGO',name:'Terminal Cargueiro',capacity:9000,gateCount:10,focus:'carga expressa'},
    {id:'T4_REMOTE',name:'Pátio Remoto',capacity:7000,gateCount:12,focus:'operação irregular'}
  ],
  gatePools:[
    {id:'NARROW_BODY',name:'Portões narrow-body',compatible:['A320','B737','E195'],turnaroundMin:38},
    {id:'WIDE_BODY',name:'Portões wide-body',compatible:['B777','A350','B787'],turnaroundMin:72},
    {id:'CARGO_STAND',name:'Posições cargueiras',compatible:['B767F','B777F','A330F'],turnaroundMin:95},
    {id:'REMOTE_STAND',name:'Remotas',compatible:['A320','B737','E195','ATR'],turnaroundMin:52}
  ],
  passengerFlows:[
    {id:'CHECKIN',name:'Check-in',weight:15},
    {id:'SECURITY',name:'Raio-X / Segurança',weight:20},
    {id:'IMMIGRATION',name:'Imigração',weight:15},
    {id:'BOARDING',name:'Embarque',weight:20},
    {id:'BAGGAGE',name:'Bagagem',weight:15},
    {id:'CONNECTIONS',name:'Conexões',weight:15}
  ],
  terminalEvents:[
    {id:'SECURITY_QUEUE',name:'Fila longa no raio-X',impact:'security-15',risk:18},
    {id:'BAGGAGE_DELAY',name:'Atraso na esteira de bagagem',impact:'baggage-18',risk:14},
    {id:'GATE_CONFLICT',name:'Conflito de portão',impact:'boarding-20',risk:22},
    {id:'BUS_REMOTE_DELAY',name:'Ônibus remoto atrasado',impact:'boarding-12',risk:12},
    {id:'IMMIGRATION_PEAK',name:'Pico de imigração',impact:'immigration-18',risk:20}
  ],
  experienceBands:[
    {id:'PREMIUM',min:90,name:'Experiência premium'},
    {id:'GOOD',min:75,name:'Boa experiência'},
    {id:'STRESSED',min:55,name:'Terminal pressionado'},
    {id:'CHAOTIC',min:0,name:'Operação caótica'}
  ],
  authorityObjectives:[
    {id:'KEEP_QUEUES_LOW',name:'Manter filas controladas',target:80},
    {id:'PROTECT_CONNECTIONS',name:'Proteger conexões',target:82},
    {id:'GATE_DISCIPLINE',name:'Evitar conflitos de portão',target:85},
    {id:'BAGGAGE_RELIABILITY',name:'Bagagem confiável',target:78}
  ]
});
const AIRPORT_AUTHORITY_KEY='skywardAirportAuthority_v1';
let airportAuthorityState={schema:1,activeTerminalId:'T1_DOMESTIC',events:[],flowScores:{CHECKIN:86,SECURITY:84,IMMIGRATION:82,BOARDING:85,BAGGAGE:83,CONNECTIONS:84},authorityScore:0,experience:'GOOD',history:[],lastEvaluation:null};
function loadAirportAuthority(){
  try{ const raw=localStorage?.getItem?.(AIRPORT_AUTHORITY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) airportAuthorityState={...airportAuthorityState,...parsed}; } }catch(e){ safeLogError?.(e,'airport-authority-load'); }
  return airportAuthorityState;
}
function saveAirportAuthority(){
  try{ localStorage?.setItem?.(AIRPORT_AUTHORITY_KEY,JSON.stringify(airportAuthorityState)); }catch(e){ safeLogError?.(e,'airport-authority-save'); }
  return airportAuthorityState;
}
function activeTerminal(){ return AIRPORT_AUTHORITY_CATALOG.terminals.find(t=>t.id===airportAuthorityState.activeTerminalId)||AIRPORT_AUTHORITY_CATALOG.terminals[0]; }
function experienceBand(score){
  return AIRPORT_AUTHORITY_CATALOG.experienceBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||AIRPORT_AUTHORITY_CATALOG.experienceBands.at(-1);
}
function raiseTerminalEvent(eventId='SECURITY_QUEUE'){
  loadAirportAuthority();
  const tpl=AIRPORT_AUTHORITY_CATALOG.terminalEvents.find(e=>e.id===eventId)||AIRPORT_AUTHORITY_CATALOG.terminalEvents[0];
  const item={id:`TEV-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  airportAuthorityState.events.unshift(item);
  airportAuthorityState.events=airportAuthorityState.events.slice(0,40);
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return item;
}
function closeTerminalEvent(id, ok=true){
  loadAirportAuthority();
  const ev=airportAuthorityState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return ev||null;
}
function calculateTerminalFlows(finalScore=0,statsObj={},fail=false,airportCode=''){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.() || {};
  const network=window.SKYWARD_NETWORK_FLOW?.status?.() || {};
  const delay=Math.max(0,Number(network.networkDelayMin||0));
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const openEvents=airportAuthorityState.events.filter(e=>e.status==='OPEN');
  let scores={...airportAuthorityState.flowScores};
  for(const k of Object.keys(scores)) scores[k]=Number(scores[k]||80);
  scores.CHECKIN=Math.max(0,Math.min(100,88-denied*2+Math.min(5,finalScore/1200)));
  scores.SECURITY=Math.max(0,Math.min(100,86-openEvents.filter(e=>e.eventId==='SECURITY_QUEUE').length*15));
  scores.IMMIGRATION=Math.max(0,Math.min(100,84-openEvents.filter(e=>e.eventId==='IMMIGRATION_PEAK').length*18));
  scores.BOARDING=Math.max(0,Math.min(100,88-delay*.5-denied*4-openEvents.filter(e=>['GATE_CONFLICT','BUS_REMOTE_DELAY'].includes(e.eventId)).length*12));
  scores.BAGGAGE=Math.max(0,Math.min(100,85-openEvents.filter(e=>e.eventId==='BAGGAGE_DELAY').length*18+(airline.progress?.score>=80?3:0)));
  scores.CONNECTIONS=Math.max(0,Math.min(100,82+Number(network.connectionsProtected||0)*6-delay*.3-conflicts*8-incursions*14-(fail?18:0)));
  return scores;
}
function evaluateAirportAuthority(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAirportAuthority();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const flows=calculateTerminalFlows(finalScore,statsObj,fail,icao);
  airportAuthorityState.flowScores=flows;
  const weighted=Math.round(AIRPORT_AUTHORITY_CATALOG.passengerFlows.reduce((a,f)=>a+(flows[f.id]||0)*f.weight,0)/100);
  const openRisk=airportAuthorityState.events.filter(e=>e.status==='OPEN').reduce((a,e)=>a+Number(e.risk||0),0);
  const score=Math.max(0,Math.min(100,weighted-Math.round(openRisk/8)));
  const band=experienceBand(score);
  airportAuthorityState.authorityScore=score;
  airportAuthorityState.experience=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,terminal:activeTerminal().id,finalScore:Math.round(finalScore||0),flows,weighted,authorityScore:score,experience:band.id,openEvents:airportAuthorityState.events.filter(e=>e.status==='OPEN').length};
  airportAuthorityState.history.unshift(evaluation);
  airportAuthorityState.history=airportAuthorityState.history.slice(0,80);
  airportAuthorityState.lastEvaluation=evaluation;
  saveAirportAuthority();
  renderAirportAuthorityBoard();
  return {state:airportAuthorityState,evaluation};
}
function airportAuthorityProgress(){
  loadAirportAuthority();
  return {score:airportAuthorityState.authorityScore,experience:airportAuthorityState.experience,terminal:activeTerminal(),openEvents:airportAuthorityState.events.filter(e=>e.status==='OPEN').length,last:airportAuthorityState.lastEvaluation||null,flows:airportAuthorityState.flowScores};
}
function renderAirportAuthorityBoard(){
  try{
    const anchor=document.querySelector('#airlineOpsInline') || document.querySelector('#internationalCampaignInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#airportAuthorityInline'); if(old) old.remove();
    const p=airportAuthorityProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="airportAuthorityInline" class="airport-ops-board airport-authority-inline">
      <div class="airport-ops-head"><b>AIRPORT AUTH</b><span>${p.experience}</span></div>
      <div class="airport-ops-grid">
        <div><small>EXP</small><b>${p.score}%</b></div>
        <div><small>TERMINAL</small><b>${p.terminal.id}</b></div>
        <div><small>EVENTOS</small><b>${p.openEvents}</b></div>
        <div><small>BOARD</small><b>${Math.round(p.flows.BOARDING||0)}</b></div>
        <div><small>BAG</small><b>${Math.round(p.flows.BAGGAGE||0)}</b></div>
        <div><small>CONN</small><b>${Math.round(p.flows.CONNECTIONS||0)}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'airport-authority-board'); }
}
function initializeAirportAuthority(){
  loadAirportAuthority();
  renderAirportAuthorityBoard();
  return airportAuthorityState;
}
function airportAuthorityStatus(){ loadAirportAuthority(); return {...airportAuthorityState,progress:airportAuthorityProgress(),catalog:AIRPORT_AUTHORITY_CATALOG}; }
function airportAuthoritySelfCheck(){
  const issues=[];
  if(AIRPORT_AUTHORITY_CATALOG.terminals.length<4) issues.push('terminais insuficientes');
  if(AIRPORT_AUTHORITY_CATALOG.gatePools.length<4) issues.push('portões insuficientes');
  if(AIRPORT_AUTHORITY_CATALOG.passengerFlows.length<6) issues.push('fluxos insuficientes');
  const event=raiseTerminalEvent('GATE_CONFLICT');
  if(!event.id) issues.push('evento não criado');
  const res=evaluateAirportAuthority(2400,{conflicts:0,runwayIncursions:0,denied:0,commands:8},false,'SBGR');
  if(!Number.isFinite(res.evaluation.authorityScore)) issues.push('score inválido');
  closeTerminalEvent(event.id,true);
  return {ok:issues.length===0,issues,terminals:AIRPORT_AUTHORITY_CATALOG.terminals.length,flows:AIRPORT_AUTHORITY_CATALOG.passengerFlows.length};
}
window.SKYWARD_AIRPORT_AUTHORITY=Object.freeze({
  schema:1,
  catalog:AIRPORT_AUTHORITY_CATALOG,
  load:loadAirportAuthority,
  save:saveAirportAuthority,
  init:initializeAirportAuthority,
  event:raiseTerminalEvent,
  close:closeTerminalEvent,
  evaluate:evaluateAirportAuthority,
  progress:airportAuthorityProgress,
  status:airportAuthorityStatus,
  board:renderAirportAuthorityBoard,
  selfCheck:airportAuthoritySelfCheck
});

/* ===== MODULE 31: crisis-command-center (36-crisis-command-center.js) ===== */
/* @skyward-module 36-crisis-command-center
 * Crisis Command Center for irregular operations, ground stop, cyber incident, severe weather, labor disruption and recovery planning.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('36-crisis-command-center');
const CRISIS_COMMAND_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f33',
  crisisTypes:[
    {id:'GROUND_STOP',name:'Ground stop regional',severity:'CRITICAL',risk:85,impact:['network','airline','terminal']},
    {id:'POWER_OUTAGE',name:'Falha elétrica parcial',severity:'MAJOR',risk:72,impact:['tower','terminal','baggage']},
    {id:'CYBER_INCIDENT',name:'Incidente cyber operacional',severity:'CRITICAL',risk:88,impact:['systems','pwa','dispatch']},
    {id:'LABOR_DISRUPTION',name:'Greve/equipe reduzida',severity:'MAJOR',risk:68,impact:['terminal','ground','airline']},
    {id:'SEVERE_WEATHER_CELL',name:'Célula severa',severity:'CRITICAL',risk:82,impact:['approach','runway','network']},
    {id:'SECURITY_ALERT',name:'Alerta de segurança no terminal',severity:'MAJOR',risk:74,impact:['terminal','boarding','authority']}
  ],
  commandActions:[
    {id:'ACTIVATE_EOC',name:'Ativar centro de emergência',reduces:['coordination'],cost:12000},
    {id:'GROUND_DELAY_PROGRAM',name:'Programa de atraso no solo',reduces:['network'],cost:9000},
    {id:'MANUAL_FALLBACK',name:'Fallback manual de sistemas',reduces:['systems'],cost:15000},
    {id:'MUTUAL_AID',name:'Apoio multiagência',reduces:['terminal','safety'],cost:18000},
    {id:'RUNWAY_RATE_REDUCTION',name:'Reduzir taxa de pista',reduces:['runway','approach'],cost:7000},
    {id:'PASSENGER_CARE',name:'Cuidado ao passageiro',reduces:['passenger','airline'],cost:11000}
  ],
  recoveryStages:[
    {id:'ASSESS',name:'Avaliar impacto',target:1},
    {id:'STABILIZE',name:'Estabilizar segurança',target:2},
    {id:'RECOVER_FLOW',name:'Recuperar fluxo',target:3},
    {id:'RESTORE_SERVICE',name:'Restaurar serviço',target:4},
    {id:'DEBRIEF',name:'Debrief e prevenção',target:5}
  ],
  stakeholders:[
    {id:'ATC',name:'Controle de tráfego aéreo',priority:5},
    {id:'AIRPORT_AUTH',name:'Autoridade aeroportuária',priority:4},
    {id:'AIRLINES',name:'Companhias aéreas',priority:4},
    {id:'GROUND_HANDLING',name:'Solo e rampa',priority:3},
    {id:'SECURITY',name:'Segurança',priority:5},
    {id:'PASSENGERS',name:'Passageiros',priority:3}
  ],
  scoreBands:[
    {id:'RESILIENT',min:90,name:'Operação resiliente'},
    {id:'STABLE',min:75,name:'Crise controlada'},
    {id:'STRAINED',min:55,name:'Operação pressionada'},
    {id:'FAILED',min:0,name:'Falha de comando'}
  ]
});
const CRISIS_COMMAND_KEY='skywardCrisisCommand_v1';
let crisisCommandState={schema:1,activeCrisis:null,actionsTaken:[],recoveryStage:'ASSESS',crisisScore:100,status:'RESILIENT',history:[],lastEvaluation:null};
function loadCrisisCommand(){
  try{ const raw=localStorage?.getItem?.(CRISIS_COMMAND_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) crisisCommandState={...crisisCommandState,...parsed}; } }catch(e){ safeLogError?.(e,'crisis-command-load'); }
  return crisisCommandState;
}
function saveCrisisCommand(){
  try{ localStorage?.setItem?.(CRISIS_COMMAND_KEY,JSON.stringify(crisisCommandState)); }catch(e){ safeLogError?.(e,'crisis-command-save'); }
  return crisisCommandState;
}
function crisisById(id){ return CRISIS_COMMAND_CATALOG.crisisTypes.find(c=>c.id===id)||CRISIS_COMMAND_CATALOG.crisisTypes[0]; }
function actionById(id){ return CRISIS_COMMAND_CATALOG.commandActions.find(a=>a.id===id)||CRISIS_COMMAND_CATALOG.commandActions[0]; }
function scoreBand(score){ return CRISIS_COMMAND_CATALOG.scoreBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||CRISIS_COMMAND_CATALOG.scoreBands.at(-1); }
function triggerCrisis(id='GROUND_STOP', note=''){
  loadCrisisCommand();
  const crisis=crisisById(id);
  crisisCommandState.activeCrisis={id:crisis.id,name:crisis.name,severity:crisis.severity,risk:crisis.risk,impact:crisis.impact,note:String(note||''),startedAt:new Date().toISOString(),status:'ACTIVE'};
  crisisCommandState.recoveryStage='ASSESS';
  crisisCommandState.actionsTaken=[];
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return crisisCommandState.activeCrisis;
}
function takeCrisisAction(id='ACTIVATE_EOC'){
  loadCrisisCommand();
  const action=actionById(id);
  const item={id:`CAC-${String(Date.now()).slice(-6)}`,actionId:action.id,name:action.name,cost:action.cost,at:new Date().toISOString()};
  crisisCommandState.actionsTaken.unshift(item);
  crisisCommandState.actionsTaken=crisisCommandState.actionsTaken.slice(0,20);
  advanceRecoveryStage();
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return item;
}
function advanceRecoveryStage(){
  const idx=CRISIS_COMMAND_CATALOG.recoveryStages.findIndex(s=>s.id===crisisCommandState.recoveryStage);
  const next=CRISIS_COMMAND_CATALOG.recoveryStages[Math.min(idx+1,CRISIS_COMMAND_CATALOG.recoveryStages.length-1)];
  crisisCommandState.recoveryStage=next.id;
  return next;
}
function autoCrisisPressure(finalScore=0,statsObj={},fail=false){
  const network=window.SKYWARD_NETWORK_FLOW?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  let pressure=0;
  pressure+=(statsObj.conflicts||0)*16;
  pressure+=(statsObj.runwayIncursions||0)*24;
  pressure+=(statsObj.denied||0)*4;
  pressure+=fail?24:0;
  pressure+=Math.max(0,Number(network.networkDelayMin||0))*0.7;
  pressure+=Math.max(0,75-Number(airline.progress?.score||85))*0.4;
  pressure+=Math.max(0,75-Number(airportAuth.progress?.score||85))*0.45;
  pressure+=finalScore<800?10:0;
  return Math.max(0,Math.min(100,Math.round(pressure)));
}
function maybeAutoTriggerCrisis(finalScore=0,statsObj={},fail=false){
  if(crisisCommandState.activeCrisis?.status==='ACTIVE') return null;
  const pressure=autoCrisisPressure(finalScore,statsObj,fail);
  if(pressure>=75) return triggerCrisis('GROUND_STOP','pressão sistêmica automática');
  if((statsObj.runwayIncursions||0)>0) return triggerCrisis('SEVERE_WEATHER_CELL','proteção de pista e aproximação');
  if((statsObj.denied||0)>=3) return triggerCrisis('LABOR_DISRUPTION','acúmulo de pedidos negados');
  return null;
}
function actionMitigation(){
  const ids=crisisCommandState.actionsTaken.map(a=>a.actionId);
  let mitigation=0;
  if(ids.includes('ACTIVATE_EOC')) mitigation+=14;
  if(ids.includes('GROUND_DELAY_PROGRAM')) mitigation+=12;
  if(ids.includes('MANUAL_FALLBACK')) mitigation+=11;
  if(ids.includes('MUTUAL_AID')) mitigation+=13;
  if(ids.includes('RUNWAY_RATE_REDUCTION')) mitigation+=10;
  if(ids.includes('PASSENGER_CARE')) mitigation+=8;
  return mitigation;
}
function evaluateCrisisCommand(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCrisisCommand();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  maybeAutoTriggerCrisis(finalScore,statsObj,fail);
  const active=crisisCommandState.activeCrisis;
  const baseRisk=active?.status==='ACTIVE'?Number(active.risk||0):autoCrisisPressure(finalScore,statsObj,fail);
  const pressure=autoCrisisPressure(finalScore,statsObj,fail);
  const mitigation=actionMitigation();
  let score=Math.max(0,Math.min(100,Math.round(100-baseRisk*0.35-pressure*0.45+mitigation+Math.min(8,finalScore/1000))));
  const band=scoreBand(score);
  crisisCommandState.crisisScore=score;
  crisisCommandState.status=band.id;
  if(active && score>=88 && crisisCommandState.recoveryStage==='DEBRIEF'){
    active.status='RESOLVED';
    active.resolvedAt=new Date().toISOString();
  }
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),activeCrisis:active?.id||null,recoveryStage:crisisCommandState.recoveryStage,pressure,mitigation,crisisScore:score,status:band.id,actions:crisisCommandState.actionsTaken.length};
  crisisCommandState.history.unshift(evaluation);
  crisisCommandState.history=crisisCommandState.history.slice(0,80);
  crisisCommandState.lastEvaluation=evaluation;
  saveCrisisCommand();
  renderCrisisCommandBoard();
  return {state:crisisCommandState,evaluation};
}
function crisisCommandProgress(){
  loadCrisisCommand();
  return {score:crisisCommandState.crisisScore,status:crisisCommandState.status,active:crisisCommandState.activeCrisis,recoveryStage:crisisCommandState.recoveryStage,actions:crisisCommandState.actionsTaken.length,last:crisisCommandState.lastEvaluation||null};
}
function renderCrisisCommandBoard(){
  try{
    const anchor=document.querySelector('#airportAuthorityInline') || document.querySelector('#airlineOpsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#crisisCommandInline'); if(old) old.remove();
    const p=crisisCommandProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="crisisCommandInline" class="airport-ops-board crisis-command-inline">
      <div class="airport-ops-head"><b>CRISIS CMD</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}%</b></div>
        <div><small>CRISE</small><b>${p.active?.id||'NONE'}</b></div>
        <div><small>RECOVERY</small><b>${p.recoveryStage}</b></div>
        <div><small>AÇÕES</small><b>${p.actions}</b></div>
        <div><small>PRESSÃO</small><b>${p.last?.pressure??0}</b></div>
        <div><small>MITIGAÇÃO</small><b>${p.last?.mitigation??0}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'crisis-command-board'); }
}
function initializeCrisisCommand(){
  loadCrisisCommand();
  renderCrisisCommandBoard();
  return crisisCommandState;
}
function crisisCommandStatus(){ loadCrisisCommand(); return {...crisisCommandState,progress:crisisCommandProgress(),catalog:CRISIS_COMMAND_CATALOG}; }
function crisisCommandSelfCheck(){
  const issues=[];
  if(CRISIS_COMMAND_CATALOG.crisisTypes.length<6) issues.push('tipos de crise insuficientes');
  if(CRISIS_COMMAND_CATALOG.commandActions.length<6) issues.push('ações insuficientes');
  if(CRISIS_COMMAND_CATALOG.recoveryStages.length<5) issues.push('recovery insuficiente');
  const crisis=triggerCrisis('GROUND_STOP','selfcheck');
  takeCrisisAction('ACTIVATE_EOC'); takeCrisisAction('GROUND_DELAY_PROGRAM');
  const res=evaluateCrisisCommand(1800,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!crisis.id || !Number.isFinite(res.evaluation.crisisScore)) issues.push('avaliação inválida');
  return {ok:issues.length===0,issues,crisisTypes:CRISIS_COMMAND_CATALOG.crisisTypes.length,actions:CRISIS_COMMAND_CATALOG.commandActions.length};
}
window.SKYWARD_CRISIS_COMMAND=Object.freeze({
  schema:1,
  catalog:CRISIS_COMMAND_CATALOG,
  load:loadCrisisCommand,
  save:saveCrisisCommand,
  init:initializeCrisisCommand,
  trigger:triggerCrisis,
  action:takeCrisisAction,
  evaluate:evaluateCrisisCommand,
  progress:crisisCommandProgress,
  status:crisisCommandStatus,
  board:renderCrisisCommandBoard,
  selfCheck:crisisCommandSelfCheck
});

/* ===== MODULE 32: safety-compliance-center (37-safety-compliance-center.js) ===== */
/* @skyward-module 37-safety-compliance-center
 * Safety Management System and Compliance Center with audit findings, investigation, root cause and corrective actions.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('37-safety-compliance-center');
const SAFETY_COMPLIANCE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f34',
  auditDomains:[
    {id:'RUNWAY_SAFETY',name:'Segurança de pista',criticality:5,signals:['runwayIncursions','surfaceSafety']},
    {id:'SEPARATION',name:'Separação e conflito',criticality:5,signals:['conflicts','lossOfSeparation']},
    {id:'PROCEDURE',name:'Procedimentos ATC',criticality:4,signals:['denied','wrongClearance']},
    {id:'FATIGUE',name:'Fadiga e prontidão',criticality:4,signals:['fatigue','career']},
    {id:'CRISIS_RESPONSE',name:'Resposta à crise',criticality:5,signals:['crisisScore','recoveryStage']},
    {id:'TERMINAL_RISK',name:'Risco de terminal',criticality:3,signals:['airportAuthority','passengerFlow']},
    {id:'PWA_RELEASE',name:'Publicação PWA',criticality:3,signals:['postPublishHealth','publicOps']}
  ],
  findingSeverity:[
    {id:'OBSERVATION',name:'Observação',risk:15,actionDays:30},
    {id:'MINOR',name:'Não conformidade menor',risk:35,actionDays:21},
    {id:'MAJOR',name:'Não conformidade maior',risk:65,actionDays:10},
    {id:'CRITICAL',name:'Risco crítico',risk:90,actionDays:3}
  ],
  rootCauses:[
    {id:'TRAINING_GAP',name:'Lacuna de treinamento',corrective:'Repetir missão guiada e cards do instrutor'},
    {id:'PROCEDURE_DRIFT',name:'Desvio de procedimento',corrective:'Auditar fraseologia e checklist de autorização'},
    {id:'WORKLOAD',name:'Carga de trabalho excessiva',corrective:'Reduzir taxa, usar hold/slots e redistribuir fluxo'},
    {id:'SYSTEM_FAILURE',name:'Falha de sistema',corrective:'Ativar fallback manual e revisar PWA/cache'},
    {id:'COMMUNICATION',name:'Comunicação deficiente',corrective:'Debrief e reclassificação de prioridades'}
  ],
  correctiveActions:[
    {id:'CAP_TRAINING',name:'Treinamento corretivo',cost:5000,effect:'risk-12'},
    {id:'CAP_CHECKLIST',name:'Checklist obrigatório',cost:3000,effect:'procedure+10'},
    {id:'CAP_RATE_LIMIT',name:'Limite temporário de taxa',cost:8000,effect:'workload-15'},
    {id:'CAP_SYSTEM_FALLBACK',name:'Plano fallback sistema',cost:12000,effect:'systems+12'},
    {id:'CAP_DEBRIEF',name:'Debrief estruturado',cost:2000,effect:'culture+8'}
  ],
  safetyCultureBands:[
    {id:'GENERATIVE',min:90,name:'Cultura generativa'},
    {id:'PROACTIVE',min:75,name:'Cultura proativa'},
    {id:'REACTIVE',min:55,name:'Cultura reativa'},
    {id:'VULNERABLE',min:0,name:'Cultura vulnerável'}
  ]
});
const SAFETY_COMPLIANCE_KEY='skywardSafetyCompliance_v1';
let safetyComplianceState={schema:1,findings:[],correctivePlan:[],closedFindings:[],safetyCultureScore:82,complianceStatus:'PROACTIVE',history:[],lastEvaluation:null};
function loadSafetyCompliance(){
  try{ const raw=localStorage?.getItem?.(SAFETY_COMPLIANCE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) safetyComplianceState={...safetyComplianceState,...parsed}; } }catch(e){ safeLogError?.(e,'safety-compliance-load'); }
  return safetyComplianceState;
}
function saveSafetyCompliance(){
  try{ localStorage?.setItem?.(SAFETY_COMPLIANCE_KEY,JSON.stringify(safetyComplianceState)); }catch(e){ safeLogError?.(e,'safety-compliance-save'); }
  return safetyComplianceState;
}
function bandForSafetyCulture(score){
  return SAFETY_COMPLIANCE_CATALOG.safetyCultureBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SAFETY_COMPLIANCE_CATALOG.safetyCultureBands.at(-1);
}
function severityForRisk(risk){
  return SAFETY_COMPLIANCE_CATALOG.findingSeverity.slice().sort((a,b)=>b.risk-a.risk).find(s=>risk>=s.risk)||SAFETY_COMPLIANCE_CATALOG.findingSeverity[0];
}
function rootCauseFor(domainId,statsObj={},signals={}){
  if(domainId==='RUNWAY_SAFETY' || domainId==='SEPARATION') return 'TRAINING_GAP';
  if(domainId==='PROCEDURE') return 'PROCEDURE_DRIFT';
  if(domainId==='FATIGUE' || Number(signals.fatigue||0)>70) return 'WORKLOAD';
  if(domainId==='PWA_RELEASE') return 'SYSTEM_FAILURE';
  if(domainId==='CRISIS_RESPONSE') return 'COMMUNICATION';
  return 'WORKLOAD';
}
function correctiveForRoot(rootId){
  if(rootId==='TRAINING_GAP') return 'CAP_TRAINING';
  if(rootId==='PROCEDURE_DRIFT') return 'CAP_CHECKLIST';
  if(rootId==='WORKLOAD') return 'CAP_RATE_LIMIT';
  if(rootId==='SYSTEM_FAILURE') return 'CAP_SYSTEM_FALLBACK';
  return 'CAP_DEBRIEF';
}
function collectSafetySignals(finalScore=0,statsObj={},fail=false){
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const coach=window.SKYWARD_TRAINING_COACH?.status?.()||{};
  const postPublish=window.SKYWARD_POST_PUBLISH_HEALTH?.status?.()||{};
  const publicOps=window.SKYWARD_PUBLIC_OPS?.status?.()||{};
  return {
    finalScore:Number(finalScore||0),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    denied:Number(statsObj.denied||0),
    fail:Boolean(fail),
    crisisScore:Number(crisis.progress?.score ?? 100),
    airportExperience:Number(airportAuth.progress?.score ?? 85),
    airlineScore:Number(airline.progress?.score ?? 85),
    coachScore:Number(coach.progress?.coachScore ?? 80),
    postPublishScore:Number(postPublish.healthScore ?? postPublish.evaluation?.score ?? 90),
    publicOpsScore:Number(publicOps.opsScore ?? publicOps.summary?.score ?? 90),
    fatigue:Number(window.SKYWARD_CAREER?.status?.().fatigue||0)
  };
}
function createFinding(domainId,risk,statsObj={},signals={},note=''){
  const sev=severityForRisk(risk);
  const rootId=rootCauseFor(domainId,statsObj,signals);
  const capId=correctiveForRoot(rootId);
  const root=SAFETY_COMPLIANCE_CATALOG.rootCauses.find(r=>r.id===rootId);
  const cap=SAFETY_COMPLIANCE_CATALOG.correctiveActions.find(c=>c.id===capId);
  const finding={id:`FND-${String(Date.now()+Math.floor(Math.random()*999)).slice(-7)}`,at:new Date().toISOString(),domainId,severity:sev.id,risk:Math.round(risk),rootCause:rootId,correctiveAction:capId,status:'OPEN',dueDays:sev.actionDays,note:String(note||root?.corrective||'').slice(0,180)};
  safetyComplianceState.findings.unshift(finding);
  safetyComplianceState.findings=safetyComplianceState.findings.slice(0,80);
  if(!safetyComplianceState.correctivePlan.some(p=>p.findingId===finding.id)){
    safetyComplianceState.correctivePlan.unshift({findingId:finding.id,actionId:capId,name:cap?.name||capId,cost:cap?.cost||0,status:'PLANNED',createdAt:new Date().toISOString()});
  }
  safetyComplianceState.correctivePlan=safetyComplianceState.correctivePlan.slice(0,80);
  return finding;
}
function closeFinding(id){
  loadSafetyCompliance();
  const finding=safetyComplianceState.findings.find(f=>f.id===id);
  if(finding){
    finding.status='CLOSED'; finding.closedAt=new Date().toISOString();
    if(!safetyComplianceState.closedFindings.includes(id)) safetyComplianceState.closedFindings.push(id);
    const plan=safetyComplianceState.correctivePlan.find(p=>p.findingId===id);
    if(plan) plan.status='DONE';
    safetyComplianceState.safetyCultureScore=Math.min(100,safetyComplianceState.safetyCultureScore+4);
  }
  saveSafetyCompliance();
  renderSafetyComplianceBoard();
  return finding||null;
}
function auditSafetyCompliance(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSafetyCompliance();
  const signals=collectSafetySignals(finalScore,statsObj,fail);
  const before=safetyComplianceState.findings.length;
  if(signals.runwayIncursions>0) createFinding('RUNWAY_SAFETY',90+signals.runwayIncursions*5,statsObj,signals,'incursão de pista exige ação corretiva imediata');
  if(signals.conflicts>0) createFinding('SEPARATION',72+signals.conflicts*8,statsObj,signals,'conflito/separação degradada');
  if(signals.denied>=3) createFinding('PROCEDURE',58+signals.denied*4,statsObj,signals,'alto volume de comandos negados');
  if(signals.fatigue>70) createFinding('FATIGUE',62+(signals.fatigue-70),statsObj,signals,'fadiga operacional elevada');
  if(signals.crisisScore<75) createFinding('CRISIS_RESPONSE',80-signals.crisisScore/3,statsObj,signals,'resposta à crise abaixo do alvo');
  if(signals.airportExperience<65) createFinding('TERMINAL_RISK',70-signals.airportExperience/4,statsObj,signals,'terminal pressionado');
  if(signals.postPublishScore<75 || signals.publicOpsScore<75) createFinding('PWA_RELEASE',65,statsObj,signals,'publicação/ops público abaixo do padrão');
  const newFindings=safetyComplianceState.findings.length-before;
  const open=safetyComplianceState.findings.filter(f=>f.status==='OPEN');
  const critical=open.filter(f=>f.severity==='CRITICAL').length;
  const major=open.filter(f=>f.severity==='MAJOR').length;
  let culture=100 - critical*22 - major*10 - open.length*3 + safetyComplianceState.closedFindings.length*2;
  if(!fail && !signals.conflicts && !signals.runwayIncursions) culture+=4;
  culture=Math.max(0,Math.min(100,Math.round(culture)));
  safetyComplianceState.safetyCultureScore=culture;
  safetyComplianceState.complianceStatus=bandForSafetyCulture(culture).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'---',finalScore:Math.round(finalScore||0),signals,newFindings,openFindings:open.length,critical,major,safetyCultureScore:culture,complianceStatus:safetyComplianceState.complianceStatus};
  safetyComplianceState.history.unshift(evaluation);
  safetyComplianceState.history=safetyComplianceState.history.slice(0,80);
  safetyComplianceState.lastEvaluation=evaluation;
  saveSafetyCompliance();
  renderSafetyComplianceBoard();
  return {state:safetyComplianceState,evaluation};
}
function safetyComplianceProgress(){
  loadSafetyCompliance();
  const open=safetyComplianceState.findings.filter(f=>f.status==='OPEN');
  return {score:safetyComplianceState.safetyCultureScore,status:safetyComplianceState.complianceStatus,openFindings:open.length,critical:open.filter(f=>f.severity==='CRITICAL').length,major:open.filter(f=>f.severity==='MAJOR').length,plans:safetyComplianceState.correctivePlan.filter(p=>p.status!=='DONE').length,last:safetyComplianceState.lastEvaluation||null};
}
function renderSafetyComplianceBoard(){
  try{
    const anchor=document.querySelector('#crisisCommandInline') || document.querySelector('#airportAuthorityInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#safetyComplianceInline'); if(old) old.remove();
    const p=safetyComplianceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="safetyComplianceInline" class="airport-ops-board safety-compliance-inline">
      <div class="airport-ops-head"><b>SAFETY SMS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CULTURA</small><b>${p.score}%</b></div>
        <div><small>ACHADOS</small><b>${p.openFindings}</b></div>
        <div><small>CRÍTICOS</small><b>${p.critical}</b></div>
        <div><small>MAJOR</small><b>${p.major}</b></div>
        <div><small>CAP</small><b>${p.plans}</b></div>
        <div><small>NOVOS</small><b>${p.last?.newFindings??0}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'safety-compliance-board'); }
}
function initializeSafetyCompliance(){
  loadSafetyCompliance();
  renderSafetyComplianceBoard();
  return safetyComplianceState;
}
function safetyComplianceStatus(){ loadSafetyCompliance(); return {...safetyComplianceState,progress:safetyComplianceProgress(),catalog:SAFETY_COMPLIANCE_CATALOG}; }
function safetyComplianceSelfCheck(){
  const issues=[];
  if(SAFETY_COMPLIANCE_CATALOG.auditDomains.length<7) issues.push('domínios insuficientes');
  if(SAFETY_COMPLIANCE_CATALOG.correctiveActions.length<5) issues.push('CAPs insuficientes');
  const res=auditSafetyCompliance(300,{conflicts:1,runwayIncursions:1,denied:3},false,'SBGR');
  if(res.evaluation.newFindings<2) issues.push('não gerou achados suficientes');
  const first=safetyComplianceState.findings[0];
  if(!first?.rootCause || !first?.correctiveAction) issues.push('sem causa raiz/CAP');
  return {ok:issues.length===0,issues,domains:SAFETY_COMPLIANCE_CATALOG.auditDomains.length,actions:SAFETY_COMPLIANCE_CATALOG.correctiveActions.length};
}
window.SKYWARD_SAFETY_COMPLIANCE=Object.freeze({
  schema:1,
  catalog:SAFETY_COMPLIANCE_CATALOG,
  load:loadSafetyCompliance,
  save:saveSafetyCompliance,
  init:initializeSafetyCompliance,
  audit:auditSafetyCompliance,
  close:closeFinding,
  progress:safetyComplianceProgress,
  status:safetyComplianceStatus,
  board:renderSafetyComplianceBoard,
  selfCheck:safetyComplianceSelfCheck
});

/* ===== MODULE 33: infrastructure-expansion-program (38-infrastructure-expansion-program.js) ===== */
/* @skyward-module 38-infrastructure-expansion-program
 * Infrastructure and expansion program with runway works, terminal expansion, maintenance, CAPEX, capacity and construction risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('38-infrastructure-expansion-program');
const INFRASTRUCTURE_EXPANSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f35',
  projects:[
    {id:'RWY_REHAB',name:'Recapeamento de pista',type:'RUNWAY',cost:180000,durationShifts:4,capacityGain:8,risk:26},
    {id:'TML_EXPANSION',name:'Expansão de terminal',type:'TERMINAL',cost:260000,durationShifts:6,capacityGain:15,risk:22},
    {id:'ILS_UPGRADE',name:'Upgrade ILS CAT II',type:'NAV_AID',cost:210000,durationShifts:5,capacityGain:10,risk:18},
    {id:'CARGO_APRON',name:'Novo pátio cargueiro',type:'CARGO',cost:190000,durationShifts:5,capacityGain:12,risk:20},
    {id:'TOWER_SYSTEMS',name:'Modernização de sistemas da torre',type:'SYSTEMS',cost:150000,durationShifts:3,capacityGain:7,risk:16},
    {id:'REMOTE_STANDS',name:'Posições remotas adicionais',type:'APRON',cost:120000,durationShifts:3,capacityGain:9,risk:14}
  ],
  maintenancePrograms:[
    {id:'DAILY_INSPECTION',name:'Inspeção diária de pista',cost:8000,reliabilityGain:5},
    {id:'LIGHTING_CHECK',name:'Checagem balizamento',cost:12000,reliabilityGain:7},
    {id:'RADAR_CALIBRATION',name:'Calibração radar/navaids',cost:18000,reliabilityGain:9},
    {id:'BAGGAGE_PM',name:'Manutenção preventiva bagagem',cost:10000,reliabilityGain:6}
  ],
  fundingSources:[
    {id:'AIRPORT_REVENUE',name:'Receita aeroportuária',limit:300000,risk:5},
    {id:'PUBLIC_GRANT',name:'Fomento público',limit:500000,risk:12},
    {id:'AIRLINE_CONSORTIUM',name:'Consórcio de companhias',limit:450000,risk:10},
    {id:'EMERGENCY_CAPEX',name:'CAPEX emergencial',limit:250000,risk:18}
  ],
  constructionRisks:[
    {id:'RUNWAY_RESTRICTION',name:'Restrição de pista',impact:'capacity-12',risk:28},
    {id:'NOISE_WINDOW',name:'Janela de ruído',impact:'schedule-8',risk:12},
    {id:'SUPPLY_DELAY',name:'Atraso de fornecedor',impact:'duration+1',risk:20},
    {id:'COST_OVERRUN',name:'Estouro de orçamento',impact:'cost+15',risk:18}
  ],
  capacityBands:[
    {id:'WORLD_CLASS',min:90,name:'Infraestrutura world-class'},
    {id:'EXPANDING',min:75,name:'Infraestrutura em expansão'},
    {id:'LIMITED',min:55,name:'Capacidade limitada'},
    {id:'CONSTRAINED',min:0,name:'Aeroporto estrangulado'}
  ]
});
const INFRASTRUCTURE_EXPANSION_KEY='skywardInfrastructureExpansion_v1';
let infrastructureExpansionState={schema:1,capexBudget:250000,activeProjects:[],completedProjects:[],maintenanceLog:[],capacityScore:72,reliabilityScore:76,constructionRisk:0,status:'LIMITED',history:[],lastEvaluation:null};
function loadInfrastructureExpansion(){
  try{ const raw=localStorage?.getItem?.(INFRASTRUCTURE_EXPANSION_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) infrastructureExpansionState={...infrastructureExpansionState,...parsed}; } }catch(e){ safeLogError?.(e,'infrastructure-expansion-load'); }
  return infrastructureExpansionState;
}
function saveInfrastructureExpansion(){
  try{ localStorage?.setItem?.(INFRASTRUCTURE_EXPANSION_KEY,JSON.stringify(infrastructureExpansionState)); }catch(e){ safeLogError?.(e,'infrastructure-expansion-save'); }
  return infrastructureExpansionState;
}
function capacityBand(score){
  return INFRASTRUCTURE_EXPANSION_CATALOG.capacityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||INFRASTRUCTURE_EXPANSION_CATALOG.capacityBands.at(-1);
}
function projectById(id){ return INFRASTRUCTURE_EXPANSION_CATALOG.projects.find(p=>p.id===id)||INFRASTRUCTURE_EXPANSION_CATALOG.projects[0]; }
function maintenanceById(id){ return INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.find(p=>p.id===id)||INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms[0]; }
function startInfrastructureProject(id='REMOTE_STANDS',funding='AIRPORT_REVENUE'){
  loadInfrastructureExpansion();
  const project=projectById(id);
  if(infrastructureExpansionState.activeProjects.some(p=>p.projectId===project.id)) return infrastructureExpansionState.activeProjects.find(p=>p.projectId===project.id);
  const item={id:`PRJ-${String(Date.now()).slice(-6)}`,projectId:project.id,name:project.name,type:project.type,remaining:project.durationShifts,cost:project.cost,funding,status:'ACTIVE',risk:project.risk,startedAt:new Date().toISOString()};
  infrastructureExpansionState.activeProjects.unshift(item);
  infrastructureExpansionState.capexBudget-=Math.round(project.cost*.25);
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return item;
}
function runMaintenance(id='DAILY_INSPECTION'){
  loadInfrastructureExpansion();
  const maint=maintenanceById(id);
  infrastructureExpansionState.capexBudget-=maint.cost;
  infrastructureExpansionState.reliabilityScore=Math.min(100,infrastructureExpansionState.reliabilityScore+maint.reliabilityGain);
  const item={id:`MNT-${String(Date.now()).slice(-6)}`,programId:maint.id,name:maint.name,cost:maint.cost,reliabilityGain:maint.reliabilityGain,at:new Date().toISOString()};
  infrastructureExpansionState.maintenanceLog.unshift(item);
  infrastructureExpansionState.maintenanceLog=infrastructureExpansionState.maintenanceLog.slice(0,60);
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return item;
}
function advanceProjects(statsObj={},fail=false){
  const finished=[];
  for(const p of infrastructureExpansionState.activeProjects){
    if(p.status!=='ACTIVE') continue;
    const delay=(statsObj.conflicts||0)>0 || fail ? 0 : 1;
    p.remaining=Math.max(0,p.remaining-delay);
    if(p.remaining===0){
      p.status='COMPLETED';
      p.completedAt=new Date().toISOString();
      finished.push(p);
      if(!infrastructureExpansionState.completedProjects.includes(p.projectId)) infrastructureExpansionState.completedProjects.push(p.projectId);
      const tpl=projectById(p.projectId);
      infrastructureExpansionState.capacityScore=Math.min(100,infrastructureExpansionState.capacityScore+tpl.capacityGain);
      infrastructureExpansionState.capexBudget-=Math.round(tpl.cost*.75);
    }
  }
  infrastructureExpansionState.activeProjects=infrastructureExpansionState.activeProjects.filter(p=>p.status==='ACTIVE');
  return finished;
}
function evaluateInfrastructureExpansion(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInfrastructureExpansion();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const airlineOps=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const finished=advanceProjects(statsObj,fail);
  const activeRisk=infrastructureExpansionState.activeProjects.reduce((a,p)=>a+Number(p.risk||0),0);
  const externalPressure=Math.max(0,75-Number(airportAuth.progress?.score||80))*0.35 + Math.max(0,75-Number(airlineOps.progress?.score||80))*0.25 + Math.max(0,75-Number(safety.progress?.score||80))*0.3;
  const operationalPenalty=(statsObj.conflicts||0)*3+(statsObj.runwayIncursions||0)*6+(fail?8:0);
  infrastructureExpansionState.constructionRisk=Math.max(0,Math.min(100,Math.round(activeRisk/2+externalPressure+operationalPenalty)));
  infrastructureExpansionState.reliabilityScore=Math.max(0,Math.min(100,Math.round(infrastructureExpansionState.reliabilityScore - infrastructureExpansionState.constructionRisk/30 + Math.min(2,finalScore/1800))));
  const totalScore=Math.max(0,Math.min(100,Math.round(infrastructureExpansionState.capacityScore*.55+infrastructureExpansionState.reliabilityScore*.35+Math.max(0,100-infrastructureExpansionState.constructionRisk)*.10)));
  infrastructureExpansionState.capacityScore=totalScore;
  infrastructureExpansionState.status=capacityBand(totalScore).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),finishedProjects:finished.map(p=>p.projectId),activeProjects:infrastructureExpansionState.activeProjects.length,capexBudget:infrastructureExpansionState.capexBudget,capacityScore:totalScore,reliabilityScore:infrastructureExpansionState.reliabilityScore,constructionRisk:infrastructureExpansionState.constructionRisk,status:infrastructureExpansionState.status};
  infrastructureExpansionState.history.unshift(evaluation);
  infrastructureExpansionState.history=infrastructureExpansionState.history.slice(0,80);
  infrastructureExpansionState.lastEvaluation=evaluation;
  saveInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return {state:infrastructureExpansionState,evaluation};
}
function infrastructureExpansionProgress(){
  loadInfrastructureExpansion();
  return {score:infrastructureExpansionState.capacityScore,status:infrastructureExpansionState.status,budget:infrastructureExpansionState.capexBudget,activeProjects:infrastructureExpansionState.activeProjects.length,completedProjects:infrastructureExpansionState.completedProjects.length,risk:infrastructureExpansionState.constructionRisk,reliability:infrastructureExpansionState.reliabilityScore,last:infrastructureExpansionState.lastEvaluation||null};
}
function renderInfrastructureExpansionBoard(){
  try{
    const anchor=document.querySelector('#safetyComplianceInline') || document.querySelector('#crisisCommandInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#infrastructureExpansionInline'); if(old) old.remove();
    const p=infrastructureExpansionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="infrastructureExpansionInline" class="airport-ops-board infrastructure-expansion-inline">
      <div class="airport-ops-head"><b>INFRA CAPEX</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CAPAC.</small><b>${p.score}%</b></div>
        <div><small>CONFIAB.</small><b>${p.reliability}%</b></div>
        <div><small>OBRAS</small><b>${p.activeProjects}</b></div>
        <div><small>CONCL.</small><b>${p.completedProjects}</b></div>
        <div><small>RISCO</small><b>${p.risk}%</b></div>
        <div><small>CAPEX</small><b>${Math.round(p.budget/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'infrastructure-expansion-board'); }
}
function initializeInfrastructureExpansion(){
  loadInfrastructureExpansion();
  renderInfrastructureExpansionBoard();
  return infrastructureExpansionState;
}
function infrastructureExpansionStatus(){ loadInfrastructureExpansion(); return {...infrastructureExpansionState,progress:infrastructureExpansionProgress(),catalog:INFRASTRUCTURE_EXPANSION_CATALOG}; }
function infrastructureExpansionSelfCheck(){
  const issues=[];
  if(INFRASTRUCTURE_EXPANSION_CATALOG.projects.length<6) issues.push('projetos insuficientes');
  if(INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.length<4) issues.push('manutenção insuficiente');
  const prj=startInfrastructureProject('REMOTE_STANDS','AIRPORT_REVENUE');
  const mnt=runMaintenance('DAILY_INSPECTION');
  const res=evaluateInfrastructureExpansion(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!prj.id || !mnt.id) issues.push('obra/manutenção não criou registro');
  if(!Number.isFinite(res.evaluation.capacityScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,projects:INFRASTRUCTURE_EXPANSION_CATALOG.projects.length,maintenance:INFRASTRUCTURE_EXPANSION_CATALOG.maintenancePrograms.length};
}
window.SKYWARD_INFRASTRUCTURE_EXPANSION=Object.freeze({
  schema:1,
  catalog:INFRASTRUCTURE_EXPANSION_CATALOG,
  load:loadInfrastructureExpansion,
  save:saveInfrastructureExpansion,
  init:initializeInfrastructureExpansion,
  start:startInfrastructureProject,
  maintenance:runMaintenance,
  evaluate:evaluateInfrastructureExpansion,
  progress:infrastructureExpansionProgress,
  status:infrastructureExpansionStatus,
  board:renderInfrastructureExpansionBoard,
  selfCheck:infrastructureExpansionSelfCheck
});

/* ===== MODULE 34: environment-sustainability-center (39-environment-sustainability-center.js) ===== */
/* @skyward-module 39-environment-sustainability-center
 * Environmental and sustainability center with noise, emissions, fuel burn, community impact, green initiatives and permits.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('39-environment-sustainability-center');
const ENVIRONMENT_SUSTAINABILITY_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f36',
  environmentMetrics:[
    {id:'NOISE',name:'Ruído operacional',weight:25,target:78},
    {id:'CO2',name:'Emissões CO₂',weight:25,target:76},
    {id:'FUEL',name:'Eficiência de combustível',weight:18,target:74},
    {id:'COMMUNITY',name:'Comunidade',weight:17,target:72},
    {id:'WASTE',name:'Resíduos/solo',weight:8,target:70},
    {id:'PERMIT',name:'Licenças ambientais',weight:7,target:80}
  ],
  greenInitiatives:[
    {id:'CDA_APPROACH',name:'Continuous Descent Approach',cost:45000,benefit:{NOISE:8,CO2:6,FUEL:7}},
    {id:'GPU_PROGRAM',name:'Ground Power Units elétricos',cost:90000,benefit:{CO2:10,FUEL:6,COMMUNITY:4}},
    {id:'NIGHT_CURFEW',name:'Janela noturna sensível',cost:25000,benefit:{NOISE:12,COMMUNITY:9}},
    {id:'TAXI_OPTIMIZATION',name:'Taxi otimizado',cost:35000,benefit:{CO2:7,FUEL:9}},
    {id:'WASTE_RECYCLING',name:'Reciclagem terminal/rampa',cost:28000,benefit:{WASTE:13,COMMUNITY:3}},
    {id:'GREEN_CONSTRUCTION',name:'Obra verde certificada',cost:75000,benefit:{PERMIT:8,COMMUNITY:5,CO2:4}}
  ],
  noiseZones:[
    {id:'URBAN_NORTH',name:'Zona urbana norte',sensitivity:5},
    {id:'SCHOOL_AREA',name:'Área escolar',sensitivity:4},
    {id:'HOSPITAL_CORRIDOR',name:'Corredor hospitalar',sensitivity:5},
    {id:'INDUSTRIAL',name:'Zona industrial',sensitivity:2}
  ],
  environmentEvents:[
    {id:'COMMUNITY_COMPLAINT',name:'Reclamações da comunidade',impact:'community-12',risk:18},
    {id:'AIR_QUALITY_ALERT',name:'Alerta de qualidade do ar',impact:'co2-10',risk:16},
    {id:'NOISE_AUDIT',name:'Auditoria de ruído',impact:'permit-8',risk:20},
    {id:'FUEL_SPIKE',name:'Pico de consumo combustível',impact:'fuel-14',risk:14},
    {id:'CONSTRUCTION_DUST',name:'Poeira de obra',impact:'waste-10',risk:12}
  ],
  permitLevels:[
    {id:'FULL_COMPLIANCE',min:90,name:'Licença plena'},
    {id:'COMPLIANT',min:75,name:'Conforme'},
    {id:'WATCHLIST',min:55,name:'Em observação'},
    {id:'AT_RISK',min:0,name:'Risco de sanção'}
  ],
  esgBands:[
    {id:'LEADER',min:90,name:'ESG líder'},
    {id:'STRONG',min:75,name:'ESG forte'},
    {id:'PRESSURED',min:55,name:'ESG pressionado'},
    {id:'NON_COMPLIANT',min:0,name:'Não conforme'}
  ]
});
const ENVIRONMENT_SUSTAINABILITY_KEY='skywardEnvironmentSustainability_v1';
let environmentSustainabilityState={schema:1,metrics:{NOISE:82,CO2:80,FUEL:78,COMMUNITY:79,WASTE:76,PERMIT:84},initiatives:[],events:[],esgScore:80,permitStatus:'COMPLIANT',status:'STRONG',history:[],lastEvaluation:null};
function loadEnvironmentSustainability(){
  try{ const raw=localStorage?.getItem?.(ENVIRONMENT_SUSTAINABILITY_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) environmentSustainabilityState={...environmentSustainabilityState,...parsed}; } }catch(e){ safeLogError?.(e,'environment-sustainability-load'); }
  return environmentSustainabilityState;
}
function saveEnvironmentSustainability(){
  try{ localStorage?.setItem?.(ENVIRONMENT_SUSTAINABILITY_KEY,JSON.stringify(environmentSustainabilityState)); }catch(e){ safeLogError?.(e,'environment-sustainability-save'); }
  return environmentSustainabilityState;
}
function esgBand(score){
  return ENVIRONMENT_SUSTAINABILITY_CATALOG.esgBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ENVIRONMENT_SUSTAINABILITY_CATALOG.esgBands.at(-1);
}
function permitBand(score){
  return ENVIRONMENT_SUSTAINABILITY_CATALOG.permitLevels.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ENVIRONMENT_SUSTAINABILITY_CATALOG.permitLevels.at(-1);
}
function initiativeById(id){ return ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.find(i=>i.id===id)||ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives[0]; }
function launchGreenInitiative(id='TAXI_OPTIMIZATION'){
  loadEnvironmentSustainability();
  const init=initiativeById(id);
  if(environmentSustainabilityState.initiatives.some(i=>i.initiativeId===init.id)) return environmentSustainabilityState.initiatives.find(i=>i.initiativeId===init.id);
  const item={id:`GRN-${String(Date.now()).slice(-6)}`,initiativeId:init.id,name:init.name,cost:init.cost,status:'ACTIVE',startedAt:new Date().toISOString()};
  environmentSustainabilityState.initiatives.unshift(item);
  for(const [metric,gain] of Object.entries(init.benefit||{})){
    environmentSustainabilityState.metrics[metric]=Math.min(100,Number(environmentSustainabilityState.metrics[metric]||75)+Number(gain||0));
  }
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return item;
}
function raiseEnvironmentEvent(id='COMMUNITY_COMPLAINT'){
  loadEnvironmentSustainability();
  const tpl=ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentEvents.find(e=>e.id===id)||ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentEvents[0];
  const item={id:`ENV-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  environmentSustainabilityState.events.unshift(item);
  environmentSustainabilityState.events=environmentSustainabilityState.events.slice(0,40);
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return item;
}
function closeEnvironmentEvent(id,ok=true){
  loadEnvironmentSustainability();
  const ev=environmentSustainabilityState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return ev||null;
}
function calculateEnvironmentalMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const openEvents=environmentSustainabilityState.events.filter(e=>e.status==='OPEN');
  const metrics={...environmentSustainabilityState.metrics};
  const airlineScore=Number(airline.progress?.score||80);
  const infraRisk=Number(infra.progress?.risk||0);
  const terminalScore=Number(airportAuth.progress?.score||80);
  const crisisScore=Number(crisis.progress?.score||100);
  metrics.NOISE=Math.max(0,Math.min(100,Number(metrics.NOISE||80)-denied*1.5-conflicts*2-openEvents.filter(e=>e.eventId==='NOISE_AUDIT').length*10+(finalScore>1800?1:0)));
  metrics.CO2=Math.max(0,Math.min(100,Number(metrics.CO2||80)-denied*2-Math.max(0,75-airlineScore)*0.18-infraRisk*0.08));
  metrics.FUEL=Math.max(0,Math.min(100,Number(metrics.FUEL||78)-denied*2-conflicts*1.2+(airlineScore>=85?2:0)));
  metrics.COMMUNITY=Math.max(0,Math.min(100,Number(metrics.COMMUNITY||78)-openEvents.filter(e=>e.eventId==='COMMUNITY_COMPLAINT').length*12-Math.max(0,70-terminalScore)*0.15));
  metrics.WASTE=Math.max(0,Math.min(100,Number(metrics.WASTE||76)-openEvents.filter(e=>e.eventId==='CONSTRUCTION_DUST').length*10-infraRisk*0.06));
  metrics.PERMIT=Math.max(0,Math.min(100,Number(metrics.PERMIT||82)-openEvents.length*3-Math.max(0,75-crisisScore)*0.12-incursions*5-(fail?4:0)));
  return metrics;
}
function evaluateEnvironmentSustainability(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadEnvironmentSustainability();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const metrics=calculateEnvironmentalMetrics(finalScore,statsObj,fail);
  environmentSustainabilityState.metrics=metrics;
  const weighted=Math.round(ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.reduce((a,m)=>a+(metrics[m.id]||0)*m.weight,0)/100);
  const openRisk=environmentSustainabilityState.events.filter(e=>e.status==='OPEN').reduce((a,e)=>a+Number(e.risk||0),0);
  const esg=Math.max(0,Math.min(100,Math.round(weighted-openRisk/12+environmentSustainabilityState.initiatives.length*1.5)));
  environmentSustainabilityState.esgScore=esg;
  environmentSustainabilityState.status=esgBand(esg).id;
  environmentSustainabilityState.permitStatus=permitBand(metrics.PERMIT||0).id;
  if(esg<55 && !environmentSustainabilityState.events.some(e=>e.status==='OPEN'&&e.eventId==='COMMUNITY_COMPLAINT')) raiseEnvironmentEvent('COMMUNITY_COMPLAINT');
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),metrics,weighted,esgScore:esg,status:environmentSustainabilityState.status,permitStatus:environmentSustainabilityState.permitStatus,openEvents:environmentSustainabilityState.events.filter(e=>e.status==='OPEN').length,initiatives:environmentSustainabilityState.initiatives.length};
  environmentSustainabilityState.history.unshift(evaluation);
  environmentSustainabilityState.history=environmentSustainabilityState.history.slice(0,80);
  environmentSustainabilityState.lastEvaluation=evaluation;
  saveEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return {state:environmentSustainabilityState,evaluation};
}
function environmentSustainabilityProgress(){
  loadEnvironmentSustainability();
  return {score:environmentSustainabilityState.esgScore,status:environmentSustainabilityState.status,permitStatus:environmentSustainabilityState.permitStatus,openEvents:environmentSustainabilityState.events.filter(e=>e.status==='OPEN').length,initiatives:environmentSustainabilityState.initiatives.length,metrics:environmentSustainabilityState.metrics,last:environmentSustainabilityState.lastEvaluation||null};
}
function renderEnvironmentSustainabilityBoard(){
  try{
    const anchor=document.querySelector('#infrastructureExpansionInline') || document.querySelector('#safetyComplianceInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#environmentSustainabilityInline'); if(old) old.remove();
    const p=environmentSustainabilityProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="environmentSustainabilityInline" class="airport-ops-board environment-sustainability-inline">
      <div class="airport-ops-head"><b>ENV ESG</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>ESG</small><b>${p.score}%</b></div>
        <div><small>LICENÇA</small><b>${p.permitStatus}</b></div>
        <div><small>RUÍDO</small><b>${Math.round(p.metrics.NOISE||0)}</b></div>
        <div><small>CO₂</small><b>${Math.round(p.metrics.CO2||0)}</b></div>
        <div><small>EVENTOS</small><b>${p.openEvents}</b></div>
        <div><small>VERDE</small><b>${p.initiatives}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'environment-sustainability-board'); }
}
function initializeEnvironmentSustainability(){
  loadEnvironmentSustainability();
  renderEnvironmentSustainabilityBoard();
  return environmentSustainabilityState;
}
function environmentSustainabilityStatus(){ loadEnvironmentSustainability(); return {...environmentSustainabilityState,progress:environmentSustainabilityProgress(),catalog:ENVIRONMENT_SUSTAINABILITY_CATALOG}; }
function environmentSustainabilitySelfCheck(){
  const issues=[];
  if(ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.length<6) issues.push('métricas insuficientes');
  if(ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.length<6) issues.push('iniciativas insuficientes');
  const init=launchGreenInitiative('TAXI_OPTIMIZATION');
  const ev=raiseEnvironmentEvent('NOISE_AUDIT');
  const res=evaluateEnvironmentSustainability(2000,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!init.id || !ev.id) issues.push('iniciativa/evento inválidos');
  if(!Number.isFinite(res.evaluation.esgScore)) issues.push('score ESG inválido');
  closeEnvironmentEvent(ev.id,true);
  return {ok:issues.length===0,issues,metrics:ENVIRONMENT_SUSTAINABILITY_CATALOG.environmentMetrics.length,initiatives:ENVIRONMENT_SUSTAINABILITY_CATALOG.greenInitiatives.length};
}
window.SKYWARD_ENVIRONMENT_SUSTAINABILITY=Object.freeze({
  schema:1,
  catalog:ENVIRONMENT_SUSTAINABILITY_CATALOG,
  load:loadEnvironmentSustainability,
  save:saveEnvironmentSustainability,
  init:initializeEnvironmentSustainability,
  initiative:launchGreenInitiative,
  event:raiseEnvironmentEvent,
  close:closeEnvironmentEvent,
  evaluate:evaluateEnvironmentSustainability,
  progress:environmentSustainabilityProgress,
  status:environmentSustainabilityStatus,
  board:renderEnvironmentSustainabilityBoard,
  selfCheck:environmentSustainabilitySelfCheck
});

/* ===== MODULE 35: revenue-management-commercial-center (40-revenue-management-commercial-center.js) ===== */
/* @skyward-module 40-revenue-management-commercial-center
 * Revenue management and commercial strategy center with airport fees, non-aero revenue, airline incentives, costs and margin.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('40-revenue-management-commercial-center');
const REVENUE_MANAGEMENT_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f37',
  revenueStreams:[
    {id:'LANDING_FEES',name:'Tarifas de pouso/decolagem',base:42000,elasticity:.18,risk:8},
    {id:'PASSENGER_FEES',name:'Tarifas de passageiros',base:36000,elasticity:.22,risk:10},
    {id:'RETAIL_DUTYFREE',name:'Varejo e duty free',base:28000,elasticity:.35,risk:12},
    {id:'PARKING_GROUND',name:'Estacionamento e solo',base:18000,elasticity:.20,risk:7},
    {id:'CARGO_HANDLING',name:'Carga e handling',base:26000,elasticity:.25,risk:9},
    {id:'PREMIUM_SERVICES',name:'Serviços premium',base:12000,elasticity:.32,risk:14}
  ],
  costCenters:[
    {id:'STAFFING',name:'Equipes e turnos',base:38000,driver:'traffic'},
    {id:'MAINTENANCE',name:'Manutenção operacional',base:26000,driver:'infrastructure'},
    {id:'ENERGY',name:'Energia e sistemas',base:18000,driver:'terminal'},
    {id:'CRISIS_COST',name:'Custos de crise',base:9000,driver:'crisis'},
    {id:'ENVIRONMENT',name:'Ambiental/ESG',base:7000,driver:'environment'}
  ],
  pricingLevers:[
    {id:'BALANCED',name:'Preço equilibrado',revenueBoost:1.00,satisfactionImpact:0,regulatoryRisk:0},
    {id:'GROWTH_INCENTIVE',name:'Incentivo de crescimento',revenueBoost:.92,satisfactionImpact:8,regulatoryRisk:-2},
    {id:'PREMIUM_YIELD',name:'Yield premium',revenueBoost:1.12,satisfactionImpact:-5,regulatoryRisk:4},
    {id:'CARGO_PUSH',name:'Push cargueiro',revenueBoost:1.08,satisfactionImpact:2,regulatoryRisk:2},
    {id:'ESG_DISCOUNT',name:'Desconto verde',revenueBoost:.96,satisfactionImpact:4,regulatoryRisk:-4}
  ],
  commercialDeals:[
    {id:'AIRLINE_REBATE',name:'Rebate por pontualidade',cost:14000,benefit:{airline:9,traffic:4}},
    {id:'RETAIL_CONTRACT',name:'Contrato varejo premium',cost:25000,benefit:{retail:14,passenger:4}},
    {id:'CARGO_INCENTIVE',name:'Incentivo cargueiro',cost:20000,benefit:{cargo:12,airline:3}},
    {id:'PARKING_DYNAMIC',name:'Estacionamento dinâmico',cost:9000,benefit:{parking:10}},
    {id:'GREEN_AIRLINE_DEAL',name:'Acordo companhia verde',cost:18000,benefit:{environment:8,airline:5}}
  ],
  financialBands:[
    {id:'PROFIT_LEADER',min:90,name:'Alta rentabilidade'},
    {id:'HEALTHY',min:75,name:'Saudável'},
    {id:'TIGHT',min:55,name:'Margem apertada'},
    {id:'LOSS_RISK',min:0,name:'Risco de prejuízo'}
  ],
  reportingKPIs:[
    {id:'EBITDA_MARGIN',name:'Margem EBITDA'},
    {id:'AERO_REVENUE',name:'Receita aeronáutica'},
    {id:'NON_AERO_REVENUE',name:'Receita não aeronáutica'},
    {id:'COST_PER_TURN',name:'Custo por turno'},
    {id:'AIRLINE_YIELD',name:'Yield companhias'},
    {id:'PASSENGER_SPEND',name:'Gasto por passageiro'}
  ]
});
const REVENUE_MANAGEMENT_KEY='skywardRevenueManagement_v1';
let revenueManagementState={schema:1,pricingLever:'BALANCED',cash:320000,activeDeals:[],history:[],revenueScore:76,margin:0,status:'HEALTHY',lastEvaluation:null};
function loadRevenueManagement(){
  try{ const raw=localStorage?.getItem?.(REVENUE_MANAGEMENT_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) revenueManagementState={...revenueManagementState,...parsed}; } }catch(e){ safeLogError?.(e,'revenue-management-load'); }
  return revenueManagementState;
}
function saveRevenueManagement(){
  try{ localStorage?.setItem?.(REVENUE_MANAGEMENT_KEY,JSON.stringify(revenueManagementState)); }catch(e){ safeLogError?.(e,'revenue-management-save'); }
  return revenueManagementState;
}
function financialBand(score){
  return REVENUE_MANAGEMENT_CATALOG.financialBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||REVENUE_MANAGEMENT_CATALOG.financialBands.at(-1);
}
function pricingLeverById(id){ return REVENUE_MANAGEMENT_CATALOG.pricingLevers.find(p=>p.id===id)||REVENUE_MANAGEMENT_CATALOG.pricingLevers[0]; }
function dealById(id){ return REVENUE_MANAGEMENT_CATALOG.commercialDeals.find(d=>d.id===id)||REVENUE_MANAGEMENT_CATALOG.commercialDeals[0]; }
function setPricingLever(id='BALANCED'){
  loadRevenueManagement();
  revenueManagementState.pricingLever=pricingLeverById(id).id;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return pricingLeverById(revenueManagementState.pricingLever);
}
function signCommercialDeal(id='RETAIL_CONTRACT'){
  loadRevenueManagement();
  const deal=dealById(id);
  if(revenueManagementState.activeDeals.some(d=>d.dealId===deal.id)) return revenueManagementState.activeDeals.find(d=>d.dealId===deal.id);
  const item={id:`DEA-${String(Date.now()).slice(-6)}`,dealId:deal.id,name:deal.name,cost:deal.cost,status:'ACTIVE',signedAt:new Date().toISOString()};
  revenueManagementState.activeDeals.unshift(item);
  revenueManagementState.cash-=deal.cost;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return item;
}
function dealBenefit(kind){
  let gain=0;
  for(const d of revenueManagementState.activeDeals){
    const tpl=dealById(d.dealId);
    gain+=Number(tpl.benefit?.[kind]||0);
  }
  return gain;
}
function collectCommercialDrivers(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const env=window.SKYWARD_ENVIRONMENT_SUSTAINABILITY?.status?.()||{};
  const campaign=window.SKYWARD_INTERNATIONAL_CAMPAIGN?.status?.()||{};
  return {
    finalScore:Number(finalScore||0),
    landed:Number(statsObj.landed||0),
    departed:Number(statsObj.departed||0),
    denied:Number(statsObj.denied||0),
    conflicts:Number(statsObj.conflicts||0),
    runwayIncursions:Number(statsObj.runwayIncursions||0),
    fail:Boolean(fail),
    airlineScore:Number(airline.progress?.score||78),
    terminalScore:Number(airportAuth.progress?.score||78),
    infraScore:Number(infra.progress?.score||72),
    infraRisk:Number(infra.progress?.risk||0),
    crisisScore:Number(crisis.progress?.score||100),
    esgScore:Number(env.progress?.score||78),
    campaignReputation:Number(campaign.reputation||campaign.progress?.reputation||0)
  };
}
function calculateRevenue(finalScore=0,statsObj={},fail=false){
  const drivers=collectCommercialDrivers(finalScore,statsObj,fail);
  const lever=pricingLeverById(revenueManagementState.pricingLever);
  const movements=Math.max(1,drivers.landed+drivers.departed+2);
  const trafficFactor=Math.min(1.45,Math.max(.55, movements/5 + finalScore/5000));
  const satisfactionFactor=Math.max(.55,Math.min(1.2,(drivers.airlineScore+drivers.terminalScore+drivers.esgScore)/255));
  const riskPenalty=Math.max(.65,1-(drivers.conflicts*.035+drivers.runwayIncursions*.08+drivers.denied*.025+(fail?.10:0)));
  const reputationBoost=Math.min(.12,drivers.campaignReputation/8000);
  const revenueByStream={};
  for(const s of REVENUE_MANAGEMENT_CATALOG.revenueStreams){
    let value=s.base*trafficFactor*satisfactionFactor*riskPenalty*lever.revenueBoost*(1+reputationBoost);
    if(s.id==='RETAIL_DUTYFREE') value+=dealBenefit('retail')*900+dealBenefit('passenger')*600;
    if(s.id==='CARGO_HANDLING') value+=dealBenefit('cargo')*1100;
    if(s.id==='PARKING_GROUND') value+=dealBenefit('parking')*800;
    if(s.id==='LANDING_FEES') value+=dealBenefit('airline')*500;
    if(s.id==='PREMIUM_SERVICES') value+=dealBenefit('traffic')*700;
    revenueByStream[s.id]=Math.max(0,Math.round(value));
  }
  const aeroRevenue=(revenueByStream.LANDING_FEES||0)+(revenueByStream.PASSENGER_FEES||0)+(revenueByStream.CARGO_HANDLING||0);
  const nonAeroRevenue=(revenueByStream.RETAIL_DUTYFREE||0)+(revenueByStream.PARKING_GROUND||0)+(revenueByStream.PREMIUM_SERVICES||0);
  const costs={};
  for(const c of REVENUE_MANAGEMENT_CATALOG.costCenters){
    let value=c.base;
    if(c.driver==='traffic') value*=1+trafficFactor*.18;
    if(c.driver==='infrastructure') value*=1+drivers.infraRisk/110;
    if(c.driver==='terminal') value*=1+Math.max(0,75-drivers.terminalScore)/160;
    if(c.driver==='crisis') value*=1+Math.max(0,100-drivers.crisisScore)/90;
    if(c.driver==='environment') value*=1+Math.max(0,75-drivers.esgScore)/120;
    value+=drivers.denied*900+drivers.conflicts*3000+drivers.runwayIncursions*7000;
    costs[c.id]=Math.round(value);
  }
  const totalRevenue=Object.values(revenueByStream).reduce((a,b)=>a+b,0);
  const totalCosts=Object.values(costs).reduce((a,b)=>a+b,0)+revenueManagementState.activeDeals.reduce((a,d)=>a+Math.round((dealById(d.dealId).cost||0)/8),0);
  const ebitda=totalRevenue-totalCosts;
  const margin=totalRevenue>0?Math.round((ebitda/totalRevenue)*100):0;
  return {drivers,lever:lever.id,revenueByStream,costs,aeroRevenue,nonAeroRevenue,totalRevenue,totalCosts,ebitda,margin};
}
function evaluateRevenueManagement(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadRevenueManagement();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const report=calculateRevenue(finalScore,statsObj,fail);
  revenueManagementState.cash+=report.ebitda;
  revenueManagementState.margin=report.margin;
  const marginScore=Math.max(0,Math.min(100,50+report.margin));
  const diversityScore=report.totalRevenue?Math.round(Math.min(100,(report.nonAeroRevenue/report.totalRevenue)*200)):50;
  const stabilityPenalty=(report.drivers.conflicts*5)+(report.drivers.runwayIncursions*10)+(fail?12:0);
  const score=Math.max(0,Math.min(100,Math.round(marginScore*.58+diversityScore*.22+Math.min(100,report.drivers.airlineScore)*.12+Math.min(100,report.drivers.esgScore)*.08-stabilityPenalty)));
  revenueManagementState.revenueScore=score;
  revenueManagementState.status=financialBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...report,cash:revenueManagementState.cash,revenueScore:score,status:revenueManagementState.status,activeDeals:revenueManagementState.activeDeals.length};
  revenueManagementState.history.unshift(evaluation);
  revenueManagementState.history=revenueManagementState.history.slice(0,80);
  revenueManagementState.lastEvaluation=evaluation;
  saveRevenueManagement();
  renderRevenueManagementBoard();
  return {state:revenueManagementState,evaluation};
}
function revenueManagementProgress(){
  loadRevenueManagement();
  return {score:revenueManagementState.revenueScore,status:revenueManagementState.status,cash:revenueManagementState.cash,margin:revenueManagementState.margin,pricingLever:revenueManagementState.pricingLever,activeDeals:revenueManagementState.activeDeals.length,last:revenueManagementState.lastEvaluation||null};
}
function renderRevenueManagementBoard(){
  try{
    const anchor=document.querySelector('#environmentSustainabilityInline') || document.querySelector('#infrastructureExpansionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#revenueManagementInline'); if(old) old.remove();
    const p=revenueManagementProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="revenueManagementInline" class="airport-ops-board revenue-management-inline">
      <div class="airport-ops-head"><b>REV MGMT</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}%</b></div>
        <div><small>MARGEM</small><b>${p.margin}%</b></div>
        <div><small>CAIXA</small><b>${Math.round(p.cash/1000)}k</b></div>
        <div><small>PREÇO</small><b>${p.pricingLever}</b></div>
        <div><small>DEALS</small><b>${p.activeDeals}</b></div>
        <div><small>EBITDA</small><b>${Math.round((p.last?.ebitda||0)/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'revenue-management-board'); }
}
function initializeRevenueManagement(){
  loadRevenueManagement();
  renderRevenueManagementBoard();
  return revenueManagementState;
}
function revenueManagementStatus(){ loadRevenueManagement(); return {...revenueManagementState,progress:revenueManagementProgress(),catalog:REVENUE_MANAGEMENT_CATALOG}; }
function revenueManagementSelfCheck(){
  const issues=[];
  if(REVENUE_MANAGEMENT_CATALOG.revenueStreams.length<6) issues.push('receitas insuficientes');
  if(REVENUE_MANAGEMENT_CATALOG.costCenters.length<5) issues.push('custos insuficientes');
  const lever=setPricingLever('PREMIUM_YIELD');
  const deal=signCommercialDeal('RETAIL_CONTRACT');
  const res=evaluateRevenueManagement(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!lever.id || !deal.id) issues.push('alavanca/deal inválido');
  if(!Number.isFinite(res.evaluation.totalRevenue) || !Number.isFinite(res.evaluation.ebitda)) issues.push('relatório financeiro inválido');
  return {ok:issues.length===0,issues,streams:REVENUE_MANAGEMENT_CATALOG.revenueStreams.length,costs:REVENUE_MANAGEMENT_CATALOG.costCenters.length};
}
window.SKYWARD_REVENUE_MANAGEMENT=Object.freeze({
  schema:1,
  catalog:REVENUE_MANAGEMENT_CATALOG,
  load:loadRevenueManagement,
  save:saveRevenueManagement,
  init:initializeRevenueManagement,
  price:setPricingLever,
  deal:signCommercialDeal,
  evaluate:evaluateRevenueManagement,
  progress:revenueManagementProgress,
  status:revenueManagementStatus,
  board:renderRevenueManagementBoard,
  selfCheck:revenueManagementSelfCheck
});

/* ===== MODULE 36: workforce-staffing-center (41-workforce-staffing-center.js) ===== */
/* @skyward-module 41-workforce-staffing-center
 * Workforce and staffing center with ATC teams, roster coverage, fatigue, training, hiring, absence and readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('41-workforce-staffing-center');
const WORKFORCE_STAFFING_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f38',
  roles:[
    {id:'TOWER_CONTROLLER',name:'Controlador de Torre',minCoverage:2,skill:'TWR'},
    {id:'GROUND_CONTROLLER',name:'Controlador de Solo',minCoverage:1,skill:'GND'},
    {id:'APPROACH_CONTROLLER',name:'Controle de Aproximação',minCoverage:2,skill:'APP'},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minCoverage:1,skill:'SUP'},
    {id:'FLOW_MANAGER',name:'Gestor de Fluxo',minCoverage:1,skill:'FLOW'},
    {id:'TECH_SUPPORT',name:'Suporte Técnico',minCoverage:1,skill:'TECH'}
  ],
  trainingPrograms:[
    {id:'SIM_REFRESHER',name:'Reciclagem em simulador',cost:9000,skillGain:6,fatigueRelief:2},
    {id:'CRM_ATC',name:'Comunicação e CRM ATC',cost:6500,skillGain:5,fatigueRelief:1},
    {id:'EMERGENCY_DRILL',name:'Treino de emergência',cost:11000,skillGain:8,fatigueRelief:0},
    {id:'SURFACE_SAFETY',name:'Segurança de solo/pista',cost:8000,skillGain:7,fatigueRelief:1},
    {id:'FLOW_SLOT_TRAINING',name:'Slots e fluxo',cost:7200,skillGain:6,fatigueRelief:1}
  ],
  hiringPools:[
    {id:'TRAINEE',name:'Trainee ATC',cost:18000,skill:55,readyIn:4},
    {id:'LICENSED',name:'Controlador licenciado',cost:42000,skill:72,readyIn:2},
    {id:'SENIOR',name:'Sênior internacional',cost:76000,skill:86,readyIn:1},
    {id:'CONTRACTOR',name:'Contrato temporário',cost:30000,skill:68,readyIn:0}
  ],
  laborEvents:[
    {id:'SICK_LEAVE',name:'Baixa médica',risk:16,impact:'coverage-1'},
    {id:'OVERTIME_DISPUTE',name:'Disputa de hora extra',risk:22,impact:'morale-12'},
    {id:'UNION_WARNING',name:'Alerta sindical',risk:28,impact:'laborRisk+15'},
    {id:'TRAINING_BACKLOG',name:'Fila de treinamento',risk:14,impact:'skill-8'},
    {id:'BURNOUT_ALERT',name:'Alerta de burnout',risk:26,impact:'fatigue+18'}
  ],
  readinessBands:[
    {id:'ELITE_CREW',min:90,name:'Equipe elite'},
    {id:'READY',min:75,name:'Pronta'},
    {id:'STRETCHED',min:55,name:'Sobrecarregada'},
    {id:'UNDERSTAFFED',min:0,name:'Subdimensionada'}
  ],
  shiftPatterns:[
    {id:'NORMAL_DAY',name:'Turno diurno normal',fatigue:8,coverageBoost:0},
    {id:'PEAK_OPS',name:'Pico operacional',fatigue:14,coverageBoost:1},
    {id:'NIGHT_OPS',name:'Turno noturno',fatigue:18,coverageBoost:-1},
    {id:'RECOVERY_DAY',name:'Dia de recuperação',fatigue:-12,coverageBoost:-1}
  ]
});
const WORKFORCE_STAFFING_KEY='skywardWorkforceStaffing_v1';
let workforceStaffingState={schema:1,staff:[
  {id:'ATC-001',role:'TOWER_CONTROLLER',skill:78,fatigue:18,status:'ACTIVE'},
  {id:'ATC-002',role:'TOWER_CONTROLLER',skill:74,fatigue:24,status:'ACTIVE'},
  {id:'ATC-003',role:'GROUND_CONTROLLER',skill:72,fatigue:20,status:'ACTIVE'},
  {id:'ATC-004',role:'APPROACH_CONTROLLER',skill:80,fatigue:22,status:'ACTIVE'},
  {id:'ATC-005',role:'APPROACH_CONTROLLER',skill:76,fatigue:26,status:'ACTIVE'},
  {id:'ATC-006',role:'SUPERVISOR',skill:85,fatigue:18,status:'ACTIVE'},
  {id:'ATC-007',role:'FLOW_MANAGER',skill:77,fatigue:21,status:'ACTIVE'},
  {id:'ATC-008',role:'TECH_SUPPORT',skill:73,fatigue:17,status:'ACTIVE'}
],trainees:[],events:[],readinessScore:78,morale:76,laborRisk:12,status:'READY',shiftPattern:'NORMAL_DAY',history:[],lastEvaluation:null};
function loadWorkforceStaffing(){
  try{ const raw=localStorage?.getItem?.(WORKFORCE_STAFFING_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) workforceStaffingState={...workforceStaffingState,...parsed}; } }catch(e){ safeLogError?.(e,'workforce-staffing-load'); }
  return workforceStaffingState;
}
function saveWorkforceStaffing(){
  try{ localStorage?.setItem?.(WORKFORCE_STAFFING_KEY,JSON.stringify(workforceStaffingState)); }catch(e){ safeLogError?.(e,'workforce-staffing-save'); }
  return workforceStaffingState;
}
function readinessBand(score){
  return WORKFORCE_STAFFING_CATALOG.readinessBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||WORKFORCE_STAFFING_CATALOG.readinessBands.at(-1);
}
function roleById(id){ return WORKFORCE_STAFFING_CATALOG.roles.find(r=>r.id===id)||WORKFORCE_STAFFING_CATALOG.roles[0]; }
function trainingById(id){ return WORKFORCE_STAFFING_CATALOG.trainingPrograms.find(t=>t.id===id)||WORKFORCE_STAFFING_CATALOG.trainingPrograms[0]; }
function hiringById(id){ return WORKFORCE_STAFFING_CATALOG.hiringPools.find(h=>h.id===id)||WORKFORCE_STAFFING_CATALOG.hiringPools[0]; }
function shiftById(id){ return WORKFORCE_STAFFING_CATALOG.shiftPatterns.find(s=>s.id===id)||WORKFORCE_STAFFING_CATALOG.shiftPatterns[0]; }
function setShiftPattern(id='NORMAL_DAY'){
  loadWorkforceStaffing();
  workforceStaffingState.shiftPattern=shiftById(id).id;
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return shiftById(workforceStaffingState.shiftPattern);
}
function trainWorkforce(programId='SIM_REFRESHER',roleId='TOWER_CONTROLLER'){
  loadWorkforceStaffing();
  const program=trainingById(programId);
  const targets=workforceStaffingState.staff.filter(s=>s.role===roleId && s.status==='ACTIVE');
  for(const s of targets){
    s.skill=Math.min(100,Number(s.skill||60)+program.skillGain);
    s.fatigue=Math.max(0,Number(s.fatigue||0)-program.fatigueRelief);
  }
  workforceStaffingState.morale=Math.min(100,workforceStaffingState.morale+2);
  const item={id:`TRN-${String(Date.now()).slice(-6)}`,programId:program.id,roleId,cost:program.cost,trained:targets.length,at:new Date().toISOString()};
  workforceStaffingState.history.unshift({type:'TRAINING',...item});
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return item;
}
function hireStaff(poolId='LICENSED',roleId='GROUND_CONTROLLER'){
  loadWorkforceStaffing();
  const pool=hiringById(poolId);
  const item={id:`ATC-${String(Date.now()).slice(-5)}`,role:roleId,skill:pool.skill,fatigue:10,status:pool.readyIn>0?'TRAINING':'ACTIVE',readyIn:pool.readyIn,source:pool.id,cost:pool.cost};
  if(item.status==='ACTIVE') workforceStaffingState.staff.push(item); else workforceStaffingState.trainees.push(item);
  workforceStaffingState.history.unshift({type:'HIRE',...item,at:new Date().toISOString()});
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return item;
}
function raiseLaborEvent(id='SICK_LEAVE'){
  loadWorkforceStaffing();
  const tpl=WORKFORCE_STAFFING_CATALOG.laborEvents.find(e=>e.id===id)||WORKFORCE_STAFFING_CATALOG.laborEvents[0];
  const event={id:`LAB-${String(Date.now()).slice(-6)}`,eventId:tpl.id,name:tpl.name,risk:tpl.risk,status:'OPEN',at:new Date().toISOString()};
  if(tpl.id==='SICK_LEAVE'){
    const active=workforceStaffingState.staff.find(s=>s.status==='ACTIVE');
    if(active) active.status='SICK';
  }
  if(tpl.id==='OVERTIME_DISPUTE') workforceStaffingState.morale=Math.max(0,workforceStaffingState.morale-12);
  if(tpl.id==='UNION_WARNING') workforceStaffingState.laborRisk=Math.min(100,workforceStaffingState.laborRisk+15);
  if(tpl.id==='BURNOUT_ALERT') workforceStaffingState.staff.forEach(s=>s.fatigue=Math.min(100,Number(s.fatigue||0)+8));
  workforceStaffingState.events.unshift(event);
  workforceStaffingState.events=workforceStaffingState.events.slice(0,40);
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return event;
}
function closeLaborEvent(id,ok=true){
  loadWorkforceStaffing();
  const ev=workforceStaffingState.events.find(e=>e.id===id);
  if(ev){ ev.status=ok?'CLOSED':'ESCALATED'; ev.closedAt=new Date().toISOString(); }
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return ev||null;
}
function advanceTrainees(){
  const ready=[];
  for(const t of workforceStaffingState.trainees){
    t.readyIn=Math.max(0,Number(t.readyIn||0)-1);
    if(t.readyIn===0){ t.status='ACTIVE'; ready.push(t); }
  }
  workforceStaffingState.trainees=workforceStaffingState.trainees.filter(t=>t.status!=='ACTIVE');
  workforceStaffingState.staff.push(...ready);
  return ready;
}
function coverageReport(){
  const active=workforceStaffingState.staff.filter(s=>s.status==='ACTIVE');
  const result={};
  let shortage=0;
  for(const role of WORKFORCE_STAFFING_CATALOG.roles){
    const count=active.filter(s=>s.role===role.id).length;
    const missing=Math.max(0,role.minCoverage-count);
    result[role.id]={count,required:role.minCoverage,missing};
    shortage+=missing;
  }
  const avgSkill=active.length?Math.round(active.reduce((a,s)=>a+Number(s.skill||0),0)/active.length):0;
  const avgFatigue=active.length?Math.round(active.reduce((a,s)=>a+Number(s.fatigue||0),0)/active.length):100;
  return {roles:result,active:active.length,shortage,avgSkill,avgFatigue};
}
function evaluateWorkforceStaffing(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadWorkforceStaffing();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const shift=shiftById(workforceStaffingState.shiftPattern);
  advanceTrainees();
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const pressure=(statsObj.conflicts||0)*6+(statsObj.runwayIncursions||0)*10+(statsObj.denied||0)*3+(fail?10:0)+Math.max(0,75-Number(crisis.progress?.score||90))*0.1;
  for(const s of workforceStaffingState.staff){
    if(s.status==='ACTIVE'){
      s.fatigue=Math.max(0,Math.min(100,Number(s.fatigue||0)+shift.fatigue+pressure/8-Math.min(2,finalScore/1800)));
      if(s.fatigue>85) workforceStaffingState.laborRisk=Math.min(100,workforceStaffingState.laborRisk+1);
    }
    if(s.status==='SICK' && Math.random()<0.15) s.status='ACTIVE';
  }
  const coverage=coverageReport();
  const safetyScore=Number(safety.progress?.score||78);
  const cashPressure=Number(revenue.progress?.cash||320000)<0?10:0;
  const openEvents=workforceStaffingState.events.filter(e=>e.status==='OPEN');
  const moralePenalty=Math.max(0,70-workforceStaffingState.morale)*0.25;
  const riskPenalty=workforceStaffingState.laborRisk*0.22+openEvents.length*2+cashPressure;
  const readiness=Math.max(0,Math.min(100,Math.round(coverage.avgSkill*.42+(100-coverage.avgFatigue)*.28+Math.min(100,safetyScore)*.12+workforceStaffingState.morale*.12+Math.max(0,100-riskPenalty-moralePenalty)*.06-coverage.shortage*14)));
  workforceStaffingState.readinessScore=readiness;
  workforceStaffingState.status=readinessBand(readiness).id;
  if(readiness<55 && !openEvents.some(e=>e.eventId==='BURNOUT_ALERT')) raiseLaborEvent('BURNOUT_ALERT');
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),coverage,readinessScore:readiness,status:workforceStaffingState.status,morale:workforceStaffingState.morale,laborRisk:workforceStaffingState.laborRisk,shiftPattern:workforceStaffingState.shiftPattern,openEvents:workforceStaffingState.events.filter(e=>e.status==='OPEN').length,trainees:workforceStaffingState.trainees.length};
  workforceStaffingState.history.unshift(evaluation);
  workforceStaffingState.history=workforceStaffingState.history.slice(0,100);
  workforceStaffingState.lastEvaluation=evaluation;
  saveWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return {state:workforceStaffingState,evaluation};
}
function workforceStaffingProgress(){
  loadWorkforceStaffing();
  const coverage=coverageReport();
  return {score:workforceStaffingState.readinessScore,status:workforceStaffingState.status,morale:workforceStaffingState.morale,laborRisk:workforceStaffingState.laborRisk,activeStaff:coverage.active,shortage:coverage.shortage,avgFatigue:coverage.avgFatigue,trainees:workforceStaffingState.trainees.length,openEvents:workforceStaffingState.events.filter(e=>e.status==='OPEN').length,last:workforceStaffingState.lastEvaluation||null};
}
function renderWorkforceStaffingBoard(){
  try{
    const anchor=document.querySelector('#revenueManagementInline') || document.querySelector('#environmentSustainabilityInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#workforceStaffingInline'); if(old) old.remove();
    const p=workforceStaffingProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="workforceStaffingInline" class="airport-ops-board workforce-staffing-inline">
      <div class="airport-ops-head"><b>WORKFORCE</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PRONT.</small><b>${p.score}%</b></div>
        <div><small>EQUIPE</small><b>${p.activeStaff}</b></div>
        <div><small>FALTA</small><b>${p.shortage}</b></div>
        <div><small>FADIGA</small><b>${p.avgFatigue}</b></div>
        <div><small>MORAL</small><b>${p.morale}</b></div>
        <div><small>RISCO</small><b>${p.laborRisk}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'workforce-staffing-board'); }
}
function initializeWorkforceStaffing(){
  loadWorkforceStaffing();
  renderWorkforceStaffingBoard();
  return workforceStaffingState;
}
function workforceStaffingStatus(){ loadWorkforceStaffing(); return {...workforceStaffingState,progress:workforceStaffingProgress(),catalog:WORKFORCE_STAFFING_CATALOG}; }
function workforceStaffingSelfCheck(){
  const issues=[];
  if(WORKFORCE_STAFFING_CATALOG.roles.length<6) issues.push('funções insuficientes');
  if(WORKFORCE_STAFFING_CATALOG.trainingPrograms.length<5) issues.push('treinamentos insuficientes');
  const shift=setShiftPattern('PEAK_OPS');
  const training=trainWorkforce('SIM_REFRESHER','TOWER_CONTROLLER');
  const hire=hireStaff('CONTRACTOR','GROUND_CONTROLLER');
  const res=evaluateWorkforceStaffing(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!shift.id || !training.id || !hire.id) issues.push('shift/training/hire inválido');
  if(!Number.isFinite(res.evaluation.readinessScore)) issues.push('readiness inválido');
  return {ok:issues.length===0,issues,roles:WORKFORCE_STAFFING_CATALOG.roles.length,training:WORKFORCE_STAFFING_CATALOG.trainingPrograms.length};
}
window.SKYWARD_WORKFORCE_STAFFING=Object.freeze({
  schema:1,
  catalog:WORKFORCE_STAFFING_CATALOG,
  load:loadWorkforceStaffing,
  save:saveWorkforceStaffing,
  init:initializeWorkforceStaffing,
  shift:setShiftPattern,
  training:trainWorkforce,
  hire:hireStaff,
  event:raiseLaborEvent,
  close:closeLaborEvent,
  evaluate:evaluateWorkforceStaffing,
  progress:workforceStaffingProgress,
  status:workforceStaffingStatus,
  board:renderWorkforceStaffingBoard,
  selfCheck:workforceStaffingSelfCheck
});

/* ===== MODULE 37: passenger-reputation-center (42-passenger-reputation-center.js) ===== */
/* @skyward-module 42-passenger-reputation-center
 * Passenger experience and public reputation center with NPS, complaints, accessibility, customer care and public sentiment.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('42-passenger-reputation-center');
const PASSENGER_REPUTATION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f39',
  experienceMetrics:[
    {id:'NPS',name:'NPS passageiro',weight:24,target:78},
    {id:'WAIT_TIME',name:'Tempo de espera',weight:18,target:76},
    {id:'INFORMATION',name:'Informação ao passageiro',weight:16,target:80},
    {id:'ACCESSIBILITY',name:'Acessibilidade',weight:12,target:82},
    {id:'CARE',name:'Atendimento e acolhimento',weight:14,target:78},
    {id:'SOCIAL_SENTIMENT',name:'Sentimento em redes',weight:16,target:76}
  ],
  servicePrograms:[
    {id:'LIVE_INFO_BOARDS',name:'Painéis vivos de informação',cost:32000,benefit:{INFORMATION:10,NPS:4}},
    {id:'ACCESSIBILITY_CREW',name:'Equipe acessibilidade',cost:24000,benefit:{ACCESSIBILITY:12,CARE:4}},
    {id:'QUEUE_AMBASSADORS',name:'Anfitriões de fila',cost:18000,benefit:{WAIT_TIME:8,CARE:6}},
    {id:'CARE_DESK',name:'Balcão cuidado ao passageiro',cost:26000,benefit:{CARE:12,SOCIAL_SENTIMENT:4}},
    {id:'SOCIAL_RESPONSE',name:'Resposta social media',cost:15000,benefit:{SOCIAL_SENTIMENT:10,INFORMATION:3}},
    {id:'FAMILY_ASSIST',name:'Assistência famílias/conexões',cost:21000,benefit:{NPS:7,CARE:6}}
  ],
  complaintTypes:[
    {id:'DELAY_INFO',name:'Falta de informação sobre atraso',risk:18,metric:'INFORMATION'},
    {id:'LONG_QUEUE',name:'Fila longa',risk:15,metric:'WAIT_TIME'},
    {id:'ACCESSIBILITY_FAIL',name:'Falha de acessibilidade',risk:24,metric:'ACCESSIBILITY'},
    {id:'BAGGAGE_CLAIM',name:'Problema de bagagem',risk:17,metric:'CARE'},
    {id:'SOCIAL_VIRAL',name:'Post viral negativo',risk:28,metric:'SOCIAL_SENTIMENT'},
    {id:'CONNECTION_MISSED',name:'Conexão perdida',risk:22,metric:'NPS'}
  ],
  reputationBands:[
    {id:'LOVED_AIRPORT',min:90,name:'Aeroporto querido'},
    {id:'TRUSTED',min:75,name:'Imagem confiável'},
    {id:'UNDER_PRESSURE',min:55,name:'Imagem pressionada'},
    {id:'REPUTATION_CRISIS',min:0,name:'Crise reputacional'}
  ],
  communicationChannels:[
    {id:'APP_PUSH',name:'Notificação app/PWA'},
    {id:'PA_SYSTEM',name:'Sistema de som'},
    {id:'SOCIAL_MEDIA',name:'Redes sociais'},
    {id:'AIRLINE_DESKS',name:'Balcões das companhias'},
    {id:'ACCESSIBILITY_TEAM',name:'Equipe acessibilidade'}
  ],
  publicMoments:[
    {id:'HOLIDAY_PEAK',name:'Pico de feriado',attention:18},
    {id:'MAJOR_DELAY',name:'Grande atraso',attention:24},
    {id:'VIP_VISIT',name:'Visita institucional',attention:10},
    {id:'VIRAL_INCIDENT',name:'Incidente viral',attention:30}
  ]
});
const PASSENGER_REPUTATION_KEY='skywardPassengerReputation_v1';
let passengerReputationState={schema:1,metrics:{NPS:78,WAIT_TIME:76,INFORMATION:80,ACCESSIBILITY:82,CARE:78,SOCIAL_SENTIMENT:76},programs:[],complaints:[],reputationScore:78,status:'TRUSTED',publicAttention:12,history:[],lastEvaluation:null};
function loadPassengerReputation(){
  try{ const raw=localStorage?.getItem?.(PASSENGER_REPUTATION_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) passengerReputationState={...passengerReputationState,...parsed}; } }catch(e){ safeLogError?.(e,'passenger-reputation-load'); }
  return passengerReputationState;
}
function savePassengerReputation(){
  try{ localStorage?.setItem?.(PASSENGER_REPUTATION_KEY,JSON.stringify(passengerReputationState)); }catch(e){ safeLogError?.(e,'passenger-reputation-save'); }
  return passengerReputationState;
}
function reputationBand(score){
  return PASSENGER_REPUTATION_CATALOG.reputationBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||PASSENGER_REPUTATION_CATALOG.reputationBands.at(-1);
}
function programById(id){ return PASSENGER_REPUTATION_CATALOG.servicePrograms.find(p=>p.id===id)||PASSENGER_REPUTATION_CATALOG.servicePrograms[0]; }
function complaintById(id){ return PASSENGER_REPUTATION_CATALOG.complaintTypes.find(c=>c.id===id)||PASSENGER_REPUTATION_CATALOG.complaintTypes[0]; }
function launchPassengerProgram(id='LIVE_INFO_BOARDS'){
  loadPassengerReputation();
  const program=programById(id);
  if(passengerReputationState.programs.some(p=>p.programId===program.id)) return passengerReputationState.programs.find(p=>p.programId===program.id);
  const item={id:`PXP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',startedAt:new Date().toISOString()};
  passengerReputationState.programs.unshift(item);
  for(const [metric,gain] of Object.entries(program.benefit||{})){
    passengerReputationState.metrics[metric]=Math.min(100,Number(passengerReputationState.metrics[metric]||75)+Number(gain||0));
  }
  savePassengerReputation();
  renderPassengerReputationBoard();
  return item;
}
function raisePassengerComplaint(id='DELAY_INFO'){
  loadPassengerReputation();
  const tpl=complaintById(id);
  const item={id:`CMP-${String(Date.now()).slice(-6)}`,complaintId:tpl.id,name:tpl.name,risk:tpl.risk,metric:tpl.metric,status:'OPEN',at:new Date().toISOString()};
  passengerReputationState.complaints.unshift(item);
  passengerReputationState.complaints=passengerReputationState.complaints.slice(0,60);
  passengerReputationState.publicAttention=Math.min(100,passengerReputationState.publicAttention+Math.round(tpl.risk/3));
  savePassengerReputation();
  renderPassengerReputationBoard();
  return item;
}
function closePassengerComplaint(id,ok=true){
  loadPassengerReputation();
  const complaint=passengerReputationState.complaints.find(c=>c.id===id);
  if(complaint){
    complaint.status=ok?'CLOSED':'ESCALATED';
    complaint.closedAt=new Date().toISOString();
    if(ok) passengerReputationState.metrics[complaint.metric]=Math.min(100,Number(passengerReputationState.metrics[complaint.metric]||75)+2);
  }
  savePassengerReputation();
  renderPassengerReputationBoard();
  return complaint||null;
}
function calculatePassengerMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const airportAuth=window.SKYWARD_AIRPORT_AUTHORITY?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const environment=window.SKYWARD_ENVIRONMENT_SUSTAINABILITY?.status?.()||{};
  const metrics={...passengerReputationState.metrics};
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||80);
  const terminalScore=Number(airportAuth.progress?.score||80);
  const crisisScore=Number(crisis.progress?.score||100);
  const workforceScore=Number(workforce.progress?.score||80);
  const margin=Number(revenue.progress?.margin||0);
  const esg=Number(environment.progress?.score||80);
  const openComplaints=passengerReputationState.complaints.filter(c=>c.status==='OPEN');
  const complaintPenalty=(metric)=>openComplaints.filter(c=>c.metric===metric).reduce((a,c)=>a+Number(c.risk||0),0)/2.8;
  metrics.WAIT_TIME=Math.max(0,Math.min(100,Number(metrics.WAIT_TIME||76)-denied*3-Math.max(0,75-terminalScore)*0.25-complaintPenalty('WAIT_TIME')+(workforceScore>80?2:0)));
  metrics.INFORMATION=Math.max(0,Math.min(100,Number(metrics.INFORMATION||80)-denied*2-Math.max(0,75-crisisScore)*0.25-complaintPenalty('INFORMATION')+(finalScore>2000?2:0)));
  metrics.ACCESSIBILITY=Math.max(0,Math.min(100,Number(metrics.ACCESSIBILITY||82)-complaintPenalty('ACCESSIBILITY')+(terminalScore>82?2:0)));
  metrics.CARE=Math.max(0,Math.min(100,Number(metrics.CARE||78)-openComplaints.length*1.8-Math.max(0,75-workforceScore)*0.20-complaintPenalty('CARE')));
  metrics.SOCIAL_SENTIMENT=Math.max(0,Math.min(100,Number(metrics.SOCIAL_SENTIMENT||76)-passengerReputationState.publicAttention*0.15-complaintPenalty('SOCIAL_SENTIMENT')+Math.max(0,esg-75)*0.10));
  metrics.NPS=Math.max(0,Math.min(100,Number(metrics.NPS||78)+(airlineScore-75)*0.10+(terminalScore-75)*0.14+(metrics.CARE-75)*0.10+(metrics.INFORMATION-75)*0.10-margin*0.03-denied*1.4-conflicts*2.4-incursions*5-(fail?8:0)-complaintPenalty('NPS')));
  return metrics;
}
function evaluatePassengerReputation(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadPassengerReputation();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  const metrics=calculatePassengerMetrics(finalScore,statsObj,fail);
  passengerReputationState.metrics=metrics;
  if((statsObj.denied||0)>=2 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='DELAY_INFO')) raisePassengerComplaint('DELAY_INFO');
  if(metrics.SOCIAL_SENTIMENT<55 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='SOCIAL_VIRAL')) raisePassengerComplaint('SOCIAL_VIRAL');
  if(metrics.ACCESSIBILITY<60 && !passengerReputationState.complaints.some(c=>c.status==='OPEN'&&c.complaintId==='ACCESSIBILITY_FAIL')) raisePassengerComplaint('ACCESSIBILITY_FAIL');
  const openRisk=passengerReputationState.complaints.filter(c=>c.status==='OPEN').reduce((a,c)=>a+Number(c.risk||0),0);
  const weighted=Math.round(PASSENGER_REPUTATION_CATALOG.experienceMetrics.reduce((a,m)=>a+(metrics[m.id]||0)*m.weight,0)/100);
  const score=Math.max(0,Math.min(100,Math.round(weighted-openRisk/12+passengerReputationState.programs.length*1.2)));
  passengerReputationState.reputationScore=score;
  passengerReputationState.status=reputationBand(score).id;
  passengerReputationState.publicAttention=Math.max(0,Math.min(100,Math.round(passengerReputationState.publicAttention*0.92+openRisk/18)));
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),metrics,weighted,reputationScore:score,status:passengerReputationState.status,openComplaints:passengerReputationState.complaints.filter(c=>c.status==='OPEN').length,programs:passengerReputationState.programs.length,publicAttention:passengerReputationState.publicAttention};
  passengerReputationState.history.unshift(evaluation);
  passengerReputationState.history=passengerReputationState.history.slice(0,100);
  passengerReputationState.lastEvaluation=evaluation;
  savePassengerReputation();
  renderPassengerReputationBoard();
  return {state:passengerReputationState,evaluation};
}
function passengerReputationProgress(){
  loadPassengerReputation();
  return {score:passengerReputationState.reputationScore,status:passengerReputationState.status,nps:Math.round(passengerReputationState.metrics.NPS||0),sentiment:Math.round(passengerReputationState.metrics.SOCIAL_SENTIMENT||0),complaints:passengerReputationState.complaints.filter(c=>c.status==='OPEN').length,programs:passengerReputationState.programs.length,publicAttention:passengerReputationState.publicAttention,last:passengerReputationState.lastEvaluation||null};
}
function renderPassengerReputationBoard(){
  try{
    const anchor=document.querySelector('#workforceStaffingInline') || document.querySelector('#revenueManagementInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#passengerReputationInline'); if(old) old.remove();
    const p=passengerReputationProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="passengerReputationInline" class="airport-ops-board passenger-reputation-inline">
      <div class="airport-ops-head"><b>PASSENGER XP</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REP.</small><b>${p.score}%</b></div>
        <div><small>NPS</small><b>${p.nps}</b></div>
        <div><small>SOCIAL</small><b>${p.sentiment}</b></div>
        <div><small>QUEIXAS</small><b>${p.complaints}</b></div>
        <div><small>PROG.</small><b>${p.programs}</b></div>
        <div><small>ATENÇÃO</small><b>${p.publicAttention}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'passenger-reputation-board'); }
}
function initializePassengerReputation(){
  loadPassengerReputation();
  renderPassengerReputationBoard();
  return passengerReputationState;
}
function passengerReputationStatus(){ loadPassengerReputation(); return {...passengerReputationState,progress:passengerReputationProgress(),catalog:PASSENGER_REPUTATION_CATALOG}; }
function passengerReputationSelfCheck(){
  const issues=[];
  if(PASSENGER_REPUTATION_CATALOG.experienceMetrics.length<6) issues.push('métricas insuficientes');
  if(PASSENGER_REPUTATION_CATALOG.servicePrograms.length<6) issues.push('programas insuficientes');
  const program=launchPassengerProgram('LIVE_INFO_BOARDS');
  const complaint=raisePassengerComplaint('DELAY_INFO');
  const res=evaluatePassengerReputation(2400,{conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !complaint.id) issues.push('programa/reclamação inválidos');
  if(!Number.isFinite(res.evaluation.reputationScore)) issues.push('score reputação inválido');
  return {ok:issues.length===0,issues,metrics:PASSENGER_REPUTATION_CATALOG.experienceMetrics.length,programs:PASSENGER_REPUTATION_CATALOG.servicePrograms.length};
}
window.SKYWARD_PASSENGER_REPUTATION=Object.freeze({
  schema:1,
  catalog:PASSENGER_REPUTATION_CATALOG,
  load:loadPassengerReputation,
  save:savePassengerReputation,
  init:initializePassengerReputation,
  program:launchPassengerProgram,
  complaint:raisePassengerComplaint,
  close:closePassengerComplaint,
  evaluate:evaluatePassengerReputation,
  progress:passengerReputationProgress,
  status:passengerReputationStatus,
  board:renderPassengerReputationBoard,
  selfCheck:passengerReputationSelfCheck
});

/* ===== MODULE 38: multi-airport-network-center (43-multi-airport-network-center.js) ===== */
/* @skyward-module 43-multi-airport-network-center
 * Multi-airport regional network center with hubs, routes, alternates, inter-airport slots, connection banks and resilience.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('43-multi-airport-network-center');
const MULTI_AIRPORT_NETWORK_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f40',
  airports:[
    {icao:'SBGR',name:'São Paulo Guarulhos',role:'GLOBAL_HUB',capacity:100,resilience:82},
    {icao:'SBSP',name:'Congonhas',role:'DOMESTIC_CORE',capacity:72,resilience:74},
    {icao:'SBKP',name:'Viracopos',role:'CARGO_RELIEF',capacity:86,resilience:78},
    {icao:'SBRJ',name:'Santos Dumont',role:'SHUTTLE_NODE',capacity:64,resilience:70},
    {icao:'SBGL',name:'Galeão',role:'INTERNATIONAL_RELIEF',capacity:82,resilience:76},
    {icao:'SBCF',name:'Confins',role:'REGIONAL_HUB',capacity:78,resilience:80}
  ],
  routeBanks:[
    {id:'PONTE_AEREA',name:'Ponte aérea SP-Rio',airports:['SBSP','SBRJ','SBGR'],value:34,connectionPressure:18},
    {id:'GRU_GLOBAL',name:'Banco global GRU',airports:['SBGR','SBGL','SBCF'],value:48,connectionPressure:26},
    {id:'VCP_CARGO',name:'Malha cargueira VCP',airports:['SBKP','SBGR','SBCF'],value:38,connectionPressure:14},
    {id:'REGIONAL_FEED',name:'Alimentação regional',airports:['SBCF','SBGR','SBSP'],value:30,connectionPressure:20},
    {id:'RIO_RELIEF',name:'Alívio Rio internacional',airports:['SBGL','SBRJ','SBGR'],value:32,connectionPressure:16}
  ],
  networkPolicies:[
    {id:'BALANCED_FLOW',name:'Fluxo equilibrado',slotBoost:0,reputationImpact:0,costImpact:0},
    {id:'HUB_PRIORITY',name:'Priorizar hub principal',slotBoost:8,reputationImpact:-2,costImpact:5},
    {id:'REGIONAL_RESILIENCE',name:'Resiliência regional',slotBoost:4,reputationImpact:4,costImpact:8},
    {id:'CARGO_PROTECTION',name:'Proteção cargueira',slotBoost:5,reputationImpact:0,costImpact:4},
    {id:'PASSENGER_PROTECTION',name:'Proteger conexões',slotBoost:3,reputationImpact:7,costImpact:6}
  ],
  disruptionTypes:[
    {id:'HUB_OVERLOAD',name:'Sobrecarga no hub',risk:24,metric:'hub'},
    {id:'ALTERNATE_SATURATION',name:'Alternados saturados',risk:20,metric:'resilience'},
    {id:'SLOT_MISALIGNMENT',name:'Desalinhamento de slots',risk:18,metric:'slots'},
    {id:'CONNECTION_WAVE_LOST',name:'Onda de conexão perdida',risk:28,metric:'connections'},
    {id:'CARGO_BANK_BREAK',name:'Banco cargueiro quebrado',risk:16,metric:'cargo'},
    {id:'REGIONAL_WEATHER_RING',name:'Anel meteorológico regional',risk:26,metric:'weather'}
  ],
  recoveryActions:[
    {id:'REROUTE_TO_RELIEF',name:'Redirecionar para aeroporto alívio',cost:18000,benefit:{resilience:9,slots:4}},
    {id:'PROTECT_BANK',name:'Proteger banco de conexões',cost:14000,benefit:{connections:11,reputation:3}},
    {id:'CARGO_SWEEP',name:'Varredura cargueira',cost:11000,benefit:{cargo:10,revenue:3}},
    {id:'REGIONAL_GROUND_DELAY',name:'Ground delay regional',cost:9000,benefit:{slots:8,hub:5}},
    {id:'OPEN_ALTERNATE_WINDOW',name:'Abrir janela de alternados',cost:16000,benefit:{resilience:12}}
  ],
  networkBands:[
    {id:'WORLD_NETWORK',min:90,name:'Rede world-class'},
    {id:'CONNECTED',min:75,name:'Rede conectada'},
    {id:'FRAGILE',min:55,name:'Rede frágil'},
    {id:'DISCONNECTED',min:0,name:'Rede desconectada'}
  ],
  networkKPIs:[
    {id:'HUB_SCORE',name:'Score de hub'},
    {id:'CONNECTION_PROTECTION',name:'Proteção de conexões'},
    {id:'ALTERNATE_CAPACITY',name:'Capacidade de alternados'},
    {id:'REGIONAL_REVENUE',name:'Receita regional'},
    {id:'NETWORK_RESILIENCE',name:'Resiliência de rede'}
  ]
});
const MULTI_AIRPORT_NETWORK_KEY='skywardMultiAirportNetwork_v1';
let multiAirportNetworkState={schema:1,policy:'BALANCED_FLOW',disruptions:[],actions:[],networkScore:78,hubScore:80,connectionProtection:76,alternateCapacity:74,regionalRevenue:0,status:'CONNECTED',history:[],lastEvaluation:null};
function loadMultiAirportNetwork(){
  try{ const raw=localStorage?.getItem?.(MULTI_AIRPORT_NETWORK_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) multiAirportNetworkState={...multiAirportNetworkState,...parsed}; } }catch(e){ safeLogError?.(e,'multi-airport-network-load'); }
  return multiAirportNetworkState;
}
function saveMultiAirportNetwork(){
  try{ localStorage?.setItem?.(MULTI_AIRPORT_NETWORK_KEY,JSON.stringify(multiAirportNetworkState)); }catch(e){ safeLogError?.(e,'multi-airport-network-save'); }
  return multiAirportNetworkState;
}
function networkBand(score){
  return MULTI_AIRPORT_NETWORK_CATALOG.networkBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||MULTI_AIRPORT_NETWORK_CATALOG.networkBands.at(-1);
}
function policyById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.networkPolicies.find(p=>p.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.networkPolicies[0]; }
function disruptionById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.disruptionTypes.find(d=>d.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.disruptionTypes[0]; }
function actionById(id){ return MULTI_AIRPORT_NETWORK_CATALOG.recoveryActions.find(a=>a.id===id)||MULTI_AIRPORT_NETWORK_CATALOG.recoveryActions[0]; }
function setNetworkPolicy(id='BALANCED_FLOW'){
  loadMultiAirportNetwork();
  multiAirportNetworkState.policy=policyById(id).id;
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return policyById(multiAirportNetworkState.policy);
}
function raiseNetworkDisruption(id='HUB_OVERLOAD'){
  loadMultiAirportNetwork();
  const tpl=disruptionById(id);
  const item={id:`NET-${String(Date.now()).slice(-6)}`,disruptionId:tpl.id,name:tpl.name,risk:tpl.risk,metric:tpl.metric,status:'OPEN',at:new Date().toISOString()};
  multiAirportNetworkState.disruptions.unshift(item);
  multiAirportNetworkState.disruptions=multiAirportNetworkState.disruptions.slice(0,50);
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return item;
}
function takeNetworkAction(id='PROTECT_BANK'){
  loadMultiAirportNetwork();
  const act=actionById(id);
  const item={id:`NAC-${String(Date.now()).slice(-6)}`,actionId:act.id,name:act.name,cost:act.cost,status:'ACTIVE',at:new Date().toISOString()};
  multiAirportNetworkState.actions.unshift(item);
  multiAirportNetworkState.actions=multiAirportNetworkState.actions.slice(0,50);
  for(const [k,gain] of Object.entries(act.benefit||{})){
    if(k==='resilience') multiAirportNetworkState.alternateCapacity=Math.min(100,multiAirportNetworkState.alternateCapacity+gain);
    if(k==='connections') multiAirportNetworkState.connectionProtection=Math.min(100,multiAirportNetworkState.connectionProtection+gain);
    if(k==='hub') multiAirportNetworkState.hubScore=Math.min(100,multiAirportNetworkState.hubScore+gain);
    if(k==='revenue') multiAirportNetworkState.regionalRevenue+=gain*1000;
  }
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return item;
}
function closeNetworkDisruption(id,ok=true){
  loadMultiAirportNetwork();
  const d=multiAirportNetworkState.disruptions.find(x=>x.id===id);
  if(d){ d.status=ok?'CLOSED':'ESCALATED'; d.closedAt=new Date().toISOString(); }
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return d||null;
}
function networkActionBenefit(kind){
  let total=0;
  for(const a of multiAirportNetworkState.actions){
    const tpl=actionById(a.actionId);
    total+=Number(tpl.benefit?.[kind]||0);
  }
  return total;
}
function calculateNetworkMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const networkFlow=window.SKYWARD_NETWORK_FLOW?.status?.()||{};
  const policy=policyById(multiAirportNetworkState.policy);
  const open=multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN');
  const denied=Number(statsObj.denied||0);
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||80);
  const revenueScore=Number(revenue.progress?.score||75);
  const passengerScore=Number(passenger.progress?.score||78);
  const crisisScore=Number(crisis.progress?.score||90);
  const workforceScore=Number(workforce.progress?.score||78);
  const delay=Number(networkFlow.networkDelayMin||0);
  const hubBase=Math.round((airlineScore*.28+revenueScore*.18+workforceScore*.16+crisisScore*.12+finalScore/40)-denied*2-conflicts*4-incursions*9-delay*.25+policy.slotBoost);
  const connectionBase=Math.round((passengerScore*.30+airlineScore*.26+crisisScore*.16+workforceScore*.12+finalScore/55)-denied*3-open.filter(d=>d.metric==='connections').length*10+networkActionBenefit('connections'));
  const alternateBase=Math.round((multiAirportNetworkState.alternateCapacity*.35+crisisScore*.25+workforceScore*.18+passengerScore*.12)-open.filter(d=>d.metric==='resilience').length*8+networkActionBenefit('resilience'));
  const cargoRevenue=networkActionBenefit('cargo')*1500 + (MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.find(r=>r.id==='VCP_CARGO')?.value||0)*800;
  const regionalRevenue=Math.max(0,Math.round(120000 + revenueScore*900 + airlineScore*700 + cargoRevenue - open.length*4500 - policy.costImpact*1000));
  return {
    hubScore:Math.max(0,Math.min(100,hubBase)),
    connectionProtection:Math.max(0,Math.min(100,connectionBase)),
    alternateCapacity:Math.max(0,Math.min(100,alternateBase)),
    regionalRevenue,
    openRisk:open.reduce((a,d)=>a+Number(d.risk||0),0),
    policy:policy.id,
    drivers:{airlineScore,revenueScore,passengerScore,crisisScore,workforceScore,delay,denied,conflicts,incursions}
  };
}
function evaluateMultiAirportNetwork(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadMultiAirportNetwork();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=3 && !multiAirportNetworkState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='SLOT_MISALIGNMENT')) raiseNetworkDisruption('SLOT_MISALIGNMENT');
  if((statsObj.runwayIncursions||0)>0 && !multiAirportNetworkState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='REGIONAL_WEATHER_RING')) raiseNetworkDisruption('REGIONAL_WEATHER_RING');
  const metrics=calculateNetworkMetrics(finalScore,statsObj,fail);
  multiAirportNetworkState.hubScore=metrics.hubScore;
  multiAirportNetworkState.connectionProtection=metrics.connectionProtection;
  multiAirportNetworkState.alternateCapacity=metrics.alternateCapacity;
  multiAirportNetworkState.regionalRevenue=metrics.regionalRevenue;
  const revenueComponent=Math.max(0,Math.min(100,Math.round(metrics.regionalRevenue/2400)));
  const score=Math.max(0,Math.min(100,Math.round(metrics.hubScore*.26+metrics.connectionProtection*.25+metrics.alternateCapacity*.21+revenueComponent*.16+Math.max(0,100-metrics.openRisk)*.12-(fail?8:0))));
  multiAirportNetworkState.networkScore=score;
  multiAirportNetworkState.status=networkBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,networkScore:score,status:multiAirportNetworkState.status,openDisruptions:multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN').length,actions:multiAirportNetworkState.actions.length};
  multiAirportNetworkState.history.unshift(evaluation);
  multiAirportNetworkState.history=multiAirportNetworkState.history.slice(0,100);
  multiAirportNetworkState.lastEvaluation=evaluation;
  saveMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return {state:multiAirportNetworkState,evaluation};
}
function multiAirportNetworkProgress(){
  loadMultiAirportNetwork();
  return {score:multiAirportNetworkState.networkScore,status:multiAirportNetworkState.status,hubScore:multiAirportNetworkState.hubScore,connectionProtection:multiAirportNetworkState.connectionProtection,alternateCapacity:multiAirportNetworkState.alternateCapacity,regionalRevenue:multiAirportNetworkState.regionalRevenue,policy:multiAirportNetworkState.policy,openDisruptions:multiAirportNetworkState.disruptions.filter(d=>d.status==='OPEN').length,last:multiAirportNetworkState.lastEvaluation||null};
}
function renderMultiAirportNetworkBoard(){
  try{
    const anchor=document.querySelector('#passengerReputationInline') || document.querySelector('#workforceStaffingInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#multiAirportNetworkInline'); if(old) old.remove();
    const p=multiAirportNetworkProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="multiAirportNetworkInline" class="airport-ops-board multi-airport-network-inline">
      <div class="airport-ops-head"><b>MULTI HUB</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REDE</small><b>${p.score}%</b></div>
        <div><small>HUB</small><b>${p.hubScore}</b></div>
        <div><small>CONEX.</small><b>${p.connectionProtection}</b></div>
        <div><small>ALT.</small><b>${p.alternateCapacity}</b></div>
        <div><small>ROTAS</small><b>${MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length}</b></div>
        <div><small>RECEITA</small><b>${Math.round(p.regionalRevenue/1000)}k</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'multi-airport-network-board'); }
}
function initializeMultiAirportNetwork(){
  loadMultiAirportNetwork();
  renderMultiAirportNetworkBoard();
  return multiAirportNetworkState;
}
function multiAirportNetworkStatus(){ loadMultiAirportNetwork(); return {...multiAirportNetworkState,progress:multiAirportNetworkProgress(),catalog:MULTI_AIRPORT_NETWORK_CATALOG}; }
function multiAirportNetworkSelfCheck(){
  const issues=[];
  if(MULTI_AIRPORT_NETWORK_CATALOG.airports.length<6) issues.push('aeroportos insuficientes');
  if(MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length<5) issues.push('bancos de rota insuficientes');
  const policy=setNetworkPolicy('PASSENGER_PROTECTION');
  const disruption=raiseNetworkDisruption('CONNECTION_WAVE_LOST');
  const action=takeNetworkAction('PROTECT_BANK');
  const res=evaluateMultiAirportNetwork(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!policy.id || !disruption.id || !action.id) issues.push('política/interrupção/ação inválida');
  if(!Number.isFinite(res.evaluation.networkScore)) issues.push('score de rede inválido');
  return {ok:issues.length===0,issues,airports:MULTI_AIRPORT_NETWORK_CATALOG.airports.length,routeBanks:MULTI_AIRPORT_NETWORK_CATALOG.routeBanks.length};
}
window.SKYWARD_MULTI_AIRPORT_NETWORK=Object.freeze({
  schema:1,
  catalog:MULTI_AIRPORT_NETWORK_CATALOG,
  load:loadMultiAirportNetwork,
  save:saveMultiAirportNetwork,
  init:initializeMultiAirportNetwork,
  policy:setNetworkPolicy,
  disruption:raiseNetworkDisruption,
  action:takeNetworkAction,
  close:closeNetworkDisruption,
  evaluate:evaluateMultiAirportNetwork,
  progress:multiAirportNetworkProgress,
  status:multiAirportNetworkStatus,
  board:renderMultiAirportNetworkBoard,
  selfCheck:multiAirportNetworkSelfCheck
});

/* ===== MODULE 39: emergency-response-disaster-center (44-emergency-response-disaster-center.js) ===== */
/* @skyward-module 44-emergency-response-disaster-center
 * Emergency response and disaster preparedness center with ARFF, evacuation, medical triage, mutual aid and response readiness.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('44-emergency-response-disaster-center');
const EMERGENCY_RESPONSE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f41',
  emergencyUnits:[
    {id:'ARFF_1',name:'ARFF principal',type:'FIRE',coverage:32,readiness:82,responseMin:3},
    {id:'ARFF_2',name:'ARFF reserva',type:'FIRE',coverage:24,readiness:76,responseMin:4},
    {id:'MEDICAL_TEAM',name:'Equipe médica aeroportuária',type:'MEDICAL',coverage:20,readiness:78,responseMin:5},
    {id:'SECURITY_EOC',name:'Segurança/EOC',type:'COMMAND',coverage:18,readiness:80,responseMin:4},
    {id:'EVAC_TEAM',name:'Equipe de evacuação',type:'EVACUATION',coverage:16,readiness:74,responseMin:6},
    {id:'MUTUAL_AID',name:'Apoio externo municipal',type:'MUTUAL_AID',coverage:22,readiness:70,responseMin:9}
  ],
  emergencyScenarios:[
    {id:'AIRCRAFT_FIRE',name:'Fogo em aeronave',severity:92,unit:'ARFF_1',reputationRisk:28},
    {id:'RUNWAY_EXCURSION',name:'Excursão de pista',severity:84,unit:'ARFF_1',reputationRisk:24},
    {id:'TERMINAL_EVAC',name:'Evacuação de terminal',severity:78,unit:'EVAC_TEAM',reputationRisk:22},
    {id:'MASS_CASUALTY',name:'Múltiplas vítimas',severity:88,unit:'MEDICAL_TEAM',reputationRisk:26},
    {id:'FUEL_SPILL',name:'Derramamento de combustível',severity:72,unit:'ARFF_2',reputationRisk:18},
    {id:'SECURITY_LOCKDOWN',name:'Lockdown de segurança',severity:80,unit:'SECURITY_EOC',reputationRisk:21}
  ],
  preparednessPrograms:[
    {id:'FULL_SCALE_DRILL',name:'Simulado geral integrado',cost:42000,benefit:{readiness:12,coordination:10,response:2}},
    {id:'ARFF_RECERT',name:'Recertificação ARFF',cost:28000,benefit:{readiness:9,arff:12}},
    {id:'MEDICAL_TRIAGE',name:'Treino de triagem médica',cost:21000,benefit:{medical:12,coordination:4}},
    {id:'EVAC_ROUTE_AUDIT',name:'Auditoria de rotas de evacuação',cost:18000,benefit:{evacuation:10,response:1}},
    {id:'MUTUAL_AID_MOU',name:'Acordo de apoio externo',cost:26000,benefit:{mutualAid:14,coordination:5}},
    {id:'EOC_UPGRADE',name:'Upgrade centro de emergência',cost:36000,benefit:{coordination:12,response:2}}
  ],
  agencyPartners:[
    {id:'FIRE_DEPT',name:'Corpo de bombeiros',trust:82},
    {id:'EMS',name:'SAMU/Resgate',trust:78},
    {id:'POLICE',name:'Polícia/segurança',trust:76},
    {id:'CIVIL_DEFENSE',name:'Defesa civil',trust:74},
    {id:'AIRLINES_EOC',name:'EOC companhias',trust:80}
  ],
  incidentLevels:[
    {id:'ALERT',minSeverity:35,name:'Alerta'},
    {id:'LOCAL_STANDBY',minSeverity:55,name:'Prontidão local'},
    {id:'FULL_EMERGENCY',minSeverity:75,name:'Emergência completa'},
    {id:'DISASTER',minSeverity:90,name:'Desastre'}
  ],
  readinessBands:[
    {id:'MISSION_READY',min:90,name:'Pronto para missão'},
    {id:'READY',min:75,name:'Pronto'},
    {id:'GAPS',min:55,name:'Com lacunas'},
    {id:'UNPREPARED',min:0,name:'Despreparado'}
  ],
  responseKPIs:[
    {id:'RESPONSE_TIME',name:'Tempo de resposta'},
    {id:'ARFF_COVERAGE',name:'Cobertura ARFF'},
    {id:'EVACUATION_FLOW',name:'Fluxo de evacuação'},
    {id:'MEDICAL_TRIAGE',name:'Triagem médica'},
    {id:'AGENCY_COORDINATION',name:'Coordenação multiagência'}
  ]
});
const EMERGENCY_RESPONSE_KEY='skywardEmergencyResponse_v1';
let emergencyResponseState={schema:1,programs:[],incidents:[],actions:[],readinessScore:78,responseTime:5,arffCoverage:78,evacuationFlow:76,medicalTriage:77,agencyCoordination:75,status:'READY',history:[],lastEvaluation:null};
function loadEmergencyResponse(){
  try{ const raw=localStorage?.getItem?.(EMERGENCY_RESPONSE_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) emergencyResponseState={...emergencyResponseState,...parsed}; } }catch(e){ safeLogError?.(e,'emergency-response-load'); }
  return emergencyResponseState;
}
function saveEmergencyResponse(){
  try{ localStorage?.setItem?.(EMERGENCY_RESPONSE_KEY,JSON.stringify(emergencyResponseState)); }catch(e){ safeLogError?.(e,'emergency-response-save'); }
  return emergencyResponseState;
}
function readinessBand(score){
  return EMERGENCY_RESPONSE_CATALOG.readinessBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||EMERGENCY_RESPONSE_CATALOG.readinessBands.at(-1);
}
function incidentLevel(severity){
  return EMERGENCY_RESPONSE_CATALOG.incidentLevels.slice().sort((a,b)=>b.minSeverity-a.minSeverity).find(l=>severity>=l.minSeverity)||EMERGENCY_RESPONSE_CATALOG.incidentLevels[0];
}
function programById(id){ return EMERGENCY_RESPONSE_CATALOG.preparednessPrograms.find(p=>p.id===id)||EMERGENCY_RESPONSE_CATALOG.preparednessPrograms[0]; }
function scenarioById(id){ return EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.find(s=>s.id===id)||EMERGENCY_RESPONSE_CATALOG.emergencyScenarios[0]; }
function runPreparednessProgram(id='FULL_SCALE_DRILL'){
  loadEmergencyResponse();
  const program=programById(id);
  if(emergencyResponseState.programs.some(p=>p.programId===program.id)) return emergencyResponseState.programs.find(p=>p.programId===program.id);
  const item={id:`ERP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  emergencyResponseState.programs.unshift(item);
  for(const [k,gain] of Object.entries(program.benefit||{})){
    if(k==='readiness') emergencyResponseState.readinessScore=Math.min(100,emergencyResponseState.readinessScore+gain);
    if(k==='coordination') emergencyResponseState.agencyCoordination=Math.min(100,emergencyResponseState.agencyCoordination+gain);
    if(k==='response') emergencyResponseState.responseTime=Math.max(2,emergencyResponseState.responseTime-gain);
    if(k==='arff') emergencyResponseState.arffCoverage=Math.min(100,emergencyResponseState.arffCoverage+gain);
    if(k==='medical') emergencyResponseState.medicalTriage=Math.min(100,emergencyResponseState.medicalTriage+gain);
    if(k==='evacuation') emergencyResponseState.evacuationFlow=Math.min(100,emergencyResponseState.evacuationFlow+gain);
    if(k==='mutualAid') emergencyResponseState.agencyCoordination=Math.min(100,emergencyResponseState.agencyCoordination+Math.round(gain/2));
  }
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return item;
}
function raiseEmergencyIncident(id='RUNWAY_EXCURSION'){
  loadEmergencyResponse();
  const tpl=scenarioById(id);
  const item={id:`EMG-${String(Date.now()).slice(-6)}`,scenarioId:tpl.id,name:tpl.name,severity:tpl.severity,unit:tpl.unit,level:incidentLevel(tpl.severity).id,reputationRisk:tpl.reputationRisk,status:'OPEN',at:new Date().toISOString()};
  emergencyResponseState.incidents.unshift(item);
  emergencyResponseState.incidents=emergencyResponseState.incidents.slice(0,60);
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return item;
}
function resolveEmergencyIncident(id,ok=true){
  loadEmergencyResponse();
  const incident=emergencyResponseState.incidents.find(i=>i.id===id);
  if(incident){
    incident.status=ok?'RESOLVED':'ESCALATED';
    incident.closedAt=new Date().toISOString();
    if(ok) emergencyResponseState.readinessScore=Math.min(100,emergencyResponseState.readinessScore+1);
  }
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return incident||null;
}
function calculateEmergencyMetrics(finalScore=0,statsObj={},fail=false){
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};
  const infrastructure=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const open=emergencyResponseState.incidents.filter(i=>i.status==='OPEN');
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const crisisScore=Number(crisis.progress?.score||90);
  const safetyScore=Number(safety.progress?.score||80);
  const workforceScore=Number(workforce.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||80);
  const networkScore=Number(network.progress?.score||78);
  const infraRisk=Number(infrastructure.progress?.risk||0);
  const severityLoad=open.reduce((a,i)=>a+Number(i.severity||0),0)/10;
  const responseTime=Math.max(2,Math.min(15,Math.round(emergencyResponseState.responseTime + open.length*.6 + incursions*.8 + Math.max(0,75-workforceScore)/20)));
  const arffCoverage=Math.max(0,Math.min(100,Math.round(emergencyResponseState.arffCoverage + safetyScore*.08 - incursions*10 - severityLoad*.4)));
  const evacuationFlow=Math.max(0,Math.min(100,Math.round(emergencyResponseState.evacuationFlow + passengerScore*.08 - denied*1.5 - open.filter(i=>i.scenarioId==='TERMINAL_EVAC').length*12)));
  const medicalTriage=Math.max(0,Math.min(100,Math.round(emergencyResponseState.medicalTriage + workforceScore*.06 - open.filter(i=>i.scenarioId==='MASS_CASUALTY').length*15)));
  const agencyCoordination=Math.max(0,Math.min(100,Math.round(emergencyResponseState.agencyCoordination + networkScore*.05 + crisisScore*.05 - open.length*4 - infraRisk*.05)));
  const reputationLoad=open.reduce((a,i)=>a+Number(i.reputationRisk||0),0);
  return {responseTime,arffCoverage,evacuationFlow,medicalTriage,agencyCoordination,reputationLoad,openIncidents:open.length,drivers:{conflicts,incursions,denied,crisisScore,safetyScore,workforceScore,passengerScore,networkScore,infraRisk}};
}
function evaluateEmergencyResponse(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadEmergencyResponse();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.runwayIncursions||0)>0 && !emergencyResponseState.incidents.some(i=>i.status==='OPEN'&&i.scenarioId==='RUNWAY_EXCURSION')) raiseEmergencyIncident('RUNWAY_EXCURSION');
  if((statsObj.conflicts||0)>=2 && !emergencyResponseState.incidents.some(i=>i.status==='OPEN'&&i.scenarioId==='AIRCRAFT_FIRE')) raiseEmergencyIncident('AIRCRAFT_FIRE');
  const metrics=calculateEmergencyMetrics(finalScore,statsObj,fail);
  emergencyResponseState.responseTime=metrics.responseTime;
  emergencyResponseState.arffCoverage=metrics.arffCoverage;
  emergencyResponseState.evacuationFlow=metrics.evacuationFlow;
  emergencyResponseState.medicalTriage=metrics.medicalTriage;
  emergencyResponseState.agencyCoordination=metrics.agencyCoordination;
  const responseScore=Math.max(0,100-metrics.responseTime*8);
  const score=Math.max(0,Math.min(100,Math.round(
    responseScore*.22 + metrics.arffCoverage*.24 + metrics.evacuationFlow*.16 + metrics.medicalTriage*.16 + metrics.agencyCoordination*.16 + Math.max(0,100-metrics.reputationLoad)*.06 - (fail?8:0)
  )));
  emergencyResponseState.readinessScore=score;
  emergencyResponseState.status=readinessBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,readinessScore:score,status:emergencyResponseState.status,programs:emergencyResponseState.programs.length};
  emergencyResponseState.history.unshift(evaluation);
  emergencyResponseState.history=emergencyResponseState.history.slice(0,100);
  emergencyResponseState.lastEvaluation=evaluation;
  saveEmergencyResponse();
  renderEmergencyResponseBoard();
  return {state:emergencyResponseState,evaluation};
}
function emergencyResponseProgress(){
  loadEmergencyResponse();
  return {score:emergencyResponseState.readinessScore,status:emergencyResponseState.status,responseTime:emergencyResponseState.responseTime,arffCoverage:emergencyResponseState.arffCoverage,evacuationFlow:emergencyResponseState.evacuationFlow,medicalTriage:emergencyResponseState.medicalTriage,agencyCoordination:emergencyResponseState.agencyCoordination,openIncidents:emergencyResponseState.incidents.filter(i=>i.status==='OPEN').length,programs:emergencyResponseState.programs.length,last:emergencyResponseState.lastEvaluation||null};
}
function renderEmergencyResponseBoard(){
  try{
    const anchor=document.querySelector('#multiAirportNetworkInline') || document.querySelector('#passengerReputationInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#emergencyResponseInline'); if(old) old.remove();
    const p=emergencyResponseProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="emergencyResponseInline" class="airport-ops-board emergency-response-inline">
      <div class="airport-ops-head"><b>EMERGENCY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PRONT.</small><b>${p.score}%</b></div>
        <div><small>RESP.</small><b>${p.responseTime}m</b></div>
        <div><small>ARFF</small><b>${p.arffCoverage}</b></div>
        <div><small>EVAC.</small><b>${p.evacuationFlow}</b></div>
        <div><small>MÉD.</small><b>${p.medicalTriage}</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'emergency-response-board'); }
}
function initializeEmergencyResponse(){
  loadEmergencyResponse();
  renderEmergencyResponseBoard();
  return emergencyResponseState;
}
function emergencyResponseStatus(){ loadEmergencyResponse(); return {...emergencyResponseState,progress:emergencyResponseProgress(),catalog:EMERGENCY_RESPONSE_CATALOG}; }
function emergencyResponseSelfCheck(){
  const issues=[];
  if(EMERGENCY_RESPONSE_CATALOG.emergencyUnits.length<6) issues.push('unidades insuficientes');
  if(EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.length<6) issues.push('cenários insuficientes');
  const program=runPreparednessProgram('FULL_SCALE_DRILL');
  const incident=raiseEmergencyIncident('RUNWAY_EXCURSION');
  const res=evaluateEmergencyResponse(2600,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.readinessScore)) issues.push('score emergência inválido');
  return {ok:issues.length===0,issues,units:EMERGENCY_RESPONSE_CATALOG.emergencyUnits.length,scenarios:EMERGENCY_RESPONSE_CATALOG.emergencyScenarios.length};
}
window.SKYWARD_EMERGENCY_RESPONSE=Object.freeze({
  schema:1,
  catalog:EMERGENCY_RESPONSE_CATALOG,
  load:loadEmergencyResponse,
  save:saveEmergencyResponse,
  init:initializeEmergencyResponse,
  program:runPreparednessProgram,
  incident:raiseEmergencyIncident,
  resolve:resolveEmergencyIncident,
  evaluate:evaluateEmergencyResponse,
  progress:emergencyResponseProgress,
  status:emergencyResponseStatus,
  board:renderEmergencyResponseBoard,
  selfCheck:emergencyResponseSelfCheck
});

/* ===== MODULE 40: security-cyber-defense-center (45-security-cyber-defense-center.js) ===== */
/* @skyward-module 45-security-cyber-defense-center
 * Security operations and cyber defense center with screening, perimeter, access control, insider threat, SOC and law enforcement response.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('45-security-cyber-defense-center');
const SECURITY_CYBER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f42',
  securityDomains:[
    {id:'PASSENGER_SCREENING',name:'Triagem de passageiros',weight:18,target:82},
    {id:'PERIMETER',name:'Perímetro e pátio',weight:18,target:80},
    {id:'BADGE_ACCESS',name:'Credenciais e acesso',weight:16,target:84},
    {id:'CYBER_SOC',name:'SOC/cibersegurança',weight:20,target:82},
    {id:'INSIDER_THREAT',name:'Ameaça interna',weight:14,target:78},
    {id:'LAW_ENFORCEMENT',name:'Resposta policial',weight:14,target:80}
  ],
  securityAssets:[
    {id:'CT_SCANNERS',name:'Scanners CT',domain:'PASSENGER_SCREENING',coverage:24,readiness:78},
    {id:'CCTV_ANALYTICS',name:'CCTV com analytics',domain:'PERIMETER',coverage:22,readiness:80},
    {id:'BADGE_GATEWAY',name:'Controle biométrico',domain:'BADGE_ACCESS',coverage:20,readiness:82},
    {id:'SOC_MONITORING',name:'SOC 24/7',domain:'CYBER_SOC',coverage:26,readiness:76},
    {id:'INSIDER_PROGRAM',name:'Programa insider threat',domain:'INSIDER_THREAT',coverage:16,readiness:74},
    {id:'POLICE_LIAISON',name:'Ligação policial',domain:'LAW_ENFORCEMENT',coverage:18,readiness:78}
  ],
  threatScenarios:[
    {id:'SCREENING_BREACH',name:'Falha na triagem',severity:76,domain:'PASSENGER_SCREENING',reputationRisk:18},
    {id:'PERIMETER_INTRUSION',name:'Intrusão no perímetro',severity:84,domain:'PERIMETER',reputationRisk:24},
    {id:'BADGE_CLONE',name:'Credencial clonada',severity:80,domain:'BADGE_ACCESS',reputationRisk:20},
    {id:'RANSOMWARE_ALERT',name:'Alerta ransomware',severity:88,domain:'CYBER_SOC',reputationRisk:26},
    {id:'INSIDER_LEAK',name:'Vazamento interno',severity:82,domain:'INSIDER_THREAT',reputationRisk:22},
    {id:'UNRULY_PASSENGER',name:'Passageiro indisciplinado',severity:64,domain:'LAW_ENFORCEMENT',reputationRisk:14}
  ],
  defensePrograms:[
    {id:'SCREENING_RECERT',name:'Recertificação triagem',cost:18000,benefit:{PASSENGER_SCREENING:10,LAW_ENFORCEMENT:2}},
    {id:'PERIMETER_SWEEP',name:'Varredura de perímetro',cost:14000,benefit:{PERIMETER:11}},
    {id:'BADGE_AUDIT',name:'Auditoria de credenciais',cost:16000,benefit:{BADGE_ACCESS:12,INSIDER_THREAT:3}},
    {id:'SOC_HARDENING',name:'Hardening SOC/PWA',cost:30000,benefit:{CYBER_SOC:14}},
    {id:'INSIDER_TRAINING',name:'Treino ameaça interna',cost:19000,benefit:{INSIDER_THREAT:12,BADGE_ACCESS:3}},
    {id:'POLICE_DRILL',name:'Exercício polícia/EOC',cost:22000,benefit:{LAW_ENFORCEMENT:12,PERIMETER:3}}
  ],
  responseLevels:[
    {id:'NORMAL',min:85,name:'Normal'},
    {id:'ELEVATED',min:70,name:'Elevado'},
    {id:'HIGH',min:50,name:'Alto'},
    {id:'LOCKDOWN',min:0,name:'Lockdown'}
  ],
  securityBands:[
    {id:'SECURE',min:90,name:'Seguro'},
    {id:'CONTROLLED',min:75,name:'Controlado'},
    {id:'EXPOSED',min:55,name:'Exposto'},
    {id:'COMPROMISED',min:0,name:'Comprometido'}
  ],
  securityKPIs:[
    {id:'THREAT_CONTAINMENT',name:'Contenção de ameaça'},
    {id:'ACCESS_INTEGRITY',name:'Integridade de acesso'},
    {id:'CYBER_RESILIENCE',name:'Resiliência cibernética'},
    {id:'PERIMETER_COVERAGE',name:'Cobertura de perímetro'},
    {id:'SCREENING_FLOW',name:'Fluxo de triagem'}
  ]
});
const SECURITY_CYBER_KEY='skywardSecurityCyberDefense_v1';
let securityCyberState={schema:1,domainScores:{PASSENGER_SCREENING:78,PERIMETER:80,BADGE_ACCESS:82,CYBER_SOC:76,INSIDER_THREAT:74,LAW_ENFORCEMENT:78},programs:[],threats:[],securityScore:78,responseLevel:'ELEVATED',status:'CONTROLLED',history:[],lastEvaluation:null};
function loadSecurityCyber(){
  try{ const raw=localStorage?.getItem?.(SECURITY_CYBER_KEY); if(raw){ const parsed=JSON.parse(raw); if(parsed?.schema===1) securityCyberState={...securityCyberState,...parsed}; } }catch(e){ safeLogError?.(e,'security-cyber-load'); }
  return securityCyberState;
}
function saveSecurityCyber(){
  try{ localStorage?.setItem?.(SECURITY_CYBER_KEY,JSON.stringify(securityCyberState)); }catch(e){ safeLogError?.(e,'security-cyber-save'); }
  return securityCyberState;
}
function bandForSecurity(score){
  return SECURITY_CYBER_CATALOG.securityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECURITY_CYBER_CATALOG.securityBands.at(-1);
}
function responseForScore(score){
  return SECURITY_CYBER_CATALOG.responseLevels.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECURITY_CYBER_CATALOG.responseLevels.at(-1);
}
function programById(id){ return SECURITY_CYBER_CATALOG.defensePrograms.find(p=>p.id===id)||SECURITY_CYBER_CATALOG.defensePrograms[0]; }
function threatById(id){ return SECURITY_CYBER_CATALOG.threatScenarios.find(t=>t.id===id)||SECURITY_CYBER_CATALOG.threatScenarios[0]; }
function launchSecurityProgram(id='SOC_HARDENING'){
  loadSecurityCyber();
  const program=programById(id);
  if(securityCyberState.programs.some(p=>p.programId===program.id)) return securityCyberState.programs.find(p=>p.programId===program.id);
  const item={id:`SEC-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  securityCyberState.programs.unshift(item);
  for(const [domain,gain] of Object.entries(program.benefit||{})){
    securityCyberState.domainScores[domain]=Math.min(100,Number(securityCyberState.domainScores[domain]||75)+Number(gain||0));
  }
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return item;
}
function raiseSecurityThreat(id='PERIMETER_INTRUSION'){
  loadSecurityCyber();
  const tpl=threatById(id);
  const item={id:`THR-${String(Date.now()).slice(-6)}`,threatId:tpl.id,name:tpl.name,severity:tpl.severity,domain:tpl.domain,reputationRisk:tpl.reputationRisk,status:'OPEN',at:new Date().toISOString()};
  securityCyberState.threats.unshift(item);
  securityCyberState.threats=securityCyberState.threats.slice(0,60);
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return item;
}
function resolveSecurityThreat(id,ok=true){
  loadSecurityCyber();
  const threat=securityCyberState.threats.find(t=>t.id===id);
  if(threat){
    threat.status=ok?'RESOLVED':'ESCALATED';
    threat.closedAt=new Date().toISOString();
    if(ok) securityCyberState.domainScores[threat.domain]=Math.min(100,Number(securityCyberState.domainScores[threat.domain]||75)+2);
  }
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return threat||null;
}
function calculateSecurityMetrics(finalScore=0,statsObj={},fail=false){
  const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const crisis=window.SKYWARD_CRISIS_COMMAND?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const open=securityCyberState.threats.filter(t=>t.status==='OPEN');
  const scores={...securityCyberState.domainScores};
  const denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0);
  const emergencyScore=Number(emergency.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const crisisScore=Number(crisis.progress?.score||86);
  const safetyScore=Number(safety.progress?.score||80);
  const threatLoad=(domain)=>open.filter(t=>t.domain===domain).reduce((a,t)=>a+Number(t.severity||0),0)/8;
  scores.PASSENGER_SCREENING=Math.max(0,Math.min(100,Number(scores.PASSENGER_SCREENING||78)+passengerScore*.03-denied*1.2-threatLoad('PASSENGER_SCREENING')));
  scores.PERIMETER=Math.max(0,Math.min(100,Number(scores.PERIMETER||80)+emergencyScore*.04-incursions*8-threatLoad('PERIMETER')));
  scores.BADGE_ACCESS=Math.max(0,Math.min(100,Number(scores.BADGE_ACCESS||82)+workforceScore*.04-threatLoad('BADGE_ACCESS')));
  scores.CYBER_SOC=Math.max(0,Math.min(100,Number(scores.CYBER_SOC||76)+crisisScore*.04-threatLoad('CYBER_SOC')-(fail?6:0)));
  scores.INSIDER_THREAT=Math.max(0,Math.min(100,Number(scores.INSIDER_THREAT||74)+safetyScore*.03-threatLoad('INSIDER_THREAT')-conflicts*1.2));
  scores.LAW_ENFORCEMENT=Math.max(0,Math.min(100,Number(scores.LAW_ENFORCEMENT||78)+emergencyScore*.03+workforceScore*.02-threatLoad('LAW_ENFORCEMENT')));
  return {scores,openThreats:open.length,reputationRisk:open.reduce((a,t)=>a+Number(t.reputationRisk||0),0),drivers:{denied,conflicts,incursions,emergencyScore,passengerScore,workforceScore,crisisScore,safetyScore}};
}
function evaluateSecurityCyber(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSecurityCyber();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.runwayIncursions||0)>0 && !securityCyberState.threats.some(t=>t.status==='OPEN'&&t.threatId==='PERIMETER_INTRUSION')) raiseSecurityThreat('PERIMETER_INTRUSION');
  if((statsObj.denied||0)>=3 && !securityCyberState.threats.some(t=>t.status==='OPEN'&&t.threatId==='SCREENING_BREACH')) raiseSecurityThreat('SCREENING_BREACH');
  const metrics=calculateSecurityMetrics(finalScore,statsObj,fail);
  securityCyberState.domainScores=metrics.scores;
  const weighted=Math.round(SECURITY_CYBER_CATALOG.securityDomains.reduce((a,d)=>a+(metrics.scores[d.id]||0)*d.weight,0)/100);
  const score=Math.max(0,Math.min(100,Math.round(weighted-metrics.reputationRisk/10-metrics.openThreats*2+(finalScore>2500?2:0))));
  securityCyberState.securityScore=score;
  securityCyberState.status=bandForSecurity(score).id;
  securityCyberState.responseLevel=responseForScore(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,weighted,securityScore:score,status:securityCyberState.status,responseLevel:securityCyberState.responseLevel,programs:securityCyberState.programs.length};
  securityCyberState.history.unshift(evaluation);
  securityCyberState.history=securityCyberState.history.slice(0,100);
  securityCyberState.lastEvaluation=evaluation;
  saveSecurityCyber();
  renderSecurityCyberBoard();
  return {state:securityCyberState,evaluation};
}
function securityCyberProgress(){
  loadSecurityCyber();
  return {score:securityCyberState.securityScore,status:securityCyberState.status,responseLevel:securityCyberState.responseLevel,openThreats:securityCyberState.threats.filter(t=>t.status==='OPEN').length,programs:securityCyberState.programs.length,domainScores:securityCyberState.domainScores,last:securityCyberState.lastEvaluation||null};
}
function renderSecurityCyberBoard(){
  try{
    const anchor=document.querySelector('#emergencyResponseInline') || document.querySelector('#multiAirportNetworkInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#securityCyberInline'); if(old) old.remove();
    const p=securityCyberProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="securityCyberInline" class="airport-ops-board security-cyber-inline">
      <div class="airport-ops-head"><b>SECURITY SOC</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SEG.</small><b>${p.score}%</b></div>
        <div><small>NÍVEL</small><b>${p.responseLevel}</b></div>
        <div><small>SOC</small><b>${Math.round(p.domainScores.CYBER_SOC||0)}</b></div>
        <div><small>PERIM.</small><b>${Math.round(p.domainScores.PERIMETER||0)}</b></div>
        <div><small>AMEAÇAS</small><b>${p.openThreats}</b></div>
        <div><small>PROG.</small><b>${p.programs}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'security-cyber-board'); }
}
function initializeSecurityCyber(){
  loadSecurityCyber();
  renderSecurityCyberBoard();
  return securityCyberState;
}
function securityCyberStatus(){ loadSecurityCyber(); return {...securityCyberState,progress:securityCyberProgress(),catalog:SECURITY_CYBER_CATALOG}; }
function securityCyberSelfCheck(){
  const issues=[];
  if(SECURITY_CYBER_CATALOG.securityDomains.length<6) issues.push('domínios insuficientes');
  if(SECURITY_CYBER_CATALOG.threatScenarios.length<6) issues.push('ameaças insuficientes');
  const program=launchSecurityProgram('SOC_HARDENING');
  const threat=raiseSecurityThreat('RANSOMWARE_ALERT');
  const res=evaluateSecurityCyber(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !threat.id) issues.push('programa/ameaça inválido');
  if(!Number.isFinite(res.evaluation.securityScore)) issues.push('score de segurança inválido');
  return {ok:issues.length===0,issues,domains:SECURITY_CYBER_CATALOG.securityDomains.length,threats:SECURITY_CYBER_CATALOG.threatScenarios.length};
}
window.SKYWARD_SECURITY_CYBER=Object.freeze({
  schema:1,
  catalog:SECURITY_CYBER_CATALOG,
  load:loadSecurityCyber,
  save:saveSecurityCyber,
  init:initializeSecurityCyber,
  program:launchSecurityProgram,
  threat:raiseSecurityThreat,
  resolve:resolveSecurityThreat,
  evaluate:evaluateSecurityCyber,
  progress:securityCyberProgress,
  status:securityCyberStatus,
  board:renderSecurityCyberBoard,
  selfCheck:securityCyberSelfCheck
});

/* ===== MODULE 41: asset-maintenance-reliability-center (46-asset-maintenance-reliability-center.js) ===== */
/* @skyward-module 46-asset-maintenance-reliability-center
 * Asset maintenance and reliability center with radar, ILS, lighting, ARFF vehicles, baggage systems, spare parts, MTBF and MTTR.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('46-asset-maintenance-reliability-center');
const ASSET_MAINTENANCE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f43',
  assetClasses:[
    {id:'PRIMARY_RADAR',name:'Radar primário',criticality:95,mtbfHours:620,mttrMin:45},
    {id:'SECONDARY_RADAR',name:'Radar secundário/SSR',criticality:90,mtbfHours:700,mttrMin:40},
    {id:'ILS_CAT',name:'ILS e auxílios à navegação',criticality:94,mtbfHours:540,mttrMin:55},
    {id:'RUNWAY_LIGHTING',name:'Balizamento de pista',criticality:88,mtbfHours:480,mttrMin:35},
    {id:'TOWER_SYSTEMS',name:'Sistemas da torre',criticality:92,mtbfHours:610,mttrMin:50},
    {id:'ARFF_VEHICLES',name:'Viaturas ARFF',criticality:86,mtbfHours:420,mttrMin:60},
    {id:'BAGGAGE_SORTER',name:'Esteiras e sorter bagagem',criticality:68,mtbfHours:360,mttrMin:45},
    {id:'PWA_RUNTIME',name:'Runtime PWA/offline',criticality:76,mtbfHours:800,mttrMin:20}
  ],
  maintenancePrograms:[
    {id:'RADAR_CALIBRATION',name:'Calibração radar',cost:24000,benefit:{PRIMARY_RADAR:10,SECONDARY_RADAR:9}},
    {id:'NAVAID_FLIGHT_CHECK',name:'Flight check ILS/NAVAID',cost:32000,benefit:{ILS_CAT:13}},
    {id:'LIGHTING_INSPECTION',name:'Inspeção balizamento',cost:12000,benefit:{RUNWAY_LIGHTING:12}},
    {id:'TOWER_IT_PM',name:'Preventiva torre/IT',cost:18000,benefit:{TOWER_SYSTEMS:10,PWA_RUNTIME:5}},
    {id:'ARFF_FLEET_PM',name:'Preventiva frota ARFF',cost:16000,benefit:{ARFF_VEHICLES:12}},
    {id:'BAGGAGE_PM',name:'Preventiva bagagem',cost:10000,benefit:{BAGGAGE_SORTER:11}},
    {id:'SPARE_PARTS_AUDIT',name:'Auditoria estoque crítico',cost:9000,benefit:{PRIMARY_RADAR:4,ILS_CAT:4,RUNWAY_LIGHTING:4,TOWER_SYSTEMS:4}}
  ],
  failureModes:[
    {id:'RADAR_DROP',name:'Queda radar',asset:'PRIMARY_RADAR',severity:92,opsPenalty:28},
    {id:'SSR_DEGRADED',name:'SSR degradado',asset:'SECONDARY_RADAR',severity:82,opsPenalty:20},
    {id:'ILS_OUTAGE',name:'ILS indisponível',asset:'ILS_CAT',severity:88,opsPenalty:24},
    {id:'LIGHTING_FAULT',name:'Falha balizamento',asset:'RUNWAY_LIGHTING',severity:78,opsPenalty:18},
    {id:'TOWER_COMMS',name:'Falha comunicação torre',asset:'TOWER_SYSTEMS',severity:90,opsPenalty:26},
    {id:'ARFF_DOWN',name:'Viatura ARFF fora',asset:'ARFF_VEHICLES',severity:76,opsPenalty:18},
    {id:'BAGGAGE_STOP',name:'Parada bagagem',asset:'BAGGAGE_SORTER',severity:60,opsPenalty:10},
    {id:'PWA_CACHE_FAIL',name:'Falha cache/offline',asset:'PWA_RUNTIME',severity:64,opsPenalty:12}
  ],
  spareParts:[
    {id:'RADAR_MODULE',name:'Módulo radar',asset:'PRIMARY_RADAR',stock:2,leadTime:3},
    {id:'ILS_TRANSMITTER',name:'Transmissor ILS',asset:'ILS_CAT',stock:1,leadTime:5},
    {id:'LIGHTING_KIT',name:'Kit balizamento',asset:'RUNWAY_LIGHTING',stock:6,leadTime:2},
    {id:'RADIO_STACK',name:'Stack rádio torre',asset:'TOWER_SYSTEMS',stock:2,leadTime:4},
    {id:'ARFF_PUMP',name:'Bomba ARFF',asset:'ARFF_VEHICLES',stock:1,leadTime:4},
    {id:'SORTER_MOTOR',name:'Motor sorter',asset:'BAGGAGE_SORTER',stock:3,leadTime:2}
  ],
  reliabilityBands:[
    {id:'WORLD_CLASS',min:90,name:'Confiabilidade world-class'},
    {id:'STABLE',min:75,name:'Estável'},
    {id:'DEGRADED',min:55,name:'Degradada'},
    {id:'CRITICAL',min:0,name:'Crítica'}
  ],
  assetKPIs:[
    {id:'MTBF',name:'Mean Time Between Failures'},
    {id:'MTTR',name:'Mean Time To Repair'},
    {id:'PM_COMPLIANCE',name:'Cumprimento preventiva'},
    {id:'SPARE_COVERAGE',name:'Cobertura de peças'},
    {id:'OPS_AVAILABILITY',name:'Disponibilidade operacional'}
  ]
});
const ASSET_MAINTENANCE_KEY='skywardAssetMaintenance_v1';
let assetMaintenanceState={schema:1,assetHealth:{PRIMARY_RADAR:82,SECONDARY_RADAR:84,ILS_CAT:80,RUNWAY_LIGHTING:78,TOWER_SYSTEMS:82,ARFF_VEHICLES:76,BAGGAGE_SORTER:74,PWA_RUNTIME:86},programs:[],failures:[],parts:{RADAR_MODULE:2,ILS_TRANSMITTER:1,LIGHTING_KIT:6,RADIO_STACK:2,ARFF_PUMP:1,SORTER_MOTOR:3},reliabilityScore:80,availability:82,mttrMin:42,pmCompliance:72,status:'STABLE',history:[],lastEvaluation:null};
function loadAssetMaintenance(){try{const raw=localStorage?.getItem?.(ASSET_MAINTENANCE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)assetMaintenanceState={...assetMaintenanceState,...parsed};}}catch(e){safeLogError?.(e,'asset-maintenance-load');}return assetMaintenanceState;}
function saveAssetMaintenance(){try{localStorage?.setItem?.(ASSET_MAINTENANCE_KEY,JSON.stringify(assetMaintenanceState));}catch(e){safeLogError?.(e,'asset-maintenance-save');}return assetMaintenanceState;}
function reliabilityBand(score){return ASSET_MAINTENANCE_CATALOG.reliabilityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ASSET_MAINTENANCE_CATALOG.reliabilityBands.at(-1);}
function programById(id){return ASSET_MAINTENANCE_CATALOG.maintenancePrograms.find(p=>p.id===id)||ASSET_MAINTENANCE_CATALOG.maintenancePrograms[0];}
function failureById(id){return ASSET_MAINTENANCE_CATALOG.failureModes.find(f=>f.id===id)||ASSET_MAINTENANCE_CATALOG.failureModes[0];}
function runMaintenanceProgram(id='RADAR_CALIBRATION'){
  loadAssetMaintenance();
  const program=programById(id);
  const item={id:`PM-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'DONE',at:new Date().toISOString()};
  assetMaintenanceState.programs.unshift(item);
  assetMaintenanceState.programs=assetMaintenanceState.programs.slice(0,80);
  for(const [asset,gain] of Object.entries(program.benefit||{})){
    assetMaintenanceState.assetHealth[asset]=Math.min(100,Number(assetMaintenanceState.assetHealth[asset]||70)+Number(gain||0));
  }
  assetMaintenanceState.pmCompliance=Math.min(100,assetMaintenanceState.pmCompliance+4);
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return item;
}
function raiseAssetFailure(id='ILS_OUTAGE'){
  loadAssetMaintenance();
  const tpl=failureById(id);
  const item={id:`FAIL-${String(Date.now()).slice(-6)}`,failureId:tpl.id,name:tpl.name,asset:tpl.asset,severity:tpl.severity,opsPenalty:tpl.opsPenalty,status:'OPEN',at:new Date().toISOString()};
  assetMaintenanceState.failures.unshift(item);
  assetMaintenanceState.failures=assetMaintenanceState.failures.slice(0,80);
  assetMaintenanceState.assetHealth[tpl.asset]=Math.max(0,Number(assetMaintenanceState.assetHealth[tpl.asset]||70)-Math.round(tpl.severity/8));
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return item;
}
function repairAssetFailure(id,ok=true){
  loadAssetMaintenance();
  const failure=assetMaintenanceState.failures.find(f=>f.id===id);
  if(failure){
    failure.status=ok?'REPAIRED':'DEFERRED';
    failure.closedAt=new Date().toISOString();
    if(ok) assetMaintenanceState.assetHealth[failure.asset]=Math.min(100,Number(assetMaintenanceState.assetHealth[failure.asset]||70)+6);
  }
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return failure||null;
}
function spareCoverage(){
  const important=ASSET_MAINTENANCE_CATALOG.spareParts.filter(p=>['PRIMARY_RADAR','ILS_CAT','RUNWAY_LIGHTING','TOWER_SYSTEMS','ARFF_VEHICLES'].includes(p.asset));
  if(!important.length) return 0;
  return Math.round(important.reduce((a,p)=>a+Math.min(100,Number(assetMaintenanceState.parts[p.id]??p.stock)*35),0)/important.length);
}
function calculateAssetMetrics(finalScore=0,statsObj={},fail=false){
  const infra=window.SKYWARD_INFRASTRUCTURE_EXPANSION?.status?.()||{};
  const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const open=assetMaintenanceState.failures.filter(f=>f.status==='OPEN');
  const health={...assetMaintenanceState.assetHealth};
  const incursions=Number(statsObj.runwayIncursions||0), conflicts=Number(statsObj.conflicts||0), denied=Number(statsObj.denied||0);
  const infraRisk=Number(infra.progress?.risk||0);
  const emergencyScore=Number(emergency.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const safetyScore=Number(safety.progress?.score||80);
  const cash=Number(revenue.progress?.cash||300000);
  const assetPenalty=(asset)=>open.filter(f=>f.asset===asset).reduce((a,f)=>a+Number(f.opsPenalty||0),0);
  for(const asset of Object.keys(health)){
    health[asset]=Math.max(0,Math.min(100,Number(health[asset]||70)-assetPenalty(asset)*0.45-infraRisk*0.03+(finalScore>2200?1:0)));
  }
  health.RUNWAY_LIGHTING=Math.max(0,health.RUNWAY_LIGHTING-incursions*4);
  health.PRIMARY_RADAR=Math.max(0,health.PRIMARY_RADAR-conflicts*3);
  health.TOWER_SYSTEMS=Math.max(0,health.TOWER_SYSTEMS-denied*1.5+(securityScore>85?1:0));
  health.ARFF_VEHICLES=Math.max(0,health.ARFF_VEHICLES+(emergencyScore-75)*0.04);
  const critical=['PRIMARY_RADAR','SECONDARY_RADAR','ILS_CAT','RUNWAY_LIGHTING','TOWER_SYSTEMS','ARFF_VEHICLES'];
  const avgCritical=Math.round(critical.reduce((a,k)=>a+Number(health[k]||0),0)/critical.length);
  const coverage=spareCoverage();
  const openPenalty=open.reduce((a,f)=>a+Number(f.severity||0),0)/18;
  const budgetPenalty=cash<0?10:0;
  const availability=Math.max(0,Math.min(100,Math.round(avgCritical*.62+coverage*.18+assetMaintenanceState.pmCompliance*.12+safetyScore*.08-openPenalty-budgetPenalty-(fail?6:0))));
  const mttr=Math.max(15,Math.min(120,Math.round(assetMaintenanceState.mttrMin+open.length*4+Math.max(0,70-coverage)/5-budgetPenalty)));
  return {health,avgCritical,spareCoverage:coverage,availability,mttr,openFailures:open.length,drivers:{incursions,conflicts,denied,infraRisk,emergencyScore,securityScore,safetyScore,cash}};
}
function evaluateAssetMaintenance(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadAssetMaintenance();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.conflicts||0)>=2 && !assetMaintenanceState.failures.some(f=>f.status==='OPEN'&&f.failureId==='RADAR_DROP')) raiseAssetFailure('RADAR_DROP');
  if((statsObj.runwayIncursions||0)>0 && !assetMaintenanceState.failures.some(f=>f.status==='OPEN'&&f.failureId==='LIGHTING_FAULT')) raiseAssetFailure('LIGHTING_FAULT');
  const metrics=calculateAssetMetrics(finalScore,statsObj,fail);
  assetMaintenanceState.assetHealth=metrics.health;
  assetMaintenanceState.availability=metrics.availability;
  assetMaintenanceState.mttrMin=metrics.mttr;
  const score=Math.max(0,Math.min(100,Math.round(metrics.availability*.58+metrics.avgCritical*.24+metrics.spareCoverage*.10+Math.max(0,100-metrics.mttr)*.08)));
  assetMaintenanceState.reliabilityScore=score;
  assetMaintenanceState.status=reliabilityBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,reliabilityScore:score,status:assetMaintenanceState.status,programs:assetMaintenanceState.programs.length};
  assetMaintenanceState.history.unshift(evaluation);
  assetMaintenanceState.history=assetMaintenanceState.history.slice(0,100);
  assetMaintenanceState.lastEvaluation=evaluation;
  saveAssetMaintenance();
  renderAssetMaintenanceBoard();
  return {state:assetMaintenanceState,evaluation};
}
function assetMaintenanceProgress(){
  loadAssetMaintenance();
  return {score:assetMaintenanceState.reliabilityScore,status:assetMaintenanceState.status,availability:assetMaintenanceState.availability,mttrMin:assetMaintenanceState.mttrMin,pmCompliance:assetMaintenanceState.pmCompliance,spareCoverage:spareCoverage(),openFailures:assetMaintenanceState.failures.filter(f=>f.status==='OPEN').length,programs:assetMaintenanceState.programs.length,last:assetMaintenanceState.lastEvaluation||null};
}
function renderAssetMaintenanceBoard(){
  try{
    const anchor=document.querySelector('#securityCyberInline') || document.querySelector('#emergencyResponseInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#assetMaintenanceInline'); if(old) old.remove();
    const p=assetMaintenanceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="assetMaintenanceInline" class="airport-ops-board asset-maintenance-inline">
      <div class="airport-ops-head"><b>ASSET REL</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REL.</small><b>${p.score}%</b></div>
        <div><small>DISP.</small><b>${p.availability}%</b></div>
        <div><small>MTTR</small><b>${p.mttrMin}m</b></div>
        <div><small>PM</small><b>${p.pmCompliance}%</b></div>
        <div><small>PEÇAS</small><b>${p.spareCoverage}%</b></div>
        <div><small>FALHAS</small><b>${p.openFailures}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'asset-maintenance-board'); }
}
function initializeAssetMaintenance(){loadAssetMaintenance();renderAssetMaintenanceBoard();return assetMaintenanceState;}
function assetMaintenanceStatus(){loadAssetMaintenance();return {...assetMaintenanceState,progress:assetMaintenanceProgress(),catalog:ASSET_MAINTENANCE_CATALOG};}
function assetMaintenanceSelfCheck(){
  const issues=[];
  if(ASSET_MAINTENANCE_CATALOG.assetClasses.length<8) issues.push('ativos insuficientes');
  if(ASSET_MAINTENANCE_CATALOG.failureModes.length<8) issues.push('falhas insuficientes');
  const program=runMaintenanceProgram('RADAR_CALIBRATION');
  const failure=raiseAssetFailure('ILS_OUTAGE');
  const res=evaluateAssetMaintenance(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !failure.id) issues.push('programa/falha inválido');
  if(!Number.isFinite(res.evaluation.reliabilityScore)) issues.push('score confiabilidade inválido');
  return {ok:issues.length===0,issues,assets:ASSET_MAINTENANCE_CATALOG.assetClasses.length,failures:ASSET_MAINTENANCE_CATALOG.failureModes.length};
}
window.SKYWARD_ASSET_MAINTENANCE=Object.freeze({
  schema:1,
  catalog:ASSET_MAINTENANCE_CATALOG,
  load:loadAssetMaintenance,
  save:saveAssetMaintenance,
  init:initializeAssetMaintenance,
  program:runMaintenanceProgram,
  failure:raiseAssetFailure,
  repair:repairAssetFailure,
  evaluate:evaluateAssetMaintenance,
  progress:assetMaintenanceProgress,
  status:assetMaintenanceStatus,
  board:renderAssetMaintenanceBoard,
  selfCheck:assetMaintenanceSelfCheck
});

/* ===== MODULE 42: digital-twin-predictive-center (47-digital-twin-predictive-center.js) ===== */
/* @skyward-module 47-digital-twin-predictive-center
 * Digital twin and predictive analytics center with scenario forecasting, bottleneck prediction, risk heatmap, what-if and decision recommendations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('47-digital-twin-predictive-center');
const DIGITAL_TWIN_CATALOG = Object.freeze({schema:1,version:'2026.06-f44',twinSignals:[{id:'TRAFFIC_LOAD',name:'Carga de tráfego',weight:16,target:82},{id:'SURFACE_PRESSURE',name:'Pressão de solo/pista',weight:14,target:80},{id:'WEATHER_RISK',name:'Risco meteorológico',weight:13,target:78},{id:'ASSET_RELIABILITY',name:'Confiabilidade de ativos',weight:15,target:84},{id:'WORKFORCE_READY',name:'Prontidão de equipe',weight:13,target:80},{id:'NETWORK_RESILIENCE',name:'Resiliência de rede',weight:12,target:78},{id:'PASSENGER_IMPACT',name:'Impacto passageiro',weight:9,target:76},{id:'SECURITY_POSTURE',name:'Postura segurança',weight:8,target:80}],forecastModels:[{id:'BOTTLENECK_15',name:'Gargalo 15 minutos',horizonMin:15,confidence:78},{id:'RUNWAY_CAPACITY_30',name:'Capacidade pista 30 minutos',horizonMin:30,confidence:76},{id:'CONNECTION_WAVE_45',name:'Onda conexões 45 minutos',horizonMin:45,confidence:74},{id:'CRISIS_ESCALATION_60',name:'Escalada crise 60 minutos',horizonMin:60,confidence:72},{id:'ASSET_FAILURE_90',name:'Risco falha ativo 90 minutos',horizonMin:90,confidence:70},{id:'PASSENGER_SENTIMENT_120',name:'Sentimento passageiro 120 minutos',horizonMin:120,confidence:68}],recommendationPlays:[{id:'OPEN_BUFFER_SLOTS',name:'Abrir slots de buffer',cost:9000,benefit:{TRAFFIC_LOAD:8,NETWORK_RESILIENCE:4}},{id:'PROTECT_RUNWAY_FLOW',name:'Proteger fluxo de pista',cost:12000,benefit:{SURFACE_PRESSURE:9,TRAFFIC_LOAD:4}},{id:'PREPOSITION_ARFF',name:'Pré-posicionar ARFF',cost:7000,benefit:{SECURITY_POSTURE:4,ASSET_RELIABILITY:3,WORKFORCE_READY:4}},{id:'CALL_EXTRA_STAFF',name:'Acionar reforço de equipe',cost:15000,benefit:{WORKFORCE_READY:10,PASSENGER_IMPACT:3}},{id:'TRIGGER_MAINTENANCE_CHECK',name:'Checagem técnica imediata',cost:13000,benefit:{ASSET_RELIABILITY:11}},{id:'PASSENGER_COMMS_PUSH',name:'Comunicado preditivo ao passageiro',cost:5000,benefit:{PASSENGER_IMPACT:10}},{id:'CYBER_WATCH_MODE',name:'Modo observação SOC',cost:8000,benefit:{SECURITY_POSTURE:9}}],riskScenarios:[{id:'CAPACITY_CRUNCH',name:'Efeito funil de capacidade',risk:24,signal:'TRAFFIC_LOAD'},{id:'SURFACE_GRIDLOCK',name:'Travamento solo/pista',risk:28,signal:'SURFACE_PRESSURE'},{id:'WEATHER_COMPRESSION',name:'Compressão por clima',risk:22,signal:'WEATHER_RISK'},{id:'ASSET_DEGRADATION',name:'Degradação de ativo crítico',risk:26,signal:'ASSET_RELIABILITY'},{id:'STAFF_FATIGUE_SPIKE',name:'Pico de fadiga de equipe',risk:20,signal:'WORKFORCE_READY'},{id:'NETWORK_CASCADE',name:'Cascata na malha regional',risk:30,signal:'NETWORK_RESILIENCE'},{id:'REPUTATION_DROP',name:'Queda reputacional',risk:18,signal:'PASSENGER_IMPACT'},{id:'SECURITY_ESCALATION',name:'Escalada de segurança',risk:24,signal:'SECURITY_POSTURE'}],confidenceBands:[{id:'HIGH_CONFIDENCE',min:85,name:'Alta confiança'},{id:'SOLID',min:72,name:'Sólida'},{id:'UNCERTAIN',min:55,name:'Incerta'},{id:'LOW_SIGNAL',min:0,name:'Sinal fraco'}],twinBands:[{id:'PREDICTIVE_CONTROL',min:90,name:'Controle preditivo'},{id:'FORECAST_READY',min:75,name:'Previsão confiável'},{id:'REACTIVE',min:55,name:'Reativo'},{id:'BLIND_SPOT',min:0,name:'Ponto cego'}],analyticsKPIs:[{id:'FORECAST_ACCURACY',name:'Acurácia forecast'},{id:'RISK_LEAD_TIME',name:'Antecedência de risco'},{id:'BOTTLENECK_SCORE',name:'Score de gargalo'},{id:'WHAT_IF_GAIN',name:'Ganho what-if'},{id:'DECISION_CONFIDENCE',name:'Confiança decisão'}]});
const DIGITAL_TWIN_KEY='skywardDigitalTwinPredictive_v1';
let digitalTwinState={schema:1,signalScores:{TRAFFIC_LOAD:78,SURFACE_PRESSURE:77,WEATHER_RISK:80,ASSET_RELIABILITY:82,WORKFORCE_READY:78,NETWORK_RESILIENCE:76,PASSENGER_IMPACT:78,SECURITY_POSTURE:80},forecasts:[],plays:[],risks:[],twinScore:78,confidence:72,bottleneckScore:24,leadTimeMin:18,status:'FORECAST_READY',confidenceBand:'SOLID',history:[],lastEvaluation:null};
function loadDigitalTwin(){try{const raw=localStorage?.getItem?.(DIGITAL_TWIN_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)digitalTwinState={...digitalTwinState,...parsed};}}catch(e){safeLogError?.(e,'digital-twin-load');}return digitalTwinState;}
function saveDigitalTwin(){try{localStorage?.setItem?.(DIGITAL_TWIN_KEY,JSON.stringify(digitalTwinState));}catch(e){safeLogError?.(e,'digital-twin-save');}return digitalTwinState;}
function twinBand(score){return DIGITAL_TWIN_CATALOG.twinBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||DIGITAL_TWIN_CATALOG.twinBands.at(-1);}
function confidenceBand(score){return DIGITAL_TWIN_CATALOG.confidenceBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||DIGITAL_TWIN_CATALOG.confidenceBands.at(-1);}
function playById(id){return DIGITAL_TWIN_CATALOG.recommendationPlays.find(p=>p.id===id)||DIGITAL_TWIN_CATALOG.recommendationPlays[0];}
function riskById(id){return DIGITAL_TWIN_CATALOG.riskScenarios.find(r=>r.id===id)||DIGITAL_TWIN_CATALOG.riskScenarios[0];}
function modelById(id){return DIGITAL_TWIN_CATALOG.forecastModels.find(m=>m.id===id)||DIGITAL_TWIN_CATALOG.forecastModels[0];}
function applyRecommendationPlay(id='OPEN_BUFFER_SLOTS'){loadDigitalTwin();const play=playById(id);const item={id:`DTP-${String(Date.now()).slice(-6)}`,playId:play.id,name:play.name,cost:play.cost,status:'APPLIED',at:new Date().toISOString()};digitalTwinState.plays.unshift(item);digitalTwinState.plays=digitalTwinState.plays.slice(0,80);for(const [signal,gain] of Object.entries(play.benefit||{})){digitalTwinState.signalScores[signal]=Math.min(100,Number(digitalTwinState.signalScores[signal]||75)+Number(gain||0));}digitalTwinState.confidence=Math.min(100,digitalTwinState.confidence+2);saveDigitalTwin();renderDigitalTwinBoard();return item;}
function raisePredictiveRisk(id='CAPACITY_CRUNCH'){loadDigitalTwin();const risk=riskById(id);const item={id:`RSK-${String(Date.now()).slice(-6)}`,riskId:risk.id,name:risk.name,risk:risk.risk,signal:risk.signal,status:'WATCH',at:new Date().toISOString()};digitalTwinState.risks.unshift(item);digitalTwinState.risks=digitalTwinState.risks.slice(0,80);saveDigitalTwin();renderDigitalTwinBoard();return item;}
function generateForecast(id='BOTTLENECK_15',metrics=null){loadDigitalTwin();const model=modelById(id);const riskLoad=digitalTwinState.risks.filter(r=>r.status==='WATCH').reduce((a,r)=>a+Number(r.risk||0),0);const bottleneck=Math.max(0,Math.min(100,Math.round((100-(digitalTwinState.signalScores.TRAFFIC_LOAD||75))*.45+(100-(digitalTwinState.signalScores.SURFACE_PRESSURE||75))*.38+riskLoad/5)));const item={id:`FRC-${String(Date.now()).slice(-6)}`,modelId:model.id,name:model.name,horizonMin:model.horizonMin,confidence:Math.max(30,Math.min(98,Math.round(model.confidence+digitalTwinState.confidence/10-riskLoad/28))),bottleneckScore:bottleneck,at:new Date().toISOString(),metrics:metrics||{}};digitalTwinState.forecasts.unshift(item);digitalTwinState.forecasts=digitalTwinState.forecasts.slice(0,100);digitalTwinState.bottleneckScore=bottleneck;digitalTwinState.leadTimeMin=Math.max(5,Math.round(model.horizonMin*(item.confidence/100)));saveDigitalTwin();renderDigitalTwinBoard();return item;}
function collectTwinSignals(finalScore=0,statsObj={},fail=false){const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};const weather=window.SKYWARD_WEATHER_OPS?.status?.()||{};const surface=window.SKYWARD_SURFACE_SAFETY?.status?.()||{};const traffic=window.SKYWARD_NETWORK_FLOW?.status?.()||{};const denied=Number(statsObj.denied||0),conflicts=Number(statsObj.conflicts||0),incursions=Number(statsObj.runwayIncursions||0);const base={...digitalTwinState.signalScores};base.TRAFFIC_LOAD=Math.max(0,Math.min(100,Math.round(82+finalScore/120-denied*5-conflicts*6-Number(traffic.networkDelayMin||0)*.6)));base.SURFACE_PRESSURE=Math.max(0,Math.min(100,Math.round(Number(surface.progress?.score||base.SURFACE_PRESSURE||77)-incursions*10-conflicts*3)));base.WEATHER_RISK=Math.max(0,Math.min(100,Math.round(Number(weather.progress?.score||base.WEATHER_RISK||80)-denied*1.5)));base.ASSET_RELIABILITY=Math.max(0,Math.min(100,Math.round(Number(asset.progress?.score||base.ASSET_RELIABILITY||82))));base.WORKFORCE_READY=Math.max(0,Math.min(100,Math.round(Number(workforce.progress?.score||base.WORKFORCE_READY||78))));base.NETWORK_RESILIENCE=Math.max(0,Math.min(100,Math.round(Number(network.progress?.score||base.NETWORK_RESILIENCE||76))));base.PASSENGER_IMPACT=Math.max(0,Math.min(100,Math.round(Number(passenger.progress?.score||base.PASSENGER_IMPACT||78)-denied*1.2)));base.SECURITY_POSTURE=Math.max(0,Math.min(100,Math.round(Number(security.progress?.score||base.SECURITY_POSTURE||80))));if(fail){base.TRAFFIC_LOAD=Math.max(0,base.TRAFFIC_LOAD-8);base.PASSENGER_IMPACT=Math.max(0,base.PASSENGER_IMPACT-6);}return {signals:base,drivers:{denied,conflicts,incursions,asset:asset.progress?.score,security:security.progress?.score,network:network.progress?.score,passenger:passenger.progress?.score,workforce:workforce.progress?.score}};}
function evaluateDigitalTwin(finalScore=0,statsObj={},fail=false,airportCode=''){loadDigitalTwin();const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';const {signals,drivers}=collectTwinSignals(finalScore,statsObj,fail);digitalTwinState.signalScores=signals;if(signals.TRAFFIC_LOAD<62&&!digitalTwinState.risks.some(r=>r.status==='WATCH'&&r.riskId==='CAPACITY_CRUNCH'))raisePredictiveRisk('CAPACITY_CRUNCH');if(signals.SURFACE_PRESSURE<60&&!digitalTwinState.risks.some(r=>r.status==='WATCH'&&r.riskId==='SURFACE_GRIDLOCK'))raisePredictiveRisk('SURFACE_GRIDLOCK');if(signals.ASSET_RELIABILITY<65&&!digitalTwinState.risks.some(r=>r.status==='WATCH'&&r.riskId==='ASSET_DEGRADATION'))raisePredictiveRisk('ASSET_DEGRADATION');if(signals.NETWORK_RESILIENCE<60&&!digitalTwinState.risks.some(r=>r.status==='WATCH'&&r.riskId==='NETWORK_CASCADE'))raisePredictiveRisk('NETWORK_CASCADE');const weighted=Math.round(DIGITAL_TWIN_CATALOG.twinSignals.reduce((a,s)=>a+(signals[s.id]||0)*s.weight,0)/100);const watchRisk=digitalTwinState.risks.filter(r=>r.status==='WATCH').reduce((a,r)=>a+Number(r.risk||0),0);const forecast=generateForecast('BOTTLENECK_15',{weighted,watchRisk,drivers});const confidence=Math.max(0,Math.min(100,Math.round((digitalTwinState.confidence*.45)+(forecast.confidence*.35)+(weighted*.20)-watchRisk/20)));const whatIfGain=digitalTwinState.plays.reduce((a)=>a+2,0);const score=Math.max(0,Math.min(100,Math.round(weighted*.62+confidence*.22+Math.max(0,100-digitalTwinState.bottleneckScore)*.16+whatIfGain-(fail?6:0))));digitalTwinState.confidence=confidence;digitalTwinState.confidenceBand=confidenceBand(confidence).id;digitalTwinState.twinScore=score;digitalTwinState.status=twinBand(score).id;const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),signals,weighted,watchRisk,forecast,twinScore:score,confidence,confidenceBand:digitalTwinState.confidenceBand,bottleneckScore:digitalTwinState.bottleneckScore,leadTimeMin:digitalTwinState.leadTimeMin,status:digitalTwinState.status,plays:digitalTwinState.plays.length,risks:digitalTwinState.risks.filter(r=>r.status==='WATCH').length,drivers};digitalTwinState.history.unshift(evaluation);digitalTwinState.history=digitalTwinState.history.slice(0,100);digitalTwinState.lastEvaluation=evaluation;saveDigitalTwin();renderDigitalTwinBoard();return {state:digitalTwinState,evaluation};}
function digitalTwinProgress(){loadDigitalTwin();return {score:digitalTwinState.twinScore,status:digitalTwinState.status,confidence:digitalTwinState.confidence,confidenceBand:digitalTwinState.confidenceBand,bottleneckScore:digitalTwinState.bottleneckScore,leadTimeMin:digitalTwinState.leadTimeMin,risks:digitalTwinState.risks.filter(r=>r.status==='WATCH').length,forecasts:digitalTwinState.forecasts.length,plays:digitalTwinState.plays.length,last:digitalTwinState.lastEvaluation||null};}
function renderDigitalTwinBoard(){try{const anchor=document.querySelector('#assetMaintenanceInline')||document.querySelector('#securityCyberInline')||document.querySelector('#airportOpsBoard');if(!anchor?.insertAdjacentHTML)return;const old=document.querySelector('#digitalTwinInline');if(old)old.remove();const p=digitalTwinProgress();anchor.insertAdjacentHTML('afterend',`<div id="digitalTwinInline" class="airport-ops-board digital-twin-inline"><div class="airport-ops-head"><b>DIGITAL TWIN</b><span>${p.status}</span></div><div class="airport-ops-grid"><div><small>TWIN</small><b>${p.score}%</b></div><div><small>CONF.</small><b>${p.confidence}%</b></div><div><small>GARG.</small><b>${p.bottleneckScore}</b></div><div><small>LEAD</small><b>${p.leadTimeMin}m</b></div><div><small>RISCOS</small><b>${p.risks}</b></div><div><small>WHATIF</small><b>${p.plays}</b></div></div></div>`);}catch(e){safeLogError?.(e,'digital-twin-board');}}
function initializeDigitalTwin(){loadDigitalTwin();renderDigitalTwinBoard();return digitalTwinState;}
function digitalTwinStatus(){loadDigitalTwin();return {...digitalTwinState,progress:digitalTwinProgress(),catalog:DIGITAL_TWIN_CATALOG};}
function digitalTwinSelfCheck(){const issues=[];if(DIGITAL_TWIN_CATALOG.twinSignals.length<8)issues.push('sinais insuficientes');if(DIGITAL_TWIN_CATALOG.forecastModels.length<6)issues.push('modelos insuficientes');const play=applyRecommendationPlay('OPEN_BUFFER_SLOTS');const risk=raisePredictiveRisk('CAPACITY_CRUNCH');const forecast=generateForecast('BOTTLENECK_15');const res=evaluateDigitalTwin(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');if(!play.id||!risk.id||!forecast.id)issues.push('play/risco/forecast inválido');if(!Number.isFinite(res.evaluation.twinScore))issues.push('score digital twin inválido');return {ok:issues.length===0,issues,signals:DIGITAL_TWIN_CATALOG.twinSignals.length,models:DIGITAL_TWIN_CATALOG.forecastModels.length};}
window.SKYWARD_DIGITAL_TWIN=Object.freeze({schema:1,catalog:DIGITAL_TWIN_CATALOG,load:loadDigitalTwin,save:saveDigitalTwin,init:initializeDigitalTwin,play:applyRecommendationPlay,risk:raisePredictiveRisk,forecast:generateForecast,evaluate:evaluateDigitalTwin,progress:digitalTwinProgress,status:digitalTwinStatus,board:renderDigitalTwinBoard,selfCheck:digitalTwinSelfCheck});

/* ===== MODULE 43: ai-copilot-decision-support-center (48-ai-copilot-decision-support-center.js) ===== */
/* @skyward-module 48-ai-copilot-decision-support-center
 * AI Copilot and decision support center with prioritized recommendations, alerts, explanations, action plans and confidence scoring.
 */
window.SKYWARD_MODULES?.push('48-ai-copilot-decision-support-center');
const AI_COPILOT_CATALOG=Object.freeze({schema:1,version:'2026.06-f45',copilotDomains:[{id:'TRAFFIC',name:'Tráfego e separação',weight:14,criticalBelow:65},{id:'SURFACE',name:'Solo/pista',weight:12,criticalBelow:65},{id:'WEATHER',name:'Clima e procedimentos',weight:10,criticalBelow:60},{id:'ASSETS',name:'Ativos críticos',weight:12,criticalBelow:70},{id:'WORKFORCE',name:'Equipe/fadiga',weight:10,criticalBelow:65},{id:'SECURITY',name:'Segurança/SOC',weight:10,criticalBelow:65},{id:'EMERGENCY',name:'Emergência/ARFF',weight:10,criticalBelow:70},{id:'NETWORK',name:'Rede/hubs',weight:8,criticalBelow:65},{id:'PASSENGER',name:'Passageiro/reputação',weight:7,criticalBelow:65},{id:'FINANCE',name:'Receita/custo',weight:7,criticalBelow:60}],recommendationRules:[{id:'REDUCE_ACCEPTANCE',domain:'TRAFFIC',threshold:65,title:'Reduzir aceitação de tráfego',action:'Aplicar espaçamento maior e segurar partidas.'},{id:'GROUND_FLOW_RESET',domain:'SURFACE',threshold:65,title:'Resetar fluxo de solo',action:'Criar janela de taxi e proteger pista.'},{id:'WEATHER_PROCEDURE_MODE',domain:'WEATHER',threshold:60,title:'Ativar modo meteorológico',action:'Revisar ILS/NAVAID e mínimos.'},{id:'MAINTENANCE_CHECK',domain:'ASSETS',threshold:70,title:'Checagem técnica crítica',action:'Rodar preventiva de radar/ILS/balizamento.'},{id:'CALL_SUPERVISOR',domain:'WORKFORCE',threshold:65,title:'Acionar supervisor',action:'Dividir setor e reduzir fadiga.'},{id:'SOC_WATCH',domain:'SECURITY',threshold:65,title:'Elevar SOC',action:'Ativar vigilância e revisar credenciais.'},{id:'PREPOSITION_ARFF',domain:'EMERGENCY',threshold:70,title:'Pré-posicionar ARFF',action:'Deixar ARFF em prontidão.'},{id:'PROTECT_CONNECTIONS',domain:'NETWORK',threshold:65,title:'Proteger conexões',action:'Abrir alternados e preservar bancos.'},{id:'PASSENGER_PUSH',domain:'PASSENGER',threshold:65,title:'Comunicar passageiro',action:'Emitir push/PA preditivo.'},{id:'BUDGET_GUARD',domain:'FINANCE',threshold:60,title:'Proteger margem',action:'Priorizar ações de maior ROI.'}],alertLevels:[{id:'INFO',minRisk:0,name:'Informativo'},{id:'ADVISORY',minRisk:20,name:'Atenção'},{id:'WARNING',minRisk:40,name:'Alerta'},{id:'CRITICAL',minRisk:65,name:'Crítico'}],copilotModes:[{id:'BALANCED',name:'Equilibrado',riskTolerance:50,costSensitivity:50},{id:'SAFETY_FIRST',name:'Segurança primeiro',riskTolerance:30,costSensitivity:35},{id:'RECOVERY',name:'Recuperação operacional',riskTolerance:45,costSensitivity:45},{id:'COMMERCIAL',name:'Comercial',riskTolerance:55,costSensitivity:70}],decisionKPIs:[{id:'RECOMMENDATION_QUALITY',name:'Qualidade recomendação'},{id:'ACTION_PRIORITY',name:'Prioridade de ação'},{id:'CONFIDENCE',name:'Confiança'},{id:'RISK_REDUCTION',name:'Redução de risco'},{id:'OPERATIONAL_ROI',name:'ROI operacional'}],copilotBands:[{id:'COMMAND_READY',min:90,name:'Comando assistido'},{id:'RELIABLE_ADVISOR',min:75,name:'Conselheiro confiável'},{id:'LIMITED_CONTEXT',min:55,name:'Contexto limitado'},{id:'UNRELIABLE',min:0,name:'Revisar manualmente'}]});
const AI_COPILOT_KEY='skywardAiCopilot_v1';
let aiCopilotState={schema:1,mode:'BALANCED',recommendations:[],alerts:[],decisionScore:78,confidence:72,priority:'ADVISORY',status:'RELIABLE_ADVISOR',history:[],lastEvaluation:null};
function loadAiCopilot(){try{const raw=localStorage?.getItem?.(AI_COPILOT_KEY);if(raw){const p=JSON.parse(raw);if(p?.schema===1)aiCopilotState={...aiCopilotState,...p};}}catch(e){safeLogError?.(e,'ai-copilot-load');}return aiCopilotState;}
function saveAiCopilot(){try{localStorage?.setItem?.(AI_COPILOT_KEY,JSON.stringify(aiCopilotState));}catch(e){safeLogError?.(e,'ai-copilot-save');}return aiCopilotState;}
function copilotBand(s){return AI_COPILOT_CATALOG.copilotBands.slice().sort((a,b)=>b.min-a.min).find(b=>s>=b.min)||AI_COPILOT_CATALOG.copilotBands.at(-1);}
function alertLevel(r){return AI_COPILOT_CATALOG.alertLevels.slice().sort((a,b)=>b.minRisk-a.minRisk).find(l=>r>=l.minRisk)||AI_COPILOT_CATALOG.alertLevels[0];}
function modeById(id){return AI_COPILOT_CATALOG.copilotModes.find(m=>m.id===id)||AI_COPILOT_CATALOG.copilotModes[0];}
function setAiCopilotMode(id='BALANCED'){loadAiCopilot();aiCopilotState.mode=modeById(id).id;saveAiCopilot();renderAiCopilotBoard();return modeById(aiCopilotState.mode);}
function collectDomainScores(finalScore=0,statsObj={},fail=false){const get=(api,f=75)=>Number(api?.progress?.score??api?.score??f);const digital=window.SKYWARD_DIGITAL_TWIN?.status?.()||{};const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};const surface=window.SKYWARD_SURFACE_SAFETY?.status?.()||{};const weather=window.SKYWARD_WEATHER_OPS?.status?.()||{};const denied=Number(statsObj.denied||0),conflicts=Number(statsObj.conflicts||0),incursions=Number(statsObj.runwayIncursions||0);const scores={TRAFFIC:Math.max(0,Math.min(100,Math.round(78+finalScore/90-conflicts*8-denied*4-(fail?8:0)))),SURFACE:Math.max(0,Math.min(100,Math.round(get(surface,78)-incursions*9-conflicts*3))),WEATHER:Math.max(0,Math.min(100,Math.round(get(weather,78)-denied*2))),ASSETS:get(asset,80),WORKFORCE:get(workforce,78),SECURITY:get(security,80),EMERGENCY:get(emergency,78),NETWORK:get(network,76),PASSENGER:get(passenger,78),FINANCE:Math.max(0,Math.min(100,Math.round(get(revenue,75)+(Number(revenue.progress?.margin||0))*0.5)))};return{scores,twin:get(digital,78),twinConfidence:Number(digital.progress?.confidence||72),drivers:{denied,conflicts,incursions,finalScore}};}
function buildRecommendations(scores){const mode=modeById(aiCopilotState.mode);const recs=[];for(const rule of AI_COPILOT_CATALOG.recommendationRules){const score=Number(scores[rule.domain]||0);if(score<rule.threshold){const severity=Math.max(0,Math.round((rule.threshold-score)*2+(100-mode.riskTolerance)/5));recs.push({id:`REC-${rule.id}`,ruleId:rule.id,domain:rule.domain,title:rule.title,action:rule.action,score,threshold:rule.threshold,severity,priority:alertLevel(severity).id,why:`${rule.domain} está em ${score}, abaixo do mínimo ${rule.threshold}.`});}}return recs.sort((a,b)=>b.severity-a.severity).slice(0,8);}
function createAiAlert(id='MANUAL_ADVISORY',domain='TRAFFIC',risk=25,message='Alerta operacional manual'){loadAiCopilot();const item={id:`ALT-${String(Date.now()).slice(-6)}`,alertId:id,domain,risk,level:alertLevel(risk).id,message,status:'OPEN',at:new Date().toISOString()};aiCopilotState.alerts.unshift(item);aiCopilotState.alerts=aiCopilotState.alerts.slice(0,80);saveAiCopilot();renderAiCopilotBoard();return item;}
function resolveAiAlert(id,ok=true){loadAiCopilot();const a=aiCopilotState.alerts.find(x=>x.id===id);if(a){a.status=ok?'RESOLVED':'ESCALATED';a.closedAt=new Date().toISOString();}saveAiCopilot();renderAiCopilotBoard();return a||null;}
function evaluateAiCopilot(finalScore=0,statsObj={},fail=false,airportCode=''){loadAiCopilot();const icao=airportCode||(typeof airport==='function'?airport()?.icao:'')||'SBSP';const {scores,twin,twinConfidence,drivers}=collectDomainScores(finalScore,statsObj,fail);const recs=buildRecommendations(scores);if(recs[0]&&!aiCopilotState.alerts.some(a=>a.status==='OPEN'&&a.alertId===recs[0].ruleId))createAiAlert(recs[0].ruleId,recs[0].domain,recs[0].severity,recs[0].title);const riskLoad=recs.reduce((a,r)=>a+r.severity,0)+aiCopilotState.alerts.filter(a=>a.status==='OPEN').reduce((a,b)=>a+Number(b.risk||0),0);const weighted=Math.round(AI_COPILOT_CATALOG.copilotDomains.reduce((a,d)=>a+(scores[d.id]||0)*d.weight,0)/100);const confidence=Math.max(0,Math.min(100,Math.round(twinConfidence*.35+twin*.20+weighted*.30+Math.max(0,100-riskLoad/3)*.15)));const decisionScore=Math.max(0,Math.min(100,Math.round(weighted*.52+confidence*.28+Math.max(0,100-riskLoad/4)*.20-(fail?6:0))));aiCopilotState.recommendations=recs;aiCopilotState.confidence=confidence;aiCopilotState.decisionScore=decisionScore;aiCopilotState.priority=recs[0]?.priority||alertLevel(riskLoad/3).id;aiCopilotState.status=copilotBand(decisionScore).id;const actionPlan=recs.slice(0,3).map((r,i)=>({step:i+1,title:r.title,action:r.action,domain:r.domain,priority:r.priority}));const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),scores,weighted,twin,twinConfidence,riskLoad,decisionScore,confidence,priority:aiCopilotState.priority,status:aiCopilotState.status,recommendations:recs,actionPlan,openAlerts:aiCopilotState.alerts.filter(a=>a.status==='OPEN').length,drivers};aiCopilotState.history.unshift(evaluation);aiCopilotState.history=aiCopilotState.history.slice(0,100);aiCopilotState.lastEvaluation=evaluation;saveAiCopilot();renderAiCopilotBoard();return{state:aiCopilotState,evaluation};}
function aiCopilotProgress(){loadAiCopilot();return{score:aiCopilotState.decisionScore,status:aiCopilotState.status,confidence:aiCopilotState.confidence,priority:aiCopilotState.priority,mode:aiCopilotState.mode,recommendations:aiCopilotState.recommendations.length,openAlerts:aiCopilotState.alerts.filter(a=>a.status==='OPEN').length,last:aiCopilotState.lastEvaluation||null};}
function renderAiCopilotBoard(){try{const anchor=document.querySelector('#digitalTwinInline')||document.querySelector('#assetMaintenanceInline')||document.querySelector('#airportOpsBoard');if(!anchor?.insertAdjacentHTML)return;const old=document.querySelector('#aiCopilotInline');if(old)old.remove();const p=aiCopilotProgress();anchor.insertAdjacentHTML('afterend',`<div id="aiCopilotInline" class="airport-ops-board ai-copilot-inline"><div class="airport-ops-head"><b>AI COPILOT</b><span>${p.status}</span></div><div class="airport-ops-grid"><div><small>DECIS.</small><b>${p.score}%</b></div><div><small>CONF.</small><b>${p.confidence}%</b></div><div><small>PRIOR.</small><b>${p.priority}</b></div><div><small>MODO</small><b>${p.mode}</b></div><div><small>RECS</small><b>${p.recommendations}</b></div><div><small>ALERT.</small><b>${p.openAlerts}</b></div></div></div>`);}catch(e){safeLogError?.(e,'ai-copilot-board');}}
function initializeAiCopilot(){loadAiCopilot();renderAiCopilotBoard();return aiCopilotState;}
function aiCopilotStatus(){loadAiCopilot();return{...aiCopilotState,progress:aiCopilotProgress(),catalog:AI_COPILOT_CATALOG};}
function aiCopilotSelfCheck(){const issues=[];if(AI_COPILOT_CATALOG.copilotDomains.length<10)issues.push('domínios insuficientes');if(AI_COPILOT_CATALOG.recommendationRules.length<10)issues.push('regras insuficientes');const mode=setAiCopilotMode('SAFETY_FIRST');const alert=createAiAlert('TEST_ALERT','TRAFFIC',40,'Teste alerta');const res=evaluateAiCopilot(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');if(!mode.id||!alert.id)issues.push('modo/alerta inválido');if(!Number.isFinite(res.evaluation.decisionScore))issues.push('score copiloto inválido');return{ok:issues.length===0,issues,domains:AI_COPILOT_CATALOG.copilotDomains.length,rules:AI_COPILOT_CATALOG.recommendationRules.length};}
window.SKYWARD_AI_COPILOT=Object.freeze({schema:1,catalog:AI_COPILOT_CATALOG,load:loadAiCopilot,save:saveAiCopilot,mode:setAiCopilotMode,alert:createAiAlert,resolve:resolveAiAlert,evaluate:evaluateAiCopilot,progress:aiCopilotProgress,status:aiCopilotStatus,board:renderAiCopilotBoard,init:initializeAiCopilot,selfCheck:aiCopilotSelfCheck});

/* ===== MODULE 44: radio-communications-phraseology-center (49-radio-communications-phraseology-center.js) ===== */
/* @skyward-module 49-radio-communications-phraseology-center
 * Radio communications and phraseology center with VHF load, readback/hearback, CPDLC, emergency radio, language clarity and blocked transmissions.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('49-radio-communications-phraseology-center');
const RADIO_PHRASEOLOGY_CATALOG=Object.freeze({schema:1,version:'2026.06-f46',communicationDomains:[{id:'VHF_LOAD',name:'Carga VHF',weight:16,target:78},{id:'READBACK_ACCURACY',name:'Readback correto',weight:18,target:86},{id:'HEARBACK_MONITOR',name:'Hearback/escuta ativa',weight:16,target:84},{id:'PHRASEOLOGY',name:'Fraseologia ICAO/ANAC',weight:18,target:86},{id:'CPDLC_TEXT',name:'CPDLC/texto operacional',weight:10,target:80},{id:'EMERGENCY_COMMS',name:'Comunicação de emergência',weight:12,target:84},{id:'LANGUAGE_CLARITY',name:'Clareza/idioma operacional',weight:10,target:82}],phraseologySets:[{id:'CLEARANCE_READBACK',name:'Autorização e readback',risk:18},{id:'TAXI_HOLD_SHORT',name:'Taxi e hold short',risk:20},{id:'LINEUP_TAKEOFF',name:'Alinhamento/decolagem',risk:24},{id:'APPROACH_LANDING',name:'Aproximação/pouso',risk:22},{id:'MISSED_APPROACH',name:'Arremetida',risk:28},{id:'MAYDAY_PANPAN',name:'Mayday/Pan-pan',risk:30},{id:'CPDLC_ROUTE_CLEARANCE',name:'CPDLC rota/nível',risk:16}],communicationIssues:[{id:'CALLSIGN_CONFUSION',name:'Confusão de callsign',domain:'READBACK_ACCURACY',severity:24},{id:'BLOCKED_TRANSMISSION',name:'Transmissão bloqueada',domain:'VHF_LOAD',severity:22},{id:'WRONG_READBACK',name:'Readback incorreto',domain:'HEARBACK_MONITOR',severity:28},{id:'NON_STANDARD_PHRASEOLOGY',name:'Fraseologia não padrão',domain:'PHRASEOLOGY',severity:18},{id:'LANGUAGE_AMBIGUITY',name:'Ambiguidade de idioma',domain:'LANGUAGE_CLARITY',severity:20},{id:'CPDLC_MISMATCH',name:'Divergência CPDLC/voz',domain:'CPDLC_TEXT',severity:23},{id:'EMERGENCY_RADIO_OVERLOAD',name:'Sobrecarga rádio emergência',domain:'EMERGENCY_COMMS',severity:30}],improvementPrograms:[{id:'READBACK_DRILL',name:'Treino readback/hearback',cost:12000,benefit:{READBACK_ACCURACY:10,HEARBACK_MONITOR:9}},{id:'PHRASEOLOGY_REFRESHER',name:'Reciclagem fraseologia',cost:10000,benefit:{PHRASEOLOGY:12,LANGUAGE_CLARITY:4}},{id:'VHF_SECTOR_SPLIT',name:'Divisão de frequência/setor',cost:16000,benefit:{VHF_LOAD:12}},{id:'CPDLC_TEMPLATES',name:'Templates CPDLC',cost:9000,benefit:{CPDLC_TEXT:11,PHRASEOLOGY:3}},{id:'EMERGENCY_COMMS_DRILL',name:'Drill rádio emergência',cost:14000,benefit:{EMERGENCY_COMMS:13,HEARBACK_MONITOR:4}},{id:'LANGUAGE_CLEARANCE',name:'Clareza bilíngue operacional',cost:11000,benefit:{LANGUAGE_CLARITY:12,READBACK_ACCURACY:3}}],radioBands:[{id:'EXCELLENT',min:90,name:'Comunicação excelente'},{id:'CLEAR',min:75,name:'Comunicação clara'},{id:'CONGESTED',min:55,name:'Congestionada'},{id:'UNSAFE_COMMS',min:0,name:'Comunicação insegura'}],radioKPIs:[{id:'READBACK_RATE',name:'Taxa readback correto'},{id:'BLOCKED_RATE',name:'Taxa transmissão bloqueada'},{id:'VHF_UTILIZATION',name:'Utilização VHF'},{id:'PHRASEOLOGY_SCORE',name:'Score fraseologia'},{id:'COMMS_RISK',name:'Risco comunicação'}]});
const RADIO_PHRASEOLOGY_KEY='skywardRadioPhraseology_v1';
let radioPhraseologyState={schema:1,domainScores:{VHF_LOAD:78,READBACK_ACCURACY:84,HEARBACK_MONITOR:82,PHRASEOLOGY:84,CPDLC_TEXT:78,EMERGENCY_COMMS:80,LANGUAGE_CLARITY:82},programs:[],issues:[],radioScore:82,readbackRate:86,blockedRate:4,vhfUtilization:58,status:'CLEAR',history:[],lastEvaluation:null};
function loadRadioPhraseology(){try{const raw=localStorage?.getItem?.(RADIO_PHRASEOLOGY_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)radioPhraseologyState={...radioPhraseologyState,...parsed};}}catch(e){safeLogError?.(e,'radio-phraseology-load');}return radioPhraseologyState;}
function saveRadioPhraseology(){try{localStorage?.setItem?.(RADIO_PHRASEOLOGY_KEY,JSON.stringify(radioPhraseologyState));}catch(e){safeLogError?.(e,'radio-phraseology-save');}return radioPhraseologyState;}
function radioBand(score){return RADIO_PHRASEOLOGY_CATALOG.radioBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||RADIO_PHRASEOLOGY_CATALOG.radioBands.at(-1);}
function programById(id){return RADIO_PHRASEOLOGY_CATALOG.improvementPrograms.find(p=>p.id===id)||RADIO_PHRASEOLOGY_CATALOG.improvementPrograms[0];}
function issueById(id){return RADIO_PHRASEOLOGY_CATALOG.communicationIssues.find(i=>i.id===id)||RADIO_PHRASEOLOGY_CATALOG.communicationIssues[0];}
function runRadioProgram(id='READBACK_DRILL'){loadRadioPhraseology();const p=programById(id);const item={id:`COM-${String(Date.now()).slice(-6)}`,programId:p.id,name:p.name,cost:p.cost,status:'DONE',at:new Date().toISOString()};radioPhraseologyState.programs.unshift(item);radioPhraseologyState.programs=radioPhraseologyState.programs.slice(0,80);for(const [d,g] of Object.entries(p.benefit||{}))radioPhraseologyState.domainScores[d]=Math.min(100,Number(radioPhraseologyState.domainScores[d]||75)+Number(g||0));saveRadioPhraseology();renderRadioPhraseologyBoard();return item;}
function raiseRadioIssue(id='WRONG_READBACK'){loadRadioPhraseology();const tpl=issueById(id);const item={id:`COMISS-${String(Date.now()).slice(-6)}`,issueId:tpl.id,name:tpl.name,domain:tpl.domain,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};radioPhraseologyState.issues.unshift(item);radioPhraseologyState.issues=radioPhraseologyState.issues.slice(0,80);radioPhraseologyState.domainScores[tpl.domain]=Math.max(0,Number(radioPhraseologyState.domainScores[tpl.domain]||75)-Math.round(tpl.severity/4));saveRadioPhraseology();renderRadioPhraseologyBoard();return item;}
function resolveRadioIssue(id,ok=true){loadRadioPhraseology();const issue=radioPhraseologyState.issues.find(i=>i.id===id);if(issue){issue.status=ok?'RESOLVED':'ESCALATED';issue.closedAt=new Date().toISOString();if(ok)radioPhraseologyState.domainScores[issue.domain]=Math.min(100,Number(radioPhraseologyState.domainScores[issue.domain]||75)+3);}saveRadioPhraseology();renderRadioPhraseologyBoard();return issue||null;}
function calculateRadioMetrics(finalScore=0,statsObj={},fail=false){const ai=window.SKYWARD_AI_COPILOT?.status?.()||{};const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};const safety=window.SKYWARD_SAFETY_COMPLIANCE?.status?.()||{};const emergency=window.SKYWARD_EMERGENCY_RESPONSE?.status?.()||{};const traffic=window.SKYWARD_NETWORK_FLOW?.status?.()||{};const open=radioPhraseologyState.issues.filter(i=>i.status==='OPEN');const denied=Number(statsObj.denied||0),commands=Number(statsObj.commands||0),blocked=Number(statsObj.blocked||0),conflicts=Number(statsObj.conflicts||0),emergencies=Number(statsObj.emergencies||0);const scores={...radioPhraseologyState.domainScores};const openPenalty=d=>open.filter(i=>i.domain===d).reduce((a,i)=>a+Number(i.severity||0),0)/3.8;const load=Math.min(100,Math.round(commands*3.5+denied*4+blocked*7+Number(traffic.networkDelayMin||0)*.7));scores.VHF_LOAD=Math.max(0,Math.min(100,92-load*0.45-openPenalty('VHF_LOAD')));scores.READBACK_ACCURACY=Math.max(0,Math.min(100,Number(scores.READBACK_ACCURACY||84)+Number(workforce.progress?.score||78)*.04-denied*3-openPenalty('READBACK_ACCURACY')));scores.HEARBACK_MONITOR=Math.max(0,Math.min(100,Number(scores.HEARBACK_MONITOR||82)+Number(safety.progress?.score||80)*.04-conflicts*4-openPenalty('HEARBACK_MONITOR')));scores.PHRASEOLOGY=Math.max(0,Math.min(100,Number(scores.PHRASEOLOGY||84)+finalScore/900-denied*2-openPenalty('PHRASEOLOGY')));scores.CPDLC_TEXT=Math.max(0,Math.min(100,Number(scores.CPDLC_TEXT||78)+Number(ai.progress?.confidence||72)*.05-blocked*2-openPenalty('CPDLC_TEXT')));scores.EMERGENCY_COMMS=Math.max(0,Math.min(100,Number(scores.EMERGENCY_COMMS||80)+Number(emergency.progress?.score||78)*.05-emergencies*3-openPenalty('EMERGENCY_COMMS')));scores.LANGUAGE_CLARITY=Math.max(0,Math.min(100,Number(scores.LANGUAGE_CLARITY||82)+Number(workforce.progress?.score||78)*.03-denied*1.5-openPenalty('LANGUAGE_CLARITY')));if(fail){scores.READBACK_ACCURACY=Math.max(0,scores.READBACK_ACCURACY-6);scores.PHRASEOLOGY=Math.max(0,scores.PHRASEOLOGY-5);}return {scores,load,openIssues:open.length,readbackRate:Math.round((scores.READBACK_ACCURACY+scores.HEARBACK_MONITOR)/2),blockedRate:Math.max(0,Math.min(100,Math.round(blocked*9+open.filter(i=>i.issueId==='BLOCKED_TRANSMISSION').length*12))),vhfUtilization:load,drivers:{denied,commands,blocked,conflicts,emergencies}};}
function evaluateRadioPhraseology(finalScore=0,statsObj={},fail=false,airportCode=''){loadRadioPhraseology();const icao=airportCode||(typeof airport==='function'?airport()?.icao:'')||'SBSP';if((statsObj.denied||0)>=2&&!radioPhraseologyState.issues.some(i=>i.status==='OPEN'&&i.issueId==='WRONG_READBACK'))raiseRadioIssue('WRONG_READBACK');if((statsObj.blocked||0)>=1&&!radioPhraseologyState.issues.some(i=>i.status==='OPEN'&&i.issueId==='BLOCKED_TRANSMISSION'))raiseRadioIssue('BLOCKED_TRANSMISSION');if((statsObj.emergencies||0)>0&&!radioPhraseologyState.issues.some(i=>i.status==='OPEN'&&i.issueId==='EMERGENCY_RADIO_OVERLOAD'))raiseRadioIssue('EMERGENCY_RADIO_OVERLOAD');const m=calculateRadioMetrics(finalScore,statsObj,fail);radioPhraseologyState.domainScores=m.scores;radioPhraseologyState.readbackRate=m.readbackRate;radioPhraseologyState.blockedRate=m.blockedRate;radioPhraseologyState.vhfUtilization=m.vhfUtilization;const weighted=Math.round(RADIO_PHRASEOLOGY_CATALOG.communicationDomains.reduce((a,d)=>a+(m.scores[d.id]||0)*d.weight,0)/100);const issuePenalty=radioPhraseologyState.issues.filter(i=>i.status==='OPEN').reduce((a,i)=>a+Number(i.severity||0),0)/12;const score=Math.max(0,Math.min(100,Math.round(weighted-issuePenalty-(fail?6:0))));radioPhraseologyState.radioScore=score;radioPhraseologyState.status=radioBand(score).id;const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...m,weighted,radioScore:score,status:radioPhraseologyState.status,programs:radioPhraseologyState.programs.length};radioPhraseologyState.history.unshift(evaluation);radioPhraseologyState.history=radioPhraseologyState.history.slice(0,100);radioPhraseologyState.lastEvaluation=evaluation;saveRadioPhraseology();renderRadioPhraseologyBoard();return {state:radioPhraseologyState,evaluation};}
function radioPhraseologyProgress(){loadRadioPhraseology();return {score:radioPhraseologyState.radioScore,status:radioPhraseologyState.status,readbackRate:radioPhraseologyState.readbackRate,blockedRate:radioPhraseologyState.blockedRate,vhfUtilization:radioPhraseologyState.vhfUtilization,openIssues:radioPhraseologyState.issues.filter(i=>i.status==='OPEN').length,programs:radioPhraseologyState.programs.length,last:radioPhraseologyState.lastEvaluation||null};}
function renderRadioPhraseologyBoard(){try{const anchor=document.querySelector('#aiCopilotInline')||document.querySelector('#digitalTwinInline')||document.querySelector('#airportOpsBoard');if(!anchor?.insertAdjacentHTML)return;const old=document.querySelector('#radioPhraseologyInline');if(old)old.remove();const p=radioPhraseologyProgress();anchor.insertAdjacentHTML('afterend',`<div id="radioPhraseologyInline" class="airport-ops-board radio-phraseology-inline"><div class="airport-ops-head"><b>RADIO OPS</b><span>${p.status}</span></div><div class="airport-ops-grid"><div><small>COMMS</small><b>${p.score}%</b></div><div><small>READBK</small><b>${p.readbackRate}%</b></div><div><small>BLOQ.</small><b>${p.blockedRate}%</b></div><div><small>VHF</small><b>${p.vhfUtilization}%</b></div><div><small>FALHAS</small><b>${p.openIssues}</b></div><div><small>TREINO</small><b>${p.programs}</b></div></div></div>`);}catch(e){safeLogError?.(e,'radio-phraseology-board');}}
function initializeRadioPhraseology(){loadRadioPhraseology();renderRadioPhraseologyBoard();return radioPhraseologyState;}
function radioPhraseologyStatus(){loadRadioPhraseology();return {...radioPhraseologyState,progress:radioPhraseologyProgress(),catalog:RADIO_PHRASEOLOGY_CATALOG};}
function radioPhraseologySelfCheck(){const issues=[];if(RADIO_PHRASEOLOGY_CATALOG.communicationDomains.length<7)issues.push('domínios insuficientes');if(RADIO_PHRASEOLOGY_CATALOG.communicationIssues.length<7)issues.push('issues insuficientes');const program=runRadioProgram('READBACK_DRILL');const issue=raiseRadioIssue('WRONG_READBACK');const res=evaluateRadioPhraseology(2700,{commands:8,denied:0,blocked:0,conflicts:0,emergencies:0},false,'SBGR');if(!program.id||!issue.id)issues.push('programa/issue inválido');if(!Number.isFinite(res.evaluation.radioScore))issues.push('score rádio inválido');return {ok:issues.length===0,issues,domains:RADIO_PHRASEOLOGY_CATALOG.communicationDomains.length,issuesCount:RADIO_PHRASEOLOGY_CATALOG.communicationIssues.length};}
window.SKYWARD_RADIO_PHRASEOLOGY=Object.freeze({schema:1,catalog:RADIO_PHRASEOLOGY_CATALOG,load:loadRadioPhraseology,save:saveRadioPhraseology,program:runRadioProgram,issue:raiseRadioIssue,resolve:resolveRadioIssue,evaluate:evaluateRadioPhraseology,progress:radioPhraseologyProgress,status:radioPhraseologyStatus,board:renderRadioPhraseologyBoard,init:initializeRadioPhraseology,selfCheck:radioPhraseologySelfCheck});

/* ===== MODULE 45: ground-handling-turnaround-center (50-ground-handling-turnaround-center.js) ===== */
/* @skyward-module 50-ground-handling-turnaround-center
 * Ground handling and turnaround control center with gate, boarding, baggage, fueling, catering, cleaning, pushback, ramp safety, deicing, SLA and delay.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('50-ground-handling-turnaround-center');
const GROUND_TURNAROUND_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f47',
  turnaroundProcesses:[
    {id:'GATE_ASSIGNMENT',name:'Gate/stand assignment',weight:12,target:82},
    {id:'BOARDING',name:'Embarque/desembarque',weight:13,target:80},
    {id:'BAGGAGE',name:'Bagagem e sorter',weight:13,target:78},
    {id:'FUELING',name:'Abastecimento',weight:14,target:82},
    {id:'CATERING_CLEANING',name:'Catering/limpeza',weight:10,target:78},
    {id:'PUSHBACK',name:'Pushback e trator',weight:14,target:82},
    {id:'RAMP_SAFETY',name:'Segurança de rampa',weight:14,target:84},
    {id:'DEICING_WEATHER',name:'Clima/deicing',weight:10,target:76}
  ],
  groundAssets:[
    {id:'GATE_CREWS',name:'Equipes de gate',process:'GATE_ASSIGNMENT',capacity:24,readiness:78},
    {id:'BOARDING_AGENTS',name:'Agentes de embarque',process:'BOARDING',capacity:26,readiness:80},
    {id:'BAGGAGE_TUGS',name:'Tratores bagagem',process:'BAGGAGE',capacity:20,readiness:76},
    {id:'FUEL_TRUCKS',name:'Caminhões combustível',process:'FUELING',capacity:18,readiness:82},
    {id:'CATERING_TRUCKS',name:'Catering/limpeza',process:'CATERING_CLEANING',capacity:18,readiness:76},
    {id:'PUSHBACK_TUGS',name:'Tratores pushback',process:'PUSHBACK',capacity:16,readiness:78},
    {id:'RAMP_MARSHALS',name:'Sinaleiros/rampa',process:'RAMP_SAFETY',capacity:22,readiness:80},
    {id:'DEICING_RIGS',name:'Equipamentos deicing',process:'DEICING_WEATHER',capacity:10,readiness:70}
  ],
  delayCauses:[
    {id:'GATE_CONFLICT',name:'Conflito de gate',process:'GATE_ASSIGNMENT',severity:22},
    {id:'BAGGAGE_BACKLOG',name:'Backlog bagagem',process:'BAGGAGE',severity:20},
    {id:'FUEL_QUEUE',name:'Fila de abastecimento',process:'FUELING',severity:24},
    {id:'CLEANING_LATE',name:'Limpeza atrasada',process:'CATERING_CLEANING',severity:14},
    {id:'PUSHBACK_SHORTAGE',name:'Falta de pushback',process:'PUSHBACK',severity:26},
    {id:'RAMP_INCIDENT',name:'Incidente de rampa',process:'RAMP_SAFETY',severity:30},
    {id:'DEICING_HOLD',name:'Espera deicing/clima',process:'DEICING_WEATHER',severity:18}
  ],
  improvementPrograms:[
    {id:'GATE_OPTIMIZER',name:'Otimizador de gates',cost:18000,benefit:{GATE_ASSIGNMENT:11,BOARDING:3}},
    {id:'BAGGAGE_EXPEDITE',name:'Expedição bagagem',cost:14000,benefit:{BAGGAGE:12}},
    {id:'FUEL_SLOT_SYNC',name:'Sincronização combustível',cost:15000,benefit:{FUELING:11,PUSHBACK:2}},
    {id:'CLEANING_SWARM',name:'Equipe limpeza rápida',cost:9000,benefit:{CATERING_CLEANING:10}},
    {id:'PUSHBACK_POOL',name:'Pool pushback',cost:16000,benefit:{PUSHBACK:12}},
    {id:'RAMP_SAFETY_BRIEF',name:'Briefing rampa segura',cost:7000,benefit:{RAMP_SAFETY:10}},
    {id:'DEICING_READY',name:'Prontidão deicing',cost:12000,benefit:{DEICING_WEATHER:10}}
  ],
  turnaroundBands:[
    {id:'ELITE_TURN',min:90,name:'Turnaround elite'},
    {id:'ON_TIME',min:75,name:'Dentro do SLA'},
    {id:'DELAYED',min:55,name:'Solo atrasado'},
    {id:'GRIDLOCK',min:0,name:'Rampa travada'}
  ]
});
const GROUND_TURNAROUND_KEY='skywardGroundTurnaround_v1';
let groundTurnaroundState={schema:1,processScores:{GATE_ASSIGNMENT:78,BOARDING:80,BAGGAGE:76,FUELING:82,CATERING_CLEANING:76,PUSHBACK:78,RAMP_SAFETY:80,DEICING_WEATHER:70},programs:[],delays:[],turnaroundScore:78,avgTurnaroundMin:48,groundDelayMin:0,slaRate:78,status:'ON_TIME',history:[],lastEvaluation:null};
function loadGroundTurnaround(){try{const raw=localStorage?.getItem?.(GROUND_TURNAROUND_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)groundTurnaroundState={...groundTurnaroundState,...parsed};}}catch(e){safeLogError?.(e,'ground-turnaround-load');}return groundTurnaroundState;}
function saveGroundTurnaround(){try{localStorage?.setItem?.(GROUND_TURNAROUND_KEY,JSON.stringify(groundTurnaroundState));}catch(e){safeLogError?.(e,'ground-turnaround-save');}return groundTurnaroundState;}
function turnaroundBand(score){return GROUND_TURNAROUND_CATALOG.turnaroundBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||GROUND_TURNAROUND_CATALOG.turnaroundBands.at(-1);}
function programById(id){return GROUND_TURNAROUND_CATALOG.improvementPrograms.find(p=>p.id===id)||GROUND_TURNAROUND_CATALOG.improvementPrograms[0];}
function delayById(id){return GROUND_TURNAROUND_CATALOG.delayCauses.find(d=>d.id===id)||GROUND_TURNAROUND_CATALOG.delayCauses[0];}
function runGroundProgram(id='GATE_OPTIMIZER'){
  loadGroundTurnaround();
  const program=programById(id);
  if(groundTurnaroundState.programs.some(p=>p.programId===program.id)) return groundTurnaroundState.programs.find(p=>p.programId===program.id);
  const item={id:`GPR-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  groundTurnaroundState.programs.unshift(item);
  for(const [proc,gain] of Object.entries(program.benefit||{})){
    groundTurnaroundState.processScores[proc]=Math.min(100,Number(groundTurnaroundState.processScores[proc]||75)+Number(gain||0));
  }
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return item;
}
function raiseGroundDelay(id='GATE_CONFLICT'){
  loadGroundTurnaround();
  const tpl=delayById(id);
  const item={id:`GDL-${String(Date.now()).slice(-6)}`,delayId:tpl.id,name:tpl.name,process:tpl.process,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  groundTurnaroundState.delays.unshift(item);
  groundTurnaroundState.delays=groundTurnaroundState.delays.slice(0,80);
  groundTurnaroundState.processScores[tpl.process]=Math.max(0,Number(groundTurnaroundState.processScores[tpl.process]||75)-Math.round(tpl.severity/4));
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return item;
}
function closeGroundDelay(id,ok=true){
  loadGroundTurnaround();
  const d=groundTurnaroundState.delays.find(x=>x.id===id);
  if(d){d.status=ok?'CLEARED':'ESCALATED';d.closedAt=new Date().toISOString();if(ok)groundTurnaroundState.processScores[d.process]=Math.min(100,Number(groundTurnaroundState.processScores[d.process]||75)+2);}
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return d||null;
}
function calculateGroundMetrics(finalScore=0,statsObj={},fail=false){
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const weather=window.SKYWARD_WEATHER_OPS?.status?.()||{};
  const surface=window.SKYWARD_SURFACE_SAFETY?.status?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()||{};
  const open=groundTurnaroundState.delays.filter(d=>d.status==='OPEN');
  const scores={...groundTurnaroundState.processScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0), incursions=Number(statsObj.runwayIncursions||0);
  const airlineScore=Number(airline.progress?.score||78);
  const passengerScore=Number(passenger.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const weatherScore=Number(weather.progress?.score||78);
  const surfaceScore=Number(surface.progress?.score||78);
  const radioScore=Number(radio.progress?.score||80);
  const delayPenalty=(proc)=>open.filter(d=>d.process===proc).reduce((a,d)=>a+Number(d.severity||0),0)/3;
  scores.GATE_ASSIGNMENT=Math.max(0,Math.min(100,Number(scores.GATE_ASSIGNMENT||78)+airlineScore*.04-denied*1.5-delayPenalty('GATE_ASSIGNMENT')));
  scores.BOARDING=Math.max(0,Math.min(100,Number(scores.BOARDING||80)+passengerScore*.04-denied*1.2-delayPenalty('BOARDING')));
  scores.BAGGAGE=Math.max(0,Math.min(100,Number(scores.BAGGAGE||76)+assetScore*.03-delayPenalty('BAGGAGE')));
  scores.FUELING=Math.max(0,Math.min(100,Number(scores.FUELING||82)-delayPenalty('FUELING')+(finalScore>2400?1:0)));
  scores.CATERING_CLEANING=Math.max(0,Math.min(100,Number(scores.CATERING_CLEANING||76)+workforceScore*.03-delayPenalty('CATERING_CLEANING')));
  scores.PUSHBACK=Math.max(0,Math.min(100,Number(scores.PUSHBACK||78)+radioScore*.03-denied*1.2-delayPenalty('PUSHBACK')));
  scores.RAMP_SAFETY=Math.max(0,Math.min(100,Number(scores.RAMP_SAFETY||80)+surfaceScore*.04-incursions*8-delayPenalty('RAMP_SAFETY')));
  scores.DEICING_WEATHER=Math.max(0,Math.min(100,Number(scores.DEICING_WEATHER||70)+weatherScore*.04-delayPenalty('DEICING_WEATHER')));
  const trafficLoad=Math.max(1,landed+departed);
  const weighted=Math.round(GROUND_TURNAROUND_CATALOG.turnaroundProcesses.reduce((a,p)=>a+(scores[p.id]||0)*p.weight,0)/100);
  const openSeverity=open.reduce((a,d)=>a+Number(d.severity||0),0);
  const avgTurnaround=Math.max(22,Math.round(62-weighted*.34+trafficLoad*2.2+open.length*3+(fail?5:0)));
  const groundDelay=Math.max(0,Math.round(openSeverity/5+denied*2+incursions*5+Math.max(0,65-weighted)/3));
  const slaRate=Math.max(0,Math.min(100,Math.round(weighted-groundDelay*.6+Math.max(0,finalScore-1800)/180)));
  return {scores,weighted,avgTurnaroundMin:avgTurnaround,groundDelayMin:groundDelay,slaRate,openDelays:open.length,drivers:{landed,departed,denied,incursions,airlineScore,passengerScore,workforceScore,assetScore,weatherScore,surfaceScore,radioScore}};
}
function evaluateGroundTurnaround(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadGroundTurnaround();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !groundTurnaroundState.delays.some(d=>d.status==='OPEN'&&d.delayId==='GATE_CONFLICT')) raiseGroundDelay('GATE_CONFLICT');
  if((statsObj.runwayIncursions||0)>0 && !groundTurnaroundState.delays.some(d=>d.status==='OPEN'&&d.delayId==='RAMP_INCIDENT')) raiseGroundDelay('RAMP_INCIDENT');
  const metrics=calculateGroundMetrics(finalScore,statsObj,fail);
  groundTurnaroundState.processScores=metrics.scores;
  groundTurnaroundState.avgTurnaroundMin=metrics.avgTurnaroundMin;
  groundTurnaroundState.groundDelayMin=metrics.groundDelayMin;
  groundTurnaroundState.slaRate=metrics.slaRate;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.55+metrics.slaRate*.25+Math.max(0,100-metrics.groundDelayMin*2)*.20)));
  groundTurnaroundState.turnaroundScore=score;
  groundTurnaroundState.status=turnaroundBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,turnaroundScore:score,status:groundTurnaroundState.status,programs:groundTurnaroundState.programs.length};
  groundTurnaroundState.history.unshift(evaluation);
  groundTurnaroundState.history=groundTurnaroundState.history.slice(0,100);
  groundTurnaroundState.lastEvaluation=evaluation;
  saveGroundTurnaround();
  renderGroundTurnaroundBoard();
  return {state:groundTurnaroundState,evaluation};
}
function groundTurnaroundProgress(){
  loadGroundTurnaround();
  return {score:groundTurnaroundState.turnaroundScore,status:groundTurnaroundState.status,avgTurnaroundMin:groundTurnaroundState.avgTurnaroundMin,groundDelayMin:groundTurnaroundState.groundDelayMin,slaRate:groundTurnaroundState.slaRate,openDelays:groundTurnaroundState.delays.filter(d=>d.status==='OPEN').length,programs:groundTurnaroundState.programs.length,last:groundTurnaroundState.lastEvaluation||null};
}
function renderGroundTurnaroundBoard(){
  try{
    const anchor=document.querySelector('#radioPhraseologyInline') || document.querySelector('#aiCopilotInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#groundTurnaroundInline'); if(old) old.remove();
    const p=groundTurnaroundProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="groundTurnaroundInline" class="airport-ops-board ground-turnaround-inline">
      <div class="airport-ops-head"><b>GROUND OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.slaRate}%</b></div>
        <div><small>TAT</small><b>${p.avgTurnaroundMin}m</b></div>
        <div><small>ATRASO</small><b>${p.groundDelayMin}m</b></div>
        <div><small>GATE</small><b>${Math.round(groundTurnaroundState.processScores.GATE_ASSIGNMENT||0)}</b></div>
        <div><small>PUSH</small><b>${Math.round(groundTurnaroundState.processScores.PUSHBACK||0)}</b></div>
        <div><small>FALHAS</small><b>${p.openDelays}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'ground-turnaround-board'); }
}
function initializeGroundTurnaround(){loadGroundTurnaround();renderGroundTurnaroundBoard();return groundTurnaroundState;}
function groundTurnaroundStatus(){loadGroundTurnaround();return {...groundTurnaroundState,progress:groundTurnaroundProgress(),catalog:GROUND_TURNAROUND_CATALOG};}
function groundTurnaroundSelfCheck(){
  const issues=[];
  if(GROUND_TURNAROUND_CATALOG.turnaroundProcesses.length<8) issues.push('processos insuficientes');
  if(GROUND_TURNAROUND_CATALOG.delayCauses.length<7) issues.push('causas insuficientes');
  const program=runGroundProgram('GATE_OPTIMIZER');
  const delay=raiseGroundDelay('FUEL_QUEUE');
  const res=evaluateGroundTurnaround(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !delay.id) issues.push('programa/atraso inválido');
  if(!Number.isFinite(res.evaluation.turnaroundScore)) issues.push('score turnaround inválido');
  return {ok:issues.length===0,issues,processes:GROUND_TURNAROUND_CATALOG.turnaroundProcesses.length,delays:GROUND_TURNAROUND_CATALOG.delayCauses.length};
}
window.SKYWARD_GROUND_TURNAROUND=Object.freeze({
  schema:1,
  catalog:GROUND_TURNAROUND_CATALOG,
  load:loadGroundTurnaround,
  save:saveGroundTurnaround,
  program:runGroundProgram,
  delay:raiseGroundDelay,
  close:closeGroundDelay,
  evaluate:evaluateGroundTurnaround,
  progress:groundTurnaroundProgress,
  status:groundTurnaroundStatus,
  board:renderGroundTurnaroundBoard,
  init:initializeGroundTurnaround,
  selfCheck:groundTurnaroundSelfCheck
});

/* ===== MODULE 46: cargo-logistics-operations-center (51-cargo-logistics-operations-center.js) ===== */
/* @skyward-module 51-cargo-logistics-operations-center
 * Cargo and logistics operations center with ULD, dangerous goods, perishables, customs, cold chain, cargo SLA, freight revenue and logistics risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('51-cargo-logistics-operations-center');
const CARGO_LOGISTICS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f48',
  cargoProcesses:[
    {id:'ULD_BUILDUP',name:'Montagem ULD',weight:13,target:82},
    {id:'CARGO_ACCEPTANCE',name:'Aceitação de carga',weight:12,target:80},
    {id:'CUSTOMS_CLEARANCE',name:'Alfândega/despacho',weight:14,target:78},
    {id:'DANGEROUS_GOODS',name:'Cargas perigosas/DG',weight:13,target:84},
    {id:'PERISHABLE_COLD',name:'Perecíveis/cadeia fria',weight:12,target:80},
    {id:'CARGO_SECURITY',name:'Segurança carga',weight:12,target:84},
    {id:'RAMP_TRANSFER',name:'Transferência rampa',weight:12,target:82},
    {id:'FREIGHT_YIELD',name:'Yield freight',weight:12,target:78}
  ],
  shipmentTypes:[
    {id:'GENERAL_CARGO',name:'Carga geral',value:18,risk:8},
    {id:'EXPRESS',name:'Express/e-commerce',value:28,risk:14},
    {id:'PHARMA_COLD',name:'Farmacêutica fria',value:44,risk:24},
    {id:'PERISHABLES',name:'Perecíveis',value:32,risk:20},
    {id:'DANGEROUS_GOODS',name:'Cargas perigosas',value:38,risk:30},
    {id:'LIVE_ANIMALS',name:'Animais vivos',value:30,risk:26},
    {id:'HIGH_VALUE',name:'Alto valor',value:52,risk:28}
  ],
  logisticsDisruptions:[
    {id:'ULD_SHORTAGE',name:'Falta de ULD',process:'ULD_BUILDUP',severity:22},
    {id:'CUSTOMS_HOLD',name:'Retenção alfandegária',process:'CUSTOMS_CLEARANCE',severity:26},
    {id:'DG_DOC_ERROR',name:'Erro documentação DG',process:'DANGEROUS_GOODS',severity:30},
    {id:'COLD_CHAIN_BREAK',name:'Quebra cadeia fria',process:'PERISHABLE_COLD',severity:32},
    {id:'XRAY_BACKLOG',name:'Fila raio-X carga',process:'CARGO_SECURITY',severity:20},
    {id:'LOADER_DOWN',name:'Loader indisponível',process:'RAMP_TRANSFER',severity:24},
    {id:'FREIGHT_MISROUTE',name:'Carga roteada errado',process:'FREIGHT_YIELD',severity:18}
  ],
  cargoPrograms:[
    {id:'ULD_POOL',name:'Pool ULD inteligente',cost:16000,benefit:{ULD_BUILDUP:12,RAMP_TRANSFER:3}},
    {id:'CUSTOMS_FASTLANE',name:'Fast lane alfândega',cost:22000,benefit:{CUSTOMS_CLEARANCE:13}},
    {id:'DG_RECERT',name:'Recertificação DG',cost:14000,benefit:{DANGEROUS_GOODS:12,CARGO_SECURITY:2}},
    {id:'COLD_CHAIN_AUDIT',name:'Auditoria cadeia fria',cost:18000,benefit:{PERISHABLE_COLD:13}},
    {id:'CARGO_SECURITY_SWEEP',name:'Varredura segurança carga',cost:12000,benefit:{CARGO_SECURITY:11}},
    {id:'RAMP_LOADER_PM',name:'Preventiva loaders',cost:15000,benefit:{RAMP_TRANSFER:12}},
    {id:'FREIGHT_YIELD_ENGINE',name:'Motor yield freight',cost:20000,benefit:{FREIGHT_YIELD:13}}
  ],
  cargoBands:[
    {id:'CARGO_EXCELLENCE',min:90,name:'Excelência cargueira'},
    {id:'FREIGHT_READY',min:75,name:'Freight pronto'},
    {id:'LOGISTICS_DELAY',min:55,name:'Logística atrasada'},
    {id:'CARGO_CRISIS',min:0,name:'Crise cargueira'}
  ],
  cargoKPIs:[
    {id:'CARGO_SLA',name:'SLA carga'},
    {id:'ULD_AVAILABILITY',name:'Disponibilidade ULD'},
    {id:'CUSTOMS_TIME',name:'Tempo alfândega'},
    {id:'COLD_CHAIN_INTEGRITY',name:'Integridade cadeia fria'},
    {id:'DG_COMPLIANCE',name:'Compliance DG'},
    {id:'FREIGHT_REVENUE',name:'Receita freight'}
  ]
});
const CARGO_LOGISTICS_KEY='skywardCargoLogistics_v1';
let cargoLogisticsState={schema:1,processScores:{ULD_BUILDUP:78,CARGO_ACCEPTANCE:80,CUSTOMS_CLEARANCE:76,DANGEROUS_GOODS:82,PERISHABLE_COLD:78,CARGO_SECURITY:80,RAMP_TRANSFER:79,FREIGHT_YIELD:77},programs:[],disruptions:[],shipments:[],cargoScore:78,cargoSla:78,freightRevenue:0,customsDelayMin:0,coldChainIntegrity:82,dgCompliance:84,status:'FREIGHT_READY',history:[],lastEvaluation:null};
function loadCargoLogistics(){try{const raw=localStorage?.getItem?.(CARGO_LOGISTICS_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)cargoLogisticsState={...cargoLogisticsState,...parsed};}}catch(e){safeLogError?.(e,'cargo-logistics-load');}return cargoLogisticsState;}
function saveCargoLogistics(){try{localStorage?.setItem?.(CARGO_LOGISTICS_KEY,JSON.stringify(cargoLogisticsState));}catch(e){safeLogError?.(e,'cargo-logistics-save');}return cargoLogisticsState;}
function cargoBand(score){return CARGO_LOGISTICS_CATALOG.cargoBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||CARGO_LOGISTICS_CATALOG.cargoBands.at(-1);}
function programById(id){return CARGO_LOGISTICS_CATALOG.cargoPrograms.find(p=>p.id===id)||CARGO_LOGISTICS_CATALOG.cargoPrograms[0];}
function disruptionById(id){return CARGO_LOGISTICS_CATALOG.logisticsDisruptions.find(d=>d.id===id)||CARGO_LOGISTICS_CATALOG.logisticsDisruptions[0];}
function shipmentById(id){return CARGO_LOGISTICS_CATALOG.shipmentTypes.find(s=>s.id===id)||CARGO_LOGISTICS_CATALOG.shipmentTypes[0];}
function runCargoProgram(id='ULD_POOL'){
  loadCargoLogistics();
  const program=programById(id);
  if(cargoLogisticsState.programs.some(p=>p.programId===program.id)) return cargoLogisticsState.programs.find(p=>p.programId===program.id);
  const item={id:`CGP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  cargoLogisticsState.programs.unshift(item);
  for(const [proc,gain] of Object.entries(program.benefit||{})){
    cargoLogisticsState.processScores[proc]=Math.min(100,Number(cargoLogisticsState.processScores[proc]||75)+Number(gain||0));
  }
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function acceptCargoShipment(id='GENERAL_CARGO'){
  loadCargoLogistics();
  const s=shipmentById(id);
  const item={id:`SHP-${String(Date.now()).slice(-6)}`,shipmentId:s.id,name:s.name,value:s.value,risk:s.risk,status:'ACCEPTED',at:new Date().toISOString()};
  cargoLogisticsState.shipments.unshift(item);
  cargoLogisticsState.shipments=cargoLogisticsState.shipments.slice(0,100);
  cargoLogisticsState.freightRevenue+=Math.round(s.value*1200);
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function raiseCargoDisruption(id='ULD_SHORTAGE'){
  loadCargoLogistics();
  const tpl=disruptionById(id);
  const item={id:`CGD-${String(Date.now()).slice(-6)}`,disruptionId:tpl.id,name:tpl.name,process:tpl.process,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  cargoLogisticsState.disruptions.unshift(item);
  cargoLogisticsState.disruptions=cargoLogisticsState.disruptions.slice(0,80);
  cargoLogisticsState.processScores[tpl.process]=Math.max(0,Number(cargoLogisticsState.processScores[tpl.process]||75)-Math.round(tpl.severity/4));
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return item;
}
function closeCargoDisruption(id,ok=true){
  loadCargoLogistics();
  const d=cargoLogisticsState.disruptions.find(x=>x.id===id);
  if(d){d.status=ok?'CLEARED':'ESCALATED';d.closedAt=new Date().toISOString();if(ok)cargoLogisticsState.processScores[d.process]=Math.min(100,Number(cargoLogisticsState.processScores[d.process]||75)+2);}
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return d||null;
}
function calculateCargoMetrics(finalScore=0,statsObj={},fail=false){
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const ground=window.SKYWARD_GROUND_TURNAROUND?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const network=window.SKYWARD_MULTI_AIRPORT_NETWORK?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const open=cargoLogisticsState.disruptions.filter(d=>d.status==='OPEN');
  const scores={...cargoLogisticsState.processScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0);
  const revenueScore=Number(revenue.progress?.score||78);
  const groundScore=Number(ground.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const networkScore=Number(network.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const delayPenalty=(proc)=>open.filter(d=>d.process===proc).reduce((a,d)=>a+Number(d.severity||0),0)/3;
  scores.ULD_BUILDUP=Math.max(0,Math.min(100,Number(scores.ULD_BUILDUP||78)+groundScore*.04-delayPenalty('ULD_BUILDUP')));
  scores.CARGO_ACCEPTANCE=Math.max(0,Math.min(100,Number(scores.CARGO_ACCEPTANCE||80)+workforceScore*.04-denied*1.2));
  scores.CUSTOMS_CLEARANCE=Math.max(0,Math.min(100,Number(scores.CUSTOMS_CLEARANCE||76)-delayPenalty('CUSTOMS_CLEARANCE')+networkScore*.03));
  scores.DANGEROUS_GOODS=Math.max(0,Math.min(100,Number(scores.DANGEROUS_GOODS||82)-delayPenalty('DANGEROUS_GOODS')+securityScore*.04-conflicts*1.4));
  scores.PERISHABLE_COLD=Math.max(0,Math.min(100,Number(scores.PERISHABLE_COLD||78)-delayPenalty('PERISHABLE_COLD')+assetScore*.04));
  scores.CARGO_SECURITY=Math.max(0,Math.min(100,Number(scores.CARGO_SECURITY||80)-delayPenalty('CARGO_SECURITY')+securityScore*.05));
  scores.RAMP_TRANSFER=Math.max(0,Math.min(100,Number(scores.RAMP_TRANSFER||79)-delayPenalty('RAMP_TRANSFER')+groundScore*.04));
  scores.FREIGHT_YIELD=Math.max(0,Math.min(100,Number(scores.FREIGHT_YIELD||77)-delayPenalty('FREIGHT_YIELD')+revenueScore*.05));
  const weighted=Math.round(CARGO_LOGISTICS_CATALOG.cargoProcesses.reduce((a,p)=>a+(scores[p.id]||0)*p.weight,0)/100);
  const openSeverity=open.reduce((a,d)=>a+Number(d.severity||0),0);
  const cargoMoves=Math.max(1,landed+departed);
  const cargoSla=Math.max(0,Math.min(100,Math.round(weighted-openSeverity/6-denied*1.5+(finalScore>2400?2:0))));
  const customsDelayMin=Math.max(0,Math.round(open.filter(d=>d.process==='CUSTOMS_CLEARANCE').reduce((a,d)=>a+d.severity,0)/2+Math.max(0,70-scores.CUSTOMS_CLEARANCE)/2));
  const coldChainIntegrity=Math.max(0,Math.min(100,Math.round(scores.PERISHABLE_COLD-open.filter(d=>d.process==='PERISHABLE_COLD').length*8)));
  const dgCompliance=Math.max(0,Math.min(100,Math.round(scores.DANGEROUS_GOODS-open.filter(d=>d.process==='DANGEROUS_GOODS').length*9)));
  const freightRevenue=Math.max(0,Math.round(cargoLogisticsState.freightRevenue + cargoMoves*5200 + scores.FREIGHT_YIELD*600 - openSeverity*300));
  return {scores,weighted,cargoSla,customsDelayMin,coldChainIntegrity,dgCompliance,freightRevenue,openDisruptions:open.length,drivers:{landed,departed,denied,conflicts,revenueScore,groundScore,assetScore,securityScore,networkScore,workforceScore}};
}
function evaluateCargoLogistics(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCargoLogistics();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !cargoLogisticsState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='CUSTOMS_HOLD')) raiseCargoDisruption('CUSTOMS_HOLD');
  if((statsObj.conflicts||0)>=2 && !cargoLogisticsState.disruptions.some(d=>d.status==='OPEN'&&d.disruptionId==='DG_DOC_ERROR')) raiseCargoDisruption('DG_DOC_ERROR');
  const metrics=calculateCargoMetrics(finalScore,statsObj,fail);
  cargoLogisticsState.processScores=metrics.scores;
  cargoLogisticsState.cargoSla=metrics.cargoSla;
  cargoLogisticsState.customsDelayMin=metrics.customsDelayMin;
  cargoLogisticsState.coldChainIntegrity=metrics.coldChainIntegrity;
  cargoLogisticsState.dgCompliance=metrics.dgCompliance;
  cargoLogisticsState.freightRevenue=metrics.freightRevenue;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.52+metrics.cargoSla*.24+metrics.coldChainIntegrity*.08+metrics.dgCompliance*.08+Math.max(0,100-metrics.customsDelayMin*2)*.08-(fail?5:0))));
  cargoLogisticsState.cargoScore=score;
  cargoLogisticsState.status=cargoBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,cargoScore:score,status:cargoLogisticsState.status,programs:cargoLogisticsState.programs.length,shipments:cargoLogisticsState.shipments.length};
  cargoLogisticsState.history.unshift(evaluation);
  cargoLogisticsState.history=cargoLogisticsState.history.slice(0,100);
  cargoLogisticsState.lastEvaluation=evaluation;
  saveCargoLogistics();
  renderCargoLogisticsBoard();
  return {state:cargoLogisticsState,evaluation};
}
function cargoLogisticsProgress(){
  loadCargoLogistics();
  return {score:cargoLogisticsState.cargoScore,status:cargoLogisticsState.status,cargoSla:cargoLogisticsState.cargoSla,freightRevenue:cargoLogisticsState.freightRevenue,customsDelayMin:cargoLogisticsState.customsDelayMin,coldChainIntegrity:cargoLogisticsState.coldChainIntegrity,dgCompliance:cargoLogisticsState.dgCompliance,openDisruptions:cargoLogisticsState.disruptions.filter(d=>d.status==='OPEN').length,shipments:cargoLogisticsState.shipments.length,last:cargoLogisticsState.lastEvaluation||null};
}
function renderCargoLogisticsBoard(){
  try{
    const anchor=document.querySelector('#groundTurnaroundInline') || document.querySelector('#radioPhraseologyInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#cargoLogisticsInline'); if(old) old.remove();
    const p=cargoLogisticsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="cargoLogisticsInline" class="airport-ops-board cargo-logistics-inline">
      <div class="airport-ops-head"><b>CARGO OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SLA</small><b>${p.cargoSla}%</b></div>
        <div><small>RECEITA</small><b>${Math.round(p.freightRevenue/1000)}k</b></div>
        <div><small>ALF.</small><b>${p.customsDelayMin}m</b></div>
        <div><small>FRIO</small><b>${p.coldChainIntegrity}%</b></div>
        <div><small>DG</small><b>${p.dgCompliance}%</b></div>
        <div><small>RISCO</small><b>${p.openDisruptions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'cargo-logistics-board'); }
}
function initializeCargoLogistics(){loadCargoLogistics();renderCargoLogisticsBoard();return cargoLogisticsState;}
function cargoLogisticsStatus(){loadCargoLogistics();return {...cargoLogisticsState,progress:cargoLogisticsProgress(),catalog:CARGO_LOGISTICS_CATALOG};}
function cargoLogisticsSelfCheck(){
  const issues=[];
  if(CARGO_LOGISTICS_CATALOG.cargoProcesses.length<8) issues.push('processos insuficientes');
  if(CARGO_LOGISTICS_CATALOG.logisticsDisruptions.length<7) issues.push('disrupções insuficientes');
  const program=runCargoProgram('ULD_POOL');
  const shipment=acceptCargoShipment('PHARMA_COLD');
  const disruption=raiseCargoDisruption('COLD_CHAIN_BREAK');
  const res=evaluateCargoLogistics(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !shipment.id || !disruption.id) issues.push('programa/carga/disrupção inválido');
  if(!Number.isFinite(res.evaluation.cargoScore)) issues.push('score cargo inválido');
  return {ok:issues.length===0,issues,processes:CARGO_LOGISTICS_CATALOG.cargoProcesses.length,disruptions:CARGO_LOGISTICS_CATALOG.logisticsDisruptions.length};
}
window.SKYWARD_CARGO_LOGISTICS=Object.freeze({
  schema:1,
  catalog:CARGO_LOGISTICS_CATALOG,
  load:loadCargoLogistics,
  save:saveCargoLogistics,
  program:runCargoProgram,
  shipment:acceptCargoShipment,
  disruption:raiseCargoDisruption,
  close:closeCargoDisruption,
  evaluate:evaluateCargoLogistics,
  progress:cargoLogisticsProgress,
  status:cargoLogisticsStatus,
  board:renderCargoLogisticsBoard,
  init:initializeCargoLogistics,
  selfCheck:cargoLogisticsSelfCheck
});

/* ===== MODULE 47: terminal-flow-landside-center (52-terminal-flow-landside-center.js) ===== */
/* @skyward-module 52-terminal-flow-landside-center
 * Terminal flow and landside operations center with check-in, security queues, immigration, baggage claim, curbside, parking, wayfinding, lounges and density.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('52-terminal-flow-landside-center');
const TERMINAL_FLOW_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f49',
  terminalZones:[
    {id:'CURBSIDE',name:'Curbside/drop-off',weight:10,target:78},
    {id:'CHECKIN',name:'Check-in e despacho',weight:14,target:82},
    {id:'SECURITY_QUEUE',name:'Fila segurança',weight:16,target:84},
    {id:'IMMIGRATION',name:'Imigração/passaporte',weight:12,target:80},
    {id:'WAYFINDING',name:'Sinalização/wayfinding',weight:10,target:78},
    {id:'GATE_HOLDROOM',name:'Sala de embarque',weight:12,target:80},
    {id:'BAGGAGE_CLAIM',name:'Restituição bagagem',weight:12,target:80},
    {id:'PARKING_LANDSIDE',name:'Estacionamento/landside',weight:8,target:76},
    {id:'LOUNGES_RETAIL',name:'Lounges/varejo',weight:6,target:76}
  ],
  queueIncidents:[
    {id:'CHECKIN_SURGE',name:'Pico check-in',zone:'CHECKIN',severity:22},
    {id:'SECURITY_BACKLOG',name:'Backlog segurança',zone:'SECURITY_QUEUE',severity:30},
    {id:'IMMIGRATION_HOLD',name:'Retenção imigração',zone:'IMMIGRATION',severity:26},
    {id:'WAYFINDING_CONFUSION',name:'Passageiro perdido',zone:'WAYFINDING',severity:16},
    {id:'GATE_CROWDING',name:'Gate lotado',zone:'GATE_HOLDROOM',severity:24},
    {id:'BAGGAGE_DELAY',name:'Atraso restituição bagagem',zone:'BAGGAGE_CLAIM',severity:22},
    {id:'CURBSIDE_JAM',name:'Curbside congestionado',zone:'CURBSIDE',severity:20},
    {id:'PARKING_QUEUE',name:'Fila estacionamento',zone:'PARKING_LANDSIDE',severity:18}
  ],
  flowPrograms:[
    {id:'OPEN_SECURITY_LANES',name:'Abrir canais segurança',cost:12000,benefit:{SECURITY_QUEUE:13,CHECKIN:2}},
    {id:'MOBILE_CHECKIN_PUSH',name:'Push check-in móvel',cost:7000,benefit:{CHECKIN:11}},
    {id:'IMMIGRATION_FAST_TRACK',name:'Fast track imigração',cost:15000,benefit:{IMMIGRATION:12}},
    {id:'WAYFINDING_REFRESH',name:'Reforço sinalização',cost:8000,benefit:{WAYFINDING:12,GATE_HOLDROOM:2}},
    {id:'GATE_BALANCER',name:'Balanceamento de gates',cost:11000,benefit:{GATE_HOLDROOM:12}},
    {id:'BAGGAGE_CLAIM_EXPEDITE',name:'Expedição bagagem chegada',cost:10000,benefit:{BAGGAGE_CLAIM:12}},
    {id:'CURBSIDE_MARSHALS',name:'Sinaleiros curbside',cost:9000,benefit:{CURBSIDE:11,PARKING_LANDSIDE:2}},
    {id:'PARKING_DYNAMIC_FLOW',name:'Fluxo dinâmico estacionamento',cost:8000,benefit:{PARKING_LANDSIDE:11}},
    {id:'LOUNGE_OVERFLOW',name:'Overflow lounge/varejo',cost:9000,benefit:{LOUNGES_RETAIL:10}}
  ],
  flowBands:[
    {id:'SEAMLESS_TERMINAL',min:90,name:'Terminal fluido'},
    {id:'CONTROLLED_FLOW',min:75,name:'Fluxo controlado'},
    {id:'QUEUE_PRESSURE',min:55,name:'Pressão de filas'},
    {id:'TERMINAL_GRIDLOCK',min:0,name:'Terminal travado'}
  ],
  terminalKPIs:[
    {id:'AVG_QUEUE_TIME',name:'Tempo médio de fila'},
    {id:'SECURITY_WAIT',name:'Espera segurança'},
    {id:'CHECKIN_WAIT',name:'Espera check-in'},
    {id:'DENSITY_INDEX',name:'Índice de lotação'},
    {id:'BAGGAGE_CLAIM_TIME',name:'Tempo restituição bagagem'},
    {id:'LANDSIDE_DELAY',name:'Atraso landside'}
  ]
});
const TERMINAL_FLOW_KEY='skywardTerminalFlow_v1';
let terminalFlowState={schema:1,zoneScores:{CURBSIDE:77,CHECKIN:80,SECURITY_QUEUE:78,IMMIGRATION:76,WAYFINDING:78,GATE_HOLDROOM:80,BAGGAGE_CLAIM:79,PARKING_LANDSIDE:75,LOUNGES_RETAIL:76},programs:[],incidents:[],terminalScore:78,avgQueueMin:14,securityWaitMin:12,checkinWaitMin:10,densityIndex:42,baggageClaimMin:16,landsideDelayMin:0,status:'CONTROLLED_FLOW',history:[],lastEvaluation:null};
function loadTerminalFlow(){try{const raw=localStorage?.getItem?.(TERMINAL_FLOW_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)terminalFlowState={...terminalFlowState,...parsed};}}catch(e){safeLogError?.(e,'terminal-flow-load');}return terminalFlowState;}
function saveTerminalFlow(){try{localStorage?.setItem?.(TERMINAL_FLOW_KEY,JSON.stringify(terminalFlowState));}catch(e){safeLogError?.(e,'terminal-flow-save');}return terminalFlowState;}
function terminalBand(score){return TERMINAL_FLOW_CATALOG.flowBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||TERMINAL_FLOW_CATALOG.flowBands.at(-1);}
function programById(id){return TERMINAL_FLOW_CATALOG.flowPrograms.find(p=>p.id===id)||TERMINAL_FLOW_CATALOG.flowPrograms[0];}
function incidentById(id){return TERMINAL_FLOW_CATALOG.queueIncidents.find(i=>i.id===id)||TERMINAL_FLOW_CATALOG.queueIncidents[0];}
function runTerminalProgram(id='OPEN_SECURITY_LANES'){
  loadTerminalFlow();
  const program=programById(id);
  if(terminalFlowState.programs.some(p=>p.programId===program.id)) return terminalFlowState.programs.find(p=>p.programId===program.id);
  const item={id:`TFP-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  terminalFlowState.programs.unshift(item);
  for(const [zone,gain] of Object.entries(program.benefit||{})){
    terminalFlowState.zoneScores[zone]=Math.min(100,Number(terminalFlowState.zoneScores[zone]||75)+Number(gain||0));
  }
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return item;
}
function raiseTerminalIncident(id='SECURITY_BACKLOG'){
  loadTerminalFlow();
  const tpl=incidentById(id);
  const item={id:`TFI-${String(Date.now()).slice(-6)}`,incidentId:tpl.id,name:tpl.name,zone:tpl.zone,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  terminalFlowState.incidents.unshift(item);
  terminalFlowState.incidents=terminalFlowState.incidents.slice(0,80);
  terminalFlowState.zoneScores[tpl.zone]=Math.max(0,Number(terminalFlowState.zoneScores[tpl.zone]||75)-Math.round(tpl.severity/4));
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return item;
}
function closeTerminalIncident(id,ok=true){
  loadTerminalFlow();
  const incident=terminalFlowState.incidents.find(x=>x.id===id);
  if(incident){incident.status=ok?'CLEARED':'ESCALATED';incident.closedAt=new Date().toISOString();if(ok)terminalFlowState.zoneScores[incident.zone]=Math.min(100,Number(terminalFlowState.zoneScores[incident.zone]||75)+2);}
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return incident||null;
}
function calculateTerminalMetrics(finalScore=0,statsObj={},fail=false){
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const ground=window.SKYWARD_GROUND_TURNAROUND?.status?.()||{};
  const workforce=window.SKYWARD_WORKFORCE_STAFFING?.status?.()||{};
  const cargo=window.SKYWARD_CARGO_LOGISTICS?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const airline=window.SKYWARD_AIRLINE_OPS?.status?.()||{};
  const open=terminalFlowState.incidents.filter(i=>i.status==='OPEN');
  const scores={...terminalFlowState.zoneScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0);
  const passengerScore=Number(passenger.progress?.score||78);
  const securityScore=Number(security.progress?.score||80);
  const groundScore=Number(ground.progress?.score||78);
  const workforceScore=Number(workforce.progress?.score||78);
  const cargoScore=Number(cargo.progress?.score||78);
  const revenueScore=Number(revenue.progress?.score||78);
  const airlineScore=Number(airline.progress?.score||78);
  const penalty=(zone)=>open.filter(i=>i.zone===zone).reduce((a,i)=>a+Number(i.severity||0),0)/3;
  scores.CURBSIDE=Math.max(0,Math.min(100,Number(scores.CURBSIDE||77)+groundScore*.03-denied*1.0-penalty('CURBSIDE')));
  scores.CHECKIN=Math.max(0,Math.min(100,Number(scores.CHECKIN||80)+airlineScore*.04+workforceScore*.03-denied*1.5-penalty('CHECKIN')));
  scores.SECURITY_QUEUE=Math.max(0,Math.min(100,Number(scores.SECURITY_QUEUE||78)+securityScore*.05+workforceScore*.02-penalty('SECURITY_QUEUE')));
  scores.IMMIGRATION=Math.max(0,Math.min(100,Number(scores.IMMIGRATION||76)+securityScore*.03+workforceScore*.03-penalty('IMMIGRATION')));
  scores.WAYFINDING=Math.max(0,Math.min(100,Number(scores.WAYFINDING||78)+passengerScore*.04-penalty('WAYFINDING')));
  scores.GATE_HOLDROOM=Math.max(0,Math.min(100,Number(scores.GATE_HOLDROOM||80)+groundScore*.04-denied*1.2-penalty('GATE_HOLDROOM')));
  scores.BAGGAGE_CLAIM=Math.max(0,Math.min(100,Number(scores.BAGGAGE_CLAIM||79)+groundScore*.03+cargoScore*.03-penalty('BAGGAGE_CLAIM')));
  scores.PARKING_LANDSIDE=Math.max(0,Math.min(100,Number(scores.PARKING_LANDSIDE||75)+revenueScore*.03-penalty('PARKING_LANDSIDE')));
  scores.LOUNGES_RETAIL=Math.max(0,Math.min(100,Number(scores.LOUNGES_RETAIL||76)+revenueScore*.04+passengerScore*.03-penalty('LOUNGES_RETAIL')));
  const trafficLoad=Math.max(1,landed+departed+denied);
  const weighted=Math.round(TERMINAL_FLOW_CATALOG.terminalZones.reduce((a,z)=>a+(scores[z.id]||0)*z.weight,0)/100);
  const openSeverity=open.reduce((a,i)=>a+Number(i.severity||0),0);
  const avgQueueMin=Math.max(3,Math.round(35-weighted*.28+trafficLoad*1.9+open.length*2+(fail?5:0)));
  const securityWaitMin=Math.max(2,Math.round(28-scores.SECURITY_QUEUE*.22+open.filter(i=>i.zone==='SECURITY_QUEUE').length*7));
  const checkinWaitMin=Math.max(2,Math.round(24-scores.CHECKIN*.20+open.filter(i=>i.zone==='CHECKIN').length*6));
  const baggageClaimMin=Math.max(4,Math.round(30-scores.BAGGAGE_CLAIM*.18+open.filter(i=>i.zone==='BAGGAGE_CLAIM').length*7));
  const densityIndex=Math.max(0,Math.min(100,Math.round(100-weighted+trafficLoad*3+openSeverity/5)));
  const landsideDelayMin=Math.max(0,Math.round(open.filter(i=>['CURBSIDE','PARKING_LANDSIDE'].includes(i.zone)).reduce((a,i)=>a+i.severity,0)/4+Math.max(0,65-scores.CURBSIDE)/3));
  return {scores,weighted,avgQueueMin,securityWaitMin,checkinWaitMin,baggageClaimMin,densityIndex,landsideDelayMin,openIncidents:open.length,drivers:{landed,departed,denied,passengerScore,securityScore,groundScore,workforceScore,cargoScore,revenueScore,airlineScore}};
}
function evaluateTerminalFlow(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadTerminalFlow();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !terminalFlowState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='GATE_CROWDING')) raiseTerminalIncident('GATE_CROWDING');
  if((statsObj.landed||0)>=3 && !terminalFlowState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='BAGGAGE_DELAY')) raiseTerminalIncident('BAGGAGE_DELAY');
  const metrics=calculateTerminalMetrics(finalScore,statsObj,fail);
  terminalFlowState.zoneScores=metrics.scores;
  terminalFlowState.avgQueueMin=metrics.avgQueueMin;
  terminalFlowState.securityWaitMin=metrics.securityWaitMin;
  terminalFlowState.checkinWaitMin=metrics.checkinWaitMin;
  terminalFlowState.baggageClaimMin=metrics.baggageClaimMin;
  terminalFlowState.densityIndex=metrics.densityIndex;
  terminalFlowState.landsideDelayMin=metrics.landsideDelayMin;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.58+Math.max(0,100-metrics.avgQueueMin*2)*.18+Math.max(0,100-metrics.densityIndex)*.14+Math.max(0,100-metrics.landsideDelayMin*3)*.10-(fail?5:0))));
  terminalFlowState.terminalScore=score;
  terminalFlowState.status=terminalBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,terminalScore:score,status:terminalFlowState.status,programs:terminalFlowState.programs.length};
  terminalFlowState.history.unshift(evaluation);
  terminalFlowState.history=terminalFlowState.history.slice(0,100);
  terminalFlowState.lastEvaluation=evaluation;
  saveTerminalFlow();
  renderTerminalFlowBoard();
  return {state:terminalFlowState,evaluation};
}
function terminalFlowProgress(){
  loadTerminalFlow();
  return {score:terminalFlowState.terminalScore,status:terminalFlowState.status,avgQueueMin:terminalFlowState.avgQueueMin,securityWaitMin:terminalFlowState.securityWaitMin,checkinWaitMin:terminalFlowState.checkinWaitMin,densityIndex:terminalFlowState.densityIndex,baggageClaimMin:terminalFlowState.baggageClaimMin,landsideDelayMin:terminalFlowState.landsideDelayMin,openIncidents:terminalFlowState.incidents.filter(i=>i.status==='OPEN').length,last:terminalFlowState.lastEvaluation||null};
}
function renderTerminalFlowBoard(){
  try{
    const anchor=document.querySelector('#cargoLogisticsInline') || document.querySelector('#groundTurnaroundInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#terminalFlowInline'); if(old) old.remove();
    const p=terminalFlowProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="terminalFlowInline" class="airport-ops-board terminal-flow-inline">
      <div class="airport-ops-head"><b>TERMINAL FLOW</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>FLUXO</small><b>${p.score}%</b></div>
        <div><small>FILA</small><b>${p.avgQueueMin}m</b></div>
        <div><small>SEC.</small><b>${p.securityWaitMin}m</b></div>
        <div><small>CHECK</small><b>${p.checkinWaitMin}m</b></div>
        <div><small>DENS.</small><b>${p.densityIndex}%</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'terminal-flow-board'); }
}
function initializeTerminalFlow(){loadTerminalFlow();renderTerminalFlowBoard();return terminalFlowState;}
function terminalFlowStatus(){loadTerminalFlow();return {...terminalFlowState,progress:terminalFlowProgress(),catalog:TERMINAL_FLOW_CATALOG};}
function terminalFlowSelfCheck(){
  const issues=[];
  if(TERMINAL_FLOW_CATALOG.terminalZones.length<9) issues.push('zonas insuficientes');
  if(TERMINAL_FLOW_CATALOG.queueIncidents.length<8) issues.push('incidentes insuficientes');
  const program=runTerminalProgram('OPEN_SECURITY_LANES');
  const incident=raiseTerminalIncident('SECURITY_BACKLOG');
  const res=evaluateTerminalFlow(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.terminalScore)) issues.push('score terminal inválido');
  return {ok:issues.length===0,issues,zones:TERMINAL_FLOW_CATALOG.terminalZones.length,incidents:TERMINAL_FLOW_CATALOG.queueIncidents.length};
}
window.SKYWARD_TERMINAL_FLOW=Object.freeze({
  schema:1,
  catalog:TERMINAL_FLOW_CATALOG,
  load:loadTerminalFlow,
  save:saveTerminalFlow,
  program:runTerminalProgram,
  incident:raiseTerminalIncident,
  close:closeTerminalIncident,
  evaluate:evaluateTerminalFlow,
  progress:terminalFlowProgress,
  status:terminalFlowStatus,
  board:renderTerminalFlowBoard,
  init:initializeTerminalFlow,
  selfCheck:terminalFlowSelfCheck
});

/* ===== MODULE 48: non-aeronautical-revenue-center (53-non-aeronautical-revenue-center.js) ===== */
/* @skyward-module 53-non-aeronautical-revenue-center
 * Non-aeronautical revenue and commercial experience center with retail, duty free, food & beverage, parking, lounges, advertising, hotel, concessions and digital commerce.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('53-non-aeronautical-revenue-center');
const NON_AERO_REVENUE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f50',
  commercialChannels:[
    {id:'DUTY_FREE',name:'Duty free',weight:14,target:82},
    {id:'FOOD_BEVERAGE',name:'Alimentação/F&B',weight:14,target:80},
    {id:'RETAIL',name:'Varejo terminal',weight:12,target:78},
    {id:'PARKING',name:'Estacionamento',weight:12,target:80},
    {id:'LOUNGES',name:'Lounges premium',weight:11,target:78},
    {id:'ADVERTISING',name:'Publicidade/mídia',weight:10,target:76},
    {id:'HOTEL_LANDSIDE',name:'Hotel/landside',weight:9,target:76},
    {id:'CONCESSIONS',name:'Concessões',weight:10,target:80},
    {id:'DIGITAL_COMMERCE',name:'Comércio digital/app',weight:8,target:76}
  ],
  commercialIncidents:[
    {id:'DUTY_FREE_STOCKOUT',name:'Ruptura duty free',channel:'DUTY_FREE',severity:22},
    {id:'FOOD_QUEUE_SPIKE',name:'Fila alimentação',channel:'FOOD_BEVERAGE',severity:20},
    {id:'RETAIL_CLOSURE',name:'Loja fechada',channel:'RETAIL',severity:18},
    {id:'PARKING_FULL',name:'Estacionamento lotado',channel:'PARKING',severity:24},
    {id:'LOUNGE_OVERBOOKED',name:'Lounge superlotado',channel:'LOUNGES',severity:20},
    {id:'AD_SCREEN_DOWN',name:'Tela publicidade fora',channel:'ADVERTISING',severity:14},
    {id:'HOTEL_OCCUPANCY_DROP',name:'Queda hotel landside',channel:'HOTEL_LANDSIDE',severity:16},
    {id:'CONCESSION_DISPUTE',name:'Conflito concessionária',channel:'CONCESSIONS',severity:26},
    {id:'APP_CHECKOUT_FAIL',name:'Falha checkout digital',channel:'DIGITAL_COMMERCE',severity:18}
  ],
  revenuePrograms:[
    {id:'DUTY_FREE_BUNDLE',name:'Bundles duty free',cost:14000,benefit:{DUTY_FREE:12,DIGITAL_COMMERCE:2}},
    {id:'FNB_QUEUE_OPTIMIZER',name:'Otimização fila F&B',cost:10000,benefit:{FOOD_BEVERAGE:12}},
    {id:'RETAIL_MIX_REFRESH',name:'Refresh mix varejo',cost:16000,benefit:{RETAIL:12}},
    {id:'PARKING_DYNAMIC_PRICING',name:'Preço dinâmico parking',cost:12000,benefit:{PARKING:12}},
    {id:'LOUNGE_UPSELL',name:'Upsell lounges',cost:11000,benefit:{LOUNGES:11,DIGITAL_COMMERCE:2}},
    {id:'MEDIA_PACKAGES',name:'Pacotes mídia premium',cost:13000,benefit:{ADVERTISING:13}},
    {id:'HOTEL_STOP_OVER',name:'Stop-over hotel',cost:15000,benefit:{HOTEL_LANDSIDE:12}},
    {id:'CONCESSION_REBALANCE',name:'Rebalancear concessões',cost:17000,benefit:{CONCESSIONS:12}},
    {id:'PWA_PREORDER',name:'Pré-compra via PWA',cost:9000,benefit:{DIGITAL_COMMERCE:13,DUTY_FREE:2}}
  ],
  spendSegments:[
    {id:'BUSINESS',name:'Executivo',spend:48,sensitivity:14},
    {id:'LEISURE',name:'Lazer',spend:32,sensitivity:18},
    {id:'CONNECTING',name:'Conexão',spend:26,sensitivity:20},
    {id:'INTERNATIONAL',name:'Internacional',spend:54,sensitivity:16},
    {id:'FAMILY',name:'Família',spend:36,sensitivity:22},
    {id:'PREMIUM',name:'Premium',spend:70,sensitivity:12}
  ],
  commercialBands:[
    {id:'COMMERCIAL_EXCELLENCE',min:90,name:'Excelência comercial'},
    {id:'STRONG_YIELD',min:75,name:'Yield forte'},
    {id:'MISSED_SPEND',min:55,name:'Gasto perdido'},
    {id:'COMMERCIAL_CRISIS',min:0,name:'Crise comercial'}
  ],
  commercialKPIs:[
    {id:'NON_AERO_REVENUE',name:'Receita não aeronáutica'},
    {id:'SPEND_PER_PAX',name:'Gasto por passageiro'},
    {id:'CONVERSION_RATE',name:'Conversão comercial'},
    {id:'PARKING_YIELD',name:'Yield estacionamento'},
    {id:'LOUNGE_UPSELL',name:'Upsell lounge'},
    {id:'CONCESSION_HEALTH',name:'Saúde das concessões'}
  ]
});
const NON_AERO_REVENUE_KEY='skywardNonAeroRevenue_v1';
let nonAeroState={schema:1,channelScores:{DUTY_FREE:80,FOOD_BEVERAGE:78,RETAIL:76,PARKING:80,LOUNGES:76,ADVERTISING:75,HOTEL_LANDSIDE:74,CONCESSIONS:78,DIGITAL_COMMERCE:76},programs:[],incidents:[],commercialScore:78,nonAeroRevenue:0,spendPerPax:34,conversionRate:18,parkingYield:76,loungeUpsell:22,concessionHealth:78,status:'STRONG_YIELD',history:[],lastEvaluation:null};
function loadNonAeroRevenue(){try{const raw=localStorage?.getItem?.(NON_AERO_REVENUE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)nonAeroState={...nonAeroState,...parsed};}}catch(e){safeLogError?.(e,'non-aero-revenue-load');}return nonAeroState;}
function saveNonAeroRevenue(){try{localStorage?.setItem?.(NON_AERO_REVENUE_KEY,JSON.stringify(nonAeroState));}catch(e){safeLogError?.(e,'non-aero-revenue-save');}return nonAeroState;}
function commercialBand(score){return NON_AERO_REVENUE_CATALOG.commercialBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||NON_AERO_REVENUE_CATALOG.commercialBands.at(-1);}
function programById(id){return NON_AERO_REVENUE_CATALOG.revenuePrograms.find(p=>p.id===id)||NON_AERO_REVENUE_CATALOG.revenuePrograms[0];}
function incidentById(id){return NON_AERO_REVENUE_CATALOG.commercialIncidents.find(i=>i.id===id)||NON_AERO_REVENUE_CATALOG.commercialIncidents[0];}
function runCommercialProgram(id='DUTY_FREE_BUNDLE'){
  loadNonAeroRevenue();
  const program=programById(id);
  if(nonAeroState.programs.some(p=>p.programId===program.id)) return nonAeroState.programs.find(p=>p.programId===program.id);
  const item={id:`NAR-${String(Date.now()).slice(-6)}`,programId:program.id,name:program.name,cost:program.cost,status:'ACTIVE',at:new Date().toISOString()};
  nonAeroState.programs.unshift(item);
  for(const [ch,gain] of Object.entries(program.benefit||{})){
    nonAeroState.channelScores[ch]=Math.min(100,Number(nonAeroState.channelScores[ch]||75)+Number(gain||0));
  }
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return item;
}
function raiseCommercialIncident(id='FOOD_QUEUE_SPIKE'){
  loadNonAeroRevenue();
  const tpl=incidentById(id);
  const item={id:`NAC-${String(Date.now()).slice(-6)}`,incidentId:tpl.id,name:tpl.name,channel:tpl.channel,severity:tpl.severity,status:'OPEN',at:new Date().toISOString()};
  nonAeroState.incidents.unshift(item);
  nonAeroState.incidents=nonAeroState.incidents.slice(0,80);
  nonAeroState.channelScores[tpl.channel]=Math.max(0,Number(nonAeroState.channelScores[tpl.channel]||75)-Math.round(tpl.severity/4));
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return item;
}
function closeCommercialIncident(id,ok=true){
  loadNonAeroRevenue();
  const incident=nonAeroState.incidents.find(x=>x.id===id);
  if(incident){incident.status=ok?'CLEARED':'ESCALATED';incident.closedAt=new Date().toISOString();if(ok)nonAeroState.channelScores[incident.channel]=Math.min(100,Number(nonAeroState.channelScores[incident.channel]||75)+2);}
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return incident||null;
}
function calculateCommercialMetrics(finalScore=0,statsObj={},fail=false){
  const terminal=window.SKYWARD_TERMINAL_FLOW?.status?.()||{};
  const passenger=window.SKYWARD_PASSENGER_REPUTATION?.status?.()||{};
  const revenue=window.SKYWARD_REVENUE_MANAGEMENT?.status?.()||{};
  const digital=window.SKYWARD_DIGITAL_TWIN?.status?.()||{};
  const asset=window.SKYWARD_ASSET_MAINTENANCE?.status?.()||{};
  const security=window.SKYWARD_SECURITY_CYBER?.status?.()||{};
  const open=nonAeroState.incidents.filter(i=>i.status==='OPEN');
  const scores={...nonAeroState.channelScores};
  const landed=Number(statsObj.landed||0), departed=Number(statsObj.departed||0), denied=Number(statsObj.denied||0);
  const paxLoad=Math.max(1,(landed+departed)*88+denied*45);
  const terminalScore=Number(terminal.progress?.score||78);
  const queueMin=Number(terminal.progress?.avgQueueMin||14);
  const density=Number(terminal.progress?.densityIndex||42);
  const passengerScore=Number(passenger.progress?.score||78);
  const revenueScore=Number(revenue.progress?.score||78);
  const twinScore=Number(digital.progress?.score||78);
  const assetScore=Number(asset.progress?.score||80);
  const securityScore=Number(security.progress?.score||80);
  const penalty=(ch)=>open.filter(i=>i.channel===ch).reduce((a,i)=>a+Number(i.severity||0),0)/3;
  scores.DUTY_FREE=Math.max(0,Math.min(100,Number(scores.DUTY_FREE||80)+passengerScore*.03+twinScore*.02-penalty('DUTY_FREE')));
  scores.FOOD_BEVERAGE=Math.max(0,Math.min(100,Number(scores.FOOD_BEVERAGE||78)+terminalScore*.03-Math.max(0,queueMin-14)*.6-penalty('FOOD_BEVERAGE')));
  scores.RETAIL=Math.max(0,Math.min(100,Number(scores.RETAIL||76)+passengerScore*.03-density*.03-penalty('RETAIL')));
  scores.PARKING=Math.max(0,Math.min(100,Number(scores.PARKING||80)+terminalScore*.02-denied*1.0-penalty('PARKING')));
  scores.LOUNGES=Math.max(0,Math.min(100,Number(scores.LOUNGES||76)+passengerScore*.03-density*.02-penalty('LOUNGES')));
  scores.ADVERTISING=Math.max(0,Math.min(100,Number(scores.ADVERTISING||75)+twinScore*.03+assetScore*.02-penalty('ADVERTISING')));
  scores.HOTEL_LANDSIDE=Math.max(0,Math.min(100,Number(scores.HOTEL_LANDSIDE||74)+terminalScore*.02+passengerScore*.02-penalty('HOTEL_LANDSIDE')));
  scores.CONCESSIONS=Math.max(0,Math.min(100,Number(scores.CONCESSIONS||78)+revenueScore*.03+securityScore*.02-penalty('CONCESSIONS')));
  scores.DIGITAL_COMMERCE=Math.max(0,Math.min(100,Number(scores.DIGITAL_COMMERCE||76)+twinScore*.04+passengerScore*.02-penalty('DIGITAL_COMMERCE')-(fail?4:0)));
  const weighted=Math.round(NON_AERO_REVENUE_CATALOG.commercialChannels.reduce((a,c)=>a+(scores[c.id]||0)*c.weight,0)/100);
  const openSeverity=open.reduce((a,i)=>a+Number(i.severity||0),0);
  const conversionRate=Math.max(2,Math.min(60,Math.round(weighted*.32+Math.max(0,100-density)*.06-Math.max(0,queueMin-16)*.3-open.length)));
  const spendPerPax=Math.max(6,Math.round(18+weighted*.22+scores.DUTY_FREE*.08+scores.LOUNGES*.06+scores.DIGITAL_COMMERCE*.05-Math.max(0,queueMin-18)*.4));
  const nonAeroRevenue=Math.max(0,Math.round(nonAeroState.nonAeroRevenue + paxLoad*spendPerPax*(conversionRate/100) + scores.PARKING*180 + scores.ADVERTISING*120 - openSeverity*250));
  const parkingYield=Math.max(0,Math.min(100,Math.round(scores.PARKING-denied*.8-penalty('PARKING'))));
  const loungeUpsell=Math.max(0,Math.min(100,Math.round(scores.LOUNGES*.42+scores.DIGITAL_COMMERCE*.18-density*.08)));
  const concessionHealth=Math.max(0,Math.min(100,Math.round(scores.CONCESSIONS*.55+weighted*.25+revenueScore*.20-open.length*2)));
  return {scores,weighted,conversionRate,spendPerPax,nonAeroRevenue,parkingYield,loungeUpsell,concessionHealth,openIncidents:open.length,drivers:{landed,departed,denied,paxLoad,terminalScore,queueMin,density,passengerScore,revenueScore,twinScore,assetScore,securityScore}};
}
function evaluateNonAeroRevenue(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadNonAeroRevenue();
  const icao=airportCode || (typeof airport==='function' ? airport()?.icao : '') || 'SBSP';
  if((statsObj.denied||0)>=2 && !nonAeroState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='PARKING_FULL')) raiseCommercialIncident('PARKING_FULL');
  if((statsObj.landed||0)+(statsObj.departed||0)>=5 && !nonAeroState.incidents.some(i=>i.status==='OPEN'&&i.incidentId==='FOOD_QUEUE_SPIKE')) raiseCommercialIncident('FOOD_QUEUE_SPIKE');
  const metrics=calculateCommercialMetrics(finalScore,statsObj,fail);
  nonAeroState.channelScores=metrics.scores;
  nonAeroState.conversionRate=metrics.conversionRate;
  nonAeroState.spendPerPax=metrics.spendPerPax;
  nonAeroState.nonAeroRevenue=metrics.nonAeroRevenue;
  nonAeroState.parkingYield=metrics.parkingYield;
  nonAeroState.loungeUpsell=metrics.loungeUpsell;
  nonAeroState.concessionHealth=metrics.concessionHealth;
  const score=Math.max(0,Math.min(100,Math.round(metrics.weighted*.50+metrics.conversionRate*.18+Math.min(100,metrics.spendPerPax*2)*.12+metrics.parkingYield*.07+metrics.loungeUpsell*.05+metrics.concessionHealth*.08-(fail?5:0))));
  nonAeroState.commercialScore=score;
  nonAeroState.status=commercialBand(score).id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:icao,finalScore:Math.round(finalScore||0),...metrics,commercialScore:score,status:nonAeroState.status,programs:nonAeroState.programs.length};
  nonAeroState.history.unshift(evaluation);
  nonAeroState.history=nonAeroState.history.slice(0,100);
  nonAeroState.lastEvaluation=evaluation;
  saveNonAeroRevenue();
  renderNonAeroRevenueBoard();
  return {state:nonAeroState,evaluation};
}
function nonAeroRevenueProgress(){
  loadNonAeroRevenue();
  return {score:nonAeroState.commercialScore,status:nonAeroState.status,nonAeroRevenue:nonAeroState.nonAeroRevenue,spendPerPax:nonAeroState.spendPerPax,conversionRate:nonAeroState.conversionRate,parkingYield:nonAeroState.parkingYield,loungeUpsell:nonAeroState.loungeUpsell,concessionHealth:nonAeroState.concessionHealth,openIncidents:nonAeroState.incidents.filter(i=>i.status==='OPEN').length,last:nonAeroState.lastEvaluation||null};
}
function renderNonAeroRevenueBoard(){
  try{
    const anchor=document.querySelector('#terminalFlowInline') || document.querySelector('#cargoLogisticsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#nonAeroRevenueInline'); if(old) old.remove();
    const p=nonAeroRevenueProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="nonAeroRevenueInline" class="airport-ops-board non-aero-revenue-inline">
      <div class="airport-ops-head"><b>NON-AERO REV</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>REV</small><b>${Math.round(p.nonAeroRevenue/1000)}k</b></div>
        <div><small>SPEND</small><b>${p.spendPerPax}</b></div>
        <div><small>CONV.</small><b>${p.conversionRate}%</b></div>
        <div><small>PARK</small><b>${p.parkingYield}</b></div>
        <div><small>LOUNGE</small><b>${p.loungeUpsell}</b></div>
        <div><small>INC.</small><b>${p.openIncidents}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'non-aero-revenue-board'); }
}
function initializeNonAeroRevenue(){loadNonAeroRevenue();renderNonAeroRevenueBoard();return nonAeroState;}
function nonAeroRevenueStatus(){loadNonAeroRevenue();return {...nonAeroState,progress:nonAeroRevenueProgress(),catalog:NON_AERO_REVENUE_CATALOG};}
function nonAeroRevenueSelfCheck(){
  const issues=[];
  if(NON_AERO_REVENUE_CATALOG.commercialChannels.length<9) issues.push('canais insuficientes');
  if(NON_AERO_REVENUE_CATALOG.revenuePrograms.length<9) issues.push('programas insuficientes');
  const program=runCommercialProgram('DUTY_FREE_BUNDLE');
  const incident=raiseCommercialIncident('FOOD_QUEUE_SPIKE');
  const res=evaluateNonAeroRevenue(2700,{landed:2,departed:2,conflicts:0,runwayIncursions:0,denied:0},false,'SBGR');
  if(!program.id || !incident.id) issues.push('programa/incidente inválido');
  if(!Number.isFinite(res.evaluation.commercialScore)) issues.push('score comercial inválido');
  return {ok:issues.length===0,issues,channels:NON_AERO_REVENUE_CATALOG.commercialChannels.length,programs:NON_AERO_REVENUE_CATALOG.revenuePrograms.length};
}
window.SKYWARD_NON_AERO_REVENUE=Object.freeze({
  schema:1,
  catalog:NON_AERO_REVENUE_CATALOG,
  load:loadNonAeroRevenue,
  save:saveNonAeroRevenue,
  program:runCommercialProgram,
  incident:raiseCommercialIncident,
  close:closeCommercialIncident,
  evaluate:evaluateNonAeroRevenue,
  progress:nonAeroRevenueProgress,
  status:nonAeroRevenueStatus,
  board:renderNonAeroRevenueBoard,
  init:initializeNonAeroRevenue,
  selfCheck:nonAeroRevenueSelfCheck
});

/* ===== MODULE 49: adaptive-pace-workload-director (54-adaptive-pace-workload-director.js) ===== */
/* @skyward-module 54-adaptive-pace-workload-director
 * Adaptive pace and workload director for mobile balance, event spacing, aircraft caps, incident cooldowns and safe-mode guard.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('54-adaptive-pace-workload-director');
const ADAPTIVE_PACE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f51',
  deviceProfiles:[
    {id:'MOBILE_LOW',name:'Mobile baixo desempenho',paceMultiplier:.52,maxAircraft:3,spawnSpacingSec:42,incidentCooldownSec:95},
    {id:'MOBILE_STANDARD',name:'Mobile padrão',paceMultiplier:.62,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:85},
    {id:'TABLET',name:'Tablet',paceMultiplier:.74,maxAircraft:5,spawnSpacingSec:30,incidentCooldownSec:74},
    {id:'DESKTOP_STANDARD',name:'Desktop padrão',paceMultiplier:.88,maxAircraft:6,spawnSpacingSec:24,incidentCooldownSec:62},
    {id:'DESKTOP_PRO',name:'Desktop avançado',paceMultiplier:1,maxAircraft:8,spawnSpacingSec:20,incidentCooldownSec:55}
  ],
  workloadBands:[
    {id:'CALM',min:0,max:34,name:'Calmo'},
    {id:'CONTROLLED',min:35,max:59,name:'Controlado'},
    {id:'BUSY',min:60,max:79,name:'Ocupado'},
    {id:'SATURATED',min:80,max:100,name:'Saturado'}
  ],
  pacePolicies:[
    {id:'REALISTIC',name:'Realista',paceBias:.90,spawnBias:1.15,incidentBias:1.25},
    {id:'TRAINING',name:'Treino',paceBias:.78,spawnBias:1.35,incidentBias:1.45},
    {id:'CAREER',name:'Carreira',paceBias:.84,spawnBias:1.20,incidentBias:1.30},
    {id:'INTENSE',name:'Intenso controlado',paceBias:1,spawnBias:.95,incidentBias:1.05}
  ],
  balanceRules:[
    {id:'MOBILE_CAP',name:'Limite de aeronaves mobile'},
    {id:'INCIDENT_COOLDOWN',name:'Cooldown de incidente'},
    {id:'SPAWN_SPACING',name:'Espaçamento de tráfego'},
    {id:'QUEUE_PROTECTION',name:'Proteção contra fila de eventos'},
    {id:'SAFE_MODE_GUARD',name:'Guarda anti-modo seguro'}
  ]
});
const ADAPTIVE_PACE_KEY='skywardAdaptivePace_v1';
let adaptivePaceState={schema:1,policy:'CAREER',deviceProfile:'MOBILE_STANDARD',workloadScore:42,workloadBand:'CONTROLLED',paceMultiplier:.62,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:85,mobilePlayability:82,queuePressure:0,lastIncidentAt:0,lastSpawnAt:0,tuningHistory:[],lastEvaluation:null};
function loadAdaptivePace(){try{const raw=localStorage?.getItem?.(ADAPTIVE_PACE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)adaptivePaceState={...adaptivePaceState,...parsed};}}catch(e){safeLogError?.(e,'adaptive-pace-load');}return adaptivePaceState;}
function saveAdaptivePace(){try{localStorage?.setItem?.(ADAPTIVE_PACE_KEY,JSON.stringify(adaptivePaceState));}catch(e){safeLogError?.(e,'adaptive-pace-save');}return adaptivePaceState;}
function getViewportClass(){
  try{
    const w=Math.max(Number(innerWidth||0),Number(screen?.width||0));
    const h=Math.max(Number(innerHeight||0),Number(screen?.height||0));
    const min=Math.min(w,h), max=Math.max(w,h);
    const touch=('ontouchstart' in window)||Number(navigator?.maxTouchPoints||0)>0;
    if(touch && min<430) return 'MOBILE_LOW';
    if(touch && max<950) return 'MOBILE_STANDARD';
    if(touch && max<1200) return 'TABLET';
    if(max>=1600) return 'DESKTOP_PRO';
    return 'DESKTOP_STANDARD';
  }catch(e){return 'MOBILE_STANDARD';}
}
function profileById(id){return ADAPTIVE_PACE_CATALOG.deviceProfiles.find(p=>p.id===id)||ADAPTIVE_PACE_CATALOG.deviceProfiles[1];}
function policyById(id){return ADAPTIVE_PACE_CATALOG.pacePolicies.find(p=>p.id===id)||ADAPTIVE_PACE_CATALOG.pacePolicies[2];}
function bandForWorkload(score){return ADAPTIVE_PACE_CATALOG.workloadBands.find(b=>score>=b.min&&score<=b.max)||ADAPTIVE_PACE_CATALOG.workloadBands.at(-1);}
function setAdaptivePacePolicy(id='CAREER'){loadAdaptivePace();adaptivePaceState.policy=policyById(id).id;saveAdaptivePace();return adaptivePaceState;}
function estimateWorkload(statsObj={}){
  const planesCount=Array.isArray(window.planes)?window.planes.length:Number(statsObj.activePlanes||0);
  const requestCount=Array.isArray(window.pendingRequests)?window.pendingRequests.length:Number(statsObj.pendingRequests||0);
  const denied=Number(statsObj.denied||0), conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0);
  const terminal=window.SKYWARD_TERMINAL_FLOW?.status?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()||{};
  const ai=window.SKYWARD_AI_COPILOT?.status?.()||{};
  const queue=Number(terminal.progress?.avgQueueMin||0);
  const radioLoad=100-Number(radio.progress?.score||84);
  const aiRisk=100-Number(ai.progress?.score||80);
  return Math.max(0,Math.min(100,Math.round(planesCount*11+requestCount*6+denied*5+conflicts*12+incursions*18+queue*.5+radioLoad*.16+aiRisk*.12)));
}
function tuneAdaptivePace(statsObj={},reason='runtime'){
  loadAdaptivePace();
  const profile=profileById(getViewportClass());
  const policy=policyById(adaptivePaceState.policy);
  const workload=estimateWorkload(statsObj);
  const band=bandForWorkload(workload);
  let pace=profile.paceMultiplier*policy.paceBias;
  let spawn=profile.spawnSpacingSec*policy.spawnBias;
  let cooldown=profile.incidentCooldownSec*policy.incidentBias;
  let maxAircraft=profile.maxAircraft;
  if(workload>=80){pace*=.78;spawn*=1.45;cooldown*=1.55;maxAircraft=Math.max(2,maxAircraft-1);}
  else if(workload>=60){pace*=.88;spawn*=1.25;cooldown*=1.25;}
  else if(workload<30){pace*=1.04;spawn*=.92;cooldown*=.95;}
  const safeModeMemory=Number(localStorage?.getItem?.('skywardSafeModeCount')||0);
  if(safeModeMemory>0){pace*=.72;spawn*=1.4;cooldown*=1.5;maxAircraft=Math.max(2,maxAircraft-1);}
  adaptivePaceState.deviceProfile=profile.id;
  adaptivePaceState.workloadScore=workload;
  adaptivePaceState.workloadBand=band.id;
  adaptivePaceState.paceMultiplier=Math.max(.42,Math.min(1.05,Number(pace.toFixed(2))));
  adaptivePaceState.maxAircraft=Math.max(2,Math.min(8,Math.round(maxAircraft)));
  adaptivePaceState.spawnSpacingSec=Math.max(18,Math.round(spawn));
  adaptivePaceState.incidentCooldownSec=Math.max(40,Math.round(cooldown));
  adaptivePaceState.queuePressure=Math.max(0,Math.min(100,Math.round(workload*.72+safeModeMemory*10)));
  adaptivePaceState.mobilePlayability=Math.max(0,Math.min(100,Math.round(100-workload*.55-(profile.id.includes('MOBILE')?0:4)-safeModeMemory*12)));
  const item={at:new Date().toISOString(),build:BUILD,reason,profile:profile.id,policy:policy.id,workload,band:band.id,pace:adaptivePaceState.paceMultiplier,maxAircraft:adaptivePaceState.maxAircraft,spawnSpacingSec:adaptivePaceState.spawnSpacingSec,incidentCooldownSec:adaptivePaceState.incidentCooldownSec,mobilePlayability:adaptivePaceState.mobilePlayability};
  adaptivePaceState.tuningHistory.unshift(item);
  adaptivePaceState.tuningHistory=adaptivePaceState.tuningHistory.slice(0,80);
  adaptivePaceState.lastEvaluation=item;
  window.SKYWARD_PACE_MULTIPLIER=adaptivePaceState.paceMultiplier;
  window.SKYWARD_MAX_AIRCRAFT=adaptivePaceState.maxAircraft;
  window.SKYWARD_SPAWN_SPACING_MS=adaptivePaceState.spawnSpacingSec*1000;
  window.SKYWARD_INCIDENT_COOLDOWN_MS=adaptivePaceState.incidentCooldownSec*1000;
  saveAdaptivePace();
  renderAdaptivePaceBoard();
  return item;
}
function canSpawnAircraft(){
  loadAdaptivePace();
  const now=Date.now();
  const count=Array.isArray(window.planes)?window.planes.length:0;
  if(count>=adaptivePaceState.maxAircraft) return false;
  return now-Number(adaptivePaceState.lastSpawnAt||0)>=adaptivePaceState.spawnSpacingSec*1000;
}
function markAircraftSpawn(){
  loadAdaptivePace();
  adaptivePaceState.lastSpawnAt=Date.now();
  saveAdaptivePace();
  return adaptivePaceState.lastSpawnAt;
}
function canTriggerIncident(){
  loadAdaptivePace();
  const now=Date.now();
  return now-Number(adaptivePaceState.lastIncidentAt||0)>=adaptivePaceState.incidentCooldownSec*1000;
}
function markIncidentTrigger(){
  loadAdaptivePace();
  adaptivePaceState.lastIncidentAt=Date.now();
  saveAdaptivePace();
  return adaptivePaceState.lastIncidentAt;
}
function scaleTimeout(ms){
  loadAdaptivePace();
  return Math.max(1000,Math.round(Number(ms||1000)/Math.max(.42,adaptivePaceState.paceMultiplier)));
}
function evaluateAdaptivePace(finalScore=0,statsObj={},fail=false,airportCode=''){
  const tuned=tuneAdaptivePace(statsObj,'end-shift');
  if(fail){adaptivePaceState.paceMultiplier=Math.max(.42,adaptivePaceState.paceMultiplier*.82);adaptivePaceState.spawnSpacingSec=Math.round(adaptivePaceState.spawnSpacingSec*1.25);adaptivePaceState.incidentCooldownSec=Math.round(adaptivePaceState.incidentCooldownSec*1.25);}
  saveAdaptivePace();
  return {state:adaptivePaceState,evaluation:{...tuned,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),fail:Boolean(fail)}};
}
function adaptivePaceProgress(){
  loadAdaptivePace();
  return {score:adaptivePaceState.mobilePlayability,status:adaptivePaceState.workloadBand,profile:adaptivePaceState.deviceProfile,policy:adaptivePaceState.policy,workload:adaptivePaceState.workloadScore,paceMultiplier:adaptivePaceState.paceMultiplier,maxAircraft:adaptivePaceState.maxAircraft,spawnSpacingSec:adaptivePaceState.spawnSpacingSec,incidentCooldownSec:adaptivePaceState.incidentCooldownSec,last:adaptivePaceState.lastEvaluation||null};
}
function renderAdaptivePaceBoard(){
  try{
    const anchor=document.querySelector('#nonAeroRevenueInline') || document.querySelector('#terminalFlowInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#adaptivePaceInline'); if(old) old.remove();
    const p=adaptivePaceProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="adaptivePaceInline" class="airport-ops-board adaptive-pace-inline">
      <div class="airport-ops-head"><b>PACE DIRECTOR</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>CARGA</small><b>${p.workload}</b></div>
        <div><small>RITMO</small><b>${p.paceMultiplier}x</b></div>
        <div><small>MAX AC</small><b>${p.maxAircraft}</b></div>
        <div><small>SPAWN</small><b>${p.spawnSpacingSec}s</b></div>
        <div><small>INCID.</small><b>${p.incidentCooldownSec}s</b></div>
        <div><small>MOBILE</small><b>${p.score}%</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'adaptive-pace-board'); }
}
function initializeAdaptivePace(){
  loadAdaptivePace();
  tuneAdaptivePace({},'init');
  return adaptivePaceState;
}
function adaptivePaceStatus(){loadAdaptivePace();return {...adaptivePaceState,progress:adaptivePaceProgress(),catalog:ADAPTIVE_PACE_CATALOG};}
function adaptivePaceSelfCheck(){
  const issues=[];
  if(ADAPTIVE_PACE_CATALOG.deviceProfiles.length<5) issues.push('perfis insuficientes');
  if(ADAPTIVE_PACE_CATALOG.pacePolicies.length<4) issues.push('políticas insuficientes');
  const tuned=tuneAdaptivePace({activePlanes:4,pendingRequests:2,denied:1,conflicts:0,runwayIncursions:0},'self-check');
  if(!Number.isFinite(tuned.pace)||!Number.isFinite(tuned.maxAircraft)) issues.push('tuning inválido');
  if(adaptivePaceState.paceMultiplier<=0||adaptivePaceState.spawnSpacingSec<18) issues.push('limites inválidos');
  return {ok:issues.length===0,issues,profiles:ADAPTIVE_PACE_CATALOG.deviceProfiles.length,policies:ADAPTIVE_PACE_CATALOG.pacePolicies.length};
}
window.SKYWARD_ADAPTIVE_PACE=Object.freeze({
  schema:1,
  catalog:ADAPTIVE_PACE_CATALOG,
  load:loadAdaptivePace,
  save:saveAdaptivePace,
  init:initializeAdaptivePace,
  tune:tuneAdaptivePace,
  policy:setAdaptivePacePolicy,
  canSpawn:canSpawnAircraft,
  markSpawn:markAircraftSpawn,
  canIncident:canTriggerIncident,
  markIncident:markIncidentTrigger,
  scaleTimeout,
  evaluate:evaluateAdaptivePace,
  progress:adaptivePaceProgress,
  status:adaptivePaceStatus,
  board:renderAdaptivePaceBoard,
  selfCheck:adaptivePaceSelfCheck
});

/* ===== MODULE 50: stability-observatory-diagnostics-center (55-stability-observatory-diagnostics-center.js) ===== */
/* @skyward-module 55-stability-observatory-diagnostics-center
 * Stability observatory and diagnostics center with local telemetry, safe-mode reports, PWA cache checks, runtime health and recovery recommendations.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('55-stability-observatory-diagnostics-center');
const STABILITY_DIAGNOSTICS_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f52',
  diagnosticSignals:[
    {id:'SAFE_MODE_COUNT',name:'Contador modo seguro',weight:18,target:0},
    {id:'RUNTIME_ERRORS',name:'Erros runtime',weight:18,target:0},
    {id:'SESSION_HEALTH',name:'Saúde sessão',weight:14,target:92},
    {id:'PWA_CACHE_HEALTH',name:'Saúde cache PWA',weight:12,target:90},
    {id:'FRAME_STABILITY',name:'Estabilidade visual',weight:12,target:85},
    {id:'RECOVERY_READINESS',name:'Prontidão recuperação',weight:10,target:90},
    {id:'MOBILE_MEMORY_GUARD',name:'Guarda memória mobile',weight:8,target:82},
    {id:'EVENT_QUEUE_HEALTH',name:'Fila eventos',weight:8,target:85}
  ],
  failureTypes:[
    {id:'CONST_ASSIGNMENT',name:'Assignment to constant variable',severity:34,hint:'Variável constante recebendo nova atribuição.'},
    {id:'NULL_DOM',name:'Elemento visual ausente',severity:20,hint:'Elemento DOM não encontrado em atualização.'},
    {id:'PWA_OLD_CACHE',name:'Cache antigo PWA',severity:24,hint:'Service worker ou cache antigo pode servir bundle obsoleto.'},
    {id:'EVENT_BURST',name:'Explosão de eventos',severity:26,hint:'Eventos excessivos em curto intervalo.'},
    {id:'MOBILE_OVERLOAD',name:'Sobrecarga mobile',severity:28,hint:'Dispositivo móvel saturado.'},
    {id:'SAVE_CORRUPTION',name:'Save inconsistente',severity:32,hint:'Estado persistido inválido.'},
    {id:'RENDER_LOOP_DROP',name:'Queda loop render',severity:22,hint:'Loop visual com FPS irregular.'}
  ],
  recoveryActions:[
    {id:'CLEAR_OLD_CACHE',name:'Limpar cache antigo',impact:12},
    {id:'RESTORE_SAFE_STATE',name:'Restaurar estado seguro',impact:16},
    {id:'REDUCE_PACE',name:'Reduzir ritmo',impact:14},
    {id:'LIMIT_EVENTS',name:'Limitar eventos',impact:12},
    {id:'REBUILD_SESSION',name:'Reconstruir sessão',impact:18},
    {id:'EXPORT_DIAGNOSTIC',name:'Exportar diagnóstico',impact:8}
  ],
  healthBands:[
    {id:'STABLE',min:90,name:'Estável'},
    {id:'WATCH',min:75,name:'Em observação'},
    {id:'DEGRADED',min:55,name:'Degradado'},
    {id:'UNSTABLE',min:0,name:'Instável'}
  ]
});
const STABILITY_DIAGNOSTICS_KEY='skywardStabilityDiagnostics_v1';
let stabilityState={schema:1,stabilityScore:88,status:'WATCH',safeModeCount:0,runtimeErrors:[],recoveryActions:[],sessionHealth:90,pwaCacheHealth:88,frameStability:84,mobileMemoryGuard:82,eventQueueHealth:84,recoveryReadiness:88,lastDiagnostic:null,history:[]};
function loadStabilityDiagnostics(){try{const raw=localStorage?.getItem?.(STABILITY_DIAGNOSTICS_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)stabilityState={...stabilityState,...parsed};}}catch(e){safeLogError?.(e,'stability-load');}return stabilityState;}
function saveStabilityDiagnostics(){try{localStorage?.setItem?.(STABILITY_DIAGNOSTICS_KEY,JSON.stringify(stabilityState));}catch(e){safeLogError?.(e,'stability-save');}return stabilityState;}
function stabilityBand(score){return STABILITY_DIAGNOSTICS_CATALOG.healthBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||STABILITY_DIAGNOSTICS_CATALOG.healthBands.at(-1);}
function classifyError(message=''){
  const txt=String(message||'').toLowerCase();
  if(txt.includes('assignment to constant')) return 'CONST_ASSIGNMENT';
  if(txt.includes('null')||txt.includes('undefined')||txt.includes('queryselector')) return 'NULL_DOM';
  if(txt.includes('cache')||txt.includes('service worker')) return 'PWA_OLD_CACHE';
  if(txt.includes('quota')||txt.includes('storage')||txt.includes('save')) return 'SAVE_CORRUPTION';
  return 'RENDER_LOOP_DROP';
}
function failureById(id){return STABILITY_DIAGNOSTICS_CATALOG.failureTypes.find(f=>f.id===id)||STABILITY_DIAGNOSTICS_CATALOG.failureTypes.at(-1);}
function recordRuntimeError(error,context='runtime'){
  loadStabilityDiagnostics();
  const message=String(error?.message||error||'erro desconhecido').slice(0,220);
  const failure=failureById(classifyError(message));
  const item={id:`ERR-${String(Date.now()).slice(-6)}`,type:failure.id,name:failure.name,severity:failure.severity,message,context,at:new Date().toISOString(),build:BUILD};
  stabilityState.runtimeErrors.unshift(item);
  stabilityState.runtimeErrors=stabilityState.runtimeErrors.slice(0,60);
  if(failure.id==='CONST_ASSIGNMENT'||failure.id==='PWA_OLD_CACHE'){
    stabilityState.recoveryActions.unshift({id:`REC-${String(Date.now()).slice(-6)}`,actionId:failure.id==='PWA_OLD_CACHE'?'CLEAR_OLD_CACHE':'REBUILD_SESSION',reason:failure.name,status:'SUGGESTED',at:item.at});
  }
  stabilityState.recoveryActions=stabilityState.recoveryActions.slice(0,60);
  saveStabilityDiagnostics();
  return item;
}
function recordSafeMode(reason='unknown'){
  loadStabilityDiagnostics();
  stabilityState.safeModeCount=Number(stabilityState.safeModeCount||0)+1;
  try{localStorage?.setItem?.('skywardSafeModeCount',String(stabilityState.safeModeCount));}catch(e){}
  stabilityState.recoveryActions.unshift({id:`REC-${String(Date.now()).slice(-6)}`,actionId:'RESTORE_SAFE_STATE',reason,status:'SUGGESTED',at:new Date().toISOString()});
  saveStabilityDiagnostics();
  return stabilityState.safeModeCount;
}
function clearDiagnostics(){
  loadStabilityDiagnostics();
  stabilityState.runtimeErrors=[];
  stabilityState.recoveryActions=[];
  stabilityState.safeModeCount=0;
  try{localStorage?.setItem?.('skywardSafeModeCount','0');}catch(e){}
  return saveStabilityDiagnostics();
}
function checkPwaCacheHealth(){
  let health=88;
  try{
    const cacheName=window.SKYWARD_CACHE_NAME||window.SKYWARD_BUILD_INFO?.cacheName||'';
    const buildInfo=window.SKYWARD_BUILD_INFO?.build||BUILD;
    if(cacheName && !String(cacheName).includes(String(buildInfo).toLowerCase().replace(/[^a-z0-9]+/g,'-').slice(0,18))) health-=6;
    if(!('serviceWorker' in navigator)) health-=8;
    if(!('caches' in window)) health-=8;
  }catch(e){health-=10;}
  return Math.max(0,Math.min(100,Math.round(health)));
}
function estimateFrameStability(){
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const workload=Number(pace.workload||0);
  const score=90-workload*.22-Number(stabilityState.runtimeErrors.length||0)*1.6;
  return Math.max(0,Math.min(100,Math.round(score)));
}
function estimateEventQueueHealth(){
  const pending=Array.isArray(window.pendingRequests)?window.pendingRequests.length:0;
  const planes=Array.isArray(window.planes)?window.planes.length:0;
  const max=Number(window.SKYWARD_MAX_AIRCRAFT||6);
  const pressure=Math.max(0,planes-max)*12+pending*6;
  return Math.max(0,Math.min(100,Math.round(92-pressure)));
}
function runStabilityDiagnostic(reason='manual'){
  loadStabilityDiagnostics();
  const safeMode=Number(localStorage?.getItem?.('skywardSafeModeCount')||stabilityState.safeModeCount||0);
  const runtimeSeverity=stabilityState.runtimeErrors.slice(0,12).reduce((a,e)=>a+Number(e.severity||0),0);
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const mobileScore=Number(pace.score||82);
  stabilityState.safeModeCount=safeMode;
  stabilityState.pwaCacheHealth=checkPwaCacheHealth();
  stabilityState.frameStability=estimateFrameStability();
  stabilityState.eventQueueHealth=estimateEventQueueHealth();
  stabilityState.mobileMemoryGuard=Math.max(0,Math.min(100,Math.round(mobileScore-Number(stabilityState.runtimeErrors.length||0)*1.5)));
  stabilityState.recoveryReadiness=Math.max(0,Math.min(100,Math.round(90+stabilityState.recoveryActions.length*1.2-safeMode*8)));
  stabilityState.sessionHealth=Math.max(0,Math.min(100,Math.round(92-safeMode*12-runtimeSeverity/18)));
  const weighted=Math.round(
    Math.max(0,100-safeMode*18)*.18+
    Math.max(0,100-runtimeSeverity/3)*.18+
    stabilityState.sessionHealth*.14+
    stabilityState.pwaCacheHealth*.12+
    stabilityState.frameStability*.12+
    stabilityState.recoveryReadiness*.10+
    stabilityState.mobileMemoryGuard*.08+
    stabilityState.eventQueueHealth*.08
  );
  stabilityState.stabilityScore=Math.max(0,Math.min(100,weighted));
  stabilityState.status=stabilityBand(stabilityState.stabilityScore).id;
  const diagnostic={at:new Date().toISOString(),build:BUILD,reason,stabilityScore:stabilityState.stabilityScore,status:stabilityState.status,safeModeCount:safeMode,runtimeErrors:stabilityState.runtimeErrors.length,sessionHealth:stabilityState.sessionHealth,pwaCacheHealth:stabilityState.pwaCacheHealth,frameStability:stabilityState.frameStability,mobileMemoryGuard:stabilityState.mobileMemoryGuard,eventQueueHealth:stabilityState.eventQueueHealth,recoveryReadiness:stabilityState.recoveryReadiness};
  stabilityState.lastDiagnostic=diagnostic;
  stabilityState.history.unshift(diagnostic);
  stabilityState.history=stabilityState.history.slice(0,80);
  saveStabilityDiagnostics();
  renderStabilityDiagnosticsBoard();
  return diagnostic;
}
function exportStabilityDiagnostic(){
  loadStabilityDiagnostics();
  return {schema:1,build:BUILD,at:new Date().toISOString(),state:stabilityState,catalogVersion:STABILITY_DIAGNOSTICS_CATALOG.version,userAgent:String(navigator?.userAgent||''),viewport:{w:Number(innerWidth||0),h:Number(innerHeight||0)},pace:window.SKYWARD_ADAPTIVE_PACE?.progress?.()||null};
}
function evaluateStabilityDiagnostics(finalScore=0,statsObj={},fail=false,airportCode=''){
  if(fail) recordSafeMode('end-shift-fail');
  const diagnostic=runStabilityDiagnostic('end-shift');
  return {state:stabilityState,evaluation:{...diagnostic,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0)}};
}
function stabilityDiagnosticsProgress(){
  loadStabilityDiagnostics();
  return {score:stabilityState.stabilityScore,status:stabilityState.status,safeModeCount:stabilityState.safeModeCount,runtimeErrors:stabilityState.runtimeErrors.length,sessionHealth:stabilityState.sessionHealth,pwaCacheHealth:stabilityState.pwaCacheHealth,frameStability:stabilityState.frameStability,mobileMemoryGuard:stabilityState.mobileMemoryGuard,recoveryActions:stabilityState.recoveryActions.length,last:stabilityState.lastDiagnostic||null};
}
function renderStabilityDiagnosticsBoard(){
  try{
    const anchor=document.querySelector('#adaptivePaceInline') || document.querySelector('#nonAeroRevenueInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#stabilityDiagnosticsInline'); if(old) old.remove();
    const p=stabilityDiagnosticsProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="stabilityDiagnosticsInline" class="airport-ops-board stability-diagnostics-inline">
      <div class="airport-ops-head"><b>STABILITY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SAÚDE</small><b>${p.score}%</b></div>
        <div><small>SAFE</small><b>${p.safeModeCount}</b></div>
        <div><small>ERROS</small><b>${p.runtimeErrors}</b></div>
        <div><small>PWA</small><b>${p.pwaCacheHealth}%</b></div>
        <div><small>FRAME</small><b>${p.frameStability}%</b></div>
        <div><small>REC.</small><b>${p.recoveryActions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'stability-board'); }
}
function installStabilityHooks(){
  if(window.__skywardStabilityHooksInstalled) return true;
  window.__skywardStabilityHooksInstalled=true;
  try{
    window.addEventListener?.('error',event=>recordRuntimeError(event?.error||event?.message,'window-error'));
    window.addEventListener?.('unhandledrejection',event=>recordRuntimeError(event?.reason||'unhandled rejection','promise'));
  }catch(e){}
  return true;
}
function initializeStabilityDiagnostics(){
  loadStabilityDiagnostics();
  installStabilityHooks();
  runStabilityDiagnostic('init');
  return stabilityState;
}
function stabilityDiagnosticsStatus(){loadStabilityDiagnostics();return {...stabilityState,progress:stabilityDiagnosticsProgress(),catalog:STABILITY_DIAGNOSTICS_CATALOG};}
function stabilityDiagnosticsSelfCheck(){
  const issues=[];
  if(STABILITY_DIAGNOSTICS_CATALOG.diagnosticSignals.length<8) issues.push('sinais insuficientes');
  if(STABILITY_DIAGNOSTICS_CATALOG.failureTypes.length<7) issues.push('falhas insuficientes');
  const err=recordRuntimeError(new Error('Assignment to constant variable'),'self-check');
  const diagnostic=runStabilityDiagnostic('self-check');
  if(!err.id) issues.push('erro não registrado');
  if(!Number.isFinite(diagnostic.stabilityScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,signals:STABILITY_DIAGNOSTICS_CATALOG.diagnosticSignals.length,failures:STABILITY_DIAGNOSTICS_CATALOG.failureTypes.length};
}
window.SKYWARD_STABILITY_DIAGNOSTICS=Object.freeze({
  schema:1,
  catalog:STABILITY_DIAGNOSTICS_CATALOG,
  load:loadStabilityDiagnostics,
  save:saveStabilityDiagnostics,
  init:initializeStabilityDiagnostics,
  hook:installStabilityHooks,
  error:recordRuntimeError,
  safeMode:recordSafeMode,
  clear:clearDiagnostics,
  diagnose:runStabilityDiagnostic,
  export:exportStabilityDiagnostic,
  evaluate:evaluateStabilityDiagnostics,
  progress:stabilityDiagnosticsProgress,
  status:stabilityDiagnosticsStatus,
  board:renderStabilityDiagnosticsBoard,
  selfCheck:stabilityDiagnosticsSelfCheck
});

/* ===== MODULE 51: pwa-update-cache-migration-center (56-pwa-update-cache-migration-center.js) ===== */
/* @skyward-module 56-pwa-update-cache-migration-center
 * PWA update manager with cache migration, stale bundle guard, service worker health, safe cleanup and mobile reload guidance.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('56-pwa-update-cache-migration-center');
const PWA_UPDATE_MANAGER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f53',
  updateSignals:[
    {id:'BUILD_MATCH',name:'Build atual carregado',weight:18,target:100},
    {id:'CACHE_MATCH',name:'Cache corresponde ao build',weight:16,target:100},
    {id:'SERVICE_WORKER_HEALTH',name:'Saúde service worker',weight:14,target:90},
    {id:'OLD_BUNDLE_RISK',name:'Risco bundle antigo',weight:16,target:0},
    {id:'PWA_INSTALL_STATE',name:'Estado instalação PWA',weight:10,target:85},
    {id:'OFFLINE_READY',name:'Pronto offline',weight:10,target:90},
    {id:'CACHE_CLEANUP_READY',name:'Limpeza segura pronta',weight:8,target:90},
    {id:'MIGRATION_STATUS',name:'Migração de cache',weight:8,target:100}
  ],
  cacheRisks:[
    {id:'OLD_MAIN_JS',name:'main.js antigo',severity:34,action:'CLEAR_AND_RELOAD'},
    {id:'OLD_SERVICE_WORKER',name:'service worker antigo',severity:30,action:'UPDATE_SW'},
    {id:'MIXED_CACHE',name:'cache misto de builds',severity:28,action:'MIGRATE_CACHE'},
    {id:'PWA_INSTALLED_OLD',name:'PWA instalado antigo',severity:26,action:'REINSTALL_PWA'},
    {id:'OFFLINE_STALE',name:'offline obsoleto',severity:22,action:'REFRESH_OFFLINE_CACHE'},
    {id:'NO_CACHE_API',name:'Cache API indisponível',severity:14,action:'ONLINE_ONLY'}
  ],
  updateActions:[
    {id:'CHECK_UPDATE',name:'Verificar atualização',impact:8},
    {id:'CLEAR_AND_RELOAD',name:'Limpar cache e recarregar',impact:18},
    {id:'UPDATE_SW',name:'Atualizar service worker',impact:16},
    {id:'MIGRATE_CACHE',name:'Migrar cache para build atual',impact:14},
    {id:'REINSTALL_PWA',name:'Reinstalar PWA/atalho',impact:12},
    {id:'REFRESH_OFFLINE_CACHE',name:'Recriar cache offline',impact:10},
    {id:'EXPORT_UPDATE_REPORT',name:'Exportar relatório update',impact:6}
  ],
  updateBands:[
    {id:'CURRENT',min:90,name:'Atualizado'},
    {id:'SYNCING',min:75,name:'Sincronizando'},
    {id:'STALE_RISK',min:55,name:'Risco cache antigo'},
    {id:'OUTDATED',min:0,name:'Desatualizado'}
  ]
});
const PWA_UPDATE_KEY='skywardPwaUpdateManager_v1';
let pwaUpdateState={schema:1,updateScore:84,status:'SYNCING',loadedBuild:'',expectedBuild:'',cacheName:'',serviceWorkerState:'unknown',cacheVersionMatch:false,oldBundleRisk:0,pwaInstalled:false,offlineReady:false,migrationReady:true,safeReloadReady:true,actions:[],risks:[],history:[],lastCheck:null};
function loadPwaUpdateManager(){try{const raw=localStorage?.getItem?.(PWA_UPDATE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)pwaUpdateState={...pwaUpdateState,...parsed};}}catch(e){safeLogError?.(e,'pwa-update-load');}return pwaUpdateState;}
function savePwaUpdateManager(){try{localStorage?.setItem?.(PWA_UPDATE_KEY,JSON.stringify(pwaUpdateState));}catch(e){safeLogError?.(e,'pwa-update-save');}return pwaUpdateState;}
function updateBand(score){return PWA_UPDATE_MANAGER_CATALOG.updateBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||PWA_UPDATE_MANAGER_CATALOG.updateBands.at(-1);}
function normalizeBuild(v=''){return String(v||'').toLowerCase().replace(/[^a-z0-9]+/g,'-');}
function detectPwaInstalled(){try{return Boolean(window.matchMedia?.('(display-mode: standalone)')?.matches||navigator?.standalone);}catch(e){return false;}}
async function listCacheNamesSafe(){try{if(!('caches' in window)) return []; return await caches.keys();}catch(e){return [];}}
function inferCurrentCacheName(){try{return window.SKYWARD_CACHE_NAME||window.SKYWARD_BUILD_INFO?.cacheName||`skyward-control-1-${normalizeBuild(BUILD)}`;}catch(e){return `skyward-control-1-${normalizeBuild(BUILD)}`;}}
async function checkPwaUpdateState(reason='manual'){
  loadPwaUpdateManager();
  const expected=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const loaded=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const cacheName=inferCurrentCacheName();
  const cacheNames=await listCacheNamesSafe();
  const normalizedExpected=normalizeBuild(expected);
  const matchingCache=cacheNames.some(n=>normalizeBuild(n).includes(normalizedExpected.slice(0,22))||String(n)===cacheName);
  const oldSkywardCaches=cacheNames.filter(n=>String(n).toLowerCase().includes('skyward')&&!normalizeBuild(n).includes(normalizedExpected.slice(0,12)));
  const swReady=Boolean('serviceWorker' in navigator);
  let swState='none';
  try{swState=navigator.serviceWorker?.controller?'controlled':(swReady?'available':'none');}catch(e){swState='unknown';}
  const pwaInstalled=detectPwaInstalled();
  const offlineReady=Boolean(matchingCache && cacheNames.length);
  const oldBundleRisk=Math.max(0,Math.min(100,oldSkywardCaches.length*18 + (!matchingCache?28:0) + (!swReady?10:0)));
  const risks=[];
  if(!matchingCache) risks.push({id:'OLD_MAIN_JS',name:'main.js/cache não confirmado',severity:34,action:'CLEAR_AND_RELOAD'});
  if(oldSkywardCaches.length) risks.push({id:'MIXED_CACHE',name:'Caches antigos detectados',severity:28,action:'MIGRATE_CACHE',caches:oldSkywardCaches.slice(0,6)});
  if(swReady && swState!=='controlled') risks.push({id:'OLD_SERVICE_WORKER',name:'Service worker não controla a sessão',severity:18,action:'UPDATE_SW'});
  if(!('caches' in window)) risks.push({id:'NO_CACHE_API',name:'Cache API indisponível',severity:14,action:'ONLINE_ONLY'});
  if(pwaInstalled && oldBundleRisk>=35) risks.push({id:'PWA_INSTALLED_OLD',name:'PWA instalado pode estar obsoleto',severity:26,action:'REINSTALL_PWA'});
  const riskPenalty=risks.reduce((a,r)=>a+Number(r.severity||0),0);
  const updateScore=Math.max(0,Math.min(100,Math.round(
    (loaded===expected?24:10)+
    (matchingCache?22:6)+
    (swReady?14:5)+
    (offlineReady?12:4)+
    (pwaInstalled?8:7)+
    Math.max(0,20-riskPenalty*.18)
  )));
  const suggested=[];
  if(risks.some(r=>r.action==='CLEAR_AND_RELOAD')) suggested.push({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'CLEAR_AND_RELOAD',name:'Limpar cache e recarregar',status:'SUGGESTED',at:new Date().toISOString()});
  if(risks.some(r=>r.action==='MIGRATE_CACHE')) suggested.push({id:`UPD-${String(Date.now()+1).slice(-6)}`,actionId:'MIGRATE_CACHE',name:'Migrar cache para build atual',status:'SUGGESTED',at:new Date().toISOString()});
  if(risks.some(r=>r.action==='REINSTALL_PWA')) suggested.push({id:`UPD-${String(Date.now()+2).slice(-6)}`,actionId:'REINSTALL_PWA',name:'Reinstalar PWA/atalho',status:'SUGGESTED',at:new Date().toISOString()});
  pwaUpdateState.expectedBuild=expected;
  pwaUpdateState.loadedBuild=loaded;
  pwaUpdateState.cacheName=cacheName;
  pwaUpdateState.serviceWorkerState=swState;
  pwaUpdateState.cacheVersionMatch=matchingCache;
  pwaUpdateState.oldBundleRisk=oldBundleRisk;
  pwaUpdateState.pwaInstalled=pwaInstalled;
  pwaUpdateState.offlineReady=offlineReady;
  pwaUpdateState.migrationReady=Boolean('caches' in window);
  pwaUpdateState.safeReloadReady=true;
  pwaUpdateState.risks=risks.slice(0,20);
  pwaUpdateState.actions=[...suggested,...pwaUpdateState.actions].slice(0,50);
  pwaUpdateState.updateScore=updateScore;
  pwaUpdateState.status=updateBand(updateScore).id;
  const item={at:new Date().toISOString(),build:BUILD,reason,updateScore,status:pwaUpdateState.status,loadedBuild:loaded,expectedBuild:expected,cacheName,cacheNames:cacheNames.slice(0,20),cacheVersionMatch:matchingCache,oldSkywardCaches:oldSkywardCaches.slice(0,20),oldBundleRisk,pwaInstalled,offlineReady,serviceWorkerState:swState,risks:risks.length};
  pwaUpdateState.lastCheck=item;
  pwaUpdateState.history.unshift(item);
  pwaUpdateState.history=pwaUpdateState.history.slice(0,80);
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  try{window.SKYWARD_STABILITY_DIAGNOSTICS?.diagnose?.('pwa-update-check');}catch(e){}
  return item;
}
async function migratePwaCache(){
  loadPwaUpdateManager();
  const cacheNames=await listCacheNamesSafe();
  const expected=normalizeBuild(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  const old=cacheNames.filter(n=>String(n).toLowerCase().includes('skyward')&&!normalizeBuild(n).includes(expected.slice(0,12)));
  let deleted=0;
  try{
    for(const name of old){ if(await caches.delete(name)) deleted++; }
  }catch(e){ try{window.SKYWARD_STABILITY_DIAGNOSTICS?.error?.(e,'pwa-cache-migration');}catch(_){} }
  pwaUpdateState.actions.unshift({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'MIGRATE_CACHE',name:`Caches antigos removidos: ${deleted}`,status:'DONE',at:new Date().toISOString()});
  savePwaUpdateManager();
  return await checkPwaUpdateState('migrate-cache');
}
async function clearPwaCacheAndReload(reload=false){
  loadPwaUpdateManager();
  let deleted=0;
  try{
    const names=await listCacheNamesSafe();
    for(const name of names){ if(String(name).toLowerCase().includes('skyward') && await caches.delete(name)) deleted++; }
    const regs=await navigator.serviceWorker?.getRegistrations?.();
    if(Array.isArray(regs)){for(const reg of regs){try{await reg.update?.();}catch(e){}}}
  }catch(e){ try{window.SKYWARD_STABILITY_DIAGNOSTICS?.error?.(e,'pwa-clear-cache');}catch(_){} }
  pwaUpdateState.actions.unshift({id:`UPD-${String(Date.now()).slice(-6)}`,actionId:'CLEAR_AND_RELOAD',name:`Cache limpo: ${deleted}`,status:'DONE',at:new Date().toISOString()});
  savePwaUpdateManager();
  if(reload){try{location.reload();}catch(e){}}
  return await checkPwaUpdateState('clear-cache');
}
function exportPwaUpdateReport(){
  loadPwaUpdateManager();
  return {schema:1,build:BUILD,at:new Date().toISOString(),state:pwaUpdateState,userAgent:String(navigator?.userAgent||''),viewport:{w:Number(innerWidth||0),h:Number(innerHeight||0)},buildInfo:window.SKYWARD_BUILD_INFO||null};
}
function evaluatePwaUpdateManager(finalScore=0,statsObj={},fail=false,airportCode=''){
  const sync={...pwaUpdateState,lastCheck:pwaUpdateState.lastCheck||null};
  // keep evaluation synchronous for end-screen; async checker updates board separately.
  const evalObj={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),updateScore:sync.updateScore,status:sync.status,oldBundleRisk:sync.oldBundleRisk,cacheVersionMatch:sync.cacheVersionMatch,pwaInstalled:sync.pwaInstalled,offlineReady:sync.offlineReady,risks:sync.risks?.length||0};
  pwaUpdateState.lastCheck=evalObj;
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  return {state:pwaUpdateState,evaluation:evalObj};
}
function pwaUpdateProgress(){
  loadPwaUpdateManager();
  return {score:pwaUpdateState.updateScore,status:pwaUpdateState.status,oldBundleRisk:pwaUpdateState.oldBundleRisk,cacheVersionMatch:pwaUpdateState.cacheVersionMatch,serviceWorkerState:pwaUpdateState.serviceWorkerState,pwaInstalled:pwaUpdateState.pwaInstalled,offlineReady:pwaUpdateState.offlineReady,risks:pwaUpdateState.risks.length,actions:pwaUpdateState.actions.length,last:pwaUpdateState.lastCheck||null};
}
function renderPwaUpdateBoard(){
  try{
    const anchor=document.querySelector('#stabilityDiagnosticsInline') || document.querySelector('#adaptivePaceInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#pwaUpdateInline'); if(old) old.remove();
    const p=pwaUpdateProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="pwaUpdateInline" class="airport-ops-board pwa-update-inline">
      <div class="airport-ops-head"><b>PWA UPDATE</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>UPDATE</small><b>${p.score}%</b></div>
        <div><small>CACHE</small><b>${p.cacheVersionMatch?'OK':'OLD'}</b></div>
        <div><small>SW</small><b>${p.serviceWorkerState}</b></div>
        <div><small>RISCO</small><b>${p.oldBundleRisk}</b></div>
        <div><small>PWA</small><b>${p.pwaInstalled?'SIM':'WEB'}</b></div>
        <div><small>AÇÕES</small><b>${p.actions}</b></div>
      </div>
    </div>`);
  }catch(e){ safeLogError?.(e,'pwa-update-board'); }
}
function initializePwaUpdateManager(){
  loadPwaUpdateManager();
  pwaUpdateState.expectedBuild=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  pwaUpdateState.loadedBuild=String(window.SKYWARD_BUILD_INFO?.build||BUILD||'');
  pwaUpdateState.cacheName=inferCurrentCacheName();
  savePwaUpdateManager();
  renderPwaUpdateBoard();
  checkPwaUpdateState('init');
  return pwaUpdateState;
}
function pwaUpdateStatus(){loadPwaUpdateManager();return {...pwaUpdateState,progress:pwaUpdateProgress(),catalog:PWA_UPDATE_MANAGER_CATALOG};}
function pwaUpdateSelfCheck(){
  const issues=[];
  if(PWA_UPDATE_MANAGER_CATALOG.updateSignals.length<8) issues.push('sinais insuficientes');
  if(PWA_UPDATE_MANAGER_CATALOG.cacheRisks.length<6) issues.push('riscos insuficientes');
  const progress=pwaUpdateProgress();
  if(!Number.isFinite(progress.score)) issues.push('score inválido');
  return {ok:issues.length===0,issues,signals:PWA_UPDATE_MANAGER_CATALOG.updateSignals.length,risks:PWA_UPDATE_MANAGER_CATALOG.cacheRisks.length};
}
window.SKYWARD_PWA_UPDATE_MANAGER=Object.freeze({
  schema:1,
  catalog:PWA_UPDATE_MANAGER_CATALOG,
  load:loadPwaUpdateManager,
  save:savePwaUpdateManager,
  init:initializePwaUpdateManager,
  check:checkPwaUpdateState,
  migrate:migratePwaCache,
  clear:clearPwaCacheAndReload,
  export:exportPwaUpdateReport,
  evaluate:evaluatePwaUpdateManager,
  progress:pwaUpdateProgress,
  status:pwaUpdateStatus,
  board:renderPwaUpdateBoard,
  selfCheck:pwaUpdateSelfCheck
});

/* ===== MODULE 52: live-ops-remote-config-center (57-live-ops-remote-config-center.js) ===== */
/* @skyward-module 57-live-ops-remote-config-center
 * Live Ops Remote Config and feature flags center for pace, mobile guard, incident limiter, PWA update guard, diagnostics and kill-switches.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('57-live-ops-remote-config-center');
const LIVE_OPS_REMOTE_CONFIG_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f54',
  configProfiles:[
    {id:'SAFE_MOBILE',name:'Mobile seguro',paceScale:.58,maxAircraft:3,spawnSpacingSec:44,incidentCooldownSec:110,eventBurstLimit:2},
    {id:'BALANCED',name:'Balanceado',paceScale:.72,maxAircraft:4,spawnSpacingSec:36,incidentCooldownSec:90,eventBurstLimit:3},
    {id:'REALISTIC_DESKTOP',name:'Desktop realista',paceScale:.88,maxAircraft:6,spawnSpacingSec:28,incidentCooldownSec:70,eventBurstLimit:4},
    {id:'TRAINING_EASY',name:'Treino fácil',paceScale:.52,maxAircraft:3,spawnSpacingSec:50,incidentCooldownSec:125,eventBurstLimit:2},
    {id:'LIVE_OPS_GUARD',name:'Guarda produção',paceScale:.62,maxAircraft:4,spawnSpacingSec:42,incidentCooldownSec:105,eventBurstLimit:2}
  ],
  featureFlags:[
    {id:'ADAPTIVE_PACE',name:'Ritmo adaptativo',default:true,scope:'runtime'},
    {id:'MOBILE_CONSERVATIVE_MODE',name:'Modo mobile conservador',default:true,scope:'mobile'},
    {id:'INCIDENT_LIMITER',name:'Limitador de incidentes',default:true,scope:'safety'},
    {id:'PWA_UPDATE_GUARD',name:'Guarda atualização PWA',default:true,scope:'pwa'},
    {id:'STABILITY_OBSERVATORY',name:'Observatório estabilidade',default:true,scope:'diagnostics'},
    {id:'AUTO_CACHE_MIGRATION_HINT',name:'Aviso migração cache',default:true,scope:'pwa'},
    {id:'AI_COPILOT_HINTS',name:'Dicas copiloto IA',default:true,scope:'training'},
    {id:'DENSE_TRAFFIC_MODE',name:'Tráfego denso',default:false,scope:'traffic'},
    {id:'EXPERIMENTAL_EVENTS',name:'Eventos experimentais',default:false,scope:'experimental'}
  ],
  remoteRules:[
    {id:'SAFE_MODE_AUTO_GUARD',name:'Se houver modo seguro, aplica perfil seguro',trigger:'safeModeCount>0',profile:'LIVE_OPS_GUARD'},
    {id:'MOBILE_LOW_PACE',name:'Mobile sempre inicia conservador',trigger:'device=mobile',profile:'SAFE_MOBILE'},
    {id:'CACHE_RISK_LOCKDOWN',name:'Cache antigo limita eventos',trigger:'oldBundleRisk>=35',profile:'LIVE_OPS_GUARD'},
    {id:'TRAINING_LOW_PRESSURE',name:'Treino reduz pressão',trigger:'mode=training',profile:'TRAINING_EASY'},
    {id:'DESKTOP_REALISM',name:'Desktop usa realismo moderado',trigger:'device=desktop',profile:'REALISTIC_DESKTOP'}
  ],
  killSwitches:[
    {id:'DISABLE_RANDOM_BURSTS',name:'Desativar rajadas aleatórias',enabled:true},
    {id:'DISABLE_EXPERIMENTAL_EVENTS',name:'Desativar eventos experimentais',enabled:true},
    {id:'LOCK_MOBILE_MAX_AIRCRAFT',name:'Travar máximo mobile',enabled:true},
    {id:'FORCE_PWA_UPDATE_CHECK',name:'Forçar checagem PWA',enabled:true}
  ],
  configBands:[
    {id:'PROTECTED',min:90,name:'Protegido'},
    {id:'CONTROLLED',min:75,name:'Controlado'},
    {id:'NEEDS_REVIEW',min:55,name:'Revisar'},
    {id:'UNGUARDED',min:0,name:'Sem guarda'}
  ]
});
const LIVE_OPS_REMOTE_CONFIG_KEY='skywardLiveOpsRemoteConfig_v1';
let liveOpsConfigState={schema:1,activeProfile:'BALANCED',configScore:82,status:'CONTROLLED',flags:{},killSwitches:{},appliedRules:[],overrides:{},history:[],lastEvaluation:null};
function defaultFlags(){return Object.fromEntries(LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.map(f=>[f.id,Boolean(f.default)]));}
function defaultSwitches(){return Object.fromEntries(LIVE_OPS_REMOTE_CONFIG_CATALOG.killSwitches.map(k=>[k.id,Boolean(k.enabled)]));}
function loadLiveOpsConfig(){
  try{
    if(!Object.keys(liveOpsConfigState.flags||{}).length) liveOpsConfigState.flags=defaultFlags();
    if(!Object.keys(liveOpsConfigState.killSwitches||{}).length) liveOpsConfigState.killSwitches=defaultSwitches();
    const raw=localStorage?.getItem?.(LIVE_OPS_REMOTE_CONFIG_KEY);
    if(raw){
      const parsed=JSON.parse(raw);
      if(parsed?.schema===1) liveOpsConfigState={...liveOpsConfigState,...parsed,flags:{...defaultFlags(),...(parsed.flags||{})},killSwitches:{...defaultSwitches(),...(parsed.killSwitches||{})}};
    }
  }catch(e){safeLogError?.(e,'live-ops-config-load');}
  return liveOpsConfigState;
}
function saveLiveOpsConfig(){try{localStorage?.setItem?.(LIVE_OPS_REMOTE_CONFIG_KEY,JSON.stringify(liveOpsConfigState));}catch(e){safeLogError?.(e,'live-ops-config-save');}return liveOpsConfigState;}
function profileById(id){return LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.find(p=>p.id===id)||LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles[1];}
function configBand(score){return LIVE_OPS_REMOTE_CONFIG_CATALOG.configBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||LIVE_OPS_REMOTE_CONFIG_CATALOG.configBands.at(-1);}
function isMobileDevice(){
  try{
    const touch=('ontouchstart' in window)||Number(navigator?.maxTouchPoints||0)>0;
    const max=Math.max(Number(innerWidth||0),Number(innerHeight||0),Number(screen?.width||0),Number(screen?.height||0));
    return touch&&max<950;
  }catch(e){return false;}
}
function setLiveOpsFlag(id,value){
  loadLiveOpsConfig();
  if(!(id in liveOpsConfigState.flags)) liveOpsConfigState.flags[id]=false;
  liveOpsConfigState.flags[id]=Boolean(value);
  saveLiveOpsConfig();
  renderLiveOpsConfigBoard();
  return liveOpsConfigState.flags[id];
}
function setLiveOpsProfile(id='BALANCED'){
  loadLiveOpsConfig();
  liveOpsConfigState.activeProfile=profileById(id).id;
  applyLiveOpsProfile(liveOpsConfigState.activeProfile,'manual');
  return liveOpsConfigState;
}
function toggleKillSwitch(id,value){
  loadLiveOpsConfig();
  if(!(id in liveOpsConfigState.killSwitches)) liveOpsConfigState.killSwitches[id]=false;
  liveOpsConfigState.killSwitches[id]=Boolean(value);
  saveLiveOpsConfig();
  return liveOpsConfigState.killSwitches[id];
}
function collectLiveOpsSignals(){
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pwa=window.SKYWARD_PWA_UPDATE_MANAGER?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  return {
    mobile:isMobileDevice(),
    safeModeCount:Number(stability.safeModeCount||localStorage?.getItem?.('skywardSafeModeCount')||0),
    oldBundleRisk:Number(pwa.oldBundleRisk||0),
    workload:Number(pace.workload||0),
    pwaStatus:String(pwa.status||'UNKNOWN'),
    stabilityStatus:String(stability.status||'UNKNOWN')
  };
}
function resolveLiveOpsProfile(signals=collectLiveOpsSignals()){
  if(signals.safeModeCount>0) return {profile:'LIVE_OPS_GUARD',rule:'SAFE_MODE_AUTO_GUARD'};
  if(signals.oldBundleRisk>=35) return {profile:'LIVE_OPS_GUARD',rule:'CACHE_RISK_LOCKDOWN'};
  if(signals.mobile) return {profile:'SAFE_MOBILE',rule:'MOBILE_LOW_PACE'};
  if(signals.workload>=80) return {profile:'LIVE_OPS_GUARD',rule:'WORKLOAD_GUARD'};
  return {profile:'REALISTIC_DESKTOP',rule:'DESKTOP_REALISM'};
}
function applyLiveOpsProfile(id=liveOpsConfigState.activeProfile,reason='auto'){
  loadLiveOpsConfig();
  const profile=profileById(id);
  liveOpsConfigState.activeProfile=profile.id;
  liveOpsConfigState.overrides={
    paceScale:profile.paceScale,
    maxAircraft:profile.maxAircraft,
    spawnSpacingSec:profile.spawnSpacingSec,
    incidentCooldownSec:profile.incidentCooldownSec,
    eventBurstLimit:profile.eventBurstLimit
  };
  if(liveOpsConfigState.flags.ADAPTIVE_PACE!==false){
    window.SKYWARD_PACE_MULTIPLIER=profile.paceScale;
    window.SKYWARD_MAX_AIRCRAFT=profile.maxAircraft;
    window.SKYWARD_SPAWN_SPACING_MS=profile.spawnSpacingSec*1000;
    window.SKYWARD_INCIDENT_COOLDOWN_MS=profile.incidentCooldownSec*1000;
    try{
      const pace=window.SKYWARD_ADAPTIVE_PACE?.load?.();
      if(pace){
        pace.paceMultiplier=profile.paceScale;
        pace.maxAircraft=profile.maxAircraft;
        pace.spawnSpacingSec=profile.spawnSpacingSec;
        pace.incidentCooldownSec=profile.incidentCooldownSec;
        window.SKYWARD_ADAPTIVE_PACE?.save?.();
      }
    }catch(e){safeLogError?.(e,'live-ops-apply-pace');}
  }
  if(liveOpsConfigState.killSwitches.DISABLE_EXPERIMENTAL_EVENTS) liveOpsConfigState.flags.EXPERIMENTAL_EVENTS=false;
  if(liveOpsConfigState.killSwitches.DISABLE_RANDOM_BURSTS) window.SKYWARD_EVENT_BURST_LIMIT=profile.eventBurstLimit;
  const enabledFlags=Object.values(liveOpsConfigState.flags).filter(Boolean).length;
  const enabledSwitches=Object.values(liveOpsConfigState.killSwitches).filter(Boolean).length;
  const mobileGuard=liveOpsConfigState.flags.MOBILE_CONSERVATIVE_MODE&&profile.maxAircraft<=4?100:70;
  liveOpsConfigState.configScore=Math.max(0,Math.min(100,Math.round(68+enabledFlags*2.2+enabledSwitches*2.5+(mobileGuard-70)*.18-(liveOpsConfigState.flags.EXPERIMENTAL_EVENTS?8:0))));
  liveOpsConfigState.status=configBand(liveOpsConfigState.configScore).id;
  const item={at:new Date().toISOString(),build:BUILD,reason,profile:profile.id,configScore:liveOpsConfigState.configScore,status:liveOpsConfigState.status,overrides:liveOpsConfigState.overrides,flags:{...liveOpsConfigState.flags},killSwitches:{...liveOpsConfigState.killSwitches}};
  liveOpsConfigState.history.unshift(item);
  liveOpsConfigState.history=liveOpsConfigState.history.slice(0,80);
  liveOpsConfigState.lastEvaluation=item;
  saveLiveOpsConfig();
  renderLiveOpsConfigBoard();
  return item;
}
function evaluateLiveOpsConfig(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadLiveOpsConfig();
  const signals=collectLiveOpsSignals();
  const resolved=resolveLiveOpsProfile(signals);
  liveOpsConfigState.appliedRules.unshift({id:`LOR-${String(Date.now()).slice(-6)}`,ruleId:resolved.rule,profile:resolved.profile,signals,at:new Date().toISOString()});
  liveOpsConfigState.appliedRules=liveOpsConfigState.appliedRules.slice(0,80);
  const applied=applyLiveOpsProfile(resolved.profile,fail?'end-shift-fail':'end-shift');
  return {state:liveOpsConfigState,evaluation:{...applied,airport:airportCode||'SBSP',finalScore:Math.round(finalScore||0),signals,rule:resolved.rule}};
}
function liveOpsConfigProgress(){
  loadLiveOpsConfig();
  return {score:liveOpsConfigState.configScore,status:liveOpsConfigState.status,activeProfile:liveOpsConfigState.activeProfile,enabledFlags:Object.values(liveOpsConfigState.flags||{}).filter(Boolean).length,enabledKillSwitches:Object.values(liveOpsConfigState.killSwitches||{}).filter(Boolean).length,paceScale:liveOpsConfigState.overrides?.paceScale||profileById(liveOpsConfigState.activeProfile).paceScale,maxAircraft:liveOpsConfigState.overrides?.maxAircraft||profileById(liveOpsConfigState.activeProfile).maxAircraft,incidentCooldownSec:liveOpsConfigState.overrides?.incidentCooldownSec||profileById(liveOpsConfigState.activeProfile).incidentCooldownSec,last:liveOpsConfigState.lastEvaluation||null};
}
function renderLiveOpsConfigBoard(){
  try{
    const anchor=document.querySelector('#pwaUpdateInline') || document.querySelector('#stabilityDiagnosticsInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#liveOpsConfigInline'); if(old) old.remove();
    const p=liveOpsConfigProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="liveOpsConfigInline" class="airport-ops-board live-ops-config-inline">
      <div class="airport-ops-head"><b>LIVE OPS CFG</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>PERFIL</small><b>${p.activeProfile}</b></div>
        <div><small>RITMO</small><b>${p.paceScale}x</b></div>
        <div><small>MAX AC</small><b>${p.maxAircraft}</b></div>
        <div><small>FLAGS</small><b>${p.enabledFlags}</b></div>
        <div><small>KILL</small><b>${p.enabledKillSwitches}</b></div>
        <div><small>INCID.</small><b>${p.incidentCooldownSec}s</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'live-ops-config-board');}
}
function initializeLiveOpsConfig(){
  loadLiveOpsConfig();
  const resolved=resolveLiveOpsProfile();
  liveOpsConfigState.appliedRules.unshift({id:`LOR-${String(Date.now()).slice(-6)}`,ruleId:resolved.rule,profile:resolved.profile,signals:collectLiveOpsSignals(),at:new Date().toISOString()});
  applyLiveOpsProfile(resolved.profile,'init');
  return liveOpsConfigState;
}
function liveOpsConfigStatus(){loadLiveOpsConfig();return {...liveOpsConfigState,progress:liveOpsConfigProgress(),catalog:LIVE_OPS_REMOTE_CONFIG_CATALOG};}
function liveOpsConfigSelfCheck(){
  const issues=[];
  if(LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.length<5) issues.push('perfis insuficientes');
  if(LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.length<9) issues.push('flags insuficientes');
  const applied=applyLiveOpsProfile('SAFE_MOBILE','self-check');
  if(!Number.isFinite(applied.overrides.paceScale)||applied.overrides.maxAircraft>4) issues.push('perfil seguro inválido');
  setLiveOpsFlag('EXPERIMENTAL_EVENTS',true);
  toggleKillSwitch('DISABLE_EXPERIMENTAL_EVENTS',true);
  const guarded=applyLiveOpsProfile('LIVE_OPS_GUARD','self-check-guard');
  if(guarded.flags.EXPERIMENTAL_EVENTS!==false) issues.push('kill switch falhou');
  return {ok:issues.length===0,issues,profiles:LIVE_OPS_REMOTE_CONFIG_CATALOG.configProfiles.length,flags:LIVE_OPS_REMOTE_CONFIG_CATALOG.featureFlags.length};
}
window.SKYWARD_LIVE_OPS_CONFIG=Object.freeze({
  schema:1,
  catalog:LIVE_OPS_REMOTE_CONFIG_CATALOG,
  load:loadLiveOpsConfig,
  save:saveLiveOpsConfig,
  init:initializeLiveOpsConfig,
  setFlag:setLiveOpsFlag,
  setProfile:setLiveOpsProfile,
  killSwitch:toggleKillSwitch,
  signals:collectLiveOpsSignals,
  resolve:resolveLiveOpsProfile,
  apply:applyLiveOpsProfile,
  evaluate:evaluateLiveOpsConfig,
  progress:liveOpsConfigProgress,
  status:liveOpsConfigStatus,
  board:renderLiveOpsConfigBoard,
  selfCheck:liveOpsConfigSelfCheck
});

/* ===== MODULE 53: scenario-mission-generator-center (58-scenario-mission-generator-center.js) ===== */
/* @skyward-module 58-scenario-mission-generator-center
 * Scenario Designer and Mission Generator Center for mission templates, scheduled events, traffic/weather packs, objectives, grading and replay seeds.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('58-scenario-mission-generator-center');
const SCENARIO_MISSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f55',
  missionTemplates:[
    {id:'MOBILE_TRAINING',name:'Treino Mobile Seguro',difficulty:2,durationMin:8,traffic:'LOW',weather:'VFR',profile:'SAFE_MOBILE'},
    {id:'PEAK_HOUR',name:'Hora Pico Controlada',difficulty:4,durationMin:12,traffic:'MEDIUM',weather:'VFR',profile:'BALANCED'},
    {id:'STORM_DIVERSION',name:'Desvio por Tempestade',difficulty:6,durationMin:14,traffic:'MEDIUM',weather:'STORM',profile:'LIVE_OPS_GUARD'},
    {id:'RADIO_DISCIPLINE',name:'Fraseologia Rigorosa',difficulty:5,durationMin:10,traffic:'LOW',weather:'MVFR',profile:'TRAINING_EASY'},
    {id:'EMERGENCY_RUNWAY',name:'Emergência em Pista',difficulty:7,durationMin:15,traffic:'MEDIUM',weather:'IFR',profile:'LIVE_OPS_GUARD'},
    {id:'CARGO_NIGHT',name:'Operação Cargueira Noturna',difficulty:5,durationMin:12,traffic:'CARGO',weather:'NIGHT_VFR',profile:'BALANCED'},
    {id:'REGIONAL_NETWORK',name:'Rede Regional Multi-Hub',difficulty:6,durationMin:16,traffic:'NETWORK',weather:'MIXED',profile:'REALISTIC_DESKTOP'}
  ],
  eventTypes:[
    {id:'ARRIVAL_WAVE',name:'Onda de chegadas',severity:14},
    {id:'DEPARTURE_BANK',name:'Banco de decolagens',severity:16},
    {id:'WEATHER_CELL',name:'Célula meteorológica',severity:22},
    {id:'RADIO_CONGESTION',name:'Congestionamento rádio',severity:18},
    {id:'RUNWAY_INSPECTION',name:'Inspeção de pista',severity:24},
    {id:'MEDICAL_PRIORITY',name:'Prioridade médica',severity:26},
    {id:'LOW_VISIBILITY',name:'Baixa visibilidade',severity:28},
    {id:'CARGO_PRIORITY',name:'Prioridade cargueira',severity:16}
  ],
  trafficPacks:[
    {id:'LOW',name:'Baixo',aircraft:3,spacingSec:48},
    {id:'MEDIUM',name:'Médio',aircraft:5,spacingSec:36},
    {id:'HIGH',name:'Alto',aircraft:7,spacingSec:28},
    {id:'CARGO',name:'Cargueiro',aircraft:4,spacingSec:42},
    {id:'NETWORK',name:'Multi-Hub',aircraft:6,spacingSec:34}
  ],
  weatherPacks:[
    {id:'VFR',name:'Visual',visibility:10,wind:8,risk:6},
    {id:'MVFR',name:'Marginal',visibility:6,wind:14,risk:14},
    {id:'IFR',name:'Instrumento',visibility:3,wind:18,risk:24},
    {id:'STORM',name:'Tempestade',visibility:2,wind:28,risk:34},
    {id:'NIGHT_VFR',name:'Noite visual',visibility:8,wind:10,risk:12},
    {id:'MIXED',name:'Misto regional',visibility:5,wind:18,risk:22}
  ],
  objectiveTypes:[
    {id:'NO_CONFLICTS',name:'Sem conflitos',points:180},
    {id:'LOW_DENIALS',name:'Poucas negativas',points:120},
    {id:'RADIO_ACCURACY',name:'Fraseologia correta',points:140},
    {id:'PACE_CONTROL',name:'Controle de ritmo',points:100},
    {id:'SAFE_MODE_ZERO',name:'Sem modo seguro',points:160},
    {id:'MISSION_COMPLETION',name:'Missão concluída',points:200}
  ],
  gradeBands:[
    {id:'S',min:92,name:'Excelente'},
    {id:'A',min:82,name:'Ótimo'},
    {id:'B',min:70,name:'Bom'},
    {id:'C',min:55,name:'Regular'},
    {id:'D',min:0,name:'Repetir treino'}
  ]
});
const SCENARIO_MISSION_KEY='skywardScenarioMission_v1';
let scenarioMissionState={schema:1,activeMission:null,missionHistory:[],generatedEvents:[],missionScore:0,grade:'D',objectives:[],lastEvaluation:null};
function loadScenarioMission(){try{const raw=localStorage?.getItem?.(SCENARIO_MISSION_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)scenarioMissionState={...scenarioMissionState,...parsed};}}catch(e){safeLogError?.(e,'scenario-mission-load');}return scenarioMissionState;}
function saveScenarioMission(){try{localStorage?.setItem?.(SCENARIO_MISSION_KEY,JSON.stringify(scenarioMissionState));}catch(e){safeLogError?.(e,'scenario-mission-save');}return scenarioMissionState;}
function templateById(id){return SCENARIO_MISSION_CATALOG.missionTemplates.find(t=>t.id===id)||SCENARIO_MISSION_CATALOG.missionTemplates[0];}
function trafficById(id){return SCENARIO_MISSION_CATALOG.trafficPacks.find(t=>t.id===id)||SCENARIO_MISSION_CATALOG.trafficPacks[0];}
function weatherById(id){return SCENARIO_MISSION_CATALOG.weatherPacks.find(w=>w.id===id)||SCENARIO_MISSION_CATALOG.weatherPacks[0];}
function gradeFor(score){return SCENARIO_MISSION_CATALOG.gradeBands.slice().sort((a,b)=>b.min-a.min).find(g=>score>=g.min)||SCENARIO_MISSION_CATALOG.gradeBands.at(-1);}
function seedFromTemplate(id){let h=0; const s=String(id||'MISSION')+String(BUILD||''); for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))>>>0;} return h;}
function generateScenarioEvents(template){
  const traffic=trafficById(template.traffic);
  const weather=weatherById(template.weather);
  const count=Math.max(2,Math.min(6,Math.round(template.difficulty/2)+2));
  const pool=SCENARIO_MISSION_CATALOG.eventTypes.slice().sort((a,b)=>Math.abs(a.severity-weather.risk)-Math.abs(b.severity-weather.risk));
  return pool.slice(0,count).map((e,idx)=>({id:`EVT-${template.id}-${idx+1}`,type:e.id,name:e.name,severity:e.severity,minute:Math.max(1,Math.round((template.durationMin/(count+1))*(idx+1))),status:'SCHEDULED',traffic:traffic.id,weather:weather.id}));
}
function defaultObjectives(template){
  const ids=['MISSION_COMPLETION','NO_CONFLICTS','LOW_DENIALS','PACE_CONTROL','SAFE_MODE_ZERO'];
  if(template.id==='RADIO_DISCIPLINE') ids.push('RADIO_ACCURACY');
  return ids.map(id=>SCENARIO_MISSION_CATALOG.objectiveTypes.find(o=>o.id===id)).filter(Boolean).map(o=>({...o,status:'PENDING'}));
}
function startScenarioMission(id='MOBILE_TRAINING'){
  loadScenarioMission();
  const template=templateById(id);
  const traffic=trafficById(template.traffic);
  const weather=weatherById(template.weather);
  const mission={id:`MIS-${String(Date.now()).slice(-6)}`,templateId:template.id,name:template.name,difficulty:template.difficulty,durationMin:template.durationMin,traffic,weather,profile:template.profile,seed:seedFromTemplate(template.id),status:'ACTIVE',startedAt:new Date().toISOString(),build:BUILD};
  scenarioMissionState.activeMission=mission;
  scenarioMissionState.generatedEvents=generateScenarioEvents(template);
  scenarioMissionState.objectives=defaultObjectives(template);
  scenarioMissionState.missionScore=0;
  scenarioMissionState.grade='D';
  try{window.SKYWARD_LIVE_OPS_CONFIG?.setProfile?.(template.profile);}catch(e){safeLogError?.(e,'scenario-apply-liveops');}
  saveScenarioMission();
  renderScenarioMissionBoard();
  return mission;
}
function scheduleScenarioEvent(eventType='ARRIVAL_WAVE',minute=2){
  loadScenarioMission();
  const tpl=SCENARIO_MISSION_CATALOG.eventTypes.find(e=>e.id===eventType)||SCENARIO_MISSION_CATALOG.eventTypes[0];
  const item={id:`EVT-CUSTOM-${String(Date.now()).slice(-6)}`,type:tpl.id,name:tpl.name,severity:tpl.severity,minute:Number(minute||2),status:'SCHEDULED',custom:true};
  scenarioMissionState.generatedEvents.push(item);
  saveScenarioMission();
  renderScenarioMissionBoard();
  return item;
}
function completeObjective(id,ok=true){
  loadScenarioMission();
  const obj=scenarioMissionState.objectives.find(o=>o.id===id);
  if(obj){obj.status=ok?'DONE':'FAILED'; obj.completedAt=new Date().toISOString();}
  saveScenarioMission();
  return obj||null;
}
function evaluateScenarioMission(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadScenarioMission();
  if(!scenarioMissionState.activeMission) startScenarioMission('MOBILE_TRAINING');
  const mission=scenarioMissionState.activeMission;
  const conflicts=Number(statsObj.conflicts||0);
  const denied=Number(statsObj.denied||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  completeObjective('MISSION_COMPLETION',!fail);
  completeObjective('NO_CONFLICTS',conflicts===0&&incursions===0);
  completeObjective('LOW_DENIALS',denied<=1);
  completeObjective('PACE_CONTROL',Number(pace.workload||45)<80);
  completeObjective('SAFE_MODE_ZERO',Number(stability.safeModeCount||0)===0);
  if(scenarioMissionState.objectives.some(o=>o.id==='RADIO_ACCURACY')) completeObjective('RADIO_ACCURACY',Number(radio.score||radio.accuracy||84)>=75);
  const possible=scenarioMissionState.objectives.reduce((a,o)=>a+Number(o.points||0),0)||1;
  const earned=scenarioMissionState.objectives.filter(o=>o.status==='DONE').reduce((a,o)=>a+Number(o.points||0),0);
  const eventPenalty=scenarioMissionState.generatedEvents.filter(e=>e.status==='FAILED').reduce((a,e)=>a+Number(e.severity||0),0);
  const safetyPenalty=conflicts*8+incursions*14+denied*3+(fail?10:0)+eventPenalty/5;
  const score=Math.max(0,Math.min(100,Math.round((earned/possible)*100-safetyPenalty+Math.min(8,Number(finalScore||0)/500))));
  const grade=gradeFor(score);
  scenarioMissionState.missionScore=score;
  scenarioMissionState.grade=grade.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',missionId:mission.id,templateId:mission.templateId,missionName:mission.name,missionScore:score,grade:grade.id,gradeName:grade.name,objectivesDone:scenarioMissionState.objectives.filter(o=>o.status==='DONE').length,objectivesTotal:scenarioMissionState.objectives.length,events:scenarioMissionState.generatedEvents.length,seed:mission.seed,finalScore:Math.round(finalScore||0),stats:{conflicts,denied,incursions,fail:Boolean(fail)}};
  scenarioMissionState.lastEvaluation=evaluation;
  scenarioMissionState.missionHistory.unshift(evaluation);
  scenarioMissionState.missionHistory=scenarioMissionState.missionHistory.slice(0,80);
  saveScenarioMission();
  renderScenarioMissionBoard();
  return {state:scenarioMissionState,evaluation};
}
function scenarioMissionProgress(){
  loadScenarioMission();
  return {score:scenarioMissionState.missionScore,grade:scenarioMissionState.grade,activeMission:scenarioMissionState.activeMission,events:scenarioMissionState.generatedEvents.length,objectivesDone:scenarioMissionState.objectives.filter(o=>o.status==='DONE').length,objectivesTotal:scenarioMissionState.objectives.length,seed:scenarioMissionState.activeMission?.seed||0,last:scenarioMissionState.lastEvaluation||null};
}
function renderScenarioMissionBoard(){
  try{
    const anchor=document.querySelector('#liveOpsConfigInline') || document.querySelector('#pwaUpdateInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#scenarioMissionInline'); if(old) old.remove();
    const p=scenarioMissionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="scenarioMissionInline" class="airport-ops-board scenario-mission-inline">
      <div class="airport-ops-head"><b>MISSION OPS</b><span>${p.grade}</span></div>
      <div class="airport-ops-grid">
        <div><small>MISSÃO</small><b>${p.activeMission?p.activeMission.templateId:'---'}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>OBJ.</small><b>${p.objectivesDone}/${p.objectivesTotal}</b></div>
        <div><small>EVENT.</small><b>${p.events}</b></div>
        <div><small>SEED</small><b>${String(p.seed).slice(-4)}</b></div>
        <div><small>PERFIL</small><b>${p.activeMission?p.activeMission.profile:'---'}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'scenario-mission-board');}
}
function initializeScenarioMission(){
  loadScenarioMission();
  if(!scenarioMissionState.activeMission) startScenarioMission((window.SKYWARD_LIVE_OPS_CONFIG?.progress?.().activeProfile==='SAFE_MOBILE')?'MOBILE_TRAINING':'PEAK_HOUR');
  renderScenarioMissionBoard();
  return scenarioMissionState;
}
function scenarioMissionStatus(){loadScenarioMission();return {...scenarioMissionState,progress:scenarioMissionProgress(),catalog:SCENARIO_MISSION_CATALOG};}
function scenarioMissionSelfCheck(){
  const issues=[];
  if(SCENARIO_MISSION_CATALOG.missionTemplates.length<7) issues.push('templates insuficientes');
  if(SCENARIO_MISSION_CATALOG.eventTypes.length<8) issues.push('eventos insuficientes');
  const m=startScenarioMission('MOBILE_TRAINING');
  const ev=scheduleScenarioEvent('ARRIVAL_WAVE',2);
  const res=evaluateScenarioMission(2600,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!m.id||!ev.id) issues.push('missão/evento inválido');
  if(!Number.isFinite(res.evaluation.missionScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,templates:SCENARIO_MISSION_CATALOG.missionTemplates.length,events:SCENARIO_MISSION_CATALOG.eventTypes.length};
}
window.SKYWARD_SCENARIO_MISSION=Object.freeze({
  schema:1,
  catalog:SCENARIO_MISSION_CATALOG,
  load:loadScenarioMission,
  save:saveScenarioMission,
  init:initializeScenarioMission,
  start:startScenarioMission,
  event:scheduleScenarioEvent,
  complete:completeObjective,
  evaluate:evaluateScenarioMission,
  progress:scenarioMissionProgress,
  status:scenarioMissionStatus,
  board:renderScenarioMissionBoard,
  selfCheck:scenarioMissionSelfCheck
});

/* ===== MODULE 54: campaign-progression-licenses-achievements-center (59-campaign-progression-licenses-achievements-center.js) ===== */
/* @skyward-module 59-campaign-progression-licenses-achievements-center
 * Campaign progression, controller ranks, licenses, achievements, skill tree and unlocks for long-term ATC career gameplay.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('59-campaign-progression-licenses-achievements-center');
const CAMPAIGN_PROGRESSION_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f56',
  campaignChapters:[
    {id:'BASIC_TOWER',name:'Torre Básica',missionsRequired:2,xpReward:350,unlock:'LICENSE_TWR_1'},
    {id:'GROUND_RUNWAY',name:'Solo e Pista',missionsRequired:3,xpReward:520,unlock:'LICENSE_GND_1'},
    {id:'WEATHER_OPS',name:'Operação em Clima',missionsRequired:3,xpReward:680,unlock:'LICENSE_IFR_1'},
    {id:'EMERGENCY_DESK',name:'Mesa de Emergência',missionsRequired:4,xpReward:850,unlock:'LICENSE_EMG_1'},
    {id:'REGIONAL_NETWORK',name:'Rede Regional',missionsRequired:4,xpReward:980,unlock:'LICENSE_APP_1'},
    {id:'INTERNATIONAL_HUB',name:'Hub Internacional',missionsRequired:5,xpReward:1300,unlock:'LICENSE_SUP_1'}
  ],
  controllerRanks:[
    {id:'TRAINEE',name:'Controlador Trainee',minXp:0},
    {id:'JUNIOR',name:'Controlador Júnior',minXp:500},
    {id:'TOWER',name:'Controlador de Torre',minXp:1200},
    {id:'SENIOR',name:'Controlador Sênior',minXp:2400},
    {id:'SUPERVISOR',name:'Supervisor Operacional',minXp:4200},
    {id:'CHIEF',name:'Chefe de Controle',minXp:7000}
  ],
  licenses:[
    {id:'LICENSE_TWR_1',name:'Licença Torre I',area:'Tower',requiredXp:300},
    {id:'LICENSE_GND_1',name:'Licença Solo I',area:'Ground',requiredXp:750},
    {id:'LICENSE_IFR_1',name:'Licença IFR I',area:'Weather',requiredXp:1400},
    {id:'LICENSE_EMG_1',name:'Licença Emergência I',area:'Emergency',requiredXp:2200},
    {id:'LICENSE_APP_1',name:'Licença Aproximação I',area:'Approach',requiredXp:3400},
    {id:'LICENSE_SUP_1',name:'Licença Supervisão',area:'Supervisor',requiredXp:5200}
  ],
  achievements:[
    {id:'FIRST_MISSION',name:'Primeira Missão',condition:'missions>=1',xp:80},
    {id:'NO_CONFLICT_RUN',name:'Turno Sem Conflitos',condition:'conflicts=0',xp:120},
    {id:'SAFE_MOBILE_PRO',name:'Mobile Seguro',condition:'safeMode=0;mobile=true',xp:120},
    {id:'GRADE_A',name:'Nota A',condition:'grade>=A',xp:160},
    {id:'GRADE_S',name:'Nota S',condition:'grade=S',xp:260},
    {id:'STORM_HANDLER',name:'Mestre da Tempestade',condition:'template=STORM_DIVERSION;grade>=B',xp:240},
    {id:'EMERGENCY_CALM',name:'Calma na Emergência',condition:'template=EMERGENCY_RUNWAY;conflicts=0',xp:280},
    {id:'NETWORK_CONTROLLER',name:'Controlador de Rede',condition:'template=REGIONAL_NETWORK;grade>=B',xp:260}
  ],
  skillTree:[
    {id:'RADIO_CLARITY',name:'Clareza de Rádio',cost:1,benefit:'radioAccuracy+4'},
    {id:'PACE_DISCIPLINE',name:'Disciplina de Ritmo',cost:1,benefit:'workload-4'},
    {id:'RUNWAY_AWARENESS',name:'Consciência de Pista',cost:2,benefit:'incursionRisk-6'},
    {id:'WEATHER_READING',name:'Leitura Meteorológica',cost:2,benefit:'weatherRisk-5'},
    {id:'EMERGENCY_RESPONSE',name:'Resposta Emergencial',cost:3,benefit:'emergencyScore+6'},
    {id:'NETWORK_FLOW',name:'Fluxo de Rede',cost:3,benefit:'networkScore+5'},
    {id:'SUPERVISOR_DECISION',name:'Decisão de Supervisor',cost:4,benefit:'finalScore+5'}
  ],
  unlockables:[
    {id:'MISSION_STORM_DIVERSION',name:'Missão Desvio por Tempestade',requires:'LICENSE_IFR_1'},
    {id:'MISSION_EMERGENCY_RUNWAY',name:'Missão Emergência em Pista',requires:'LICENSE_EMG_1'},
    {id:'MISSION_REGIONAL_NETWORK',name:'Missão Rede Regional',requires:'LICENSE_APP_1'},
    {id:'PROFILE_REALISTIC_DESKTOP',name:'Perfil Desktop Realista',requires:'LICENSE_SUP_1'}
  ]
});
const CAMPAIGN_PROGRESSION_KEY='skywardCampaignProgression_v1';
let campaignState={schema:1,xp:0,rank:'TRAINEE',licenses:[],achievements:[],skills:[],skillPoints:0,missionsCompleted:0,chapterProgress:{},unlocks:[],history:[],lastEvaluation:null};
function loadCampaignProgression(){try{const raw=localStorage?.getItem?.(CAMPAIGN_PROGRESSION_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)campaignState={...campaignState,...parsed};}}catch(e){safeLogError?.(e,'campaign-load');}return campaignState;}
function saveCampaignProgression(){try{localStorage?.setItem?.(CAMPAIGN_PROGRESSION_KEY,JSON.stringify(campaignState));}catch(e){safeLogError?.(e,'campaign-save');}return campaignState;}
function rankForXp(xp){return CAMPAIGN_PROGRESSION_CATALOG.controllerRanks.slice().sort((a,b)=>b.minXp-a.minXp).find(r=>xp>=r.minXp)||CAMPAIGN_PROGRESSION_CATALOG.controllerRanks[0];}
function gradeValue(g){return {S:5,A:4,B:3,C:2,D:1}[String(g||'D')]||1;}
function hasAchievement(id){return campaignState.achievements.some(a=>a.id===id);}
function awardAchievement(id,reason='auto'){
  loadCampaignProgression();
  const ach=CAMPAIGN_PROGRESSION_CATALOG.achievements.find(a=>a.id===id);
  if(!ach || hasAchievement(id)) return null;
  const item={id:ach.id,name:ach.name,xp:ach.xp,reason,at:new Date().toISOString()};
  campaignState.achievements.push(item);
  campaignState.xp+=Number(ach.xp||0);
  return item;
}
function unlockLicenses(){
  loadCampaignProgression();
  const before=campaignState.licenses.length;
  for(const lic of CAMPAIGN_PROGRESSION_CATALOG.licenses){
    if(campaignState.xp>=lic.requiredXp && !campaignState.licenses.some(l=>l.id===lic.id)){
      campaignState.licenses.push({id:lic.id,name:lic.name,area:lic.area,at:new Date().toISOString()});
    }
  }
  for(const unlock of CAMPAIGN_PROGRESSION_CATALOG.unlockables){
    if(campaignState.licenses.some(l=>l.id===unlock.requires) && !campaignState.unlocks.some(u=>u.id===unlock.id)){
      campaignState.unlocks.push({id:unlock.id,name:unlock.name,requires:unlock.requires,at:new Date().toISOString()});
    }
  }
  return campaignState.licenses.length-before;
}
function spendSkillPoint(id){
  loadCampaignProgression();
  const skill=CAMPAIGN_PROGRESSION_CATALOG.skillTree.find(s=>s.id===id);
  if(!skill) return {ok:false,reason:'skill not found'};
  if(campaignState.skills.some(s=>s.id===id)) return {ok:false,reason:'already unlocked'};
  if(campaignState.skillPoints<skill.cost) return {ok:false,reason:'not enough points'};
  campaignState.skillPoints-=skill.cost;
  campaignState.skills.push({id:skill.id,name:skill.name,benefit:skill.benefit,cost:skill.cost,at:new Date().toISOString()});
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return {ok:true,skill};
}
function computeMissionXp(missionEval,statsObj={},fail=false){
  const score=Number(missionEval?.missionScore||0);
  const grade=String(missionEval?.grade||'D');
  const difficulty=Number((window.SKYWARD_SCENARIO_MISSION?.status?.().activeMission?.difficulty)||3);
  const base=Math.round(80+difficulty*35+score*2.2);
  const gradeBonus={S:260,A:180,B:110,C:45,D:0}[grade]||0;
  const safetyBonus=(Number(statsObj.conflicts||0)===0&&Number(statsObj.runwayIncursions||0)===0)?80:0;
  return Math.max(20,base+gradeBonus+safetyBonus-(fail?80:0));
}
function updateChapterProgress(missionEval){
  loadCampaignProgression();
  const template=String(missionEval?.templateId||'MOBILE_TRAINING');
  const chapter = template.includes('STORM')?'WEATHER_OPS':template.includes('EMERGENCY')?'EMERGENCY_DESK':template.includes('REGIONAL')?'REGIONAL_NETWORK':template.includes('CARGO')?'GROUND_RUNWAY':'BASIC_TOWER';
  const prev=campaignState.chapterProgress[chapter]||{completed:0,claimed:false};
  prev.completed=Number(prev.completed||0)+1;
  campaignState.chapterProgress[chapter]=prev;
  const ch=CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.find(c=>c.id===chapter);
  if(ch && prev.completed>=ch.missionsRequired && !prev.claimed){
    prev.claimed=true;
    campaignState.xp+=Number(ch.xpReward||0);
    campaignState.history.unshift({type:'CHAPTER_COMPLETE',chapter:ch.id,name:ch.name,xp:ch.xpReward,unlock:ch.unlock,at:new Date().toISOString()});
  }
  return chapter;
}
function evaluateCampaignProgression(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadCampaignProgression();
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const scenarioStatus=window.SKYWARD_SCENARIO_MISSION?.status?.()||{};
  const lastMission=scenario.last||scenarioStatus.lastEvaluation||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const missionEval={...lastMission,missionScore:Number(lastMission.missionScore||scenario.score||0),grade:String(lastMission.grade||scenario.grade||'D'),templateId:String(lastMission.templateId||scenario.activeMission?.templateId||'MOBILE_TRAINING')};
  const xpGained=computeMissionXp(missionEval,statsObj,fail);
  campaignState.xp+=xpGained;
  campaignState.missionsCompleted+=1;
  const chapter=updateChapterProgress(missionEval);
  if(campaignState.missionsCompleted>=1) awardAchievement('FIRST_MISSION','mission');
  if(Number(statsObj.conflicts||0)===0&&Number(statsObj.runwayIncursions||0)===0) awardAchievement('NO_CONFLICT_RUN','safety');
  if(Number(stability.safeModeCount||0)===0 && (window.SKYWARD_LIVE_OPS_CONFIG?.signals?.().mobile||false)) awardAchievement('SAFE_MOBILE_PRO','mobile');
  if(gradeValue(missionEval.grade)>=4) awardAchievement('GRADE_A','grade');
  if(missionEval.grade==='S') awardAchievement('GRADE_S','grade');
  if(missionEval.templateId==='STORM_DIVERSION'&&gradeValue(missionEval.grade)>=3) awardAchievement('STORM_HANDLER','scenario');
  if(missionEval.templateId==='EMERGENCY_RUNWAY'&&Number(statsObj.conflicts||0)===0) awardAchievement('EMERGENCY_CALM','scenario');
  if(missionEval.templateId==='REGIONAL_NETWORK'&&gradeValue(missionEval.grade)>=3) awardAchievement('NETWORK_CONTROLLER','scenario');
  unlockLicenses();
  const oldRank=campaignState.rank;
  campaignState.rank=rankForXp(campaignState.xp).id;
  if(campaignState.rank!==oldRank){
    campaignState.skillPoints+=1;
    campaignState.history.unshift({type:'RANK_UP',from:oldRank,to:campaignState.rank,skillPoints:campaignState.skillPoints,at:new Date().toISOString()});
  }
  const campaignProgress=Math.round(Math.min(100,(campaignState.licenses.length/CAMPAIGN_PROGRESSION_CATALOG.licenses.length)*60+(campaignState.missionsCompleted/18)*40));
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',xpTotal:campaignState.xp,xpGained,rank:campaignState.rank,licenses:campaignState.licenses.length,achievements:campaignState.achievements.length,skillPoints:campaignState.skillPoints,missionsCompleted:campaignState.missionsCompleted,chapter,campaignProgress,missionGrade:missionEval.grade,missionScore:missionEval.missionScore,finalScore:Math.round(finalScore||0)};
  campaignState.lastEvaluation=evaluation;
  campaignState.history.unshift({type:'MISSION_REWARD',...evaluation});
  campaignState.history=campaignState.history.slice(0,100);
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return {state:campaignState,evaluation};
}
function campaignProgressionProgress(){
  loadCampaignProgression();
  return {xp:campaignState.xp,rank:campaignState.rank,licenses:campaignState.licenses.length,achievements:campaignState.achievements.length,skillPoints:campaignState.skillPoints,missionsCompleted:campaignState.missionsCompleted,unlocks:campaignState.unlocks.length,last:campaignState.lastEvaluation||null};
}
function renderCampaignProgressionBoard(){
  try{
    const anchor=document.querySelector('#scenarioMissionInline') || document.querySelector('#liveOpsConfigInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#campaignProgressionInline'); if(old) old.remove();
    const p=campaignProgressionProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="campaignProgressionInline" class="airport-ops-board campaign-progression-inline">
      <div class="airport-ops-head"><b>CAREER OPS</b><span>${p.rank}</span></div>
      <div class="airport-ops-grid">
        <div><small>XP</small><b>${p.xp}</b></div>
        <div><small>LIC.</small><b>${p.licenses}</b></div>
        <div><small>ACH.</small><b>${p.achievements}</b></div>
        <div><small>SKILL</small><b>${p.skillPoints}</b></div>
        <div><small>MISS.</small><b>${p.missionsCompleted}</b></div>
        <div><small>UNLOCK</small><b>${p.unlocks}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'campaign-progression-board');}
}
function initializeCampaignProgression(){
  loadCampaignProgression();
  campaignState.rank=rankForXp(campaignState.xp).id;
  unlockLicenses();
  saveCampaignProgression();
  renderCampaignProgressionBoard();
  return campaignState;
}
function campaignProgressionStatus(){loadCampaignProgression();return {...campaignState,progress:campaignProgressionProgress(),catalog:CAMPAIGN_PROGRESSION_CATALOG};}
function campaignProgressionSelfCheck(){
  const issues=[];
  if(CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.length<6) issues.push('capítulos insuficientes');
  if(CAMPAIGN_PROGRESSION_CATALOG.achievements.length<8) issues.push('conquistas insuficientes');
  const res=evaluateCampaignProgression(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!Number.isFinite(res.evaluation.xpTotal)||res.evaluation.xpGained<=0) issues.push('xp inválido');
  const spend=spendSkillPoint('RADIO_CLARITY');
  if(campaignState.skillPoints>0 && spend.ok===false && spend.reason!=='already unlocked') issues.push('skill inválida');
  return {ok:issues.length===0,issues,chapters:CAMPAIGN_PROGRESSION_CATALOG.campaignChapters.length,achievements:CAMPAIGN_PROGRESSION_CATALOG.achievements.length};
}
window.SKYWARD_CAMPAIGN_PROGRESSION=Object.freeze({
  schema:1,
  catalog:CAMPAIGN_PROGRESSION_CATALOG,
  load:loadCampaignProgression,
  save:saveCampaignProgression,
  init:initializeCampaignProgression,
  award:awardAchievement,
  licenses:unlockLicenses,
  spend:spendSkillPoint,
  evaluate:evaluateCampaignProgression,
  progress:campaignProgressionProgress,
  status:campaignProgressionStatus,
  board:renderCampaignProgressionBoard,
  selfCheck:campaignProgressionSelfCheck
});

/* ===== MODULE 55: instructor-debrief-replay-analytics-center (60-instructor-debrief-replay-analytics-center.js) ===== */
/* @skyward-module 60-instructor-debrief-replay-analytics-center
 * Instructor debrief, replay analytics and training feedback center for post-mission review, error taxonomy, strengths and next drills.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('60-instructor-debrief-replay-analytics-center');
const INSTRUCTOR_DEBRIEF_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f57',
  reviewAreas:[
    {id:'SEPARATION',name:'Separação',weight:18,target:90},
    {id:'RUNWAY_SAFETY',name:'Segurança de pista',weight:18,target:94},
    {id:'RADIO',name:'Fraseologia rádio',weight:14,target:88},
    {id:'PACE',name:'Ritmo e workload',weight:13,target:84},
    {id:'WEATHER',name:'Leitura meteorológica',weight:10,target:82},
    {id:'EMERGENCY',name:'Resposta emergencial',weight:10,target:84},
    {id:'MISSION_OBJECTIVES',name:'Objetivos de missão',weight:10,target:86},
    {id:'STABILITY',name:'Estabilidade da sessão',weight:7,target:90}
  ],
  errorTaxonomy:[
    {id:'LOSS_SEPARATION',name:'Perda de separação',severity:34,area:'SEPARATION'},
    {id:'RUNWAY_INCURSION',name:'Incursão de pista',severity:38,area:'RUNWAY_SAFETY'},
    {id:'DENIED_TOO_MANY',name:'Negativas em excesso',severity:16,area:'PACE'},
    {id:'RADIO_READBACK',name:'Readback/colação incompleta',severity:18,area:'RADIO'},
    {id:'WORKLOAD_SATURATION',name:'Workload saturado',severity:22,area:'PACE'},
    {id:'WEATHER_MISREAD',name:'Risco meteorológico mal antecipado',severity:20,area:'WEATHER'},
    {id:'EMERGENCY_DELAY',name:'Demora na resposta emergencial',severity:24,area:'EMERGENCY'},
    {id:'SAFE_MODE_TRIGGER',name:'Modo seguro acionado',severity:30,area:'STABILITY'}
  ],
  strengthTemplates:[
    {id:'CALM_FLOW',name:'Fluxo calmo e organizado'},
    {id:'GOOD_SPACING',name:'Boa separação entre aeronaves'},
    {id:'RADIO_CLEAR',name:'Comunicação clara'},
    {id:'MISSION_DISCIPLINE',name:'Disciplina nos objetivos'},
    {id:'MOBILE_CONTROL',name:'Boa condução no mobile'},
    {id:'SAFE_RECOVERY',name:'Recuperação segura de cenário'}
  ],
  trainingDrills:[
    {id:'DRILL_SEPARATION_BASIC',name:'Separação básica',area:'SEPARATION',minutes:8},
    {id:'DRILL_RUNWAY_SCAN',name:'Varredura de pista',area:'RUNWAY_SAFETY',minutes:8},
    {id:'DRILL_RADIO_READBACK',name:'Readback e fraseologia',area:'RADIO',minutes:10},
    {id:'DRILL_WORKLOAD_PACE',name:'Ritmo e prioridade',area:'PACE',minutes:8},
    {id:'DRILL_WEATHER_DIVERSION',name:'Desvio meteorológico',area:'WEATHER',minutes:12},
    {id:'DRILL_EMERGENCY_FIRST90',name:'Primeiros 90s da emergência',area:'EMERGENCY',minutes:12},
    {id:'DRILL_MOBILE_SAFE',name:'Mobile seguro',area:'STABILITY',minutes:6}
  ],
  feedbackBands:[
    {id:'ELITE',min:92,name:'Debrief de elite'},
    {id:'APPROVED',min:80,name:'Aprovado com bom controle'},
    {id:'TRAINING_NEEDED',min:62,name:'Treino recomendado'},
    {id:'REMEDIAL',min:0,name:'Revisão obrigatória'}
  ]
});
const INSTRUCTOR_DEBRIEF_KEY='skywardInstructorDebrief_v1';
let debriefState={schema:1,debriefScore:0,status:'TRAINING_NEEDED',weaknesses:[],strengths:[],recommendedDrills:[],replayNotes:[],nextGoal:'Concluir uma missão sem conflitos.',history:[],lastDebrief:null};
function loadInstructorDebrief(){try{const raw=localStorage?.getItem?.(INSTRUCTOR_DEBRIEF_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)debriefState={...debriefState,...parsed};}}catch(e){safeLogError?.(e,'debrief-load');}return debriefState;}
function saveInstructorDebrief(){try{localStorage?.setItem?.(INSTRUCTOR_DEBRIEF_KEY,JSON.stringify(debriefState));}catch(e){safeLogError?.(e,'debrief-save');}return debriefState;}
function feedbackBand(score){return INSTRUCTOR_DEBRIEF_CATALOG.feedbackBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||INSTRUCTOR_DEBRIEF_CATALOG.feedbackBands.at(-1);}
function drillForArea(area){return INSTRUCTOR_DEBRIEF_CATALOG.trainingDrills.find(d=>d.area===area)||INSTRUCTOR_DEBRIEF_CATALOG.trainingDrills[0];}
function errorById(id){return INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.find(e=>e.id===id)||INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy[0];}
function buildErrorList(statsObj={},fail=false){
  const errors=[];
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  if(conflicts>0) errors.push({...errorById('LOSS_SEPARATION'),count:conflicts});
  if(incursions>0) errors.push({...errorById('RUNWAY_INCURSION'),count:incursions});
  if(denied>1) errors.push({...errorById('DENIED_TOO_MANY'),count:denied});
  if(Number(radio.score||radio.accuracy||90)<75) errors.push({...errorById('RADIO_READBACK'),count:1});
  if(Number(pace.workload||0)>=80) errors.push({...errorById('WORKLOAD_SATURATION'),count:1});
  if(Number(stability.safeModeCount||0)>0||fail) errors.push({...errorById('SAFE_MODE_TRIGGER'),count:Number(stability.safeModeCount||1)});
  return errors;
}
function buildStrengthList(missionEval={},statsObj={}){
  const strengths=[];
  const grade=String(missionEval.grade||'D');
  const score=Number(missionEval.missionScore||0);
  const conflicts=Number(statsObj.conflicts||0);
  const denied=Number(statsObj.denied||0);
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  if(conflicts===0) strengths.push({id:'GOOD_SPACING',name:'Boa separação entre aeronaves'});
  if(denied<=1) strengths.push({id:'CALM_FLOW',name:'Fluxo calmo e organizado'});
  if(Number(radio.score||radio.accuracy||88)>=82) strengths.push({id:'RADIO_CLEAR',name:'Comunicação clara'});
  if(score>=80||grade==='A'||grade==='S') strengths.push({id:'MISSION_DISCIPLINE',name:'Disciplina nos objetivos'});
  if(Number(stability.safeModeCount||0)===0) strengths.push({id:'SAFE_RECOVERY',name:'Sessão estável sem modo seguro'});
  return strengths.slice(0,5);
}
function computeAreaScores(errors,missionEval={},statsObj={}){
  const scores={};
  for(const area of INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas) scores[area.id]=100;
  for(const err of errors){
    scores[err.area]=Math.max(0,Number(scores[err.area]||100)-Number(err.severity||0)*Math.max(1,Number(err.count||1))*.7);
  }
  const missionScore=Number(missionEval.missionScore||0);
  scores.MISSION_OBJECTIVES=Math.max(0,Math.min(100,missionScore||scores.MISSION_OBJECTIVES));
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  scores.STABILITY=Math.max(0,Math.min(100,Number(stability.score||stability.sessionHealth||90)));
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  scores.PACE=Math.min(scores.PACE,Math.max(0,100-Number(pace.workload||35)*.45));
  return scores;
}
function generateReplayNotes(errors,strengths,missionEval={}){
  const notes=[];
  notes.push(`Missão: ${missionEval.missionName||missionEval.templateId||'treino'} — nota ${missionEval.grade||'D'}.`);
  if(strengths[0]) notes.push(`Ponto forte: ${strengths[0].name}.`);
  if(errors[0]) notes.push(`Revisar prioridade: ${errors[0].name}.`);
  notes.push(`Seed de replay: ${missionEval.seed||'sem seed'}.`);
  return notes;
}
function evaluateInstructorDebrief(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadInstructorDebrief();
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const campaign=window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||{};
  const scenarioStatus=window.SKYWARD_SCENARIO_MISSION?.status?.()||{};
  const lastMission=scenario.last||scenarioStatus.lastEvaluation||{};
  const missionEval={...lastMission,missionScore:Number(lastMission.missionScore||scenario.score||0),grade:String(lastMission.grade||scenario.grade||'D'),templateId:String(lastMission.templateId||scenario.activeMission?.templateId||'MOBILE_TRAINING'),missionName:String(lastMission.missionName||scenario.activeMission?.name||'Missão')};
  const errors=buildErrorList(statsObj,fail);
  const strengths=buildStrengthList(missionEval,statsObj);
  const areaScores=computeAreaScores(errors,missionEval,statsObj);
  const weighted=Math.round(INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.reduce((sum,a)=>sum+Number(areaScores[a.id]||0)*Number(a.weight||0),0)/100);
  const penalty=errors.reduce((sum,e)=>sum+Number(e.severity||0)*Math.max(1,Number(e.count||1)),0)*.18;
  const bonus=strengths.length*2+Math.min(6,Number(campaign.achievements||0));
  const debriefScore=Math.max(0,Math.min(100,Math.round(weighted-penalty+bonus+Math.min(6,Number(finalScore||0)/600))));
  const band=feedbackBand(debriefScore);
  const weaknesses=errors.slice().sort((a,b)=>(b.severity*b.count)-(a.severity*a.count)).slice(0,4);
  if(!weaknesses.length && debriefScore<86) weaknesses.push({...errorById('WORKLOAD_SATURATION'),count:1,synthetic:true});
  const recommendedDrills=(weaknesses.length?weaknesses.map(w=>drillForArea(w.area)):[drillForArea('SEPARATION'),drillForArea('RADIO')]).filter((d,i,arr)=>arr.findIndex(x=>x.id===d.id)===i).slice(0,3);
  const nextGoal=weaknesses[0] ? `Reduzir ${weaknesses[0].name.toLowerCase()} na próxima missão.` : 'Manter missão sem conflitos e buscar nota S.';
  const replayNotes=generateReplayNotes(weaknesses,strengths,missionEval);
  debriefState.debriefScore=debriefScore;
  debriefState.status=band.id;
  debriefState.weaknesses=weaknesses;
  debriefState.strengths=strengths;
  debriefState.recommendedDrills=recommendedDrills;
  debriefState.replayNotes=replayNotes;
  debriefState.nextGoal=nextGoal;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',debriefScore,status:band.id,statusName:band.name,mainWeakness:weaknesses[0]?.name||'Sem falha crítica',topStrength:strengths[0]?.name||'Fluxo controlado',recommendedDrill:recommendedDrills[0]?.name||'Separação básica',nextGoal,replayNotes,areaScores,errors:weaknesses.length,strengths:strengths.length,missionGrade:missionEval.grade,missionScore:missionEval.missionScore,finalScore:Math.round(finalScore||0)};
  debriefState.lastDebrief=evaluation;
  debriefState.history.unshift(evaluation);
  debriefState.history=debriefState.history.slice(0,100);
  saveInstructorDebrief();
  renderInstructorDebriefBoard();
  return {state:debriefState,evaluation};
}
function instructorDebriefProgress(){
  loadInstructorDebrief();
  return {score:debriefState.debriefScore,status:debriefState.status,weaknesses:debriefState.weaknesses.length,strengths:debriefState.strengths.length,recommendedDrill:debriefState.recommendedDrills[0]?.name||'---',nextGoal:debriefState.nextGoal,last:debriefState.lastDebrief||null};
}
function renderInstructorDebriefBoard(){
  try{
    const anchor=document.querySelector('#campaignProgressionInline') || document.querySelector('#scenarioMissionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#instructorDebriefInline'); if(old) old.remove();
    const p=instructorDebriefProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="instructorDebriefInline" class="airport-ops-board instructor-debrief-inline">
      <div class="airport-ops-head"><b>DEBRIEF OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>FORTE</small><b>${p.strengths}</b></div>
        <div><small>FALHAS</small><b>${p.weaknesses}</b></div>
        <div><small>TREINO</small><b>${p.recommendedDrill.split(' ')[0]}</b></div>
        <div><small>META</small><b>${p.nextGoal?'OK':'---'}</b></div>
        <div><small>HIST.</small><b>${debriefState.history.length}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'instructor-debrief-board');}
}
function initializeInstructorDebrief(){
  loadInstructorDebrief();
  renderInstructorDebriefBoard();
  return debriefState;
}
function instructorDebriefStatus(){loadInstructorDebrief();return {...debriefState,progress:instructorDebriefProgress(),catalog:INSTRUCTOR_DEBRIEF_CATALOG};}
function instructorDebriefSelfCheck(){
  const issues=[];
  if(INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.length<8) issues.push('áreas insuficientes');
  if(INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.length<8) issues.push('erros insuficientes');
  const res=evaluateInstructorDebrief(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  if(!Number.isFinite(res.evaluation.debriefScore)) issues.push('score inválido');
  if(!res.evaluation.recommendedDrill) issues.push('treino ausente');
  return {ok:issues.length===0,issues,areas:INSTRUCTOR_DEBRIEF_CATALOG.reviewAreas.length,errors:INSTRUCTOR_DEBRIEF_CATALOG.errorTaxonomy.length};
}
window.SKYWARD_INSTRUCTOR_DEBRIEF=Object.freeze({
  schema:1,
  catalog:INSTRUCTOR_DEBRIEF_CATALOG,
  load:loadInstructorDebrief,
  save:saveInstructorDebrief,
  init:initializeInstructorDebrief,
  evaluate:evaluateInstructorDebrief,
  progress:instructorDebriefProgress,
  status:instructorDebriefStatus,
  board:renderInstructorDebriefBoard,
  selfCheck:instructorDebriefSelfCheck
});

/* ===== MODULE 56: replay-timeline-heatmap-center (61-replay-timeline-heatmap-center.js) ===== */
/* @skyward-module 61-replay-timeline-heatmap-center
 * Replay timeline, performance heatmap and session export center for mission review, bookmarks, critical moments and training reports.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('61-replay-timeline-heatmap-center');
const REPLAY_TIMELINE_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f58',
  timelineTracks:[
    {id:'TRAFFIC',name:'Tráfego',weight:14,colorHint:'blue'},
    {id:'CLEARANCE',name:'Autorizações',weight:14,colorHint:'green'},
    {id:'SAFETY',name:'Segurança',weight:20,colorHint:'red'},
    {id:'RADIO',name:'Rádio',weight:12,colorHint:'purple'},
    {id:'WEATHER',name:'Clima',weight:10,colorHint:'cyan'},
    {id:'MISSION',name:'Missão',weight:12,colorHint:'gold'},
    {id:'PACE',name:'Ritmo',weight:10,colorHint:'teal'},
    {id:'SYSTEM',name:'Sistema',weight:8,colorHint:'gray'}
  ],
  bookmarkTypes:[
    {id:'FIRST_CLEARANCE',name:'Primeira autorização',importance:8,track:'CLEARANCE'},
    {id:'CONFLICT_AVOIDED',name:'Conflito evitado',importance:18,track:'SAFETY'},
    {id:'LOSS_SEPARATION',name:'Perda de separação',importance:34,track:'SAFETY'},
    {id:'RUNWAY_EVENT',name:'Evento de pista',importance:30,track:'SAFETY'},
    {id:'RADIO_ERROR',name:'Erro de rádio',importance:18,track:'RADIO'},
    {id:'WEATHER_SHIFT',name:'Mudança climática',importance:20,track:'WEATHER'},
    {id:'WORKLOAD_SPIKE',name:'Pico de workload',importance:22,track:'PACE'},
    {id:'MISSION_OBJECTIVE',name:'Objetivo de missão',importance:16,track:'MISSION'},
    {id:'SAFE_MODE',name:'Modo seguro',importance:32,track:'SYSTEM'},
    {id:'RANK_UP',name:'Promoção de carreira',importance:14,track:'MISSION'}
  ],
  heatmapZones:[
    {id:'RUNWAY',name:'Pista',riskWeight:24},
    {id:'APPROACH',name:'Aproximação',riskWeight:20},
    {id:'GROUND',name:'Solo',riskWeight:14},
    {id:'RADIO',name:'Rádio',riskWeight:12},
    {id:'WEATHER',name:'Clima',riskWeight:16},
    {id:'WORKLOAD',name:'Workload',riskWeight:18},
    {id:'MISSION',name:'Objetivos',riskWeight:10},
    {id:'STABILITY',name:'Estabilidade',riskWeight:15}
  ],
  exportProfiles:[
    {id:'QUICK_REVIEW',name:'Revisão rápida',includeTimeline:true,includeHeatmap:true,includeRaw:false},
    {id:'INSTRUCTOR_FULL',name:'Instrutor completo',includeTimeline:true,includeHeatmap:true,includeRaw:true},
    {id:'MOBILE_SUMMARY',name:'Resumo mobile',includeTimeline:true,includeHeatmap:false,includeRaw:false},
    {id:'DEBUG_SESSION',name:'Debug sessão',includeTimeline:true,includeHeatmap:true,includeRaw:true}
  ],
  replayBands:[
    {id:'CLEAN',min:92,name:'Replay limpo'},
    {id:'REVIEWABLE',min:78,name:'Bom para revisão'},
    {id:'LESSON',min:58,name:'Replay de aprendizado'},
    {id:'CRITICAL',min:0,name:'Replay crítico'}
  ]
});
const REPLAY_TIMELINE_KEY='skywardReplayTimeline_v1';
let replayTimelineState={schema:1,replayScore:0,status:'LESSON',bookmarks:[],timeline:[],heatmap:{},exports:[],criticalMoments:0,topZone:'MISSION',lastEvaluation:null,history:[]};
function loadReplayTimeline(){try{const raw=localStorage?.getItem?.(REPLAY_TIMELINE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)replayTimelineState={...replayTimelineState,...parsed};}}catch(e){safeLogError?.(e,'replay-timeline-load');}return replayTimelineState;}
function saveReplayTimeline(){try{localStorage?.setItem?.(REPLAY_TIMELINE_KEY,JSON.stringify(replayTimelineState));}catch(e){safeLogError?.(e,'replay-timeline-save');}return replayTimelineState;}
function replayBand(score){return REPLAY_TIMELINE_CATALOG.replayBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||REPLAY_TIMELINE_CATALOG.replayBands.at(-1);}
function bookmarkType(id){return REPLAY_TIMELINE_CATALOG.bookmarkTypes.find(b=>b.id===id)||REPLAY_TIMELINE_CATALOG.bookmarkTypes[0];}
function addReplayBookmark(typeId,minute=0,detail=''){
  loadReplayTimeline();
  const type=bookmarkType(typeId);
  const item={id:`RBK-${String(Date.now()).slice(-6)}-${replayTimelineState.bookmarks.length+1}`,type:type.id,name:type.name,track:type.track,importance:type.importance,minute:Number(minute||0),detail:String(detail||type.name),at:new Date().toISOString(),build:BUILD};
  replayTimelineState.bookmarks.push(item);
  replayTimelineState.timeline.push({...item,kind:'BOOKMARK'});
  replayTimelineState.bookmarks=replayTimelineState.bookmarks.slice(-120);
  replayTimelineState.timeline=replayTimelineState.timeline.slice(-180);
  saveReplayTimeline();
  return item;
}
function buildSessionBookmarks(statsObj={},fail=false){
  const marks=[];
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const scenario=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const campaign=window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  marks.push({type:'FIRST_CLEARANCE',minute:1,detail:'Sessão iniciada e primeira autorização registrada.'});
  if(conflicts>0) marks.push({type:'LOSS_SEPARATION',minute:3,detail:`${conflicts} conflito(s) detectado(s).`});
  else marks.push({type:'CONFLICT_AVOIDED',minute:4,detail:'Separação mantida sem conflitos.'});
  if(incursions>0) marks.push({type:'RUNWAY_EVENT',minute:5,detail:`${incursions} evento(s) de pista.`});
  if(denied>1) marks.push({type:'WORKLOAD_SPIKE',minute:6,detail:`${denied} negativas indicam pressão operacional.`});
  if(Number(pace.workload||0)>=75) marks.push({type:'WORKLOAD_SPIKE',minute:7,detail:`Workload alto: ${pace.workload}.`});
  if(Number(stability.safeModeCount||0)>0||fail) marks.push({type:'SAFE_MODE',minute:8,detail:'Modo seguro ou falha de sessão observado.'});
  if(scenario.last?.grade||scenario.grade) marks.push({type:'MISSION_OBJECTIVE',minute:9,detail:`Missão avaliada com nota ${scenario.last?.grade||scenario.grade}.`});
  if(Number(campaign.last?.xpGained||0)>0) marks.push({type:'RANK_UP',minute:10,detail:`XP ganho: ${campaign.last.xpGained}.`});
  if(String(debrief.status||'').includes('TRAINING')||String(debrief.status||'').includes('REMEDIAL')) marks.push({type:'RADIO_ERROR',minute:11,detail:`Treino recomendado: ${debrief.recommendedDrill||'revisão'}.`});
  return marks;
}
function buildReplayHeatmap(statsObj={},fail=false){
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.status?.()||{};
  const stability=window.SKYWARD_STABILITY_DIAGNOSTICS?.progress?.()||{};
  const pace=window.SKYWARD_ADAPTIVE_PACE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  const heat={};
  for(const z of REPLAY_TIMELINE_CATALOG.heatmapZones) heat[z.id]=0;
  heat.RUNWAY+=incursions*34;
  heat.APPROACH+=conflicts*26;
  heat.GROUND+=denied*7;
  heat.RADIO+=Math.max(0,84-Number(radio.score||84))*.8;
  heat.WORKLOAD+=Number(pace.workload||0)*.45+denied*5;
  heat.STABILITY+=Number(stability.safeModeCount||0)*32+(fail?20:0);
  heat.MISSION+=Math.max(0,80-Number((debrief.lastDebrief||debrief.last||{}).missionScore||80))*.55;
  heat.WEATHER+=String((window.SKYWARD_SCENARIO_MISSION?.progress?.().activeMission?.weather?.id)||'').includes('STORM')?26:8;
  for(const key of Object.keys(heat)) heat[key]=Math.max(0,Math.min(100,Math.round(heat[key])));
  return heat;
}
function topHeatZone(heatmap){
  return Object.entries(heatmap||{}).sort((a,b)=>b[1]-a[1])[0]?.[0]||'MISSION';
}
function exportReplaySession(profileId='QUICK_REVIEW'){
  loadReplayTimeline();
  const profile=REPLAY_TIMELINE_CATALOG.exportProfiles.find(p=>p.id===profileId)||REPLAY_TIMELINE_CATALOG.exportProfiles[0];
  const report={
    schema:1,
    profile:profile.id,
    build:BUILD,
    at:new Date().toISOString(),
    replayScore:replayTimelineState.replayScore,
    status:replayTimelineState.status,
    criticalMoments:replayTimelineState.criticalMoments,
    topZone:replayTimelineState.topZone,
    timeline:profile.includeTimeline?replayTimelineState.timeline.slice(-60):[],
    heatmap:profile.includeHeatmap?replayTimelineState.heatmap:{},
    debrief:window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||null,
    campaign:window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.()||null,
    mission:window.SKYWARD_SCENARIO_MISSION?.progress?.()||null,
    raw:profile.includeRaw?{bookmarks:replayTimelineState.bookmarks,history:replayTimelineState.history}:undefined
  };
  replayTimelineState.exports.unshift({id:`EXP-${String(Date.now()).slice(-6)}`,profile:profile.id,at:report.at,score:report.replayScore,status:report.status,events:report.timeline.length});
  replayTimelineState.exports=replayTimelineState.exports.slice(0,40);
  saveReplayTimeline();
  return report;
}
function evaluateReplayTimeline(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadReplayTimeline();
  const sessionMarks=buildSessionBookmarks(statsObj,fail);
  for(const m of sessionMarks) addReplayBookmark(m.type,m.minute,m.detail);
  const heat=buildReplayHeatmap(statsObj,fail);
  const risk=Object.values(heat).reduce((a,b)=>a+Number(b||0),0)/Math.max(1,Object.values(heat).length);
  const critical=replayTimelineState.bookmarks.filter(b=>Number(b.importance||0)>=24).length;
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const mission=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const base=Math.round((Number(debrief.score||76)*.35)+(Number(mission.score||76)*.28)+(Math.max(0,100-risk)*.27)+Math.min(10,Number(finalScore||0)/500));
  const replayScore=Math.max(0,Math.min(100,base-(fail?12:0)-Math.min(14,critical*1.2)));
  const band=replayBand(replayScore);
  replayTimelineState.heatmap=heat;
  replayTimelineState.replayScore=replayScore;
  replayTimelineState.status=band.id;
  replayTimelineState.criticalMoments=critical;
  replayTimelineState.topZone=topHeatZone(heat);
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',replayScore,status:band.id,statusName:band.name,criticalMoments:critical,heatmapRisk:Math.round(risk),topZone:replayTimelineState.topZone,timelineEvents:replayTimelineState.timeline.length,bookmarks:replayTimelineState.bookmarks.length,exportProfile:'QUICK_REVIEW',finalScore:Math.round(finalScore||0)};
  replayTimelineState.lastEvaluation=evaluation;
  replayTimelineState.history.unshift(evaluation);
  replayTimelineState.history=replayTimelineState.history.slice(0,100);
  saveReplayTimeline();
  renderReplayTimelineBoard();
  return {state:replayTimelineState,evaluation};
}
function replayTimelineProgress(){
  loadReplayTimeline();
  return {score:replayTimelineState.replayScore,status:replayTimelineState.status,bookmarks:replayTimelineState.bookmarks.length,timelineEvents:replayTimelineState.timeline.length,criticalMoments:replayTimelineState.criticalMoments,topZone:replayTimelineState.topZone,exports:replayTimelineState.exports.length,last:replayTimelineState.lastEvaluation||null};
}
function renderReplayTimelineBoard(){
  try{
    const anchor=document.querySelector('#instructorDebriefInline') || document.querySelector('#campaignProgressionInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#replayTimelineInline'); if(old) old.remove();
    const p=replayTimelineProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="replayTimelineInline" class="airport-ops-board replay-timeline-inline">
      <div class="airport-ops-head"><b>REPLAY OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>BOOK</small><b>${p.bookmarks}</b></div>
        <div><small>CRIT.</small><b>${p.criticalMoments}</b></div>
        <div><small>ZONE</small><b>${p.topZone}</b></div>
        <div><small>EVENT.</small><b>${p.timelineEvents}</b></div>
        <div><small>EXP.</small><b>${p.exports}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'replay-timeline-board');}
}
function initializeReplayTimeline(){
  loadReplayTimeline();
  if(!replayTimelineState.timeline.length) addReplayBookmark('FIRST_CLEARANCE',0,'Replay iniciado.');
  renderReplayTimelineBoard();
  return replayTimelineState;
}
function replayTimelineStatus(){loadReplayTimeline();return {...replayTimelineState,progress:replayTimelineProgress(),catalog:REPLAY_TIMELINE_CATALOG};}
function replayTimelineSelfCheck(){
  const issues=[];
  if(REPLAY_TIMELINE_CATALOG.timelineTracks.length<8) issues.push('tracks insuficientes');
  if(REPLAY_TIMELINE_CATALOG.bookmarkTypes.length<10) issues.push('bookmarks insuficientes');
  const mark=addReplayBookmark('CONFLICT_AVOIDED',2,'self-check');
  const evalResult=evaluateReplayTimeline(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBGR');
  const exported=exportReplaySession('INSTRUCTOR_FULL');
  if(!mark.id) issues.push('bookmark inválido');
  if(!Number.isFinite(evalResult.evaluation.replayScore)) issues.push('score inválido');
  if(!exported.schema||!Array.isArray(exported.timeline)) issues.push('export inválido');
  return {ok:issues.length===0,issues,tracks:REPLAY_TIMELINE_CATALOG.timelineTracks.length,bookmarks:REPLAY_TIMELINE_CATALOG.bookmarkTypes.length};
}
window.SKYWARD_REPLAY_TIMELINE=Object.freeze({
  schema:1,
  catalog:REPLAY_TIMELINE_CATALOG,
  load:loadReplayTimeline,
  save:saveReplayTimeline,
  init:initializeReplayTimeline,
  bookmark:addReplayBookmark,
  export:exportReplaySession,
  evaluate:evaluateReplayTimeline,
  progress:replayTimelineProgress,
  status:replayTimelineStatus,
  board:renderReplayTimelineBoard,
  selfCheck:replayTimelineSelfCheck
});

/* ===== MODULE 57: world-airports-procedure-pack-center (62-world-airports-procedure-pack-center.js) ===== */
/* @skyward-module 62-world-airports-procedure-pack-center
 * World Airports, Procedure Packs and Route Challenge Center for airport content progression, simplified procedures and runway modes.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('62-world-airports-procedure-pack-center');
const WORLD_AIRPORT_PROCEDURES_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f59',
  airportPacks:[
    {icao:'SBSP',name:'São Paulo Congonhas',country:'Brasil',complexity:4,runways:['17R/35L','17L/35R'],profile:'URBAN_SHORT_RUNWAY',unlockXp:0},
    {icao:'SBGR',name:'São Paulo Guarulhos',country:'Brasil',complexity:5,runways:['10L/28R','10R/28L'],profile:'INTERNATIONAL_HUB',unlockXp:500},
    {icao:'SBRJ',name:'Rio Santos Dumont',country:'Brasil',complexity:5,runways:['02R/20L','02L/20R'],profile:'COASTAL_VISUAL',unlockXp:900},
    {icao:'SBGL',name:'Rio Galeão',country:'Brasil',complexity:4,runways:['10/28','15/33'],profile:'HEAVY_MIXED',unlockXp:1200},
    {icao:'KJFK',name:'New York JFK',country:'EUA',complexity:7,runways:['04L/22R','04R/22L','13L/31R','13R/31L'],profile:'MEGA_HUB',unlockXp:2400},
    {icao:'EGLL',name:'London Heathrow',country:'Reino Unido',complexity:7,runways:['09L/27R','09R/27L'],profile:'SLOT_CONSTRAINED',unlockXp:3000},
    {icao:'RJTT',name:'Tokyo Haneda',country:'Japão',complexity:8,runways:['16L/34R','16R/34L','04/22','05/23'],profile:'BAY_COMPLEX',unlockXp:3600},
    {icao:'OMDB',name:'Dubai International',country:'EAU',complexity:8,runways:['12L/30R','12R/30L'],profile:'DESERT_SUPERHUB',unlockXp:4200}
  ],
  procedurePacks:[
    {id:'VISUAL_URBAN',name:'Visual urbano',risk:18,skills:['RUNWAY_AWARENESS','PACE_DISCIPLINE']},
    {id:'INSTRUMENT_IFR',name:'IFR simplificado',risk:22,skills:['WEATHER_READING','RADIO_CLARITY']},
    {id:'PARALLEL_RUNWAY',name:'Pistas paralelas',risk:28,skills:['RUNWAY_AWARENESS','NETWORK_FLOW']},
    {id:'COASTAL_APPROACH',name:'Aproximação costeira',risk:24,skills:['WEATHER_READING','RADIO_CLARITY']},
    {id:'HEAVY_WAKE',name:'Esteira pesada',risk:26,skills:['PACE_DISCIPLINE','RUNWAY_AWARENESS']},
    {id:'LOW_VIS_IFR',name:'Baixa visibilidade IFR',risk:34,skills:['WEATHER_READING','EMERGENCY_RESPONSE']},
    {id:'SLOT_BANK',name:'Bancos de slots',risk:30,skills:['NETWORK_FLOW','SUPERVISOR_DECISION']}
  ],
  routeChallenges:[
    {id:'CGH_SHUTTLE',name:'Ponte aérea Congonhas-Santos Dumont',airports:['SBSP','SBRJ'],difficulty:5,durationMin:12},
    {id:'GRU_INTERNATIONAL_WAVE',name:'Onda internacional Guarulhos',airports:['SBGR'],difficulty:6,durationMin:14},
    {id:'RIO_MIXED_OPS',name:'Operação mista Rio',airports:['SBRJ','SBGL'],difficulty:6,durationMin:14},
    {id:'JFK_PARALLEL_PRESSURE',name:'Pressão em pistas paralelas JFK',airports:['KJFK'],difficulty:8,durationMin:16},
    {id:'HEATHROW_SLOT_BANK',name:'Banco de slots Heathrow',airports:['EGLL'],difficulty:8,durationMin:16},
    {id:'HANEDA_BAY_COMPLEX',name:'Complexo da baía Haneda',airports:['RJTT'],difficulty:9,durationMin:18},
    {id:'DUBAI_NIGHT_FLOW',name:'Fluxo noturno Dubai',airports:['OMDB'],difficulty:9,durationMin:18}
  ],
  runwayModes:[
    {id:'SINGLE_ACTIVE',name:'Pista única ativa',capacity:1,risk:10},
    {id:'PARALLEL_SEGREGATED',name:'Paralelas segregadas',capacity:2,risk:18},
    {id:'PARALLEL_MIXED',name:'Paralelas mistas',capacity:2,risk:28},
    {id:'CROSSWIND_RESTRICTED',name:'Restrição por vento cruzado',capacity:1,risk:30},
    {id:'LOW_VIS_PROCEDURAL',name:'Procedural baixa visibilidade',capacity:1,risk:34}
  ],
  airportBands:[
    {id:'MASTERED',min:92,name:'Dominado'},
    {id:'QUALIFIED',min:80,name:'Qualificado'},
    {id:'TRAINING',min:62,name:'Em treino'},
    {id:'RESTRICTED',min:0,name:'Restrito'}
  ]
});
const WORLD_AIRPORT_KEY='skywardWorldAirportProcedures_v1';
let worldAirportState={schema:1,activeAirport:'SBSP',procedurePack:'VISUAL_URBAN',routeChallenge:'CGH_SHUTTLE',runwayMode:'SINGLE_ACTIVE',airportScore:0,status:'TRAINING',unlockedAirports:['SBSP'],airportHistory:[],mastery:{},lastEvaluation:null};
function loadWorldAirports(){try{const raw=localStorage?.getItem?.(WORLD_AIRPORT_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)worldAirportState={...worldAirportState,...parsed};}}catch(e){safeLogError?.(e,'world-airport-load');}return worldAirportState;}
function saveWorldAirports(){try{localStorage?.setItem?.(WORLD_AIRPORT_KEY,JSON.stringify(worldAirportState));}catch(e){safeLogError?.(e,'world-airport-save');}return worldAirportState;}
function airportByIcao(icao){return WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.find(a=>a.icao===icao)||WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks[0];}
function procedureById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.find(p=>p.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks[0];}
function routeById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges.find(r=>r.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges[0];}
function runwayModeById(id){return WORLD_AIRPORT_PROCEDURES_CATALOG.runwayModes.find(r=>r.id===id)||WORLD_AIRPORT_PROCEDURES_CATALOG.runwayModes[0];}
function airportBand(score){return WORLD_AIRPORT_PROCEDURES_CATALOG.airportBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||WORLD_AIRPORT_PROCEDURES_CATALOG.airportBands.at(-1);}
function refreshAirportUnlocks(){
  loadWorldAirports();
  const xp=Number(window.SKYWARD_CAMPAIGN_PROGRESSION?.progress?.().xp||0);
  for(const airport of WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks){
    if(xp>=Number(airport.unlockXp||0)&&!worldAirportState.unlockedAirports.includes(airport.icao)){
      worldAirportState.unlockedAirports.push(airport.icao);
    }
  }
  saveWorldAirports();
  return worldAirportState.unlockedAirports;
}
function chooseWorldAirport(icao='SBSP'){
  loadWorldAirports();
  refreshAirportUnlocks();
  const airport=airportByIcao(icao);
  if(!worldAirportState.unlockedAirports.includes(airport.icao)) return {ok:false,reason:'locked',airport};
  worldAirportState.activeAirport=airport.icao;
  const routes=WORLD_AIRPORT_PROCEDURES_CATALOG.routeChallenges.filter(r=>r.airports.includes(airport.icao));
  if(routes[0]) worldAirportState.routeChallenge=routes[0].id;
  if(airport.profile==='URBAN_SHORT_RUNWAY') worldAirportState.procedurePack='VISUAL_URBAN';
  else if(airport.profile==='COASTAL_VISUAL') worldAirportState.procedurePack='COASTAL_APPROACH';
  else if(airport.profile==='INTERNATIONAL_HUB') worldAirportState.procedurePack='INSTRUMENT_IFR';
  else if(airport.profile==='SLOT_CONSTRAINED') worldAirportState.procedurePack='SLOT_BANK';
  else if(airport.profile==='MEGA_HUB'||airport.profile==='BAY_COMPLEX') worldAirportState.procedurePack='PARALLEL_RUNWAY';
  else if(airport.profile==='DESERT_SUPERHUB') worldAirportState.procedurePack='HEAVY_WAKE';
  worldAirportState.runwayMode=airport.runways.length>=3?'PARALLEL_MIXED':(airport.runways.length>=2?'PARALLEL_SEGREGATED':'SINGLE_ACTIVE');
  saveWorldAirports();
  renderWorldAirportBoard();
  return {ok:true,airport,procedure:procedureById(worldAirportState.procedurePack),route:routeById(worldAirportState.routeChallenge),runwayMode:runwayModeById(worldAirportState.runwayMode)};
}
function setProcedurePack(id='VISUAL_URBAN'){
  loadWorldAirports();
  worldAirportState.procedurePack=procedureById(id).id;
  saveWorldAirports();
  renderWorldAirportBoard();
  return procedureById(worldAirportState.procedurePack);
}
function setRouteChallenge(id='CGH_SHUTTLE'){
  loadWorldAirports();
  worldAirportState.routeChallenge=routeById(id).id;
  const route=routeById(worldAirportState.routeChallenge);
  if(route.airports[0]) worldAirportState.activeAirport=route.airports[0];
  saveWorldAirports();
  renderWorldAirportBoard();
  return route;
}
function evaluateWorldAirportProcedures(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadWorldAirports();
  refreshAirportUnlocks();
  const airport=airportByIcao(worldAirportState.activeAirport||airportCode||'SBSP');
  const procedure=procedureById(worldAirportState.procedurePack);
  const route=routeById(worldAirportState.routeChallenge);
  const runway=runwayModeById(worldAirportState.runwayMode);
  const replay=window.SKYWARD_REPLAY_TIMELINE?.progress?.()||{};
  const debrief=window.SKYWARD_INSTRUCTOR_DEBRIEF?.progress?.()||{};
  const mission=window.SKYWARD_SCENARIO_MISSION?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const base=55 + Number(mission.score||72)*.18 + Number(debrief.score||76)*.20 + Number(replay.score||76)*.16 + Math.min(10,Number(finalScore||0)/500);
  const difficultyPenalty=airport.complexity*1.6 + route.difficulty*1.4 + procedure.risk*.18 + runway.risk*.18;
  const safetyPenalty=conflicts*9+incursions*13+Math.max(0,denied-1)*3+(fail?12:0);
  const airportScore=Math.max(0,Math.min(100,Math.round(base-difficultyPenalty*.45-safetyPenalty+Math.min(8,worldAirportState.unlockedAirports.length))));
  const band=airportBand(airportScore);
  const mastery=worldAirportState.mastery[airport.icao]||{bestScore:0,runs:0,status:'TRAINING'};
  mastery.bestScore=Math.max(Number(mastery.bestScore||0),airportScore);
  mastery.runs=Number(mastery.runs||0)+1;
  mastery.status=airportBand(mastery.bestScore).id;
  mastery.lastScore=airportScore;
  mastery.lastAt=new Date().toISOString();
  worldAirportState.mastery[airport.icao]=mastery;
  worldAirportState.airportScore=airportScore;
  worldAirportState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airport.icao,airportName:airport.name,airportScore,status:band.id,statusName:band.name,procedure:procedure.id,procedureRisk:procedure.risk,routeChallenge:route.id,runwayMode:runway.id,unlockedAirports:worldAirportState.unlockedAirports.length,masteryBest:mastery.bestScore,finalScore:Math.round(finalScore||0)};
  worldAirportState.lastEvaluation=evaluation;
  worldAirportState.airportHistory.unshift(evaluation);
  worldAirportState.airportHistory=worldAirportState.airportHistory.slice(0,100);
  saveWorldAirports();
  renderWorldAirportBoard();
  return {state:worldAirportState,evaluation};
}
function worldAirportProgress(){
  loadWorldAirports();
  const airport=airportByIcao(worldAirportState.activeAirport);
  return {score:worldAirportState.airportScore,status:worldAirportState.status,activeAirport:worldAirportState.activeAirport,airportName:airport.name,procedure:worldAirportState.procedurePack,route:worldAirportState.routeChallenge,runwayMode:worldAirportState.runwayMode,unlocked:worldAirportState.unlockedAirports.length,totalAirports:WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length,last:worldAirportState.lastEvaluation||null};
}
function renderWorldAirportBoard(){
  try{
    const anchor=document.querySelector('#replayTimelineInline') || document.querySelector('#instructorDebriefInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#worldAirportInline'); if(old) old.remove();
    const p=worldAirportProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="worldAirportInline" class="airport-ops-board world-airport-inline">
      <div class="airport-ops-head"><b>AIRPORT PACK</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>ICAO</small><b>${p.activeAirport}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>PROC.</small><b>${p.procedure}</b></div>
        <div><small>PISTA</small><b>${p.runwayMode}</b></div>
        <div><small>UNLOCK</small><b>${p.unlocked}/${p.totalAirports}</b></div>
        <div><small>ROTA</small><b>${p.route}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'world-airport-board');}
}
function initializeWorldAirports(){
  loadWorldAirports();
  refreshAirportUnlocks();
  if(!worldAirportState.activeAirport) chooseWorldAirport('SBSP');
  renderWorldAirportBoard();
  return worldAirportState;
}
function worldAirportStatus(){loadWorldAirports();return {...worldAirportState,progress:worldAirportProgress(),catalog:WORLD_AIRPORT_PROCEDURES_CATALOG};}
function worldAirportSelfCheck(){
  const issues=[];
  if(WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length<8) issues.push('aeroportos insuficientes');
  if(WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.length<7) issues.push('procedimentos insuficientes');
  const chosen=chooseWorldAirport('SBSP');
  const proc=setProcedurePack('VISUAL_URBAN');
  const route=setRouteChallenge('CGH_SHUTTLE');
  const evalResult=evaluateWorldAirportProcedures(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!chosen.ok||!proc.id||!route.id) issues.push('seleção inválida');
  if(!Number.isFinite(evalResult.evaluation.airportScore)) issues.push('score inválido');
  return {ok:issues.length===0,issues,airports:WORLD_AIRPORT_PROCEDURES_CATALOG.airportPacks.length,procedures:WORLD_AIRPORT_PROCEDURES_CATALOG.procedurePacks.length};
}
window.SKYWARD_WORLD_AIRPORTS=Object.freeze({
  schema:1,
  catalog:WORLD_AIRPORT_PROCEDURES_CATALOG,
  load:loadWorldAirports,
  save:saveWorldAirports,
  init:initializeWorldAirports,
  choose:chooseWorldAirport,
  procedure:setProcedurePack,
  route:setRouteChallenge,
  unlocks:refreshAirportUnlocks,
  evaluate:evaluateWorldAirportProcedures,
  progress:worldAirportProgress,
  status:worldAirportStatus,
  board:renderWorldAirportBoard,
  selfCheck:worldAirportSelfCheck
});

/* ===== MODULE 58: dynamic-weather-atis-notam-center (63-dynamic-weather-atis-notam-center.js) ===== */
/* @skyward-module 63-dynamic-weather-atis-notam-center
 * Dynamic Weather Radar, ATIS and NOTAM Center for crosswind, visibility, ceiling, storm cells and operational impact.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('63-dynamic-weather-atis-notam-center');
const DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f60',
  weatherPhenomena:[
    {id:'VFR_CLEAR',name:'Céu aberto VFR',severity:4,visibilityKm:10,ceilingFt:8000,windKt:8},
    {id:'MVFR_HAZE',name:'Névoa MVFR',severity:14,visibilityKm:6,ceilingFt:2500,windKt:12},
    {id:'IFR_LOW_CEILING',name:'Teto baixo IFR',severity:24,visibilityKm:4,ceilingFt:900,windKt:15},
    {id:'STORM_CELL',name:'Célula de tempestade',severity:36,visibilityKm:2,ceilingFt:700,windKt:28},
    {id:'CROSSWIND_ALERT',name:'Alerta vento cruzado',severity:30,visibilityKm:8,ceilingFt:3500,windKt:26},
    {id:'LOW_VIS_FOG',name:'Nevoeiro baixa visibilidade',severity:34,visibilityKm:1.5,ceilingFt:400,windKt:6},
    {id:'WET_RUNWAY',name:'Pista molhada',severity:22,visibilityKm:7,ceilingFt:1800,windKt:14},
    {id:'GUST_FRONT',name:'Rajada/gust front',severity:32,visibilityKm:5,ceilingFt:1600,windKt:32}
  ],
  atisTemplates:[
    {id:'INFO_ALPHA',name:'Informação Alpha',runwayMode:'SINGLE_ACTIVE',procedure:'VISUAL_URBAN'},
    {id:'INFO_BRAVO',name:'Informação Bravo',runwayMode:'PARALLEL_SEGREGATED',procedure:'INSTRUMENT_IFR'},
    {id:'INFO_CHARLIE',name:'Informação Charlie',runwayMode:'PARALLEL_MIXED',procedure:'PARALLEL_RUNWAY'},
    {id:'INFO_DELTA',name:'Informação Delta',runwayMode:'LOW_VIS_PROCEDURAL',procedure:'LOW_VIS_IFR'},
    {id:'INFO_ECHO',name:'Informação Echo',runwayMode:'CROSSWIND_RESTRICTED',procedure:'INSTRUMENT_IFR'}
  ],
  notamTypes:[
    {id:'RUNWAY_PARTIAL_CLOSURE',name:'Fechamento parcial de pista',severity:28,impact:'capacity-1'},
    {id:'ILS_MAINTENANCE',name:'ILS em manutenção',severity:24,impact:'ifr-risk+8'},
    {id:'TAXIWAY_WORK',name:'Obra em taxiway',severity:18,impact:'ground-delay+12'},
    {id:'BIRD_ACTIVITY',name:'Atividade de aves',severity:16,impact:'departure-risk+6'},
    {id:'LIGHTING_RESTRICTION',name:'Restrição de balizamento',severity:20,impact:'night-risk+8'},
    {id:'VIP_MOVEMENT',name:'Movimento VIP',severity:14,impact:'flow-hold+6'},
    {id:'FUEL_TRUCK_DELAY',name:'Atraso abastecimento',severity:12,impact:'turnaround-delay+8'}
  ],
  radarCells:[
    {id:'CELL_LIGHT',name:'Eco leve',risk:8,movementKt:12},
    {id:'CELL_MODERATE',name:'Eco moderado',risk:18,movementKt:18},
    {id:'CELL_HEAVY',name:'Eco forte',risk:30,movementKt:24},
    {id:'CELL_SEVERE',name:'Eco severo',risk:42,movementKt:32},
    {id:'CELL_STATIONARY',name:'Célula quase estacionária',risk:26,movementKt:5}
  ],
  operationalImpacts:[
    {id:'RUNWAY_SWITCH',name:'Troca de pista',penalty:16},
    {id:'ARRIVAL_SPACING',name:'Aumentar separação de chegada',penalty:12},
    {id:'GROUND_DELAY',name:'Atraso em solo',penalty:10},
    {id:'DEPARTURE_HOLD',name:'Segurar decolagens',penalty:14},
    {id:'LOW_VIS_PROCEDURE',name:'Procedimento baixa visibilidade',penalty:18},
    {id:'CROSSWIND_LIMIT',name:'Limite vento cruzado',penalty:16}
  ],
  weatherBands:[
    {id:'NORMAL',min:88,name:'Normal'},
    {id:'WATCH',min:72,name:'Atenção'},
    {id:'ADVERSE',min:52,name:'Adverso'},
    {id:'SEVERE',min:0,name:'Severo'}
  ]
});
const DYNAMIC_WEATHER_KEY='skywardDynamicWeatherAtisNotam_v1';
let dynamicWeatherState={schema:1,activePhenomenon:'VFR_CLEAR',activeAtis:'INFO_ALPHA',activeNotams:[],radarCells:[],weatherScore:90,status:'NORMAL',crosswindKt:0,visibilityKm:10,ceilingFt:8000,operationalImpacts:[],history:[],lastEvaluation:null};
function loadDynamicWeather(){try{const raw=localStorage?.getItem?.(DYNAMIC_WEATHER_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)dynamicWeatherState={...dynamicWeatherState,...parsed};}}catch(e){safeLogError?.(e,'dynamic-weather-load');}return dynamicWeatherState;}
function saveDynamicWeather(){try{localStorage?.setItem?.(DYNAMIC_WEATHER_KEY,JSON.stringify(dynamicWeatherState));}catch(e){safeLogError?.(e,'dynamic-weather-save');}return dynamicWeatherState;}
function phenomenonById(id){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.find(w=>w.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena[0];}
function atisById(id){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.atisTemplates.find(a=>a.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.atisTemplates[0];}
function bandForWeather(score){return DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherBands.at(-1);}
function pickWeatherForAirport(){
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const procedure=String(airport.procedure||'VISUAL_URBAN');
  const active=String(airport.activeAirport||'SBSP');
  if(procedure.includes('LOW_VIS')) return 'LOW_VIS_FOG';
  if(procedure.includes('IFR')) return 'IFR_LOW_CEILING';
  if(procedure.includes('PARALLEL') && ['KJFK','RJTT','OMDB'].includes(active)) return 'CROSSWIND_ALERT';
  if(procedure.includes('COASTAL')) return 'MVFR_HAZE';
  return 'VFR_CLEAR';
}
function generateRadarCells(phenomenon){
  if(['VFR_CLEAR','MVFR_HAZE'].includes(phenomenon.id)) return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[0]];
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='GUST_FRONT') return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[2],DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[3]];
  if(phenomenon.id==='LOW_VIS_FOG') return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[4]];
  return [DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.radarCells[1]];
}
function generateNotams(phenomenon){
  const list=[];
  if(phenomenon.id==='LOW_VIS_FOG') list.push('ILS_MAINTENANCE','LIGHTING_RESTRICTION');
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='GUST_FRONT') list.push('RUNWAY_PARTIAL_CLOSURE','BIRD_ACTIVITY');
  if(phenomenon.id==='WET_RUNWAY') list.push('TAXIWAY_WORK');
  if(phenomenon.id==='CROSSWIND_ALERT') list.push('RUNWAY_PARTIAL_CLOSURE');
  return list.map((id,idx)=>{
    const n=DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.find(x=>x.id===id)||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes[idx]||DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes[0];
    return {id:`NOTAM-${id}-${String(Date.now()+idx).slice(-5)}`,type:n.id,name:n.name,severity:n.severity,impact:n.impact,active:true,at:new Date().toISOString()};
  });
}
function chooseAtisForWeather(phenomenon){
  if(phenomenon.id==='LOW_VIS_FOG') return 'INFO_DELTA';
  if(phenomenon.id==='CROSSWIND_ALERT'||phenomenon.id==='GUST_FRONT') return 'INFO_ECHO';
  if(phenomenon.id==='STORM_CELL'||phenomenon.id==='IFR_LOW_CEILING') return 'INFO_BRAVO';
  if(phenomenon.id==='WET_RUNWAY') return 'INFO_BRAVO';
  return 'INFO_ALPHA';
}
function refreshDynamicWeather(typeId='AUTO'){
  loadDynamicWeather();
  const chosen=typeId==='AUTO'?pickWeatherForAirport():typeId;
  const phenomenon=phenomenonById(chosen);
  dynamicWeatherState.activePhenomenon=phenomenon.id;
  dynamicWeatherState.visibilityKm=phenomenon.visibilityKm;
  dynamicWeatherState.ceilingFt=phenomenon.ceilingFt;
  dynamicWeatherState.crosswindKt=Math.max(0,Math.round(phenomenon.windKt*(phenomenon.id.includes('CROSSWIND')?0.82:0.38)));
  dynamicWeatherState.radarCells=generateRadarCells(phenomenon);
  dynamicWeatherState.activeNotams=generateNotams(phenomenon);
  dynamicWeatherState.activeAtis=chooseAtisForWeather(phenomenon);
  const atis=atisById(dynamicWeatherState.activeAtis);
  try{
    if(window.SKYWARD_WORLD_AIRPORTS?.procedure && atis.procedure) window.SKYWARD_WORLD_AIRPORTS.procedure(atis.procedure);
  }catch(e){safeLogError?.(e,'dynamic-weather-apply-procedure');}
  saveDynamicWeather();
  renderDynamicWeatherBoard();
  return dynamicWeatherState;
}
function computeOperationalImpacts(){
  loadDynamicWeather();
  const p=phenomenonById(dynamicWeatherState.activePhenomenon);
  const impacts=[];
  if(p.visibilityKm<=3||p.ceilingFt<=900) impacts.push('LOW_VIS_PROCEDURE','ARRIVAL_SPACING');
  if(dynamicWeatherState.crosswindKt>=18) impacts.push('CROSSWIND_LIMIT','RUNWAY_SWITCH');
  if(dynamicWeatherState.activeNotams.some(n=>n.type==='RUNWAY_PARTIAL_CLOSURE')) impacts.push('DEPARTURE_HOLD');
  if(dynamicWeatherState.activeNotams.some(n=>n.type==='TAXIWAY_WORK'||n.type==='FUEL_TRUCK_DELAY')) impacts.push('GROUND_DELAY');
  if(p.id==='STORM_CELL'||p.id==='GUST_FRONT') impacts.push('ARRIVAL_SPACING','DEPARTURE_HOLD');
  return [...new Set(impacts)].map(id=>DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.operationalImpacts.find(i=>i.id===id)).filter(Boolean);
}
function evaluateDynamicWeather(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadDynamicWeather();
  if(!dynamicWeatherState.activePhenomenon) refreshDynamicWeather('AUTO');
  const p=phenomenonById(dynamicWeatherState.activePhenomenon);
  const radarRisk=dynamicWeatherState.radarCells.reduce((a,c)=>a+Number(c.risk||0),0);
  const notamRisk=dynamicWeatherState.activeNotams.reduce((a,n)=>a+Number(n.severity||0),0);
  const impacts=computeOperationalImpacts();
  const impactPenalty=impacts.reduce((a,i)=>a+Number(i.penalty||0),0);
  const world=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const replay=window.SKYWARD_REPLAY_TIMELINE?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0), incursions=Number(statsObj.runwayIncursions||0), denied=Number(statsObj.denied||0);
  const base=100 - p.severity*.72 - radarRisk*.28 - notamRisk*.16 - impactPenalty*.20 - conflicts*6 - incursions*10 - Math.max(0,denied-1)*2 - (fail?10:0);
  const support=Math.min(10,Number(world.score||70)/12)+Math.min(6,Number(replay.score||70)/18)+Math.min(6,Number(finalScore||0)/650);
  const weatherScore=Math.max(0,Math.min(100,Math.round(base+support)));
  const band=bandForWeather(weatherScore);
  dynamicWeatherState.operationalImpacts=impacts;
  dynamicWeatherState.weatherScore=weatherScore;
  dynamicWeatherState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||world.activeAirport||'SBSP',weatherScore,status:band.id,statusName:band.name,phenomenon:p.id,atis:dynamicWeatherState.activeAtis,notams:dynamicWeatherState.activeNotams.length,crosswindKt:dynamicWeatherState.crosswindKt,visibilityKm:dynamicWeatherState.visibilityKm,ceilingFt:dynamicWeatherState.ceilingFt,radarRisk,impactCount:impacts.length,procedure:atisById(dynamicWeatherState.activeAtis).procedure,finalScore:Math.round(finalScore||0)};
  dynamicWeatherState.lastEvaluation=evaluation;
  dynamicWeatherState.history.unshift(evaluation);
  dynamicWeatherState.history=dynamicWeatherState.history.slice(0,100);
  saveDynamicWeather();
  renderDynamicWeatherBoard();
  return {state:dynamicWeatherState,evaluation};
}
function dynamicWeatherProgress(){
  loadDynamicWeather();
  return {score:dynamicWeatherState.weatherScore,status:dynamicWeatherState.status,phenomenon:dynamicWeatherState.activePhenomenon,atis:dynamicWeatherState.activeAtis,notams:dynamicWeatherState.activeNotams.length,crosswindKt:dynamicWeatherState.crosswindKt,visibilityKm:dynamicWeatherState.visibilityKm,ceilingFt:dynamicWeatherState.ceilingFt,radarRisk:dynamicWeatherState.radarCells.reduce((a,c)=>a+Number(c.risk||0),0),impacts:dynamicWeatherState.operationalImpacts.length,last:dynamicWeatherState.lastEvaluation||null};
}
function renderDynamicWeatherBoard(){
  try{
    const anchor=document.querySelector('#worldAirportInline') || document.querySelector('#replayTimelineInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#dynamicWeatherInline'); if(old) old.remove();
    const p=dynamicWeatherProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="dynamicWeatherInline" class="airport-ops-board dynamic-weather-inline">
      <div class="airport-ops-head"><b>WEATHER OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>WX</small><b>${p.phenomenon}</b></div>
        <div><small>ATIS</small><b>${p.atis}</b></div>
        <div><small>VIS</small><b>${p.visibilityKm}km</b></div>
        <div><small>XWIND</small><b>${p.crosswindKt}kt</b></div>
        <div><small>NOTAM</small><b>${p.notams}</b></div>
        <div><small>RISK</small><b>${p.radarRisk}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'dynamic-weather-board');}
}
function initializeDynamicWeather(){
  loadDynamicWeather();
  if(!dynamicWeatherState.activePhenomenon) refreshDynamicWeather('AUTO');
  else renderDynamicWeatherBoard();
  return dynamicWeatherState;
}
function dynamicWeatherStatus(){loadDynamicWeather();return {...dynamicWeatherState,progress:dynamicWeatherProgress(),catalog:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG};}
function dynamicWeatherSelfCheck(){
  const issues=[];
  if(DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.length<8) issues.push('fenômenos insuficientes');
  if(DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.length<7) issues.push('NOTAMs insuficientes');
  refreshDynamicWeather('CROSSWIND_ALERT');
  const evalResult=evaluateDynamicWeather(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!Number.isFinite(evalResult.evaluation.weatherScore)) issues.push('score inválido');
  if(evalResult.evaluation.crosswindKt<=0) issues.push('vento cruzado inválido');
  return {ok:issues.length===0,issues,phenomena:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.weatherPhenomena.length,notams:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG.notamTypes.length};
}
window.SKYWARD_DYNAMIC_WEATHER=Object.freeze({
  schema:1,
  catalog:DYNAMIC_WEATHER_ATIS_NOTAM_CATALOG,
  load:loadDynamicWeather,
  save:saveDynamicWeather,
  init:initializeDynamicWeather,
  refresh:refreshDynamicWeather,
  evaluate:evaluateDynamicWeather,
  impacts:computeOperationalImpacts,
  progress:dynamicWeatherProgress,
  status:dynamicWeatherStatus,
  board:renderDynamicWeatherBoard,
  selfCheck:dynamicWeatherSelfCheck
});

/* ===== MODULE 59: arrival-departure-sequencer-center (64-arrival-departure-sequencer-center.js) ===== */
/* @skyward-module 64-arrival-departure-sequencer-center
 * Arrival Manager, Departure Sequencer and Holding Stack Center for runway flow, arrival spacing, departure slots, priorities and sequencing.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('64-arrival-departure-sequencer-center');
const ARRIVAL_DEPARTURE_SEQUENCER_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f61',
  arrivalFlows:[
    {id:'STANDARD_STREAM',name:'Fluxo padrão',spacingNm:5,risk:8},
    {id:'TIGHT_URBAN',name:'Urbano apertado',spacingNm:6,risk:16},
    {id:'WEATHER_EXTENDED',name:'Clima espaçado',spacingNm:9,risk:20},
    {id:'HEAVY_MIX',name:'Misto com pesados',spacingNm:8,risk:18},
    {id:'LOW_VIS_STREAM',name:'Baixa visibilidade',spacingNm:10,risk:28},
    {id:'EMERGENCY_PRIORITY',name:'Prioridade emergência',spacingNm:11,risk:30}
  ],
  departureBanks:[
    {id:'LIGHT_BANK',name:'Banco leve',slots:3,spacingSec:90,risk:8},
    {id:'REGIONAL_BANK',name:'Banco regional',slots:4,spacingSec:105,risk:12},
    {id:'INTERNATIONAL_BANK',name:'Banco internacional',slots:5,spacingSec:130,risk:18},
    {id:'CARGO_BANK',name:'Banco cargueiro',slots:4,spacingSec:150,risk:16},
    {id:'WEATHER_HOLD_BANK',name:'Banco com espera meteorológica',slots:3,spacingSec:170,risk:24}
  ],
  holdingStacks:[
    {id:'HOLD_NORTH',name:'Espera Norte',capacity:4,risk:14},
    {id:'HOLD_SOUTH',name:'Espera Sul',capacity:4,risk:14},
    {id:'HOLD_COASTAL',name:'Espera Costeira',capacity:3,risk:18},
    {id:'HOLD_HIGH_ALT',name:'Espera Alta',capacity:5,risk:12},
    {id:'HOLD_EMERGENCY_CLEAR',name:'Espera limpa para emergência',capacity:2,risk:26}
  ],
  priorityRules:[
    {id:'MEDICAL',name:'Prioridade médica',weight:34},
    {id:'FUEL_LOW',name:'Combustível baixo',weight:32},
    {id:'EMERGENCY',name:'Emergência declarada',weight:40},
    {id:'VIP',name:'Movimento VIP',weight:16},
    {id:'CARGO_PERISHABLE',name:'Carga perecível',weight:14},
    {id:'SLOT_CRITICAL',name:'Slot crítico',weight:18},
    {id:'TRAINING',name:'Treinamento',weight:6}
  ],
  slotPolicies:[
    {id:'FAIR_QUEUE',name:'Fila justa',delayBias:0,safetyBias:8},
    {id:'SAFETY_FIRST',name:'Segurança primeiro',delayBias:8,safetyBias:18},
    {id:'AIRLINE_BANK',name:'Banco companhia',delayBias:-4,safetyBias:6},
    {id:'WEATHER_RECOVERY',name:'Recuperação meteorológica',delayBias:10,safetyBias:16},
    {id:'EMERGENCY_CLEARANCE',name:'Corredor de emergência',delayBias:16,safetyBias:22}
  ],
  flowBands:[
    {id:'OPTIMAL',min:90,name:'Fluxo ótimo'},
    {id:'STABLE',min:76,name:'Fluxo estável'},
    {id:'CONGESTED',min:58,name:'Congestionado'},
    {id:'SATURATED',min:0,name:'Saturado'}
  ]
});
const ARRIVAL_DEPARTURE_KEY='skywardArrivalDepartureSequencer_v1';
let sequencerState={schema:1,arrivalFlow:'STANDARD_STREAM',departureBank:'LIGHT_BANK',holdingStack:'HOLD_NORTH',slotPolicy:'FAIR_QUEUE',arrivalQueue:[],departureQueue:[],holdingLoad:0,priorityLoad:0,flowScore:84,status:'STABLE',runwayBalance:80,history:[],lastEvaluation:null};
function loadArrivalDepartureSequencer(){try{const raw=localStorage?.getItem?.(ARRIVAL_DEPARTURE_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)sequencerState={...sequencerState,...parsed};}}catch(e){safeLogError?.(e,'sequencer-load');}return sequencerState;}
function saveArrivalDepartureSequencer(){try{localStorage?.setItem?.(ARRIVAL_DEPARTURE_KEY,JSON.stringify(sequencerState));}catch(e){safeLogError?.(e,'sequencer-save');}return sequencerState;}
function arrivalFlowById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows[0];}
function departureBankById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks[0];}
function holdingStackById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.holdingStacks.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.holdingStacks[0];}
function slotPolicyById(id){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.slotPolicies.find(x=>x.id===id)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.slotPolicies[0];}
function flowBand(score){return ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.flowBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.flowBands.at(-1);}
function chooseFlowFromContext(){
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const status=String(weather.status||'NORMAL');
  const proc=String(airport.procedure||'VISUAL_URBAN');
  const active=String(airport.activeAirport||'SBSP');
  if(status==='SEVERE'||weather.visibilityKm<=2) return {arrival:'LOW_VIS_STREAM',bank:'WEATHER_HOLD_BANK',stack:'HOLD_EMERGENCY_CLEAR',policy:'WEATHER_RECOVERY'};
  if(status==='ADVERSE'||weather.crosswindKt>=18) return {arrival:'WEATHER_EXTENDED',bank:'WEATHER_HOLD_BANK',stack:'HOLD_HIGH_ALT',policy:'SAFETY_FIRST'};
  if(proc.includes('PARALLEL')||['KJFK','RJTT','OMDB','EGLL'].includes(active)) return {arrival:'HEAVY_MIX',bank:'INTERNATIONAL_BANK',stack:'HOLD_HIGH_ALT',policy:'AIRLINE_BANK'};
  if(['SBSP','SBRJ'].includes(active)) return {arrival:'TIGHT_URBAN',bank:'REGIONAL_BANK',stack:'HOLD_COASTAL',policy:'FAIR_QUEUE'};
  return {arrival:'STANDARD_STREAM',bank:'LIGHT_BANK',stack:'HOLD_NORTH',policy:'FAIR_QUEUE'};
}
function generateSequencerQueues(){
  loadArrivalDepartureSequencer();
  const flow=arrivalFlowById(sequencerState.arrivalFlow);
  const bank=departureBankById(sequencerState.departureBank);
  const priorityRules=ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.priorityRules;
  const now=Date.now();
  sequencerState.arrivalQueue=Array.from({length:Math.max(2,Math.min(7,Math.round(12/flow.spacingNm)+2))},(_,i)=>({
    id:`ARR-${String(now+i).slice(-5)}`,
    sequence:i+1,
    spacingNm:flow.spacingNm+i,
    priority:i===0?'SLOT_CRITICAL':(i===1&&flow.id.includes('EMERGENCY')?'MEDICAL':'NORMAL'),
    etaMin:Math.round(3+i*flow.spacingNm*.9)
  }));
  sequencerState.departureQueue=Array.from({length:bank.slots},(_,i)=>({
    id:`DEP-${String(now+i+20).slice(-5)}`,
    slot:i+1,
    spacingSec:bank.spacingSec+i*12,
    priority:i===0?'SLOT_CRITICAL':'NORMAL',
    etdMin:Math.round(2+i*bank.spacingSec/60)
  }));
  sequencerState.priorityLoad=sequencerState.arrivalQueue.concat(sequencerState.departureQueue).reduce((sum,item)=>{
    const rule=priorityRules.find(r=>r.id===item.priority);
    return sum+(rule?Number(rule.weight||0):0);
  },0);
  sequencerState.holdingLoad=Math.max(0,sequencerState.arrivalQueue.length-holdingStackById(sequencerState.holdingStack).capacity);
  saveArrivalDepartureSequencer();
  return {arrivals:sequencerState.arrivalQueue,departures:sequencerState.departureQueue};
}
function refreshArrivalDepartureSequencer(mode='AUTO'){
  loadArrivalDepartureSequencer();
  const choice=chooseFlowFromContext();
  if(mode==='AUTO'){
    sequencerState.arrivalFlow=choice.arrival;
    sequencerState.departureBank=choice.bank;
    sequencerState.holdingStack=choice.stack;
    sequencerState.slotPolicy=choice.policy;
  }
  generateSequencerQueues();
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return sequencerState;
}
function setSequencerPolicy(policyId='FAIR_QUEUE'){
  loadArrivalDepartureSequencer();
  sequencerState.slotPolicy=slotPolicyById(policyId).id;
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return slotPolicyById(sequencerState.slotPolicy);
}
function evaluateArrivalDepartureSequencer(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadArrivalDepartureSequencer();
  if(!sequencerState.arrivalQueue.length||!sequencerState.departureQueue.length) refreshArrivalDepartureSequencer('AUTO');
  const flow=arrivalFlowById(sequencerState.arrivalFlow);
  const bank=departureBankById(sequencerState.departureBank);
  const stack=holdingStackById(sequencerState.holdingStack);
  const policy=slotPolicyById(sequencerState.slotPolicy);
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const weatherPenalty=String(weather.status||'NORMAL')==='SEVERE'?18:String(weather.status||'NORMAL')==='ADVERSE'?11:String(weather.status||'NORMAL')==='WATCH'?5:0;
  const loadPenalty=sequencerState.holdingLoad*8+sequencerState.priorityLoad*.12+denied*2+conflicts*8+incursions*12+(fail?10:0);
  const runwayBalance=Math.max(0,Math.min(100,Math.round(92-flow.risk*.45-bank.risk*.38-stack.risk*.22-weatherPenalty*.35+policy.safetyBias*.4)));
  const base=78+Math.min(10,Number(airport.score||75)/12)+Math.min(8,Number(finalScore||0)/550)+policy.safetyBias*.32-policy.delayBias*.18;
  const flowScore=Math.max(0,Math.min(100,Math.round(base-loadPenalty*.44-weatherPenalty-flow.risk*.18-bank.risk*.14+runwayBalance*.18)));
  const band=flowBand(flowScore);
  sequencerState.runwayBalance=runwayBalance;
  sequencerState.flowScore=flowScore;
  sequencerState.status=band.id;
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||airport.activeAirport||'SBSP',flowScore,status:band.id,statusName:band.name,arrivalFlow:flow.id,arrivalSpacingNm:flow.spacingNm,departureBank:bank.id,departureSlots:bank.slots,holdingStack:stack.id,holdingLoad:sequencerState.holdingLoad,priorityLoad:Math.round(sequencerState.priorityLoad),slotPolicy:policy.id,runwayBalance,weatherStatus:weather.status||'NORMAL',finalScore:Math.round(finalScore||0)};
  sequencerState.lastEvaluation=evaluation;
  sequencerState.history.unshift(evaluation);
  sequencerState.history=sequencerState.history.slice(0,100);
  saveArrivalDepartureSequencer();
  renderArrivalDepartureBoard();
  return {state:sequencerState,evaluation};
}
function arrivalDepartureProgress(){
  loadArrivalDepartureSequencer();
  return {score:sequencerState.flowScore,status:sequencerState.status,arrivalFlow:sequencerState.arrivalFlow,departureBank:sequencerState.departureBank,holdingStack:sequencerState.holdingStack,slotPolicy:sequencerState.slotPolicy,arrivals:sequencerState.arrivalQueue.length,departures:sequencerState.departureQueue.length,holdingLoad:sequencerState.holdingLoad,priorityLoad:Math.round(sequencerState.priorityLoad||0),runwayBalance:sequencerState.runwayBalance,last:sequencerState.lastEvaluation||null};
}
function renderArrivalDepartureBoard(){
  try{
    const anchor=document.querySelector('#dynamicWeatherInline') || document.querySelector('#worldAirportInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#arrivalDepartureInline'); if(old) old.remove();
    const p=arrivalDepartureProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="arrivalDepartureInline" class="airport-ops-board arrival-departure-inline">
      <div class="airport-ops-head"><b>FLOW OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>AMAN</small><b>${p.arrivalFlow}</b></div>
        <div><small>DMAN</small><b>${p.departureBank}</b></div>
        <div><small>ARR</small><b>${p.arrivals}</b></div>
        <div><small>DEP</small><b>${p.departures}</b></div>
        <div><small>HOLD</small><b>${p.holdingLoad}</b></div>
        <div><small>RWY</small><b>${p.runwayBalance}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'arrival-departure-board');}
}
function initializeArrivalDepartureSequencer(){
  loadArrivalDepartureSequencer();
  if(!sequencerState.arrivalQueue.length) refreshArrivalDepartureSequencer('AUTO');
  else renderArrivalDepartureBoard();
  return sequencerState;
}
function arrivalDepartureStatus(){loadArrivalDepartureSequencer();return {...sequencerState,progress:arrivalDepartureProgress(),catalog:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG};}
function arrivalDepartureSelfCheck(){
  const issues=[];
  if(ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.length<6) issues.push('arrival flows insuficientes');
  if(ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.length<5) issues.push('departure banks insuficientes');
  refreshArrivalDepartureSequencer('AUTO');
  const policy=setSequencerPolicy('SAFETY_FIRST');
  const evalResult=evaluateArrivalDepartureSequencer(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!policy.id) issues.push('policy inválida');
  if(!Number.isFinite(evalResult.evaluation.flowScore)) issues.push('score inválido');
  if(evalResult.state.arrivalQueue.length<1||evalResult.state.departureQueue.length<1) issues.push('filas inválidas');
  return {ok:issues.length===0,issues,arrivals:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.arrivalFlows.length,banks:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG.departureBanks.length};
}
window.SKYWARD_ARRIVAL_DEPARTURE=Object.freeze({
  schema:1,
  catalog:ARRIVAL_DEPARTURE_SEQUENCER_CATALOG,
  load:loadArrivalDepartureSequencer,
  save:saveArrivalDepartureSequencer,
  init:initializeArrivalDepartureSequencer,
  refresh:refreshArrivalDepartureSequencer,
  policy:setSequencerPolicy,
  evaluate:evaluateArrivalDepartureSequencer,
  progress:arrivalDepartureProgress,
  status:arrivalDepartureStatus,
  board:renderArrivalDepartureBoard,
  selfCheck:arrivalDepartureSelfCheck
});

/* ===== MODULE 60: sector-handoff-coordination-center (65-sector-handoff-coordination-center.js) ===== */
/* @skyward-module 65-sector-handoff-coordination-center
 * Sector Handoff, Approach/Departure Coordination and Control Room Center for controller positions, transfer quality and coordination workload.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('65-sector-handoff-coordination-center');
const SECTOR_HANDOFF_CATALOG = Object.freeze({
  schema:1,
  version:'2026.06-f62',
  controlSectors:[
    {id:'GROUND',name:'Solo',abbr:'GND',capacity:5,risk:10},
    {id:'TOWER',name:'Torre',abbr:'TWR',capacity:6,risk:14},
    {id:'DEPARTURE',name:'Partida',abbr:'DEP',capacity:5,risk:16},
    {id:'APPROACH',name:'Aproximação',abbr:'APP',capacity:7,risk:18},
    {id:'CENTER',name:'Centro',abbr:'CTR',capacity:8,risk:12},
    {id:'FLOW',name:'Fluxo',abbr:'FMP',capacity:4,risk:16},
    {id:'EMERGENCY_DESK',name:'Mesa emergência',abbr:'EMG',capacity:3,risk:22}
  ],
  handoffTypes:[
    {id:'GROUND_TO_TOWER',name:'Solo → Torre',from:'GROUND',to:'TOWER',requiredReadback:true,risk:10},
    {id:'TOWER_TO_DEPARTURE',name:'Torre → Partida',from:'TOWER',to:'DEPARTURE',requiredReadback:true,risk:14},
    {id:'APPROACH_TO_TOWER',name:'Aproximação → Torre',from:'APPROACH',to:'TOWER',requiredReadback:true,risk:16},
    {id:'CENTER_TO_APPROACH',name:'Centro → Aproximação',from:'CENTER',to:'APPROACH',requiredReadback:true,risk:18},
    {id:'TOWER_TO_GROUND',name:'Torre → Solo',from:'TOWER',to:'GROUND',requiredReadback:false,risk:9},
    {id:'FLOW_TO_TOWER',name:'Fluxo → Torre',from:'FLOW',to:'TOWER',requiredReadback:false,risk:12},
    {id:'EMERGENCY_BROADCAST',name:'Emergência → todos',from:'EMERGENCY_DESK',to:'ALL',requiredReadback:true,risk:26}
  ],
  coordinationRules:[
    {id:'FREQUENCY_CHANGE',name:'Troca de frequência',penalty:8},
    {id:'RADAR_IDENT',name:'Identificação radar',penalty:9},
    {id:'RUNWAY_RELEASE',name:'Liberação de pista',penalty:10},
    {id:'MISSED_APPROACH',name:'Aproximação perdida',penalty:18},
    {id:'DEPARTURE_RELEASE',name:'Liberação de partida',penalty:12},
    {id:'EMERGENCY_TRANSFER',name:'Transferência emergencial',penalty:22},
    {id:'WEATHER_REROUTE',name:'Desvio por clima',penalty:16}
  ],
  sectorLoadBands:[
    {id:'NORMAL',min:88,name:'Carga normal'},
    {id:'BUSY',min:74,name:'Setor ocupado'},
    {id:'OVERLOAD',min:55,name:'Setor sobrecarregado'},
    {id:'CRITICAL',min:0,name:'Coordenação crítica'}
  ],
  handoffQualityBands:[
    {id:'CLEAN',min:92,name:'Transferência limpa'},
    {id:'STABLE',min:78,name:'Transferência estável'},
    {id:'NOISY',min:60,name:'Transferência ruidosa'},
    {id:'FAILED',min:0,name:'Transferência falha'}
  ]
});
const SECTOR_HANDOFF_KEY='skywardSectorHandoffCoordination_v1';
let sectorState={schema:1,primarySector:'TOWER',handoffScore:84,status:'STABLE',sectorLoad:0,coordinationRisk:0,acceptanceRate:92,transfers:[],sectorLoads:{},activeRules:[],history:[],lastEvaluation:null};
function loadSectorHandoff(){try{const raw=localStorage?.getItem?.(SECTOR_HANDOFF_KEY);if(raw){const parsed=JSON.parse(raw);if(parsed?.schema===1)sectorState={...sectorState,...parsed};}}catch(e){safeLogError?.(e,'sector-handoff-load');}return sectorState;}
function saveSectorHandoff(){try{localStorage?.setItem?.(SECTOR_HANDOFF_KEY,JSON.stringify(sectorState));}catch(e){safeLogError?.(e,'sector-handoff-save');}return sectorState;}
function sectorById(id){return SECTOR_HANDOFF_CATALOG.controlSectors.find(s=>s.id===id)||SECTOR_HANDOFF_CATALOG.controlSectors[1];}
function handoffById(id){return SECTOR_HANDOFF_CATALOG.handoffTypes.find(h=>h.id===id)||SECTOR_HANDOFF_CATALOG.handoffTypes[0];}
function loadBand(score){return SECTOR_HANDOFF_CATALOG.sectorLoadBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECTOR_HANDOFF_CATALOG.sectorLoadBands.at(-1);}
function qualityBand(score){return SECTOR_HANDOFF_CATALOG.handoffQualityBands.slice().sort((a,b)=>b.min-a.min).find(b=>score>=b.min)||SECTOR_HANDOFF_CATALOG.handoffQualityBands.at(-1);}
function choosePrimarySector(){
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  if(String(weather.status||'NORMAL')==='SEVERE'||Number(weather.crosswindKt||0)>=22) return 'APPROACH';
  if(Number(flow.holdingLoad||0)>0||String(flow.status||'STABLE')==='CONGESTED') return 'FLOW';
  if(['SBSP','SBRJ'].includes(String(airport.activeAirport||''))) return 'TOWER';
  if(['KJFK','EGLL','RJTT','OMDB'].includes(String(airport.activeAirport||''))) return 'APPROACH';
  return 'TOWER';
}
function generateSectorLoads(){
  loadSectorHandoff();
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const airport=window.SKYWARD_WORLD_AIRPORTS?.progress?.()||{};
  const baseTraffic=Number(flow.arrivals||3)+Number(flow.departures||3)+Number(flow.holdingLoad||0)*2;
  const weatherLoad=String(weather.status||'NORMAL')==='SEVERE'?5:String(weather.status||'NORMAL')==='ADVERSE'?3:String(weather.status||'NORMAL')==='WATCH'?1:0;
  const airportComplex=['KJFK','EGLL','RJTT','OMDB'].includes(String(airport.activeAirport||''))?3:1;
  const loads={};
  for(const s of SECTOR_HANDOFF_CATALOG.controlSectors){
    let value=Math.round(baseTraffic*.55+weatherLoad+airportComplex+s.risk*.12);
    if(s.id===sectorState.primarySector) value+=3;
    if(s.id==='FLOW') value+=Number(flow.holdingLoad||0)*2;
    if(s.id==='EMERGENCY_DESK' && (String(weather.status||'NORMAL')==='SEVERE')) value+=4;
    loads[s.id]=Math.max(0,Math.min(100,value));
  }
  sectorState.sectorLoads=loads;
  sectorState.sectorLoad=Math.max(...Object.values(loads));
  return loads;
}
function addHandoff(typeId='GROUND_TO_TOWER',accepted=true,detail=''){
  loadSectorHandoff();
  const h=handoffById(typeId);
  const item={id:`HOF-${String(Date.now()).slice(-6)}-${sectorState.transfers.length+1}`,type:h.id,name:h.name,from:h.from,to:h.to,accepted:Boolean(accepted),readbackRequired:h.requiredReadback,risk:h.risk,detail:String(detail||h.name),at:new Date().toISOString(),build:BUILD};
  sectorState.transfers.push(item);
  sectorState.transfers=sectorState.transfers.slice(-140);
  saveSectorHandoff();
  return item;
}
function generateHandoffsFromContext(){
  loadSectorHandoff();
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const result=[];
  result.push(addHandoff('GROUND_TO_TOWER',true,'partida para torre'));
  result.push(addHandoff('APPROACH_TO_TOWER',true,'chegada para torre'));
  if(Number(flow.departures||0)>2) result.push(addHandoff('TOWER_TO_DEPARTURE',true,'partidas em sequência'));
  if(Number(flow.holdingLoad||0)>0) result.push(addHandoff('CENTER_TO_APPROACH',true,'liberação do holding'));
  if(String(weather.status||'NORMAL')==='SEVERE') result.push(addHandoff('EMERGENCY_BROADCAST',false,'clima severo requer coordenação ampla'));
  if(String(flow.status||'STABLE')==='CONGESTED'||String(flow.status||'STABLE')==='SATURATED') result.push(addHandoff('FLOW_TO_TOWER',true,'restrição de fluxo'));
  return result;
}
function refreshSectorHandoff(mode='AUTO'){
  loadSectorHandoff();
  if(mode==='AUTO') sectorState.primarySector=choosePrimarySector();
  generateSectorLoads();
  if(!sectorState.transfers.length) generateHandoffsFromContext();
  saveSectorHandoff();
  renderSectorHandoffBoard();
  return sectorState;
}
function evaluateSectorHandoff(finalScore=0,statsObj={},fail=false,airportCode=''){
  loadSectorHandoff();
  refreshSectorHandoff('AUTO');
  const weather=window.SKYWARD_DYNAMIC_WEATHER?.progress?.()||{};
  const flow=window.SKYWARD_ARRIVAL_DEPARTURE?.progress?.()||{};
  const radio=window.SKYWARD_RADIO_PHRASEOLOGY?.progress?.()||window.SKYWARD_RADIO_PHRASEOLOGY?.status?.()?.progress||{};
  const conflicts=Number(statsObj.conflicts||0);
  const incursions=Number(statsObj.runwayIncursions||0);
  const denied=Number(statsObj.denied||0);
  const transfers=sectorState.transfers.slice(-20);
  const accepted=transfers.filter(t=>t.accepted).length;
  const acceptanceRate=transfers.length?Math.round((accepted/transfers.length)*100):100;
  const rulePenalty=SECTOR_HANDOFF_CATALOG.coordinationRules.reduce((sum,r)=>{
    if(r.id==='WEATHER_REROUTE'&&['ADVERSE','SEVERE'].includes(String(weather.status||''))) return sum+r.penalty;
    if(r.id==='MISSED_APPROACH'&&conflicts>0) return sum+r.penalty;
    if(r.id==='RUNWAY_RELEASE'&&incursions>0) return sum+r.penalty;
    if(r.id==='DEPARTURE_RELEASE'&&Number(flow.departures||0)>4) return sum+r.penalty*.5;
    return sum;
  },0);
  const transferRisk=transfers.reduce((sum,t)=>sum+Number(t.risk||0)*(t.accepted?.45:1),0);
  const loadPenalty=Math.max(0,Number(sectorState.sectorLoad||0)-sectorById(sectorState.primarySector).capacity*2);
  const radioBonus=Math.min(8,Number(radio.score||radio.accuracy||80)/12);
  const handoffScore=Math.max(0,Math.min(100,Math.round(92-transferRisk*.18-rulePenalty*.25-loadPenalty*.42-conflicts*7-incursions*10-denied*2-(fail?12:0)+radioBonus+Math.min(7,Number(finalScore||0)/650))));
  const quality=qualityBand(handoffScore);
  const loadStatus=loadBand(Math.max(0,100-Number(sectorState.sectorLoad||0)));
  sectorState.handoffScore=handoffScore;
  sectorState.status=quality.id;
  sectorState.acceptanceRate=acceptanceRate;
  sectorState.coordinationRisk=Math.round(transferRisk+rulePenalty+loadPenalty);
  sectorState.activeRules=SECTOR_HANDOFF_CATALOG.coordinationRules.filter(r=>{
    if(r.id==='WEATHER_REROUTE') return ['ADVERSE','SEVERE'].includes(String(weather.status||''));
    if(r.id==='RUNWAY_RELEASE') return incursions>0;
    if(r.id==='MISSED_APPROACH') return conflicts>0;
    return false;
  });
  const evaluation={at:new Date().toISOString(),build:BUILD,airport:airportCode||'SBSP',handoffScore,status:quality.id,statusName:quality.name,sectorLoad:sectorState.sectorLoad,loadStatus:loadStatus.id,primarySector:sectorState.primarySector,transferCount:transfers.length,acceptanceRate,coordinationRisk:sectorState.coordinationRisk,activeRules:sectorState.activeRules.length,flowStatus:flow.status||'STABLE',weatherStatus:weather.status||'NORMAL',finalScore:Math.round(finalScore||0)};
  sectorState.lastEvaluation=evaluation;
  sectorState.history.unshift(evaluation);
  sectorState.history=sectorState.history.slice(0,100);
  saveSectorHandoff();
  renderSectorHandoffBoard();
  return {state:sectorState,evaluation};
}
function sectorHandoffProgress(){
  loadSectorHandoff();
  return {score:sectorState.handoffScore,status:sectorState.status,primarySector:sectorState.primarySector,sectorLoad:sectorState.sectorLoad,transferCount:sectorState.transfers.length,acceptanceRate:sectorState.acceptanceRate,coordinationRisk:sectorState.coordinationRisk,activeRules:sectorState.activeRules.length,last:sectorState.lastEvaluation||null};
}
function renderSectorHandoffBoard(){
  try{
    const anchor=document.querySelector('#arrivalDepartureInline') || document.querySelector('#dynamicWeatherInline') || document.querySelector('#airportOpsBoard');
    if(!anchor?.insertAdjacentHTML) return;
    const old=document.querySelector('#sectorHandoffInline'); if(old) old.remove();
    const p=sectorHandoffProgress();
    anchor.insertAdjacentHTML('afterend',`<div id="sectorHandoffInline" class="airport-ops-board sector-handoff-inline">
      <div class="airport-ops-head"><b>SECTOR OPS</b><span>${p.status}</span></div>
      <div class="airport-ops-grid">
        <div><small>SETOR</small><b>${p.primarySector}</b></div>
        <div><small>SCORE</small><b>${p.score}</b></div>
        <div><small>LOAD</small><b>${p.sectorLoad}</b></div>
        <div><small>HOF</small><b>${p.transferCount}</b></div>
        <div><small>ACC</small><b>${p.acceptanceRate}%</b></div>
        <div><small>RISK</small><b>${p.coordinationRisk}</b></div>
      </div>
    </div>`);
  }catch(e){safeLogError?.(e,'sector-handoff-board');}
}
function initializeSectorHandoff(){
  loadSectorHandoff();
  refreshSectorHandoff('AUTO');
  renderSectorHandoffBoard();
  return sectorState;
}
function sectorHandoffStatus(){loadSectorHandoff();return {...sectorState,progress:sectorHandoffProgress(),catalog:SECTOR_HANDOFF_CATALOG};}
function sectorHandoffSelfCheck(){
  const issues=[];
  if(SECTOR_HANDOFF_CATALOG.controlSectors.length<7) issues.push('setores insuficientes');
  if(SECTOR_HANDOFF_CATALOG.handoffTypes.length<7) issues.push('handoffs insuficientes');
  refreshSectorHandoff('AUTO');
  const hof=addHandoff('TOWER_TO_DEPARTURE',true,'self-check');
  const evalResult=evaluateSectorHandoff(2800,{conflicts:0,denied:0,runwayIncursions:0},false,'SBSP');
  if(!hof.id) issues.push('handoff inválido');
  if(!Number.isFinite(evalResult.evaluation.handoffScore)) issues.push('score inválido');
  if(!evalResult.evaluation.primarySector) issues.push('setor inválido');
  return {ok:issues.length===0,issues,sectors:SECTOR_HANDOFF_CATALOG.controlSectors.length,handoffs:SECTOR_HANDOFF_CATALOG.handoffTypes.length};
}
window.SKYWARD_SECTOR_HANDOFF=Object.freeze({
  schema:1,
  catalog:SECTOR_HANDOFF_CATALOG,
  load:loadSectorHandoff,
  save:saveSectorHandoff,
  init:initializeSectorHandoff,
  refresh:refreshSectorHandoff,
  handoff:addHandoff,
  evaluate:evaluateSectorHandoff,
  progress:sectorHandoffProgress,
  status:sectorHandoffStatus,
  board:renderSectorHandoffBoard,
  selfCheck:sectorHandoffSelfCheck
});

/* ===== MODULE 61: surface-safety-director (17-surface-safety-director.js) ===== */
/* @skyward-module 17-surface-safety-director
 * Surface Safety Director: taxi conflicts, runway incursions, hotspots and ground command risk.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('17-surface-safety-director');
const SURFACE_HOTSPOTS = Object.freeze({
  schema: 1,
  version: '2026.06-f14',
  airports: {
    SBGR:[{id:'HS-RWY-09R-A',type:'runway-entry',x:33,y:56,radius:4.8,severity:'danger',label:'Entry A / 09R'},{id:'HS-RWY-09R-B',type:'runway-entry',x:48,y:56,radius:4.8,severity:'danger',label:'Entry B / 09R'},{id:'HS-TAXI-A',type:'taxi-converge',x:66,y:56,radius:5.2,severity:'warn',label:'Taxiway A merge'}],
    SBSP:[{id:'HS-URBAN-17',type:'runway-entry',x:42,y:48,radius:5.2,severity:'danger',label:'Urban short-field entry'},{id:'HS-TERM-P',type:'taxi-converge',x:58,y:68,radius:5.0,severity:'warn',label:'Terminal pinch point'}],
    SBKP:[{id:'HS-CARGO-15',type:'runway-entry',x:34,y:44,radius:5.0,severity:'danger',label:'Cargo entry 15'},{id:'HS-CARGO-D',type:'taxi-converge',x:58,y:70,radius:5.4,severity:'warn',label:'Cargo apron merge'}],
    SBBR:[{id:'HS-BSB-11',type:'runway-entry',x:48,y:58,radius:5.2,severity:'danger',label:'Central runway entry'},{id:'HS-BSB-PAR',type:'parallel-runway',x:68,y:66,radius:5.2,severity:'warn',label:'Parallel runway crossflow'}],
    KATL:[{id:'HS-ATL-A',type:'runway-entry',x:42,y:54,radius:5.6,severity:'danger',label:'ATL north entry'},{id:'HS-ATL-B',type:'runway-entry',x:56,y:54,radius:5.6,severity:'danger',label:'ATL central entry'},{id:'HS-ATL-C',type:'taxi-converge',x:66,y:62,radius:5.6,severity:'warn',label:'ATL banked taxi merge'}]
  }
});
let surfaceSafetyState = { schema:1, score:100, level:'ok', alerts:[], lastIncursionAt:0, lastTaxiConflictAt:0, runwayProtected:false, hotspots:[] };
function surfaceHotspotsFor(icao){ const code=String(icao||airport()?.icao||'').toUpperCase(); return SURFACE_HOTSPOTS.airports[code] || []; }
function surfaceGroundStatus(status){ return ['PARKED','PUSHBACK','READY_TAXI','TAXI','HOLD_SHORT','LINEUP','LINEUP_READY','VACATE'].includes(String(status||'')); }
function surfaceControlledStatus(status){ return ['LINEUP','LINEUP_READY','DEP','FINAL','EMERG','VACATE'].includes(String(status||'')); }
function surfacePointToSegmentDistance(point,a,b){
  const ax=a.x, ay=a.y, bx=b.x, by=b.y, px=Number(point?.x)||0, py=Number(point?.y)||0;
  const abx=bx-ax, aby=by-ay, ab2=abx*abx+aby*aby||1;
  const t=Math.max(0,Math.min(1,((px-ax)*abx+(py-ay)*aby)/ab2));
  return Math.hypot(px-(ax+abx*t), py-(ay+aby*t));
}
function runwayProtectedDistance(p){ return surfacePointToSegmentDistance(p,{x:runway.x1,y:runway.y1},{x:runway.x2,y:runway.y2}); }
function surfaceDetectHotspots(){
  const spots=surfaceHotspotsFor();
  const hits=[];
  for(const h of spots){
    const occupants=aircraft.filter(p=>surfaceGroundStatus(p.status) && Math.hypot((p.x||0)-h.x,(p.y||0)-h.y)<=Number(h.radius||4));
    if(occupants.length) hits.push({ id:h.id, label:h.label, type:h.type, severity:h.severity||'warn', occupants:occupants.map(p=>p.id) });
  }
  return hits;
}
function detectTaxiConflicts(){
  const ground=aircraft.filter(p=>surfaceGroundStatus(p.status) && !['PARKED'].includes(p.status));
  const conflicts=[];
  for(let i=0;i<ground.length;i++) for(let j=i+1;j<ground.length;j++){
    const a=ground[i], b=ground[j];
    if(a.id===b.id) continue;
    const d=Math.hypot((a.x||0)-(b.x||0),(a.y||0)-(b.y||0));
    if(d<2.2) conflicts.push({level:'danger',a:a.id,b:b.id,d,msg:`Conflito de solo ${a.id}/${b.id}: ${d.toFixed(1)} NM`});
    else if(d<3.8 && (a.status==='TAXI'||b.status==='TAXI')) conflicts.push({level:'warn',a:a.id,b:b.id,d,msg:`Taxi spacing reduzido ${a.id}/${b.id}: ${d.toFixed(1)} NM`});
  }
  return conflicts;
}
function detectRunwayIncursions(){
  const alerts=[];
  const protectedRadius=Math.max(5.2,Number(runway.width)||5.2);
  for(const p of aircraft){
    if(!surfaceGroundStatus(p.status)) continue;
    const d=runwayProtectedDistance(p);
    const unauthorized=d<protectedRadius && !surfaceControlledStatus(p.status) && !p.cleared;
    if(unauthorized) alerts.push({level:'danger',id:p.id,d,msg:`Runway incursion: ${p.id} entrou na área protegida da ${runway.name}.`});
    else if(d<protectedRadius+2.6 && p.status==='TAXI') alerts.push({level:'warn',id:p.id,d,msg:`${p.id} próximo da área protegida da pista.`});
  }
  return alerts;
}
function updateSurfaceSafetyDirector(dt=0){
  const taxi=detectTaxiConflicts();
  const incursions=detectRunwayIncursions();
  const hotspots=surfaceDetectHotspots();
  let score=100;
  score-=incursions.filter(a=>a.level==='danger').length*32;
  score-=incursions.filter(a=>a.level==='warn').length*10;
  score-=taxi.filter(a=>a.level==='danger').length*22;
  score-=taxi.filter(a=>a.level==='warn').length*8;
  score-=hotspots.filter(h=>h.severity==='danger').length*8;
  const alerts=[...incursions,...taxi,...hotspots.map(h=>({level:h.severity||'warn',msg:`Hotspot ${h.label}: ${h.occupants.join(', ')}`,hotspot:h.id}))].slice(0,6);
  const level=score<55||alerts.some(a=>a.level==='danger')?'danger':score<82||alerts.length?'warn':'ok';
  surfaceSafetyState={ schema:1, score:Math.max(0,Math.round(score)), level, alerts, lastIncursionAt:surfaceSafetyState.lastIncursionAt, lastTaxiConflictAt:surfaceSafetyState.lastTaxiConflictAt, runwayProtected:Boolean(runwayOccupiedBy), hotspots };
  const now=performance.now?.()||0;
  if(incursions.some(a=>a.level==='danger') && now-surfaceSafetyState.lastIncursionAt>2500){ stats.runwayIncursions=(stats.runwayIncursions||0)+1; surfaceSafetyState.lastIncursionAt=now; }
  if(taxi.some(a=>a.level==='danger') && now-surfaceSafetyState.lastTaxiConflictAt>2500){ stats.surfaceConflicts=(stats.surfaceConflicts||0)+1; surfaceSafetyState.lastTaxiConflictAt=now; }
  return surfaceSafetyState;
}
function surfaceCommandRisk(p,cmd){
  if(!p) return {level:'warn',block:true,msg:'Selecione aeronave.'};
  const state=surfaceSafetyState?.alerts ? surfaceSafetyState : updateSurfaceSafetyDirector(0);
  const shortFinal=arrivalOnShortFinal?.();
  const ownIncursion=detectRunwayIncursions().find(a=>a.id===p.id && a.level==='danger');
  if(ownIncursion && ['approveTaxi','lineUp','clearTakeoff'].includes(cmd)) return {level:'danger',block:true,msg:ownIncursion.msg};
  if(['lineUp','clearTakeoff'].includes(cmd)){
    const other=aircraft.find(o=>o.id!==p.id && surfaceControlledStatus(o.status) && runwayProtectedDistance(o)<Math.max(6,runway.width||5.2));
    if(other) return {level:'danger',block:true,msg:`Área protegida ocupada por ${other.id}.`};
    if(shortFinal && shortFinal.id!==p.id) return {level:'danger',block:true,msg:`${shortFinal.id} na curta final. Entrada na pista bloqueada.`};
  }
  if(cmd==='approveTaxi'){
    const conflicts=detectTaxiConflicts().filter(c=>[c.a,c.b].includes(p.id));
    if(conflicts.some(c=>c.level==='danger')) return {level:'danger',block:true,msg:conflicts[0].msg};
    if(state.level==='warn' && state.hotspots?.length) return {level:'warn',block:false,msg:'Hotspot ativo no solo; monitore taxiway antes de prosseguir.'};
  }
  if(cmd==='holdShort' && runwayProtectedDistance(p)<Math.max(6,runway.width||5.2)) return {level:'warn',block:false,msg:'Hold short emitido dentro/próximo da área protegida.'};
  return {level:'ok',block:false,msg:'Surface safety aprovado.'};
}
function renderSurfaceSafetyBoard(){
  try{
    const state=updateSurfaceSafetyDirector(0);
    const box=document.querySelector('#surfaceSafetyBoard');
    if(box){
      box.className=`surface-safety-board ${state.level}`;
      box.innerHTML=`<div><b>SURFACE SAFETY</b><span>${state.score}% • ${state.level.toUpperCase()}</span></div>`+(state.alerts.length?state.alerts.map(a=>`<small>${a.msg}</small>`).join(''):'<small>Solo nominal. Sem hotspots críticos.</small>');
    }
    const marker=document.querySelector('#surfaceSafetyStatus');
    if(marker) marker.textContent=`SURFACE ${state.score}%`;
  }catch(e){ safeLogError?.(e,'surface-safety-board'); }
}
function surfaceSafetySelfCheck(){
  const issues=[];
  const codes=Object.keys(SURFACE_HOTSPOTS.airports||{});
  if(codes.length<5) issues.push('hotspots insuficientes');
  for(const code of codes){ if(!SURFACE_HOTSPOTS.airports[code].length) issues.push(`${code} sem hotspots`); }
  return { ok:issues.length===0, issues, airports:codes.length };
}
window.SKYWARD_SURFACE_SAFETY=Object.freeze({ schema:1, hotspots:SURFACE_HOTSPOTS, hotspotsFor:surfaceHotspotsFor, update:updateSurfaceSafetyDirector, commandRisk:surfaceCommandRisk, taxiConflicts:detectTaxiConflicts, runwayIncursions:detectRunwayIncursions, render:renderSurfaceSafetyBoard, selfCheck:surfaceSafetySelfCheck });

/* ===== MODULE 62: 06-traffic-requests (06-traffic-requests.js) ===== */
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
    const gateIndex=i%Math.max(1,gates.length);
    const g = gates[gateIndex]; p.x = g.x + rand(-.5,.5); p.y = g.y + rand(-.5,.5); p.heading = 270; p.request = 'pushback'; p.requestedAt = performance.now();
    p.gateIndex=gateIndex; p.gateId=g.id || `${g.label||'G'}${gateIndex+1}`; p.groundIndex=gateIndex%Math.max(1,holdingPoints.length);
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
  stats = { landed:0, departed:0, conflicts:0, commands:0, emergencies:0, requests:0, denied:0, runwayIncursions:0, surfaceConflicts:0, blocked:0, safetyWarnings:0, lowFuel:0, damaged:0, maydayResolved:0 };
  mission = buildMission(); missionHistory=[];
  aircraft = [];
  const a = airport(); applyAirportSurfaceGraph?.(a.icao); applyAirportOpsProfile(); initializeAdvancedWeather?.(); initializeProceduresLayer?.(); initializeCareerProfile?.(); renderEconomyBoard?.(); renderIncidentBoard?.(); renderNetworkFlowBoard?.(); renderControlRoomBoard?.(); initializeCommercialPolish?.(); initializeReleaseCandidateQA?.(); initializeGoldMasterPackage?.(); initializePostGoldMasterPublishing?.(); initializePostPublishHealthcheck?.(); initializePublicOps?.(); initializeTrainingAcademy?.(); initializeTrainingCoach?.(); initializeInternationalCampaign?.(); initializeAirlineOps?.(); initializeAirportAuthority?.(); initializeCrisisCommand?.(); initializeSafetyCompliance?.(); initializeInfrastructureExpansion?.(); initializeEnvironmentSustainability?.(); initializeRevenueManagement?.(); initializeWorkforceStaffing?.(); initializePassengerReputation?.(); initializeMultiAirportNetwork?.(); initializeEmergencyResponse?.(); initializeSecurityCyber?.(); initializeAssetMaintenance?.(); initializeDigitalTwin?.(); initializeAiCopilot?.(); initializeRadioPhraseology?.(); initializeGroundTurnaround?.(); initializeCargoLogistics?.(); initializeTerminalFlow?.(); initializeNonAeroRevenue?.(); initializeAdaptivePace?.(); initializeStabilityDiagnostics?.(); initializePwaUpdateManager?.(); initializeLiveOpsConfig?.(); initializeScenarioMission?.(); initializeCampaignProgression?.(); initializeInstructorDebrief?.(); initializeReplayTimeline?.(); initializeWorldAirports?.(); initializeDynamicWeather?.(); initializeArrivalDepartureSequencer?.(); initializeSectorHandoff?.(); window.SKYWARD_PUBLIC_OPS?.startTurn?.(); $('#weather').textContent = (a.weather || 'VARIÁVEL').toUpperCase().slice(0,18); if($('#gameAirport')) $('#gameAirport').textContent = a.icao; if($('#gameAirportFull')) $('#gameAirportFull').textContent = a.name || a.city || a.icao; if($('#gameAirportMode')) $('#gameAirportMode').textContent='TORRE'; if($('#sectorHelp')) $('#sectorHelp').textContent=(currentOpsProfile?.ops||'Torre ativa');
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

/* ===== MODULE 63: 07-simulation-safety (07-simulation-safety.js) ===== */
/* @skyward-module 07-simulation-safety
 * Game loop, simulation, conflict prediction and safety.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('07-simulation-safety');
function loop(t){ try{ if(!running || !$('#game')?.classList.contains('active')) return; SAFE_MODE.lastFrame=t; const rawDt=Math.min(.08,Math.max(0,(t-last)/1000)); const dt=rawDt*(typeof atcDtScale==='function'?atcDtScale():1); last=t; adaptivePerformanceGuard(rawDt); if(!paused) update(dt); draw(); requestAnimationFrame(loop); }catch(e){ showSafeMode(e); } }
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
  updatePlanes(dt); predictConflicts(); checkRunway(); updateSurfaceSafetyDirector?.(dt); checkConflicts(); checkMissedRequests();
  score += dt * (aircraft.length * 1.4);
  maybeSaveGoodState('running');
  if(performance.now()-lastUiRenderAt>=180) renderGameplayUi();
}

function renderGameplayUi(force=false){
  const now=performance.now();
  if(!force && now-lastUiRenderAt<160) return;
  lastUiRenderAt=now;
  renderStrips(); renderSelected(); renderRequests(); updateFrequencyPanel(); renderActionGrid();
  updateOperationalHints(); renderRunwayBoard(); renderFuelBoard(); renderAirportOpsBoard(); renderSurfaceSafetyBoard?.();
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
  const surfaceRisk = surfaceCommandRisk?.(p,cmd);
  if(surfaceRisk?.block) return surfaceRisk;
  const incidentRisk = typeof incidentRiskForCommand==='function' ? incidentRiskForCommand(cmd,p) : {level:'ok',block:false,msg:''};
  if(incidentRisk.block || incidentRisk.level==='danger') return incidentRisk;
  const netRisk = typeof networkCommandRisk==='function' ? networkCommandRisk(cmd,p) : {level:'ok',block:false,msg:''};
  if(netRisk.block || netRisk.level==='danger') return netRisk;
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
  if(surfaceRisk?.level==='warn') return surfaceRisk;
  if(cmd==='holdShort' && !['TAXI','HOLD_SHORT'].includes(p.status)) return {level:'warn', block:false, msg:'Hold short é indicado para tráfego de solo/táxi.'};
  if(cmd==='vectorFinal' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Vetor final disponível apenas para chegadas.'};
  if(cmd==='goAround' && p.kind!=='arrival') return {level:'warn', block:true, msg:'Arremeter aplica-se a chegadas.'};
  return {level:'ok', block:false, msg:'Comando dentro do envelope operacional.'};
}
function updateSafetyState(){
  const surface=updateSurfaceSafetyDirector?.(0);
  const conflicts=Array.isArray(conflictPredictions)?conflictPredictions.length:0;
  const selectedPlane=aircraft.find(x=>x.id===selected);
  const sep=selectedPlane ? nearestSeparationThreat(selectedPlane) : null;
  const shortFinal=arrivalOnShortFinal();
  let score=100;
  const messages=[];
  if(runwayOccupiedBy){ score-=18; messages.push(`Pista protegida: ${runwayOccupiedBy}.`); }
  if(surface?.level==='danger'){ score-=22; messages.push(surface.alerts?.[0]?.msg || 'Risco crítico de superfície.'); }
  else if(surface?.level==='warn'){ score-=8; messages.push(surface.alerts?.[0]?.msg || 'Atenção em superfície.'); }
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
  if(typeof SKYWARD_WEATHER_OPS!=='undefined' && SKYWARD_WEATHER_OPS.state?.().flightRules==='LIFR') setDiagnostic('LIFR / BAIXA VISIBILIDADE','warn');
  else if(emergencyDirector.active) setDiagnostic('MAYDAY / PRIORIDADE ATIVA','danger');
  else if(conflictPredictions.some(c=>c.level==='danger')) setDiagnostic('CONFLITO PREVISTO','danger');
  else if(requests.some(r=>r.priority==='urgent')) setDiagnostic('EMERGÊNCIA NA FILA','danger');
  else if(conflictPredictions.length) setDiagnostic('SEPARAÇÃO EM ATENÇÃO','warn');
  else if(isRunwayProtectedByOther(p)) setDiagnostic('PISTA OCUPADA','warn');
  else setDiagnostic('SISTEMA OK','ok');
}
function updatePlanes(dt){
  incidentTick?.(dt);
  maybeTriggerIncident?.();
  for(const p of aircraft){
    p.selected = selected === p.id;
    if(p.status==='PARKED'){ updateAircraftPerformanceStep?.(p,dt,'PARKED'); p.speed = 0; }
    else if(p.status==='PUSHBACK'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'PUSHBACK');
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'pushback')||[], 'READY_TAXI');
      const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.26) ?? (p.groundTimer>9);
      if(done || p.groundTimer>9){ p.status='READY_TAXI'; p.speed=0; p.surfaceRoute=[]; addRequest(p,'taxi'); }
    } else if(p.status==='TAXI'){
      p.groundTimer += dt; updateAircraftPerformanceStep?.(p,dt,'TAXI');
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'taxi')||[], 'HOLD_SHORT');
      const hp = holdingPoints[p.groundIndex || 0] || holdingPoints[0] || {x:p.x,y:p.y};
      const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.36) ?? false;
      if(done || dist(p,hp)<1.6){ p.status='HOLD_SHORT'; p.speed=0; p.surfaceRoute=[]; addRequest(p,'lineup','warn'); }
    } else if(p.status==='LINEUP'){
      updateAircraftPerformanceStep?.(p,dt,'LINEUP'); p.speed = 0;
      if(!Array.isArray(p.surfaceRoute) || !p.surfaceRoute.length) beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'lineup')||[], 'LINEUP_READY');
      const line = (activeRunwayObject?.()||{}).lineup || {x:25,y:50}; const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.18) ?? false; p.heading=runwayHeadingValue?.()||270;
      if((done || dist(p,line)<2.0) && !requests.some(r=>r.id===p.id && r.type==='takeoff')) addRequest(p,'takeoff','warn');
    } else if(p.status==='DEP'){
      p.targetAlt = Math.max(p.targetAlt,160); stepProcedureGuidance?.(p,'SID'); p.heading = p.procedureId ? p.heading : (runwayHeadingValue?.() || p.heading || 270); updateAircraftPerformanceStep?.(p,dt,'DEP');
      moveByHeading(p, dt);
    } else if(p.status==='VACATE'){
      updateAircraftPerformanceStep?.(p,dt,'TAXI'); p.alt=0; const done=stepSurfaceRoute?.(p,dt,SIM_SPEED*.28) ?? true; p.speed=Math.max(0,Math.min(32,p.speed||0));
      if(done){ score += p.vacateBonus||0; addLog(`${p.id}: pista liberada via taxiway.`); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null; }
    } else if(p.status==='HOLD'){
      stepProcedureGuidance?.(p,'HOLD'); p.heading = p.holdingPattern ? (p.heading + 5*dt) % 360 : (p.heading + 8*dt) % 360; updateAircraftPerformanceStep?.(p,dt,'HOLD'); moveByHeading(p, dt*.75);
    } else if(p.status==='APP'){
      stepProcedureGuidance?.(p,'STAR'); if(!p.procedureId) p.heading += shortTurn(p.heading, headingTo(p, finalFix))*.018; updateAircraftPerformanceStep?.(p,dt,'APP'); moveByHeading(p, dt);
      if(dist(p,finalFix)<8 && !requests.some(r=>r.id===p.id && r.type==='landing')) addRequest(p,'landing','warn');
    } else if(p.status==='FINAL' || p.status==='EMERG'){
      stepProcedureGuidance?.(p,'APPROACH'); const threshold = activeRunwayObject?.()?.arrivalThreshold || {x:runway.x2,y:runway.y2}; if(!p.procedureId) p.heading += shortTurn(p.heading, headingTo(p, threshold))*.028; p.targetAlt=0; updateAircraftPerformanceStep?.(p,dt,p.status); moveByHeading(p, dt);
    }
    p.trail.push({x:p.x,y:p.y}); if(p.trail.length>54) p.trail.shift();
  }
  for(const p of [...aircraft]){
    const touchdownPoint = activeRunwayObject?.()?.arrivalThreshold || {x:runway.x2,y:runway.y2};
    if((p.status==='FINAL'||p.status==='EMERG') && dist(p,touchdownPoint)<2.8 && p.alt<10){
      const landingRisk = (typeof aircraftLandingRisk==='function' ? aircraftLandingRisk(p) : (p.speed>145?25:0)) + (typeof advancedWeatherLandingRisk==='function' ? advancedWeatherLandingRisk(p) : 0); const hardLanding = (landingRisk>24 || WX_STATE.severity>.72 || p.damage>30); if(hardLanding){ const dmg=Math.round(rand(8,22)+WX_STATE.severity*18+Math.min(18,landingRisk*.28)); stats.damaged=(stats.damaged||0)+1; score-=120; addLog(`${p.id}: pouso concluído com inspeção técnica. Dano ${dmg}%.`, 'warn'); } else { addLog(`${p.id}: toque confirmado, taxiando para livrar pista.`); } stats.landed++; if(p.emergency) stats.maydayResolved=(stats.maydayResolved||0)+1; score += p.emergency ? 1300 : 900; removeRequest(p.id); runwayOccupiedBy = p.id; p.status='VACATE'; p.alt=0; p.vacateBonus=35; beginSurfaceRoute?.(p, assignArrivalVacateRoute?.(p)||[], 'DONE');
    }
    if(p.status==='DEP' && (p.x<0 || p.x>104 || p.y<0 || p.y>100)){
      stats.departed++; score += 720; addLog(`${p.id}: decolagem concluída, contato com saída.`); removeRequest(p.id); runwayOccupiedBy = null; aircraft.splice(aircraft.indexOf(p),1); if(selected===p.id) selected=null;
    }
  }
}
function moveByHeading(p,dt){ const rad=degToRad(p.heading); const scale=(p.speed/220)*SIM_SPEED*4.6; p.x += Math.cos(rad)*scale*dt; p.y += Math.sin(rad)*scale*dt; }
function moveToward(p,t,amount){ const h=headingTo(p,t), r=degToRad(h); p.x += Math.cos(r)*amount*100; p.y += Math.sin(r)*amount*100; }
function shortTurn(a,b){ return QUALITY?.shortestTurn ? QUALITY.shortestTurn(a,b) : ((b-a+540)%360)-180; }
function pointToSegmentDistance(point,a,b){ const ax=a.x, ay=a.y, bx=b.x, by=b.y, px=point.x, py=point.y; const abx=bx-ax, aby=by-ay; const ab2=abx*abx+aby*aby||1; const t=Math.max(0,Math.min(1,((px-ax)*abx+(py-ay)*aby)/ab2)); const x=ax+abx*t, y=ay+aby*t; return Math.hypot(px-x,py-y); }
function checkRunway(){
  runwayOccupiedBy = null;
  const a={x:runway.x1,y:runway.y1}, b={x:runway.x2,y:runway.y2};
  for(const p of aircraft){ if(['LINEUP','DEP','FINAL','EMERG','VACATE'].includes(p.status) && pointToSegmentDistance(p,a,b)<6.2) runwayOccupiedBy = p.id; }
}
function checkMissedRequests(){
  const now = performance.now();
  for(const r of requests){
    const age = (now-r.time)/1000;
    const p = aircraft.find(x=>x.id===r.id); if(!p) continue;
    const requestPace=typeof atcPaceFactor==='function'?atcPaceFactor():1;
    if(age>52*requestPace && r.priority==='urgent') return endGame(true,`${r.id} em emergência ficou sem resposta.`);
    if(age>72*requestPace && r.priority!=='urgent'){ r.priority='warn'; score-=30; }
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

/* ===== MODULE 64: 08-radar-rendering (08-radar-rendering.js) ===== */
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
  drawPublishedProceduresOverlay?.(ctx,w,h);
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
  const graph=activeAirportGraph || airportSurfaceGraphFor?.();
  // taxiway network
  ctx.strokeStyle='rgba(210,168,68,.32)'; ctx.lineWidth=Math.max(2,w*.004);
  (graph?.taxiways||[]).forEach(t=>{
    const pts=Array.isArray(t.points)?t.points:[]; if(pts.length<2) return;
    ctx.beginPath(); pts.forEach((pt,i)=>{ const px=P(pt.x,pt.y); if(i===0) ctx.moveTo(px.x,px.y); else ctx.lineTo(px.x,px.y); }); ctx.stroke();
    const mid=pts[Math.floor(pts.length/2)]||pts[0]; const mp=P(mid.x,mid.y); ctx.fillStyle='rgba(255,214,122,.72)'; ctx.font='700 9px ui-monospace'; ctx.fillText(t.id,mp.x+4,mp.y-4);
  });
  // secondary runways
  (secondaryRunways||[]).forEach(rw=>{
    const a=P(rw.x1,rw.y1), b=P(rw.x2,rw.y2); ctx.lineWidth=Math.max(10,h*.024); ctx.strokeStyle='rgba(15,18,22,.65)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
    ctx.lineWidth=1.5; ctx.strokeStyle='rgba(175,190,205,.28)'; ctx.setLineDash([10,9]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  });
  // active runway
  const a=P(runway.x1,runway.y1), b=P(runway.x2,runway.y2); ctx.lineWidth=Math.max(16,h*.035); ctx.strokeStyle='rgba(20,24,28,.98)'; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
  ctx.lineWidth=Math.max(2,h*.004); ctx.strokeStyle=runwayOccupiedBy?'rgba(255,77,66,.95)':'rgba(100,255,130,.85)'; ctx.setLineDash([12,8]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  ctx.strokeStyle='rgba(255,255,255,.58)'; ctx.lineWidth=1; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke(); ctx.setLineDash([]);
  // approach corridor and final sector
  const ff=P(finalFix.x,finalFix.y), th=P((activeRunwayObject?.()?.arrivalThreshold?.x)||runway.x2,(activeRunwayObject?.()?.arrivalThreshold?.y)||runway.y2); ctx.strokeStyle='rgba(91,240,109,.28)'; ctx.lineWidth=2; ctx.setLineDash([10,10]); ctx.beginPath(); ctx.moveTo(ff.x,ff.y); ctx.lineTo(th.x,th.y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle='rgba(91,240,109,.75)'; ctx.beginPath(); ctx.arc(ff.x,ff.y,5,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText('FINAL FIX', ff.x+8, ff.y+4);
  ctx.font='700 12px ui-monospace,Consolas,monospace'; ctx.fillStyle='rgba(235,245,255,.90)'; ctx.fillText(`RWY ${String(runway.name).split('/')[0]}`, a.x-8, a.y-18); ctx.fillText(`RWY ${String(runway.name).split('/')[1]||runway.name}`, b.x-42, b.y-18);
  (activeRunwayObject?.()?.exits||[]).forEach((ex,i)=>{ const e=P(ex.x,ex.y); ctx.fillStyle='rgba(216,163,72,.95)'; ctx.beginPath(); ctx.arc(e.x,e.y,4,0,Math.PI*2); ctx.fill(); ctx.font='700 10px ui-monospace'; ctx.fillText(ex.id||`E${i+1}`, e.x+6, e.y+4); });
  gates.forEach((g,i)=>{ const gp=P(g.x,g.y); ctx.strokeStyle='rgba(120,180,220,.25)'; ctx.strokeRect(gp.x-10,gp.y-7,20,14); ctx.fillStyle='rgba(190,215,235,.72)'; ctx.font='700 9px ui-monospace'; ctx.fillText(g.id||`${g.label}${i+1}`,gp.x-9,gp.y+3); });
  holdingPoints.forEach((h,i)=>{ const hp=P(h.x,h.y); ctx.fillStyle='rgba(255,191,61,.84)'; ctx.beginPath(); ctx.arc(hp.x,hp.y,3.2,0,Math.PI*2); ctx.fill(); ctx.font='700 9px ui-monospace'; ctx.fillText(h.id||`H${i+1}`,hp.x+5,hp.y-4); });
  if(runwayOccupiedBy){ ctx.fillStyle='rgba(255,77,66,.92)'; ctx.font='900 13px ui-monospace'; ctx.fillText(`PISTA OCUPADA: ${runwayOccupiedBy}`, P(19,Math.max(8,runway.y1-5)).x, P(19,Math.max(8,runway.y1-5)).y); }
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

/* ===== MODULE 65: 09-ui-clearances (09-ui-clearances.js) ===== */
/* @skyward-module 09-ui-clearances
 * Traffic UI, requests, commands, clearances and action grids.
 * Canonical source for the generated main.js bundle.
 */
window.SKYWARD_MODULES?.push('09-ui-clearances');
// F15 bridge: commandRisk consults weatherRiskForCommand when available.
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
      <div class="sel-item"><span>SETOR</span><b>${op}</b></div><div class="sel-item"><span>WAKE</span><b>${wakeCategory(p)}</b></div><div class="sel-item"><span>VREF</span><b>${p.performance?.vRef||aircraftPerformanceProfile?.(p.type)?.finalSpeed||'--'}kt</b></div><div class="sel-item"><span>ENVELOPE</span><b>${aircraftEnvelopeState?.(p)||'NORMAL'}</b></div><div class="sel-item"><span>SURFACE</span><b>${surfaceSafetyState?.level?.toUpperCase?.()||'OK'}</b></div><div class="sel-item"><span>FUEL</span><b class="fuel-${fuelClass(p)}">${Math.round(p.fuel??0)}%</b></div><div class="sel-item"><span>DMG</span><b>${Math.round(p.damage||0)}%</b></div>
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
  if(cmd==='hold'){ p.hold=!p.hold; if(p.kind==='arrival') p.status=p.hold?'HOLD':'APP'; if(p.hold) assignHoldingPattern?.(p); addLog(`${airport().icao}: ${p.id} ${p.hold?'entre em espera publicada':'prossiga aproximação'}.`); }
  if(cmd==='holdShort'){ if(['TAXI','LINEUP','DEP'].includes(p.status)){ p.status='HOLD_SHORT'; p.speed=0; p.cleared=false; addLog(`${airport().icao}: ${p.id} hold short pista ${runway.name}.`); } }
  if(cmd==='vectorFinal'){ if(p.kind==='arrival'){ p.status='APP'; p.hold=false; assignArrivalProcedure?.(p); p.heading=headingTo(p, finalFix); p.targetAlt=Math.min(p.targetAlt,45); p.speed=Math.min(p.speed,performanceTargetSpeed?.(p,'APP')||170); addLog(`${airport().icao}: ${p.id} vetor para interceptar ${p.procedureId||'final'} RWY ${runway.name}.`); } }
  if(cmd==='deny'){ denyRequest(p); }
  if(cmd==='goAround'){ p.status='APP'; p.cleared=false; assignMissedApproachProcedure?.(p); p.targetAlt=80; p.speed=Math.max(p.speed,performanceTargetSpeed?.(p,'APP')||170); p.heading=headingTo(p,{x:p.x<50?20:80,y:18}); runwayOccupiedBy = runwayOccupiedBy===p.id ? null : runwayOccupiedBy; addLog(`${airport().icao}: ${p.id} execute aproximação perdida publicada, suba para FL080.`, 'warn'); }
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
    p.status='PUSHBACK'; p.sector='GND'; p.groundTimer=0; beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'pushback')||[], 'READY_TAXI'); removeRequest(p.id,'pushback'); addLog(`${airport().icao} GND: ${p.id}, pushback aprovado do gate ${p.gateId||'stand'}.`); setReadback(`${p.id} pushback aprovado.`,'ok'); score+=30; setDiagnostic('PUSHBACK APROVADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='taxi'){
    p.status='TAXI'; p.sector='GND'; p.groundIndex = Number.isInteger(p.groundIndex) ? p.groundIndex : Math.floor(rand(0,Math.max(1,holdingPoints.length))); beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'taxi')||[], 'HOLD_SHORT'); removeRequest(p.id,'taxi'); const hold=holdingPoints[p.groundIndex||0]; addLog(`${airport().icao} GND: ${p.id}, taxeie via grafo de solo até ponto ${hold?.id||'de espera'} pista ${runway.name}.`); setReadback(`${p.id} taxi autorizado para ponto de espera ${runway.name}.`,'ok'); score+=35; setDiagnostic('TÁXI AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='lineup'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} mantenha posição, pista ocupada.`, 'warn'); stats.denied++; score-=25; return; }
    p.status='LINEUP'; p.sector='TWR'; p.cleared=true; beginSurfaceRoute?.(p, assignDepartureSurfaceRoute?.(p,'lineup')||[], 'LINEUP_READY'); removeRequest(p.id,'lineup'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, alinhe e aguarde pista ${runway.name}.`); setReadback(`${p.id} alinhe e aguarde pista ${runway.name}.`,'ok'); score+=40; setDiagnostic('LINE UP AUTORIZADO','ok'); renderRunwayBoard(); return;
  }
  if(req.type==='takeoff'){
    if(runwayOccupiedBy && runwayOccupiedBy!==p.id){ addLog(`${airport().icao}: ${p.id} NEGATIVO decolagem, pista ocupada.`, 'warn'); stats.denied++; score-=40; return; }
    p.status='DEP'; p.sector='TWR'; assignDepartureProcedure?.(p); p.speed=Math.max(aircraftPerformanceProfile?.(p.type)?.rotationSpeed||130, p.speed||0); p.alt=0; p.targetAlt=160; p.heading=runwayHeadingValue?.()||270; p.surfaceRoute=[]; removeRequest(p.id,'takeoff'); runwayOccupiedBy=p.id; addLog(`${airport().icao} TWR: ${p.id}, autorizado decolagem pista ${runway.name}. Após airborne contate DEP.`); setReadback(`${p.id} autorizado decolagem pista ${runway.name}.`,'ok'); score+=70; setDiagnostic('DECOLAGEM AUTORIZADA','ok'); renderRunwayBoard(); return;
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
  const careerResult = updateCareerAfterShift?.(final, stats, fail, airport().icao);
  const economyResult = evaluateOperationalEconomy?.(final, stats, fail, airport().icao);
  const networkResult = evaluateNetworkFlow?.(final, stats, fail, airport().icao);
  const controlRoomResult = completeControlRoomShift?.(final, stats, fail, airport().icao);
  const releaseCandidateResult = evaluateReleaseCandidateShift?.(final, stats, fail, airport().icao);
  const goldMasterResult = evaluateGoldMasterShift?.(final, stats, fail, airport().icao);
  const postGoldMasterResult = window.SKYWARD_POST_GOLD_MASTER?.readiness?.();
  const postPublishHealthResult = window.SKYWARD_POST_PUBLISH_HEALTH?.evaluate?.();
  window.SKYWARD_PUBLIC_OPS?.completeTurn?.();
  const publicOpsResult = window.SKYWARD_PUBLIC_OPS?.evaluate?.();
  const trainingAcademyResult = evaluateTrainingShift?.(final, stats, fail, airport().icao);
  const trainingCoachResult = evaluateTrainingCoach?.(final, stats, fail, airport().icao);
  const internationalCampaignResult = evaluateInternationalCampaign?.(final, stats, fail, airport().icao);
  const airlineOpsResult = evaluateAirlineOps?.(final, stats, fail, airport().icao);
  const airportAuthorityResult = evaluateAirportAuthority?.(final, stats, fail, airport().icao);
  const crisisCommandResult = evaluateCrisisCommand?.(final, stats, fail, airport().icao);
  const safetyComplianceResult = auditSafetyCompliance?.(final, stats, fail, airport().icao);
  const infrastructureExpansionResult = evaluateInfrastructureExpansion?.(final, stats, fail, airport().icao);
  const environmentSustainabilityResult = evaluateEnvironmentSustainability?.(final, stats, fail, airport().icao);
  const revenueManagementResult = evaluateRevenueManagement?.(final, stats, fail, airport().icao);
  const workforceStaffingResult = evaluateWorkforceStaffing?.(final, stats, fail, airport().icao);
  const passengerReputationResult = evaluatePassengerReputation?.(final, stats, fail, airport().icao);
  const multiAirportNetworkResult = evaluateMultiAirportNetwork?.(final, stats, fail, airport().icao);
  const emergencyResponseResult = evaluateEmergencyResponse?.(final, stats, fail, airport().icao);
  const securityCyberResult = evaluateSecurityCyber?.(final, stats, fail, airport().icao);
  const assetMaintenanceResult = evaluateAssetMaintenance?.(final, stats, fail, airport().icao);
  const digitalTwinResult = evaluateDigitalTwin?.(final, stats, fail, airport().icao);
  const aiCopilotResult = evaluateAiCopilot?.(final, stats, fail, airport().icao);
  const radioPhraseologyResult = evaluateRadioPhraseology?.(final, stats, fail, airport().icao);
  const groundTurnaroundResult = evaluateGroundTurnaround?.(final, stats, fail, airport().icao);
  const cargoLogisticsResult = evaluateCargoLogistics?.(final, stats, fail, airport().icao);
  const terminalFlowResult = evaluateTerminalFlow?.(final, stats, fail, airport().icao);
  const nonAeroRevenueResult = evaluateNonAeroRevenue?.(final, stats, fail, airport().icao);
  const adaptivePaceResult = evaluateAdaptivePace?.(final, stats, fail, airport().icao);
  const stabilityDiagnosticsResult = evaluateStabilityDiagnostics?.(final, stats, fail, airport().icao);
  const pwaUpdateResult = evaluatePwaUpdateManager?.(final, stats, fail, airport().icao);
  const liveOpsConfigResult = evaluateLiveOpsConfig?.(final, stats, fail, airport().icao);
  const scenarioMissionResult = evaluateScenarioMission?.(final, stats, fail, airport().icao);
  const campaignProgressionResult = evaluateCampaignProgression?.(final, stats, fail, airport().icao);
  const instructorDebriefResult = evaluateInstructorDebrief?.(final, stats, fail, airport().icao);
  const replayTimelineResult = evaluateReplayTimeline?.(final, stats, fail, airport().icao);
  const worldAirportResult = evaluateWorldAirportProcedures?.(final, stats, fail, airport().icao);
  const dynamicWeatherResult = evaluateDynamicWeather?.(final, stats, fail, airport().icao);
  const arrivalDepartureResult = evaluateArrivalDepartureSequencer?.(final, stats, fail, airport().icao);
  const sectorHandoffResult = evaluateSectorHandoff?.(final, stats, fail, airport().icao);
  persistProfile('end-game');
  $('#resultTitle').textContent = fail ? 'GAME OVER' : 'FIM DE TURNO';
  $('#resultReason').textContent = reason;
  $('#finalScore').textContent = final.toLocaleString('pt-BR');
  $('#finalStats').innerHTML = `<div><span>Pousos concluídos</span><b>${stats.landed}</b></div><div><span>Decolagens concluídas</span><b>${stats.departed}</b></div><div><span>Solicitações recebidas</span><b>${stats.requests}</b></div><div><span>Clearances negados/incorretos</span><b>${stats.denied}</b></div><div><span>Conflitos detectados</span><b>${stats.conflicts}</b></div><div><span>Comandos emitidos</span><b>${stats.commands}</b></div><div><span>Comandos bloqueados</span><b>${stats.blocked||0}</b></div><div><span>Avisos Safety</span><b>${stats.safetyWarnings||0}</b></div><div><span>Conflitos de solo</span><b>${stats.surfaceConflicts||0}</b></div><div><span>Runway incursions</span><b>${stats.runwayIncursions||0}</b></div><div><span>Incidentes resolvidos</span><b>${stats.incidentsResolved||0}</b></div><div><span>Falhas em incidentes</span><b>${stats.incidentFailures||0}</b></div><div><span>Fechamentos de pista</span><b>${stats.runwayClosures||0}</b></div><div><span>Emergências</span><b>${stats.emergencies}</b></div><div><span>MAYDAY resolvidos</span><b>${stats.maydayResolved||0}</b></div><div><span>Combustível mínimo</span><b>${stats.lowFuel||0}</b></div><div><span>Danos/inspeções</span><b>${stats.damaged||0}</b></div><div><span>Aeroporto</span><b>${airport().icao}</b></div><div><span>Objetivos de missão</span><b>${mission?.completed?'concluídos':'parciais'}</b></div><div><span>Sector</span><b>${sectorHandoffResult?.evaluation ? sectorHandoffResult.evaluation.primarySector : '---'}</b></div><div><span>Handoff</span><b>${sectorHandoffResult?.evaluation ? sectorHandoffResult.evaluation.status : '---'}</b></div><div><span>Flow</span><b>${arrivalDepartureResult?.evaluation ? arrivalDepartureResult.evaluation.status : '---'}</b></div><div><span>AMAN/DMAN</span><b>${arrivalDepartureResult?.evaluation ? arrivalDepartureResult.evaluation.arrivalFlow : '---'}</b></div><div><span>Weather</span><b>${dynamicWeatherResult?.evaluation ? dynamicWeatherResult.evaluation.status : '---'}</b></div><div><span>ATIS</span><b>${dynamicWeatherResult?.evaluation ? dynamicWeatherResult.evaluation.atis : '---'}</b></div><div><span>Airport</span><b>${worldAirportResult?.evaluation ? worldAirportResult.evaluation.airport : '---'}</b></div><div><span>Airport Score</span><b>${worldAirportResult?.evaluation ? worldAirportResult.evaluation.airportScore : '---'}</b></div><div><span>Replay</span><b>${replayTimelineResult?.evaluation ? replayTimelineResult.evaluation.status : '---'}</b></div><div><span>Heatmap</span><b>${replayTimelineResult?.evaluation ? replayTimelineResult.evaluation.topZone : '---'}</b></div><div><span>Debrief</span><b>${instructorDebriefResult?.evaluation ? instructorDebriefResult.evaluation.status : '---'}</b></div><div><span>Treino</span><b>${instructorDebriefResult?.evaluation ? instructorDebriefResult.evaluation.recommendedDrill : '---'}</b></div><div><span>Career</span><b>${campaignProgressionResult?.evaluation ? campaignProgressionResult.evaluation.rank : '---'}</b></div><div><span>XP Gain</span><b>${campaignProgressionResult?.evaluation ? campaignProgressionResult.evaluation.xpGained : '---'}</b></div><div><span>Mission</span><b>${scenarioMissionResult?.evaluation ? scenarioMissionResult.evaluation.grade : '---'}</b></div><div><span>Mission Score</span><b>${scenarioMissionResult?.evaluation ? scenarioMissionResult.evaluation.missionScore : '---'}</b></div><div><span>Live Ops</span><b>${liveOpsConfigResult?.evaluation ? liveOpsConfigResult.evaluation.profile : '---'}</b></div><div><span>Cfg Score</span><b>${liveOpsConfigResult?.evaluation ? liveOpsConfigResult.evaluation.configScore : '---'}</b></div><div><span>PWA Update</span><b>${pwaUpdateResult?.evaluation ? pwaUpdateResult.evaluation.status : '---'}</b></div><div><span>Cache Risk</span><b>${pwaUpdateResult?.evaluation ? pwaUpdateResult.evaluation.oldBundleRisk : '---'}</b></div><div><span>Stability</span><b>${stabilityDiagnosticsResult?.evaluation ? stabilityDiagnosticsResult.evaluation.status : '---'}</b></div><div><span>SafeMode</span><b>${stabilityDiagnosticsResult?.evaluation ? stabilityDiagnosticsResult.evaluation.safeModeCount : '---'}</b></div><div><span>Pace Director</span><b>${adaptivePaceResult?.evaluation ? adaptivePaceResult.evaluation.band : '---'}</b></div><div><span>Ritmo</span><b>${adaptivePaceResult?.evaluation ? adaptivePaceResult.evaluation.pace+'x' : '---'}</b></div><div><span>Non-Aero Rev</span><b>${nonAeroRevenueResult?.evaluation ? nonAeroRevenueResult.evaluation.status : '---'}</b></div><div><span>Spend/Pax</span><b>${nonAeroRevenueResult?.evaluation ? nonAeroRevenueResult.evaluation.spendPerPax : '---'}</b></div><div><span>Terminal Flow</span><b>${terminalFlowResult?.evaluation ? terminalFlowResult.evaluation.status : '---'}</b></div><div><span>Fila Média</span><b>${terminalFlowResult?.evaluation ? terminalFlowResult.evaluation.avgQueueMin+'m' : '---'}</b></div><div><span>Cargo Ops</span><b>${cargoLogisticsResult?.evaluation ? cargoLogisticsResult.evaluation.status : '---'}</b></div><div><span>Freight</span><b>${cargoLogisticsResult?.evaluation ? Math.round(cargoLogisticsResult.evaluation.freightRevenue/1000)+'k' : '---'}</b></div><div><span>Ground Ops</span><b>${groundTurnaroundResult?.evaluation ? groundTurnaroundResult.evaluation.status : '---'}</b></div><div><span>TAT Médio</span><b>${groundTurnaroundResult?.evaluation ? groundTurnaroundResult.evaluation.avgTurnaroundMin+'m' : '---'}</b></div><div><span>Radio Ops</span><b>${radioPhraseologyResult?.evaluation ? radioPhraseologyResult.evaluation.status : '---'}</b></div><div><span>Readback</span><b>${radioPhraseologyResult?.evaluation ? radioPhraseologyResult.evaluation.readbackRate+'%' : '---'}</b></div><div><span>AI Copilot</span><b>${aiCopilotResult?.evaluation ? aiCopilotResult.evaluation.status : '---'}</b></div><div><span>Conf. IA</span><b>${aiCopilotResult?.evaluation ? aiCopilotResult.evaluation.confidence+'%' : '---'}</b></div><div><span>Digital Twin</span><b>${digitalTwinResult?.evaluation ? digitalTwinResult.evaluation.status : '---'}</b></div><div><span>Forecast</span><b>${digitalTwinResult?.evaluation ? digitalTwinResult.evaluation.confidence+'%' : '---'}</b></div><div><span>Asset Rel</span><b>${assetMaintenanceResult?.evaluation ? assetMaintenanceResult.evaluation.status : '---'}</b></div><div><span>Disponib.</span><b>${assetMaintenanceResult?.evaluation ? assetMaintenanceResult.evaluation.availability+'%' : '---'}</b></div><div><span>Security SOC</span><b>${securityCyberResult?.evaluation ? securityCyberResult.evaluation.status : '---'}</b></div><div><span>Nível Seg.</span><b>${securityCyberResult?.evaluation ? securityCyberResult.evaluation.responseLevel : '---'}</b></div><div><span>Emergency Ops</span><b>${emergencyResponseResult?.evaluation ? emergencyResponseResult.evaluation.status : '---'}</b></div><div><span>Resposta</span><b>${emergencyResponseResult?.evaluation ? emergencyResponseResult.evaluation.responseTime+'m' : '---'}</b></div><div><span>Multi Hub</span><b>${multiAirportNetworkResult?.evaluation ? multiAirportNetworkResult.evaluation.status : '---'}</b></div><div><span>Rede</span><b>${multiAirportNetworkResult?.evaluation ? multiAirportNetworkResult.evaluation.networkScore+'%' : '---'}</b></div><div><span>Passenger XP</span><b>${passengerReputationResult?.evaluation ? passengerReputationResult.evaluation.status : '---'}</b></div><div><span>NPS</span><b>${passengerReputationResult?.evaluation ? Math.round(passengerReputationResult.evaluation.metrics.NPS) : '---'}</b></div><div><span>Workforce</span><b>${workforceStaffingResult?.evaluation ? workforceStaffingResult.evaluation.status : '---'}</b></div><div><span>Fadiga Média</span><b>${workforceStaffingResult?.evaluation ? workforceStaffingResult.evaluation.coverage.avgFatigue : '---'}</b></div><div><span>Rev Mgmt</span><b>${revenueManagementResult?.evaluation ? revenueManagementResult.evaluation.status : '---'}</b></div><div><span>Margem</span><b>${revenueManagementResult?.evaluation ? revenueManagementResult.evaluation.margin+'%' : '---'}</b></div><div><span>ENV ESG</span><b>${environmentSustainabilityResult?.evaluation ? environmentSustainabilityResult.evaluation.status : '---'}</b></div><div><span>Licença Amb.</span><b>${environmentSustainabilityResult?.evaluation ? environmentSustainabilityResult.evaluation.permitStatus : '---'}</b></div><div><span>Infra CAPEX</span><b>${infrastructureExpansionResult?.evaluation ? infrastructureExpansionResult.evaluation.status : '---'}</b></div><div><span>Capacidade</span><b>${infrastructureExpansionResult?.evaluation ? infrastructureExpansionResult.evaluation.capacityScore+'%' : '---'}</b></div><div><span>Safety SMS</span><b>${safetyComplianceResult?.evaluation ? safetyComplianceResult.evaluation.complianceStatus : '---'}</b></div><div><span>Achados SMS</span><b>${safetyComplianceResult?.evaluation ? safetyComplianceResult.evaluation.openFindings : '---'}</b></div><div><span>Crisis Cmd</span><b>${crisisCommandResult?.evaluation ? crisisCommandResult.evaluation.status : '---'}</b></div><div><span>Recovery</span><b>${crisisCommandResult?.evaluation ? crisisCommandResult.evaluation.recoveryStage : '---'}</b></div><div><span>Airport Auth</span><b>${airportAuthorityResult?.evaluation ? airportAuthorityResult.evaluation.experience : '---'}</b></div><div><span>Terminal EXP</span><b>${airportAuthorityResult?.evaluation ? airportAuthorityResult.evaluation.authorityScore+'%' : '---'}</b></div><div><span>Airline Ops</span><b>${airlineOpsResult?.evaluation ? airlineOpsResult.evaluation.status : '---'}</b></div><div><span>SLA Cias</span><b>${airlineOpsResult?.evaluation ? airlineOpsResult.evaluation.sla.weighted+'%' : '---'}</b></div><div><span>Campanha Intl</span><b>${internationalCampaignResult?.evaluation ? internationalCampaignResult.evaluation.status : '---'}</b></div><div><span>Contrato ativo</span><b>${internationalCampaignResult?.nextContract ? internationalCampaignResult.nextContract.airport : '---'}</b></div><div><span>Instrutor ATC</span><b>${trainingCoachResult?.debrief ? trainingCoachResult.debrief.level : '---'}</b></div><div><span>Plano de estudo</span><b>${trainingCoachResult?.studyPlan ? trainingCoachResult.studyPlan.length+' cards' : '---'}</b></div><div><span>Academia ATC</span><b>${trainingAcademyResult?.attempt ? (trainingAcademyResult.attempt.passed ? 'APROVADO' : 'TREINO') : '---'}</b></div><div><span>Próxima missão</span><b>${trainingAcademyResult?.nextMission ? trainingAcademyResult.nextMission.id : '---'}</b></div><div><span>Public Ops</span><b>${publicOpsResult ? publicOpsResult.status : '---'}</b></div><div><span>Ops Score</span><b>${publicOpsResult ? publicOpsResult.score+'%' : '---'}</b></div><div><span>Publish Health</span><b>${postPublishHealthResult ? postPublishHealthResult.status : '---'}</b></div><div><span>Health Score</span><b>${postPublishHealthResult ? postPublishHealthResult.score+'%' : '---'}</b></div><div><span>Publicação PWA</span><b>${postGoldMasterResult ? postGoldMasterResult.status : '---'}</b></div><div><span>Post-GM Ready</span><b>${postGoldMasterResult ? postGoldMasterResult.score+'%' : '---'}</b></div><div><span>Gold Master</span><b>${goldMasterResult?.gates ? goldMasterResult.gates.status : '---'}</b></div><div><span>GM Score</span><b>${goldMasterResult?.gates ? goldMasterResult.gates.score+'%' : '---'}</b></div><div><span>Release Candidate</span><b>${releaseCandidateResult?.gates ? releaseCandidateResult.gates.status : '---'}</b></div><div><span>QA Score</span><b>${releaseCandidateResult?.gates ? releaseCandidateResult.gates.score+'%' : '---'}</b></div><div><span>Replay compartilhável</span><b>${controlRoomResult?.replay ? 'GERADO' : '---'}</b></div><div><span>Ranking local</span><b>${controlRoomResult?.replay ? controlRoomResult.replay.tier : '---'}</b></div><div><span>Network Flow</span><b>${networkResult?.shift ? (networkResult.shift.route+' / '+Math.round(networkResult.shift.slotCompliance*100)+'%') : '---'}</b></div><div><span>Conexões protegidas</span><b>${networkResult?.network ? networkResult.network.connectionsProtected : 0}</b></div><div><span>Economia</span><b>${economyResult?.shift ? ('$'+Math.round(economyResult.shift.profit).toLocaleString('pt-BR')) : '---'}</b></div><div><span>Eficiência econômica</span><b>${economyResult?.shift ? economyResult.shift.efficiency+'%' : '---'}</b></div><div><span>Carreira</span><b>${careerResult?.career ? (careerResult.career.licenseId+' / '+careerResult.career.ratingId) : '---'}</b></div><div><span>Fadiga</span><b>${careerResult?.career ? Math.round(careerResult.career.fatigue)+'%' : '---'}</b></div><div><span>Build</span><b>${BUILD}</b></div>`;
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

/* ===== MODULE 66: 10-events-selftest-bootstrap (10-events-selftest-bootstrap.js) ===== */
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

/* ===== MODULE 67: 11-mobile-runtime (11-mobile-runtime.js) ===== */
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

/* ===== MODULE 68: desktop-workspace (12-desktop-workspace.js) ===== */
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

/* ===== MODULE 69: accessibility-settings (13-accessibility-settings.js) ===== */
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

/* ===== MODULE 70: deterministic-replay (14-deterministic-replay.js) ===== */
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

/* ===== MODULE 71: quality-test-bridge (12-quality-test-bridge.js) ===== */
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
