const moodController = require('../controllers/moodController');
const httpMocks = require('node-mocks-http');
jest.mock('../generated/prisma/client', () => {
  const mPrisma = {
    moodEntry: {
      create: jest.fn(),
      findMany: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Mood Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveMood', () => {
    it('deve salvar registro de humor', async () => {
      const req = httpMocks.createRequest({ body: { mood: 'feliz', origin: 'manual' }, user: { id: 'user-uuid' } });
      const res = httpMocks.createResponse();
      const mockEntry = { id: 1, userId: 'user-uuid', mood: 'feliz', origin: 'manual' };
      require('../generated/prisma/client').PrismaClient().moodEntry.create.mockResolvedValue(mockEntry);
      await moodController.saveMood(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockEntry);
    });
  });

  describe('listMood', () => {
    it('deve listar registros de humor do usuário', async () => {
      const req = httpMocks.createRequest({ user: { id: 'user-uuid' } });
      const res = httpMocks.createResponse();
      const mockEntries = [
        { id: 1, userId: 'user-uuid', mood: 'feliz', origin: 'manual', createdAt: '2025-11-14T08:00:00.000Z' }
      ];
      require('../generated/prisma/client').PrismaClient().moodEntry.findMany.mockResolvedValue(mockEntries);
      await moodController.listMood(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockEntries);
    });
  });
});
