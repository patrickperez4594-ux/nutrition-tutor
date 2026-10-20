// PROVISIONAL ARTWORK. This is a placeholder rendering of the approved "athletic tortoise" visual
// direction, not the final production asset. Replace the SVG body here when final artwork is
// delivered; every Kefi surface uses this one component, so no other file needs to change.
export default function KefiMark({ size = 40, className = '' }) {
  return (
    <svg
      className={`kefi-mark ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      data-provisional="true"
    >
      <g className="kefi-mark-motion" strokeLinecap="round" strokeWidth="2.5">
        <line x1="2" y1="30" x2="9" y2="30" />
        <line x1="4" y1="37" x2="10" y2="37" />
      </g>
      <g className="kefi-mark-skin">
        <rect x="14" y="40" width="7" height="13" rx="3.5" transform="rotate(28 17.5 46)" />
        <rect x="38" y="40" width="7" height="13" rx="3.5" transform="rotate(-24 41.5 46)" />
        <path d="M46 34 C50 27 56 25 60 28 C63 31 62 37 58 39 C54 41 50 40 47 38 Z" />
      </g>
      <path className="kefi-mark-band" d="M50.5 28.6 L60.6 29.2 L61.4 32.4 L49.6 31.6 Z" />
      <circle className="kefi-mark-eye" cx="57" cy="34" r="1.6" />
      <path className="kefi-mark-shell" d="M11 42 C11 26 21 17 31 17 C42 17 51 25 51 42 Z" />
      <path
        className="kefi-mark-pattern"
        d="M31 22 L37 26 L37 33 L31 37 L25 33 L25 26 Z M25 33 L18 37 M37 33 L44 37 M31 22 L31 18"
        fill="none"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <rect className="kefi-mark-rim" x="8" y="40" width="46" height="5" rx="2.5" />
    </svg>
  );
}
