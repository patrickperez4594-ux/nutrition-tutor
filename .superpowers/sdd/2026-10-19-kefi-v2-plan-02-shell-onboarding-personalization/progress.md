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

## Still required

- Manual visual review of the shell in a browser (light/dark, phone width, keyboard-only, screen reader).
- Manual V1 smoke test with a real API key (carried over from Plan 01; not run to avoid paid API calls).
- Final mascot artwork.
- User approval before push / PR.
