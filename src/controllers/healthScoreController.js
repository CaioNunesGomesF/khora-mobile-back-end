import { calculateHealthScore } from '../utils/healthScore.js';
import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Retorna o Health Score dinâmico do usuário logado
export async function getUserHealthScore(req, res) {
	try {
		const userId = req.user.id;
		// Buscar dados do dia: apenas humor (MoodEntry)
		const today = new Date();
		today.setHours(0,0,0,0);
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		// Humor (último check-in de humor do dia)
		const moodEntry = await prisma.MoodEntry.findFirst({
			where: { userId, createdAt: { gte: today, lt: tomorrow } },
			orderBy: { createdAt: 'desc' }
		});
		const mood = moodEntry?.mood || 'ok';

	// Adapta o cálculo para usar apenas humor
	const score = calculateHealthScore({ mood });
	res.json({ score, details: { mood } });
	} catch (error) {
		res.status(500).json({ error: 'Erro ao calcular Health Score', details: error.message });
	}
}
