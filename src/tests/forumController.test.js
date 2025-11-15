const forumController = require('../controllers/forumController');
const httpMocks = require('node-mocks-http');
jest.mock('../generated/prisma/client', () => {
  const mPrisma = {
    forumTopic: {
      create: jest.fn(),
      findMany: jest.fn()
    },
    forumPseudonym: {
      create: jest.fn()
    },
    forumPost: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    },
    forumReply: {
      create: jest.fn()
    }
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

describe('Forum Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createTopic', () => {
    it('deve criar um tópico', async () => {
      const req = httpMocks.createRequest({ body: { title: 'Saúde Masculina' } });
      const res = httpMocks.createResponse();
      const mockTopic = { id: 1, title: 'Saúde Masculina' };
      require('../generated/prisma/client').PrismaClient().forumTopic.create.mockResolvedValue(mockTopic);
      await forumController.createTopic(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockTopic);
    });
  });

  describe('listTopics', () => {
    it('deve listar tópicos', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const mockTopics = [{ id: 1, title: 'Saúde Masculina' }];
      require('../generated/prisma/client').PrismaClient().forumTopic.findMany.mockResolvedValue(mockTopics);
      await forumController.listTopics(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockTopics);
    });
  });

  describe('createPseudonym', () => {
    it('deve criar pseudônimo', async () => {
      const req = httpMocks.createRequest({ body: { topicId: 1 }, user: { id: 'user-uuid' } });
      const res = httpMocks.createResponse();
      const mockPseudonym = { id: 1, name: 'Anon1234' };
      require('../generated/prisma/client').PrismaClient().forumPseudonym.create.mockResolvedValue(mockPseudonym);
      await forumController.createPseudonym(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual({ pseudonym: 'Anon1234' });
    });
  });

  describe('createPost', () => {
    it('deve criar post', async () => {
      const req = httpMocks.createRequest({ body: { topicId: 1, pseudonymId: 1, content: 'Conteúdo do post' } });
      const res = httpMocks.createResponse();
      const mockPost = { id: 1, topicId: 1, pseudonymId: 1, content: 'Conteúdo do post' };
      require('../generated/prisma/client').PrismaClient().forumPost.create.mockResolvedValue(mockPost);
      await forumController.createPost(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockPost);
    });
  });

  describe('listPosts', () => {
    it('deve listar posts de um tópico', async () => {
      const req = httpMocks.createRequest({ params: { topicId: 1 } });
      const res = httpMocks.createResponse();
      const mockPosts = [{
        id: 1,
        topicId: 1,
        pseudonym: { name: 'Anon1234' },
        replies: []
      }];
      require('../generated/prisma/client').PrismaClient().forumPost.findMany.mockResolvedValue(mockPosts);
      await forumController.listPosts(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([{ id: 1, topicId: 1, pseudonym: { name: 'Anon1234' }, replies: [] }]);
    });
  });

  describe('createReply', () => {
    it('deve criar resposta', async () => {
      const req = httpMocks.createRequest({ body: { postId: 1, pseudonymId: 1, content: 'Resposta' } });
      const res = httpMocks.createResponse();
      const mockReply = { id: 1, postId: 1, pseudonymId: 1, content: 'Resposta' };
      require('../generated/prisma/client').PrismaClient().forumReply.create.mockResolvedValue(mockReply);
      await forumController.createReply(req, res);
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(mockReply);
    });
  });

  describe('deletePost', () => {
    it('deve deletar post', async () => {
      const req = httpMocks.createRequest({ params: { postId: 1 } });
      const res = httpMocks.createResponse();
      require('../generated/prisma/client').PrismaClient().forumPost.delete.mockResolvedValue({});
      await forumController.deletePost(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ deleted: true });
    });
  });
});
