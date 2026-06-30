# Build Notes — SC-1.62.0-F62-20260630-1555

## Identificação

- Produto: Skyward Control
- Versão: 1.62.0
- Fase: F62 — Sector Handoff, Approach/Departure Coordination & Control Room Center + Hotfix Anti-Retorno ao Lobby
- Build: `SC-1.62.0-F62-20260630-1555`
- Data/hora: 2026-06-30 15:55 BRT
- Canal: sector-handoff-coordination
- Save schema: 3
- Contract schema: 2
- Test schema: 3
- Save vault schema: 1
- PWA schema: 1
- Cache schema: 1
- UX schema: 1
- Alvo: Mobile-first / Tablet / Desktop

## Geração reproduzível

A identificação desta build é gerada a partir de `config/release.json`. Não edite `build-info.js`, `release-metadata.json`, `version.txt`, `RELEASE.txt` ou este arquivo manualmente.

Execute:

```bash
npm run release -- --version 1.62.0 --phase F62 --phase-name "Sector Handoff, Approach/Departure Coordination & Control Room Center + Hotfix Anti-Retorno ao Lobby"
```

Para validar uma build já empacotada:

```bash
npm test
npm run verify:integrity
```

## Compatibilidade mantida

- Celular horizontal: 844 × 390
- Celular vertical: 390 × 844 nos menus; orientação horizontal durante o turno
- Tablet: 1024 × 768
- PC: 1440 × 900

## Política anti-quebra

A geração é interrompida quando há divergência de metadados, TypeScript inválido, contratos desatualizados, JavaScript inválido, JSON corrompido, referência de asset ausente, arquivo obrigatório faltando ou teste unitário reprovado, cenário Chromium reprovado, soak test instável ou teste de regressão reprovado. O pacote final recebe manifesto SHA-256 interno e checksum externo do ZIP.


## Continuidade de fases preservadas

- F50.1 Mobile Stability preservado.
- F51 Adaptive Pace preservada.
- F52 Stability Diagnostics preservada.
- F53 PWA Update Manager preservada.
- F54 Live Ops Remote Config preservada.
- F55 Scenario Mission Generator preservada.
- F56 Campaign Progression preservada.
- F57 Instructor Debrief preservada.
- F58 Replay Timeline preservada.
- F59 World Airport Procedure preservada.
- F60 Dynamic Weather ATIS/NOTAM preservada.
- F61 Arrival/Departure Sequencer preservada.
- F62 Sector Handoff preservada.

## Hotfix F62.1 — Anti-retorno ao lobby

- O erro temporário de runtime não abre mais o pop-up bloqueante `crashShield` durante o turno.
- O loop do radar agenda recuperação automática e preserva a tela de jogo.
- O estado de aeronaves, solicitações e HUD passa por sanitização antes de continuar.
- O botão de lobby continua existindo apenas como ação manual, não como destino automático de falha.
