# Kefi V2 Implementation Roadmap

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement each subsystem plan task-by-task. Steps in subsystem plans use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the approved Kefi V2 flagship experience by evolving the existing AI Nutrition Tutor V1 incrementally, preserving V1 behavior while adding modular domain engines behind stable contracts.

**Architecture:** Keep the existing React + Express application as the starting point and evolve it as a modular monolith. Build capabilities in dependency order so each subsystem can be tested and reviewed independently; do not rewrite V1 wholesale. Local-first state, strict engine contracts, deterministic calculations, server-side provider access, privacy boundaries, and scenario-based regression testing are cross-cutting requirements.

**Tech Stack:** Existing React 18 / Create React App frontend, Node.js + Express backend, Jest + Testing Library + supertest, official OpenAI JavaScript SDK, browser local persistence initially; later subsystem plans may add a relational cloud database, object storage, background jobs, and account/sync infrastructure behind adapters.

**Spec:** `docs/superpowers/specs/2026-09-14-kefi-v2-design.md`

## Global Constraints

- Preserve V1 behavior before expanding it: Private Session by default, explicit Save Progress, multiple local conversations, review reminders without auto-delete, Retry, and latest-answer teaching controls.
- Preserve `prompts/system-prompt.md` as the behavioral source of truth until a later approved prompt/versioning task deliberately evolves it.
- Keep all provider secrets server-side; never expose API keys in browser code or committed files.
- Maintain `store: false` for OpenAI calls where applicable; do not claim HIPAA compliance or zero provider retention.
- Structured application state, not chat transcript text, is the source of truth for V2 workflows.
- AI may reason and explain, but deterministic calculations and validation live in code.
- Every uncertain estimate preserves range, confidence, assumptions, and uncertainty sources.
- Hard constraints (especially allergies) must never be silently dropped.
- Private Session must not persist conversations, scans, progress, pantry changes, or derived insights unless the user explicitly saves an item.
- External price/inventory/restaurant facts must never be labeled live unless verified as live.
- Every major user correction invalidates affected downstream derived state.
- Accessibility is a release gate, not post-release polish.
- Every task ends with targeted passing tests; every subsystem ends with full regression tests, production build, `git diff --check`, and secret scan.

---

## Plan Set and Dependency Order

### Plan 01 — Foundation, Contracts & Regression Baseline
Preserve V1, map current architecture, create V2 domain contracts, calculation registry, context-type permissions, feature flags, provider interfaces, and scenario-test harness without changing user-facing behavior.

**Depends on:** approved V2 spec only.
**Produces:** stable platform for every later plan.

### Plan 02 — Kefi Shell, Navigation, Onboarding & Editable Personalization
Introduce Kefi branding, bottom navigation, Home/Ask/Scan/Learn/Me shell, progressive onboarding, editable modular profile, locale/accessibility preferences, and Low-Energy presentation mode.

**Depends on:** Plan 01.

### Plan 03 — Orchestrator, Tutor Layer, Safety Layer & Constraint Resolver
Add structured intent detection, Context Builder, engine routing, hard/soft constraint model, proportional safety pre/post checks, response composition, and expanded tutor controls.

**Depends on:** Plans 01–02.

### Plan 04 — Nutrition Knowledge, Calculation Registry Expansion & Calorie Lab
Implement grounded food-reference contracts, BMR/TDEE, GI/GL, unit/energy conversions, provenance, Show Me the Math, confidence model, and Food Knowledge presentation.

**Depends on:** Plans 01–03.

### Plan 05 — Vision & Scan Platform
Implement secure image upload/temporary retention, Vision observations, confirmation/correction workflow, meal estimation ranges, nutrition-label scan, pantry/fridge scan, menu scan, and product/package scan.

**Depends on:** Plans 01–04.

### Plan 06 — Pantry, Leftovers, Recipe Intelligence, What Can I Make & Meal Rescue
Add pantry state/events, leftovers, meal candidates, ingredient-function substitutions, smallest-useful-change Meal Rescue, structured recipes, scaling, and I Need Food Now.

**Depends on:** Plans 01–05.

### Plan 07 — Grocery & Store Intelligence
Add exact-budget planning, checkout vs consumed cost, ingredient overlap, package reconciliation, Make This Cheaper, Store Mode, product comparisons, remaining-budget tracking, and feature-flagged receipt scan.

**Depends on:** Plans 01–06.

### Plan 08 — Restaurant & Takeout Intelligence + Plans Changed
Add menu understanding, restaurant source hierarchy, goal/budget-aware ranking, dish modification, What Makes Sense for Me Here?, Low-Energy one-pick mode, takeout planning, and cross-feature Plans Changed adaptation.

**Depends on:** Plans 01–07.

### Plan 09 — Learning, Courses, Quizzes, Myth Checker & Supplement Evidence
Add curriculum storage, adaptive lessons, quizzes, Scan → Learn, evidence hierarchy, source-aware Myth Checker, and supplement evidence/safety cards.

**Depends on:** Plans 01–04; can run partly in parallel with Plans 05–08.

### Plan 10 — Progress Intelligence, Daily Snapshot & Coach View
Add saved-event observation model, Observation → Hypothesis → Recommendation, Kefi Noticed, pattern confidence/decay, Coach View, Help Me Reset, Daily Snapshot, and user-controlled derived insights.

**Depends on:** Plans 02–09 and sufficient saved activity sources.

### Plan 11 — Accounts, Cloud Storage, Sync, Backup & Data Portability
Add optional accounts, local-to-cloud migration, category-level sync, conflict/version handling, backup, export/import, deletion lifecycle, device/session management, and local-only continuation.

**Depends on:** stable local repositories from Plans 01–10.

### Plan 12 — Proactive Kefi, Reminders & Notifications
Add notification categories, Quiet Kefi, leftover/grocery/learning/coach reminders, Proactive Decision Engine, privacy-preserving notification copy, and Plans Changed notification actions.

**Depends on:** Plans 06–11.

### Plan 13 — Internationalization, Localization & Accessibility Hardening
Complete string externalization, locale-aware units/currency/dates, Brazilian Portuguese as the first additional full locale candidate, RTL-safe architecture, screen-reader/keyboard/reflow/reduced-motion verification, and alternative non-camera workflows.

**Depends on:** accessibility and i18n foundations from Plans 01–02; final hardening after feature surfaces stabilize.

### Plan 14 — Production Hardening, Analytics, Security, Performance & Release Gates
Add/finish structured analytics, confidence calibration metrics, rate limits, prompt-injection defenses, secure upload validation, observability, background-job reliability, cache/offline performance, provider fallbacks, backup restore drills, model canaries, and full Kefi Scenario Bank release gate.

**Depends on:** all prior plans.

---

## Parallelization Rules

- Plans 02 and 04 may overlap after Plan 01 if they do not change the same core files concurrently.
- Plan 09 curriculum/content work may run in parallel with Plans 05–08 after the evidence and tutor contracts exist.
- Accessibility tests and localization string extraction begin early even though final hardening is Plan 13.
- Scenario Bank cases are added continuously; Plan 14 consolidates the full release gate rather than creating tests from scratch.
- Database/accounts work must not start by replacing local-first repositories; Plan 11 implements adapters behind the same repository contracts.

## Completion Rule

Kefi V2 is complete only when Plans 01–14 satisfy their subsystem acceptance criteria and the final release gates from the approved specification pass. An isolated beta feature may remain disabled behind a feature flag only when the approved V2 scope explicitly permits it (for example, receipt scanning if production quality is inadequate); core workflows may not be hidden to claim completion.
