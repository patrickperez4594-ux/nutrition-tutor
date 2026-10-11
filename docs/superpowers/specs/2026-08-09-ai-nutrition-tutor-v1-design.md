# AI Nutrition Tutor V1 Design

Date: 2026-08-09
Status: Approved design, pending user review of written spec
Target: Focused MVP intended for completion in roughly one day, with a two-day ceiling if integration or deployment issues arise

## 1. Product Goal

Build a real, usable Version 1 of the AI Nutrition Tutor by converting the existing personal-training React foundation into a calm, modern nutrition-learning application powered by OpenAI.

The MVP must let a user open the app, optionally personalize the tutor, ask nutrition questions, receive supportive educational responses, simplify or expand those responses, and optionally save progress locally without creating an account.

V1 intentionally excludes accounts, databases, cloud chat history, meal logging, progress dashboards, payments, booking, analytics, long-term profile management, and advanced accessibility settings.

## 2. Source Repositories and Reuse Strategy

Primary target repository:
- `patrickperez4594-ux/nutrition-tutor`

Reference/foundation repository:
- `EndeavorEverlasting/Pat_Personal_Training`

The personal-training repository is a technical starting point, not something to copy blindly. Its `trainer-website` directory supplies a Create React App/Tailwind foundation, while the current UI is still largely the default starter. We will reuse useful structure and dependencies while replacing the starter experience with the Nutrition Tutor product.

Existing prompt assets must be preserved:
- `prompts/system-prompt.md`
- `prompts/system-prompt.json`

The Markdown system prompt remains the behavioral source of truth for the tutor.

## 3. Visual Direction

Approved personality: **Calm + Modern**.

The app should feel welcoming, nonjudgmental, contemporary, credible, easy to scan on a phone, calmer than a fitness dashboard, and less clinical than a healthcare portal.

Core screen elements:
- `AI Nutrition Tutor` header
- supporting line such as `Learn nutrition without judgment.`
- `Personalize My Tutor`
- `Start Chatting`
- primary chat area
- readable user/tutor messages
- large message composer
- lightweight trust note
- saved-conversation access
- `New Private Session`

The layout is mobile-first and responsive for desktop. V1 avoids calorie rings, weight charts, dense dashboards, and similar visual clutter.

## 4. Entry Flow and Optional Personalization

On entry, the user gets two equally valid options:
1. **Personalize My Tutor**
2. **Start Chatting**

Personalization is optional and never blocks chat access.

If chosen, personalization appears on one compact page with:
- what the user wants help with (nutrition basics, balanced meals, protein, sports nutrition, weight-related education, other)
- preferred teaching style (simple and brief, step-by-step, detailed)
- optional food preferences/restrictions
- optional additional context such as budget, culture, accessibility needs, or cooking experience

The form must not require weight, height, age, sex, diagnoses, calorie targets, or other sensitive information merely to begin using the app.

Editing personalization later is deferred to V2.

## 5. Tutor Behavior and Teaching Model

Preferred conversational pattern:

**User asks -> Tutor understands -> Tutor teaches -> Tutor offers a next step**

The existing system prompt remains the foundation. V1 preserves these principles:
- respect user autonomy
- never shame, guilt, pressure, or embarrass
- give realistic expectations
- explain concepts clearly
- adapt to learning style and knowledge level
- consider goals, preferences, culture, budget, and relevant health needs
- avoid unnecessary requests for personal information
- remain within educational boundaries
- never pretend to replace a physician or registered dietitian
- encourage qualified professional support when a concern exceeds educational scope

Each tutor response can offer:
- **Make this easier** — re-explain more simply
- **Explain more** — expand with more detail
- **Give me an example** — make the concept practical

The tutor should not automatically calculate calories/macros from body information unless the user specifically requests an educational calculation and appropriate context is available.

## 6. Safety, Trust, and Boundaries

Safety is product behavior, not only fine print.

The tutor must:
- teach and suggest rather than command
- avoid shame related to food choices, body size, setbacks, or eating habits
- avoid promoting starvation-style diets, purging, extreme restriction, or unsafe rapid-weight-loss behavior
- distinguish general nutrition education from medical diagnosis or treatment
- ask only for information needed for the current question
- escalate appropriately when medically complex situations exceed educational scope
- use supportive language without minimizing genuine risk
- avoid claiming HIPAA compliance unless later infrastructure is built and verified for that claim

Examples that may warrant professional support include medically significant symptoms, medication interactions, pregnancy, severe allergies, diagnosed conditions, or eating-disorder concerns.

Trust note example:
`Educational nutrition guidance • You remain in control.`

`New Private Session` is always available.

## 7. AI Architecture

### Frontend
React provides the entry screen, optional personalization, chat, response controls, saved conversations, privacy controls, and error states.

### Server-side AI boundary
The OpenAI API key must never be exposed in browser code.

The frontend sends requests to a small server endpoint. That endpoint assembles:
1. Nutrition Tutor system prompt
2. optional personalization context
3. current conversation history
4. latest user message or response-control instruction

The server calls OpenAI and returns the tutor response.

