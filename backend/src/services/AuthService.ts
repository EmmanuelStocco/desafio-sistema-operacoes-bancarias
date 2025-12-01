import dotenv from 'dotenv';
import { generateToken } from '../utils/jwt';

dotenv.config();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

export class AuthService {
  async login(username: string, password: string): Promise<string> {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      return generateToken(username);
    }
    throw new Error('Invalid credentials');
  }
}

