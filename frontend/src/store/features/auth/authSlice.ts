import type { LoginResponse } from "@/store/api/authApiSlice";
import { localStorageDelete, localStorageGet, localStorageSet } from "@/utils/localStorage";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const CURRENT_USER_KEY = "currentUser";
const IS_AUTHENTICATED_KEY = "isAuthenticated";

const storedUser =
  typeof window !== "undefined" ? (localStorageGet(CURRENT_USER_KEY) as LoginResponse | null) : null;
const storedIsAuthenticated =
  typeof window !== "undefined" ? localStorageGet(IS_AUTHENTICATED_KEY) : null;

export type CurrentUser = LoginResponse | null;

interface AuthState {
  currentUser: CurrentUser;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: storedUser || null,
  isAuthenticated: !!storedIsAuthenticated,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.currentUser = action.payload.currentUser;
      state.isAuthenticated = action.payload.isAuthenticated;
      if (typeof window !== "undefined") {
        localStorageSet(CURRENT_USER_KEY, action.payload.currentUser);
        localStorageSet(IS_AUTHENTICATED_KEY, action.payload.isAuthenticated);
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorageDelete(CURRENT_USER_KEY);
        localStorageDelete(IS_AUTHENTICATED_KEY);
      }
    },
  },
});

export default authSlice.reducer;
export const { loginSuccess, logoutUser } = authSlice.actions;
