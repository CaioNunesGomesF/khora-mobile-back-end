import jwt from 'jsonwebtoken';
import 'dotenv/config';

const authMiddleware = (req, res, next) => {
    // 1. Pega o token do cabeçalho da requisição.
    // O formato esperado é "Bearer <token>".
    const authHeader = req.headers.authorization;

    // 2. Verifica se o cabeçalho de autorização existe.
    if (!authHeader) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    // 3. Divide o cabeçalho para pegar apenas o token.
    // ex: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." se torna ["Bearer", "eyJhbG..."]
    const parts = authHeader.split(' ');

    // 4. Verifica se o formato do token é válido (deve ter duas partes e começar com "Bearer").
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({ message: 'Formato de token inválido.' });
    }

    const token = parts[1];

    // 5. Verifica se o token é válido usando a chave secreta.
    try {
        // jwt.verify decodifica o token. Se for válido, retorna o payload (os dados que usamos para criá-lo).
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 6. Adiciona os dados do usuário (payload) ao objeto `req` para que as próximas funções (controllers) possam usá-los.
        req.user = decoded;

        // 7. Chama o próximo middleware ou a função do controller, liberando o acesso à rota.
        next();
    } catch (error) {
        // Se o token for inválido ou expirado, jwt.verify vai lançar um erro.
        res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;
