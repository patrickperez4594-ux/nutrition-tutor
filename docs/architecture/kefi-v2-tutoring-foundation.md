# Plan 03 Milestone 1: tutoring foundation

Plan 02 release verification remains outstanding: socket-backed integration tests, fresh browser/assistive-technology checks, and the authorized-or-deferred live-provider gate are not closed by this milestone.

## Audit and scope

The existing service normalized message roles, called Responses with `store: false`, and returned `{ content }`. The base safety prompt already addressed autonomy, shame, unsafe restriction, and educational limits. Four legacy personalization strings are assembled by the client; display/privacy/onboarding settings are excluded there. No evidence retrieval or response fact-checking existed.

Foundation provider contracts and provenance/confidence models existed independently of the runtime. The category-level tutor context allowlist currently allows all categories, including medical context; it is not a sufficient minimum-necessary policy by itself and remains unchanged. This milestone uses a narrow legacy field allowlist at the actual provider boundary rather than connecting broad profile context.

## Runtime boundary

`server/providers/languageModel.js` adapts the existing Responses client to the `generate` provider interface. `createTutorService` permits an injected provider for offline tests. Production still uses the existing client/model, request fields, `store: false`, and `{ content }` API response. The base prompt and frontend are unchanged.

`server/orchestration/tutoringFoundation.js` filters personalization to four nonempty string fields, and adds evidence/communication guidelines. Arbitrary nested profile, privacy, medical metadata, message IDs, and unsupported message roles do not reach the provider. Free text and conversation history still may contain sensitive information voluntarily supplied by users; this is not PII redaction, and local remember consent does not control provider processing. No new persistence, logging, or retrieval is introduced.

Evidence is optional server-owned configuration, never a request-body source of trusted claims. Each accepted record has a summary, established/emerging level, and provenance validated through the existing constructor, including a source identifier, parseable retrieval timestamp, and verified status. Invalid/unverified records are omitted. This validates structure and a server assertion of verification, not scientific truth or source quality. No evidence is configured in production yet; guidelines explicitly prevent claiming retrieval or verification when none is supplied.

Guidance covers uncertainty, association versus causation, no invented citations, practical/culturally appropriate options, non-shaming language, hard constraints, and no diagnosis/prescribing/cure promises. These are model instructions, not a deterministic safety filter. Tests verify provider inputs and boundaries, not real-model compliance or factual accuracy. Empty output still fails for the existing retry behavior.

## Verification and follow-ups

Offline provider tests cover evidence provenance filtering, client-evidence exclusion, minimum-necessary personalization, message normalization, instructions under conflicting context, teaching-control compatibility, and empty output. Existing Responses adapter tests remain regression coverage.

Later milestones should add approved evidence retrieval/quality policies, proportional safety pre/post checks, and response evaluations for unsupported claims, shame, and prompt injection. Do not infer clinical safety, evidence verification, or provider zero retention from this foundation.
