import Navbar from "../components/common/Navbar/Navbar";
import Footer from "../components/common/Footer/Footer";

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />

      <main>{children}</main>

      <Footer />
    </>
  );
};

export default MainLayout;