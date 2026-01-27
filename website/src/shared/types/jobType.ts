import { TApplication } from "./applicationType";
import { TCompany } from "./companyType";

export type TJobs = {
  application: TApplication[]; // Change this to an array of TApplication
  id: string;
  title: string;
  companyId: string;
  minSalary: number;
  maxSalary: number;
  state: string;
  city: string;
  country: string;
  jobType: string;
  workLevel: string;
  description: string;
  minExperience: number;
  maxExperience: number;
  status: string;
  company?: Partial<TCompany>; // Company is still optional and can have partial fields
  skillsRequired: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
