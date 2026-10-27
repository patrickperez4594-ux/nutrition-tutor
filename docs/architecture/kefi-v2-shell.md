# Kefi V2 Shell Architecture (Plan 02)

Plan 02 adds the Kefi app shell beside the V1 app. `src/App.js` renders `KefiApp` only when `REACT_APP_KEFI_FLAG_SHELL` is true; otherwise it renders the unchanged `V1App`.

## Module ownership

```text
src/config/featureFlags.js          browser feature flags (REACT_APP_*), default off
src/i18n/                           string catalog + t(); all new shell strings live here
src/domain/profile.js               modular profile schema, normalization, constraint helpers
src/repositories/profileRepository.js  local persistence, opt-in only
src/hooks/useSavedConversations.js  saved-conversation state shared by V1App and KefiApp
src/kefi/tutorPersonalization.js    profile -> V1 /api/chat personalization adapter
src/kefi/*.js                       shell presentation (no persistence or provider logic)
```

## Rules

### V1 stays the default and the API is unchanged

The browser maps the profile onto the V1 `{ goal, learningStyle, foodContext, otherContext }` payload, so `server/` and `prompts/` are untouched. Plan 03's Orchestrator/Context Builder is expected to replace this adapter with structured context.

### Private by default

The profile lives in React state. `saveProfile` writes to `localStorage` (`kefi.profile.v1`) only when `privacy.rememberOnDevice` is true and deletes any stored copy otherwise. Clearing personalization resets every domain except the remember choice.

### Constraints are never silently dropped

Restrictions keep their label even when their kind is malformed. An unrecognized kind is treated as an allergy, the most protective reading. Allergies are sent to the tutor as explicitly labelled hard constraints in every presentation mode, including Detour Mode. `avoid` (religious, ethical, or personal) is also treated as hard. `intolerance` is context-sensitive and `dislike` is a preference.

A restriction that has been typed but not added is never lost when its form is left. On Me **Save** and onboarding **Next**, a complete entry (food and type) is added automatically and announced; an entry with no type blocks the action with an alert and moves focus to **Type**. The type has no default, and the disabled **Add** button carries a visible explanation of what it needs.

### Focus follows navigation

Every tab, Me section, onboarding step (including Back to Welcome), the Ask chat, and Saved Progress move keyboard focus to that screen's `h1` (`tabIndex=-1`), with a visible outline only for keyboard focus.

### Minimum necessary context

The adapter sends goals, teaching preferences, food context, cooking, budget, calorie-display preference, and unit preferences. Display settings (theme, text size, motion), privacy choices, and onboarding state never leave the browser.

### Detour Mode is presentation only

Detour Mode is the user-facing name of the spec's Low-Energy / Low-Decision Mode (§9). Its description reads: "Having a difficult day? Kefi can make things simpler. Fewer decisions, shorter explanations, and manageable steps at your own pace." Code keeps the internal identifiers (`presentation.lowEnergy`, `data-low-energy`, `.low-energy-toggle`, `header.lowEnergy*` string keys) so stored profiles and styles are unaffected.

It reduces Home to one next step plus Plans Changed (the rest one tap away), hides secondary copy, disables animation, and asks the tutor for short answers. It does not change safety, facts, or constraints.

### Honest placeholders

Scan, courses, What Can I Make?, Grocery Help, and Plans Changed have no engines yet. They either say so or open Ask Kefi with an editable starter that is never auto-sent. No fake results.

### Locale

Language, region, measurement system, currency, date format, and energy unit are independent settings, and none defaults from another. Budgets are stored as integer minor units with no assumed currency.

### Mascot

`KefiMark` is a provisional SVG of the approved athletic-tortoise direction (`data-provisional="true"`). Final artwork replaces that one component.

## Known follow-ups

- The tests emit `act(...)` warnings because `@testing-library/react@13` is paired with React 18.3. This predates Plan 02. Upgrading the testing library is a separate dependency change.
- Additional locales, a full accessibility audit, and RTL checks belong to Plan 13. Personal energy estimates belong to Plan 04.
