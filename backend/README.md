# Backend - API Bancária

API REST desenvolvida em Node.js com Express e TypeScript para simular operações bancárias básicas.

## 🚀 Tecnologias

- **Node.js** com **Express**
- **TypeScript**
- **PostgreSQL** (via Docker)
- **TypeORM** para ORM
- **JWT** para autenticação
- **CORS** para comunicação com frontend

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=banking_user
DB_PASSWORD=banking_pass
DB_DATABASE=banking_db

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

PORT=3000
NODE_ENV=development

ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

3. Execute o servidor em modo desenvolvimento:

```bash
npm run dev
```

Ou compile e execute em produção:

```bash
npm run build
npm start
```

## 📚 Estrutura do Projeto

```
src/
├── config/          # Configurações (banco de dados)
├── controllers/     # Controladores (lógica de requisições)
├── middleware/      # Middlewares (autenticação, tratamento de erros)
├── models/          # Modelos de dados (TypeORM entities)
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript
└── utils/           # Utilitários (JWT, etc.)
```

## 🔐 Endpoints

### 1. Autenticação

#### POST /login
Autentica o usuário e retorna um token JWT.

**Body:**
```json
{
  "username": "admin",
  "pass": "admin"
}
```

**Resposta (200 OK):**
```json
{
  "token": "<jwt_token>"
}
```

**Resposta (403 Forbidden):** Credenciais inválidas

### 2. Consultar Saldo

#### GET /balance?account_id=100
Consulta o saldo de uma conta.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Resposta (200 OK):**
```json
{
  "balance": 20
}
```

**Resposta (404 Not Found):** Conta inexistente
**Resposta (401 Unauthorized):** Token inválido ou ausente

### 3. Operações (Depósito, Saque, Transferência)

#### POST /event
Realiza operações bancárias (depósito, saque ou transferência).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Depósito:**
```json
{
  "type": "deposit",
  "destination": "100",
  "amount": 10
}
```

**Saque:**
```json
{
  "type": "withdraw",
  "origin": "100",
  "amount": 5
}
```

**Transferência:**
```json
{
  "type": "transfer",
  "origin": "100",
  "destination": "300",
  "amount": 15
}
```

### 4. Resetar Estado

#### POST /reset
Reseta todo o estado do sistema (apaga todas as contas e transações).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Resposta (200 OK):**
```
OK
```

### 5. Histórico de Transações

#### GET /transactions?account_id=100
Retorna o histórico de transações de uma conta.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

## 🔒 Segurança

- Autenticação via JWT
- Validação de saldo antes de saques e transferências
- Tratamento adequado de erros
- Validação de dados de entrada
- CORS configurado para comunicação frontend/backend

