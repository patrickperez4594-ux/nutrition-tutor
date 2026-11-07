const { createEducationPlan, educationInstructions } = require('../orchestration/nutritionEducation');
const { createTutorService } = require('../tutorService');

test.each([
  ['simple', null, 'beginner'], ['Short', null, 'beginner'], ['Step-by-step', null, 'intermediate'],
  ['Teach me why', null, 'intermediate'], ['Detailed', null, 'advanced'], ['', null, 'intermediate'],
  ['Detailed; short responses', null, 'beginner'], ['Detailed', 'simplify', 'beginner'], ['', 'expand', 'advanced'],
  ['Detailed; short answers with one clear next step', 'expand', 'beginner']
])('maps existing style %s and action %s to %s', (learningStyle, action, depth) => {
  expect(createEducationPlan({ question: 'Explain eggs', personalization: { learningStyle }, action }).depth).toBe(depth);
});
test.each([
  ['What are the health benefits of apples?', 'food-benefits'], ['Explain protein and fat', 'macronutrients'],
  ['What are vitamins and minerals?', 'micronutrients'], ['Explain calories and energy balance', 'energy'],
  ['How do I build a balanced meal?', 'balanced-meals'], ['How can I serve lentils?', 'serving-ideas']
])('recognizes education topic in %s', (question, topic) => {
  expect(createEducationPlan({ question }).topics).toContain(topic);
});
test('catalog facts retain provenance while general teaching has no invented evidence', () => {
  const plan = createEducationPlan({ question: 'What vitamins are in broccoli?' });
  expect(plan.evidence[0].provenance.sourceId).toBe('kefi-food:broccoli@1.1.0');
  expect(plan.evidence[0].summary).toContain('https://medlineplus.gov/');
  expect(createEducationPlan({ question: 'Tell me about dragonfruit' }).evidence).toEqual([]);
  expect(educationInstructions(plan)).toMatch(/General education is not verified catalog evidence/);
  expect(educationInstructions(plan)).toMatch(/Do not invent nutrient quantities/);
});
test('allergy context suppresses catalog serving ideas and remains outside the lesson plan', () => {
  const plan = createEducationPlan({ question: 'How can I serve milk?', personalization: { foodContext: 'ALLERGIES: milk', email: 'PRIVATE_EMAIL' } });
  expect(JSON.parse(plan.evidence[0].summary).servingIdeas).toEqual([]);
  expect(JSON.stringify(plan)).not.toMatch(/PRIVATE_EMAIL|ALLERGIES/);
  expect(educationInstructions(plan)).toMatch(/Never treat a catalog match as allergy safety/);
});
test('provider integration preserves API, privacy, catalog sources and teaching actions', async () => {
  const requests = [];
  const service = createTutorService({ model: 'mock', provider: { generate: async (request) => { requests.push(request); return { content: 'A mock lesson.' }; } } });
  expect(await service.respond({ messages: [{ role: 'user', content: 'balanced meal with lentils', privateId: 'SECRET_ID' }], personalization: { learningStyle: 'Detailed', foodContext: 'ALLERGIES: milk', privacy: 'SECRET_PRIVACY' }, action: 'example' })).toEqual({ content: 'A mock lesson.' });
  expect(requests[0].instructions).toContain('EXPLANATION DEPTH: advanced');
  expect(requests[0].instructions).toContain('kefi-food:lentils@1.1.0');
  expect(requests[0].instructions).toContain('ALLERGIES: milk');
  expect(requests[0].instructions).toMatch(/practical, easy-to-understand example/i);
  expect(JSON.stringify(requests)).not.toMatch(/SECRET_ID|SECRET_PRIVACY/);
  expect(requests[0].store).toBe(false);
});
test('unknown or malformed questions fall back to general education without fabricated foods', () => {
  expect(createEducationPlan({ question: null }).topics).toEqual(['general']);
  expect(createEducationPlan({ question: null }).evidence).toEqual([]);
});
