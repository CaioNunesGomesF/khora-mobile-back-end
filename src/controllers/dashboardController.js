import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar dados básicos do usuário e perfil
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        perfil_usuario: true,
      }
    });

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Buscar progresso de hábitos
    const habitosProgresso = await prisma.progresso_habito.findMany({
      where: { user_id: userId },
      include: {
        habito: true
      },
      orderBy: { data_inicio: 'desc' }
    });

    // Calcular estatísticas de hábitos
    const habitosStats = {
      total: habitosProgresso.length,
      semRecaida: habitosProgresso.filter(h => !h.ultima_recaida).length,
      comRecaida: habitosProgresso.filter(h => h.ultima_recaida).length,
      economiaTotal: habitosProgresso.reduce((sum, h) => {
        if (h.custo_diario_habito) {
          const diasSemHabito = h.ultima_recaida
            ? Math.floor((h.ultima_recaida - h.data_inicio) / (1000 * 60 * 60 * 24))
            : Math.floor((new Date() - h.data_inicio) / (1000 * 60 * 60 * 24));
          return sum + (parseFloat(h.custo_diario_habito) * Math.max(0, diasSemHabito));
        }
        return sum;
      }, 0)
    };

    // Buscar conquistas do usuário
    const conquistas = await prisma.user_conquista.findMany({
      where: { user_id: userId },
      include: {
        conquista: true
      },
      orderBy: { data_conquista: 'desc' },
      take: 5 // Últimas 5 conquistas
    });

    // Buscar doenças do usuário
    const doencas = await prisma.user_doenca.findMany({
      where: { user_id: userId },
      include: {
        doenca: true
      }
    });

    // Calcular IMC se altura e peso estiverem disponíveis
    let imc = null;
    let categoriaIMC = null;
    if (userData.perfil_usuario?.altura_cm && userData.perfil_usuario?.peso_kg) {
      const alturaMetros = userData.perfil_usuario.altura_cm / 100;
      imc = parseFloat(userData.perfil_usuario.peso_kg) / (alturaMetros * alturaMetros);
      imc = Math.round(imc * 100) / 100;

      // Categorizar IMC
      if (imc < 18.5) categoriaIMC = 'Abaixo do peso';
      else if (imc < 25) categoriaIMC = 'Peso normal';
      else if (imc < 30) categoriaIMC = 'Sobrepeso';
      else categoriaIMC = 'Obesidade';
    }

    // Calcular idade se data de nascimento estiver disponível
    let idade = null;
    if (userData.perfil_usuario?.data_nascimento) {
      const hoje = new Date();
      const nascimento = new Date(userData.perfil_usuario.data_nascimento);
      idade = hoje.getFullYear() - nascimento.getFullYear();
      const mesAtual = hoje.getMonth();
      const mesNascimento = nascimento.getMonth();
      if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }
    }

    // Buscar avaliações de conteúdo para entender engajamento
    const avaliacoesConteudo = await prisma.avaliacao_conteudo.count({
      where: { user_id: userId }
    });

    // Estruturar resposta do dashboard
    const dashboardData = {
      usuario: {
        id: userData.id,
        nome: userData.name,
        email: userData.email,
        idade: idade,
        tempoNaPlataforma: Math.floor((new Date() - userData.created_at) / (1000 * 60 * 60 * 24))
      },
      indicadoresSaude: {
        imc: imc,
        categoriaIMC: categoriaIMC,
        altura: userData.perfil_usuario?.altura_cm,
        peso: userData.perfil_usuario?.peso_kg ? parseFloat(userData.perfil_usuario.peso_kg) : null,
        genero: userData.perfil_usuario?.genero
      },
      habitos: {
        estatisticas: habitosStats,
        habitosAtivos: habitosProgresso.map(h => ({
          id: h.id,
          nome: h.habito.nome,
          categoria: h.habito.categoria,
          dataInicio: h.data_inicio,
          ultimaRecaida: h.ultima_recaida,
          metaPessoal: h.meta_pessoal,
          custoDiario: h.custo_diario_habito ? parseFloat(h.custo_diario_habito) : null,
          diasLivres: h.ultima_recaida
            ? Math.floor((new Date() - h.ultima_recaida) / (1000 * 60 * 60 * 24))
            : Math.floor((new Date() - h.data_inicio) / (1000 * 60 * 60 * 24))
        }))
      },
      conquistas: {
        total: conquistas.length,
        recentes: conquistas.map(c => ({
          id: c.conquista.id,
          nome: c.conquista.nome,
          descricao: c.conquista.descricao,
          iconeUrl: c.conquista.icone_url,
          dataConquista: c.data_conquista
        }))
      },
      condicoesSaude: doencas.map(d => ({
        id: d.doenca.id,
        nome: d.doenca.nome
      })),
      engajamento: {
        avaliacoesConteudo: avaliacoesConteudo
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });

  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
