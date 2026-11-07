const { makeProvenance } = require('../domain/provenance');

const { sources: expandedSources, definitions: expandedDefinitions } = require('./expandedFoods');
const VERSION = '1.1.0';
const REVIEWED_AT = '2026-11-07';
const SOURCES = {
  ...expandedSources,
  vitaminK: { title: 'NIH ODS: Vitamin K, Consumer', url: 'https://ods.od.nih.gov/factsheets/VitaminK-Consumer/' },
  choline: { title: 'NIH ODS: Choline, Consumer', url: 'https://ods.od.nih.gov/pdf/factsheets/Choline-Consumer.pdf' },
  omega3: { title: 'NIH ODS: Omega-3 Fatty Acids, Consumer', url: 'https://ods.od.nih.gov/factsheets/Omega3FattyAcids-Consumer/' },
  calcium: { title: 'NIH ODS: Calcium, Consumer', url: 'https://ods.od.nih.gov/pdf/factsheets/Calcium-Consumer.pdf' },
  blueberries: { title: 'National Kidney Foundation: Blueberries', url: 'https://www.kidney.org/kidney-topics/blueberries' },
  yogurt: { title: 'Academy of Nutrition and Dietetics: What to Look for in Yogurt', url: 'https://www.eatright.org/food/food-groups/dairy-and-alternatives/what-to-look-for-in-yogurt' },
  allergens: { title: 'FDA: Food Allergies, What You Need to Know', url: 'https://www.fda.gov/food/buy-store-serve-safe-food/food-allergies-what-you-need-know' }
};
const definitions = [
  ['blueberries', ['blueberry', 'blueberries'], ['fiber', 'vitamin C', 'vitamin K'],
    'Blueberries contain fiber and vitamins C and K. Vitamin K contributes to normal blood clotting; this nutrient role is not a promise that blueberries prevent disease.', ['blueberries', 'vitaminK'],
    ['Add rinsed berries to oatmeal.', 'Try fresh or frozen berries as part of a meal.'], []],
  ['eggs', ['egg', 'eggs'], ['choline'],
    'Eggs supply choline, which the body uses in cell membranes and nervous-system function. This does not establish that eating eggs improves memory.', ['choline'],
    ['Add a fully cooked egg to a meal.', 'Try a fully cooked egg with vegetables you enjoy.'], ['egg']],
  ['salmon', ['salmon'], ['EPA', 'DHA omega-3 fatty acids'],
    'Salmon supplies EPA and DHA. Omega-3 fats are components of cell membranes. Nutrient function does not establish that a serving treats a heart condition.', ['omega3'],
    ['Serve cooked salmon with vegetables.', 'Flake cooked salmon into a grain bowl.'], ['fish']],
  ['spinach', ['spinach'], ['vitamin K'],
    'Spinach provides vitamin K, which contributes to normal clotting and bone function. People taking warfarin should discuss consistent vitamin K intake with their care team rather than changing medication or eliminating vegetables on their own.', ['vitaminK'],
    ['Stir spinach into soup.', 'Add cooked spinach to a meal you enjoy.'], []],
  ['plain-yogurt', ['plain yogurt', 'plain yoghurt'], ['calcium', 'protein', 'lactose'],
    'Plain dairy yogurt supplies calcium and protein. Calcium has roles in bone structure, muscle movement, and nerve signaling. Amounts vary by product; this does not establish a disease-prevention effect. Plant-based products are outside this entry.', ['calcium', 'yogurt'],
    ['Use plain dairy yogurt as a dip base.', 'Pair plain dairy yogurt with fruit if suitable for your restrictions.'], ['milk']]
];
function deepFreeze(value) {
  if (value && typeof value === 'object') { Object.values(value).forEach(deepFreeze); Object.freeze(value); }
  return value;
}
const entries = deepFreeze([...definitions, ...expandedDefinitions].map(([id, aliases, nutrients, explanation, sourceIds, servingIdeas, allergens, version = '1.0.0']) => ({
  id, version, status: 'verified', aliases, nutrients,
  claims: [{ text: explanation, sourceIds }], servingIdeas, allergens,
  allergenNotes: version === '1.0.0' ? 'Check ingredients and cross-contact. An empty allergen list is not an allergy-safety guarantee. Lactose intolerance and milk allergy are different.' : 'Ingredients, coatings, sauces, fortification and preparation vary. Individual allergies can occur to foods outside major-allergen lists; oats may have gluten cross-contact and chickpea dishes may contain sesame. Check ingredients and cross-contact. An empty allergen list is not an allergy-safety guarantee. Lactose intolerance and milk allergy are different.',
  evidenceStrength: 'established',
  scope: 'Food composition and normal nutrient roles; not a clinical outcome or personalized treatment claim.',
  sources: [...new Set([...sourceIds, 'allergens'])].map((key) => ({ id: key, ...SOURCES[key], reviewedAt: REVIEWED_AT, verificationStatus: 'verified' })),
  provenance: makeProvenance({ sourceType: 'curated-nutrition-reference', provider: 'Kefi editorial curation', sourceId: `kefi-food:${id}@${version}`, retrievedAt: REVIEWED_AT, verificationStatus: 'verified' })
})));

