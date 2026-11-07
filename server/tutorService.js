const { buildInstructions } = require('./prompt');
const { createEducationPlan, educationInstructions } = require('./orchestration/nutritionEducation');
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
  const referenceEvidence = evidenceContext(evidence);
  return {
    async respond({ messages, personalization, action }) {
      const input = normalizeMessages(messages);
      if (!input.length) throw new Error('At least one conversation message is required.');

      const safePersonalization = tutorPersonalization(personalization);
      const latestUser = [...input].reverse().find((message) => message.role === 'user');
      const lesson = createEducationPlan({ question: latestUser?.content, personalization: safePersonalization, action, evidence: referenceEvidence });
      const response = await provider.generate({
        model,
        store: false,
        instructions: buildInstructions({ personalization: safePersonalization, action }) +
          buildTutoringGuidelines(lesson.evidence) + educationInstructions(lesson),
        input
      });

      const content = String(response.content || '').trim();
      if (!content) throw new Error('The model returned an empty response.');
      return { content };
    }
  };
}

module.exports = { createTutorService, normalizeMessages };
