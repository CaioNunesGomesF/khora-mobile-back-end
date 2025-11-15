const quizController = require('../controllers/quizController');
const httpMocks = require('node-mocks-http');
jest.mock('../generated/prisma/client', () => {
  const mPrisma = {
    quizQuestion: {
      findMany: jest.fn()
    },
    quizOption: {
      findFirst: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Quiz Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getQuizQuestions', () => {
    it('deve retornar perguntas do quiz', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const mockQuestions = [
        {
          id: 1,
          text: 'Mito ou verdade? Teste',
          options: [
            { id: 1, text: 'Mito' },
            { id: 2, text: 'Verdade' }
          ]
        }
      ];
      require('../generated/prisma/client').PrismaClient().quizQuestion.findMany.mockResolvedValue(mockQuestions);
      await quizController.getQuizQuestions(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockQuestions);
    });
  });

  describe('checkQuizAnswer', () => {
    it('deve retornar correto=true para resposta certa', async () => {
      const req = httpMocks.createRequest({ body: { questionId: 1, optionId: 2 } });
      const res = httpMocks.createResponse();
      require('../generated/prisma/client').PrismaClient().quizOption.findFirst.mockResolvedValue({ id: 2, isCorrect: true });
      await quizController.checkQuizAnswer(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ correct: true });
    });
    it('deve retornar correto=false para resposta errada', async () => {
      const req = httpMocks.createRequest({ body: { questionId: 1, optionId: 1 } });
      const res = httpMocks.createResponse();
      require('../generated/prisma/client').PrismaClient().quizOption.findFirst.mockResolvedValue({ id: 1, isCorrect: false });
      await quizController.checkQuizAnswer(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ correct: false });
    });
    it('deve retornar 404 para alternativa inexistente', async () => {
      const req = httpMocks.createRequest({ body: { questionId: 1, optionId: 99 } });
      const res = httpMocks.createResponse();
      require('../generated/prisma/client').PrismaClient().quizOption.findFirst.mockResolvedValue(null);
      await quizController.checkQuizAnswer(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ correct: false, message: 'Alternativa não encontrada.' });
    });
  });
});
