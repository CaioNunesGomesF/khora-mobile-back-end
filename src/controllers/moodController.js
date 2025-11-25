import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Salvar registro de humor
async function saveMood(req, res) {
  try {
    const { mood, origin } = req.body;
    const userId = req.user.id;
    // Salva o registro de humor
    const entry = await prisma.moodEntry.create({
      data: { userId, mood, origin }
    });

    // Busca todos os registros de humor do usuário
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId }
    });

    // Mapeia o valor do humor para o score
    const moodValueMap = {
      'Felicidade': 100,
      'Tristeza': 30,
      'Neutro': 60,
      'Nojo': 40,
      'Medo': 35,
      'Raiva': 20,
      'Surpresa': 70
    };
    const moods = moodEntries.map(e => moodValueMap[e.mood] ?? 50);
    const healthScore = moods.length > 0 ? Math.round(moods.reduce((a, b) => a + b, 0) / moods.length) : null;

    // Atualiza o Health Score do usuário
    if (healthScore !== null) {
      await prisma.healthScore.upsert({
        where: { userId },
        update: { score: healthScore },
        create: { userId, score: healthScore }
      });
    }

    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Listar registros de humor do usuário
async function listMood(req, res) {
  try {
    const userId = req.user.id;
    const entries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  saveMood,
  listMood
};
