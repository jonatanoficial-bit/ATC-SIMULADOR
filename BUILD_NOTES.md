# Build Notes v0.8.1

Esta build prioriza robustez antes de expansão de gameplay. O jogo possui fallback de dados, captura de erros globais, validação da cena de gameplay e recuperação de estado.

Testes executados no pacote:
- `node --check main.js`
- verificação estática dos IDs essenciais no HTML
- verificação de arquivos obrigatórios
- validação JSON de `data/airports.json` e `data/aircraft.json`
