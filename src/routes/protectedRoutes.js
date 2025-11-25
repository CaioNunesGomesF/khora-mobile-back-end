import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as profileController from '../controllers/profileController.js';
import * as diaryController from '../controllers/diaryController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as analyticsController from '../controllers/analyticsController.js';
import * as checkupsController from '../controllers/checkupsController.js';
import { getUserHealthScore } from '../controllers/healthScoreController.js';
import { changePassword } from '../controllers/authController.js';
import symptomRoutes from './symptomRoutes.js';


const router = express.Router();

// Esta é uma rota de exemplo que será protegida.
// O middleware `authMiddleware` é colocado antes da função do controller.
// Isso significa que, para acessar esta rota, o cliente DEVE fornecer um token JWT válido.
router.get('/profile', authMiddleware, profileController.getProfile);

//rota para salvar ou atualizar o perfil de saúde
router.post('/profile', authMiddleware, profileController.saveProfile);
router.put('/profile', authMiddleware, profileController.saveProfile);

//rota para salvar os registros diários
router.post('/diary', authMiddleware, diaryController.createDiaryEntry);

//rota para listar registros.
router.get('/diary', authMiddleware, diaryController.getDiaryEntries);

//rota para atualizar o registro.
router.put('/diary/:id', authMiddleware, diaryController.updateDiaryEntry);

//rota para deletar registro.
router.delete('/diary/:id', authMiddleware, diaryController.deleteDiaryEntry);

// Rotas para dashboard e analytics
//rota para buscar dados do dashboard
router.get('/dashboard', authMiddleware, dashboardController.getDashboard);

//rota para buscar dados de analytics
router.get('/analytics', authMiddleware, analyticsController.getAnalytics);

//rota para buscar insights específicos
router.get('/insights', authMiddleware, analyticsController.getInsights);

// Health Score Dinâmico
router.get('/user/health-score', authMiddleware, getUserHealthScore);

// Rota para alterar senha (usuário autenticado)
router.put('/user/change-password', authMiddleware, changePassword);

// Checkups: timeline e lembretes
router.get('/checkups/timeline', authMiddleware, checkupsController.getTimeline);
router.post('/checkups/reminder', authMiddleware, checkupsController.setReminder);
router.post('/checkups/reminder/toggle', authMiddleware, checkupsController.toggleReminder);
router.post('/checkups/reminder/test', authMiddleware, checkupsController.triggerTestNotification);

// CRUD de checkups do usuário
router.get('/checkups', authMiddleware, checkupsController.listUserCheckups);
router.post('/checkups', authMiddleware, checkupsController.createUserCheckup);
router.put('/checkups/:id', authMiddleware, checkupsController.updateUserCheckup);
router.delete('/checkups/:id', authMiddleware, checkupsController.deleteUserCheckup);

// Rotas para triagem de sintomas (assessments)
// POST /symptoms/assess
router.use('/symptoms', authMiddleware, symptomRoutes);

// Rotas para fóruns (anônimos por tópico). (Removidas temporariamente)

export default router;
