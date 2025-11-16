// src/components/NoticeProvider.jsx

import { useCallback, useMemo, useRef, useState } from 'react';
import Notice from './Notice';
import { NoticeCtx } from '../hooks/useNotice';

/**
 * Global toast/notice provider for the app.
 *
 * - Exposes a `notify` API via context (info/success/error/warn).
 * - Deduplicates identical messages within a small time window.
 * - Caps the number of visible toasts to avoid overwhelming the UI.
 */
const MAX_TOASTS = 4; // maximum number of visible toasts
const DEDUPE_WINDOW_MS = 1500; // same type+msg within this window won't re-add

// Optional emoji prefixes to give each toast type a retro flair
const TYPE_EMOJI = {
  success: '🎉 ',
  error: '🛑 ',
  warn: '⚠️ ',
  info: '💡 ',
};

export function NoticeProvider({ children }) {
  // Toast shape: { id, type, msg, ms, ts }
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /**
   * Add a new toast.
   *
   * @param {'success'|'error'|'warn'|'info'} type
   * @param {string | React.ReactNode} msg
   * @param {number} ms - auto-hide duration in ms (default 3000)
   * @returns {number} id of the toast (existing or new)
   */
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

  // Memoized context value to avoid unnecessary re-renders
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

      {/* Toast stack; individual <Notice> handles its own lifecycle & SR behavior */}
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
