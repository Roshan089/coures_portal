"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function StudentProfilePage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-3xl">
      {/* Hero profile card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#242D3D] via-[#2d3849] to-[#354053] p-8 md:p-10 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 text-3xl font-bold text-white shadow-lg">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{name}</h1>
            <p className="mt-1 text-white/90 truncate">{email}</p>
            <span className="inline-flex mt-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              Student
            </span>
          </div>
        </div>
      </div>

      {/* Account details */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Account details
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Display name</p>
                <p className="mt-1 font-medium text-gray-900">{name}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Email address</p>
                <p className="mt-1 font-medium text-gray-900 break-all">{email}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">
          Quick links
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Link
            href="/student/progress"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#242D3D]/20 transition-all"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#242D3D]/10 text-[#242D3D] text-lg">📊</span>
            <span className="font-medium text-gray-900">My progress</span>
          </Link>
          <Link
            href="/student/certificates"
            className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-[#242D3D]/20 transition-all"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#242D3D]/10 text-[#242D3D] text-lg">🏆</span>
            <span className="font-medium text-gray-900">Certificates</span>
          </Link>
        </div>
      </section>

      {/* Actions */}
      <section className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/student/profile/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] shadow-sm hover:shadow-md transition-all"
        >
          Edit profile
        </Link>
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          Back to dashboard
        </Link>
      </section>
    </div>
  );
}
