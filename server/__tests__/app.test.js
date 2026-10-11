/**
 * @jest-environment node
 */
const request = require('supertest');
const { createApp } = require('../app');

test('returns tutor content', async () => {
  const tutorService = { respond: jest.fn().mockResolvedValue({ content: 'Fiber supports digestion.' }) };
  const response = await request(createApp({ tutorService })).post('/api/chat').send({ messages: [{ role: 'user', content: 'Fiber?' }], personalization: {}, action: null });
  expect(response.status).toBe(200);
  expect(response.body.content).toMatch(/Fiber/);
});

test('does not expose upstream error text', async () => {
  const tutorService = { respond: jest.fn().mockRejectedValue(new Error('SENSITIVE_UPSTREAM_DETAIL')) };
  const response = await request(createApp({ tutorService })).post('/api/chat').send({ messages: [{ role: 'user', content: 'Hello' }] });
  expect(response.status).toBe(502);
  expect(JSON.stringify(response.body)).not.toMatch(/SENSITIVE_UPSTREAM_DETAIL/);
});
