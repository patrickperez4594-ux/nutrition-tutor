import en from '../i18n/en';
import { AVAILABLE_LANGUAGES, getCatalog, t, translate } from '../i18n';
import { readClientFeatureFlags } from '../config/featureFlags';

test('translates keys with named placeholders', () => {
  expect(t('onboarding.step', { current: 2, total: 4 })).toBe('Step 2 of 4');
});

test('returns the key for missing strings rather than throwing', () => {
  expect(t('does.not.exist')).toBe('does.not.exist');
});

test('leaves unknown placeholders visible', () => {
  expect(translate({ greeting: 'Hi {name}' }, 'greeting', {})).toBe('Hi {name}');
});

test('English is the only shipped catalog and the fallback', () => {
  expect(AVAILABLE_LANGUAGES).toEqual(['en']);
  expect(getCatalog('pt-BR')).toBe(en);
});

test('catalog values are non-empty strings', () => {
  Object.entries(en).forEach(([key, value]) => {
    expect(typeof value).toBe('string');
    expect(value.trim()).not.toBe('');
    expect(key).toMatch(/^[a-z0-9.-]+$/i);
  });
});

test('catalog avoids shaming language', () => {
  const text = Object.values(en).join(' ').toLowerCase();
  ['cheat meal', 'bad food', 'guilt-free', 'clean eating', 'failed'].forEach((term) => {
    expect(text).not.toContain(term);
  });
});

test('Kefi shell flag defaults off and enables only on explicit values', () => {
  expect(readClientFeatureFlags({}).kefiShell).toBe(false);
  expect(readClientFeatureFlags({ REACT_APP_KEFI_FLAG_SHELL: 'yes' }).kefiShell).toBe(false);
  expect(readClientFeatureFlags({ REACT_APP_KEFI_FLAG_SHELL: 'true' }).kefiShell).toBe(true);
  expect(readClientFeatureFlags({ REACT_APP_KEFI_FLAG_SHELL: '1' }).kefiShell).toBe(true);
});
