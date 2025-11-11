// Cache the dynamic import so the library is loaded only once.
let _confettiPromise;

/** Lazy-load the confetti function (no-op during SSR/build). */
function loadConfetti() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!_confettiPromise) {
    _confettiPromise = import('canvas-confetti').then((m) => m.default || m);
  }
  return _confettiPromise;
}

/**
 * Fire your existing confetti burst with the same config.
 * You can pass partial overrides if you want (e.g., { particleCount: 80 }).
 */
export function burstConfetti(overrides = {}) {
  // Skip gracefully in non-browser environments.
  if (typeof window === 'undefined') return;

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
