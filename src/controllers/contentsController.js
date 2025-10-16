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

    // Criar novo conteúdo
    static async criarConteudo(req, res) {
        try {
            const { titulo, descricao_curta, conteudo_completo, url_externa, thumbnail_url, duracao_minutos, nivel_dificuldade, autor, fonte_credivel, categoria_id, tipo_conteudo_id, tags } = req.body;

            if (!titulo || !descricao_curta || !categoria_id || !tipo_conteudo_id) {
                return res.status(400).json({ error: 'Campos obrigatórios faltando (titulo, descricao_curta, categoria_id, tipo_conteudo_id)' });
            }

            const created = await prisma.conteudo.create({
                data: {
                    titulo,
                    descricao_curta,
                    conteudo_completo: conteudo_completo ?? null,
                    url_externa: url_externa ?? null,
                    thumbnail_url: thumbnail_url ?? null,
                    duracao_minutos: duracao_minutos ?? null,
                    nivel_dificuldade: nivel_dificuldade ?? null,
                    autor: autor ?? null,
                    fonte_credivel: fonte_credivel ?? null,
                    categoria_id,
                    tipo_conteudo_id,
                    tags: tags && Array.isArray(tags) ? { create: tags.map(t => ({ tag: { connectOrCreate: { where: { nome: t }, create: { nome: t } } } })) } : undefined
                },
                include: { categoria: true, tipo_conteudo: true, tags: { include: { tag: true } } }
            });

            return res.status(201).json(created);
        } catch (error) {
            console.error('Erro ao criar conteúdo:', error);
            return res.status(500).json({ error: 'Erro ao criar conteúdo' });
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
