import { useSelector, useDispatch } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import { RootState } from "../store";
import authService from "../services/auth/authService";
import { showToast } from "../store/toastSlice";
import { useState } from "react";
import { clearUser } from "../store/userSlice";
import Search from "../components/Search";

type NavProps = {
  onLoginClick: () => void;
};

const Nav = ({ onLoginClick }: NavProps) => {
  const cartCount = useSelector((state: RootState) =>
    state.cart.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Function to determine if the current link is active
  const isActive = (path: string) => {
    const activeClass = "text-gray-400 font-bold";

    if (location.pathname.startsWith("/Book/")) {
      return path === "/Shop" ? activeClass : "";
    }

    return location.pathname === path ? activeClass : "";
  };

  const handleLogout = () => {
    authService.logout();
    dispatch(clearUser());
    dispatch(showToast({ message: "Logout successful!", type: "success" }));
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4">
      {/* Left section */}
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>
          <span className="text-xl uppercase">bookworm</span>
        </Link>
      </div>

      {/* Mobile Hamburger Icon */}
      <div className="navbar-end lg:hidden flex items-center space-x-2 pr-4">
        {authService.isLoggedIn() && user.first_name && user.last_name && (
          <span className="text-sm font-medium text-gray-700 truncate max-w-[100px]">
            {user.first_name} {user.last_name}
          </span>
        )}
        <button onClick={toggleMobileMenu} className="p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Search Bar */}
      <div className="navbar-center hidden lg:flex flex-1 justify-center">
        <div className="max-w-md w-full">
          <Search />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="navbar-end hidden lg:flex items-center">
        <ul className="menu menu-horizontal px-1 mr-18">
          <li>
            <Link to="/" className={`${isActive("/")}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/Shop" className={`${isActive("/Shop")}`}>
              Shop
            </Link>
          </li>
          <li>
            <Link to="/About" className={`${isActive("/About")}`}>
              About
            </Link>
          </li>
          <li>
            <Link to="/Cart" className={`${isActive("/Cart")}`}>
              Cart {cartCount > 0 && `(${cartCount})`}
            </Link>
          </li>

          {/* Conditionally render the login or user dropdown */}
          {authService.isLoggedIn() &&
          user &&
          user.first_name &&
          user.last_name ? (
            <li tabIndex={0} className="dropdown dropdown-end">
              <a className="text-gray-800">
                {user.first_name} {user.last_name}
                <svg
                  className="fill-current w-4 h-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a onClick={handleLogout} className="text-red-600">
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          ) : (
            <li>
              <a onClick={onLoginClick} className={`${isActive("/Login")}`}>
                Sign In
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-md">
          <div className="p-2">
            <Search />
          </div>
          <ul className="menu p-2">
            <li>
              <Link
                to="/"
                className={`${isActive("/")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/Shop"
                className={`${isActive("/Shop")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/About"
                className={`${isActive("/About")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/Cart"
                className={`${isActive("/Cart")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </li>

            {/* Conditionally render login or user dropdown in mobile */}
            {authService.isLoggedIn() && user.first_name && user.last_name ? (
              <li>
                <a onClick={handleLogout} className="text-red-600">
                  Logout
                </a>
              </li>
            ) : (
              <li>
                <a onClick={onLoginClick} className={`${isActive("/Login")}`}>
                  Sign In
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Nav;
