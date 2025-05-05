import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  access_token: string | null;
  token_expiry: number | null; // Expiration time in milliseconds
}

const initialState: AuthState = {
  access_token: null,
  token_expiry: null,
};

// Helper function to check if the token is expired
const isTokenExpired = (expiry: number | null): boolean => {
  if (!expiry) return true; 
  return Date.now() > expiry;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<{ access_token: string; expires_in: number }>) {
      state.access_token = action.payload.access_token;
      state.token_expiry = Date.now() + action.payload.expires_in * 1000;
    },
    clearAccessToken(state) {
      state.access_token = null;
      state.token_expiry = null;
    },
    clearExpiredToken(state) {
      if (isTokenExpired(state.token_expiry)) {
        state.access_token = null;
        state.token_expiry = null;
      }
    },
  },
});

export const { setAccessToken, clearAccessToken, clearExpiredToken } = authSlice.actions;
export default authSlice.reducer;
