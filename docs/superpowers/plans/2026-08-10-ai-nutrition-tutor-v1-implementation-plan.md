# AI Nutrition Tutor V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, mobile-first AI Nutrition Tutor MVP in `patrickperez4594-ux/nutrition-tutor` using the existing Nutrition Tutor system prompt, a React frontend, a server-side OpenAI Responses API integration, optional personalization, session-only privacy by default, and user-controlled local saved progress.

**Architecture:** Reuse the `EndeavorEverlasting/Pat_Personal_Training/trainer-website` React 18 / Create React App foundation only as a technical scaffold, not as product UI. Add a small Express server in the same repository so the OpenAI API key stays server-side, while the React app talks only to `/api/chat`. Keep active chat state in memory; persist only explicitly saved conversations to `localStorage` through a dedicated storage module.

**Tech Stack:** React 18.3.1, React DOM 18.3.1, Create React App / react-scripts 5.0.1, Tailwind CSS 3.4.x foundation, Jest + Testing Library, Node.js, Express, official `openai` JavaScript SDK, dotenv, supertest, concurrently.

## Global Constraints

- Target repository: `patrickperez4594-ux/nutrition-tutor`.
- Preserve `prompts/system-prompt.md` as the behavioral source of truth.
- Preserve `prompts/system-prompt.json`; it currently contains tutor name/version metadata only.
- Use the Personal Training repository as a technical foundation only; do not copy its personal-training branding or placeholder CRA screen into the final product.
- Visual direction: **Calm + Modern**.
- Mobile-first responsive layout is mandatory.
- Optional onboarding: users must be able to choose either `Personalize My Tutor` or `Start Chatting`.
- Personalization editing after onboarding is deferred to V2.
- Private Session is the default; do not intentionally persist chat history unless the user explicitly chooses `Save Progress`.
- Saved conversations are local-device/browser only in V1.
- Saved progress supports multiple conversations, automatic titles, optional rename, manual delete, and review periods of 7 days / 30 days / keep until deleted.
- Review dates never trigger automatic deletion.
- At review time, offer: extend same period, keep until deleted, or delete now.
- OpenAI API key must never appear in browser/client code or committed files.
- Use the OpenAI Responses API from server-side JavaScript.
- Set `store: false` on Responses API calls; do not market this as zero retention or HIPAA compliance.
- V1 must not claim HIPAA compliance.
- No accounts, database, cloud chat history, cross-device sync, meal logging, dashboards, booking, payments, analytics, push notifications, or admin portal.
- A failed AI request must preserve the user's message and existing conversation and expose a Retry action.
- A local-storage failure must not prevent Private Session use.
- Response controls in V1 act on the **latest tutor response only**: `Make this easier`, `Explain more`, `Give me an example`.
- Use `gpt-5-mini` as the default model through `OPENAI_MODEL`, while keeping the model configurable by environment variable.
- Do not commit secrets, `.env`, runtime logs, or generated local data.
- Every task must finish with passing targeted tests before committing.
- Final verification must include `npm test -- --watchAll=false`, `npm run build`, and `git diff --check`.

---

## Planned File Structure

```text
nutrition-tutor/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── README.md
├── prompts/
│   ├── system-prompt.md
│   └── system-prompt.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── server/
│   ├── app.js
│   ├── index.js
│   ├── prompt.js
│   ├── tutorService.js
│   └── __tests__/
│       ├── app.test.js
│       ├── prompt.test.js
│       ├── safetyContract.test.js
│       └── tutorService.test.js
└── src/
    ├── App.js
    ├── App.css
    ├── index.js
    ├── index.css
    ├── setupTests.js
    ├── components/
    │   ├── ChatComposer.js
    │   ├── ChatMessage.js
    │   ├── ChatScreen.js
    │   ├── PersonalizationForm.js
    │   ├── PrivacyNotice.js
    │   ├── ReviewPrompt.js
    │   ├── SavedConversationList.js
    │   ├── SaveProgressDialog.js
    │   └── WelcomeScreen.js
    ├── hooks/
    │   └── useTutorSession.js
    ├── lib/
    │   ├── api.js
    │   ├── conversationTitle.js
    │   ├── personalization.js
    │   └── savedConversations.js
    └── __tests__/
        ├── App.test.js
        ├── ChatScreen.test.js
        ├── PersonalizationForm.test.js
        ├── PrivacyNotice.test.js
        ├── ReviewPrompt.test.js
        ├── SaveProgressDialog.test.js
        ├── WelcomeScreen.test.js
        ├── api.test.js
        ├── conversationTitle.test.js
        └── savedConversations.test.js
```

