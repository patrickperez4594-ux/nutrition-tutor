import {
  clearPersonalization,
  createEmptyProfile,
  formatMinorAmount,
  hardConstraints,
  normalizeProfile,
  parseAmountToMinor,
  updateProfileDomain
} from '../domain/profile';

test('empty profile requires nothing and is private by default', () => {
  const profile = createEmptyProfile();
  expect(profile.goals.intents).toEqual([]);
  expect(profile.restrictions).toEqual([]);
  expect(profile.privacy.rememberOnDevice).toBe(false);
  expect(profile.presentation.lowEnergy).toBe(false);
  expect(profile.onboarding.completed).toBe(false);
});

test('normalization rejects unknown option values and trims text', () => {
  const profile = normalizeProfile({
    goals: { intents: ['protein', 'win-at-life', 'budget'], custom: '  run a 5k  ' },
    learning: { teachingStyle: 'shout', responseLength: 'short' },
    cooking: { skill: 'chef', equipment: ['oven', 'laser'] },
    accessibility: { theme: 'neon' }
  });
  expect(profile.goals).toEqual({ intents: ['protein', 'budget'], custom: 'run a 5k' });
  expect(profile.learning.teachingStyle).toBe('auto');
  expect(profile.learning.responseLength).toBe('short');
  expect(profile.cooking.skill).toBe('');
  expect(profile.cooking.equipment).toEqual(['oven']);
  expect(profile.accessibility.theme).toBe('system');
});

test('restrictions keep their labels and kinds', () => {
  const profile = normalizeProfile({
    restrictions: [
      { id: 'a', label: ' peanuts ', kind: 'allergy' },
      { id: 'b', label: 'lactose', kind: 'intolerance' },
      { id: 'c', label: 'pork', kind: 'avoid' },
      { id: 'd', label: 'olives', kind: 'dislike' }
    ]
  });
  expect(profile.restrictions.map((r) => [r.label, r.kind])).toEqual([
    ['peanuts', 'allergy'], ['lactose', 'intolerance'], ['pork', 'avoid'], ['olives', 'dislike']
  ]);
  expect(hardConstraints(profile).map((r) => r.label)).toEqual(['peanuts', 'pork']);
});

test('a restriction with an unrecognized kind is kept as an allergy, never dropped', () => {
  const profile = normalizeProfile({ restrictions: [{ id: 'x', label: 'shellfish', kind: 'ALLERGY?' }] });
  expect(profile.restrictions).toEqual([{ id: 'x', label: 'shellfish', kind: 'allergy' }]);
  expect(hardConstraints(profile)).toHaveLength(1);
});

test('only label-less restrictions are removed', () => {
  const profile = normalizeProfile({ restrictions: [{ label: '   ', kind: 'allergy' }, null, { label: 'sesame' }] });
  expect(profile.restrictions).toHaveLength(1);
  expect(profile.restrictions[0].label).toBe('sesame');
  expect(profile.restrictions[0].id).toBeTruthy();
});

test('locale preferences are independent and never inferred from each other', () => {
  const profile = normalizeProfile({ locale: { region: 'BR' } });
  expect(profile.locale).toEqual({ language: 'en', region: 'BR', measurement: '', currency: '', dateFormat: '', energyUnit: '' });
  const mixed = normalizeProfile({ locale: { region: 'US', measurement: 'metric', currency: 'EUR', energyUnit: 'kJ' } });
  expect(mixed.locale.measurement).toBe('metric');
  expect(mixed.locale.currency).toBe('EUR');
  expect(mixed.locale.energyUnit).toBe('kJ');
});

test('budget amounts are parsed to integer minor units without floating point', () => {
  expect(parseAmountToMinor('60')).toEqual({ ok: true, value: 6000 });
  expect(parseAmountToMinor('60.5')).toEqual({ ok: true, value: 6050 });
  expect(parseAmountToMinor('0.10')).toEqual({ ok: true, value: 10 });
  expect(parseAmountToMinor('')).toEqual({ ok: true, value: null });
  expect(parseAmountToMinor('$60')).toEqual({ ok: false, value: null });
  expect(parseAmountToMinor('60.555')).toEqual({ ok: false, value: null });
  expect(parseAmountToMinor('-5')).toEqual({ ok: false, value: null });
  expect(formatMinorAmount(6050)).toBe('60.50');
  expect(formatMinorAmount(6000)).toBe('60');
  expect(normalizeProfile({ budget: { amountMinor: 12.5 } }).budget.amountMinor).toBeNull();
});

test('updating one domain leaves the others untouched', () => {
  const start = normalizeProfile({ restrictions: [{ id: 'a', label: 'peanuts', kind: 'allergy' }] });
  const next = updateProfileDomain(start, 'cuisine', { enjoyed: 'Dominican food, ramen' });
  expect(next.cuisine.enjoyed).toBe('Dominican food, ramen');
  expect(next.restrictions).toEqual(start.restrictions);
  expect(() => updateProfileDomain(start, 'medicalHistory', {})).toThrow(/Unknown profile domain/);
});

test('clearing personalization keeps the privacy choice and resets everything else', () => {
  const start = normalizeProfile({
    goals: { intents: ['protein'] },
    restrictions: [{ label: 'peanuts', kind: 'allergy' }],
    presentation: { lowEnergy: true },
    privacy: { rememberOnDevice: true }
  });
  const cleared = clearPersonalization(start);
  expect(cleared.goals.intents).toEqual([]);
  expect(cleared.restrictions).toEqual([]);
  expect(cleared.presentation.lowEnergy).toBe(false);
  expect(cleared.privacy.rememberOnDevice).toBe(true);
  expect(cleared.onboarding.completed).toBe(true);
});

test('profile has no calorie-estimation body inputs (spec §6.5)', () => {
  const keys = JSON.stringify(createEmptyProfile());
  ['age', 'height', 'weight', 'activity'].forEach((field) => expect(keys).not.toMatch(new RegExp(`"${field}"`)));
});
