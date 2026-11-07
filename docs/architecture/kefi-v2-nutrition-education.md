# Plan 03 Milestone 4: first-stage nutrition education

## Audit and implementation

The existing service normalized conversation roles, allowed four legacy personalization strings, selected curated foods from the latest user message, validated evidence and called the injected LanguageModelProvider. The catalog has 25 source-reviewed composition/nutrient-role entries; it does not contain calories, full macro profiles, personal targets, or clinical outcome evidence. Provenance validation establishes structure and curator review, not scientific truth. No live fact checker, intent router, or response safety evaluator existed.

`server/orchestration/nutritionEducation.js` now builds a reusable internal lesson plan with a depth, one or more topic hints, and evidence validated through the existing pathway. The service composes lesson instructions alongside the existing base safety prompt and evidence guidelines; `{ content }`, `/api/chat`, Responses/store:false, context allowlists and provider interfaces remain unchanged. The catalog and frontend are untouched.

## Existing controls, no new user data

The four existing personalization strings remain the only profile payload. Simple/Short/short responses/Just decide for me select beginner; Detailed/detailed responses select advanced; Step-by-step/Teach me why/auto/default use intermediate. Beginner uses plain words and one manageable example; intermediate adds explanations and a practical example; advanced permits mechanisms and qualifications, not stronger unsupported claims.

The existing simplify action selects beginner and expand selects advanced; example preserves the selected depth. Detour's existing exact phrase `short answers with one clear next step` always selects beginner, including on expand, while preserving the existing response-control request for detail within that calm presentation. No medical data or free-text otherContext is inspected to infer depth. This is presentation mapping, not an assessment of user expertise.

## Topics and evidence

Deterministic keyword hints cover food benefits, macros, micros, calories/energy balance, balanced meals and serving ideas. Multiple hints may apply. Unknown questions fall back to general education, and unknown foods add no catalog evidence. Hints are deliberately small and English-only; they do not implement full intent understanding or conversation-wide reference resolution.

Catalog facts retain their source URLs, provenance and limitations. Instructions explicitly distinguish these from general conceptual education and editorial serving examples. They prohibit invented nutrient amounts, citations, food profiles, personal calorie targets and medical outcomes. Quantitative nutrition or personalized planning requires later verified calculation/data contracts. This layer adds no new nutritional facts or evidence citations itself.

Existing foodContext still suppresses catalog serving examples conservatively; allergies and hard constraints remain in the existing instructions. Neither catalog matching nor absence of a listed allergen certifies suitability. Routine questions get accessible explanations; diagnosis, treatment and medication questions require proportionate educational limits. No new persistence, retrieval, logging, profile fields or provider data exposure is introduced. Volunteered personal information in existing message text can still reach the provider; this layer is not redaction.

## Verification limits and deferred work

Deterministic tests inspect depth mappings, topic hints, evidence provenance, unknown-food handling, allergy boundaries and sanitized mock-provider requests. Existing tutoring/catalog/prompt regression tests remain. These tests prove instruction construction and request boundaries, not live-model accuracy, non-shaming behavior, numerical correctness or safety compliance. Output remains provider-generated text; there is no deterministic claim filter or citation checker.

Deferred: broader language/intent coverage, conversational referent resolution for teaching controls, grounded numerical education, approved evidence retrieval, proportional safety pre/post checks, and response-quality evaluations. Plan 02 release verification remains outstanding. No approved UI changes, paid calls or deployment actions are part of this milestone.
