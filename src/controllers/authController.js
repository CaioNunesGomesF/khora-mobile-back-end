import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const users = []; // Array para armazenar os usuários cadastrados temporariamente

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // A validação de existência de email/senha já foi feita pelo middleware!

        // 1. Verifica se o usuário já existe
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: 'Usuário com este email já existe.' });
        }

        // 2. Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Cria o novo usuário
        const newUser = {
            id: users.length + 1,
            email: email,
            password: hashedPassword,
        };

        // 4. "Salva" o usuário
        users.push(newUser);
        console.log('Usuários cadastrados:', users);

        // 5. Responde com sucesso
        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId: newUser.id });

    } catch (error) {
        res.status(500).json({ message: 'Algo deu errado no servidor.', error: error.message });
    }
};

// Função de Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // A validação de existência de email/senha já foi feita pelo middleware!

        // 1. Encontra o usuário
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha
        const isMatch = await bcrypt.compare(password, user.password);
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