The model identifier is environment-configurable so it can be changed without redesigning the app.

### No V1 database
V1 intentionally avoids database, account, and cloud-persistence infrastructure.

## 8. Conversation Memory and Privacy

Default mode: **Private Session**.

During a Private Session:
- the active conversation remains available while the user is using the app
- the app does not intentionally persist it locally unless the user selects `Save Progress`

Saved conversations are stored locally in the current browser/device for V1.

The app clearly explains:
- local saving is not cloud backup
- clearing browser/app storage may remove saved conversations
- messages still must be sent to the AI service to generate replies

## 9. Saved Conversations

V1 supports multiple saved conversations.

Saved data includes only what continuity requires:
- message history
- title
- creation/save timestamp
- selected review policy
- next review date when applicable

The app creates a short automatic title without requiring an extra AI request in V1. The user may optionally rename it.

Save choices:
- review after 7 days
- review after 30 days
- keep until I delete it

The 7- and 30-day selections are **review dates, not deletion dates**.

## 10. Review-Date Behavior

Nothing is automatically deleted at a review date.

When the user next opens the app after that date, they can:
- keep for another equivalent period
- keep until I delete it
- delete now

Manual deletion remains available at all times.

Privacy principle:

**Nothing saved by surprise. Nothing deleted by surprise. The user remains in control.**

## 11. Error Handling and Reliability

### AI request failure
- keep the user's message visible
- preserve conversation state
- show a human-readable error
- provide `Retry`

### Local storage unavailable
- Private Session keeps working
- explain that Save Progress is unavailable
- never imply a failed save succeeded

### Partial failure
A failed request never wipes the conversation.

### User-facing errors
Never expose raw stack traces, API payloads, secret values, or cryptic developer errors.

## 12. Data Flow

### Standard chat
1. Open app.
2. Personalize or skip.
3. Enter chat.
4. Send a message.
5. Frontend packages session context.
6. Server adds system prompt and calls OpenAI.
7. Response returns.
8. Frontend displays answer and response controls.

### Save Progress
1. Select `Save Progress`.
2. Choose review/retention option.
3. App creates a short automatic title.
4. Conversation is serialized to local storage.
5. User can later reopen, rename, extend, retain indefinitely, or delete it.

### Response controls
1. Choose `Make this easier`, `Explain more`, or `Give me an example`.
2. App sends relevant conversation context to the server.
3. Server requests the selected transformation while preserving the topic.
4. New tutor response appears in the conversation.

## 13. V1 Validation Requirements

Before V1 is complete, verify:

### Entry and personalization
- personalization path works
- direct `Start Chatting` path works
- personalization influences tutor context

### Tutor
- real AI chat works through the server boundary
- system prompt behavior is active
- response controls work
- representative safety scenarios are tested

### Privacy and saved progress
- Private Session does not intentionally persist chats
- multiple conversations can be saved
- automatic titles work
- titles can be renamed
- 7-day and 30-day review behavior works
- `Keep until I delete it` works
- review dates never auto-delete
- review prompts offer extension, indefinite retention, and deletion
- manual deletion works

### Reliability
- failed AI requests preserve messages and expose Retry
- unavailable local storage does not break Private Session
- errors are understandable to non-developers

### Security and build
- API secret remains server-side
- no secret is committed
- production build succeeds
- mobile layout works
- desktop layout works

## 14. V1 Scope Boundary

### Included
- calm + modern responsive UI
- optional compact personalization page
- direct skip-to-chat path
- OpenAI-powered tutor chat
- existing system-prompt integration
- three response controls
- Private Session default
- multiple locally saved conversations
- automatic titles
- optional rename
- user-controlled review dates
- manual deletion
- graceful AI/storage errors
- safety/trust messaging

### Deferred to V2 or later
- accounts/login
- cloud chat history
- cross-device sync
- databases
- editable personalization/profile settings
- meal logging
- progress dashboards
- calorie rings/weight graphs
- bookings
- payments
- analytics
- admin portal
- push notifications
- background expiration jobs
- complex medical workflows
- verified HIPAA-compliant infrastructure
- advanced accessibility settings panels
- multi-provider switching UI

## 15. Architecture Boundaries

Keep responsibilities separated:
- UI components own presentation and interaction
- session state owns the active conversation
- local persistence utilities own saved chats, review dates, and deletion
- browser AI client talks only to the app server endpoint
- server-side AI code owns credentials, prompt assembly, and provider calls
- prompt assets remain separate from UI code

No single component should contain the entire UI, storage model, AI request logic, and privacy logic.

## 16. Success Definition

V1 is successful when a person can:
1. open the app on phone or desktop
2. personalize or immediately start chatting
3. have a supportive nutrition conversation governed by the approved system prompt
4. simplify, expand, or request an example for an answer
5. remain in a Private Session by default
6. deliberately save multiple conversations
7. return to saved conversations on the same device
8. understand and control review timing
9. rename or delete saved conversations
10. recover cleanly from common AI or storage failures

The result should feel like a coherent product, not a demo of disconnected features.
