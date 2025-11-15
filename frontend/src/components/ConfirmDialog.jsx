// src/components/ConfirmDialog.jsx

import { useEffect, useId, useRef } from 'react';

/**
 * ConfirmDialog
 *
 * Modal confirmation dialog with optional retro "beep" feedback.
 *
 * Accessibility:
 * - Uses role="dialog" with aria-modal, aria-labelledby, aria-describedby.
 * - Auto-focuses the primary (confirm) button when opened.
 * - Keyboard: Escape → cancel, Enter → confirm (while open).
 *
 * Props:
 * - open          (bool)   : Controls visibility; returns null if false.
 * - title         (string) : Dialog title text.
 * - message       (string) : Body/description text.
 * - confirmLabel  (string) : Confirm button label.
 * - cancelLabel   (string) : Cancel button label.
 * - danger        (bool)   : If true, confirm button uses danger styling.
 * - onConfirm     (fn)     : Called when user confirms.
 * - onCancel      (fn)     : Called when user cancels or dismisses.
 * - beep          (bool)   : If true, plays a tiny retro beep on confirm/cancel.
 */
export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
  beep = false,
}) {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);
  const labelId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;

    // Focus the primary action when dialog opens
    confirmRef.current?.focus();

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onCancel?.();
      } else if (e.key === 'Enter') {
        onConfirm?.();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  function handleBackdropClick(e) {
    // Only close if the click is on the backdrop, not inside the dialog panel
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  }

  async function handleConfirm() {
    if (beep) tinyBeep(880, 0.05); // A5 short chirp
    onConfirm?.();
  }

  async function handleCancel() {
    if (beep) tinyBeep(440, 0.05); // A4 short chirp
    onCancel?.();
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className="panel panel--narrow dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={descId}
        ref={dialogRef}
      >
        <header className="panel__header">
          <h2 id={labelId} className="panel__title">
            {title}
          </h2>
        </header>

        <div className="panel__body u-stack-md">
          <p id={descId}>{message}</p>

          <div className="u-actions-row">
            <button
              type="button"
              ref={confirmRef}
              className={`btn ${danger ? 'btn--danger' : ''}`.trim()}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleCancel}
            >
              {cancelLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * tinyBeep
 *
 * Minimal Web Audio beep helper for retro feedback.
 * - Uses a square wave oscillator.
 * - Swallows audio init/play errors (e.g., autoplay policy) silently.
 */
function tinyBeep(freq = 880, dur = 0.06) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  try {
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.value = freq;

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur);
  } catch {
    // Ignore Web Audio errors without logging
    return;
  }
}
