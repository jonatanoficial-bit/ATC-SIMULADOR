# Build Notes — SC-1.63.0-F63-20260724-0915

## Identificação

- Produto: Skyward Control
- Versão: 1.63.0
- Fase interna: F63 — Commercial Mobile-First Stability Release
- Build: `SC-1.63.0-F63-20260724-0915`
- Data/hora: 2026-07-24 09:15 BRT
- Canal: production
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
npm run release -- --version 1.63.0 --phase F63 --phase-name "Commercial Mobile-First Stability Release" --channel production
```

Para validar uma build já empacotada:

```bash
npm test
npm run verify:integrity
```

## Compatibilidade validada

- Celular horizontal: 844 × 390
- Celular vertical: 390 × 844 nos menus; orientação horizontal durante o turno
- Tablet: 1024 × 768
- PC: 1440 × 900

## Política anti-quebra

A geração é interrompida quando há divergência de metadados, TypeScript inválido, contratos desatualizados, JavaScript inválido, JSON corrompido, referência de asset ausente, arquivo obrigatório faltando, teste unitário reprovado ou regressão comercial reprovada. A validação visual de navegador é documentada em `TESTES-REALIZADOS.md`. O pacote final recebe manifesto SHA-256 interno e checksum externo do ZIP.
