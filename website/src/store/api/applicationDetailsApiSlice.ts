import { APPLICATION_API_CONSTANT } from "@/shared/constants/api/applicantionDetails";

import { apiSlice } from "./apiSlice";
import { patch } from "@mui/material";

export const applicationDetailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getApplicationDetails: builder.query({
      query: (jobId) => ({
        url: `${APPLICATION_API_CONSTANT.getApplicationDetails(jobId)}`,
        method: "GET",
      }),
    }),
    getPendingApplications: builder.query({
      query: (data: { applicantId: string; status: string }) => ({
        url: APPLICATION_API_CONSTANT.getApplications(
          data.applicantId,
          data.status
        ),
        method: "GET",
      }),
    }),
    patchApplicationStatus: builder.mutation({
      query: (data: {
        jobId: string;
        applicantId: string;
        status: string;
      }) => ({
        url: APPLICATION_API_CONSTANT.patchApplicationStatus(
          data.jobId,
          data.applicantId
        ),
        method: "PATCH",
        body: { status: data.status },
      }),
    }),
    postApplicationSaveStatus: builder.mutation({
      query: (data: { jobId: string; applicantId: string }) => ({
        url: APPLICATION_API_CONSTANT.postApplicationSaveStatus(
          data.jobId,
          data.applicantId
        ),
        method: "POST",
      }),
    }),
    getSavedApplications: builder.query({
      query: (data: { applicantId: string }) => ({
        url: APPLICATION_API_CONSTANT.getSavedApplications(data.applicantId),
        method: "GET",
      }),
    }),
    patchSavedApplications: builder.mutation({
      query: (data: {
        jobId: string;
        applicantId: string;
        applicantAction: string;
      }) => ({
        url: APPLICATION_API_CONSTANT.patchSavedApplications(
          data.jobId,
          data.applicantId
        ),
        method: "PATCH",
        body: { applicantAction: data.applicantAction },
      }),
    }),
  }),
});

// Export hooks for both queries
export const {
  usePostApplicationSaveStatusMutation,
  useGetApplicationDetailsQuery,
  useGetPendingApplicationsQuery,
  usePatchApplicationStatusMutation,
  useGetSavedApplicationsQuery,
  usePatchSavedApplicationsMutation,
} = applicationDetailsApiSlice;

export default applicationDetailsApiSlice;
