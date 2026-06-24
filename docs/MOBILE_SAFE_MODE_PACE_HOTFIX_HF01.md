# F50.1 — Mobile Safe Mode & Pace Tuning

Hotfix aplicado sobre a Fase 50.

## Correções

- Corrigido `TypeError: Assignment to constant variable` em `resolveOperationalIncident`.
- Removido o sombreamento da variável global `score` pelo score de resolução de incidente.
- A penalidade de incidente agora aplica no placar global sem quebrar o turno.
- Incidentes automáticos agora têm cooldown maior.
- No mobile, o tempo para incidente expirar é multiplicado por `1.75`.
- No mobile, o delta de simulação é reduzido para `0.62`, deixando movimento, solo, spawn e ritmo mais controláveis.
- No mobile, o tráfego inicial cai para 2–4 aeronaves.
- No mobile, o intervalo de spawn aumenta automaticamente.
- Timeouts de solicitações/readbacks no mobile respeitam o fator de ritmo.

## Build

- Build: `SC-1.50.1-F50-20260624-1430`
- Versão: `1.50.1`
- Canal: `mobile-stability-hotfix`
