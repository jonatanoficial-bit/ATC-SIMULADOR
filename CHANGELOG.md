# CHANGELOG - v0.8.7_20260514_1257

## Hotfix crítico
- Corrigido erro `ReferenceError: Cannot access mission before initialization`.
- Removida inicialização prematura da missão antes da declaração `let mission`.
- Preservados recursos antequebra, Safety Advisor, Handoff Advisor e Objetivos do Turno.
- Build testada com `node --check main.js`.
