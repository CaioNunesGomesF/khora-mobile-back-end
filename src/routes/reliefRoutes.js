import express from 'express';
import * as ReliefController from '../controllers/reliefController.js';

const router = express.Router();

// Rotas públicas para ferramentas de alívio de estresse.
// Montadas em /api/relief pelo index.js.
//
// GET /api/relief/audio -> lista metadados dos áudios (campo `src` contém URL pública)
router.get('/audio', ReliefController.listAudio);

// GET /api/relief/breathing -> lista de exercícios de respiração com passos e durações
router.get('/breathing', ReliefController.listBreathing);

export default router;
