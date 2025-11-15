import express from 'express';
import { getQuizQuestions, checkQuizAnswer } from '../controllers/quizController.js';
import auth from '../middlewares/auth.middleware.js';
const router = express.Router();

// Listar perguntas do quiz
router.get('/quiz', auth, getQuizQuestions);
// Validar resposta do quiz
router.post('/quiz/answer', auth, checkQuizAnswer);

export default router;
