"use client";

import { useAppSelector } from "@/store/hooks";

const STUDENTS = [
  { name: "Alex Johnson", email: "alex.j@example.com", course: "Introduction to Web Development", enrolled: "Jan 15, 2025" },
  { name: "Sam Wilson", email: "sam.w@example.com", course: "Advanced React Patterns", enrolled: "Jan 18, 2025" },
  { name: "Jordan Lee", email: "jordan.l@example.com", course: "Introduction to Web Development", enrolled: "Jan 20, 2025" },
  { name: "Casey Brown", email: "casey.b@example.com", course: "Full-Stack Project", enrolled: "Jan 22, 2025" },
];

export default function TeacherStudentsPage() {
  const email = useAppSelector((s) => s.auth.currentUser?.user?.email);
  const name = email ? email.split("@")[0] : "Teacher";

  return (
    <div className="p-6 md:p-8 lg:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Students</h1>
        <p className="mt-1 text-gray-600">View students enrolled in your courses.</p>
        <span className="inline-flex mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-blue-100 text-blue-700">
          {name}
        </span>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Student</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Course</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">Enrolled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STUDENTS.map(({ name: studentName, email: studentEmail, course, enrolled }) => (
                <tr key={studentEmail} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900">{studentName}</p>
                    <p className="text-sm text-gray-500">{studentEmail}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{course}</td>
                  <td className="px-5 py-4 text-gray-600 text-sm">{enrolled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
