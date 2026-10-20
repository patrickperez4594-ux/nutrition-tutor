// Modular Kefi profile (spec §8.1). Each top-level key is an independently editable domain.
// '' means "not set"; nothing here is required for Kefi to work.

export const PROFILE_VERSION = 1;
const MAX_TEXT = 300;

export const INTENTS = Object.freeze(['eat-better', 'protein', 'calories', 'budget', 'easy-meals', 'learn', 'decide', 'fitness', 'not-sure']);
export const TEACHING_STYLES = Object.freeze(['short', 'step-by-step', 'why', 'detailed', 'decide', 'auto']);
export const RESPONSE_LENGTHS = Object.freeze(['auto', 'short', 'standard', 'detailed']);
export const OVERWHELM_PREFERENCES = Object.freeze(['', 'one-pick', 'few-options']);
export const COOKING_SKILLS = Object.freeze(['', 'none', 'beginner', 'comfortable', 'confident']);
export const COOKING_TIMES = Object.freeze(['', '10', '30', '60']);
export const EQUIPMENT = Object.freeze(['stovetop', 'oven', 'microwave', 'air-fryer', 'slow-cooker', 'blender', 'rice-cooker', 'kettle']);
export const BUDGET_MODES = Object.freeze(['', 'flexible', 'strict']);
export const BUDGET_PERIODS = Object.freeze(['week', 'month']);
export const CALORIE_INFO = Object.freeze(['when-asked', 'show', 'hide']);
export const TEXT_SIZES = Object.freeze(['default', 'large', 'larger']);
export const MOTION = Object.freeze(['system', 'reduce']);
export const THEMES = Object.freeze(['system', 'light', 'dark']);
export const LANGUAGES = Object.freeze(['en']);
export const REGIONS = Object.freeze(['', 'US', 'CA', 'MX', 'GB', 'IE', 'BR', 'AU', 'OTHER']);
export const MEASUREMENT_SYSTEMS = Object.freeze(['', 'metric', 'imperial']);
// All listed currencies use two minor-unit digits; add digit metadata before listing e.g. JPY.
export const CURRENCIES = Object.freeze(['', 'USD', 'CAD', 'MXN', 'GBP', 'EUR', 'BRL', 'AUD']);
export const DATE_FORMATS = Object.freeze(['', 'MDY', 'DMY', 'YMD']);
export const ENERGY_UNITS = Object.freeze(['', 'kcal', 'kJ']);

// allergy is a hard constraint; intolerance is context-sensitive; avoid is a firm personal/religious/ethical
// restriction; dislike is a preference (spec §8.3).
export const RESTRICTION_KINDS = Object.freeze(['allergy', 'intolerance', 'avoid', 'dislike']);
const HARD_RESTRICTION_KINDS = new Set(['allergy', 'avoid']);

export const PROFILE_SECTIONS = Object.freeze([
  'goals', 'food', 'restrictions', 'cuisine', 'cooking', 'budget', 'teaching',
  'length', 'nutrition', 'accessibility', 'locale', 'privacy'
]);

export function createEmptyProfile() {
  return {
    version: PROFILE_VERSION,
    goals: { intents: [], custom: '' },
    foodPreferences: { enjoy: '', notes: '' },
    restrictions: [],
    cuisine: { enjoyed: '' },
    cooking: { skill: '', time: '', equipment: [] },
    budget: { mode: '', amountMinor: null, period: 'week' },
    learning: { teachingStyle: 'auto', responseLength: 'auto', overwhelm: '' },
    nutrition: { calorieInfo: 'when-asked' },
    accessibility: { textSize: 'default', motion: 'system', theme: 'system' },
    locale: { language: 'en', region: '', measurement: '', currency: '', dateFormat: '', energyUnit: '' },
    presentation: { lowEnergy: false },
    privacy: { rememberOnDevice: false },
    onboarding: { completed: false }
  };
}

function text(value) {
  return String(value ?? '').trim().slice(0, MAX_TEXT);
}

