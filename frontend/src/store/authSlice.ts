import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  access_token: string | null;
}

const initialState: AuthState = {
  access_token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.access_token = action.payload;
    },
    clearAccessToken(state) {
      state.access_token = null;
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
