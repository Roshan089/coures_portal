import { TLoginUserType } from "@/shared/types/userType";
import { TAgency } from "@/shared/types/AgencyType";
import { TApplicant } from "@/shared/types/applicantType";
import { TCompany } from "@/shared/types/companyType";
import { localStorageDelete, localStorageGet, localStorageSet } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const CurrentUserKey = "currentUser";
const IsAuthenticatedKey = "isAuthenticated";

// Retrieve the user from localStorage if it exists
const storedUser =
  typeof window !== "undefined" ? localStorageGet(CurrentUserKey) : null;
const storedIsAuthenticated =
  typeof window !== "undefined" ? localStorageGet(IsAuthenticatedKey) : null;
const parsedUser: TLoginUserType = storedUser ? storedUser : null;

// Define the initial state
interface AuthState {
  currentUser: TLoginUserType;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  currentUser: parsedUser || {
    id: "",
    email: "",
    roleId: "",
    createdAt: "",
    updatedAt: "",
    userType: {},
  },
  isAuthenticated: !!storedIsAuthenticated, // Initialize based on the presence of a user
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      localStorageSet(IsAuthenticatedKey, action.payload);
    },
    loginSuccess: (state, action: PayloadAction<AuthState>) => {
      state.currentUser = action.payload.currentUser;
      state.isAuthenticated = action.payload.isAuthenticated;

      // Persist the user in localStorage
      if (typeof window !== "undefined") {
        localStorageSet(CurrentUserKey, action.payload.currentUser);
        localStorageSet(IsAuthenticatedKey, action.payload.isAuthenticated);
      }
    },
    logoutUser: (state) => {
      state.currentUser = initialState.currentUser;
      state.isAuthenticated = false;

      // Remove the user from localStorage
      if (typeof window !== "undefined") {
        localStorageDelete(CurrentUserKey);
        localStorageDelete(IsAuthenticatedKey);
      }
    },
    updateUserType: (state, action: PayloadAction<TApplicant | TCompany| TAgency>) => {
      state.currentUser.user.userType = action.payload;

      // Persist the updated userType in localStorage
      if (typeof window !== "undefined") {
        localStorageSet(CurrentUserKey, state.currentUser);
      }
    },
  },
});

export default authSlice.reducer;
export const { logoutUser, loginSuccess, setAuthState, updateUserType } =
  authSlice.actions;
