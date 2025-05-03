import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

const initialState: UserState = {
  id: null,
  first_name: null,
  last_name: null,
  email: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      const { id, first_name, last_name, email } = action.payload;
      state.id = id;
      state.first_name = first_name;
      state.last_name = last_name;
      state.email = email;
    },
    clearUser(state) {
      state.id = null;
      state.first_name = null;
      state.last_name = null;
      state.email = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
