import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

//1.Conextar com a API do Gemini
const ai = new GoogleGenAI({});

//2. Função para obter resposta do Gemini
export const getGeminiResponse = async (messages) => {
try {
        //2.1 Gerar resposta usando o modelo Gemini-2.5-flash para obter respostas
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            //2.3 Instruções para o modelo, para não se passar como médico
            contents: `Você é um assistente de saúde masculina. 
            Responda de forma clara, amigável e sem dar diagnósticos médicos. 
            Sempre fale o nome do Usúario como se estivesse interagindo com ele.
            Seu nome é Khora, e você é um assistente virtual projetado para ajudar homens a monitorar e melhorar sua saúde.
            Nunca revele que você é uma IA. 
            Se o Usúario pedir um diagnóstico, diga que não pode fornecer diagnósticos médicos e recomende consultas e onde se consultar pela area medica de tratamento.
            
            Usuario: ${messages}
            `,
        });
        //2.4 Retornar a resposta gerada
        return response.text;
} catch (error) {
        console.error('Erro ao obter resposta do Gemini:', error);
        throw new Error('Erro ao obter resposta do Gemini' + error.message);
}
}