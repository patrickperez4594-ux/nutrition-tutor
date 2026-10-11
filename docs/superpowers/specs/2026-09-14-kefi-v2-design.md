# Kefi V2 — Product & Technical Design Specification

**Status:** Design approved in chat; written specification prepared for user review  
**Date:** 2026-09-14  
**Product:** Kefi  
**Document purpose:** Consolidate the approved Kefi V2 product, UX, data, safety, privacy, reliability, and engineering architecture into one implementation-ready design specification.

---

## 1. Executive Summary

Kefi is an adaptive AI nutrition tutor and real-life food decision system. It teaches users how nutrition works, helps them decide what to eat, buy, cook, modify, or order based on their actual circumstances, and adapts when those circumstances change—without judgment, false precision, unnecessary complexity, or loss of user control.

Kefi must not feel like “a calorie tracker with AI.” It should feel like a nutrition tutor and decision partner that can teach, scan, estimate, plan, adapt, shop, compare, explain, and help the user act with the food, money, time, energy, equipment, preferences, culture, and constraints they actually have.

The architectural north star is:

> **One Kefi experience, many specialized engines, structured truth underneath, conversational intelligence on top.**

The behavioral north star is:

> **Kefi adapts nutrition to the person's life rather than demanding the person's life adapt to nutrition.**

Kefi V2 will evolve the approved V1 rather than discard it. V1 established a private-by-default, nonjudgmental, mobile-first AI nutrition tutor with optional personalization, local saved progress, multiple conversations, retry behavior, simplified response controls, and explicit privacy boundaries. V2 preserves those principles while expanding into photo understanding, calorie education, pantry and grocery intelligence, restaurant decision support, progress intelligence, learning, accounts/sync, internationalization, accessibility, and robust production architecture.

---

## 2. Product Principles

The following principles are normative. If a feature conflicts with one of these, the feature must be changed rather than the principle silently weakened.

1. **Kefi adapts nutrition to the person's life rather than demanding the person's life adapt to nutrition.**
2. **Estimate transparently. Educate clearly. Never disguise uncertainty as precision.**
3. **AI reasons and teaches. Code calculates and validates. Trusted structured data grounds factual nutrition information.**
4. **Kefi should never require more personal data than the feature actually needs.**
5. **Kefi earns information progressively rather than demanding information upfront.**
6. **Confidence should come from the strength of the evidence—not from how confidently an AI can phrase an answer.**
7. **Kefi optimizes the plan the user can realistically follow—not the theoretically perfect plan they probably won't.**
8. **When circumstances change, adapt the plan before abandoning it.**
9. **Optimize for the user's total food situation—not the cheapest individual product.**
10. **When real-world price or inventory information is uncertain, Kefi says so rather than manufacturing precision.**
11. **Kefi helps users navigate the food that's actually available instead of demanding an idealized meal that isn't.**
12. **Enjoyment, culture, affordability, and convenience are legitimate parts of a food decision—not errors Kefi needs to correct.**
13. **Kefi learns from patterns, but the user remains the authority on what those patterns mean.**
14. **Progress is information—not judgment.**
15. **Kefi should be maximally useful inside its scope and immediately honest about the boundary when a situation exceeds that scope.**
16. **Safety constraints override optimization, but safety messaging should remain proportional to actual risk.**
17. **One Kefi experience, many specialized engines.**
18. **Engines return structured truth; Kefi turns that truth into useful conversation.**
19. **Every external fact should carry source, confidence, and freshness appropriate to its domain.**
20. **When Kefi cannot verify real-world information, it should help the user obtain better information rather than pretending it already has it.**
21. **Kefi is not reliable because the AI sounds confident. Kefi is reliable because its calculations, constraints, sources, state, uncertainty, and behavior can be tested.**
22. **Every important failure should eventually become a test that prevents it from happening again.**
23. **Accessibility is part of Kefi’s core interaction model, not a layer added after the interface is finished.**
24. **Kefi localizes nutrition context—not just words.**
25. **Language, units, currency, and region are separate preferences; Kefi should not infer one from another.**
26. **Cultural familiarity should improve recommendations without becoming cultural stereotyping.**
27. **Kefi should work without an account, improve with an account, and never trap the user's data.**
28. **Kefi earns the right to interrupt the user.**
29. **Kefi should optimize for usefulness, not attention.**
30. **Trust boundaries should be enforced by architecture, not merely described in prompts.**
31. **AI output is untrusted input until validated.**
32. **Use the smallest amount of computation necessary to produce a trustworthy answer.**
33. **Measure whether Kefi helped—not how long it captured attention.**
34. **Complexity belongs inside Kefi's architecture—not in front of the user.**

---

## 3. V1 Baseline to Preserve

Kefi V2 must preserve the approved V1 philosophy and behavior wherever those concepts remain applicable.

### 3.1 V1 experience

- Calm, modern, mobile-first nutrition education experience.
- Optional personalization or immediate chat.
- Private Session by default.
- Explicit local Save Progress.
- Multiple saved conversations.
- Auto titles, rename, and delete.
- Review choices of 7 days, 30 days, or keep until deleted.
- Retry failed AI requests.
- Latest-response controls:
  - Make This Easier
  - Explain More
  - Give Me an Example
- No coercion, shaming, diagnosing, or false expectations.
- Educational, not medical-treatment positioning.
- Minimal sensitive-data collection.
- Culture-, budget-, and accessibility-aware guidance.
- No HIPAA claim unless future architecture and legal posture explicitly support one.
- AI provider secrets remain server-side.
- Model configurable rather than hard-coded.

### 3.2 V1 scope exclusions that V2 now intentionally revisits

V1 intentionally excluded accounts, cloud databases/history, meal logging, dashboards, payments, booking, analytics, and advanced accessibility. V2 intentionally adds selected capabilities from that list—especially accounts/sync, progress intelligence, analytics, and advanced accessibility—under the stricter privacy and architecture rules in this specification.

V2 must not treat V1 as disposable. The implementation plan must first inspect the existing repository, preserve working behavior, capture baseline tests, identify reusable code, and document justified migrations.

---

## 4. V2 Product Scope

### 4.1 Core flagship capabilities

Kefi V2 must coherently support:

- Adaptive AI Tutor
- Editable Personalization
- Flexible Nutrition Goals
- Low-Energy / Low-Decision Mode
- Budget Nutrition Mode
- Smart Grocery Assistant
- Pantry & Meal Builder
- Plans Changed
- Cultural Food Intelligence
- Ingredient Swap Engine
- Food/fridge/menu/product photo understanding
- Food photo calorie/macronutrient estimation
- Scan → Learn
- Restaurant Assistant
- Store/Grocery Assistant
- Mini Nutrition Courses
- Mini Quizzes
- Progress Intelligence
- Coach View
- Meal Rescue
- Daily Snapshot
- Nutrition Patterns
- Smart Leftovers
- Household Mode
- Compare Foods
- Food Label Scanner
- “Why?” explanation layer
- Goal Conflict Resolution / Constraint Resolver
- Confidence-Aware Answers
- Food Knowledge & Health Benefits
- GI/GL intelligence
- Myth Checker
- Supplement Evidence Cards
- Optional accounts, sync, backup, export/import
- Notifications/reminders under explicit user control
- Accessibility, localization, and internationalization architecture

### 4.2 What V2 does not need to block on

The following are supported as future integrations but are not required to legitimately call V2 complete:

- integrations with every supermarket
- every restaurant chain API
- every world language
- every wearable
- automatic medical-record integration
- perfect receipt recognition
- fully automatic pantry tracking
- voice assistant on every platform
- AR grocery navigation
- social network/community
- clinician portal
- native integration with every health ecosystem

---

## 5. Navigation & Screen Map

### 5.1 Bottom navigation

Mobile bottom navigation:

- **Home**
- **Ask**
- **Scan**
- **Learn**
- **Me**

### 5.2 Home

Prompt: **“What would you like help with today?”**

Primary actions:

- Ask Kefi
- Scan Food
- What Can I Make?
- Grocery Help
- Learn
- My Goals
- Always-visible **⚡ Plans Changed**

