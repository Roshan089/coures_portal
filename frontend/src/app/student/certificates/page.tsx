"use client";

import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

const CERTIFICATES = [
  { title: "Introduction to Web Development", date: "Jan 15, 2025", instructor: "Jane Smith" },
  { title: "Data Structures & Algorithms", date: "Dec 20, 2024", instructor: "John Doe" },
  { title: "Git & GitHub Fundamentals", date: "Nov 10, 2024", instructor: "Alex Lee" },
];

export default function StudentCertificatesPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Student";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Certificates</h1>
        <p className="mt-1 text-gray-600">Your completed course certificates.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-emerald-100 text-emerald-700">
          {name}
        </span>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATES.map(({ title, date, instructor }) => (
          <div
            key={title}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 text-2xl mb-4">
              🏆
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">by {instructor}</p>
            <p className="text-xs text-gray-400 mt-2">{date}</p>
            <button
              type="button"
              className="mt-4 w-full py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 text-center">
        <p className="text-gray-600">Complete more courses to earn additional certificates.</p>
        <Link href="/student/courses" className="mt-3 inline-block text-sm font-medium text-[#242D3D] hover:underline">
          Browse courses →
        </Link>
      </div>
    </div>
  );
}
