"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // App Router's navigation
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { UserType } from "@/shared/enum/user-type";
import {
  COMPANY_ROUTES,
  APPLICANT_ROUTES,
  ADMIN_ROUTES,
} from "@/shared/constants";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";

export function useRoleRedirect() {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    // Redirect based on user type
    switch (currentUser?.user?.type) {
      case UserType.logiLeads:
        router.push(`${ADMIN_ROUTES.DASHBOARD}`);
        break;
      case UserType.hr:
        router.push(`${COMPANY_ROUTES.DASHBOARD}`);
        break;
      case UserType.applicant:
        router.push(`${APPLICANT_ROUTES.ALL_JOBS}`);
        break;
      case UserType.agency:
        router.push(`${AGENCY_ROUTES.DASHBOARD}`);
        break;
      default:
        router.push("/public/login"); // Fallback
    }
  }, [isAuthenticated, currentUser, router]); // Dependencies
}
