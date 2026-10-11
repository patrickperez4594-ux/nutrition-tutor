const { readRuntimeConfig } = require('../config/runtimeConfig');

test('preserves V1 runtime defaults', () => {
  expect(readRuntimeConfig({ OPENAI_API_KEY: 'test-key' })).toMatchObject({
    openAiApiKey: 'test-key',
    openAiModel: 'gpt-5-mini',
    port: 3001
  });
});

test('rejects an invalid port', () => {
  expect(() => readRuntimeConfig({ OPENAI_API_KEY: 'test-key', PORT: 'banana' }))
    .toThrow('API_PORT must be a positive integer.');
});

test('prefers API_PORT so the backend does not share the frontend PORT', () => {
  expect(readRuntimeConfig({ OPENAI_API_KEY: 'test-key', API_PORT: '3001', PORT: '3000' }).port).toBe(3001);
});

test('falls back to PORT when a host assigns only PORT', () => {
  expect(readRuntimeConfig({ OPENAI_API_KEY: 'test-key', PORT: '8080' }).port).toBe(8080);
});

test('rejects an invalid API_PORT', () => {
  expect(() => readRuntimeConfig({ OPENAI_API_KEY: 'test-key', API_PORT: '-1' }))
    .toThrow('API_PORT must be a positive integer.');
});
