import 'dotenv/config';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Mock console.log por padrão para reduzir ruído nos testes
global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: console.error, // Mantém console.error para debug
};

// Setup global para todos os testes
beforeEach(() => {
    jest.clearAllMocks();
});
