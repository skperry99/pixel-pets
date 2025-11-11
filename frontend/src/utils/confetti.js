// Cache the dynamic import so the library loads only once.
let _confettiPromise;

/** Lazy-load the confetti function; caches result and fails safe. */
function loadConfetti() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!_confettiPromise) {
    _confettiPromise = import('canvas-confetti').then((m) => m.default || m).catch(() => null); // cache null on failure so we don't retry forever
  }
  return _confettiPromise;
}

/** Respect users who prefer reduced motion. */
function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Fire a short celebratory burst.
 * Pass partial overrides if needed.
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

/** Bigger celebration with staggered bursts. */
export function megaConfetti() {
  if (typeof window === 'undefined' || prefersReducedMotion()) return;

  loadConfetti().then((confetti) => {
    if (!confetti) return;
    const colors = ['#ffcc00', '#ffec27', '#ff66a3', '#00ffcc', '#ffffff', '#000000'];
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors });
    setTimeout(() => confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 }, colors }), 150);
    setTimeout(
      () => confetti({ particleCount: 160, spread: 120, origin: { y: 0.6 }, colors }),
      300,
    );
  });
}
