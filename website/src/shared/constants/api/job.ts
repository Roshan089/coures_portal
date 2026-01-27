export const JOB_PREFIX = "jobs";
export const JOBS_API_CONSTANT = {
  getJobsList: `/${JOB_PREFIX}`,
  getCompanyAllApplication: (companyId: string) =>
    `/${JOB_PREFIX}/company/${companyId}/applications`,
  createJob: `/${JOB_PREFIX}`,
  getJobById: (jobId: string | null) => `/${JOB_PREFIX}/${jobId}`,
  deleteJob: (jobId: string) => `/${JOB_PREFIX}/${jobId}`,
  getJobStatsById: (companyId: string) =>
    `${JOB_PREFIX}/company/${companyId}/stats`,
  getJobByCompanyId: (companyId: string) =>
    `${JOB_PREFIX}/company/${companyId}`,
 
  getJobByAgencyId: (agencyId: string) =>
    `/${JOB_PREFIX}/user/${agencyId}`,
  getJobGraphAgency: (agencyId: string, period: string) =>
      `/agencies/job-graph/${agencyId}?period=${period}`,
  //http://localhost:8080/api/agencies/job-graph/cc7cd256-edc2-4c88-b8af-3d1f48c27111?period=monthly
};
