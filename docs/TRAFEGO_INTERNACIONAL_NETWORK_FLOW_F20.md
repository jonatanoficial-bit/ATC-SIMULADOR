# Fase 20 — Tráfego Internacional Avançado e Network Flow

A Fase 20 adiciona uma camada de coordenação entre aeroportos e fluxo internacional.

## Sistemas adicionados

- hubs e capacidade por hora;
- rotas internacionais e domésticas;
- pressão de slots;
- políticas CTOT, EDCT, GDP e Miles-in-Trail;
- bancos de conexão;
- alternados por baixa visibilidade, pista fechada ou saturação de rede;
- atraso de rede;
- compliance de slot;
- impacto econômico e operacional;
- painel `NETWORK FLOW`.

## Impacto no gameplay

Ao finalizar o turno, a build calcula:

- rota de rede mais relevante;
- política de slot aplicada;
- atraso de rede estimado;
- compliance de slot;
- conexões protegidas e perdidas;
- alternados acionados;
- pontuação de coordenação;
- impacto econômico da coordenação.

## Documento de upload

O documento `UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md` continua preservado na raiz e em `docs/`.
