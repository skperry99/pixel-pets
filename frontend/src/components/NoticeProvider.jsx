import { useCallback, useMemo, useRef, useState } from 'react';
import Notice from './Notice';
import { NoticeCtx } from '../hooks/useNotice';

export function NoticeProvider({ children }) {
  const [toasts, setToasts] = useState([]); // {id,type,msg,ms}
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, msg, ms = 3000) => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, type, msg, ms }]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      notify: {
        info: (m, ms) => push('info', m, ms),
        success: (m, ms) => push('success', m, ms),
        error: (m, ms) => push('error', m, ms),
        warn: (m, ms) => push('warn', m, ms),
      },
    }),
    [push],
  );

  return (
    <NoticeCtx.Provider value={api}>
      {children}

      {/* Toast stack (screen readers will get per-notice aria-live from Notice) */}
      <div className="toast-container is-top" aria-live="polite">
        {toasts.map((t) => (
          <Notice
            key={t.id}
            type={t.type}
            autoHideMs={t.ms}
            onClose={() => remove(t.id)}
            className="pixel-toast"
          >
            {t.msg}
          </Notice>
        ))}
      </div>
    </NoticeCtx.Provider>
  );
}
