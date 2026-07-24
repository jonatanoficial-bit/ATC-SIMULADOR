# Skyward Control

Simulador de controle de tráfego aéreo mobile-first, instalável como PWA e
compatível com celular, tablet e desktop.

## Executar

O produto é uma aplicação web estática. Sirva a raiz por HTTP:

```bash
npx serve .
```

Abra o endereço exibido pelo servidor. O acesso direto por `file://` não é
recomendado porque service workers exigem uma origem HTTP segura.

## Desenvolvimento e validação

Requisitos:

- Node.js 20 ou posterior;
- npm ou pnpm.

Instalação e testes:

```bash
npm install
npm test
```

O comando principal reconstrói contratos TypeScript, bundle runtime e PWA;
executa a validação estrutural e a regressão comercial atual.

Comandos úteis:

```bash
npm run build:contracts
npm run build:runtime
npm run build:pwa
npm run validate
npm run typecheck
npm run test:current
npm run test:commercial
```

## Estrutura

- `index.html` e `style.css`: interface e responsividade;
- `src/runtime/`: módulos-fonte do simulador;
- `main.js`: bundle gerado — não editar manualmente;
- `data/`: catálogos operacionais;
- `tools/`: build, validação, release e integridade;
- `tests/`: testes atuais e histórico de evolução;
- `audit/`: relatórios da build corrente;
- `docs/`: documentação funcional histórica.

## Release

A versão comercial atual é 1.63.0. A interface pública mostra somente a versão;
fase, build completa e data permanecem nos metadados técnicos.

Consulte `AUDITORIA-TECNICA.md`, `TESTES-REALIZADOS.md`,
`DOCUMENTACAO-TECNICA.md` e `BUILD-INFO.json`.
