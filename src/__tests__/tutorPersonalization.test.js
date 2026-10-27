import { createEmptyProfile, normalizeProfile } from '../domain/profile';
import { emptyPersonalization } from '../lib/personalization';
import { toTutorPersonalization } from '../kefi/tutorPersonalization';

const rich = normalizeProfile({
  goals: { intents: ['protein', 'budget'], custom: 'train for a 5k' },
  restrictions: [
    { id: 'a', label: 'peanuts', kind: 'allergy' },
    { id: 'b', label: 'lactose', kind: 'intolerance' },
    { id: 'c', label: 'pork', kind: 'avoid' },
    { id: 'd', label: 'olives', kind: 'dislike' }
  ],
  foodPreferences: { enjoy: 'rice and beans' },
  cuisine: { enjoyed: 'Dominican food' },
  cooking: { skill: 'beginner', equipment: ['microwave'] },
  budget: { mode: 'strict', amountMinor: 6050, period: 'week' },
  learning: { teachingStyle: 'why', responseLength: 'short' },
  locale: { currency: 'USD', measurement: 'imperial', energyUnit: 'kcal' },
  accessibility: { textSize: 'larger', theme: 'dark' },
  privacy: { rememberOnDevice: true }
});

test('an empty profile maps to the V1 empty personalization', () => {
  expect(toTutorPersonalization(createEmptyProfile())).toEqual(emptyPersonalization());
});

test('keeps the V1 personalization shape for the unchanged /api/chat contract', () => {
  expect(Object.keys(toTutorPersonalization(rich)).sort()).toEqual(Object.keys(emptyPersonalization()).sort());
});

test('maps goals, teaching style, and context', () => {
  const result = toTutorPersonalization(rich);
  expect(result.goal).toBe('Get more protein; Eat on a budget; train for a 5k');
  expect(result.learningStyle).toBe('Teach me why; short responses');
  expect(result.foodContext).toMatch(/Enjoys: rice and beans/);
  expect(result.foodContext).toMatch(/Cuisines\/dishes they enjoy: Dominican food/);
  expect(result.otherContext).toMatch(/Budget: strict limit, 60.50 USD per week/);
  expect(result.otherContext).toMatch(/Use imperial units/);
});

test('allergies are always labelled as hard constraints and kept distinct from dislikes', () => {
  const { foodContext } = toTutorPersonalization(rich);
  expect(foodContext).toMatch(/ALLERGIES \(hard constraint, must always avoid\): peanuts/);
  expect(foodContext).toMatch(/Must avoid .*: pork/);
  expect(foodContext).toMatch(/Intolerances .*: lactose/);
  expect(foodContext).toMatch(/Dislikes \(preference only\): olives/);
});

test('Detour Mode shortens presentation but never drops constraints', () => {
  const result = toTutorPersonalization({ ...rich, presentation: { lowEnergy: true } });
  expect(result.learningStyle).toMatch(/one clear next step/);
  expect(result.otherContext).toMatch(/Detour Mode is on.*without reducing safety, accuracy, or constraint handling/);
  expect(JSON.stringify(result)).not.toMatch(/Low-Energy/i);
  expect(result.foodContext).toMatch(/ALLERGIES .*peanuts/);
});

test('does not send display, privacy, or onboarding settings to the tutor', () => {
  const serialized = JSON.stringify(toTutorPersonalization(rich));
  expect(serialized).not.toMatch(/larger|dark|rememberOnDevice|onboarding/i);
});

test('budget without a currency is flagged instead of assuming dollars', () => {
  const result = toTutorPersonalization(normalizeProfile({ budget: { mode: 'flexible', amountMinor: 4000, period: 'month' } }));
  expect(result.otherContext).toMatch(/40 \(currency not specified\) per month/);
  expect(result.otherContext).not.toMatch(/\$|USD/);
});
