# Pipeline de Release — Skyward Control

## Objetivo

A Fase 2 elimina a manutenção manual de números de versão. `config/release.json` é a única fonte oficial de identidade da build. O pipeline gera os arquivos consumidos pelo jogo e interrompe a liberação ao detectar inconsistências.

## Arquivos gerados automaticamente

- `build-info.js`: metadados usados em runtime.
- `release-metadata.json`: metadados estruturados da release.
- `version.txt`: identificação legível.
- `RELEASE.txt`: selo resumido da build.
- `BUILD_NOTES.md`: instruções e identificação.
- `BUILD_HISTORY.json`: histórico de builds.
- `MANIFEST_SHA256.txt`: integridade de todos os arquivos do pacote.
- `<build>.zip.sha256`: checksum externo do arquivo ZIP.
- `<build>.zip.metadata.json`: metadados e checksum do pacote.

## Gerar uma nova build

Requer Node.js 20 ou superior e o utilitário `zip`.

```bash
npm run release -- \
  --version 1.2.0 \
  --phase F02 \
  --phase-name "Pipeline Profissional de Build e Versionamento" \
  --channel alpha \
  --package
```

Para empacotar novamente uma build já carimbada e auditada, sem alterar seu identificador:

```bash
npm run release -- --reuse-stamp --package
```

Para escolher a pasta de saída:

```bash
npm run release -- --package --output /caminho/da/saida
```

## Portões anti-quebra

Antes de empacotar, o pipeline verifica:

1. Arquivos obrigatórios.
2. Validade do `config/release.json`.
3. Padrão SemVer e padrão oficial da fase.
4. Sintaxe de `main.js` e `build-info.js`.
5. Validade dos JSONs.
6. Consistência entre configuração, runtime e documentos.
7. Existência de recursos referenciados por HTML e CSS.
8. Regressões funcionais da Fase 1.
9. Testes específicos da Fase 2.
10. Manifesto SHA-256 do pacote final.

Qualquer reprovação encerra o processo com código de erro e nenhum ZIP é aprovado.

## Validar um pacote extraído

```bash
npm run validate
npm run test:regression
npm run test:phase2
npm run verify:integrity
```

## Política de metadados

Nunca editar manualmente os arquivos gerados. Para alterar versão, fase, canal ou schema, execute novamente o pipeline com os argumentos correspondentes. Builds sem `build-info.js` válido entram em modo seguro no carregamento.
