import { getAudioList, getBreathingExercises } from '../service/relief_service.js';

describe('relief_service', () => {
  test('getAudioList returns array with audio items containing src and title', () => {
    const audios = getAudioList();
    expect(Array.isArray(audios)).toBe(true);
    expect(audios.length).toBeGreaterThan(0);
    expect(audios[0]).toHaveProperty('src');
    expect(audios[0]).toHaveProperty('title');
  });

  test('getBreathingExercises returns array with expected structure', () => {
    const exercises = getBreathingExercises();
    expect(Array.isArray(exercises)).toBe(true);
    expect(exercises.length).toBeGreaterThan(0);
    const ex = exercises[0];
    expect(ex).toHaveProperty('id');
    expect(ex).toHaveProperty('name');
    expect(ex).toHaveProperty('steps');
    expect(Array.isArray(ex.steps)).toBe(true);
  });
});
