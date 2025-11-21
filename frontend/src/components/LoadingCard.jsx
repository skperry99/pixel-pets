// src/components/LoadingCard.jsx

/**
 * LoadingCard
 *
 * Small reusable loading panel for in-between states.
 *
 * Usage:
 * - Drop into pages while data is being fetched.
 * - Customize `title` to describe what’s loading.
 */
export default function LoadingCard({ title = 'Loading…' }) {
  return (
    <section className="panel panel--narrow" aria-busy="true">
      <header className="panel__header">
        <h2 className="panel__title">{title}</h2>
      </header>

      <div className="panel__body u-stack-md">
        <p className="crt-scanline blink">LOADING… PLEASE WAIT 🐾</p>

        {/* Decorative loading animation (hidden from screen readers) */}
        <div aria-hidden="true" className="loading-bars">
          <div />
          <div />
          <div />
        </div>
      </div>
    </section>
  );
}
