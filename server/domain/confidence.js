const CONFIDENCE_LEVEL = Object.freeze({
  HIGH: 'high',
  MODERATE: 'moderate',
  LOW: 'low',
  UNKNOWN: 'unknown'
});

const LEVELS = new Set(Object.values(CONFIDENCE_LEVEL));

function makeConfidence({ level, reasonCodes = [] }) {
  if (!LEVELS.has(level)) throw new Error(`Unsupported confidence level: ${level}`);
  const normalizedReasons = [...new Set(
    (Array.isArray(reasonCodes) ? reasonCodes : [])
      .filter((value) => typeof value === 'string' && value.trim())
      .map((value) => value.trim())
  )];
  return { level, reasonCodes: normalizedReasons };
}

module.exports = { CONFIDENCE_LEVEL, makeConfidence };
