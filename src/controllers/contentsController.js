import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

class ConteudoController {
    // Listar conteúdos por categoria
    static async listarPorCategoria(req, res) {
        try {
            const { categoriaId } = req.params;
            const { page = 1, limit = 10, tipo, nivel } = req.query;

            const where = {
                categoria_id: categoriaId,
                ativo: true,
                ...(tipo && { tipo_conteudo: { nome: tipo } }),
                ...(nivel && { nivel_dificuldade: nivel })
            };

            const conteudos = await prisma.conteudo.findMany({
                where,
                include: {
                    categoria: true,
                    tipo_conteudo: true,
                    tags: { include: { tag: true } },
                    _count: { select: { avaliacoes: true } }
                },
                orderBy: [
                    { destaque: 'desc' },
                    { created_at: 'desc' }
                ],
                skip: (page - 1) * limit,
                take: parseInt(limit)
            });

            const total = await prisma.conteudo.count({ where });

            res.json({
                conteudos,
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total,
                    total_pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar conteúdos' });
        }
    }

    // Buscar conteúdo por ID
    static async buscarPorId(req, res) {
        try {
            const { id } = req.params;

            const conteudo = await prisma.conteudo.findUnique({
                where: { id },
                include: {
                    categoria: true,
                    tipo_conteudo: true,
                    tags: { include: { tag: true } },
                    avaliacoes: {
                        include: { user: { select: { name: true } } },
                        orderBy: { created_at: 'desc' }
                    }
                }
            });

            if (!conteudo) {
                return res.status(404).json({ error: 'Conteúdo não encontrado' });
            }

            // Incrementar visualizações
            await prisma.conteudo.update({
                where: { id },
                data: { visualizacoes: { increment: 1 } }
            });

            res.json(conteudo);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar conteúdo' });
        }
    }

    // Buscar conteúdos em destaque
    static async listarDestaques(req, res) {
        try {
            const { limit = 5 } = req.query;

            const conteudos = await prisma.conteudo.findMany({
                where: { destaque: true, ativo: true },
                include: {
                    categoria: true,
                    tipo_conteudo: true,
                    tags: { include: { tag: true } }
                },
                orderBy: { created_at: 'desc' },
                take: parseInt(limit)
            });

            res.json(conteudos);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar destaques' });
        }
    }

    // Pesquisar conteúdos
    static async pesquisar(req, res) {
        try {
            const { q, categoria, tipo, page = 1, limit = 10 } = req.query;

            const where = {
                ativo: true,
                OR: [
                    { titulo: { contains: q, mode: 'insensitive' } },
                    { descricao_curta: { contains: q, mode: 'insensitive' } },
                    { tags: { some: { tag: { nome: { contains: q, mode: 'insensitive' } } } } }
                ],
                ...(categoria && { categoria: { nome: categoria } }),
                ...(tipo && { tipo_conteudo: { nome: tipo } })
            };

            const conteudos = await prisma.conteudo.findMany({
                where,
                include: {
                    categoria: true,
                    tipo_conteudo: true,
                    tags: { include: { tag: true } }
                },
                skip: (page - 1) * limit,
                take: parseInt(limit)
            });

            const total = await prisma.conteudo.count({ where });

            res.json({
                conteudos,
                pagination: {
                    current_page: parseInt(page),
                    per_page: parseInt(limit),
                    total,
                    total_pages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            res.status(500).json({ error: 'Erro na pesquisa' });
        }
    }
}

export default ConteudoController;
