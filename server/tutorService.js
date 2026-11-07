const { buildInstructions } = require('./prompt');
const { createLanguageModelProvider } = require('./providers/languageModel');
const { tutorPersonalization, evidenceContext, buildTutoringGuidelines } = require('./orchestration/tutoringFoundation');

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) =>
      ['user', 'assistant'].includes(message?.role) &&
      typeof message?.content === 'string' &&
      message.content.trim()
    )
    .map(({ role, content }) => ({ role, content: content.trim() }));
}

function createTutorService({ client, model, provider = createLanguageModelProvider(client), evidence = [] }) {
  // Snapshot server-owned reference data; request bodies never supply trusted evidence.
  const guidelines = buildTutoringGuidelines(evidenceContext(evidence));
  return {
    async respond({ messages, personalization, action }) {
      const input = normalizeMessages(messages);
      if (!input.length) throw new Error('At least one conversation message is required.');

      const response = await provider.generate({
        model,
        store: false,
        instructions: buildInstructions({ personalization: tutorPersonalization(personalization), action }) + guidelines,
        input
      });

      const content = String(response.content || '').trim();
      if (!content) throw new Error('The model returned an empty response.');
      return { content };
    }
  };
}

module.exports = { createTutorService, normalizeMessages };
