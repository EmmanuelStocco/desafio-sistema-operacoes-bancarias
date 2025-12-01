export interface LoginRequest {
  username: string;
  pass: string;
}

export interface LoginResponse {
  token: string;
}

export interface BalanceResponse {
  balance: number;
}

export interface DepositRequest {
  type: 'deposit';
  destination: string;
  amount: number;
}

export interface WithdrawRequest {
  type: 'withdraw';
  origin: string;
  amount: number;
}

export interface TransferRequest {
  type: 'transfer';
  origin: string;
  destination: string;
  amount: number;
}

export type EventRequest = DepositRequest | WithdrawRequest | TransferRequest;

export interface DepositResponse {
  destination: {
    id: string;
    balance: number;
  };
}

export interface WithdrawResponse {
  origin: {
    id: string;
    balance: number;
  };
}

export interface TransferResponse {
  origin: {
    id: string;
    balance: number;
  };
  destination: {
    id: string;
    balance: number;
  };
}

export type EventResponse = DepositResponse | WithdrawResponse | TransferResponse;

export interface ErrorResponse {
  error: string;
}

export interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  originAccountId: string | null;
  destinationAccountId: string | null;
  createdAt: Date;
}

export interface TransactionsResponse {
  transactions: Transaction[];
}

