import express from 'express';
import userRoutes from './routes/user.routes.js';

const app = express();

app.use(express.json()); // para receber JSON
app.use('/users', userRoutes); // monta as rotas

export default app;
