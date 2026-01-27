import { UserType } from "../enum/user-type";

export type TSignUp = {
  email: string;
  roleId?: string;
  password: string;
  type: UserType;
};
