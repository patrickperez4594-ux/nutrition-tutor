const CONSTRAINT_KIND = Object.freeze({
  HARD: 'hard',
  PREFERENCE: 'preference',
  OPTIMIZATION: 'optimization'
});

const ALLOWED_KINDS = new Set(Object.values(CONSTRAINT_KIND));

function makeConstraint({ id, kind, type, value, source }) {
  if (!ALLOWED_KINDS.has(kind)) throw new Error(`Unsupported constraint kind: ${kind}`);
  if (!id || !type || value === undefined || value === null || !source) {
    throw new Error('Constraint id, type, value, and source are required.');
  }
  return { id, kind, type, value, source };
}

function partitionConstraints(constraints = []) {
  if (!Array.isArray(constraints)) throw new Error('constraints must be an array.');
  const result = { hard: [], preferences: [], optimization: [] };
  for (const constraint of constraints) {
    const normalized = makeConstraint(constraint);
    if (normalized.kind === CONSTRAINT_KIND.HARD) result.hard.push(normalized);
    if (normalized.kind === CONSTRAINT_KIND.PREFERENCE) result.preferences.push(normalized);
    if (normalized.kind === CONSTRAINT_KIND.OPTIMIZATION) result.optimization.push(normalized);
  }
  return result;
}

module.exports = { CONSTRAINT_KIND, makeConstraint, partitionConstraints };
