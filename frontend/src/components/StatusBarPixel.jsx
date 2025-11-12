export default function StatusBarPixel({
  label = 'Fullness', // "Fullness" | "Happiness" | "Energy"
  value = 0, // 0..100
  kind = 'fullness', // "fullness" | "happiness" | "energy"
}) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const low = v < 25; // show danger style under 25%

  return (
    <div
      className={`status-bar ${kind} ${low ? 'low' : ''}`}
      role="progressbar"
      // aria-label={label}
      // aria-valuenow={v}
      // aria-valuemin={0}
      // aria-valuemax={100}
      title={`${label}: ${v}%`}
    >
      <div className="status-fill" style={{ width: `${v}%` }} />
      <div className="status-label">
        {label}: {v}%
      </div>
    </div>
  );
}
