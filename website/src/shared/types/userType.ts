import { UserType } from "../enum/user-type";
import { TAgency } from "./AgencyType";
import { TApplicant } from "./applicantType";
import { TCompany } from "./companyType";

export type TUsers = {
  id: string;
  email: string;
  roleId: string;
  type: UserType;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type TLoginUserType = {
  accessToken: string;
  user: TUsers & { userType: TApplicant | TCompany | TAgency  };
};
