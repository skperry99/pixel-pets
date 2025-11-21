// src/components/ConfirmAction.jsx

import { useEffect, useId, useRef } from 'react';

/**
 * ConfirmAction
 *
 * Small inline confirmation UI (used inside panels or lists).
 *
 * Accessibility:
 * - Uses role="alertdialog" with label/description wiring.
 * - Auto-focuses the primary (confirm) button by default.
 * - Keyboard: Enter → confirm, Esc → cancel.
 *
 * Props:
 * - confirmPrompt      (string): Text shown above the buttons.
 * - confirmLabel       (string): Label for the confirm button.
 * - cancelLabel        (string): Label for the cancel button.
 * - onConfirm          (fn)    : Callback when user confirms.
 * - onCancel           (fn)    : Callback when user cancels.
 * - busy               (bool)  : Disables actions + shows “Deleting...” text.
 * - className          (string): Extra classes for the outer wrapper.
 * - danger             (bool)  : Renders confirm button as "danger" style.
 * - autoFocusConfirm   (bool)  : If true, focus confirm button on mount.
 */
export default function ConfirmAction({
  confirmPrompt = 'Are you sure?',
  confirmLabel = 'Confirm delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  busy = false,
  className = '',
  danger = true,
  autoFocusConfirm = true,
}) {
  const confirmRef = useRef(null);
  const promptId = useId();

  // Focus primary action (confirm) when the component mounts
  useEffect(() => {
    if (autoFocusConfirm) {
      confirmRef.current?.focus();
    }
  }, [autoFocusConfirm]);

  function handleKeyDown(e) {
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
      onKeyDown={handleKeyDown}
    >
      <div className="panel__body u-stack-sm">
        <p id={promptId}>{confirmPrompt}</p>

        <div className="u-actions-row">
          <button
            ref={confirmRef}
            className={`btn ${danger ? 'btn--danger' : ''}`.trim()}
            onClick={onConfirm}
            disabled={busy}
          >
            {busy ? 'Deleting...' : confirmLabel}
          </button>

          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
