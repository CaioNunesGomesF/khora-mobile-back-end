import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

class InsightsService {

  async generateProactiveInsights(userId) {
    try {
      const insights = [];

      // Buscar todos os dados necessários
      const userData = await this.getUserCompleteData(userId);

      // Gerar diferentes tipos de insights
      const habitInsights = await this.generateHabitInsights(userData);
      const healthInsights = await this.generateHealthInsights(userData);
      const engagementInsights = await this.generateEngagementInsights(userData);
      const goalInsights = await this.generateGoalInsights(userData);
      const socialInsights = await this.generateSocialInsights(userData);

      insights.push(...habitInsights);
      insights.push(...healthInsights);
      insights.push(...engagementInsights);
      insights.push(...goalInsights);
      insights.push(...socialInsights);

      // Ordenar insights por prioridade
      insights.sort((a, b) => (b.prioridade || 0) - (a.prioridade || 0));

      return {
        insights: insights.slice(0, 10), // Retornar apenas os 10 principais
        geradoEm: new Date(),
        proximaAtualizacao: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
      };

    } catch (error) {
      console.error('Erro ao gerar insights proativos:', error);
      throw error;
    }
  }

  async getUserCompleteData(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        perfil_usuario: true,
        progresso_habito: {
          include: { habito: true }
        },
        user_conquista: {
          include: { conquista: true }
        },
        user_doenca: {
          include: { doenca: true }
        },
        avaliacoes: {
          include: {
            conteudo: {
              include: {
                categoria: true,
                tipo_conteudo: true
              }
            }
          }
        }
      }
    });

    return user;
  }

  async generateHabitInsights(userData) {
    const insights = [];
    const habitos = userData.progresso_habito || [];

    if (habitos.length === 0) {
      insights.push({
        tipo: 'sugestao',
        categoria: 'habitos',
        titulo: 'Comece sua jornada',
        descricao: 'Que tal adicionar seu primeiro hábito para abandonar? Começar é o primeiro passo!',
        acao: 'Adicionar hábito',
        prioridade: 8,
        icone: '🚀'
      });
      return insights;
    }

    // Insight sobre streaks longos
    for (const habito of habitos) {
      if (!habito.ultima_recaida) {
        const diasSemHabito = Math.floor((new Date() - habito.data_inicio) / (1000 * 60 * 60 * 24));

        if (diasSemHabito >= 30 && diasSemHabito < 60) {
          insights.push({
            tipo: 'parabenizacao',
            categoria: 'habitos',
            titulo: 'Milestone de 1 mês!',
            descricao: `Parabéns! Você completou ${diasSemHabito} dias sem ${habito.habito.nome}. Continue assim!`,
            prioridade: 9,
            icone: '🎉'
          });
        } else if (diasSemHabito >= 100) {
          insights.push({
            tipo: 'conquista',
            categoria: 'habitos',
            titulo: 'Centenário!',
            descricao: `Incrível! ${diasSemHabito} dias sem ${habito.habito.nome}. Você é uma inspiração!`,
            prioridade: 10,
            icone: '👑'
          });
        }
      }
    }

    // Insight sobre recaídas recentes
    const recaidasRecentes = habitos.filter(h => {
      if (!h.ultima_recaida) return false;
      const diasDesdeRecaida = Math.floor((new Date() - h.ultima_recaida) / (1000 * 60 * 60 * 24));
      return diasDesdeRecaida <= 7;
    });

    if (recaidasRecentes.length > 0) {
      insights.push({
        tipo: 'motivacao',
        categoria: 'habitos',
        titulo: 'Não desista!',
        descricao: 'Recaídas fazem parte do processo. O importante é recomeçar. Você consegue!',
        acao: 'Ver dicas de recuperação',
        prioridade: 7,
        icone: '💪'
      });
    }

    // Insight sobre economia
    const economiaTotal = habitos.reduce((sum, h) => {
      if (h.custo_diario_habito) {
        const diasSemHabito = h.ultima_recaida
          ? Math.floor((h.ultima_recaida - h.data_inicio) / (1000 * 60 * 60 * 24))
          : Math.floor((new Date() - h.data_inicio) / (1000 * 60 * 60 * 24));
        return sum + (parseFloat(h.custo_diario_habito) * Math.max(0, diasSemHabito));
      }
      return sum;
    }, 0);

    if (economiaTotal >= 100) {
      insights.push({
        tipo: 'economia',
        categoria: 'habitos',
        titulo: 'Dinheiro bem economizado!',
        descricao: `Você já economizou R$ ${economiaTotal.toFixed(2)}! Que tal investir em algo saudável?`,
        prioridade: 6,
        icone: '💰'
      });
    }

    return insights;
  }

  async generateHealthInsights(userData) {
    const insights = [];
    const perfil = userData.perfil_usuario;

    if (!perfil) {
      insights.push({
        tipo: 'sugestao',
        categoria: 'saude',
        titulo: 'Complete seu perfil',
        descricao: 'Adicione suas informações de saúde para receber insights personalizados.',
        acao: 'Completar perfil',
        prioridade: 5,
        icone: '📝'
      });
      return insights;
    }

    // Insight sobre IMC
    if (perfil.altura_cm && perfil.peso_kg) {
      const alturaMetros = perfil.altura_cm / 100;
      const imc = parseFloat(perfil.peso_kg) / (alturaMetros * alturaMetros);

      if (imc < 18.5) {
        insights.push({
          tipo: 'alerta',
          categoria: 'saude',
          titulo: 'IMC abaixo do ideal',
          descricao: 'Seu IMC indica baixo peso. Considere consultar um nutricionista.',
          prioridade: 7,
          icone: '⚠️'
        });
      } else if (imc >= 25 && imc < 30) {
        insights.push({
          tipo: 'atencao',
          categoria: 'saude',
          titulo: 'Atenção ao peso',
          descricao: 'Seu IMC indica sobrepeso. Que tal focar em hábitos alimentares saudáveis?',
          prioridade: 6,
          icone: '⚖️'
        });
      } else if (imc >= 30) {
        insights.push({
          tipo: 'alerta',
          categoria: 'saude',
          titulo: 'Cuidado com o peso',
          descricao: 'Seu IMC indica obesidade. Recomendamos buscar acompanhamento médico.',
          prioridade: 8,
          icone: '🏥'
        });
      } else if (imc >= 18.5 && imc < 25) {
        insights.push({
          tipo: 'positivo',
          categoria: 'saude',
          titulo: 'IMC ideal!',
          descricao: 'Parabéns! Seu IMC está na faixa ideal. Continue mantendo hábitos saudáveis.',
          prioridade: 4,
          icone: '✅'
        });
      }
    }

    // Insight sobre idade e check-ups
    if (perfil.data_nascimento) {
      const idade = Math.floor((new Date() - perfil.data_nascimento) / (1000 * 60 * 60 * 24 * 365));

      if (idade >= 40) {
        insights.push({
          tipo: 'preventivo',
          categoria: 'saude',
          titulo: 'Check-up anual',
          descricao: 'Após os 40, é importante fazer check-ups médicos anuais. Quando foi o último?',
          prioridade: 5,
          icone: '🩺'
        });
      }
    }

    return insights;
  }

  async generateEngagementInsights(userData) {
    const insights = [];
    const avaliacoes = userData.avaliacoes || [];

    if (avaliacoes.length === 0) {
      insights.push({
        tipo: 'sugestao',
        categoria: 'engajamento',
        titulo: 'Explore conteúdos',
        descricao: 'Temos diversos conteúdos sobre saúde. Que tal explorar alguns?',
        acao: 'Ver conteúdos',
        prioridade: 3,
        icone: '📚'
      });
    } else if (avaliacoes.length < 5) {
      insights.push({
        tipo: 'sugestao',
        categoria: 'engajamento',
        titulo: 'Continue explorando',
        descricao: 'Você já avaliou alguns conteúdos. Continue explorando para mais conhecimento!',
        prioridade: 2,
        icone: '🔍'
      });
    }

    // Insight sobre ratings
    if (avaliacoes.length > 0) {
      const ratingMedio = avaliacoes.reduce((sum, a) => sum + a.rating, 0) / avaliacoes.length;

      if (ratingMedio >= 4) {
        insights.push({
          tipo: 'positivo',
          categoria: 'engajamento',
          titulo: 'Você gosta do nosso conteúdo!',
          descricao: 'Suas avaliações mostram que você está gostando. Continue explorando!',
          prioridade: 3,
          icone: '⭐'
        });
      }
    }

    return insights;
  }

  async generateGoalInsights(userData) {
    const insights = [];
    const habitos = userData.progresso_habito || [];

    // Verificar se há metas pessoais definidas
    const habitosComMeta = habitos.filter(h => h.meta_pessoal);
    const habitosSemMeta = habitos.filter(h => !h.meta_pessoal);

    if (habitosSemMeta.length > 0) {
      insights.push({
        tipo: 'sugestao',
        categoria: 'metas',
        titulo: 'Defina suas metas',
        descricao: `Você tem ${habitosSemMeta.length} hábito(s) sem meta pessoal. Definir metas ajuda na motivação!`,
        acao: 'Definir metas',
        prioridade: 4,
        icone: '🎯'
      });
    }

    return insights;
  }

  async generateSocialInsights(userData) {
    const insights = [];
    const conquistas = userData.user_conquista || [];

    // Comparar com média de outros usuários (exemplo)
    if (conquistas.length >= 5) {
      insights.push({
        tipo: 'social',
        categoria: 'conquistas',
        titulo: 'Você está acima da média!',
        descricao: `Com ${conquistas.length} conquistas, você está no top 20% dos usuários mais ativos!`,
        prioridade: 5,
        icone: '🏆'
      });
    }

    return insights;
  }

  async generateTemporalInsights(userId) {
    const insights = [];

    // Buscar padrões de recaída por dia da semana
    const recaidasPorDia = await prisma.progresso_habito.groupBy({
      by: ['ultima_recaida'],
      where: {
        user_id: userId,
        ultima_recaida: { not: null }
      }
    });

    // Análise de padrões (exemplo simples)
    if (recaidasPorDia.length > 3) {
      insights.push({
        tipo: 'padrao',
        categoria: 'temporal',
        titulo: 'Padrão identificado',
        descricao: 'Identificamos que você tem mais recaídas aos finais de semana. Que tal preparar estratégias?',
        prioridade: 6,
        icone: '📅'
      });
    }

    return insights;
  }
}

export default new InsightsService();
