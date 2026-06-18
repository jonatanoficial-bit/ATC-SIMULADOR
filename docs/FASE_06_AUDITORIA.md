# Fase 06 — Auditoria técnica

A Fase 06 introduz persistência transacional sem alterar as regras de gameplay. A auditoria cobre hashing SHA-256, serialização canônica, revisões, backup, journal, quarentena, migração, corrupção intencional, perfil e regressões responsivas.

Critérios bloqueadores:

- nenhum save inválido pode substituir um backup válido;
- schema futuro não pode ser carregado silenciosamente;
- journal pendente deve terminar em commit confirmado ou rollback;
- migração precisa terminar em payload schema 3 validado;
- APIs destrutivas só podem executar com `SKYWARD_QA_MODE`;
- nenhum erro de console ou exceção de página é permitido.
