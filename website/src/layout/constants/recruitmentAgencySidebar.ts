import { AGENCY_ROUTES } from "@/shared/constants/routes/agency.routes";
import DashBoard from "@/components/dashboardIcons/companySidebarIcon/DashBoard";
import ChildIcon from "@/components/dashboardIcons/companySidebarIcon/ChildIcon";
import JobPosting from "@/components/dashboardIcons/companySidebarIcon/JobPosting";
import MyCompany from "@/components/dashboardIcons/companySidebarIcon/MyCompany";
import Clientjobposting from "@/components/dashboardIcons/companySidebarIcon/Clientjobposting";
export const RECRUITER_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    path: AGENCY_ROUTES.DASHBOARD,
    icon: DashBoard,
  },
  {
    title: "Clients",
    path: "#",
    icon: JobPosting,
    children: [
      {
        title: "view Clients",
        path: AGENCY_ROUTES.ALL_CLIENTS,
        icon: ChildIcon,
      },
      {
        title: "Add New Client",
        path: AGENCY_ROUTES.CREATE_CLIENT,
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "Client Job Posting",
    path: "#",
    icon: Clientjobposting,
    children: [
      {
        title: "View All Clients Job Postings",
        path: AGENCY_ROUTES.ALL_JOBS,
        icon: ChildIcon,
      },
      {
        title: "New Client Job Posting",
        path: "/me/settings",
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "My Company",
    path: "#",
    icon: MyCompany,

    children: [

      {
        title: "My Profile",
        path: AGENCY_ROUTES.AGENCY_ABOUT,
        icon: ChildIcon,
      },
      {
        title: "License & Billing",
        path: AGENCY_ROUTES.LICENSE_BILLING,
        icon: ChildIcon,
      },
    ],
  },
];
