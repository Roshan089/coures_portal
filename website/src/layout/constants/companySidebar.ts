import Chats from "@/components/dashboardIcons/applicantSidebarIcon/Chats";
import ChildIcon from "@/components/dashboardIcons/companySidebarIcon/ChildIcon";
import DashBoard from "@/components/dashboardIcons/companySidebarIcon/DashBoard";
import JobPosting from "@/components/dashboardIcons/companySidebarIcon/JobPosting";

import MyCompany from "@/components/dashboardIcons/companySidebarIcon/MyCompany";
import { COMPANY_ROUTES } from "@/shared/constants";
export const COMPANY_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    path: COMPANY_ROUTES.DASHBOARD,
    icon: DashBoard,
  },
  {
    title: "Job Postings",
    path: "#",
    icon: JobPosting,
    children: [
      {
        title: "View job postings",
        path: COMPANY_ROUTES.ALL_JOBS,
        icon: ChildIcon,
      },
      {
        title: "Add New job posting",
        path: COMPANY_ROUTES.CREATE_JOB,
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "My Company",
    path: "/",
    icon: MyCompany,
    children: [
      {
        title: "My profile",
        path: COMPANY_ROUTES.CLIENT_ABOUT,
        icon: ChildIcon,
      },
      {
        title: "License & Biling",
        path: COMPANY_ROUTES.LICENSE_BILLING,
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "Chats",
    path: COMPANY_ROUTES.CANDIDATE_MESSAGING,
    icon: Chats,
  },

  // {
  //   title: "Customer Support",
  //   path: "/",
  //   icon: CustomerSupport,
  // },
];
