export const APPLICANT_ADMIN_PREFIX = "admin-applicant";
export const APPLICANT_ADMIN_DASHBOARD_CONSTANT = {
  getStats: `/${APPLICANT_ADMIN_PREFIX}/stats`,
  getRevenueGraph: (interval: string) =>
    `/${APPLICANT_ADMIN_PREFIX}/user-revenue/applicants?period=${interval}`,
  getDistinctCities: `/${APPLICANT_ADMIN_PREFIX}/cities-revenue`,
  getApplicantDetailRevenue: `/${APPLICANT_ADMIN_PREFIX}/detail-revenue`,
};
