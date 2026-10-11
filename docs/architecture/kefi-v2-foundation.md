# Kefi V2 Foundation Architecture

Plan 01 adds the contracts that later Kefi V2 subsystems will build on while preserving the existing AI Nutrition Tutor V1 behavior.

## Module ownership

```text
server/domain/*             shared server-side domain contracts
server/orchestration/*      routing/context policy foundations
server/providers/*          external provider contracts only
server/config/*             environment/config parsing
shared/calculations/*       deterministic calculations only; no network/AI
src/domain/*                browser-safe domain constants/state helpers
tests/scenarios/*           cross-module behavior/regression scenarios
```

## Rules

### V1 stays intact

Plan 01 does not redesign the visible product, replace `/api/chat`, alter Private Session semantics, migrate saved conversations to cloud storage, or replace the current OpenAI tutor service. Those V1 behaviors remain the regression baseline.

### Deterministic calculations are not AI work

Mifflin–St Jeor BMR, TDEE multiplication, GI-to-GL arithmetic, and unit conversions live in `shared/calculations/`. These functions validate numeric inputs and return deterministic values. They must not call language models, provider APIs, or network services.

### Minimum necessary context is enforced in code

`server/orchestration/contextPolicy.js` contains explicit engine allowlists. An engine may only receive context categories present in its allowlist. New engines must define their permissions deliberately rather than inheriting all profile data by default.

### Constraints remain structurally distinct

Hard constraints, preferences, and optimization goals are different kinds of input. Hard safety constraints such as confirmed allergies must not be silently converted into preferences or optimization hints.

### Confidence and provenance travel with facts

Confidence metadata is structured as a level plus reason codes. External facts use provenance metadata that identifies their source type, provider, retrieval time, and verification status. Later provider integrations should preserve these fields through downstream workflows.

### Provider contracts precede provider implementations

`server/providers/contracts.js` defines required capabilities for language, vision, food, GI, product, restaurant, store, and evidence providers. Plan 01 does not replace the current V1 OpenAI service with those abstractions yet.

### Feature flags default off

V2-only feature flags are centralized in `server/config/featureFlags.js` and remain false unless explicitly enabled. A subsystem must not be enabled before its implementation plan and tests are complete.

## Extension rule for later plans

Plans 02 and later may extend these modules, but they should preserve the existing public interfaces. If an interface must change, the change should be versioned or migrated explicitly with regression coverage rather than silently replaced.

## Intentionally out of scope for Plan 01

Plan 01 does not add accounts, a cloud database, vision uploads, retailer integrations, restaurant integrations, push notifications, production analytics, or a redesigned Kefi shell. Those belong to later plans in the approved V2 roadmap.
