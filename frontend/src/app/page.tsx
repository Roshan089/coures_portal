"use client";

import { useIsAuthenticated } from "@/hooks/auth";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { setProfileId } from "@/store/features/auth/authSlice";
import { useLazyGetStudentProfileMeQuery } from "@/store/api/studentApiSlice";
import { useLazyGetTeacherProfileMeQuery } from "@/store/api/teacherApiSlice";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const ROLE_QUICK_LINKS: Record<
  string,
  { icon: string; title: string; href: string; desc: string }[]
> = {
  admin: [
    { icon: "📊", title: "Dashboard", href: "/admin/dashboard", desc: "Overview & analytics" },
    { icon: "📚", title: "Courses", href: "/admin/courses", desc: "Manage all courses" },
    { icon: "👥", title: "Users", href: "/admin/users", desc: "Users & roles" },
  ],
  teacher: [
    { icon: "📊", title: "Dashboard", href: "/teacher/dashboard", desc: "Your teaching overview" },
    { icon: "📚", title: "My Courses", href: "/teacher/courses", desc: "Create & manage courses" },
  ],
  student: [
    { icon: "📊", title: "Dashboard", href: "/student/dashboard", desc: "Your learning overview" },
    { icon: "📚", title: "My Courses", href: "/student/courses", desc: "Browse & continue learning" },
  ],
};

