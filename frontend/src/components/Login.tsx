import { useEffect, useRef, useState } from "react";
import authService from "../services/auth/authService"; // Import authService for handling login
import { showToast } from "../store/toastSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const Login = ({ isOpen, onClose }: LoginProps) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleClose = () => {
      formRef.current?.reset();
      setEmail("");
      setPassword("");
      setErrorMessage(null);
      onClose();
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (event.target === modal) modal.close();
    };

    modal.addEventListener("close", handleClose);
    modal.addEventListener("click", handleClickOutside);

    isOpen && !modal.open
      ? modal.showModal()
      : !isOpen && modal.open && modal.close();

    return () => {
      modal.removeEventListener("close", handleClose);
      modal.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email with a proper domain.");
      return;
    }

    try {
      await authService.login({ username: email, password });
      onClose();
      dispatch(
        showToast({
          message: "Login successful!",
          type: "success",
        })
      );
      navigate("/");
    } catch (error) {
      dispatch(
        showToast({ message: "Login failed. Please try again.", type: "error" })
      );
      setErrorMessage("Invalid email or password.");
    }
  };

  return (
    <>
      <dialog ref={modalRef} className="modal flex justify-center items-center">
        <div
          className="modal-box flex flex-col justify-center items-center gap-6 w-full max-w-md sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <form
            method="dialog"
            ref={formRef}
            className="w-full flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            <h3 className="font-bold text-2xl text-center">Login</h3>

            {/* Email Field */}
            <div className="w-full flex flex-col">
              <label className="input validator w-full flex items-center">
                <EmailIcon />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Password Field */}
            <div className="w-full flex flex-col">
              <label className="input validator w-full flex items-center gap-2">
                <PasswordIcon />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border-gray-300 rounded-md"
                />
              </label>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn bg-gray-200 w-full mx-auto py-2 rounded-md text-white transition-colors duration-300 hover:bg-gray-300"
            >
              Login
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Login;

// SVG Icons extracted to components for clarity
const EmailIcon = () => (
  <svg
    className="h-[1em] opacity-50"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </g>
  </svg>
);

const PasswordIcon = () => (
  <svg
    className="h-[1em] opacity-50"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
    </g>
  </svg>
);
