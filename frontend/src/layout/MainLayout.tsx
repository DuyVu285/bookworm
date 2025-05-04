import { useState } from "react";
import Footer from "./Footer";
import Login from "../components/Login";
import Nav from "./Nav";
import Breadcrumbs from "./Breadcrumbs";

const MainLayout = ({
  children,
  type,
  value,
}: {
  children: React.ReactNode;
  type?: string;
  value?: string | number;
}) => {
  const [isLoginOpen, setLoginOpen] = useState(false);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  return (
    <div className="flex flex-col h-screen justify-between mt-18">
      <Nav onLoginClick={handleLoginOpen} />
      <Login isOpen={isLoginOpen} onClose={handleLoginClose} />
      <div className="mx-20">
        <Breadcrumbs type={type} value={value} />
      </div>
      <main className="flex-grow">{children}</main>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