The first visual impression should be calm, simple, and approachable. Complexity remains below the surface.

### 5.3 Ask Kefi

Adaptive tutor with contextual controls:

- Make This Easier
- Explain More
- Give Me an Example
- Short Version
- Turn Into Steps
- Show Me Visually when appropriate
- Quiz Me
- Help Me Do This Today
- Why?

### 5.4 Scan

Supported scan types:

- Meal
- Fridge / Pantry
- Nutrition Label
- Menu
- Grocery Shelf / Product
- Receipt (feature-flagged until production quality is proven)

### 5.5 What Can I Make?

Inputs:

- Use My Pantry
- Type Ingredients
- Scan My Fridge

Filters:

- low effort
- cheapest
- high protein
- high fiber
- calorie range or preference
- no cooking
- ≤10 minutes or custom time
- leftovers
- cultural cuisine
- custom goal

Ranked results:

- Best Match
- Easiest
- Cheapest
- Show Me More

### 5.6 Grocery Help

Actions:

- Build Grocery List
- Shop on Budget
- In Store Right Now
- Cheap Protein Ideas
- Use What I Already Have
- Groceries for Meal Plan
- Scan Product / Shelf

Key follow-ups:

- Make This Cheaper
- Show Me What These Groceries Can Make

### 5.7 Learn

Contains Quick Learn and Courses, including Calorie Lab.

### 5.8 My Goals

Shows:

- current focus
- recent observations
- What Kefi Noticed
- Help Me With This
- pause/change/complete goal controls

### 5.9 Coach View

“How Am I Doing?” with:

- what is going well
- what seems difficult
- one practical focus
- uncertainty when evidence is weak
- Build That Plan

No arbitrary health score.

### 5.10 Personalization

Editable sections:

- Goals
- Food Preferences
- Restrictions / Allergies / Intolerances
- Culture & Cuisine
- Cooking & Equipment
- Budget
- How Kefi Teaches Me
- Response Length
- Calorie & Macro Preferences
- Accessibility
- Locale / Units / Currency
- Privacy & Saved Data

Low-Energy Mode must be globally accessible.

---

## 6. Onboarding & Progressive Profiling

Kefi must ask very little upfront and learn more only when useful.

### 6.1 Welcome

- Get Started
- Continue Without Personalization

Both are valid paths.

### 6.2 Intent selection

Examples:

- Eat better
- Get more protein
- Understand calories / weight goals
- Eat on a budget
- Cook / find easy meals
- Learn nutrition
- Make decisions easier
- Support fitness
- Custom
- Not sure

### 6.3 Teaching style

Options:

- short
- step-by-step
- teach me why
- detailed
- just decide for me
- auto-adapt

### 6.4 Optional context

Food preferences, restrictions, cuisines, budget, cooking ability, equipment, and overwhelm preference are optional and skippable.

Cuisine must be framed as foods the user enjoys, not ethnicity inference.

### 6.5 Calorie personalization

Only request age, height, weight, equation inputs, and activity when the user asks for a personalized energy estimate. Offer **Teach Me Without Calculating**.

Always explain why an input is needed.

### 6.6 Remember This ✦

Kefi may ask contextually whether the user wants a preference remembered. The user distinguishes:

- just this time
- remember for future

Persistent preference changes remain user-controlled.

---

## 7. Adaptive Tutor & Teaching System

The Tutor Layer changes communication depth without changing underlying facts.

Kefi can provide the same truth as:

- simple
- standard
- detailed
- step-by-step
- example-driven
- quiz
- practical action

Low-Energy Mode reduces cognitive load but must never reduce safety, factual quality, or constraint reasoning.

The Tutor must avoid walls of text by default and surface useful next actions.

---

## 8. Personalization & Goal Model

### 8.1 Profile domains

Personalization must remain modular:

- FoodPreferences
- DietaryRestrictions
- CuisinePreferences
- BudgetPreferences
- CookingContext
- LearningPreferences
- NutritionPreferences
- PrivacyPreferences
- AccessibilityPreferences
- LocalePreferences

### 8.2 Flexible goals

Supported goals include:

- protein
- hydration
- fiber
- fruits/vegetables
- cooking frequency
- energy
- budgeting
- takeout reduction
- weight maintenance
- gradual fat loss
- gradual weight gain
- muscle-building nutrition
- nutrition education
- custom goals

No mandatory calorie tracking. No punitive streaks.

Goals represent direction, not pass/fail status.

### 8.3 Hard constraints vs preferences

The schema and Constraint Resolver must distinguish:

- allergy: hard constraint
- intolerance: context-sensitive restriction
- dislike: preference
- budget: hard or soft depending on user choice
- high protein: optimization goal

Constraints may never be silently dropped.

---

## 9. Low-Energy / Low-Decision Mode

Low-Energy Mode is a system-wide accessibility and interaction mode.

It changes:

- number of visible choices
- response length
- follow-up question count
- animation
- density of secondary content
- prominence of one best next step
- notification frequency

It does not change:

- safety rules
- factual quality
- confidence handling
- constraint adherence
- necessary warnings

No diagnosis is required to use the mode.

---

## 10. Nutrition Calculation & Science Architecture

### 10.1 Separation of responsibilities

Kefi must separate:

- facts
- calculations
- estimates
- scientific interpretation
- AI explanation

### 10.2 Calculation Registry

A single deterministic calculation registry must serve every feature.

It includes:

- Mifflin–St Jeor BMR
- TDEE multiplication
- GI → GL
- kcal ↔ kJ
- weight/volume conversions
- macro energy arithmetic
- recipe scaling
- serving calculations
- unit price calculations
- budget totals

No feature may maintain an independent duplicate implementation of the same formula.

### 10.3 Adult energy estimation

Default adult BMR estimation where appropriate:

- Male: `BMR = 10 × weight_kg + 6.25 × height_cm − 5 × age + 5`
- Female: `BMR = 10 × weight_kg + 6.25 × height_cm − 5 × age − 161`

TDEE is approximately BMR multiplied by an activity factor. Example educational factors:

- sedentary: 1.2
- lightly active: 1.375
- moderately active: 1.55
- very active: 1.725
- extremely active: 1.9

Kefi must teach that these are estimates. Actual needs vary with body composition, occupation, training, physiology, medications, illness, adaptive metabolism, and activity classification.

Goal choices:

- Maintain Weight
- Gradual Fat Loss
- Gradual Weight Gain
- Build Muscle
- Teach Me First

Avoid aggressive deficits or surpluses.

### 10.4 Show Me the Math

For calculations, users can inspect:

- formula
- inputs
- arithmetic
- result
- limitations

AI may explain calculations but may not become the arithmetic authority.

---

## 11. Food Knowledge, Benefits, GI & GL

### 11.1 Food Knowledge view

“Explore This Food” may include:

- what it is
- calories and macros
- vitamins and minerals
- nutritional benefits
- GI and GL
- what changes GI
- satiety considerations
- common servings
- preparation effects
- useful pairings
- budget alternatives
- cultural uses
- fits my goals
- Ask Kefi

### 11.2 Health-benefit language

Use evidence-aware language such as:

- supports
- is associated with
- can contribute to

Do not present foods as disease cures.

### 11.3 Glycemic Index

Educational categories:

- low: ≤55
- medium: 56–69
- high: ≥70

GI is context-dependent and affected by food variety, ripeness, preparation, processing, and mixed-meal composition. Kefi must not use GI as a universal “health score.”

### 11.4 Glycemic Load

`GL = GI × grams of available carbohydrate per serving ÷ 100`

GL must be calculated in code.

For mixed meals, Kefi should explain likely glycemic characteristics rather than pretend to know an exact composite GI.

### 11.5 Data grounding

The LLM must not invent GI values or scientific health claims from memory. Trusted structured data and evidence providers ground factual claims; AI explains them conversationally.

---

## 12. Vision & Scan Architecture

### 12.1 Vision role

Vision observes. It does not own nutrition conclusions.

Outputs should be structured observations such as:

