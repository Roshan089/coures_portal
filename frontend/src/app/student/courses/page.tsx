"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetCoursesQuery } from "@/store/api/courseApiSlice";
import Link from "next/link";

const RECOMMENDED_DUMMY = [
  { id: "rec-1", title: "Full-Stack with Next.js", instructor: "Alex Lee", reason: "Based on your progress in React" },
  { id: "rec-2", title: "System Design", instructor: "Jordan Kim", reason: "Popular with developers" },
  { id: "rec-3", title: "Advanced TypeScript", instructor: "Sam Wilson", reason: "Level up your skills" },
];

export default function StudentCoursesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const { data: courses = [], isLoading, isError } = useGetCoursesQuery();

  const name = email ? email.split("@")[0] : "Student";
  const publishedCourses = courses.filter((c) => c.isPublished);

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Courses</h1>
        <p className="mt-1 text-gray-600">Browse all courses and discover recommended ones for you.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-emerald-100 text-emerald-700">
          {name}
        </span>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/student/my-courses"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          My courses
        </Link>
        <Link
          href="/student/progress"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          My progress
        </Link>
      </div>

      {/* Recommended for you (dummy) */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for you</h2>
        <p className="text-gray-600 mb-4">Based on your interests and popular picks.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDED_DUMMY.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#242D3D]/20 transition-all"
            >
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">by {item.instructor}</p>
              <p className="text-xs text-gray-500 mt-2 italic">{item.reason}</p>
              <Link
                href="/student/courses"
                className="mt-4 block w-full py-2.5 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors text-center"
              >
                View course
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Browse all courses (from API) */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse all courses</h2>
        <p className="text-gray-600 mb-4">Published courses you can explore and enroll in.</p>
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
        {!isLoading && !isError && publishedCourses.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 p-8 text-center">
            <p className="text-gray-600">No published courses yet. Check back later.</p>
          </div>
        )}
        {!isLoading && !isError && publishedCourses.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {publishedCourses.map((course) => {
              const coursePrice = course.price ? parseFloat(course.price) : 0;
              const isPaidCourse = coursePrice > 0;
              
              return (
                <div
                  key={course.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md hover:border-[#242D3D]/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 flex-1">{course.title}</h3>
                    {isPaidCourse && (
                      <span className="ml-2 text-lg font-bold text-gray-900">₹{coursePrice.toFixed(2)}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    by {course.teacher?.name ?? "Teacher"}
                  </p>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                  )}
                  {course.emiAllowed && course.emiCount && isPaidCourse && (
                    <p className="text-xs text-gray-500 mt-2">EMI: {course.emiCount} installments available</p>
                  )}
                  <Link
                    href={`/student/courses/${course.id}`}
                    className="mt-4 block w-full py-2.5 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors text-center"
                  >
                    {isPaidCourse ? "View & Purchase" : "View course"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
