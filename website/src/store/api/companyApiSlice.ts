import { COMPANY_PROFILE_API_CONSTANT } from "@/shared/constants/api/CompanyProfile";
import { ABOUT_API_CONSTANT } from "@/shared/constants/api/clientAbout";
import { apiSlice } from "./apiSlice";

export const companyAboutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyProfile: builder.query({
      query: (companyId: string) => ({
        url: `${ABOUT_API_CONSTANT.getCompanyProfile(companyId)}`,
        method: "GET",
      }),
    }),
    getClients: builder.query({
      query: (userId: string) => ({
        url: `${ABOUT_API_CONSTANT.getClients(userId)}`,
        method: "GET",
      }),
    }),
    submitCompanyProfile: builder.mutation({
      query: (formData) => ({
        url: `${COMPANY_PROFILE_API_CONSTANT.profile}`,
        method: "POST",
        body: formData,
      }),
    }),
    updateCompanyProfile: builder.mutation({
      query: ({ companyId, updatedData }) => ({
        url: `${COMPANY_PROFILE_API_CONSTANT.updatedProfile(companyId)}`,
        method: "PATCH",
        body: updatedData,
      }),
    }),
    getGraphJobStats: builder.query({
      query: ({
        interval,
        companyId,
      }: {
        interval: "weekly" | "monthly";
        companyId: string;
      }) => ({
        url: `${COMPANY_PROFILE_API_CONSTANT.jobGraphStats(companyId, interval)}`,
        method: "GET",
      }),
    }),
    getJobPostings: builder.query({
      query: (companyId: string) => ({
        url: `${COMPANY_PROFILE_API_CONSTANT.jobPostings(companyId)}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for the endpoints
export const {
  useGetCompanyProfileQuery,
  useSubmitCompanyProfileMutation,
  useUpdateCompanyProfileMutation,
  useGetGraphJobStatsQuery,
  useGetClientsQuery,
  useGetJobPostingsQuery,
} = companyAboutApiSlice;

export default companyAboutApiSlice;
