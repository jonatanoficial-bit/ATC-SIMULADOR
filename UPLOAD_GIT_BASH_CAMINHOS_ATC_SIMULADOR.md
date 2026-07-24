# CONTEXTO DE UPLOAD — ATC Simulador / Skyward Control

Use este documento se esta build for aberta em uma nova conversa do ChatGPT e o usuário pedir ajuda para fazer upload no Git Bash.

## Projeto

- Nome do projeto: ATC Simulador / Skyward Control
- Pasta local no Windows:
  `<PROJECT_ROOT>`
- Caminho equivalente no Git Bash:
  `<PROJECT_ROOT>`
- Repositório GitHub:
  `https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git`

## Prompt pronto para colar em outra conversa

Estou continuando o projeto **ATC Simulador / Skyward Control**. Quando eu pedir ajuda para upload via Git Bash, use exatamente estes caminhos:

- Pasta local Windows: `<PROJECT_ROOT>`
- Caminho no Git Bash: `<PROJECT_ROOT>`
- Repositório GitHub: `https://github.com/jonatanoficial-bit/ATC-SIMULADOR.git`

Comandos-base:

```bash
cd "<PROJECT_ROOT>"
git status
git add .
git commit -m "Build Skyward Control"
git push -u origin main
```

Se estiver em estado `MERGING`, orientar primeiro:

```bash
git merge --abort
```

Se o GitHub já tiver histórico e eu quiser sobrescrever com a build atual, usar:

```bash
git push -u origin main --force
```

Importante: a pasta tem espaço e caractere especial `¨2026`, então sempre usar aspas no `cd`.
