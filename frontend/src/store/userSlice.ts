import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  first_name: string | null;
  last_name: string | null;
  id: number | null;
}

const initialState: UserState = {
  first_name: null,
  last_name: null,
  id: null,
};

// Define expiration time (e.g., 1 hour)
const EXPIRATION_TIME = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      const userData = action.payload;
      const currentTime = Date.now();

      // Store user data in localStorage with an expiration timestamp
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...userData,
          timestamp: currentTime,
        })
      );

      // Set state with user data
      state.first_name = userData.first_name;
      state.last_name = userData.last_name;
      state.id = userData.id;
    },
    clearUser(state) {
      // Remove user data from localStorage
      localStorage.removeItem("user");

      // Clear user state
      state.first_name = null;
      state.last_name = null;
      state.id = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;

// Function to check if the user session is valid based on expiration
export const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");

  if (userData) {
    const parsedData = JSON.parse(userData);
    const currentTime = Date.now();

    // Check if the data has expired
    if (currentTime - parsedData.timestamp < EXPIRATION_TIME) {
      // Data is still valid
      return parsedData;
    } else {
      // Data has expired, clear the data
      localStorage.removeItem("user");
      return null;
    }
  }

  return null;
};
