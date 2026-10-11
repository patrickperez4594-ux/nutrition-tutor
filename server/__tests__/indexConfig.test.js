const { buildServerDependencies } = require('../index');

class FakeOpenAI {
  constructor(options) {
    this.options = options;
    this.responses = { create: jest.fn() };
    FakeOpenAI.lastOptions = options;
  }
}

test('builds server dependencies from centralized runtime config', () => {
  const result = buildServerDependencies({
    env: { OPENAI_API_KEY: 'test-key', OPENAI_MODEL: 'test-model', PORT: '4321' },
    OpenAIClient: FakeOpenAI
  });

  expect(result.config).toEqual({
    openAiApiKey: 'test-key',
    openAiModel: 'test-model',
    port: 4321
  });
  expect(FakeOpenAI.lastOptions).toEqual({ apiKey: 'test-key' });
  expect(typeof result.tutorService.respond).toBe('function');
});

test('refuses to build server dependencies without an API key', () => {
  expect(() => buildServerDependencies({ env: {}, OpenAIClient: FakeOpenAI }))
    .toThrow('OPENAI_API_KEY is required.');
});