### Responsibility Map

- `server/app.js`: Express app factory and `/api/chat` HTTP boundary; no OpenAI construction inside the route.
- `server/index.js`: server startup, real tutor service wiring, and production static build serving.
- `server/prompt.js`: load `prompts/system-prompt.md`; build developer instructions from base prompt + personalization + response action.
- `server/tutorService.js`: call OpenAI Responses API and normalize output/errors.
- `src/hooks/useTutorSession.js`: current in-memory conversation state, send/retry/response-control orchestration.
- `src/lib/api.js`: browser-side POST helper for `/api/chat`.
- `src/lib/savedConversations.js`: all local-storage schema, retention review math, CRUD, and storage-failure handling.
- `src/lib/conversationTitle.js`: deterministic no-extra-AI automatic title generation.
- `src/lib/personalization.js`: normalize optional onboarding values before they enter session context.
- UI components render only their owned interactions; do not embed persistence or OpenAI logic in view components.

---

### Task 1: Establish the React + Express Foundation

**Files:** Create/replace `package.json`, `package-lock.json`, `.env.example`, `.gitignore`, `postcss.config.js`, `tailwind.config.js`, `public/index.html`, `public/manifest.json`, `public/robots.txt`, `src/index.js`, `src/index.css`, `src/setupTests.js`, `src/App.js`, `src/App.css`, `src/__tests__/App.test.js`; update `README.md`.

**Produces:** installable repo with `npm start`, `npm run server`, `npm run dev`, `npm test`, `npm run build`.

- [ ] **Write the first failing test** in `src/__tests__/App.test.js`:

```js
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders the AI Nutrition Tutor product name', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /AI Nutrition Tutor/i }))
    .toBeInTheDocument();
});
```

- [ ] **Create the minimal app shell**:

```js
// src/App.js
import './App.css';

function App() {
  return (
    <main className="app-shell">
      <h1>AI Nutrition Tutor</h1>
    </main>
  );
}

export default App;
```

```js
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```js
// src/setupTests.js
import '@testing-library/jest-dom';
```

- [ ] **Use the approved foundation dependency versions** in `package.json`:

```json
{
  "name": "ai-nutrition-tutor",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "react-scripts start",
    "server": "node server/index.js",
    "dev": "concurrently \"npm start\" \"npm run server\"",
    "build": "react-scripts build",
    "test": "react-scripts test"
  },
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "dotenv": "^16.0.0",
    "express": "^4.0.0",
    "openai": "^5.0.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-scripts": "5.0.1",
    "web-vitals": "^2.1.4"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "concurrently": "^9.0.0",
    "postcss": "^8.4.47",
    "supertest": "^7.0.0",
    "tailwindcss": "^3.4.14"
  },
  "proxy": "http://localhost:3001",
  "eslintConfig": {
    "extends": ["react-app", "react-app/jest"]
  }
}
```

Run `npm install` and commit the generated lockfile.

- [ ] **Add secret-safe config**:

```dotenv
# .env.example
OPENAI_API_KEY=replace-with-your-api-key
OPENAI_MODEL=gpt-5-mini
PORT=3001
```

Ensure `.gitignore` contains:

```gitignore
node_modules/
build/
.env
.env.local
.env.*.local
npm-debug.log*
.DS_Store
```

- [ ] **Add CSS baseline** with readable typography, 320px minimum viewport, 44px minimum controls, and visible focus ring.

- [ ] **Run targeted test**:

```bash
npm test -- --watchAll=false src/__tests__/App.test.js
```

Expected: PASS.

- [ ] **Run build**:

```bash
npm run build
```

Expected: PASS.

- [ ] **Commit**:

```bash
git add package.json package-lock.json .env.example .gitignore postcss.config.js tailwind.config.js public src README.md
git commit -m "chore: establish nutrition tutor app foundation"
```

---

### Task 2: Build the Calm + Modern Welcome Experience

**Files:** Create `src/components/WelcomeScreen.js`, `src/__tests__/WelcomeScreen.test.js`; modify `src/App.js`, `src/App.css`.

**Interface:** `WelcomeScreen({ onPersonalize, onStartChatting })`.

- [ ] **Write failing tests** proving both entry buttons exist and `Start Chatting` works without personalization.

```js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeScreen from '../components/WelcomeScreen';

