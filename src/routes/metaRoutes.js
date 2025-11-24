import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { listUserMetas, createMeta } from '../controllers/metaController.js';

const router = express.Router();

// GET /api/meta - lista metas do usuário logado
router.get('/', authMiddleware, listUserMetas);
router.post('/', authMiddleware, createMeta);

export default router;
