import { DataSource } from 'typeorm';
import { Account } from '../models/Account';
import { Transaction } from '../models/Transaction';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432', 10);
// Em desenvolvimento, usar por padrão o mesmo usuário configurado no Docker
const dbUsername = process.env.DB_USERNAME || 'banking_user';
const dbPassword = process.env.DB_PASSWORD || 'banking_pass';
const dbDatabase = process.env.DB_DATABASE || 'banking_db';

// Logs temporários para depuração em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('[DB] Connecting to Postgres with config:', {
    host: dbHost,
    port: dbPort,
    username: dbUsername,
    database: dbDatabase,
  });
  console.log('[DB] Raw DB_PASSWORD from env:', JSON.stringify(process.env.DB_PASSWORD));
  console.log('[DB] Effective password sent to Postgres:', JSON.stringify(dbPassword));
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: true, // Habilitado para criar tabelas automaticamente
  logging: process.env.NODE_ENV === 'development',
  entities: [Account, Transaction],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

