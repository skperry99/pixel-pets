import confetti from "canvas-confetti";

export function burstConfetti() {
  const end = Date.now() + 600;
  const colors = ["#ffcc00", "#ffec27", "#ff66a3", "#00ffcc", "#ffffff", "#000000"];
  (function frame() {
    confetti({
      particleCount: 50,
      startVelocity: 45,
      spread: 70,
      origin: { y: 0.6 },
      colors
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
