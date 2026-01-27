"use client";

import { useIsAuthenticated } from "@/hooks/auth";
import { useAppSelector } from "@/store/hooks";
import Link from "next/link";

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  const role = useAppSelector((s) => s.auth.currentUser?.user?.role);

  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "teacher"
        ? "/teacher/dashboard"
        : "/student/dashboard";

  if (isAuthenticated) {
    return (
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
        <p className="text-gray-600 mb-4">
          Use the menu to navigate to your dashboard.
        </p>
        <Link
          href={dashboardPath}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-[#242D3D] text-white font-medium hover:bg-[#1a222c]"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Portal</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Sign in to access your courses and learning materials.
      </p>
      <div className="flex gap-4">
        <Link
          href="/auth/login"
          className="px-6 py-3 rounded-lg bg-[#242D3D] text-white font-medium hover:bg-[#1a222c]"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}
