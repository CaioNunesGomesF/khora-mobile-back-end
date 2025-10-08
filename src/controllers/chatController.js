import { continueConversation, startConversation } from "../service/chat_service.js";

export const startChatController = async (req, res) => {
  try {
    const { userId, userName, message } = req.body;

    if (!userId || !userName || !message) {
      return res.status(400).json({
        message: "Campos 'userId', 'userName' e 'message' são obrigatórios.",
      });
    }

    const user = { id: userId, name: userName };

    await startConversation(user);

    const firstResponse = await continueConversation(user, message);

    res.status(200).json({
      success: true,
      message: "Conversa iniciada com o assistente Khora.",
      response: firstResponse,
    });
  } catch (error) {
    console.error("Erro no controller startChat:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao iniciar a conversa.",
      error: error.message,
    });
  }
};

export const continueChatController = async (req, res) => {
  try {
    const { userId, userName, message } = req.body;

    if (!userId || !userName || !message) {
      return res.status(400).json({
        message: "Campos 'userId', 'userName' e 'message' são obrigatórios.",
      });
    }

    const user = { id: userId, name: userName };

    const response = await continueConversation(user, message);

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Erro no controller continueChat:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao continuar a conversa.",
      error: error.message,
    });
  }
};