import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = (process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production') as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '24h') as string;

export interface JWTPayload {
  username: string;
}

export function generateToken(username: string): string {
  const payload = { username };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

