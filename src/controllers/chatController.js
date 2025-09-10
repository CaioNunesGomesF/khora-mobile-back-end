import { getGeminiResponse } from "../service/chat_service.js";

//1. Controlador para lidar com requisições de chat
export const getchatController = async (req, res) => {
    try {
        //2. Extrair a mensagem do usuário do corpo da requisição
        const { message } = req.body;
        //3. Obter resposta do serviço do chatbot
        const response = await getGeminiResponse(message);
        res.status(200).json({ response });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao processar a solicitação.', error: error.message });
    }
}