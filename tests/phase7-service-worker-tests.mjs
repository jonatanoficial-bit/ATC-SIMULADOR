import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportMode = process.argv.includes('--report');
const source = fs.readFileSync(path.join(root, 'service-worker.js'), 'utf8');
const metadata = JSON.parse(fs.readFileSync(path.join(root, 'release-metadata.json'), 'utf8'));
const pwaCache = JSON.parse(fs.readFileSync(path.join(root, 'pwa-cache-manifest.json'), 'utf8'));

const checks = [];
const check = (name, condition, detail = '') => checks.push({ name, ok: Boolean(condition), detail });
const listeners = new Map();
const stores = new Map();
const deleted = [];
let skipWaitingCalls = 0;
let claimCalls = 0;
let networkMode = 'online';
let networkCalls = 0;

function normalizeKey(input) {
  const raw = typeof input === 'string' ? input : input?.url || String(input);
  try {
    const url = new URL(raw, 'https://skyward.test/');
    const pathname = url.pathname.replace(/^\//, '');
    return `./${pathname || 'index.html'}${url.search || ''}`;
  } catch {
    return raw.startsWith('./') ? raw : `./${raw.replace(/^\//, '')}`;
  }
}

class MockCache {
  constructor(name) { this.name = name; this.entries = new Map(); }
  async addAll(items) {
    for (const item of items) this.entries.set(normalizeKey(item), new Response(`cached:${item}`, { status: 200 }));
  }
  async match(input, options = {}) {
    let key = normalizeKey(input);
    if (options.ignoreSearch) key = key.split('?')[0];
    if (this.entries.has(key)) return this.entries.get(key).clone();
    if (options.ignoreSearch) {
      for (const [candidate, response] of this.entries) {
        if (candidate.split('?')[0] === key) return response.clone();
      }
    }
    return undefined;
  }
  async put(input, response) { this.entries.set(normalizeKey(input), response.clone()); }
}

const caches = {
  async open(name) {
    if (!stores.has(name)) stores.set(name, new MockCache(name));
    return stores.get(name);
  },
  async keys() { return [...stores.keys()]; },
  async delete(name) { deleted.push(name); return stores.delete(name); }
};

const self = {
  location: { origin: 'https://skyward.test' },
  registration: { active: null },
  clients: { claim: async () => { claimCalls += 1; } },
  skipWaiting: async () => { skipWaitingCalls += 1; },
  addEventListener(type, handler) { listeners.set(type, handler); }
};

async function fetchMock(request) {
  networkCalls += 1;
  if (networkMode === 'offline') throw new TypeError('Network unavailable');
  const url = typeof request === 'string' ? request : request.url;
  return new Response(`network:${url}`, { status: 200, headers: { 'content-type': 'text/plain' } });
}

const context = vm.createContext({
  self,
  caches,
  fetch: fetchMock,
  Response,
  Request,
  URL,
  console,
  setTimeout,
  clearTimeout,
  Promise,
  Object,
  TypeError
});
vm.runInContext(source, context, { filename: 'service-worker.js' });

const waitEvent = async (handler, event) => {
  let promise = Promise.resolve();
  handler({ ...event, waitUntil(value) { promise = Promise.resolve(value); } });
  await promise;
};
const fetchEvent = async request => {
  let responsePromise;
  listeners.get('fetch')({ request, respondWith(value) { responsePromise = Promise.resolve(value); } });
  return responsePromise ? responsePromise : null;
};

try {
  check('handlers install/activate/message/fetch registrados', ['install','activate','message','fetch'].every(type => listeners.has(type)));

  await waitEvent(listeners.get('install'), {});
  const current = stores.get(pwaCache.cacheName);
  check('install cria cache da build atual', Boolean(current), pwaCache.cacheName);
  check('install precacheia todos os recursos declarados', current?.entries.size === pwaCache.files.length + 1, `${current?.entries.size}/${pwaCache.files.length + 1}`);
  check('primeira instalação chama skipWaiting', skipWaitingCalls === 1, String(skipWaitingCalls));

  stores.set('skyward-control-old-build', new MockCache('skyward-control-old-build'));
  stores.set('unrelated-cache', new MockCache('unrelated-cache'));
  self.registration.active = {};
  await waitEvent(listeners.get('activate'), {});
  check('activate remove somente cache Skyward antigo', deleted.includes('skyward-control-old-build') && !deleted.includes('unrelated-cache'));
  check('activate preserva cache atual', stores.has(pwaCache.cacheName));
  check('activate preserva cache de terceiros', stores.has('unrelated-cache'));
  check('activate reivindica clientes', claimCalls === 1, String(claimCalls));

  let versionReply = null;
  listeners.get('message')({ data: { type: 'GET_VERSION' }, source: { postMessage(message) { versionReply = message; } } });
  check('GET_VERSION responde com build correta', versionReply?.build === metadata.build, JSON.stringify(versionReply));
  check('GET_VERSION responde com cache correto', versionReply?.cacheName === pwaCache.cacheName, JSON.stringify(versionReply));
  listeners.get('message')({ data: { type: 'SKIP_WAITING' }, source: null });
  await Promise.resolve();
  check('SKIP_WAITING autorizado aciona ativação', skipWaitingCalls === 2, String(skipWaitingCalls));

  networkMode = 'offline';
  const staticResponse = await fetchEvent({ method: 'GET', url: 'https://skyward.test/style.css', mode: 'same-origin' });
  check('recurso estático é servido do cache offline', staticResponse?.ok && (await staticResponse.text()).includes('cached:./style.css'));

  const navigationResponse = await fetchEvent({ method: 'GET', url: 'https://skyward.test/deep/link?x=1', mode: 'navigate' });
  check('navegação offline retorna app shell', navigationResponse?.ok && (await navigationResponse.text()).includes('cached:./index.html'));

  const absentResponse = await fetchEvent({ method: 'GET', url: 'https://skyward.test/not-cached.bin', mode: 'same-origin' });
  check('recurso ausente offline retorna 503 controlado', absentResponse?.status === 503, String(absentResponse?.status));

  networkMode = 'online';
  const onlineRequest = { method: 'GET', url: 'https://skyward.test/runtime-extra.json', mode: 'same-origin' };
  const onlineResponse = await fetchEvent(onlineRequest);
  check('recurso online é retornado pela rede', onlineResponse?.ok && (await onlineResponse.text()).includes('network:https://skyward.test/runtime-extra.json'));
  check('recurso online same-origin é armazenado no cache', Boolean(await current.match(onlineRequest)));
  check('fetch de outra origem é ignorado pelo worker', await fetchEvent({ method: 'GET', url: 'https://example.com/file.js', mode: 'cors' }) === null);
  check('requisição não GET é ignorada', await fetchEvent({ method: 'POST', url: 'https://skyward.test/api', mode: 'same-origin' }) === null);
  check('rede foi chamada apenas quando necessário', networkCalls >= 3, String(networkCalls));
} catch (error) {
  check('execução do ciclo do Service Worker', false, error.stack || error.message);
}

const failed = checks.filter(item => !item.ok);
const report = {
  schema: 1,
  suite: 'phase7-service-worker-lifecycle',
  mode: 'node-vm-isolated-service-worker-environment',
  build: metadata,
  cacheName: pwaCache.cacheName,
  checks,
  passed: checks.length - failed.length,
  total: checks.length,
  failed: failed.length
};
if (reportMode) fs.writeFileSync(path.join(root, 'audit/PHASE7_SERVICE_WORKER_TESTS.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Skyward Control F07 Service Worker: ${report.passed}/${report.total} aprovados`);
for (const item of checks) console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${!item.ok && item.detail ? ` — ${item.detail}` : ''}`);
if (failed.length) process.exit(1);
