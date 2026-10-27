import { useEffect, useRef, useState } from 'react';
import KefiMark from './KefiMark';
import {
  ChoiceGroup,
  EMPTY_PENDING_RESTRICTION,
  MultiChoiceGroup,
  RestrictionEditor,
  SelectField,
  TextField,
  resolvePendingRestriction
} from './fields';
import {
  BUDGET_MODES,
  COOKING_SKILLS,
  INTENTS,
  OVERWHELM_PREFERENCES,
  TEACHING_STYLES,
  createEmptyProfile,
  normalizeProfile
} from '../domain/profile';
import { t } from '../i18n';

const STEPS = ['intents', 'style', 'context', 'remember'];

// Resets only the domains a step owns, so "Skip" never leaves half-entered answers behind.
function skipStep(step, draft) {
  const empty = createEmptyProfile();
  if (step === 'intents') return { ...draft, goals: empty.goals };
  if (step === 'style') return { ...draft, learning: { ...draft.learning, teachingStyle: empty.learning.teachingStyle } };
  if (step === 'context') {
    return {
      ...draft,
      restrictions: [],
      foodPreferences: empty.foodPreferences,
      cuisine: empty.cuisine,
      cooking: empty.cooking,
      budget: empty.budget,
      learning: { ...draft.learning, overwhelm: '' }
    };
  }
  return { ...draft, privacy: empty.privacy };
}

function Welcome({ onStart, onSkip }) {
  return (
    <section className="kefi-screen onboarding-welcome" aria-labelledby="welcome-title">
      <KefiMark size={96} className="welcome-mark" />
      <h1 id="welcome-title" tabIndex={-1}>{t('welcome.title')}</h1>
      <p className="welcome-copy">{t('welcome.body')}</p>
      <div className="entry-actions">
        <button type="button" className="primary-button" onClick={onStart}>{t('welcome.start')}</button>
        <button type="button" className="secondary-button" onClick={onSkip}>{t('welcome.skip')}</button>
      </div>
      <p className="trust-line">{t('welcome.trust')}</p>
    </section>
  );
}

