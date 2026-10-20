import en from './en';

const catalogs = { en };

export function translate(catalog, key, vars = {}) {
  const template = catalog[key];
  if (typeof template !== 'string') return key;
  return template.replace(/\{(\w+)\}/g, (match, name) => (
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match
  ));
}

export function getCatalog(language = 'en') {
  return catalogs[language] || catalogs.en;
}

export function t(key, vars) {
  return translate(catalogs.en, key, vars);
}

export const AVAILABLE_LANGUAGES = Object.freeze(Object.keys(catalogs));
