import { startChatController, continueChatController } from "../controllers/chatController.js";
import  authMiddleware   from "../middlewares/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post('/continue-chat',authMiddleware, continueChatController);
router.post("/start-chat",authMiddleware, startChatController);

export default router;
