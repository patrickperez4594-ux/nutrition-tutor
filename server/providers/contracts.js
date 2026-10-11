const PROVIDER_METHODS = Object.freeze({
  LanguageModelProvider: Object.freeze(['generate']),
  VisionProvider: Object.freeze(['observeImage']),
  FoodDataProvider: Object.freeze(['findFoods', 'getFood']),
  GIDataProvider: Object.freeze(['findGlycemicData']),
  ProductDataProvider: Object.freeze(['getProduct']),
  RestaurantDataProvider: Object.freeze(['findRestaurantItems']),
  StoreDataProvider: Object.freeze(['findProducts']),
  EvidenceProvider: Object.freeze(['searchEvidence'])
});

function defineProvider(name, requiredMethods, implementation) {
  if (!name || !Array.isArray(requiredMethods) || requiredMethods.length === 0) {
    throw new Error('Provider name and at least one required method are required.');
  }
  for (const method of requiredMethods) {
    if (typeof implementation?.[method] !== 'function') {
      throw new Error(`${name} is missing method: ${method}`);
    }
  }
  return implementation;
}

module.exports = { PROVIDER_METHODS, defineProvider };
