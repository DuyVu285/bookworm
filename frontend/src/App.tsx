import "./App.css";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <Nav />
      <main className="pt-18">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Shop" element={<ShopPage />} />
          <Route path="/Book" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
