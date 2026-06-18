# Arquitetura de contratos TypeScript — Fase 04

## Objetivo

A Fase 04 introduz uma fonte tipada e verificável para os dados críticos do Skyward Control sem alterar o formato de execução do navegador. O jogo continua funcionando por `index.html` + `main.js`, enquanto o desenvolvimento passa a contar com TypeScript estrito e validação real em runtime.

## Fontes canônicas

- `src/types/domain.ts`: tipos e interfaces do domínio.
- `src/contracts/runtime-contracts.ts`: validadores, sanitizadores e API pública.
- `tsconfig.json`: compilação estrita e determinística.
- `src/runtime/00-typescript-contracts.js`: saída gerada; não deve ser editada manualmente.
- `contracts-manifest.json`: hashes SHA-256 das fontes e da saída.

## Contratos cobertos

- Metadados de build.
- Aeroporto e lista de aeroportos.
- Perfil do controlador.
- Estado de aeronave e lista de aeronaves.
- Catálogo estático de aeronaves.
- Solicitação ATC e fila de solicitações.
- Snapshot seguro do turno.

## Validação e saneamento

Dados externos e persistidos são tratados em duas etapas:

1. **Saneamento:** normaliza limites seguros, valores ausentes e estruturas recuperáveis.
2. **Validação:** rejeita estruturas incompatíveis, duplicidades, enums inválidos, números não finitos e schema divergente.

A camada é exposta em `window.SKYWARD_CONTRACTS`, congelada contra alteração acidental e acompanhada por diagnósticos em memória.

## Pipeline

```bash
npm run build:contracts
npm run check:contracts
npm run typecheck
npm test
```

A release é bloqueada quando:

- TypeScript possui erro em modo estrito;
- o JavaScript gerado diverge das fontes;
- o manifesto de contratos está desatualizado;
- aeroportos ou catálogo violam o contrato;
- a integração de perfil, aeronaves, pedidos ou snapshots deixa de existir.

## Compatibilidade

- Save schema permanece em `2`.
- Contract schema inicia em `1`.
- Builds e snapshots das fases anteriores continuam compatíveis.
- Não foi adicionada dependência JavaScript ao navegador.
