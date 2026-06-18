# Fase 10 — Acessibilidade e Configurações Profissionais

Build alvo: `SC-1.10.0-F10`.

## Objetivo

Adicionar uma central profissional de configurações sem alterar a jogabilidade aprovada das fases anteriores. A central permite ajustar leitura, toque, contraste, daltonismo, movimento, áudio, feedback tátil e desempenho.

## Recursos

- Escala de UI: 90%, 100%, 110%, 120% e 130%.
- Contraste normal, alto contraste e modo noite.
- Perfis visuais para protanopia, deuteranopia, tritanopia e monocromático.
- Brilho do radar ajustável.
- Alvos de toque maiores.
- Foco de teclado reforçado.
- Redução de movimentos e efeitos.
- Legendas/readback sempre visíveis.
- Volumes separados para master, rádio e efeitos.
- Vibração/háptico opcional.
- Modo de desempenho automático, bateria e performance.
- Limite visual de 30, 45 ou 60 FPS.
- Perfis de toque mobile padrão, grande e compacto.
- Atalhos F10 e Alt+S.

## Segurança anti-quebra

As preferências passam por saneamento antes de serem aplicadas. Valores fora dos limites voltam para o padrão seguro. As configurações são salvas em `localStorage` com schema próprio e podem ser resetadas pelo usuário.

## Compatibilidade

A central fica disponível no menu, no turno ATC desktop/tablet e no botão móvel de configurações. A interface mobile radar-first da Fase 8 e o workspace da Fase 9 permanecem preservados.
