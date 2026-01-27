export const AGENCY_PROFILE_API_CONSTANT = {
    profile: "/agencies",
    updatedProfile: (agencyId: string) => `/agencies/${agencyId}`,
    jobGraphStats: (agencyId: string, interval: "weekly" | "monthly") =>
      `/agencies/job-stats/${agencyId}?period=${interval}`,
    agencyStats: (agencyId: string) => `/agencies/agency-stats/${agencyId}`,
  };
  