"use client";

import { useGetCourseQuery } from "@/store/api/courseApiSlice";
import { useGetVideosByCourseQuery } from "@/store/api/courseApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

export default function StudentCourseDetailPage() {
  const isAuthenticated = useIsAuthenticated();
  const { user } = useAppSelector((s) => ({ user: s.auth.currentUser?.user }));
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: course, isLoading, isError } = useGetCourseQuery(id!, { skip: !id || !isAuthenticated });
  const { data: videos = [], isLoading: videosLoading } = useGetVideosByCourseQuery(id!, {
    skip: !id || !isAuthenticated || !course?.isPublished,
  });

  if (!isAuthenticated || (user?.role && user.role !== "student")) {
    if (typeof window !== "undefined") router.replace("/auth/login");
    return null;
  }

  if (!id) {
    router.replace("/student/courses");
    return null;
  }

  if (isLoading || !course) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading course…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
        <p className="text-red-600">Course not found.</p>
        <Link href="/student/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  if (!course.isPublished) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
        <p className="text-gray-600">This course is not available yet.</p>
        <Link href="/student/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-6">
        <Link href="/student/courses" className="text-sm font-medium text-[#242D3D] hover:underline">
          ← Back to Courses
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          {course.teacher && (
            <p className="mt-2 text-sm text-gray-500">by {course.teacher.name}</p>
          )}
          {course.description && (
            <p className="mt-4 text-gray-600 whitespace-pre-wrap">{course.description}</p>
          )}
        </div>
      </div>

      {/* Videos / links (read-only) */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos & links</h2>
        {videosLoading && <p className="text-gray-500 text-sm">Loading…</p>}
        {!videosLoading && videos.length === 0 && (
          <p className="text-gray-500 text-sm">No videos or links in this course yet.</p>
        )}
        {!videosLoading && videos.length > 0 && (
          <ul className="space-y-3">
            {videos.map((video, index) => (
              <li key={video.id} className="rounded-xl border border-gray-200 bg-white p-5 hover:border-[#242D3D]/20 transition-colors">
                <span className="text-xs font-medium text-gray-400">#{index + 1}</span>
                <h3 className="font-medium text-gray-900 mt-0.5">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                )}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] transition-colors"
                >
                  Open link →
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
