import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

// Retorna perguntas do quiz
async function getQuizQuestions(req, res) {
  try {
    const questions = await prisma.quizQuestion.findMany({
      include: { options: true }
    });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Valida resposta do usuário
async function checkQuizAnswer(req, res) {
  try {
    const { questionId, optionId } = req.body;
    const option = await prisma.quizOption.findFirst({
      where: { id: optionId, questionId }
    });
    if (!option) {
      return res.status(404).json({ correct: false, message: 'Alternativa não encontrada.' });
    }
    res.json({ correct: option.isCorrect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {
  getQuizQuestions,
  checkQuizAnswer
};
