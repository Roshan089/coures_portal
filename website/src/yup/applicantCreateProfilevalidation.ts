import * as yup from "yup";

// Define the yup validation schema for Job Experience
const jobExperienceSchema = yup.object({
  title: yup.string().required("Job Role is required"),
  employmentType: yup.string().required("Employment Type is required"),
  company: yup.string().required("Company is required"),
  description: yup.string().required("Description is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  startDate: yup.string().required("Start Date is required"),
  isCurrentRole: yup.boolean().default(false),
  endDate: yup.string().when('isCurrentRole', {
    is: true,
    then: (schema) => schema.optional(),
    otherwise: (schema) => schema.required("End Date is required")
  }),
});

// Define the yup validation schema for ProfileForm
export const profileSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  currentRole: yup.string().required("Current Role is required"),
  biography: yup.string().required("Biography is required"),
  country: yup.string().default("IN").required("country is required"),
  state: yup.string().required("Location is required"),
  city: yup.string().required("Location is required"),
  experiences: yup.array().of(jobExperienceSchema).optional(),
});

// Generate TypeScript types from the validation schema
export type ProfileData = yup.InferType<typeof profileSchema>;
export type JobExperience = yup.InferType<typeof jobExperienceSchema>;