test('offers personalization and direct chat paths', () => {
  render(<WelcomeScreen onPersonalize={() => {}} onStartChatting={() => {}} />);
  expect(screen.getByRole('button', { name: /Personalize My Tutor/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Start Chatting/i })).toBeInTheDocument();
});

test('does not force personalization before chat', async () => {
  const onStartChatting = jest.fn();
  render(<WelcomeScreen onPersonalize={() => {}} onStartChatting={onStartChatting} />);
  await userEvent.click(screen.getByRole('button', { name: /Start Chatting/i }));
  expect(onStartChatting).toHaveBeenCalledTimes(1);
});
```

- [ ] **Implement `WelcomeScreen`**:

```js
function WelcomeScreen({ onPersonalize, onStartChatting }) {
  return (
    <section className="welcome-card" aria-labelledby="welcome-title">
      <div className="brand-mark" aria-hidden="true">NT</div>
      <p className="eyebrow">AI Nutrition Tutor</p>
      <h1 id="welcome-title">Learn nutrition without judgment.</h1>
      <p>Ask questions, learn at your pace, and stay in control of your choices.</p>
      <div className="entry-actions">
        <button className="primary-button" onClick={onPersonalize}>Personalize My Tutor</button>
        <button className="secondary-button" onClick={onStartChatting}>Start Chatting</button>
      </div>
      <p className="trust-line">Educational nutrition guidance • You remain in control.</p>
    </section>
  );
}

export default WelcomeScreen;
```

- [ ] **Wire `App` view state** with `welcome`, `personalize`, `chat`.
- [ ] **Style mobile-first** with calm neutral background, white card, green primary action, outlined secondary action, generous spacing, high text contrast.
- [ ] **Run tests** and commit.

```bash
npm test -- --watchAll=false src/__tests__/WelcomeScreen.test.js src/__tests__/App.test.js
git add src/App.js src/App.css src/components/WelcomeScreen.js src/__tests__/WelcomeScreen.test.js
git commit -m "feat: add calm modern tutor welcome flow"
```

---

### Task 3: Implement Optional One-Page Personalization

**Files:** Create `src/lib/personalization.js`, `src/components/PersonalizationForm.js`, `src/__tests__/PersonalizationForm.test.js`; modify `src/App.js`.

**Produces:**

```js
{
  goal: string,
  learningStyle: 'simple' | 'step-by-step' | 'detailed' | '',
  foodContext: string,
  otherContext: string
}
```

- [ ] **Write normalization test**:

```js
import { emptyPersonalization, normalizePersonalization } from '../lib/personalization';

