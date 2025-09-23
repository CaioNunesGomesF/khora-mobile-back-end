import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import authMiddleware from '../middlewares/auth.middleware.js';

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
}));

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test-secret';
        jest.clearAllMocks();
    });

    it('deve passar se token válido é fornecido', () => {
        const mockPayload = {
            id: 'user-id-123',
            email: 'usuario@email.com',
            iat: Date.now(),
            exp: Date.now() + 3600000,
        };
        req.headers.authorization = 'Bearer valid-jwt-token';
        jwt.verify.mockReturnValue(mockPayload);

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('valid-jwt-token', 'test-secret');
        expect(req.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se nenhum cabeçalho de autorização for fornecido', () => {
        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Acesso negado. Nenhum token fornecido.'
        });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se formato do token for inválido - sem Bearer', () => {
        req.headers.authorization = 'invalid-jwt-token';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Formato de token inválido.'
        });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se formato do token for inválido - sem token após Bearer', () => {
        req.headers.authorization = 'Bearer';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Formato de token inválido.'
        });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se formato do token for inválido - mais de 2 partes', () => {
        req.headers.authorization = 'Bearer token extra-part';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Formato de token inválido.'
        });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se prefixo não for Bearer', () => {
        req.headers.authorization = 'Basic invalid-jwt-token';

        authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Formato de token inválido.'
        });
        expect(jwt.verify).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar 401 se token for inválido ou expirado', () => {
        req.headers.authorization = 'Bearer invalid-jwt-token';
        jwt.verify.mockImplementation(() => {
            throw new Error('Token inválido');
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('invalid-jwt-token', 'test-secret');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token inválido ou expirado.'
        });
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });

    it('deve retornar 401 se token estiver expirado', () => {
        req.headers.authorization = 'Bearer expired-jwt-token';
        jwt.verify.mockImplementation(() => {
            const error = new Error('jwt expired');
            error.name = 'TokenExpiredError';
            throw error;
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('expired-jwt-token', 'test-secret');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token inválido ou expirado.'
        });
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });

    it('deve retornar 401 se JWT for malformado', () => {
        req.headers.authorization = 'Bearer malformed-jwt';
        jwt.verify.mockImplementation(() => {
            const error = new Error('jwt malformed');
            error.name = 'JsonWebTokenError';
            throw error;
        });

        authMiddleware(req, res, next);

        expect(jwt.verify).toHaveBeenCalledWith('malformed-jwt', 'test-secret');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token inválido ou expirado.'
        });
        expect(next).not.toHaveBeenCalled();
        expect(req.user).toBeUndefined();
    });
});
