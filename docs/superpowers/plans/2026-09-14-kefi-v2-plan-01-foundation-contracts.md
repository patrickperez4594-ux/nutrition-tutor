# Kefi V2 Plan 01 — Foundation, Contracts & Regression Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the working AI Nutrition Tutor V1 while introducing the modular contracts, deterministic calculation foundation, context permissions, feature flags, provider interfaces, and scenario-test harness that every Kefi V2 subsystem will depend on.

**Architecture:** Evolve the existing React + Express repository in place. Do not redesign user-facing screens in this plan. Add small, focused CommonJS server modules and browser-compatible ES modules that formalize V2 domain boundaries while keeping `/api/chat`, Private Session, local saved conversations, and current teaching controls behaviorally unchanged.

**Tech Stack:** Existing React 18.3.1 / React DOM 18.3.1 / Create React App 5.0.1, Node.js 18+ (20+ recommended), Express 4.x, Jest + Testing Library, supertest, official OpenAI JavaScript SDK, dotenv. No database, account system, queue, or new UI framework in this plan.

**Spec:** `docs/superpowers/specs/2026-09-14-kefi-v2-design.md`

## Global Constraints

- Target repository: `patrickperez4594-ux/nutrition-tutor`.
- Preserve the existing V1 React + Express behavior documented by the repository README and V1 implementation plan.
- Preserve `prompts/system-prompt.md` and `prompts/system-prompt.json` in this plan.
- Private Session remains the default and must not intentionally persist active chat messages.
- Existing saved conversations remain local-device/browser data in this plan.
- Existing response controls remain functional: `Make this easier`, `Explain more`, `Give me an example`.
- Existing `/api/chat` remains backward-compatible in this plan.
- OpenAI API credentials remain server-side and `store: false` remains required.
- No HIPAA-compliance claim.
- No accounts, cloud database, push notifications, retailer integrations, vision uploads, or production analytics are introduced in Plan 01.
- Structured domain contracts introduced here must be additive so later plans can migrate features incrementally.
- Deterministic calculations must reject invalid numeric inputs rather than ask an LLM to repair arithmetic.
- Context permissions must be explicit allowlists.
- Feature flags default to false for V2-only features introduced before their implementation plan is complete.
- Every task ends with targeted tests and a commit.
- Final verification: `CI=true npm test -- --watchAll=false`, `npm run build`, `git diff --check`, and repository secret scan.

---

## Current V1 Responsibility Map to Preserve

The existing project is documented with these responsibilities:

- `server/app.js`: Express app factory and `/api/chat` boundary.
- `server/index.js`: server startup and real provider wiring.
- `server/prompt.js`: tracked nutrition-tutor prompt assembly.
- `server/tutorService.js`: OpenAI Responses API call and normalization.
- `src/hooks/useTutorSession.js`: in-memory chat orchestration.
- `src/lib/api.js`: browser `/api/chat` helper.
- `src/lib/savedConversations.js`: local saved-conversation persistence and review behavior.
- `src/lib/personalization.js`: V1 onboarding normalization.
- UI components own presentation only and must not absorb persistence/provider logic.

Plan 01 adds new foundations beside these modules. It does not delete them.

---

## Planned File Structure Added by Plan 01

```text
nutrition-tutor/
├── docs/
│   └── superpowers/
│       ├── specs/
│       │   └── 2026-09-14-kefi-v2-design.md
│       └── plans/
│           ├── 2026-09-14-kefi-v2-implementation-roadmap.md
│           └── 2026-09-14-kefi-v2-plan-01-foundation-contracts.md
├── server/
│   ├── config/
│   │   ├── featureFlags.js
│   │   └── runtimeConfig.js
│   ├── domain/
│   │   ├── confidence.js
│   │   ├── constraints.js
│   │   ├── contextTypes.js
│   │   └── provenance.js
│   ├── orchestration/
│   │   └── contextPolicy.js
│   ├── providers/
│   │   └── contracts.js
│   └── __tests__/
│       ├── featureFlags.test.js
│       ├── runtimeConfig.test.js
│       ├── confidence.test.js
│       ├── constraints.test.js
│       ├── contextPolicy.test.js
│       └── providerContracts.test.js
├── src/
│   ├── domain/
│   │   ├── dataClasses.js
│   │   └── workflowStatus.js
│   └── __tests__/
│       ├── dataClasses.test.js
│       └── workflowStatus.test.js
├── shared/
│   └── calculations/
│       ├── energy.js
│       ├── glycemic.js
│       ├── units.js
│       └── __tests__/
│           ├── energy.test.js
│           ├── glycemic.test.js
│           └── units.test.js
└── tests/
    └── scenarios/
        ├── fixtures.js
        └── v1-regression.scenario.test.js
```

The `shared/calculations` modules use CommonJS (`module.exports`) so the Node test/runtime can consume them directly. Later plans may add browser-facing wrappers or move to a build-time shared package only if the existing CRA configuration supports it cleanly.

---

### Task 1: Commit the Approved V2 Spec and Roadmap Without Changing Runtime Behavior

**Files:**
- Create: `docs/superpowers/specs/2026-09-14-kefi-v2-design.md`
- Create: `docs/superpowers/plans/2026-09-14-kefi-v2-implementation-roadmap.md`
- Create: `docs/superpowers/plans/2026-09-14-kefi-v2-plan-01-foundation-contracts.md`
- Verify only: `README.md`, `package.json`, `src/`, `server/`, `prompts/`

**Interfaces:**
- Consumes: existing V1 repository as-is.
- Produces: tracked approved V2 spec and implementation-plan documents at stable paths used by all later plans.

- [ ] **Step 1: Confirm the repository baseline before writing files**

