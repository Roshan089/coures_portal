import { apiSlice } from "./apiSlice";

export type TeacherProfile = {
  id: string;
  userId: string;
  name: string;
  bio?: string | null;
  phone?: string | null;
  profilePicUrl?: string | null;
  age?: number | null;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; email: string; role?: { name: string } };
};

export type CreateTeacherProfileBody = {
  userId: string;
  name: string;
  bio?: string;
  phone?: string;
  profilePicUrl?: string;
  age?: number;
  isApproved?: boolean;
};

export type UpdateTeacherProfileBody = Partial<Omit<CreateTeacherProfileBody, "userId">> & { userId?: string };

export const teacherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherProfileMe: builder.query<TeacherProfile, void>({
      query: () => ({ url: "/teacher/profile/me" }),
      providesTags: ["TeacherProfile"],
    }),
    createTeacherProfile: builder.mutation<TeacherProfile, CreateTeacherProfileBody>({
      query: (body) => ({
        url: "/teacher",
        method: "POST",
        body,
      }),
    }),
    updateTeacherProfile: builder.mutation<TeacherProfile, { id: string; body: UpdateTeacherProfileBody }>({
      query: ({ id, body }) => ({
        url: `/teacher/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["TeacherProfile"],
    }),
  }),
});

export const {
  useGetTeacherProfileMeQuery,
  useLazyGetTeacherProfileMeQuery,
  useCreateTeacherProfileMutation,
  useUpdateTeacherProfileMutation,
} = teacherApiSlice;
