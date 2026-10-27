import { useState } from 'react';
import { t } from '../i18n';

// Home actions (spec §5.2). Destinations whose engines arrive in later plans open Ask Kefi with an
// editable starter, so nothing pretends to be a finished feature.
export function homeActions({ onAsk, onTab, onMeSection }) {
  return [
    { id: 'ask', label: t('home.ask'), hint: t('home.askHint'), run: () => onAsk('') },
    { id: 'scan', label: t('home.scan'), hint: t('home.scanHint'), run: () => onTab('scan') },
    { id: 'make', label: t('home.make'), hint: t('home.makeHint'), run: () => onAsk(t('starter.make')) },
    { id: 'grocery', label: t('home.grocery'), hint: t('home.groceryHint'), run: () => onAsk(t('starter.grocery')) },
    { id: 'learn', label: t('home.learn'), hint: t('home.learnHint'), run: () => onTab('learn') },
    { id: 'goals', label: t('home.goals'), hint: t('home.goalsHint'), run: () => onMeSection('goals') }
  ];
}

function ActionCard({ action, showHint, primary }) {
  return (
    <button type="button" className={`home-card${primary ? ' primary' : ''}`} onClick={action.run}>
      <span className="home-card-label">{action.label}</span>
      {showHint && <span className="home-card-hint">{action.hint}</span>}
    </button>
  );
}

export default function HomeScreen({ profile, lowEnergy, onAsk, onTab, onMeSection }) {
  const [expanded, setExpanded] = useState(false);
  const actions = homeActions({ onAsk, onTab, onMeSection });
  const [first, ...rest] = actions;
  const goals = profile.goals.intents.map((intent) => t(`intent.${intent}`)).concat(profile.goals.custom || []).filter(Boolean);

  const plansChanged = (
    <button type="button" className="plans-changed" onClick={() => onAsk(t('starter.plansChanged'))}>
      <span className="home-card-label">{t('home.plansChanged')}</span>
      {!lowEnergy && <span className="home-card-hint">{t('home.plansChangedHint')}</span>}
    </button>
  );

  return (
    <section className="kefi-screen home-screen" aria-labelledby="home-title">
      <h1 id="home-title" tabIndex={-1}>{t('home.prompt')}</h1>
      {!lowEnergy && goals.length > 0 && <p className="muted home-focus">{t('home.focus', { goals: goals.join(', ') })}</p>}

      {lowEnergy ? (
        <>
          {/* Same catalog text as the header toggle's description, shown so sighted users see it too. */}
          <p className="muted detour-note">{t('header.lowEnergyHint')}</p>
          <p className="eyebrow">{t('home.oneStep')}</p>
          <ActionCard action={first} primary showHint={false} />
          {plansChanged}
          <button type="button" className="text-button show-more" aria-expanded={expanded} aria-controls="home-more" onClick={() => setExpanded((v) => !v)}>
            {expanded ? t('home.showFewer') : t('home.showMore')}
          </button>
          {expanded && (
            <div id="home-more" className="home-grid">
              {rest.map((action) => <ActionCard key={action.id} action={action} showHint={false} />)}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="home-grid">
            {actions.map((action, index) => <ActionCard key={action.id} action={action} showHint primary={index === 0} />)}
          </div>
          {plansChanged}
        </>
      )}
    </section>
  );
}
