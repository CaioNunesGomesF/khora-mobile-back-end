import path from 'path';
// ...existing code...
// Detalhes de exercício de respiração
export async function getBreathing(req, res) {
  try {
    const { id } = req.params;
    const exercise = await ReliefService.getBreathingById(Number(id));
    if (!exercise) return res.status(404).json({ error: 'Exercício não encontrado' });
    return res.json(exercise);
  } catch (err) {
    console.error('Erro getBreathing:', err);
    return res.status(500).json({ error: 'Erro ao obter exercício' });
  }
}

// Detalhes de áudio relaxante
export async function getAudio(req, res) {
  try {
    const { id } = req.params;
    const audio = await ReliefService.getAudioById(Number(id));
    if (!audio) return res.status(404).json({ error: 'Áudio não encontrado' });
    return res.json(audio);
  } catch (err) {
    console.error('Erro getAudio:', err);
    return res.status(500).json({ error: 'Erro ao obter áudio' });
  }
}

// Servir arquivo de áudio
export async function serveAudioFile(req, res) {
  try {
    const { filename } = req.params;
    const filePath = path.resolve('src/public/audio', filename);
    return res.sendFile(filePath);
  } catch (err) {
    console.error('Erro serveAudioFile:', err);
    return res.status(404).json({ error: 'Arquivo não encontrado' });
  }
}
import * as ReliefService from '../service/relief_service.js';

/**
 * Controller: listAudio
 * Endpoint: GET /api/relief/audio
 * Retorna um JSON com a lista de áudios disponíveis. Os caminhos em `src`
 * apontam para arquivos servidos pelo middleware estático (ex: /assets/audio/..).
 *
 * Erros são capturados e retornam 500 com mensagem genérica — o erro detalhado é
 * logado no servidor para debugging.
 */
export async function listAudio(req, res) {
  try {
    const audios = ReliefService.getAudioList();
    // Envia os dados no formato { data: [...] } seguindo a convenção do projeto
    return res.json({ data: audios });
  } catch (err) {
    console.error('Erro listAudio:', err);
    return res.status(500).json({ error: 'Erro ao obter lista de áudios' });
  }
}

/**
 * Controller: listBreathing
 * Endpoint: GET /api/relief/breathing
 * Retorna um JSON com as 'receitas' de exercícios de respiração. Cada item
 * contém passos com duração em segundos e um número de ciclos.
 */
export async function listBreathing(req, res) {
  try {
    const exercises = ReliefService.getBreathingExercises();
    return res.json({ data: exercises });
  } catch (err) {
    console.error('Erro listBreathing:', err);
    return res.status(500).json({ error: 'Erro ao obter exercícios de respiração' });
  }
}
