const { entries, matchFoods, knowledgeEvidence, validEntry } = require('../knowledge/nutritionKnowledge');
const { evidenceContext } = require('../orchestration/tutoringFoundation');
const { createTutorService } = require('../tutorService');

test('twenty-five versioned entries have valid claim sources and provenance', () => {
  expect(entries).toHaveLength(25);
  entries.forEach((entry) => expect(validEntry(entry)).toBe(true));
});
test('matches whole food names case insensitively without substring false positives', () => {
  expect(matchFoods('BLUEBERRIES, an egg and salmon').map((e) => e.id)).toEqual(['blueberries', 'eggs', 'salmon']);
  expect(matchFoods('eggplant and salmonella')).toEqual([]);
  expect(matchFoods('plain yoghurt').map((e) => e.id)).toEqual(['plain-yogurt']);
});
test('unknown and malformed inputs have no curated evidence', () => {
  expect(knowledgeEvidence('dragonfruit')).toEqual([]);
  expect(matchFoods(null)).toEqual([]);
});
test('unverified entries and broken source references fail validation', () => {
  expect(validEntry({ ...entries[0], status: 'draft' })).toBe(false);
  expect(validEntry({ ...entries[0], claims: [{ text: 'Unsupported', sourceIds: ['missing'] }] })).toBe(false);
  expect(validEntry({ ...entries[0], provenance: { ...entries[0].provenance, verificationStatus: 'unverified' } })).toBe(false);
});
test('curated evidence survives existing validation with source URLs and scope limits', () => {
  const result = evidenceContext(knowledgeEvidence('spinach and plain yogurt'));
  expect(result).toHaveLength(2);
  expect(result[0].summary).toContain('https://ods.od.nih.gov/');
  expect(result[0].summary).toContain('not a clinical outcome');
});
test('allergen metadata is explicit and serving ideas are withheld when food context exists', () => {
  expect(entries.find((e) => e.id === 'eggs').allergens).toContain('egg');
  expect(entries.find((e) => e.id === 'salmon').allergens).toContain('fish');
  expect(entries.find((e) => e.id === 'plain-yogurt').allergens).toContain('milk');
  const summary = JSON.parse(knowledgeEvidence('eggs', { foodContext: 'ALLERGIES: eggs' })[0].summary);
  expect(summary.servingIdeas).toEqual([]);
  expect(summary.allergyBoundary).toMatch(/not.*safe/i);
});
test('service selects only latest user food context and keeps API and allergy constraints', async () => {
  const requests = [];
  const service = createTutorService({ model: 'mock', provider: { generate: async (r) => { requests.push(r); return { content: 'Educational answer' }; } } });
  expect(await service.respond({ messages: [{ role: 'user', content: 'eggs' }, { role: 'assistant', content: 'salmon' }, { role: 'user', content: 'plain yogurt' }], personalization: { foodContext: 'ALLERGIES: milk' } })).toEqual({ content: 'Educational answer' });
  expect(requests[0].instructions).toContain('plain-yogurt');
  expect(requests[0].instructions).not.toContain('"id":"eggs"');
  expect(requests[0].instructions).toContain('ALLERGIES: milk');
  expect(requests[0].store).toBe(false);
});

const additions = ['strawberries', 'bananas', 'apples', 'oranges', 'broccoli', 'carrots', 'sweet-potatoes', 'kale', 'chicken-breast', 'lean-beef', 'turkey-breast', 'tuna', 'milk', 'cottage-cheese', 'fortified-soy-milk', 'oats', 'brown-rice', 'quinoa', 'lentils', 'chickpeas'];
test.each(additions)('%s has matching aliases, traceable claims and scoped evidence', (id) => {
  const entry = entries.find((e) => e.id === id);
  expect(entry).toBeDefined();
  expect(validEntry(entry)).toBe(true);
  entry.aliases.forEach((alias) => expect(matchFoods(alias.toUpperCase()).map((e) => e.id)).toContain(id));
  expect(entry.version).toBe('1.1.0');
  expect(entry.scope).toMatch(/not a clinical outcome/);
  expect(entry.allergenNotes).toMatch(/not.*guarantee/i);
});
test('original entries retain their versions and source identifiers', () => {
  entries.slice(0, 5).forEach((entry) => {
    expect(entry.version).toBe('1.0.0');
    expect(entry.provenance.sourceId).toBe(`kefi-food:${entry.id}@1.0.0`);
  });
});
test('milk variants do not imply dairy or fortification', () => {
  expect(matchFoods('almond milk, soy milk and oat milk')).toEqual([]);
  expect(matchFoods('fortified soy milk').map((e) => e.id)).toEqual(['fortified-soy-milk']);
  expect(matchFoods('milk and fortified soy milk').map((e) => e.id)).toEqual(['milk', 'fortified-soy-milk']);
  expect(matchFoods('applesauce and carrotcake')).toEqual([]);
});
test('new allergens and preparation limitations reach evidence without safety promises', () => {
  const summaries = knowledgeEvidence('milk, tuna and fortified soy milk', { foodContext: 'avoid dairy and fish' }).map((e) => JSON.parse(e.summary));
  expect(summaries.map((e) => e.allergens)).toEqual([['fish'], ['milk'], ['soy']]);
  summaries.forEach((e) => expect(e.servingIdeas).toEqual([]));
  expect(summaries[0].claims[0].text).toMatch(/mercury/i);
  expect(summaries[2].claims[0].text).toMatch(/label/i);
});
test('unverified sources and insecure references cannot authorize claims', () => {
  const entry = entries[0];
  expect(validEntry({ ...entry, sources: entry.sources.map((s) => ({ ...s, verificationStatus: 'unverified' })) })).toBe(false);
  expect(validEntry({ ...entry, sources: entry.sources.map((s) => ({ ...s, url: 'http://example.test' })) })).toBe(false);
  expect(validEntry({ ...entry, status: 'incomplete' })).toBe(false);
});
