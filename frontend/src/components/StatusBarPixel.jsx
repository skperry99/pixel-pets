export default function StatusBarPixel({
  label, // "Fullness" | "Happiness" | "Energy"
  value = 0, // 0..100
  kind = "fullness", // "fullness" | "happiness" | "energy"
}) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const low = v < 25; // show danger style under 25%

  return (
    <div
      className={`status-bar ${kind} ${low ? "low" : ""}`}
      role="progressbar"
      // aria-label={label}
      // aria-valuemin={0}
      // aria-valuemax={100}
      // aria-valuenow={v}
      title={`${label}: ${v}%`}
    >
      <div className="status-fill" style={{ width: `${v}%` }} />
      {/* percentage overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-color)",
          fontSize: "10px",
          textShadow: "1px 1px #000",
          pointerEvents: "none",
        }}
      >
        {label}: {v}%
      </div>
    </div>
  );
}