Run:

```bash
git status --short
git branch --show-current
find src server prompts -maxdepth 3 -type f | sort
```

Expected: no unexplained working-tree changes; current V1 files are visible.

- [ ] **Step 2: Run the existing V1 automated suite before any runtime change**

Run:

```bash
CI=true npm test -- --watchAll=false
```

Expected: PASS. If it does not pass, stop Plan 01 and record/fix the baseline failure separately before attributing failures to V2 work.

- [ ] **Step 3: Verify the production bundle baseline**

Run:

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 4: Add the three approved planning documents at the exact paths above**

Do not edit product code in this step.

- [ ] **Step 5: Commit the planning baseline**

```bash
git add docs/superpowers/specs/2026-09-14-kefi-v2-design.md \
  docs/superpowers/plans/2026-09-14-kefi-v2-implementation-roadmap.md \
  docs/superpowers/plans/2026-09-14-kefi-v2-plan-01-foundation-contracts.md
git commit -m "docs: add approved Kefi V2 design and implementation roadmap"
```

---

### Task 2: Add V1 Regression Scenarios Before Refactoring

**Files:**
- Create: `tests/scenarios/fixtures.js`
- Create: `tests/scenarios/v1-regression.scenario.test.js`
- Modify: `package.json` only if Jest currently excludes the top-level `tests/` directory.

**Interfaces:**
- Consumes: `server/app.js`, current `src/lib/savedConversations.js`, current prompt/tutor boundary.
- Produces: reusable `makeConversation()`, `makePersonalization()`, and high-value V1 regression tests that later plans must keep passing.

- [ ] **Step 1: Create deterministic scenario fixtures**

```js
// tests/scenarios/fixtures.js
function makeConversation() {
  return [
    { id: 'u1', role: 'user', content: 'What does protein do?', status: 'sent' },
    { id: 'a1', role: 'assistant', content: 'Protein supplies amino acids.', status: 'sent' }
  ];
}

function makePersonalization() {
  return {
    goal: 'protein',
    learningStyle: 'simple',
    foodContext: '',
    otherContext: ''
  };
}

module.exports = { makeConversation, makePersonalization };
```

- [ ] **Step 2: Write regression tests around the server contract**

Use the existing `createApp({ tutorService })` interface from `server/app.js`. Test that a normal `/api/chat` request remains accepted and the service receives messages, personalization, and the existing action field.

```js
const request = require('supertest');
const { createApp } = require('../../server/app');
const { makePersonalization } = require('./fixtures');

test('V1 chat contract remains backward compatible', async () => {
  const calls = [];
  const tutorService = {
    respond: async (payload) => {
      calls.push(payload);
      return { content: 'Protein helps build and repair tissue.' };
    }
  };
  const app = createApp({ tutorService });

  const response = await request(app)
    .post('/api/chat')
    .send({
      messages: [{ role: 'user', content: 'What does protein do?' }],
      personalization: makePersonalization(),
      action: null
    });

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ content: 'Protein helps build and repair tissue.' });
  expect(calls).toHaveLength(1);
});
```

- [ ] **Step 3: Add regression assertions for V1 teaching actions**

Parameterize the existing values:

```js
test.each(['simplify', 'expand', 'example'])('accepts V1 action %s', async (action) => {
  // use createApp with a fake service and assert payload.action === action
});
```

Do not invent V2 action values in this task.

- [ ] **Step 4: Add a regression test proving review-due saved conversations are not automatically deleted**

Import the current public functions from `src/lib/savedConversations.js` and use the same fake-storage technique as the existing unit tests. Assert that a due conversation is still returned and only marked/reported due through the module's existing API.

- [ ] **Step 5: Run the new scenarios and full V1 suite**

```bash
CI=true npm test -- --watchAll=false tests/scenarios/v1-regression.scenario.test.js
CI=true npm test -- --watchAll=false
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/scenarios/fixtures.js tests/scenarios/v1-regression.scenario.test.js package.json
git commit -m "test: capture V1 regression scenarios before Kefi V2"
```

---

### Task 3: Add Data Classification and Workflow Status Contracts

**Files:**
- Create: `src/domain/dataClasses.js`
- Create: `src/domain/workflowStatus.js`
- Create: `src/__tests__/dataClasses.test.js`
- Create: `src/__tests__/workflowStatus.test.js`

**Interfaces:**
- Consumes: approved V2 privacy/data-classification and workflow-state definitions.
- Produces:
  - `DATA_CLASS` enum-like object.
  - `isPersistentDataClass(value) -> boolean`.
  - `WORKFLOW_STATUS` enum-like object.
  - `isTerminalWorkflowStatus(value) -> boolean`.

- [ ] **Step 1: Write failing data-class tests**

```js
import { DATA_CLASS, isPersistentDataClass } from '../domain/dataClasses';

test('defines the four approved Kefi data classes', () => {
  expect(DATA_CLASS).toEqual({
    TEMPORARY_SESSION: 'temporary_session',
    LOCAL_SAVED: 'local_saved',
    AI_PROCESSING: 'ai_processing',
    EXPLICITLY_RETAINED: 'explicitly_retained'
  });
});

test('only saved/retained classes are persistent', () => {
  expect(isPersistentDataClass(DATA_CLASS.TEMPORARY_SESSION)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.AI_PROCESSING)).toBe(false);
  expect(isPersistentDataClass(DATA_CLASS.LOCAL_SAVED)).toBe(true);
  expect(isPersistentDataClass(DATA_CLASS.EXPLICITLY_RETAINED)).toBe(true);
});
```

- [ ] **Step 2: Run the data-class test and verify failure**

