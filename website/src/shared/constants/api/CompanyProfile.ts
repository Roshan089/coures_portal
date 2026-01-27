export const COMPANY_PROFILE_API_CONSTANT = {
  profile: "/companies",
  updatedProfile: (companyId: string) => `/companies/${companyId}`,
  jobGraphStats: (companyId: string, interval: "weekly" | "monthly") =>
    `/companies/job-stats/${companyId}?period=${interval}`,
  jobPostings: (companyId: string) => `/companies/company/profile-stats/${companyId}`,
};
