# Documentação técnica

## Arquitetura

Skyward Control é uma aplicação web estática sem dependências de runtime.
`index.html` carrega `build-info.js` e o bundle gerado `main.js`. O runtime é
composto por 71 módulos ordenados em `src/runtime/module-order.json`.

O bundle é reproduzido por:

```bash
npm run build:runtime
```

Não edite `main.js` manualmente.

## Contratos

Os contratos de domínio ficam em:

- `src/types/domain.ts`;
- `src/contracts/runtime-contracts.ts`.

`tools/build-contracts.mjs` gera o módulo JavaScript correspondente. A validação
usa TypeScript 5.8.3 em modo strict.

## Estado e persistência

O perfil, snapshots e preferências são locais ao navegador. O Save Vault
mantém escrita transacional, migração de schema e restauração segura.

Schemas atuais:

- save: 3;
- contratos: 2;
- testes: 3;
- save vault: 1;
- PWA/cache/UX: 1.

## PWA

Arquivos principais:

- `manifest.webmanifest`;
- `service-worker.js`;
- `pwa-cache-manifest.json`;
- `src/runtime/01-pwa-runtime.js`.

O cache é reconstruído com:

```bash
npm run build:pwa
```

Para testar corretamente, execute por HTTP. `localhost` é suficiente em
desenvolvimento.

## Responsividade

- menus: portrait e landscape;
- turno mobile/tablet em retrato: guard de orientação;
- turno em paisagem: layout radar-first;
- touch: mínimo de 44 px nos controles visíveis;
- desktop: workspace adaptativo até 1920 × 1080 e além.

## Testes

`npm test` executa:

1. build dos contratos;
2. build do runtime;
3. build do PWA;
4. validação estrutural;
5. 58 suítes unitárias progressivas;
6. teste do service worker;
7. proteção do pipeline;
8. regressão comercial.

Os antigos testes de auditoria por fase foram preservados como histórico. Eles
não devem ser executados em cadeia porque exigem metadados exatos e mutuamente
exclusivos de versões antigas.

## Release

Carimbar e validar:

```bash
npm run release -- --version 1.63.0 --phase F63 \
  --phase-name "Commercial Mobile-First Stability Release" \
  --channel production
```

Empacotar:

```bash
npm run release -- --reuse-stamp --package --output dist
```

O ZIP recebe:

- `MANIFEST_SHA256.txt` interno;
- checksum `.sha256` externo;
- metadados `.metadata.json`.

## Integridade

Dentro de uma pasta extraída:

```bash
npm run verify:integrity
```

Qualquer arquivo alterado, ausente ou inesperado faz a verificação falhar.
