"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

const ENROLLED_COURSES = [
  { title: "Introduction to Web Development", progress: 65, instructor: "Jane Smith", modules: 6, href: "/student/courses" },
  { title: "Data Structures & Algorithms", progress: 30, instructor: "John Doe", modules: 8, href: "/student/courses" },
  { title: "React & Next.js", progress: 0, instructor: "Alex Lee", modules: 5, href: "/student/courses" },
];

const BROWSE_COURSES = [
  { title: "Advanced TypeScript", instructor: "Sam Wilson", level: "Intermediate", enrolled: "120" },
  { title: "Node.js Backend Development", instructor: "Chris Brown", level: "Beginner", enrolled: "89" },
  { title: "Database Design", instructor: "Maria Garcia", level: "Intermediate", enrolled: "56" },
];

const RECOMMENDED = [
  { title: "Full-Stack with Next.js", instructor: "Alex Lee", reason: "Based on your progress in React" },
  { title: "System Design", instructor: "Jordan Kim", reason: "Popular with DSA learners" },
];

export default function StudentCoursesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Courses</h1>
        <p className="mt-1 text-gray-600">Continue learning and discover new courses.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-emerald-100 text-emerald-700">
          {name}
        </span>
      </div>

      {/* Shortcuts */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link
          href="/student/progress"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          My progress
        </Link>
        <Link
          href="/student/certificates"
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-[#242D3D]/20"
        >
          Certificates
        </Link>
      </div>

      {/* In progress */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">In progress</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENROLLED_COURSES.map(({ title, progress, instructor, modules, href }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-2 bg-gray-100">
                <div className="h-full bg-[#242D3D]" style={{ width: `${progress}%` }} />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">by {instructor}</p>
                <p className="text-sm text-gray-500">{modules} modules</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">{progress}% complete</span>
                  <Link href={href} className="text-sm font-medium text-[#242D3D] hover:underline">
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended for you */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended for you</h2>
        <p className="text-gray-600 mb-4">Based on your learning history and interests.</p>
        <div className="grid md:grid-cols-2 gap-4">
          {RECOMMENDED.map(({ title, instructor, reason }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-[#242D3D]/20 transition-all"
            >
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">by {instructor}</p>
              <p className="text-xs text-gray-500 mt-2 italic">{reason}</p>
              <button
                type="button"
                className="mt-4 w-full py-2.5 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Browse courses */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse courses</h2>
        <p className="text-gray-600 mb-4">Explore and enroll in new courses.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BROWSE_COURSES.map(({ title, instructor, level, enrolled }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 hover:shadow-md hover:border-[#242D3D]/20 transition-all"
            >
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">by {instructor}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                  {level}
                </span>
                <span className="text-xs text-gray-500">{enrolled} enrolled</span>
              </div>
              <button
                type="button"
                className="mt-4 w-full py-2.5 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
