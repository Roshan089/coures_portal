import { IS_SERVER, localStorageGet } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppStoreState {
  darkMode: boolean;
  isAuthenticated: boolean;
}

/**
 * Initial values for the AppStore state
 */
export const APP_STORE_INITIAL_STATE: AppStoreState = {
  darkMode: false, // Overridden by useMediaQuery('(prefers-color-scheme: dark)') in AppStore
  isAuthenticated: false, // Overridden in AppStore by checking auth token
};

// Initialize state
const prefersDarkMode = IS_SERVER
  ? false
  : window.matchMedia("(prefers-color-scheme: dark)").matches;
const previousDarkMode = IS_SERVER
  ? false
  : Boolean(localStorageGet("darkMode", false));
const initialState: AppStoreState = {
  ...APP_STORE_INITIAL_STATE,
  darkMode: previousDarkMode || prefersDarkMode,
};
const appSlice = createSlice({
  initialState,
  name: "app",
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export default appSlice.reducer;
export const { toggleDarkMode, setDarkMode } = appSlice.actions;
