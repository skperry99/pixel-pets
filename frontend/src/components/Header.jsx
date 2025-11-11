export default function Header({
  title = "PIXEL PETS",
  subtitle = "✨ Because every pixel deserves a little love. 🐾",
  children,
}) {
  return (
    <section className="panel header-panel">
      <div className="panel__body u-stack-sm">
        <h1 className="header-title pulse">🐾 {title}</h1>
        {subtitle && <p className="header-subtitle">{subtitle}</p>}
        {/* Optional slot for actions/filters */}
        {children}
      </div>
    </section>
  );
}
