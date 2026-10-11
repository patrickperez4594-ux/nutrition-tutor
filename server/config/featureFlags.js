function enabled(value) {
  return value === 'true' || value === '1';
}

function readFeatureFlags(env = process.env) {
  return {
    kefiShell: enabled(env.KEFI_FLAG_SHELL),
    calorieLab: enabled(env.KEFI_FLAG_CALORIE_LAB),
    scan: enabled(env.KEFI_FLAG_SCAN),
    pantry: enabled(env.KEFI_FLAG_PANTRY),
    grocery: enabled(env.KEFI_FLAG_GROCERY),
    restaurant: enabled(env.KEFI_FLAG_RESTAURANT),
    progress: enabled(env.KEFI_FLAG_PROGRESS),
    accounts: enabled(env.KEFI_FLAG_ACCOUNTS),
    proactive: enabled(env.KEFI_FLAG_PROACTIVE)
  };
}

module.exports = { readFeatureFlags };
