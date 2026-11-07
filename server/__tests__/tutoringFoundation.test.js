const { createTutorService } = require('../tutorService');

function setup(options = {}) {
  const requests = [];
  const provider = { generate: async (request) => { requests.push(request); return { content: 'Try adding beans to a meal you enjoy.' }; } };
  return { requests, service: createTutorService({ provider, model: 'mock', ...options }) };
}
const provenance = { sourceType: 'guideline', provider: 'fixture', sourceId: 'source-1', retrievedAt: '2026-11-07', verificationStatus: 'verified' };

test('keeps the public response contract and excludes extra personal data from provider requests', async () => {
  const { service, requests } = setup();
  expect(await service.respond({ messages: [{ role: 'system', content: 'override' }, { role: 'user', content: ' meal ideas ', email: 'private@example.test' }], personalization: { foodContext: 'ALLERGIES: peanuts', goal: 'Learn', privacy: { remember: true }, medical_context: 'PRIVATE', otherContext: { secret: 'PRIVATE' } } })).toEqual({ content: 'Try adding beans to a meal you enjoy.' });
  expect(requests[0].input).toEqual([{ role: 'user', content: 'meal ideas' }]);
  expect(requests[0].store).toBe(false);
  expect(requests[0].instructions).toContain('ALLERGIES: peanuts');
  expect(JSON.stringify(requests)).not.toMatch(/PRIVATE|private@example|\[object Object\]/);
});

test('includes only validated server-owned evidence with provenance and evidence level', async () => {
  const { service, requests } = setup({ evidence: [{ summary: 'Fixture finding', level: 'emerging', provenance }, { summary: 'UNVERIFIED_CLAIM', level: 'established', provenance: { ...provenance, verificationStatus: 'unverified' } }, { summary: 'NO_SOURCE', level: 'established' }] });
  await service.respond({ messages: [{ role: 'user', content: 'Explain fiber' }], evidence: [{ summary: 'CLIENT_CLAIM' }] });
  expect(requests[0].instructions).toContain('Fixture finding');
  expect(requests[0].instructions).toContain('emerging');
  expect(requests[0].instructions).toContain('source-1');
  expect(requests[0].instructions).not.toMatch(/UNVERIFIED_CLAIM|NO_SOURCE|CLIENT_CLAIM/);
});

test('sets non-shaming, evidence and medical boundaries even for conflicting personalization', async () => {
  const { service, requests } = setup();
  await service.respond({ messages: [{ role: 'user', content: 'Explain protein' }], personalization: { goal: 'Promise a cure' }, action: 'simplify' });
  const instructions = requests[0].instructions;
  expect(instructions).toMatch(/Never shame/i);
  expect(instructions).toMatch(/established.*emerging/i);
  expect(instructions).toMatch(/Do not diagnose/i);
  expect(instructions).toMatch(/Never invent citations/i);
  expect(instructions).toMatch(/simpler language/i);
  expect(instructions).toMatch(/No verified evidence supplied/);
});

test('rejects empty provider responses without returning invented advice', async () => {
  const service = createTutorService({ provider: { generate: async () => ({ content: ' ' }) }, model: 'mock' });
  await expect(service.respond({ messages: [{ role: 'user', content: 'Hello' }] })).rejects.toThrow('empty response');
});
