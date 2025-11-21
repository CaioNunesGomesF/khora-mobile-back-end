import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import prisma from '../config/prisma.js';
import {
    createTwoFactorCode,
    sendTwoFactorCode,
    validateTwoFactorCode,
    sendResetPasswordCode
} from '../service/two_factor_service.js';

export const register = async (req, res) => {
    try {
        const { name, email, password_hash } = req.body;

        // A validação de existência de email/senha já foi feita pelo middleware!

        // 1. Verifica se o usuário já existe
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário com este email já existe.' });
        }

        // 2. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password_hash, salt);

        const data = {
                id: crypto.randomUUID(),
                name: name,
                email: email,
                password_hash: hashedPassword,
            }
        // 3. Cria o novo usuário
        const newUser = await prisma.user.create({ data });

        // 4. Remove a senha da resposta
        delete newUser.password_hash;

        // 5. Responde com sucesso
        res.status(201).json({ message: 'Usuário registrado com sucesso!'}, newUser);

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};

// Função de Login
export const login = async (req, res) => {
    try {
        const { email, password_hash } = req.body;

        // A validação de existência de email/senha já foi feita pelo middleware!

        // 1. Encontra o usuário
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha
        const isMatch = await bcrypt.compare(password_hash, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Cria e envia o código de 2FA
        const { code } = await createTwoFactorCode(user.id);
        await sendTwoFactorCode(email, code);

        // 4. Responde com mensagem de sucesso e ID do usuário para verificação de 2FA
        res.status(200).json({
            message: 'Código de autenticação enviado para seu email.',
            userId: user.id,
            requiresTwoFactor: true,
        });

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};

// Função para verificar o código de 2FA e obter o token JWT
export const verifyTwoFactor = async (req, res) => {
    try {
        const { userId, code } = req.body;

        // Validação básica
        if (!userId || !code) {
            return res.status(400).json({
                valid: false,
                message: 'User ID e código são obrigatórios.'
            });
        }

        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                valid: false,
                message: 'Código de 2FA deve conter exatamente 6 dígitos numéricos.'
            });
        }

        // 1. Primeiro verifica se o código está correto (sem marcar como usado)
        const twoFactorCode = await prisma.two_factor_code.findFirst({
            where: {
                user_id: userId,
                code: code,
                isUsed: false,
            },
        });


        if (!twoFactorCode) {
            return res.status(401).json({
                valid: false,
                message: 'Código inválido'
            });
        }



        if (new Date() > twoFactorCode.expiresAt) {
            return res.status(401).json({
                valid: false,
                message: 'Código expirado'
            });
        }

        // 2. Se o código está correto, agora valida e marca como usado
        const validation = await validateTwoFactorCode(userId, code);

        if (!validation.valid) {
            return res.status(401).json({
                valid: false,
                message: validation.message
            });
        }

        // 3. Encontra o usuário
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(401).json({
                valid: false,
                message: 'Usuário não encontrado.'
            });
        }

        // 4. Gera o Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 5. Se for o primeiro login, atualiza o flag
        const isFirstLogin = user.isFirstLogin;
        if (isFirstLogin) {
            await prisma.user.update({
                where: { id: userId },
                data: { isFirstLogin: false }
            });
        }

        // 6. Responde com o token
        res.status(200).json({
            valid: true,
            message: 'Login bem-sucedido!',
            token: token,
            isFirstLogin: isFirstLogin,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });

    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Algo deu errado no servidor.',
            error: error.message
        });
    }
};

export const resendTwoFactorCode = async (req, res) => {
    try {
        const { userId } = req.body;

        // Validação básica
        if (!userId) {
            return res.status(400).json({
                valid: false,
                message: 'User ID é obrigatório.'
            });
        }

        // Verifica se o usuário existe
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                valid: false,
                message: 'Usuário não encontrado.'
            });
        }

        // Gera um novo código de 2FA
        const { code } = await createTwoFactorCode(userId);

        // Envia o novo código para o email do usuário
        await sendTwoFactorCode(user.email, code);

        res.status(200).json({
            valid: true,
            message: 'Novo código de autenticação enviado para seu email.',
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Algo deu errado ao reenviar o código.',
            error: error.message
        });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Verifica se o email foi fornecido
        if (!email) {
            return res.status(400).json({ message: 'Email é obrigatório.' });
        }

        // Verifica se o usuário existe
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // Gera um código de redefinição de senha
        const { code } = await createTwoFactorCode(user.id);

        // Envia o código para o email do usuário
        await sendResetPasswordCode(email, code);

        res.status(200).json({ message: 'Código de redefinição enviado para seu email.' });
    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado ao solicitar redefinição de senha.', error: error.message });
    }
};

export const validatePasswordResetCode = async (req, res) => {
    try {
        const { code, email } = req.body;

        // Valida os campos obrigatórios
        if (!email || !code) {
            return res.status(400).json({ message: 'Email e código são obrigatórios.' });
        }

        // Verifica se o email é uma string válida
        if (typeof email !== 'string' || !email.includes('@')) {
            return res.status(400).json({ message: 'Email inválido.' });
        }

        // Verifica se o código é uma string numérica de 6 dígitos
        if (typeof code !== 'string' || !/^[0-9]{6}$/.test(code)) {
            return res.status(400).json({ message: 'Código inválido.' });
        }

        // Busca o userId com base no email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        const userId = user.id;

        // Valida o código
        const validation = await validateTwoFactorCode(userId, code);
        if (!validation.valid) {
            return res.status(401).json({ message: validation.message });
        }

        res.status(200).json({ message: 'Código validado com sucesso.', userId });
    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado ao validar o código.', error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { userId, newPassword, confirmPassword } = req.body;

        // Valida os campos obrigatórios
        if (!userId || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'User ID, nova senha e confirmação de senha são obrigatórios.' });
        }

        // Verifica se as senhas coincidem
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não coincidem.' });
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'A senha deve ter pelo menos 8 caracteres, incluindo 1 letra maiúscula, 1 número e pode conter caracteres especiais.'
            });
        }

        // Criptografa a nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Atualiza a senha do usuário
        await prisma.user.update({
            where: { id: userId },
            data: { password_hash: hashedPassword },
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso.' });
    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado ao redefinir a senha.', error: error.message });
    }
};

export const resendCodeResetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Validação básica
        if (!email) {
            return res.status(400).json({
                valid: false,
                message: 'Email é obrigatório.'
            });
        }


        const user = await prisma.user.findUnique({ where: { email: email } });

        if (!user) {
            return res.status(404).json({
                valid: false,
                message: 'Usuário não encontrado.'
            });
        }

        // Gera um novo código de 2FA
        const { code } = await createTwoFactorCode(user.id);

        // Envia o novo código para o email do usuário
        await sendResetPasswordCode(user.email, code);

        res.status(200).json({
            valid: true,
            message: 'Novo código de validação enviado para seu email.',
        });
    } catch (error) {
        res.status(500).json({
            valid: false,
            message: 'Algo deu errado ao reenviar o código.',
            error: error.message
        });
    }
};
