import { useEffect, useState } from 'react';
import { ChoiceGroup, MultiChoiceGroup, RestrictionEditor, SelectField, TextField } from './fields';
import {
  BUDGET_MODES,
  BUDGET_PERIODS,
  CALORIE_INFO,
  COOKING_SKILLS,
  COOKING_TIMES,
  CURRENCIES,
  DATE_FORMATS,
  ENERGY_UNITS,
  EQUIPMENT,
  INTENTS,
  LANGUAGES,
  MEASUREMENT_SYSTEMS,
  MOTION,
  OVERWHELM_PREFERENCES,
  PROFILE_SECTIONS,
  REGIONS,
  RESPONSE_LENGTHS,
  TEACHING_STYLES,
  TEXT_SIZES,
  THEMES,
  formatMinorAmount,
  normalizeProfile,
  parseAmountToMinor
} from '../domain/profile';
import { t } from '../i18n';

const unset = (prefix) => (o) => (o ? t(`${prefix}.${o}`) : t('locale.unset'));

const SECTION_DOMAINS = {
  goals: ['goals'],
  food: ['foodPreferences'],
  restrictions: ['restrictions'],
  cuisine: ['cuisine'],
  cooking: ['cooking'],
  budget: ['budget'],
  nutrition: ['nutrition'],
  accessibility: ['accessibility'],
  locale: ['locale']
};

// Copies only the fields a section edits onto the latest profile, so a save never reverts
// changes made elsewhere (for example Low-Energy Mode toggled from the header) while it was open.
export function applySection(section, latest, draft) {
  if (section === 'teaching') {
    return { ...latest, learning: { ...latest.learning, teachingStyle: draft.learning.teachingStyle, overwhelm: draft.learning.overwhelm } };
  }
  if (section === 'length') {
    return { ...latest, learning: { ...latest.learning, responseLength: draft.learning.responseLength } };
  }
  const domains = SECTION_DOMAINS[section] || [];
  return domains.reduce((acc, domain) => ({ ...acc, [domain]: draft[domain] }), latest);
}

