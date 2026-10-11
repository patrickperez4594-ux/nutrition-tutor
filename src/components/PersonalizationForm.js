import { useState } from 'react';
import { emptyPersonalization, normalizePersonalization } from '../lib/personalization';

const goals = [
  ['nutrition basics', 'Nutrition basics'],
  ['balanced meals', 'Balanced meals'],
  ['protein', 'Protein'],
  ['sports nutrition', 'Sports nutrition'],
  ['weight-related education', 'Weight-related education'],
  ['other', 'Something else']
];

export default function PersonalizationForm({ onComplete, onCancel }) {
  const [form, setForm] = useState(emptyPersonalization());
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  return (
    <section className="panel personalization-panel">
      <button className="back-link" onClick={onCancel}>← Back</button>
      <p className="eyebrow">Optional personalization</p>
      <h1>Help me teach in a way that works for you.</h1>
      <p className="muted">Everything here is optional. You can start without sharing sensitive information.</p>

      <fieldset>
        <legend>What do you want help with?</legend>
        <div className="choice-grid">
          {goals.map(([value, label]) => (
            <label className="choice-pill" key={value}>
              <input type="radio" name="goal" value={value} checked={form.goal === value} onChange={(e) => update('goal', e.target.value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>How should I teach you?</legend>
        <div className="choice-grid three">
          {[['simple','Simple and brief'],['step-by-step','Step-by-step'],['detailed','Detailed']].map(([value,label]) => (
            <label className="choice-pill" key={value}>
              <input type="radio" name="learningStyle" value={value} checked={form.learningStyle === value} onChange={(e) => update('learningStyle', e.target.value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field-label">
        Food preferences or restrictions <span>(optional)</span>
        <textarea value={form.foodContext} onChange={(e) => update('foodContext', e.target.value)} placeholder="Example: vegetarian, halal, food allergies, foods I avoid..." />
      </label>
      <label className="field-label">
        Anything else I should keep in mind? <span>(optional)</span>
        <textarea value={form.otherContext} onChange={(e) => update('otherContext', e.target.value)} placeholder="Example: budget, culture, cooking experience, accessibility needs..." />
      </label>

      <button className="primary-button wide" onClick={() => onComplete(normalizePersonalization(form))}>Start My Tutor</button>
    </section>
  );
}