```bash
CI=true npm test -- --watchAll=false src/__tests__/dataClasses.test.js
```

Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement `src/domain/dataClasses.js`**

```js
export const DATA_CLASS = Object.freeze({
  TEMPORARY_SESSION: 'temporary_session',
  LOCAL_SAVED: 'local_saved',
  AI_PROCESSING: 'ai_processing',
  EXPLICITLY_RETAINED: 'explicitly_retained'
});

export function isPersistentDataClass(value) {
  return value === DATA_CLASS.LOCAL_SAVED || value === DATA_CLASS.EXPLICITLY_RETAINED;
}
```

- [ ] **Step 4: Write workflow-status tests**

```js
import { WORKFLOW_STATUS, isTerminalWorkflowStatus } from '../domain/workflowStatus';

test('defines approved workflow lifecycle states', () => {
  expect(WORKFLOW_STATUS.CREATED).toBe('created');
  expect(WORKFLOW_STATUS.WAITING_FOR_CONFIRMATION).toBe('waiting_for_confirmation');
  expect(WORKFLOW_STATUS.COMPLETED).toBe('completed');
  expect(WORKFLOW_STATUS.FAILED).toBe('failed');
  expect(WORKFLOW_STATUS.CANCELLED).toBe('cancelled');
  expect(WORKFLOW_STATUS.EXPIRED).toBe('expired');
});

test.each(['completed', 'failed', 'cancelled', 'expired'])(
  '%s is terminal',
  (status) => expect(isTerminalWorkflowStatus(status)).toBe(true)
);
```

- [ ] **Step 5: Implement workflow status module**

```js
export const WORKFLOW_STATUS = Object.freeze({
  CREATED: 'created',
  OBSERVING: 'observing',
  WAITING_FOR_CONFIRMATION: 'waiting_for_confirmation',
  ANALYZING: 'analyzing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
});

const TERMINAL = new Set([
  WORKFLOW_STATUS.COMPLETED,
  WORKFLOW_STATUS.FAILED,
  WORKFLOW_STATUS.CANCELLED,
  WORKFLOW_STATUS.EXPIRED
]);

export function isTerminalWorkflowStatus(value) {
  return TERMINAL.has(value);
}
```

- [ ] **Step 6: Run and commit**

```bash
CI=true npm test -- --watchAll=false src/__tests__/dataClasses.test.js src/__tests__/workflowStatus.test.js
git add src/domain src/__tests__/dataClasses.test.js src/__tests__/workflowStatus.test.js
git commit -m "feat: add Kefi data and workflow contracts"
```

---

### Task 4: Add Confidence and Provenance Contracts

**Files:**
- Create: `server/domain/confidence.js`
- Create: `server/domain/provenance.js`
- Create: `server/__tests__/confidence.test.js`

**Interfaces:**
- Produces:
  - `CONFIDENCE_LEVEL = { HIGH, MODERATE, LOW, UNKNOWN }`.
  - `makeConfidence({ level, reasonCodes })`.
  - `makeProvenance({ sourceType, provider, sourceId, retrievedAt, publishedAt, verificationStatus })`.

- [ ] **Step 1: Write failing confidence tests**

```js
const { CONFIDENCE_LEVEL, makeConfidence } = require('../domain/confidence');

test('builds immutable-style normalized confidence metadata', () => {
  expect(makeConfidence({
    level: CONFIDENCE_LEVEL.MODERATE,
    reasonCodes: ['portion_uncertain', 'sauce_unknown', 'portion_uncertain']
  })).toEqual({
    level: 'moderate',
    reasonCodes: ['portion_uncertain', 'sauce_unknown']
  });
});

test('rejects unsupported confidence levels', () => {
  expect(() => makeConfidence({ level: 'certain', reasonCodes: [] }))
    .toThrow('Unsupported confidence level: certain');
});
```

- [ ] **Step 2: Implement confidence module**

```js
const CONFIDENCE_LEVEL = Object.freeze({
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
  UNKNOWN: 'unknown'
});

const LEVELS = new Set(Object.values(CONFIDENCE_LEVEL));

function makeConfidence({ level, reasonCodes = [] }) {
  if (!LEVELS.has(level)) throw new Error(`Unsupported confidence level: ${level}`);
  const normalizedReasons = [...new Set(reasonCodes.filter((value) => typeof value === 'string' && value.trim()))];
  return { level, reasonCodes: normalizedReasons };
}

module.exports = { CONFIDENCE_LEVEL, makeConfidence };
```

- [ ] **Step 3: Write provenance tests in the same test file**

```js
const { makeProvenance } = require('../domain/provenance');

test('requires source type and provider for external provenance', () => {
  expect(makeProvenance({
    sourceType: 'food_database',
    provider: 'test-provider',
    sourceId: 'food-123',
    retrievedAt: '2026-09-14T12:00:00.000Z',
    verificationStatus: 'verified'
  })).toEqual({
    sourceType: 'food_database',
    provider: 'test-provider',
    sourceId: 'food-123',
    retrievedAt: '2026-09-14T12:00:00.000Z',
    publishedAt: null,
    verificationStatus: 'verified'
  });
});
```

- [ ] **Step 4: Implement provenance module**

```js
function requireText(name, value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

function makeProvenance({
  sourceType,
  provider,
  sourceId = null,
  retrievedAt,
  publishedAt = null,
  verificationStatus
}) {
  return {
    sourceType: requireText('sourceType', sourceType),
    provider: requireText('provider', provider),
    sourceId,
    retrievedAt: requireText('retrievedAt', retrievedAt),
    publishedAt,
    verificationStatus: requireText('verificationStatus', verificationStatus)
  };
}

module.exports = { makeProvenance };
```

- [ ] **Step 5: Run and commit**

