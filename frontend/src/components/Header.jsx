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
  const AsTag = asProp; // eslint will see this as used
  const HeadingTag = isPageTitle ? 'h1' : 'h2';

  return (
    <AsTag className="panel header-panel">
      <div className="panel__body u-stack-sm">
        <HeadingTag className="header-title pulse">
          {showPaw ? '🐾 ' : ''}
          {title}
        </HeadingTag>

        {subtitle && <p className="header-subtitle">{subtitle}</p>}
        {/* Optional slot for actions/filters */}
        {children}
      </div>
    </AsTag>
  );
}
