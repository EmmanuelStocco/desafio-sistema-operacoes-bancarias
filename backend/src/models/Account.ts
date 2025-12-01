import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './Transaction';

@Entity('accounts')
export class Account {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => Transaction, (transaction) => transaction.account)
  transactions: Transaction[];

  constructor(id?: string, balance?: number) {
    if (id) this.id = id;
    if (balance !== undefined) this.balance = balance;
  }
}

