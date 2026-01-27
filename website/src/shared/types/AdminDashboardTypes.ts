export type PlanWiseRevenue = {
  bundleName: string;
  totalAmount: number;
  percentage: string;
};

export type CompanyGraphResponse = {
  totalAmount: number;
  planWiseRevenue: PlanWiseRevenue[];
};
