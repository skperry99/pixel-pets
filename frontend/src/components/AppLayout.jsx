import NavBar from './NavBar';
import Footer from './Footer';
import { useKonami } from '../hooks/useKonami';
import { useNotice } from '../hooks/useNotice';
/**
 * App shell:
 * - Renders semantic regions (header, nav (inside header), main, footer)
 */
export default function AppLayout({ headerProps = {}, children }) {

  const {notify} = useNotice();
  useKonami(() => notify.success('Konami unlocked! 🕹️ Theme toggle + confetti!'));
  
  return (
    <>
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
