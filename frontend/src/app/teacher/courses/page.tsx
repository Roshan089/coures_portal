"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

const MY_COURSES = [
  { title: "Introduction to Web Development", students: 42, status: "Published", modules: 6 },
  { title: "Advanced React Patterns", students: 28, status: "Published", modules: 5 },
  { title: "Full-Stack Project", students: 0, status: "Draft", modules: 4 },
];

export default function TeacherCoursesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Teacher";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-600">Create and manage your courses.</p>
          <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-700">
            {name}
          </span>
        </div>
        <button
          type="button"
          className="px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] transition-colors shadow-sm hover:shadow-md"
        >
          Create course
        </button>
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
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {MY_COURSES.map(({ title, students, status, modules }) => (
              <li
                key={title}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50/80 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {modules} modules · {students} {students === 1 ? "student" : "students"} enrolled
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {status}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg bg-[#242D3D] text-sm font-medium text-white hover:bg-[#1a222c]"
                    >
                      View
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Empty state hint (static) */}
      <div className="mt-8 p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-center">
        <p className="text-gray-600">
          Create your first course to start teaching. Use the &quot;Create course&quot; button above.
        </p>
      </div>
    </div>
  );
}
