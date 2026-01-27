import { adminCompany, companySummary } from "@/shared/types/Admin";
import { apiSlice } from "./apiSlice";
import { USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT } from "@/shared/constants/api/adminDashboard";
export const adminDashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSummaryCompany: builder.query<companySummary, void>({
      query: () => ({
        url: `${USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT.getAllSummary}`,
        method: "get",
      }),
    }),
    getDetailsCompany: builder.query<adminCompany[], void>({
      query: () => ({
        url: `${USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT.getAllCompanyDetails}`,
        method: "get",
      }),
    }),
    getSortedRevenueCompany: builder.query<adminCompany[], void>({
      query: () => ({
        url: `${USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT.getAllSortedRevenueCompany}`,
        method: "get",
      }),
    }),
    getGraphRevenueCompany: builder.query<any, string>({
      query: (period: string) => ({
        url: `${USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT.getAllGraphRevenueCompany(
          period
        )}`,
        method: "get",
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useGetSummaryCompanyQuery,
  useGetDetailsCompanyQuery,
  useGetSortedRevenueCompanyQuery,
  useGetGraphRevenueCompanyQuery,
} = adminDashboardApiSlice;

export default adminDashboardApiSlice;
