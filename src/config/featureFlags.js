function enabled(value) {
  return value === 'true' || value === '1';
}

// Browser-side flags must use the REACT_APP_ prefix so Create React App inlines them at build time.
// They default to false, matching server/config/featureFlags.js.
export function readClientFeatureFlags(env = process.env) {
  return {
    kefiShell: enabled(env.REACT_APP_KEFI_FLAG_SHELL)
  };
}
