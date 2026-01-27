import { USERS_API_CONSTANT } from "@/shared/constants/api/users";
import { apiSlice } from "./apiSlice";
import { TSignUp } from "@/shared/types/singUp";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation({
      query: (credentials: TSignUp) => ({
        url: `${USERS_API_CONSTANT.users}`,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const { useSignUpMutation } = userApiSlice;

export default userApiSlice;
