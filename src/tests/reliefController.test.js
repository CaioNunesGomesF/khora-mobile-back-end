const reliefController = require('../controllers/reliefController');
const httpMocks = require('node-mocks-http');
jest.mock('../service/relief_service', () => ({
  getAudioList: jest.fn(),
  getAudioById: jest.fn(),
  getBreathingExercises: jest.fn(),
  getBreathingById: jest.fn()
}));

describe('Relief Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listAudio', () => {
    it('deve listar áudios relaxantes', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const mockAudios = [{ id: 1, title: 'Som Relaxante', fileUrl: 'audio1.mp3', description: 'Relax', duration: 120 }];
      require('../service/relief_service').getAudioList.mockReturnValue(mockAudios);
      await reliefController.listAudio(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ data: mockAudios });
    });
  });

  describe('getAudio', () => {
    it('deve retornar detalhes de áudio', async () => {
      const req = httpMocks.createRequest({ params: { id: 1 } });
      const res = httpMocks.createResponse();
      const mockAudio = { id: 1, title: 'Som Relaxante', fileUrl: 'audio1.mp3', description: 'Relax', duration: 120 };
      require('../service/relief_service').getAudioById.mockResolvedValue(mockAudio);
      await reliefController.getAudio(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockAudio);
    });
    it('deve retornar 404 se áudio não encontrado', async () => {
      const req = httpMocks.createRequest({ params: { id: 99 } });
      const res = httpMocks.createResponse();
      require('../service/relief_service').getAudioById.mockResolvedValue(null);
      await reliefController.getAudio(req, res);
      expect(res.statusCode).toBe(404);
    });
  });

  describe('listBreathing', () => {
    it('deve listar exercícios de respiração', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const mockExercises = [{ id: 1, name: 'Respiração 1 min', duration: 1, steps: 'Inspire, expire' }];
      require('../service/relief_service').getBreathingExercises.mockReturnValue(mockExercises);
      await reliefController.listBreathing(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ data: mockExercises });
    });
  });

  describe('getBreathing', () => {
    it('deve retornar detalhes de exercício', async () => {
      const req = httpMocks.createRequest({ params: { id: 1 } });
      const res = httpMocks.createResponse();
      const mockExercise = { id: 1, name: 'Respiração 1 min', duration: 1, steps: 'Inspire, expire' };
      require('../service/relief_service').getBreathingById.mockResolvedValue(mockExercise);
      await reliefController.getBreathing(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockExercise);
    });
    it('deve retornar 404 se exercício não encontrado', async () => {
      const req = httpMocks.createRequest({ params: { id: 99 } });
      const res = httpMocks.createResponse();
      require('../service/relief_service').getBreathingById.mockResolvedValue(null);
      await reliefController.getBreathing(req, res);
      expect(res.statusCode).toBe(404);
    });
  });
});
