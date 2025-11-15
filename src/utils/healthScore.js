// Algoritmo de cálculo do Health Score Dinâmico
// Considera: exercícios, sono, meditação, check-in de humor

/**
 * Calcula o Health Score diário do usuário.
 * @param {Object} data - Dados do usuário no dia
 * @param {number} data.exerciseMinutes - Minutos de exercício
 * @param {number} data.sleepHours - Horas de sono
 * @param {number} data.meditationMinutes - Minutos de meditação
 * @param {string} data.mood - Humor do usuário ('bom', 'ok', 'ruim')
 * @returns {number} Pontuação de saúde (0-100)
 */
export function calculateHealthScore({ exerciseMinutes = 0, sleepHours = 0, meditationMinutes = 0, mood = 'ok' }) {
  let score = 50;

  // Exercício: até +20 pontos
  if (exerciseMinutes >= 30) score += 20;
  else if (exerciseMinutes >= 10) score += 10;
  else if (exerciseMinutes > 0) score += 5;

  // Sono: até +20 pontos
  if (sleepHours >= 8) score += 20;
  else if (sleepHours >= 6) score += 10;
  else if (sleepHours > 0) score += 5;

  // Meditação: até +5 pontos
  if (meditationMinutes >= 15) score += 5;
  else if (meditationMinutes >= 5) score += 2;

  // Humor: até +5 ou -10 pontos
  if (mood === 'bom') score += 5;
  else if (mood === 'ruim') score -= 10;

  // Limita entre 0 e 100
  score = Math.max(0, Math.min(100, score));
  return score;
}
