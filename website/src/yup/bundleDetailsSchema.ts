import * as yup from "yup";
import { SubscriptionPlan } from "@/shared/types/SubscriptionPlans";

export const bundleDetailsSchema = yup.object().shape({
  bundleName: yup.string().required("Bundle name is required"),
  bundleDescription: yup.string().required("Description is required"),
  billingCycle: yup
    .string()
    .oneOf(["monthly", "yearly"] as const, "Invalid billing cycle")
    .required("Billing cycle is required"),
  bundleStartDate: yup.string().required("Start date is required"),
  features: yup.object({
    RecruitmentAgency: yup.object({
      price: yup
        .number()
        .required("Price is required")
        .min(1, "Price must be positive"),
      max_users: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max users is required"),
      max_companies: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max companies is required"),
      max_jobs: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max jobs is required"),
    }),
    Company: yup.object({
      price: yup
        .number()
        .required("Price is required")
        .min(1, "Price must be positive"),
      max_users: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max users is required"),
      max_jobs: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max jobs is required"),
    }),
    Applicant: yup.object({
      price: yup
        .number()
        .required("Price is required")
        .min(1, "Price must be positive"),
      max_applications: yup
        .mixed()
        .transform((value) =>
          value === "unlimited" ? "unlimited" : Number(value)
        )
        .required("Max applications is required"),
    }),
  }),
  annualDiscount: yup.number().default(0).min(0, "Discount cannot be negative"),
  isCustom: yup.boolean().default(true),
  isActive: yup.boolean().default(true),
});

export type BundleDetailsFormValues = SubscriptionPlan;
