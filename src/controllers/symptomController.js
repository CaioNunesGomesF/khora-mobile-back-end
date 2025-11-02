import * as symptomService from '../service/symptom_service.js';

export async function assess(req, res) {
  try {
    // Accept either { symptoms: ['a','b'] } or { answers: { symptom:true } }
    const body = req.body || {};
    let input = null;
    if (Array.isArray(body.symptoms)) input = body.symptoms;
    else if (body.answers && typeof body.answers === 'object') input = body.answers;
    else if (body.symptoms && typeof body.symptoms === 'object') input = body.symptoms;
    else input = body; // fallback to whole body

    const result = symptomService.assessSymptoms(input);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error in symptom assessment:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

export default { assess };
