# Plan 03 Milestone 2: curated nutrition references v1.0.0

Five immutable, server-only entries cover blueberries, eggs, salmon, spinach, and plain dairy yogurt. Schema includes version, aliases, nutrient/compound names, scoped claims and claim-to-source links, editorial serving examples, allergen notes, evidence level, and provenance. No nutrient quantities, clinical outcome promises, or automatic retrieval are included.

## Source review (2026-11-07)

Manually checked authoritative resource content using browsing during implementation. Each entry stores source titles, HTTPS URLs, and review date. NIH ODS Vitamin K supports spinach/blueberry vitamin K and its normal functions; Choline consumer PDF supports eggs and cell/nervous-system roles; Omega-3 consumer guidance supports salmon/EPA/DHA and membrane function; Calcium consumer PDF supports yogurt and calcium roles. National Kidney Foundation's Blueberries supports fiber and vitamins C/K; Academy of Nutrition and Dietetics' What to Look for in Yogurt supports dairy yogurt protein/calcium/lactose. FDA Food Allergies: What You Need to Know supports egg/fish/milk allergen notes and cross-contact caution. Canonical choline/calcium HTML pages initially returned 403; the official consumer PDFs were successfully inspected instead and are the stored references.

Verified means the curator inspected the reference for these narrow composition/nutrient-role statements, not independent experimental verification, clinical review, or endorsement of every statement on the source page. No emerging food-specific clinical claims are included. Publication dates are not inferred; review timestamps are explicit. Serving ideas are editorial suggestions, not source-backed prescriptions. Exact nutrient quantities, specific probiotic effects, anthocyanin outcomes, and clinical endpoints remain out of scope pending further source review.

## Runtime and allergy boundaries

Only whole-name aliases in the latest user message select entries. Unknown foods add no curated evidence; historical messages and personalization do not trigger retrieval. This is simple deterministic mention matching, not intent understanding or a recommendation engine. Negated mentions can match; an educational match never certifies suitability.

Records pass schema/provenance validation before projection through the existing evidenceContext path. Draft/unverified records are excluded. Evidence remains server-owned; request-body claims cannot become curated references. Existing API shape, context allowlists, persistence, history and privacy behavior are unchanged. No application network retrieval occurs.

The legacy API encodes restrictions in free text, so reliable structured allergy resolution is unavailable here. If nonempty foodContext exists, all curated serving ideas are omitted conservatively; existing context and hard constraints still go to the tutor. All evidence carries a warning that matching never means allergy safety; empty allergen lists do not guarantee safety. Plain-yogurt refers to dairy only; plant-based/flavored products must not inherit its composition. No general safe-food claim is made. Prompt instructions remain guidance, not a deterministic response-safety guarantee.

Plan 02 release verification remains outstanding. No UI changes or paid calls are part of this milestone.
