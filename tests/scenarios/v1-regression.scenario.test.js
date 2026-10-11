/**
 * @jest-environment node
 */
const request = require('supertest');
const { createApp } = require('../../server/app');
const { makePersonalization } = require('./fixtures');
const {
  STORAGE_KEY,
  isReviewDue,
  loadSavedConversations,
  saveConversation
} = require('../../src/lib/savedConversations');

function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.has(key) ? data.get(key) : null,
    setItem: (key, value) => data.set(key, value),
    removeItem: (key) => data.delete(key),
    _data: data
  };
}

test('V1 chat contract remains backward compatible', async () => {
  const calls = [];
  const tutorService = {
    respond: async (payload) => {
      calls.push(payload);
      return { content: 'Protein helps build and repair tissue.' };
    }
  };
  const app = createApp({ tutorService });

  const response = await request(app).post('/api/chat').send({
    messages: [{ role: 'user', content: 'What does protein do?' }],
    personalization: makePersonalization(),
    action: null
  });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ content: 'Protein helps build and repair tissue.' });
  expect(calls).toHaveLength(1);
  expect(calls[0]).toEqual({
    messages: [{ role: 'user', content: 'What does protein do?' }],
    personalization: makePersonalization(),
    action: null
  });
});

test.each(['simplify', 'expand', 'example'])('accepts V1 action %s', async (action) => {
  const calls = [];
  const app = createApp({ tutorService: {
    respond: async (payload) => {
      calls.push(payload);
      return { content: 'ok' };
    }
  }});

  const response = await request(app).post('/api/chat').send({
    messages: [{ role: 'user', content: 'Explain fiber.' }],
    personalization: {},
    action
  });

  expect(response.status).toBe(200);
  expect(calls[0].action).toBe(action);
});

test('review-due saved conversations remain stored until the user deletes them', () => {
  const storage = memoryStorage();
  const conversation = {
    id: 'saved-1',
    title: 'Protein',
    messages: [],
    createdAt: '2026-08-10T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z',
    reviewPolicy: '7d',
    reviewAt: '2026-08-17T00:00:00.000Z'
  };

  expect(saveConversation(conversation, storage).ok).toBe(true);
  expect(isReviewDue(conversation, new Date('2026-08-18T00:00:00.000Z'))).toBe(true);
  expect(loadSavedConversations(storage).conversations).toHaveLength(1);
  expect(storage._data.has(STORAGE_KEY)).toBe(true);
});
