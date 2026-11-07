import KefiMark from './KefiMark';
import { t } from '../i18n';

export default function KefiHeader({ lowEnergy, onToggleLowEnergy }) {
  return (
    <header className="kefi-header">
      <div className="kefi-brand">
        <KefiMark size={36} />
        <span className="kefi-wordmark">{t('app.name')}</span>
        <svg className="kefi-wordmark-sparkles" width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" focusable="false">
          <path d="M9 4 C9.6 8 11 9.4 15 10 C11 10.6 9.6 12 9 16 C8.4 12 7 10.6 3 10 C7 9.4 8.4 8 9 4 Z" />
          <path d="M21 14 C21.4 16.6 22.4 17.6 25 18 C22.4 18.4 21.4 19.4 21 22 C20.6 19.4 19.6 18.4 17 18 C19.6 17.6 20.6 16.6 21 14 Z" />
        </svg>
      </div>
      <button
        type="button"
        className="low-energy-toggle"
        aria-pressed={lowEnergy}
        aria-describedby="low-energy-hint"
        onClick={onToggleLowEnergy}
      >
        {t('header.lowEnergy')}
        <span className="low-energy-state" aria-hidden="true">{lowEnergy ? t('header.lowEnergyOn') : t('header.lowEnergyOff')}</span>
      </button>
      <span id="low-energy-hint" className="visually-hidden">{t('header.lowEnergyHint')}</span>
    </header>
  );
}
