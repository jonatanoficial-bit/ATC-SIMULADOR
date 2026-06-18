# Auditoria — Fase 14

A auditoria da Fase 14 valida:

1. Metadados oficiais `SC-1.14.0-F14`.
2. Schema `surfaceSafetySchema`.
3. Geração 14 da arquitetura runtime.
4. Presença do módulo `17-surface-safety-director.js` no bundle.
5. Presença do catálogo `data/surface-hotspots.json` no pacote e no cache offline.
6. Detecção unitária de runway incursion, taxi conflict e hotspot.
7. Integração com `commandRisk`, UI, estatísticas e pipeline.

Arquivos de prova:

- `audit/PHASE14_UNIT_TESTS.json`
- `audit/PHASE14_BROWSER_TESTS.json`
- `tests/phase14-audit.mjs`
