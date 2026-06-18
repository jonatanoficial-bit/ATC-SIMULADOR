# Fase 05 — Estratégia de testes automatizados

## Objetivo

A Fase 05 transforma a validação do Skyward Control em um quality gate reproduzível. Nenhuma release oficial pode ser empacotada quando uma regra matemática, cenário operacional, contrato de dados, regressão mobile ou teste prolongado falha.

## Camadas

### 1. Núcleo determinístico

`src/runtime/00-quality-kernel.js` contém regras puras realmente utilizadas pelo jogo:

- normalização de heading;
- menor curva angular;
- distância e bearing;
- clamp e interpolação;
- prioridade da fila ATC;
- separação por wake turbulence.

O mesmo arquivo é executado isoladamente pelos testes Node. Isso evita testar uma cópia diferente da lógica de produção.

### 2. Testes unitários

`tests/phase5-unit-tests.mjs` usa apenas APIs nativas do Node e cobre casos normais, limites, valores negativos, wrap de 360 graus, prioridade por idade e multiplicadores meteorológicos.

### 3. Cenários integrados em Chromium

`tests/phase5-browser-tests.py` abre a build real por servidor HTTP e testa:

- carregamento dos assets e scripts;
- início de turno;
- unicidade de callsigns;
- pouso, pushback, táxi, line up, decolagem e emergência;
- bloqueio de comandos incompatíveis;
- proteção de pista;
- vetoração, velocidade, altitude e espera;
- fila prioritária;
- previsão de conflitos;
- wake turbulence;
- snapshot e restauração;
- saneamento de estado inválido;
- soak determinístico;
- celular, tablet e PC.

### 4. Bridge QA protegido

`window.SKYWARD_TEST_API` permite cenários integrados somente quando `window.SKYWARD_QA_MODE=true` antes do boot ou quando a URL usa `?qa=1`. Em gameplay normal, métodos mutáveis lançam erro. A leitura de diagnóstico permanece disponível.

## Comandos

```bash
npm run test:unit
npm run test:browser
npm run test:phase5
npm test
```

A release oficial executa todas as camadas antes de criar o manifesto e o ZIP.