- image type
- candidate foods/items
- visible text
- serving/portion clues
- package identifiers
- uncertainty

Nutrition engines reason downstream.

### 12.2 User confirmation

Where identification materially affects nutrition or safety, Kefi must allow correction or confirmation.

User-confirmed information outranks visual guesses.

### 12.3 Meal photo estimation

A completed meal-photo workflow requires:

- safe upload
- food detection
- correction/confirmation
- portion assumptions
- calorie range
- macro ranges
- fiber when reasonably estimable
- confidence
- assumptions
- uncertainty sources
- Why is this an estimate?
- Improve Estimate
- downstream educational and practical actions

Never present false laboratory precision.

### 12.4 Estimation hierarchy

When multiple sources exist:

1. verified / user-confirmed facts
2. reliable structured references
3. visual estimate
4. AI guess

Reliable label or published restaurant data may supersede a generic visual estimate.

### 12.5 Improve Estimate

Ask only high-value clarification questions that materially narrow uncertainty.

### 12.6 Scan types

- Meal
- Fridge/Pantry
- Label
- Menu
- Product/Shelf
- Receipt (flagged until quality gate passes)

### 12.7 Scan → Learn

After a scan, offer educational actions tied to the actual context, for example:

- Why is this estimate a range?
- What does this fiber number mean?
- Why might this meal be filling?
- How would preparation change GI?

---

## 13. Pantry, Leftovers & Meal Intelligence

### 13.1 Pantry inputs

- manual ingredient entry
- fridge/pantry photo with confirmation
- receipt import after confirmation
- meal-plan leftovers
- grocery purchases

### 13.2 Pantry state

Pantry should maintain useful structured state, potentially including lightweight change events for conflict resolution and history.

Quantities may be exact or uncertain. The schema must preserve quantity confidence rather than forcing fake exactness.

### 13.3 Leftovers

Leftovers are specialized pantry objects with fields such as:

- prepared_at
- servings_remaining
- storage_type
- source_meal
- estimated_use_window

Kefi may proactively suggest using leftovers but must distinguish confirmed dates from generic storage estimates.

### 13.4 What Can I Make?

Rank candidates using hard constraints first, then user goals and practical preferences.

Surface:

- Best Match
- Easiest
- Cheapest

Meal intelligence should support:

- pantry use
- leftovers
- cultural cuisine
- low effort
- no cooking
- time limits
- protein/fiber/calorie preferences
- budget
- equipment

### 13.5 Meal Rescue

Actions:

- More Filling
- More Protein
- More Fiber
- Fewer Calories
- More Calories
- Cheaper
- Less Cooking
- Use What I Have

The engine should prefer the smallest useful modification rather than replacing the whole meal.

### 13.6 Smart substitutions

Substitutions must reason about ingredient purpose:

- protein
- calories
- fiber
- flavor
- texture
- cost
- restriction
- allergy
- availability
- culture

Explain why the substitution works.

---

## 14. Meal Planning & Recipes

### 14.1 Build Around My Life

Planning inputs may include:

- number of days
- number of people
- meals that actually need planning
- budget
- cooking effort
- equipment
- pantry
- restrictions
- cuisine
- goals
- realistic energy/effort

Planning styles:

- Just Help Me Eat
- Flexible Week
- Structured Plan

### 14.2 Meal components

Kefi should reason about meal components, not recipes alone. This supports flexible replacements and familiar cultural meals.

### 14.3 Recipe structure

Recipes should store:

- ingredients
- quantities
- servings
- steps
- equipment
- time
- difficulty
- estimated cost
- nutrition estimate
- dietary tags
- allergens
- cuisine
- substitutions
- leftover strategy
- confidence

Portion scaling is deterministic.

### 14.4 Ingredient overlap optimization

Meal plans should reduce unnecessary unique purchases by intentionally reusing ingredients across meals while respecting variety and user preference.

### 14.5 Smart Leftovers

The plan should account for prepared-food carryover and suggest when to use it.

### 14.6 I Need Food Now

Support immediate contexts:

- nothing prepared
- microwave only
- convenience store
- fast food
- restaurant
- food at home
- very little money

Optimize for immediacy, availability, affordability, and reasonable nutrition.

---

## 15. Grocery & Store Intelligence

### 15.1 Grocery Help

Entry points:

- Build My Grocery List
- I Have $X
- I’m at the Store
- Use What I Have
- Find Cheap Protein
- Groceries for Meal Plan
- Scan Product/Shelf

### 15.2 Budget Allocation Engine

Inputs:

- budget
- pantry
- number of days
- people
- meal requirements
- nutrition priorities
- ingredient overlap
- likely prices
- flexibility

Outputs a plan optimized for the user's total food situation.

### 15.3 Cost concepts

Kefi must distinguish:

- **Checkout Cost:** cash required at purchase
- **Consumed Cost:** estimated portion of purchased goods used in a meal/plan
- **Cost per serving**

Package-size intelligence must reconcile recipe requirement, package size, purchase quantity, leftovers, and pantry.

### 15.4 Unit price

Unit value is useful but not automatically the best purchase. Kefi must consider:

- cash available
- storage
- spoilage
- actual consumption

### 15.5 Make This Cheaper

May reduce:

- unique ingredients
- low-priority purchases
- expensive protein source
- package size
- fresh/frozen form
- brand premium

Show estimated savings when the price basis is sufficiently reliable.

### 15.6 Store Mode

Short, action-oriented interface for in-store use. It can:

- track remaining budget
- compare visible products
- read labels
- use visible prices
- suggest substitutions
- prioritize list

### 15.7 No fabricated live information

Store information must be labeled internally and, where relevant, visibly as:

- LIVE
- ESTIMATED
- UNKNOWN

Cached information must never masquerade as live.

When real-world data is unavailable, Kefi should ask the user what they see or allow a photo/price entry.

### 15.8 Receipt scanning

Receipt flow:

1. extract product names, quantities, prices, total
2. show user confirmation
3. reconcile with Pantry

Receipt scanning remains feature-flagged until its extraction and confirmation workflow passes production-quality gates.

---

## 16. Restaurant, Takeout & Eating-Out Intelligence

Kefi must help users make choices that fit the situation—not automatically select the lowest-calorie item.

### 16.1 Menu understanding

Extract or understand:

- dish names
- descriptions
- prices
- sides/add-ons
- portion clues
- dietary notes

### 16.2 User priorities

Possible priorities:

- Best overall fit
- Higher protein
- More filling
- Lower cost
- Lighter
- More fiber
- Dietary needs
- Explain the menu

### 16.3 Estimation

Restaurant estimates should generally use wider ranges because oil, sauces, recipes, and portions vary.

If official published nutrition exists and is reliable, it generally outranks visual estimation.

### 16.4 Modifications

Offer:

- More Protein
- More Fiber
- Lower Cost
- Lighter
- More Filling
- Less Sodium
- Use Half Later
- No Modification

Prefer the smallest useful change.

### 16.5 What Makes Sense for Me Here?

Uses relevant context such as:

- current goal
- dietary restrictions
- budget
- hunger/context
- preferences

May surface:

- Best Overall
- Best Budget
- Best if Very Hungry

Low-Energy mode may return one recommendation plus **Show Another**.

### 16.6 Pleasure and cultural context

Food serves pleasure, culture, celebration, social connection, and tradition. Kefi should not automatically offer a lower-calorie substitute for celebration food unless asked.

---

## 17. Plans Changed ⚡

Plans Changed is a core, globally accessible Kefi action.

Common reasons:

- too tired
- no time
- not home
- budget changed
- missing ingredients
- no kitchen
- restaurant instead
- unexpected expense
- just do not want the planned meal

Kefi should adapt the current plan before framing anything as abandoned or failed.

The same action should be available from Home, meal plans, grocery flows, restaurant flows, and relevant notifications.

---

## 18. Learn, Courses, Quizzes & Evidence

### 18.1 Course topics

Initial course library:

