const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { readRuntimeConfig } = require('../config/runtimeConfig');

const root = path.join(__dirname, '..', '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const exampleEnv = dotenv.parse(fs.readFileSync(path.join(root, '.env.example')));

test('pins the React dev server to port 3000 regardless of .env', () => {
  expect(pkg.scripts.start).toMatch(/^PORT=3000 react-scripts start$/);
});

test('.env.example does not set PORT, which Create React App would also read', () => {
  expect(exampleEnv).not.toHaveProperty('PORT');
  expect(exampleEnv.API_PORT).toBe('3001');
});

test('the backend port from .env.example matches the frontend proxy', () => {
  const { port } = readRuntimeConfig({ ...exampleEnv, OPENAI_API_KEY: 'test-key' });
  expect(port).toBe(3001);
  expect(pkg.proxy).toBe(`http://localhost:${port}`);
});

test('a legacy .env with PORT=3001 still keeps the services on separate ports', () => {
  const { port } = readRuntimeConfig({ OPENAI_API_KEY: 'test-key', PORT: '3001' });
  expect(port).toBe(3001);
  expect(pkg.scripts.start).toContain('PORT=3000');
});
