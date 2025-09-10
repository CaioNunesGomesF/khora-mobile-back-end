import { getchatController } from "../controllers/chatController.js";
import express from "express";

const router = express.Router();

//Rota para lidar com requisições de chat
//Chamar o controlador getchatController quando uma requisição POST for feita para oo endpoint /chat
router.post('/chat', getchatController);

export default router;