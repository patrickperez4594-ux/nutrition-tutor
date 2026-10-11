function readRuntimeConfig(env = process.env) {
  const rawPort = env.PORT || '3001';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0) throw new Error('PORT must be a positive integer.');
  return {
    openAiApiKey: env.OPENAI_API_KEY || '',
    openAiModel: env.OPENAI_MODEL || 'gpt-5-mini',
    port
  };
}

module.exports = { readRuntimeConfig };
