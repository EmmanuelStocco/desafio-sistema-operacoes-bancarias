# Frontend - Banking App

Interface web desenvolvida em Next.js com React e Tailwind CSS para o sistema bancário.

## 🚀 Tecnologias

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Axios** para requisições HTTP

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure a URL da API:

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em http://localhost:3000

## 📚 Estrutura do Projeto

```
app/
├── login/           # Tela de login
├── dashboard/       # Dashboard principal
└── globals.css      # Estilos globais
lib/
└── api.ts           # Cliente API e tipos
```

## 🎨 Funcionalidades

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

## 🏗️ Build para Produção

```bash
npm run build
npm start
```

## 📝 Notas

- O frontend se comunica com a API através de requisições HTTP
- O token JWT é armazenado no localStorage
- Mensagens de erro são exibidas para feedback do usuário

