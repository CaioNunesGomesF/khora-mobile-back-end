import express from 'express';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes.js';
import protectedRoutes from './src/routes/protectedRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';

const app = express();

// Define a porta do servidor
const PORT = process.env.PORT;

app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('API de Autenticação está funcionando!');
});

// Usa as rotas de autenticação com um prefixo /api/auth
app.use('/api/auth', authRoutes);

// Usa as rotas protegidas com um prefixo /api
// Todas as rotas definidas em `protectedRoutes` agora exigirão um token.
// Chama o endpoint que conecta ao chatbot
app.use('/api', protectedRoutes, chatRoutes);

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse em http://localhost:${PORT}`);
});
