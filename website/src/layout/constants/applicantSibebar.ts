import Chats from "@/components/dashboardIcons/applicantSidebarIcon/Chats";
import MyJobs from "@/components/dashboardIcons/applicantSidebarIcon/Myjobs";
import Plans from "@/components/dashboardIcons/applicantSidebarIcon/Plans";
import Profile from "@/components/dashboardIcons/applicantSidebarIcon/Profile";
import ChildIcon from "@/components/dashboardIcons/companySidebarIcon/ChildIcon";
import { APPLICANT_ROUTES } from "@/shared/constants";

export const APPLICANT_SIDEBAR_ITEMS = [
  {
    title: "Profile",
    path: APPLICANT_ROUTES.PROFILE,
    icon: Profile,
  },
  {
    title: "Jobs",
    path: "#",
    icon: MyJobs,
    children: [
      {
        title: "All jobs",
        path: APPLICANT_ROUTES.ALL_JOBS,
        icon: ChildIcon,
      },
      {
        title: "My jobs",
        path: APPLICANT_ROUTES.MY_JOBS,
        icon: ChildIcon,
      },
    ],
  },
  {
    title: "Chats",
    path: APPLICANT_ROUTES.CHATS,
    icon: Chats,
  },
  {
    title: "Plans",
    path: APPLICANT_ROUTES.PLANS,
    icon: Plans,
  },
];
