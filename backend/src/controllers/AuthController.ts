import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginRequest, LoginResponse } from '../types';

export class AuthController {
  private authService = new AuthService();

  async login(req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse | { error: string }>) {
    try {
      const { username, pass } = req.body;

      if (!username || !pass) {
        return res.status(400).json({ error: 'Username and password are required' });
      }

      const token = await this.authService.login(username, pass);
      return res.status(200).json({ token });
    } catch (error: any) {
      if (error.message === 'Invalid credentials') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

