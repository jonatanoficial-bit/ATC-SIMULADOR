# Fase 21 — Control Room, Ranking Local e Replay Compartilhável

A Fase 21 adiciona multiplayer assíncrono/local sem servidor.

## Sistemas adicionados

- salas locais de controle;
- ranking operacional local;
- tiers de controlador;
- snapshot de turno;
- replay compartilhável por código;
- importação de replay;
- comparação entre turnos;
- métricas de desempenho;
- painel `CONTROL ROOM`.

## Impacto no gameplay

Ao finalizar o turno, a build calcula e armazena:

- replay compartilhável;
- ranking local;
- tier do controlador;
- snapshot operacional;
- comparação futura com outro turno;
- histórico offline.

## Documento de upload

O documento `UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md` continua preservado na raiz e em `docs/`.
