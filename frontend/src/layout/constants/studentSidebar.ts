import type { LinkToPage } from "@/utils/type";
import { BookIcon, CertificateIcon, ChartBarIcon, DashboardIcon, UserCircleIcon } from "../components/icons";

export const STUDENT_SIDEBAR_ITEMS: LinkToPage[] = [
  { title: "Dashboard", path: "/student/dashboard", icon: DashboardIcon },
  { title: "My Courses", path: "/student/courses", icon: BookIcon },
  { title: "Progress", path: "/student/progress", icon: ChartBarIcon },
  { title: "Certificates", path: "/student/certificates", icon: CertificateIcon },
  { title: "Profile", path: "/student/profile", icon: UserCircleIcon },
];
