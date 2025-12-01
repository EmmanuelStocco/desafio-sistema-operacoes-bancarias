import { AppDataSource } from '../config/database';
import { Account } from '../models/Account';
import { Transaction, TransactionType } from '../models/Transaction';

export class AccountService {
  private get accountRepository() {
    return AppDataSource.getRepository(Account);
  }

  private get transactionRepository() {
    return AppDataSource.getRepository(Transaction);
  }

  async getAccountById(accountId: string): Promise<Account | null> {
    return await this.accountRepository.findOne({
      where: { id: accountId },
    });
  }

  async getBalance(accountId: string): Promise<number> {
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }
    return parseFloat(account.balance.toString());
  }

  async deposit(accountId: string, amount: number): Promise<Account> {
    const account = await this.getAccountById(accountId);

    if (!account) {
      // Criar nova conta com saldo inicial
      const newAccount = new Account(accountId, amount);
      const savedAccount = await this.accountRepository.save(newAccount);

      // Registrar transação
      const transaction = new Transaction(TransactionType.DEPOSIT, amount);
      transaction.account = savedAccount;
      transaction.destinationAccountId = accountId;
      await this.transactionRepository.save(transaction);

      return savedAccount;
    }

    // Atualizar saldo da conta existente
    account.balance = parseFloat(account.balance.toString()) + amount;
    const updatedAccount = await this.accountRepository.save(account);

    // Registrar transação
    const transaction = new Transaction(TransactionType.DEPOSIT, amount);
    transaction.account = updatedAccount;
    transaction.destinationAccountId = accountId;
    await this.transactionRepository.save(transaction);

    return updatedAccount;
  }

  async withdraw(accountId: string, amount: number): Promise<Account> {
    const account = await this.getAccountById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    const currentBalance = parseFloat(account.balance.toString());
    if (currentBalance < amount) {
      throw new Error('Insufficient funds');
    }

    account.balance = currentBalance - amount;
    const updatedAccount = await this.accountRepository.save(account);

    // Registrar transação
    const transaction = new Transaction(TransactionType.WITHDRAW, amount);
    transaction.account = updatedAccount;
    transaction.originAccountId = accountId;
    await this.transactionRepository.save(transaction);

    return updatedAccount;
  }

  async transfer(originId: string, destinationId: string, amount: number): Promise<{ origin: Account; destination: Account }> {
    const originAccount = await this.getAccountById(originId);

    if (!originAccount) {
      throw new Error('Account not found');
    }

    const currentBalance = parseFloat(originAccount.balance.toString());
    if (currentBalance < amount) {
      throw new Error('Insufficient funds');
    }

    let destinationAccount = await this.getAccountById(destinationId);

    if (!destinationAccount) {
      // Criar nova conta de destino
      destinationAccount = new Account(destinationId, amount);
      destinationAccount = await this.accountRepository.save(destinationAccount);
    } else {
      // Atualizar saldo da conta de destino
      destinationAccount.balance = parseFloat(destinationAccount.balance.toString()) + amount;
      destinationAccount = await this.accountRepository.save(destinationAccount);
    }

    // Atualizar saldo da conta de origem
    originAccount.balance = currentBalance - amount;
    const updatedOriginAccount = await this.accountRepository.save(originAccount);

    // Registrar transação
    const transaction = new Transaction(TransactionType.TRANSFER, amount);
    transaction.account = updatedOriginAccount;
    transaction.originAccountId = originId;
    transaction.destinationAccountId = destinationId;
    await this.transactionRepository.save(transaction);

    return {
      origin: updatedOriginAccount,
      destination: destinationAccount,
    };
  }

  async reset(): Promise<void> {
    // Deletar transações primeiro (devido à foreign key)
    await this.transactionRepository
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .execute();
    
    // Depois deletar contas
    await this.accountRepository
      .createQueryBuilder()
      .delete()
      .from(Account)
      .execute();
  }

  async getTransactions(accountId: string): Promise<Transaction[]> {
    const account = await this.getAccountById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    return await this.transactionRepository.find({
      where: [
        { originAccountId: accountId },
        { destinationAccountId: accountId },
      ],
      order: {
        createdAt: 'DESC',
      },
      take: 50, // Limitar a 50 transações mais recentes
    });
  }
}

