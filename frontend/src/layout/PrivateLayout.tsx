"use client";

import { useAppSelector } from "@/store/hooks";
import { APP_CONSTANT } from "@/shared/constants/app";
import { useEffect, useMemo } from "react";
import { TopBarAndSideBarLayout } from "./TopBarAndSideBarLayout";
import { ADMIN_SIDEBAR_ITEMS } from "./constants/adminSidebar";
import { TEACHER_SIDEBAR_ITEMS } from "./constants/teacherSidebar";
import { STUDENT_SIDEBAR_ITEMS } from "./constants/studentSidebar";
import type { LinkToPage } from "@/utils/type";

export function getSidebarItems(role: string | undefined): Array<LinkToPage> {
  switch (role) {
    case "admin":
      return ADMIN_SIDEBAR_ITEMS;
    case "teacher":
      return TEACHER_SIDEBAR_ITEMS;
    case "student":
      return STUDENT_SIDEBAR_ITEMS;
    default:
      return STUDENT_SIDEBAR_ITEMS;
  }
}

export function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAppSelector((s) => s.auth);

  const sidebarItems = useMemo(
    () => getSidebarItems(currentUser?.user?.role),
    [currentUser?.user?.role]
  );

  const userEmail = currentUser?.user?.email;

  useEffect(() => {
    document.title = APP_CONSTANT.AppClientName;
  }, []);

  return (
    <TopBarAndSideBarLayout sidebarItems={sidebarItems} userEmail={userEmail}>
      {children}
    </TopBarAndSideBarLayout>
  );
}
