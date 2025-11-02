import { assessSymptoms } from '../service/symptom_service.js';

describe('symptom_service.assessSymptoms', () => {
  test('should suggest Cardiologist for chest pain + shortness_of_breath', () => {
    const input = ['chest_pain', 'shortness_of_breath'];
    const res = assessSymptoms(input);
    expect(res).toHaveProperty('specialist');
    expect(res.specialist).toBe('Cardiologist');
    expect(res.matched).toEqual(expect.arrayContaining(['chest_pain', 'shortness_of_breath']));
    expect(res.confidence).toBeGreaterThan(0);
  });

  test('should fallback to GP with low confidence when unknown symptoms provided', () => {
    const input = ['some_rare_symptom_xyz'];
    const res = assessSymptoms(input);
    expect(res.specialist).toBe('General Practitioner / Family Doctor');
    expect(res.confidence).toBeGreaterThanOrEqual(0);
  });
});
