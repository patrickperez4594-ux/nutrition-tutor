const { CONTEXT_TYPE } = require('../domain/contextTypes');
const { assertContextAllowed, filterContext } = require('../orchestration/contextPolicy');

test('grocery engine may request budget, pantry, food preferences, cooking context and goals', () => {
  expect(() => assertContextAllowed('grocery', [
    CONTEXT_TYPE.BUDGET,
    CONTEXT_TYPE.PANTRY,
    CONTEXT_TYPE.FOOD_PREFERENCES,
    CONTEXT_TYPE.COOKING_CONTEXT,
    CONTEXT_TYPE.GOALS
  ])).not.toThrow();
});

test('grocery engine may not request unrelated sensitive medical context by default', () => {
  expect(() => assertContextAllowed('grocery', [CONTEXT_TYPE.MEDICAL_CONTEXT]))
    .toThrow('grocery may not access context type: medical_context');
});

test('filterContext returns only explicitly allowed categories', () => {
  const filtered = filterContext('learning', {
    learning_preferences: { responseLength: 'short' },
    goals: [{ type: 'learn_nutrition' }],
    medical_context: { diagnosis: 'should-not-flow-here' }
  });
  expect(filtered).toEqual({
    learning_preferences: { responseLength: 'short' },
    goals: [{ type: 'learn_nutrition' }]
  });
});
