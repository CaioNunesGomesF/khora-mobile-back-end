import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Salvar registro de humor
async function saveMood(req, res) {
  try {
    const { mood, origin } = req.body;
    const userId = req.user.id;
    const entry = await prisma.moodEntry.create({
      data: { userId, mood, origin }
    });
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
