# Arquitetura Runtime — Fase 03

## Objetivo

A Fase 03 substitui a edição direta do antigo `main.js` monolítico por uma arquitetura de módulos-fonte ordenados. O navegador continua carregando um único `main.js` clássico para preservar abertura local, compatibilidade mobile e ausência de dependências externas.

## Fluxo oficial

1. O código canônico fica em `src/runtime/`.
2. `src/runtime/module-order.json` define a ordem explícita dos módulos.
3. `node tools/build-runtime.mjs` valida e concatena as fontes.
4. O bundle gerado é escrito em `main.js`.
5. `runtime-manifest.json` registra linhas, bytes e SHA-256 de cada módulo e do bundle.
6. O pipeline de release recompila o runtime antes de qualquer auditoria ou empacotamento.

Nunca edite `main.js` diretamente. Qualquer alteração direta é detectada por `npm run check:runtime` e bloqueia a release.

## Módulos

| Ordem | Arquivo | Responsabilidade |
|---:|---|---|
| 1 | `00-runtime-registry.js` | Registro da arquitetura em runtime |
| 2 | `01-build-and-radio.js` | Metadados, modo seguro, rádio e readback |
| 3 | `02-weather-fuel-operations.js` | Clima, combustível, pista, missão e handoff |
| 4 | `03-resilience-snapshots.js` | Snapshot, restauração, sanitização e recuperação |
| 5 | `04-state-airports-procedures.js` | Estado global, aeroportos e procedimentos |
| 6 | `05-profile-navigation.js` | Perfil, cenas, fullscreen, orientação e logs |
| 7 | `06-traffic-requests.js` | Aeronaves, callsigns, solicitações e início do turno |
| 8 | `07-simulation-safety.js` | Loop, movimento, conflitos e Safety Advisor |
| 9 | `08-radar-rendering.js` | Desenho do radar, mapa, procedimentos e telemetria |
| 10 | `09-ui-clearances.js` | Strips, comandos, clearances e ações contextuais |
| 11 | `10-events-selftest-bootstrap.js` | Eventos desktop, filtros e autoteste |
| 12 | `11-mobile-runtime.js` | Dock, painéis e comandos mobile |

## Compatibilidade

O bundle final continua sendo um script clássico carregado após `build-info.js`. Isso evita a restrição CORS que módulos ES podem sofrer quando o jogo é aberto diretamente pelo arquivo `index.html`, mantendo o comportamento da Fase 02.

## Barreiras anti-quebra

- Ordem duplicada ou módulo ausente bloqueia a build.
- Marcador arquitetural ausente bloqueia a build.
- Módulo com erro de sintaxe bloqueia a build.
- Divergência entre fontes, `main.js` e `runtime-manifest.json` bloqueia a build.
- Hash divergente bloqueia a auditoria F03.
- Módulo acima de 350 linhas é sinalizado como retorno ao monólito.
- O pipeline sempre recompila antes de validar e empacotar.

## Comandos

```bash
npm run build:runtime
npm run check:runtime
npm run test:phase3
npm test
npm run release -- --package
```
