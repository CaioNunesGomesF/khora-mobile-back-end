import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const CHECKUP_RULES = [
  { nome: 'Exame de colesterol', idadeMin: 18, idadeMax: 150, intervaloDias: 365 },
  { nome: 'Exame de glicemia (jejum)', idadeMin: 35, idadeMax: 150, intervaloDias: 365 },
  { nome: 'PSA (homens)', idadeMin: 50, idadeMax: 75, intervaloDias: 365 * 2 },
  { nome: 'Pressão arterial', idadeMin: 18, idadeMax: 150, intervaloDias: 365 }
];

class CheckupService {
  async getTimelineForUser(userId) {
    // buscar perfil do usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { perfil_usuario: true }
    });

    if (!user) throw new Error('Usuário não encontrado');

    const idade = user.perfil_usuario?.data_nascimento
      ? this.calculateAge(user.perfil_usuario.data_nascimento)
      : null;

    const today = new Date();
    const timeline = [];

    for (const rule of CHECKUP_RULES) {
      if (idade === null || (idade >= rule.idadeMin && idade <= rule.idadeMax)) {
        // calcular próxima data recomendada com base em next_send ou padrão
        const prox = new Date(today.getTime() + rule.intervaloDias * 24 * 60 * 60 * 1000);
        timeline.push({
          nome: rule.nome,
          recomendadoAPartirIdade: rule.idadeMin,
          recomendadoAteIdade: rule.idadeMax,
          intervaloDias: rule.intervaloDias,
          proximaData: prox,
          recomendado: true
        });
      }
    }

    // Ordenar por próxima data
    timeline.sort((a, b) => a.proximaData - b.proximaData);

    return { idade, timeline };
  }

  calculateAge(dateString) {
    const nascimento = new Date(dateString);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
    return idade;
  }

  // Listar checkups do usuário
  async listUserCheckups(userId) {
    if (!prisma.user_checkup) {
      throw new Error('Prisma client missing model "user_checkup". Execute `npx prisma generate` and restart the server.');
    }
    return prisma.user_checkup.findMany({ where: { user_id: userId }, orderBy: { data_prevista: 'asc' } });
  }

  // Criar um checkup para o usuário
  async addUserCheckup(userId, payload) {
    // Verifica se o usuário existe para evitar erro de FK (P2003)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      const err = new Error('Usuário não encontrado');
      err.code = 'USER_NOT_FOUND';
      throw err;
    }

    // Validação mínima do payload
    if (!payload || !payload.nome) {
      const err = new Error('Campo "nome" é obrigatório');
      err.code = 'INVALID_PAYLOAD';
      throw err;
    }

    if (!payload.data_prevista) {
      const err = new Error('Campo "data_prevista" é obrigatório');
      err.code = 'INVALID_PAYLOAD';
      throw err;
    }

    // Converter data_prevista para Date se necessário
    let dataPrev = payload.data_prevista;
    if (typeof dataPrev === 'string') {
      const parsed = new Date(dataPrev);
      if (Number.isNaN(parsed.getTime())) {
        const err = new Error('Campo "data_prevista" deve ser uma data válida');
        err.code = 'INVALID_PAYLOAD';
        throw err;
      }
      dataPrev = parsed;
    }

    return prisma.user_checkup.create({ data: { user_id: userId, nome: payload.nome, descricao: payload.descricao ?? null, data_prevista: dataPrev, lembrete_ativo: payload.lembrete_ativo ?? true } });
  }

  // Atualizar checkup do usuário
  async updateUserCheckup(userId, checkupId, payload) {
    // garantir que o checkup pertence ao usuário
    const existing = await prisma.user_checkup.findUnique({ where: { id: checkupId } });
    if (!existing || existing.user_id !== userId) throw new Error('Checkup não encontrado ou não pertence ao usuário');
    return prisma.user_checkup.update({ where: { id: checkupId }, data: payload });
  }

  // Deletar checkup
  async deleteUserCheckup(userId, checkupId) {
    const existing = await prisma.user_checkup.findUnique({ where: { id: checkupId } });
    if (!existing || existing.user_id !== userId) throw new Error('Checkup não encontrado ou não pertence ao usuário');
    return prisma.user_checkup.delete({ where: { id: checkupId } });
  }
}

export default new CheckupService();
