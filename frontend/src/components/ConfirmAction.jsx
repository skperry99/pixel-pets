import { useEffect, useId, useRef } from 'react';

/**
 * Inline confirm UI (can be used inside panels or lists).
 * - Accessible: role="alertdialog", labeled/described, focus on primary
 * - Keyboard: Enter confirms, Esc cancels
 */
export default function ConfirmAction({
  confirmPrompt = 'Are you sure?',
  confirmLabel = 'Confirm delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
  className = '',
  danger = true, // renders confirm as danger button by default
  autoFocusConfirm = true, // focus first action on mount
}) {
  const confirmRef = useRef(null);
  const promptId = useId();

  useEffect(() => {
    if (autoFocusConfirm) confirmRef.current?.focus();
  }, [autoFocusConfirm]);

  function onKeyDown(e) {
    if (busy) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      onConfirm?.();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  }

  return (
    <div
      className={`confirm panel ${className}`.trim()}
      role="alertdialog"
      aria-labelledby={promptId}
      aria-modal="false"
      onKeyDown={onKeyDown}
    >
      <div className="panel__body u-stack-sm">
        <p id={promptId}>{confirmPrompt}</p>

        <div className="u-actions-row">
          <button
            ref={confirmRef}
            className={`btn ${danger ? 'btn--danger' : ''}`}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting...' : confirmLabel}
          </button>
          <button className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
