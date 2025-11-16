// src/components/Footer.jsx
// Site footer for Pixel Pets.
// - Fun tagline + theme-y credit line
// - Caffeine & nostalgia nod
// - LaunchCode shout out
// - Auto-updates year

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-tagline">✨ “Because every pixel deserves a little love.” 🐾</p>

      <p className="footer-credit">Powered by caffeine, nostalgia, and a lot of tiny pixel pals.</p>

      <p className="footer-credit">
        Built as a LaunchCode capstone by <span className="footer-accent">Sarah</span> · © {year}
      </p>
    </footer>
  );
}
