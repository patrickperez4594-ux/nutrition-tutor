import { t } from '../i18n';

const PLANNED_TYPES = ['meal', 'pantry', 'label', 'menu', 'product'];

// Scanning arrives in Plan 05. Until then this screen states that plainly and offers the
// text alternative the spec requires for camera features (§24.2).
export default function ScanScreen({ lowEnergy, onAsk }) {
  return (
    <section className="kefi-screen" aria-labelledby="scan-title">
      <h1 id="scan-title" tabIndex={-1}>{t('scan.title')}</h1>
      <p>{t('scan.unavailable')}</p>
      <p className="muted">{t('scan.alternative')}</p>
      <button type="button" className="primary-button" onClick={() => onAsk(t('scan.describeStarter'))}>{t('scan.describe')}</button>
      {!lowEnergy && (
        <>
          <h2 className="section-heading">{t('scan.plannedHeading')}</h2>
          <ul className="plain-list">
            {PLANNED_TYPES.map((type) => <li key={type}>{t(`scan.type.${type}`)}</li>)}
          </ul>
        </>
      )}
    </section>
  );
}
