import { PrismaClient } from '../generated/prisma/index.js';
import insightsService from '../service/insights_service.js';

const prisma = new PrismaClient();

export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { periodo = '30', tipo = 'all' } = req.query; // período em dias, tipo de análise

    const diasPeriodo = parseInt(periodo);
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - diasPeriodo);

    // Buscar dados básicos do usuário
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

    let analyticsData = {};

    // Análise de hábitos ao longo do tempo
    if (tipo === 'all' || tipo === 'habitos') {
      const habitosProgresso = await prisma.progresso_habito.findMany({
        where: {
          user_id: userId,
          data_inicio: {
            gte: dataInicio
          }
        },
        include: {
          habito: true
        },
        orderBy: { data_inicio: 'asc' }
      });

      // Análise temporal de hábitos
      const habitosPorMes = {};
      const recaidasPorMes = {};
      const economiaPorMes = {};

      habitosProgresso.forEach(h => {
        const mes = h.data_inicio.toISOString().substring(0, 7); // YYYY-MM

        if (!habitosPorMes[mes]) habitosPorMes[mes] = 0;
        habitosPorMes[mes]++;

        if (h.ultima_recaida) {
          const mesRecaida = h.ultima_recaida.toISOString().substring(0, 7);
          if (!recaidasPorMes[mesRecaida]) recaidasPorMes[mesRecaida] = 0;
          recaidasPorMes[mesRecaida]++;
        }

        if (h.custo_diario_habito) {
          if (!economiaPorMes[mes]) economiaPorMes[mes] = 0;
          const diasSemHabito = h.ultima_recaida
            ? Math.floor((h.ultima_recaida - h.data_inicio) / (1000 * 60 * 60 * 24))
            : Math.floor((new Date() - h.data_inicio) / (1000 * 60 * 60 * 24));
          economiaPorMes[mes] += parseFloat(h.custo_diario_habito) * Math.max(0, diasSemHabito);
        }
      });

      // Análise por categoria de hábito
      const habitosPorCategoria = {};
      habitosProgresso.forEach(h => {
        const categoria = h.habito.categoria || 'Sem categoria';
        if (!habitosPorCategoria[categoria]) {
          habitosPorCategoria[categoria] = {
            total: 0,
            sucessos: 0,
            recaidas: 0
          };
        }
        habitosPorCategoria[categoria].total++;
        if (h.ultima_recaida) {
          habitosPorCategoria[categoria].recaidas++;
        } else {
          habitosPorCategoria[categoria].sucessos++;
        }
      });

      analyticsData.habitos = {
        evolucaoTemporal: {
          habitosPorMes,
          recaidasPorMes,
          economiaPorMes
        },
        analiseCategoria: habitosPorCategoria,
        tendencias: {
          totalHabitos: habitosProgresso.length,
          taxaSucesso: habitosProgresso.length > 0
            ? ((habitosProgresso.filter(h => !h.ultima_recaida).length / habitosProgresso.length) * 100).toFixed(1)
            : 0,
          economiaTotal: Object.values(economiaPorMes).reduce((sum, val) => sum + val, 0)
        }
      };
    }

    // Análise de conquistas
    if (tipo === 'all' || tipo === 'conquistas') {
      const conquistasNoPeríodo = await prisma.user_conquista.findMany({
        where: {
          user_id: userId,
          data_conquista: {
            gte: dataInicio
          }
        },
        include: {
          conquista: true
        },
        orderBy: { data_conquista: 'asc' }
      });

      const conquistasPorMes = {};
      conquistasNoPeríodo.forEach(c => {
        const mes = c.data_conquista.toISOString().substring(0, 7);
        if (!conquistasPorMes[mes]) conquistasPorMes[mes] = 0;
        conquistasPorMes[mes]++;
      });

      analyticsData.conquistas = {
        evolucaoTemporal: conquistasPorMes,
        totalNoPeriodo: conquistasNoPeríodo.length,
        detalhes: conquistasNoPeríodo.map(c => ({
          nome: c.conquista.nome,
          data: c.data_conquista,
          icone: c.conquista.icone_url
        }))
      };
    }

    // Análise de engajamento com conteúdo
    if (tipo === 'all' || tipo === 'engajamento') {
      const avaliacoesNoPeríodo = await prisma.avaliacao_conteudo.findMany({
        where: {
          user_id: userId,
          created_at: {
            gte: dataInicio
          }
        },
        include: {
          conteudo: {
            include: {
              categoria: true,
              tipo_conteudo: true
            }
          }
        },
        orderBy: { created_at: 'asc' }
      });

      const engajamentoPorMes = {};
      const avaliacoesPorCategoria = {};
      const avaliacoesPorTipo = {};
      let somaRatings = 0;

      avaliacoesNoPeríodo.forEach(a => {
        const mes = a.created_at.toISOString().substring(0, 7);
        const categoria = a.conteudo.categoria.nome;
        const tipo = a.conteudo.tipo_conteudo.nome;

        if (!engajamentoPorMes[mes]) engajamentoPorMes[mes] = 0;
        engajamentoPorMes[mes]++;

        if (!avaliacoesPorCategoria[categoria]) avaliacoesPorCategoria[categoria] = 0;
        avaliacoesPorCategoria[categoria]++;

        if (!avaliacoesPorTipo[tipo]) avaliacoesPorTipo[tipo] = 0;
        avaliacoesPorTipo[tipo]++;

        somaRatings += a.rating;
      });

      analyticsData.engajamento = {
        evolucaoTemporal: engajamentoPorMes,
        porCategoria: avaliacoesPorCategoria,
        porTipo: avaliacoesPorTipo,
        estatisticas: {
          totalAvaliacoes: avaliacoesNoPeríodo.length,
          ratingMedio: avaliacoesNoPeríodo.length > 0
            ? (somaRatings / avaliacoesNoPeríodo.length).toFixed(1)
            : 0
        }
      };
    }

    // Análise de saúde (se dados disponíveis)
    if (tipo === 'all' || tipo === 'saude') {
      let analisesSaude = {};

      // IMC atual
      if (userData.perfil_usuario?.altura_cm && userData.perfil_usuario?.peso_kg) {
        const alturaMetros = userData.perfil_usuario.altura_cm / 100;
        const imc = parseFloat(userData.perfil_usuario.peso_kg) / (alturaMetros * alturaMetros);

        analisesSaude.imc = {
          valor: Math.round(imc * 100) / 100,
          categoria: imc < 18.5 ? 'Abaixo do peso' :
                    imc < 25 ? 'Peso normal' :
                    imc < 30 ? 'Sobrepeso' : 'Obesidade',
          recomendacao: imc < 18.5 ? 'Considere ganhar peso de forma saudável' :
                       imc < 25 ? 'Mantenha o peso atual' :
                       imc < 30 ? 'Considere perder peso gradualmente' :
                       'Procure orientação médica para perda de peso'
        };
      }

      // Análise de doenças
      const doencas = await prisma.user_doenca.findMany({
        where: { user_id: userId },
        include: { doenca: true }
      });

      analisesSaude.condicoes = doencas.map(d => d.doenca.nome);

      analyticsData.saude = analisesSaude;
    }

    // Correlações e insights avançados
    const insights = [];

    // Insight sobre hábitos e conquistas
    if (analyticsData.habitos && analyticsData.conquistas) {
      const habitosSucesso = analyticsData.habitos.tendencias.taxaSucesso;
      const conquistasRecentes = analyticsData.conquistas.totalNoPeriodo;

      if (habitosSucesso > 80 && conquistasRecentes > 0) {
        insights.push({
          tipo: 'positivo',
          titulo: 'Excelente progresso!',
          descricao: `Você tem ${habitosSucesso}% de taxa de sucesso nos hábitos e ${conquistasRecentes} conquistas recentes.`
        });
      } else if (habitosSucesso < 50) {
        insights.push({
          tipo: 'melhoria',
          titulo: 'Oportunidade de melhoria',
          descricao: 'Que tal focar em menos hábitos por vez para aumentar sua taxa de sucesso?'
        });
      }
    }

    // Insight sobre engajamento
    if (analyticsData.engajamento && analyticsData.engajamento.estatisticas.totalAvaliacoes < 5) {
      insights.push({
        tipo: 'sugestao',
        titulo: 'Explore mais conteúdos',
        descricao: 'Interagir com mais conteúdos pode ajudar no seu desenvolvimento pessoal.'
      });
    }

    const response = {
      success: true,
      data: {
        periodo: {
          dias: diasPeriodo,
          dataInicio: dataInicio,
          dataFim: new Date()
        },
        analytics: analyticsData,
        insights: insights
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Erro ao buscar dados de analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Usar o serviço de insights para gerar insights proativos
    const insightsData = await insightsService.generateProactiveInsights(userId);

    res.json({
      success: true,
      data: insightsData
    });

  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
