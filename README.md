# AI Nutrition Tutor V1

A calm, modern, privacy-conscious AI nutrition learning companion. Version 1 is designed as an educational tutor: it teaches nutrition without shame, respects user autonomy, offers optional personalization, and saves conversations only when the user explicitly chooses to save progress.

## What V1 includes

- Optional **Personalize My Tutor** onboarding or immediate **Start Chatting** path.
- OpenAI-powered nutrition chat through a **server-side** API boundary.
- Existing Nutrition Tutor behavioral prompt in `prompts/system-prompt.md`.
- **Make this easier**, **Explain more**, and **Give me an example** teaching controls.
- **Private Session** by default: active chat state stays in memory unless the user chooses Save Progress.
- Multiple locally saved conversations with automatic titles and optional rename.
- Review-after-7-days, review-after-30-days, or keep-until-deleted choices.
- Review dates **never delete a conversation automatically**.
- Manual deletion is always available.
- Friendly retry behavior when an AI request fails.
- Mobile-first responsive design.

## Important privacy boundary

Private Session means this app does not intentionally persist that conversation in browser storage. If the user selects **Save Progress**, the conversation is saved to that browser/device using local storage.

Messages still have to be sent to OpenAI to generate tutor responses. The server requests the Responses API with `store: false`, but this application does **not** claim that this alone guarantees zero provider retention. Provider-side data controls are governed by the OpenAI API account/project configuration.

**This project does not claim HIPAA compliance.**

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm
- An OpenAI API key with API billing/credits enabled

## Local setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

```dotenv
OPENAI_API_KEY=your_real_api_key_here
OPENAI_MODEL=gpt-5-mini
API_PORT=3001
```

Never commit `.env`.

Run frontend + backend together:

```bash
npm run dev
```

The React development app normally opens at:

```text
http://localhost:3000
```

The Express API runs at:

```text
http://localhost:3001
```

## Production build

```bash
npm run build
NODE_ENV=production npm run server
```

The production Express server serves both the React build and `/api/chat`.

## Tests

After dependencies are installed:

```bash
npm run test:ci
```

Then verify the production bundle:

```bash
npm run build
```

## Uploading to GitHub

If replacing the current minimal `nutrition-tutor` repository contents:

1. Extract this ZIP on your computer.
2. Keep your existing GitHub repository as the destination.
3. Copy all extracted project files into the local clone of `nutrition-tutor`.
4. Do **not** copy a `.env` file into GitHub.
5. Run `npm install`, `npm run test:ci`, and `npm run build` locally.
6. Commit and push the source files.

Typical Git commands after copying into a local clone:

```bash
git checkout -b feat/kefi-v2-foundation
npm install
npm run test:ci
npm run build
git add .
git status
git commit -m "feat: build AI Nutrition Tutor V1 MVP"
git push -u origin feat/kefi-v2-foundation
```

Then open a pull request into `main`.

## Project structure

```text
public/                      React public shell
prompts/                     Nutrition Tutor behavior prompt
server/                      Express + OpenAI Responses API boundary
src/components/              UI components
src/hooks/                   In-memory tutor session behavior
src/lib/                     API, personalization, titles, local storage
src/__tests__/               Frontend/unit tests
server/__tests__/            Server contract tests
docs/superpowers/specs/      Approved V1 design
docs/superpowers/plans/      Approved implementation plan
```

## Deferred to V2+

Accounts, cloud chat history, cross-device sync, meal logging, progress dashboards, payments, booking, analytics, push notifications, admin tools, editable long-term profiles, advanced accessibility settings, and verified HIPAA-compliant infrastructure are intentionally out of scope for V1.

## Kefi V2 foundation

Kefi V2 is being introduced incrementally so the working V1 experience remains available while the product gains stronger internal contracts.

- The V1 user experience and `/api/chat` contract remain operational during Plan 01.
- V2 work is introduced behind additive domain, provider, orchestration, and configuration contracts.
- `shared/calculations/` contains deterministic calculations only and must not call AI or network services.
- `server/orchestration/contextPolicy.js` enforces minimum-necessary context through explicit allowlists.
- V2-only feature flags default to off until the matching subsystem plan is implemented and verified.
- The existing Nutrition Tutor system prompt remains unchanged during this foundation phase.

See `docs/architecture/kefi-v2-foundation.md` for module ownership and extension rules.
