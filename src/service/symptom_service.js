// Serviço simples de árvore de decisão para sugerir especialista com base em sintomas
// Entrada: array de sintomas (strings) ou objeto de respostas (symptom:true/false)
// Saída: { specialist, confidence, matched, reasons }

function normalizeSymptoms(input) {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(s => String(s).toLowerCase());
  if (typeof input === 'object') return Object.keys(input).filter(k => input[k]).map(k => String(k).toLowerCase());
  return [];
}

const RULES = [
  {
    specialist: 'Cardiologist',
    keywords: ['chest_pain', 'pressure_in_chest', 'shortness_of_breath', 'palpitations', 'fainting'],
    threshold: 1,
    advice: 'Se houver dor intensa no peito ou falta de ar grave, considere atendimento de emergência.'
  },
  {
    specialist: 'Pulmonologist / Infectious Diseases',
    keywords: ['cough', 'fever', 'shortness_of_breath', 'wheezing'],
    threshold: 1,
    advice: 'Tosse com febre pode indicar infecção respiratória; procure avaliação médica.'
  },
  {
    specialist: 'Neurologist',
    keywords: ['severe_headache', 'weakness', 'numbness', 'vision_loss', 'confusion', 'sudden_speech_difficulty'],
    threshold: 1,
    advice: 'Sinais neurológicos súbitos requerem avaliação imediata.'
  },
  {
    specialist: 'Gastroenterologist',
    keywords: ['abdominal_pain', 'nausea', 'vomiting', 'diarrhea', 'blood_in_stool'],
    threshold: 1,
    advice: 'Dor abdominal persistente ou vômitos recorrentes precisam de avaliação.'
  },
  {
    specialist: 'ENT (Otolaryngologist)',
    keywords: ['ear_pain', 'sore_throat', 'nasal_congestion', 'loss_of_smell'],
    threshold: 1,
    advice: 'Sintomas otorrinolaringológicos podem ser tratados por ENT.'
  },
  {
    specialist: 'Dermatologist',
    keywords: ['rash', 'skin_lesion', 'itching', 'blister'],
    threshold: 1,
    advice: 'Lesões de pele devem ser avaliadas por dermatologista.'
  },
  {
    specialist: 'Psychiatrist / Psychologist',
    keywords: ['anxiety', 'depression', 'insomnia', 'mood_swings', 'panic_attacks'],
    threshold: 1,
    advice: 'Transtornos de humor e ansiedade podem requerer acompanhamento especializado.'
  },
  {
    specialist: 'Orthopedist / Physiotherapist',
    keywords: ['joint_pain', 'back_pain', 'muscle_pain', 'swelling_after_injury'],
    threshold: 1,
    advice: 'Dor musculoesquelética com limitação funcional pode precisar de ortopedista ou fisioterapia.'
  },
  {
    specialist: 'Urologist',
    keywords: ['burning_urination', 'blood_in_urine', 'frequent_urination', 'pelvic_pain'],
    threshold: 1,
    advice: 'Sintomas urinários podem indicar infecção ou outra condição urológica.'
  },
  {
    specialist: 'Gynecologist',
    keywords: ['vaginal_bleeding', 'pelvic_pain_female', 'abnormal_discharge', 'missed_period'],
    threshold: 1,
    advice: 'Sintomas ginecológicos devem ser avaliados por ginecologista.'
  },
  {
    specialist: 'General Practitioner / Family Doctor',
    keywords: [],
    threshold: 0,
    advice: 'Quando em dúvida, procure um clínico geral para triagem inicial.'
  }
];

export function assessSymptoms(input) {
  const symptoms = normalizeSymptoms(input);

  // Build matches per rule
  const scored = RULES.map(rule => {
    const matched = rule.keywords.filter(k => symptoms.includes(k));
    const score = rule.keywords.length > 0 ? matched.length / rule.keywords.length : 0;
    return {
      specialist: rule.specialist,
      matched,
      score,
      advice: rule.advice
    };
  });

  // Choose best rule: highest score, tie-breaker by number of matched keywords
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.matched.length - a.matched.length;
  });

  const best = scored[0];

  // Compute a confidence: simple mapping from score
  const confidence = Math.min(1, Math.round((best.score || 0) * 100) / 100);

  // If nothing matched (score 0) and there are symptoms, fallback to GP with low confidence
  if (best.score === 0 && symptoms.length > 0) {
    return {
      specialist: 'General Practitioner / Family Doctor',
      confidence: 0.3,
      matched: [],
      advice: 'Nenhum padrão claro identificado — consulte um clínico geral para triagem.'
    };
  }

  return {
    specialist: best.specialist,
    confidence: confidence,
    matched: best.matched,
    advice: best.advice
  };
}

export default { assessSymptoms };
