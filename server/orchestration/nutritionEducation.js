const { knowledgeEvidence } = require('../knowledge/nutritionKnowledge');
const { tutorPersonalization, evidenceContext } = require('./tutoringFoundation');

const TOPICS = [
  ['food-benefits', /\b(benefits?|healthy|health|good for)\b/i],
  ['macronutrients', /\b(macros?|macronutrients?|proteins?|carbohydrates?|carbs?|fats?)\b/i],
  ['micronutrients', /\b(micros?|micronutrients?|vitamins?|minerals?|iron|calcium|potassium)\b/i],
  ['energy', /\b(calories?|energy|weight|deficit|surplus|metabolism)\b/i],
  ['balanced-meals', /\b(balanced?|plate|meals?)\b/i],
  ['serving-ideas', /\b(servings?|serve|portions?|recipes?|cook|ideas?|suggestions?)\b/i]
];
const DEPTH_GUIDANCE = {
  beginner: 'Use familiar words, define necessary terms, and give one manageable example or next step. Keep choices and follow-up questions minimal.',
  intermediate: 'Explain the main idea and why it matters with a practical example. Define technical terms and adapt step order to the existing teaching preference.',
  advanced: 'Explain mechanisms and important qualifications in accessible language. Distinguish nutrient function from food-specific clinical evidence; more detail never permits more certainty.'
};
const TOPIC_GUIDANCE = {
  'food-benefits': 'Explain only supported food composition and nutrient roles as catalog facts. Do not turn those roles into disease-prevention or treatment promises.',
  macronutrients: 'Explain macronutrient concepts in general educational terms. Do not invent grams, ratios, or food-specific nutrient profiles missing from the evidence.',
  micronutrients: 'Explain vitamin/mineral roles at the requested depth. Attribute a food-specific role only when the supplied evidence supports it.',
  energy: 'Explain calories and energy balance conceptually and acknowledge individual variation. Do not generate personal calorie targets, deficits, body estimates, weight-loss promises, or numerical food energy values from this catalog.',
  'balanced-meals': 'Offer a flexible meal-building framework as general education, not a prescribed plan. Respect culture, budget, preferences and all restrictions; do not require every meal to fit a rigid formula.',
  'serving-ideas': 'Present optional editorial serving examples separately from evidence-backed claims. Do not assume suitability, prescribe portions, or bypass a withheld serving suggestion.',
  general: 'Answer the educational question clearly, acknowledging missing evidence rather than inventing a food match or citation.'
};

function explanationDepth(personalization, action) {
  const style = (personalization.learningStyle || '').toLowerCase().split(';').map((part) => part.trim());
  // The existing adapter emits this exact phrase for Detour. Do not inspect medical/free-text context.
  if (style.includes('short answers with one clear next step')) return 'beginner';
  if (action === 'simplify') return 'beginner';
  if (action === 'expand') return 'advanced';
  if (style.some((part) => ['simple', 'short', 'short responses', 'just decide for me'].includes(part))) return 'beginner';
  if (style.some((part) => ['detailed', 'detailed responses'].includes(part))) return 'advanced';
  return 'intermediate';
}

// Internal plan only: no new API/profile fields, raw user context, logging or persistence.
function createEducationPlan({ question, personalization, action, evidence = [] } = {}) {
  const safe = tutorPersonalization(personalization);
  const text = typeof question === 'string' ? question : '';
  const topics = TOPICS.filter(([, pattern]) => pattern.test(text)).map(([name]) => name);
  return {
    depth: explanationDepth(safe, action),
    topics: topics.length ? topics : ['general'],
    evidence: evidenceContext([...evidenceContext(evidence), ...knowledgeEvidence(text, safe)])
  };
}
function educationInstructions(plan) {
  return `

NUTRITION EDUCATION PLAN
EXPLANATION DEPTH: ${plan.depth}
${DEPTH_GUIDANCE[plan.depth]}
${plan.topics.map((topic) => `- ${TOPIC_GUIDANCE[topic]}`).join('\n')}
- General education is not verified catalog evidence. Make that distinction clear when relevant; only attribute claims and source references actually supported by the supplied record. Do not imply a fresh search.
- Do not invent nutrient quantities, citations, clinical findings or personalized recommendations. Unknown foods may receive clearly qualified general education, never a fabricated catalog profile.
- Never treat a catalog match as allergy safety. Preserve the existing hard constraints, preparation caveats and withheld serving ideas, including during rewrites. If suitability is uncertain, explain that and ask only a necessary question rather than selecting a food for the user.
- Be encouraging and non-shaming; avoid moral labels for foods, weight pressure and rigid rules. Offer choices, not commands. Be transparent about uncertainty.
- State educational/medical limits when the question concerns diagnosis, medication or treatment; do not add alarmist boilerplate to routine food questions. Evidence and safety boundaries remain identical at every depth.`;
}
module.exports = { createEducationPlan, educationInstructions };
