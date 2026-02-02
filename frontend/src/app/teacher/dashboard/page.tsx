"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetTeacherProfileMeQuery } from "@/store/api/teacherApiSlice";
import Link from "next/link";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function capitalizeName(str: string): string {
  if (!str) return "";
  return str
    .split(/[.\s_-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ")
    .trim() || str;
}

const STAT_CARDS = [
  { label: "Total courses", value: "4", icon: "📚", bg: "bg-blue-500/10", border: "border-blue-200", text: "text-blue-700" },
  { label: "Active students", value: "128", icon: "👥", bg: "bg-emerald-500/10", border: "border-emerald-200", text: "text-emerald-700" },
  { label: "Published", value: "3", icon: "✅", bg: "bg-violet-500/10", border: "border-violet-200", text: "text-violet-700" },
  { label: "Draft", value: "1", icon: "📝", bg: "bg-amber-500/10", border: "border-amber-200", text: "text-amber-700" },
];

const RECENT_COURSES = [
  { title: "Introduction to Web Development", students: 42, status: "Published", href: "/teacher/courses" },
  { title: "Advanced React Patterns", students: 28, status: "Published", href: "/teacher/courses" },
  { title: "Full-Stack Project (Draft)", students: 0, status: "Draft", href: "/teacher/courses" },
];

const QUICK_ACTIONS = [
  { title: "Create new course", href: "/teacher/courses", desc: "Add a new course to your catalog", icon: "➕" },
  { title: "Manage courses", href: "/teacher/courses", desc: "Edit, publish, or archive", icon: "📋" },
  { title: "View students", href: "/teacher/students", desc: "See who's enrolled", icon: "👥" },
  { title: "Analytics", href: "/teacher/analytics", desc: "Performance & insights", icon: "📊" },
];

export default function TeacherDashboardPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const { data: profile } = useGetTeacherProfileMeQuery(undefined, { skip: !email });
  const profileName = (profile as { name?: string } | undefined)?.name;
  const displayName = profileName
    ? profileName
    : email
      ? capitalizeName(email.split("@")[0])
      : "";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      {/* Welcome banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#242D3D] to-[#354053] p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="mt-2 text-white/90">Here&apos;s your teaching overview at a glance.</p>
        <span className="inline-flex mt-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white">
          Teacher
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ label, value, icon, bg, border, text }) => (
          <div
            key={label}
            className={`rounded-2xl border ${border} ${bg} p-5 shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className={`text-sm font-medium mt-0.5 ${text}`}>{label}</p>
              </div>
              <span className="text-2xl opacity-80" aria-hidden>{icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Your courses */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your courses</h2>
          <Link
            href="/teacher/courses"
            className="text-sm font-medium text-[#242D3D] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {RECENT_COURSES.map(({ title, students, status, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {students} {students === 1 ? "student" : "students"} enrolled
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      status === "Published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {status}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ title, href, desc, icon }) => (
            <Link
              key={title}
              href={href}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#242D3D]/30 transition-all duration-200"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#242D3D] text-white text-xl">
                {icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600 truncate">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
