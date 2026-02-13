"use client";

import { useGetTeacherProfileMeQuery } from "@/store/api/teacherApiSlice";
import { useCreateCourseMutation } from "@/store/api/courseApiSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";

type FormValues = {
  title: string;
  description?: string;
  isPublished?: boolean;
  price?: string;
  emiAllowed?: boolean;
  emiCount?: number;
};

export default function TeacherCreateCoursePage() {
  const isAuthenticated = useIsAuthenticated();
  const user = useAppSelector((s) => s.auth.currentUser?.user);
  const router = useRouter();
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetTeacherProfileMeQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { isPublished: false, price: "0", emiAllowed: false },
  });

  const emiAllowed = watch("emiAllowed");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    if (user?.role && user.role !== "teacher") {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, user?.role, router]);

  const onSubmit = async (data: FormValues) => {
    if (!profile?.id) return;
    setErrorMessage("");
    try {
      await createCourse({
        title: data.title.trim(),
        description: data.description?.trim() || undefined,
        teacherId: profile.id,
        isPublished: Boolean(data.isPublished),
        price: data.price || "0",
        emiAllowed: Boolean(data.emiAllowed),
        emiCount: data.emiAllowed && data.emiCount ? data.emiCount : undefined,
      }).unwrap();
      router.push("/teacher/courses");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setErrorMessage(e?.data?.message ?? "Something went wrong. Please try again.");
    }
  };

  if (!isAuthenticated || (user?.role && user.role !== "teacher")) {
    return null;
  }

  if (profileLoading || !profile) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
        <p className="text-red-600">You need a teacher profile to create courses.</p>
        <Link href="/teacher/profile" className="mt-4 inline-block text-[#242D3D] font-medium hover:underline">
          Go to profile
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <h1 className="text-2xl font-bold text-gray-900">Create course</h1>
      <p className="mt-1 text-gray-600">Add a new course. Students will see it when published.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4 max-w-xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "Title is required" })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
            placeholder="e.g. Introduction to Mathematics"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none resize-none"
            placeholder="What will students learn?"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            {...register("price", {
              valueAsNumber: false,
              validate: (value) => {
                const num = parseFloat(value || "0");
                return num >= 0 || "Price must be 0 or greater";
              },
            })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
            placeholder="0.00"
            defaultValue="0"
          />
          <p className="mt-1 text-xs text-gray-500">Set to 0 for free courses</p>
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="emiAllowed"
            type="checkbox"
            {...register("emiAllowed")}
            className="h-4 w-4 rounded border-gray-300 text-[#242D3D] focus:ring-[#242D3D]"
          />
          <label htmlFor="emiAllowed" className="text-sm font-medium text-gray-700">
            Allow EMI (Easy Monthly Installments)
          </label>
        </div>

        {emiAllowed && (
          <div>
            <label htmlFor="emiCount" className="block text-sm font-medium text-gray-700 mb-1">
              Number of EMI Installments
            </label>
            <input
              id="emiCount"
              type="number"
              min="1"
              max="12"
              {...register("emiCount", {
                valueAsNumber: true,
                required: emiAllowed ? "Number of installments is required when EMI is enabled" : false,
                min: { value: 1, message: "Must be at least 1" },
                max: { value: 12, message: "Maximum 12 installments" },
              })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
              placeholder="e.g. 3"
            />
            <p className="mt-1 text-xs text-gray-500">Number of monthly installments (1-12)</p>
            {errors.emiCount && <p className="mt-1 text-sm text-red-600">{errors.emiCount.message}</p>}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            {...register("isPublished")}
            className="h-4 w-4 rounded border-gray-300 text-[#242D3D] focus:ring-[#242D3D]"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
            Publish now (visible to students)
          </label>
        </div>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={creating}
            className="px-5 py-2.5 rounded-xl bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {creating ? "Creating…" : "Create course"}
          </button>
          <Link
            href="/teacher/courses"
            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
