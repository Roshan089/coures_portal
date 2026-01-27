import type { LinkToPage } from "@/utils/type";
import { BookIcon, DashboardIcon } from "../components/icons";

export const TEACHER_SIDEBAR_ITEMS: LinkToPage[] = [
  { title: "Dashboard", path: "/teacher/dashboard", icon: DashboardIcon },
  { title: "My Courses", path: "/teacher/courses", icon: BookIcon },
];
