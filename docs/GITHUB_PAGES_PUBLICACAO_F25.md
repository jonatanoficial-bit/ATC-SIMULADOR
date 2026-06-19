# Publicação GitHub Pages — Fase 25

## Caminhos oficiais

- Windows: `C:\Users\jonat\Desktop\GAME\¨2026\ATC 3 NOVO`
- Git Bash: `/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO`
- Repositório: `https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git`

## Comandos

```bash
cd "/c/Users/jonat/Desktop/GAME/¨2026/ATC 3 NOVO"
git merge --abort 2>/dev/null || true
git status
git remote set-url origin https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git
git add .
git commit -m "Build SC-1.25.0-F25-20260619-1508 - Pos Gold Master publicacao"
git push -u origin main --force
git status
```

## GitHub Pages

No GitHub:
1. Abra Settings.
2. Vá em Pages.
3. Source: Deploy from a branch.
4. Branch: `main`.
5. Folder: `/root`.
6. Salve.
7. Teste o link público.
