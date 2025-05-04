import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ScrollToTop from "./components/ScrollToTop";
import Toast from "./components/Toast";

function App() {
  return (
    <>
      <Toast />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Shop" element={<ShopPage />} />
        <Route path="/Book/:id" element={<ProductPage />} />
        <Route path="/Cart" element={<CartPage />} />
        <Route path="/About" element={<AboutPage />} />
      </Routes>
    </>
  );
}

export default App;
