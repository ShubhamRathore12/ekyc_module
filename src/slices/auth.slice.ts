import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LoginResponse } from "types/auth";

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  login: LoginResponse | null;
}

const initialState: AuthState = { isAuthenticated: false, isInitialized: false, login: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: AuthState, action: PayloadAction<LoginResponse>) => {
      state.isAuthenticated = true;
      state.login = action.payload;
    },
    logout: (state: AuthState) => {
      state.isAuthenticated = false;
      state.login = null;
    },
  },
});

export default authSlice;
