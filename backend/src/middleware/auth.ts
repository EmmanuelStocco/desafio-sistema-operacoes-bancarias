import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    username: string;
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const payload = verifyToken(token);
    req.user = { username: payload.username };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

