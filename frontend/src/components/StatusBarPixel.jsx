// src/components/StatusBarPixel.jsx

/**
 * StatusBarPixel
 *
 * Accessible retro-style status bar used for pet stats.
 * - Clamps value into [0–100].
 * - Adds visual + ARIA hints when value is “low”.
 *
 * Props:
 * - label       (string): Human-friendly label, e.g. "Fullness"
 * - value       (number): Stat value in [0–100]
 * - kind        (string): Visual variant, e.g. "fullness" | "happiness" | "energy"
 * - showPercent (bool)  : If true, renders "Label: 42%" inside the bar
 * - showLowHint (bool)  : If true and value < 25, shows a tiny ⚠️ hint
 * - compact     (bool)  : Slightly shorter bar height if true
 */
export default function StatusBarPixel({
  label = 'Fullness',
  value = 0,
  kind = 'fullness',
  showPercent = true,
  showLowHint = true,
  compact = false,
}) {
  // Normalize and clamp into [0, 100]
  const vNum = Number.isFinite(value) ? value : 0;
  const v = Math.max(0, Math.min(100, Math.round(vNum)));
  const low = v < 25;

  // Example: “Fullness 24 percent (low)”
  const valueText = `${label} ${v} percent${low ? ' (low)' : ''}`;

  const classes = [
    'status-bar',
    `status-bar--${kind}`, // BEM modifier: fullness / happiness / energy
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
      data-kind={kind} // handy hooks for CSS/analytics
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
