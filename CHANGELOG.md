
## SC-1.12.0-F12 — Modelo Realista de Aeronaves

- Adicionado módulo oficial de performance por tipo de aeronave.
- Integrados VREF, wake, aceleração, subida/descida, consumo e risco de pouso ao runtime.
- Criado catálogo auditável `data/aircraft-performance.json`.
- Adicionados testes unitários, Chromium e auditoria F12 ao pipeline.

# 1.9.0 — Fase 09

- Workspace profissional para tablet e desktop com modos Balanceado, Radar e Análise.
- Painéis laterais e dock configuráveis, densidade compacta e larguras persistentes.
- Atalhos de teclado contextuais e ajuda integrada.
- Auditoria responsiva para 1024×768, 1440×900 e 1920×1080.

# Changelog

## 1.8.0 — F08 UX Mobile Definitiva

- Interface radar-first: turno inicia sem painel cobrindo a área operacional.
- Dock móvel com pedidos, tráfego, ações, comunicações e Safety.
- Gestos de borda, fechamento por swipe, alternância de aeronaves, toque longo e duplo toque.
- Alvos de toque, safe areas, feedback háptico opcional e layout adaptativo de tablet.
- Testes automatizados de ergonomia, gestos e quatro resoluções.

## 1.7.0 — Fase 7

- PWA instalável em Android, desktop e plataformas compatíveis.
- Manifesto, ícones 180/192/512 e variante maskable.
- Service Worker com cache versionado por build e modo offline.
- Atualização controlada: nenhuma build substitui o turno sem autorização.
- Snapshot e perfil protegidos antes de aplicar atualização ou ocultar a página.
- Fullscreen profissional com suporte a orientação horizontal durante o turno.
- Indicadores de rede, cache, instalação e atualização.
- Auditoria offline e quality gates F07.

## 1.6.0 — Fase 06

- Save vault transacional com SHA-256, backup, journal e quarentena.
- Snapshot schema 3 com migração automática de schemas 1 e 2.
- Perfil de carreira protegido por rollback transacional.
- Testes de corrupção, adulteração, interrupção e recuperação em Chromium.

## 1.5.0 — F05 — Testes automatizados e quality gates

- Adiciona núcleo determinístico compartilhado entre produção e testes.
- Implementa 70 testes unitários de matemática, heading, prioridade e wake turbulence.
- Implementa 67 cenários integrados no Chromium para clearances, conflitos, snapshots, mobile e soak.
- Adiciona bridge QA protegido; mutações permanecem bloqueadas no jogo normal.
- Introduz test schema 1 nos metadados oficiais da build.
- Eleva a arquitetura modular para geração 5 com 15 módulos.
- Bloqueia a release quando qualquer teste unitário, cenário Chromium ou soak falha.
- Preserva save schema 2, contract schema 1 e a jogabilidade das fases anteriores.

## 1.4.0 — F04 — TypeScript, contratos de dados e validação runtime

- Introduz tipos TypeScript estritos para o domínio ATC.
- Adiciona validadores e sanitizadores reais em runtime.
- Valida metadados, aeroportos, perfil, aeronaves, pedidos, catálogo e snapshots.
- Gera módulo de contratos e manifesto SHA-256 determinísticos.
- Bloqueia releases com erro de tipo ou saída gerada desatualizada.
- Preserva o save schema 2 e a jogabilidade das fases anteriores.

## 1.2.0 — Fase 02 — 17/06/2026

Build gerada automaticamente pelo pipeline de release.

### Adicionado

- Fonte única de metadados em `config/release.json`.
- `build-info.js` gerado para consumo do jogo em runtime.
- Pipeline Node.js sem dependências externas de npm.
- Validação de arquivos obrigatórios, sintaxe JavaScript, JSON e referências de assets.
- Manifesto SHA-256 interno e checksum externo do ZIP.
- Arquivo de metadados do pacote e histórico estruturado de builds.
- Testes específicos da Fase 2 e regressões permanentes da Fase 1.
- Bloqueio seguro para builds sem metadados oficiais.

### Alterado

- A versão deixou de ser escrita manualmente no HTML e no código principal.
- A chave de snapshot agora depende do schema do save, não da fase.
- Snapshots legados da Fase 1 são migrados automaticamente.
- `package.json`, documentos e selos de release são sincronizados pelo pipeline.

### Preservado

- Jogabilidade, clearances, radar, UX mobile e recuperação implementados na Fase 1.

# SKYWARD CONTROL — CHANGELOG

## 1.1.0 — Fase 01 — 17/06/2026

Build: `SC-1.1.0-F01-20260617-1143`

### Mobile e navegação

- Corrigida a rolagem real das telas de menu, perfil, lobby, treinamento, aeroportos e resultado.
- Permitido uso dos menus em retrato e paisagem.
- Bloqueio de orientação horizontal limitado ao turno ATC.
- Implementado modelo de um painel operacional por vez no celular.
- Painéis móveis limitados a aproximadamente 38% da largura em 844 × 390, preservando a área principal do radar.
- Removido o dock mobile legado e impedido vazamento da camada mobile para desktop.

### Sistema antquebra

- Criado snapshot versionado com schema 2.
- Implementada restauração funcional do último estado seguro.
- Separados eventos normais de gameplay de falhas reais.
- Reduzida a criação excessiva de snapshots com intervalo mínimo controlado.
- Incluídos botões de restaurar estado, iniciar novo turno e voltar ao lobby no modo seguro.

### Operação e comandos

- Substituído clearance genérico por ações explícitas de pouso, pushback, táxi, alinhamento, decolagem e emergência.
- Bloqueado comando incompatível com a solicitação ativa.
- Corrigida limpeza da solicitação no strip após atendimento.
- Adicionada prevenção de callsigns duplicados.

### Performance e rastreabilidade

- Interface textual atualizada em frequência controlada; radar continua desenhado a cada frame.
- Unificada a versão mostrada no boot, menu, radar, diagnóstico e arquivos de build.
- Adicionado autoteste interno com 19 verificações.
- Adicionado teste estático independente em `tests/phase1-audit.mjs`.

### Auditoria

- Sintaxe JavaScript validada.
- JSONs validados.
- 19/19 autotestes internos aprovados.
- Testes reais aprovados em celular horizontal, celular vertical e PC.
- Snapshot salvo, estado alterado e restaurado com sucesso.
- Clearance de pouso executado e removido da fila corretamente.

## 1.0.2 — 15/05/2026

- Hotfix anterior de visibilidade da camada mobile e navegação.

## 1.3.0 — Fase 03

### Arquitetura
- Migração do runtime monolítico para 12 módulos-fonte com responsabilidades definidas.
- Geração determinística de `main.js` por `tools/build-runtime.mjs`.
- Manifesto runtime com SHA-256 individual e do bundle.
- Registro arquitetural disponível em `window.SKYWARD_ARCHITECTURE`.

### Anti-quebra
- Edição direta de `main.js` agora bloqueia a validação.
- Sintaxe de cada módulo validada isoladamente.
- Pipeline recompila o runtime antes dos testes e do empacotamento.
- Auditoria F03 verifica ordem, hashes, tamanho e selagem dos módulos.

### Compatibilidade
- Jogabilidade, layout, comandos, saves e funcionamento local da Fase 02 preservados.
- Save schema permanece em 2.
