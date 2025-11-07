import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ headerProps, children }) {
  return (
    <>
      <Header {...headerProps} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
