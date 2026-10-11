// The backend reads API_PORT first because Create React App also reads PORT from
// .env; sharing PORT made `npm run dev` start both servers on the same port.
// PORT remains a fallback for hosting platforms that assign it in production.
function readRuntimeConfig(env = process.env) {
  const rawPort = env.API_PORT || env.PORT || '3001';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0) throw new Error('API_PORT must be a positive integer.');
  return {
    openAiApiKey: env.OPENAI_API_KEY || '',
    openAiModel: env.OPENAI_MODEL || 'gpt-5-mini',
    port
  };
}

module.exports = { readRuntimeConfig };
