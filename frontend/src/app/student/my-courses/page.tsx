"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function StudentMyCoursesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";

  const enrolledCourses: Array<{ id: string; title: string; instructor: string; progress: number }> = [];

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

      {enrolledCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-10 text-center">
          <p className="text-gray-600">You haven&apos;t enrolled in any courses yet.</p>
          <p className="text-sm text-gray-500 mt-2">Browse courses and enroll to see them here.</p>
          <Link
            href="/student/courses"
            className="mt-6 inline-block px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Enrolled</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-2 bg-gray-100">
                  <div className="h-full bg-[#242D3D]" style={{ width: `${course.progress}%` }} />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">by {course.instructor}</p>
                  <p className="text-sm font-medium text-gray-600 mt-2">{course.progress}% complete</p>
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="mt-4 inline-block text-sm font-medium text-[#242D3D] hover:underline"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
