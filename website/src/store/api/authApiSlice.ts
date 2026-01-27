import { AUTH_API_CONSTANT } from "@/shared/constants";
import { apiSlice } from "./apiSlice";
import { TLoginUserType } from "@/shared/types/userType";

// Define a type for the login credentials
export type TLoginCredentials = {
  email: string;
  password: string;
};

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TLoginUserType, TLoginCredentials>({
      query: (credentials) => ({
        url: `${AUTH_API_CONSTANT.login}`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const { useLoginMutation } = authApiSlice;

export default authApiSlice;
