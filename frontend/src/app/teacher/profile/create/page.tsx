"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { useCreateTeacherProfileMutation, useLazyGetTeacherProfileMeQuery } from "@/store/api/teacherApiSlice";
import { setProfileId } from "@/store/features/auth/authSlice";
import { useIsAuthenticated } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormValues = { name: string; phone?: string; bio?: string; age?: string };

export default function TeacherProfileCreatePage() {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.currentUser?.user);
  const router = useRouter();
  const [createProfile, { isLoading }] = useCreateTeacherProfileMutation();
  const [getProfileMe] = useLazyGetTeacherProfileMeQuery();
  const [errorMessage, setErrorMessage] = useState("");
  const [checking, setChecking] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }
    if (user?.role && user.role !== "teacher") {
      router.replace("/");
      return;
    }
    getProfileMe()
      .unwrap()
      .then((profile) => {
        const id = (profile as { id?: string })?.id;
        if (id) dispatch(setProfileId(id));
        router.replace("/teacher/dashboard");
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [isAuthenticated, user?.role, router, getProfileMe]);

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) return;
    setErrorMessage("");
    try {
      const created = await createProfile({
        userId: user.id,
        name: data.name.trim(),
        phone: data.phone?.trim() || undefined,
        bio: data.bio?.trim() || undefined,
        age: data.age ? parseInt(data.age, 10) : undefined,
      }).unwrap();
      const profileId = (created as { id?: string })?.id;
      if (profileId) dispatch(setProfileId(profileId));
      router.push("/teacher/dashboard");
    } catch (err: unknown) {
      const e = err as { status?: number; data?: { message?: string } };
      setErrorMessage(e?.data?.message || "Something went wrong. Please try again.");
    }
  };

  if (checking) {
    return (
      <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto flex items-center justify-center min-h-[40vh]">
        <p className="text-gray-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto align-middle justify-center">
      <h1 className="text-2xl font-bold text-gray-900">Create your teacher profile</h1>
      <p className="mt-1 text-gray-600">Complete your profile to access your dashboard and courses.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
            placeholder="Jane Teacher"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
            placeholder="+1 234 567 8900"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            {...register("bio")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none resize-none"
            placeholder="Your teaching background and subjects"
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
            Age
          </label>
          <input
            id="age"
            type="number"
            min={1}
            max={150}
            {...register("age")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#242D3D] focus:border-[#242D3D] outline-none"
            placeholder="35"
          />
        </div>
        {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full py-3 rounded-lg bg-[#242D3D] text-white font-medium hover:bg-[#1a222c] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating…" : "Create profile"}
        </button>
      </form>
    </div>
  );
}
