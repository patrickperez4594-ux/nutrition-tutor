import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';
import postcss from 'postcss';
import KefiBackdrop from '../kefi/KefiBackdrop';
import HomeIcon from '../kefi/HomeIcons';

// Guards for the Luminous Emerald decorations. jsdom cannot paint, so these check the CSS rules that
// keep decorations behind content, calm in Detour Mode, and still under reduced motion.
const source = fs.readFileSync(path.join(__dirname, '..', 'kefi', 'kefi.css'), 'utf8');
const css = postcss.parse(source);

function declarations(selector) {
  const values = {};
  css.walkRules((rule) => {
    if (rule.selector === selector) rule.walkDecls((decl) => { values[decl.prop] = decl.value; });
  });
  return values;
}

test('decorations are hidden from assistive technology', () => {
  const { container } = render(<KefiBackdrop />);
  const backdrop = container.firstChild;
  expect(backdrop).toHaveAttribute('aria-hidden', 'true');
  expect(backdrop.querySelectorAll('button, a, input, [tabindex]')).toHaveLength(0);
});

test('decorations stay behind content and never take pointer events', () => {
  const backdrop = declarations('.kefi-backdrop');
  expect(backdrop['pointer-events']).toBe('none');
  expect(backdrop['z-index']).toBe('-1');
  expect(backdrop.position).toBe('fixed');
  expect(declarations('.kefi-app').isolation).toBe('isolate');
});

test('Home card icons are decorative', () => {
  const { container } = render(<HomeIcon name="ask" />);
  expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
});

test('Detour Mode removes glow and quiets decorations', () => {
  const detour = declarations('.kefi-app[data-low-energy="true"]');
  expect(detour['--k-glow-color']).toBe('transparent');
  expect(Number(detour['--k-deco-opacity'])).toBeLessThan(0.5);
  expect(detour['--k-page-background']).toBe('var(--k-bg)');
  expect(source).toMatch(/\.kefi-app\[data-low-energy="true"\] \.kefi-sparkle/);
});

test('reduced motion and Detour stop all decoration animation', () => {
  expect(source).toMatch(/\.kefi-app\[data-motion="reduce"\] \*,\s*\.kefi-app\[data-low-energy="true"\] \* \{ transition: none !important; animation: none !important; \}/);
  expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.kefi-app \* \{ transition: none !important; animation: none !important; \}/);
});
