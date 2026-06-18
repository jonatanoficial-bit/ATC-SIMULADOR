# Auditoria — Fase 07

A fase é aprovada somente quando manifesto, Service Worker, cache e SHA-256 correspondem à mesma build.

## Evidências automatizadas

1. **Ciclo isolado do Service Worker:** o arquivo real `service-worker.js` é executado em um ambiente automatizado que fornece Cache Storage, rede e eventos equivalentes. O ensaio valida instalação, precache, ativação, limpeza seletiva de caches antigos, `GET_VERSION`, atualização autorizada por `SKIP_WAITING`, cache-first, navegação offline com retorno do app shell e resposta controlada 503.
2. **Chromium:** a interface real do jogo é carregada nas quatro resoluções oficiais com APIs PWA controladas. O ensaio valida registro, painel, status online/offline, fullscreen, acesso aos dados operacionais, responsividade e ausência de erros de console ou página.
3. **Integridade estática:** cada recurso do precache é comparado ao SHA-256 e ao tamanho registrado.

## Limitação do ambiente de auditoria

A política administrativa do Chromium deste ambiente bloqueia navegações locais e sintéticas, impedindo registrar um Service Worker por uma URL HTTPS/localhost durante esta execução. Por isso, o ciclo do worker e a interface Chromium são testados em camadas separadas, sem afirmar que houve instalação real no dispositivo. Antes de publicação em loja, a homologação deve incluir um smoke test em domínio HTTPS ou aparelho físico: instalar, abrir offline, atualizar com um turno salvo e confirmar fullscreen.

Falhas de instalação ou fullscreen impostas pelo navegador não podem travar o simulador. Atualizações pendentes não podem ativar durante um turno sem autorização e snapshot.
