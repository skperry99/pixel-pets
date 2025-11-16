// src/components/Footer.jsx
// Site footer for Pixel Pets.
// - Shows a fun tagline and credits
// - Auto-updates year so you don’t have to touch it

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-tagline">
        ✨ “Because every pixel deserves a little love.” 🐾
      </p>

      <p className="footer-credit">
        Made with 💛 by <span className="footer-accent">Sarah</span> · © {year}
      </p>
    </footer>
  );
}
