import express from 'express';
import * as symptomController from '../controllers/symptomController.js';

const router = express.Router();

// POST /symptoms/assess
router.post('/assess', symptomController.assess);

export default router;
