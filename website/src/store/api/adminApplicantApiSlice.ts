import {
  TApplicantDetailRevenue,
  TDistinctCities,
  TStatsValue,
  TDistinctCitiesRevenue,
} from "@/shared/types/AdminApplicantStats";
import { apiSlice } from "./apiSlice";
import { APPLICANT_ADMIN_DASHBOARD_CONSTANT } from "@/shared/constants/api/adminApplicant";

export const adminApplicantApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStats: builder.query<TStatsValue, void>({
      query: () => ({
        url: `${APPLICANT_ADMIN_DASHBOARD_CONSTANT.getStats}`,
        method: "GET",
      }),
    }),
    getRevenueGraph: builder.query({
      query: (interval: string) => ({
        url: `${APPLICANT_ADMIN_DASHBOARD_CONSTANT.getRevenueGraph(interval)}`,
      }),
    }),
    getDistinctCities: builder.query<TDistinctCitiesRevenue, void>({
      query: () => ({
        url: `${APPLICANT_ADMIN_DASHBOARD_CONSTANT.getDistinctCities}`,
        method: "GET",
      }),
    }),
    getApplicantDetailRevenue: builder.query<TApplicantDetailRevenue, void>({
      query: () => ({
        url: `${APPLICANT_ADMIN_DASHBOARD_CONSTANT.getApplicantDetailRevenue}`,
        method: "GET",
      }),
    }),
  }),
});
export const {
  useGetStatsQuery,
  useGetRevenueGraphQuery,
  useGetDistinctCitiesQuery,
  useGetApplicantDetailRevenueQuery,
  } = adminApplicantApiSlice;
export default adminApplicantApiSlice;
