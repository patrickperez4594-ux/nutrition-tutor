import fs from 'fs';
import path from 'path';
import postcss from 'postcss';

const css = postcss.parse(fs.readFileSync(path.join(__dirname, '..', 'kefi', 'kefi.css'), 'utf8'));
function palette(theme, calm = false) {
  const values = {};
  css.walkRules((rule) => {
    const inDarkMedia = rule.parent.type === 'atrule' && rule.parent.params === '(prefers-color-scheme: dark)';
    if (inDarkMedia && theme !== 'system-dark') return;
    if (!['.kefi-app', `.kefi-app[data-theme="${theme === 'system-dark' ? 'system' : theme}"]`,
      ...(calm ? ['.kefi-app[data-low-energy="true"]'] : [])].includes(rule.selector)) return;
    rule.walkDecls((decl) => { if (decl.prop.startsWith('--k-')) values[decl.prop] = decl.value; });
  });
  const resolve = (key) => {
    if (!values[key]) throw new Error(`Missing theme token ${key}`);
    return values[key].replace(/var\((--[\w-]+)\)/g, (_, nested) => resolve(nested));
  };
  return resolve;
}
function luminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Expected opaque palette color: ${hex}`);
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(a, b) {
  const [x, y] = [a, b].map(luminance);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
const textPairs = [
  ...['bg', 'surface', 'surface-soft', 'card-top', 'card-bottom'].flatMap((surface) =>
    ['ink', 'muted', 'accent', 'danger'].map((text) => [text, surface])),
  ['on-primary', 'primary'], ['on-primary', 'primary-hover'],
  ['ink', 'primary-soft'], ['primary-strong', 'primary-soft'],
  ['primary-strong', 'surface'], ['on-user', 'user-bg'],
  ['on-danger', 'danger'], ['on-highlight', 'highlight']
];
for (const theme of ['light', 'dark', 'system-dark']) {
  for (const calm of [false, true]) {
    describe(`${theme}, Detour ${calm ? 'on' : 'off'}`, () => {
      test.each(textPairs)('%s text on %s meets AA normal-text contrast', (text, surface) => {
        const get = palette(theme, calm);
        expect(contrast(get(`--k-${text}`), get(`--k-${surface}`))).toBeGreaterThanOrEqual(4.5);
      });
      test.each(['bg', 'surface', 'surface-soft', 'card-top', 'card-bottom'])('focus indicator contrasts with %s', (surface) => {
        const get = palette(theme, calm);
        expect(contrast(get('--k-focus'), get(`--k-${surface}`))).toBeGreaterThanOrEqual(3);
      });
      test.each(['card-top', 'card-bottom'])('Home card icons contrast with %s', (surface) => {
        const get = palette(theme, calm);
        expect(contrast(get('--k-icon'), get(`--k-${surface}`))).toBeGreaterThanOrEqual(3);
      });
    });
  }
}
test('system dark uses the same palette as explicit dark', () => {
  for (const token of ['bg', 'surface', 'ink', 'muted', 'primary', 'primary-hover', 'highlight', 'on-primary']) {
    expect(palette('system-dark')(`--k-${token}`)).toBe(palette('dark')(`--k-${token}`));
  }
});
