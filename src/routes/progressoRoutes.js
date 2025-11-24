import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { listUserProgresso, createProgresso } from '../controllers/progressoController.js';

const router = express.Router();

// GET /api/progresso - lista progresso do usuário logado
router.get('/', authMiddleware, listUserProgresso);
router.post('/', authMiddleware, createProgresso);

export default router;
