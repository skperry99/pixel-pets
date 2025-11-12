import { useEffect } from 'react';

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
  useEffect(() => {
    if (!autoHideMs || !onClose) return;
    const t = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose]);

  const role = 'status';
  const live = type === 'error' ? 'assertive' : 'polite';
  const icon = ICON[type] ?? ICON.info;
  const variantClass = `notice--${type}`;

  return (
    <div
      role={role}
      aria-live={live}
      className={`panel notice ${variantClass} ${className}`.trim()}
    >
      <div className="notice__row">
        <span className="notice__icon">{icon}</span>
        <div className="notice__body">{children}</div>
        {onClose && (
          <button className="btn btn--ghost notice__dismiss" onClick={onClose}>
            dismiss
          </button>
        )}
      </div>
    </div>
  );
}
