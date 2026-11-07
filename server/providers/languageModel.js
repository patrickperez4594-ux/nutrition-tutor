const { defineProvider, PROVIDER_METHODS } = require('./contracts');

// Preserve the existing Responses API boundary; tests may inject a local provider.
function createLanguageModelProvider(client) {
  return defineProvider('LanguageModelProvider', PROVIDER_METHODS.LanguageModelProvider, {
    async generate(request) {
      const response = await client.responses.create(request);
      return { content: response.output_text };
    }
  });
}

module.exports = { createLanguageModelProvider };
