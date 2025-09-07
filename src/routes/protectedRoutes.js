import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

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

export default router;
