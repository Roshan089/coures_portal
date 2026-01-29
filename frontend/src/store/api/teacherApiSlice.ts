import { apiSlice } from "./apiSlice";

export type CreateTeacherProfileBody = {
  userId: string;
  name: string;
  bio?: string;
  phone?: string;
  profilePicUrl?: string;
  age?: number;
  isApproved?: boolean;
};

export const teacherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherProfileMe: builder.query<unknown, void>({
      query: () => ({ url: "/teacher/profile/me" }),
    }),
    createTeacherProfile: builder.mutation<unknown, CreateTeacherProfileBody>({
      query: (body) => ({
        url: "/teacher",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useGetTeacherProfileMeQuery, useLazyGetTeacherProfileMeQuery, useCreateTeacherProfileMutation } =
  teacherApiSlice;
