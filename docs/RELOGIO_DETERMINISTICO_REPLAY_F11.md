# Fase 11 — Relógio determinístico e replay técnico

A Fase 11 adiciona uma camada de auditoria técnica para tornar turnos reproduzíveis por seed e exportáveis em JSON.

## Recursos

- Seed determinística por build, aeroporto, perfil e turno.
- PRNG controlado pelo runtime durante o turno.
- Relógio lógico separado do relógio de parede.
- Registro de comandos antes/depois, checkpoints manuais e checkpoints periódicos.
- Checksum FNV-1a do estado resumido.
- Exportação JSON com schema, build, seed, eventos e estado final.
- API protegida em `window.SKYWARD_REPLAY`.
- Painel técnico acessível pelo botão `REPLAY` ou tecla `F11`.

## Segurança anti-quebra

O replay é uma camada de auditoria: se falhar, registra diagnóstico e o simulador continua com o comportamento anterior.
