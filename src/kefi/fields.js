import { useEffect, useId, useRef } from 'react';
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

export const EMPTY_PENDING_RESTRICTION = Object.freeze({ label: '', kind: '' });

// Resolves a half-entered restriction before its form is left, so an allergy, intolerance, or
// avoided food is never silently dropped: a complete entry is added, an entry missing its type
// blocks (ok: false), and an empty one is ignored.
export function resolvePendingRestriction(restrictions, pending) {
  const label = String(pending?.label ?? '').trim();
  if (!label) return { ok: true, restrictions, added: null };
  if (!pending.kind) return { ok: false, restrictions, added: null };
  const added = { id: makeId(), label, kind: pending.kind };
  return { ok: true, restrictions: [...restrictions, added], added };
}

// Allergies and must-avoid items are shown with a text badge, never color alone (spec §33.3).
// The half-entered item (`pending`) is owned by the parent so it can be resolved on save or next.
export function RestrictionEditor({ restrictions, onChange, pending, onPendingChange, error = '' }) {
  const { label, kind } = pending;
  const labelId = useId();
  const kindId = useId();
  const addHintId = useId();
  const errorId = useId();
  const kindRef = useRef(null);
  const canAdd = Boolean(label.trim() && kind);

  // The only blocking error is a missing type, so take the user straight to it.
  useEffect(() => {
    if (error) kindRef.current?.focus();
  }, [error]);

  const add = () => {
    const resolved = resolvePendingRestriction(restrictions, pending);
    if (!resolved.added) return;
    onChange(resolved.restrictions);
    onPendingChange(EMPTY_PENDING_RESTRICTION);
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
            onChange={(e) => onPendingChange({ label: e.target.value, kind })}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          />
        </div>
        <div className="kefi-field">
          <label htmlFor={kindId}>{t('restriction.kindField')}</label>
          {/* No default kind: an allergy, an intolerance, and a religious/ethical/personal restriction
              are treated differently, so the user always picks one rather than inheriting "allergy". */}
          <select
            id={kindId}
            ref={kindRef}
            value={kind}
            onChange={(e) => onPendingChange({ label, kind: e.target.value })}
            required
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          >
            <option value="" disabled>{t('restriction.kindPlaceholder')}</option>
            {RESTRICTION_KINDS.map((k) => <option key={k} value={k}>{t(`restriction.kind.${k}`)}</option>)}
          </select>
        </div>
        <button type="button" className="secondary-button" onClick={add} disabled={!canAdd} aria-describedby={canAdd ? undefined : addHintId}>{t('restriction.add')}</button>
      </div>
      {!canAdd && <p id={addHintId} className="field-hint">{t('restriction.addHint')}</p>}
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </fieldset>
  );
}
