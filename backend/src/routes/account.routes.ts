import { Router } from 'express';
import { AccountController } from '../controllers/AccountController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const accountController = new AccountController();

router.get('/balance', authenticateToken, (req, res) => accountController.getBalance(req, res));
router.get('/transactions', authenticateToken, (req, res) => accountController.getTransactions(req, res));
router.post('/event', authenticateToken, (req, res) => accountController.handleEvent(req, res));
router.post('/reset', authenticateToken, (req, res) => accountController.reset(req, res));

export default router;

