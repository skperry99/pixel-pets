export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="site-footer">
      <p className="footer-tagline">✨ “Because every pixel deserves a little love.” 🐾</p>
      <p className="footer-credit">
        Made with 💛 by <span className="footer-accent">Sarah</span> · © {year}
      </p>
    </div>
  );
}
