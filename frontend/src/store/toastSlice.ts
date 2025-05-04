import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ToastState = {
  message: string;
  type: "info" | "success" | "error" | "warning";
  visible: boolean;
};

const initialState: ToastState = {
  message: "",
  type: "info",
  visible: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (
      state,
      action: PayloadAction<{ message: string; type?: ToastState["type"] }>
    ) => {
      state.message = action.payload.message;
      state.type = action.payload.type || "info";
      state.visible = true;
    },
    hideToast: (state) => {
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
