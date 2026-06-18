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
