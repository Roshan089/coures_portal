export const ABOUT_API_CONSTANT = {
  getCompanyProfile: (companyId: string) => `/companies/${companyId}`,
  getAgencyProfile: (agencyId: string) => `/agencies/${agencyId}`,
  getClients: (userId: string) => `/companies/agency/${userId}`,
};
