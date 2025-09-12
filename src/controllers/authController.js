import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

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

        // 3. Gera o Token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 4. Responde com o token
        res.status(200).json({ message: 'Login bem-sucedido!', token: token });

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};
