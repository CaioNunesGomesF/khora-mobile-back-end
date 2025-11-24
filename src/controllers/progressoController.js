// POST /api/progresso - cria progresso para o usuário logado
export const createProgresso = async (req, res) => {
    try {
        const userId = req.user.id;
        const { progresso, descricao } = req.body;
        const novoProgresso = await prisma.progresso.create({
            data: { user_id: userId, progresso, descricao }
        });
        res.status(201).json(novoProgresso);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar progresso.', error: error.message });
    }
};
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// GET /api/progresso - lista progresso do usuário logado
export const listUserProgresso = async (req, res) => {
    try {
        const userId = req.user.id;
        // Busca progresso do usuário (ajuste conforme modelo real)
        const progresso = await prisma.progresso.findMany({ where: { user_id: userId } });
        res.status(200).json(progresso);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar progresso.', error: error.message });
    }
};
