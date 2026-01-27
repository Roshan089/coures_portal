export const USERS_ADMIN_DASHBOARD_CONSTANT = {
  admin: "/admin",
  getAllDetails: "/admin-dashboard/summary",
  getCompanyGraph: (userType: string) =>
    `/admin-dashboard/companies-stats?userType=${userType}`,
  // getUserById: (id: string) => `/users/${id}`,
  // getUserById: (id: string) => `/users/${id}`,
  getAllGraphRevenueAdmin: (period: string) =>
    `/admin-dashboard/revenue-graph?interval=${period}`,
};
export const USERS_ADMIN_COMPANY_DASHBOARD_CONSTANT = {
  admin: "/admin",
  getAllSummary: "/admin-company/stats",
  // getUserById: (id: string) => `/users/${id}`,
  getAllCompanyDetails: "/admin-company/detail-revenue",
  getAllSortedRevenueCompany: "/admin-company/sorted-revenue",
  getAllGraphRevenueCompany: (period: string) =>
    `/admin-company/graph-revenue?interval=${period}`,
};
