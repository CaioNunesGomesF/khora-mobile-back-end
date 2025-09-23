import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

class CategoriaController {
    static async listarTodas(req, res) {
        try {
            const categorias = await prisma.categoria_conteudo.findMany({
                where: { ativo: true },
                include: {
                    _count: { select: { conteudos: { where: { ativo: true } } } }
                },
                orderBy: { ordem: 'asc' }
            });

            res.json(categorias);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar categorias' });
        }
    }
}

export default CategoriaController;
