import fs from 'fs';
import path from 'path';

// jsdom does not compute layout, so these guard the CSS rules the mobile layout depends on.
// The 320/375/390px checks themselves were run in a real browser (see the Plan 02 ledger).
const css = fs.readFileSync(path.join(__dirname, '..', 'kefi', 'kefi.css'), 'utf8');

function rule(selector, source = css) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`(?:^|[}\\s])${escaped}\\s*\\{([^}]*)\\}`, 'm').exec(source);
  if (!match) throw new Error(`No rule for ${selector}`);
  return match[1];
}

function narrowBlock() {
  const start = css.indexOf('@media (max-width: 520px)');
  expect(start).toBeGreaterThan(-1);
  return css.slice(start);
}

test('the Detour Mode toggle never wraps its own text, and the header wraps rows instead', () => {
  expect(rule('.kefi-app .low-energy-toggle')).toMatch(/white-space:\s*nowrap/);
  expect(rule('.kefi-header')).toMatch(/flex-wrap:\s*wrap/);
});

test('the header is compact on narrow screens', () => {
  const narrow = narrowBlock();
  expect(rule('.kefi-header', narrow)).toMatch(/padding:\s*\.4rem/);
  expect(rule('.kefi-brand .kefi-mark', narrow)).toMatch(/width:\s*28px/);
});

test('content always clears the fixed bottom navigation, which grows with text size', () => {
  expect(rule('.kefi-app')).toMatch(/--k-nav-height:\s*calc\(60px \+ \.5rem\)/);
  expect(rule('.kefi-main')).toMatch(/padding:[^;]*var\(--k-nav-height\)[^;]*env\(safe-area-inset-bottom/);
  expect(rule('.bottom-nav')).toMatch(/position:\s*fixed/);
});

test('narrow viewports never scroll sideways', () => {
  expect(rule('body:has(.kefi-app)')).toMatch(/min-width:\s*0/);
  expect(rule('.kefi-main')).toMatch(/overflow-wrap:\s*anywhere/);
  expect(rule('.kefi-main')).toMatch(/min-width:\s*0/);
  expect(rule('.kefi-app .chat-header', narrowBlock())).toMatch(/flex-wrap:\s*wrap/);
});

test('button labels are never squeezed mid-word, and Retry stays on one line', () => {
  // overflow-wrap: anywhere on .kefi-main once let the error banner split "Retry" across five lines.
  expect(rule('.kefi-main button')).toMatch(/overflow-wrap:\s*break-word/);
  const retry = rule('.kefi-app .error-banner button');
  expect(retry).toMatch(/white-space:\s*nowrap/);
  expect(retry).toMatch(/flex:\s*none/);
});

test('enlarged text still scales the whole shell', () => {
  expect(css).toMatch(/html\[data-kefi-text-size="large"\]\s*\{\s*font-size:\s*112\.5%/);
  expect(css).toMatch(/html\[data-kefi-text-size="larger"\]\s*\{\s*font-size:\s*125%/);
});