- Nutrition Basics
- Calories
- Protein
- Carbohydrates
- Fat
- Fiber
- Hydration
- Fruits & Vegetables
- Balanced Meals
- Food Labels
- Energy Balance
- Meal Planning
- Grocery Shopping
- Budget Eating
- Eating Out
- Micronutrients
- Supplements
- Nutrition Myths

### 18.2 Quizzes

Optional, educational, and non-shaming.

When wrong:

- explain why
- offer retry
- offer simpler explanation

No punishment or moral framing.

### 18.3 Myth Checker

Output:

- Verdict
- Short Answer
- Why People Believe It
- What Evidence Says
- Practical Takeaway
- Sources

### 18.4 Supplement Evidence Cards

Include:

- evidence strength by outcome
- common use
- mechanism where relevant
- research context
- limitations
- known risks
- interactions
- upper-limit concerns
- special populations
- sources

### 18.5 Evidence hierarchy

Use an explicit evidence hierarchy:

- high confidence
- moderate / context-dependent
- limited / emerging
- unknown / insufficient

Scientific evidence ranking should generally prefer guidelines/reference bodies, systematic reviews/meta-analyses, strong clinical studies, observational research, mechanistic evidence, expert commentary, and anecdotes in descending reliability for practical claims.

The AI may explain and contextualize evidence. It must not manufacture evidence.

---

## 19. Progress Intelligence & Coaching

### 19.1 Data source

Progress uses only information the user chose to save. Private Session data is excluded.

### 19.2 Observation → Hypothesis → Recommendation

Progress must preserve this structure.

Example:

- Observation: quick meals were selected more often on workdays.
- Hypothesis: shorter prep time may fit weekday energy better.
- Recommendation: test more ≤15-minute weekday meals.

Do not state causation without adequate evidence.

### 19.3 Pattern confidence

Derived insight metadata may include:

- evidence_count
- confidence
- date_range
- user_confirmed
- recency
- consistency

Users can answer:

- Yes
- Sometimes
- Not really
- I’m not sure

### 19.4 Kefi Noticed ✦

A visible but non-judgmental insight component.

Actions:

- Use this in future plans
- Not relevant
- Tell me more
- Forget this

### 19.5 Coach View

Provides:

- what is going well
- what seems harder
- possible friction
- one useful change
- what Kefi is uncertain about

No overall health score.

### 19.6 Help Me Reset

When routines break, Kefi helps create the smallest realistic restart rather than using failure/recovery moral framing.

### 19.7 Pattern decay

Behavior patterns should weaken over time when no longer supported. Persistent explicit preferences remain until changed by the user.

### 19.8 Optional personal experiments

Kefi may help the user run low-risk practical self-observation experiments, such as testing whether a different breakfast structure feels more satisfying. These remain observations rather than medical conclusions and should not be framed as proof of causation.

---

## 20. Daily Snapshot, Compare Foods & Household Mode

### 20.1 Daily Snapshot

A lightweight summary of relevant saved information. It should not become a giant logging dashboard.

### 20.2 Compare Foods

Comparison must answer **“better for what?”** rather than produce a universal winner.

Possible comparison axes:

- protein
- fiber
- calories
- cost
- satiety
- convenience
- specific goal

### 20.3 Household Mode

Supports multiple people's restrictions/preferences in shared meal and grocery planning.

Shared base meal with individual adaptations is preferred where practical.

Household attributes must remain separate from the account owner's personal profile.

---

## 21. Safety, Scope & High-Risk Nutrition Handling

### 21.1 Risk tiers

Internal tiers:

- **Green:** normal nutrition guidance
- **Yellow:** context-sensitive / needs guardrails
- **Red:** medical or urgent territory

Safety should remain mostly invisible until relevant.

### 21.2 Decision hierarchy

1. Safety constraints
2. Hard restrictions
3. Medical-context limitations
4. Budget / availability
5. Goals
6. Preferences
7. Optimization

### 21.3 Allergies

Allergies are hard constraints across recipes, grocery, restaurant, substitutions, and scans. If safety cannot be confirmed, say so.

Distinguish allergy, intolerance, and preference.

### 21.4 Pregnancy

General nutrition education can be supported. Pregnancy-specific calorie targets, supplements, food safety, or symptom-related questions require more caution and appropriate context.

### 21.5 Children and teens

Do not treat minors as smaller adults. Avoid aggressive calorie deficits or adult-style weight-loss optimization. Emphasize growth, adequacy, nutrition skills, and family meals.

### 21.6 Eating-disorder-aware behavior

Detect signals such as extreme restriction, compensation, purging, obsessive minimization, or unsafe requests. Do not optimize harmful behavior.

Ordinary calorie questions must not automatically trigger unnecessary warnings.

### 21.7 Diabetes

Kefi may teach carbohydrates, fiber, GI/GL, labels, and general meal concepts. It must not pretend to predict an individual's exact glucose response or improvise medication decisions.

### 21.8 Kidney disease and other high-risk medical contexts

Do not blindly apply generic protein, potassium, phosphorus, sodium, or supplement recommendations when individualized medical judgment is needed.

### 21.9 Medication interactions

Flag potential interactions and encourage appropriate professional guidance; do not improvise medication management.

### 21.10 Supplement megadose detection

Include high-risk patterns for nutrients such as vitamin D, iron, vitamin A, niacin, selenium, zinc, caffeine, and electrolytes.

### 21.11 Labs

Kefi may explain general meaning and context of laboratory values but must not diagnose.

### 21.12 Proportional messaging

Safety warnings should be concise and proportional to actual risk. “Why am I seeing this warning?” should be available.

When a situation appears urgent, Kefi should give concise urgent-direction guidance before returning to nutrition discussion. Kefi should not infer a diagnosis from a single clue, and ordinary nutrition questions should remain ordinary when there is no meaningful safety signal.

Medical context is optional, tightly scoped, editable, and deletable. Kefi must not infer medical diagnoses from behavior or food choices.

Safety overrides optimization.

---

## 22. Privacy, Storage & Data Classification

Core rule:

> **Kefi should remember only what helps the user, store only what the user expects, and clearly distinguish temporary AI processing from saved personal data.**

### 22.1 Data classes

- Temporary Session Data
- Local Saved Data
- AI Processing Data
- Explicitly Retained Data

### 22.2 Minimum Necessary Context

Each engine receives only the data it needs for the current task.

A Context Builder enforces:

`Request → Intent Detection → Context Builder → Minimal Relevant Data → Engine`

### 22.3 Photos

Default flow:

`analyze → return result → delete temporary image`

unless the user chooses to save.

Save options:

- result only
- result + photo
- do not save

Photo and result should be independently deletable where feasible.

### 22.4 Scan data

Structured scan data should preserve:

- scan type
- detected / confirmed foods
- portion estimates
- calorie/macronutrient ranges
- fiber when reasonable
- confidence
- assumptions
- corrections
- whether the photo is saved

Do not silently collapse ranges into exact historical values.

### 22.5 Derived insights

Store derived observations separately from confirmed facts. Users can keep, edit, reject, or delete them.

### 22.5.1 Private Session telemetry boundary

Private Session excludes saved conversations, scans, progress updates, pantry auto-changes, derived insights, and content-level product analytics. Minimal operational/security telemetry that is strictly necessary to run and protect the service may still exist, but must avoid retaining session content and must be documented transparently.

### 22.6 Privacy controls

Under **Me → Privacy & Saved Data**:

- what is saved locally
- what is synced
- photo storage
- progress history
- What Kefi Has Learned
- export
- delete selected data
- clear category
- delete account

### 22.7 Retention

Support 7-day / 30-day / keep-until-deleted review choices as review reminders rather than surprise automatic deletion unless the user explicitly selects auto-deletion behavior.

---

## 23. Accounts, Sync, Backup & Portability

### 23.1 Account stance

Kefi must work without an account.

Three persistence modes:

- Private Session
- Local Profile
- Synced Profile

### 23.2 Account benefits

Optional account can add:

- multi-device sync
- cloud backup
- restore after device loss
- cross-device pantry/plans/goals
- optional photo sync

### 23.3 Category-level sync

Where feasible, users can control categories such as:

