// src/components/AppLayout.jsx
// App shell layout for authenticated pages.
// - Renders NavBar inside <header>
// - Wraps page content in <main> with a centered container
// - Shows global Footer
// - Hooks in Konami easter egg + global notifications

import NavBar from './NavBar';
import Footer from './Footer';
import ThemeToggle from './ThemeToggle';
import { useKonami } from '../hooks/useKonami';
import { useNotice } from '../hooks/useNotice';

export default function AppLayout({ headerProps = {}, children }) {
  const { notify } = useNotice();

  // Enable Konami code: shows a playful success notice when triggered
  useKonami(() => notify.success('Konami unlocked! 🕹️ Theme toggle + confetti!'));

  return (
    <>
      {/* Fixed-position global theme toggle (top-right) */}
      <div className="toggle-container">
        <ThemeToggle />
      </div>

      <header>
        <NavBar headerTitle={headerProps.title} headerSubtitle={headerProps.subtitle} />
      </header>

      <main className="container">{children}</main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
