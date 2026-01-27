import { TApplicant } from "./applicantType";
import { TApplication } from "./applicationType";

export type TJobApplication = TApplication & { applicant: TApplicant };
