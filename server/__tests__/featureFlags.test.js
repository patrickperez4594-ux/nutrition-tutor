const { readFeatureFlags } = require('../config/featureFlags');

test('V2-only features default off', () => {
  expect(readFeatureFlags({})).toEqual({
    kefiShell: false,
    calorieLab: false,
    scan: false,
    pantry: false,
    grocery: false,
    restaurant: false,
    progress: false,
    accounts: false,
    proactive: false
  });
});

test('only literal true/1 enables a flag', () => {
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: 'true' }).scan).toBe(true);
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: '1' }).scan).toBe(true);
  expect(readFeatureFlags({ KEFI_FLAG_SCAN: 'yes' }).scan).toBe(false);
});
