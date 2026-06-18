# PWA, Offline e Fullscreen — Fase 07

## Objetivo

Transformar o Skyward Control em aplicativo web instalável, mobile-first e capaz de iniciar sem internet após o primeiro carregamento completo.

## Arquitetura

- `manifest.webmanifest`: identidade instalável, orientação horizontal e ícones.
- `service-worker.js`: gerado pelo pipeline para a build atual.
- `pwa-cache-manifest.json`: lista auditável com tamanho e SHA-256 de cada recurso offline.
- `src/runtime/01-pwa-runtime.js`: instalação, rede, fullscreen, atualização e preservação do progresso.
- `tools/build-pwa.mjs`: geração determinística e verificação de sincronização.

## Atualização segura

Uma nova versão é baixada em cache, mas permanece em espera. O Service Worker só recebe `SKIP_WAITING` após autorização do usuário. Antes disso, o runtime pausa o turno, grava o perfil e cria um snapshot transacional.

## Offline

O app shell, dados de aeroportos, catálogo de aeronaves, imagens e ícones são precacheados por build. Navegações usam rede primeiro e retornam ao `index.html` em cache quando a conexão falha. Recursos estáticos usam cache primeiro.

## Fullscreen

O botão de tela cheia está disponível nos menus, painel PWA, proteção de orientação e turno. Dentro do gameplay, o runtime também solicita bloqueio de orientação horizontal quando o navegador permitir.
