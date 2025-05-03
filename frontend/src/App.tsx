import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ScrollToTop from "./components/ScrollToTop";
import { loadUserFromLocalStorage, setUser } from "./store/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userFromStorage = loadUserFromLocalStorage();
    if (userFromStorage) {
      // If the user data exists and is not expired, set it in Redux
      dispatch(
        setUser({
          first_name: userFromStorage.first_name,
          last_name: userFromStorage.last_name,
          id: userFromStorage.username,
        })
      );
    }
  }, [dispatch]);
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
