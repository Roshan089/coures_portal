"use client";

import { useAppSelector } from "@/store/hooks";
import { useGetStudentProfileMeQuery } from "@/store/api/studentApiSlice";
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
  { label: "Enrolled courses", value: "5", icon: "📚", bg: "bg-emerald-500/10", border: "border-emerald-200", text: "text-emerald-700" },
  { label: "In progress", value: "2", icon: "⏳", bg: "bg-amber-500/10", border: "border-amber-200", text: "text-amber-700" },
  { label: "Completed", value: "3", icon: "✅", bg: "bg-blue-500/10", border: "border-blue-200", text: "text-blue-700" },
  { label: "Hours learned", value: "24", icon: "⏱️", bg: "bg-violet-500/10", border: "border-violet-200", text: "text-violet-700" },
];

const CONTINUE_LEARNING = [
  { title: "Introduction to Web Development", progress: 65, module: "Module 4 of 6", href: "/student/courses" },
  { title: "Data Structures & Algorithms", progress: 30, module: "Module 2 of 8", href: "/student/courses" },
];

const RECENTLY_COMPLETED = [
  { title: "Git & GitHub Fundamentals", completed: "Jan 10, 2025", href: "/student/certificates" },
  { title: "HTML & CSS Basics", completed: "Dec 15, 2024", href: "/student/certificates" },
];

const QUICK_ACTIONS = [
  { title: "Browse all courses", href: "/student/courses", desc: "Find new courses to enroll", icon: "📖" },
  { title: "My progress", href: "/student/progress", desc: "Track learning across courses", icon: "📊" },
  { title: "Certificates", href: "/student/certificates", desc: "View & download certificates", icon: "🏆" },
  { title: "Profile", href: "/student/profile", desc: "Edit profile & preferences", icon: "👤" },
];

export default function StudentDashboardPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const { data: profile } = useGetStudentProfileMeQuery(undefined, { skip: !email });
  const profileName = (profile as { name?: string } | undefined)?.name;
  const displayName = profileName
    ? profileName
    : email
      ? capitalizeName(email.split("@")[0])
      : "";

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      {/* Welcome banner */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#242D3D] to-[#354053] p-6 md:p-8 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">
          {getGreeting()}{displayName ? `, ${displayName}` : ""}
        </h1>
        <p className="mt-2 text-white/90">Here&apos;s your learning overview at a glance.</p>
        <span className="inline-flex mt-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-white/20 text-white">
          Student
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

      {/* Continue learning */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Continue learning</h2>
          <Link href="/student/courses" className="text-sm font-medium text-[#242D3D] hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {CONTINUE_LEARNING.map(({ title, progress, module, href }) => (
            <Link
              key={title}
              href={href}
              className="group block p-5 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#242D3D]/20 transition-all duration-200"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-[#242D3D]">{title}</h3>
              <p className="text-sm text-gray-500 mt-1">{module}</p>
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#242D3D] transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recently completed */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recently completed</h2>
          <Link href="/student/certificates" className="text-sm font-medium text-[#242D3D] hover:underline">
            All certificates →
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {RECENTLY_COMPLETED.map(({ title, completed, href }) => (
              <li key={title}>
                <Link
                  href={href}
                  className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 text-lg">
                      ✓
                    </span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{title}</h3>
                      <p className="text-sm text-gray-500">Completed {completed}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-[#242D3D]">View certificate →</span>
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
