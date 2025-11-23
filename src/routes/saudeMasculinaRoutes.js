import express from 'express';
import saudeMasculinaController from '../controllers/saudeMasculinaController.js';

const router = express.Router();

// Arsenal de conhecimento e pílula de conhecimento - saúde masculina
router.get('/saude-masculina', saudeMasculinaController.getInfo);

export default router;
