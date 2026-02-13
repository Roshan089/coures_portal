"use client";

import {
  useGetCourseQuery,
  useUpdateCourseMutation,
  useGetVideosByCourseQuery,
  useCreateCourseVideoMutation,
  useUpdateCourseVideoMutation,
  useDeleteCourseVideoMutation,
  type CourseVideo,
} from "@/store/api/courseApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type VideoFormValues = { title: string; description?: string; url: string };
type CourseFormValues = {
  title: string;
  description?: string;
  price?: string;
  emiAllowed?: boolean;
  emiCount?: number;
};

export default function TeacherCourseDetailPage() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAppSelector((s) => s.auth.currentUser?.user);
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: course, isLoading, isError } = useGetCourseQuery(id!, { skip: !id || !isAuthenticated });
  const { data: videos = [], isLoading: videosLoading } = useGetVideosByCourseQuery(id!, { skip: !id || !isAuthenticated });
  const [updateCourse, { isLoading: updatingCourse }] = useUpdateCourseMutation();
  const [createVideo, { isLoading: creating }] = useCreateCourseVideoMutation();
  const [updateVideo, { isLoading: updating }] = useUpdateCourseVideoMutation();
  const [deleteVideo] = useDeleteCourseVideoMutation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editingCourse, setEditingCourse] = useState(false);

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<VideoFormValues>();
  const {
    register: registerCourse,
    handleSubmit: handleSubmitCourse,
    reset: resetCourse,
    formState: { errors: courseErrors },
    watch: watchCourse,
  } = useForm<CourseFormValues>();

  const emiAllowed = watchCourse("emiAllowed");

  useEffect(() => {
    if (course) {
      resetCourse({
        title: course.title,
        description: course.description || "",
        price: course.price || "0",
        emiAllowed: course.emiAllowed || false,
        emiCount: course.emiCount || undefined,
      });
    }
  }, [course, resetCourse]);

  if (!isAuthenticated || (user?.role && user.role !== "teacher")) {
    if (typeof window !== "undefined") router.replace("/auth/login");
    return null;
  }

  if (!id) {
    router.replace("/teacher/courses");
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
        <Link href="/teacher/courses" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Back to My Courses
        </Link>
      </div>
    );
  }

  const onAddVideo = async (data: VideoFormValues) => {
    setErrorMessage("");
    try {
      await createVideo({
        courseId: id,
        body: { title: data.title.trim(), description: data.description?.trim() || undefined, url: data.url.trim() },
      }).unwrap();
      reset({ title: "", description: "", url: "" });
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to add video.");
    }
  };

  const onUpdateVideo = async (videoId: string, data: VideoFormValues) => {
    setErrorMessage("");
    try {
      await updateVideo({
        id: videoId,
        body: { title: data.title.trim(), description: data.description?.trim() || undefined, url: data.url.trim() },
      }).unwrap();
      setEditingId(null);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to update video.");
    }
  };

  const onDeleteVideo = async (videoId: string) => {
    if (!confirm("Delete this video link?")) return;
    setErrorMessage("");
    try {
      await deleteVideo(videoId).unwrap();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to delete video.");
    }
  };

  const onMoveUp = async (index: number) => {
    if (index <= 0 || videos.length < 2) return;
    const current = videos[index];
    const previous = videos[index - 1];
    setMovingId(current.id);
    setErrorMessage("");
    try {
      await updateVideo({ id: current.id, body: { sortOrder: previous.sortOrder } }).unwrap();
      await updateVideo({ id: previous.id, body: { sortOrder: current.sortOrder } }).unwrap();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to reorder.");
    } finally {
      setMovingId(null);
    }
  };

  const onMoveDown = async (index: number) => {
    if (index < 0 || index >= videos.length - 1 || videos.length < 2) return;
    const current = videos[index];
    const next = videos[index + 1];
    setMovingId(current.id);
    setErrorMessage("");
    try {
      await updateVideo({ id: current.id, body: { sortOrder: next.sortOrder } }).unwrap();
      await updateVideo({ id: next.id, body: { sortOrder: current.sortOrder } }).unwrap();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to reorder.");
    } finally {
      setMovingId(null);
    }
  };

  const onTogglePublish = async () => {
    setErrorMessage("");
    try {
      await updateCourse({ id, body: { isPublished: !course.isPublished } }).unwrap();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to update course status.");
    }
  };

  const onUpdateCourse = async (data: CourseFormValues) => {
    setErrorMessage("");
    try {
      await updateCourse({
        id,
        body: {
          title: data.title.trim(),
          description: data.description?.trim() || undefined,
          price: data.price || "0",
          emiAllowed: Boolean(data.emiAllowed),
          emiCount: data.emiAllowed && data.emiCount ? data.emiCount : undefined,
        },
      }).unwrap();
      setEditingCourse(false);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Failed to update course.");
    }
  };

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <div className="mb-6">
        <Link href="/teacher/courses" className="text-sm font-medium text-[#242D3D] hover:underline">
          ← Back to My Courses
        </Link>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              {!editingCourse ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        course.isPublished ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </span>
                    <button
                      type="button"
                      onClick={onTogglePublish}
                      disabled={updatingCourse}
                      className={`inline-flex px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 ${
                        course.isPublished
                          ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          : "bg-[#242D3D] text-white hover:bg-[#1a222c]"
                      }`}
                    >
                      {updatingCourse ? "Updating…" : course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(true)}
                      className="inline-flex px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Edit Course
                    </button>
                  </div>
                  {course.description && (
                    <p className="mt-4 text-gray-600 whitespace-pre-wrap">{course.description}</p>
                  )}
                  <div className="mt-4 flex flex-wrap items-center gap-4">
                    {course.price && parseFloat(course.price) > 0 ? (
                      <div className="text-lg font-semibold text-gray-900">Price: ₹{parseFloat(course.price).toFixed(2)}</div>
                    ) : (
                      <div className="text-lg font-semibold text-green-600">Free Course</div>
                    )}
                    {course.emiAllowed && course.emiCount && (
                      <div className="text-sm text-gray-600">EMI: {course.emiCount} installments</div>
                    )}
                  </div>
                  {course.teacher && <p className="mt-4 text-sm text-gray-500">By {course.teacher.name}</p>}
                </>
              ) : (
                <form onSubmit={handleSubmitCourse(onUpdateCourse)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      {...registerCourse("title", { required: "Title is required" })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D]"
                    />
                    {courseErrors.title && <p className="text-sm text-red-600">{courseErrors.title.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      {...registerCourse("description")}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...registerCourse("price")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set to 0 for free courses</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...registerCourse("emiAllowed")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <label className="text-sm font-medium text-gray-700">Allow EMI</label>
                  </div>
                  {emiAllowed && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">EMI Installments</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        {...registerCourse("emiCount", {
                          valueAsNumber: true,
                          min: 1,
                          max: 12,
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D]"
                      />
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updatingCourse}
                      className="px-4 py-2 bg-[#242D3D] text-white rounded-lg hover:bg-[#1a222c] disabled:opacity-60"
                    >
                      {updatingCourse ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCourse(false);
                        resetCourse();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Videos section */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Videos / links</h2>
        <p className="text-sm text-gray-600 mb-4">Add video or resource links with a title and description.</p>

        {/* Add video form */}
        <form onSubmit={handleSubmit(onAddVideo)} className="mb-6 p-5 rounded-xl border border-gray-200 bg-gray-50/50 flex flex-col gap-3">
          <h3 className="text-sm font-medium text-gray-700">Add video or link</h3>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
          />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
          <textarea
            {...register("description")}
            placeholder="Description (optional)"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none resize-none"
          />
          <input
            {...register("url", { required: "URL is required" })}
            placeholder="https://..."
            type="url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
          />
          {errors.url && <p className="text-sm text-red-600">{errors.url.message}</p>}
          <button
            type="submit"
            disabled={creating}
            className="self-start px-4 py-2 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] disabled:opacity-60"
          >
            {creating ? "Adding…" : "Add video / link"}
          </button>
        </form>

        {errorMessage && <p className="mb-4 text-sm text-red-600">{errorMessage}</p>}

        {/* Video list */}
        {videosLoading && <p className="text-gray-500 text-sm">Loading videos…</p>}
        {!videosLoading && videos.length === 0 && (
          <p className="text-gray-500 text-sm">No videos or links yet. Add one above.</p>
        )}
        {!videosLoading && videos.length > 0 && (
          <ul className="space-y-3">
            {videos.map((video, index) => (
              <li key={video.id} className="rounded-xl border border-gray-200 bg-white p-4">
                {editingId === video.id ? (
                  <VideoEditForm
                    key={video.id}
                    video={video}
                    onSave={(data) => onUpdateVideo(video.id, data)}
                    onCancel={() => setEditingId(null)}
                    saving={updating}
                  />
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-gray-400 font-medium">#{index + 1}</span>
                      <h3 className="font-medium text-gray-900">{video.title}</h3>
                      {video.description && (
                        <p className="text-sm text-gray-500 mt-0.5">{video.description}</p>
                      )}
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#242D3D] hover:underline mt-1 inline-block truncate max-w-full"
                      >
                        {video.url}
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-400">Order:</span>
                      <button
                        type="button"
                        onClick={() => onMoveUp(index)}
                        disabled={index === 0 || movingId !== null}
                        title="Move up"
                        className="px-2 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveDown(index)}
                        disabled={index === videos.length - 1 || movingId !== null}
                        title="Move down"
                        className="px-2 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(video.id)}
                        className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteVideo(video.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function VideoEditForm({
  video,
  onSave,
  onCancel,
  saving,
}: {
  video: CourseVideo;
  onSave: (data: VideoFormValues) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<VideoFormValues>({
    defaultValues: { title: video.title, description: video.description ?? "", url: video.url },
  });
  return (
    <form onSubmit={handleSubmit(onSave)} className="flex flex-col gap-3">
      <input
        {...register("title", { required: "Title is required" })}
        placeholder="Title"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] outline-none"
      />
      {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
      <textarea
        {...register("description")}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] outline-none resize-none"
      />
      <input
        {...register("url", { required: "URL is required" })}
        placeholder="https://..."
        type="url"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] outline-none"
      />
      {errors.url && <p className="text-sm text-red-600">{errors.url.message}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-[#242D3D] text-white text-sm font-medium hover:bg-[#1a222c] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </form>
  );
}