export default function HomePage() {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [getStudentProfileMe] = useLazyGetStudentProfileMeQuery();
  const [getTeacherProfileMe] = useLazyGetTeacherProfileMeQuery();
  const [profileChecking, setProfileChecking] = useState(true);
  const { role, email } = useAppSelector((s) => ({
    role: s.auth.currentUser?.user?.role,
    email: s.auth.currentUser?.user?.email,
  }));

  const needsProfileCheck = isAuthenticated && (role === "student" || role === "teacher");

  useEffect(() => {
    if (!needsProfileCheck) {
      setProfileChecking(false);
      return;
    }
    const fn = role === "teacher" ? getTeacherProfileMe : getStudentProfileMe;
    fn()
      .unwrap()
      .then((profile) => {
        const id = (profile as { id?: string })?.id;
        if (id) dispatch(setProfileId(id));
        setProfileChecking(false);
      })
      .catch((e) => {
        if ((e as { status?: number })?.status === 404) {
          router.replace(role === "teacher" ? "/teacher/profile/create" : "/student/profile/create");
        } else {
          setProfileChecking(false);
        }
      });
  }, [needsProfileCheck, role, getTeacherProfileMe, getStudentProfileMe, router]);

  const dashboardPath =
    role === "admin"
      ? "/admin/dashboard"
      : role === "teacher"
        ? "/teacher/dashboard"
        : "/student/dashboard";

  const quickLinks = ROLE_QUICK_LINKS[role ?? "student"] ?? ROLE_QUICK_LINKS.student;

  if (isAuthenticated) {
    if (needsProfileCheck && profileChecking) {
      return (
        <div className="p-6 md:p-8 lg:p-10 flex items-center justify-center min-h-[40vh]">
          <p className="text-gray-500">Loading…</p>
        </div>
      );
    }
    return (
      <div className="p-6 md:p-8 lg:p-10 max-w-5xl">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {getGreeting()}
            {email ? `, ${email.split("@")[0]}` : ""}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                ${role === "admin" ? "bg-slate-100 text-slate-700" : ""}
                ${role === "teacher" ? "bg-blue-100 text-blue-700" : ""}
                ${role === "student" ? "bg-emerald-100 text-emerald-700" : ""}
                ${!role ? "bg-gray-100 text-gray-600" : ""}
              `}
            >
              {role ?? "Member"}
            </span>
          </div>
        </div>

        {/* Quick action cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {quickLinks.map(({ icon, title, href, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start gap-4 p-5 md:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm
                         hover:shadow-lg hover:border-[#242D3D]/20 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span
                className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-100 group-hover:bg-[#242D3D]/10 flex items-center justify-center text-2xl
                           transition-colors duration-200"
              >
                {icon}
              </span>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 group-hover:text-[#242D3D] transition-colors">
                  {title}
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">{desc}</p>
              </div>
              <span className="flex-shrink-0 text-gray-400 group-hover:text-[#242D3D] group-hover:translate-x-1 transition-all">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Primary CTA */}
        <div className="mt-8 p-5 md:p-6 rounded-2xl bg-gradient-to-br from-[#242D3D] to-[#1a222c] text-white shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg">Go to your full dashboard</h3>
              <p className="mt-1 text-sm text-white/80">
                View detailed stats, recent activity, and more.
              </p>
            </div>
            <Link
              href={dashboardPath}
              className="flex-shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white text-[#242D3D] font-semibold
                         hover:bg-gray-100 transition-colors"
            >
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 md:px-8 py-16 md:py-24 lg:py-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]">
              Learn and teach on{" "}
              <span className="text-[#242D3D]">Course Portal</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl">
              Join <span className="font-semibold text-blue-600">students and educators</span> worldwide. 
              Access courses, track progress, and grow your skills.
            </p>
            <div className="mt-8">
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-8 py-4 rounded-xl bg-[#242D3D] text-white font-semibold text-lg hover:bg-[#1a222c] shadow-lg shadow-[#242D3D]/20 transition-all hover:shadow-xl hover:shadow-[#242D3D]/25"
              >
                Join for free
              </Link>
            </div>
          </div>
          {/* Right: abstract shapes */}
          <div className="relative h-64 md:h-80 lg:h-96 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-90" />
            </div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 opacity-80" />
            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-violet-100 to-purple-200 opacity-80" />
            <div className="relative z-10 grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: "📚", label: "Courses" },
                { icon: "👨‍🏫", label: "Teachers" },
                { icon: "📈", label: "Progress" },
                { icon: "✓", label: "Certify" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/90 backdrop-blur shadow-lg border border-gray-100/80"
                >
                  <span className="text-2xl md:text-3xl">{icon}</span>
                  <span className="text-xs md:text-sm font-medium text-gray-600 mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Find your path */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-gray-50/80">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Find your path
          </h2>
          <p className="mt-2 text-gray-600 text-center max-w-2xl mx-auto">
            Whether you&apos;re here to learn, teach, or manage—we&apos;ve got you covered.
          </p>
          <div className="mt-12 grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: "🎓",
                title: "Student",
                desc: "Browse courses, learn at your pace, and track your progress.",
                href: "/auth/signup",
              },
              {
                icon: "👩‍🏫",
                title: "Teacher",
                desc: "Create and manage courses, engage with your students.",
                href: "/auth/signup",
              },
              {
                icon: "⚙️",
                title: "Admin",
                desc: "Manage users, roles, and keep the platform running smoothly.",
                href: "/auth/signup",
              },
            ].map(({ icon, title, desc, href }) => (
              <Link
                key={title}
                href={href}
                className="group block p-6 md:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-[#242D3D]/30 transition-all"
              >
                <span className="text-4xl">{icon}</span>
                <h3 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-[#242D3D] transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-gray-600">{desc}</p>
                <span className="mt-4 inline-flex items-center text-sm font-medium text-[#242D3D] group-hover:underline">
                  Get started →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why / Features */}
      <section className="px-4 md:px-8 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Why Course Portal?
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: "✨", title: "Quality content", desc: "Structured courses designed for real learning outcomes." },
              { icon: "🔒", title: "Secure & reliable", desc: "Your data and progress are safe with us." },
              { icon: "📱", title: "Works everywhere", desc: "Learn on desktop, tablet, or phone." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center">
                <span className="text-4xl">{icon}</span>
                <h3 className="mt-4 text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 md:px-8 py-16 md:py-20 bg-[#242D3D]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ready to get started?
          </h2>
          <p className="mt-3 text-gray-300">
            Create your free account in less than a minute.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-[#242D3D] font-semibold hover:bg-gray-100 transition-colors"
            >
              Join for free
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/60 text-white font-semibold hover:bg-white/10 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
