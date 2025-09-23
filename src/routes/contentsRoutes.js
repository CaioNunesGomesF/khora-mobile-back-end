import express from 'express';
import ConteudoController from '../controllers/contentsController.js';
import CategoriaController from '../controllers/categoriesController.js';

const router = express.Router();
// Rotas de categorias
router.get('/categorias', CategoriaController.listarTodas);

// Rotas de conteúdo
router.get('/destaques', ConteudoController.listarDestaques);
router.get('/pesquisar', ConteudoController.pesquisar);
router.get('/categoria/:categoriaId', ConteudoController.listarPorCategoria);
router.get('/:id', ConteudoController.buscarPorId);

export default router;