function SectionFields({ section, draft, setDraft, budgetText, setBudgetText, budgetError }) {
  const set = (domain, value) => setDraft((d) => ({ ...d, [domain]: { ...d[domain], ...value } }));

  switch (section) {
    case 'goals':
      return (
        <>
          <p className="field-hint">{t('me.goalsNote')}</p>
          <MultiChoiceGroup legend={t('me.section.goals')} options={INTENTS} values={draft.goals.intents} onChange={(intents) => set('goals', { intents })} labelFor={(o) => t(`intent.${o}`)} />
          <TextField label={t('intent.custom')} value={draft.goals.custom} onChange={(custom) => set('goals', { custom })} />
        </>
      );
    case 'food':
      return (
        <>
          <TextField label={t('food.enjoy')} value={draft.foodPreferences.enjoy} onChange={(enjoy) => set('foodPreferences', { enjoy })} multiline />
          <TextField label={t('food.notes')} value={draft.foodPreferences.notes} onChange={(notes) => set('foodPreferences', { notes })} multiline />
        </>
      );
    case 'restrictions':
      return <RestrictionEditor restrictions={draft.restrictions} onChange={(restrictions) => setDraft((d) => ({ ...d, restrictions }))} />;
    case 'cuisine':
      return <TextField label={t('cuisine.enjoyed')} hint={t('cuisine.hint')} value={draft.cuisine.enjoyed} onChange={(enjoyed) => set('cuisine', { enjoyed })} multiline />;
    case 'cooking':
      return (
        <>
          <SelectField label={t('cooking.skill')} value={draft.cooking.skill} options={COOKING_SKILLS} onChange={(skill) => set('cooking', { skill })} labelFor={(o) => t(`cooking.skill.${o || 'unset'}`)} />
          <SelectField label={t('cooking.time')} value={draft.cooking.time} options={COOKING_TIMES} onChange={(time) => set('cooking', { time })} labelFor={(o) => t(`cooking.time.${o || 'unset'}`)} />
          <MultiChoiceGroup legend={t('cooking.equipment')} options={EQUIPMENT} values={draft.cooking.equipment} onChange={(equipment) => set('cooking', { equipment })} labelFor={(o) => t(`equipment.${o}`)} />
        </>
      );
    case 'budget':
      return (
        <>
          <ChoiceGroup legend={t('budget.mode')} name="budgetMode" options={BUDGET_MODES} value={draft.budget.mode} onChange={(mode) => set('budget', { mode })} labelFor={(o) => t(`budget.mode.${o || 'unset'}`)} />
          <TextField
            label={t('budget.amount')}
            value={budgetText}
            onChange={setBudgetText}
            inputMode="decimal"
            error={budgetError}
            hint={draft.locale.currency ? t('budget.currencyHint', { currency: draft.locale.currency }) : t('budget.currencyUnset')}
          />
          <SelectField label={t('budget.period')} value={draft.budget.period} options={BUDGET_PERIODS} onChange={(period) => set('budget', { period })} labelFor={(o) => t(`budget.period.${o}`)} />
        </>
      );
    case 'teaching':
      return (
        <>
          <ChoiceGroup legend={t('me.section.teaching')} name="teachingStyle" options={TEACHING_STYLES} value={draft.learning.teachingStyle} onChange={(teachingStyle) => set('learning', { teachingStyle })} labelFor={(o) => t(`style.${o}`)} />
          <SelectField label={t('overwhelm.label')} value={draft.learning.overwhelm} options={OVERWHELM_PREFERENCES} onChange={(overwhelm) => set('learning', { overwhelm })} labelFor={(o) => t(`overwhelm.${o || 'unset'}`)} />
        </>
      );
    case 'length':
      return <ChoiceGroup legend={t('me.section.length')} name="responseLength" options={RESPONSE_LENGTHS} value={draft.learning.responseLength} onChange={(responseLength) => set('learning', { responseLength })} labelFor={(o) => t(`length.${o}`)} />;
    case 'nutrition':
      return (
        <>
          <ChoiceGroup legend={t('nutrition.calorieInfo')} name="calorieInfo" options={CALORIE_INFO} value={draft.nutrition.calorieInfo} onChange={(calorieInfo) => set('nutrition', { calorieInfo })} labelFor={(o) => t(`nutrition.calorieInfo.${o}`)} />
          <p className="field-hint">{t('nutrition.estimateBoundary')}</p>
        </>
      );
    case 'accessibility':
      return (
        <>
          <ChoiceGroup legend={t('a11y.textSize')} name="textSize" options={TEXT_SIZES} value={draft.accessibility.textSize} onChange={(textSize) => set('accessibility', { textSize })} labelFor={(o) => t(`a11y.textSize.${o}`)} />
          <ChoiceGroup legend={t('a11y.motion')} name="motion" options={MOTION} value={draft.accessibility.motion} onChange={(motion) => set('accessibility', { motion })} labelFor={(o) => t(`a11y.motion.${o}`)} />
          <ChoiceGroup legend={t('a11y.theme')} name="theme" options={THEMES} value={draft.accessibility.theme} onChange={(theme) => set('accessibility', { theme })} labelFor={(o) => t(`a11y.theme.${o}`)} />
        </>
      );
    case 'locale':
      return (
        <>
          <p className="field-hint">{t('locale.intro')}</p>
          <SelectField label={t('locale.language')} value={draft.locale.language} options={LANGUAGES} onChange={(language) => set('locale', { language })} labelFor={unset('locale.language')} />
          <SelectField label={t('locale.region')} value={draft.locale.region} options={REGIONS} onChange={(region) => set('locale', { region })} labelFor={unset('locale.region')} />
          <SelectField label={t('locale.measurement')} value={draft.locale.measurement} options={MEASUREMENT_SYSTEMS} onChange={(measurement) => set('locale', { measurement })} labelFor={unset('locale.measurement')} />
          <SelectField label={t('locale.currency')} value={draft.locale.currency} options={CURRENCIES} onChange={(currency) => set('locale', { currency })} labelFor={(o) => o || t('locale.unset')} />
          <SelectField label={t('locale.dateFormat')} value={draft.locale.dateFormat} options={DATE_FORMATS} onChange={(dateFormat) => set('locale', { dateFormat })} labelFor={unset('locale.dateFormat')} />
          <SelectField label={t('locale.energyUnit')} value={draft.locale.energyUnit} options={ENERGY_UNITS} onChange={(energyUnit) => set('locale', { energyUnit })} labelFor={unset('locale.energyUnit')} />
        </>
      );
    default:
      return null;
  }
}

