const VALID_LEARNING_STYLES = new Set(['', 'simple', 'step-by-step', 'detailed']);

export function emptyPersonalization() {
  return { goal: '', learningStyle: '', foodContext: '', otherContext: '' };
}

export function normalizePersonalization(value = {}) {
  const learningStyle = String(value.learningStyle || '').trim();
  return {
    goal: String(value.goal || '').trim(),
    learningStyle: VALID_LEARNING_STYLES.has(learningStyle) ? learningStyle : '',
    foodContext: String(value.foodContext || '').trim(),
    otherContext: String(value.otherContext || '').trim()
  };
}
