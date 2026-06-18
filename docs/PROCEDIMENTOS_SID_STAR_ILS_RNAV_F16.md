# Fase 16 — Procedimentos reais SID/STAR, ILS, RNAV, aproximação perdida e holdings

A Fase 16 adiciona uma camada de procedimentos publicados ao Skyward Control.

## Entregas

- novo módulo `src/runtime/19-procedures-sid-star-rnav.js`;
- novo catálogo `data/procedures-f16.json`;
- STARs, SIDs, ILS, RNAV, missed approach e holding patterns;
- procedimentos para SBGR, SBSP e KATL;
- overlay no radar para rotas publicadas;
- integração com vector final, decolagem, hold e go-around;
- validação de mínimos por RVR quando a meteorologia F15 está ativa.

## Documento de upload

Esta build inclui o arquivo `UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md` na raiz do ZIP e também em `docs/`.
Esse documento guarda os caminhos oficiais para upload via Git Bash em nova conversa.
