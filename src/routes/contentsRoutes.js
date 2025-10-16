import express from 'express';
import ConteudoController from '../controllers/contentsController.js';
import CategoriaController from '../controllers/categoriesController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();
// Rotas de categorias
router.get('/categorias', CategoriaController.listarTodas);

// Rotas de conteúdo
router.get('/destaques', ConteudoController.listarDestaques);
router.get('/pesquisar', ConteudoController.pesquisar);
router.get('/categoria/:categoriaId', ConteudoController.listarPorCategoria);
router.get('/:id', ConteudoController.buscarPorId);
router.post('/', authMiddleware, ConteudoController.criarConteudo);

export default router;
