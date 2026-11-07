// Decorative Luminous Emerald background: waves, bubbles, leaves, and sparkles. It sits behind every
// screen, is hidden from assistive technology, and never receives pointer events, so it cannot block
// controls. Colors, opacity, and motion come from kefi.css tokens (Detour and reduced motion calm it).

const BUBBLES = [
  { x: '6%', y: '18%', size: 22, delay: '0s' },
  { x: '91%', y: '12%', size: 30, delay: '-3s' },
  { x: '84%', y: '34%', size: 14, delay: '-6s' },
  { x: '12%', y: '46%', size: 34, delay: '-2s' },
  { x: '95%', y: '58%', size: 18, delay: '-8s' },
  { x: '3%', y: '70%', size: 12, delay: '-5s' },
  { x: '72%', y: '8%', size: 40, delay: '-9s', soft: true },
  { x: '22%', y: '84%', size: 16, delay: '-4s' },
  { x: '4%', y: '36%', size: 26, delay: '-11s', opacity: 0.85 },
  { x: '89%', y: '86%', size: 20, delay: '-17s', opacity: 0.65 },
  { x: '15%', y: '64%', size: 38, delay: '-21s', soft: true, opacity: 0.5 }
];

const SPARKLES = [
  { x: '18%', y: '9%', size: 14, delay: '0s' },
  { x: '78%', y: '22%', size: 18, delay: '-1.5s' },
  { x: '9%', y: '30%', size: 12, delay: '-3s' },
  { x: '88%', y: '76%', size: 14, delay: '-2.2s' }
];

const LEAF_PATH = 'M4 44 C6 22 22 6 44 4 C42 26 26 42 4 44 Z';
const LEAF_VEIN = 'M6 42 C16 30 26 20 38 10';
const SPARKLE_PATH = 'M12 0 C13 7 17 11 24 12 C17 13 13 17 12 24 C11 17 7 13 0 12 C7 11 11 7 12 0 Z';

function Leaf({ className }) {
  return (
    <svg className={`kefi-leaf ${className}`} viewBox="0 0 48 48" focusable="false">
      <path className="kefi-leaf-body" d={LEAF_PATH} />
      <path className="kefi-leaf-vein" d={LEAF_VEIN} fill="none" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function KefiBackdrop() {
  return (
    <div className="kefi-backdrop" aria-hidden="true">
      <svg className="kefi-waves kefi-waves-top" viewBox="0 0 1440 200" preserveAspectRatio="none" focusable="false">
        <path className="kefi-wave-a" d="M0 0 H1440 V40 C1180 120 980 30 720 90 C460 150 260 60 0 140 Z" />
        <path className="kefi-wave-line" d="M0 150 C260 70 460 160 720 100 C980 40 1180 130 1440 50" fill="none" />
      </svg>
      <svg className="kefi-waves kefi-waves-bottom" viewBox="0 0 1440 260" preserveAspectRatio="none" focusable="false">
        <path className="kefi-wave-b" d="M0 120 C240 40 480 200 760 130 C1040 60 1240 160 1440 90 V260 H0 Z" />
        <path className="kefi-wave-c" d="M0 200 C300 130 560 240 860 180 C1120 130 1300 200 1440 160 V260 H0 Z" />
        <path className="kefi-wave-line" d="M0 110 C240 30 480 190 760 120 C1040 50 1240 150 1440 80" fill="none" />
      </svg>
      {BUBBLES.map((bubble, index) => (
        <span
          key={`bubble-${index}`}
          className={`kefi-bubble${bubble.soft ? ' soft' : ''}`}
          style={{ '--x': bubble.x, '--y': bubble.y, '--size': `${bubble.size}px`, '--delay': bubble.delay, '--bubble-opacity': bubble.opacity }}
        />
      ))}
      {SPARKLES.map((sparkle, index) => (
        <svg
          key={`sparkle-${index}`}
          className="kefi-sparkle"
          viewBox="0 0 24 24"
          focusable="false"
          style={{ '--x': sparkle.x, '--y': sparkle.y, '--size': `${sparkle.size}px`, '--delay': sparkle.delay }}
        >
          <path d={SPARKLE_PATH} />
        </svg>
      ))}
      <Leaf className="kefi-leaf-top" />
      <Leaf className="kefi-leaf-left" />
      <Leaf className="kefi-leaf-left small" />
      <Leaf className="kefi-leaf-right" />
      <Leaf className="kefi-leaf-right small" />
    </div>
  );
}
