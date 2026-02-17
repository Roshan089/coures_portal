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

export type TeacherStudentEnrollment = {
  courseAccessId: string;
  student: { id: string; name: string; user?: { id: string; email: string; role?: { name: string } } } | null;
  course: { id: string; title: string } | null;
  accessStatus: string;
  enrolledAt: string;
  order: {
    id: string;
    amount: string;
    status: string;
    createdAt: string;
    emis: Array<{
      id: string;
      installmentNumber: number;
      dueDate: string;
      amount: string;
      status: string;
      paidAt: string | null;
    }>;
  } | null;
};

export type TeacherStudentsFilters = { courseId?: string; status?: string };

export type UpdateStudentAccessStatusBody = { status: "active" | "suspended" | "revoked" };

export const teacherApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeacherProfileMe: builder.query<TeacherProfile, void>({
      query: () => ({ url: "/teacher/profile/me" }),
      providesTags: ["TeacherProfile"],
    }),
    getTeacherStudents: builder.query<TeacherStudentEnrollment[], TeacherStudentsFilters | void>({
      query: (filters) => ({
        url: "/teacher/students",
        params: filters && (filters.courseId || filters.status) ? filters : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ courseAccessId }) => ({ type: "TeacherStudents" as const, id: courseAccessId })),
              { type: "TeacherStudents", id: "LIST" },
            ]
          : [{ type: "TeacherStudents", id: "LIST" }],
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
    updateTeacherStudentAccessStatus: builder.mutation<
      { courseAccessId: string; status: string },
      { courseAccessId: string; status: UpdateStudentAccessStatusBody["status"] }
    >({
      query: ({ courseAccessId, status }) => ({
        url: `/teacher/students/${courseAccessId}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: [{ type: "TeacherStudents", id: "LIST" }],
    }),
  }),
});

export const {
  useGetTeacherProfileMeQuery,
  useLazyGetTeacherProfileMeQuery,
  useGetTeacherStudentsQuery,
  useUpdateTeacherStudentAccessStatusMutation,
  useCreateTeacherProfileMutation,
  useUpdateTeacherProfileMutation,
} = teacherApiSlice;
