"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

const COURSE_PROGRESS = [
  { title: "Introduction to Web Development", progress: 65, modulesCompleted: 4, totalModules: 6, hours: 8 },
  { title: "Data Structures & Algorithms", progress: 30, modulesCompleted: 2, totalModules: 8, hours: 4 },
  { title: "React & Next.js", progress: 0, modulesCompleted: 0, totalModules: 5, hours: 0 },
];

const OVERVIEW = [
  { label: "Total hours learned", value: "24", icon: "⏱️" },
  { label: "Courses in progress", value: "2", icon: "📚" },
  { label: "Courses completed", value: "3", icon: "✅" },
];

export default function StudentProgressPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="mt-1 text-gray-600">Track your learning across all courses.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-emerald-100 text-emerald-700">
          {name}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {OVERVIEW.map(({ label, value, icon }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <span className="text-2xl" aria-hidden>{icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course progress</h2>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {COURSE_PROGRESS.map(({ title, progress, modulesCompleted, totalModules, hours }) => (
              <li key={title} className="p-5 hover:bg-gray-50/80 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {modulesCompleted} of {totalModules} modules · {hours} hours
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#242D3D]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-10">{progress}%</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6">
        <Link
          href="/student/courses"
          className="text-sm font-medium text-[#242D3D] hover:underline"
        >
          ← Back to My Courses
        </Link>
      </div>
    </div>
  );
}
