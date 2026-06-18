# Auditoria Técnica — Fase 02

## Escopo

Implementar um pipeline profissional e reproduzível para identificação, validação e empacotamento das builds do Skyward Control, sem alterar a jogabilidade aprovada na Fase 1.

## Controles implementados

### Fonte única

`config/release.json` passou a controlar produto, versão, fase, nome da fase, canal, schema de save, alvo, data/hora e identificador da build. O jogo recebe esses dados por `build-info.js`, carregado antes de `main.js`.

### Prevenção de divergência

O HTML não contém mais uma versão comercial fixa. Versão, fase, data e identificador são preenchidos em runtime. O validador compara configuração, metadados JSON, arquivo runtime, `package.json`, documentos de release e padrão do identificador.

### Integridade

O pacote final contém `MANIFEST_SHA256.txt`, cobrindo todos os arquivos, exceto o próprio manifesto. O ZIP recebe checksum externo e arquivo JSON de metadados.

### Compatibilidade de save

A chave do snapshot deixou de depender do número da fase e passou a depender do schema: `skywardGoodState_v2`. A Fase 2 migra automaticamente snapshots da chave legada da Fase 1.

### Fail-safe

Caso `build-info.js` esteja ausente, corrompido ou não corresponda ao padrão oficial, o jogo entra no modo seguro e informa que a build precisa ser gerada pelo pipeline.

## Testes exigidos

- Validação estática completa.
- Regressões da Fase 1.
- Auditoria específica da Fase 2.
- Verificação do manifesto no staging.
- Execução real em Chromium nas resoluções 844×390, 390×844, 1024×768 e 1440×900.
- Ausência de exceções de runtime e recursos 404.

## Critério de aprovação

A fase somente é aprovada quando todos os testes automatizados, a auditoria em navegador e a verificação criptográfica do pacote final forem concluídos sem falhas P0 ou P1.
