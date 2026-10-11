const { lbToKg, kgToLb, inchToCm, cmToInch, kcalToKj, kjToKcal } = require('../units');

test('converts pounds and kilograms deterministically', () => {
  expect(lbToKg(220)).toBeCloseTo(99.7903, 3);
  expect(kgToLb(100)).toBeCloseTo(220.462, 3);
});

test('converts inches and centimeters', () => {
  expect(inchToCm(70)).toBeCloseTo(177.8, 3);
  expect(cmToInch(177.8)).toBeCloseTo(70, 3);
});

test('converts kcal and kJ', () => {
  expect(kcalToKj(100)).toBeCloseTo(418.4, 1);
  expect(kjToKcal(418.4)).toBeCloseTo(100, 1);
});
