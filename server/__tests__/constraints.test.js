const { CONSTRAINT_KIND, makeConstraint, partitionConstraints } = require('../domain/constraints');

test('preserves allergies as explicit hard constraints', () => {
  const peanut = makeConstraint({
    id: 'allergy-peanut',
    kind: CONSTRAINT_KIND.HARD,
    type: 'allergy',
    value: 'peanut',
    source: 'user_confirmed'
  });
  expect(peanut.kind).toBe('hard');
  expect(peanut.type).toBe('allergy');
});

test('partitions constraints without silently dropping any item', () => {
  const constraints = [
    makeConstraint({ id: '1', kind: 'hard', type: 'allergy', value: 'peanut', source: 'user_confirmed' }),
    makeConstraint({ id: '2', kind: 'preference', type: 'dislike', value: 'mushroom', source: 'user_confirmed' }),
    makeConstraint({ id: '3', kind: 'optimization', type: 'protein', value: 'higher', source: 'goal' })
  ];
  const result = partitionConstraints(constraints);
  expect(result.hard).toHaveLength(1);
  expect(result.preferences).toHaveLength(1);
  expect(result.optimization).toHaveLength(1);
  expect(result.hard.length + result.preferences.length + result.optimization.length).toBe(3);
});
