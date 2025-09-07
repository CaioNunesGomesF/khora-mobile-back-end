import express from 'express';
import * as authController from '../controllers/authController.js';

// Importa nossas novas funções de validação
import { registerRules, loginRules, validate } from '../validators/authValidator.js';

const router = express.Router();

// A rota de registro agora passa por 3 etapas:
// 1. As regras de validação (registerRules)
// 2. O manipulador de erros (validate)
// 3. O controller (authController.register)
router.post('/register', registerRules(), validate, authController.register);

// O mesmo para a rota de login
router.post('/login', loginRules(), validate, authController.login);

export default router;
