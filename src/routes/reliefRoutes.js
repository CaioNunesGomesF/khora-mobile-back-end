import express from 'express';
import * as ReliefController from '../controllers/reliefController.js';

const router = express.Router();

// Detalhes de áudio
router.get('/audio/:id', ReliefController.getAudio);
// Servir arquivo de áudio
router.get('/audio/file/:filename', ReliefController.serveAudioFile);
// Detalhes de exercício de respiração
router.get('/breathing/:id', ReliefController.getBreathing);
// GET /api/relief/audio -> lista metadados dos áudios (campo `src` contém URL pública)
router.get('/audio', ReliefController.listAudio);
// GET /api/relief/breathing -> lista de exercícios de respiração com passos e durações
router.get('/breathing', ReliefController.listBreathing);

export default router;
