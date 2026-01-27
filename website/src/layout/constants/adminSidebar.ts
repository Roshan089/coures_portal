import { ADMIN_ROUTES } from "@/shared/constants/routes/admin.routes";
import Dashboard from "@/components/dashboardIcons/companySidebarIcon/DashBoard";
import ChildIcon from "@/components/dashboardIcons/companySidebarIcon/ChildIcon";
import MyCompany from "@/components/dashboardIcons/companySidebarIcon/MyCompany";
import JobPosting from "@/components/dashboardIcons/companySidebarIcon/JobPosting";
import LicensingIcon from "@/components/dashboardIcons/AdminSideBarIcon/LicensingIcon";
import RolesAndPermissionIcon from "@/components/dashboardIcons/AdminSideBarIcon/RolesAndPermissionIcon";
import ChatsIcon from "@/components/dashboardIcons/AdminSideBarIcon/ChatsIcon";
import CustomerSupportIcon from "@/components/dashboardIcons/AdminSideBarIcon/CustomerSupportIcon";
export const ADMIN_SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    path: ADMIN_ROUTES.DASHBOARD,
    icon: Dashboard,
  },
  {
    title: "Customers",
    path: "#",
    icon: JobPosting,

    children: [
      {
        title: "Recruitment Agencies",
        path: "#",
        icon: ChildIcon,
      },
      {
        title: "Companies",
        path: ADMIN_ROUTES.COMPANIES,
        icon: ChildIcon,
      },
      {
        title: "Applicants",
        path: ADMIN_ROUTES.APPLICANTS,
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "Ads",
    path: ADMIN_ROUTES.ADS,
    icon: MyCompany,
  },
  {
    title: "Licensing",
    path: ADMIN_ROUTES.LICENSING,
    icon: LicensingIcon,
  },
  {
    title: "Roles & Permissions",
    path: "#",
    icon: RolesAndPermissionIcon,
  },

  {
    title: "Chats",
    path: "#",
    icon: ChatsIcon,
  },
  {
    title: "Customer Support",
    path: "",
    icon: CustomerSupportIcon,
  },
];
