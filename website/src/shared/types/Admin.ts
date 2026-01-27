export interface companySummary {
  totalCompanies?: number;
  totalJobs?: number;
  totalDistinctCities?: number;
  totalRevenue?: string | number;
}
export type adminCompany = {
  id: string;
  name: string;
  userId: string;
  jobCount: number;
  companyRevenue: number;
};