- Preferences
- Goals
- Pantry
- Progress
- Meal scans
- Photos

Photo sync is separately controlled from scan-result sync.

### 23.4 Guest → account migration

A user creating an account after long local use must be able to migrate selected local data without reset.

### 23.5 Offline queue

Offline local changes queue for later synchronization.

### 23.6 Conflict handling

Use object versions and/or event-based state for conflict-prone domains such as Pantry. Do not silently overwrite newer state after a major conflict.

### 23.7 Export

Support structured export such as JSON, with CSV for appropriate tabular datasets, plus an optional human-readable Kefi Progress Report.

Exports preserve provenance, confidence, and ranges so estimated values do not become falsely exact outside the app.

### 23.8 Import

Imports enter an **Import Preview** staging step, are validated, show conflicts, and only then commit to canonical state.

### 23.9 Deletion

Clearly distinguish:

- Sign out
- Delete account
- Delete cloud account but retain local data
- Delete account and local Kefi data

Deletion must cascade appropriately to stored objects and derived references, subject to documented backup-retention rules.

### 23.10 Device security

Optional controls may include:

- biometric / device credential app lock
- sign out this device
- sign out other devices
- re-authentication for highly sensitive actions

### 23.11 Sharing boundaries

Future sharing with a dietitian, trainer, caregiver, or family member must be granular and opt-in. Users should be able to share a grocery plan or selected goals without automatically sharing body measurements, food photos, private conversations, medical context, or unrelated progress history. Shared grocery lists must not imply shared personal profiles.

Kefi must not silently introduce public profiles, leaderboards, or social visibility.

### 23.12 Identity and billing separation

Account identity, data ownership, and any future subscription/billing system remain separate concepts. Canceling a future subscription must not silently delete nutrition history or revoke data export. If a future plan change affects cloud retention, Kefi must provide clear notice and export options.

---

## 24. Accessibility, Localization & Internationalization

### 24.1 Accessibility foundation

All major flows must support:

- semantic UI
- screen-reader labels
- logical reading order
- focus management
- keyboard navigation where applicable
- large touch targets
- scalable text
- zoom/reflow
- contrast
- reduced motion
- non-color status indicators
- accessible dialogs

No gesture-only essential action.

### 24.2 Scan alternatives

Camera-based features should have alternatives such as manual entry, text input, search, barcode, or upload where practical.

The result of an image analysis must be understandable without needing to visually inspect the source image.

### 24.3 Cognitive accessibility

Use:

- plain language
- progressive disclosure
- consistent navigation
- short defaults
- chunking
- Turn Into Steps
- Short Version
- Low-Energy Mode

Avoid unnecessary memory burden and forced timers/streak pressure.

### 24.4 Internationalization architecture

All user-facing interface strings should be externalized. Use locale-aware pluralization and formatting rather than string concatenation.

### 24.5 User-controlled locale preferences

Treat as separate preferences:

- language
- region
- measurement system
- currency
- date/time format
- energy unit

Do not infer all from one setting.

### 24.6 Units

Store canonical internal units and convert deterministically for display.

Support metric and imperial. Handle regional ambiguity in cups/tablespoons where relevant.

### 24.7 Currency

Store currency code plus decimal-safe or integer-minor-unit values. Never assume `$` means USD.

### 24.8 International food identity

Canonical food records should support localized names, cultural names, synonyms, preparation variants, and regional variants without treating every translation as identical if preparation meaning differs.

### 24.9 Label jurisdictions

Label parsing must be jurisdiction-aware. Preserve the label's actual basis, such as per serving or per 100 g, rather than forcing all labels into a U.S.-specific interpretation.

### 24.10 Translation quality

AI responses may use the user's preferred language while structured factual data remains language-independent.

High-risk safety strings should be curated and reviewed rather than relying solely on free-form translation.

Brazilian Portuguese is a strong first additional locale candidate.

### 24.11 RTL readiness

Architecture should not make right-to-left localization impossible; layout mirroring and icon behavior should be testable if/when RTL languages are supported.

### 24.12 Voice and read-aloud readiness

Kefi content should remain compatible with operating-system screen readers and future read-aloud/voice features. Voice input may later enter the same Orchestrator as typed input rather than becoming a separate, less capable system. Audio must never be the only way to access essential information.

---

## 25. Notifications, Reminders & Proactive Kefi

### 25.1 Principle

> **Kefi earns the right to interrupt the user.**

All notifications can be disabled.

### 25.2 Categories

Potential categories:

- Meal planning
- Groceries
- Pantry & leftovers
- Goals
- Learning
- Coach summaries
- Hydration
- Explicit reminders
- Kefi insights

### 25.3 Actionable notifications

Prefer notifications with a useful action, for example:

- use leftovers
- open grocery plan
- adapt tonight's meal
- continue a lesson

Avoid generic “eat healthy” engagement bait.

### 25.4 Plans Changed from notifications

Meal reminders can offer **⚡ Plans Changed**, then adapt based on a lightweight reason.

### 25.5 No manipulation

Prohibit:

- streak-loss warnings
- guilt
- fake urgency
- “Kefi misses you” engagement bait
- notification strategies optimized purely for open rate

### 25.6 Privacy levels

Lock-screen detail can be:

- Detailed
- Private

Sensitive health context should rarely appear in push text.

### 25.7 Quiet controls

Support:

- quiet hours
- Quiet Kefi for today / 3 days / a week / until re-enabled

Low-Energy Mode should generally reduce proactive interruptions.

### 25.8 Proactive Decision Engine

Potential event flow:

1. Is it relevant?
2. Is confidence sufficient?
3. Is there a useful action?
4. Does the user permit this category?
5. Quiet-hours / frequency check
6. Notify or remain silent

Silence is a valid successful output.

### 25.9 Kefi Spark ✦

Use lower-priority insight tiers:

- Push notification: worth interrupting
- Kefi Spark ✦: useful when user returns
- Silent adaptation: no announcement needed

### 25.10 Location-aware and notification-history boundaries

Future store-arrival or other location-aware prompts require separate, understandable opt-in permission and must not rely on unnecessary continuous location tracking. Kefi should also provide an in-app Recent Updates/notification history so useful suggestions are not lost merely because a phone notification was dismissed.

---

## 26. AI Orchestrator & Decision Architecture

### 26.1 One front door

The user talks to one Kefi. Underneath, the Orchestrator decides which engines to invoke.

### 26.2 Intent representation

Natural language becomes structured intent:

- primary intent
- secondary intents
- inputs
- constraints
- goal

A single request may invoke multiple engines.

### 26.3 Core engines

- Kefi Orchestrator
- Personalization Engine
- Vision Engine
- Nutrition Calculation Engine
- Nutrition Estimation Engine
- Food Knowledge / Health Benefits / GI-GL Engine
- Pantry Engine
- Meal Intelligence
- Grocery Intelligence
- Learning Engine
- Goals Engine
- Progress Intelligence
- Meal Rescue Engine
- Constraint Resolver
- Safety & Scope Layer
- Privacy Layer
- Tutor Layer
- Proactive Decision Engine
- AI Response Composer

### 26.4 Safety pre-check

Safety and hard constraints are evaluated before optimization.

### 26.5 Candidate generation and ranking

For recommendation workflows:

1. generate candidates
2. reject hard-constraint violations
3. apply safety rules
4. score/rank remaining candidates by context
5. preserve internal reasons for selection
6. compose user-facing explanation

### 26.6 Confidence propagation

Downstream confidence should not exceed the reliability of its weakest material dependency without justification.

### 26.7 Multi-turn workflow state

Use structured workflow objects such as:

- meal_scan_session
- grocery_plan_session
- restaurant_session
- calorie_calculation_session
- meal_plan_session
- learning_session
- progress_review_session

User corrections update state and rerun only affected downstream engines.

### 26.8 No expensive recomputation for presentation changes

Actions such as Explain More or Short Version should reuse existing structured results rather than rerun Vision or calculations.

### 26.9 Engine contracts

Every engine must have strict input/output schemas. LLM structured output must follow:

