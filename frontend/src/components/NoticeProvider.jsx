import { useCallback, useMemo, useState } from "react";
import Notice from "./Notice";
import { NoticeCtx } from "../hooks/useNotice";

let nextId = 1;

export function NoticeProvider({ children }) {
  const [toasts, setToasts] = useState([]); // {id,type,msg,ms}

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((type, msg, ms = 3000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, type, msg, ms }]);
    return id;
  }, []);

  const api = useMemo(
    () => ({
      notify: {
        info: (m, ms) => push("info", m, ms),
        success: (m, ms) => push("success", m, ms),
        error: (m, ms) => push("error", m, ms),
        warn: (m, ms) => push("warn", m, ms),
      },
    }),
    [push]
  );

  return (
    <NoticeCtx.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        style={{
          position: "fixed",
          right: 16,
          top: 16,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
        }}
      >
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
