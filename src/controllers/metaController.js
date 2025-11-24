// POST /api/meta - cria meta para o usuário logado
export const createMeta = async (req, res) => {
    try {
        const userId = req.user.id;
        const { titulo, descricao } = req.body;
        const meta = await prisma.meta.create({
            data: { user_id: userId, titulo, descricao }
        });
        res.status(201).json(meta);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar meta.', error: error.message });
    }
};
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

// GET /api/meta - lista metas do usuário logado
export const listUserMetas = async (req, res) => {
    try {
        const userId = req.user.id;
        // Busca metas do usuário (ajuste conforme modelo real)
        const metas = await prisma.meta.findMany({ where: { user_id: userId } });
        res.status(200).json(metas);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar metas.', error: error.message });
    }
};
