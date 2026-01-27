import * as yup from "yup";

export const CreateValidationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Company name must be at least 2 characters")
    .required("Company name is required"),

  website: yup
    .string()
    .url("Please enter a valid URL")
    .required("Website URL is required"),

  companySize: yup
    .string()
    .oneOf(
      ["10+", "50+", "100+"],
      "Company size must be one of: 10+, 50+, 100+"
    )
    .required("Company size is required"),

  companyType: yup
    .string()
    .oneOf(
      [
        "Sole proprietorship",
        "Private Limited",
        "Corporation",
        "Partnership",
        "LLC",
      ],
      "Company type must be one of: Company type must be one of: Sole proprietorship,Private Limited,Corporation,Partnership,LLC"
    )
    .required("Company type is required"),

  description: yup // Fixed typo here
    .string()
    .min(10, "About must be at least 10 characters")
    .required("About is required"),

  location: yup
    .string()
    .min(2, "Location must be at least 2 characters")
    .required("Location is required"),

  agreement: yup
    .boolean()
    .oneOf([true], "You must accept the agreement")
    .required("Agreement is required"),
  imageUrl: yup.string().url("Please enter a valid URL").notRequired(),
  logoUrl: yup.string().url("Please enter a valid URL").notRequired(),
});

// Define the type for form values
export type FormValues = yup.InferType<typeof CreateValidationSchema>;