function validEntry(entry) {
  try {
    const p = makeProvenance(entry.provenance);
    const texts = (values) => Array.isArray(values) && values.length > 0 && values.every((v) => typeof v === 'string' && v.trim());
    return entry.status === 'verified' && /^\d+\.\d+\.\d+$/.test(entry.version) &&
      typeof entry.id === 'string' && entry.id.length > 0 && texts(entry.aliases) && texts(entry.nutrients) && texts(entry.servingIdeas) &&
      Array.isArray(entry.allergens) && entry.allergens.every((v) => typeof v === 'string') &&
      typeof entry.allergenNotes === 'string' && typeof entry.scope === 'string' &&
      ['established', 'emerging'].includes(entry.evidenceStrength) && p.verificationStatus === 'verified' && !!p.sourceId && Number.isFinite(Date.parse(p.retrievedAt)) &&
      Array.isArray(entry.sources) && entry.sources.length > 0 && entry.sources.every((s) => s.id && s.title && s.verificationStatus === 'verified' && Number.isFinite(Date.parse(s.reviewedAt)) && new URL(s.url).protocol === 'https:') &&
      Array.isArray(entry.claims) && entry.claims.length > 0 && entry.claims.every((c) => typeof c.text === 'string' && c.text.trim() && texts(c.sourceIds) && c.sourceIds.every((id) => entry.sources.some((s) => s.id === id)));
  } catch (_) { return false; }
}
function matchFoods(text) {
  if (typeof text !== 'string') return [];
  const normalized = ` ${text.toLowerCase().replace(/[^a-z]+/g, ' ')} `;
  // Remove plant/human milk phrases only for dairy matching; never infer fortification.
  const dairyText = normalized.replace(/\b(?:soy|soya|almond|oat|coconut|rice|cashew|hemp|pea|breast|human) milk\b/g, ' ');
  return entries.filter((entry) => validEntry(entry) && entry.aliases.some((alias) =>
    (entry.id === 'milk' ? dairyText : normalized).includes(` ${alias} `)));
}
function knowledgeEvidence(text, personalization = {}) {
  return matchFoods(text).map((entry) => ({
    level: entry.evidenceStrength, provenance: entry.provenance,
    summary: JSON.stringify({ ...entry,
      servingIdeas: personalization.foodContext ? [] : entry.servingIdeas,
      allergyBoundary: 'Educational reference only: matching does not mean this food is safe for the user. Do not recommend it against allergies or restrictions. Serving ideas are optional editorial examples, not prescribed portions.'
    })
  }));
}
module.exports = { VERSION, entries, validEntry, matchFoods, knowledgeEvidence };
