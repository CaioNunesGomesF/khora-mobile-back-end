import express from 'express';
const router = express.Router();

// Listar times do usuário
router.get('/', auth, listUserTeams);
import auth from '../middlewares/auth.middleware.js';
import { createTeam, inviteToTeam, createChallenge, listUserTeams } from '../controllers/teamController.js';

// Criar grupo
router.post('/teams', auth, createTeam);
// Convidar usuário para grupo
router.post('/teams/invite', auth, inviteToTeam);
// Criar desafio no grupo
router.post('/teams/:teamId/challenges', auth, createChallenge);

export default router;
