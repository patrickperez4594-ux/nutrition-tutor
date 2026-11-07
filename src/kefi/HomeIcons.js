// Line icons for the Home cards, drawn in currentColor so they follow each card's text color.
// Decorative only: the card's visible label is its accessible name.
const PATHS = {
  ask: [
    'M5 6 C5 4.9 5.9 4 7 4 H25 C26.1 4 27 4.9 27 6 V19 C27 20.1 26.1 21 25 21 H13 L7 27 V21 H7 C5.9 21 5 20.1 5 19 Z',
    'M11 12.5 H11.01 M16 12.5 H16.01 M21 12.5 H21.01'
  ],
  scan: [
    'M5 11 C5 9.9 5.9 9 7 9 H10.5 L12.5 6 H19.5 L21.5 9 H25 C26.1 9 27 9.9 27 11 V24 C27 25.1 26.1 26 25 26 H7 C5.9 26 5 25.1 5 24 Z',
    'M11 17 A5 5 0 1 0 21 17 A5 5 0 1 0 11 17'
  ],
  make: [
    'M16 10 C13 7.5 6 8 6 15.5 C6 22 10.5 27 13.5 27 C15 27 15.4 26.2 16 26.2 C16.6 26.2 17 27 18.5 27 C21.5 27 26 22 26 15.5 C26 8 19 7.5 16 10 Z',
    'M16 10 C16 7.5 17 5.5 19 4.5 M16 8.5 C14 6 11.5 5.5 10 6'
  ],
  grocery: [
    'M3 5 H7 L10 20 H24 L27 9 H8.5',
    'M11 25 A1.6 1.6 0 1 0 14.2 25 A1.6 1.6 0 1 0 11 25 M20 25 A1.6 1.6 0 1 0 23.2 25 A1.6 1.6 0 1 0 20 25'
  ],
  learn: [
    'M16 9 C13 6.5 8.5 6 4 7 V24 C8.5 23 13 23.5 16 26 C19 23.5 23.5 23 28 24 V7 C23.5 6 19 6.5 16 9 Z',
    'M16 9 V26'
  ],
  goals: [
    'M15 6 A10 10 0 1 0 25 16 M15 11 A5 5 0 1 0 20 16',
    'M15 16 L26 5 M22 5 H26 V9'
  ],
  plansChanged: [
    'M16 27 V15',
    'M16 17 C16 11 12 7 5 7 C5 13 9 17 16 17 Z M16 15 C16 9.5 19.5 6 26 6 C26 11.5 22.5 15 16 15 Z'
  ]
};

export default function HomeIcon({ name }) {
  const paths = PATHS[name];
  if (!paths) return null;
  return (
    <svg className="home-card-icon" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      {paths.map((d) => (
        <path key={d} d={d} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
