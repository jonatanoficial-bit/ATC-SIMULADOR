# Save Vault Transacional — Fase 06

## Objetivo

Proteger o progresso do Skyward Control contra JSON truncado, adulteração, interrupção durante gravação, schema antigo e falhas de atualização.

## Estrutura

Cada domínio persistente (`snapshot` e `profile`) possui quatro slots independentes no `localStorage`:

- `primary`: versão confirmada mais recente;
- `backup`: última versão válida anterior;
- `journal`: transação preparada ainda não confirmada;
- `quarantine`: cópias inválidas isoladas para diagnóstico.

## Integridade

Cada envelope contém:

- schema do vault;
- schema do save;
- revisão monotônica;
- identificador da transação;
- build de origem;
- hash do payload;
- hash do envelope;
- hash anterior para encadeamento.

Os hashes usam SHA-256 calculado sobre JSON canônico com chaves ordenadas.

## Fluxo de gravação

1. Validar o payload pelo contrato TypeScript.
2. Recuperar eventual journal pendente.
3. Criar envelope e journal `PREPARED`.
4. Copiar o primário anterior para backup.
5. Gravar o novo primário.
6. Ler e validar novamente.
7. Remover o journal somente após confirmação.

Se qualquer etapa falhar, o primário anterior é restaurado.

## Recuperação

- JSON inválido: quarentena e restauração do backup.
- Hash divergente: quarentena e restauração do backup.
- Journal com primário novo confirmado: finalização do commit.
- Journal sem primário novo: rollback para o estado anterior.
- Schema futuro desconhecido: rejeição e uso do backup compatível.

## Migração

O snapshot atual usa schema 3. Saves schema 1 e 2 são convertidos sequencialmente e recebem `saveId`, `sessionId` e cópia validada do perfil. O perfil de carreira usa payload próprio schema 1 e importa automaticamente o antigo `skywardProfile`.

## Compatibilidade

Depois de uma transação bem-sucedida, uma sombra legada é atualizada para permitir retorno temporário a builds antigas. A build atual nunca confia nessa sombra enquanto houver um envelope íntegro no vault.
