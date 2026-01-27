export const APPLICANT_PREFIX = "applicant";
export const APPLICANT_PROFILE_API_CONSTANT = {
  profile: `/${APPLICANT_PREFIX}`,
  getIndividualApplicant: (applicantId: string) =>
    `/${APPLICANT_PREFIX}/${applicantId}`,
  updatedApplicantProfile: (applicantId: string) => `/applicant/${applicantId}`,
};
