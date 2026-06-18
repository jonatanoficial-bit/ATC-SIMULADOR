# Fase 18 — Economia Operacional

A Fase 18 adiciona a camada econômica do aeroporto.

## Sistemas adicionados

- orçamento operacional por aeroporto;
- receita por movimento;
- receita de serviços;
- custo por minuto de atraso;
- multas por conflitos e runway incursion;
- contratos SLA com companhias aéreas;
- bônus e penalidades contratuais;
- eficiência econômica do turno;
- histórico econômico persistente.

## Impacto no gameplay

Ao terminar um turno, a build calcula:

- receita operacional;
- custo operacional;
- multas;
- custo de atraso;
- bônus ou penalidades de contratos;
- lucro/prejuízo do turno;
- saldo acumulado;
- eficiência econômica.

## Documento de upload

O documento `UPLOAD_GIT_BASH_CAMINHOS_ATC_SIMULADOR.md` continua preservado na raiz e em `docs/`.
