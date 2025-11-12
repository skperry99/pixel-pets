export default function LoadingCard({ title = 'Loading…' }) {
  return (
    <section className="panel panel--narrow">
      <header className="panel__header">
        <h2 className="panel__title">{title}</h2>
      </header>
      <div className="panel__body u-stack-md">
        <p className="crt-scanline blink">LOADING… PLEASE WAIT 🐾</p>
        <div aria-hidden="true" className="loading-bars">
          <div />
          <div />
          <div />
        </div>
      </div>
    </section>
  );
}
