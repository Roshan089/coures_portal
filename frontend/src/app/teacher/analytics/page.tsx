"use client";

import { useAppSelector } from "@/store/hooks";

const STATS = [
  { label: "Total enrollments", value: "128", change: "+12%", positive: true },
  { label: "Completion rate", value: "78%", change: "+5%", positive: true },
  { label: "Avg. rating", value: "4.8", change: "—", positive: null },
  { label: "Active learners", value: "94", change: "+8%", positive: true },
];

const COURSE_PERFORMANCE = [
  { title: "Introduction to Web Development", enrollments: 42, completion: 82, rating: 4.9 },
  { title: "Advanced React Patterns", enrollments: 28, completion: 75, rating: 4.7 },
  { title: "Full-Stack Project", enrollments: 18, completion: 60, rating: 4.6 },
];

export default function TeacherAnalyticsPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Teacher";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-1 text-gray-600">Insights and performance for your courses.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-700">
          {name}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, change, positive }) => (
          <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 mt-0.5">{label}</p>
            {change !== "—" && (
              <p className={`text-xs font-medium mt-2 ${positive ? "text-emerald-600" : "text-gray-500"}`}>
                {change} from last month
              </p>
            )}
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Course performance</h2>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {COURSE_PERFORMANCE.map(({ title, enrollments, completion, rating }) => (
              <li key={title} className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50/50">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <div className="flex gap-6 text-sm text-gray-600">
                  <span>{enrollments} enrolled</span>
                  <span>{completion}% completion</span>
                  <span>★ {rating} rating</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
