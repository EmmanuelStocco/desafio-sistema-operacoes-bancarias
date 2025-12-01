import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Account } from './Account';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
  })
  type: TransactionType;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Account, (account) => account.transactions)
  account: Account;

  @Column({ type: 'varchar', nullable: true })
  originAccountId: string;

  @Column({ type: 'varchar', nullable: true })
  destinationAccountId: string;

  @CreateDateColumn()
  createdAt: Date;

  constructor(type?: TransactionType, amount?: number) {
    if (type) this.type = type;
    if (amount !== undefined) this.amount = amount;
  }
}

