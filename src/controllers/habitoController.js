import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

/**
 * GET /api/habito/:id - Busca detalhes de um progresso de hábito específico
 */
export const getHabitoDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const progresso = await prisma.progresso_habito.findFirst({
      where: {
        id: id,
        user_id: userId
      },
      include: {
        habito: true
      }
    });

    if (!progresso) {
      return res.status(404).json({
        success: false,
        message: 'Progresso de hábito não encontrado'
      });
    }

    // Calcular dias livres
    const diasLivres = progresso.ultima_recaida
      ? Math.floor((new Date() - new Date(progresso.ultima_recaida)) / (1000 * 60 * 60 * 24))
      : Math.floor((new Date() - new Date(progresso.data_inicio)) / (1000 * 60 * 60 * 24));

    // Calcular economia
    const economia = progresso.custo_diario_habito
      ? parseFloat(progresso.custo_diario_habito) * diasLivres
      : 0;

    // Converter dias em horas, minutos, segundos (tempo desde última recaída ou início)
    const dataReferencia = progresso.ultima_recaida
      ? new Date(progresso.ultima_recaida)
      : new Date(progresso.data_inicio);
    const tempoMs = new Date() - dataReferencia;

    const totalSegundos = Math.floor(tempoMs / 1000);
    const dias = Math.floor(totalSegundos / 86400);
    const horas = Math.floor((totalSegundos % 86400) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    // Buscar conquistas relacionadas a esse hábito
    const conquistasUsuario = await prisma.user_conquista.findMany({
      where: { user_id: userId },
      include: { conquista: true },
      orderBy: { data_conquista: 'desc' },
      take: 10
    });

    // Calcular progresso percentual (meta: 100 dias)
    const metaDias = 100;
    const progressoPercent = Math.min(100, Math.round((diasLivres / metaDias) * 100));

    res.json({
      success: true,
      data: {
        id: progresso.id,
        habito: {
          id: progresso.habito.id,
          nome: progresso.habito.nome,
          descricao: progresso.habito.descricao,
          categoria: progresso.habito.categoria
        },
        dataInicio: progresso.data_inicio,
        ultimaRecaida: progresso.ultima_recaida,
        metaPessoal: progresso.meta_pessoal,
        custoDiario: progresso.custo_diario_habito ? parseFloat(progresso.custo_diario_habito) : null,
        diasLivres,
        tempo: { dias, horas, minutos, segundos },
        economia,
        progressoPercent,
        conquistas: conquistasUsuario.map(c => ({
          id: c.conquista.id,
          nome: c.conquista.nome,
          descricao: c.conquista.descricao,
          iconeUrl: c.conquista.icone_url,
          dataConquista: c.data_conquista
        }))
      }
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes do hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * POST /api/habito/:id/recaida - Registra uma recaída
 */
export const registrarRecaida = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar se o progresso pertence ao usuário
    const progresso = await prisma.progresso_habito.findFirst({
      where: {
        id: id,
        user_id: userId
      }
    });

    if (!progresso) {
      return res.status(404).json({
        success: false,
        message: 'Progresso de hábito não encontrado'
      });
    }

    // Atualizar com a data atual como última recaída
    const atualizado = await prisma.progresso_habito.update({
      where: { id: id },
      data: {
        ultima_recaida: new Date()
      },
      include: {
        habito: true
      }
    });

    res.json({
      success: true,
      message: 'Recaída registrada. Lembre-se: cada dia é uma nova oportunidade!',
      data: {
        id: atualizado.id,
        nome: atualizado.habito.nome,
        ultimaRecaida: atualizado.ultima_recaida,
        diasLivres: 0 // Reiniciou hoje
      }
    });

  } catch (error) {
    console.error('Erro ao registrar recaída:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * GET /api/habitos - Lista todos os hábitos disponíveis
 */
export const listarHabitos = async (req, res) => {
  try {
    const habitos = await prisma.habito.findMany({
      orderBy: { nome: 'asc' }
    });

    res.json({
      success: true,
      data: habitos
    });

  } catch (error) {
    console.error('Erro ao listar hábitos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

/**
 * POST /api/habito - Adiciona um novo progresso de hábito para o usuário
 */
export const adicionarHabito = async (req, res) => {
  try {
    const userId = req.user.id;
    const { habito_id, meta_pessoal, custo_diario } = req.body;

    if (!habito_id) {
      return res.status(400).json({
        success: false,
        message: 'habito_id é obrigatório'
      });
    }

    // Verificar se o hábito existe
    const habito = await prisma.habito.findUnique({
      where: { id: habito_id }
    });

    if (!habito) {
      return res.status(404).json({
        success: false,
        message: 'Hábito não encontrado'
      });
    }

    // Verificar se o usuário já tem esse hábito
    const existente = await prisma.progresso_habito.findFirst({
      where: {
        user_id: userId,
        habito_id: habito_id
      }
    });

    if (existente) {
      return res.status(400).json({
        success: false,
        message: 'Você já está acompanhando este hábito'
      });
    }

    // Criar novo progresso
    const novoProgresso = await prisma.progresso_habito.create({
      data: {
        id: crypto.randomUUID(),
        user_id: userId,
        habito_id: habito_id,
        meta_pessoal: meta_pessoal || null,
        custo_diario_habito: custo_diario ? parseFloat(custo_diario) : null
      },
      include: {
        habito: true
      }
    });

    res.status(201).json({
      success: true,
      message: 'Hábito adicionado com sucesso!',
      data: {
        id: novoProgresso.id,
        nome: novoProgresso.habito.nome,
        dataInicio: novoProgresso.data_inicio,
        metaPessoal: novoProgresso.meta_pessoal
      }
    });

  } catch (error) {
    console.error('Erro ao adicionar hábito:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
