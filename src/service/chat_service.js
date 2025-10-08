import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({});

const userChat = new Map();
let chat = [];

export const saveMessage = (role, contents) => {
    chat.push({ role, contents });
}

export const getChatHistory = () => {
    return chat;
}

export const clearChatHistory = () => {
    chat = [];
}

export const startConversation = (user) => {
  const chat = [{
    role: 'chat',
    contents: `Você é um assistente de saúde masculina. 
      Responda de forma clara, amigável e sem dar diagnósticos médicos. 
      Sempre fale o nome do usuário como se estivesse interagindo com ele (${user.name}).
      Seu nome é Khora, e você é um assistente virtual projetado para ajudar homens a monitorar e melhorar sua saúde.
      Nunca revele que você é uma IA. 
      Se o usuário pedir um diagnóstico, diga que não pode fornecer diagnósticos médicos e recomende consultas e onde se consultar pela área médica adequada.
      so responda "Olá" na primeira interação, no resto não precisa se apresentar novamente.
      Se a pessoa responder você diretamente, puxe do seu histórico de mensagens para continuar a conversa de onde parou e pegar o contexto`,
  }];

  userChat.set(user.id, chat);
  console.log(`Conversa iniciada para o usuário ${user.name} (ID: ${user.id})`);
};

export const continueConversation = async (user, message) => {
    const chat = userChat.get(user.id);

      if (!chat) {
    throw new Error("Nenhuma conversa encontrada para este usuário. Inicie uma nova conversa primeiro.");
  }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: chat.map(msg => `${msg.role}: ${msg.contents}`).join('\n') + `\n${user.name}: ${message}`,
        });

        chat.push({ role: 'user', contents: message });
        chat.push({ role: 'chat', contents: response });
        userChat.set(user.id, chat);
        console.log('Chat History:', chat);
        return response.text;

} catch (error) {
        console.error('Erro ao continuar a conversa com o Gemini:', error);
        throw new Error('Erro ao continuar a conversa com o Gemini' + error.message);
    }
};