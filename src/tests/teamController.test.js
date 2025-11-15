// ...existing code...
const httpMocks = require('node-mocks-http');
jest.mock('../generated/prisma/client', () => {
  const mPrisma = {
    team: { create: jest.fn() },
    teamMember: { findFirst: jest.fn(), create: jest.fn() },
    challenge: { create: jest.fn() }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});
const teamController = require('../controllers/teamController');

describe('Team Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTeam', () => {
    it('deve criar um grupo com sucesso', async () => {
      const req = httpMocks.createRequest({
        body: { name: 'Grupo Teste', description: 'Descrição do grupo' },
        user: { id: 1 }
      });
      const res = httpMocks.createResponse();
      const mockTeam = { id: 1, name: 'Grupo Teste', description: 'Descrição do grupo', ownerId: 1 };
      require('../generated/prisma/client').PrismaClient().team.create.mockResolvedValue(mockTeam);
      await teamController.createTeam(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toHaveProperty('name', 'Grupo Teste');
    });
  });

  describe('inviteToTeam', () => {
    it('deve convidar usuário para grupo', async () => {
      const req = httpMocks.createRequest({
        body: { teamId: 1, userId: 2 }
      });
      const res = httpMocks.createResponse();
      require('../generated/prisma/client').PrismaClient().teamMember.findFirst.mockResolvedValue(null);
      const mockMember = { id: 1, teamId: 1, userId: 2 };
      require('../generated/prisma/client').PrismaClient().teamMember.create.mockResolvedValue(mockMember);
      await teamController.inviteToTeam(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toHaveProperty('teamId', 1);
      expect(res._getJSONData()).toHaveProperty('userId', 2);
    });
  });

  describe('createChallenge', () => {
    it('deve criar um desafio no grupo', async () => {
      const req = httpMocks.createRequest({
        body: {
          teamId: 1,
          title: 'Desafio Teste',
          description: 'Descrição do desafio',
          startDate: '2025-11-15T00:00:00.000Z',
          endDate: '2025-11-22T00:00:00.000Z'
        }
      });
      const res = httpMocks.createResponse();
      const mockChallenge = { id: 1, teamId: 1, title: 'Desafio Teste', description: 'Descrição do desafio' };
      require('../generated/prisma/client').PrismaClient().challenge.create.mockResolvedValue(mockChallenge);
      await teamController.createChallenge(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toHaveProperty('title', 'Desafio Teste');
    });
  });
});
