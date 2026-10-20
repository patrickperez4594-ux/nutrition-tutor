# Kefi V2 Plan 02 — Shell, Navigation, Onboarding & Editable Personalization Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Progress ledger: `.superpowers/sdd/2026-10-19-kefi-v2-plan-02-shell-onboarding-personalization/progress.md`.

**Goal:** Introduce the Kefi app shell (branding, Home/Ask/Scan/Learn/Me bottom navigation), progressive onboarding, an editable modular profile, locale/accessibility preferences, and a globally reachable Low-Energy presentation mode — without changing V1 behavior or weakening privacy.

**Architecture:** The Kefi shell is a new top-level React tree (`src/kefi/`) rendered only when the browser feature flag `REACT_APP_KEFI_FLAG_SHELL` is true; otherwise the V1 app renders unchanged. Both trees share V1 hooks and libraries (`useTutorSession`, saved conversations, `ChatScreen`). Profile state is a pure domain module (`src/domain/profile.js`) behind a repository (`src/repositories/profileRepository.js`). The browser sends the profile to the unchanged `/api/chat` contract through an adapter (`src/kefi/tutorPersonalization.js`) that maps it onto the V1 personalization shape.

**Tech Stack:** Existing React 18 / CRA 5 / Jest + Testing Library. No router, state library, or new dependencies.

**Spec:** `docs/superpowers/specs/2026-09-14-kefi-v2-design.md` — §5 (navigation), §6 (onboarding), §8 (personalization), §9 (Low-Energy), §22 (privacy), §24 (accessibility/i18n), §28.4–28.5 (local data/repositories), §33 (visual identity).

## Global Constraints

- V1 remains the default experience; the shell flag defaults to false.
- `/api/chat` request/response contract and `prompts/system-prompt.*` are unchanged.
- Private by default: the profile is held in memory unless the user explicitly chooses **Remember on this device**. Choosing not to remember deletes any stored copy.
- Hard constraints (allergies) are never silently dropped: they always reach the tutor payload and are visually distinguished from preferences.
- Calorie inputs (age, height, weight, activity) are not requested in onboarding (§6.5).
- Cuisine is framed as foods the user enjoys, never as ethnicity (§6.4).
- Language, region, measurement system, currency, date format, and energy unit are independent settings; none is inferred from another (§24.5).
- Low-Energy Mode changes presentation density only, never safety, facts, or constraints (§9).
- Unbuilt destinations (Scan, Learn courses, What Can I Make?, Grocery Help, Plans Changed) must be honest: they route into Ask Kefi with an editable starter or explain availability. They never fake results.
- New user-facing shell strings live in a string catalog (`src/i18n/`).
- Mascot: the athletic tortoise is an approved *direction*, not a final asset. Ship a clearly labelled provisional SVG behind a single `KefiMark` component so it can be swapped.
- No API keys in browser code; no paid API calls in tests.

## Tasks

### Task 1: Plan document and progress ledger
- [ ] Add this plan and the progress ledger.

### Task 2: Client feature flags and string catalog
- [ ] `src/config/featureFlags.js` reads `REACT_APP_KEFI_FLAG_SHELL` (default false).
- [ ] `src/i18n/en.js` + `src/i18n/index.js` (`t(key, vars)` with interpolation; missing keys return the key).
- [ ] Tests for both.

### Task 3: Modular profile domain
- [ ] `src/domain/profile.js`: `createEmptyProfile`, `normalizeProfile`, `updateProfileSection`, option catalogs, restriction kinds (`allergy` hard, `intolerance` context-sensitive, `avoid`, `dislike` preference), `hardConstraints`.
- [ ] Tests: unknown values rejected, restriction labels preserved, allergies stay hard, locale fields independent.

### Task 4: Profile repository with opt-in persistence
- [ ] `src/repositories/profileRepository.js`: `loadProfile`, `saveProfile` (no-op unless `privacy.rememberOnDevice`), `clearProfile`, `{ ok, error }` results like V1 storage.
- [ ] Tests: nothing written by default; opt-out deletes stored copy; corrupt storage fails safely.

### Task 5: Tutor personalization adapter
- [ ] `src/kefi/tutorPersonalization.js` maps the profile to `{ goal, learningStyle, foodContext, otherContext }`.
- [ ] Tests: allergies always included; Low-Energy adds short-response guidance; empty profile maps to V1 empty personalization.

### Task 6: Extract saved-conversation state into a shared hook
- [ ] `src/hooks/useSavedConversations.js`; V1 `App` consumes it with identical behavior.
- [ ] Existing V1 tests stay green.

### Task 7: Brand, shell, bottom navigation, Home, Scan, Learn
- [ ] `KefiMark` (provisional athletic tortoise), `BottomNav` (`aria-current`), `HomeScreen` with the §5.2 actions and always-visible ⚡ Plans Changed, honest Scan/Learn screens.
- [ ] Ask tab reuses V1 `ChatScreen` (Private Session, Save Progress, Retry, teaching controls), with an optional editable starter draft.
- [ ] Tests: navigation, Plans Changed visible, starters prefill without auto-sending.

### Task 8: Progressive onboarding
- [ ] Welcome (Get Started / Continue Without Personalization) → intents → teaching style → optional context (all skippable) → remember choice.
- [ ] Tests: both welcome paths valid; skipping works; no calorie inputs; remember defaults to off.

### Task 9: Me — editable personalization and privacy
- [ ] Sections per §5.10 implemented now: Goals, Food Preferences, Restrictions/Allergies/Intolerances, Culture & Cuisine, Cooking & Equipment, Budget, How Kefi Teaches Me, Response Length, Accessibility, Locale/Units/Currency, Privacy & Saved Data. Calorie & Macro Preferences shows its Plan 04 boundary.
- [ ] Privacy & Saved Data: what is stored on this device, remember toggle, clear personalization, saved conversations.
- [ ] Tests: edit and save each section type; clear personalization; remember toggle persistence.

### Task 10: Low-Energy Mode and presentation preferences
- [ ] Global header toggle; reduces Home choices to one best next step + "Show more", hides secondary copy, disables animation.
- [ ] Text size, reduced motion, theme (system/light/dark) applied as root attributes; dark-mode tokens.
- [ ] Tests: toggle reachable from every tab; Home density changes; allergies still reach the tutor in Low-Energy Mode.

### Task 11: Scenarios, documentation, verification gate
- [ ] `tests/scenarios/plan02-personalization.scenario.test.js` (privacy + constraints end to end).
- [ ] Update `docs/architecture/kefi-v2-foundation.md` and README for the shell flag.
- [ ] `npm run test:ci`, `npm run build`, `git diff --check`, secret scan.

## Out of scope

Orchestrator/intent routing and expanded tutor controls (Plan 03), Calorie Lab and energy estimation UI (Plan 04), real scanning (Plan 05), pantry/grocery/restaurant engines (Plans 06–08), courses (Plan 09), Coach View and progress (Plan 10), accounts/sync (Plan 11), notifications (Plan 12), additional locales and full a11y hardening (Plan 13), final mascot artwork.
