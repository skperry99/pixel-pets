import { useEffect } from "react";

const palette = {
  info: {
    bg: "var(--panel-color)",
    fg: "var(--text-color)",
    border: "var(--border-color)",
  },
  success: {
    bg: "var(--success-color)",
    fg: "#000",
    border: "var(--border-color)",
  },
  error: {
    bg: "var(--danger-color)",
    fg: "#fff",
    border: "var(--border-color)",
  },
  warn: {
    bg: "var(--accent-color)",
    fg: "#000",
    border: "var(--border-color)",
  },
};

export default function Notice({
  type = "info", // 'success' | 'error' | 'info' | 'warn'
  children, // message text or JSX
  onClose, // () => void
  autoHideMs, // number (e.g., 3000)
  className = "",
}) {
  useEffect(() => {
    if (!autoHideMs || !onClose) return;
    const t = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onClose]);

  const c = palette[type] ?? palette.info;

  return (
    <div
      role="status"
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`panel ${className}`}
      style={{
        maxWidth: 720,
        marginTop: "0.5rem",
        backgroundColor: c.bg,
        color: c.fg,
        borderColor: c.border,
        borderWidth: 4,
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ textShadow: "1px 1px #000" }}>
          {type === "success"
            ? "✅"
            : type === "error"
            ? "❌"
            : type === "warn"
            ? "⚠️"
            : "🛈"}
        </span>
        <div style={{ flex: 1 }}>{children}</div>
        {onClose && (
          <button onClick={onClose} style={{ fontSize: 10 }}>
            dismiss
          </button>
        )}
      </div>
    </div>
  );
}
