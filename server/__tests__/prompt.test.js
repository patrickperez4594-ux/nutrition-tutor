const { loadBasePrompt, buildInstructions } = require('../prompt');

test('loads the tracked safety prompt', () => {
  const prompt = loadBasePrompt();
  expect(prompt).toMatch(/supportive, adaptable, and honest AI nutrition tutor/i);
  expect(prompt).toMatch(/Never shame/i);
});

test('adds personalization without removing safety rules', () => {
  const instructions = buildInstructions({ personalization: { goal: 'protein', learningStyle: 'simple', foodContext: 'vegetarian' } });
  expect(instructions).toMatch(/Never shame/i);
  expect(instructions).toMatch(/protein/i);
  expect(instructions).toMatch(/vegetarian/i);
});

test.each([['simplify', /simpler language/i], ['expand', /more detail/i], ['example', /practical/i]])('maps %s action', (action, expected) => {
  expect(buildInstructions({ action })).toMatch(expected);
});
