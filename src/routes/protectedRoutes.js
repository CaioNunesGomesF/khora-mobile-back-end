import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import * as profileController from '../controllers/profileController.js';
import * as diaryController from '../controllers/diaryController.js';


const router = express.Router();

// Esta é uma rota de exemplo que será protegida.
// O middleware `authMiddleware` é colocado antes da função do controller.
// Isso significa que, para acessar esta rota, o cliente DEVE fornecer um token JWT válido.
router.get('/profile', authMiddleware, (req, res) => {
    // Podemos usar isso para, por exemplo, buscar informações do usuário no banco de dados.
    res.status(200).json({
        message: "Acesso ao perfil concedido!",
        user: req.user
    });
});

//rota para salvar o perfil de saúde
router.post('/onboarding/profile', authMiddleware, profileController.saveProfile);

//rota para salvar os registros diários
router.post('/diary', authMiddleware, diaryController.createDiaryEntry);

//rota para listar registros.
router.get('/diary', authMiddleware, diaryController.getDiaryEntries);

//rota para atualizar o registro.
router.put('/diary/:id', authMiddleware, diaryController.updateDiaryEntry);

//rota para deletar registro.
router.delete('/diary/:id', authMiddleware, diaryController.deleteDiaryEntry);

export default router;
