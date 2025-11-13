export default function StatusBarPixel({
  label = 'Fullness', // "Fullness" | "Happiness" | "Energy"
  value = 0, // 0..100
  kind = 'fullness', // "fullness" | "happiness" | "energy"
  showPercent = true, // show numeric % inside the bar
  showLowHint = true, // show a tiny warning when <25%
  compact = false, // slightly shorter bar height if true
}) {
  const vNum = Number.isFinite(value) ? value : 0;
  const v = Math.max(0, Math.min(100, Math.round(vNum)));
  const low = v < 25;

  // e.g., “Fullness 24 percent (low)”
  const valueText = `${label} ${v} percent${low ? ' (low)' : ''}`;

  const classes = [
    'status-bar',
    `status-bar--${kind}`, // aligns with your newer BEM modifiers
    low ? 'status-bar--low' : '',
    compact ? 'status-bar--compact' : '',
  ]
    .join(' ')
    .trim();

  return (
    <div
      className={classes}
      role="progressbar"
      aria-label={label}
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={valueText}
      title={`${label}: ${v}%`}
      data-kind={kind} // handy hook for CSS/analytics
      data-low={low || undefined}
    >
      <div className="status-fill" style={{ width: `${v}%` }} />
      <div className="status-label">{showPercent ? `${label}: ${v}%` : label}</div>

      {showLowHint && low && (
        <span className="status-hint" aria-hidden="true">
          ⚠️ low
        </span>
      )}
    </div>
  );
}
