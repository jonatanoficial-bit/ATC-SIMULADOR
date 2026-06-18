# Fase 06 — Testes unitários do save vault

- Resultado: **24/24 aprovados**
- Build: `SC-1.12.0-F12-20260618-1138`

## Verificações
- [x] API do vault criada
- [x] schema do vault é 1
- [x] SHA-256 conhecido
- [x] serialização canônica independe da ordem
- [x] hash canônico independe da ordem
- [x] primeira transação é confirmada
- [x] primeiro save ocupa slot primário
- [x] segunda transação incrementa revisão
- [x] segunda transação cria backup
- [x] leitura retorna versão primária mais recente
- [x] JSON corrompido aciona rollback automático
- [x] save corrompido é enviado à quarentena
- [x] rollback restaura slot primário válido
- [x] adulteração do payload é detectada pelo SHA-256
- [x] journal confirmado após commit interrompido
- [x] journal confirmado é removido
- [x] transação preparada incompleta sofre rollback
- [x] envelope antigo é migrado automaticamente
- [x] migração grava envelope no schema atual
- [x] save legado sem envelope é importado
- [x] save legado importado recebe integridade
- [x] schema futuro desconhecido é rejeitado
- [x] payload contratualmente inválido não é gravado
- [x] diagnósticos registram commits e recuperações
