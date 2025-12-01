# Sistema Bancário Completo

Sistema bancário completo com API REST em Node.js e frontend em Next.js para simular operações bancárias básicas.

## 📁 Estrutura do Projeto

```
.
├── backend/          # API REST (Node.js + Express + TypeScript)
├── frontend/         # Interface Web (Next.js + React + Tailwind)
└── docker-compose.yml # Orquestração Docker
```

Cada diretório possui seu próprio README com instruções detalhadas.

## 🚀 Tecnologias

### Backend
- **Node.js** com **Express**
- **TypeScript**
- **PostgreSQL** (via Docker)
- **TypeORM** para ORM
- **JWT** para autenticação
- **CORS** para comunicação com frontend

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Axios** para requisições HTTP

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- npm ou yarn

## 🚀 Início Rápido com Docker

A forma mais fácil de executar o projeto é usando Docker Compose na raiz do projeto:

```bash
docker-compose up --build
```

Isso irá subir:
- **PostgreSQL** na porta `5433`
- **Backend API** na porta `3000`
- **Frontend** na porta `3001`

Acesse o frontend em: http://localhost:3001

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin`

## 🔧 Instalação Manual

Para instalação manual de cada parte, consulte os READMEs específicos:

- **Backend:** Veja [backend/README.md](./backend/README.md)
- **Frontend:** Veja [frontend/README.md](./frontend/README.md)

## 📚 Estrutura do Projeto

```
.
├── backend/                 # API REST
│   ├── src/
│   │   ├── config/         # Configurações (banco de dados)
│   │   ├── controllers/    # Controladores (lógica de requisições)
│   │   ├── middleware/     # Middlewares (autenticação, tratamento de erros)
│   │   ├── models/         # Modelos de dados (TypeORM entities)
│   │   ├── routes/         # Definição de rotas
│   │   ├── services/       # Lógica de negócio
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários (JWT, etc.)
│   ├── Dockerfile
│   └── package.json
├── frontend/                # Interface Web
│   ├── app/                # Páginas e componentes
│   │   ├── login/         # Tela de login
│   │   ├── dashboard/     # Dashboard principal
│   │   └── globals.css    # Estilos globais
│   ├── lib/                # Utilitários e API client
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml       # Orquestração Docker
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

**Resposta (201 Created):**
```json
{
  "destination": {
    "id": "100",
    "balance": 10
  }
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

**Resposta (201 Created):**
```json
{
  "origin": {
    "id": "100",
    "balance": 15
  }
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

**Resposta (201 Created):**
```json
{
  "origin": {
    "id": "100",
    "balance": 0
  },
  "destination": {
    "id": "300",
    "balance": 15
  }
}
```

**Respostas de Erro:**
- **400 Bad Request:** Saldo insuficiente
- **404 Not Found:** Conta inexistente
- **401 Unauthorized:** Token inválido ou ausente

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

**Resposta (200 OK):**
```json
{
  "transactions": [
    {
      "id": 1,
      "type": "deposit",
      "amount": 10,
      "originAccountId": null,
      "destinationAccountId": "100",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Resposta (404 Not Found):** Conta inexistente

## 🧪 Testando a API

Você pode testar a API usando ferramentas como:
- **Postman**
- **Insomnia**
- **curl**
- **Thunder Client** (VS Code)

### Exemplo com curl:

1. **Login:**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","pass":"admin"}'
```

2. **Consultar Saldo:**
```bash
curl -X GET "http://localhost:3000/balance?account_id=100" \
  -H "Authorization: Bearer <seu_token>"
```

3. **Depósito:**
```bash
curl -X POST http://localhost:3000/event \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu_token>" \
  -d '{"type":"deposit","destination":"100","amount":10}'
```

## 📝 Notas

- O banco de dados é criado automaticamente na primeira execução (synchronize: true em desenvolvimento)
- As credenciais padrão são: `admin` / `admin`
- O JWT expira em 24 horas por padrão
- Todas as operações são registradas na tabela de transações

## 🎨 Interface do Usuário

O frontend oferece uma interface completa com:

- **Tela de Login**: Autenticação segura com JWT
- **Dashboard**: 
  - Consulta de saldo por ID de conta
  - Realização de depósitos
  - Realização de saques
  - Transferências entre contas
  - Histórico de transações
  - Botão para resetar o sistema
- **Logout**: Encerramento seguro de sessão
- **Mensagens de Erro**: Feedback visual para operações inválidas

## 🔒 Segurança

- Autenticação via JWT
- Validação de saldo antes de saques e transferências
- Tratamento adequado de erros
- Validação de dados de entrada
- CORS configurado para comunicação frontend/backend

