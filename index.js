import forumRoutes from './src/routes/forumRoutes.js';
import metaRoutes from './src/routes/metaRoutes.js';
import progressoRoutes from './src/routes/progressoRoutes.js';
import moodRoutes from './src/routes/moodRoutes.js';
import saudeMasculinaRoutes from './src/routes/saudeMasculinaRoutes.js';
import express from 'express';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes.js';
import protectedRoutes from './src/routes/protectedRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import contents from './src/routes/contentsRoutes.js';
import reliefRoutes from './src/routes/reliefRoutes.js';
import teamRoutes from './src/routes/teamRoutes.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';


const app = express();

// Define a porta do servidor
const PORT = process.env.PORT 

app.use(express.json());

// Servir assets públicos (áudios, imagens, etc.)
app.use('/assets', express.static(path.resolve('src/public')));

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

// Rota para arsenal de conhecimento e pílula de conhecimento - saúde masculina
app.use('/api', saudeMasculinaRoutes);

// Rotas públicas para ferramentas de alívio de estresse (áudios + exercícios)
app.use('/api/relief', reliefRoutes);
// Rotas do quiz "Mito ou Verdade?"
import quizRoutes from './src/routes/quizRoutes.js';
app.use('/api', quizRoutes);
// Rotas de grupos e desafios

// Rotas de metas
app.use('/api/meta', metaRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/teams', teamRoutes);

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
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse em http://localhost:${PORT}`);
});
