import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface LoginRequest {
  username: string
  pass: string
}

export interface LoginResponse {
  token: string
}

export interface BalanceResponse {
  balance: number
}

export interface DepositRequest {
  type: 'deposit'
  destination: string
  amount: number
}

export interface WithdrawRequest {
  type: 'withdraw'
  origin: string
  amount: number
}

export interface TransferRequest {
  type: 'transfer'
  origin: string
  destination: string
  amount: number
}

export interface DepositResponse {
  destination: {
    id: string
    balance: number
  }
}

export interface WithdrawResponse {
  origin: {
    id: string
    balance: number
  }
}

export interface TransferResponse {
  origin: {
    id: string
    balance: number
  }
  destination: {
    id: string
    balance: number
  }
}

export interface Transaction {
  id: number
  type: 'deposit' | 'withdraw' | 'transfer'
  amount: number
  originAccountId: string | null
  destinationAccountId: string | null
  createdAt: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
}

export const authAPI = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data)
    return response.data
  },
}

export const accountAPI = {
  getBalance: async (accountId: string): Promise<BalanceResponse> => {
    const response = await api.get<BalanceResponse>(`/balance?account_id=${accountId}`)
    return response.data
  },
  deposit: async (data: DepositRequest): Promise<DepositResponse> => {
    const response = await api.post<DepositResponse>('/event', data)
    return response.data
  },
  withdraw: async (data: WithdrawRequest): Promise<WithdrawResponse> => {
    const response = await api.post<WithdrawResponse>('/event', data)
    return response.data
  },
  transfer: async (data: TransferRequest): Promise<TransferResponse> => {
    const response = await api.post<TransferResponse>('/event', data)
    return response.data
  },
  reset: async (): Promise<void> => {
    await api.post('/reset')
  },
  getTransactions: async (accountId: string): Promise<TransactionsResponse> => {
    const response = await api.get<TransactionsResponse>(`/transactions?account_id=${accountId}`)
    return response.data
  },
}

