import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "@/types/index";

const initialState: AuthState = {
  isAuthenticated: false,
  isActive: false,
  email: null,
  username: null,
  accessToken: null,
  role: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState>) => {
      const { isActive, email, username, accessToken, role } = action.payload;
      state.isAuthenticated = true;
      state.isActive = isActive;
      state.email = email;
      state.username = username || null;
      state.accessToken = accessToken;
      state.role = role;
    },
    setAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
    },
    logout: (state) => {
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isActive = false;
      state.email = null;
      state.username = null;
      state.role = null;
    },
  },
});

export const { setUser, setAccessToken, logout } = userAuthSlice.actions;
export default userAuthSlice.reducer;
