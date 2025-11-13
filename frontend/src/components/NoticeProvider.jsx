import { useCallback, useMemo, useRef, useState } from 'react';
import Notice from './Notice';
import { NoticeCtx } from '../hooks/useNotice';

const MAX_TOASTS = 4;
const DEDUPE_WINDOW_MS = 1500; // same type+msg within this window won't re-add
const TYPE_EMOJI = { success: '🎉 ', error: '🛑 ', warn: '⚠️ ', info: '💡 ' };

export function NoticeProvider({ children }) {
  const [toasts, setToasts] = useState([]); // {id,type,msg,ms,ts}
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (type, msg, ms = 3000) => {
      const now = Date.now();
      // Dedupe: if same type+msg was shown very recently, skip adding
      const already = toasts.find(
        (t) => t.type === type && t.msg === msg && now - t.ts < DEDUPE_WINDOW_MS,
      );
      if (already) return already.id;

      const id = idRef.current++;
      const prefixed = typeof msg === 'string' ? `${TYPE_EMOJI[type] ?? ''}${msg}` : msg;

      setToasts((prev) => {
        const next = [...prev, { id, type, msg: prefixed, ms, ts: now }];
        // Cap stack (keep newest)
        if (next.length > MAX_TOASTS) next.shift();
        return next;
      });
      return id;
    },
    [toasts],
  );

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

      {/* Toast stack (screen readers handled inside <Notice/>) */}
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
