// Listar times do usuário
async function listUserTeams(req, res) {
  try {
    const userId = req.user.id;
    // Busca times onde o usuário é membro
    const teams = await prisma.team.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      include: {
        members: true,
        challenges: true
      }
    });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Criação de grupo
async function createTeam(req, res) {
  try {
    const { name, description } = req.body;
    const ownerId = req.user.id;
    const team = await prisma.team.create({
      data: {
        name,
        description,
        ownerId,
        members: {
          create: [{ userId: ownerId }]
        }
      }
    });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Convidar usuário para grupo
async function inviteToTeam(req, res) {
  try {
    const { teamId, userId } = req.body;
    // Verifica se o usuário já é membro
    const exists = await prisma.teamMember.findFirst({
      where: { teamId, userId }
    });
    if (exists) {
      return res.status(400).json({ error: 'Usuário já é membro do grupo.' });
    }
    const member = await prisma.teamMember.create({
      data: { teamId, userId }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Criar desafio no grupo
async function createChallenge(req, res) {
  try {
    const { teamId, title, description, startDate, endDate } = req.body;
    const challenge = await prisma.challenge.create({
      data: {
        teamId,
        title,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      }
    });
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export {
  createTeam,
  inviteToTeam,
  createChallenge,
  listUserTeams
};
