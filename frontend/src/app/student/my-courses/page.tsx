"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetMyCoursesQuery } from "@/store/api/courseApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function StudentMyCoursesPage() {
  const isAuthenticated = useIsAuthenticated();
  const router = useRouter();
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";
  const { data: enrolledCourses = [], isLoading, isError } = useGetMyCoursesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-1 text-gray-600">Courses you have purchased or enrolled in.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-emerald-100 text-emerald-700">
          {name}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/student/courses"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          Browse courses
        </Link>
        <Link
          href="/student/progress"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          My progress
        </Link>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">Loading your courses...</p>
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p>Failed to load courses. Please try again.</p>
        </div>
      ) : enrolledCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
          <p className="text-gray-600">You haven&apos;t enrolled in any courses yet.</p>
          <p className="text-sm text-gray-500 mt-2">Browse courses and purchase to see them here.</p>
          <Link
            href="/student/courses"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Purchased Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    by {course.teacher?.name || "Teacher"}
                  </p>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-500">
                        Purchased {new Date(course.purchasedAt || course.createdAt).toLocaleDateString()}
                      </span>
                      {course.accessStatus && course.accessStatus !== "active" && (
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            course.accessStatus === "suspended"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {course.accessStatus}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/student/courses/${course.id}`}
                      className="text-sm font-medium text-[#242D3D] hover:underline"
                    >
                      View Course →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