export default function Onboarding({ initialProfile, onComplete }) {
  const [stepIndex, setStepIndex] = useState(-1);
  const [draft, setDraft] = useState(() => normalizeProfile(initialProfile));
  // The half-entered restriction lives here so it survives Back and is resolved on Next.
  const [pendingRestriction, setPendingRestriction] = useState(EMPTY_PENDING_RESTRICTION);
  const [restrictionError, setRestrictionError] = useState('');
  const headingRef = useRef(null);
  const firstRender = useRef(true);
  const step = STEPS[stepIndex];

  // Move focus to each step's heading, including back to Welcome, but not on first load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (stepIndex >= 0) headingRef.current?.focus();
    else document.getElementById('welcome-title')?.focus();
  }, [stepIndex]);

  const changePending = (pending) => {
    setRestrictionError('');
    setPendingRestriction(pending);
  };

  const set = (domain, value) => setDraft((d) => ({ ...d, [domain]: { ...d[domain], ...value } }));
  const finish = (profile) => onComplete(normalizeProfile({ ...profile, onboarding: { completed: true } }));
  const next = (profile = draft) => {
    if (stepIndex === STEPS.length - 1) finish(profile);
    else {
      setDraft(profile);
      setStepIndex((i) => i + 1);
    }
  };

  // Never drop a typed restriction: add it if complete, otherwise stay and explain.
  const continueFromStep = () => {
    if (step !== 'context') {
      next();
      return;
    }
    const resolved = resolvePendingRestriction(draft.restrictions, pendingRestriction);
    if (!resolved.ok) {
      setRestrictionError(t('restriction.pendingNeedsKind', { label: pendingRestriction.label.trim() }));
      return;
    }
    changePending(EMPTY_PENDING_RESTRICTION);
    next({ ...draft, restrictions: resolved.restrictions });
  };

  const skip = () => {
    if (step === 'context') changePending(EMPTY_PENDING_RESTRICTION);
    next(skipStep(step, draft));
  };

  if (stepIndex < 0) {
    return <Welcome onStart={() => setStepIndex(0)} onSkip={() => finish(createEmptyProfile())} />;
  }

  const titles = {
    intents: ['onboarding.intents.title', 'onboarding.intents.hint'],
    style: ['onboarding.style.title', 'onboarding.style.hint'],
    context: ['onboarding.context.title', 'onboarding.context.hint'],
    remember: ['onboarding.remember.title', 'onboarding.remember.body']
  };
  const [titleKey, hintKey] = titles[step];

  return (
    <section className="kefi-screen onboarding" aria-labelledby="onboarding-title">
      <p className="eyebrow">{t('onboarding.step', { current: stepIndex + 1, total: STEPS.length })}</p>
      <h1 id="onboarding-title" ref={headingRef} tabIndex={-1}>{t(titleKey)}</h1>
      <p className="muted">{t(hintKey)}</p>

      {step === 'intents' && (
        <>
          <MultiChoiceGroup
            legend={t('onboarding.intents.title')}
            options={INTENTS}
            values={draft.goals.intents}
            onChange={(intents) => set('goals', { intents })}
            labelFor={(o) => t(`intent.${o}`)}
          />
          <TextField label={t('intent.custom')} value={draft.goals.custom} onChange={(custom) => set('goals', { custom })} />
        </>
      )}

      {step === 'style' && (
        <ChoiceGroup
          legend={t('onboarding.style.title')}
          name="teachingStyle"
          options={TEACHING_STYLES}
          value={draft.learning.teachingStyle}
          onChange={(teachingStyle) => set('learning', { teachingStyle })}
          labelFor={(o) => t(`style.${o}`)}
        />
      )}

      {step === 'context' && (
        <>
          <RestrictionEditor
            restrictions={draft.restrictions}
            onChange={(restrictions) => setDraft((d) => ({ ...d, restrictions }))}
            pending={pendingRestriction}
            onPendingChange={changePending}
            error={restrictionError}
          />
          <TextField label={t('food.enjoy')} value={draft.foodPreferences.enjoy} onChange={(enjoy) => set('foodPreferences', { enjoy })} />
          <TextField label={t('cuisine.enjoyed')} hint={t('cuisine.hint')} value={draft.cuisine.enjoyed} onChange={(enjoyed) => set('cuisine', { enjoyed })} />
          <SelectField label={t('cooking.skill')} value={draft.cooking.skill} options={COOKING_SKILLS} onChange={(skill) => set('cooking', { skill })} labelFor={(o) => t(`cooking.skill.${o || 'unset'}`)} />
          <SelectField label={t('budget.mode')} value={draft.budget.mode} options={BUDGET_MODES} onChange={(mode) => set('budget', { mode })} labelFor={(o) => t(`budget.mode.${o || 'unset'}`)} />
          <SelectField label={t('overwhelm.label')} value={draft.learning.overwhelm} options={OVERWHELM_PREFERENCES} onChange={(overwhelm) => set('learning', { overwhelm })} labelFor={(o) => t(`overwhelm.${o || 'unset'}`)} />
        </>
      )}

      {step === 'remember' && (
        <ChoiceGroup
          legend={t('onboarding.remember.title')}
          name="remember"
          options={['session', 'device']}
          value={draft.privacy.rememberOnDevice ? 'device' : 'session'}
          onChange={(choice) => set('privacy', { rememberOnDevice: choice === 'device' })}
          labelFor={(o) => t(`onboarding.remember.${o}`)}
        />
      )}

      <div className="onboarding-actions">
        <button type="button" className="text-button" onClick={() => setStepIndex((i) => i - 1)}>{t('onboarding.back')}</button>
        {step !== 'remember' && <button type="button" className="secondary-button" onClick={skip}>{t('onboarding.skip')}</button>}
        <button type="button" className="primary-button" onClick={continueFromStep}>
          {step === 'remember' ? t('onboarding.finish') : t('onboarding.next')}
        </button>
      </div>
    </section>
  );
}