function SectionEditor({ section, profile, onSave, onBack }) {
  const [draft, setDraft] = useState(profile);
  const [budgetText, setBudgetText] = useState(formatMinorAmount(profile.budget.amountMinor));
  const [budgetError, setBudgetError] = useState('');
  const [status, setStatus] = useState('');

  const save = () => {
    let next = draft;
    if (section === 'budget') {
      const parsed = parseAmountToMinor(budgetText);
      if (!parsed.ok) {
        setBudgetError(t('budget.amountInvalid'));
        return;
      }
      setBudgetError('');
      next = { ...draft, budget: { ...draft.budget, amountMinor: parsed.value } };
    }
    onSave(normalizeProfile(applySection(section, profile, next)));
    setStatus(t('me.saved'));
  };

  return (
    <>
      <button type="button" className="back-link" onClick={onBack}>← {t('me.back')}</button>
      <h1 id="me-title" tabIndex={-1}>{t(`me.section.${section}`)}</h1>
      <SectionFields
        section={section}
        draft={draft}
        setDraft={(update) => { setStatus(''); setDraft(update); }}
        budgetText={budgetText}
        setBudgetText={(value) => { setStatus(''); setBudgetText(value); }}
        budgetError={budgetError}
      />
      <div className="me-actions">
        <button type="button" className="primary-button" onClick={save}>{t('me.save')}</button>
        <button type="button" className="secondary-button" onClick={onBack}>{t('me.cancel')}</button>
      </div>
      <p role="status" className="save-status">{status}</p>
    </>
  );
}

function PrivacySection({ profile, savedCount, onSave, onClear, onViewSaved, onBack }) {
  const [status, setStatus] = useState('');
  const remember = profile.privacy.rememberOnDevice;
  return (
    <>
      <button type="button" className="back-link" onClick={onBack}>← {t('me.back')}</button>
      <h1 id="me-title" tabIndex={-1}>{t('privacy.title')}</h1>
      <label className="toggle-row">
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => { setStatus(''); onSave({ ...profile, privacy: { rememberOnDevice: e.target.checked } }); }}
        />
        <span>{t('privacy.remember')}</span>
      </label>
      <p className="field-hint">{remember ? t('privacy.rememberOn') : t('privacy.rememberOff')}</p>

      <p>{t('privacy.conversations', { count: savedCount })}</p>
      <button type="button" className="secondary-button" onClick={onViewSaved}>{t('privacy.viewConversations')}</button>

      <div className="me-actions">
        <button
          type="button"
          className="danger-button"
          onClick={() => {
            if (window.confirm(t('privacy.clearConfirm'))) {
              onClear();
              setStatus(t('privacy.cleared'));
            }
          }}
        >
          {t('privacy.clear')}
        </button>
      </div>
      <p role="status" className="save-status">{status}</p>
      <p className="muted small-print">{t('privacy.aiNote')}</p>
      <p className="muted small-print">{t('privacy.educational')}</p>
    </>
  );
}

export default function MeScreen({ profile, section, onSection, onSave, onClear, savedCount, onViewSaved }) {
  useEffect(() => {
    document.getElementById('me-title')?.focus();
  }, [section]);

  return (
    <section className="kefi-screen me-screen" aria-labelledby="me-title">
      {!section && (
        <>
          <h1 id="me-title" tabIndex={-1}>{t('me.title')}</h1>
          <p className="muted">{t('me.intro')}</p>
          <ul className="me-sections">
            {PROFILE_SECTIONS.map((key) => (
              <li key={key}>
                <button type="button" className="me-section-button" onClick={() => onSection(key)}>
                  <span>{t(`me.section.${key}`)}</span>
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {section === 'privacy' && (
        <PrivacySection profile={profile} savedCount={savedCount} onSave={onSave} onClear={onClear} onViewSaved={onViewSaved} onBack={() => onSection(null)} />
      )}
      {section && section !== 'privacy' && (
        <SectionEditor key={section} section={section} profile={profile} onSave={onSave} onBack={() => onSection(null)} />
      )}
    </section>
  );
}
