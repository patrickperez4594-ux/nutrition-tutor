const express = require('express');
const { describeError } = require('./safeError');

const VALID_ACTIONS = new Set([null, undefined, 'simplify', 'expand', 'example']);

function createApp({ tutorService }) {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => res.json({ ok: true }));

  app.post('/api/chat', async (req, res) => {
    const { messages, personalization = {}, action = null } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'At least one conversation message is required.' });
    }
    if (!VALID_ACTIONS.has(action)) {
      return res.status(400).json({ error: 'Unsupported response action.' });
    }

    try {
      const result = await tutorService.respond({ messages, personalization, action });
      return res.json(result);
    } catch (error) {
      console.error(`Tutor request failed: ${describeError(error)}`);
      return res.status(502).json({
        error: 'The tutor is temporarily unavailable. Your conversation is still here. Please retry.'
      });
    }
  });

  return app;
}

module.exports = { createApp };
