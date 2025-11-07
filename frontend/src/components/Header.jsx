export default function Header({
  title = "PIXEL PETS",
  subtitle = "✨ Because every pixel deserves a little love. 🐾",
  children,
}) {
  return (
    <header className="panel" style={{ maxWidth: 720 }}>
      <h1 className="pulse" aria-label={title}>🐾 {title}</h1>
      {subtitle && (
        <p
          style={{
            color: "var(--accent-bright)",
            marginBottom: "0.75rem",
            textShadow: "2px 2px #000",
          }}
        >
          {subtitle}
        </p>
      )}

      {/* For future use. */}
      {children}
    </header>
  );
}