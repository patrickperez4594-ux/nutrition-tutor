const { CONFIDENCE_LEVEL, makeConfidence } = require('../domain/confidence');
const { makeProvenance } = require('../domain/provenance');

test('builds normalized confidence metadata', () => {
  expect(makeConfidence({
    level: CONFIDENCE_LEVEL.MODERATE,
    reasonCodes: ['portion_uncertain', 'sauce_unknown', 'portion_uncertain']
  })).toEqual({
    level: 'moderate',
    reasonCodes: ['portion_uncertain', 'sauce_unknown']
  });
});

test('rejects unsupported confidence levels', () => {
  expect(() => makeConfidence({ level: 'certain', reasonCodes: [] }))
    .toThrow('Unsupported confidence level: certain');
});

test('requires source type and provider for external provenance', () => {
  expect(makeProvenance({
    sourceType: 'food_database',
    provider: 'test-provider',
    sourceId: 'food-123',
    retrievedAt: '2026-09-14T12:00:00.000Z',
    verificationStatus: 'verified'
  })).toEqual({
    sourceType: 'food_database',
    provider: 'test-provider',
    sourceId: 'food-123',
    retrievedAt: '2026-09-14T12:00:00.000Z',
    publishedAt: null,
    verificationStatus: 'verified'
  });
});
