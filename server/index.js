require('dotenv').config();
const path = require('path');
const express = require('express');
const OpenAI = require('openai');
const { createApp } = require('./app');
const { createTutorService } = require('./tutorService');
const { readRuntimeConfig } = require('./config/runtimeConfig');

function buildServerDependencies({ env = process.env, OpenAIClient = OpenAI } = {}) {
  const config = readRuntimeConfig(env);
  if (!config.openAiApiKey) throw new Error('OPENAI_API_KEY is required.');
  const client = new OpenAIClient({ apiKey: config.openAiApiKey });
  return {
    config,
    tutorService: createTutorService({ client, model: config.openAiModel })
  };
}

function buildServerApp({ env = process.env, OpenAIClient = OpenAI } = {}) {
  const { config, tutorService } = buildServerDependencies({ env, OpenAIClient });
  const app = createApp({ tutorService });

  if (env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '..', 'build');
    app.use(express.static(buildPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next();
      return res.sendFile(path.join(buildPath, 'index.html'));
    });
  }

  return { app, config };
}

function startServer({ env = process.env, OpenAIClient = OpenAI } = {}) {
  const { app, config } = buildServerApp({ env, OpenAIClient });
  return app.listen(config.port, () => {
    console.log(`AI Nutrition Tutor server running on port ${config.port}`);
  });
}

if (require.main === module) {
  try {
    startServer();
  } catch (error) {
    console.error(error.message === 'OPENAI_API_KEY is required.'
      ? 'Missing OPENAI_API_KEY. Copy .env.example to .env and add your key.'
      : error.message);
    process.exit(1);
  }
}

module.exports = { buildServerDependencies, buildServerApp, startServer };
