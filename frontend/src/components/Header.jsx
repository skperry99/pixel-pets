// src/components/Header.jsx
// Generic page header/panel.
// - Lets each page set a title + subtitle
// - Can render as <header> (default) or any semantic wrapper via `as`
// - Avoids double <h1> when used with NavBar by toggling isPageTitle

export default function Header({
  title = 'PIXEL PETS',
  subtitle = '✨ Because every pixel deserves a little love. 🐾',
  children,
  /** If true, use <h1>; otherwise use <h2> to avoid double-H1 with NavBar */
  isPageTitle = false,
  /** Fun toggle: show a pixel paw before the title */
  showPaw = true,
  /** Render as <header> by default for semantics */
  as: asProp = 'header',
}) {
  // Keep this pattern so ESLint sees the tag as used
  const AsTag = asProp;
  const HeadingTag = isPageTitle ? 'h1' : 'h2';

  return (
    <AsTag className="panel header-panel">
      <div className="panel__body u-stack-sm">
        <HeadingTag className="header-title pulse">
          {showPaw ? '🐾 ' : ''}
          {title}
        </HeadingTag>

        {subtitle && <p className="header-subtitle">{subtitle}</p>}

        {/* Optional slot for actions/filters/buttons */}
        {children}
      </div>
    </AsTag>
  );
}
