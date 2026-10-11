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
    .toThrow('PORT must be a positive integer.');
});