```bash
CI=true npm test -- --watchAll=false server/__tests__/confidence.test.js
git add server/domain/confidence.js server/domain/provenance.js server/__tests__/confidence.test.js
git commit -m "feat: add confidence and provenance contracts"
```

---

### Task 5: Add Hard Constraint and Preference Contracts

**Files:**
- Create: `server/domain/constraints.js`
- Create: `server/__tests__/constraints.test.js`

**Interfaces:**
- Produces:
  - `CONSTRAINT_KIND.HARD | PREFERENCE | OPTIMIZATION`.
  - `makeConstraint({ id, kind, type, value, source })`.
  - `partitionConstraints(constraints) -> { hard, preferences, optimization }`.

- [ ] **Step 1: Write failing tests**

```js
const {
  CONSTRAINT_KIND,
  makeConstraint,
  partitionConstraints
} = require('../domain/constraints');

test('preserves allergies as explicit hard constraints', () => {
  const peanut = makeConstraint({
    id: 'allergy-peanut',
    kind: CONSTRAINT_KIND.HARD,
    type: 'allergy',
    value: 'peanut',
    source: 'user_confirmed'
  });
  expect(peanut.kind).toBe('hard');
  expect(peanut.type).toBe('allergy');
});

test('partitions constraints without silently dropping any item', () => {
  const constraints = [
    makeConstraint({ id: '1', kind: 'hard', type: 'allergy', value: 'peanut', source: 'user_confirmed' }),
    makeConstraint({ id: '2', kind: 'preference', type: 'dislike', value: 'mushroom', source: 'user_confirmed' }),
    makeConstraint({ id: '3', kind: 'optimization', type: 'protein', value: 'higher', source: 'goal' })
  ];
  const result = partitionConstraints(constraints);
  expect(result.hard).toHaveLength(1);
  expect(result.preferences).toHaveLength(1);
  expect(result.optimization).toHaveLength(1);
  expect(result.hard.length + result.preferences.length + result.optimization.length).toBe(3);
});
```

- [ ] **Step 2: Implement the minimal constraint model**

```js
const CONSTRAINT_KIND = Object.freeze({
  HARD: 'hard',
  PREFERENCE: 'preference',
  OPTIMIZATION: 'optimization'
});

const ALLOWED_KINDS = new Set(Object.values(CONSTRAINT_KIND));

function makeConstraint({ id, kind, type, value, source }) {
  if (!ALLOWED_KINDS.has(kind)) throw new Error(`Unsupported constraint kind: ${kind}`);
  if (!id || !type || value === undefined || value === null || !source) {
    throw new Error('Constraint id, type, value, and source are required.');
  }
  return { id, kind, type, value, source };
}

function partitionConstraints(constraints = []) {
  const result = { hard: [], preferences: [], optimization: [] };
  for (const constraint of constraints) {
    const normalized = makeConstraint(constraint);
    if (normalized.kind === CONSTRAINT_KIND.HARD) result.hard.push(normalized);
    if (normalized.kind === CONSTRAINT_KIND.PREFERENCE) result.preferences.push(normalized);
    if (normalized.kind === CONSTRAINT_KIND.OPTIMIZATION) result.optimization.push(normalized);
  }
  return result;
}

module.exports = { CONSTRAINT_KIND, makeConstraint, partitionConstraints };
```

- [ ] **Step 3: Run and commit**

```bash
CI=true npm test -- --watchAll=false server/__tests__/constraints.test.js
git add server/domain/constraints.js server/__tests__/constraints.test.js
git commit -m "feat: model hard constraints and preferences explicitly"
```

---

### Task 6: Add Minimum-Necessary Context Types and Access Policy

**Files:**
- Create: `server/domain/contextTypes.js`
- Create: `server/orchestration/contextPolicy.js`
- Create: `server/__tests__/contextPolicy.test.js`

**Interfaces:**
- Produces:
  - `CONTEXT_TYPE` constants.
  - `ENGINE_CONTEXT_ALLOWLIST`.
  - `assertContextAllowed(engineName, requestedTypes)`.
  - `filterContext(engineName, contextByType)`.

- [ ] **Step 1: Define the context categories in a failing test**

```js
const { CONTEXT_TYPE } = require('../domain/contextTypes');
const { assertContextAllowed, filterContext } = require('../orchestration/contextPolicy');

test('grocery engine may request budget, pantry, food preferences, cooking context and goals', () => {
  expect(() => assertContextAllowed('grocery', [
    CONTEXT_TYPE.BUDGET,
    CONTEXT_TYPE.PANTRY,
    CONTEXT_TYPE.FOOD_PREFERENCES,
    CONTEXT_TYPE.COOKING_CONTEXT,
    CONTEXT_TYPE.GOALS
  ])).not.toThrow();
});

test('grocery engine may not request unrelated sensitive medical context by default', () => {
  expect(() => assertContextAllowed('grocery', [CONTEXT_TYPE.MEDICAL_CONTEXT]))
    .toThrow('grocery may not access context type: medical_context');
});

test('filterContext returns only explicitly allowed categories', () => {
  const filtered = filterContext('learning', {
    learning_preferences: { responseLength: 'short' },
    goals: [{ type: 'learn_nutrition' }],
    medical_context: { diagnosis: 'should-not-flow-here' }
  });
  expect(filtered).toEqual({
    learning_preferences: { responseLength: 'short' },
    goals: [{ type: 'learn_nutrition' }]
  });
});
```

- [ ] **Step 2: Implement `contextTypes.js`**

