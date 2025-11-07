import NavBar from "./NavBar";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout({ headerProps, children }) {
  return (
    <>
      <NavBar />
      <Header {...headerProps} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
