import type { LinkToPage } from "@/utils/type";
import { BookIcon, DashboardIcon } from "../components/icons";

export const STUDENT_SIDEBAR_ITEMS: LinkToPage[] = [
  { title: "Dashboard", path: "/student/dashboard", icon: DashboardIcon },
  { title: "My Courses", path: "/student/courses", icon: BookIcon },
];
