import { jest } from '@jest/globals';

const mockBody = jest.fn(() => ({
    isEmail: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    normalizeEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    notEmpty: jest.fn().mockReturnThis(),
}));

const mockValidationResult = jest.fn(() => ({
    isEmpty: jest.fn().mockReturnValue(true),
    array: jest.fn().mockReturnValue([]),
}));

jest.mock('express-validator', () => ({
    body: mockBody,
    validationResult: mockValidationResult,
}));

describe('Auth Validator', () => {
    let registerRules, loginRules, validate;

    beforeAll(async () => {
        const validators = await import('../validators/authValidator.js');
        registerRules = validators.registerRules;
        loginRules = validators.loginRules;
        validate = validators.validate;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        mockBody.mockImplementation(() => ({
            isEmail: jest.fn().mockReturnThis(),
            withMessage: jest.fn().mockReturnThis(),
            normalizeEmail: jest.fn().mockReturnThis(),
            isLength: jest.fn().mockReturnThis(),
            notEmpty: jest.fn().mockReturnThis(),
        }));
        mockValidationResult.mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([]),
        });
    });

    describe('registerRules', () => {
        it('deve retornar array de regras de validação para registro', () => {
            const rules = registerRules();

            expect(Array.isArray(rules)).toBe(true);
            expect(rules).toHaveLength(2); // email e password
            expect(mockBody).toHaveBeenCalledWith('email');
            expect(mockBody).toHaveBeenCalledWith('password_hash');
        });

        it('deve funcionar quando chamada sem parâmetros', () => {
            expect(() => registerRules()).not.toThrow();
        });
    });

    describe('loginRules', () => {
        it('deve retornar array de regras de validação para login', () => {
            const rules = loginRules();

            expect(Array.isArray(rules)).toBe(true);
            expect(rules).toHaveLength(2); // email e password
            expect(mockBody).toHaveBeenCalledWith('email');
            expect(mockBody).toHaveBeenCalledWith('password_hash');
        });

        it('deve funcionar quando chamada sem parâmetros', () => {
            expect(() => loginRules()).not.toThrow();
        });
    });

    describe('validate', () => {
        let req, res, next;

        beforeEach(() => {
            req = { body: {} };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            next = jest.fn();
        });

        it('deve chamar next() se não houver erros de validação', () => {
            mockValidationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(true),
                array: jest.fn().mockReturnValue([]),
            });

            validate(req, res, next);

            expect(mockValidationResult).toHaveBeenCalledWith(req);
            expect(next).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.json).not.toHaveBeenCalled();
        });

        it('deve retornar erro 422 se houver erros de validação', () => {
            const mockErrors = [
                { path: 'email', msg: 'Email inválido' },
                { path: 'password_hash', msg: 'Senha muito curta' },
            ];
            mockValidationResult.mockReturnValue({
                isEmpty: jest.fn().mockReturnValue(false),
                array: jest.fn().mockReturnValue(mockErrors),
            });

            validate(req, res, next);

            expect(mockValidationResult).toHaveBeenCalledWith(req);
            expect(res.status).toHaveBeenCalledWith(422);
            expect(res.json).toHaveBeenCalledWith({
                errors: [
                    { email: 'Email inválido' },
                    { password_hash: 'Senha muito curta' }
                ]
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('deve funcionar quando chamada com parâmetros válidos', () => {
            expect(() => validate(req, res, next)).not.toThrow();
        });
    });
});
