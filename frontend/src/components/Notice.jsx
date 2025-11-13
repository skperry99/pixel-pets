import { useEffect, useRef, useState } from 'react';

const ICON = {
  success: '✅',
  error: '❌',
  warn: '⚠️',
  info: '🛈',
};

export default function Notice({
  type = 'info', // 'success' | 'error' | 'info' | 'warn'
  children, // message text or JSX
  onClose, // () => void
  autoHideMs, // number (e.g., 3000)
  className = '',
}) {
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const rootRef = useRef(null);

  // a11y roles
  const isError = type === 'error';
  const role = isError ? 'alert' : 'status';
  const live = isError ? 'assertive' : 'polite';
  const icon = ICON[type] ?? ICON.info;
  const variantClass = `notice--${type}`;

  // auto-hide with pause-on-hover
  useEffect(() => {
    if (!autoHideMs || !onClose) return;
    if (paused) return; // don't count down when paused
    timerRef.current = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(timerRef.current);
  }, [autoHideMs, onClose, paused]);

  // ESC to dismiss (only if onClose provided)
  useEffect(() => {
    if (!onClose) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={rootRef}
      role={role}
      aria-live={live}
      aria-atomic="true"
      className={`panel notice ${variantClass} ${className}`.trim()}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="notice__row">
        <span className="notice__icon" aria-hidden="true">
          {icon}
        </span>
        <div className="notice__body">{children}</div>
        {onClose && (
          <button
            type="button"
            className="btn btn--ghost notice__dismiss"
            onClick={onClose}
            aria-label="Dismiss notification"
          >
            dismiss
          </button>
        )}
      </div>
    </div>
  );
}
