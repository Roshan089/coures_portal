"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetTeacherProfileMeQuery } from "@/store/api/teacherApiSlice";
import { useGetCoursesByTeacherQuery } from "@/store/api/courseApiSlice";
import Link from "next/link";

export default function TeacherCoursesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const { data: profile } = useGetTeacherProfileMeQuery();
  const teacherId = profile?.id ?? "";
  const { data: courses = [], isLoading, isError } = useGetCoursesByTeacherQuery(teacherId, { skip: !teacherId });

  const name = profile?.name ?? (email ? email.split("@")[0] : "Teacher");

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-600">Create and manage your courses.</p>
          <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-700">
            {name}
          </span>
        </div>
        <Link
          href="/teacher/courses/create"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors shadow-sm hover:shadow-md"
        >
          Create course
        </Link>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/teacher/students"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          View students
        </Link>
        <Link
          href="/teacher/analytics"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          Analytics
        </Link>
      </div>

      {/* Course list */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your courses</h2>
        {isLoading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500">
            Loading courses…
          </div>
        )}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            Failed to load courses. Please try again.
          </div>
        )}
        {!isLoading && !isError && courses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <p className="text-gray-600">You haven’t created any courses yet.</p>
            <Link
              href="/teacher/courses/create"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c]"
            >
              Create your first course
            </Link>
          </div>
        )}
        {!isLoading && !isError && courses.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <ul className="divide-y divide-gray-100">
              {courses.map((course) => (
                <li
                  key={course.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50/80 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{course.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <Link
                      href={`/teacher/courses/${course.id}`}
                      className="px-3 py-1.5 rounded-lg bg-[#242D3D] text-sm font-medium text-white hover:bg-[#1a222c]"
                    >
                      View
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
