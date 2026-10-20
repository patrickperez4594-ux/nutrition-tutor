import KefiMark from './KefiMark';
import { t } from '../i18n';

export default function KefiHeader({ lowEnergy, onToggleLowEnergy }) {
  return (
    <header className="kefi-header">
      <div className="kefi-brand">
        <KefiMark size={36} />
        <span className="kefi-wordmark">{t('app.name')}</span>
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
