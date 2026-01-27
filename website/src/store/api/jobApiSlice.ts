import { JOBS_API_CONSTANT } from "@/shared/constants/api/job";
import { apiSlice } from "./apiSlice";
import { TJobs } from "@/shared/types/jobType";
import { TApplicant } from "@/shared/types/applicantType";
import { StatsCardValues } from "@/shared/types/CompanyDashboardStats";

export type TCompanyAllApplication = TJobs & { applicants: TApplicant | [] };
export type TTCompanyAllApplicationCompanyId = string;
export type CardValues = StatsCardValues;

export type JobsListQueryParams = {
  query?: {
    filter?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  };
};

// Add this interface for the paginated response
interface PaginatedResponse<T> {
  rows: T[];
  count: number;
}

export type JobsByCompanyQueryParams = {
  companyId: string;
  query?: {
    filter?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  };
};

export type JobsByAgencyQueryParams = {
  agencyId: string;
  query?: {
    filter?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  };
};

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createJobDetails: builder.mutation({
      query: (jobDetails) => ({
        url: `${JOBS_API_CONSTANT.createJob}`,
        method: "POST",
        body: jobDetails,
      }),
      invalidatesTags: ["Jobs"]
    }),
    getCompanyAllApplications: builder.query<
      TCompanyAllApplication,
      TTCompanyAllApplicationCompanyId
    >({
      query: (companyId) => ({
        url: `${JOBS_API_CONSTANT.getCompanyAllApplication(companyId)}`,
        method: "GET",
      }),
    }),
    getJobById: builder.query<TJobs, string | null>({
      query: (jobId) => ({
        url: `${JOBS_API_CONSTANT.getJobById(jobId)}`,
        method: "GET",
      }),
    }),
    getJobStatsById: builder.query<CardValues, string>({
      query: (companyId) => ({
        url: `${JOBS_API_CONSTANT.getJobStatsById(companyId)}`,
        method: "GET",
      }),
    }),
    getJobByCompanyId: builder.query<PaginatedResponse<TJobs>, JobsByCompanyQueryParams>({
      query: ({ companyId, query }) => ({
        url: `${JOBS_API_CONSTANT.getJobByCompanyId(companyId)}`,
        method: "GET",
        params: query,
      }),
      providesTags: ["Jobs"],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (jobId) => ({
        url: JOBS_API_CONSTANT.deleteJob(jobId),
        method: "DELETE",
      }),
    }),
    getJobsList: builder.query<
      PaginatedResponse<TJobs>,
      JobsListQueryParams | void
    >({
      query: (params) => ({
        url: `${JOBS_API_CONSTANT.getJobsList}`,
        method: "GET",
        params: params?.query,
      }),
    }),
    getJobByAgencyId: builder.query<PaginatedResponse<TJobs>, JobsByAgencyQueryParams>({
      query: ({ agencyId, query }) => ({
        url: `${JOBS_API_CONSTANT.getJobByAgencyId(agencyId)}`,
        method: "GET",
        params: query,
      }),
    }),
    getAgencyJobGraph: builder.query<any, { agencyId: string, period: string }>({
      query: ({ agencyId, period }) => ({
        url: `${JOBS_API_CONSTANT.getJobGraphAgency(agencyId, period)}`,
        method: "GET",
      }),
    }),
    
  }),
});

export const {
  useCreateJobDetailsMutation,
  useGetCompanyAllApplicationsQuery,
  useGetJobByIdQuery,
  useDeleteJobMutation,
  useGetJobStatsByIdQuery,
  useGetJobsListQuery,
  useGetJobByCompanyIdQuery,
  useGetJobByAgencyIdQuery,
  useGetAgencyJobGraphQuery,
  } = jobApiSlice;

export default jobApiSlice;
