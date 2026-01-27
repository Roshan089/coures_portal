import { AGENCY_PROFILE_API_CONSTANT } from "@/shared/constants/api/agencyProfile";
import { ABOUT_API_CONSTANT } from "@/shared/constants/api/clientAbout";
import { apiSlice } from "./apiSlice";

export const agencyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgencyProfile: builder.query({
      query: (agencyId: string) => ({
    url: `${ABOUT_API_CONSTANT.getAgencyProfile(agencyId)}`,
        method: "GET",
      }),
    }),
    submitAgencyProfile: builder.mutation({
      query: (formData) => ({
        url: `${AGENCY_PROFILE_API_CONSTANT.profile}`,
        method: "POST",
        body: formData,
      }),
    }),
    updateAgencyProfile: builder.mutation({
      query: ({ agencyId, updatedData }) => ({
        url: `${AGENCY_PROFILE_API_CONSTANT.updatedProfile(agencyId)}`,
        method: "PATCH",
        body: updatedData,
      }),
    }),
    getGraphJobStats: builder.query({
      query: ({
        interval,
        agencyId,
      }: {
        interval: "weekly" | "monthly";
        agencyId: string;
      }) => ({
        url: `${AGENCY_PROFILE_API_CONSTANT.jobGraphStats(agencyId, interval)}`,
        method: "GET",
      }),
    }),
    getAgencyStats: builder.query({
      query: (agencyId: string) => ({
        url: `${AGENCY_PROFILE_API_CONSTANT.agencyStats(agencyId)}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true, // <-- Add this line
});

// Export hooks for the endpoints
export const {
  useGetAgencyProfileQuery,
  useSubmitAgencyProfileMutation,
  useUpdateAgencyProfileMutation,
  useGetGraphJobStatsQuery,
  useGetAgencyStatsQuery,
} = agencyApiSlice;

export default agencyApiSlice;
