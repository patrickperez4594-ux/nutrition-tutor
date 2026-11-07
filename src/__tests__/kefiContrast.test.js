import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

// jsdom cannot resolve CSS custom properties. Resolve the actual cascade for the
// reused Send button against both palettes and check its normal-text contrast.
const sources = ['index.css', 'App.css', 'kefi/kefi.css'].map((file) =>
  postcss.parse(fs.readFileSync(path.join(__dirname, '..', file), 'utf8')));

function sendColors(theme) {
  const values = {};
  sources.forEach((source) => source.walkRules((rule) => {
    if (rule.parent.type !== 'root') return;
    if (![':root', '.kefi-app', `.kefi-app[data-theme="${theme}"]`, '.send-button', '.kefi-app .send-button'].includes(rule.selector)) return;
    rule.walkDecls((declaration) => {
      if (declaration.prop.startsWith('--') || rule.selector.endsWith('.send-button')) {
        values[declaration.prop] = declaration.value;
      }
    });
  }));
  const resolve = (value) => value.replace(/var\((--[\w-]+)\)/g, (_, key) => resolve(values[key]));
  return [resolve(values.color), resolve(values.background)];
}

function luminance(hex) {
  const full = hex.length === 4 ? '#' + [...hex.slice(1)].map((c) => c + c).join('') : hex;
  const channels = [1, 3, 5].map((offset) => parseInt(full.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test.each(['light', 'dark'])('enabled Send text meets 4.5:1 contrast in %s theme', (theme) => {
  const [foreground, background] = sendColors(theme).map(luminance);
  expect((Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)).toBeGreaterThanOrEqual(4.5);
});
