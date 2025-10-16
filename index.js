import express from 'express';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes.js';
import protectedRoutes from './src/routes/protectedRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import contents from './src/routes/contentsRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

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

//Rota para conteúdo
app.use('/api/conteudo', contents);

// Swagger UI
try {
    const swaggerPath = path.resolve('docs/swagger.json');
    if (fs.existsSync(swaggerPath)) {
        const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
        app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        console.log('Swagger UI disponível em /docs');
    }
} catch (err) {
    console.warn('Não foi possível carregar swagger.json:', err.message);
}

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse em http://localhost:${PORT}`);
});
