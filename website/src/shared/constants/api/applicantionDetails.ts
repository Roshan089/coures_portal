export const APPLICATIONS_PREFIX = "applications";
export const EXPERIENCE_PREFIX = "applicant-experience";
export const APPLICATION_API_CONSTANT = {
  getApplicationDetails: (JobId: string) =>
    `/${APPLICATIONS_PREFIX}/job/${JobId}`,
  getApplicantExperience: (applicantId: string) =>
    `/${EXPERIENCE_PREFIX}/${applicantId}`,
  getApplications: (applicantId: string, status: string) =>
    `/applications/applicant/${applicantId}?filter=${encodeURIComponent(
      JSON.stringify({ status: status })
    )}`,
  patchApplicationStatus: (jobId: string, applicantId: string) =>
    `/${APPLICATIONS_PREFIX}/status/jobId/${jobId}/applicantId/${applicantId}`,
  postApplicationSaveStatus: (jobId: string, applicantId: string) =>
    `/${APPLICATIONS_PREFIX}/save/jobId/${jobId}/applicantId/${applicantId}`,
  getSavedApplications: (applicantId: string) =>
    `/applications/saved/applicant/${applicantId}`,
  patchSavedApplications: (jobId: string, applicantId: string) =>
    `/applications/saved/status/jobId/${jobId}/applicantId/${applicantId}`,
};