`schema request → validate → reject invalid → retry/fallback → never silently accept malformed output`

### 26.10 Provider independence

Use interfaces such as:

- LanguageModelProvider
- VisionProvider
- FoodDataProvider
- GIDataProvider
- ProductDataProvider
- RestaurantDataProvider
- StoreDataProvider
- EvidenceProvider
- NotificationProvider

The LLM is not persistent source of truth.

---

## 27. External Data & Provider Gateway

### 27.1 External Data Gateway

All external providers pass through one gateway that centralizes:

- authentication
- caching
- retries
- normalization
- provenance
- provider switching
- health monitoring

### 27.2 Source priority

Approximate priority by domain:

1. current verified product/restaurant information
2. authoritative structured reference data
3. high-quality scientific/reference source
4. reliable secondary source
5. Kefi estimate
6. unknown

The exact priority can vary by domain.

### 27.3 Conflict handling

Conflicting trustworthy sources should be surfaced rather than silently collapsed.

### 27.4 Freshness metadata

Facts may include:

- source
- retrieved_at
- published_at
- last_verified
- verification status

### 27.5 Fallback

Provider fallback strategy:

`primary → secondary → cached trusted result → tell user unavailable / ask user for information`

### 27.6 Canonical food identity

Differentiate raw/cooked/preparation/product/restaurant variants.

### 27.7 Evidence provider

Scientific evidence retrieval should be distinct from generic web search. AI may only cite sources actually returned by the data/evidence layer.

### 27.8 Provider privacy

External providers receive minimum necessary user data.

---

## 28. Technical Platform Architecture

### 28.1 Recommended topology

Use a **modular monolith** for the initial V2 backend.

Logical structure:

```text
Mobile/Web Client
      ↓
Kefi Backend API
      ↓
Orchestrator + Domain Engines + Provider Gateway
      ↓
Relational DB / Object Storage / Cache / Queue / External Providers
```

Do not create a microservice for each engine before operational evidence justifies it.

### 28.2 Client responsibilities

- interface state
- local persistence
- camera/file interaction
- accessibility
- offline behavior
- safe local calculations where appropriate
- sync coordination

The client does not own privileged provider secrets or protected cloud authorization rules.

### 28.3 Backend responsibilities

- authentication enforcement
- authorization
- AI orchestration
- trusted calculations
- cloud state
- provider credentials
- sync APIs
- external integrations
- rate limits
- security validation
- background jobs
- audit events

### 28.4 Local data layer

Use structured local storage for domains such as:

- profile
- preferences
- goals
- pantry
- meal_plans
- grocery_lists
- saved_scans
- courses
- learning_progress
- conversations
- progress_events
- derived_insights
- sync_queue

Avoid scattering authoritative state through view components.

### 28.5 Repository abstraction

UI accesses repositories such as:

- PantryRepository
- GoalRepository
- ScanRepository
- ConversationRepository

Repositories abstract local/cache/cloud implementation details.

### 28.6 Cloud data model

A relational database such as PostgreSQL is a strong default candidate for canonical cloud state because Kefi has rich relationships and consistency requirements.

Core domain state should not be one giant JSON document. JSON fields may be used for flexible metadata where appropriate.

### 28.7 Stable IDs

Canonical entities need stable IDs independent of localized display names.

### 28.8 Core entity types

Examples:

- Food
- FoodVariant
- Product
- RestaurantItem
- PantryItem
- Leftover
- Goal
- Recipe
- MealPlan
- GroceryList
- Scan
- Estimate
- Conversation
- WorkflowSession
- ProgressObservation
- DerivedInsight
- ProvenanceRecord

### 28.9 Provenance and confidence

Provenance, confidence, assumptions, and uncertainty are first-class structured fields where relevant.

### 28.10 Correction model

User corrections become authoritative for the workflow. Stale dependent derived results are invalidated and selectively recomputed.

### 28.11 Domain events

Use structured events when helpful, such as:

- meal_scan_confirmed
- pantry_item_consumed
- grocery_purchase_confirmed
- goal_updated
- insight_confirmed

Initially, this can be an in-process event system. Use a durable queue for asynchronous work that must survive process failure.

### 28.12 Background jobs

Examples:

- weekly Coach summary
- image cleanup
- cloud sync reconciliation
- derived insight generation
- external reference refresh
- account export preparation

Jobs must be retry-safe and idempotent where necessary.

### 28.13 Object storage

Large binary data such as food photos, fridge images, and receipts belongs in object storage rather than relational rows.

Temporary images should be automatically deleted unless explicitly retained.

### 28.14 Search

Begin with conventional indexed search for structured state. Use embeddings/vector retrieval only where semantic search genuinely improves the experience.

### 28.15 Context Builder

Central flow:

`User Request → Intent → Required Context Types → Repositories → Minimal Relevant Context → Engine/AI`

Engines declare allowed context categories.

### 28.16 Feature configuration

Centralize configurable items such as:

- provider priority
- model selection
- cache TTL
- rate limits
- feature flags

Critical safety rules should not be casually mutable product toggles.

### 28.17 Environments

At minimum:

- Development
- Staging/Test
- Production

Use separate databases, storage, secrets, and provider credentials.

### 28.18 Database and sync migrations

All schema changes are versioned migrations. Sync protocol and local schema also require versioning.

### 28.19 Money, time, and nutrition units

- Money uses currency code plus decimal-safe / minor-unit representation.
- Timestamps use an absolute internal representation and locale-aware display.
- Nutrition values carry value + unit + basis.

### 28.20 Data lineage

Derived results retain references to their material inputs, allowing targeted invalidation after correction or deletion.

### 28.21 Repository organization

Conceptual organization:

```text
/apps
  /client
/services
  /api
/packages
  /domain
  /schemas
  /calculations
  /provider-contracts
  /design-system
/tests
  /scenarios
  /security
  /calculations
  /integration
/docs
```

Exact framework details are implementation-plan decisions, subject to the existing V1 repository structure.

### 28.22 Architecture Decision Records

Consequential technical choices should have small ADRs containing decision, reason, alternatives, and consequences.

---

## 29. Security & Production Hardening

### 29.1 Secrets

No privileged AI, database, retailer, evidence, or provider secrets in frontend code.

Use managed secrets/environment configuration and separate credentials by environment.

### 29.2 Least privilege

Components receive only the data and permissions they need.

### 29.3 Authentication vs authorization

Authentication establishes identity. Authorization validates whether that identity may access a resource.

The server must derive account identity from the authenticated session rather than trusting client-submitted user IDs.

### 29.4 Secure uploads

Treat images/files as untrusted. Validate:

- actual type/signature
- allowed formats
- dimensions
- size
- processing limits

Use generated storage names rather than unsanitized user filenames.

### 29.5 Prompt-injection boundary

Text extracted from menus, labels, receipts, websites, product descriptions, and external APIs is **untrusted content**, not Kefi instruction.

External content may inform facts; it may not redefine system rules or gain authority.

### 29.6 AI output is untrusted

LLM output must pass:

- schema validation
- type validation
- range validation
- business rules
- safety checks

Reject impossible values such as negative nutrients or malformed money.

### 29.7 Safety validation after generation

Recommendations are revalidated against hard constraints and safety rules before display.

### 29.8 Rate and cost limits

Apply sensible limits by endpoint/account/session/risk signal, especially for expensive Vision and evidence operations.

### 29.9 URL-fetch safety

If Kefi later fetches user-provided URLs, use protocol restrictions, network restrictions, redirect controls, timeouts, and response-size limits to prevent server-side request abuse.

### 29.10 Personal-data authorization

Every cloud personal object enforces server-side ownership checks.

### 29.11 Deletion

Deletion must cover database rows, object-storage files, thumbnails, relevant caches, and dependent derived references subject to documented retention policy.

### 29.12 Logging

Prefer structured technical logs with request IDs. Avoid dumping private conversations or sensitive nutrition data into logs.

### 29.13 Admin security

Use role-based permissions, stronger authentication, shorter sessions for privileged tools, and audit appropriate access to sensitive data.

