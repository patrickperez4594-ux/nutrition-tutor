import { useEffect, useRef } from 'react';

// Both shared dialogs contain native buttons and radio inputs. Keep keyboard focus
// inside the modal and return it to the opener without changing saved-data behavior.
export default function useDialogFocus(onClose, active = true) {
  const dialogRef = useRef(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!active || !dialog) return undefined;
    const opener = document.activeElement;
    const controls = () => Array.from(dialog.querySelectorAll(
      'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]'
    )).filter((element) => !element.hidden && element.type !== 'hidden');
    const focusFirst = () => controls()[0]?.focus();
    focusFirst();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === 'Tab') {
        const items = controls();
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    const containFocus = (event) => {
      if (!dialog.contains(event.target)) focusFirst();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', containFocus);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', containFocus);
      if (opener?.isConnected) opener.focus();
    };
  }, [active]);

  return dialogRef;
}
