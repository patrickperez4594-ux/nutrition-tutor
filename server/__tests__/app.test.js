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

test('logs only allowlisted provider error fields', async () => {
  const providerError = Object.assign(
    new Error('401 Incorrect API key provided: sk-proj-abc*************wxyz.'),
    { status: 401, code: 'invalid_api_key', type: 'invalid_request_error' }
  );
  const tutorService = { respond: jest.fn().mockRejectedValue(providerError) };
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  try {
    const response = await request(createApp({ tutorService })).post('/api/chat').send({ messages: [{ role: 'user', content: 'Hello' }] });
    const logged = consoleError.mock.calls.flat().join(' ');
    expect(logged).toBe('Tutor request failed: status=401 code=invalid_api_key type=invalid_request_error');
    expect(logged).not.toMatch(/sk-|wxyz|Incorrect API key/);
    expect(response.status).toBe(502);
    expect(response.body.error).toMatch(/Your conversation is still here\. Please retry\./);
    expect(JSON.stringify(response.body)).not.toMatch(/sk-|wxyz|invalid_api_key|401/);
  } finally {
    consoleError.mockRestore();
  }
});
