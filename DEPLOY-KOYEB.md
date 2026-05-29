# Deploy no Koyeb

Este projeto pode ser publicado no Koyeb como uma aplicacao Node.js simples.

## 1. Enviar o projeto para o GitHub

Na raiz do projeto:

```bash
git init
git add .
git commit -m "Primeira versao multiplayer"
```

Depois crie um repositorio no GitHub e conecte:

```bash
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cidade-2d-explorer.git
git push -u origin main
```

## 2. Criar o app no Koyeb

1. Acesse `https://app.koyeb.com`.
2. Clique em `Create App`.
3. Escolha `GitHub`.
4. Autorize o Koyeb a acessar seu GitHub, se ele pedir.
5. Selecione o repositorio `cidade-2d-explorer`.
6. Branch: `main`.
7. Builder: deixe como buildpack/automatico.
8. Run command: pode deixar automatico, porque o `package.json` tem:

```bash
npm start
```

9. Service type: `Web Service`.
10. Porta: use a porta detectada automaticamente. O app le `process.env.PORT`.
11. Clique em `Deploy`.

## 3. Acessar

Quando o deploy terminar, o Koyeb mostrara uma URL parecida com:

```text
https://nome-do-app-sua-org.koyeb.app
```

Abra essa URL em dois navegadores/computadores diferentes para testar o multiplayer.

## Observacoes

- O WebSocket usa o mesmo dominio da pagina, em `/ws`.
- Em HTTPS, o navegador usa `wss://.../ws` automaticamente.
- Se o deploy falhar, confira os logs do Service no painel do Koyeb.
