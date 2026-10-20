import { useId, useState } from 'react';
import { RESTRICTION_KINDS, isRestrictionHard } from '../domain/profile';
import { t } from '../i18n';

export function ChoiceGroup({ legend, name, options, value, onChange, labelFor, hint }) {
  return (
    <fieldset className="kefi-fieldset">
      <legend>{legend}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="choice-grid">
        {options.map((option) => (
          <label className="choice-pill" key={option || 'unset'}>
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
            <span>{labelFor(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function MultiChoiceGroup({ legend, options, values, onChange, labelFor, hint }) {
  const toggle = (option) => onChange(values.includes(option) ? values.filter((v) => v !== option) : [...values, option]);
  return (
    <fieldset className="kefi-fieldset">
      <legend>{legend}</legend>
      {hint && <p className="field-hint">{hint}</p>}
      <div className="choice-grid">
        {options.map((option) => (
          <label className="choice-pill" key={option}>
            <input type="checkbox" checked={values.includes(option)} onChange={() => toggle(option)} />
            <span>{labelFor(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SelectField({ label, value, options, onChange, labelFor }) {
  const id = useId();
  return (
    <div className="kefi-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option || 'unset'} value={option}>{labelFor(option)}</option>)}
      </select>
    </div>
  );
}

export function TextField({ label, value, onChange, hint, multiline = false, error, inputMode }) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined;
  const props = {
    id,
    value,
    onChange: (e) => onChange(e.target.value),
    'aria-describedby': describedBy,
    'aria-invalid': error ? true : undefined,
    inputMode
  };
  return (
    <div className="kefi-field">
      <label htmlFor={id}>{label}</label>
      {hint && <p id={hintId} className="field-hint">{hint}</p>}
      {multiline ? <textarea rows={2} {...props} /> : <input type="text" {...props} />}
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

function makeId() {
  if (window.crypto?.randomUUID) return window.crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Allergies and must-avoid items are shown with a text badge, never color alone (spec §33.3).
export function RestrictionEditor({ restrictions, onChange }) {
  const [label, setLabel] = useState('');
  const [kind, setKind] = useState('allergy');
  const labelId = useId();
  const kindId = useId();

  const add = () => {
    const clean = label.trim();
    if (!clean) return;
    onChange([...restrictions, { id: makeId(), label: clean, kind }]);
    setLabel('');
  };

  return (
    <fieldset className="kefi-fieldset restriction-editor">
      <legend>{t('restriction.heading')}</legend>
      <p className="field-hint">{t('restriction.allergyNote')}</p>
      {restrictions.length === 0 ? (
        <p className="muted">{t('restriction.empty')}</p>
      ) : (
        <ul className="restriction-list">
          {restrictions.map((item) => (
            <li key={item.id} className={`restriction-item${isRestrictionHard(item.kind) ? ' hard' : ''}`}>
              <span>
                <strong>{item.label}</strong>
                <span className="restriction-kind">{t(`restriction.kind.${item.kind}`)}</span>
              </span>
              <button type="button" className="text-button small" aria-label={t('restriction.remove', { label: item.label })} onClick={() => onChange(restrictions.filter((r) => r.id !== item.id))}>×</button>
            </li>
          ))}
        </ul>
      )}
      <div className="restriction-add">
        <div className="kefi-field">
          <label htmlFor={labelId}>{t('restriction.labelField')}</label>
          <input
            id={labelId}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
        </div>
        <div className="kefi-field">
          <label htmlFor={kindId}>{t('restriction.kindField')}</label>
          <select id={kindId} value={kind} onChange={(e) => setKind(e.target.value)}>
            {RESTRICTION_KINDS.map((k) => <option key={k} value={k}>{t(`restriction.kind.${k}`)}</option>)}
          </select>
        </div>
        <button type="button" className="secondary-button" onClick={add} disabled={!label.trim()}>{t('restriction.add')}</button>
      </div>
    </fieldset>
  );
}
