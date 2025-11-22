import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

// Initialize the GenAI client with an API key from environment variable GEMINI_API
// If you prefer ADC (service account JSON), set GOOGLE_APPLICATION_CREDENTIALS accordingly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

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
  if (!user || !user.id) {
    throw new Error('startConversation requires a user object with `id` and `name`.');
  }
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

    const textResponse = response?.text ?? response?.candidates?.[0]?.content?.text ?? JSON.stringify(response);

    chat.push({ role: 'user', contents: message });
    chat.push({ role: 'chat', contents: textResponse });
    userChat.set(user.id, chat);
    console.log('Chat History:', chat);
    return textResponse;

} catch (error) {
        console.error('Erro ao continuar a conversa com o Gemini:', error);
        throw new Error('Erro ao continuar a conversa com o Gemini' + error.message);
    }
};