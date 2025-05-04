// components/Toast.tsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { hideToast } from "../store/toastSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type, visible, duration } = useSelector(
    (state: RootState) => state.toast
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(hideToast());
      }, duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, dispatch]);

  if (!visible) return null;

  const alertTypeClass = {
    info: "alert-info",
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
  }[type];

  return (
    <div className="toast toast-end z-50 shadow-lg">
      <div className={`alert ${alertTypeClass} text-lg p-4`}>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;
