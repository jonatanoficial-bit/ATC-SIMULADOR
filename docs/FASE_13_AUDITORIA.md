# Auditoria — Fase 13

A auditoria da Fase 13 valida:

1. **Metadados de release** da build F13.
2. **Geração 13 da arquitetura runtime**.
3. Presença do **módulo de grafo de superfície** no bundle.
4. Existência do catálogo de aeroportos no pacote e no cache offline.
5. Integração do grafo com **tráfego, simulação e render**.
6. Aprovação dos relatórios `PHASE13_UNIT_TESTS.json` e `PHASE13_BROWSER_TESTS.json`.

Saídas de auditoria:

- `audit/PHASE13_UNIT_TESTS.json`
- `audit/PHASE13_BROWSER_TESTS.json`
- `tests/phase13-audit.mjs`
