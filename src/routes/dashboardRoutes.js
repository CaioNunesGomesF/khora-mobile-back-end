import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

// GET /api/dashboard - retorna dados do dashboard do usuário logado
router.get('/dashboard', authMiddleware, getDashboard);

export default router;
