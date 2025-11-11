import NavBar from './NavBar';
import Footer from './Footer';

/**
 * App shell:
 * - Renders semantic regions (header, nav (inside header), main, footer)
 */
export default function AppLayout({ headerProps = {}, children }) {
  return (
    <>
    <header>
      <NavBar
      headerTitle={headerProps.title}
      headerSubtitle={headerProps.subtitle}
      />
    </header>

      <main className="container">
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
