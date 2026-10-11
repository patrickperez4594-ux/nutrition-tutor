const { buildInstructions } = require('./prompt');

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((message) =>
      ['user', 'assistant'].includes(message?.role) &&
      typeof message?.content === 'string' &&
      message.content.trim()
    )
    .map(({ role, content }) => ({ role, content: content.trim() }));
}

function createTutorService({ client, model }) {
  return {
    async respond({ messages, personalization, action }) {
      const input = normalizeMessages(messages);
      if (!input.length) throw new Error('At least one conversation message is required.');

      const response = await client.responses.create({
        model,
        store: false,
        instructions: buildInstructions({ personalization, action }),
        input
      });

      const content = String(response.output_text || '').trim();
      if (!content) throw new Error('The model returned an empty response.');
      return { content };
    }
  };
}

module.exports = { createTutorService, normalizeMessages };
