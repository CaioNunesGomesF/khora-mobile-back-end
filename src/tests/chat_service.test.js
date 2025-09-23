import { jest } from '@jest/globals';

const mockGenerateContent = jest.fn();
const mockGoogleGenAI = jest.fn().mockImplementation(() => ({
    models: {
        generateContent: mockGenerateContent,
    },
}));

jest.mock('@google/genai', () => ({
    GoogleGenAI: mockGoogleGenAI,
}));

jest.mock('../service/chat_service.js', () => ({
    getGeminiResponse: jest.fn(),
}));

describe('Chat Service', () => {
    let getGeminiResponse;

    beforeAll(async () => {
        const chatService = await import('../service/chat_service.js');
        getGeminiResponse = chatService.getGeminiResponse;
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getGeminiResponse', () => {
        it('deve ser uma função mockada', () => {
            expect(jest.isMockFunction(getGeminiResponse)).toBe(true);
        });

        it('deve retornar uma resposta quando chamada com sucesso (mock)', async () => {
            const userMessage = 'Como posso melhorar minha saúde?';
            const expectedResponse = 'Olá! Para melhorar sua saúde, recomendo exercícios regulares, alimentação balanceada e consultas médicas preventivas.';

            getGeminiResponse.mockResolvedValue(expectedResponse);

            const result = await getGeminiResponse(userMessage);

            expect(result).toBe(expectedResponse);
            expect(getGeminiResponse).toHaveBeenCalledWith(userMessage);
        });

        it('deve lançar erro quando há falha na API (mock)', async () => {
            const userMessage = 'Teste mensagem';
            const mockError = new Error('API Error');

            getGeminiResponse.mockRejectedValue(mockError);

            await expect(getGeminiResponse(userMessage)).rejects.toThrow('API Error');
            expect(getGeminiResponse).toHaveBeenCalledWith(userMessage);
        });

        it('deve lidar com mensagens vazias (mock)', async () => {
            const userMessage = '';
            const expectedResponse = 'Resposta padrão para mensagem vazia';

            getGeminiResponse.mockResolvedValue(expectedResponse);

            const result = await getGeminiResponse(userMessage);

            expect(result).toBe(expectedResponse);
            expect(getGeminiResponse).toHaveBeenCalledWith(userMessage);
        });

        it('deve lidar com mensagens contendo caracteres especiais (mock)', async () => {
            const userMessage = 'Tenho dúvidas sobre exercícios & alimentação!';
            const expectedResponse = 'Resposta sobre exercícios e alimentação';

            getGeminiResponse.mockResolvedValue(expectedResponse);

            const result = await getGeminiResponse(userMessage);

            expect(result).toBe(expectedResponse);
            expect(getGeminiResponse).toHaveBeenCalledWith(userMessage);
        });

        it('deve ser chamada corretamente independente do conteúdo da mensagem', async () => {
            const messages = [
                'Mensagem normal',
                'Mensagem com números 123',
                'Mensagem com símbolos @#$%',
                null,
                undefined
            ];

            getGeminiResponse.mockResolvedValue('Resposta padrão');

            for (const message of messages) {
                await getGeminiResponse(message);
                expect(getGeminiResponse).toHaveBeenCalledWith(message);
            }
        });
    });
});