```js
const CONTEXT_TYPE = Object.freeze({
  FOOD_PREFERENCES: 'food_preferences',
  DIETARY_RESTRICTIONS: 'dietary_restrictions',
  CUISINE: 'cuisine',
  BUDGET: 'budget',
  COOKING_CONTEXT: 'cooking_context',
  LEARNING_PREFERENCES: 'learning_preferences',
  NUTRITION_PREFERENCES: 'nutrition_preferences',
  ACCESSIBILITY_PREFERENCES: 'accessibility_preferences',
  LOCALE: 'locale',
  GOALS: 'goals',
  PANTRY: 'pantry',
  RECENT_PROGRESS: 'recent_progress',
  MEDICAL_CONTEXT: 'medical_context'
});

module.exports = { CONTEXT_TYPE };
```

- [ ] **Step 3: Implement explicit engine allowlists**

```js
const { CONTEXT_TYPE } = require('../domain/contextTypes');

const ENGINE_CONTEXT_ALLOWLIST = Object.freeze({
  tutor: new Set(Object.values(CONTEXT_TYPE)),
  learning: new Set([
    CONTEXT_TYPE.LEARNING_PREFERENCES,
    CONTEXT_TYPE.GOALS,
    CONTEXT_TYPE.LOCALE,
    CONTEXT_TYPE.ACCESSIBILITY_PREFERENCES
  ]),
  grocery: new Set([
    CONTEXT_TYPE.BUDGET,
    CONTEXT_TYPE.PANTRY,
    CONTEXT_TYPE.FOOD_PREFERENCES,
    CONTEXT_TYPE.DIETARY_RESTRICTIONS,
    CONTEXT_TYPE.CUISINE,
    CONTEXT_TYPE.COOKING_CONTEXT,
    CONTEXT_TYPE.GOALS,
    CONTEXT_TYPE.LOCALE
  ])
});

function getAllowlist(engineName) {
  const allowlist = ENGINE_CONTEXT_ALLOWLIST[engineName];
  if (!allowlist) throw new Error(`Unknown engine: ${engineName}`);
  return allowlist;
}

function assertContextAllowed(engineName, requestedTypes = []) {
  const allowlist = getAllowlist(engineName);
  for (const type of requestedTypes) {
    if (!allowlist.has(type)) throw new Error(`${engineName} may not access context type: ${type}`);
  }
}

function filterContext(engineName, contextByType = {}) {
  const allowlist = getAllowlist(engineName);
  return Object.fromEntries(Object.entries(contextByType).filter(([type]) => allowlist.has(type)));
}

module.exports = { ENGINE_CONTEXT_ALLOWLIST, assertContextAllowed, filterContext };
```

- [ ] **Step 4: Run and commit**

```bash
CI=true npm test -- --watchAll=false server/__tests__/contextPolicy.test.js
git add server/domain/contextTypes.js server/orchestration/contextPolicy.js server/__tests__/contextPolicy.test.js
git commit -m "feat: enforce minimum necessary engine context"
```

---

### Task 7: Add Deterministic Calculation Registry — Energy

**Files:**
- Create: `shared/calculations/energy.js`
- Create: `shared/calculations/__tests__/energy.test.js`

**Interfaces:**
- Produces:
  - `calculateMifflinStJeor({ sex, weightKg, heightCm, ageYears }) -> number`.
  - `calculateTdee({ bmr, activityFactor }) -> number`.
  - `ACTIVITY_FACTOR` constants.
- Throws clear validation errors for unsupported/invalid inputs.

- [ ] **Step 1: Write reference tests for Mifflin–St Jeor**

```js
const {
  ACTIVITY_FACTOR,
  calculateMifflinStJeor,
  calculateTdee
} = require('../energy');

test('calculates adult male Mifflin-St Jeor deterministically', () => {
  expect(calculateMifflinStJeor({
    sex: 'male', weightKg: 80, heightCm: 180, ageYears: 30
  })).toBe(1780);
});

test('calculates adult female Mifflin-St Jeor deterministically', () => {
  expect(calculateMifflinStJeor({
    sex: 'female', weightKg: 65, heightCm: 165, ageYears: 30
  })).toBeCloseTo(1400.25, 2);
});

test('calculates TDEE from BMR and an explicit factor', () => {
  expect(calculateTdee({ bmr: 1780, activityFactor: ACTIVITY_FACTOR.MODERATE }))
    .toBeCloseTo(2759, 0);
});

test.each([
  [{ sex: 'male', weightKg: 0, heightCm: 180, ageYears: 30 }, 'weightKg'],
  [{ sex: 'other', weightKg: 80, heightCm: 180, ageYears: 30 }, 'sex'],
  [{ sex: 'female', weightKg: 65, heightCm: 165, ageYears: -1 }, 'ageYears']
])('rejects invalid input %o', (input, field) => {
  expect(() => calculateMifflinStJeor(input)).toThrow(field);
});
```

- [ ] **Step 2: Implement the calculation module**

```js
const ACTIVITY_FACTOR = Object.freeze({
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9
});

function positiveNumber(name, value) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a positive number.`);
  return value;
}

function calculateMifflinStJeor({ sex, weightKg, heightCm, ageYears }) {
  positiveNumber('weightKg', weightKg);
  positiveNumber('heightCm', heightCm);
  positiveNumber('ageYears', ageYears);
  if (!['male', 'female'].includes(sex)) throw new Error('sex must be male or female for this equation.');
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === 'male' ? base + 5 : base - 161;
}

function calculateTdee({ bmr, activityFactor }) {
  positiveNumber('bmr', bmr);
  positiveNumber('activityFactor', activityFactor);
  return bmr * activityFactor;
}

