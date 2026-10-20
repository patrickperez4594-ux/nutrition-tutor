import { applySection } from '../kefi/MeScreen';
import { normalizeProfile } from '../domain/profile';

test('saving a section does not revert settings changed elsewhere while it was open', () => {
  const draft = normalizeProfile({ goals: { intents: ['protein'] } });
  const latest = normalizeProfile({ presentation: { lowEnergy: true }, restrictions: [{ id: 'a', label: 'sesame', kind: 'allergy' }] });
  const result = applySection('goals', latest, draft);
  expect(result.goals.intents).toEqual(['protein']);
  expect(result.presentation.lowEnergy).toBe(true);
  expect(result.restrictions).toHaveLength(1);
});

test('teaching and response-length sections each update only their own learning fields', () => {
  const latest = normalizeProfile({ learning: { teachingStyle: 'why', responseLength: 'detailed', overwhelm: 'one-pick' } });
  const draft = normalizeProfile({ learning: { teachingStyle: 'short', responseLength: 'short', overwhelm: '' } });
  expect(applySection('length', latest, draft).learning).toEqual({ teachingStyle: 'why', responseLength: 'short', overwhelm: 'one-pick' });
  expect(applySection('teaching', latest, draft).learning).toEqual({ teachingStyle: 'short', responseLength: 'detailed', overwhelm: '' });
});
