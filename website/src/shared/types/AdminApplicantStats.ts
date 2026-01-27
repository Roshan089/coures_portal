export type TStatsValue = {
  totalApplicant: number;
  totalApplication: number;
  totalDistinctCities: number;
  totalRevenue: string;
};

export type TDistinctCities = {
  city: string;
  total_amount: string;
};

export type TDistinctCitiesRevenue = {
  totalCitiesRevenue: TDistinctCities[][];
};

export type TApplicantDetailRevenue = {
  totalCompanies: TApplicantRevenue[];
};

export type TApplicantRevenue = {
  id: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  userId: string;
  plan: string;
  applicantRevenue: number;
};