module.exports = { ACTIVITY_FACTOR, calculateMifflinStJeor, calculateTdee };
```

- [ ] **Step 3: Run and commit**

```bash
CI=true npm test -- --watchAll=false shared/calculations/__tests__/energy.test.js
git add shared/calculations/energy.js shared/calculations/__tests__/energy.test.js
git commit -m "feat: add deterministic Kefi energy calculations"
```

---

### Task 8: Add Deterministic Calculation Registry — GI/GL and Units

**Files:**
- Create: `shared/calculations/glycemic.js`
- Create: `shared/calculations/units.js`
- Create: `shared/calculations/__tests__/glycemic.test.js`
- Create: `shared/calculations/__tests__/units.test.js`

**Interfaces:**
- Produces:
  - `calculateGlycemicLoad({ glycemicIndex, availableCarbGrams })`.
  - `classifyGlycemicIndex(glycemicIndex) -> 'low' | 'medium' | 'high'`.
  - `lbToKg`, `kgToLb`, `inchToCm`, `cmToInch`, `kcalToKj`, `kjToKcal`.

- [ ] **Step 1: Write GI/GL tests**

```js
const { calculateGlycemicLoad, classifyGlycemicIndex } = require('../glycemic');

test('calculates GL using GI × available carbohydrate / 100', () => {
  expect(calculateGlycemicLoad({ glycemicIndex: 55, availableCarbGrams: 20 })).toBe(11);
});

test.each([
  [55, 'low'],
  [56, 'medium'],
  [69, 'medium'],
  [70, 'high']
])('classifies GI %s as %s', (gi, expected) => {
  expect(classifyGlycemicIndex(gi)).toBe(expected);
});
```

- [ ] **Step 2: Implement GI/GL module**

```js
function validNonnegative(name, value) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a nonnegative number.`);
  return value;
}

function calculateGlycemicLoad({ glycemicIndex, availableCarbGrams }) {
  validNonnegative('glycemicIndex', glycemicIndex);
  validNonnegative('availableCarbGrams', availableCarbGrams);
  return (glycemicIndex * availableCarbGrams) / 100;
}

function classifyGlycemicIndex(glycemicIndex) {
  validNonnegative('glycemicIndex', glycemicIndex);
  if (glycemicIndex <= 55) return 'low';
  if (glycemicIndex <= 69) return 'medium';
  return 'high';
}

module.exports = { calculateGlycemicLoad, classifyGlycemicIndex };
```

- [ ] **Step 3: Write unit conversion tests**

```js
const { lbToKg, kgToLb, inchToCm, kcalToKj, kjToKcal } = require('../units');

test('converts pounds and kilograms deterministically', () => {
  expect(lbToKg(220)).toBeCloseTo(99.7903, 3);
  expect(kgToLb(100)).toBeCloseTo(220.462, 3);
});

test('converts inches to centimeters', () => {
  expect(inchToCm(70)).toBeCloseTo(177.8, 3);
});

test('converts kcal and kJ', () => {
  expect(kcalToKj(100)).toBeCloseTo(418.4, 1);
  expect(kjToKcal(418.4)).toBeCloseTo(100, 1);
});
```

- [ ] **Step 4: Implement unit conversions with one numeric validator**

```js
const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;
const KJ_PER_KCAL = 4.184;

function finite(name, value) {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}

const lbToKg = (value) => finite('value', value) * KG_PER_LB;
const kgToLb = (value) => finite('value', value) / KG_PER_LB;
const inchToCm = (value) => finite('value', value) * CM_PER_INCH;
const cmToInch = (value) => finite('value', value) / CM_PER_INCH;
const kcalToKj = (value) => finite('value', value) * KJ_PER_KCAL;
const kjToKcal = (value) => finite('value', value) / KJ_PER_KCAL;

module.exports = { lbToKg, kgToLb, inchToCm, cmToInch, kcalToKj, kjToKcal };
```

- [ ] **Step 5: Run and commit**

```bash
CI=true npm test -- --watchAll=false shared/calculations/__tests__/glycemic.test.js shared/calculations/__tests__/units.test.js
git add shared/calculations/glycemic.js shared/calculations/units.js shared/calculations/__tests__
git commit -m "feat: add glycemic and unit calculation registry"
```

---

### Task 9: Add Provider Contracts Without Changing the Current OpenAI Service

**Files:**
- Create: `server/providers/contracts.js`
- Create: `server/__tests__/providerContracts.test.js`

**Interfaces:**
- Produces constructor guards for:
  - `LanguageModelProvider`
  - `VisionProvider`
  - `FoodDataProvider`
  - `GIDataProvider`
  - `ProductDataProvider`
  - `RestaurantDataProvider`
  - `StoreDataProvider`
  - `EvidenceProvider`
- Does not yet replace `server/tutorService.js`.

- [ ] **Step 1: Write tests for contract validation**

```js
const { defineProvider } = require('../providers/contracts');

test('accepts a provider that implements required methods', () => {
  const provider = defineProvider('LanguageModelProvider', ['generate'], {
    generate: async () => ({ content: 'ok' })
  });
  expect(typeof provider.generate).toBe('function');
});

test('rejects missing provider methods', () => {
  expect(() => defineProvider('VisionProvider', ['observeImage'], {}))
    .toThrow('VisionProvider is missing method: observeImage');
});
```

- [ ] **Step 2: Implement a dependency-free contract helper and named method sets**

```js
const PROVIDER_METHODS = Object.freeze({
  LanguageModelProvider: ['generate'],
  VisionProvider: ['observeImage'],
  FoodDataProvider: ['findFoods', 'getFood'],
  GIDataProvider: ['findGlycemicData'],
  ProductDataProvider: ['getProduct'],
  RestaurantDataProvider: ['findRestaurantItems'],
  StoreDataProvider: ['findProducts'],
  EvidenceProvider: ['searchEvidence']
});

function defineProvider(name, requiredMethods, implementation) {
  for (const method of requiredMethods) {
    if (typeof implementation?.[method] !== 'function') {
      throw new Error(`${name} is missing method: ${method}`);
    }
  }
  return implementation;
}

module.exports = { PROVIDER_METHODS, defineProvider };
```