function oneOf(allowed, value, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function subsetOf(allowed, values) {
  if (!Array.isArray(values)) return [];
  return allowed.filter((item) => values.includes(item));
}

function makeRestrictionId() {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Restrictions are never dropped because of a malformed kind: an unrecognized kind is treated as an
// allergy, the most protective interpretation. Only entries without any label are removed.
export function normalizeRestriction(value) {
  if (!value || typeof value !== 'object') return null;
  const label = text(value.label);
  if (!label) return null;
  const kind = String(value.kind || '').trim().toLowerCase();
  return {
    id: text(value.id) || makeRestrictionId(),
    label,
    kind: RESTRICTION_KINDS.includes(kind) ? kind : 'allergy'
  };
}

export function normalizeAmountMinor(value) {
  if (value === null || value === undefined || value === '') return null;
  return Number.isSafeInteger(value) && value >= 0 ? value : null;
}

// Converts a user-typed decimal amount ("60", "60.5", "60.50") to integer minor units without floats.
export function parseAmountToMinor(input) {
  const clean = String(input ?? '').trim();
  if (!clean) return { ok: true, value: null };
  const match = /^(\d{1,7})(?:\.(\d{1,2}))?$/.exec(clean);
  if (!match) return { ok: false, value: null };
  const cents = (match[2] || '').padEnd(2, '0');
  return { ok: true, value: Number(match[1]) * 100 + Number(cents) };
}

export function formatMinorAmount(amountMinor) {
  if (amountMinor === null || amountMinor === undefined) return '';
  const whole = Math.floor(amountMinor / 100);
  const cents = String(amountMinor % 100).padStart(2, '0');
  return cents === '00' ? String(whole) : `${whole}.${cents}`;
}

export function normalizeProfile(value = {}) {
  const base = createEmptyProfile();
  const v = value && typeof value === 'object' ? value : {};
  const restrictions = (Array.isArray(v.restrictions) ? v.restrictions : [])
    .map(normalizeRestriction)
    .filter(Boolean);

  return {
    version: PROFILE_VERSION,
    goals: {
      intents: subsetOf(INTENTS, v.goals?.intents),
      custom: text(v.goals?.custom)
    },
    foodPreferences: {
      enjoy: text(v.foodPreferences?.enjoy),
      notes: text(v.foodPreferences?.notes)
    },
    restrictions,
    cuisine: { enjoyed: text(v.cuisine?.enjoyed) },
    cooking: {
      skill: oneOf(COOKING_SKILLS, v.cooking?.skill, ''),
      time: oneOf(COOKING_TIMES, v.cooking?.time, ''),
      equipment: subsetOf(EQUIPMENT, v.cooking?.equipment)
    },
    budget: {
      mode: oneOf(BUDGET_MODES, v.budget?.mode, ''),
      amountMinor: normalizeAmountMinor(v.budget?.amountMinor),
      period: oneOf(BUDGET_PERIODS, v.budget?.period, base.budget.period)
    },
    learning: {
      teachingStyle: oneOf(TEACHING_STYLES, v.learning?.teachingStyle, base.learning.teachingStyle),
      responseLength: oneOf(RESPONSE_LENGTHS, v.learning?.responseLength, base.learning.responseLength),
      overwhelm: oneOf(OVERWHELM_PREFERENCES, v.learning?.overwhelm, '')
    },
    nutrition: {
      calorieInfo: oneOf(CALORIE_INFO, v.nutrition?.calorieInfo, base.nutrition.calorieInfo)
    },
    accessibility: {
      textSize: oneOf(TEXT_SIZES, v.accessibility?.textSize, base.accessibility.textSize),
      motion: oneOf(MOTION, v.accessibility?.motion, base.accessibility.motion),
      theme: oneOf(THEMES, v.accessibility?.theme, base.accessibility.theme)
    },
    locale: {
      language: oneOf(LANGUAGES, v.locale?.language, base.locale.language),
      region: oneOf(REGIONS, v.locale?.region, ''),
      measurement: oneOf(MEASUREMENT_SYSTEMS, v.locale?.measurement, ''),
      currency: oneOf(CURRENCIES, v.locale?.currency, ''),
      dateFormat: oneOf(DATE_FORMATS, v.locale?.dateFormat, ''),
      energyUnit: oneOf(ENERGY_UNITS, v.locale?.energyUnit, '')
    },
    presentation: { lowEnergy: v.presentation?.lowEnergy === true },
    privacy: { rememberOnDevice: v.privacy?.rememberOnDevice === true },
    onboarding: { completed: v.onboarding?.completed === true }
  };
}

// Replaces one profile domain and re-normalizes. Other domains are untouched.
export function updateProfileDomain(profile, domain, value) {
  if (!Object.prototype.hasOwnProperty.call(createEmptyProfile(), domain) || domain === 'version') {
    throw new Error(`Unknown profile domain: ${domain}`);
  }
  return normalizeProfile({ ...profile, [domain]: value });
}

export function hardConstraints(profile) {
  return (profile?.restrictions || []).filter((item) => HARD_RESTRICTION_KINDS.has(item.kind));
}

export function isRestrictionHard(kind) {
  return HARD_RESTRICTION_KINDS.has(kind);
}

// Clearing personalization keeps only the user's privacy choice so a "remember" opt-in is not
// silently re-enabled or forgotten; everything else returns to defaults.
export function clearPersonalization(profile) {
  const empty = createEmptyProfile();
  return { ...empty, privacy: { ...normalizeProfile(profile).privacy }, onboarding: { completed: true } };
}
