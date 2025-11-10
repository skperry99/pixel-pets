import NavBar from "./NavBar";
import Footer from "./Footer";

/**
 * App shell:
 * - Renders semantic regions (nav, header, main, footer)
 * - Centers page content inside .container
 */
export default function AppLayout({ headerProps = {}, children }) {
  return (
    <>
      <nav aria-label="Primary">
        <NavBar
          headerTitle={headerProps.title}
          headerSubtitle={headerProps.subtitle}
        />
      </nav>

      <main className="container" role="main">
        {children}
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
