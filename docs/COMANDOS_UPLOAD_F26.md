# Comandos de upload — Fase 26

```bash
cd "<PROJECT_ROOT>"
git merge --abort 2>/dev/null || true
git status
git remote set-url origin https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git
git add .
git commit -m "Build SC-1.26.0-F26-20260619-1602 - Healthcheck pos publicacao"
git push -u origin main --force
git status
```
