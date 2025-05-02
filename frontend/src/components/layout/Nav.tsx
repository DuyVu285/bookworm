import { useLocation } from "react-router-dom";

type NavProps = {
  onLoginClick: () => void;
};

const Nav = ({ onLoginClick }: NavProps) => {
  const location = useLocation(); // Get current location using React Router's `useLocation`

  // Function to determine if the current link is active
  const isActive = (path: string) => {
    const activeClass = "text-primary font-bold";

    // If you're on a book page, highlight the 'Shop' link
    if (location.pathname.startsWith("/Book/")) {
      return path === "/Shop" ? activeClass : "";
    }

    // Default case for other paths
    return location.pathname === path ? activeClass : "";
  };

  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost">
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
        </a>
      </div>
      <div className="navbar-end">
        {/* Desktop Menu */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1 mr-18">
            <li>
              <a href="/" className={`${isActive("/")}`}>
                Home
              </a>
            </li>
            <li>
              <a href="/Shop" className={`${isActive("/Shop")}`}>
                Shop
              </a>
            </li>
            <li>
              <a href="/About" className={`${isActive("/About")}`}>
                About
              </a>
            </li>
            <li>
              <a href="/Cart" className={`${isActive("/Cart")}`}>
                Cart (0)
              </a>
            </li>
            <li>
              <a onClick={onLoginClick} className={`${isActive("/Login")}`}>
                Sign In
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nav;
