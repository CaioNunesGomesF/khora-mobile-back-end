import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as habitoController from '../controllers/habitoController.js';

const router = express.Router();

// GET /api/habitos - Lista todos os hábitos disponíveis
router.get('/', authMiddleware, habitoController.listarHabitos);

// POST /api/habitos - Adiciona um novo progresso de hábito para o usuário
router.post('/', authMiddleware, habitoController.adicionarHabito);

// GET /api/habitos/:id - Busca detalhes de um progresso de hábito específico
router.get('/:id', authMiddleware, habitoController.getHabitoDetail);

// POST /api/habitos/:id/recaida - Registra uma recaída
router.post('/:id/recaida', authMiddleware, habitoController.registrarRecaida);

export default router;
