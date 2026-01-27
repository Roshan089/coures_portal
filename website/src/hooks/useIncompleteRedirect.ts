"use client";
import { APPLICANT_ROUTES, COMPANY_ROUTES } from "@/shared/constants";
import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import { UserType } from "@/shared/enum/user-type";
import { useRouter } from "next/navigation"; // App Router's navigation

export const useIncompleteRedirect = () => {
  const router = useRouter();

  const handleRedirect = (role: UserType) => {
    let route = "/";
    switch (role) {
      case UserType.hr:
        route = COMPANY_ROUTES.CREATE;
        break;
      case UserType.applicant:
        route = APPLICANT_ROUTES.CREATE_AND_EDIT_PROFILE;
        break;
      case UserType.agency:
        route = AGENCY_ROUTES.CREATE; // Agencies should also create their profile
        break;
      case UserType.logiLeads:
        route = "/admin/profile";
        break;
    }

    router.push(route);
  };

  return handleRedirect; // Return the function
};
