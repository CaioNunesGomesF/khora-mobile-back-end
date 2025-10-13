import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as profileController from '../controllers/profileController.js';
import * as diaryController from '../controllers/diaryController.js';
import * as dashboardController from '../controllers/dashboardController.js';
import * as analyticsController from '../controllers/analyticsController.js';


const router = express.Router();

// Esta é uma rota de exemplo que será protegida.
// O middleware `authMiddleware` é colocado antes da função do controller.
// Isso significa que, para acessar esta rota, o cliente DEVE fornecer um token JWT válido.
router.get('/profile', authMiddleware, profileController.getProfile);

//rota para salvar o perfil de saúde
router.post('/profile', authMiddleware, profileController.saveProfile);

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

export default router;
