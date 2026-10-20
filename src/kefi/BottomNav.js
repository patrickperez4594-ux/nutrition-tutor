import { t } from '../i18n';

export const TABS = Object.freeze(['home', 'ask', 'scan', 'learn', 'me']);

const ICON_PATHS = {
  home: 'M4 11 L12 4 L20 11 V20 H14 V14 H10 V20 H4 Z',
  ask: 'M4 6 C4 4.9 4.9 4 6 4 H18 C19.1 4 20 4.9 20 6 V15 C20 16.1 19.1 17 18 17 H10 L5 21 V17 C4.4 17 4 16.6 4 16 Z',
  scan: 'M4 9 V5 H8 M16 5 H20 V9 M20 15 V19 H16 M8 19 H4 V15 M9 12 A3 3 0 1 0 15 12 A3 3 0 1 0 9 12',
  learn: 'M3 7 L12 3 L21 7 L12 11 Z M7 9 V15 C7 17 9.5 18.5 12 18.5 C14.5 18.5 17 17 17 15 V9',
  me: 'M12 12 A4 4 0 1 0 12 4 A4 4 0 1 0 12 12 M4 20 C4 16.5 7.6 14.5 12 14.5 C16.4 14.5 20 16.5 20 20'
};

function NavIcon({ name }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={ICON_PATHS[name]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="bottom-nav" aria-label={t('nav.label')}>
      <ul>
        {TABS.map((tab) => (
          <li key={tab}>
            <button
              type="button"
              className="bottom-nav-item"
              aria-current={active === tab ? 'page' : undefined}
              onClick={() => onSelect(tab)}
            >
              <NavIcon name={tab} />
              <span>{t(`nav.${tab}`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
