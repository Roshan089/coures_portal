import { apiSlice } from "./apiSlice";

export type Course = {
  id: string;
  title: string;
  description?: string | null;
  teacherId: string;
  isPublished: boolean;
  price?: string;
  emiAllowed?: boolean;
  emiCount?: number | null;
  createdAt: string;
  updatedAt: string;
  purchasedAt?: string;
  accessStatus?: string;
  teacher?: {
    id: string;
    name: string;
    user?: { id: string; email: string; role?: { name: string } };
  };
};

export type CreateCourseBody = {
  title: string;
  description?: string;
  teacherId: string;
  isPublished?: boolean;
  price?: string;
  emiAllowed?: boolean;
  emiCount?: number;
};

export type UpdateCourseBody = {
  title?: string;
  description?: string;
  teacherId?: string;
  isPublished?: boolean;
  price?: string;
  emiAllowed?: boolean;
  emiCount?: number;
};

export type CourseVideo = {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  url: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateCourseVideoBody = {
  title: string;
  description?: string;
  url: string;
  sortOrder?: number;
};

export type UpdateCourseVideoBody = {
  title?: string;
  description?: string;
  url?: string;
  sortOrder?: number;
};

export const courseApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], void>({
      query: () => ({ url: "/course" }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Course" as const, id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),
    getCoursesByTeacher: builder.query<Course[], string>({
      query: (teacherId) => ({ url: `/course/by-teacher/${teacherId}` }),
      providesTags: (result, _, teacherId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Course" as const, id })),
              { type: "Course", id: `TEACHER-${teacherId}` },
            ]
          : [{ type: "Course", id: `TEACHER-${teacherId}` }],
    }),
    getCourse: builder.query<Course, string>({
      query: (id) => ({ url: `/course/${id}` }),
      providesTags: (_, __, id) => [{ type: "Course", id }],
    }),
    createCourse: builder.mutation<Course, CreateCourseBody>({
      query: (body) => ({
        url: "/course",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Course" }],
    }),
    updateCourse: builder.mutation<Course, { id: string; body: UpdateCourseBody }>({
      query: ({ id, body }) => ({
        url: `/course/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "Course", id }, { type: "Course" }],
    }),
    deleteCourse: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "Course", id }, { type: "Course" }],
    }),
    /* ----- Course videos ----- */
    getVideosByCourse: builder.query<CourseVideo[], string>({
      query: (courseId) => ({ url: `/course/${courseId}/videos` }),
      providesTags: (result, _, courseId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "CourseVideo" as const, id })),
              { type: "CourseVideo", id: `COURSE-${courseId}` },
            ]
          : [{ type: "CourseVideo", id: `COURSE-${courseId}` }],
    }),
    getCourseVideo: builder.query<CourseVideo, string>({
      query: (id) => ({ url: `/course/videos/${id}` }),
      providesTags: (_, __, id) => [{ type: "CourseVideo", id }],
    }),
    createCourseVideo: builder.mutation<CourseVideo, { courseId: string; body: CreateCourseVideoBody }>({
      query: ({ courseId, body }) => ({
        url: `/course/${courseId}/videos`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_, __, { courseId }) => [{ type: "CourseVideo", id: `COURSE-${courseId}` }],
    }),
    updateCourseVideo: builder.mutation<CourseVideo, { id: string; body: UpdateCourseVideoBody }>({
      query: ({ id, body }) => ({
        url: `/course/videos/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_, __, { id }) => [{ type: "CourseVideo", id }, { type: "CourseVideo" }],
    }),
    deleteCourseVideo: builder.mutation<void, string>({
      query: (id) => ({
        url: `/course/videos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, id) => [{ type: "CourseVideo", id }, { type: "CourseVideo" }],
    }),
    getMyCourses: builder.query<Course[], void>({
      query: () => "/course-access/my-courses",
      providesTags: [{ type: "Course", id: "MY_COURSES" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCoursesByTeacherQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetVideosByCourseQuery,
  useGetCourseVideoQuery,
  useCreateCourseVideoMutation,
  useUpdateCourseVideoMutation,
  useDeleteCourseVideoMutation,
  useGetMyCoursesQuery,
} = courseApiSlice;
