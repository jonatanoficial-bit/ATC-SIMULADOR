# Fase 13 — Grafo realista de aeroportos

A Fase 13 introduz um **grafo operacional de superfície** com foco em realism​o visual e procedimental.

## Entregas principais

- catálogo `data/airport-graphs.json` com aeroportos SBGR, SBSP, SBKP, SBBR e KATL;
- representação de **pistas ativas e secundárias**;
- rede de **taxiways** desenhada no radar operacional;
- **gates/stands** explícitos por aeroporto;
- **holding points** e **line-up points** por pista ativa;
- rotas de **pushback**, **taxi**, **line up** e **vacate runway** integradas à simulação.

## Impacto no gameplay

- saídas agora nascem em gates reais do grafo;
- autorização de táxi usa o caminho do grafo até o ponto de espera;
- pousos vacam a pista por uma rota de taxiway antes de sumirem do cenário;
- o board AIRPORT OPS exibe volume de gates, taxiways e holding points do aeroporto carregado.
