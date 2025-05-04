// store/toastSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToastState = {
  message: string;
  type: "info" | "success" | "error" | "warning";
  visible: boolean;
  duration?: number;
};

const initialState: ToastState = {
  message: "",
  type: "info",
  visible: false,
  duration: 3000,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: ToastState["type"];
        duration?: number;
      }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.duration = action.payload.duration || 3000;
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