- [ ] **Step 3: Add a parameterized test proving every named contract has at least one required method and unique method names**

Do not implement fake production providers yet.

- [ ] **Step 4: Run and commit**

```bash
CI=true npm test -- --watchAll=false server/__tests__/providerContracts.test.js
git add server/providers/contracts.js server/__tests__/providerContracts.test.js
git commit -m "feat: define Kefi external provider contracts"
```

---

### Task 10: Add Runtime Configuration and Feature Flags

**Files:**
- Create: `server/config/runtimeConfig.js`
- Create: `server/config/featureFlags.js`
- Create: `server/__tests__/runtimeConfig.test.js`
- Create: `server/__tests__/featureFlags.test.js`
- Modify: `.env.example`

**Interfaces:**
- Produces `readRuntimeConfig(env)` and `readFeatureFlags(env)`.
- V2 flags introduced here default to false.
- Existing `OPENAI_MODEL`, `OPENAI_API_KEY`, `PORT` remain supported.

- [ ] **Step 1: Write runtime configuration tests**

```js
const { readRuntimeConfig } = require('../config/runtimeConfig');

test('preserves V1 runtime defaults', () => {
  expect(readRuntimeConfig({ OPENAI_API_KEY: 'test-key' })).toMatchObject({
    openAiApiKey: 'test-key',
    openAiModel: 'gpt-5-mini',
    port: 3001
  });
});

test('rejects an invalid port', () => {
  expect(() => readRuntimeConfig({ OPENAI_API_KEY: 'test-key', PORT: 'banana' }))
    .toThrow('PORT must be a positive integer.');
});
```

- [ ] **Step 2: Implement runtime config parser**

```js
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
```

- [ ] **Step 3: Write feature-flag tests**

```js
const { readFeatureFlags } = require('../config/featureFlags');

test('V2-only features default off', () => {
  expect(readFeatureFlags({})).toEqual({
    kefiShell: false,
    calorieLab: false,
    scan: false,
    pantry: false,
    grocery: false,
    restaurant: false,
    progress: false,
    accounts: false,
    proactive: false
  });
});

test('only literal true/1 enables a flag', () => {
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: 'true' }).scan).toBe(true);
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: '1' }).scan).toBe(true);
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: 'yes' }).scan).toBe(false);
});
```

- [ ] **Step 4: Implement feature flags and document them in `.env.example`**

Use one parser:

```js
function enabled(value) {
  return value === 'true' || value === '1';
}
```

Add commented examples to `.env.example`; keep every V2 flag disabled by default.

- [ ] **Step 5: Run and commit**

```bash
CI=true npm test -- --watchAll=false server/__tests__/runtimeConfig.test.js server/__tests__/featureFlags.test.js
git add server/config .env.example server/__tests__/runtimeConfig.test.js server/__tests__/featureFlags.test.js
git commit -m "feat: centralize Kefi runtime config and feature flags"
```

---

### Task 11: Wire Runtime Config Into Server Startup Without Breaking `/api/chat`

**Files:**
- Modify: `server/index.js`
- Test: existing `server/__tests__/app.test.js`, `server/__tests__/tutorService.test.js`
- Add: `server/__tests__/indexConfig.test.js` only if startup wiring can be extracted without starting a real listener.

**Interfaces:**
- Consumes: `readRuntimeConfig(process.env)`.
- Produces: the same externally visible server behavior with centralized config.

- [ ] **Step 1: Extract startup dependency construction if `server/index.js` currently performs it inline**

Prefer a pure helper:

```js
function buildServerDependencies({ env, OpenAIClient }) {
  const config = readRuntimeConfig(env);
  if (!config.openAiApiKey) throw new Error('OPENAI_API_KEY is required.');
  const client = new OpenAIClient({ apiKey: config.openAiApiKey });
  return {
    config,
    tutorService: createTutorService({ client, model: config.openAiModel })
  };
}
```

Keep `require.main === module` or equivalent startup behavior compatible with the current file structure.

- [ ] **Step 2: Add a unit test with a fake OpenAI constructor**

Assert model/port/API key parsing without making a network call.

- [ ] **Step 3: Run server tests and full V1 regression scenarios**

```bash
CI=true npm test -- --watchAll=false server/__tests__/app.test.js server/__tests__/tutorService.test.js tests/scenarios/v1-regression.scenario.test.js
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add server/index.js server/__tests__/indexConfig.test.js
git commit -m "refactor: centralize server runtime configuration"
```

If no new `indexConfig.test.js` was necessary, omit it from `git add` rather than creating an empty file.

---

### Task 12: Add Foundation Scenario Tests for Privacy, Constraints, and Calculations

**Files:**
- Create: `tests/scenarios/foundation.scenario.test.js`

**Interfaces:**
- Consumes: Plan 01 contracts and calculation modules.
- Produces: scenario-level assertions that encode V2 architectural invariants before feature implementations begin.

- [ ] **Step 1: Add a hard-constraint preservation scenario**

```js
const { makeConstraint, partitionConstraints } = require('../../server/domain/constraints');

test('peanut allergy remains a hard constraint beside optimization goals', () => {
  const result = partitionConstraints([
    makeConstraint({ id: 'a', kind: 'hard', type: 'allergy', value: 'peanut', source: 'user_confirmed' }),
    makeConstraint({ id: 'p', kind: 'optimization', type: 'protein', value: 'higher', source: 'goal' })
  ]);
  expect(result.hard.map((item) => item.value)).toContain('peanut');
  expect(result.optimization.map((item) => item.value)).toContain('higher');
});
```

