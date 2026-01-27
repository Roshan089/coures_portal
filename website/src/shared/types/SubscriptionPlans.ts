type BillingCycle = "monthly" | "yearly";

interface CompanyFeatures {
  price: number;
  max_users: number;
  max_jobs: number | "unlimited";
}

interface RecruitmentAgencyFeatures {
  price: number;
  max_users: number;
  max_companies: number;
  max_jobs: number | "unlimited";
}

interface ApplicantFeatures {
  price: number;
  max_applications: number;
}

interface Features {
  RecruitmentAgency: RecruitmentAgencyFeatures;
  Company: CompanyFeatures;
  Applicant: ApplicantFeatures;
}

export type SubscriptionPlan = {
  price: number;
  id: string;
  bundleName: string;
  bundleDescription: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  features: Features;
  annualDiscount: number;
  isCustom: boolean;
  isActive: boolean;
};

export type ApplicantPlan = {
  id: string;
  bundleName: string;
  bundleDescription: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  price: number;
  maxApplications: number;
  annualDiscount: string;
};

export type CompanyPlan = {
  id: string;
  bundleName: string;
  bundleDescription: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  price: number;
  maxJobs: number;
  maxUsers: number;
  annualDiscount: string;
};

export interface CompanyPlanResponse {
  id: string;
  bundleName: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  features: CompanyFeatures;
}

export interface RecruitmentAgencyPlanResponse {
  id: string;
  bundleName: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  features: RecruitmentAgencyFeatures;
}

export interface ApplicantPlanResponse {
  id: string;
  bundleName: string;
  billingCycle: BillingCycle;
  bundleStartDate: string;
  features: ApplicantFeatures;
}
