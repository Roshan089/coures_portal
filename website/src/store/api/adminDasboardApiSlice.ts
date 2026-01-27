import { apiSlice } from "./apiSlice";
import { USERS_ADMIN_DASHBOARD_CONSTANT } from "@/shared/constants/api/adminDashboard";
import { CompanyGraphResponse } from "@/shared/types/AdminDashboardTypes";

export const adminDashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSummary: builder.query<any[], void>({
      query: () => ({
        url: `${USERS_ADMIN_DASHBOARD_CONSTANT.getAllDetails}`,
        method: "get",
      }),
    }),
    getGraphRevenueAdmin: builder.query<any, string>({
      query: (period: string) => ({
        url: `${USERS_ADMIN_DASHBOARD_CONSTANT.getAllGraphRevenueAdmin(
          period
        )}`,
        method: "get",
      }),
    }),
    getCompanyGraph: builder.query<CompanyGraphResponse, string>({
      query: (userType: string) => ({
        url: `${USERS_ADMIN_DASHBOARD_CONSTANT.getCompanyGraph(userType)}`,
        method: "get",
      }),
    }),
  }),
});

// Export hooks for tWhe endpoints
export const {
  useGetSummaryQuery,
  useGetGraphRevenueAdminQuery,
  useGetCompanyGraphQuery,
} = adminDashboardApiSlice;

export default adminDashboardApiSlice;
