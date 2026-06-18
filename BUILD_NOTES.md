# Build Notes — SC-1.12.0-F12-20260618-1138

## Identificação

- Produto: Skyward Control
- Versão: 1.12.0
- Fase: F12 — Modelo Realista de Aeronaves
- Build: `SC-1.12.0-F12-20260618-1138`
- Data/hora: 2026-06-18 11:38 BRT
- Canal: alpha
- Save schema: 3
- Contract schema: 2
- Test schema: 3
- Save vault schema: 1
- PWA schema: 1
- Cache schema: 1
- UX schema: 1
- Alvo: Mobile-first / Tablet / Desktop

## Geração reproduzível

A identificação desta build é gerada a partir de `config/release.json`. Não edite `build-info.js`, `release-metadata.json`, `version.txt`, `RELEASE.txt` ou este arquivo manualmente.

Execute:

```bash
npm run release -- --version 1.12.0 --phase F12 --phase-name "Modelo Realista de Aeronaves"
```

Para validar uma build já empacotada:

```bash
npm test
npm run verify:integrity
```

## Compatibilidade mantida

- Celular horizontal: 844 × 390
- Celular vertical: 390 × 844 nos menus; orientação horizontal durante o turno
- Tablet: 1024 × 768
- PC: 1440 × 900

## Política anti-quebra

A geração é interrompida quando há divergência de metadados, TypeScript inválido, contratos desatualizados, JavaScript inválido, JSON corrompido, referência de asset ausente, arquivo obrigatório faltando ou teste unitário reprovado, cenário Chromium reprovado, soak test instável ou teste de regressão reprovado. O pacote final recebe manifesto SHA-256 interno e checksum externo do ZIP.
