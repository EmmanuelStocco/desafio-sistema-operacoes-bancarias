# Sistema Bancário - Processo Seletivo

Sistema bancário completo com API REST em Node.js e frontend em Next.js para simular operações bancárias básicas.

## 🚀 Como Iniciar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- Portas `3000`, `3001` e `5433` disponíveis

### Passo a Passo

1. **Clone o repositório** (se aplicável)

2. **Na raiz do projeto, execute:**

```bash
docker-compose up --build
```

3. **Aguarde a inicialização** (pode levar alguns minutos na primeira vez)

4. **Acesse o sistema:**

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000
- **PostgreSQL:** localhost:5433

### Credenciais de Acesso

- **Usuário:** `admin`
- **Senha:** `admin`

## 📁 Estrutura do Projeto

```
.
├── backend/          # API REST (Node.js + Express + TypeScript)
├── frontend/         # Interface Web (Next.js + React + Tailwind)
└── docker-compose.yml # Orquestração Docker
```

## 🎯 Funcionalidades Implementadas

### API Backend

- ✅ Autenticação JWT
- ✅ Consulta de saldo
- ✅ Depósito (cria conta se não existir)
- ✅ Saque (com validação de saldo)
- ✅ Transferência entre contas
- ✅ Reset do sistema
- ✅ Histórico de transações

### Frontend

- ✅ Tela de login
- ✅ Dashboard com todas as operações
- ✅ Consulta de saldo
- ✅ Depósito, saque e transferência
- ✅ Histórico de transações
- ✅ Mensagens de erro/sucesso
- ✅ Logout

## 🔧 Tecnologias Utilizadas

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL + TypeORM
- JWT para autenticação

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS

## 📚 Documentação Adicional

- **Backend:** Veja [backend/README.md](./backend/README.md) para detalhes da API
- **Frontend:** Veja [frontend/README.md](./frontend/README.md) para detalhes da interface

## 🛠️ Comandos Úteis

### Parar os containers:
```bash
docker-compose down
```

### Ver logs:
```bash
docker-compose logs -f
```

### Reconstruir tudo:
```bash
docker-compose up --build --force-recreate
```

## 🧪 Testando o Sistema

1. Acesse http://localhost:3001
2. Faça login com `admin` / `admin`
3. No dashboard:
   - Crie uma conta fazendo um depósito (ex: conta `100` com valor `10`)
   - Consulte o saldo
   - Faça saques e transferências
   - Veja o histórico de transações

## 📝 Notas Importantes

- O banco de dados é criado automaticamente na primeira execução
- Todas as operações são persistidas no PostgreSQL
- O token JWT expira em 24 horas
- Use o botão "Resetar Sistema" para limpar todos os dados

## ✅ Requisitos Atendidos

Todos os requisitos do desafio foram implementados:
- ✅ Autenticação (login, 401, 403)
- ✅ Reset do sistema
- ✅ Consulta de saldo (404, 200)
- ✅ Depósito (cria conta, deposita em existente)
- ✅ Saque (404, 201, 400 saldo insuficiente)
- ✅ Transferência (201, 404, 400 saldo insuficiente)
- ✅ Frontend completo (opcional)
- ✅ Organização e separação de responsabilidades
- ✅ Tratamento adequado de erros

---

**Desenvolvido para processo seletivo**
