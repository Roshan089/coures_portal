"use client";
import CompanyLogo from "@/layout/components/CompanyLogo.png";
import { RootState } from "@/store/store";
import { LinkToPage } from "@/utils";
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";
import TopBarAndSideBarLayout from "./TopBarAndSideBarLayout";
import { ADMIN_SIDEBAR_ITEMS } from "./constants/adminSidebar";
import { APPLICANT_SIDEBAR_ITEMS } from "./constants/applicantSibebar";
import { COMPANY_SIDEBAR_ITEMS } from "./constants/companySidebar";
import { RECRUITER_SIDEBAR_ITEMS } from "./constants/recruitmentAgencySidebar";
import { APP_CONSTANT } from "@/shared/constants/app";
import BreadcrumbsNav from "@/hoc/BreadcrumbsNav";
import { UserType } from "@/shared/enum/user-type";

const TITLE_PRIVATE = APP_CONSTANT.AppClientName; // Title for pages after authentication

/**
 * SideBar navigation items with links for Private Layout
 */
export const getSidebarItems = (role: string): Array<LinkToPage> => {
  switch (role) {
    case UserType.logiLeads:
      return ADMIN_SIDEBAR_ITEMS;
    case UserType.applicant:
      return APPLICANT_SIDEBAR_ITEMS;
    case UserType.agency:
      return RECRUITER_SIDEBAR_ITEMS;
    case UserType.hr:
      return COMPANY_SIDEBAR_ITEMS;
    default:
      return COMPANY_SIDEBAR_ITEMS; // Default is COMPANY_SIDEBAR_ITEMS
  }
};

/**
 * Renders "Private Layout" composition
 * @layout PrivateLayout
 */
const PrivateLayout: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [sidebarItems, setSidebarItems] = useState<Array<LinkToPage>>([]);

  const { currentUser } = useSelector((state: RootState) => state.auth);
  console.log("currentUser", currentUser?.user?.type);
  useEffect(() => {
    setSidebarItems(getSidebarItems(currentUser?.user?.type));
  }, [currentUser]);

  useEffect(() => {
    document.title = TITLE_PRIVATE; // Update Tab Title
  }, []);

  return (
    <TopBarAndSideBarLayout
      sidebarItems={sidebarItems}
      title={TITLE_PRIVATE}
      variant="sidebarPersistentOnDesktop"
      companyLogo={CompanyLogo.src}
    >
      <BreadcrumbsNav />
      {children}
      {/* <Stack component="footer">Copyright &copy; </Stack> */}
    </TopBarAndSideBarLayout>
  );
};

export default PrivateLayout;