- [ ] **Step 2: Add a minimum-context scenario**

Assert the `grocery` policy excludes `medical_context` while retaining budget/pantry/goals.

- [ ] **Step 3: Add a transparent-calculation scenario**

Calculate BMR, TDEE, and a metric conversion using the deterministic registry; assert exact/reference outputs rather than model text.

- [ ] **Step 4: Add a data-classification scenario**

Assert Temporary Session and AI Processing are non-persistent and Local Saved / Explicitly Retained are persistent.

- [ ] **Step 5: Run scenario and full suite**

```bash
CI=true npm test -- --watchAll=false tests/scenarios/foundation.scenario.test.js
CI=true npm test -- --watchAll=false
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add tests/scenarios/foundation.scenario.test.js
git commit -m "test: add Kefi foundation scenario bank"
```

---

### Task 13: Document Foundation Contracts and Next-Plan Boundaries

**Files:**
- Modify: `README.md`
- Create: `docs/architecture/kefi-v2-foundation.md`

**Interfaces:**
- Consumes: all Plan 01 modules.
- Produces: developer documentation explaining where new V2 work belongs and what Plan 01 intentionally did not change.

- [ ] **Step 1: Add a concise V2 architecture section to README**

Document:

```text
- V1 user experience remains operational.
- V2 work is introduced behind additive domain/provider/config contracts.
- shared/calculations is deterministic and must not call AI.
- server/orchestration context policies enforce minimum necessary context.
- V2-only feature flags default off until their subsystem plan is implemented.
```

Do not rewrite the entire V1 README in this task.

- [ ] **Step 2: Create `docs/architecture/kefi-v2-foundation.md`**

Include exact module ownership:

```text
server/domain/*             shared server-side domain contracts
server/orchestration/*      routing/context policy foundations
server/providers/*          external provider contracts only
server/config/*             environment/config parsing
shared/calculations/*       deterministic calculations only; no network/AI
src/domain/*                browser-safe domain constants/state helpers
tests/scenarios/*           cross-module behavior/regression scenarios
```

Also state that Plans 02+ may extend these modules but must preserve their public interfaces or version/migrate them explicitly.

- [ ] **Step 3: Run Markdown hygiene check and tests**

```bash
git diff --check
CI=true npm test -- --watchAll=false
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add README.md docs/architecture/kefi-v2-foundation.md
git commit -m "docs: document Kefi V2 foundation boundaries"
```

---

### Task 14: Final Plan 01 Verification Gate

**Files:** no new files expected.

**Interfaces:**
- Consumes: all Plan 01 work.
- Produces: evidence that the V2 foundation is safe to build on and V1 remains intact.

- [ ] **Step 1: Run all automated tests**

```bash
CI=true npm test -- --watchAll=false
```

Expected: PASS with both V1 tests and new Kefi foundation tests.

- [ ] **Step 2: Build production bundle**

```bash
npm run build
```

Expected: PASS.

- [ ] **Step 3: Run repository hygiene checks**

```bash
git diff --check
git status --short
git grep -n -E 'sk-[A-Za-z0-9_-]{10,}' -- ':!package-lock.json' || true
```

Expected: no whitespace errors, no unexplained files, no committed API key.

- [ ] **Step 4: Manual V1 smoke test**

With the API key only in local `.env`:

```text
1. Start the app with npm run dev.
2. Start Chatting without personalization.
3. Send one nutrition question and receive one answer.
4. Use Make this easier, Explain more, and Give me an example.
5. Confirm a failed request still preserves the conversation and exposes Retry (use a controlled local failure if needed).
6. Refresh an unsaved Private Session and confirm it does not restore.
7. Save one conversation locally, reopen it, rename it, and delete it.
8. Confirm a due review date never auto-deletes saved content.
9. Confirm the visible V1 experience has not been redesigned by Plan 01.
```

- [ ] **Step 5: Confirm V2 flags remain disabled by default**

Run a Node one-liner or unit test using `readFeatureFlags({})`; expected all values are `false`.

- [ ] **Step 6: Record completion commit only if verification produced tracked documentation changes**

If verification changes nothing, do **not** create an empty commit. The final existing task commit is the Plan 01 endpoint.

---

## Plan 01 Acceptance Criteria

Plan 01 is complete only when all of the following are true:

1. Existing V1 tests and smoke behavior still pass.
2. The approved V2 spec and roadmap are tracked in the repository.
3. The four approved data classes exist as code-level constants.
4. Workflow lifecycle statuses are structured and test-covered.
5. Confidence and provenance are structured data rather than prose-only conventions.
6. Hard constraints/preferences/optimization goals are distinguishable and no item is silently dropped by partitioning.
7. Engine context access is enforceable through explicit allowlists.
8. Mifflin–St Jeor, TDEE, GI→GL, and core unit conversions are deterministic and reference-tested.
9. External-provider interfaces exist without forcing current V1 OpenAI code to migrate prematurely.
10. Runtime config is centralized and V2 feature flags default off.
11. Foundation scenarios encode privacy/context/constraint/calculation invariants.
12. No V2 account/database/vision/notification functionality has leaked into this foundation plan.
13. Full test suite, production build, whitespace check, and secret scan pass.

## Handoff to Plan 02

Plan 02 may now introduce Kefi branding, navigation shell, progressive onboarding, editable personalization, locale/accessibility settings, and Low-Energy presentation behavior. It must consume the Plan 01 data/context/config contracts rather than invent parallel versions of them.
