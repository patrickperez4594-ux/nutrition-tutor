const { PROVIDER_METHODS, defineProvider } = require('../providers/contracts');

test('accepts a provider that implements required methods', () => {
  const provider = defineProvider('LanguageModelProvider', ['generate'], {
    generate: async () => ({ content: 'ok' })
  });
  expect(typeof provider.generate).toBe('function');
});

test('rejects missing provider methods', () => {
  expect(() => defineProvider('VisionProvider', ['observeImage'], {}))
    .toThrow('VisionProvider is missing method: observeImage');
});

test.each(Object.entries(PROVIDER_METHODS))('%s has a non-empty unique method list', (_name, methods) => {
  expect(methods.length).toBeGreaterThan(0);
  expect(new Set(methods).size).toBe(methods.length);
});
