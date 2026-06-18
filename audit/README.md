# Evidências de Auditoria

## Fase 05

- `PHASE5_UNIT_TESTS.json`: 70/70 testes unitários aprovados.
- `PHASE5_BROWSER_TESTS.json`: 67/67 cenários integrados aprovados.
- `PHASE5_*png`: evidências de desktop, tablet, celular horizontal, celular vertical e cenário operacional.
- Soak determinístico: 900 passos, contratos de aeronaves e solicitações preservados.
- Zero erro de console e zero exceção de página.

O ambiente bloqueia navegação para URLs locais por política administrativa. O Chromium recebeu em memória o HTML, CSS, metadados e JavaScript exatos da build, com `localStorage` e respostas JSON controladas. A existência e integridade dos arquivos reais continuam verificadas pelo validador estático e pelo manifesto SHA-256.

## Fase 04

- `PHASE4_BROWSER_AUDIT.json`: resultados completos por resolução.
- `PHASE4_BROWSER_AUDIT_SUMMARY.md`: resumo de 19/19 verificações aprovadas.
- `PHASE4_mobile_profile.png`: evidência de rolagem em celular horizontal.
- `PHASE4_mobile_game.png`: radar preservado e painel único.
- `PHASE4_mobile_portrait.png`: proteção de orientação durante o turno.
- `PHASE4_tablet.png`: execução em tablet.
- `PHASE4_desktop.png`: execução em PC.

O ambiente bloqueia URLs locais por política administrativa. O ensaio carregou em memória o HTML, CSS, metadados e JavaScript exatos da build, fornecendo apenas `localStorage` e respostas JSON controladas pelo harness. Arquivos, assets e hashes reais são verificados separadamente pelas auditorias estáticas e pelo manifesto SHA-256.

## Fase 03

- `PHASE3_BROWSER_AUDIT.json`: métricas completas da arquitetura e das quatro resoluções.
- `PHASE3_BROWSER_AUDIT_SUMMARY.md`: resumo de 15/15 verificações aprovadas.
- `PHASE3_mobile_profile.png`: evidência de rolagem do perfil.
- `PHASE3_mobile_game.png`: radar e painel único no celular horizontal.
- `PHASE3_mobile_portrait_guard.png`: proteção de orientação durante o turno.
- `PHASE3_tablet.png`: execução em tablet.
- `PHASE3_desktop.png`: execução em PC.

A Fase 03 usa o mesmo harness em memória da Fase 02, com neutralização apenas de URLs de assets e APIs bloqueadas pelo ambiente. A lógica modular, o layout, os metadados e os autotestes são os arquivos reais da build. Assets e JSONs reais são verificados pelo validador estático e pelo manifesto SHA-256.

## Fase 02

- `PHASE2_STATIC_AUDIT.txt`: validação estática, regressões e guardas do pipeline.
- `PHASE2_BROWSER_AUDIT.json`: métricas e resultados do runtime em Chromium.
- `PHASE2_BROWSER_AUDIT_CONSOLE.txt`: exceções e mensagens de console.
- `PHASE2_BROWSER_AUDIT_RUN.txt`: saída integral do ensaio de navegador.
- `evidence/f02_*`: capturas de celular, tablet e PC.

O ambiente de auditoria bloqueia navegação local do Chromium por política administrativa. Por isso, o ensaio de runtime da Fase 2 carregou em memória o HTML, CSS e JavaScript exatos do pacote, com `localStorage` e JSON local controlados pelo harness. A existência de todos os arquivos e assets referenciados foi verificada separadamente pelo validador estático e pelo manifesto SHA-256.

## Fase 01

As evidências `PHASE1_*` e as capturas sem prefixo `f02_` foram preservadas para regressão histórica.
