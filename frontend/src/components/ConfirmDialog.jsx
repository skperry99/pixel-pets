import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) {
      // simple focus management: focus the primary action
      confirmRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-backdrop" role="presentation">
      <section
        className="panel panel--narrow dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        ref={dialogRef}
      >
        <header className="panel__header">
          <h2 id="confirm-title" className="panel__title">
            {title}
          </h2>
        </header>
        <div className="panel__body u-stack-md">
          <p id="confirm-message">{message}</p>
          <div className="u-actions-row">
            <button
              ref={confirmRef}
              className={`btn ${danger ? 'btn--danger' : ''}`}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
            <button className="btn btn--ghost" onClick={onCancel}>
              {cancelLabel}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