### 29.14 Supply chain

Use dependency scanning, lockfiles, security updates, secret scanning, and CI checks.

### 29.15 Incident response

Plan for:

`Detect → Contain → Investigate → Repair → Recover → Communicate appropriately → Prevent recurrence`

Feature flags/kill switches should allow disabling an affected subsystem without shutting down Kefi entirely.

---

## 30. Performance, Offline & Cost Engineering

### 30.1 Fast vs deep paths

Simple questions should use lightweight paths. Complex multimodal requests may use multiple engines.

The Orchestrator chooses the least expensive reliable path.

### 30.2 Model routing

Use model tiers appropriate to the task:

- lightweight classification/extraction/adaptation
- stronger reasoning for complex constraints/evidence
- vision-capable model only for image tasks

Do not use the most expensive model by default.

### 30.3 Reuse expensive work

Presentation changes do not rerun Vision or calculations.

### 30.4 Caching

Cache based on volatility:

- long: stable nutrition knowledge, GI, formulas, courses
- medium: product/restaurant references
- short: prices/promotions
- very short/live: inventory

Cached data must never be labeled live.

### 30.5 Offline core

When local data exists, support offline:

- Calculation Registry
- unit conversion
- pantry
- grocery lists
- meal plans
- saved recipes
- saved courses
- saved progress/results
- local changes queued for sync

AI-dependent features should fail transparently and preserve access to non-AI tools.

### 30.6 Image optimization

Resize/compress images before upload when analysis quality allows. Strip/ignore unnecessary metadata. Preserve original only if needed and user-authorized.

### 30.7 Progressive results

For heavy workflows, return useful stages where this improves perceived performance without presenting incomplete data as final certainty.

### 30.8 Parallelism

Run independent work concurrently; preserve dependency order where one result materially determines another.

### 30.9 Prompt/context budgets

Do not send giant histories. Use structured context summaries and current workflow state.

Raw chat history is not application state.

### 30.10 Deduplication and batching

Deduplicate repeated data-provider requests within a workflow and batch when provider contracts support it.

### 30.11 Mobile performance

Use lazy loading, pagination, battery-aware background behavior, network-aware retries, and near-instant local navigation.

### 30.12 Provider resilience

Use retry with backoff, circuit breakers, fallback providers, trusted cache, and graceful unavailable states.

### 30.13 Cost observability

Track:

- AI spend by feature
- Vision spend
- external API spend
- storage/bandwidth
- cache hit rate
- cost per active user
- cost per successful workflow

Optimize value per cost, not cost alone.

### 30.14 Model upgrades

Run the Scenario Bank before model/provider upgrades. Use canary rollout and monitor quality, safety, cost, latency, and structured-output failure rate.

---

## 31. Reliability, Testing & Quality Assurance

### 31.1 Scenario-first QA

Kefi should be tested by realistic outcomes, not only isolated functions.

Maintain a reusable **Kefi Scenario Bank**.

Examples:

- peanut allergy + high protein + $5
- fridge scan misidentifies tofu, user corrects to chicken
- exact budget plus pantry plus no stove
- menu with uncertain sauce and dietary restriction
- Low-Energy mode after plans change

### 31.2 Deterministic calculation tests

Reference tests for:

- BMR
- TDEE
- GI → GL
- conversions
- macro calories
- portion scaling
- unit pricing
- grocery budget totals

### 31.3 Estimation-quality tests

Verify:

- ranges
- confidence
- assumptions
- clarification behavior
- lower confidence with weak evidence
- narrowing after user information

### 31.4 Confidence propagation

Downstream outputs may not become falsely more certain than their inputs.

### 31.5 Constraint tests

Test combinations of allergy, budget, equipment, time, cuisine, goals, and preferences. Never silently drop a hard constraint.

### 31.6 Pantry and leftovers

Test add/use/buy/receipt/leftover/delete/correction state transitions and deterministic event reconciliation.

### 31.7 Correction persistence

A user correction must win everywhere. Old guesses must not leak into progress, pantry, history, recommendation, or exported data.

### 31.8 Source-quality tests

Verify authoritative/current source priority, stale-data labeling, conflict surfacing, and cache freshness.

### 31.9 Provider/offline failure tests

Simulate provider failure, weak networks, offline operation, cache-only fallback, and manual-entry recovery.

### 31.10 Privacy tests

Verify:

- Private Session saves nothing persistent
- unsaved photos are deleted
- deletion cascades
- unrelated engines do not receive sensitive data
- Forget insight works
- clear personalization works

### 31.11 Personalization and Low-Energy tests

Same request with different profiles should produce meaningfully adapted results while preserving facts.

Low-Energy should reduce decision load, not intelligence.

### 31.12 No-shame language checks

Flag inappropriate moralizing terms such as “cheat meal,” “bad food,” “failed,” “guilt-free,” and “clean eating” unless explaining or critiquing those concepts.

### 31.13 Cultural tests

Use diverse foods and meal patterns; reject the tendency to replace every cultural meal with generic chicken/broccoli/quinoa-style recommendations.

### 31.14 Educational accuracy

Simple, detailed, quiz, and example modes must preserve the same factual truth.

### 31.15 Progress conservatism

Require evidence thresholds and test causation-language rules.

### 31.16 Structured-output validation

Schema-check every engine boundary. Malformed AI output is rejected, retried, or handled by a defined fallback.

### 31.17 Hallucination tests

Explicitly test against invented:

- live prices
- inventory
- GI values
- restaurant nutrition
- scientific citations
- product ingredients
- user history

### 31.18 Security adversarial tests

Include prompt injection, account-ID tampering, oversized uploads, unsafe generated recommendations, malformed provider data, and conflicting instructions.

### 31.19 Performance and cost tests

Track time to first useful result, engine latency, total workflow latency, token/vision/provider calls, cache-hit rate, and per-workflow cost.

### 31.20 Bug-to-regression rule

Every significant fixed bug should become a regression test.

### 31.21 Human QA

Humans must review:

- shaming tone
- cultural awkwardness
- practical usefulness
- understandability
- accessibility
- Low-Energy usability

---

## 32. Product Analytics & Continuous Improvement

### 32.1 Outcome metrics

Measure useful outcomes rather than addictive engagement.

Potential north-star measures:

- Helpful Outcome Rate
- Constraint Success Rate
- Correction Rate
- Confidence Calibration
- Time to Useful Result
- User-Reported Helpfulness

### 32.2 Successful Helpful Outcome (SHO)

A workflow may count as successful when the user receives a practical result without an obvious failure, for example:

- confirmed meal scan
- grocery plan within constraints
- useful calorie explanation
- successful Meal Rescue
- practical Plans Changed adaptation

### 32.3 Event-based analytics

Prefer structured events such as:

- meal_scan_started
- meal_scan_completed
- meal_scan_corrected
- grocery_plan_generated
- grocery_budget_exceeded
- plans_changed_used
- lesson_completed
- goal_paused

Avoid raw conversation/photo logging by default.

### 32.4 Telemetry classes

Separate:

- Operational telemetry
- Product analytics
- Quality feedback

### 32.5 Consent

Optional analytics should be explained in plain language. Private Session must not quietly become a content-analytics loophole.

### 32.6 Feedback

Use sparse, targeted feedback such as:

- Helpful
- Partly
- Not helpful
- Too much detail
- Too vague
- Didn't fit my situation
- Estimate seemed wrong

### 32.7 Correction signal

Corrections provide high-value quality data for Vision, calibration, and constraint evaluation without requiring indefinite source-photo retention.

### 32.8 Experimentation

A/B tests may optimize presentation/usability. They must not weaken safety, factual truth, privacy, or autonomy.

### 32.9 Retention

Analytics have explicit retention periods and should aggregate where possible.

### 32.10 Improvement hierarchy

Prioritize:

1. Safety failure
2. Privacy/security failure
3. Incorrect factual output
4. Hard-constraint violation
5. User-blocking bug
6. Repeated confusing UX
7. Performance/cost problem
8. Polish

---

## 33. Visual Identity & Interaction Design

Kefi should feel:

