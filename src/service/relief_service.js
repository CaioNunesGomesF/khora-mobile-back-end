// Serviço: ferramentas de alívio de estresse
// Este arquivo fornece dados estáticos usados pelo front-end para:
// - listar áudios relaxantes disponíveis (referência para arquivos em /assets/audio)
// - fornecer "receitas" de exercícios de respiração (passos e durações)
//
// NOTA: Em produção estes dados podem vir de um banco de dados ou CMS. Aqui
// usamos um array estático para simplicidade e testes.

// Lista de áudios disponíveis. Cada objeto contém metadados e o caminho público
// (campo `src`) que será servido pelo middleware estático configurado em index.js
const audioList = [
  {
    id: 1,
    title: 'Mar calmo',
    description: 'Som relaxante de ondas suaves na praia',
    // servido via middleware estático em /assets/audio
    src: '/assets/audio/relaxing_sound_1.mp3',
    duration_seconds: 120
  },
  {
    id: 2,
    title: 'Chuva leve',
    description: 'Chuva suave para relaxamento',
    src: '/assets/audio/relaxing_sound_2.mp3',
    duration_seconds: 180
  }
];

const breathingExercises = [
  {
    id: 'box_breathing',
    name: 'Respiração em Caixa (Box)',
    description: 'Respire de forma controlada em quatro tempos iguais: inspirar, segurar, expirar, segurar.',
    // `steps` descreve cada ação e sua duração em segundos. `cycles` é quantas vezes
    // repetir a sequência (útil para o front-end apresentar um contador).
    steps: [
      { step: 'Inspire', duration_seconds: 4 },
      { step: 'Segure', duration_seconds: 4 },
      { step: 'Expire', duration_seconds: 4 },
      { step: 'Segure', duration_seconds: 4 }
    ],
    cycles: 4
  },
  {
    id: '4_7_8',
    name: 'Respiração 4-7-8',
    description: 'Técnica para acalmar o sistema nervoso. Inspire, segure e expire em durações 4-7-8.',
    steps: [
      { step: 'Inspire', duration_seconds: 4 },
      { step: 'Segure', duration_seconds: 7 },
      { step: 'Expire', duration_seconds: 8 }
    ],
    cycles: 3
  },
  {
    id: 'paced_breathing',
    name: 'Respiração Guiada (Paced)',
    description: 'Respire lentamente com ritmo controlado para reduzir a frequência cardíaca.',
    steps: [
      { step: 'Inspire', duration_seconds: 5 },
      { step: 'Expire', duration_seconds: 5 }
    ],
    cycles: 5
  }
];

// Retorna a lista de áudios. Mantemos função simples e síncrona para fácil teste.
export function getAudioList() {
  return audioList;
}

// Retorna as receitas de exercícios de respiração.
export function getBreathingExercises() {
  return breathingExercises;
}
