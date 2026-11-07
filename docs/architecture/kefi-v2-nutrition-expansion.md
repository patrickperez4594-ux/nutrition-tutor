# Plan 03 Milestone 3: nutrition expansion (catalog 1.1.0)

Adds twenty entries in `server/knowledge/expandedFoods.js`. The existing five serialized records, their source metadata and version 1.0.0 are preserved; new records use version 1.1.0. The tuple schema, provenance validator, server-only projection and API are unchanged. No UI, persistence, external retrieval, or provider configuration changes.

## Source review, 2026-11-07

Each entry stores traceable reference titles and URLs, claim-to-source IDs, editorial review date and provenance. Verified means manual source-content review for narrow composition/normal-function claims, not a systematic evidence grading, clinical endorsement, or validation of model-generated answers. Established applies only to those nutrient functions; no emerging clinical findings, numerical nutrient estimates or disease-prevention outcomes were added. Practical serving ideas are editorial options, not therapeutic prescriptions.

| Foods | Reviewed support |
| --- | --- |
| Strawberries, oranges, broccoli | MedlinePlus Vitamin C: named foods, collagen formation, iron absorption; broccoli also NIH ODS Vitamin K |
| Bananas | NIH ODS Potassium consumer PDF: food list and muscle/nerve roles; MedlinePlus High-fiber foods |
| Apples | MedlinePlus High-fiber foods and FDA Dietary Fiber: whole-fruit composition and regularity |
| Carrots, sweet potatoes | NIH ODS Vitamin A consumer: food list, carotenoids and normal vitamin A roles; sweet potato statement limited to orange flesh |
| Kale | NIH ODS Vitamin K: named food, clotting role, consistent intake with warfarin |
| Chicken breast, turkey breast, tuna | NIH ODS Selenium professional: light poultry/boneless turkey and cooked yellowfin examples, normal thyroid metabolism. General food identity is used without nutrient amounts; no claim all cuts/species have equal composition |
| Lean beef | NIH ODS Iron consumer: lean meats, iron and oxygen transport |
| Milk | Existing NIH ODS Calcium consumer PDF |
| Cottage cheese | Academy of Nutrition and Dietetics cottage-cheese guidance; NIH ODS Calcium professional table and consumer functions |
| Fortified soy milk | NIH ODS Calcium professional table explicitly lists calcium-fortified soymilk; consumer calcium functions. No assumed vitamin D fortification |
| Oats, brown rice, quinoa | FDA Dietary Fiber explicitly names whole oats/brown rice/quinoa and describes regularity |
| Lentils | MedlinePlus beans/legumes and NIH ODS Iron consumer |
| Chickpeas | MedlinePlus beans/legumes explicitly identifies garbanzo/chickpeas and supports plant protein/fiber and regularity |

FDA/EPA fish advice supports the tuna species/mercury caveat; no universal safe intake is stated. Existing FDA allergen reference supplies the major-allergen framework; food labels, individual allergies and preparation always matter. Empty lists never establish allergy safety. Oat cross-contact and sesame in chickpea recipes are cautions, not claims these plain ingredients intrinsically contain those allergens.

Some MyPlate and NIH Vitamin C pages returned access errors; these are not recorded as verified sources. Accessible MedlinePlus/FDA references and official NIH PDFs were used instead. No FoodData Central numeric record IDs are invented. Future work can add individually verified nutrient amounts, protein profiles and compounds, but those are outside this narrow catalog.

## Matching and safety limits

Whole-word aliases are deterministic mention matching, not semantic food identification. New dairy milk matching excludes common plant/human milk phrases so soy milk does not imply dairy, and plain soy milk does not imply fortification. This is a conservative lexical guard, not complete product recognition. Mentions inside negation or compound dishes can still match. Serving suggestions remain omitted whenever nonempty foodContext exists. Existing allergy instructions and user constraints remain; matching is never permission to recommend a food.

All records include preparation/ingredient variability notes and scope limits. Draft/incomplete/unverified records are excluded by existing validation. Tests check structure, aliases, version/provenance, source linkage/status, milk ambiguity, major allergens and unknown foods. They cannot establish scientific truth, clinical safety or live-model adherence. Plan 02 release verification remains outstanding.
