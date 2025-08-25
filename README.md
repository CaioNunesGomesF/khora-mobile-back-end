<p align="center">  
  <img src="https://user-images.githubusercontent.com/74038190/212284115-f47cd8ff-2ffb-4b04-b5bf-4d1c14c0247f.gif" width="100%" height="4px" alt="Wave GIF">  
</p>  

# ⚡ Projeto Node.js com Firebase - Padrão MVC

> Este repositório documenta o desenvolvimento de uma  
> **API REST em Node.js utilizando Firebase** como banco de dados, seguindo a arquitetura **MVC**.

---

## 🛠️ Tecnologias e Ferramentas

#### 🚀 Back-End
<p align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,express" />
</p>

#### 💾 Banco de Dados
<p align="left">
  <img src="https://skillicons.dev/icons?i=firebase" />
</p>

#### 🧪 Testes
<p align="left">
  <img src="https://skillicons.dev/icons?i=postman" />
</p>

#### 🧰 Ferramentas Auxiliares
<p align="left">
  <img src="https://skillicons.dev/icons?i=vscode,git,npm" />
</p>

#### ☁️ Deploy e Documentação
<p align="left">
  <img src="https://skillicons.dev/icons?i=vercel,swagger" />
</p>

---

## 📂 Estrutura do Projeto (MVC)

```bash
src/
│── app.js               # Configuração principal do Express
│── routes/              # Definição das rotas
│   └── user.routes.js
│── controllers/         # Controladores (lógica das requisições)
│   └── user.controller.js
│── models/              # Modelos (comunicação com o Firebase)
│   └── user.model.js
│── config/              # Configurações (ex: Firebase)
│   └── firebase.js
│── middlewares/         # Middlewares customizados
│── utils/               # Funções auxiliares
```

## 📈 Progresso do Projeto

| Etapa  | Conteúdo | Status          | Data de Conclusão |
|--------|----------|-----------------|-------------------|
| Etapa 1 | Configuração inicial do projeto (Node + Express) | ✅ Concluído | 25/08/2025 |
| Etapa 2 | Integração com Firebase | 🔄 Em andamento | -- |
| Etapa 3 | Implementação de Controllers e Rotas | ⏳ Pendente | -- |
| Etapa 4 | Testes com Postman | ⏳ Pendente | -- |
| Etapa 5 | Deploy e Documentação (Swagger) | ⏳ Pendente | -- |

📅 Atualizado em: **25/08/2025**

---

## ⚙️ Funcionalidades

| Funcionalidade | Descrição | Status |
|----------------|-----------|--------|
| 👤 Criar Usuário | Permite cadastrar um novo usuário no Firebase | ⏳ Em desenvolvimento |
| 📋 Listar Usuários | Retorna todos os usuários cadastrados | ⏳ Pendente |
| 🔍 Buscar Usuário por ID | Retorna os dados de um usuário específico | ⏳ Pendente |
| ✏️ Atualizar Usuário | Permite editar dados de um usuário existente | ⏳ Pendente |
| ❌ Deletar Usuário | Remove um usuário do Firebase | ⏳ Pendente |
| 🔑 Autenticação | Login e proteção de rotas com Firebase Auth | ⏳ Pendente |

---

## ✍️ Notas do Desenvolvimento

- [x] Seguir boas práticas de organização usando **MVC**  
- [x] Utilizar o **Firebase Admin SDK** para autenticação e banco de dados  
- [ ] Criar documentação clara com **Swagger**  
- [ ] Implementar autenticação e middleware de segurança  
