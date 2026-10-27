# Plan 02 progress ledger

## Rulings

- Branch `feat/kefi-v2-plan02-shell` created from `feat/kefi-v2-foundation` (PR #1, unmerged). `main` untouched.
- Baseline before Plan 02: `npm run test:ci` 25 suites / 91 tests passing; `npm run build` succeeds. (Closes Plan 01's pending verification items except the manual V1 smoke test with a real API key.)
- No Plan 02 document existed; this plan was written from the roadmap and spec §5, §6, §8, §9, §22, §24, §28, §33.
- The Kefi shell ships behind `REACT_APP_KEFI_FLAG_SHELL` (default false), per `.env.example` guidance that flags stay off until a plan is complete.
- No athletic-tortoise asset exists in the repository; a provisional SVG is used behind `KefiMark`.

## Task status

- [x] Task 1: plan + ledger
- [x] Task 2: client flag + string catalog
- [x] Task 3: modular profile domain
- [x] Task 4: opt-in profile repository
- [x] Task 5: tutor personalization adapter
- [x] Task 6: shared useSavedConversations hook (V1 tests unchanged and passing)
- [x] Task 7: brand mark, shell, bottom nav, Home, Scan, Learn
- [x] Task 8: progressive onboarding
- [x] Task 9: Me sections + Privacy & Saved Data
- [x] Task 10: Low-Energy Mode + text size / motion / theme
- [x] Task 11: scenario tests, docs, verification gate

## Additional rulings

- `avoid` (religious/ethical/personal) restrictions are treated as hard constraints alongside allergies. The spec names only allergy as hard; this is the conservative reading and is documented in `docs/architecture/kefi-v2-shell.md`.
- Unrecognized restriction kinds are normalized to `allergy` rather than dropped.
- Section saves in Me merge only that section's fields into the latest profile, so concurrent header changes (Low-Energy) are not reverted.

## Verification (2026-10-19)

- `npm run test:ci`: 32 suites / 148 tests passing (baseline was 25 / 91).
- `npm run build` (flag off) and `REACT_APP_KEFI_FLAG_SHELL=true npm run build`: both compile.
- Built bundle contains no API keys or `OPENAI_API_KEY` references; branch diff has no secrets; `git diff --check` clean.

## Final review fixes (2026-10-27)

- Safety: a restriction typed but not added was silently dropped on Me Save and onboarding Next. Now a complete entry is added (Me announces it), and an entry without a type blocks with an alert, `aria-invalid`, and focus on Type. The pending entry is owned by Onboarding/SectionEditor, so it also survives onboarding Back. onboarding Skip still discards that step's answers, as designed.
- The disabled Add button has a visible hint linked by `aria-describedby`.
- `App.test.js` rendered `<App />`, which read the developer's `.env`; it now passes `flags` explicitly.
- Ask (`ChatScreen`), Saved Progress (`SavedConversationList`), and the onboarding Welcome headings are focus targets; the focus outline rule covers the whole shell.
- Docs: the plan's Task 11 now names `kefi-v2-shell.md`, which is where the shell is documented.

## Verification (2026-10-27)

- `npm run test:ci` with `REACT_APP_KEFI_FLAG_SHELL=false`, `=true`, and the local `.env`: 32 suites / 159 tests passing each time.
- `npm run build` with the flag off and on: both compile. No keys in the bundle; `git diff --check` clean.

## Mobile layout fixes (2026-10-27)

Measured in headless Firefox 134 (WebDriver BiDi, throwaway profile, classic 12px scrollbar) at 320, 375, and 390px wide × 480px tall, with Default, Large, and Larger text: Home, Ask, Scan, Learn, Me, all 12 Me sections, Saved Progress, Low-Energy + dark Home, Welcome, and all 4 onboarding steps (216 screens). Every control was scrolled into view and checked to land between the sticky header and the bottom nav.

- Before: the Low-Energy toggle wrapped to 3 lines (320px Large/Larger, 375px Larger; header up to 120px), and every 320px screen scrolled sideways because `body { min-width: 320px }` (index.css) exceeds the 308px left beside a scrollbar. All controls were already reachable and nothing sat behind the nav.
- Fix (CSS only, `src/kefi/kefi.css`): the toggle never wraps its text; the header wraps the toggle to its own row only when it cannot fit (320px + Larger); a compact header, mark, and gutters under 520px; `body:has(.kefi-app) { min-width: 0 }`; main bottom padding follows the nav height in rem; long user-entered words wrap; the reused chat header wraps its actions under the title.
- After: 0 problems across all 216 screens. Header height 58–61px, except 103px (two single-line rows) at 320px with Larger text. Themes, text size, and preferences unchanged.
- Regression: `src/__tests__/kefiLayout.test.js` guards the CSS rules (jsdom cannot measure layout). `npm run test:ci` (flag off and on): 33 suites / 164 tests passing; both builds compile.

## Detour Mode rename (2026-10-27)

- Low-Energy Mode is now called **Detour Mode** in the UI (feedback from a reviewer helping evaluate Kefi). Its accessible description is "Having a difficult day? Kefi can make things simpler. Fewer decisions, shorter explanations, and manageable steps at your own pace." The tutor note says "Detour Mode is on" so the model never echoes the old name.
- Internal identifiers are unchanged (`presentation.lowEnergy`, `data-low-energy`, `.low-energy-toggle`, `header.lowEnergy*` keys), so remembered profiles keep their setting.
- Layout re-audit (216 screens, 320/375/390px × three text sizes): 0 problems; the header is now one row everywhere (58–61px, previously 103px at 320px Larger).
- While Detour Mode is on, Home shows the description under its heading (same catalog string as the toggle's accessible description). Re-audit: 0 problems; at 320px Ask Kefi and Plans Changed stay above the fold. Tests: 33 suites / 165 passing (flag off and on); both builds compile.

## Still required

- Manual visual review of the shell in a browser (light/dark, phone width, keyboard-only, screen reader). Restriction saving and refresh were confirmed in Firefox on 2026-10-27; the rest is still open.
- Manual V1 smoke test with a real API key (carried over from Plan 01; not run to avoid paid API calls).
- Final mascot artwork.
- User approval before push / PR.
