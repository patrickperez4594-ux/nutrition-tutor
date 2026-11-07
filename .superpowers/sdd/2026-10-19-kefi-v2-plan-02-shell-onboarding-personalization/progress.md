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

## Retry layout and tutor error (2026-10-27)

- Retry split mid-word into 5 lines (140px tall at 320px) because the mobile fix's `overflow-wrap: anywhere` on `.kefi-main` let the error text squeeze the button. Buttons in the shell now use `overflow-wrap: break-word`, and the error-banner button is `flex: none; white-space: nowrap`. Verified in headless Firefox with an in-page simulated 502 (no network request): 1 line at 320/375/390px × three text sizes; the 216-screen layout audit still has 0 problems.
- Tutor error: the API server log shows `Tutor request failed: status=429 code=credit_balance_exhausted type=insufficient_quota`. The AI provider received the request and refused it for exhausted credit, so it is an account/billing state, not a Kefi code or local-configuration fault. Kefi handled it as designed: a generic 502 to the browser, the conversation kept, nothing saved, and no key material logged. No live request was retried.
- Tests: `npm run test:ci` (flag off and on) 33 suites / 167 passing; both builds compile.

## Still required

- Manual visual review of the shell in a browser (light/dark, phone width, keyboard-only, screen reader). Restriction saving and refresh were confirmed in Firefox on 2026-10-27; the rest is still open.
- Manual V1 smoke test with a real API key (carried over from Plan 01; not run to avoid paid API calls).
- Final mascot artwork.
- User approval before push / PR.

## Final acceptance verification (2026-11-04)

Verified locally on `feat/kefi-v2-plan02-shell`, starting from published commit
`0103416d5ddc1ee3ed433e22afef3249378e35ac`. No commits, pushes, merges,
rebases, resets, PRs, or Plan 03 implementation were performed.

### Scoped acceptance fixes

- Both shared saved-progress dialogs declared `aria-modal` without modal keyboard
  behavior. Eight regression tests reproduced the missing initial focus, forward/
  backward Tab containment, Escape dismissal, and restoration of opener focus.
  `useDialogFocus` now supplies those behaviors to SaveProgressDialog and
  ReviewPrompt. Saved-data policy and provider behavior are unchanged.
- The reused Send button inherited white text on the dark palette's light-orange
  primary background (2.35:1 contrast). It now uses `--k-on-primary`, matching
  other primary actions. Two CSS-palette tests check normal-text contrast of at
  least 4.5:1 in light/dark themes. These are static palette checks, not rendered
  browser or full accessibility audits.

### Fresh automated results

- Full `npm run test:ci -- --runInBand --cache=false --silent` with shell flag
  false and true: **35 suites / 177 tests pass in each configuration**.
- `npm run build` with shell flag false and true: **both compile successfully**.
- `git diff --check`: clean before this documentation update; rechecked after it.
- Credential-pattern scan of tracked/new files and built JavaScript: no detected
  OpenAI/GitHub token or private-key patterns. Built JavaScript contains no
  `OPENAI_API_KEY` reference. This is a limited pattern scan, not a security audit.
- Initial unsilenced tests still emit the existing React `act` warnings. Final
  test runs used `--silent` to avoid repeating those warnings; no dependency
  upgrades were made.
- Tests use provider doubles; `OPENAI_API_KEY` was explicitly empty for commands.
  No backend was launched and no paid-provider requests were made.

### Browser and manual acceptance still pending

Browser runtime initialization succeeded, but selection reported “No browser is
available” and discovery returned an empty list. No browser screenshots, fresh
viewport measurements, real keyboard walkthrough, or screen-reader checks were
possible in this session. The historical 216-screen Firefox audit above remains
historical evidence only. CSS and DOM tests do not close visual acceptance.

Manual checklist (use the shell flag on; do not send chat requests):

- At 320/375/390px width and 480px height, check Home, Ask, Scan, Learn, Me,
  every Me section, Saved Progress, all onboarding steps, and both dialogs with
  Default/Large/Larger text. Check horizontal overflow, sticky-header/bottom-nav
  overlap, dialog scrolling, and reachability of every control.
- Repeat representative screens in light/dark/system themes, including chat
  messages, retry/error states, dialogs, disabled controls, and focus indicators.
- With keyboard only, check Tab/Shift+Tab, radio arrow keys, Enter/Space activation,
  heading focus after navigation, restriction validation focus, and dialog
  containment/Escape/restoration. Simulate chat responses/errors rather than
  invoking a provider.
- With a screen reader, check navigation labels/current page, form labels and
  groups, restriction alerts, save announcements, Detour state/description,
  dialog names, and announcements on navigation.
- Live-provider V1 smoke test: **pending; intentionally not attempted** under the
  no-paid-calls requirement. Last recorded provider result was exhausted credit;
  current credits were not queried. A successful live smoke test still needs
  separate authorization and available credit.
