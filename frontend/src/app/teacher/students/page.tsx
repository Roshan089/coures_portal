"use client";

import { useState, useMemo } from "react";
import {
  useGetTeacherProfileMeQuery,
  useGetTeacherStudentsQuery,
  useUpdateTeacherStudentAccessStatusMutation,
  type TeacherStudentEnrollment,
} from "@/store/api/teacherApiSlice";
import { useGetCoursesByTeacherQuery } from "@/store/api/courseApiSlice";

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
}

function PaymentDetails({ enrollment }: { enrollment: TeacherStudentEnrollment }) {
  const order = enrollment.order;
  if (!order) return <span className="text-gray-500 text-sm">—</span>;

  const emiCount = order.emis?.length ?? 0;
  const paidCount = order.emis?.filter((e) => e.status === "paid").length ?? 0;

  return (
    <div className="text-sm space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-gray-700">₹{Number(order.amount).toLocaleString("en-IN")}</span>
        <span
          className={`px-1.5 py-0.5 rounded text-xs ${
            order.status === "paid" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {order.status}
        </span>
      </div>
      {emiCount > 0 && (
        <div className="text-gray-600">
          EMI {paidCount}/{emiCount} paid
          <ul className="mt-1 ml-2 list-disc text-xs space-y-0.5">
            {order.emis?.map((emi) => (
              <li key={emi.id}>
                #{emi.installmentNumber}: ₹{Number(emi.amount).toLocaleString("en-IN")} — {emi.status}
                {emi.paidAt ? ` (${formatDate(emi.paidAt)})` : emi.dueDate ? ` — due ${formatDate(emi.dueDate)}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function TeacherStudentsPage() {
  const [courseId, setCourseId] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const { data: profile } = useGetTeacherProfileMeQuery();
  const teacherId = profile?.id ?? "";

  const filters = useMemo(() => {
    const f: { courseId?: string; status?: string } = {};
    if (courseId) f.courseId = courseId;
    if (status) f.status = status;
    return Object.keys(f).length ? f : undefined;
  }, [courseId, status]);

  const { data: courses = [] } = useGetCoursesByTeacherQuery(teacherId, { skip: !teacherId });
  const { data: enrollments = [], isLoading, isError } = useGetTeacherStudentsQuery(filters);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateTeacherStudentAccessStatusMutation();

  const name = profile?.name ?? profile?.user?.email?.split("@")[0] ?? "Teacher";

  const handleStatusChange = (courseAccessId: string, newStatus: "active" | "suspended" | "revoked") => {
    updateStatus({ courseAccessId, status: newStatus });
  };

  return (
    <div className="py-6 px-4 md:py-8 md:px-5 lg:py-10 lg:px-6 w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Students</h1>
        <p className="mt-1 text-gray-600">View students enrolled in your courses (course-wise) and their payment details.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-700">
          {name}
        </span>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Course</span>
          <select
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Access status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="revoked">Revoked</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {isLoading && (
          <div className="px-5 py-8 text-center text-gray-500">Loading students…</div>
        )}
        {isError && (
          <div className="px-5 py-8 text-center text-red-600">Failed to load students. Please try again.</div>
        )}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Student</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Course</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Enrolled</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Access</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Payment details</th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-gray-500">
                      No students found. Enrollments appear here when students purchase your courses.
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment) => (
                    <tr key={enrollment.courseAccessId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-900">{enrollment.student?.name ?? "—"}</p>
                        <p className="text-sm text-gray-500">{enrollment.student?.user?.email ?? "—"}</p>
                      </td>
                      <td className="px-5 py-4 text-gray-700">{enrollment.course?.title ?? "—"}</td>
                      <td className="px-5 py-4 text-gray-600 text-sm">{formatDate(enrollment.enrolledAt)}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            enrollment.accessStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : enrollment.accessStatus === "suspended"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {enrollment.accessStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <PaymentDetails enrollment={enrollment} />
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={enrollment.accessStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              enrollment.courseAccessId,
                              e.target.value as "active" | "suspended" | "revoked"
                            )
                          }
                          disabled={isUpdating}
                          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                          title="Change access status (e.g. suspend for rule violation)"
                        >
                          <option value="active">Active</option>
                          <option value="suspended">Suspended</option>
                          <option value="revoked">Revoked</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
