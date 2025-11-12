import { useEffect, useId, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
  // fun: optional beep toggles (no assets)
  beep = false,
}) {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);
  const labelId = useId();
  const descId = useId();

  useEffect(() => {
    if (open) {
      confirmRef.current?.focus();
      const onKey = (e) => {
        if (e.key === 'Escape') onCancel?.();
        if (e.key === 'Enter') onConfirm?.();
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open, onCancel, onConfirm]);

  if (!open) return null;

  function onBackdropClick(e) {
    // close only if clicking the backdrop (not the panel)
    if (e.target === e.currentTarget) onCancel?.();
  }

  async function handleConfirm() {
    if (beep) tinyBeep(880, 0.05); // A5 quick chirp
    onConfirm?.();
  }
  async function handleCancel() {
    if (beep) tinyBeep(440, 0.05); // A4 quick chirp
    onCancel?.();
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onBackdropClick}>
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
              ref={confirmRef}
              className={`btn ${danger ? 'btn--danger' : ''}`}
              onClick={handleConfirm}
            >
              {confirmLabel}
            </button>
            <button className="btn btn--ghost" onClick={handleCancel}>
              {cancelLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/** tiny retro beep with Web Audio (no external assets) */
function tinyBeep(freq = 880, dur = 0.06) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return; // Web Audio not supported

  try {
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();

    o.type = 'square';
    o.frequency.value = freq;

    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    o.connect(g).connect(ctx.destination);
    o.start(now);
    o.stop(now + dur);
  } catch {
    // Swallow audio init/play errors (e.g., autoplay policy) without logging
    return;
  }
}
