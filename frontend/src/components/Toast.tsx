import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { hideToast } from "../store/toastSlice";

const Toast = () => {
  const { message, type, visible } = useSelector(
    (state: RootState) => state.toast
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(timer);
  }, [visible, dispatch]);

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
