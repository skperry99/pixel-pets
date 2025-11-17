// src/components/Footer.jsx
// Site footer for Pixel Pets.
// - Fun tagline + theme-y credit line
// - Caffeine & nostalgia nod
// - LaunchCode shout out
// - Auto-updates year

import { Brand } from '../utils/brandText';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <p className="footer-tagline">✨ “{Brand.layout.footerTagline}” 🐾</p>
      <p className="footer-tagline">{Brand.taglines.powered}</p>

      <p className="footer-credit">
        {Brand.layout.footerCredit} · © {year}
      </p>
    </footer>
  );
}
