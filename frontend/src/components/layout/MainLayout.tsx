import { useState } from "react";
import Footer from "./Footer";
import Login from "./Login";
import Nav from "./Nav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  return (
    <div>
      <Nav onLoginClick={handleLoginOpen} />

      <Login isOpen={isLoginOpen} onClose={handleLoginClose} />

      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
