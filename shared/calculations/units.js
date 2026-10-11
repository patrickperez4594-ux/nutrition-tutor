const KG_PER_LB = 0.45359237;
const CM_PER_INCH = 2.54;
const KJ_PER_KCAL = 4.184;

function finite(name, value) {
  if (!Number.isFinite(value)) throw new Error(`${name} must be a finite number.`);
  return value;
}

const lbToKg = (value) => finite('value', value) * KG_PER_LB;
const kgToLb = (value) => finite('value', value) / KG_PER_LB;
const inchToCm = (value) => finite('value', value) * CM_PER_INCH;
const cmToInch = (value) => finite('value', value) / CM_PER_INCH;
const kcalToKj = (value) => finite('value', value) * KJ_PER_KCAL;
const kjToKcal = (value) => finite('value', value) / KJ_PER_KCAL;

module.exports = { lbToKg, kgToLb, inchToCm, cmToInch, kcalToKj, kjToKcal };
