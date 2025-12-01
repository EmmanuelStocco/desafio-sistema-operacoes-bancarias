# Sistema Bancário - Processo Seletivo

Sistema bancário completo com API REST em Node.js e frontend em Next.js para simular operações bancárias básicas.

## 🚀 Como Iniciar o Projeto

### Pré-requisitos

- **Docker** e **Docker Compose** (para rodar via Docker)
- **Node.js** v18+ e **npm** (para rodar localmente)
- Portas `3000`, `3001` e `5433` disponíveis

### Opção 1: Docker (Recomendado - Mais Fácil)

1. **Clone o repositório**

2. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` se necessário (geralmente não precisa alterar nada).

3. **Execute o Docker Compose:**

```bash
docker-compose up --build
```

4. **Acesse o sistema:**

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:3000

### Opção 2: Local (Desenvolvimento)

1. **Clone o repositório**

2. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` e ajuste:
- `DB_HOST=localhost` (ao invés de `postgres`)
- `NODE_ENV=development`

3. **Inicie o banco de dados:**

```bash
docker-compose up -d postgres
```

4. **Backend:**

```bash
cd backend
npm install
npm run dev
```

5. **Frontend (em outro terminal):**

```bash
cd frontend
npm install
npm run dev
```

6. **Acesse:**

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3000

### Credenciais de Acesso

- **Usuário:** `admin`
- **Senha:** `admin`

## 📁 Estrutura do Projeto

```
.
├── backend/          # API REST (Node.js + Express + TypeScript)
├── frontend/         # Interface Web (Next.js + React + Tailwind)
├── docker-compose.yml # Orquestração Docker
└── .env.example      # Exemplo de variáveis de ambiente
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

## 🛠️ Comandos Úteis

### Docker

**Parar os containers:**
```bash
docker-compose down
```

**Ver logs:**
```bash
docker-compose logs -f
```

**Reconstruir tudo:**
```bash
docker-compose up --build --force-recreate
```

### Local

**Backend:**
```bash
cd backend
npm run dev    # Desenvolvimento
npm run build  # Build
npm start      # Produção
```

**Frontend:**
```bash
cd frontend
npm run dev    # Desenvolvimento
npm run build  # Build
npm start      # Produção
```

## 🧪 Testando o Sistema

1. Acesse o frontend (http://localhost:3001 ou http://localhost:3000 se rodando local)
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
- O arquivo `.env` não deve ser commitado (já está no .gitignore)

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
