function validNonnegative(name, value) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be a nonnegative number.`);
  return value;
}

function calculateGlycemicLoad({ glycemicIndex, availableCarbGrams }) {
  validNonnegative('glycemicIndex', glycemicIndex);
  validNonnegative('availableCarbGrams', availableCarbGrams);
  return (glycemicIndex * availableCarbGrams) / 100;
}

function classifyGlycemicIndex(glycemicIndex) {
  validNonnegative('glycemicIndex', glycemicIndex);
  if (glycemicIndex <= 55) return 'low';
  if (glycemicIndex <= 69) return 'medium';
  return 'high';
}

module.exports = { calculateGlycemicLoad, classifyGlycemicIndex };
