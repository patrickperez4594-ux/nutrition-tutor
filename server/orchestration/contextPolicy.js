const { CONTEXT_TYPE } = require('../domain/contextTypes');

const ENGINE_CONTEXT_ALLOWLIST = Object.freeze({
  tutor: new Set(Object.values(CONTEXT_TYPE)),
  learning: new Set([
    CONTEXT_TYPE.LEARNING_PREFERENCES,
    CONTEXT_TYPE.GOALS,
    CONTEXT_TYPE.LOCALE,
    CONTEXT_TYPE.ACCESSIBILITY_PREFERENCES
  ]),
  grocery: new Set([
    CONTEXT_TYPE.BUDGET,
    CONTEXT_TYPE.PANTRY,
    CONTEXT_TYPE.FOOD_PREFERENCES,
    CONTEXT_TYPE.DIETARY_RESTRICTIONS,
    CONTEXT_TYPE.CUISINE,
    CONTEXT_TYPE.COOKING_CONTEXT,
    CONTEXT_TYPE.GOALS,
    CONTEXT_TYPE.LOCALE
  ])
});

function getAllowlist(engineName) {
  const allowlist = ENGINE_CONTEXT_ALLOWLIST[engineName];
  if (!allowlist) throw new Error(`Unknown engine: ${engineName}`);
  return allowlist;
}

function assertContextAllowed(engineName, requestedTypes = []) {
  if (!Array.isArray(requestedTypes)) throw new Error('requestedTypes must be an array.');
  const allowlist = getAllowlist(engineName);
  for (const type of requestedTypes) {
    if (!allowlist.has(type)) throw new Error(`${engineName} may not access context type: ${type}`);
  }
  return true;
}

function filterContext(engineName, contextByType = {}) {
  const allowlist = getAllowlist(engineName);
  return Object.fromEntries(Object.entries(contextByType).filter(([type]) => allowlist.has(type)));
}

module.exports = { ENGINE_CONTEXT_ALLOWLIST, assertContextAllowed, filterContext };
