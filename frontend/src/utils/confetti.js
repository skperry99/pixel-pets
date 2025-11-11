let _confettiPromise;

/** Lazy-load the confetti function; caches result. */
function loadConfetti() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!_confettiPromise) {
    _confettiPromise = import('canvas-confetti').then((m) => m.default || m).catch(() => null); // cache a null on failure so we don't retry forever
  }
  return _confettiPromise;
}

/** Helper: honor prefers-reduced-motion */
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fire your existing confetti burst with the same config.
 * Optionally pass overrides, e.g. { particleCount: 80 }.
 */
export function burstConfetti(overrides = {}) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;

  loadConfetti().then((confetti) => {
    if (!confetti) return;

    const end = Date.now() + 600;
    const colors = ['#ffcc00', '#ffec27', '#ff66a3', '#00ffcc', '#ffffff', '#000000'];

    const frame = () => {
      confetti({
        particleCount: 50,
        startVelocity: 45,
        spread: 70,
        origin: { y: 0.6 },
        colors,
        ...overrides,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };

    frame();
  });
}