test('normalizes optional personalization', () => {
  expect(normalizePersonalization({
    goal: '  protein  ',
    learningStyle: 'simple',
    foodContext: ' vegetarian ',
    otherContext: ''
  })).toEqual({
    goal: 'protein',
    learningStyle: 'simple',
    foodContext: 'vegetarian',
    otherContext: ''
  });

  expect(emptyPersonalization()).toEqual({
    goal: '', learningStyle: '', foodContext: '', otherContext: ''
  });
});
```

- [ ] **Implement normalizer** with an allowlist for learning style.
- [ ] **Build one-page form** with goal radios, learning-style radios, optional food-context textarea, optional other-context textarea, `Start My Tutor`, and `Back`.
- [ ] **Do not include** age, height, weight, sex, diagnosis, or calorie target fields.
- [ ] **Wire `onComplete(normalizedPersonalization)`** and direct-chat path with `emptyPersonalization()`.
- [ ] **Do not persist personalization** in V1.
- [ ] **Run tests and commit**:

```bash
npm test -- --watchAll=false src/__tests__/PersonalizationForm.test.js src/__tests__/WelcomeScreen.test.js src/__tests__/App.test.js
git add src/App.js src/components/PersonalizationForm.js src/lib/personalization.js src/__tests__/PersonalizationForm.test.js
git commit -m "feat: add optional tutor personalization"
```

---

### Task 4: Define In-Memory Chat State and Browser API Boundary

**Files:** Create `src/lib/api.js`, `src/__tests__/api.test.js`, `src/hooks/useTutorSession.js`, `src/components/ChatComposer.js`, `src/components/ChatMessage.js`, `src/components/ChatScreen.js`, `src/__tests__/ChatScreen.test.js`; modify `src/App.js`.

**Message type:**

```js
{ id: string, role: 'user' | 'assistant', content: string, status: 'sent' | 'failed' }
```

**API helper:** `postTutorMessage({ messages, personalization, action }) -> Promise<{content:string}>`, where action is `null | 'simplify' | 'expand' | 'example'`.

- [ ] **Write API tests** proving `POST /api/chat`, JSON content type, success parsing, and friendly error normalization.
- [ ] **Implement `src/lib/api.js`**:

```js
export async function postTutorMessage(payload) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || 'The tutor could not respond right now. Please try again.');
  }
  return data;
}
```

- [ ] **Write ChatScreen tests** for send success, send failure preserving user text, Retry, and latest-answer controls.
- [ ] **Implement `useTutorSession`** with `messages`, `isSending`, `error`, `sendMessage`, `retryLast`, `transformLatest`, `replaceMessages`, `startNewPrivateSession`.
- [ ] **Never write active Private Session messages to `localStorage`**.
- [ ] **Build chat UI** with composer, messages, starter suggestions, Retry, trust note, and `New Private Session`.
- [ ] **Run tests and commit**:

```bash
npm test -- --watchAll=false src/__tests__/api.test.js src/__tests__/ChatScreen.test.js
git add src/App.js src/hooks/useTutorSession.js src/lib/api.js src/components/ChatComposer.js src/components/ChatMessage.js src/components/ChatScreen.js src/__tests__/api.test.js src/__tests__/ChatScreen.test.js
git commit -m "feat: add private in-memory tutor chat"
```

---

### Task 5: Build Server-Side Prompt Assembly and OpenAI Tutor Service

**Files:** Create `server/prompt.js`, `server/tutorService.js`, `server/__tests__/prompt.test.js`, `server/__tests__/tutorService.test.js`.

**Service:**

```js
createTutorService({ client, model }).respond({ messages, personalization, action })
```

- [ ] **Write prompt tests** proving the tracked Markdown prompt loads, personalization is appended without replacing safety rules, and each action adds the right instruction.
- [ ] **Implement `server/prompt.js`** using `fs.readFileSync(path.join(__dirname, '..', 'prompts', 'system-prompt.md'), 'utf8')`.
- [ ] **Append optional personalization only when non-empty** under a labeled block.
- [ ] **Map response actions**:
  - `simplify`: rewrite the latest answer in simpler language without changing core facts;
  - `expand`: explain latest answer in more detail while preserving tone/safety;
  - `example`: give a practical example relevant to the latest answer.
- [ ] **Write fake-client TutorService tests** proving `responses.create` receives `model`, `store: false`, `instructions`, and user/assistant input messages.
- [ ] **Implement `server/tutorService.js`**:

```js
const { buildInstructions } = require('./prompt');

