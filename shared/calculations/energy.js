const ACTIVITY_FACTOR = Object.freeze({
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTREMELY_ACTIVE: 1.9
});

function positiveNumber(name, value) {
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be a positive number.`);
  return value;
}

function calculateMifflinStJeor({ sex, weightKg, heightCm, ageYears }) {
  positiveNumber('weightKg', weightKg);
  positiveNumber('heightCm', heightCm);
  positiveNumber('ageYears', ageYears);
  if (!['male', 'female'].includes(sex)) throw new Error('sex must be male or female for this equation.');
  const base = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return sex === 'male' ? base + 5 : base - 161;
}

function calculateTdee({ bmr, activityFactor }) {
  positiveNumber('bmr', bmr);
  positiveNumber('activityFactor', activityFactor);
  return bmr * activityFactor;
}

module.exports = { ACTIVITY_FACTOR, calculateMifflinStJeor, calculateTdee };
