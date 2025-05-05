import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ScrollToTop from "./components/ScrollToTop";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import authService from "./services/auth/authService";
import { clearUser, setUser } from "./store/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("initUser");

    const initUser = async () => {
      try {
        const user = await authService.getUser();
        dispatch(setUser(user));
      } catch (err) {
        dispatch(clearUser());
      }
    };

    if (authService.isLoggedIn()) {
      initUser();
    } else {
      console.log("No token found in cookies");
    }
  }, []);
  return (
    <>
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
