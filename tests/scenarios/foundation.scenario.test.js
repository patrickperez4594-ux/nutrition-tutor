const { makeConstraint, partitionConstraints } = require('../../server/domain/constraints');
const { CONTEXT_TYPE } = require('../../server/domain/contextTypes');
const { filterContext } = require('../../server/orchestration/contextPolicy');
const { calculateMifflinStJeor, calculateTdee, ACTIVITY_FACTOR } = require('../../shared/calculations/energy');
const { lbToKg } = require('../../shared/calculations/units');
const { DATA_CLASS, isPersistentDataClass } = require('../../src/domain/dataClasses');

test('peanut allergy remains a hard constraint beside optimization goals', () => {
  const result = partitionConstraints([
    makeConstraint({ id: 'a', kind: 'hard', type: 'allergy', value: 'peanut', source: 'user_confirmed' }),
    makeConstraint({ id: 'p', kind: 'optimization', type: 'protein', value: 'higher', source: 'goal' })
  ]);
  expect(result.hard.map((item) => item.value)).toContain('peanut');
  expect(result.optimization.map((item) => item.value)).toContain('higher');
});

test('grocery context excludes medical context while retaining task-relevant context', () => {
  const filtered = filterContext('grocery', {
    [CONTEXT_TYPE.BUDGET]: { amount: 80 },
    [CONTEXT_TYPE.PANTRY]: ['rice'],
    [CONTEXT_TYPE.GOALS]: ['higher_protein'],
    [CONTEXT_TYPE.MEDICAL_CONTEXT]: { diagnosis: 'not-needed' }
  });
  expect(filtered).toEqual({
    budget: { amount: 80 },
    pantry: ['rice'],
    goals: ['higher_protein']
  });
});

test('energy and unit calculations are deterministic and transparent', () => {
  const bmr = calculateMifflinStJeor({ sex: 'male', weightKg: 80, heightCm: 180, ageYears: 30 });
  expect(bmr).toBe(1780);
  expect(calculateTdee({ bmr, activityFactor: ACTIVITY_FACTOR.MODERATE })).toBeCloseTo(2759, 0);
  expect(lbToKg(220)).toBeCloseTo(99.7903, 3);
});

test('only explicitly saved or retained data classes are persistent', () => {
  expect(isPersistentDataClass(DATA_CLASS.TEMPORARY_SESSION)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.AI_PROCESSING)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.LOCAL_SAVED)).toBe(true);
  expect(isPersistentDataClass(DATA_CLASS.EXPLICITLY_RETAINED)).toBe(true);
});
