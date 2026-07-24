# Testes realizados

Build: `SC-1.63.0-F63-20260724-0915`

Data: 24/07/2026

## Resultado consolidado

- Validação estrutural: **223/223 aprovada**.
- Suítes da regressão atual: **61/61 aprovadas**.
- Regressão comercial: **20/20 verificações aprovadas**.
- TypeScript strict: **aprovado**.
- Sintaxe do bundle e dos 71 módulos: **aprovada**.
- Console do navegador no fluxo auditado: **0 erros e 0 avisos**.

Os relatórios estruturados estão em:

- `audit/CURRENT_RELEASE_TESTS.json`;
- `audit/COMMERCIAL_RELEASE_REGRESSION.json`.

## Fluxo funcional no navegador

Executado no build real servido por HTTP:

1. carregamento da tela inicial;
2. entrada no menu;
3. criação e gravação de perfil;
4. abertura do lobby;
5. início de turno;
6. orientação de rotação no modo retrato;
7. turno completo em modo paisagem;
8. verificação da versão pública;
9. verificação de ausência dos painéis administrativos;
10. inspeção do console.

Resultado: **aprovado**.

## Matriz responsiva

### Telas iniciais e perfil

- 320 × 568;
- 360 × 800;
- 390 × 844;
- 430 × 932;
- 768 × 1024;
- 1024 × 768;
- 1440 × 900;
- 1920 × 1080.

Em todas as resoluções: sem overflow horizontal. No perfil mobile, campos,
selects e botões permaneceram dentro do card.

### Turno ATC

- 844 × 390: paisagem mobile, sem overflow e touch mínimo de 44 px;
- 768 × 1024: orientação de rotação exibida;
- 1024 × 768: tablet paisagem;
- 1280 × 800: notebook;
- 1440 × 900: desktop;
- 1920 × 1080: desktop amplo.

O radar ocupou toda a largura lógica disponível em todas as resoluções de
paisagem, sem painéis internos visíveis.

## PWA e build

- 70 arquivos versionados no cache;
- manifesto válido;
- service worker sincronizado com a build;
- referências de assets verificadas;
- bundle runtime e manifesto de módulos sincronizados;
- contratos TypeScript regenerados e comparados.

## Reproduzir

```bash
npm install
npm test
```

Para repetir apenas a regressão consolidada:

```bash
npm run test:current
```
