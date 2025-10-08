import { startChatController, continueChatController } from "../controllers/chatController.js";
import express from "express";

const router = express.Router();

router.post('/continue-chat', continueChatController);
router.post("/start", startChatController);

export default router;