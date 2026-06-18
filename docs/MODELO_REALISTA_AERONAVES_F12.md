# Fase 12 — Modelo Realista de Aeronaves

A Fase 12 adiciona envelope de performance por tipo de aeronave, VREF, velocidade de aproximação, rotação, subida/descida, aceleração/desaceleração, consumo e wake.

## Sistemas

- `src/runtime/15-aircraft-performance.js`: módulo runtime oficial.
- `data/aircraft-performance.json`: catálogo auditável de perfis.
- `window.SKYWARD_AIRCRAFT_PERFORMANCE`: API protegida para testes e diagnóstico.

## Tipos cobertos

A320, A20N, A321, B738, B739, B752, E190, B77W e C208.