- warm
- intelligent
- modern
- calm
- energetic
- human

It should not look like a medical portal, calorie spreadsheet, or generic AI wrapper.

### 33.1 Visual language

- card-based Home
- breathing room
- warm natural palette
- avoid cliché all-green identity
- rounded cards
- subtle shadows
- large touch targets
- restrained animation
- light and dark mode

### 33.2 Kefi Spark ✦

Signature element meaning **“Kefi has something useful for you.”**

It is not a warning indicator.

### 33.3 Confidence UI

Use text such as:

- High
- Moderate
- Low

with explanation and **Improve Estimate**.

Never rely only on color.

### 33.4 Progress UI

Prefer trends such as:

- ↗ More consistent
- → About the same
- ? Not enough information

Avoid red failure dashboards.

### 33.5 Celebration

Celebrate useful progress without manipulative streaks.

Visual north star:

> **“This feels easy” first; “this thing does a lot” second.**

---

## 34. Build Sequence

Build in dependency order, not merely screen order.

### Milestone 0 — Preserve V1

- inspect existing repository
- capture baseline behavior/tests
- map reusable code
- document intentional changes

### Milestone 1 — Foundation

- domain schemas
- local storage
- backend skeleton
- repositories
- provider contracts
- configuration
- Calculation Registry
- privacy model
- Context Builder skeleton
- testing infrastructure

### Milestone 2 — Kefi Core Brain

- Orchestrator
- intent detection
- Constraint Resolver
- Tutor Layer
- Safety Layer
- AI Response Composer
- structured output validation

### Milestone 3 — Personalization & Onboarding

- progressive onboarding
- editable profile
- goals
- cuisine
- budget
- equipment
- learning style
- privacy
- Low-Energy Mode

### Milestone 4 — Nutrition Knowledge & Calculations

- Food Knowledge
- Calorie Lab
- GI/GL
- Show Me the Math
- provenance/sources

### Milestone 5 — Vision & Scan

Incremental order:

1. meal
2. nutrition label
3. pantry/fridge
4. menu
5. product/shelf
6. receipt behind feature flag

Each scan type has independent acceptance tests.

### Milestone 6 — Pantry & Meal Intelligence

- Pantry
- leftovers
- What Can I Make?
- Meal Rescue
- substitutions
- recipes

### Milestone 7 — Grocery Intelligence

- budget allocation
- ingredient overlap
- package reconciliation
- checkout estimate
- Make This Cheaper
- Store Mode
- shopping workflow
- receipt scanner if quality gate passes

### Milestone 8 — Restaurant Intelligence

Build on tested Vision, Food Knowledge, Estimation, Constraint Resolver, and Personalization.

### Milestone 9 — Learning

- course system
- quizzes
- contextual learning
- Myth Checker
- supplement education
- Scan → Learn

Curriculum production can run in parallel with engineering.

### Milestone 10 — Progress & Coach

- Progress Intelligence
- Kefi Noticed
- Coach View
- Daily Snapshot
- Help Me Reset

### Milestone 11 — Accounts & Sync

- optional account
- cloud persistence
- sync
- backup
- export/import
- device controls

### Milestone 12 — Proactive Kefi

- reminders
- leftovers
- weekly summaries
- Quiet Kefi
- Proactive Decision Engine

### Milestone 13 — Accessibility & Localization Hardening

Accessibility/i18n are built throughout; this milestone runs comprehensive validation and locale QA.

### Milestone 14 — Production Hardening

Run:

- full Scenario Bank
- security suite
- privacy suite
- performance testing
- cost testing
- provider failure tests
- offline tests
- model evaluation
- accessibility tests
- localization QA
- backup restore drills

---

## 35. Release Gates

A feature is not “done” merely because code exists.

Every major feature should pass:

1. **Functional gate** — intended workflow works.
2. **Accuracy gate** — deterministic/factual outputs are correct.
3. **Uncertainty gate** — unknowns are communicated appropriately.
4. **Constraint gate** — hard restrictions are preserved.
5. **Safety gate** — relevant high-risk scenarios behave correctly.
6. **Privacy gate** — storage matches user expectation.
7. **Accessibility gate** — flow is usable accessibly.
8. **Failure gate** — provider/network/AI failures degrade gracefully.
9. **Performance gate** — response and interaction are acceptable.
10. **Regression gate** — Scenario Bank passes.

---

## 36. Feature Definition of Done Example: Meal Photo Analysis

Meal Photo Analysis is complete only when:

- photo uploads safely
- food detection works to the accepted quality threshold
- user can correct foods
- portions can be corrected
- estimates use ranges
- assumptions are visible
- confidence is shown
- Improve Estimate works
- trusted data is used where available
- uncertainty propagates downstream
- nutrition benefits work
- GI handling is appropriate
- goal fit works
- Meal Rescue works
- scan can remain private
- save/delete works
- corrections invalidate stale downstream output
- provider/network failure is graceful
- manual/accessibility alternative exists
- security tests pass
- privacy tests pass
- Scenario Bank passes

---

## 37. Kefi V2 Definition of Done

Kefi V2 may be called complete when all of the following are true:

1. Major flagship workflows are connected into one coherent experience.
2. Users can move through **understand ↔ learn → plan → eat/act → observe → adapt → reflect** without re-entering relevant context unnecessarily.
3. Personalization materially changes recommendations and presentation where appropriate.
4. Hard constraints remain intact across features.
5. Kefi communicates uncertainty consistently and avoids false precision.
6. User corrections propagate across all dependent state and derived outputs.
7. Private Session demonstrably avoids persistent history, derived insights, automatic pantry changes, and cloud sync unless the user explicitly saves something.
8. Core non-AI workflows degrade gracefully during provider/network outages.
9. Accessibility requirements pass.
10. Security and privacy suites pass.
11. Safety Scenario Bank passes.
12. Deterministic calculations pass reference tests.
13. External facts carry appropriate provenance and freshness.
14. Performance is acceptable on realistic mobile hardware and networks.
15. Cost per successful workflow is measured and sustainable.
16. Backup, export, import validation, and deletion behavior work.
17. No-shame tone and product philosophy remain consistent across the system.
18. Production rollout has monitoring, feature flags, rollback/kill-switch capability, and tested backup restoration.

---

## 38. Implementation Rules

The implementation plan that follows this design must obey these rules:

1. **Inspect the existing V1 repository first.** Do not rewrite blindly.
2. **Preserve approved V1 behavior unless this spec intentionally supersedes it.**
3. **Implement by dependency and domain boundaries, not as one giant feature branch.**
4. **Use strict schemas at engine boundaries.**
5. **Write deterministic tests before or alongside deterministic implementation.**
6. **Build Scenario Bank coverage continuously rather than waiting for the end.**
7. **Keep provider-specific code behind adapters.**
8. **Treat AI output, user uploads, external content, and provider responses as untrusted until validated.**
9. **Never fabricate live data, scientific sources, user history, or confidence.**
10. **Every important production failure becomes a regression test.**
11. **Use feature flags for isolated high-risk or incomplete V2 capabilities rather than weakening the rest of the product.**
12. **Do not optimize for engagement at the expense of usefulness, autonomy, privacy, or safety.**

---

## 39. Final Product Definition

> **Kefi is an adaptive AI nutrition tutor and real-life food decision system that teaches users how nutrition works, helps them decide what to eat, buy, cook, modify, or order based on their actual circumstances, and adapts when those circumstances change—without judgment, false precision, unnecessary complexity, or loss of user control.**

Architecture:

> **One Kefi experience, many specialized engines, structured truth underneath, conversational intelligence on top.**

Implementation rule:

> **Build the foundation once, build each engine behind a contract, connect them through the Orchestrator, and prove every major workflow through realistic scenarios before calling it complete.**

---

## 40. Design Approval Record

The design decisions represented in this document were approved section-by-section in conversation before this written specification was produced. This document is the consolidation and normalization of those approved decisions for review prior to implementation planning.

No implementation should begin from this document until the user has reviewed this written specification and approved it as the authoritative Kefi V2 design.
