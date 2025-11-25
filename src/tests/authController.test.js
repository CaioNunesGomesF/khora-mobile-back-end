import { jest } from '@jest/globals';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../service/two_factor_service.js', () => ({
    createTwoFactorCode: jest.fn().mockResolvedValue({
        code: '123456',
        expiresAt: new Date(Date.now() + 180000),
        id: 'mock-two-factor-id'
    }),
    sendTwoFactorCode: jest.fn().mockResolvedValue({ success: true }),
    validateTwoFactorCode: jest.fn().mockResolvedValue({ valid: true }),
    sendResetPasswordCode: jest.fn().mockResolvedValue({ success: true }),
}));
global.crypto = {
    randomUUID: jest.fn(() => 'mock-uuid-1234'),
};

describe('AuthController', () => {
    let req, res, mockPrismaUser, register, login;

    beforeAll(async () => {
        mockPrismaUser = {
            findUnique: jest.fn(),
            create: jest.fn(),
        };

        jest.doMock('../generated/prisma/index.js', () => ({
            PrismaClient: jest.fn(() => ({
                user: mockPrismaUser,
            })),
        }));

        const controller = await import('../controllers/authController.js');
        register = controller.register;
        login = controller.login;
    });

    beforeEach(() => {
        req = {
            body: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    describe('register', () => {
        beforeEach(() => {
            req.body = {
                name: 'João Silva',
                email: 'joao@email.com',
                password_hash: 'senha123',
            };
        });

        it('deve registrar um novo usuário com sucesso', async () => {
            mockPrismaUser.findUnique.mockResolvedValue(null);
            bcrypt.genSalt.mockResolvedValue('salt-mock');
            bcrypt.hash.mockResolvedValue('hashed-password');
            mockPrismaUser.create.mockResolvedValue({
                id: 'mock-uuid-1234',
                name: 'João Silva',
                email: 'joao@email.com',
                password_hash: 'hashed-password',
            });

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                { message: 'Usuário registrado com sucesso!' },
                expect.objectContaining({
                    id: 'mock-uuid-1234',
                    name: 'João Silva',
                    email: 'joao@email.com',
                })
            );
        });

        it('deve retornar erro se usuário já existe', async () => {
            mockPrismaUser.findUnique.mockResolvedValue({
                id: 'existing-user-id',
                email: 'joao@email.com',
            });

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Usuário com este email já existe.'
            });
        });

        it('deve retornar erro 500 se houver erro no servidor', async () => {
            mockPrismaUser.findUnique.mockRejectedValue(new Error('Erro de banco'));

            await register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Algo deu errado no servidor.',
                error: 'Erro de banco'
            });
        });
    });

    describe('login', () => {
        beforeEach(() => {
            req.body = {
                email: 'joao@email.com',
                password_hash: 'senha123',
            };
            process.env.JWT_SECRET = 'test-secret';
        });

        it('deve fazer login com sucesso', async () => {
            const mockUser = {
                id: 'user-id-123',
                email: 'joao@email.com',
                password_hash: 'hashed-password',
            };
            mockPrismaUser.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Código de autenticação enviado para seu email.',
                userId: 'user-id-123',
                requiresTwoFactor: true,
            });
        });

        it('deve retornar erro se usuário não existe', async () => {
            mockPrismaUser.findUnique.mockResolvedValue(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Credenciais inválidas.'
            });
        });

        it('deve retornar erro se senha está incorreta', async () => {
            const mockUser = {
                id: 'user-id-123',
                email: 'joao@email.com',
                password_hash: 'hashed-password',
            };
            mockPrismaUser.findUnique.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Credenciais inválidas.'
            });
        });
    });
});
