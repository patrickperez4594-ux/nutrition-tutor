const { ACTIVITY_FACTOR, calculateMifflinStJeor, calculateTdee } = require('../energy');

test('calculates adult male Mifflin-St Jeor deterministically', () => {
  expect(calculateMifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, ageYears: 30 })).toBe(1780);
});

test('calculates adult female Mifflin-St Jeor deterministically', () => {
  expect(calculateMifflinStJeor({ sex: 'female', weightKg: 65, heightCm: 165, ageYears: 30 })).toBeCloseTo(1370.25, 2);
});

test('calculates TDEE from BMR and an explicit factor', () => {
  expect(calculateTdee({ bmr: 1780, activityFactor: ACTIVITY_FACTOR.MODERATE })).toBeCloseTo(2759, 0);
});

test.each([
  [{ sex: 'male', weightKg: 0, heightCm: 180, ageYears: 30 }, 'weightKg'],
  [{ sex: 'other', weightKg: 80, heightCm: 180, ageYears: 30 }, 'sex'],
  [{ sex: 'female', weightKg: 65, heightCm: 165, ageYears: -1 }, 'ageYears']
])('rejects invalid input %o', (input, field) => {
  expect(() => calculateMifflinStJeor(input)).toThrow(field);
});
