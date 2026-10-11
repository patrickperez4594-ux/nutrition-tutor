import { useState } from 'react';
export default function SaveProgressDialog({ onSave, onClose }) {
  const [policy, setPolicy] = useState('30d');
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="save-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <p className="eyebrow">Your choice</p>
        <h2 id="save-title">Save progress on this device?</h2>
        <p className="muted">Your chat will stay in this browser/device. Clearing browser or app data can remove it.</p>
        <div className="policy-list">
          {[['7d','Review after 7 days','We’ll ask what you want to do — nothing is deleted automatically.'],['30d','Review after 30 days','We’ll ask before anything changes.'],['indefinite','Keep until I delete it','No review date. You can delete it manually anytime.']].map(([value,label,copy]) => (
            <label className="policy-card" key={value}>
              <input type="radio" name="policy" value={value} checked={policy===value} onChange={(e)=>setPolicy(e.target.value)} />
              <span><strong>{label}</strong><small>{copy}</small></span>
            </label>
          ))}
        </div>
        <button className="primary-button wide" onClick={() => onSave(policy)}>Save Progress</button>
      </div>
    </div>
  );
}
