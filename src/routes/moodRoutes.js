import express from 'express';
import { saveMood, listMood } from '../controllers/moodController.js';
import auth from '../middlewares/auth.middleware.js';
const router = express.Router();

// Registrar humor
router.post('/mood', auth, saveMood);
// Listar registros de humor
router.get('/mood', auth, listMood);

export default router;
