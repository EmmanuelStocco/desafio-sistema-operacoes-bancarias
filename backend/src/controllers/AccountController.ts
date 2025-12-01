import { Response } from 'express';
import { AccountService } from '../services/AccountService';
import { AuthRequest } from '../middleware/auth';
import {
  BalanceResponse,
  EventRequest,
  DepositResponse,
  WithdrawResponse,
  TransferResponse,
  ErrorResponse,
  TransactionsResponse,
} from '../types';

export class AccountController {
  private accountService = new AccountService();

  async getBalance(req: AuthRequest, res: Response<BalanceResponse | ErrorResponse>) {
    try {
      const accountId = req.query.account_id as string;

      if (!accountId) {
        return res.status(400).json({ error: 'account_id is required' });
      }

      const balance = await this.accountService.getBalance(accountId);
      return res.status(200).json({ balance });
    } catch (error: any) {
      if (error.message === 'Account not found') {
        return res.status(404).json({ error: 'Not Found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async handleEvent(req: AuthRequest, res: Response<DepositResponse | WithdrawResponse | TransferResponse | ErrorResponse>) {
    try {
      const event = req.body as EventRequest;

      if (!event.type || !event.amount) {
        return res.status(400).json({ error: 'Invalid event data' });
      }

      switch (event.type) {
        case 'deposit': {
          const account = await this.accountService.deposit(event.destination, event.amount);
          return res.status(201).json({
            destination: {
              id: account.id,
              balance: parseFloat(account.balance.toString()),
            },
          });
        }

        case 'withdraw': {
          try {
            const account = await this.accountService.withdraw(event.origin, event.amount);
            return res.status(201).json({
              origin: {
                id: account.id,
                balance: parseFloat(account.balance.toString()),
              },
            });
          } catch (error: any) {
            if (error.message === 'Account not found') {
              return res.status(404).json({ error: 'Not Found' });
            }
            if (error.message === 'Insufficient funds') {
              return res.status(400).json({ error: 'Insufficient funds' });
            }
            throw error;
          }
        }

        case 'transfer': {
          try {
            const { origin, destination } = await this.accountService.transfer(
              event.origin,
              event.destination,
              event.amount
            );
            return res.status(201).json({
              origin: {
                id: origin.id,
                balance: parseFloat(origin.balance.toString()),
              },
              destination: {
                id: destination.id,
                balance: parseFloat(destination.balance.toString()),
              },
            });
          } catch (error: any) {
            if (error.message === 'Account not found') {
              return res.status(404).json({ error: 'Not Found' });
            }
            if (error.message === 'Insufficient funds') {
              return res.status(400).json({ error: 'Insufficient funds' });
            }
            throw error;
          }
        }

        default:
          return res.status(400).json({ error: 'Invalid event type' });
      }
    } catch (error: any) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async reset(req: AuthRequest, res: Response) {
    try {
      await this.accountService.reset();
      return res.status(200).send('OK');
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getTransactions(req: AuthRequest, res: Response<TransactionsResponse | ErrorResponse>) {
    try {
      const accountId = req.query.account_id as string;

      if (!accountId) {
        return res.status(400).json({ error: 'account_id is required' });
      }

      const transactions = await this.accountService.getTransactions(accountId);
      return res.status(200).json({ transactions });
    } catch (error: any) {
      if (error.message === 'Account not found') {
        return res.status(404).json({ error: 'Not Found' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

