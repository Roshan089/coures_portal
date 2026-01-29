import { apiSlice } from "./apiSlice";

export type CreateStudentProfileBody = {
  userId: string;
  name: string;
  bio?: string;
  phone?: string;
  profilePicUrl?: string;
  age?: number;
  isActive?: boolean;
};

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStudentProfileMe: builder.query<unknown, void>({
      query: () => ({ url: "/student/profile/me" }),
    }),
    createStudentProfile: builder.mutation<unknown, CreateStudentProfileBody>({
      query: (body) => ({
        url: "/student",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetStudentProfileMeQuery, useLazyGetStudentProfileMeQuery, useCreateStudentProfileMutation } =
  studentApiSlice;
