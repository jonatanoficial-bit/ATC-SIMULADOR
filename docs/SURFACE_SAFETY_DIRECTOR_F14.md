# Fase 14 — Surface Safety Director

A Fase 14 aprofunda a simulação de solo iniciada na Fase 13. O foco é impedir que o controlador libere movimentos perigosos em taxiways, pontos de espera e pista ativa.

## Entregas principais

- Novo módulo oficial `src/runtime/17-surface-safety-director.js`.
- Novo catálogo `data/surface-hotspots.json`.
- API protegida `window.SKYWARD_SURFACE_SAFETY`.
- Detecção de:
  - runway incursion;
  - proximidade de área protegida de pista;
  - conflito entre aeronaves em taxiway;
  - hotspots ativos por aeroporto;
  - risco de line-up e takeoff com curta final.
- Integração com `commandRisk()` para bloquear comandos inseguros.
- Integração com o Safety Advisor e estatísticas finais.

## Impacto operacional

- `lineUp` e `clearTakeoff` passam a consultar a superfície antes de liberar a pista.
- `approveTaxi` pode gerar alerta ou bloqueio quando existe conflito no solo.
- O estado selecionado mostra indicação de superfície.
- O resultado final registra conflitos de solo e runway incursions.

## Aeroportos cobertos por hotspots

- SBGR
- SBSP
- SBKP
- SBBR
- KATL