function normalizeMessages(messages) {
  return (Array.isArray(messages) ? messages : [])
    .filter((m) => ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
    .map(({ role, content }) => ({ role, content: content.trim() }));
}

function createTutorService({ client, model }) {
  return {
    async respond({ messages, personalization, action }) {
      const input = normalizeMessages(messages);
      if (input.length === 0) throw new Error('At least one conversation message is required.');

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
```

- [ ] **Run tests and commit**:

```bash
CI=true npm test -- --watchAll=false server/__tests__/prompt.test.js server/__tests__/tutorService.test.js
git add server/prompt.js server/tutorService.js server/__tests__/prompt.test.js server/__tests__/tutorService.test.js
git commit -m "feat: add server-side nutrition tutor prompt service"
```

---

### Task 6: Add Secure Express `/api/chat`

**Files:** Create `server/app.js`, `server/index.js`, `server/__tests__/app.test.js`; modify `package.json` if needed.

- [ ] **Write route tests** for 200 success, 400 empty conversation, and 502 sanitized upstream failure.
- [ ] **Implement `createApp({ tutorService })`** with `express.json({ limit: '256kb' })`.
- [ ] **Validate action allowlist**: `null`, `simplify`, `expand`, `example`.
- [ ] **Never return raw upstream error text** to the browser.
- [ ] **Implement `server/index.js`** with:

```js
require('dotenv').config();
const OpenAI = require('openai');
```

Construct real client server-side, default model `gpt-5-mini`, default port 3001, and fail startup clearly if `OPENAI_API_KEY` is missing.

- [ ] **Run route tests**:

```bash
CI=true npm test -- --watchAll=false server/__tests__/app.test.js
```

- [ ] **Run secret scan**:

```bash
git grep -n -E 'sk-[A-Za-z0-9_-]{10,}' -- ':!package-lock.json' || true
```

Expected: no key-like secret in tracked source.

- [ ] **Commit**:

```bash
git add server/app.js server/index.js server/__tests__/app.test.js package.json package-lock.json
git commit -m "feat: add secure tutor API endpoint"
```

---

### Task 7: Connect Retry and Teaching Controls

**Files:** Modify `src/hooks/useTutorSession.js`, `src/components/ChatScreen.js`, `src/components/ChatMessage.js`, `src/__tests__/ChatScreen.test.js`.

- [ ] **Add parameterized tests** for `Make this easier -> simplify`, `Explain more -> expand`, `Give me an example -> example`.
- [ ] **Add failed-send Retry test** proving conversation is preserved.
- [ ] **Implement `transformLatest`** without adding a fake visible user message.
- [ ] **Show controls only under latest successful tutor answer**.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/ChatScreen.test.js src/__tests__/api.test.js
git add src/hooks/useTutorSession.js src/components/ChatScreen.js src/components/ChatMessage.js src/__tests__/ChatScreen.test.js
git commit -m "feat: add tutor retry and teaching controls"
```

---

### Task 8: Add Deterministic Automatic Titles

**Files:** Create `src/lib/conversationTitle.js`, `src/__tests__/conversationTitle.test.js`.

**Interface:** `deriveConversationTitle(messages) -> string`, max 48 chars, no network call.

- [ ] **Write tests** for `Can you help me understand protein? -> Understand Protein`, empty fallback `Nutrition Conversation`, and 48-char max.
- [ ] **Implement algorithm**: first non-empty user message; strip leading phrases `can you help me`, `please help me`, `help me`, `i want to learn about`, `i want to understand`; keep max 6 words; title-case; trim at word boundary; fallback if empty.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/conversationTitle.test.js
git add src/lib/conversationTitle.js src/__tests__/conversationTitle.test.js
git commit -m "feat: add automatic saved chat titles"
```

---

### Task 9: Implement Local Saved-Conversation Storage

**Files:** Create `src/lib/savedConversations.js`, `src/__tests__/savedConversations.test.js`.

**Storage key:** `nutritionTutor.savedConversations.v1`.

**Saved shape:**

```js
{
  id: string,
  title: string,
  messages: Array,
  createdAt: string,
  updatedAt: string,
  reviewPolicy: '7d' | '30d' | 'indefinite',
  reviewAt: string | null
}
```

- [ ] **Write fake-storage tests** for empty load, valid save/load, corrupt JSON failure without throwing, exact 7-day/30-day review math, indefinite null review date, extend, keep-until-deleted, rename, delete.
- [ ] **Return structured failures** such as:

```js
{ ok: false, conversations: [], error: 'Saved progress is unavailable in this browser.' }
```

- [ ] **Use** `const DAY_MS = 24 * 60 * 60 * 1000;` for review math.
- [ ] **Never auto-delete because a review is due**.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/savedConversations.test.js
git add src/lib/savedConversations.js src/__tests__/savedConversations.test.js
git commit -m "feat: add private local saved progress storage"
```

---

### Task 10: Build Save Progress, Saved Chats, Rename, Delete

**Files:** Create `src/components/SaveProgressDialog.js`, `src/components/SavedConversationList.js`, `src/__tests__/SaveProgressDialog.test.js`; modify `src/components/ChatScreen.js`, `src/hooks/useTutorSession.js`, `src/App.js`.

- [ ] **Write Save Progress tests** proving choices `Review after 7 days`, `Review after 30 days`, `Keep until I delete it`, and no save before confirmation.
- [ ] **Implement local-only disclosure**: saved on this device/browser; clearing browser/app data may remove it.
- [ ] **Build saved-conversation list** with title, updated date, Continue, Rename, Delete.
- [ ] **Rename**: trim, reject empty, display max 60 chars.
- [ ] **Delete**: confirm before permanent local deletion.
- [ ] **Re-save active saved chat by id** rather than duplicate.
- [ ] **Storage failure**: show `Saved progress is unavailable in this browser. Your Private Session still works.` and keep active chat untouched.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/SaveProgressDialog.test.js src/__tests__/savedConversations.test.js src/__tests__/ChatScreen.test.js
git add src/App.js src/hooks/useTutorSession.js src/components/ChatScreen.js src/components/SaveProgressDialog.js src/components/SavedConversationList.js src/__tests__/SaveProgressDialog.test.js
git commit -m "feat: add user-controlled saved conversations"
```

---

### Task 11: Implement Review-Date Prompts Without Auto-Deletion

**Files:** Create `src/components/ReviewPrompt.js`, `src/__tests__/ReviewPrompt.test.js`; modify `src/App.js`, `src/lib/savedConversations.js`.

- [ ] **Write prompt tests** proving the due chat title and choices: same-period extension, keep until deleted, delete now.
- [ ] **Add regression test**: after review date, load still returns conversation and `isReviewDue(...) === true`.
- [ ] **Use stress-reducing copy**:

```text
Keep this saved conversation?
Your chosen review date has arrived. Nothing has been deleted.
```

- [ ] **Check due reviews on app load**, queue them one at a time, and make Dismiss leave data unchanged.
- [ ] **No timer, notification server, or background job** in V1.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/ReviewPrompt.test.js src/__tests__/savedConversations.test.js
git add src/App.js src/components/ReviewPrompt.js src/lib/savedConversations.js src/__tests__/ReviewPrompt.test.js src/__tests__/savedConversations.test.js
git commit -m "feat: add non-destructive saved chat review flow"
```

---

### Task 12: Add Privacy, Safety, and Trust Copy Without Overclaiming

**Files:** Create `src/components/PrivacyNotice.js`, `src/__tests__/PrivacyNotice.test.js`; modify `src/components/WelcomeScreen.js`, `src/components/ChatScreen.js`, `README.md`.

- [ ] **Write copy tests** proving UI says saved progress is on this device, messages still go to AI service, and no HIPAA-compliance claim appears.
- [ ] **Implement concise copy**:

```text
Private Session does not intentionally save this chat in your browser.
If you choose Save Progress, the conversation is stored on this device.
Messages are still sent to the AI service to generate replies.
```

Add:

```text
This tutor provides nutrition education, not medical diagnosis or treatment.
```

- [ ] **README must state** `store: false` is used but does not itself guarantee zero provider retention; provider-side data controls are separate.
- [ ] **Run and commit**:

```bash
npm test -- --watchAll=false src/__tests__/PrivacyNotice.test.js src/__tests__/WelcomeScreen.test.js
git add src/components/PrivacyNotice.js src/components/WelcomeScreen.js src/components/ChatScreen.js src/__tests__/PrivacyNotice.test.js README.md
git commit -m "docs: clarify tutor privacy and safety boundaries"
```

---

### Task 13: Add Deterministic Safety-Contract Tests

**Files:** Create `server/__tests__/safetyContract.test.js`; modify `server/prompt.js` only if tests expose an actual missing instruction.

- [ ] **Test base instructions retain** autonomy, no shame/guilt/pressure, realistic expectations, educational boundary, professional escalation, and unnecessary-private-info avoidance.
- [ ] **Use a fake OpenAI client** with medically complex sample user inputs and prove full safety instructions remain in each request.
- [ ] **Do not assert exact live-model wording** in automated tests.
- [ ] **Run and commit**:

```bash
CI=true npm test -- --watchAll=false server/__tests__/safetyContract.test.js server/__tests__/prompt.test.js
git add server/__tests__/safetyContract.test.js server/prompt.js
git commit -m "test: enforce nutrition tutor safety contract"
```

---

### Task 14: Production Server and Local Smoke Test

**Files:** Modify `server/index.js`, `README.md`, and `package.json` only if needed.

- [ ] **Serve CRA build in production** after API routes:

```js
const path = require('path');
const buildPath = path.join(__dirname, '..', 'build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});
```

- [ ] **Document local setup**:

```bash
cp .env.example .env
# set OPENAI_API_KEY in .env
npm install
npm run dev
```

Production:

```bash
npm run build
NODE_ENV=production npm run server
```

- [ ] **Run full automated suite**:

```bash
CI=true npm test -- --watchAll=false
```

Expected: PASS.

- [ ] **Run build**:

```bash
npm run build
```

Expected: PASS.

- [ ] **Run hygiene**:

```bash
git diff --check
git status --short
git grep -n -E 'sk-[A-Za-z0-9_-]{10,}' -- ':!package-lock.json' || true
```

- [ ] **Run real API smoke test** with key only in `.env`: app load, direct chat, one real answer, `Make this easier`, Private Session refresh does not restore, save/reopen/rename/delete one chat, no raw errors or secrets.
- [ ] **Commit**:

```bash
git add server/index.js README.md package.json package-lock.json
git commit -m "chore: prepare nutrition tutor MVP for production"
```

---

### Task 15: Final V1 Acceptance Gate

**Files:** No feature files unless a failing acceptance check exposes a real gap.

- [ ] **Verify entry paths**: personalize, skip, no forced sensitive fields, personalization reaches server instructions.
- [ ] **Verify chat**: immediate user message, tutor answer, three controls, failed request preserved, Retry, New Private Session.
- [ ] **Verify saved progress**: explicit opt-in only, multiple chats, auto titles, rename, delete, review policies, no auto-delete, extend/indefinite/delete.
- [ ] **Verify privacy boundary in DevTools**: no API key in browser bundle; frontend calls `/api/chat`; unsaved Private Session messages absent from localStorage; only explicit saves use V1 storage key.
- [ ] **Re-run final proof**:

```bash
CI=true npm test -- --watchAll=false
npm run build
git diff --check
git status --short
```

- [ ] **Record Git evidence**:

```bash
git log --oneline --decorate -12
git status --short
git branch --show-current
```

- [ ] **Push and open/update PR**:

```bash
git push -u origin "$(git branch --show-current)"
```

PR title:

```text
feat: build AI Nutrition Tutor V1 MVP
```

PR body must summarize optional personalization, OpenAI-backed tutor chat, teaching controls, Private Session default, local saved progress/review behavior, privacy/safety boundaries, and exact validation commands.

- [ ] **Final completion report**: repo/branch, files changed, test result, build result, real API smoke result, commit SHA, PR URL, remaining V2 items.

Do not call V1 complete if the real API smoke test has not succeeded.

---

## Self-Review Against Approved Spec

- Calm + Modern mobile-first UI: Tasks 2, 14, 15.
- Optional onboarding and direct skip: Tasks 2, 3, 15.
- No forced sensitive onboarding fields: Task 3.
- Existing system prompt preserved and used: Task 5.
- Server-side OpenAI integration: Tasks 5, 6.
- API key not exposed client-side: Tasks 1, 6, 15.
- Session-only default: Tasks 4, 9, 10, 15.
- Multiple local saved conversations: Tasks 9, 10.
- Automatic titles + rename: Tasks 8, 10.
- 7/30/indefinite review policies: Tasks 9, 10, 11.
- No automatic deletion: Task 11.
- Extend/indefinite/delete at review: Task 11.
- Manual deletion: Tasks 9, 10.
- Retry without lost work: Tasks 4, 7.
- Make easier / explain more / example: Tasks 5, 7.
- Storage failure keeps Private Session working: Tasks 9, 10.
- Safety and escalation contract: Tasks 5, 12, 13.
- No HIPAA overclaim: Task 12.
- Production build and real smoke proof: Tasks 14, 15.
- V2 scope remains excluded: Global Constraints and acceptance gate.

## Implementation Blocker Before Task 1

The current ChatGPT GitHub App connection can read the public target repository but is installed only on the `EndeavorEverlasting` account, not on `patrickperez4594-ux`. Before executing Task 1 from this chat, the GitHub connection must be granted write access to `patrickperez4594-ux/nutrition-tutor`; otherwise branch/file writes will continue returning HTTP 403.
