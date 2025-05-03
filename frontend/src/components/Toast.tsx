import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  onClose: () => void;
};

const Toast = ({ message, type = "info", onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

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
