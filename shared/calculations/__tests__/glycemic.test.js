const { calculateGlycemicLoad, classifyGlycemicIndex } = require('../glycemic');

test('calculates GL using GI × available carbohydrate / 100', () => {
  expect(calculateGlycemicLoad({ glycemicIndex: 55, availableCarbGrams: 20 })).toBe(11);
});

test.each([[55, 'low'], [56, 'medium'], [69, 'medium'], [70, 'high']])('classifies GI %s as %s', (gi, expected) => {
  expect(classifyGlycemicIndex(gi)).toBe(expected);
});
