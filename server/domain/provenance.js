function requireText(name, value) {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} is required.`);
  return value.trim();
}

function nullableText(name, value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${name} must be text when provided.`);
  return value.trim();
}

function makeProvenance({
  sourceType,
  provider,
  sourceId = null,
  retrievedAt,
  publishedAt = null,
  verificationStatus
}) {
  return {
    sourceType: requireText('sourceType', sourceType),
    provider: requireText('provider', provider),
    sourceId: nullableText('sourceId', sourceId),
    retrievedAt: requireText('retrievedAt', retrievedAt),
    publishedAt: nullableText('publishedAt', publishedAt),
    verificationStatus: requireText('verificationStatus', verificationStatus)
  };
}

module.exports = { makeProvenance };
