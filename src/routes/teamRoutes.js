import express from 'express';
import { createTeam, inviteToTeam, createChallenge } from '../controllers/teamController.js';
import auth from '../middlewares/auth.middleware.js';
const router = express.Router();

// Criar grupo
router.post('/teams', auth, createTeam);
// Convidar usuário para grupo
router.post('/teams/invite', auth, inviteToTeam);
// Criar desafio no grupo
router.post('/teams/:teamId/challenges', auth, createChallenge);

export default router;
