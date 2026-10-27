import { emptyPersonalization } from '../lib/personalization';
import { formatMinorAmount, normalizeProfile } from '../domain/profile';
import { t } from '../i18n';

// Maps the modular Kefi profile onto the unchanged V1 /api/chat personalization shape
// ({ goal, learningStyle, foodContext, otherContext }). Only tutor-relevant context is included:
// accessibility display settings, privacy choices, and onboarding state never leave the browser.

function joinParts(parts) {
  return parts.filter(Boolean).join(' ');
}

function listOf(restrictions, kind) {
  return restrictions.filter((item) => item.kind === kind).map((item) => item.label).join(', ');
}

export function describeRestrictions(restrictions = []) {
  const allergies = listOf(restrictions, 'allergy');
  const avoid = listOf(restrictions, 'avoid');
  const intolerances = listOf(restrictions, 'intolerance');
  const dislikes = listOf(restrictions, 'dislike');
  return joinParts([
    allergies && `ALLERGIES (hard constraint, must always avoid): ${allergies}.`,
    avoid && `Must avoid (religious, ethical, or personal): ${avoid}.`,
    intolerances && `Intolerances (limit or avoid depending on context): ${intolerances}.`,
    dislikes && `Dislikes (preference only): ${dislikes}.`
  ]);
}

export function toTutorPersonalization(value) {
  const profile = normalizeProfile(value);
  const lowEnergy = profile.presentation.lowEnergy;

  const goal = [
    ...profile.goals.intents.map((intent) => t(`intent.${intent}`)),
    profile.goals.custom
  ].filter(Boolean).join('; ');

  const styleParts = [];
  if (profile.learning.teachingStyle !== 'auto') styleParts.push(t(`style.${profile.learning.teachingStyle}`));
  if (lowEnergy) styleParts.push('short answers with one clear next step');
  else if (profile.learning.responseLength !== 'auto') styleParts.push(`${t(`length.${profile.learning.responseLength}`).toLowerCase()} responses`);
  const learningStyle = styleParts.join('; ');

  const foodContext = joinParts([
    describeRestrictions(profile.restrictions),
    profile.foodPreferences.enjoy && `Enjoys: ${profile.foodPreferences.enjoy}.`,
    profile.foodPreferences.notes && `Food notes: ${profile.foodPreferences.notes}.`,
    profile.cuisine.enjoyed && `Cuisines/dishes they enjoy: ${profile.cuisine.enjoyed}.`
  ]);

  const { cooking, budget, nutrition, locale, learning } = profile;
  const budgetAmount = budget.amountMinor !== null
    ? `${formatMinorAmount(budget.amountMinor)}${locale.currency ? ` ${locale.currency}` : ' (currency not specified)'} per ${budget.period}`
    : '';
  const otherContext = joinParts([
    cooking.skill && `Cooking comfort: ${t(`cooking.skill.${cooking.skill}`)}.`,
    cooking.time && `Usual meal time: ${t(`cooking.time.${cooking.time}`)}.`,
    cooking.equipment.length > 0 && `Equipment: ${cooking.equipment.map((item) => t(`equipment.${item}`)).join(', ')}.`,
    budget.mode && `Budget: ${budget.mode === 'strict' ? 'strict limit' : 'flexible guide'}${budgetAmount ? `, ${budgetAmount}` : ''}.`,
    nutrition.calorieInfo !== 'when-asked' && `Calorie/macro numbers: ${t(`nutrition.calorieInfo.${nutrition.calorieInfo}`).toLowerCase()}.`,
    learning.overwhelm && `When overwhelmed: ${t(`overwhelm.${learning.overwhelm}`).toLowerCase()}.`,
    locale.measurement && `Use ${locale.measurement} units.`,
    locale.energyUnit && `Express energy in ${locale.energyUnit}.`,
    lowEnergy && 'Detour Mode is on (they may be having a difficult day): keep choices and follow-up questions minimal, without reducing safety, accuracy, or constraint handling.'
  ]);

  return { ...emptyPersonalization(), goal, learningStyle, foodContext, otherContext };
}
