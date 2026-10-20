/**
 * @jest-environment node
 */
const request = require('supertest');
const { createApp } = require('../../server/app');
const { buildInstructions } = require('../../server/prompt');
const { normalizeProfile } = require('../../src/domain/profile');
const { toTutorPersonalization } = require('../../src/kefi/tutorPersonalization');
const { PROFILE_STORAGE_KEY, loadProfile, saveProfile } = require('../../src/repositories/profileRepository');

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    _data: data
  };
}

const profile = normalizeProfile({
  goals: { intents: ['budget'] },
  restrictions: [
    { id: 'a', label: 'tree nuts', kind: 'allergy' },
    { id: 'b', label: 'cilantro', kind: 'dislike' }
  ],
  budget: { mode: 'strict', amountMinor: 5000, period: 'week' },
  locale: { currency: 'BRL' },
  presentation: { lowEnergy: true },
  accessibility: { theme: 'dark' }
});

test('Kefi profile reaches the unchanged /api/chat contract with hard constraints intact', async () => {
  const calls = [];
  const app = createApp({ tutorService: { respond: async (payload) => { calls.push(payload); return { content: 'ok' }; } } });

  const response = await request(app).post('/api/chat').send({
    messages: [{ role: 'user', content: 'Quick snack?' }],
    personalization: toTutorPersonalization(profile),
    action: null
  });

  expect(response.status).toBe(200);
  const instructions = buildInstructions({ personalization: calls[0].personalization });
  expect(instructions).toMatch(/ALLERGIES \(hard constraint, must always avoid\): tree nuts/);
  expect(instructions).toMatch(/Dislikes \(preference only\): cilantro/);
  expect(instructions).toMatch(/50 BRL per week/);
  expect(instructions).toMatch(/without reducing safety, accuracy, or constraint handling/);
  expect(instructions).toMatch(/never overrides the safety/);
  expect(instructions).not.toMatch(/dark/);
});

test('a Kefi profile is private by default and only persists after explicit opt-in', () => {
  const storage = memoryStorage();
  saveProfile(profile, storage);
  expect(storage._data.size).toBe(0);

  saveProfile({ ...profile, privacy: { rememberOnDevice: true } }, storage);
  expect(loadProfile(storage).profile.restrictions.map((r) => r.label)).toEqual(['tree nuts', 'cilantro']);

  saveProfile({ ...profile, privacy: { rememberOnDevice: false } }, storage);
  expect(storage._data.has(PROFILE_STORAGE_KEY)).toBe(false);
});