- Final artwork remains a follow-up; the Plan 02 scope permits the provisional
  mascot and this is not an implementation blocker.

**Acceptance decision:** automated gates pass after scoped fixes; Plan 02 is not
ready for unconditional final approval until manual visual/accessibility checks
and the carried-over live-provider gate are completed or explicitly deferred by
its owner. Local acceptance changes remain uncommitted and unpushed for review.

## Approved green direction implementation (2026-11-04)

- Reference: the user attached the approved green dashboard screenshot after the
  ChatGPT share URL could not be retrieved. Matched the forest/emerald/lime color
  direction while preserving the existing shell layout, navigation, and features.
- Reusable semantic tokens cover light/dark/system-dark, actions, focus, errors,
  message text, and surfaces. Detour softens accents and removes decorative
  shadows/header gradient; existing reduced-motion behavior remains.
- Existing uncommitted dialog-accessibility and Send-contrast fixes preserved.
- Added 139 parameterized palette checks; full suites now pass **36 suites /
  316 tests** with the shell flag false and true. Final production builds pass
  with both flag values. `git diff --check` is clean.
- Existing mobile CSS guards pass. No fresh visual/keyboard browser verification:
  browser discovery still returns no available browsers. Full accessibility and
  exact rendered fidelity remain pending, rather than inferred from palette tests.
- Development preview responds HTTP 200 at `http://localhost:3000`; port 3001 is
  not listening. No paid-provider requests were made.
- Awaiting the user's Firefox review in light/dark themes, at mobile widths, with
  enlarged text and Detour Mode. Implementation is not finalized or approved yet.
- Changes remain uncommitted/unpushed on `feat/kefi-v2-plan02-shell`; no merge,
  reset, deletion, PR, or Plan 03 work was performed.

## Kefi V2 Luminous Emerald implementation (2026-11-04)

- Reference: `~/Downloads/Neon Green Kefi Wellness Dashboard.png` (approved mockup). Layout,
  navigation, features, and copy are unchanged; this is a visual layer on the green palette above.
- New tokens in `kefi.css`: opaque card gradient stops (`--k-card-top/bottom`), luminous card
  borders, icon color, lime glow, sheen, heading glow, page/header/nav backgrounds, and decoration
  colors. Dark values live once as `--k-dark-*` and feed explicit and system dark.
- `KefiBackdrop` (CSS + inline SVG, no dependencies) draws waves, bubbles, leaves, and sparkles in a
  fixed, `aria-hidden`, `pointer-events: none` layer at `z-index: -1` inside an isolated `.kefi-app`.
  Phones hide sparkles and small leaves; the top leaf only shows at 1024px and wider.
- Home cards gained decorative line icons (`HomeIcons`), larger radius, glass sheen, luminous
  borders, and hover/focus lift. Primary buttons, Send, the Ask Kefi card, and the current nav item
  use the lime gradient and glow.
- Detour Mode: flat surfaces, plain borders, no glow, no header gradient, decorations at 35%
  opacity with sparkles/small leaves hidden, and no animation. Reduced motion (setting or OS) stops
  all decoration animation and hover/focus lift.
- Tests: 393 pass in 37 suites with the shell flag false and true (adds `kefiLuminous.test.js` and
  card/icon contrast pairs in `kefiTheme.test.js`). Production builds compile both ways.
  `git diff --check` clean.
- Real-browser check (headless Chrome via Playwright, API routes blocked): Home at 320/390/768/1440px
  in light, dark, and Detour. No horizontal scroll, no unnamed buttons, and no control is covered by
  a decoration (the only covered card centers were under the fixed bottom nav before scrolling).
  No axe-style automated audit was run (no new dependencies); Firefox review by the user is pending.
- No commits, pushes, merges, or paid-provider calls.

## Living Emerald approval and backup (2026-11-07)

- User officially approved the complete Living Emerald design across Home, Ask, Scan, Learn, and Me, including animated decorations, eleven bubbles, enlarged branding, and shared interaction styling. This supersedes the earlier pending visual-approval notes.
- Backup scope includes the recovered dialog keyboard-accessibility fixes, contrast checks, decorative icons/backdrop, shared theme styling, and related tests/docs. No Plan 03 work or live-provider calls.
- Fresh full tests with the shell enabled and disabled: 34 suites / 385 tests passed in each; 3 suites / 8 tests failed in each solely with local socket `listen EPERM` errors in this sandbox. Affected suites: `server/__tests__/app.test.js`, `tests/scenarios/v1-regression.scenario.test.js`, and `tests/scenarios/plan02-personalization.scenario.test.js`. No assertion failures reported.
- Production builds passed with both shell flag values; build outputs were directed outside the repository. `git diff --check` passed. Existing React act warnings remain.
- Reviewed all 16 changed/untracked files; limited credential-pattern scan found no matches. Ignored `.env` and `build/` are excluded from staging. Broader accessibility audits and live-provider verification remain separate follow-ups.
